*** User Statuses — Pending · Active · Suspended · Locked · Deleted ***
*** SoT: Brain Outputs/prd/modules/02-user-management/latest-prd.md (User statuses) + understanding.md ***
*** Created 2026-05-15 by Brain SK Phase 2B permission-matrix install ***

# User Statuses

> Falcon users move through **5 statuses** that gate login + count against the account-level Normal-User limit. The Google Sheet **`Users statuses & others`** is the canonical definition; PRD-02 reproduces the table verbatim in `latest-prd.md`. The status is orthogonal to permissions but co-lives with them in PRD-02 because both gate access — a `Suspended` user with `Allow` permissions still cannot log in.

## Source-of-truth pointer

- **Captured table:** [`latest-prd.md` § User statuses](../../../Brain%20Outputs/prd/modules/02-user-management/latest-prd.md) (lines 32–42 — table reproduced verbatim from sheet)
- **Captured business rules:** [`understanding.md` § Business rules + Workflows](../../../Brain%20Outputs/prd/modules/02-user-management/understanding.md) (R5 / R6 / R7 / R8 + Status change workflow)
- **Sheet manifest:** [`attachments.md` — Users statuses & others](../../../Brain%20Outputs/prd/modules/02-user-management/attachments.md) (4 KB, modified 2026-02-19)
- **Original Drive sheet name:** `Users statuses & others`

## The 5 statuses (verbatim from sheet)

| Status | Meaning | Counted in user limit |
|---|---|---|
| **Pending** | Created, not yet activated. Needs login + OTP + password change to become Active. | **Yes** |
| **Active** | Fully enabled, per role. Can log in and perform role-allowed actions. | **Yes** |
| **Suspended** | Temporarily disabled by admin. Cannot log in until reactivated. | **Yes** |
| **Locked** | Automatic on ≥3 failed login attempts (or ≥3 wrong OTP / resend count); or manual. Cannot log in until reset. | **Yes** |
| **Deleted** | Permanently deactivated. Only Falcon usertype can restore to Active. Hidden from client side. | **No** |

## Transition rules

From [`latest-prd.md` line 42](../../../Brain%20Outputs/prd/modules/02-user-management/latest-prd.md) and [`understanding.md` Status change workflow](../../../Brain%20Outputs/prd/modules/02-user-management/understanding.md):

| From → To | Trigger | Notes |
|---|---|---|
| Pending → Active | First-login completes (IP + creds + OTP + password change) | Forced password change is the activation gate. |
| Active → Suspended | Manual admin action | Reversible — admin reactivates back to Active. |
| Active → Locked | Auto on 3 wrong login attempts; or auto on 3 wrong OTP / resend; or manual | Reset path: Locked → Pending (manual re-activate). |
| Active → Deleted | Manual admin action | Soft state; user disappears from client side. |
| Suspended → Active | Manual admin action | Direct reactivation. |
| Locked → Pending | Manual admin action (re-activation flow) | User must complete first-login again. |
| Deleted → Active | **Falcon usertype only** | Client admins cannot restore deleted users. |

When changing a **Normal User** to Active, the system must validate the account's **Normal-User limit** before saving.

## Why this matters (login flow)

The `regular login` workflow returns a **specific alert per non-Active status**:

- `Pending` → "Please complete first-login activation" (or equivalent)
- `Suspended` → "Account suspended, contact administrator"
- `Locked` → "Account locked, contact administrator"
- `Deleted` → treated as `Username is incorrect` (no info leak — matches forgot-password rule)

Source: [`understanding.md` § Main workflows / Regular login + Edge cases](../../../Brain%20Outputs/prd/modules/02-user-management/understanding.md).

## Lockout triggers (R7 + R8)

- **R7** — ≥3 wrong login attempts → auto-Locked
- **R8** — ≥3 wrong OTP **or** resend count → auto-Locked
- **R6** — Active / Pending / Suspended / Locked count against the account's Normal-User limit; Deleted does **not**

## Backend enforcement

| Service | Role |
|---|---|
| [[Identity Service]] | **Owner.** `User.status` is stored here; `UserStatusHistory` records every transition with `actor` + `at` + `reason`. The login endpoint reads status and applies the per-status response. Lockout counters live alongside `LoginAttempt`. |
| [[Commerce Service]] | Owns the **Normal-User limit** value (per-account Account Limitations). Identity validates against Commerce on Pending/Locked/Suspended → Active transition for Normal Users. |
| [[Access PES Service]] | Status is a **pre-permission gate**. Even with `Allow` permission, a non-Active user is rejected at login. PES doesn't enforce status — Identity does — but PES decisions only apply to Active users. |

## PRDs that cite this

- [[02 User Management]] — **owner**. R5/R6/R7/R8 + Status change workflow + first-login + regular-login + lockout edges.
- [[01 Account Management]] — defines the **Normal-User limit** that interacts with R6.

## Pages where statuses surface

- **Add User wizard** (Tab 2 Role & Status) — default `Pending` for new users.
- **Edit User** (admin-driven) — status dropdown with allowed-transitions logic.
- **More Details / View User** — shows current status as a [[Falcon Status Badge]].
- **Users list** (Organization Hierarchy → Hierarchy tab) — filter by Status; row pill shows status.
- **Login flow** — first-login (Pending → Active) and regular-login (Active-only) branch on status.
- **OTP popup** — failed-OTP counter (R8) drives Locked transition.
- **Forgot Password flow** — wrong-OTP behaviour diverges from login (PRD says status stays Active on Forgot-Password wrong OTP — flagged as risk in `understanding.md` § Risks).

## Edge cases worth noting

- **Forgot Password wrong OTP** — PRD says status stays Active (differs from regular login R8). Flagged in PRD-02 risks; open clarification.
- **Deleted → Active restore** — PRD doesn't specify whether the original password is preserved or reset. Open clarification.
- **3rd wrong OTP during Forgot Password** — diverges from login flow. Worth verifying with business.

## Validation tie-in

- Status transitions must match the matrix above — frontend dropdown must only offer reachable target statuses based on current.
- Normal-User → Active transition triggers the Commerce limit check before save.

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]]
