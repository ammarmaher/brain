# WalletController — Drill-down

> File: `falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/WalletController.cs` (~200 lines)
> The most representative controller in Charging — covers the entire wallet operation surface (read, direct debit, reserve/commit/release, transfer).

## Purpose

Provides the **8 entry points** for wallet operations:

1. `GetAccountWallets` — read all wallets (master + per-channel + per-owner) for an account
2. `GetContractBalanceSummaries` — read remaining balance per contract
3. `DirectDebit` — single-shot final debit
4. `Authorize` / `Reserve` — start a two-phase usage charge (same handler, two URL aliases)
5. `Commit` — finalize a reservation after delivery success
6. `Release` — abort a reservation after delivery failure
7. `TransferBalance` — move balance between wallets while preserving per-contract lineage

## Architecture

Constructor injects:
- `IMapper`
- `IGetAccountWalletsHandler`
- `IGetContractBalanceSummariesHandler`
- `IDirectDebitHandler`
- `IReserveWalletChargeHandler`
- `ICommitWalletReservationHandler`
- `IReleaseWalletReservationHandler`
- `ITransferBalanceHandler`

Each action:
1. Maps the request DTO to the corresponding command using AutoMapper
2. Calls `handler.ExecuteAsync(command)`
3. Manually constructs the response DTO (no AutoMapper on the response side for most actions — handlers return rich result objects that are field-by-field copied into the response)
4. Wraps in `ServiceOperationResult<TResponse>.Success(...)`

Globally registered `UnitOfWorkFilter` (from `Program.cs: AddControllers(o => { o.Filters.Add<UnitOfWorkFilter>(); })`) wraps every action in a Mongo session + Kafka outbox flush.

## Authorization

Class level: `[Authorize]`. No per-action policy overrides — all 8 endpoints are callable by any authenticated user (both client and Falcon).

This is **intentional** — wallet operations are downstream of Commerce's authorization for things like contract creation and service-order creation. The Charging service trusts that the caller already passed Commerce's checks. (A separate concern: Falcon admins must not directly debit a client's wallet without proper audit — verify whether the handler-level `IAccessCurrentUser` checks tenant/owner ownership.)

## Aliases: Authorize vs. Reserve

`/api/Wallet/authorize` and `/api/Wallet/reserve` share the same implementation (`IReserveWalletChargeHandler.ExecuteAsync(...)`). The class comments explain:

> The Authorize endpoint is the phase-1 endpoint for delivery-based policies. It currently shares the same implementation as reserve because WA_DELIVERY_COMMIT must create the hold during authorization and return the reservation id immediately.
>
> The Reserve endpoint is kept for product teams that prefer the reserve vocabulary.

This dual-name pattern hints at future divergence (likely `Authorize` will start including pre-validation that `Reserve` skips). For now, frontend can use either.

## Code Smells / Findings

1. **No `[AllowAnonymous]`-aware health endpoint** — `WalletController` has no `/health`, which is fine because `Program.cs` registers one separately.
2. **Idempotency-as-success** — `AlreadyApplied: true` returned for duplicate calls. Verify frontend treats this as success, not as an unexpected boolean.
3. **`GetAccountCommChannelSubWalletResponse.walletId`** is **camelCase in C#** (lowercase first letter), making it `walletid` on the wire after the framework camelCase policy applies. Other property names in the same DTO are PascalCase. **Bug.**
4. **GET with body anti-pattern is avoided** — `GetAccountWallets` is correctly POST because `OwnerIds` is a list. Good.
5. **No XML doc comments on read endpoint** (`GetAccountWallets`); good doc comments on mutators.
6. **`UnitOfWorkFilter` global registration**: every action — including the pure-read `GetAccountWallets` and `GetContractBalanceSummaries` — gets wrapped in a transaction. This is wasteful for reads. Verify `UnitOfWorkFilter` short-circuits on `IUnitOfWorkTrigger` marker absence.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
