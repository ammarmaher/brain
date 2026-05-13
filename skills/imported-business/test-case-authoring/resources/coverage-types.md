*** Coverage Types — test-case-authoring ***
*** Migrated from OLD claude-falcon-skills — 7-type coverage + TC-MOD-TYPE-### ID format ***

# 7-Type Coverage Model

Every generated `test-cases.md` must cover, when applicable, all 7 categories. If a type does not apply, note that explicitly — do not pad with fake cases.

## The 7 types

| Code | Type | Description |
|---|---|---|
| `POS` | positive | Happy-path success |
| `NEG` | negative | Wrong inputs, missing data, denied access |
| `EDG` | edge case | Boundary conditions, max/min, empty, very long |
| `VAL` | validation | Field-level rules (format, length, type, range) |
| `PRM` | permission | Role × action × resource matrix |
| `WFL` | workflow | Multi-step state transitions, approvals |
| `INT` | integration | Cross-module calls, external APIs, events |

## Test ID format

`<MODULE-CODE>-<TYPE>-<###>`

Examples:
- `AM-POS-001` — Account Management, positive, sequence 1
- `CG-PRM-007` — Contact Group Management, permission, sequence 7
- `CB-WFL-003` — Charging-Billing, workflow, sequence 3

Module codes (registered per module):
- `AM` — Account Management
- `UM` — User Management
- `CB` — Contract / Packaging / Charging / Billing
- `CG` — Contact Group Management
- `TM` — Templates

## Required fields per test case

- test case ID
- module name
- feature / area
- scenario
- type (one of the 7 above)
- priority — High / Medium / Low
- preconditions
- test data
- steps (numbered)
- expected result
- source reference — pointer to a section in `latest-prd.md`, an attachment, or `understanding.md`
- notes

## Priority guidance

- **High** — directly listed in the PRD as must-work, or gates a workflow.
- **Medium** — validation, permission, or edge case that will be hit in normal use.
- **Low** — nice-to-have, rare inputs, cosmetic validations.

## Inputs

Generation reads ONLY:
- `latest-prd.md`
- `understanding.md`
- `attachments.md` entries with `used_for_understanding: yes`

Never use older duplicate PRD versions. Never use un-synced content.

## Triggers

- `generate test cases for all PRD` — regenerate every module's `test-cases.md`.
- `generate test cases for [module name]` — regenerate only the named module.

Generation is on explicit request only. A sync (`take latest from PRD` / `update PRD knowledge`) does NOT generate or modify `test-cases.md`.

## Completion sound

Output exactly:

```
Peeep
PeeeP
Peeep
```

(Audio equivalent: `[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)` — see `completion-sound-rules.md`.)

Then a one-line summary of which module(s) were updated.

## Do not

- Do not generate test cases when PRD content is absent or unreadable.
- Do not invent behavior not backed by the PRD or a supporting file.
- Do not regenerate all modules when the user asked for one.
- Do not modify `latest-prd.md`, `understanding.md`, or `source-map.json` during test generation.
- Do not edit application code during test generation.
