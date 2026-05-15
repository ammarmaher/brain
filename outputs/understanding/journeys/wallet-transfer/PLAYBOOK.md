*** Journey Playbook — Wallet Transfer ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Wallet]] · [[Transfer Form]] · [[Wallet View]] · Charging Service ***

# Wallet Transfer

> Balance can be moved between wallet aggregates within a single Account, following Falcon's source-destination matrix. Falcon-usertype admins can move funds at the highest scope (Master ↔ CommChannel). The Account Owner / Node Admin can move funds between CommChannel and User/Node wallets, and between User and User wallets within their scope. The Master Wallet itself is exempt from the Balance Transfer Limit % cap; sub-aggregates are bounded by that cap (per BR-AM-34 + [[V-account-limits-zero-means-no-limit]]). Backend enforces the matrix via [[V-charging-transfer-source-destination]]. Ledger entries are double-write (debit source / credit destination) and the cascade emits Kafka events for downstream consumers.

## Actors involved

| Actor | Role |
|---|---|
| Falcon Sys Admin / Operation | Can transfer Master ↔ CommChannel scope (per Permission list - Jawad) |
| Account Owner (AO) | Can transfer CommChannel ↔ User/Node + User ↔ User in own hierarchy |
| Node Admin (NA) | Same as AO, scoped to own sub-node |
| Charging Service | Owns wallet aggregates + transfer logic; double-write ledger |
| Commerce Service | Source of account settings (Balance Transfer Limit %) |
| Access (PES) Service | Gates the transfer action per role + source + destination scope |

## Pages traversed (in order)

1. [[Wallet]] — User sees a tree / list of wallet aggregates (Master · CommChannel buckets · User wallets · Node wallets) with current balances. `forward-ref (page not yet seeded)`
2. [[Transfer Form]] — Source picker · Destination picker · Amount · optional reason. `forward-ref (page not yet seeded)`
3. [[Wallet (refreshed)]] — Same page as Step 1, but with updated balances post-transfer. `forward-ref`

## Flow playbooks used

- [[Wallet View Flow]] — `forward-ref (flow not yet seeded)`. Reads the wallet topology for the current actor's scope.
- [[Transfer Wallet Flow]] — `forward-ref (flow not yet seeded)`. The composite "pick source · pick destination · enter amount · submit" flow.

## Backend services exercised (in order)

- [[Core Gateway Service]] (Client path) or [[System Gateway Service]] (Falcon admin path) — JWT + IP allowlist.
- [[Access PES Service]] — runtime authorize call: can this actor transfer FROM source TO destination?
- [[Charging Service]] — primary owner: validates matrix · checks balances · debits source · credits destination · writes double-entry ledger · emits event.
- [[Commerce Service]] — read source for `Settings.BalanceTransferLimit` (the % cap). Read at validation time (or cached at session start).

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `charging.transfer-completed.v1` | Charging → audit consumers + downstream wallet UIs | `forward-ref (event name TBC)`. Fires on commit. |
| `commerce.wallet-balance-changed.v1` | Charging → Commerce (or vice-versa) | `forward-ref (event name TBC)`. Notifies if Commerce caches wallet metadata. |
| `charging.transfer-failed.v1` | Charging → audit + alerting | `forward-ref (event name TBC)`. Fires on validation/matrix/balance failure. |

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-charging-transfer-source-destination]] | Backend matrix check — most central rule for this journey |
| [[V-charging-insufficient-balance]] | Source must have ≥ amount |
| [[V-account-limits-zero-means-no-limit]] | `BalanceTransferLimit` % cap (0 = unlimited) per BR-AM-34 |
| [[V-account-ip-allowlist-enforcement]] | Step 0 gateway enforce |
| [[V-normal-user-limit-enforcement]] | Not applicable to this journey |

## Source-destination matrix (canonical)

| Source → Destination | Allowed actor | Capped by Balance Transfer Limit %? |
|---|---|---|
| Master → CommChannel | Falcon Sys Admin / Operation | NO (Master exempt) |
| CommChannel → Master | Falcon Sys Admin / Operation | NO (Master exempt) |
| CommChannel → User/Node | AO / NA in scope | YES |
| User/Node → CommChannel | AO / NA in scope | YES |
| User → User | AO / NA in scope (same account) | YES |
| Cross-Account | None | (not allowed at all) |

> Verify exact matrix rows against PRD-01 BR-AM-34 + Charging Service's `WalletController` ENDPOINT_REGISTRY before implementation. The "Master Wallet exempt" carve-out comes from BR-AM-34.

## End-to-end happy-path narrative

**Step 1.** Actor opens [[Wallet]] (`forward-ref`). The page shows the wallet tree scoped to their role: Falcon admins see Master + CommChannel buckets; AO sees CommChannel + User/Node + own User; Node Admin sees own sub-tree. Current balances are read from Charging via gateway: `GET /api/wallet/balances` (`forward-ref endpoint`).

**Step 2.** Actor clicks Transfer → [[Transfer Form]] (`forward-ref`) opens. They pick a Source aggregate from a dropdown / picker, a Destination aggregate from another picker, enter an Amount, optionally enter a Reason.

**Step 3.** Frontend pre-validates:
- Source ≠ Destination.
- Amount > 0.
- Source/Destination combination is allowed for this actor's role (the matrix above). UI hides illegal destinations.
- Amount ≤ source balance (UI hint; backend re-enforces).
- If applicable, Amount ≤ `BalanceTransferLimit %` of source balance.

**Step 4.** Actor clicks Submit. Frontend POSTs via gateway to Charging: `POST /api/wallet/transfer` (`forward-ref endpoint`) with `{sourceWalletId, destinationWalletId, amount, reason?}`. Charging:
1. Loads source + destination wallet aggregates.
2. Checks PES (the actor is authorized for this specific transfer direction).
3. Applies [[V-charging-transfer-source-destination]]: matrix row must be allowed for this role.
4. Applies [[V-account-limits-zero-means-no-limit]]: amount ≤ `BalanceTransferLimit %` of source (skip if 0 = unlimited; skip if source/destination is Master).
5. Applies [[V-charging-insufficient-balance]]: source balance ≥ amount.
6. If a contract sits behind the source (e.g. CommChannel bucket maps to a contract), validates the contract is `Active` and amount ≤ remaining committed value.
7. Double-write: debits source · credits destination · writes ledger entries (DEBIT row + CREDIT row + transfer-id + actor-id + timestamp).
8. Commits the transaction.
9. Emits `charging.transfer-completed.v1`.

**Step 5.** Frontend receives `ServiceOperationResult<TransferResponse>` with new balances + ledger entry IDs. Closes the form. Refreshes the Wallet view. Toast: "Transfer completed."

**Journey ends.** Final state:
- **Source wallet:** balance = old − amount
- **Destination wallet:** balance = old + amount
- **Ledger:** 2 new rows linked by transfer-id
- **Master Wallet lump-sum:** unchanged (because it's the sum across buckets; transfers within an account don't change the lump-sum)

## Failure modes + recovery paths

- **Step 3 fails (UI pre-validation):** Inline error; Submit disabled. User adjusts inputs.
- **Step 4.3 fails (matrix violation, [[V-charging-transfer-source-destination]]):** 403 `TransferNotAllowed` (`forward-ref`). UX: "This transfer direction is not allowed for your role." Indicates a frontend bug if reached (UI should have hidden illegal destinations).
- **Step 4.4 fails (`BalanceTransferLimit %` exceeded):** 422 with localized error. User reduces amount or AO raises the limit (subject to BR-AM-39 — limit-edit enforcement open question for post-create).
- **Step 4.5 fails (`InsufficientBalance` [[V-charging-insufficient-balance]]):** 422. User reduces amount or refills source via [[Renew Contract]] / a different transfer.
- **Step 4.6 fails (contract expired / not Active):** 422 `NoActiveContract` or `ContractExpired` (`forward-ref`). User must wait for the contract to activate (or pick a different source aggregate).
- **Step 4.7 fails (DB transaction error):** 500 with idempotency-protected retry. Charging service must be idempotent on a client-supplied transfer-id to make retries safe.
- **Step 5 fails (response timeout but transfer actually committed):** Idempotency key prevents double-commit on retry. UI refreshes balances and finds the transfer applied — no harm.
- **PES denies (Step 4.2):** 403 `Forbidden`. Actor doesn't have transfer permission for this scope.

## Cross-journey dependencies

- **Depends on:** Both wallets must exist (created via [[New Tenant Onboarding]] for Master + CommChannel buckets; created via [[Add User Flow]] for User wallets if Falcon creates per-user wallets; verify Charging service docs).
- **Triggers downstream:** Funding a user wallet enables that user's [[Send Campaign]] without depleting the global tenant bucket.
- **Pre-empted by:** [[Suspend Client]] — once Account is Suspended, Charging refuses all transfers.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Wallet + Transfer Form + post-transfer view
- [ ] Kafka subscriptions are wired — audit + Commerce on `charging.transfer-completed.v1`
- [ ] Error states from each step propagate correctly — matrix violation; limit exceeded; insufficient balance; PES Deny
- [ ] State transitions per actor are tested end-to-end — source debited; destination credited; ledger double-write; lump-sum invariant holds
- [ ] Source-destination matrix is enforced both in the UI (hide illegal destinations) and the backend ([[V-charging-transfer-source-destination]])
- [ ] Balance Transfer Limit % is enforced server-side; UI shows current cap as a hint
- [ ] Master Wallet exemption is honored (no cap on Master ↔ CommChannel)
- [ ] Idempotency on retry (client-supplied transfer-id)
- [ ] Suspend Client pre-empts transfers (Wallet Frozen)

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
