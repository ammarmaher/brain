*** Glossary — Master Wallet ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Master Wallet

## English
- **Definition:** An *abstract aggregate* per Account whose value equals `SUM(WalletRecord.valueSar WHERE contract.status = Active)`. No physical "master wallet" row exists — it is computed. Used as the funding source for CommChannel/App activations and as the canonical lump-sum view of an Account's available balance.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:37` (entity-level notes) + BR-AM-28
- Secondary: imported-business `understanding.md:46` (R5)

## Related PRD
- [[01 Account Management]]

## Related backend service
- [[Charging Service]] (computes) · [[Commerce Service]] (consumes for activations)

## Related concepts
- See also: [[Wallet]] · [[Wallet Record]] · [[Contract]] · [[Transfer]]

## Common confusions
- Master Wallet has **no physical row** — its balance is derived. Do not model it as a `Wallet` of `type=master` with persisted `valueSar`.
- On Contract `Expired`, the records persist but are subtracted from the Master Wallet lump-sum (BR-AM-38 / BR-CC-38).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
