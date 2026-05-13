# Bootstrap Health Check

Run before initial bootstrap, major tasks, or when configuration is stale.

## Checks

| Check | Required? | Failure behavior |
|---|---:|---|
| Brain repo `https://github.com/ammarmaher/brain` | Yes | Ask for clone/path/access |
| Frontend repo | Required for Frontend/Full Stack | Ask for path/branch |
| Backend repo(s) | Required for Backend/Full Stack | Ask for path/branch |
| Gateway repo/config | Required for API integration | Ask for path/branch |
| PRD folder | Required for Business/Full Stack | Ask for path |
| Architecture wiki | Important | Warn if missing; continue only if task can proceed safely |
| Obsidian vault | Optional-important | Warn if missing/stale; use Git Markdown source |
| Git | Yes | Ask Ammar to install/authenticate |
| Node/npm | Frontend tasks | Ask to install/fix PATH |
| .NET SDK | Backend scan/build tasks | Ask to install/fix PATH |
| PDF/report tools | Report tasks | Generate Markdown fallback if PDF unavailable |

## Output

Write health result to:

```text
reports/bootstrap-touchbase/YYYY-MM-DD-health-check.md
_scan-state/bootstrap-health.json
```

## Status values

- `OK`: ready
- `WARN`: can continue with documented limitation
- `BLOCKED`: cannot continue without Ammar input
