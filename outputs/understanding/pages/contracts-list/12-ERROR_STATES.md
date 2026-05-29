*** Contracts List — Error states ***
*** SoT for list-mode error UX · 2026-05-18 ***

# Contracts List — Error States

> HTTP-status-routed UX. Backend returns `ServiceOperationResult<T>{ errors?, errorMessages? }`.

## HTTP status routing

| HTTP | Endpoint | UX |
|---|---|---|
| 200 + isSuccessful=true | All | Render |
| 404 | `getWalletStrategy` | Treat as null → disable Add button |
| 404 | `listContracts` | "No contracts" empty state |
| 5xx | `listContracts` | `pageError` set, show error empty state |
| 5xx / network | `getContractBalanceSummaries` | **Silent** — list still renders, "—" in remaining column |
| 401 | All | Global refresh-token flow |
| 403 | All | Toast: "You don't have permission to view contracts." |

## Error specifics

### `getWalletStrategy` 404

[CODE] `contracts-api.service.ts:202-208`:

```typescript
catchError(err => {
  if (err.status === 404) return of(null);  // not configured
  throw err;
});
```

UI: Add Contract button → disabled with tooltip "Configure wallet strategy first." Empty state if no contracts: shows the wallet-not-configured variant.

### `listContracts` error

[CODE] container `loadSelectedNodeData`:

```typescript
contractsApi.listContracts(this.selectedNodeId)
  .subscribe({
    next: rows => { this.rows = rows; this.loadingList = false; },
    error: err => {
      this.pageError = err?.message ?? this.t('contracts.errors.loadFailed');
      this.loadingList = false;
    },
  });
```

UI: surfaces `pageError` in an error empty state with a Retry button.

### `getContractBalanceSummaries` error (the SILENT one)

[CODE] `contracts-api.service.ts:445-446`:

```typescript
// The contract screens should stay usable even if the balance projection
// is temporarily empty or the charging service is briefly unavailable.
catchError(() => of([] as ApiContractBalanceSummary[])),
```

UI: list renders without remaining values (column shows "—"). User can still navigate, view, edit contracts. **The list deliberately ignores Charging downtime.**

## Toast service

NEW UI must use `FalconToastService` (NOT deprecated `FalconMessageService` per [MEMORY] Wave 13).

## Per-error mapping table

| Error condition | Severity | Toast / inline | Recovery |
|---|---|---|---|
| Wallet strategy 404 | Info | Inline empty state | Click "Configure wallet" → navigate to wallets page |
| List 500 | Error | Empty state with Retry | User clicks Retry → re-call listContracts |
| Balance 5xx | Silent | "—" in column | Auto-retry on next navigation |
| Network offline | Error | Global offline banner (host-shell concern) | Auto-retry on reconnect |
| 403 Forbidden | Error | Toast | Contact admin |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-SECTION_EMPTY_STATES](04-SECTION_EMPTY_STATES.md) · [08-BACKEND_API](08-BACKEND_API.md)
