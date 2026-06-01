*** Login — Kafka side effects ***
*** 2026-05-18 ***

# Login — Kafka Side Effects

## On `POST /api/auth/login`

Identity emits:

| Topic | Event | Consumed by |
|---|---|---|
| `identity.login-attempted.v1` | `LoginAttemptedEvent { username, success, reason, ip }` | Audit · Anomaly detection |
| `identity.otp-requested.v1` | (on successful credentials → OTP send) | Notification (sends SMS/Email) |

## On `POST /api/auth/verify-otp` failure (3rd strike)

| Topic | Event | Consumed by |
|---|---|---|
| `identity.user-status-changed.v1` | `UserStatusChangedEvent { userId, newStatus: 'Locked', reason: '3-wrong-otp' }` | PES cache invalidation · Notification (admin alert) |

## On `POST /api/auth/login` failure (3rd strike)

| Topic | Event | Consumed by |
|---|---|---|
| `identity.user-status-changed.v1` | `... newStatus: 'Locked', reason: '3-wrong-login' }` | Same |

## On `POST /api/auth/first-login` success

| Topic | Event | Consumed by |
|---|---|---|
| `identity.user-status-changed.v1` | `... oldStatus: 'Pending', newStatus: 'Active' }` | Commerce (count toward limit) · PES · Notification |
| `identity.first-login-completed.v1` | `FirstLoginCompletedEvent { userId }` | Audit |

## Zitadel sync (HTTP, not Kafka)

Login success calls Zitadel to issue tokens. Status changes (Lock/Unlock) sync via Zitadel HTTP API.

## See also

- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
