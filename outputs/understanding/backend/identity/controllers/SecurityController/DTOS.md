# SecurityController — DTOs

> Source: `Application/Security/Models/`. Two DTOs — one in, one out.

## Request

### `CheckUserStatusRequest` — GET /api/security/user-status/{IdentityUserId}
[CODE] `Application/Security/Models/CheckUserStatusRequest.cs:6`

```csharp
public sealed record CheckUserStatusRequest(string IdentityUserId);
```

| Field            | Type   | Notes |
|---|---|---|
| `IdentityUserId` | string | Zitadel user id. Route-bound. FastEndpoints binds `{IdentityUserId}` path segment into this property. |

⚠ **PascalCase route segment**: the route is declared as `Get("user-status/{IdentityUserId}")` —
FastEndpoints binds by name. The wire URL `https://.../security/user-status/abc` works because the
binder ignores route-segment casing. But if FE/gateways generate URLs by template, the template
string must use the PascalCase form to satisfy FastEndpoints' code-gen.

## Response

### `UserStatusResponse` — GET /api/security/user-status/{IdentityUserId}
[CODE] `Application/Security/Models/UserStatusResponse.cs:6`

```csharp
public sealed record UserStatusResponse(string UserId, eUserStatus Status, bool IsActive);
```

| Field      | Type           | Notes |
|---|---|---|
| `UserId`   | string         | Falcon Mongo `_id`. Lets callers correlate identity → Mongo without another lookup. |
| `Status`   | `eUserStatus`  | Full enum value (Pending=1 / Active=2 / Suspended=3 / Locked=4 / Deleted=5 — but Deleted is filtered out by `!IsDeleted`). |
| `IsActive` | bool           | Pre-computed `Status == Active`. Server-side convenience — saves callers the enum check. |

`IsActive` and `Status` are redundant in the strict information sense, but the pre-computation
matters when the caller has no `eUserStatus` enum dependency.

## Enum vocabulary

`eUserStatus` — same as elsewhere: `Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5`.

`Deleted` is **never returned** by this endpoint because the cache populator filters `!IsDeleted`
at the repository call. If a soft-deleted user is queried, the endpoint returns `UserNotFound` (404).

## Internal types

None on the Security surface — direct `User` repository read → `UserStatusResponse` projection.
