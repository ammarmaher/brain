*** My Profile — State transitions ***
*** 2026-05-18 ***

# My Profile — State Transitions

## No user-status changes

User cannot change own status. Status is admin-only per BR-UM-39.

## No role changes

User cannot change own role.

## Contact-verification transitions

| From | To | Trigger |
|---|---|---|
| `emailVerified: false` | `emailVerified: true` | OTP confirm success |
| `phoneVerified: false` | `phoneVerified: true` | OTP confirm success |

These are sub-fields on the User entity, not status transitions.

## Pending → Active

[PRD] BR-UM-22: Pending → Active happens only via login first-login flow. My Profile cannot drive this transition.

## See also

- `../edit-user/11-STATE_TRANSITIONS.md` · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
