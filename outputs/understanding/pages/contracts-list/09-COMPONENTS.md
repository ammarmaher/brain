*** Contracts List — Components ***
*** Falcon component inventory · 2026-05-18 ***

# Contracts List — Components

> Old-UI uses many **local** components (contracts-data-table, contracts-accounts-panel, contracts-empty-state, contracts-node-header, primary-button). NEW UI should evaluate replacing each with the canonical Falcon UI Core equivalent.

## Component tree (NEW UI target)

```
ContractsCostManagementContainer
├── <falcon-tree> (or <falcon-organization-hierarchy-tree>) — Accounts panel
├── <falcon-empty-state> — when no node selected / no wallet / no contracts
├── <falcon-page-header> — node header with action slot
│   └── <falcon-button> — Add Contract
└── <falcon-angular-data-table> — list table
    ├── columns
    └── per-row kebab: <falcon-menu>
```

## Per-element mapping

| Old-UI (local) | New UI (Falcon UI Core) | Notes |
|---|---|---|
| `<app-contracts-accounts-panel>` | `<falcon-tree>` with `[loadDepth]="1"` OR keep local if flat-only | Local has custom click behavior — may justify keeping |
| `<app-contracts-data-table>` | `<falcon-angular-data-table>` | Per [MEMORY] `project_add_client_wizard_plain_table`, plain `<table>` + `@for` is OK for simple cases; for sortable/filterable list, USE Falcon table |
| `<app-contracts-empty-state>` | `<falcon-empty-state>` | If doesn't exist, compose with icon + heading + body |
| `<app-contracts-node-header>` | `<falcon-page-header>` or `<falcon-section-header>` | content projection for action slot |
| `<app-primary-button>` | `<falcon-button>` | primary variant |
| `<app-secondary-button>` | `<falcon-button>` | secondary variant |
| (status pill) | `<falcon-tag>` | color per status |
| (kebab menu) | `<falcon-menu>` | options per row |

## Anti-patterns to AVOID in NEW UI

| Old-UI thing | Replace with | Reference |
|---|---|---|
| Class-field state (NOT signals) | Signals — `signal()`, `computed()` | Falcon Angular 20 doctrine |
| `[(ngModel)]` for forms | Reactive Forms / `FormBuilder` | [F-022] |
| `*ngIf` / `*ngFor` | `@if` / `@for` | [F-018] |
| Component SCSS | Tailwind utility classes | [F-017] |
| Local re-implementations (data-table, tree) | Canonical Falcon UI Core | unless justified — local can be OK for plain CRUD per [MEMORY] |

## Existing canonical Falcon components used

- `<falcon-calendar>` (Add/Edit wizard date pickers — not on list)
- `<app-contracts-number-input>` (local — could be lifted to Falcon as a thousand-sep numeric input)

## Status pill component reuse

The status pill is reused across List + View + Edit modes. Recommend a single shared component:

```html
<contract-status-pill [status]="row.status" />
```

Internally a `<falcon-tag>` with computed color per status.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-SECTION_ACCOUNTS_PANEL](02-SECTION_ACCOUNTS_PANEL.md) · [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) · [05-SECTION_NODE_HEADER](05-SECTION_NODE_HEADER.md)
