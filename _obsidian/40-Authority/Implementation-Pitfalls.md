---
type: moc
cluster: 40-Authority
title: Implementation Pitfalls — 25 pitfalls + 13 anti-patterns
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\15-implementation-pitfalls\
verified-at: 2026-05-16
purpose: "Answers 'which 25 pitfalls (5 categories) + 13 anti-patterns catch bugs before code review'. Open BEFORE porting any feature or implementing new authority-gated UI."
---

> [!tldr]
> 25 pitfalls across 5 categories + 13 anti-patterns from old UI + 10-row cheat sheet ("if I see X, check Y"). Read BEFORE porting any feature.

# Implementation Pitfalls

## 5 categories

| Category | Count |
|---|---|
| A · Permission | 7 |
| B · Validation | 6 |
| C · Data | 5 |
| D · View-hide | 4 |
| E · Cross-service | 3 |

## Top 13 anti-patterns to NOT port

1. SCSS files → Tailwind utilities
2. PrimeNG → Falcon UI Core
3. PrimeIcons → `<falcon-icon>`
4. `@Input`/`@Output` decorators → `input()`/`output()` signals
5. `*ngIf`/`*ngFor` → `@if`/`@for`
6. Hand-rolled HTML strings → Angular templates
7. `alert()` calls → `MessageService` / Falcon dialogs
8. PascalCase request bodies → uniform serializer
9. Silent `return of([])` → propagate via `ServiceOperationResult`
10. Magic-string defaults → constants
11. Cross-feature sibling imports → promote to `libs/falcon`
12. `as any` casts → typed responses
13. Mixed template-driven + reactive forms → reactive throughout

## Cheat sheet (top 10 symptoms)

| Symptom | First check |
|---|---|
| User logs in, sees no pages | `app.*.view` PES key (hidden gate) |
| PES denies every check silently | `g`-rule subject must be `u:<JWT.sub>@<ns>` not Mongo `_id` |
| acc-admin sees services UI | `acc.services.view` returns explicit deny but UI didn't gate |
| Backend 422 with no FE warning | Missing cross-field validator (FormGroup level) |
| FE accepts but backend rejects | Drift FE rule vs backend `[ThrowIf*]` |
| Username accepted at 50 chars | FE not enforcing tighter PRD cap (30 not 100) |
| Wallet transfer fails on currency | V-charging-transfer-source-destination |
| Status enum int mismatch | Commerce vs Provisioning different ints same name |
| Contact-group share silently dropped | BR-CGM-09/10 mutex |
| Payment poll runs forever | 30-min hard cap in `SimplePoll.watch` |

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\15-implementation-pitfalls\PITFALLS.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\15-implementation-pitfalls\ANTI-PATTERNS.md`

## See also
- [[Copy-Playbook]] — Phase 3 (use this BEFORE running the 12-step recipe)
- [[Falcon-vs-Client]] · all *-by-Feature notes
