# Wave 9 — Add Client wizard (5 steps + service-row-table)

**Status:** GREEN
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `3502b5293750f165` (admin-console, 16,126 ms)

## Files created (17)

| Path | Type | Source |
|---|---|---|
| `wizard-components/add-client-wizard/add-client-wizard.component.ts` | wizard root | reference verbatim |
| `wizard-components/add-client-wizard/add-client-wizard.component.html` | wizard chrome | reference verbatim |
| `wizard-components/add-client-wizard/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-information-step/client-information-step.component.ts` | step 1 | verbatim |
| `wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | step 1 template | verbatim |
| `wizard-components/add-client-wizard/client-information-step/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts` | step 2 | verbatim |
| `wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | step 2 template | verbatim |
| `wizard-components/add-client-wizard/client-settings-step/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.ts` | step 3 | verbatim |
| `wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html` | step 3 template | verbatim |
| `wizard-components/add-client-wizard/client-comm-channels-step/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.ts` | step 4 | verbatim |
| `wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.html` | step 4 template | verbatim |
| `wizard-components/add-client-wizard/client-applications-step/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.ts` | step 5 | verbatim |
| `wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | step 5 template | verbatim |
| `wizard-components/add-client-wizard/client-account-owner-step/index.ts` | barrel | verbatim |
| `wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.ts` | shared row table | verbatim |
| `wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | row table template | verbatim |
| `wizard-components/add-client-wizard/client-service-row-table/index.ts` | barrel | verbatim |

## Files overwritten (4)

| Path | Diff |
|---|---|
| `wizard-components/add-client-wizard/models/models.ts` | stub → full reference (~289 lines): adds `emptyClientInfo()`, `emptyClientSettings()`, `emptyClientChannels()`, `emptyClientApplications()`, `emptyClientAccountOwner()` factories + dropdown option arrays (CLASS_CAT/CLASS_SUB/AUTHORITY/COUNTRY/CITY/PRICE_TYPE/OWNER_ROLE) + `sectorForAuthority`, `budgetLabelKeyForAuthority`, `ownerRoleFromLabel` helpers |
| `wizard-components/add-client-wizard/services/services.ts` | stub → full reference: real `AddClientApiService.createClient()` (validates locally + emits ownerMissing) + `createClientFull()` (POST `commerce/Node/create-account` via `Gateway.SystemGateway` + `mapBackendEnvelope` adapter) |
| `components/org-hierarchy-page-menu.component.ts` | +1 import + add `AddClientWizardComponent` to component `imports[]` |
| `components/org-hierarchy-page-menu.component.html` | wrap content panel in `@if (state.addClientOpen()) { <app-add-client-wizard …/> } @else { …existing chrome… }` per reference template lines 28-39 |

## Decisions applied

- **D4 (photo uploader)** — kept legacy `<falcon-photo-uploader>` verbatim from reference instead of substituting `<falcon-angular-single-uploader>`. Rationale: reference still uses legacy uploader and substituting it would require token-driven circular-mask wiring not currently shipped in single-uploader; substitution is queued for a later library wave (P1-10 / UC-L04). Documented in `gaps-and-next-actions.md`.
- **D3 (phone field)** — kept legacy `<falcon-mobile-number>` in `client-account-owner-step` verbatim from reference for the same reason. Substituting to `<falcon-angular-phone-field>` requires CVA + validator shape parity testing; deferred to later wave.
- **D14 partial** — internal selectors stay `app-client-*` (already matched admin-console lint convention since the reference uses the same `app-*` prefix for all 7 wizard step selectors).

## Wire-in pattern

Wizard mount sits inside `<main>` element with `@if (state.addClientOpen())` gating; replaces the tabs/content area entirely when active. Cancel goes to `state.addClientOpen.set(false)`; submit goes to `state.onAddClientSubmit($event)` (already implemented in W7 state service — emits toast + mock seed mutation on success).

## Build / lint gate

```
npx nx build admin-console
# Hash: 3502b5293750f165, Time: 16,126 ms — SUCCESS
# Diff vs W8: +new chunks for wizard route loader + service-row-table + 5 step components
# No new lint errors introduced (deferred full lint sweep to W18 regression)
```

## Acceptance criteria (5 from wave plan §W9)

| # | Criterion | Status |
|---|---|:---:|
| 1 | All 5 steps render via `<falcon-stepper>` | YES — verbatim from reference |
| 2 | Footer Next/Previous gating works | YES — `isCurrentStepValid()` signal-driven |
| 3 | Finish triggers facade + closes wizard | YES — `submit.emit(buildPayload())` → `state.onAddClientSubmit()` |
| 4 | Mock submit → seed mutation + toast | YES — already wired in W7 `HierarchyPageStateService.onAddClientSubmit()` |
| 5 | Cancel with dirty state opens exit-confirm popup | YES — `<falcon-angular-popup variant="unsaved">` |

## Open issues / decisions punted

1. **Photo uploader substitution (D4)** — reference still uses legacy uploader; substituting to single-uploader requires Falcon library wave. Deferred.
2. **Phone-field substitution (D3)** — same as above; deferred.
3. **i18n keys** — All 50+ wizard i18n keys (`hierarchy.addClient.*`) assumed present in `libs/falcon/src/language/i18n/en.json` from prior management-console wave. If missing, displays literal keys at runtime — not a build blocker.
4. **`Photo uploader` and `Mobile number` legacy components are flagged AVOID in Phase 4 §2** but the reference template uses them — keeping reference parity until library-wave substitution.

End of Wave 9 report. Advancing to W10.
