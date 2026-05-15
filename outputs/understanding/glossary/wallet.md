*** Glossary — Wallet ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Wallet

## English
- **Definition:** A bucket of SAR balance owned by an Account, User, or Node. Concrete shapes: `Comm | User | Node | User-Comm | Node-Comm`. `Master` is a *virtual aggregate* (see [[Master Wallet]]). The Wallet topology per account is configured via `WalletTypeConfig` (Balance Type × Wallet Type).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:15` (Wallet row)
- Secondary: imported-business `understanding.md:110`

## Related PRD
- [[01 Account Management]]

## Related entity
- (no `E-wallet.md` yet — wallet entities owned by [[Charging Service]])

## Related backend service
- [[Charging Service]]

## Related concepts
- See also: [[Master Wallet]] · [[Wallet Type]] · [[Balance Type]] · [[Wallet Record]] · [[Transfer]] · [[Contract]]

## Common confusions
- **Wallet ↔ Wallet Record** — Wallet is the bucket; WalletRecord is one atomic credit-line inside it, tagged with a Contract.
- **Wallet ↔ Master Wallet** — Master is the *abstract* aggregate of WalletRecords from Active contracts; other wallets are *concrete*.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
