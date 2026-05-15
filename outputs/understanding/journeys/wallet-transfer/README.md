*** Journey — Wallet Transfer ***
*** Folder index · 2026-05-15 ***
*** Crosses: Wallet · Master / CommChannel / User / Node · Source-destination matrix ***

# Wallet Transfer — folder index

> A Falcon-side admin or an AO/Node Admin moves balance between wallet aggregates following the source-destination matrix: Master ↔ CommChannel · CommChannel ↔ User/Node · User ↔ User · Master Wallet exempt from Balance Transfer Limit %. The transfer is bounded by [[V-charging-transfer-source-destination]] (which-from-which-to rules) and the account's Balance Transfer Limit % ([[V-account-limits-zero-means-no-limit]]).

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** A user with transfer permission opens the Wallet page → picks Source + Destination + Amount → confirms.
- **Outcome:** Source wallet debited; destination wallet credited; ledger entries written; both balances refreshed in the UI.
- **Pages traversed:** Wallet → Transfer form → Wallet (refreshed).
- **Flow playbooks used:** [[Transfer Wallet Flow]] (forward-ref) · [[Wallet View Flow]] (forward-ref).
- **Services exercised:** Charging (primary) → Commerce (read account settings) → Access PES.
- **Kafka events fired:** `charging.transfer-completed.v1` (forward-ref) · `commerce.wallet-balance-changed.v1` (forward-ref).

## Cross-journey relations

- **Depends on:** Both wallets exist; both sit on the **same Account** (cross-account transfers are not allowed in this matrix).
- **Triggers downstream:** None directly — but a Transfer that funds a user wallet enables that user's subsequent [[Send Campaign]].
- **Sibling:** Wallet refill via contract activation is the orthogonal way wallets gain funds (see [[Renew Contract]]).

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
