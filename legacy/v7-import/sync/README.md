*** Brain Sync Index ***
*** Phase D — PRD / wiki / asset sync orchestrator ***

# Brain Sync — Index

This folder is the spec for the Falcon Brain sync orchestrator. It does NOT host any
production code. The script lives at `C:\falcon\Brain\scripts\sync-orchestrator.ps1` per
project convention.

## Files

| File | What it covers |
|---|---|
| [SYNC-ORCHESTRATOR.md](./SYNC-ORCHESTRATOR.md) | Top-level doc: trigger phrases, ordered steps, dependency chain. |
| [per-user-folder-rules.md](./per-user-folder-rules.md) | Convention + creation policy for `prd-knowledge/modules/users/<user-slug>/`. |
| [asset-download-rules.md](./asset-download-rules.md) | Allowed extensions, origin whitelist, overwrite policy, log format. |
| [README.md](./README.md) | This file. |

## Related artifacts (outside this folder)

| Path | Role |
|---|---|
| `C:\falcon\Brain\scripts\sync-orchestrator.ps1` | The PowerShell 5.1 implementation. |
| `C:\falcon\Brain\analysis\L0-summary\sync-report.md` | Atomic-written report (steps c, d, e). |
| `C:\falcon\brain-skills\business-skills\prd-knowledge\` | Owner of step (b). Hands off URLs via `attachments.md`. |
| `C:\falcon\brain-skills\business-skills\wiki-knowledge\` | Owner of step (a). |

## Trigger phrases (one of)

`sync everything` — `pull all PRDs and wiki` — `night mode: sync` — `update knowledge`

## Boundary

- Strictly inside `Brain/sync/`, `Brain/scripts/sync-orchestrator.ps1`, and
  `Brain/analysis/L0-summary/sync-report.md`.
- The two source skills (`prd-knowledge`, `wiki-knowledge`) are read-only from this side.
- No commits, no pushes, no service-code edits, no Drive API calls.
