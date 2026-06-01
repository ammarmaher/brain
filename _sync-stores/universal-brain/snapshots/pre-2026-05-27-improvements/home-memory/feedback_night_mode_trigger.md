---
name: feedback_night_mode_trigger
description: Night-mode trigger phrases load deferred jobs from C:\falcon\Brain\jobs\ and execute them autonomously per their pre-approved spec
type: feedback
originSessionId: d3af8013-16e8-4cfc-8f3e-ebdbdb861247
---
The user has a "night mode" / "fixing night" pattern: defer non-blocking work to a later batch run. When triggered, Adnan loads the job spec from `C:\falcon\Brain\jobs\<name>.md`, executes the **Execution checklist** section verbatim, and reports back.

**Why:** The user does not want to interrupt focused day work for medium-effort cleanup tasks. They batch them under a single trigger phrase to be run when they're free.

**How to apply:**

1. **Trigger phrases** — any of these from the user activates the night mode flow:
   - `fix all things night mode`
   - `night mode`
   - `fixing night`
   - `night fix`
   - `run night job: <name>`
   - `tonight, do the <name> job`
   - `do the night jobs`

2. **Trigger semantics:**
   - Generic ("fix all things night mode" / "do the night jobs") → list every `*.md` in `C:\falcon\Brain\jobs\` whose `Status:` is `DEFERRED`, then execute them in filename-sorted order.
   - Specific ("run night job: alerts") → load `jobs\<name>.md` (match on filename or first heading) and execute only that one.

3. **Autonomy** — each job spec contains a **Pre-approved design** + **Execution checklist** the user has already signed off on. Run the checklist verbatim. Do NOT re-ask questions covered in the spec. Do confirm before any step that touches files outside the **Out of scope for this job** boundary.

4. **Existing jobs** (as of 2026-04-30):
   - [`jobs/context-aware-alerts.md`](C:\falcon\Brain\jobs\context-aware-alerts.md) — make Brain voice alerts state-truthful (never claim "tests passed" when no tests ran). Triggers: `night mode` / `fixing night` / `run night job: alerts` / `tonight, do the alerts job`.
   - [`jobs/full-pipeline-redesign.md`](C:\falcon\Brain\jobs\full-pipeline-redesign.md) — full Brain pipeline (PRD/wiki sync → tri-mindset reasoning → 3-layer plan with gates → ChatGPT/Gemini scenarios → Claude code → QA loop → push-approval voice prompt). Split into 10 phases A–J. **Run ONE phase per invocation, never all at once.** Triggers: `night mode: phase <letter>` / `run night job: pipeline phase <letter>` / `do the brain folder move` (= phase A) / `let's go on <feature>` (= phases F–J pipeline run).
   - [`jobs/prompt-1-brain-structure.md`](C:\falcon\Brain\jobs\prompt-1-brain-structure.md) — universal session-state Brain skill at `.claude\skills\brain\` + `brain\` (project-relative). Triggers: `night mode: prompt 1` / `build the brain skill` / `run prompt 1`.
   - [`jobs/prompt-2-session-health-daemon.md`](C:\falcon\Brain\jobs\prompt-2-session-health-daemon.md) — async Python session-health daemon. Depends on Prompt 1. Triggers: `night mode: prompt 2` / `build the brain daemon` / `run prompt 2`.
   - [`jobs/prompt-3-brain-integration.md`](C:\falcon\Brain\jobs\prompt-3-brain-integration.md) — brain startup + task lifecycle + auto-continuation integration. Depends on Prompts 1 and 2. Triggers: `night mode: prompt 3` / `wire up the brain` / `run prompt 3`.
   - [`jobs/analysis-output-structure.md`](C:\falcon\Brain\jobs\analysis-output-structure.md) — scaffold `Brain\analysis\` (L0/L1/L2/L3 folders + `schemas/`, `tables/`, `raw/`, `index.json`) so every Brain analysis (gap detection, PRD reasoning, business audit) writes to a structured location organized by abstraction level. Triggers: `night mode: analysis output` / `set up analysis folders`.
   - [`jobs/test-cases-for-all-prds.md`](C:\falcon\Brain\jobs\test-cases-for-all-prds.md) — sweep every PRD module under `brain-skills\business-skills\prd-knowledge\modules\`; ensure each has Gherkin test cases. Generate via `test-case-authoring` skill where missing. Depends on `analysis-output-structure`. Triggers: `night mode: test cases for all PRDs` / `generate test cases for all PRDs` / `fill PRD test gaps`.

5. **After completion** — flip the job's `Status:` line from `DEFERRED` to `DONE (YYYY-MM-DD)` so it does not re-run.

6. **Hard rules:**
   - Honor all standing user feedback during night-mode runs (no commit without permission, no push, no scope creep, no UI testing).
   - If a job's checklist references missing files or external state that has changed since the spec was written, STOP and report — do not improvise.
   - Play one of the Brain "finished" voice alerts at the end of each completed job (random pick from the right mindset/category, respecting the rules in that job's spec).
