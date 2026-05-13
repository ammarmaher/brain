# Skill: Business Knowledge Pipeline

## Mission

Merge and orchestrate the user's existing Falcon Brain business skills:

1. PRD knowledge
2. Domain glossary
3. Module catalog
4. Test-case authoring
5. Business pipeline

This skill is the business knowledge source that feeds ChatGPT/Codex planning, Claude implementation, and Gemini QA. It works together with `63-prd-intelligence-and-gap-engine`; the PRD intelligence skill extracts and traces requirements, then this pipeline turns them into glossary, module catalog, tests, and implementation handoffs.

## Imported source intent

The uploaded skills contain these important contracts:

- PRD knowledge sync selects the latest PRD version using numeric `v<number>` rules.
- Domain glossary locks vocabulary in English/Arabic and prevents invented synonyms.
- Module catalog keeps per-module dossiers with scope, surfaces, decisions, and source maps.
- Test-case authoring converts PRD/module rules into Gherkin and coverage matrices.
- Business pipeline runs in dependency order: PRD -> glossary -> catalog -> tests.

## Pipeline order

```text
0. PRD intelligence and gap engine
1. prd-knowledge
2. domain-glossary
3. module-catalog
4. test-case-authoring
5. ChatGPT/Codex business-test matrix
6. Claude implementation prompt
7. Gemini validation prompt
```

## When to use

Use this skill when the user says:

- take latest from PRD
- understand business
- run business
- generate test cases
- create module understanding
- describe the module
- merge PRD with implementation
- create acceptance criteria
- create business tests
- update domain terms

## PRD knowledge rules

- Never edit original PRD files manually.
- Select latest duplicate by highest numeric version after `v` or `V`.
- Preserve ignored duplicate list.
- Capture source map.
- Capture attachments, Excel files, diagrams, screenshots, and unreadable items.
- Generate `latest-prd.md` and `understanding.md` per module.
- Mark assumptions and open questions.

## Domain glossary rules

- Every business term must use a canonical name.
- English/Arabic translations must be consistent.
- Banned synonyms must be recorded.
- UI labels, code names, test cases, and prompts should use canonical terms.
- New domain terms should be added only after validation.

## Module catalog rules

Each module dossier must include:

- Module name
- Scope
- Out of scope
- User roles
- Main pages/screens
- Main APIs
- DTOs/entities
- Business workflows
- Permissions
- Statuses
- Validation rules
- Dependencies
- Open questions
- Latest PRD link/source
- Code paths when known
- Test coverage notes

## Test-case authoring rules

Business tests must trace to at least one rule/source.

Required test coverage:

1. Happy path
2. Negative path
3. Permissions
4. Status transitions
5. Validation rules
6. API failure
7. Empty state
8. Loading state
9. Boundary values
10. Integration behavior
11. Regression risks
12. Visual/chart behavior if relevant

## Mandatory PRD Traceability

Every business rule must trace across:

```text
PRD requirement -> module catalog -> frontend screen/component -> backend API/DTO/service -> test case -> gap/risk -> implementation action
```

If any link is missing, record it as a gap instead of inventing it.

## Completion report

When the pipeline runs, report:

```md
## Business Pipeline Completion

| Stage | Result | Notes |
|---|---|---|
| PRD knowledge | ... | ... |
| Domain glossary | ... | ... |
| Module catalog | ... | ... |
| Test-case authoring | ... | ... |
| Business test matrix | ... | ... |

## Changed/Generated Artifacts

- ...

## Open Questions

- ...

## Next Claude Implementation Prompt

[If implementation is needed]

## Gemini Validation Prompt

[If visual/chart/QA validation is needed]
```

## Hard rules

- Do not run stages out of order.
- If PRD/source sync fails, stop and report.
- Do not invent missing PRD content.
- Do not let Claude implement business-heavy changes without business tests.
- Do not let Gemini validate charts without a chart requirement/spec.
