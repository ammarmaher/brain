*** Edit User — Backend API surface ***
*** SoT for the 3-endpoint dispatch chain + OTP endpoints · 2026-05-17 ***

# Edit User — Backend API

> Endpoint surface for the Edit User flow: pre-fetch read, 3-endpoint save dispatch (profile / status / role), and 4 OTP endpoints.

## Backend endpoint summary

| Method | Path | Service | Auth | Request | Response | Phase |
|---|---|---|---|---|---|---|
| GET | `/api/user/{id}` | [[Identity Service]] | `[Authorize]` | route param + `IncludeDeleted?` | `UserResponse` | Page load — fetch target |
| GET | `<baseURLPes>/pes/roles?targetUserType={system\|account}&tenantId=` | [[PES Service]] | bearer | query params | `RoleCatalogItem[]` | Role dropdown catalog |
| PUT | `/api/user/{id}/profile` | [[Identity Service]] | `[Authorize]` | `UpdateUserProfileByIdRequest` | `UpdateUserProfileResult` | Save — profile diff |
| PUT | `/api/user/status` | [[Identity Service]] | `[Authorize]` | `ChangeUserStatusRequest` | `object` (null) | Save — status diff |
| PUT | `/api/user/{id}/role` | [[Identity Service]] | `[Authorize]` | `UpdateUserRoleByIdRequest` | `bool` | Save — role diff |
| POST | `/api/user/me/verify-email` | [[Identity Service]] | `[Authorize]` | `VerifyEmailRequest` (body optional) | `VerificationCodeResponse` | OTP — send |
| POST | `/api/user/me/verify-email/confirm` | [[Identity Service]] | `[Authorize]` | `ConfirmEmailRequest { code }` | `bool` | OTP — confirm |
| POST | `/api/user/me/verify-phone` | [[Identity Service]] | `[Authorize]` | `VerifyPhoneRequest` (body optional) | `VerificationCodeResponse` | OTP — send |
| POST | `/api/user/me/verify-phone/confirm` | [[Identity Service]] | `[Authorize]` | `ConfirmPhoneRequest { code }` | `bool` | OTP — confirm |

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:22-46`.

## Gateway routing

- Falcon admin actor → **System Gateway** (`/system-gateway/identity/...`)
- Client admin actor (AO/NA) → **Core Gateway** (`/core-gateway/identity/...`)
- The frontend resolves via `useGateway()` based on `session.userType` ([CODE] `_core/03-SERVICES-APIS.md`).
- Path transform: gateway strips `/identity` prefix and prepends `/api/`. So `PUT <core-gateway>/identity/user/{id}/profile` → Identity `PUT /api/user/{id}/profile`.
- Auth header: `Authorization: Bearer <zitadel-jwt>`.

## Request DTO — `UpdateUserProfileByIdRequest`

[BRAIN-OUT] inferred from old-UI [CODE] `apps/host-shell/.../user-api.service.ts:144-153`:

```jsonc
{
  "id": "<user-guid>",
  "firstName": "...",
  "lastName": "...",
  "phoneNumber": "+966...",
  "email": "user@example.com",
  "nationalId": "...",
  "profilePictureInfo": {
    "extension": "jpg",
    "fileBase64String": "..."
  } /* OR null */,
  "deleteImage": false
}
```

> Identity service uses **camelCase** wire (verify in `Brain Outputs/understanding/backend/identity/FRONTEND_CONTRACT.md`).

## Request DTO — `ChangeUserStatusRequest`

```jsonc
{
  "userId": "<user-guid>",
  "newStatus": <int>  // eUserStatus enum value
}
```

[CODE] `user-api.service.ts:122-130`.

## Request DTO — `UpdateUserRoleByIdRequest`

```jsonc
{
  "id": "<user-guid>",
  "roleKey": "FalconNormalUser"  // or similar role key string
}
```

[CODE] `user-api.service.ts:156-165`.

## Response wrapper — `ServiceOperationResult<T>`

```
ServiceOperationResult<T> {
  bool isSuccessful,
  T? result,
  List<string> errorMessages   // localized strings — DO NOT parse
}
```

Use HTTP status as the primary routing signal. Display `errorMessages[0]` directly. See [12-ERROR_STATES](12-ERROR_STATES.md).

## Dispatch chain (`UserProfileService.updateUserProfile`)

[CODE] `apps/host-shell/.../user-profile.service.ts:75-122`:

```typescript
return profileUpdate$.pipe(
  switchMap(profileResult => {
    if (!profileResult.isSuccessful) return of(profileResult);
    return runStatusUpdate$;
  }),
  switchMap(statusResult => {
    if (!statusResult.isSuccessful) return of(statusResult);
    return runRoleUpdate$;
  }),
);
```

> **Critical:** if profile-update fails, status and role are NOT attempted. If status-update fails, role is NOT attempted. Each chained step depends on the previous one's success.

## Pre-load on page open

Load in parallel via `forkJoin`:

1. `GET /api/user/{id}` — target user
2. `GET <baseURLPes>/pes/roles?targetUserType=…&tenantId=…` — role catalog
3. (PES) `ensure([userRole.other(srcKey, optKey)] for all options)` — bulk PES warmup

## Async uniqueness — N/A for Edit User

(No async checks; username is immutable; email/phone may be duplicated per PRD.)

## Casing

Identity uses **camelCase** on wire (different from Commerce which uses PascalCase). Verify at runtime via `Microsoft.AspNetCore.Mvc.JsonOptions` config in Identity startup.

## Error wrapper example

```jsonc
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Email and phone cannot be edited at the same time."]
}
```

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
