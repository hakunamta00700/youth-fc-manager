#!/usr/bin/env python3
"""
claim_issue.py — Claim an issue for agent processing.

Usage:
  python3 scripts/agent-orchestrator/claim_issue.py <issue_number> [--agent "Agent Name"]

Adds agent-claimed + agent-working labels, sets project status to Agent Working,
and posts a claim comment.
"""
import json
import subprocess
import sys
import os
from datetime import datetime, timezone

REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load config
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.example.json")
with open(CONFIG_PATH) as f:
    CONFIG = json.load(f)


def gh(*args: str, text_mode=False) -> str:
    """Run gh CLI."""
    result = subprocess.run(
        ["gh", *args],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    if result.returncode != 0:
        print(f"gh error: {result.stderr}", file=sys.stderr)
        return ""
    return result.stdout.strip()


def gh_json(*args: str) -> dict:
    """Run gh CLI and return JSON."""
    out = gh(*args)
    if not out:
        return {}
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return {}


def get_project_item_id(issue_number: int) -> str:
    """Get the Project item ID for an issue."""
    out = gh("project", "item-list", str(CONFIG["project_number"]),
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


def set_project_status(item_id: str, status_name: str) -> bool:
    """Set the Status field on a project item via GraphQL."""
    option_id = CONFIG["status_option_ids"].get(status_name)
    if not option_id:
        print(f"Unknown status: {status_name}", file=sys.stderr)
        return False

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
    
    result = gh_json("api", "graphql", "-f", f"query={query}")
    return "clientMutationId" in str(result)


def add_label(issue_number: int, label: str) -> bool:
    """Add a label to an issue."""
    out = gh("issue", "edit", str(issue_number), "--add-label", label)
    return "already has" not in out or out == ""


def remove_label(issue_number: int, label: str) -> bool:
    """Remove a label from an issue."""
    out = gh("issue", "edit", str(issue_number), "--remove-label", label)
    return True


def post_comment(issue_number: int, body: str) -> bool:
    """Post a comment on an issue."""
    # Write body to temp file to avoid shell escaping issues
    import tempfile
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
        f.write(body)
        tmp_path = f.name
    try:
        out = gh("issue", "comment", str(issue_number), "--body-file", tmp_path)
        os.unlink(tmp_path)
        return bool(out)
    except Exception:
        os.unlink(tmp_path)
        return False


def claim_issue(issue_number: int, agent_name: str = "Feature Development Agent") -> dict:
    """Claim an issue for agent processing."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    
    # Step 1: Add labels
    add_label(issue_number, "agent-claimed")
    add_label(issue_number, "agent-working")
    
    # Step 2: Set project status
    item_id = get_project_item_id(issue_number)
    status_ok = False
    if item_id:
        status_ok = set_project_status(item_id, "Agent Working")
    
    # Step 3: Post claim comment
    claim_body = f"""## 🤖 Agent Claim Notice

**Issue:** #{issue_number}
**Claimed By:** Hermes Orchestrator
**Assigned Agent:** {agent_name}
**Started At:** {now}

**Plan:** This issue has been claimed for processing. A subagent will analyze the requirements, implement the changes in a feature branch, and create a Pull Request.

### ⚙️ Status
- Labels: `agent-claimed` ✅, `agent-working` ✅
- Project Status: Agent Working {"✅" if status_ok else "❌"}
"""
    post_comment(issue_number, claim_body)
    
    return {
        "issue_number": issue_number,
        "claimed": True,
        "agent": agent_name,
        "status_updated": status_ok,
        "timestamp": now
    }


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Claim an issue for agent processing")
    parser.add_argument("issue_number", type=int, help="Issue number to claim")
    parser.add_argument("--agent", default="Feature Development Agent", help="Agent name")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    result = claim_issue(args.issue_number, args.agent)
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"✅ Issue #{args.issue_number} claimed by {args.agent}")
        print(f"   Labels: agent-claimed, agent-working")
        print(f"   Project Status: Agent Working {'✅' if result['status_updated'] else '❌'}")


if __name__ == "__main__":
    main()
