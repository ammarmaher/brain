# Provisioning Service — Error Catalog

> Source-of-truth: `Falcon.Provisioning.Domain/Constants/FalconKeys.cs` (the `Error` nested class).
> The smallest catalog of any service — 7 codes. Like Charging, no `[ErrorHttpStatus]` decorations.

## Error Codes

| Code | Description |
|---|---|
| `DuplicateTenantName` | Tenant name conflict (likely shared with Commerce; rarely thrown here) |
| `InternalServerError` | Catch-all |
| `CommChannelNotFound` | Communication channel id unknown (catalog or per-account) |
| `ApplicationNotFound` | Application id unknown |
| `CannotHideActiveService` | Visibility flip blocked because the service is currently active (must disable first) |
| `UnauthorizedAction` | Caller has a JWT but lacks the required policy or business permission |
| `UnauthorizedUserToPerformThisAction` | Same, with a more specific message |

## Status Mapping (inferred)

Without `[ErrorHttpStatus]`, the exception handler middleware likely maps:

| Code | HTTP Status |
|---|---:|
| `*NotFound` | 404 |
| `Duplicate*` | 409 |
| `Unauthorized*` | 403 |
| `CannotHide*` | 422 |
| `InternalServerError` | 500 |

## Exception Type

`FalconException(FalconKeys.Error.<Code>)` — same shape as other services.

## Localization

Codes look up in `Resources/ErrorMessages.{en,ar}.resx` via `ErrorLocalizer`. Startup fail-fast on missing translations.

## Sparse Catalog Notes

Provisioning's small error surface reflects the service's narrow responsibility. Most business-level errors (e.g. "cannot pay for disabled service", "service already active") live in Commerce. Provisioning only validates:
- Catalog lookups (Comm/App exists)
- Visibility transitions (can't hide active)
- Authorization

If you encounter a thrown `FalconException` from Provisioning that isn't in the table above, it's likely a code that was added since this scan — re-check `FalconKeys.cs`.
