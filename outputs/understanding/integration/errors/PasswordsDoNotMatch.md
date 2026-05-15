*** Error code — PasswordsDoNotMatch ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.PasswordsDoNotMatch`

## Throwing service(s)
- [[Identity Service]] — set/change password handler

## HTTP status
- **422** Unprocessable Entity (inferred)

## Scenario
- Confirm-password doesn't equal Password.

## UX handling
- **Inline at confirm field** + live compare on every keystroke to avoid the round-trip.

## Related V-rule
- [[V-password-complexity-per-security-level]]

## Related E-* entity
- `E-User`

## Related flow playbook
- (Set Password / Change Password — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
