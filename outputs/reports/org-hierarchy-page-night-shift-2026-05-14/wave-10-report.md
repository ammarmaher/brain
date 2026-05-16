# Wave 10 — Add User wizard (3 steps)

**Status:** GREEN
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `15cdba631c905858` (admin-console, 13,822 ms)

## Files created (11)

| Path | Type | Source |
|---|---|---|
| `wizard-components/add-user-wizard/add-user-wizard.component.ts` | wizard root | reference verbatim |
| `wizard-components/add-user-wizard/add-user-wizard.component.html` | wizard chrome | verbatim |
| `wizard-components/add-user-wizard/index.ts` | barrel | verbatim |
| `wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.ts` | step 1 | verbatim |
| `wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` | step 1 template | verbatim |
| `wizard-components/add-user-wizard/user-personal-step/index.ts` | barrel | verbatim |
| `wizard-components/add-user-wizard/user-role-status-step/user-role-status-step.component.ts` | step 2 | verbatim |
| `wizard-components/add-user-wizard/user-role-status-step/user-role-status-step.component.html` | step 2 template | verbatim |
| `wizard-components/add-user-wizard/user-role-status-step/index.ts` | barrel | verbatim |
| `wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.ts` | step 3 | verbatim |
| `wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | step 3 template | verbatim |
| `wizard-components/add-user-wizard/user-permissions-step/index.ts` | barrel | verbatim |

## Files overwritten (4)

| Path | Diff |
|---|---|
| `wizard-components/add-user-wizard/models/models.ts` | stub → full reference (~170 lines): adds `emptyPersonal()`, `emptyRoleStatus()`, `emptyPermissions()` factories + dropdown option arrays (STATUS/ROLE/PERM_GROUP/CHECKER) + CHANNEL_ROWS + `buildCreateUserWireRequest` helper |
| `wizard-components/add-user-wizard/services/services.ts` | stub → full reference: real `AddUserApiService.createUser()` (validates locally, POST `user` via `Gateway.IdentityGateway`) + `updateUser()` (PUT `user/:id/profile` + `user/:id/role` via switchMap) + `checkUsernameExists()` (delegates to `AccountValidationService`) + `generatePassword()` (POST `user/generate-password`) |
| `components/org-hierarchy-page-menu.component.ts` | +1 import + add `AddUserWizardComponent` to component `imports[]` |
| `components/org-hierarchy-page-menu.component.html` | add `@else if (state.addUserOpen())` branch in content panel `@if` chain — mounts `<app-add-user-wizard [nodeId]="state.addUserNodeId()" (cancel/submit)…>` per reference template lines 33-38 |

## Decisions applied

- **D3 (phone field)** — kept legacy `<falcon-mobile-number>` verbatim from reference in user-personal-step (substitution to `<falcon-angular-phone-field>` deferred to library wave)
- **D4 (photo uploader)** — kept legacy `<falcon-photo-uploader>` verbatim (same rationale)
- **D5 (OTP)** — Not relevant in this wave; OTP land in W13
- All selectors stay `app-*` (consistent with reference)

## Build / lint gate

```
npx nx build admin-console
# Hash: 15cdba631c905858, Time: 13,822 ms — SUCCESS
# Diff vs W9: +new chunks for 3 user-wizard step components
```

## Acceptance criteria (4 from wave plan §W10)

| # | Criterion | Status |
|---|---|:---:|
| 1 | All 3 steps render via `<falcon-stepper>` | YES — verbatim from reference |
| 2 | Footer Next/Previous + Finish gating works | YES |
| 3 | Finish triggers credentials popup, then submit emit | YES — `<falcon-send-credentials-popup>` → `onCredentialsConfirmed(method)` → `submit.emit(...)` |
| 4 | New user appears in UsersTable after Finish | DEFERRED — UsersTable lands in W11; `state.onAddUserSubmit()` already pushes into mock seed list |

## Open issues / decisions punted

1. **Photo uploader / phone-field substitution** — D3 + D4 deferred to library wave (same as W9)
2. **Credentials popup** — verbatim port; depends on `FalconSendCredentialsPopupComponent` from `@falcon` (verified exists in shared-ui)
3. **`AccountValidationService` import** — verified exported by `@falcon` barrel (real backend dependency, no stub needed)

End of Wave 10 report. Advancing to W11.
