*** Glossary — Contract ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Contract

## English
- **Definition:** The commercial agreement between Falcon and an Account. Carries name (≤50), farabiRefId (≤50), startDate (≥today), expirationDate (>startDate), valueSar (>0), remainingValueSar (auto), and a status machine `Pending → Active → Expired` (auto-derived from dates). Funds the Master Wallet via WalletRecords when Active. Extension to a future date flips `Expired → Active`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md:9` (Contract row)
- Secondary: BR-CC-11 (status) · BR-CC-17 (extension) · BR-CC-40 (Remaining Value)

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related entity
- (no `E-contract.md` yet)

## Related backend service
- [[Commerce Service]] (DTO + handler) · [[Charging Service]] (WalletRecord linkage)

## Related concepts
- See also: [[Rate Card]] · [[Addon]] · [[Quota]] · [[Destination]] · [[Priority]] · [[Wallet Record]] · [[Master Wallet]] · [[Account]]

## Common confusions
- **PRD "Expiration Date" ↔ Backend "EndDate"** — same field, different name. The Commerce DTO uses `EndDate`.
- **`Contract.status` ↔ `User.status` ↔ `CommChannelConfig.status`** — three independent state machines that share the same field name.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
