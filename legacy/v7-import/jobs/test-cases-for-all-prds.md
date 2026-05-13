*** Job: test-cases-for-all-prds ***
*** Sweep every PRD module folder under brain-skills\business-skills\prd-knowledge\modules\ — ensure each has Gherkin test cases. Generate any missing ones via the test-case-authoring skill. ***
*** Triggered by: "night mode: test cases for all PRDs" / "generate test cases for all PRDs" / "fill PRD test gaps" ***

# Job: Test Cases for All PRDs

## Status

DONE (2026-05-01).

## Pre-approved design (verbatim user request 2026-04-30)

> "make sure that you have all test cases for all PRDs folders that we have."

Every PRD module folder must have a `test-cases.md` file. Where missing, the test-case-authoring skill generates one from `latest-prd.md` + `understanding.md` + `attachments.md` (the existing skill protocol).

## Source of truth

- PRD modules live under `C:\falcon\brain-skills\business-skills\prd-knowledge\modules\<module-slug>\` (per the existing prd-knowledge skill).
- Test-case authoring skill: `C:\falcon\brain-skills\business-skills\test-case-authoring\Skill.md` (existing).
- Schema for test cases: `C:\falcon\Brain\analysis\schemas\test-case.schema.json` (created by the analysis-output-structure job — run that first).

## Execution checklist

1. **Inventory** — list every immediate subfolder of `prd-knowledge\modules\`. For each:
   - Check if `latest-prd.md` exists. If not: skip + log to `Brain\analysis\L0-summary\prd-coverage.md` as `MODULE_MISSING_PRD: <slug>`.
   - Check if `test-cases.md` exists. If yes: validate (must contain at least 1 Gherkin scenario). If invalid: mark as `STALE`. If valid: mark as `OK`.
2. **Generate** — for each module marked `MISSING` or `STALE`:
   - Activate the test-case-authoring skill.
   - Read `latest-prd.md` + `understanding.md` + `attachments.md` (entries with `used_for_understanding: yes`).
   - Generate Gherkin scenarios covering: happy path, negative path, permission/role path, status transition path, validation path, empty-state path, error/API failure path, boundary values, regression path, data mapping path, UI-state path, integration path.
   - Write to `<module>\test-cases.md` AND copy to `Brain\analysis\L2-business\<YYYYMMDD>\<module>-test-cases.md` for the analysis index.
   - Append entry to `Brain\analysis\index.json`.
3. **Coverage report** — write `Brain\analysis\L0-summary\prd-coverage.md`:
   - Total modules
   - Modules with test cases
   - Modules missing PRD
   - Modules with stale test cases (regenerated)
   - Modules with no PRD content (skipped)
4. **Voice announcement (per state-aware rules)** — at the end:
   - State `Tested=false` (these are AUTHORED test cases, not run)
   - Play one `chatgpt/finished` alert (test-case-authoring is ChatGPT mindset domain)
   - Filter out phrases that claim tests RAN successfully

## Hard rules

- **Never fabricate test cases when PRD is missing**. Skip + report. The user gets a clear list of `MODULE_MISSING_PRD` so they can fix the source.
- **Validate every term against `domain-glossary` skill before authoring** (existing brain-skills rule).
- **Output sound** — the test-case-authoring skill emits `Peeep / PeeeP / Peeep` (low-high-low) per command #3/#4 spec.

## Out of scope

- Running the tests against actual code (this job only AUTHORS scenarios).
- Modifying the PRDs themselves.
- Modifying any service code.
- Pulling new PRDs from Drive (that's the prd-knowledge skill's job — run THAT first if PRDs are stale).

## Depends on

- `analysis-output-structure` job (for the analysis folder + schemas) — run before this.
- Optionally: `prd-knowledge` skill freshly synced (run `take latest from PRD` first if you want absolutely current PRDs).

## Done definition

- Every PRD module under `prd-knowledge\modules\` has either `test-cases.md` (valid Gherkin, ≥1 scenario per category) OR is logged as `MODULE_MISSING_PRD` / `MODULE_NO_PRD_CONTENT`.
- `Brain\analysis\L0-summary\prd-coverage.md` exists with the coverage report.
- `Brain\analysis\L2-business\<YYYYMMDD>\` contains a copy of every newly authored test-cases.md.
- `Brain\analysis\index.json` updated.
- Voice announcement plays at end (filtered by state).
