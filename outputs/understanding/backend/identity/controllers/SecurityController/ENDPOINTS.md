# SecurityController — Endpoints

> One endpoint. Route prefix `/api/security/`. Anonymous east-west surface.

## Endpoint table

| # | Method | Route                                          | Endpoint class             | Request DTO              | Response (T in SOR)  | Auth                  | Cache key                                       |
|---|--------|------------------------------------------------|----------------------------|--------------------------|----------------------|-----------------------|-------------------------------------------------|
| 1 | GET    | `/api/security/user-status/{IdentityUserId}`   | `CheckUserStatusEndpoint`  | `CheckUserStatusRequest` | `UserStatusResponse` | `AllowAnonymous`      | `user_status_{IdentityUserId}` (HybridCache)    |

## Endpoint method-level docs

### 1. GET /api/security/user-status/{IdentityUserId}
[CODE] `Endpoints/Security/CheckUserStatusEndpoint.cs:9-36`

```csharp
public class CheckUserStatusEndpoint(
    IRepository<User> userRepository,
    HybridCache cache) : Endpoint<CheckUserStatusRequest, ServiceOperationResult<UserStatusResponse>>
{
    public override void Configure()
    {
        Get("user-status/{IdentityUserId}");
        AllowAnonymous();
        Group<SecurityEndpointGroup>();
    }

    public override async Task HandleAsync(CheckUserStatusRequest req, CancellationToken ct)
    {
        var response = await cache.GetOrCreateAsync(CacheKeys.UserStatus(req.IdentityUserId), async token =>
        {
            var user = await userRepository.GetAsync(u => u.IdentityUserId == req.IdentityUserId && !u.IsDeleted);
            if (user is null) return null;
            return new UserStatusResponse(user.Id!, user.Status, user.Status == eUserStatus.Active);
        }, cancellationToken: ct);

        if (response is null)
            throw new FalconException(FalconKeys.Error.UserNotFound);

        await Send.OkAsync(ServiceOperationResult<UserStatusResponse>.Success(response), ct);
    }
}
```

**Key behaviours**:
- Look up by **Zitadel `IdentityUserId`**, not Falcon Mongo `_id`. Callers must know the Zitadel
  id — they get it from the JWT `sub` claim.
- Soft-deleted users → 404 (`!IsDeleted` clause).
- Result cached under `user_status_{IdentityUserId}`. Re-invalidated on any status mutation
  (admin, login lockout, webhook).
- Always returns `UserId` (Falcon Mongo id) in the body so callers can correlate.

## Stage transitions

N/A — no state change happens here. Read-only.

## Status-code mapping

| Endpoint                              | 200 | 404                           |
|---|---|---|
| GET /security/user-status/{id}       | ✓ payload   | `UserNotFound`              |

(No 400 — `IdentityUserId` is route-bound; FastEndpoints binds the string raw. No 401 — anonymous.)

## Endpoint count by verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
