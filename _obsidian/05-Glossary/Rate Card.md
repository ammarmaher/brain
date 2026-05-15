---
type: glossary-term
term: Rate Card
prd: PRD-03
is-entity: false
created: 2026-05-15
---
*** Glossary — Rate Card ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Rate Card

## English
- **Definition:** Per-CommChannel pricing inside a Contract converting SAR ↔ Points. `RateCardEntry` carries `contractId, commChannelId, priceUnit, priceValueSar`. Backend DTO = `ContractUnitConversionRequest`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- Secondary: DTO mapping section

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]]

## Related concepts
- See also: [[Contract]] · [[CommChannel]] · [[Priority]] · [[Destination]]

## Common confusions
- **Rate Card ↔ ContractDetail** — different. RateCard = SAR↔Points conversion. ContractDetail = matrix cell cost.

## Tags

#type/glossary-term #prd/03 #service/charging #service/commerce #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
