*** Brain SK Frontend Component Incremental Scan Skill ***
*** Path: domains/frontend/component-knowledge/incremental-scan/SKILL.md ***
*** Created: 2026-05-13 ***

# Frontend Component Incremental Scan Skill

## 1. Purpose

Brain SK must NOT deeply re-scan every Falcon component every time a component-knowledge task runs. It must scan only components that are new, missing knowledge, or changed since the last scan. This skill defines the incremental-scan contract that wraps the deep-build pipeline (`domains/frontend/component-knowledge/SKILL.md`).

In addition to determining which components need a re-scan, this skill tracks per-component edit telemetry — last editor, last commit, last changed files, and whether the component's knowledge folder covers the latest source state.

Every scan run produces a versioned report folder + a PDF deliverable + a single source-of-truth metadata JSON.

## 2. When to use this skill

- Before any deep frontend component knowledge build.
- When Ammar says "scan components", "what changed since last scan", "do an incremental component scan", "check component knowledge freshness", or any equivalent.
- Triggered automatically by the slash command `/scan-components`.
- Triggered by any orchestrator that wants to verify component knowledge currency before recommending a Falcon component.

## 3. Canonical paths

| Purpose | Path |
|---|---|
| Active frontend source (the truth) | `C:\Falcon\Falcon\falcon-web-platform-ui` |
| Canonical knowledge output root | `C:\Falcon\Brain Outputs\understanding\frontend` |
| Per-component knowledge folder | `C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\` |
| Component scan metadata JSON | `C:\Falcon\Brain Outputs\understanding\frontend\_scan-state\component-scan-metadata.json` |
| Persistent scan-run markdown | `C:\Falcon\Brain Outputs\understanding\frontend\_scan-state\FRONTEND_COMPONENT_SCAN_RUN.md` |
| Per-run dated report folder | `C:\Falcon\Brain Outputs\reports\component-scans\<YYYY-MM-DD-HHmm>\` |
| Mirrored (post-sync) | `C:\Falcon\Brain SK\outputs\reports\component-scans\<YYYY-MM-DD-HHmm>\` |

Note: the per-component knowledge folder lives under `understanding/frontend/components/` in the canonical path declared by THIS skill. The existing seven-agent build also produced the same per-component folder set under `component-registry/components/`. The incremental-scan treats both folder paths as valid knowledge stores during the transition — when re-scanning a component, write to `understanding/frontend/components/<name>/` going forward (the canonical home).

Off-limits (NEVER scan as active truth): `deprecated-*`, `*-old`, `WebstormProjects\*`, `node_modules`, `dist`, `.angular`, `.nx`, `demos/` (mention only if explicitly relevant).

## 4. Required metadata per component

Every entry in `component-scan-metadata.json` must include all these fields. Missing fields = stale metadata = trigger re-scan.

```json
{
  "componentName": "falcon-input",
  "selector": "falcon-angular-input",
  "status": "scanned",
  "lastScannedAt": "2026-05-13T22:45:00+03:00",
  "lastSourceModifiedAt": "2026-05-12T09:14:22+03:00",
  "lastKnowledgeUpdatedAt": "2026-05-13T22:45:00+03:00",
  "lastEditedBy": "AmmarMK <ammar@example.com>",
  "lastEditedAt": "2026-05-12T09:14:22+03:00",
  "lastEditedSourceFile": "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx",
  "lastEditedCommitHash": "534323152a84b6dc4a3d7029f570397c14c183f8",
  "lastEditedBranch": "polishing-v0.4",
  "changedSinceLastScan": false,
  "changedFilesSinceLastScan": [],
  "changeSummary": "no changes since 2026-05-13T22:45:00+03:00",
  "sourceFiles": [
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx",
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.types.ts",
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.utils.ts",
    "libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx",
    "libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts",
    "libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.html",
    "libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/index.ts",
    "libs/falcon-ui-tokens/src/components/input.tokens.css",
    "libs/falcon-ui-core/src/tailwind/falcon-input.classes.ts"
  ],
  "sourceFileModifiedTimes": {
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx": "2026-05-12T09:14:22+03:00"
  },
  "sourceFileChecksums": {
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx": "md5:c4f1e9a0..."
  },
  "sourceFileLastGitAuthors": {
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx": "AmmarMK <ammar@example.com>"
  },
  "sourceFileLastGitCommitDates": {
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx": "2026-05-12T09:14:22+03:00"
  },
  "relatedTokenFiles": ["libs/falcon-ui-tokens/src/components/input.tokens.css"],
  "relatedWrapperFiles": [
    "libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts",
    "libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.html"
  ],
  "relatedStencilFiles": [
    "libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx",
    "libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx"
  ],
  "relatedTypeFiles": ["libs/falcon-ui-core/src/components/falcon-input/falcon-input.types.ts"],
  "relatedTailwindHelperFiles": ["libs/falcon-ui-core/src/tailwind/falcon-input.classes.ts"],
  "relatedUsageFiles": [
    "apps/host-shell/src/app/playground/playground.component.html",
    "apps/admin-console/src/app/features/.../client-information-step.component.html"
  ],
  "requiredKnowledgeFiles": [
    "OVERVIEW.md",
    "API.md",
    "USAGE.md",
    "TOKENS.md",
    "GAPS_AND_UPGRADES.md",
    "DECISION.md"
  ],
  "missingKnowledgeFiles": [],
  "scanReason": null,
  "skipReason": "no source changes since lastScannedAt; all required knowledge files present",
  "scanDurationMs": null,
  "lastScanCommitHash": "534323152a84b6dc4a3d7029f570397c14c183f8"
}
```

Status enum: `scanned` | `skipped` | `needs-scan` | `failed` | `missing-knowledge`.

## 5. How to detect last edited user / date / commit

For each source file that lives inside a git-tracked repo (here: the active Falcon repo at `C:\Falcon\Falcon\falcon-web-platform-ui`), use git:

```bash
git -C "C:/Falcon/Falcon/falcon-web-platform-ui" log -1 --format='%an <%ae>' -- "<relative-path>"
git -C "C:/Falcon/Falcon/falcon-web-platform-ui" log -1 --format='%aI'      -- "<relative-path>"
git -C "C:/Falcon/Falcon/falcon-web-platform-ui" log -1 --format='%H'       -- "<relative-path>"
git -C "C:/Falcon/Falcon/falcon-web-platform-ui" branch --show-current
```

Format keys:
- `%an <%ae>` → "Author Name <author@email>"
- `%aI` → strict-ISO 8601 author date (e.g. `2026-05-13T22:45:00+03:00`)
- `%H` → full commit hash

If the file is NOT tracked by git (untracked / local-only):
- Use filesystem modified time for `lastSourceModifiedAt` (`stat -c '%y'` on Unix, `(Get-Item).LastWriteTime` on PowerShell).
- Set `lastEditedBy` = `"UNKNOWN_NOT_IN_GIT"`.
- Set `lastEditedCommitHash` = `null`.
- Set `lastEditedBranch` = current branch from `git branch --show-current` (still applies — the file is not yet committed on a branch).
- Record the file as untracked/local-only in the scan report's "Untracked source files" section.

## 6. Scan decision equation

A component MUST be deeply re-scanned when ANY of these is true:

1. `lastScannedAt` is `null` (never scanned).
2. Metadata entry for the component is missing.
3. The component knowledge folder is missing.
4. ANY required knowledge file is missing: `OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`.
5. `lastSourceModifiedAt` is newer than `lastScannedAt`.
6. ANY source file checksum no longer matches the metadata.
7. ANY related token file (`libs/falcon-ui-tokens/src/components/<name>.tokens.css`) changed.
8. ANY related Angular wrapper file changed (`.ts`, `.html`, `.css`, `index.ts`).
9. ANY related Stencil Shadow or Light component (`<name>.tsx`, `<name>-tw.tsx`) changed.
10. ANY related type, utils, or Tailwind helper file changed.
11. ANY real-consumer usage file changed AND usage knowledge needs update.
12. Brain SK config / orchestrator passed `forceRescan: true`.

## 7. Skip equation

A component MUST be skipped when ALL of these are true:

1. `lastScannedAt` exists and is a valid ISO timestamp.
2. ALL source files have a modified time `≤` `lastScannedAt`.
3. ALL source checksums match the stored `sourceFileChecksums`.
4. ALL six required knowledge files exist in the component folder.
5. No `forceRescan` flag is set.

If skipped, the metadata is still REFRESHED — `lastEditedBy`, `lastEditedAt`, `lastEditedCommitHash`, `lastEditedBranch` are recomputed every run so the edit-tracking telemetry stays current even when the deep scan is bypassed.

## 8. Timestamp format

Strict ISO 8601 with date, time, and offset:

```
2026-05-13T22:45:00+03:00
```

Never store epoch seconds. Never store local date strings. Never store dates without timezone.

## 9. Workflow

Per scan run:

```
1. Resolve scan timestamp: TS_NOW = ISO now in local offset
   Run folder: C:\Falcon\Brain Outputs\reports\component-scans\<YYYY-MM-DD-HHmm>\
2. Load existing metadata JSON; if missing, treat as first run (all components → needs-scan).
3. Enumerate components from:
   - C:\Falcon\Brain Outputs\understanding\frontend\components\<name>\ (canonical) AND
   - C:\Falcon\Brain Outputs\component-registry\components\<name>\ (transitional)
   Plus the active source layout:
   - libs/falcon-ui-core/src/angular-wrapper/components/falcon-<name>/
   - libs/falcon/src/shared-ui/lib/components/<name>/
4. For each component:
   a. Resolve source-file set (existing files only; non-existent paths are skipped from the list).
   b. For each source file: git log %an,%aI,%H + filesystem mtime + md5 checksum.
   c. Compare against metadata. Apply scan decision equation.
   d. If scan: invoke domains/frontend/component-knowledge/SKILL.md deep-build for this single component, write to its knowledge folder, update metadata.
   e. If skip: update only the edit-tracking fields, set status=skipped, set skipReason.
   f. If failed: set status=failed, record the error in the run report's failures table.
5. Persist updated metadata to component-scan-metadata.json.
6. Append a run entry to FRONTEND_COMPONENT_SCAN_RUN.md.
7. Generate the dated report folder (see §10).
8. Render PDF via Node + md-to-pdf (see §11).
9. Append Obsidian links (see §12).
10. Mirror outputs to Brain SK/outputs additively (no /MIR).
11. Commit + push to https://github.com/ammarmaher/brain with the run's commit message.
```

## 10. Per-run report folder

Every scan run produces a folder at `C:\Falcon\Brain Outputs\reports\component-scans\<YYYY-MM-DD-HHmm>\` with:

| File | Content |
|---|---|
| `COMPONENT_SCAN_REPORT.md` | Master report (8 sections — see below) |
| `COMPONENT_SCAN_REPORT.pdf` | PDF rendering of the master report (if PDF tools available) |
| `COMPONENT_SCAN_DATA.json` | Per-component scan record snapshot |
| `COMPONENT_EDIT_HISTORY_TABLE.md` | Flat edit-history (component × last editor × date × commit) |
| `COMPONENT_SCAN_SUMMARY.csv` | Spreadsheet-friendly per-component status row |
| `charts/` | (optional) Bar / pie / histogram PNGs if a chart toolchain is available |

### Report sections (8)

1. **Scan summary** — started/finished, generator, frontend branch, frontend commit, Brain SK commit, totals (discovered / scanned / skipped / failed / missing-knowledge).
2. **Edit-tracking table** — every component: name, status, lastScannedAt, lastSourceModifiedAt, lastEditedBy, lastEditedAt, lastEditedSourceFile, changedSinceLastScan, scanReason or skipReason.
3. **Changed components table** — component, changed files, last editor, last edit date, change summary, action taken.
4. **Skipped components table** — component, last scanned, last source modified, skip reason, "proof" (checksum match).
5. **Missing knowledge table** — component, missing required files, next action.
6. **Component readiness statistics** — percentages (scan coverage / scanned this run / skipped unchanged / missing knowledge / changed / failed / metadata completeness / edit-tracking completeness).
7. **Charts** (if rendered) — scanned vs skipped vs failed; ready vs missing-knowledge; changed vs unchanged; top-N changed components; missing required-file types.
8. **Final decision** — is component knowledge current? safe-to-use vs require-re-scan vs require-upgrade lists; does the scan cover today's latest source state? yes/no with evidence.

## 11. PDF rendering

Preferred: `pdf-creator` skill at `C:/Users/User/.claude/skills/pdf-creator/`. Requires Python + weasyprint (which may not be installed).

Fallback (Node-based — works without Python): `npx --yes md-to-pdf` with the Falcon print theme CSS and the existing Chrome browser:

```bash
npx --yes md-to-pdf "<run-folder>/COMPONENT_SCAN_REPORT.md" \
  --stylesheet "C:/Falcon/reports/Falcon Component Reports Understanding/_pdf-theme.css" \
  --config-file "C:/Falcon/reports/Falcon Component Reports Understanding/_pdf-config.js"
```

If neither toolchain is available, write `COMPONENT_SCAN_REPORT.pdf.pending` next to the markdown and mark PDF as `pending` in the run summary. Never claim a PDF exists if it doesn't.

## 12. Obsidian linking

After every successful run:

1. Append to `C:\Falcon\Brain SK\_obsidian\FRONTEND_INDEX.md` under a "Latest scan run — `<YYYY-MM-DD-HHmm>`" section:
   - Link to `COMPONENT_SCAN_REPORT.md`
   - Link to `COMPONENT_SCAN_REPORT.pdf` (if exists)
   - Link to `COMPONENT_SCAN_DATA.json`
   - Link to `component-scan-metadata.json` (the master metadata)
2. Append to `C:\Falcon\Brain SK\_obsidian\FALCON_COMPONENT_INDEX.md`:
   - Link to the latest scan report next to the component-list intro
3. NEVER touch `_obsidian/.obsidian/` plugin data files or Obsidian secret stores (Copilot/autopilot keys live there).

## 13. Git sync

After the report folder + metadata are produced:

1. Additive mirror with robocopy (Windows):
   ```
   robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj
   ```
   `/XO` = additive (only newer); `/E` = include subdirs and empty dirs. **NEVER use `/MIR` / `/PURGE`.**
2. Stage specific paths only (no `git add .`):
   - `_obsidian/FRONTEND_INDEX.md`, `_obsidian/FALCON_COMPONENT_INDEX.md` (if modified)
   - `outputs/understanding/frontend/_scan-state/`
   - `outputs/reports/component-scans/<run-folder>/`
   - `outputs/understanding/frontend/components/<changed-component>/` (only the ones rescanned this run)
3. Pre-commit grep for credential patterns (api[_-]?key, sk-[a-z0-9]{20,}, AIza[a-z0-9]{20,}, bearer, password\s*[:=]\s*"[^"]{8,}). Fail if any match.
4. Commit message template:
   ```
   feat(frontend): incremental component scan <YYYY-MM-DD-HHmm>

   Scanned: N · Skipped: N · Missing-knowledge: N · Failed: N
   Falcon repo: <branch> @ <short-hash>
   ```
5. Push to `https://github.com/ammarmaher/brain` (default branch `main`).

## 14. Hard rules

- Active source (`C:\Falcon\Falcon\falcon-web-platform-ui`) is the only truth. Never read legacy / archive / old folders as active.
- Every scan report MUST include: last edited user · last edited date/time · changed files · scan status · scan reason · skip reason.
- Every scan run MUST refresh edit-tracking fields even for skipped components.
- Use additive sync only.
- Use the Write tool (UTF-8). Never PowerShell `Out-File` / `Set-Content` without `-Encoding utf8` (UTF-16 BOM trap).
- Never commit secrets, Obsidian plugin files, node_modules, dist, bin, obj, or temp files.
- Never claim a PDF was generated if the toolchain failed.
- Never overwrite the canonical metadata JSON without first reading the existing one.
- Component-knowledge folder writes go to `understanding/frontend/components/<name>/` (canonical); the existing `component-registry/components/` set may be left in place during the transition.

## 15. Commands

Slash command: `/scan-components` (defined at `.claude/commands/scan-components.md`).

Programmatic invocation (orchestrator-friendly):
```
brain.frontend.componentKnowledge.incrementalScan({
  forceRescan: false,
  scope: 'all' | ['falcon-input', 'falcon-table'],
  generatePdf: true,
  syncToBrainSk: true,
  commit: true,
  push: true
})
```

## 16. Done state

The scan run is "done" when:

- `component-scan-metadata.json` is updated with one record per discovered component.
- `FRONTEND_COMPONENT_SCAN_RUN.md` has a new entry at the top.
- The dated report folder contains `COMPONENT_SCAN_REPORT.md`, `COMPONENT_SCAN_DATA.json`, `COMPONENT_EDIT_HISTORY_TABLE.md`, `COMPONENT_SCAN_SUMMARY.csv`.
- `COMPONENT_SCAN_REPORT.pdf` exists OR `COMPONENT_SCAN_REPORT.pdf.pending` marker is present.
- Obsidian indexes are updated additively.
- Brain SK outputs mirror reflects all new files (additive sync).
- Git working tree clean, branch up-to-date with origin/main.

## 17. See also

- `domains/frontend/component-knowledge/SKILL.md` (the deep-build skill this wraps)
- `shared/git-sync/GIT_AUTO_SYNC_GOVERNANCE.md` (non-destructive sync rule)
- `shared/obsidian-auto-link/OBSIDIAN_AUTO_LINK_PROTOCOL.md` (vault rules)
- `config/brain.config.json` `incrementalScan` block (runtime config)
