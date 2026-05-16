---
type: index
cluster: 15-implementation-pitfalls
purpose: "Answers 'where to find pitfalls vs anti-patterns + which pre-flight checklist applies'. Open before any implementation or feature port."
extracted: 2026-05-16
---

# Implementation Pitfalls — Index

> [!tldr]
> Pitfalls are mental models that catch real bugs. This cluster catalogs ~25 pitfalls observed across the authority dataset (with concrete file:line evidence) and 13 anti-patterns harvested from the old-ui-dataset that MUST NOT be ported to the new theme. Use these two files as the pre-flight checklist before any implementation or feature port.

## Files

| File | Content |
|---|---|
| [[PITFALLS]] | The 25 cross-cutting pitfalls. 10 mindsets + 5 categories (permission / validation / data / view-hide / cross-service) + per-pitfall detail + the "if I see X, check Y" cheat sheet |
| [[ANTI-PATTERNS]] | The 13 anti-patterns from old-UI-dataset (SCSS, PrimeNG, `*ngIf`, `@Input`, alert(), etc.) + "use this not that" replacement table + the mandatory pre-port grep checklist |

## Quick answers

| Question | Read |
|---|---|
| What pitfalls should I watch for when implementing feature X? | [[PITFALLS#cheat-sheet]] then [[PITFALLS#per-pitfall-detail]] |
| What should I NOT copy from the old UI? | [[ANTI-PATTERNS#the-13-anti-patterns]] + [[ANTI-PATTERNS#use-this-not-that]] |
| If I see broken UI for `acc-user`, what should I check first? | [[PITFALLS#cheat-sheet]] row "Page renders but no actions visible" |
| What are the 10 cross-cutting mindsets that catch silent bugs? | [[PITFALLS#the-10-mindsets]] |
| Before porting any old-UI feature, what grep commands should I run? | [[ANTI-PATTERNS#pre-port-grep-checklist]] |
| What's the difference between PES, role-level, and row-level checks? | [[PITFALLS#a-permission-pitfalls]] |
| Why do I sometimes see deny when the role "should" allow? | [[PITFALLS#p-01-deny-by-omission]] (Mindset 1) |
| When porting admin → mgmt, what subtle drift items might bite me? | [[PITFALLS#e-cross-service-pitfalls]] + [[PITFALLS#cheat-sheet]] |
| Why does my PES check pass but action still doesn't work? | [[PITFALLS#a-permission-pitfalls]] + [[../10-non-pes-gates-by-feature/MATRIX]] |

## Severity legend (used across both files)

| Symbol | Severity | Meaning |
|---|---|---|
| 🟢 | nuisance | Won't block the user, but adds friction or noise (e.g. duplicate request, hard-coded English in template) |
| 🟡 | functional bug | Feature breaks for a class of users / inputs / states (e.g. missing PES key blocks UI for `acc-owner`) |
| 🔴 | security / data corruption | Authorization bypass, silent dropped data, or wire-level corruption (e.g. session subject mismatch lets `acc-user` see other tenants' data) |

## See also

- [[../00-INDEX]] — top-level cluster map
- [[../KNOWLEDGE-DUMP]] — Part 6 (the 10 mindsets, lines ~278-360)
- [[../04-feature-parity-matrix/MATRIX]] — the 7-feature parity grid
- [[../06-validation-by-feature/MATRIX]] — drift watch + 3-layer validation
- [[../07-cross-cutting/permission-sheet-gaps]] — Q-UM-07 + Q-AM-16 caveats
- [[../08-entity-drift-by-feature/MATRIX]] — 179 entity drift items
- [[../10-non-pes-gates-by-feature/MATRIX]] — the 6 non-PES gate types
- [BRAIN-OUT] `datasets/old-ui-dataset/10-pages/admin-console/<feature>/08-RULES-APPLIED.md` — per-feature anti-pattern lists (the raw inputs)
