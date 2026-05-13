*** /scan-components — Incremental Falcon component knowledge scan ***
*** Implemented by domains/frontend/component-knowledge/incremental-scan/SKILL.md ***

# /scan-components

Run the Brain SK incremental component scan against the active Falcon workspace.

## What it does

1. Enumerates every component under `outputs/understanding/frontend/components/`.
2. For each component, probes source files in `C:\Falcon\Falcon\falcon-web-platform-ui`, runs `git log -1` for each, computes md5 checksums.
3. Applies the scan-decision equation (see the SKILL.md). Skips unchanged components; flags changed/missing-knowledge components for re-scan.
4. Refreshes edit-tracking telemetry for ALL components (even skipped ones), so `lastEditedBy` / `lastEditedAt` / `lastEditedCommitHash` stay current.
5. Writes:
   - `outputs/understanding/frontend/_scan-state/component-scan-metadata.json`
   - `outputs/understanding/frontend/_scan-state/FRONTEND_COMPONENT_SCAN_RUN.md` (appended)
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/COMPONENT_SCAN_REPORT.md`
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/COMPONENT_SCAN_REPORT.pdf` (if PDF toolchain available)
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/COMPONENT_SCAN_DATA.json`
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/COMPONENT_EDIT_HISTORY_TABLE.md`
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/COMPONENT_SCAN_SUMMARY.csv`
6. Appends Obsidian links additively (FRONTEND_INDEX, FALCON_COMPONENT_INDEX).
7. Additive mirror to `C:\Falcon\Brain SK\outputs` (never `/MIR`).
8. Commits + pushes to `https://github.com/ammarmaher/brain` with `feat(frontend): incremental component scan <RUN_STAMP>`.

## How to run

```bash
node "C:/Falcon/Brain SK/scripts/incremental-scan/run-scan.mjs"
```

Optional flags:

| Flag | Effect |
|---|---|
| `--force-rescan` | Override the skip equation; treat every component as needing a fresh deep build |
| `--no-pdf` | Skip PDF rendering (markdown + JSON + CSV still produced) |
| `--no-sync` | Skip the mirror/commit/push step |

## What does NOT happen

- The script does not modify any source file in the Falcon workspace.
- The script does not delete or overwrite existing knowledge folders (writes are additive when scanning; deep-build per-component delegates to `domains/frontend/component-knowledge/SKILL.md`).
- The script does not touch Obsidian plugin data files (`_obsidian/.obsidian/`).

## See also

- `domains/frontend/component-knowledge/incremental-scan/SKILL.md` — full spec (metadata schema, scan-decision equation, timestamp format, edit-tracking method)
- `shared/git-sync/GIT_AUTO_SYNC_GOVERNANCE.md` — non-destructive sync rule
- `shared/obsidian-auto-link/OBSIDIAN_AUTO_LINK_PROTOCOL.md` — index update rules
