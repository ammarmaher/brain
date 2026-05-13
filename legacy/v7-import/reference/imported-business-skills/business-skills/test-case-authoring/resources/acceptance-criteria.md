*** Acceptance Criteria — test-case-authoring ***
*** Definition of Done + INVEST criteria for Falcon features ***

# Acceptance Criteria

## INVEST

Every feature/story must satisfy:

| Letter | Meaning | Test |
|---|---|---|
| **I**ndependent | Deliverable on its own | Can ship without other in-flight stories |
| **N**egotiable | Scope can be discussed | Not over-specified upfront |
| **V**aluable | Delivers user/business value | One-line value statement passes "so what?" |
| **E**stimable | Team can size it | Has enough detail for estimate |
| **S**mall | Fits in one sprint | < 5 working days |
| **T**estable | Has acceptance criteria | This file's checklist passes |

## Definition of Done (DoD) — checklist

A feature is "Done" only when ALL apply:

- [ ] All Gherkin scenarios pass (smoke + regression)
- [ ] Coverage matrix shows 100% PRD requirement coverage
- [ ] All 20 universal edge cases addressed (or marked N/A with reason)
- [ ] Permission matrix tested for every role × action cell
- [ ] En + Ar copy reviewed against `domain-glossary`
- [ ] RTL rendering verified
- [ ] Accessibility: keyboard nav + ARIA + contrast (WCAG AA)
- [ ] No banned terms in code, UI, tests, or docs
- [ ] Telemetry/logging added for new actions
- [ ] Module dossier updated (`README.md` last-updated, `links.md`, `coverage.md`)
- [ ] Decision log updated if any architectural choice was made
- [ ] Wiki updated if structure changed

## Acceptance criteria writing rules

- Written from user's perspective ("As a tenant admin, I can ...")
- Falsifiable — must be possible to fail
- Singular outcome per AC — split if compound
- Linked to ≥1 Gherkin scenario via test ID

## Anti-patterns

- ❌ "It should work properly" — not falsifiable
- ❌ "User-friendly UX" — not testable
- ❌ "Performance is good" — quantify (e.g. "< 200ms p95")
- ❌ "Looks like the design" — link the design ref + state pixel-level vs spirit
