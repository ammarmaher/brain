*** Contracts List — Validations ***
*** SoT for list-mode validations · 2026-05-18 ***

# Contracts List — Validations

> The LIST mode has no form. The only "validation" is the wallet-strategy precondition for the Add button. Detailed form validations live in `pages/add-contract/07-VALIDATIONS.md` and `pages/edit-contract/07-VALIDATIONS.md`.

## V-rules

| V-rule | Where enforced | Effect |
|---|---|---|
| `V-add-contract-requires-wallet-strategy` | FE: `isWalletStrategyConfigured()` gate · BE: `GET commerce/Setting/wallets/{accountId}` returns 404 if not configured | Disables Add button + tooltip |
| `V-list-fallback-on-charging-down` | FE: balance fetch swallows errors → `[]` | List stays rendered; remaining column shows "—" |

## Hard-gate flow

[CODE] `contracts-api.service.ts:190-215`:

```typescript
getWalletStrategy(accountId: string): Observable<WalletStrategySettings | null> {
  return this.http
    .get<ServiceOperationResult<ApiWalletSettings | null>>(
      `commerce/Setting/wallets/${accountId}`,
      { context: new HttpContext().set(...useGateway()) }
    )
    .pipe(
      map(r => (r?.isSuccessful ? r.result : null)),
      catchError(err => {
        if (err.status === 404) return of(null);  // 404 = not configured, treat as null
        throw err;
      })
    );
}
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
