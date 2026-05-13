# ServicesController — Errors

> Subset of [`provisioning/ERRORS.md`](../../ERRORS.md) relevant to ServicesController.

## By Endpoint

| Endpoint | Likely Errors | HTTP Status (inferred) |
|---|---|---|
| `GET /account/{id}/comm-channels` | (none — returns empty list) | 200 (empty list) |
| `GET /account/{id}/applications` | (none — returns empty list) | 200 (empty list) |
| `POST /create-account-services` | `CommChannelNotFound`, `ApplicationNotFound`, `UnauthorizedAction`, `Unauthorized` (403 from policy) | 404, 404, 403, 403 |
| `PUT /account/comm-channel/visibility` | `CommChannelNotFound`, `CannotHideActiveService`, `UnauthorizedAction` | 404, 422, 403 |
| `PUT /account/application/visibility` | `ApplicationNotFound`, `CannotHideActiveService`, `UnauthorizedAction` | 404, 422, 403 |

## Auth Errors

- Missing JWT → 401 (framework-level, no FalconException body)
- Valid JWT, wrong policy (client user trying `POST /create-account-services`) → 403, possibly with no body (verify the Provisioning exception handler emits a `ServiceOperationResult.Failure`)

## Idempotency

`POST /create-account-services` is **not idempotent** on retries. Calling it twice for the same account creates two subscription records (or throws a duplicate constraint at the Mongo level — verify). Commerce's `CreateMainNodeProcess` typically calls this once per account creation; retries should be guarded by Commerce's outbox pattern.

## Concurrency

No optimistic concurrency observed in Provisioning. Mongo writes are last-write-wins.
