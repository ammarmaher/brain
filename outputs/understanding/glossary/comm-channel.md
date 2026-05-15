*** Glossary — CommChannel ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# CommChannel

## English
- **Definition:** A communication channel offered by Falcon (e.g. SMS, WhatsApp, Voice, Email). Each Account has a per-channel `CommChannelConfig` carrying Visibility (Hide/Show), Pricing Type, Price Value, and a status machine (`InActive (First Time) → Paid → Active → Expired → InActive (Grace Period Ends) → Disabled`).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:13` (CommChannelConfig)
- Secondary: PRD-03 ENTITIES.md (RateCardEntry per CommChannel) · PRD-05 ENTITIES.md (Template per CommChannel)

## Related PRD
- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]] · [[05 Templates]]

## Related entity
- [[E-comm-channel-config]]

## Related backend service
- [[Commerce Service]] (config) · [[Charging Service]] (consumption) · [[Provisioning Service]]

## Related concepts
- See also: [[Application]] · [[Visibility]] · [[Price Type]] · [[Price Value]] · [[Wallet]] · [[Master Wallet]] · [[Rate Card]] · [[Priority]] · [[Template]]

## Common confusions
- **CommChannel ↔ Application** — Both are billable categories with the same Config shape. CommChannel = communication-bearer (SMS, WhatsApp, Voice). Application = higher-level app product (AI, Nabaa). Don't mix.
- **CommChannel ↔ CommChannelConfig** — CommChannel is the master/catalog entity; CommChannelConfig is the per-account row that configures one CommChannel for one Account.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
