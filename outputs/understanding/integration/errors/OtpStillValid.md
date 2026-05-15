*** Error code — OtpStillValid ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.OtpStillValid`

## Throwing service(s)
- [[Identity Service]] — resend-OTP handler
- [[Commerce Service]] — same code

## HTTP status
- **429** Too Many Requests (Commerce explicit `[ErrorHttpStatus(429)]`)

## Scenario
- Previous OTP is still within its valid window. Resend is rate-limited per PRD-02 verification rules.

## UX handling
- **Disable resend button with a countdown timer** showing seconds remaining until next allowed resend.

## Related V-rule
- [[V-login-lockout-3-wrong-attempts]] (sibling rate-limit family)

## Related E-* entity
- `E-User` · OTP session

## Related flow playbook
- (OTP send/resend flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
