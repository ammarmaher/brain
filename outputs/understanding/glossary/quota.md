*** Glossary — Quota ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Quota

## English
- **Definition:** The free-credit half of an Addon. Backend DTO `ContractQuotaRequest`: `QuotaCode, ChannelId, IncludedAmount, IncludedUnits, Unit, QuotaCategory, QuotaType, Scope, SubService?`. Represents the bundled allowance a client gets before overage rates apply.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md:55` (DTO mapping)
- Secondary: PRD-03 ENTITIES.md `Addon` row

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]]

## Related concepts
- See also: [[Addon]] · [[Contract]] · [[CommChannel]]

## Common confusions
- Quota is the **free-credit** side; the **overage** side is the rate card half of the Addon (`ContractOverageRateRequest`).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
