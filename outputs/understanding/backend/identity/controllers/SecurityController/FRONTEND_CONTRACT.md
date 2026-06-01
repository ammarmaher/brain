# SecurityController — Frontend Contract

> **This endpoint is east-west — NOT for direct frontend consumption.** The FE relies on this
> indirectly via the gateway's session-status enforcement. Documentation here exists for
> developers who maintain the gateway middleware or write a debug screen.

## Intended caller

| Caller                | Purpose                                                                                     |
|---|---|
| **Core Gateway**      | Short-circuit a request from a still-valid JWT for a user whose status just changed         |
| **System Gateway**    | Same, for Falcon admin sessions                                                              |
| **Other Falcon BE services** | Sanity-check before a sensitive action (e.g. wallet transfer)                       |

## Base URL

Direct (gateway side):
- Local: `https://localhost:7777/api/security/user-status/{identityUserId}`

The gateway does NOT typically expose this to the public — there is no `/identity/security/...`
public route in the gateway config because that would let anyone enumerate user statuses.

## Request

```
GET /api/security/user-status/{identityUserId}
```

Where `identityUserId` is the Zitadel user id (from JWT `sub` claim).

## Response

```json
{
  "isSuccessful": true,
  "result": {
    "userId": "65f1...",
    "status": 2,
    "isActive": true
  },
  "errorMessages": []
}
```

- `userId` — Falcon Mongo `_id`. Useful for further service calls that need the Mongo id.
- `status` — numeric `eUserStatus` (1=Pending, 2=Active, 3=Suspended, 4=Locked, 5=Deleted —
  though Deleted never reaches here; would return 404).
- `isActive` — `true` iff `status == 2`. Pre-computed to save the caller an enum import.

## Errors

| HTTP | Body                                       | Cause |
|---|---|---|
| 404  | `errorMessages: ["<localized UserNotFound>"]` | User does not exist OR is soft-deleted |
| 500  | generic                                    | Cache / DB outage |

## Authentication

**None.** Anonymous endpoint. Gateways and east-west callers are expected to be within the
service network.

⚠ FE should never hit this directly. If FE needs the current user's status, use `GET /api/user/me`
and read `status` from the `UserResponse`.

## Caching

The endpoint is HybridCache-backed. Callers can repeat the call without worrying about Mongo load
— the response is L1 in-memory hot, with L2 Redis fallback. Invalidation is automatic on user
status changes.

## Why a separate endpoint vs. `/api/user/me`?

- `/api/user/me` requires a valid user JWT (the caller is the user).
- `/api/security/user-status/{id}` is for **other parties** (services) to check **someone else's**
  status without owning a user JWT. The anonymous-but-network-fenced model fits east-west semantics.

## Suggested gateway integration pseudo-code

```js
// In Core Gateway middleware, on every request after JWT validation:
const sub = jwtPayload.sub;
const r = await fetch(`http://identity-svc/api/security/user-status/${sub}`);
if (!r.ok) return forwardOriginal(req);   // can't reach Identity, fall through
const { result } = await r.json();
if (!result.isActive) return res.status(403).json({ error: 'UserNotActive' });
forwardOriginal(req);
```

(Real gateway implementation should cache this check itself, or trust HybridCache's L1.)
