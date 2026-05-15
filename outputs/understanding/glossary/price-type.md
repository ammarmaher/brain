*** Glossary — Price Type ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Price Type

## English
- **Definition:** The pricing cadence on a `CommChannelConfig` or `AppConfig`. Enum: `Monthly | Yearly | One Time Payment`. Drives renewal date arithmetic and grace-period length (Monthly = 7 days; Yearly / OneTime = 30 days).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:48` (BR-AM-16)
- Secondary: imported-business `understanding.md:49` (R8)

## Related PRD
- [[01 Account Management]]

## Related entity
- [[E-comm-channel-config]] · [[E-app-config]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]]

## Related concepts
- See also: [[CommChannel]] · [[Application]] · [[Price Value]] · [[Visibility]]

## Common confusions
- **PRD wording: "Price Type" vs DTO field "PricingType"** — same concept, different casing. Use `Price Type` in PRD discussions; the backend DTO field is `pricingType`.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
