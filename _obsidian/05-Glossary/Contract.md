---
type: glossary-term
term: Contract
prd: PRD-03
is-entity: false
created: 2026-05-15
---
*** Glossary — Contract ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Contract

## English
- **Definition:** The commercial agreement between Falcon and an Account. Status `Pending → Active → Expired` (auto from dates). Funds Master Wallet via WalletRecords when Active. Extension flips `Expired → Active`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- Secondary: BR-CC-11, BR-CC-17, BR-CC-40

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]]

## Related concepts
- See also: [[Rate Card]] · [[Addon]] · [[Quota]] · [[Destination]] · [[Priority]] · [[Wallet Record]] · [[Master Wallet]] · [[Account]]

## Common confusions
- **PRD "Expiration Date" ↔ Backend "EndDate"** — same field.
- `status` field name shared with User, CommChannelConfig — different state machines.

## Tags

#type/glossary-term #prd/03 #service/charging #service/commerce #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
