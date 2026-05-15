*** Error code — UserLocked ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.UserLocked`

## Throwing service(s)
- [[Identity Service]] — `LoginEligibilityPolicy` after 3 wrong attempts (per PRD-02 BR-UM-25..27)
- [[Commerce Service]] — also catalogues this code; surfaces it when its handlers receive the lockout state

## HTTP status
- **423** Locked (Commerce explicit `[ErrorHttpStatus(423)]`; non-standard HTTP status reserved for this case)

## Scenario
- Three consecutive wrong-password attempts trigger an account lock per PRD-02. Lock duration and unlock path are defined by Zitadel policy on the tenant.

## UX handling
- **Banner** on login page: "Your account has been locked. Please contact your administrator." (per PRD-02 BR-UM-26).
- Login form disabled.

## Related V-rule
- [[V-login-lockout-3-wrong-attempts]]

## Related E-* entity
- `E-User`

## Related flow playbook
- (Login flow — not yet a dedicated playbook)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
