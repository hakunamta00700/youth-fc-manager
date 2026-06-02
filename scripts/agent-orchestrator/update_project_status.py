#!/usr/bin/env python3
"""
update_project_status.py — Update a project item's status field.

Usage:
  python3 scripts/agent-orchestrator/update_project_status.py <issue_number> <status_name>

Status options: Backlog, Needs Spec, Ready for Agent, Agent Working, Human Review,
                Ready for QA, QA Failed, Ready to Merge, Merged, Released, Blocked
"""
import json
import subprocess
import sys
import os

REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.example.json")

with open(CONFIG_PATH) as f:
    CONFIG = json.load(f)


def gh_text(*args: str) -> str:
    result = subprocess.run(
        ["gh", *args], capture_output=True, text=True, cwd=REPO_DIR
    )
    return result.stdout.strip()


def get_project_item_id(issue_number: int) -> str:
    """Get the Project item ID for an issue."""
    out = gh_text("project", "item-list", str(CONFIG["project_number"]),
                  "--owner", CONFIG["project_owner"],
                  "--limit", "50", "--format", "json")
    if not out:
        return ""
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return ""
    
    for item in data.get("items", []):
        content = item.get("content", {})
        if content and content.get("number") == issue_number:
            return item["id"]
    return ""


def set_project_status(item_id: str, status_name: str) -> dict:
    """Set the Status field on a project item via GraphQL."""
    option_id = CONFIG["status_option_ids"].get(status_name)
    if not option_id:
        return {"success": False, "error": f"Unknown status: {status_name}"}

    project_id = CONFIG["project_id"]
    field_id = CONFIG["status_field_id"]
    
    query = f'''mutation {{
        updateProjectV2ItemFieldValue(input: {{
            projectId: "{project_id}"
            itemId: "{item_id}"
            fieldId: "{field_id}"
            value: {{ singleSelectOptionId: "{option_id}" }}
        }}) {{ clientMutationId }}
    }}'''
    
    result = subprocess.run(
        ["gh", "api", "graphql", "-f", f"query={query}"],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return {
        "success": result.returncode == 0,
        "output": result.stdout.strip(),
        "error": result.stderr.strip() if result.returncode != 0 else ""
    }


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Update project status for an issue")
    parser.add_argument("issue_number", type=int, help="Issue number")
    parser.add_argument("status", help="New status name")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    valid_statuses = list(CONFIG["status_options"].values())
    if args.status not in valid_statuses:
        print(f"Invalid status. Valid options: {', '.join(valid_statuses)}", file=sys.stderr)
        sys.exit(1)

    item_id = get_project_item_id(args.issue_number)
    if not item_id:
        print(f"Error: Issue #{args.issue_number} not found in project", file=sys.stderr)
        sys.exit(1)

    result = set_project_status(item_id, args.status)
    result["issue_number"] = args.issue_number
    result["new_status"] = args.status

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        if result["success"]:
            print(f"✅ Issue #{args.issue_number} → Status: {args.status}")
        else:
            print(f"❌ Failed: {result.get('error', 'unknown error')}")


if __name__ == "__main__":
    main()
