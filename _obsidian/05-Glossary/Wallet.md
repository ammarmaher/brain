---
type: glossary-term
term: Wallet
prd: PRD-01
is-entity: true
created: 2026-05-15
---
*** Glossary — Wallet ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Wallet

## English
- **Definition:** A bucket of SAR balance owned by an Account, User, or Node. Concrete shapes: `Comm | User | Node | User-Comm | Node-Comm`. `Master` is a *virtual aggregate* (see [[Master Wallet]]). Per-account topology is configured via `WalletTypeConfig`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- Secondary: imported-business `understanding.md`

## Related PRD
- [[01 Account Management]]

## Related backend service
- [[Charging Service]]

## Related concepts
- See also: [[Master Wallet]] · [[Wallet Type]] · [[Balance Type]] · [[Wallet Record]] · [[Transfer]] · [[Contract]]

## Common confusions
- **Wallet ↔ Wallet Record** — Wallet = bucket; WalletRecord = atomic credit-line tagged with a Contract.
- **Wallet ↔ Master Wallet** — Master is abstract aggregate; others are concrete.

## Tags

#type/glossary-term #prd/01 #service/charging #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
