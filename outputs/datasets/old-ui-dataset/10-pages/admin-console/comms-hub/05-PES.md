# PES — comms-hub

## Permission keys used

| Key path | Resolves to | Where checked | File:line |
|---|---|---|---|
| `FalconAccess.adminConsole.enter()` | `{ action: 'view', resource: 'app.admin-console' }` | Parent route guard (`adminConsoleGuard`) — fires before entering any admin-console route | `libs/falcon/src/core/lib/guards/admin-console.guard.ts:17` |
| `FalconAccess.adminConsole.services.payment()` | `{ action: 'payment', resource: 'sys.services' }` | `canDoPayments` flag | `comms-hub.component.ts:1254` |
| `FalconAccess.adminConsole.services.editPriceType()` | `{ action: 'edit-price-type', resource: 'sys.services' }` | `canEditPriceType` flag | `comms-hub.component.ts:1255` |
| `FalconAccess.adminConsole.services.editPriceValue()` | `{ action: 'edit-price-value', resource: 'sys.services' }` | `canEditPriceValue` flag | `comms-hub.component.ts:1256` |
| `FalconAccess.adminConsole.services.visibility()` | `{ action: 'visibility', resource: 'sys.services' }` | `canManageVisibility` flag | `comms-hub.component.ts:1257` |

Registry source: `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121`.

```typescript
services: {
  payment: (): AccessQuery => ({ action: 'payment', resource: 'sys.services' }),
  editPriceType: (): AccessQuery => ({ action: 'edit-price-type', resource: 'sys.services' }),
  editPriceValue: (): AccessQuery => ({ action: 'edit-price-value', resource: 'sys.services' }),
  visibility: (): AccessQuery => ({ action: 'visibility', resource: 'sys.services' }),
}
```

(The mirror set in `falcon-access.registry.ts:55-58` under `account.services` — `acc.services` resource — is what `management-console`'s comms-hub uses. Admin-console uses the `sys.services` set above.)

## AccessControlFacade usage

- Facade: `AccessControlFacade` from `libs/falcon/src/core/lib/access-control/access-control.facade.ts:28`.
- Pattern used in this feature: **`resolveFlags`** — batch resolves N queries into a typed map of boolean flags.

```typescript
// comms-hub.component.ts:1252-1262
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canDoPayments: FalconAccess.adminConsole.services.payment(),
    canEditPriceType: FalconAccess.adminConsole.services.editPriceType(),
    canEditPriceValue: FalconAccess.adminConsole.services.editPriceValue(),
    canManageVisibility: FalconAccess.adminConsole.services.visibility(),
  }));
  this.initializeColumns();
  this.initializeRowMenuActions();
  this.cdr.markForCheck();
}
```

- `resolveFlags` (facade line 68-83) calls `ensure(...)` to preload the PES decisions, then builds a boolean map. On error it returns all-false (fail-closed).
- Called from `ngOnInit` line 234: `void this.primeAccess();` — fire-and-forget. Initial column / menu render at line 233 happens **before** flags arrive (all flags default to `false`), so the visibility column starts hidden and row actions start empty; both are re-initialized once `primeAccess` resolves.

## Where each flag gates behaviour

### `canManageVisibility`
- Column inclusion — `initializeColumns:942-950` only pushes the visibility column when true.
- `onDisable` / `onEnable` / `onVisibilityChange` — all return early if false ([CODE] lines 408-410, 577-579, 614-616).
- `isVisibilitySaving` — forces the toggle disabled when false (line 868).
- Row-action filter — `Disable` / `Enable` only included if true ([CODE] line 1009).

### `canDoPayments`
- `onDoPayment` returns early if false (line 445-447).
- Row-action filter — `DoPayment` only included if true (line 1008).
- `showPaymentConfirmation` is only reached through `onRowAction(DoPayment)` which is itself gated by the action being in the row menu.

### `canEditPriceType` / `canEditPriceValue`
- `onEditDetail` returns early if the detail's `type` matches but the corresponding flag is false ([CODE] lines 672-675).
- `onDeleteDetail` returns early ditto (lines 714-717).
- `onSaveEdit` returns early per `editMode` (lines 753-756, 806-809).
- Row-action filter — `EditPriceType` / `EditPriceValue` only included if true (lines 1010-1011).
- `canEditDetail(detailItem)` (line 871-875) — used in template (`detailsRowTpl`) to gate the pen-square + trash icons on each pending-change row.
- Save button `[disabled]` in inline templates checks `!canEditPriceType` / `!canEditPriceValue` (HTML lines 64, 102).

## Route-level guards

- **Route data** for `comm-mgmt` has **no `access` property** ([CODE] `apps/admin-console/src/app/features/routes.ts:23-32`). So `shellAccessGuard` is wired but evaluates zero queries → returns `true`.
- The parent-route `adminConsoleGuard` is the only effective route-level capability check — it gates entry to the whole admin-console at `app.admin-console`.
- Implication: a user with `app.admin-console / view` can navigate to `comm-mgmt` regardless of their `sys.services` capabilities — the **UI degrades silently** (hidden columns / empty row menu) when capabilities are absent.

## Per-row backend allow-list

In addition to the PES capability gates, **each row carries `allowedActions: FalconRowAction[]` from the backend**, and the row-action `visible` predicate honors this ([CODE] component lines 1061-1073):

```typescript
visible: (row: CommChannelServiceItem) => {
  if (
    row.allowedActions !== undefined &&
    row.allowedActions !== null &&
    Array.isArray(row.allowedActions)
  ) {
    const backendActions = row.allowedActions.map((a) => a as FalconRowAction);
    return backendActions.includes(actionEnum);
  }
  return false;
}
```

Default-deny: if `allowedActions` is missing the action is hidden. Note `CommsHubService.getList` aliases `availableActions` (lowercase-camel from backend) into `allowedActions` ([CODE] `comms-hub.service.ts:46-49`).

## Eligibility / Subscription checks

- `canHide?: boolean` on each row (DTO line 30) is consulted in `isVisibilitySaving` (component line 867-869) — disables the visibility toggle when the channel is currently visible but `canHide` is false. [INFERRED] Backend signals "this channel cannot be hidden right now" (e.g. mandatory channel).

## Summary

- **6 distinct access-control surfaces:**
  1. Parent `adminConsoleGuard` (`app.admin-console / view`)
  2. PES flag `canDoPayments` (`sys.services / payment`)
  3. PES flag `canEditPriceType` (`sys.services / edit-price-type`)
  4. PES flag `canEditPriceValue` (`sys.services / edit-price-value`)
  5. PES flag `canManageVisibility` (`sys.services / visibility`)
  6. Per-row `allowedActions` backend allow-list + per-row `canHide` eligibility
