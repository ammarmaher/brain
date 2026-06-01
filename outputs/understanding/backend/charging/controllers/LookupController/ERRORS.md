# LookupController — Errors

> Subset of [`charging/ERRORS.md`](../../ERRORS.md) relevant to lookup queries.

## Endpoint Coverage

| Endpoint | Likely Errors | HTTP Status (inferred) |
|---|---|---|
| `GET /api/Lookup/{id}` | `Unauthorized`, `Forbidden`, `InternalServerError` | 401, 403, 500 |

There are **no business-level errors** on this endpoint. The handler does not throw any `FalconException`. Invalid `id`, unknown `id`, and empty result all return `200 OK` with an empty `result` array.

## Auth Errors

| HTTP Status | Code | Trigger |
|---|---|---|
| 401 | `Unauthorized` | Missing/invalid JWT |
| 403 | `Forbidden` | Class-level `[Authorize]` policy failure (rare — no per-action policy is applied) |

## No Business Errors

This is a pure read. No `WalletNotFound`, no `InvalidAmount`, no `LookupNotFound`. The handler silently returns an empty list when no rows match.

## Internal Errors

| HTTP Status | Code | Trigger |
|---|---|---|
| 500 | `InternalServerError` | MongoDB connection failure, AutoMapper config error, exception in `ITranslateHelper` |

The Charging service has no `[ErrorHttpStatus]` attribute — actual HTTP status mapping is done by the exception handler middleware (`UseFalconMiddlewares()` in `[CODE] Program.cs:48`).

## Frontend Treatment

| Backend Response | Frontend Action |
|---|---|
| `200 OK` with `result.length > 0` | Render dropdown options |
| `200 OK` with `result.length === 0` | Show "no options available" placeholder. Differentiate between "filter returned no matches" and "lookup id is invalid" by retrying without filters before declaring failure |
| `401` | Redirect to login |
| `500` | Show generic error, optionally retry once |

## Empty Seed — Operational Note

The Charging-side lookup table is currently empty (`[CODE] LookupSeedData.cs:7-16`). The endpoint will return `200 OK` with `[]` for every `id` until seed data is added. Frontends that depend on this endpoint must tolerate empty responses gracefully or fall back to Commerce's mirrored `LookupController`. See [BRAIN-OUT] `_pending-questions/wave-5c-lookup-empty-seed.md`.
