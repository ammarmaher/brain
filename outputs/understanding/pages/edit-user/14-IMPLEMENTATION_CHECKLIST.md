*** Edit User — Implementation checklist ***
*** SoT for FE/BE/full-stack task list · 2026-05-17 ***

# Edit User — Implementation Checklist

> Pre-code verification gate + FE/BE/full-stack task lists. Tick before claiming done.

## Verification gate (answer ALL before producing code)

- [ ] 1. Which PRD lines does this flow implement? → BR-UM-36..40 + BR-UM-21 + BR-UM-08
- [ ] 2. Which backend endpoints will I call? → 1 GET (load) + 3 PUT (profile/status/role) + 4 POST (OTP send/confirm × 2 channels)
- [ ] 3. What is the exact request DTO shape for each endpoint? → See [08-BACKEND_API](08-BACKEND_API.md)
- [ ] 4. What validation will the backend enforce? → See [07-VALIDATIONS](07-VALIDATIONS.md)
- [ ] 5. What V-rule wiki-links apply? → V-user-first-last-name-letters-only · V-username-format-uniqueness-immutable · V-email-valid-format · V-phone-valid-format · V-email-or-phone-not-both · V-otp-required-on-email-change · V-otp-required-on-phone-change · V-status-transition-allowed · V-role-change-allowed · V-normal-user-limit-on-role-change · V-profile-picture-mime · V-profile-picture-size-4mb
- [ ] 6. What Falcon components am I composing? → `<falcon-tabs>`, `<falcon-input>`, `<falcon-select>`, `<falcon-uploader>`, `<falcon-dialog>`, `<falcon-otp>`, `<falcon-button>`, `<falcon-confirm-dialog>`, `<falcon-mobile-number>`
- [ ] 7. Which permission roles can edit which target roles? → PES `userRole.other(srcKey, tgtKey)` matrix
- [ ] 8. What entity drift do I need to handle? → Q-UM-13 admin OTP path · GAP-UM-22 email+phone simultaneous · GAP-UM-25 OTP expiry drift

## Pre-flight resolutions

- [ ] **HALT**: Q-UM-13 resolved by Product? → If not, implement Falcon-admin bypass OR halt entirely.
- [ ] **HALT**: PermissionGroup catalog endpoint identified or designed?

## Frontend task list

### Setup

- [ ] Generate component shell: `apps/admin-console/.../user-edit-page/` or `right-pane-details-view` per design.
- [ ] Wire route: `/users/:id/edit` OR opens via right-pane drawer from Org Hierarchy.
- [ ] Inject services: `UserApiService`, `SessionProvider`, `AccessControlFacade`, `FalconToastService`, `FalconConfirmService`, `RoleCatalogService`, `ProfileOtpService`.

### Data load

- [ ] On open: `forkJoin([GET /api/user/{id}, GET /pes/roles?targetUserType=&tenantId=])`
- [ ] PES bulk-warmup: `accessControlFacade.ensure([userRole.other(srcKey, optKey)] for all options)`
- [ ] Map `UserResponse` → `UserProfile` shape ([CODE] `user-profile.service.ts:`).
- [ ] Set `originalProfile` (immutable snapshot for diff).

### Personal Info tab

- [ ] `<falcon-uploader>` bound to `profilePictureInfo` signal. `accept=image/*` · `maxSize=4MB`.
- [ ] `<falcon-input>` firstName + lastName · validators `[required, lettersOnly, max(50)]`.
- [ ] `<falcon-input>` userName · `[disabled]="true"` + lock icon prefix.
- [ ] `<falcon-email-field>` composite — email + Verify chip + ProfileOtpModal trigger.
- [ ] `<falcon-mobile-number>` for phone · E.164 + Verify chip.
- [ ] `<falcon-input>` nationalId.
- [ ] `emailChanged` / `phoneChanged` computed signals.
- [ ] `emailNeedsVerification` / `phoneNeedsVerification` computed signals.
- [ ] **GAP-UM-22 FIX**: add FE guard for email+phone simultaneous edit.

### Role & Status tab

- [ ] `<falcon-select>` status — options filtered by BR-UM-08 transitions FROM current status + by `session.userType` for Deleted→Active.
- [ ] `<falcon-select>` role — options filtered by PES `userRole.other`.
- [ ] Disable status dropdown if `!canEditStatus` (self-edit mode).
- [ ] Disable role dropdown if `!canEditRole`.

### Permissions tab

- [ ] **HALT until GAP-UM-24 resolved**: design PG catalog source + wire dropdown.

### OTP modal

- [ ] `<falcon-dialog>` shell · `<falcon-otp [length]="6">` input.
- [ ] State machine: Sending → Input → Verifying → Success/Error/Expired.
- [ ] Timer countdown bound to 120s (per [GAP-UM-25] confirm: code or PRD?).
- [ ] Resend button enabled after expiry.
- [ ] Masked value display (`t**@example.com` / `****1234`).

### Save flow

- [ ] Diff computation: `personalInfoChanged`, `statusChanged`, `roleChanged`.
- [ ] Dispatch chain: `profileUpdate$ → switchMap(statusUpdate$) → switchMap(roleUpdate$)`.
- [ ] On success: refresh local cache · `<falcon-toast>` success · navigate to View mode.
- [ ] On failure mid-chain: re-fetch `GET /api/user/{id}` · surface error · update `originalProfile` for successful steps (GAP-UM-28 fix).

### Profile picture

- [ ] Upload: MIME + size validators.
- [ ] Delete: `<falcon-confirm-dialog>` (key='deleteProfilePicture').
- [ ] `URL.revokeObjectURL` on destroy.

### Toasts & error states

- [ ] Use `FalconToastService` (NOT `FalconMessageService` — deprecated).
- [ ] Per-error mapping per [12-ERROR_STATES](12-ERROR_STATES.md).

### Cleanup

- [ ] No SCSS — Tailwind utility classes only [F-017].
- [ ] No `*ngIf` / `*ngFor` — use `@if` / `@for` [F-018].
- [ ] No PrimeNG — Falcon UI Core only [F-016].
- [ ] No template-driven NgForm — Reactive Forms only [F-022].
- [ ] No raw `#fff` / `bg-white` — use `bg-falcon-neutral-0` token.
- [ ] Aria-label on Verify chips + OTP input fields.

## Backend task list

### Identity Service

- [ ] **HALT (Q-UM-13)**: Decide admin OTP path. If "add new endpoints":
  - [ ] `POST /api/user/{id}/verify-email` (admin-initiated email verification)
  - [ ] `POST /api/user/{id}/verify-phone`
  - [ ] `POST /api/user/{id}/verify-email/confirm`
  - [ ] `POST /api/user/{id}/verify-phone/confirm`
  - [ ] Update FE OTP modal to use these for admin-edit flow.
- [ ] **GAP-UM-21 / BR-UM-21**: Add server validation: reject `UpdateUserProfileByIdRequest` if BOTH email and phone diff from stored.
- [ ] **GAP-UM-23**: Confirm `UserName` immutability rejection (already enforced? verify).
- [ ] **GAP-UM-24**: Add `PermissionGroup` field to `UpdateUserProfileByIdRequest`.
- [ ] **GAP-UM-26**: Document Kafka events emitted by Identity (`user-updated`, `user-status-changed`, `user-role-changed`, `contact-verified`).
- [ ] Verify Zitadel sync direction for status changes (Active/Suspended/Locked/Deleted → Zitadel state).

### Commerce Service

- [ ] Consume `identity.user-status-changed.v1` → recompute Normal-User count per account.
- [ ] Consume `identity.user-role-changed.v1` → same.

### PES Service

- [ ] Consume `identity.user-role-changed.v1` → invalidate user's decision cache.
- [ ] Consume `identity.user-status-changed.v1` → same.

### Notifications Service

- [ ] Consume `identity.contact-verified.v1` → audit log.

## Full-stack task list (E2E)

- [ ] E2E test: admin edits user's first/last name → save → user list reflects new name immediately.
- [ ] E2E test: admin edits email → OTP modal → enter code → save → Zitadel reflects new email.
- [ ] E2E test: admin tries simultaneous email+phone edit → blocked with FE error AND BE rejection.
- [ ] E2E test: AO suspends a Normal User → user can't log in · user is force-logged-out.
- [ ] E2E test: Falcon admin restores Deleted user → user becomes Active · counts toward limit.
- [ ] E2E test: admin tries to make 6th user Normal User when limit is 5 → rejected with `NormalUserLimitReached`.
- [ ] E2E test: admin changes role to Account Owner when one exists → rejected with `AccountOwnerAlreadyExists`.

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
