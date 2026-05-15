*** Glossary — CommChannel ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# CommChannel

## English
- **Definition:** A communication channel offered by Falcon (e.g. SMS, WhatsApp, Voice, Email). Each Account has a per-channel `CommChannelConfig` carrying Visibility, Pricing Type, Price Value, and a status machine (`InActive (First Time) → Paid → Active → Expired → InActive (Grace Period Ends) → Disabled`).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- Secondary: PRD-03 + PRD-05 ENTITIES.md

## Related PRD
- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]] · [[05 Templates]]

## Related entity
- [[E-comm-channel-config]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]] · [[Provisioning Service]]

## Related concepts
- See also: [[Application]] · [[Visibility]] · [[Price Type]] · [[Price Value]] · [[Wallet]] · [[Master Wallet]] · [[Rate Card]] · [[Priority]] · [[Template]]

## Common confusions
- **CommChannel ↔ Application** — Same Config shape, different entities. CommChannel = bearer (SMS/WhatsApp/Voice). Application = app product (AI/Nabaa).
- **CommChannel ↔ CommChannelConfig** — CommChannel = catalog master; CommChannelConfig = per-account row.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
