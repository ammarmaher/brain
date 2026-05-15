*** Glossary — Transfer ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Transfer

## English
- **Definition:** The action of moving SAR balance between two wallets within an Account's topology. Concrete entity: `TransferTx` (id, srcWalletId, dstWalletId, amountSar, actorId, at, contractIds[]). Allowed source-×-destination pairs follow a strict matrix (Master ↔ Comm, Comm ↔ User/Node, User ↔ User). Subject to [[Account Limitations]] balance-transfer-limit-percent.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:17` (TransferTx row)
- Secondary: imported-business `understanding.md:64-69`

## Related PRD
- [[01 Account Management]]

## Related backend service
- [[Charging Service]]

## Related concepts
- See also: [[Wallet]] · [[Wallet Record]] · [[Master Wallet]] · [[Account Limitations]] · [[Account Owner]] · [[Node Admin]]

## Common confusions
- **Transfer ↔ Wallet Record** — Transfer is the *action*; WalletRecord is the *result* (a new credit-line tagged with the source contract ID).
- Balance-transfer-limit-percent enforcement baseline (source wallet balance? per day? per action?) is **PRD-unclear** (Q-AM-7).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
