# UserController — Frontend Contract

> The user-management surface — what the FE needs to build profiles, lists, status changes, and the
> phone/email verification flows.

## Base URLs

| Environment | Direct                          | Via Core Gateway (Client users)             | Via System Gateway (Falcon admins) |
|---|---|---|---|
| Local dev   | `https://localhost:7777/api`    | `https://localhost:7038/identity/user/*`    | `https://localhost:7256/identity/user/*` |
| Prod        | n/a                             | `<core-gateway>/identity/user/*`            | `<system-gateway>/identity/user/*` |

## Authentication

`Authorization: Bearer <zitadel-jwt>` — required for every endpoint EXCEPT `POST /generate-password`.

JWT custom claims (set by `ZitadelClaimsTransformation`):
- `sub` — Zitadel identity user id
- `UserId` — Falcon Mongo `_id`
- `TenantId` — empty for Falcon admins
- `NodeId` — set for client users
- `UserType` — `Falcon` (1) or `Client` (2)
- `urn:zitadel:iam:org:project:roles` — roles array

The BE reads these via `ICurrentUser` — FE does not need to send any of them in the body.

## Common pagination shape (list endpoints)

```ts
type PagedResponse<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};
```

Default `pageSize: 20`, `pageNumber: 1` (1-based).

## Multi-value query parameter convention

For `?Status` and `?Role` on `/api/user/`, repeated parameters bind to `List<T>`:

```
GET /api/user/?Status=2&Status=3&Role=4&Role=5
→ Status=[Locked, Suspended], Role=[AccountOwner, NodeAdmin]
```

(Same convention applies to `?roles=` on `/api/user/count`.)

## Create user flow

```ts
const response = await api.post('/user/', {
  personalInfo: {
    firstName: 'Layla',
    lastName: 'Ahmad',
    userName: 'layla.ahmad',
    nationalId: '1234567890',
    phoneNumber: '+966500000000',
    email: 'layla@example.com',
    profilePictureInfo: { extension: '.png', fileBase64String: '...' }
  },
  permissionGroupId: 'pg_default',
  deliveryMethod: 'Sms',          // 'Email' | 'Sms' | 'Both'
  roleKey: 'acc-admin',           // PREFERRED. Use canonical key. See DTOS.md role table.
  tenantId: 'tenant-xyz',         // Falcon callers only; Client callers can omit
  nodeId: 'node-1',               // required for Client roles
  path: 'tenant-xyz/node-1'
});
// → 201 Created, response.result = CreateUserResponse
// User created with Status=Pending. Credentials sent via DeliveryMethod (SMS/Email/Both).
```

After this, FE should clear the form. User receives:
- SMS with username + auto-generated password
- (and/or) Email with same

The user's first login goes through `/auth/login` → OTP → `/auth/first-login` (BR-UM-22 — see AuthController).

## Self-edit profile flow

```ts
const result = await api.put('/user/profile', {
  firstName: 'Layla',     // null/omit to keep current
  lastName: null,
  email: 'newemail@example.com',
  phoneNumber: null,
  nationalId: null,
  profilePictureInfo: null,
  deleteImage: false
}).result;

if (result.requiresEmailVerification) {
  // Open OTP modal — call /user/me/verify-email/confirm with the code the user receives
}
if (result.requiresPhoneVerification) {
  // Open OTP modal — call /user/me/verify-phone/confirm
}
```

**Critical UX nuance**: when the BE returns BOTH `requiresEmailVerification=true` AND
`requiresPhoneVerification=true` (BR-UM-21 — see UserController/VALIDATIONS.md, currently
unenforced), the FE must serialize the two OTP flows. Recommended order: email first, then phone.

Until **both** are confirmed, the user's `isEmailVerified` / `isPhoneVerified` flags remain false.
The user can still sign in, but downstream features (forgot-password, OTP receive) may not work
correctly until verification completes.

## Admin-edit profile flow (BR-UM-36)

```ts
await api.put(`/user/${userId}/profile`, { email: 'newemail@example.com' });
```

**Important**: the admin **does not** receive an OTP. The system applies the change immediately
(in Zitadel and Mongo) but flags the value as **unverified**. The next time the affected user
logs in, the FE should:

1. Read `/user/me` → check `isEmailVerified / isPhoneVerified`.
2. Surface a banner: "Your email has been changed by your administrator — please verify."
3. Drive the user through `/user/me/verify-email` flow.

This is Q-UM-13's resolution: admin-edit-OTP is **deferred verification**, not an admin-initiated OTP.

## Username immutability (BR-UM-19)

`Username` cannot be updated. The FE should:
- Render Username as **read-only** in profile screens.
- Not include `username` in any `PUT` body — the field is **absent** from the request DTOs anyway.

## Change-password flow (BR-UM-34 / BR-UM-35)

```ts
await api.put('/user/change-password', {
  oldPassword: 'OldPass1!',
  newPassword: 'NewPass1!',
  confirmNewPassword: 'NewPass1!'
});
```

On success, **all the user's Zitadel sessions are revoked** (best-effort). Practically: the next API
call from this user's other devices/tabs may return 401 → FE should:

```ts
// global 401 interceptor
if (status === 401 && !window.location.pathname.endsWith('/login')) {
  clearTokens();
  navigate('/login');
}
```

## Status change flow

```ts
await api.put('/user/status', { userId, newStatus: 'Suspended' });
// or 'Active' | 'Locked' | 'Deleted'
```

Status enum values (numeric — preferred over strings for forward compatibility):
- `1 = Pending`
- `2 = Active`
- `3 = Suspended`
- `4 = Locked`
- `5 = Deleted`

The transition matrix is strict — see [`ENDPOINTS.md`](ENDPOINTS.md) §8. FE should disable
status-change buttons that aren't reachable from the user's current status.

## Verification flows (phone + email)

```ts
// 1. Request a code (either resend for current OR start verify-before-save for a new value)
const meta = await api.post('/user/me/verify-email', { email: 'new@example.com' }).result;
// → { alreadyVerified: false, otpCodeLength: 6, otpExpiresInSeconds: 60, devOtpCode: null }

if (meta.alreadyVerified) {
  toast('Already verified.');
  return;
}

// 2. Show OTP input. Allow Resend after countdown ends.
await api.post('/user/me/verify-email/resend');     // does not require body

// 3. Confirm
const ok = await api.post('/user/me/verify-email/confirm', { code: '123456' }).result;
if (ok) toast('Email verified.');
```

**OTP code length is server-controlled** (`otpCodeLength` = 4 or 6 — BR-UM-28). FE must render
`otpCodeLength` digit boxes, not hardcode `6`.

**Expiry countdown**: `otpExpiresInSeconds` (typically 60 — BR-UM-26). When countdown hits zero,
allow Resend; before then, Resend returns 429 with `OtpStillValid`.

**Resend cap**: after `Security:MaxResendAttempts` resends, returns 429 with `OtpResendLimitExceeded`
— FE should show "Verification limit reached. Try again later."

## List users (UserList page)

```ts
const list = await api.get('/user/', {
  params: {
    nodeId: 'node-1',
    search: 'layla',
    status: [2, 3],         // Active, Suspended
    role: [4, 5],            // AccountOwner, NodeAdmin
    pathPrefix: 'tenant-xyz',
    pageNumber: 1,
    pageSize: 20,
    includeDeleted: false,   // Falcon-only flag; ignored for Client callers
    excludeCurrentUser: false,
    ignoreNodeIdFilter: false
  }
}).result;

// list.items: UserInfoResponse[]
// list.totalCount: number
```

**Security model (BE-enforced — FE doesn't need to filter):**
- Client callers ALWAYS use their JWT tenant — `tenantId` query param is ignored.
- Client callers can NEVER see Deleted users.
- Client callers can only filter by Client roles.
- `NodeAdmin` callers can switch nodes within their tenant.
- `AccountOwner` / `NormalUser` callers are pinned to JWT NodeId.

## IncludeDeleted (Falcon admin sees deleted users)

For Falcon-tier admin sessions only:
- `GET /user/?includeDeleted=true` — list shows soft-deleted users.
- `GET /user/{id}?includeDeleted=true` — fetch a soft-deleted user's profile.

Reference implementation: see `[PROJECT MEMORY]` `project_pr40937_include_deleted_lift_2026_05_17.md`
for FE wiring (`HierarchyService.getUsers` auto-appends for Falcon sessions; row click forwards
`?includeDeleted=true`).

## Field encryption

Sensitive fields (NationalId, etc.) may be encrypted at rest via `FieldEncryption:Key`. The FE
never sees encrypted ciphertext — Mongo storage layer encrypts on write and decrypts on read.

## Localization

- Error messages localized via culture middleware.
- User-facing strings (FirstName, LastName, etc.) are **single-language** — Identity does not
  store en/ar variants.

## OpenAPI

In Development: `https://localhost:7777/openapi/v1.json`. All User endpoints carry the
`WithTags("Users")` group tag.
