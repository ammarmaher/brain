---
type: moc
cluster: 100-Authority
title: Implementation Pitfalls — 25 pitfalls + 13 anti-patterns
projection-source: _mounts/brain-outputs/datasets/authority-dataset/15-implementation-pitfalls/
verified-at: 2026-05-16
purpose: "Answers 'which 25 pitfalls (5 categories) + 13 anti-patterns catch bugs before code review'. Open BEFORE porting any feature or implementing new authority-gated UI."
---

> [!tldr]
> 25 pitfalls catalogued across 5 categories (permission · validation · data · view-hide · cross-service) + 13 anti-patterns from the old UI with concrete file:line evidence + 10-row "if I see X check Y" cheat sheet. Use this BEFORE porting any feature.

# Implementation Pitfalls

## The 5 pitfall categories

| Category | Count | Examples |
|---|---|---|
| **A. Permission** | 7 | deny-by-omission · scope-arg factory · `app.*.view` hidden gate · expression-gated rules · Wave 1.3.0 ghost keys · default-deny `allowedActions` · "PES passes but feature key denies" |
| **B. Validation** | 6 | FE-tighter-than-backend drift · missing `[ThrowIf*]` · 3-layer collapse · async debounce · error-code-switching · OTP TTL relative-vs-absolute |
| **C. Data** | 5 | Mongo ID vs Zitadel ID universe · DTO enrichment asymmetry · type-flip drift · status enum int divergence · mixed casing |
| **D. View-hide** | 4 | composite gate semantics · tab-visibility reversal · default-deny `allowedActions` · 6 gate types collapsed |
| **E. Cross-service** | 3 | currency enum drift · duplicated validation · TS-vs-C# enum divergence |

## The 13 anti-patterns (from old UI)

| # | Anti-pattern | Replace with |
|---|---|---|
| 1 | SCSS files everywhere | Tailwind utilities only |
| 2 | PrimeNG components | Falcon UI Core (`<falcon-*>`) |
| 3 | PrimeIcons (`pi pi-*`) | `<falcon-icon>` / `<falcon-svg-icon>` |
| 4 | `@Input` / `@Output` decorators | `input()` / `output()` signal APIs |
| 5 | `*ngIf` / `*ngFor` | `@if` / `@for` |
| 6 | Hand-rolled HTML strings in render fns | Angular templates / `ng-template` |
| 7 | `alert()` calls | `MessageService` or Falcon dialog |
| 8 | PascalCase request bodies | Backend-normalized or uniform serializer |
| 9 | Silent `return of([])` after delay | Log + propagate via `ServiceOperationResult` |
| 10 | Magic-string defaults (IP list, icons, `'EMPTY'`) | Constants |
| 11 | Cross-feature sibling imports (`../../../../../`) | Promote to `libs/falcon` |
| 12 | `as any` casts for response shapes | Fully type response DTOs |
| 13 | Mixed template-driven + reactive forms | Reactive throughout |

## The cheat sheet — "if I see X, check Y first"

| Symptom | First place to look |
|---|---|
| User logs in but sees no pages | `app.*.view` PES key (the hidden gate) |
| PES check returns deny silently for every page | PES `g`-rule subject — must be `u:<JWT.sub>@<ns>`, NEVER Mongo `_id` |
| acc-admin can see services UI (should not) | `acc.services.view` returns explicit deny — but UI didn't gate on it |
| Form submits but backend returns 422 | Missing cross-field validator (FormGroup level) |
| Field validates client-side but rejects server-side | Drift between FE rule and backend `[ThrowIf*]` attribute |
| Username accepted at 50 chars (should be 30) | FE not enforcing tighter cap — PRD says 30, backend says 100 |
| Wallet transfer fails with currency error | `V-charging-transfer-source-destination` — wallets must match currency |
| Status enum int doesn't match across services | Commerce vs Provisioning use different ints for same names |
| Contact-group share dropped silently | `SharedWithAllUsers=true` + `SharedUsers[]` mutex (BR-CGM-09/10) |
| Payment poll runs forever | Hard 30-min upper bound; check `SimplePoll.watch` config |

## Drill into Brain Outputs

- [PITFALLS catalog](../_mounts/brain-outputs/datasets/authority-dataset/15-implementation-pitfalls/PITFALLS.md) — 25 pitfalls + 10 mindsets
- [ANTI-PATTERNS](../_mounts/brain-outputs/datasets/authority-dataset/15-implementation-pitfalls/ANTI-PATTERNS.md) — 13 anti-patterns + replacement table + pre-port grep checklist
- [_INDEX](../_mounts/brain-outputs/datasets/authority-dataset/15-implementation-pitfalls/_INDEX.md)

## See also

- [[Falcon-vs-Client]] — the 10 mindsets from Part 6 of KNOWLEDGE-DUMP
- [[Copy-Playbook]] — Phase 3 (use this list BEFORE running the 12-step recipe)
- [[Validation-by-Feature]] · [[Entity-Drift-by-Feature]] · [[Non-PES-Gates-by-Feature]] — what each pitfall maps to
