*** Contracts List — Section: Empty states ***
*** Empty / loading / error UX · 2026-05-18 ***

# Contracts List — Empty States

> Four empty-state variants. All use `<app-contracts-empty-state>` ([CODE] `apps/admin-console/.../shared/components/contracts-empty-state/`).

## States

| State | Trigger | Title | Message | CTA |
|---|---|---|---|---|
| `noNodeSelected` | `selectedNodeId === null` | "Select an account" | "Pick an account from the panel to view its contracts." | (none) |
| `noWalletStrategy` | `walletStrategy === null` after load | "Wallet strategy not configured" | "Configure the wallet strategy before authoring contracts." | "Configure wallet" (links to wallets page) |
| `noContracts` | `rows.length === 0` AND `walletStrategy != null` | "No contracts yet" | "Author your first contract for this account." | "Add Contract" button |
| `loading` | `loadingList === true` | (skeleton rows) | — | — |
| `error` | `pageError !== null` | "Could not load contracts" | `pageError` | "Retry" |

## Component spec

`<app-contracts-empty-state>`:

Inputs:
- `title: string`
- `message: string`
- `iconName?: string` (optional · default: empty-folder icon)

The component is a simple title + message + optional icon visual. No CTA slot — CTA lives in the parent (next to the empty state).

## Falcon component composition (NEW UI target)

| Element | Falcon component | Notes |
|---|---|---|
| Empty state shell | `<falcon-empty-state>` (if exists) OR composed `<div>` with icon + heading + body | |
| Skeleton rows | `<falcon-skeleton-rows>` | row count = expected page size (10) |
| Retry button | `<falcon-button>` | secondary variant |

## Localization

Empty state strings live in `i18n/en.json` and `i18n/ar.json` under `contracts.emptyState.*` keys:

```jsonc
{
  "contracts": {
    "emptyState": {
      "noNodeSelected.title": "Select an account",
      "noNodeSelected.message": "Pick an account ...",
      "noWalletStrategy.title": "Wallet strategy not configured",
      "noContracts.title": "No contracts yet",
      "error.title": "Could not load contracts"
    }
  }
}
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
