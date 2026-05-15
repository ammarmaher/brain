*** Glossary — Application ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Application (App)

## English
- **Definition:** A higher-level Falcon product (e.g. AI, Nabaa) offered to an Account. Each Account has a per-app `AppConfig` with the same shape as `CommChannelConfig`: Visibility, Pricing Type, Price Value, lifecycle status (`InActive → Paid → Active → Expired → Disabled`).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:14` (AppConfig)
- Secondary: PRD-03 ENTITIES.md (ContractDetail has applicationId)

## Related PRD
- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related entity
- [[E-app-config]]

## Related backend service
- [[Commerce Service]] · [[Provisioning Service]]

## Related concepts
- See also: [[CommChannel]] · [[Visibility]] · [[Price Type]] · [[Price Value]]

## Common confusions
- **Application ↔ CommChannel** — Both share `AppConfig` / `CommChannelConfig` shape. Application is the app product; CommChannel is the bearer.
- **Application ↔ ContractDetail.applicationId** — A Contract's ContractDetail row references the Application to bind a per-cell cost (`Application × CommChannel × Priority × Destination`).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
