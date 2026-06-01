*** Wallets — Components ***
*** Falcon component inventory · 2026-05-18 ***

# Wallets — Components

## Component tree (NEW UI target)

```
WalletBalanceManagementContainer
├── <falcon-organization-hierarchy-tree> (left tree) [already canonical]
├── Right pane:
│   ├── <falcon-page-header> (account name + Save button)
│   ├── Strategy editor section:
│   │   ├── <falcon-select> (currency)
│   │   ├── <falcon-select> (balanceDistribution)
│   │   └── <falcon-select> (walletStructure)
│   ├── <falcon-divider>
│   ├── Master Wallet display: <falcon-stat-card> or large balance display
│   └── Balance table: <falcon-angular-data-table> or plain <table>+@for
│       ├── per row: channel/node/user label
│       ├── per row: balance display
│       └── per row: <falcon-button> Transfer
└── <app-balance-transfer> (drawer — Stencil <falcon-drawer> wrapper)
    ├── <falcon-select> source
    ├── <falcon-select> destination
    ├── <falcon-select> currency
    ├── <falcon-input-number> amount
    ├── <falcon-input> description
    └── <falcon-button> Submit · Cancel
```

## Per-element mapping

| Old-UI | New UI | Notes |
|---|---|---|
| `<p-select>` × 3 (strategy) | `<falcon-select>` | [F-016] |
| `<p-select>` (transfer source/dest) | `<falcon-select>` | |
| `<p-sidebar>` (drawer shell) | `<falcon-drawer>` (Stencil-backed) | per Falcon UI Core canonical |
| `<p-button>` | `<falcon-button>` | |
| `<p-inputtext>` | `<falcon-input>` | |
| `<input>` (cell, disabled today) | `<falcon-input-number>` if cell-edit ever wired | else simple display |
| SCSS (1177+439 LOC) | Tailwind utility classes | [F-017] heavy migration |

## Anti-patterns to AVOID

| Old-UI thing | Replace with | Reference |
|---|---|---|
| 1177 lines SCSS in container | Tailwind utility | [F-017] |
| 439 lines SCSS in drawer | Same | |
| `[(ngModel)]` | Reactive Forms | [F-022] |
| `*ngIf`/`*ngFor` | `@if`/`@for` | [F-018] |
| PrimeNG sidebar/dropdown | Falcon UI | [F-016] |
| `MessageService` (PrimeNG toast) | `FalconToastService` | [MEMORY] Wave 13 |
| Class fields for state | Signals | doctrine |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
