---
name: falcon-eyes
description: Falcon Eyes — Semantic Visual Difference QA Skill. Compare source-vs-destination screenshots, identify which Falcon component owns each mismatch, classify cause, and produce a repair plan that uses Falcon component inputs/templates/slots/tokens before raw code.
---

*** Brain SK Frontend — Falcon Eyes (Semantic Visual Difference QA) ***
*** Path: domains/frontend/falcon-eyes/SKILL.md ***
*** Created: 2026-05-15 ***

# Falcon Eyes — Semantic Visual Difference QA

> Claude can already take screenshots. Falcon Eyes is the **semantic understanding** layer on top of those screenshots.
>
> Falcon Eyes does not just say *"pixels are different."* It explains **what** is different, **why** it is different, **which Falcon component owns the mismatch**, and **what dynamic Falcon API / template / slot / token upgrade** is needed before any UI repair runs.

## Purpose

Help Brain SK reason about visual differences between a **source** (HTML / React reference UI) and a **destination** (Falcon Angular implementation) for:

- screenshot comparison
- visual difference analysis
- visual parity diagnosis
- source-vs-destination UI comparison
- screenshot understanding
- *"why this table does not look like that table"*
- visual repair planning
- Night Shift visual repair
- Organization Hierarchy tabs visual repair

Falcon Eyes runs **before** any UI fix is suggested. When visual parity is below 90 %, or when the user asks why source and destination screenshots differ, Brain SK MUST run Falcon Eyes first.

## Aliases

These skills route directly into Falcon Eyes (see their `SKILL.md` for the alias contract):

- `domains/frontend/visual-difference-qa/SKILL.md`
- `domains/frontend/visual-parity/SKILL.md`

## Tool

The runnable tool lives at:

```text
C:\Falcon\Brain SK\tools\falcon-eyes\
```

| File | Purpose |
|---|---|
| `README.md` | Tool overview, install, run instructions |
| `package.json` | Isolated npm package (Playwright, pixelmatch, pngjs, typescript, tsx) |
| `falcon-eyes.config.json` | Default source/destination URLs, viewport, wait state, output root |
| `section-capture.config.json` | Named-section selectors (tabs-header, comm-channels-tab, ...) |
| `capture-and-compare.ts` | End-to-end runner: capture → diff → write report |
| `compare-images.ts` | Standalone pixelmatch wrapper (PNG → PNG → diff PNG + JSON) |
| `semantic-mismatch-template.md` | Per-mismatch Markdown skeleton |
| `example-run.md` | Installation-validation example (NOT executed during install) |

**Isolation rule:** the tool's `package.json` is self-contained. It MUST NOT add dependencies to the Falcon Angular workspace at `C:\Falcon\Falcon\falcon-web-platform-ui`.

## Canonical paths

| Purpose | Path |
|---|---|
| Frontend workspace | `C:\Falcon\Falcon\falcon-web-platform-ui` |
| Canonical frontend knowledge | `C:\Falcon\Brain Outputs\understanding\frontend` |
| Per-component dossier | `C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\` |
| Organization Hierarchy page knowledge | `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy` |
| Falcon Eyes report root | `C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\` |
| Brain SK mirror | `C:\Falcon\Brain SK\outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\` |

## Default future source / destination

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

Default scope: **Organization Hierarchy tabs only**.

Default named sections:

- `tabs-header`
- `comm-channels-tab`
- `apps-services-tab`
- `org-info-panel`
- `org-info-audit-mode`
- `org-info-rule-status`
- `org-info-permission-privilege`
- `settings-tab-view-mode`
- `settings-tab-edit-mode`
- `settings-ip-management`
- `settings-account-limitation`
- `otp-popup`

## Required outputs (per run)

Falcon Eyes MUST generate a report for **every** screenshot pair it captures. The run folder always contains:

- one **per-section** folder (`sections/<section-name>/`) with its own screenshots, JSON, and Markdown reports
- one **combined** summary report covering every section
- one **screenshot index** listing every file
- one **semantic mismatch backlog**
- one **Falcon component repair map**

```
reports/falcon-eyes/<YYYY-MM-DD-HHmm>/
├── source/                              flat source screenshots, one per section
│   └── <section-name>.png
├── destination/                         flat destination screenshots, one per section
│   └── <section-name>.png
├── diff/                                flat diff screenshots, one per section
│   └── <section-name>-diff.png
├── sections/                            per-section sub-reports (one folder per section)
│   └── <section-name>/
│       ├── SOURCE.png
│       ├── DESTINATION.png
│       ├── DIFF.png
│       ├── SCREENSHOT_REPORT.md          per-section human report (this section only)
│       ├── SCREENSHOT_DATA.json          per-section machine record
│       ├── SEMANTIC_MISMATCHES.md        per-section mismatch backlog entry
│       └── FALCON_COMPONENT_REPAIR_MAP.md per-section Falcon component repair map
├── metadata/                            run metadata (viewport, urls, sha, timing)
├── FALCON_EYES_REPORT.md                top-level human report
├── FALCON_EYES_DATA.json                machine-readable mismatch data
├── SEMANTIC_MISMATCH_BACKLOG.md         every mismatch with id + cause + repair
├── SECTION_SCORECARD.md                 per-section visual parity %
├── FALCON_COMPONENT_REPAIR_MAP.md       run-level mismatch → Falcon component → repair
├── ALL_SCREENSHOTS_INDEX.md             every screenshot/report file with links
└── ALL_SCREENSHOTS_SUMMARY_REPORT.md    combined summary across every section
```

Naming rules:

- Flat folders (`source/`, `destination/`, `diff/`) keep the lowercased section name as the filename — `comm-channels-tab.png`, `comm-channels-tab-diff.png`.
- Per-section folders use **UPPERCASE** PNG filenames — `sections/comm-channels-tab/SOURCE.png`, `DESTINATION.png`, `DIFF.png`. The PNGs under `sections/` are copies of the canonical flat files so each section folder is self-contained.

### Per-section `SCREENSHOT_REPORT.md` (one per section)

Each per-section report MUST include:

- section name
- source screenshot path
- destination screenshot path
- diff screenshot path
- source URL
- destination URL
- capture timestamp
- viewport
- pixel mismatch %
- perceptual score (if available)
- visual parity score for this section
- semantic difference summary
- Falcon components involved
- Tailwind / token issues
- dynamic API issues
- missing shared component capabilities
- repair recommendations
- severity list — P0 / P1 / P2 / P3 counts
- status — `pass` / `needs repair` / `blocked` / `unknown`

The pixel layer (everything except *semantic difference summary*, *Falcon components involved*, *Tailwind/token issues*, *dynamic API issues*, *missing shared component capabilities*, *repair recommendations*, and *severity*) is produced by the tool. The semantic fields are filled by Claude using the Falcon Eyes skill.

### Run-level `ALL_SCREENSHOTS_INDEX.md`

Lists every screenshot file in the run with clickable links — source, destination, diff, per-section report, semantic mismatch file, component repair map:

| Section | Source | Destination | Diff | Report | Status |
|---|---|---|---|---|---|
| comm-channels-tab | source/comm-channels-tab.png | destination/comm-channels-tab.png | diff/comm-channels-tab-diff.png | sections/comm-channels-tab/SCREENSHOT_REPORT.md | needs repair |

### Run-level `ALL_SCREENSHOTS_SUMMARY_REPORT.md`

Combined report covering every section. MUST include:

- total screenshots captured
- total sections compared
- average visual parity %
- sections below 90 %
- sections below 60 %
- top 10 visual mismatches
- top Falcon components causing mismatch
- top Tailwind / token issues
- top missing dynamic APIs
- recommended repair order

Plus the combined section table:

| Section | Source Screenshot | Destination Screenshot | Diff Screenshot | Score | P0 | P1 | P2 | P3 | Status |
|---|---|---|---|---:|---:|---:|---:|---:|---|

## Skill process

1. Check source URL availability.
2. Check destination URL availability.
3. Normalize viewport, zoom, device scale, and wait state from `falcon-eyes.config.json`.
4. Capture source screenshots (full page + named sections).
5. Capture destination screenshots (full page + named sections).
6. Run pixelmatch comparison per section.
7. Generate diff images.
8. Compute mismatch percentage per section.
9. Hand source / destination / diff screenshots to Claude for **semantic analysis** (not just pixel analysis).
10. Build the semantic mismatch backlog (one entry per visible defect).
11. Classify each mismatch (category + severity).
12. Map each mismatch to a Falcon component (read its dossier under `understanding/frontend/components/<name>/`).
13. Map each mismatch to a Tailwind / token / component-config / template / slot / upgrade repair.
14. Produce a repair plan ordered by severity then by section.
15. **STOP** — do not repair automatically. Wait for a future prompt that explicitly asks for repair.

## For every mismatch, Falcon Eyes must answer

1. **What** is different?
2. **Where** is it different? (section, coordinates if available)
3. Which **Falcon component** owns this area?
4. Is the issue caused by:
   - wrong Falcon component usage
   - missing input / config
   - missing `ng-template`
   - missing slot / content projection
   - missing Tailwind / token
   - missing shared-component capability
   - feature-specific implementation issue
5. Can it be fixed by **existing** Falcon component API?
6. Does the Falcon component need a **reusable upgrade**?
7. What **exact repair** should be done?
8. Which **file / component** likely needs the change?
9. What **test or screenshot** proves the fix?

## Table example — required behavior

When the source table and destination table do not match, Falcon Eyes must identify table-level issues:

- table header mismatch
- row height mismatch
- cell padding mismatch
- column alignment mismatch
- action column mismatch
- toggle / dropdown / input cell mismatch
- border / radius / shadow / color / token mismatch
- missing Falcon Data Table dynamic template capability
- wrong Falcon component usage
- missing shared Falcon component upgrade

Then inspect:

- Falcon Data Table API (`understanding/frontend/components/falcon-table/API.md`)
- Falcon Data Table usage (`USAGE.md`)
- Falcon table tokens (`TOKENS.md`)
- table density / spacing tokens
- table header / body classes
- cell templates / row action templates
- custom `ng-template` rendering
- table component gaps / upgrades (`GAPS_AND_UPGRADES.md`)

Example output row:

| Section | Source expected | Destination actual | Falcon component | Cause | Required repair | Severity |
|---|---|---|---|---|---|---|
| Comm Channels table header | Compact header with neutral surface | Header too tall, wrong surface | `falcon-table` | Token / density mismatch | Use table density / token config or upgrade density API | P1 |
| Toggle cell | Toggle centered in cell | Toggle misaligned | `falcon-table` + `falcon-toggle` | Cell template wrapper alignment | Fix `ng-template` wrapper with Tailwind token classes | P2 |
| Row actions | Actions right aligned | Actions misplaced | `falcon-table` | Missing action template / config | Add / use row action template slot / config | P1 |

## Difference categories

Classify each mismatch as one of:

`component structure` · `layout` · `spacing` · `alignment` · `typography` · `color/token` · `border/radius` · `shadow/elevation` · `row height` · `column width` · `table header style` · `table body style` · `cell rendering` · `action placement` · `hover state` · `active/selected state` · `validation state` · `missing component` · `wrong component` · `missing action` · `wrong data` · `wrong interaction` · `missing dynamic API` · `missing shared component upgrade` · `accessibility issue` · `unknown/source unclear`

## Severity

- **P0** — blocker
- **P1** — major visible mismatch
- **P2** — medium mismatch
- **P3** — polish mismatch

## Mismatch record (required fields)

Each mismatch in `FALCON_EYES_DATA.json` and `SEMANTIC_MISMATCH_BACKLOG.md` must include:

```yaml
mismatchId:              FE-<run>-<section>-<n>
section:                 tabs-header
sourceScreenshot:        source/tabs-header.png
destinationScreenshot:   destination/tabs-header.png
diffScreenshot:          diff/tabs-header.diff.png
expected:                "Compact header with neutral-100 surface, 40px row"
actual:                  "Header surface neutral-200, 56px row"
category:                "spacing"
severity:                "P1"
likelyCause:             "Token density mismatch"
relatedFalconComponent:  "falcon-table"
sourceExpectedBehavior:  "..."
destinationActualBehavior: "..."
requiredRepair:          "Use density='compact' input on falcon-table; bind --falcon-table-row-height to token"
tailwindOrTokenFix:      "py-2 → use --space-2; remove ad-hoc bg-neutral-200"
likelyFileToChange:      "apps/admin-console/.../comm-channels/comm-channels.html"
proofNeeded:             "diff/tabs-header.diff.png ≤ 2%"
status:                  "open"   # open | fixed | deferred | blocked
```

## Falcon component linking requirement

Every mismatch MUST be mapped to Falcon component knowledge.

Before recommending a fix, Falcon Eyes must read:

```text
C:\Falcon\Brain Outputs\understanding\frontend
```

And for the specific component:

```text
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\API.md
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\USAGE.md
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\TOKENS.md
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\GAPS_AND_UPGRADES.md
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>\DECISION.md
```

### Component-first rules

- Use Falcon custom components **first**.
- Buttons → `falcon-button`.
- Tables → `falcon-table` / Falcon Data Table.
- Inputs → `falcon-input`.
- Dropdowns → `falcon-dropdown` / `falcon-multi-select` / `falcon-combobox`.
- Tabs → `falcon-tabs`.
- Dialogs / popups → `falcon-dialog` / `falcon-popup` / `falcon-confirm-dialog`.
- Uploaders → `falcon-uploader`.
- Toggles / switches → `falcon-toggle` / `falcon-switch`.
- Checkboxes → `falcon-checkbox` / `falcon-checkbox-group`.
- Status labels → `falcon-status-badge` / `falcon-badge` / `falcon-tag`.

Do **not** create raw HTML replacements for existing Falcon components.

## Dynamic customization rule (order of preference)

When a mismatch requires customization, try in this exact order:

1. Existing Falcon component **inputs / config**
2. Existing Falcon **ng-template** support
3. Existing Falcon **slots / content projection**
4. Existing Falcon **Tailwind / token variants**
5. **Shared Falcon component upgrade** (add a new input, slot, or template)
6. **New reusable Falcon component** in the Falcon component library
7. **Feature-local wrapper** only if truly page-specific
8. **Raw implementation** only as last resort and documented as a GAP

Examples:

- Table custom cells → Falcon Data Table `ng-template` cell templates
- Toggle inside table → cell template renders `falcon-toggle` / `falcon-switch`
- Row actions → Falcon Data Table action template / config
- Tabs header actions → Falcon Tabs left / right / header action slot
- Dashed button → `falcon-button` dashed variant / config
- OTP popup → `falcon-dialog` / `falcon-popup` footer slot
- IP chips → `falcon-badge` / `falcon-tag` / `falcon-chip` (create reusable if missing)
- Confirmation → `falcon-confirm-dialog` / `falcon-popup`
- Status display → `falcon-status-badge` / `falcon-tag` / `falcon-badge`

## Tailwind / token rule

Any repair recommendation MUST use:

- Tailwind utilities
- Falcon Tailwind tokens
- Falcon component tokens
- existing token files

Forbidden:

- custom CSS / SCSS for new page styling
- inline styles
- hardcoded colors
- hardcoded spacing
- hardcoded border radius
- hardcoded shadows
- PrimeNG
- PrimeIcons

If a token is missing: recommend the closest existing token **or** propose adding a reusable token in the correct token file. Document the token addition in `FALCON_COMPONENT_REPAIR_MAP.md`.

## Scoring rule

Generate area-by-area semantic visual scores:

- tabs header %
- comm channels tab %
- apps / services tab %
- org info panel %
- settings tab %
- OTP popup %
- IP management %
- table custom cells %
- validation visual states %
- interaction behavior %

Overall visual parity:

- Average of completed section scores.
- Any **P0** caps total at **70 %**.
- Any **P1** caps affected section at **75 %**.
- Any **untested required section** stays below **60 %**.

Targets for future repair:

- Minimum acceptable: **90 %**
- Ideal: **95 %**

Do **not** inflate scores without screenshot evidence.

## Hard rules

- Falcon component-first, dynamic-customization order strict.
- Tailwind utilities + Falcon tokens only — no SCSS, no inline styles, no PrimeNG, no PrimeIcons.
- Falcon Eyes never modifies source files in `C:\Falcon\Falcon\falcon-web-platform-ui` automatically.
- Falcon Eyes never repairs UI during the analysis run. Repair requires a separate explicit prompt.
- Active source for component knowledge is `C:\Falcon\Brain Outputs\understanding\frontend` — legacy paths under `Brain Outputs\component-registry` and `Brain Outputs\frontend-understanding` are archival only.
- Additive sync only (no `robocopy /MIR`).
- Never commit secrets, plugin data files, `node_modules`, `dist`, temp files, or Obsidian Copilot config.
- Reports always include screenshot evidence; scores without proof are invalid.

## Routing triggers

Brain SK MUST run Falcon Eyes automatically when the user asks for any of:

- screenshot comparison
- visual difference analysis
- visual parity diagnosis
- source-vs-destination UI comparison
- screenshot understanding
- *"why this table does not look like that table"*
- visual repair planning
- Night Shift visual repair
- Organization Hierarchy tabs visual repair

Also run Falcon Eyes whenever visual parity is reported below 90 % for any page.

## Installation validation

A throwaway validation example is documented at:

```text
C:\Falcon\Brain SK\tools\falcon-eyes\example-run.md
```

The example shows how to later run Falcon Eyes with the default source / destination and two sections (`tabs-header`, `comm-channels-tab`). **It is NOT executed during installation.**

## See also

- `domains/frontend/visual-difference-qa/SKILL.md` — alias entry point
- `domains/frontend/visual-parity/SKILL.md` — alias entry point
- `domains/frontend/component-knowledge/SKILL.md` — Falcon component knowledge sub-domain
- `skills/screenshot-to-angular/SKILL.md` — screenshot-as-truth workflow
- `shared/git-sync/GIT_AUTO_SYNC_GOVERNANCE.md` — non-destructive sync rule
- `shared/obsidian-auto-link/OBSIDIAN_AUTO_LINK_PROTOCOL.md` — index update rules
- `_obsidian/FALCON_EYES_INDEX.md` — Obsidian hub
- `_obsidian/VISUAL_QA_INDEX.md` — visual QA index
