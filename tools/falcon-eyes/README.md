*** Falcon Eyes — Semantic Visual Difference QA Tool ***
*** Path: tools/falcon-eyes/README.md ***
*** Created: 2026-05-15 ***

# Falcon Eyes Tool

Isolated tool that powers the **Falcon Eyes** Brain SK skill.

The skill specification lives at:

```text
C:\Falcon\Brain SK\domains\frontend\falcon-eyes\SKILL.md
```

This `tools/falcon-eyes/` folder contains the runnable pieces — capture, diff, and report writers. The skill is the semantic layer; the tool is the mechanical layer.

## What the tool does

1. Captures a **source** screenshot from a URL (full page + named sections).
2. Captures a **destination** screenshot from a URL (full page + named sections).
3. Normalizes viewport, zoom, device scale, and wait state.
4. Compares each pair with **pixelmatch** and writes a diff PNG.
5. Emits machine-readable JSON + Markdown reports under:
   ```text
   C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\
   ```
6. Produces a **semantic mismatch backlog template** for Claude to fill in (`SEMANTIC_MISMATCH_BACKLOG.md`).
7. Produces a **section scorecard template** (`SECTION_SCORECARD.md`).
8. Produces a **Falcon component repair map template** (`FALCON_COMPONENT_REPAIR_MAP.md`).

The tool itself stops at the pixel + structure layer. The **Falcon Eyes skill** then asks Claude to fill the semantic templates by reading source / destination / diff screenshots and the relevant Falcon component dossiers under `Brain Outputs/understanding/frontend/components/<name>/`.

## Install

The tool is intentionally isolated. It MUST NOT add dependencies to the Falcon Angular workspace at `C:\Falcon\Falcon\falcon-web-platform-ui`.

```powershell
cd "C:\Falcon\Brain SK\tools\falcon-eyes"
npm install
npx playwright install chromium
```

Required dependencies (declared in `package.json`):

- `@playwright/test`
- `pixelmatch`
- `pngjs`
- `typescript`
- `tsx`

Optional (only if compatible on Windows):

- `odiff-bin`

## Run

```powershell
cd "C:\Falcon\Brain SK\tools\falcon-eyes"
npx tsx capture-and-compare.ts
```

By default this uses `falcon-eyes.config.json` and `section-capture.config.json`. Override either with:

```powershell
npx tsx capture-and-compare.ts --config ./falcon-eyes.config.json --sections ./section-capture.config.json
```

CLI flags:

| Flag | Effect |
|---|---|
| `--source <url>` | Override the source URL for this run |
| `--destination <url>` | Override the destination URL for this run |
| `--sections <path>` | Use a different sections config |
| `--only <name,name>` | Only run named sections (subset of the config) |
| `--out <path>` | Override the run output folder (default: `Brain Outputs/reports/falcon-eyes/<stamp>/`) |
| `--no-pixelmatch` | Capture only, no diff (useful when source is unreachable) |

The standalone `compare-images.ts` runner takes two PNGs and writes a diff PNG + JSON to a given folder. Use it when screenshots already exist on disk:

```powershell
npx tsx compare-images.ts --source ./tmp/a.png --destination ./tmp/b.png --out ./tmp/out
```

## Output layout

Falcon Eyes always generates **one report per screenshot section**, plus a combined run report and a run-level screenshot index.

```
reports/falcon-eyes/<YYYY-MM-DD-HHmm>/
├── source/
│   ├── _full-page.png
│   ├── tabs-header.png
│   ├── comm-channels-tab.png
│   └── ...
├── destination/
│   ├── _full-page.png
│   ├── tabs-header.png
│   ├── comm-channels-tab.png
│   └── ...
├── diff/
│   ├── _full-page-diff.png
│   ├── tabs-header-diff.png
│   ├── comm-channels-tab-diff.png
│   └── ...
├── sections/
│   ├── tabs-header/
│   │   ├── SOURCE.png
│   │   ├── DESTINATION.png
│   │   ├── DIFF.png
│   │   ├── SCREENSHOT_REPORT.md
│   │   ├── SCREENSHOT_DATA.json
│   │   ├── SEMANTIC_MISMATCHES.md
│   │   └── FALCON_COMPONENT_REPAIR_MAP.md
│   ├── comm-channels-tab/
│   │   └── (same seven files)
│   └── ...
├── metadata/
│   ├── run.json
│   └── pixelmatch.json
├── FALCON_EYES_REPORT.md
├── FALCON_EYES_DATA.json
├── SEMANTIC_MISMATCH_BACKLOG.md
├── SECTION_SCORECARD.md
├── FALCON_COMPONENT_REPAIR_MAP.md
├── ALL_SCREENSHOTS_INDEX.md
└── ALL_SCREENSHOTS_SUMMARY_REPORT.md
```

### Reporting contract — non-negotiable

Every Falcon Eyes run must produce:

1. One **per-section folder** under `sections/<section-name>/` with `SOURCE.png`, `DESTINATION.png`, `DIFF.png`, `SCREENSHOT_REPORT.md`, `SCREENSHOT_DATA.json`, `SEMANTIC_MISMATCHES.md`, `FALCON_COMPONENT_REPAIR_MAP.md`.
2. One **combined run report** at `ALL_SCREENSHOTS_SUMMARY_REPORT.md` (averages, sections < 90 %, < 60 %, top 10 mismatches, top Falcon components, top Tailwind/token issues, top missing dynamic APIs, recommended repair order, full section table).
3. One **screenshot index** at `ALL_SCREENSHOTS_INDEX.md` (every screenshot + per-section report linked).
4. One run-level **semantic mismatch backlog** at `SEMANTIC_MISMATCH_BACKLOG.md`.
5. One run-level **Falcon component repair map** at `FALCON_COMPONENT_REPAIR_MAP.md`.

The PNGs inside `sections/<section-name>/` are copies of the flat-folder canonicals so each section folder is self-contained.

## Default sources

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

Default sections live in `section-capture.config.json`.

## Hard rules

- Falcon Eyes does **not** modify any source file in `C:\Falcon\Falcon\falcon-web-platform-ui`.
- Falcon Eyes does **not** repair UI during a run. Repair is a separate explicit task.
- Reports are additive — never destructive.
- Never commit secrets, plugin data files, `node_modules`, `dist`, temp files, or Obsidian Copilot config.
- Use additive sync from `Brain Outputs/` → `Brain SK/outputs/`. Never `robocopy /MIR`.

## See also

- `../../domains/frontend/falcon-eyes/SKILL.md` — semantic skill specification
- `../../domains/frontend/visual-difference-qa/SKILL.md` — alias
- `../../domains/frontend/visual-parity/SKILL.md` — alias
- `./example-run.md` — installation validation example (do not run during install)
- `./semantic-mismatch-template.md` — single-mismatch Markdown skeleton
