*** Skill: test-case-authoring ***
*** PRD requirements → Gherkin scenarios + acceptance criteria + traceability ***

# test-case-authoring

## Purpose

Convert PRD requirements into structured, traceable test cases. Output is Gherkin (Given/When/Then) feature files plus a coverage matrix mapping every PRD requirement to ≥1 test ID.

## Triggers

- `generate test cases for [module]`
- `generate test cases for all PRD`
- New feature: derive tests before implementation
- Bug fix: regression test authoring

## Owns

- Gherkin standard (Given/When/Then)
- Test ID convention — `TC-<MODULE>-<###>` (stable, append-only)
- Universal edge-case checklist (20 items, applied to every module)
- Permission test matrix (roles × actions)
- Coverage matrix: PRD requirement → test ID(s)

## Folder layout

```
test-case-authoring/
  Skill.md
  resources/
    gherkin-rules.md
    test-id-convention.md
    acceptance-criteria.md
    edge-case-checklist.md
    permission-matrix-template.md
    completion-sound-rules.md
  templates/
    feature.template.feature
    test-plan.template.md
    coverage-matrix.template.md
  modules/
    <module-slug>/
      <module>.feature
      test-plan.md
      coverage-matrix.md
```

## Hard rules

1. Every test case maps to ≥1 PRD requirement (`Covers: PRD-AM-3.2`)
2. Test IDs never renumber — append only
3. Gherkin: max 3 `And` per Given / When / Then block
4. Every module test plan covers all 20 edge cases (or marks N/A with reason)
5. Permission tests are a matrix, never inline scenarios
6. Every term used must exist in `domain-glossary`
7. Coverage matrix written back to `module-catalog/modules/<slug>/coverage.md`
8. **7-type coverage** — every module covers positive / negative / edge / validation / permission / workflow / integration (migrated from OLD; see [`resources/coverage-types.md`](./resources/coverage-types.md))
9. **Dual ID formats supported** — Gherkin scenarios use `@TC-<MODULE>-<###>`; classic test cases (legacy from OLD) use `<MODULE-CODE>-<TYPE>-<###>` (e.g. `AM-POS-001`)
10. Inputs only: `latest-prd.md` + `understanding.md` + `attachments.md` entries with `used_for_understanding: yes`
11. Sync (`take latest from PRD`) NEVER modifies `test-cases.md`

## Commands (migrated from OLD)

| Command | What it does |
|---|---|
| `generate test cases for all PRD` | Regenerate every module's `test-cases.md` |
| `generate test cases for [module name]` | Regenerate only that module's `test-cases.md` |

After generation: emit completion sound `Peeep / PeeeP / Peeep` (audio: `[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)`) followed by a one-line summary naming the module(s) updated.

## Restrictions

- Do not generate test cases when PRD content is absent or unreadable
- Do not invent behavior not backed by the PRD or a supporting file
- Do not regenerate all modules when the user asked for one
- Do not modify `latest-prd.md`, `understanding.md`, or `source-map.json` during test generation
- Do not edit application code during test generation
- Do not install packages
- Do not run migrations
- Do not refactor source code
- Do not change Nx workspace structure / Module Federation / PrimeNG / Tailwind

## Universal edge-case checklist

Every module test plan must address all 20 (or mark N/A + reason):

| # | Edge case | # | Edge case |
|---|---|---|---|
| 1 | Empty input | 11 | Sort + filter combined |
| 2 | Max-length input | 12 | Search no-results |
| 3 | Special chars (Arabic, emoji) | 13 | Server 500 |
| 4 | Permission denied (each role) | 14 | Validation error display |
| 5 | Token expired | 15 | Loading state |
| 6 | Network failure mid-action | 16 | Empty state |
| 7 | Concurrent edit conflict | 17 | Success toast |
| 8 | RTL rendering | 18 | Error toast |
| 9 | Long text truncation | 19 | Browser back/forward |
| 10 | Pagination boundaries | 20 | Deep link entry |

## Generation output (required format)

```
Test cases generated: <module-slug>
Scenarios:    N (TC-XX-001 → TC-XX-NNN)
Edge cases:   M/20 covered (N/A: <list with reasons>)
Permissions:  <R> roles × <A> actions = <R*A> cells
PRD coverage: K/K requirements (100%)
Output:       module-catalog/modules/<slug>/coverage.md updated
```

## Status Announcer (voice + sound)

Source of truth: [`settings/sound/settings.json`](../../settings/sound/settings.json) → `skills.test-case-authoring`.

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_fable` | "Test case authoring running." | — |
| Working (long ops) | `bm_fable` | "Test case authoring working." | — |
| Completion | `bm_fable` | "Test case authoring complete." | low-high-low `[880,400; 1100,400; 880,400]` |
| **Global handshake** | `bm_george` | **"I am finishing, boss."** | double-tap `[1320,100; 1320,100]` |

**Reading the response aloud:** When agent-tts is running, every assistant turn under this skill is spoken via Kokoro at `bm_fable` and 8× volume.

**Final sequence per cycle:**
1. "Test case authoring running." → work → "Test case authoring complete."
2. Per-skill beep (low-high-low)
3. "I am finishing, boss." (always `bm_george`)
4. Global double-tap beep

Play ONLY after a full module test plan is generated.

## See also

- [resources/gherkin-rules.md](./resources/gherkin-rules.md)
- [resources/test-id-convention.md](./resources/test-id-convention.md)
- [resources/acceptance-criteria.md](./resources/acceptance-criteria.md)
- [resources/edge-case-checklist.md](./resources/edge-case-checklist.md)
- [resources/permission-matrix-template.md](./resources/permission-matrix-template.md)
- [resources/completion-sound-rules.md](./resources/completion-sound-rules.md)
- [templates/](./templates/)
