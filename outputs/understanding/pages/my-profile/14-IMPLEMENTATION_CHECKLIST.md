*** My Profile — Implementation checklist ***
*** 2026-05-18 ***

# My Profile — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → BR-UM-41 + BR-UM-36
- [ ] 2. Endpoint? → `PUT /api/user/profile` (no id)
- [ ] 3. Hidden tabs? → Role/Status/PermissionGroup
- [ ] 4. OTP endpoints? → `/me/verify-*` (no Q-UM-13)
- [ ] 5. Email+Phone NOT both? → BR-UM-21
- [ ] 6. Username immutable? → BR-UM-19
- [ ] 7. Change Password link? → separate route
- [ ] 8. JWT-based identity? → backend uses claim, not URL

## Frontend tasks

- [ ] Standalone `MyProfileComponent` (NOT reuse UserProfileComponent).
- [ ] Reactive Form for personal info.
- [ ] `<falcon-uploader>` profile picture.
- [ ] `<falcon-input>` × 4 (firstName, lastName, userName-disabled, nationalId).
- [ ] `<falcon-email-field>` with OTP gate.
- [ ] `<falcon-mobile-number>` with OTP gate.
- [ ] OTP modal (shared with Edit User).
- [ ] Change Password navigation link.
- [ ] Save flow → single PUT.
- [ ] No Role/Status/Permissions tabs.
- [ ] BR-UM-21 simultaneous email+phone guard.

## Backend tasks

- [ ] Verify `PUT /api/user/profile` uses JWT-claim user (no `:id`).
- [ ] Verify `/me/verify-*` endpoints work as expected.
- [ ] Verify Kafka events emitted.

## E2E tests

- [ ] User opens My Profile → fields populated from `/me`.
- [ ] User edits firstName → save → success → cache updated.
- [ ] User changes email → OTP modal → verify → save → email + emailVerified=true.
- [ ] User tries to edit username → not allowed (disabled).
- [ ] No Role/Status/Permissions tabs visible.
- [ ] Click Change Password link → navigate to change-password page.

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
