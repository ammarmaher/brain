*** Glossary — OTP Challenge ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# OTP Challenge

## English
- **Definition:** A per-purpose one-time-password session issued to a User. Carries id, userId, channel (`Email | Sms`), destination, code, `expiresAt` (60s), attempt counter, resend counter, and purpose (`login | first-login | edit-email | edit-phone | forgot-password`). State machine: `Active → Verified / Expired / Failed`. OTP length (4 or 6) is configurable in AppSettings.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:12` (OtpChallenge row)
- Secondary: PRD-02 ENTITIES.md `eDeliveryMethod` + `eAuthenticationStage`

## Related PRD
- [[02 User Management]]

## Related entity
- (no `E-otp.md` yet)

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Session]] · [[Password Security Level]]

## Common confusions
- **OTP Length** is **configurable** by Operation user (`OtpAppSetting.otpLength`) — typically 4 or 6 digits.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
