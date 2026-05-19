# PR Review Report — PR #41631

> Reviewer: Brain SK · Skill: pr-review-governance · Review-only (no code changed)

## 1. Summary

| Field | Value |
|---|---|
| PR | #41631 — `Merge pull request 41631 from final_template_management_feature into main` |
| Source branch | `final_template_management_feature` |
| Target branch | `main` |
| Repository | `C:\Falcon\Falcon\falcon-web-platform-ui` (Azure DevOps: `t2development/Falcon/falcon-web-platform-ui`) |
| PR state | **Open** — source tip `5bf6f69` is NOT an ancestor of `origin/main`; this is a genuine pre-merge review |
| Review date/time | 2026-05-19T14:35+03:00 |
| Reviewer | Brain SK |
| Affected domains | Frontend (Angular / Nx) — 3 apps + falcon lib |
| Changed files | 77 (51 added, 26 modified) · +5860 / −21 |
| **Final decision** | **`REQUEST_CHANGES`** |

**Feature:** Template Management (admin-console + management-console) + Checker-level
assignment (host-shell Add User wizard) + new `falcon-checker-section` library
component + `falcon-multiselect` additive extension.

### Source-of-truth conflict (declared, not guessed)

Brain SK memory/knowledge describes the **v2 workspace** at
`C:\Falcon\falcon-web-platform-ui` (Stencil `falcon-ui-core`, PrimeNG fully removed,
native interactive elements banned). The repository under review is the **legacy**
clone at `C:\Falcon\Falcon\falcon-web-platform-ui` — it ships `primeng@^20.4.0` in
`package.json`, uses Angular Nx `libs/falcon/src/shared-ui`, has **no
`falcon-button` / `falcon-tabs` component**, and 70 files on `main` already import
PrimeNG. Per the skill's source-of-truth order, the **codebase (tier 2) wins over
memory**. This review was conducted against *this repo's own established
conventions*, not the v2 memory. The conflict is logged as a risk in
`PR_REVIEW_RISK_MATRIX.md`.

## 2. Change scope

| Area | Files | Risk | Notes |
|---|---|---|---|
| Template Management — admin-console | ~13 (feature folder) | Medium | New feature: components/models/services/utils |
| Template Management — management-console | ~17 (feature folder) | Medium | New feature + `template-config-editor` + `routes.ts` |
| Checker assignment — host-shell | ~9 (user-profile, add-user-wizard) | Medium | PES/checker-level — touches Add User wizard |
| `libs/falcon` shared-ui | `falcon-checker-section` (new) + `falcon-multiselect` (modified) | Medium | Shared lib — affects other consumers |
| `libs/falcon` shared-data-access / shared-types | constants, models, registry, enums | Low | Additive |
| i18n | `en.json` (+71), `ar.json` | Low | Translation keys added — good (no hardcoded strings) |
| Environments | `environment.ts`, `environment.prod.ts` | Low | Added `baseURLCoreTemplatesGateway` URL only — no secrets |
| Routing / app.config | 3 apps | Low | Route + HttpClient/provider wiring |
| Docs | `docs/checker-assignment-integration-proposal.md` (new) | None | Design proposal — good practice |

## 3. Findings

| Severity | File | Issue | Source rule | Required fix |
|---|---|---|---|---|
| **P1** | `apps/admin-console/.../template-management/**` + `apps/management-console/.../template-management/**` | Template Management shared layer (`template-management.models.ts`, `template-management.mappers.ts`, `template-management-api.service.ts`, and the `body-type-section` / `body-type-view` / `channel-tabs` / `checker-level-picker` / `unrestricted-banner` sub-components) is **duplicated verbatim across two apps**. `models.ts` confirmed byte-identical. | Architecture/structure governance — "No duplicated logic", "Shared vs feature-local decision", Nx lib boundaries | Promote the shared model/mapper/API-service/sub-component layer into `libs/falcon` (`shared-data-access` + `shared-ui`); keep only app-specific shells (`template-management.component`, `template-config-editor`, `routes.ts`) per app. |
| **P2** | whole PR | No automated tests added — 5860 LOC, 0 `*.spec.ts` files. `docs/checker-assignment-integration-proposal.md` describes a test plan but no specs were committed. | Quality gates — tests added/updated where needed | Add specs for `template-form.service`, `template-management.mappers`, `checker-assignment-api.service`, and the permissions/checker step. |
| **P2** | `host-shell/.../add-user-wizard/steps/permissions-privilege-step/**`, `checker-level-rows/**`, `services/checker-assignment-api.service.ts` | Checker-level / PES-adjacent changes in the Add User wizard were reviewed at governance level only — not deep-validated against the PES Subject Contract (`u:<ZitadelUserId>@<ns>`) or the access registry change in `falcon-access.registry.ts`. | Security/PES review — maker/checker/PES rules | Run a dedicated PES pass: confirm checker-level subject IDs, `authorizeResources` keys, and FE-before-BE fallback (`docs` proposal §1) match `PES-Subject-Contract.md`. |
| **P2** | Template Management feature | No Template Management PRD/business spec located under `Brain Outputs/prd` or `understanding/` — business-rule alignment (statuses, lifecycle, maker/checker, allowed actions) only partially verifiable from code. | Business logic review — PRD flow followed | Supply / link the Template Management PRD so business rules + lifecycle can be confirmed. Relates to known gap "Templates CRUD missing" (Atlas Wave 4). |
| **P3** | `services/checker-assignment-api.service.ts` (line ~3287 of diff) | `console.error('Failed to load checker assignments:', err)` left in the load catch. | Quality gates — no console noise | Acceptable for error logging; consider a routed logger if one exists. |
| **P3** | 8 files (template-management + checker-level-rows + `falcon-checker-section`) | New code imports PrimeNG (`primeng/radiobutton`, `primeng/tooltip`, `primeng/api`). | Standing rule "No PrimeNG for new work" (v2 workspace) | **Consistent with this repo** (PrimeNG in `package.json`; 70 files on `main` use it) → not a violation here. Flagged so it is migrated when this repo follows the platform-wide PrimeNG removal. |

## 4. Wiki / PRD alignment

| Rule / requirement | Applied? | Evidence | Gap |
|---|---|---|---|
| Tailwind + Falcon tokens only, no SCSS/CSS | ✅ Yes | 0 `.scss`/`.css` files added; 0 hardcoded hex colors; 0 inline `style=` | — |
| i18n via language files (no hardcoded strings) | ✅ Yes | `en.json` +71 keys, `ar.json` updated | Verify Ar/En parity per glossary |
| API code lives in host app, not the library | ✅ Yes | All 3 `HttpClient` injections are in `apps/` API services; `falcon-checker-section` lib component has 0 `HttpClient` | — |
| New Falcon component placed in `libs/falcon` | ✅ Yes (partial) | `falcon-checker-section` correctly added to `shared-ui` | Inconsistent — template-management shared layer NOT promoted (see P1) |
| Template Management business rules / lifecycle | ⚠️ Unverified | No PRD located | See P2 |
| PES / checker-level subject contract | ⚠️ Unverified | Registry + checker API changed | See P2 |

## 5. Structure review

| Path | Expected | Actual | Status |
|---|---|---|---|
| `features/template-management/{components,models,services,utils}/` | Feature-folder governance | Followed — clean `components`/`models`/`services`/`utils` split | ✅ |
| Shared model/mapper/API across 2 apps | Promoted to `libs/falcon` | Duplicated into both apps | ❌ P1 |
| `falcon-checker-section` | In `libs/falcon/shared-ui` with `index.ts` barrel | Correct | ✅ |
| `shared-data-access/lib/constants/` | Barrel + additive | Correct (`index.ts` + `templates-base.ts`) | ✅ |
| Routing (`routes.ts`, `app.routes.ts`, `app.config.ts`) | Convention-aligned | Aligned | ✅ |

## 6. Falcon component review

| UI element | Expected Falcon component | Actual | Status | Fix |
|---|---|---|---|---|
| Multi-select inputs | `falcon-multiselect` | `falcon-multiselect` (additively extended) | ✅ | Confirm extension is backward-compatible for other consumers |
| Icons / dividers | `falcon-icon`, `falcon-divider` | Used | ✅ | — |
| Org tree | `falcon-organization-hierarchy-tree` | Used | ✅ | — |
| Credentials popup | `falcon-send-credentials-popup` | Used | ✅ | — |
| Checker section | new `falcon-checker-section` | Created in lib, presentation-only | ✅ | — |
| Buttons | (no `falcon-button` exists in this repo) | Raw `<button>` + Tailwind | ✅ Acceptable | No Falcon button component exists → not a violation |
| Channel tab strip | (no `falcon-tabs` exists in this repo) | Feature-local `channel-tabs` component, raw `<button role="tab">` + ARIA | ✅ Acceptable | No Falcon tabs component exists; ARIA `tablist`/`tab`/`aria-selected` correctly applied |

## 7. Validation / API / business review

| Rule | Expected | Actual | Status | Fix |
|---|---|---|---|---|
| New gateway URL | env config, no secrets | `baseURLCoreTemplatesGateway` added to both env files (URL only) | ✅ | — |
| API services use correct gateway | typed, error-handled | `template-management-api.service.ts` ×2, `checker-assignment-api.service.ts` — typed, `HttpErrorResponse` handled | ✅ | — |
| Error/loading states | handled | Load failure caught + logged (P3) | ⚠️ | Confirm UI error/empty states render, not just console |
| DTO ↔ backend contract | match Core Templates backend | `checker-assignment.models.ts`, `templates-base.ts`, mappers | ⚠️ Unverified | No backend DTO dictionary for Core Templates service in `understanding/backend/` |
| Business lifecycle / maker-checker | per PRD | checker-level picker + unrestricted banner | ⚠️ Unverified | See P2 — PRD not located |
| No mock data left | none | None in code (only test-plan prose in docs) | ✅ | — |

## 8. Security / PES review

| Check | Status | Notes |
|---|---|---|
| No secrets / credentials committed | ✅ PASS | Env diff is gateway URLs only; no keys/tokens |
| Sensitive data not logged | ✅ PASS | `console.error` logs an error object, not credentials |
| Permissions enforced | ⚠️ UNVERIFIED | `falcon-access.registry.ts` + checker-assignment touched; needs PES pass (P2) |
| Maker / checker rules | ⚠️ UNVERIFIED | Checker-level feature — verify against PES Subject Contract |
| Route access not weakened | ✅ PASS (apparent) | New routes added; no existing guard removed in diff |

## 9. Quality gates

| Gate | Status | Evidence |
|---|---|---|
| Build / typecheck | ⚠️ NOT RUN | Review-only scope. PrimeNG deps present in `package.json` → imports resolve. Author must confirm `nx build admin-console management-console host-shell` green. |
| Lint | ⚠️ NOT RUN | Author must confirm `nx lint` green for the 3 apps + `falcon` lib. |
| Tests | ❌ FAIL | 0 spec files added (P2). |
| Visual parity | N/A | No source design supplied for this review. |
| Console errors | ⚠️ | 1 intentional `console.error` (P3); no stray logs. |
| Regression risk | ⚠️ Medium | `falcon-multiselect` (shared) modified — additive (+2 html / +8 model); other consumers should be smoke-checked. |

## 10. Final decision

- **Decision: `REQUEST_CHANGES`**
- **Rationale:** 0 × P0, **1 × P1 unresolved** → per decision rule "any unresolved P1 → REQUEST_CHANGES". The P1 is the verbatim duplication of the Template Management shared layer across two Nx apps — a real structural problem with ongoing divergence risk.
- **Required fixes (before merge):**
  1. **[P1]** Promote the shared Template Management layer (models, mappers, API service, reusable sub-components) into `libs/falcon`; leave only app-specific shells per app.
- **Recommended fixes:**
  2. **[P2]** Add automated tests for services, mappers, and the checker/permissions step.
  3. **[P2]** Run a dedicated PES pass on the checker-level / access-registry changes.
  4. **[P2]** Link the Template Management PRD so business rules + lifecycle can be confirmed.
  5. **[P3]** Plan PrimeNG migration when this repo adopts the platform-wide removal.
- **Next action:** Author addresses the P1 duplication and confirms build/lint green; reviewer re-runs the PR Review Governance Skill on the updated branch. P2 items may be tracked as follow-ups if the team accepts the risk explicitly.
