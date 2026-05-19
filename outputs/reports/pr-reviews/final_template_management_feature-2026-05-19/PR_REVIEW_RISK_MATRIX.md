# PR Review Risk Matrix — PR #41631 (Re-review v2)

> Reviewer: Brain SK · 2026-05-19 · refined by the regression-impact graph

## Risk by area

| Area | Likelihood | Impact | Risk | Mitigation |
|---|---|---|---|---|
| Architecture / structure | High | Medium | **HIGH** | Promote duplicated shared layer to `libs/falcon` (F1) |
| FE↔BE contract | Medium | High | **HIGH** | Refresh `understanding/backend/templates/`; verify `bodyType` + name fields (B1) |
| Templates reachability / CORS | Medium | High | **HIGH** | Verify gateway route + CORS for the web origin (B2) |
| Security / PES | Medium | High | **HIGH** | PES pass on checker-level + access registry (F3) |
| Quality gates / tests | High | Medium | **HIGH** | Add tests (F2); confirm `nx build`/`nx lint` |
| Business logic | Medium | High | **HIGH** | Locate Template Management PRD (F4) |
| Dirty-tracking correctness | Medium | Low | MED | Order-insensitive `serializeChannels` (C1) |
| Shared-lib regression | Low | Low | **LOW** | Changes are additive — regression graph confirmed |
| Falcon components | Low | Low | LOW | Used correctly |

## Regression surface (computed — regression-impact graph)

| Touched shared file | Importers | Change type | Risk |
|---|---|---|---|
| `runtime-api-config.ts` | 40 | **Additive** — new `baseURLCoreTemplatesGateway` key + enum entry; no existing key changed | **LOW** |
| `falcon-multiselect` (component + models) | 1 | **Additive** — new optional `disabled?`/`disabledHint?` fields + `optionDisabled` binding | **LOW** |
| `falcon-access.registry.ts` (shared-types) | 2 | Registry entry added | LOW–MED — confirm no key collision |
| `globels.ts` enums | (via registry/config) | `Gateway.CoreTemplatesGateway` enum member added | LOW — `Record<Gateway,…>` stays exhaustive |

> Key correction vs v1: `runtime-api-config.ts` was guessed MED on the strength of
> 40 importers. The diff shows the change is purely additive — no existing consumer
> behavior changes — so the real regression risk is **LOW**.

## Top risks (ranked)

| # | Risk | Severity |
|---|---|---|
| 1 | Shared layer duplicated across 2 apps → divergence | P1 (F1) |
| 2 | FE↔BE contract unverified — backend doc stale/inferred | P2 (B1) |
| 3 | Templates may be unreachable from the browser (CORS / no gateway route) | P2 (B2) |
| 4 | Checker-level / PES not verified | P2 (F3) |
| 5 | No tests for 5860 LOC | P2 (F2) |
