*** Error code — InvalidVerificationCode ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InvalidVerificationCode`

## Throwing service(s)
- [[Identity Service]] — OTP / email verification handlers
- [[Commerce Service]] — surfaces this when its handlers receive the rejection

## HTTP status
- **422** Unprocessable Entity (Commerce explicit; Identity inferred)

## Scenario
- OTP / email verification code is wrong. PRD-02 verification rules.

## UX handling
- **Inline at OTP field** + clear the field and let the user retry.
- After N attempts, the verification rate-limit policy may lock the OTP entirely (`OtpStillValid` countdown or generic lock).

## Related V-rule
- [[V-login-lockout-3-wrong-attempts]] (sibling rate-limit family)

## Related E-* entity
- `E-User`

## Related flow playbook
- (OTP verify flow + Email verify flow — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
