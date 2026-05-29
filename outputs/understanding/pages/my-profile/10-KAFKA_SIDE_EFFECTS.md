*** My Profile — Kafka side effects ***
*** 2026-05-18 ***

# My Profile — Kafka Side Effects

## On `PUT /api/user/profile` success

Identity emits:

| Topic | Event | Consumed by |
|---|---|---|
| `identity.user-updated.v1` | `UserUpdatedEvent { userId, fields[], by: 'self' }` | Commerce · Audit |
| `identity.user-email-changed.v1` | (if email changed) | Notification · Zitadel sync |
| `identity.user-phone-changed.v1` | (if phone changed) | Notification · Zitadel sync |

## On OTP confirm

| Topic | Event | Consumed by |
|---|---|---|
| `identity.contact-verified.v1` | `ContactVerifiedEvent { userId, channel, value }` | Notification · Audit |

## See also

- `../edit-user/10-KAFKA_SIDE_EFFECTS.md` · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
