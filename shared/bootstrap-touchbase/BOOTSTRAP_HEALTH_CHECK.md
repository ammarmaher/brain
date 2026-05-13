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

## Non-Destructive Output Sync Rule

Brain SK must never use destructive mirror sync for generated outputs.

Forbidden:

- `robocopy /MIR`
- `robocopy /PURGE`
- deleting destination output folders before copy
- any sync command that removes existing files from `C:\Falcon\Brain SK\outputs`

Required:

- Use additive sync only.
- Preserve existing templates, reports, registries, Obsidian indexes, and scan metadata.
- Copy only new/changed files from `C:\Falcon\Brain Outputs` to `C:\Falcon\Brain SK\outputs`.
- If cleanup is needed, ask Ammar first and list exactly what will be deleted.

Recommended Windows command:

```powershell
robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj
```

Stop condition:
If a command may delete files from the destination, do not run it.

This rule is also recorded in:

- [`CLAUDE.md` → Permanent Safety Rule: Additive Output Sync Only](../../CLAUDE.md)
- [`shared/git-sync/GIT_AUTO_SYNC_GOVERNANCE.md`](../git-sync/GIT_AUTO_SYNC_GOVERNANCE.md)

Health-check behavior: any bootstrap pass that uses destructive sync against `C:\Falcon\Brain SK\outputs` must report `BLOCKED` until the operator confirms restoration of any lost files.
