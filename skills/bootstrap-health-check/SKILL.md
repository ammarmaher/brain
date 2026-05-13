---
name: bootstrap-health-check
description: Verifies Brain SK startup readiness, repo/tool access, Obsidian health, branches, and missing context before routing to domain skills.
---

# Bootstrap Health Check Skill

Use this skill before initial bootstrap, major tasks, or when repo/tool context may be stale.

## Responsibilities

1. Verify brain repo access.
2. Verify frontend, backend, gateway, PRD, and wiki paths.
3. Verify Git, branches, status, and remotes.
4. Verify Obsidian vault health when configured.
5. Verify Node/npm for Angular work.
6. Verify .NET SDK for backend/API scan work.
7. Ask Ammar only for missing required context.
8. Produce a startup readiness report.
9. Route to Business, Frontend, Backend, or Full Stack only after readiness is clear.

## Output files

```text
shared/bootstrap-touchbase/STARTUP_READINESS_REPORT.md
reports/bootstrap-touchbase/<date>-health-check.md
_scan-state/bootstrap-health.json
```

## Rules

- Do not store or push secrets.
- If Obsidian is missing, warn and use Git Markdown when possible.
- If required repo path is missing, pause and ask Ammar for that path.
- If branch is unclear, ask one small question.
- If health passes, continue automatically.
