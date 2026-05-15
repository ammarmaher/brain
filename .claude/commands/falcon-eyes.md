*** /falcon-eyes — semantic visual difference QA ***
*** Implemented by domains/frontend/falcon-eyes/SKILL.md ***

# /falcon-eyes

Run the Brain SK semantic visual difference QA pipeline against a source UI and a destination UI.

## What it does

1. Captures source + destination screenshots (full page + named sections).
2. Runs pixelmatch per section and writes diff PNGs.
3. Emits report templates under `C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\`:
   - `FALCON_EYES_REPORT.md`
   - `FALCON_EYES_DATA.json`
   - `SEMANTIC_MISMATCH_BACKLOG.md`
   - `SECTION_SCORECARD.md`
   - `FALCON_COMPONENT_REPAIR_MAP.md`
4. Falcon Eyes (the skill) reads the screenshots + Falcon component dossiers and fills the semantic templates: which Falcon component owns each mismatch, what input / template / slot / token / upgrade is needed, what file to change, what proof is required.
5. Produces a section scorecard and an overall visual parity percentage.
6. **STOPS** — repair is a separate explicit task.

## Default source / destination

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

Default sections cover the Organization Hierarchy tabs (`tabs-header`, `comm-channels-tab`, `apps-services-tab`, `org-info-panel`, `org-info-audit-mode`, `org-info-rule-status`, `org-info-permission-privilege`, `settings-tab-view-mode`, `settings-tab-edit-mode`, `settings-ip-management`, `settings-account-limitation`, `otp-popup`).

## How to run

```powershell
cd "C:\Falcon\Brain SK\tools\falcon-eyes"
npx tsx capture-and-compare.ts
```

Common flags:

| Flag | Effect |
|---|---|
| `--source <url>` | Override source URL |
| `--destination <url>` | Override destination URL |
| `--only <name,name>` | Restrict to specific named sections |
| `--out <path>` | Override the run output folder |
| `--no-pixelmatch` | Capture only, no diff |

## Aliases

These slash phrasings all route here:

- "run visual parity"
- "do a visual diff"
- "why does this not look like that"
- "Night Shift visual repair"
- "compare screenshots"

## Hard rules

- Falcon Eyes does **not** modify source files in `C:\Falcon\Falcon\falcon-web-platform-ui`.
- Falcon Eyes does **not** repair UI during a run.
- Use Falcon component-first customization order (inputs → template → slot → token → upgrade → new lib → wrapper → raw as GAP).
- Tailwind utilities + Falcon tokens only — no SCSS, no inline styles, no PrimeNG.
- Additive sync only when mirroring reports into the brain repo. Never `robocopy /MIR`.

## See also

- `domains/frontend/falcon-eyes/SKILL.md`
- `domains/frontend/visual-difference-qa/SKILL.md`
- `domains/frontend/visual-parity/SKILL.md`
- `tools/falcon-eyes/README.md`
- `tools/falcon-eyes/example-run.md`
- `_obsidian/FALCON_EYES_INDEX.md`
- `_obsidian/VISUAL_QA_INDEX.md`
