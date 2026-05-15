---
type: glossary-term
term: Master Wallet
prd: PRD-01
is-entity: true
created: 2026-05-15
---
*** Glossary — Master Wallet ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Master Wallet

## English
- **Definition:** An *abstract aggregate* per Account whose value equals `SUM(WalletRecord.valueSar WHERE contract.status = Active)`. No physical "master wallet" row exists. Used as the funding source for CommChannel/App activations and as the canonical lump-sum view of an Account's available balance.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md) entity-level notes + BR-AM-28
- Secondary: imported-business `understanding.md` R5

## Related PRD
- [[01 Account Management]]

## Related backend service
- [[Charging Service]] · [[Commerce Service]]

## Related concepts
- See also: [[Wallet]] · [[Wallet Record]] · [[Contract]] · [[Transfer]]

## Common confusions
- Master Wallet has **no physical row** — its balance is derived.
- On Contract `Expired`, records persist but are subtracted from Master Wallet (BR-AM-38).

## Tags

#type/glossary-term #prd/01 #service/charging #service/commerce #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
