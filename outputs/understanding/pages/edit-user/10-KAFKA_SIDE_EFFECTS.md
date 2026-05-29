*** Edit User — Kafka side effects ***
*** SoT for server-side events emitted on save · 2026-05-17 ***

# Edit User — Kafka Side Effects

> Events fired by Identity on profile/status/role changes. Consumed by Commerce, PES cache invalidators, Notifications, and Zitadel sync.

## On `PUT /api/user/{id}/profile` success

Identity emits (or should emit):

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `identity.user-updated.v1` | `UserUpdatedEvent { userId, fields[] }` | Commerce (caches user names for activity logs) · Notifications (re-sync contact methods) | Cache invalidation + activity log |
| `identity.user-email-changed.v1` | `EmailChangedEvent { userId, newEmail }` | Notifications (re-send verification IF needed) · Zitadel sync | Push to Zitadel user record |
| `identity.user-phone-changed.v1` | `PhoneChangedEvent { userId, newPhone }` | Notifications · Zitadel sync | Same |

[INFERRED] These topics are NOT documented in current backend dossier — flag in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) as `GAP-UM-26`. Verify by inspecting Identity Service `IPublishEndpoint` calls.

## On `PUT /api/user/status` success

Identity emits:

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `identity.user-status-changed.v1` | `UserStatusChangedEvent { userId, oldStatus, newStatus, by }` | Commerce (recompute Normal-User count per account) · PES (invalidate user decision cache) · Notifications (send "Your account was suspended" email if applicable) | Cross-service status sync |

Also calls Zitadel API:
- Active → Unlock user in Zitadel
- Suspended/Locked → Lock user in Zitadel
- Deleted → Deactivate user in Zitadel (Zitadel side state)
- (Zitadel emits its own webhook → `ZitadelWebhookEndpoint.HandleAsync` reflects back via `/api/webhook/zitadel` — closing the loop)

## On `PUT /api/user/{id}/role` success

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `identity.user-role-changed.v1` | `UserRoleChangedEvent { userId, oldRoleKey, newRoleKey, by }` | Commerce (recompute Normal/System user count per account) · PES (invalidate role cache → user's effective permissions change immediately) | Permission re-eval |

## On OTP send (`POST /api/user/me/verify-email` or `verify-phone`)

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `identity.otp-requested.v1` | `OtpRequestedEvent { userId, channel: Email|Phone, code (hashed?), expiresAt }` | Notifications (sends actual email/SMS via provider) | Code delivery |

[INFERRED] Notifications service consumes this event. The send endpoint returns 200 with `VerificationCodeResponse` (NOT the code itself; just confirmation that send was initiated).

## On OTP confirm (`POST /api/user/me/verify-email/confirm` or `verify-phone/confirm`)

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `identity.contact-verified.v1` | `ContactVerifiedEvent { userId, channel: Email|Phone, value }` | Notifications (sends "Your contact was verified" notification) · Commerce (audit log) | Verification audit |

> If admin-edit-of-other-user OTP path is implemented (Q-UM-13), it would emit `identity.admin-verified-user-contact.v1` instead, carrying both `adminUserId` and `targetUserId`. **Not yet specified.**

## Zitadel sync direction

```
Falcon Identity ──────► Zitadel
                          (Update user · email · phone · status)

Zitadel ──webhook──► Falcon Identity (POST /api/webhook/zitadel)
                          (Reflects status changes initiated outside Falcon)
```

Webhook signature verified via `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)` ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:57-59`).

## Inbound consumers (Identity consumes these from other services)

| Topic | Producer | Effect on Edit User |
|---|---|---|
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce | Refreshes IP allowlist cache used during login (NOT during edit) |
| `commerce.account-status-changed.v1` | Commerce | If account is deactivated, all users under it transition to a suspended-like state (TBD) |

## Idempotency

- Each save endpoint is **idempotent per resource state**, NOT per request body. Posting the same `firstName` twice produces no-ops (Identity diff-checks before applying).
- OTP send is **NOT idempotent** — each call generates a new code, invalidating previous. Implement client-side throttle.

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
