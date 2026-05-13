*** Sync Orchestrator ***
*** Phase D — wraps prd-knowledge + wiki-knowledge skills, adds asset download + per-user folder ensure ***

# Sync Orchestrator

Top-level coordinator for the Falcon Brain knowledge refresh. Thin wrapper over the existing
`wiki-knowledge` and `prd-knowledge` brain-skills. Adds three things those skills do not own:

1. **Per-user PRD folder ensure** — creates `prd-knowledge/modules/users/<user-slug>/` when a PRD
   references an assignee/owner whose folder is missing.
2. **Asset download** — pulls `.xlsx`, `.pdf`, image links (jpg/jpeg/png/gif/webp) and other
   whitelisted assets noted in each module's `attachments.md` into `modules/<slug>/assets/`.
3. **Unified report** — single sync-report under `Brain/analysis/L0-summary/sync-report.md`.

This orchestrator does NOT own the Drive API call. That stays with `prd-knowledge`. This script
runs AFTER `prd-knowledge` has populated each module's `attachments.md` with download URLs.

## Trigger phrases

Any of the following triggers the full pipeline:

- `sync everything`
- `pull all PRDs and wiki`
- `night mode: sync`
- `update knowledge`

## Steps in order

The pipeline runs each step strictly in sequence. A failure at step (a) or (b) aborts the run
and writes the error into the sync report. Steps (c)–(d) operate over what already exists on
disk and are idempotent.

| # | Step | Owner | Output |
|---|---|---|---|
| a | Wiki sync | `wiki-knowledge` skill | `wiki-knowledge/topics/**`, `UPDATES.md` row |
| b | PRD sync | `prd-knowledge` skill | `prd-knowledge/modules/<slug>/{latest-prd,attachments,source-map}.*` |
| c | Per-user folder ensure | this orchestrator | `prd-knowledge/modules/users/<user-slug>/{latest-prd.md,.gitkeep}` (if created) |
| d | Asset download | this orchestrator (`scripts/sync-orchestrator.ps1`) | `prd-knowledge/modules/<slug>/assets/<original-filename>` |
| e | Summary report | this orchestrator | `Brain/analysis/L0-summary/sync-report.md` (atomic write) |

## Dependency chain

```
wiki-knowledge sync (step a)
        |
        v
prd-knowledge sync (step b)         <-- writes attachments.md per module
        |
        v
per-user folder ensure (step c)     <-- needs PRD assignee/owner field present
        |
        v
asset download (step d)             <-- needs attachments.md + user folders to exist
        |
        v
sync-report (step e)
```

PRD modules need user folders to exist before asset download fans out per-user assets.
The script enforces this by running step (c) before step (d).

## Rules referenced

- Per-user folder convention: see [per-user-folder-rules.md](./per-user-folder-rules.md).
- Asset download whitelist + overwrite policy: see [asset-download-rules.md](./asset-download-rules.md).
- Existing `prd-knowledge` "Asset OVERWRITE rule" — every sync ALWAYS overwrites assets.

## Hard boundaries

- This orchestrator NEVER edits files inside `brain-skills/business-skills/prd-knowledge/` or
  `brain-skills/business-skills/wiki-knowledge/` aside from the well-defined output paths the
  skills already own (`modules/<slug>/assets/**`, `modules/users/**`).
- No commits, no pushes, no service-code changes.
- The script is idempotent — re-running on the same state is safe.

## See also

- [per-user-folder-rules.md](./per-user-folder-rules.md)
- [asset-download-rules.md](./asset-download-rules.md)
- [README.md](./README.md)
- Script: `C:\falcon\Brain\scripts\sync-orchestrator.ps1`
- Report: `C:\falcon\Brain\analysis\L0-summary\sync-report.md`
