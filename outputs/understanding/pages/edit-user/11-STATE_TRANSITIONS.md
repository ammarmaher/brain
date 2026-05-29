*** Edit User — State transitions ***
*** SoT for User entity FSM driven by this page · 2026-05-17 ***

# Edit User — State Transitions

> The status FSM the Edit User page can drive. Other transitions (Pending→Active on first login, Active→Locked on 3-wrong) are out of scope for this page.

## `UserStatus` enum — backend `eUserStatus`

[BRAIN-OUT] `Brain Outputs/prd/modules/02-user-management/ENTITIES.md` (User entity):

| Value | Label | Counts toward Normal-User limit? | Can log in? |
|---|---|---|---|
| `Pending` (1) | "Pending" | YES | NO (must first-login to flip to Active) |
| `Active` (2) | "Active" | YES | YES |
| `Suspended` (3) | "Suspended" | YES | NO (alert: "Your account is suspended; contact admin") |
| `Locked` (4) | "Locked" | YES | NO (alert: "Your account is locked; contact admin") |
| `Deleted` (5) | "Deleted" | NO | NO (account hidden from non-Falcon views) |

[PRD] BR-UM-07 (`BUSINESS_RULES.md:22`).

## Allowed transitions (BR-UM-08)

```
                Pending ◄────── Locked
                  │                ▲ 
                  │ (first login   │ (≥3 wrong login OR
                  │  per BR-UM-22) │  ≥3 wrong OTP per BR-UM-25/27)
                  ▼                │
              ┌─────────┐          │
              │ Active  │──────────┘
              └─────────┘
               ▲     ▲
               │     │
      [Suspended]   [Deleted]
               ▲     ▲
               │     │ (Deleted→Active: Falcon only — BR-UM-08)
               └──[Active]──┘
                  (manual)
```

## Edit User-driven transitions (admin sets)

| From | To | Allowed by | Backend endpoint | BE re-validates |
|---|---|---|---|---|
| Active | Suspended | Per PES `userRole.other` | `PUT /api/user/status` | (none) |
| Suspended | Active | Per PES | Same | MaxNormalUserLimit if role=NormalUser |
| Active | Locked | Manual override | Same | (none) |
| Locked | Pending | Manual override | Same | (none) — flushes failed-login counter |
| Active | Deleted | Per PES (any actor with permission) | Same | (none) — soft delete |
| Deleted | Active | **Falcon usertype only** | Same | MaxNormalUserLimit if role=NormalUser |

## Disallowed transitions (BE rejects)

| From | To | Why |
|---|---|---|
| Active | Pending | Pending is system-set only (BR-UM-10) |
| Suspended | Pending | Same |
| Deleted | Suspended/Locked | Only Active path back from Deleted |
| Pending | Active | This is the FIRST-LOGIN path, not admin path (BR-UM-22) |

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/VALIDATIONS.md` — `IsValidStatusTransition` validator.

## Auto-transitions (NOT driven by Edit User but relevant)

| Trigger | Transition | Source |
|---|---|---|
| First login complete (Pending → flow) | Pending → Active | BR-UM-22 |
| ≥3 wrong login attempts | Active → Locked | BR-UM-25 |
| ≥3 wrong OTP attempts (login flow) | Active → Locked | BR-UM-27 |
| OTP/Login Lockout reset (15 min?) | Locked → Pending or remain | (timing OPEN — BR-UM-47 silent) |

## Role-change side effects

Changing role triggers re-validation:

| Old → New role | Re-check |
|---|---|
| (anything) → Normal User | Account.MaxNormalUserLimit not exceeded |
| (anything) → System User | Account.MaxSystemUserLimit not exceeded |
| (anything) → Account Owner | Singleton constraint (one AO per account) |
| Account Owner → (anything else) | No — but cannot demote (Q-UM-AO-DEMOTE flagged) |

[INFERRED] Account Owner demotion is silent in PRD. Flag in GAPS.

## Permission Group transitions

| Old → New PG | Effect | Backend |
|---|---|---|
| (any) → (any) | User's effective permissions re-eval immediately | Emit `identity.user-role-changed.v1` (or analogue for PG) → PES cache invalidated |

[PRD] BR-UM-42 — one PG per user. No transition restrictions stated.

## Session impact on status change

| Transition | Affects active sessions? |
|---|---|
| → Suspended | Force-logout all sessions (BE revokes tokens) |
| → Locked | Force-logout all sessions |
| → Deleted | Force-logout all sessions |
| → Active | No effect (user was already logged out if coming from Suspended/Locked) |

[PRD] BR-UM-50 — OPEN: "Whether changing password invalidates sessions on other devices is silent in PRD." Similar question applies for status change.

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:30` — `PUT /api/user/change-password` "Revokes all sessions on success" — so password change DOES revoke. By analogy, status change to Suspended/Locked SHOULD revoke. Verify.

## See also

- [README](README.md) · [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
