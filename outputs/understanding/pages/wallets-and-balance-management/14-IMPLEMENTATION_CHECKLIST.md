*** Wallets — Implementation checklist ***
*** 2026-05-18 ***

# Wallets — Implementation Checklist

## Verification gate

- [ ] 1. Two sub-flows? → strategy + transfer
- [ ] 2. Backend split? → Commerce strategy + Charging transfer
- [ ] 3. Aggregator endpoint URL prefix? → `api/commerce/accounts/{id}/hierarchy`
- [ ] 4. Master is abstract? → YES
- [ ] 5. Transfer path matrix? → see [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md)
- [ ] 6. balanceTransferLimitPct cap? → applied
- [ ] 7. Currency mismatch guard? → F-014
- [ ] 8. 5 PES keys? → see [01-PERMISSIONS](01-PERMISSIONS.md)

## Pre-flight

- [ ] Q-WBM-RECONFIG resolved? Whether strategy change is allowed post-balances.
- [ ] GAP-WBM-GUARD: provide explicit access key for feature guard.

## Frontend tasks

### Container
- [ ] Use signals for selectedNodeId, walletData, strategy, etc.
- [ ] Reactive Forms for strategy editor + transfer drawer.
- [ ] Tailwind utilities (no SCSS).
- [ ] `@if`/`@for` (no `*ngIf`/`*ngFor`).
- [ ] `<falcon-*>` only (no PrimeNG).

### Hierarchy tree
- [ ] Re-use `<falcon-organization-hierarchy-tree>`.

### Strategy section
- [ ] 3x `<falcon-select>`.
- [ ] Save button → POST + toast + re-fetch.
- [ ] Disable Save when strategy unchanged.

### Balance table
- [ ] Master Wallet display.
- [ ] Per-channel/node/user rows.
- [ ] Transfer button per row → open drawer pre-filled.
- [ ] **GAP-WBM-DEAD-EDITS:** decide — remove dead inputs OR implement cell-edit flow.

### Transfer drawer
- [ ] `<falcon-drawer>` shell (Stencil).
- [ ] Source/Dest dropdowns filtered by path matrix.
- [ ] Currency dropdown: SAR enabled, Points decision pending GAP.
- [ ] Amount input with cap validation.
- [ ] Description required.
- [ ] **GAP-WBM-LOCALE-PARSE FIX:** use `Intl.NumberFormat.formatToParts()`.
- [ ] Same-source/dest guard.
- [ ] Submit → POST → on success refresh hierarchy.

### Toasts
- [ ] `FalconToastService` (NOT PrimeNG MessageService).

### Locale
- [ ] Number formats locale-aware.
- [ ] RTL support tested.

## Backend tasks

### Commerce
- [ ] Verify `POST commerce/setting/wallets` enforces valid combos.
- [ ] Q-WBM-RECONFIG: decide policy for post-balance strategy change.
- [ ] Verify Kafka emits 5 events (wallet-configured + identity-sync + user-wallet-create + subnode-wallet-create + comm-channel-shown).

### Charging
- [ ] Verify `POST charging/wallet/transfer` enforces:
  - Path matrix
  - Balance ≥ amount
  - Cap pct
  - Currency match
  - Same-source/dest reject
- [ ] Verify `charging.balance-changed.v1` emitted on success.
- [ ] Verify nearest-expiring contract selection when transferring from Master.

### System Gateway aggregator
- [ ] Document the `api/commerce/accounts/{id}/hierarchy` aggregator route + behavior.
- [ ] Verify it correctly joins Commerce strategy + Charging balances.

## E2E tests

- [ ] Falcon admin sets strategy → wallets materialize correctly.
- [ ] Transfer from WhatsApp to Master → balances update correctly.
- [ ] Transfer attempt exceeding cap → blocked.
- [ ] Transfer attempt cross-currency → blocked.
- [ ] Transfer with same source+dest → blocked.
- [ ] Transfer without description → blocked.
- [ ] AO transfers within own account → succeeds.
- [ ] AO tries to transfer to other account → blocked (PES).

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
