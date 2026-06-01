*** Contracts List — Overview ***
*** SoT for the LIST mode of Contracts & Cost Management · 2026-05-18 ***

# Contracts List — Overview

> The default mode of the **Contracts & Cost Management** container (admin-console). Shows a paginated table of contracts under a selected Account node, with row-level kebab actions to View / Edit. Falcon-user-only.
>
> Scope: this folder covers the LIST mode only. Mode transitions to Add / View / Edit are documented under their own page folders (`add-contract/`, `edit-contract/`) and in [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md).

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/OVERVIEW.md`
- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md`
- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md`
- [PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md`
- [BRAIN-OUT] Commerce SERVICE_OVERVIEW · `Brain Outputs/understanding/backend/commerce/SERVICE_OVERVIEW.md`
- [BRAIN-OUT] Commerce ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- [BRAIN-OUT] Charging SERVICE_OVERVIEW · `Brain Outputs/understanding/backend/charging/SERVICE_OVERVIEW.md`
- [BRAIN-OUT] Old-UI dossier · `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contracts-cost-management/` (9 files)

## Trigger / entry point

- **Page:** Admin Console → sidebar "Contracts & Cost Management" → `/contracts-cost-management`.
- **Route guard:** parent `adminConsoleGuard` only — NO feature-level PES guard ([CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contracts-cost-management/05-PES.md`).
- **Default state:** empty (no node selected); user picks an Account from the left tree, then list mode begins.
- **Precondition:** authenticated Falcon user · `FalconAccess.adminConsole.enter() === true` (inherited from parent guard).

## The page layout

```
┌───────────────────────────────────────────────────────────────┐
│ <header global>                                                │
├──────────────┬────────────────────────────────────────────────┤
│              │  <contracts-node-header>                       │
│  Accounts    │   ┌── Selected node name                      │
│  panel       │   └── [+ Add Contract] (disabled if no wallet)│
│  (tree)      ├────────────────────────────────────────────────┤
│              │                                                │
│  - Account A │    <contracts-data-table>                      │
│  - Account B │     ┌────────────────────────────────────┐    │
│  - Account C │     │ ID │ Name │ FarabiId │ ... │ Action│    │
│              │     ├────────────────────────────────────┤    │
│              │     │  ...rows (with kebab on each)      │    │
│              │     └────────────────────────────────────┘    │
│              │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

## The 4 modes (state machine)

| Mode | When | UI |
|---|---|---|
| `list` | Default after node selection | Contracts table + Add button |
| `add` | User clicks "Add Contract" | 4-step wizard (see `pages/add-contract/`) |
| `view` | User clicks a row | Read-only contract detail (4 tabs) |
| `edit` | From view, user clicks "Edit" | 4-tab editable detail (see `pages/edit-contract/`) |

Mode transitions covered in [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md).

## List columns (9 total)

[CODE] `contracts-cost-management.component.ts:261-322` — `buildColumns()`:

| # | Column | Source field | Format |
|---|---|---|---|
| 1 | Id (#) | `id` | as-is (Mongo ObjectId or seq) |
| 2 | Name | `contractName` | string |
| 3 | Farabi Ref Id | `farabiReferenceId` | string (max 50) |
| 4 | Creation date | `createdAt` | `Intl.DateTimeFormat` `dd-MMM-yyyy` |
| 5 | Start date | `startDate` | same |
| 6 | Expiration date | `endDate` | same |
| 7 | Value | `committedValue` | currency-formatted SAR |
| 8 | Remaining value | `remainingValue` | from balance summaries · visible per role/status |
| 9 | Status | `status` | pill: pending / active / expired |

## Row coloring

[CODE] `contractRowClass(row)` lines 190-199:

| Status | Row class | Color |
|---|---|---|
| `pending` | `bg-falcon-green-25` | pale green tint |
| `expired` | `bg-falcon-lilac-25` | pale lilac tint |
| `active` | (none) | default |

## Status pill styling

[CODE] view-contract.component.ts:137-146:

| Status | Border | Background | Text |
|---|---|---|---|
| `pending` | neutral-300 | neutral-75 | dark gray |
| `expired` | red-300 | red-75 | dark red |
| `active` | teal-900 | green-150 | dark teal |

## Parallel data load on node selection

```typescript
forkJoin({
  walletStrategy: contractsApi.getWalletStrategy(accountId),
  contracts: contractsApi.listContracts(accountId)  // listContracts internally does another forkJoin
});
```

Inside `listContracts`:

```typescript
forkJoin({
  contracts: GET commerce/Contracts?accountId={accountId},
  balances: GET charging/Wallet/contract-balance-summaries?accountId={accountId}
});
// merge: contracts[i].remainingValue = balances.find(b => b.contractId === contracts[i].id)?.remaining
```

[CODE] `contracts-api.service.ts:148-163, 433-447`.

## Resilience to Charging downtime

[CODE] line 446 comment:

> The contract screens should stay usable even if the balance projection is temporarily empty or the charging service is briefly unavailable.

→ Balance fetch swallows errors and returns `[]`. List rows show without `remainingValue` (shows "—" or 0).

## Add Contract gate

[CODE] container `onAddContract()` lines 103-109 + template `[disabled]` line 71:

```typescript
isWalletStrategyConfigured(): boolean {
  return !!this.walletStrategy;
}
```

If wallet strategy is null (`GET commerce/Setting/wallets/{accountId}` returns 404), the Add Contract button is **disabled** with tooltip: "Configure wallet strategy first."

## Sequence diagram

```
Falcon admin
    │
    ▼
[Admin Console sidebar → "Contracts"] ────► [Container loads]
                                              │
                                              ▼
                          [User picks account from left tree]
                                              │
                                              ▼
                          forkJoin({walletStrategy, contracts})
                          ┌───────────────────┴─────────────────┐
                          ▼                                     ▼
            GET commerce/Setting/wallets/{accId}  ┌─► GET commerce/Contracts?accountId={accId}
                          │                       └─► GET charging/Wallet/contract-balance-summaries
                          ▼                                     │
                  walletStrategy or null                        ▼
                                                       merge balances → rows
                                                                │
                                                                ▼
                          [Render list with row coloring + add gate]
                                              │
                                  ┌───────────┼────────────────┐
                                  ▼           ▼                ▼
                          Click row →     Click Edit →     Click + Add →
                          mode='view'    mode='edit'      mode='add'
```

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-SECTION_ACCOUNTS_PANEL](02-SECTION_ACCOUNTS_PANEL.md) · [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) · [08-BACKEND_API](08-BACKEND_API.md) · [README](README.md)

## Hubs

[[03 Contract Packaging Charging Billing Management]] · [[Commerce Service]] · [[Charging Service]] · [[Organization Hierarchy]]
