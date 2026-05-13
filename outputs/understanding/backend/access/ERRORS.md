# Access (PES) Service — Error Catalog

> PES does **not** use the platform-standard `FalconException` + `FalconKeys` model. It uses raw `IResult` problem details.

## Error Surface

| Source | Mechanism | Example |
|---|---|---|
| Validation failure | `Results.BadRequest(new { error })` | `GET /pes/roles` when `currentUser.TryResolveRoleCatalogRequest` returns `forbidden=false, error="..."` |
| Authorization failure (handler-level) | `Results.Forbid()` | `GET /pes/roles` when `forbidden=true` |
| Policy-level rejection | Framework 403 | Caller missing `SystemOnly` policy on `/pes/roles/bootstrap/account/{tenantId}` |
| Configuration failure (startup) | `throw new InvalidOperationException(...)` | `Kafka:SchemaRegistryUrl` empty, `MongoDb:ConnectionString` empty when provider is Mongo |
| Runtime exception | Unhandled — framework 500 with no structured body | Verify whether a custom exception handler is registered (not visible in `Program.cs`) |

## Configuration Errors (Startup)

| Trigger | Message |
|---|---|
| `Kafka:SchemaRegistryUrl` empty | `"Kafka:SchemaRegistryUrl is required."` |
| `MongoDb:ConnectionString` empty (when Mongo provider) | `"MongoDb:ConnectionString is required when DataStore:Provider is MongoDb."` |

## No Catalog

There is no equivalent of `FalconKeys.Error.*` in the PES codebase. The lack of a structured error catalog means:
- Frontend cannot pattern-match on error codes; it must rely on HTTP status alone + the `error` field in the problem-detail response (which is a free-form string).
- No localization — error messages are English-only.

## HTTP Status Mapping

| Status | Cause |
|---|---|
| 200 | Success |
| 400 | Malformed JSON, `Results.BadRequest({ error })` from handler-side validation |
| 401 | Missing/invalid JWT |
| 403 | `Results.Forbid()` from handler-side authorization, policy rejection |
| 500 | Unhandled exception |

## Recommendations

If PES is being kept active long-term, retrofit `FalconException` + `FalconKeys.Error.<Code>` to match the rest of the platform. Otherwise the frontend has to special-case PES error handling.
