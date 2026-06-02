#!/usr/bin/env python3
"""
scan_ready_issues.py — Scan GitHub for Ready for Agent issues.

Usage:
  python3 scripts/agent-orchestrator/scan_ready_issues.py [--limit N] [--json]

Outputs JSON list of issues that are ready for agent dispatch.
"""
import json
import subprocess
import sys
import os

REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def gh(*args: str) -> dict:
    """Run gh CLI and return parsed JSON."""
    result = subprocess.run(
        ["gh", *args],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    if result.returncode != 0:
        print(f"gh error: {result.stderr}", file=sys.stderr)
        return {}
    if not result.stdout.strip():
        return {}
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"_text": result.stdout.strip()}


def gh_text(*args: str) -> str:
    """Run gh CLI and return raw text."""
    result = subprocess.run(
        ["gh", *args],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return result.stdout.strip()


def get_ready_labels() -> list:
    """Return the labels that indicate readiness."""
    return ["ready-for-agent", "agent-ready"]


def get_exclude_labels() -> list:
    """Return labels that exclude an issue from automation."""
    return ["blocked", "needs-spec", "needs-human-decision", "risk-high",
            "agent-working", "agent-claimed"]


def get_priority_order() -> list:
    """Return priority labels in descending order."""
    return ["priority-p0", "priority-p1", "priority-p2", "priority-p3"]


def parse_issues(text_output: str) -> list:
    """Parse gh issue list text output into structured list."""
    issues = []
    for line in text_output.strip().split("\n"):
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) >= 4:
            issues.append({
                "number": int(parts[0]),
                "state": parts[1],
                "title": parts[2],
                "labels": [l.strip() for l in parts[3].split(",")],
                "updated_at": parts[4] if len(parts) > 4 else ""
            })
    return issues


def is_ready(issue: dict) -> bool:
    """Check if an issue is ready for agent dispatch."""
    labels = issue.get("labels", [])
    has_ready = any(r in labels for r in get_ready_labels())
    has_exclude = any(e in labels for e in get_exclude_labels())
    return has_ready and not has_exclude


def priority_score(issue: dict) -> int:
    """Return priority score (lower = higher priority)."""
    labels = issue.get("labels", [])
    for i, p in enumerate(get_priority_order()):
        if p in labels:
            return i
    return len(get_priority_order())  # lowest priority


def scan_issues(limit: int = 30) -> list:
    """Scan for open issues and return ready ones sorted by priority."""
    text = gh_text("issue", "list", "--state", "open", "--limit", str(limit),
                   "--json", "number,title,state,labels,updatedAt")
    try:
        all_issues = json.loads(text)
    except json.JSONDecodeError:
        print(f"Failed to parse: {text[:200]}", file=sys.stderr)
        return []

    ready_issues = []
    for issue in all_issues:
        labels = [l.get("name", "") for l in issue.get("labels", [])]
        issue["labels"] = labels
        
        if is_ready(issue):
            ready_issues.append(issue)

    # Sort by priority
    ready_issues.sort(key=lambda i: priority_score(i))
    return ready_issues


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Scan for Ready for Agent issues")
    parser.add_argument("--limit", type=int, default=30)
    parser.add_argument("--json", action="store_true", help="Output JSON only")
    args = parser.parse_args()

    issues = scan_issues(args.limit)

    if args.json:
        print(json.dumps(issues, indent=2))
    else:
        if not issues:
            print("No ready-for-agent issues found.")
            return
        print(f"Found {len(issues)} ready issue(s):\n")
        for i, issue in enumerate(issues, 1):
            priority = get_priority_order()[priority_score(issue)] if priority_score(issue) < 4 else "none"
            print(f"  {i}. #{issue['number']} [{priority}] {issue['title']}")
            print(f"     Labels: {', '.join(issue.get('labels', []))}")


if __name__ == "__main__":
    main()
