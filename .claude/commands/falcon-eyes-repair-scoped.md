*** /falcon-eyes-repair-scoped — Falcon Eyes + repair only one named scope ***

# /falcon-eyes-repair-scoped <section>

Alias for the natural phrase **"Run Falcon Eyes and repair only the <section>"** (examples: `the table`, `the tabs`, `the otp popup`). Mode 4 of the [Learning-First Task Routing protocol](../../protocols/LEARNING_FIRST_TASK_ROUTING.md) with scoped repair authorisation.

## Behaviour

1. Run `/falcon-eyes-norepair` first to produce the full report.
2. Read `FALCON_COMPONENT_REPAIR_MAP.md` for the named `<section>` only.
3. Apply repairs **strictly limited to that section** — no opportunistic edits, no broader refactors, no other sections.
4. Follow the customization order: inputs → templates → slots → variants → upgrade → new component → wrapper → raw GAP. Record the chosen step in the page's `COMPONENT_USAGE_DECISIONS.md`.
5. Re-run Falcon Eyes on the same section to confirm the visual delta narrowed.
6. Append a Light Learning event for every meaningful fix with `sourceType: correction`, `status: pending` (do not auto-approve).
7. Update Obsidian indexes additively.

## What this command does NOT do

- Does NOT repair anything outside `<section>`.
- Does NOT promote the fix to an approved pattern unless Ammar says `approve this pattern` or `this is the approved way`.
- Does NOT promote to global unless Ammar says `promote this globally`.
- Does NOT commit or push.

Repair-only-named-scope rule comes from the standing orchestrator-failure-modes learnings — see [`outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md`](../../outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md).

Companion command: [`/falcon-eyes-norepair`](falcon-eyes-norepair.md).

Skill: [`domains/frontend/falcon-eyes/SKILL.md`](../../domains/frontend/falcon-eyes/SKILL.md).
