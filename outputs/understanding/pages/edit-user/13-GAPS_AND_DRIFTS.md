*** Edit User — Gaps & drifts ***
*** SoT for open questions, PRD↔backend drift, anti-patterns · 2026-05-17 ***

# Edit User — Gaps & Drifts

> Open business/technical questions that block confident implementation. Each must be resolved before code lands.

## Critical halts (block implementation)

### GAP-UM-21 / Q-UM-13 — Admin OTP path for editing another user's email/phone

[PRD] BR-UM-36 says "Email and Phone need OTP to change", but PRD does not specify whether:
- The OTP code goes to the **target user's** new email/phone (most likely), OR
- The OTP code goes to the **admin's** email/phone (admin attestation flow), OR
- Falcon admins bypass OTP entirely (admin override).

Current endpoints (`POST /api/user/me/verify-email`) operate on the CURRENT logged-in user. **No `POST /api/user/{id}/verify-email` endpoint exists.**

**Status:** Q-UM-13 OPEN. Halt-and-flag.

**Pending-question file:** `Brain Outputs/datasets/authority-dataset/_pending-questions/wave-4-edit-user-Q-UM-13.md` (will write below).

**Halt rationale per DECISION-PROTOCOL F-010:** PRD contradiction — must resolve before implementing.

## High-severity gaps (need decision before launch)

### GAP-UM-22 — Email AND Phone NOT both at once (BR-UM-21) NOT enforced in old-UI

[PRD] `BUSINESS_RULES.md:41`: "Email and Phone cannot be edited in the SAME save request."

[CODE] `apps/host-shell/.../user-profile.component.ts:343` `isSaveDisabled` — does NOT check this. Old-UI relies on backend to reject.

**Fix:** Add FE guard:

```typescript
if (this.emailChanged && this.phoneChanged) {
  return true;  // disable save
}
```

Plus inline error: "Update email and phone separately."

### GAP-UM-23 — Username display in Edit User must be lock-iconed + disabled

[PRD] BR-UM-19: "Username is immutable after create."

Old-UI: input is NOT disabled · NO lock icon · BE rejects any change. New UI MUST: `<falcon-input [disabled]="true">` + lock icon prefix + gray text color.

### GAP-UM-24 — Permission tab is WIP

[CODE] `user-profile.component.ts:308-310`: `canEditPermissionGroup = false`.

PermissionsPrivilegeStepComponent has hardcoded options (Admin/Editor/Viewer) and is NOT in the active stepper. New UI implementation:
- Needs PES catalog endpoint (TBD)
- Needs backend PUT field on `UpdateUserProfileByIdRequest`

### GAP-UM-25 — OTP expiry drift between PRD and code

[PRD] BR-UM-26: "OTP validity is 60s."
[CODE] `@falcon` constant `OTP_DEFAULTS.EXPIRY_SECONDS = 120` (used by `ProfileOtpModal`).

**Question:** is the 120s in code wrong, or has PRD been superseded? Likely PRD is older — code is newer truth. Flag for product confirmation.

### GAP-UM-26 — Kafka events from Identity NOT documented in backend dossier

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md` — no Kafka publisher inventory. The expected events (`identity.user-updated.v1`, `identity.user-status-changed.v1`, `identity.user-role-changed.v1`, `identity.contact-verified.v1`) are inferred. **Verify by inspecting Identity Service source for `IPublishEndpoint` or `IBus.Publish` calls.**

## Medium-severity gaps

### GAP-UM-27 — Status dropdown not filtered by BR-UM-08 transitions in old-UI

[CODE] `user-profile.component.ts:1116`: `statusOptions = Helper.enumToOptions(UserStatus, UserStatusI18n)` — full enum minus 'none', no filter.

Old-UI shows ALL statuses and relies on backend reject. New UI should pre-filter per the FROM-status transition matrix.

### GAP-UM-28 — Partial-save recovery UX missing

If profile save succeeds but role change fails, old-UI shows the role error, but the FE local cache is stale because `originalProfile` wasn't updated for the successful profile change. User has to manually refresh.

New UI: on partial failure, update `originalProfile` for the successful steps, then surface a banner: "Profile saved. Role change failed: <message>. Retry?"

### GAP-UM-29 — Deleted → Active restoration UX

[PRD] BR-UM-08: Deleted→Active is Falcon-only. [PRD] BR-UM-46 OPEN: "whether original password still works, or user is re-sent credentials, is silent."

Pending product decision. Likely: re-send credentials (treat like fresh first-login).

### GAP-UM-30 — Account Owner demotion silent

If admin changes Account Owner role to something else, what happens to AO singleton constraint? Does the account become AO-less? Is a new AO required atomically?

Flag as Q-UM-AO-DEMOTE. Likely answer: reject with `Error.Account.MustHaveAccountOwner`.

### GAP-UM-31 — RoleCatalogService bypasses gateway

[CODE] `role-catalog.service.ts:39-43`: prepends `envConfig.baseURLPes` directly OR falls back to relative `pes/roles` — bypasses gateway-context system.

This means roles don't traverse the System Gateway → can't enforce per-tenant filtering at gateway layer. Fix: route via `useGateway()` like other Identity calls.

### GAP-UM-32 — Anti-pattern: template-driven NgForm

[CODE] `user-profile.component.ts:96-100`: ViewChild `personalForm: NgForm`. Uses template-driven `[(ngModel)]` bindings.

Per [F-022], new UI MUST use Reactive Forms (`FormBuilder` + `FormGroup`).

### GAP-UM-33 — Anti-pattern: PrimeNG components in dialog/inputs

Heavy PrimeNG usage:
- `<p-select>` × 3 (status, role, permissionGroup)
- `<p-inputtext>` × N
- `<p-confirmDialog>` × 1
- `<p-dialog>` × 1 (OtpModal shell)
- `<p-input-group>` × 1 (Verify chip layout)
- `<p-inputOtp>` × 1

Per [F-016], new UI MUST use Falcon UI Core (`<falcon-*>`).

## Low-severity / cosmetic

### GAP-UM-34 — OTP endpoint trailing slash inconsistency

[CODE] `profile-otp.service.ts:33-35` — send endpoints `/user/me/verify-phone` (leading slash) vs confirm `user/me/verify-phone/confirm` (no leading slash). Cosmetic; `RuntimeBaseUrlInterceptor` likely normalizes.

### GAP-UM-35 — Email masking pattern

[CODE] `profile-otp-modal.component.ts:111-122`: email mask is `t**@example.com` (first char + 2 stars + @). This reveals first letter — possibly too permissive. Common pattern is `t*****@example.com` (first char + 5 stars before @). Cosmetic decision.

### GAP-UM-36 — Profile picture format/size silent in PRD

[PRD] BR-UM-48 OPEN. Code enforces 4MB + `image/*`. No PRD mention of format whitelist (jpg/png/gif/webp), no PRD mention of dimensions, no PRD mention of crop/resize.

## Pending-questions to write

I will create these files in `Brain Outputs/datasets/authority-dataset/_pending-questions/`:

1. **`wave-4-edit-user-Q-UM-13.md`** — Admin OTP path for editing another user's contact (HIGH severity halt).

## Drift summary

| Drift | PRD says | Code does | Resolution |
|---|---|---|---|
| OTP expiry | 60s (BR-UM-26) | 120s (`@falcon` const) | Code is newer; update PRD |
| Email+Phone simultaneous edit | Reject (BR-UM-21) | FE accepts; BE rejects | Add FE guard |
| Status dropdown options | Filter per BR-UM-08 | Full enum | FE filter |
| Username editing | Forbid (BR-UM-19) | Input editable; BE rejects | FE: `[disabled]="true"` |
| Deleted restoration | Falcon only | (not enforced FE) | FE filter status dropdown by `session.userType` |

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
