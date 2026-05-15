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
  - **Flat screenshot folders** — `source/tabs-header.png`, `source/comm-channels-tab.png`, `destination/tabs-header.png`, `destination/comm-channels-tab.png`, `diff/tabs-header-diff.png`, `diff/comm-channels-tab-diff.png` (plus the optional `_full-page.png` set if enabled).
  - **One per-section folder** for every captured section — `sections/tabs-header/` and `sections/comm-channels-tab/`. Each contains:
    - `SOURCE.png`
    - `DESTINATION.png`
    - `DIFF.png`
    - `SCREENSHOT_REPORT.md`
    - `SCREENSHOT_DATA.json`
    - `SEMANTIC_MISMATCHES.md`
    - `FALCON_COMPONENT_REPAIR_MAP.md`
  - **Run-level reports** — `FALCON_EYES_REPORT.md`, `FALCON_EYES_DATA.json`, `SEMANTIC_MISMATCH_BACKLOG.md`, `SECTION_SCORECARD.md`, `FALCON_COMPONENT_REPAIR_MAP.md`, `ALL_SCREENSHOTS_INDEX.md`, `ALL_SCREENSHOTS_SUMMARY_REPORT.md`.
  - **Run metadata** — `metadata/run.json`, `metadata/pixelmatch.json`.

### Reporting contract

Every Falcon Eyes run MUST produce:

1. One report per screenshot section (`sections/<section-name>/SCREENSHOT_REPORT.md`).
2. One combined run summary (`ALL_SCREENSHOTS_SUMMARY_REPORT.md`).
3. One screenshot index (`ALL_SCREENSHOTS_INDEX.md`).
4. One run-level semantic mismatch backlog (`SEMANTIC_MISMATCH_BACKLOG.md`).
5. One run-level Falcon component repair map (`FALCON_COMPONENT_REPAIR_MAP.md`).

The pixel-layer pieces (paths, viewports, mismatch %, severity counters, status defaults) are produced by the tool. The semantic pieces (Falcon component involvement, Tailwind/token issues, dynamic API gaps, missing shared-component capabilities, repair recommendations, finalized severity) are filled in by Claude using the Falcon Eyes skill — see `domains/frontend/falcon-eyes/SKILL.md`.

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
