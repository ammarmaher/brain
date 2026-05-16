# PES — marketplace-applications

## Permission keys used
| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.adminConsole.services.payment()` | `primeAccess()` resolves `canDoPayments` flag → row menu DoPayment entry + `onDoPayment()` guard | `marketplace-applications.component.ts:1238`; `onDoPayment` guard at line 405 |
| `FalconAccess.adminConsole.services.editPriceType()` | `primeAccess()` resolves `canEditPriceType` → row menu EditPriceType entry + `onEditDetail` guard + `onSaveEdit` guard | `marketplace-applications.component.ts:1239`; checks at lines 628-630, 706 |
| `FalconAccess.adminConsole.services.editPriceValue()` | `primeAccess()` resolves `canEditPriceValue` → row menu EditPriceValue entry + `onEditDetail` guard + `onSaveEdit` guard | `marketplace-applications.component.ts:1240`; checks at lines 628-630, 775 |
| `FalconAccess.adminConsole.services.visibility()` | `primeAccess()` resolves `canManageVisibility` → visibility column shown + Disable/Enable row actions + `onVisibilityChange/onDisable/onEnable` guards | `marketplace-applications.component.ts:1241`; checks at 368, 533, 570, 918 |

## FalconAccess registry — the 4 keys

File: `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121`
```typescript
adminConsole: {
  ...
  services: {
    payment:        (): AccessQuery => ({ action: 'payment',           resource: 'sys.services' }),
    editPriceType:  (): AccessQuery => ({ action: 'edit-price-type',   resource: 'sys.services' }),
    editPriceValue: (): AccessQuery => ({ action: 'edit-price-value',  resource: 'sys.services' }),
    visibility:     (): AccessQuery => ({ action: 'visibility',        resource: 'sys.services' }),
  },
  ...
}
```

All four resolve to the same resource `sys.services` with different actions. This matches the Falcon-admin (`sys.*`) side of the resource namespace — the **`acc.services`** sibling (for client-side `management-console`) defines its own `payment`/`disable`/`view` actions (lines 55-59).

## AccessControlFacade usage
- Service: `AccessControlFacade` from `libs/falcon/src/core/lib/access-control/access-control.facade.ts`.
- Imported as `AccessControlFacade` at line 22 of the component.
- Injected at line 119: `private accessControlFacade = inject(AccessControlFacade);`
- Primary usage pattern is **`resolveFlags`** — bulk-evaluate multiple permissions and assign to fields in one go:

```typescript
// marketplace-applications.component.ts:1236-1246
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canDoPayments:        FalconAccess.adminConsole.services.payment(),
    canEditPriceType:     FalconAccess.adminConsole.services.editPriceType(),
    canEditPriceValue:    FalconAccess.adminConsole.services.editPriceValue(),
    canManageVisibility:  FalconAccess.adminConsole.services.visibility(),
  }));
  this.initializeColumns();
  this.initializeRowMenuActions();
  this.cdr.markForCheck();
}
```

Called once from `ngOnInit()` (line 210: `void this.primeAccess();`). The `void` keyword discards the returned Promise (fire-and-forget). The follow-up `initializeColumns` + `initializeRowMenuActions` calls rebuild the table now that PES flags are known.

## Guards layered

| Layer | What it gates | How |
|---|---|---|
| **Route (PES)** | None applied effectively — see [[01-ROUTING]] (declared `shellAccessGuard` but no `data.access` → no-op) | n/a |
| **Component init PES** | Column visibility + row-menu action availability | `primeAccess()` sets 4 flags; `initializeColumns()` reads `canManageVisibility` (line 918); `initializeRowMenuActions()` (line 974) reads all 4 |
| **Row-action filter** | Per-row availability of menu entries | Combines PES flag AND backend `row.allowedActions: FalconRowAction[]` (lines 1032-1043) |
| **Method-level early-return** | Click handler enforcement | `if (!this.canDoPayments) return;` at start of every action method |
| **Inline editor save** | Defense-in-depth at submit time | `if (!this.canEditPriceType) return;` at line 706; same for `canEditPriceValue` at line 775 |

## Double-gate pattern: PES × backend allowedActions

```typescript
// marketplace-applications.component.ts:1032-1043
visible: (row: AppServiceItem) => {
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

A row menu action is included **only if** (a) the PES flag passed AND (b) the backend included that action in `row.allowedActions`. If the backend omits `allowedActions` for a row, that row gets **no menu entries** (default `return false`).

This means the backend is the source of truth for FSM-allowed transitions per row, and PES is the source of truth for "is this user role allowed to even attempt this action". Both must pass.

## Eligibility / Subscription checks
- No explicit subscription gate — the page is always shown if PES allows entry.
- `row.allowedActions` reflects the row's current lifecycle position (Inactive can be Enabled but not Disabled, Active can be Disabled and renewed via DoPayment, etc.).

## Route-level PES gap
[CODE] The `shellAccessGuard` is on the route but missing the `data.access` declaration — see [[01-ROUTING]]. Suggested fix: add `data.access: FalconAccess.adminConsole.services.payment()` (or a new `view` query) so the route enforces something at activation time.

## Recommendation for new theme
- Keep the 4-flag `resolveFlags({...})` pattern — clean and bulky-safe.
- Add `FalconAccess.adminConsole.services.view()` to the registry and use it on the route's `data.access`.
- Consider exposing a typed wrapper around `row.allowedActions` so the backend FSM is a first-class concern, not array-of-numbers.
