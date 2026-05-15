*** /falcon-eyes-norepair — Falcon Eyes report only, no repair ***

# /falcon-eyes-norepair

Alias for the natural phrase **"Run Falcon Eyes, no repair"**. Mode 4 of the [Learning-First Task Routing protocol](../../protocols/LEARNING_FIRST_TASK_ROUTING.md).

## Behaviour

1. Run Falcon Eyes against the configured source + destination URLs for the named page (default: the current page in context).
2. Capture per-section screenshots into `Brain Outputs/reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/` — `SOURCE.png`, `DESTINATION.png`, `DIFF.png`, plus per-section `SCREENSHOT_REPORT.md`, `SCREENSHOT_DATA.json`, `SEMANTIC_MISMATCHES.md`, `FALCON_COMPONENT_REPAIR_MAP.md`.
3. Produce the run-level reports: `ALL_SCREENSHOTS_INDEX.md`, `ALL_SCREENSHOTS_SUMMARY_REPORT.md`, `SEMANTIC_MISMATCH_BACKLOG.md`, `SECTION_SCORECARD.md`, `FALCON_COMPONENT_REPAIR_MAP.md`, `FALCON_EYES_REPORT.md`, `FALCON_EYES_DATA.json`.
4. Map every mismatch to the responsible Falcon component using the customization order (inputs → templates → slots → variants → upgrade → new component → wrapper → raw GAP).
5. Append a Light Learning event per page touched with `sourceType: screenshot`, `category: uiux`, `status: pending`.
6. Refresh Obsidian indexes additively (`FALCON_EYES_INDEX`, the page note in `10-Pages/`).

## What this command does NOT do

- Does NOT repair the UI. Repair is a separate explicit task.
- Does NOT mark any mismatch as approved or rejected — every mismatch is a `pending` candidate until Ammar speaks.
- Does NOT commit or push.

Companion command: [`/falcon-eyes-repair-scoped`](falcon-eyes-repair-scoped.md).

Skill: [`domains/frontend/falcon-eyes/SKILL.md`](../../domains/frontend/falcon-eyes/SKILL.md).
