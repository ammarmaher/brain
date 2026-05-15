*** Error code — PasswordTooShort ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.PasswordTooShort`

## Throwing service(s)
- [[Identity Service]] — `PasswordPolicy` (per `ePasswordSecurityLevel`)

## HTTP status
- **422** Unprocessable Entity (inferred)

## Scenario
- Password is shorter than the tenant's configured `PasswordSecurityLevel` minimum length. Per PRD-02 BR-UM-15/20/22/34/37.

## UX handling
- **Inline at password field** with a **live policy hint** listing all required complexity (length, uppercase, lowercase, digit, special).

## Related V-rule
- [[V-password-complexity-per-security-level]] · [[V-password-security-level-enum]]

## Related E-* entity
- `E-User` · `E-TenantSettings.PasswordSecurityLevel`

## Related flow playbook
- (Set Password / Change Password — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
