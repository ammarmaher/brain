*** Glossary — Wallet Record ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Wallet Record

## English
- **Definition:** An atomic credit record inside a Wallet, tagged with a specific Contract. The load-bearing entity for contract linkage. Survives Contract Expired status (records persist) but is excluded from Master Wallet lump-sums when its contract is not Active. Nearest-expiring traversal unit when deductions occur.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:16` (WalletRecord row)
- Secondary: PRD-03 ENTITIES.md (WalletRecord cross-reference)

## Related PRD
- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Charging Service]]

## Related concepts
- See also: [[Wallet]] · [[Master Wallet]] · [[Contract]] · [[Transfer]]

## Common confusions
- **Wallet Record ↔ Wallet** — Wallet is the bucket; WalletRecord is the atomic credit-line inside it tagged with a Contract.
- **Wallet Record ↔ Transfer Tx** — TransferTx moves balance between wallets (and tags destination records with source contract IDs); WalletRecord is the credit ledger entry itself.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
