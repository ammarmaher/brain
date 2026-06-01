*** Contracts List — Section: Node header ***
*** Selected-node header with Add Contract button · 2026-05-18 ***

# Contracts List — Node Header

> The header bar above the table — shows the selected node and the primary action button.

## Component

[CODE] `apps/admin-console/.../shared/components/contracts-node-header/`:

- Selector: `<app-contracts-node-header>`
- Standalone, OnPush

## Inputs

```typescript
@Input() iconUrl?: string;
@Input() title!: string;
@Input() subtitle?: string;
```

## Content projection

Uses `<ng-content>` for the action slot — parent passes button(s) into the right side:

```html
<app-contracts-node-header [iconUrl]="..." [title]="...">
  <app-primary-button (click)="onAddContract()" [disabled]="!isWalletStrategyConfigured()">
    Add Contract
  </app-primary-button>
</app-contracts-node-header>
```

## States

| State | Title | Subtitle | Action button |
|---|---|---|---|
| Wallet configured + has contracts | Account name | (count or last update) | "+ Add Contract" enabled |
| Wallet configured + no contracts | Account name | "0 contracts" | "+ Add Contract" enabled |
| Wallet NOT configured | Account name | (none) | "+ Add Contract" disabled with tooltip "Configure wallet first" |
| No node selected | (header hidden) | — | — |

## Add Contract gate

[CODE] container `onAddContract()` lines 103-109:

```typescript
onAddContract(): void {
  if (!this.isWalletStrategyConfigured()) {
    this.pageError = this.t('contracts.errors.walletNotConfigured');
    return;
  }
  this.mode = 'add';
  this.cdr.markForCheck();
}

private isWalletStrategyConfigured(): boolean {
  return !!this.walletStrategy;
}
```

## Falcon component composition (NEW UI target)

| Element | Falcon component | Customization |
|---|---|---|
| Header bar | `<falcon-page-header>` or `<falcon-section-header>` | `[icon]`, `[title]`, action slot |
| Primary button | `<falcon-button>` | primary variant + plus icon · `[disabled]` |
| Tooltip | `<falcon-tooltip>` | shown on hover when disabled |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-SECTION_ACCOUNTS_PANEL](02-SECTION_ACCOUNTS_PANEL.md) · [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md)
