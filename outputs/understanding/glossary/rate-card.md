*** Glossary — Rate Card ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Rate Card

## English
- **Definition:** Per-CommChannel pricing inside a Contract that converts SAR ↔ Points. Each `RateCardEntry` carries `contractId, commChannelId, priceUnit, priceValueSar`. Maps to backend DTO `ContractUnitConversionRequest` (Code, Name, PriceUnit, RatingUnit, PriceValue).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md:10` (RateCardEntry row)
- Secondary: PRD-03 ENTITIES.md (DTO mapping section)

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Commerce Service]] (DTO) · [[Charging Service]] (consumption)

## Related concepts
- See also: [[Contract]] · [[CommChannel]] · [[Priority]] · [[Destination]]

## Common confusions
- **Rate Card ↔ ContractDetail** — RateCard converts SAR↔Points per CommChannel. ContractDetail is one cell of the `Application × CommChannel × Priority × Destination` cost matrix. Different concerns, sometimes both called "pricing tables".

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
