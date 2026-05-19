# PR Review Risk Matrix — PR #41631 (`final_template_management_feature`)

> Reviewer: Brain SK · 2026-05-19

## Risk by area

| Area | Likelihood | Impact | Risk level | Mitigation |
|---|---|---|---|---|
| Architecture / structure | High | Medium | **High** | Promote duplicated Template Management shared layer to `libs/falcon` (F1) |
| Falcon components | Low | Low | Low | Falcon components used correctly; new lib component is presentation-only |
| Validation | Medium | Medium | Medium | Deep-verify checker-level picker validation vs backend (F3) |
| API / DTO contract | Medium | High | **High** | Generate Core Templates backend understanding; verify DTO contract before merge |
| Business logic | Medium | High | **High** | Locate Template Management PRD; confirm lifecycle/maker-checker (F4) |
| Security / PES | Medium | High | **High** | Dedicated PES pass on checker-level + access-registry change (F3) |
| Quality gates / regression | High | Medium | **High** | Add tests (F2); confirm `nx build`/`nx lint`; smoke-test `falcon-multiselect` consumers |

> Likelihood/Impact: Low / Medium / High.

## Top risks (ranked)

| # | Risk | Area | Severity | Notes |
|---|---|---|---|---|
| 1 | Template Management shared layer duplicated across 2 apps → divergence over time | Architecture | P1 | Every future change must be applied twice; `models.ts` already byte-identical |
| 2 | DTO ↔ Core Templates backend contract unverified | API/DTO | P2 | No backend understanding doc for the Core Templates service |
| 3 | Checker-level / PES changes unverified vs PES Subject Contract | Security/PES | P2 | `falcon-access.registry.ts` + checker API touched |
| 4 | No automated tests for a 5860-LOC feature | Quality | P2 | Regression-prone, especially with the duplication in risk #1 |
| 5 | Business rules unverified — no PRD | Business | P2 | Lifecycle / maker-checker correctness assumed-only without PRD |

## Regression surface

| Touched area | Downstream consumers | Regression risk | Notes |
|---|---|---|---|
| `libs/falcon` `falcon-multiselect` | All apps/features using `falcon-multiselect` | Low | Change is additive (+2 html / +8 model lines); smoke-test consumers |
| `libs/falcon` `shared-types` (`falcon-access.registry.ts`, `globels.ts` enums) | All apps consuming the access registry | Medium | Registry/enum changes ripple platform-wide; confirm no key collisions |
| `libs/falcon` `shared-data-access` (`runtime-api-config.ts`) | All gateway consumers | Low–Medium | New gateway config; verify existing gateways untouched |
| host-shell Add User wizard | User creation flow | Medium | Permissions/checker step changed — exercise the full Add User flow |
| `environment*.ts` | All host-shell builds | Low | Additive URL only |

## Source-of-truth risk

| Risk | Detail | Action |
|---|---|---|
| Repo identity ambiguity | Memory describes v2 workspace; review repo is the legacy clone (`C:\Falcon\Falcon\falcon-web-platform-ui`). | Confirm canonical repo with the architect. Review was done against the repo's own conventions per skill SoT order. |
