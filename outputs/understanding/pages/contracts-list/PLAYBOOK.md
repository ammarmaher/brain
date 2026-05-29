*** Contracts List — Playbook ***
*** Single-doc synthesis · 2026-05-18 ***

# Contracts List — Playbook

## TL;DR

The Contracts List is the default mode of the Contracts & Cost Management container in admin-console. Falcon-user-only. Hosts a paginated table of contracts under a selected Account node, with row-level kebab actions to View/Edit and a primary "+ Add Contract" button gated by wallet-strategy configuration. Backend split: Commerce owns contract CRUD + lookups; Charging owns the remainingValue projection (balance summaries). Resilient to Charging downtime — silently swallows balance errors so the list stays usable.

## Sections

### 1. Permissions

- Parent `adminConsoleGuard` only — no feature-level PES.
- New UI should add: `FalconAccess.contracts.add/edit/view`.
- Falcon Operation role permission TBD (Q-CC-OP-EDIT).

### 2. Accounts panel

- Local tree component (`<app-contracts-accounts-panel>`), NOT the shared `<falcon-organization-hierarchy-tree>`.
- Flat list, single-level — no lazy load (contracts attach to Main Nodes only).
- New UI: consider lifting to canonical Falcon tree with `[loadDepth]="1"`.

### 3. List table

- 9 columns: ID · Name · Farabi · Created · Start · Expiration · Value · Remaining · Status.
- Row coloring: pending → green-25, expired → lilac-25.
- Status pill colors: pending → neutral, expired → red, active → teal+green.
- Click row → View. Kebab → View / Edit (if `canEdit`).
- Date format: `Intl.DateTimeFormat dd-MMM-yyyy` with dashes.

### 4. Empty states

- 4 variants: noNodeSelected · noWalletStrategy · noContracts · error.
- Uses local `<app-contracts-empty-state>`.

### 5. Node header

- Title + icon + action slot.
- Add Contract button disabled if `!walletStrategy`.

### 6. Validations

- Only one: `V-add-contract-requires-wallet-strategy`.
- Full form validations live in `add-contract/` and `edit-contract/`.

### 7. Backend API

- 3 reads: `commerce/Contracts`, `commerce/Setting/wallets/{accId}`, `charging/Wallet/contract-balance-summaries`.
- 2 tree reads: `commerce/Node` (root + children).
- `ServiceOperationResult<T>` wrapper everywhere.
- Date wire: `YYYY-MM-DDT00:00:00` (no Z, business date in Asia/Riyadh).

### 8. Components

- Old-UI is local-component-heavy (data-table, accounts-panel, empty-state, node-header).
- New UI evaluates each for Falcon UI Core canonical replacement.

### 9. Kafka side effects

- List produces NO events (read-only).
- Reflects: `commerce.contract-created/updated/status-changed` and Charging balance projection (driven by `commerce.order-created` + payment flow).

### 10. State transitions

- Container mode FSM: noNodeSel → list → add/view → edit.
- Contract status FSM: pending → active → expired (cron-driven, backend-only).
- Field freeze per status: pending=full edit, active=limited, expired=read-only.

### 11. Error states

- Wallet 404 → null + Add disabled.
- List error → pageError + empty state with Retry.
- Balance error → silent + "—" in column.

### 12. Gaps & drifts

- HIGH: GAP-CC-LIST-PES (no PES guards), GAP-CC-LIST-NOSORT, GAP-CC-LIST-NOSEARCH.
- MED: GAP-CC-LIST-NOPAGE, GAP-CC-LIST-CLASS-FIELDS, GAP-CC-LIST-PROJECTOR-WAIT.
- LOW: date format, row coloring contrast, Farabi tooltip.

### 13. Implementation checklist

- 8-question verification gate.
- Pre-flight Q-CC-OP-EDIT / Q-CC-LIST-SORT-REQ / Q-CC-LIST-SEARCH-REQ.
- FE list. BE list. E2E test list.

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/`
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- [BRAIN-OUT] `Brain Outputs/understanding/backend/charging/ENDPOINT_REGISTRY.md`
- [CODE] `apps/admin-console/src/app/features/contracts-cost-management/`

## Hubs

[[Contracts List]] · [[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[AMMAR_BRAIN_HOME]]
