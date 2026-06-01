*** Contracts List — Implementation checklist ***
*** Pre-code verification gate · 2026-05-18 ***

# Contracts List — Implementation Checklist

## Verification gate

- [ ] 1. Entry point identified? → Admin Console → `/contracts-cost-management`
- [ ] 2. Route guard? → parent `adminConsoleGuard` only (no feature-level)
- [ ] 3. Roles? → Falcon System Admin / Product / Operation (pending Q-CC-OP-EDIT)
- [ ] 4. Data sources? → 3 endpoints (`commerce/Contracts`, `commerce/Setting/wallets/{accId}`, `charging/Wallet/contract-balance-summaries`)
- [ ] 5. Empty states? → 4 variants (no node, no wallet, no contracts, error)
- [ ] 6. Row coloring rules? → pending: green-25, expired: lilac-25
- [ ] 7. Charging-down resilience? → balance fetch swallows errors → `[]`
- [ ] 8. Mode state machine? → list / add / view / edit (covered in [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md))

## Pre-flight resolutions

- [ ] **Q-CC-OP-EDIT** — Falcon Operation Add/Edit permission
- [ ] **Q-CC-LIST-SORT-REQ** — sort columns required by product
- [ ] **Q-CC-LIST-SEARCH-REQ** — search/filter shape

## Frontend task list

### Setup

- [ ] Generate `apps/admin-console/.../contracts-list-container/` (or migrate from contracts-cost-management).
- [ ] Wire route: `/contracts-cost-management` → container with mode state.
- [ ] Inject: `ContractsApiService`, `OrgHierarchyApiService` (or new tree service), `SessionProvider`, `AccessControlFacade`, `FalconToastService`.

### Accounts panel

- [ ] Use `<falcon-organization-hierarchy-tree [loadDepth]="1">` OR local panel.
- [ ] `(nodeSelect)` → set `selectedNodeId = signal`.
- [ ] Empty state when no node selected.

### Data load

- [ ] On `selectedNodeId.set(id)`: `forkJoin({walletStrategy, contracts})`.
- [ ] Inside `contracts`: nested `forkJoin({contracts, balances})`.
- [ ] Merge balances into rows: `row.remainingValue = balances.find(b => b.contractId === row.id)?.remaining`.
- [ ] Handle balance fetch error → `[]` (silent).

### Node header

- [ ] `<falcon-page-header>` with icon + title.
- [ ] Action slot: `<falcon-button>` "Add Contract" disabled if `!walletStrategy()`.
- [ ] Tooltip "Configure wallet first" when disabled.

### List table

- [ ] `<falcon-angular-data-table>` or plain `<table>` + `@for`.
- [ ] 9 columns per [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md).
- [ ] Row class: `pending → bg-falcon-green-25`, `expired → bg-falcon-lilac-25`.
- [ ] Status pill: `<falcon-tag>` per status color.
- [ ] Row click → `mode.set('view')` + `getContract(row.id)`.
- [ ] Kebab menu per row: View · Edit (if `canEdit`).
- [ ] **GAP-CC-LIST-NOSORT FIX (pending Q):** add sortable: createdAt, startDate, endDate, committedValue.
- [ ] **GAP-CC-LIST-NOSEARCH FIX (pending Q):** add `<falcon-input>` search box above table.

### Empty states

- [ ] `<falcon-empty-state>` for noNode / noWallet / noContracts / error.
- [ ] Skeleton rows during load.

### Add gate

- [ ] `addEnabled = computed(() => !!walletStrategy())`.
- [ ] Disabled tooltip.

### PES (NEW)

- [ ] **GAP-CC-LIST-PES FIX:** add `FalconAccess.contracts.add()` / `.edit()` / `.view()` guards.

### Cleanup

- [ ] No SCSS — Tailwind only [F-017].
- [ ] No `*ngIf` / `*ngFor` — `@if` / `@for` [F-018].
- [ ] No PrimeNG — Falcon UI Core [F-016].
- [ ] Signals everywhere — no class-field state.
- [ ] Aria-labels on buttons + table.

## Backend task list

### Commerce

- [ ] Verify `GET commerce/Contracts?accountId={id}` returns `ApiContractListResponse` with full row shape.
- [ ] Verify `GET commerce/Setting/wallets/{accountId}` returns 404 when not configured (not throw 500).
- [ ] Confirm contract status FSM cron job is running (pending→active, active→expired).
- [ ] Verify `canEdit` flag is computed correctly on response.
- [ ] **GAP-CC-LIST-NOPAGE FIX:** add `pageNumber`/`pageSize` to listContracts query.
- [ ] **PES additions (pending product):** define `contracts.add/edit/view` keys.

### Charging

- [ ] Verify `GET charging/Wallet/contract-balance-summaries?accountId={id}` returns `ApiContractBalanceSummariesResponse`.
- [ ] Confirm it's resilient to a partially-projected state (returns whatever balances are known).

## E2E test list

- [ ] Falcon admin opens contracts page → list loads correctly.
- [ ] User picks account with no wallet → Add Contract disabled + tooltip.
- [ ] User picks account with no contracts → empty state shows.
- [ ] User picks account with 5 contracts → 5 rows render, with correct row coloring.
- [ ] Charging service down → list still renders, remaining column shows "—".
- [ ] Click row → view mode opens.
- [ ] Pending contract has green-25 background; expired has lilac-25.
- [ ] (Future) Operation role: cannot click Add/Edit.

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
