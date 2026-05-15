*** Falcon Eyes — Installation Validation Example ***
*** Path: tools/falcon-eyes/example-run.md ***
*** Created: 2026-05-15 ***

# Installation Validation Example

> This is a **reference** — installation does NOT execute Falcon Eyes. The example is here so a future task can verify the install works end-to-end.

## Prerequisites

1. Both source and destination servers are running locally.
2. Tool dependencies are installed:

   ```powershell
   cd "C:\Falcon\Brain SK\tools\falcon-eyes"
   npm install
   npx playwright install chromium
   ```

3. The Falcon Eyes report root exists (created automatically on first run):

   ```text
   C:\Falcon\Brain Outputs\reports\falcon-eyes\
   ```

## Validation run — two sections only

Run Falcon Eyes against the default source / destination but limit to two sections (fastest sanity check):

```powershell
cd "C:\Falcon\Brain SK\tools\falcon-eyes"
npx tsx capture-and-compare.ts --only tabs-header,comm-channels-tab
```

### Expected behavior

- A new dated folder appears at `C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\`.
- The folder contains:
  - `source/_full-page.png`, `source/tabs-header.png`, `source/comm-channels-tab.png`
  - `destination/_full-page.png`, `destination/tabs-header.png`, `destination/comm-channels-tab.png`
  - `diff/tabs-header.diff.png`, `diff/comm-channels-tab.diff.png`
  - `metadata/run.json`, `metadata/pixelmatch.json`
  - `FALCON_EYES_REPORT.md`, `FALCON_EYES_DATA.json`
  - `SEMANTIC_MISMATCH_BACKLOG.md`, `SECTION_SCORECARD.md`, `FALCON_COMPONENT_REPAIR_MAP.md`

### Default source / destination

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

### Full Organization Hierarchy run (NOT executed during install)

When ready for the full Night Shift run:

```powershell
cd "C:\Falcon\Brain SK\tools\falcon-eyes"
npx tsx capture-and-compare.ts
```

This captures every section listed in `section-capture.config.json` and produces the complete report.

## What this validation does NOT do

- Does **not** repair the UI.
- Does **not** modify any source file in `C:\Falcon\Falcon\falcon-web-platform-ui`.
- Does **not** classify mismatches semantically — that step is owned by the Falcon Eyes skill (Claude reads the screenshots and fills `SEMANTIC_MISMATCH_BACKLOG.md`).

## Standing rule

When visual parity is below **90 %**, or when Ammar asks why source and destination screenshots differ, Brain SK MUST run Falcon Eyes (or one of its aliases) BEFORE suggesting any UI fix.

## See also

- `../../domains/frontend/falcon-eyes/SKILL.md`
- `../../domains/frontend/visual-difference-qa/SKILL.md`
- `../../domains/frontend/visual-parity/SKILL.md`
- `./semantic-mismatch-template.md`
- `../../_obsidian/FALCON_EYES_INDEX.md`
- `../../_obsidian/VISUAL_QA_INDEX.md`
