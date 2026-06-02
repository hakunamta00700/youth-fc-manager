#!/usr/bin/env python3
"""
dispatch_agent.py — Determine which subagent type to dispatch for an issue.

Usage:
  python3 scripts/agent-orchestrator/dispatch_agent.py <issue_number> [--json]

Outputs the recommended agent type and dispatch context for the issue.
This does NOT call delegate_task — that must be done from the Hermes session.
"""
import json
import subprocess
import sys
import os

REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def gh_text(*args: str) -> str:
    result = subprocess.run(
        ["gh", *args], capture_output=True, text=True, cwd=REPO_DIR
    )
    return result.stdout.strip()


def get_issue_details(issue_number: int) -> dict:
    """Get full issue details including labels, body, title."""
    out = gh_text("issue", "view", str(issue_number),
                  "--json", "number,title,body,state,labels,createdAt,updatedAt")
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return {}


def determine_agent_type(labels: list) -> str:
    """Determine which agent type should handle this issue."""
    label_names = [l.get("name", "") if isinstance(l, dict) else l for l in labels]
    
    if "bug" in label_names:
        return "Bug Fix Agent"
    elif "test" in label_names or "needs-qa" in label_names:
        return "QA Agent"
    elif "docs" in label_names:
        return "Documentation Agent"
    elif "feature" in label_names or "enhancement" in label_names:
        return "Feature Development Agent"
    elif "refactor" in label_names:
        return "Refactoring Agent"
    elif "infra" in label_names:
        return "Infrastructure Agent"
    elif "chore" in label_names:
        return "Maintenance Agent"
    else:
        return "Feature Development Agent"


def get_branch_name(issue_number: int, title: str, agent_type: str) -> str:
    """Generate a branch name from issue info."""
    prefix = agent_type.lower().split()[0]
    # Clean title for branch name
    clean = "".join(c if c.isalnum() or c in "-_" else "-" for c in title.lower())
    clean = "-".join(filter(None, clean.split("-")))
    # Truncate to 40 chars
    clean = clean[:40].strip("-")
    return f"{prefix}/issue-{issue_number}-{clean}"


def get_agent_prompt(issue: dict, agent_type: str) -> str:
    """Generate the task prompt for the subagent."""
    issue_num = issue.get("number", "?")
    title = issue.get("title", "")
    body = issue.get("body", "")
    labels = [l.get("name", "") if isinstance(l, dict) else l for l in issue.get("labels", [])]

    # Check for high-risk categories
    has_high_risk = any(r in ["risk-high", "needs-human-decision"] for r in labels)
    
    # Determine if this is a "dangerous" change
    dangerous_keywords = ["db schema", "migration", "prisma", "schema", "auth", "password",
                          "permission", "role", "payment", "fee", "billing"]
    is_dangerous = any(kw in title.lower() or kw in body.lower() for kw in dangerous_keywords)

    instructions = f"""You are the {agent_type} for youth-fc-manager.

Task: Issue #{issue_num} — {title}

## Issue Description
{body[:2000] if body else "(No description provided)"}

## Repository Context
- Stack: Next.js 15 App Router, React 19, Prisma ORM, Turso/SQLite, Tailwind CSS v4
- Auth: Mock-based (src/lib/auth/), no real DB auth yet
- Tests: Playwright E2E, API route unit tests
- Run tests: cd /home/david/workspace/youth-fc-manager && npm test (or npm run test:e2e)

## Critical Rules (MUST FOLLOW)
1. Do NOT push directly to main/master branch.
2. Create a new branch for this work.
3. Branch name format: {get_branch_name(issue_num, title.split("] ")[-1] if "] " in title else title, agent_type)}
4. Stay strictly within the Issue scope — do NOT refactor unrelated code.
5. Add or update tests for your changes.
6. Run tests before committing: `npm test` or specific test file.
7. Create a PR when done with the PR template format.
8. PR must include "Closes #{issue_num}" in the body.
"""

    if is_dangerous:
        instructions += """
## ⚠️ WARNING: This appears to involve sensitive changes (schema/auth/payment).
- If this changes DB schema, auth, or permissions — STOP and flag for human review.
- Post a comment on the issue describing exactly what needs to change.
- Do NOT implement the change automatically.
"""

    if has_high_risk:
        instructions += """
## ⚠️ WARNING: This issue is marked as high risk or needs human decision.
- Do NOT implement code changes automatically.
- Instead, analyze the issue and comment with your implementation plan.
- Flag that human approval is needed before proceeding.
"""

    return instructions


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Determine agent dispatch for an issue")
    parser.add_argument("issue_number", type=int, help="Issue number")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    issue = get_issue_details(args.issue_number)
    if not issue:
        print(f"Error: Could not fetch issue #{args.issue_number}", file=sys.stderr)
        sys.exit(1)

    labels_raw = issue.get("labels", [])
    agent_type = determine_agent_type(labels_raw)
    title = issue.get("title", "")
    branch_name = get_branch_name(args.issue_number, 
                                   title.split("] ")[-1] if "] " in title else title,
                                   agent_type)
    prompt = get_agent_prompt(issue, agent_type)

    result = {
        "issue_number": args.issue_number,
        "title": issue.get("title"),
        "agent_type": agent_type,
        "branch": branch_name,
        "prompt": prompt,
        "state": issue.get("state"),
        "labels": [l.get("name", "") if isinstance(l, dict) else l for l in labels_raw]
    }

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"Issue #{args.issue_number}: {issue.get('title')}")
        print(f"Agent Type: {agent_type}")
        print(f"Branch: {branch_name}")
        print(f"\nPrompt length: {len(prompt)} chars")


if __name__ == "__main__":
    main()
