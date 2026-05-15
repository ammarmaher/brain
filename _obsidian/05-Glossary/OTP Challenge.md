---
type: glossary-term
term: OTP Challenge
prd: PRD-02
is-entity: true
created: 2026-05-15
---
*** Glossary — OTP Challenge ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# OTP Challenge

## English
- **Definition:** A per-purpose one-time-password session. Channel = `Email | Sms`; expires in 60s; purpose = `login | first-login | edit-email | edit-phone | forgot-password`. State: `Active → Verified / Expired / Failed`. Length (4 or 6 digits) is configurable in AppSettings.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- Secondary: `eDeliveryMethod` + `eAuthenticationStage`

## Related PRD
- [[02 User Management]]

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Session]] · [[Password Security Level]]

## Common confusions
- OTP length is configurable.

## Tags

#type/glossary-term #prd/02 #service/identity #gap #security

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
