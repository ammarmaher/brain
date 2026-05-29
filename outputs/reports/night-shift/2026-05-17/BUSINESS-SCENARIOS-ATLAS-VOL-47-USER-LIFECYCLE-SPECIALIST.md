# Volume 47 — User Lifecycle Specialist Guide

> **Specialist depth:** Convert Vol 44 §3 truth tautologies (US-TT-01..05) into a working operating model for every user status transition, login flow, OTP path, soft-delete semantics, locking event, and audit hook. Use this volume when implementing or reviewing **anything that touches the User entity or session lifecycle**.
>
> **Source-of-truth boundary:** BRD-extracted facts marked `[BRD-EXTRACTED]`; code-citation will be added in §V47-CODE-VERIFICATION-ADDENDUM (Wave 14 mining agent running in parallel).

---

## §1 — The 5 User Statuses (definitions, can-login, can-forget, counted-in-limit)

### §1.1 Status definitions (Vol 44 §3.1 + Users-Statuses-Others.txt)

| Status | Definition | Reachable from | Reachable to | Counted in User Limit |
|---|---|---|---|---|
| **Pending** | The user account is created but not yet activated. | (initial state) + Locked | Active, Locked | [INFERRED] Yes |
| **Active** | The user account is fully enabled. | Pending, Suspended, Deleted (via re-activation), Locked (via Pending) | Suspended, Deleted, Locked | [INFERRED] Yes |
| **Suspended** | The user account is temporarily disabled. | Active | Active | [INFERRED] Yes |
| **Deleted** | The user account is permanently deactivated (soft-delete). | Active | Active (via "undelete") | [INFERRED] No |
| **Locked** | The user account is restricted due to security enforcement or administrative action. | Pending, Active | Pending (after lockout cleared) | [INFERRED] Yes |

> Q-UM-19 is still open per Vol 44; the "Counted in User Limit" values above are best-guess inferences pending operator confirmation.

### §1.2 Login + Forget-Password matrix (Vol 44 §3.2)

| From status | Allowed transitions | Can Login from here? | Can Forget Password from here? |
|---|---|---|---|
| Pending | Active, Locked | **Yes** | **No** |
| Active | Suspended, Deleted, Locked | **Yes** | **Yes** |
| Suspended | Active | **No** | **No** |
| Deleted | Active | **No** | **No** |
| Locked | Pending | **No** | **No** |

**Tautologies (Vol 44 §3.3):**
- **US-TT-01** — A Pending user CAN log in (e.g., to complete onboarding) but CANNOT reset password.
- **US-TT-02** — Locked → Pending (not Active) on recovery; re-onboarding required.
- **US-TT-03** — Suspended ↔ Active is the ONLY reversible pair. Deleted → Active is one-way rehydration.
- **US-TT-04** — Only Active users can use Forget-Password.
- **US-TT-05** — Active has 3 terminal transitions (Suspended/Deleted/Locked); others have ≤1.

### §1.3 Why Pending CAN log in but CANNOT forget password

This is a **deliberate** asymmetry:
- A Pending user has set up their initial credentials (during account creation) but has not "claimed" the account via a first-login activation step.
- They CAN log in with the issued credentials to complete onboarding (set permanent password, accept terms, etc.).
- They CANNOT use the Forget-Password recovery flow because their email/phone may not yet be verified.

The asymmetry preserves the **first-login as identity-anchor** pattern.

### §1.4 Why Locked → Pending (not Active)

When a user is locked (e.g., 5 failed login attempts), the recovery path returns them to **Pending**, not Active. This means:
- Admin clears the lock → user lands in Pending.
- User must re-onboard (re-activate via new first-login).
- This prevents an attacker who triggered the lockout from immediately exploiting a `Locked → Active` shortcut after the lock clears.

---

## §2 — The Transition Graph

### §2.1 Visual

```
                  ┌────────────────┐
                  │    [INITIAL]   │
                  └────────────────┘
                          │ admin creates user
                          ▼
        ┌─────────────────────────────────┐
        │            PENDING               │ ◄────┐
        │  (login Yes, forget No, count Yes) │     │
        └─────────────────────────────────┘     │
            │                  │                 │
   first-login                fail-N-times       │
   activation                 (or admin-lock)    │ admin clears lock
            │                  │                 │
            ▼                  ▼                 │
   ┌─────────────────┐   ┌─────────────────┐    │
   │     ACTIVE       │   │    LOCKED        │ ───┘
   │ (Yes/Yes/Yes)    │   │ (No/No/Yes)      │
   └─────────────────┘   └─────────────────┘
            │
       ┌────┼────┬──────────────┐
       │    │    │              │
       ▼    ▼    ▼              │
   ┌─────┐┌─────┐┌─────┐         │
   │SUSP-││DEL- ││LOCK-│         │  (Active→Locked)
   │ENDED││ETED ││ED   │         │
   └─────┘└─────┘└─────┘         │
       │      │     └────────────┘
       │      │
    resume   un-delete
       │      │
       └──┬───┘
          ▼
       ACTIVE
```

### §2.2 Transition triggers

| Transition | Triggered by | Permission |
|---|---|---|
| → Pending (initial) | Admin (AO/Falcon) creates user | `user.create` |
| Pending → Active | User completes first-login activation | system (self) |
| Pending → Locked | Admin manually locks OR system locks (failed attempts) | `user.lock` |
| Active → Suspended | Admin suspends | `user.suspend` |
| Active → Deleted | Admin deletes (soft) | `user.delete` |
| Active → Locked | System locks (failed attempts) OR Admin locks | `user.lock` |
| Suspended → Active | Admin resumes | `user.resume` |
| Deleted → Active | Admin un-deletes ("rehydrate") | `user.undelete` (Falcon-only?) |
| Locked → Pending | Admin clears lock | `user.unlock` |

### §2.3 What about Suspended → Deleted or Deleted → Suspended?

Per Vol 44 §3.2, these are **NOT** allowed. The chain MUST pass through Active:
- Suspended → Active → Deleted (2 transitions).
- Deleted → Active → Suspended (2 transitions).

This means:
- Suspending a deleted user is impossible.
- Deleting a suspended user is impossible.
- Admins must resume-first, then act.

### §2.4 Locked → Active is NOT allowed

Per US-TT-02 — Locked recovers to **Pending**, not Active. This is intentional re-onboarding.

---

## §3 — Login Flow (Multi-Step OTP)

### §3.1 Steps

1. **Step 1 — Username/Email submission.** Frontend submits username + initial check. System responds with one of:
   - `RequirePassword` — proceed to step 2.
   - `RequireOTP` (e.g., OTP-only login if password-less is enabled) — proceed to step 3.
   - `Reject` (UserNotFound / UserBlocked) — terminate.
2. **Step 2 — Password.** User submits password. System validates against Zitadel (per Identity service). Response:
   - `RequireOTP` (if 2FA enabled).
   - `IssueTokens` (if 2FA disabled).
   - `Locked` (after N failed attempts).
3. **Step 3 — OTP.** OTP delivered via WhatsApp/SMS (per account configuration). User submits OTP code. System validates against the issued OTP record (TTL ~5 min). Response:
   - `IssueTokens` (success).
   - `OtpExpired` / `OtpInvalid` (retry; limited attempts).

### §3.2 Status-gating at each step

| Step | Pending | Active | Suspended | Deleted | Locked |
|---|---|---|---|---|---|
| Step 1 (username) | Allow (returns RequirePassword/OTP) | Allow | Reject (`UserSuspended`) | Reject (`UserDeleted`) | Reject (`UserLocked`) |
| Step 2 (password) | Allow (verified for first-login) | Allow | n/a | n/a | n/a |
| Step 3 (OTP) | Allow | Allow | n/a | n/a | n/a |

### §3.3 Admin OTP path differentiation (Q-UM-13 resolved in prior wave)

Per a prior memory entry, **admin and regular users follow the same OTP path** but with potentially different OTP delivery channels (admin may receive via secure-config-channel, regular users via account-configured channel). The path resolution is per-user, not per-role.

### §3.4 Tenant-settings sync (Q-UM-13 context)

The Identity service consumes a Kafka topic that syncs account-level OTP/password policies from Commerce → Identity. Topics likely:
- `account-settings-updated` (Commerce produces → Identity consumes)
- `tenant-otp-config-updated` ([INFERRED])

This means changing the OTP policy in the Commerce admin console **does NOT take effect at login until the Kafka event propagates to Identity** (eventual consistency, typically <2 seconds).

### §3.5 Password security level (Q-UM-12 resolved)

The system has **2 tiers**, NOT 4 (resolved in prior wave):
- **Normal** (`PasswordSecurityLevel = 1`)
- **Advanced** (`PasswordSecurityLevel = 2`)

Tier rules ([INFERRED]):
- Normal: minimum length 8, must include letter + digit.
- Advanced: minimum length 12, must include letter + digit + symbol, no repeats > 3, no dictionary words.

---

## §4 — Forget-Password Flow

### §4.1 Steps

1. **Step 1 — Request.** User submits email/phone on Forget-Password page.
2. **Step 2 — Validate status.** System checks user status. **Only Active passes (US-TT-04)**; all others throw.
3. **Step 3 — Send recovery OTP/link.** Delivered via account-configured channel (typically WhatsApp/email).
4. **Step 4 — Submit new password.** User clicks link or enters OTP + new password.
5. **Step 5 — Validate new password against security tier.**
6. **Step 6 — Persist to Zitadel + emit `PasswordChanged` event.**

### §4.2 Why Pending users cannot use Forget-Password

A Pending user has not yet verified their email/phone via first-login activation. Sending a recovery link to an unverified contact is a security hole — an attacker who guessed the email could trigger a recovery flow before the legitimate user even logs in.

---

## §5 — User Creation Flow (Pending state birth)

### §5.1 Steps

1. Admin (AO/NA/Falcon) calls `Create User` from Org Hierarchy.
2. Validation:
   - Email/phone uniqueness within account.
   - User-limit not exceeded ([INFERRED] checks against Pending+Active+Suspended+Locked count).
   - PES gate on creator role.
3. User entity persisted with status = Pending.
4. Identity-side: Zitadel user created, password issued (auto-generated or admin-set).
5. Commerce-side: User entity, hierarchy attachment, permissions assigned.
6. Activation message sent to user (with initial credentials + activation link).

### §5.2 Cross-service consistency

User creation crosses Commerce + Identity. Pattern (per Wiki + INFERRED):
- Commerce **owns user lifecycle** (master entity).
- Commerce produces `UserCreated` event → Identity consumes → creates Zitadel user.
- If Identity fails, Commerce emits `UserCreationCompensate` → user rolled back.

This is a **saga** — not a transaction. Race conditions handled by outbox/inbox.

---

## §6 — User Suspension (Admin-initiated)

### §6.1 Use cases

- Temporary HR action (employee on leave).
- Misuse investigation (suspected fraud).
- License/compliance hold.

### §6.2 Effect

- User cannot log in (`UserSuspended` thrown at step 1).
- Existing JWT tokens are **invalidated** ([INFERRED]) via a session-revocation flag.
- User's wallet balance is **not** affected (no money movement).
- User's owned templates/contact-groups remain (creator-only edit rights frozen).

### §6.3 Resume

Only an Admin (NA/AO/Falcon, per PES) can resume. Suspended → Active. Session is NOT auto-restored; user must log in again.

---

## §7 — User Deletion (Soft-Delete + Rehydration)

### §7.1 Soft-delete semantics

Deletion is **soft** — the entity remains in the DB but with `IsDeleted=true` / `status=Deleted` (per Wave 11 hint and PR #40937 reference).

### §7.2 IncludeDeleted query flag (per PR #40937 — landed prior wave)

For Falcon admins to investigate deleted users:
- `GET /users/{id}?includeDeleted=true` is allowed for Falcon-typed sessions.
- The HTTP-service layer (`user-api.service.ts`) automatically appends `IncludeDeleted=true` for Falcon sessions.
- Client sessions cannot pass the flag — backend ignores it.

### §7.3 Rehydration ("undelete")

A deleted user can be restored to Active. This is typically a **Falcon-only** action (clients may not have `user.undelete` in their PES).

Effect:
- `status` flips Deleted → Active.
- All historical data preserved (ledger entries, owned templates, contact groups).
- Session **must** be re-issued (old sessions invalidated).

### §7.4 What soft-delete does NOT do

- Does NOT delete the user's wallet balance (any per-user balance lives until contract expires).
- Does NOT delete the user's audit log (10-year SAMA retention).
- Does NOT delete content created by the user (templates remain in catalog; CGs remain in lists).
- Does NOT free up the user-limit slot (Q-UM-19 — INFERRED that Deleted does NOT count, which would mean it DOES free the slot).

---

## §8 — User Locking (Security-Enforcement)

### §8.1 Triggers

- **Automatic:** N consecutive failed login attempts (e.g., 5).
- **Manual:** Admin lock (HR, compliance).
- **System:** Detection of anomaly (multiple IPs in short window, suspicious device).

### §8.2 Behavior

- All login attempts return `UserLocked`.
- Existing sessions are revoked.
- Forget-Password is blocked.
- Recovery requires admin to call `Unlock` → user lands in **Pending** (per US-TT-02), re-onboarding triggered.

### §8.3 Lockout duration

[INFERRED]: Falcon supports two modes:
- **Time-based** — auto-unlock after X minutes.
- **Admin-only** — requires manual unlock.

Mode is per-account-policy.

---

## §9 — PES Interactions (which keys are gated by status)

### §9.1 Status × PES key gates

| PES key | Gates by status |
|---|---|
| `user.create` | Caller status = Active (the admin must be Active) |
| `user.suspend` | Caller = Active; target = Active |
| `user.delete` | Caller = Active; target = Active |
| `user.undelete` | Caller = Active; target = Deleted (Falcon-only) |
| `user.lock` / `user.unlock` | Caller = Active; target = any |
| `user.update.profile` | Caller = Active; target = Active OR self (own profile) |
| `user.reset.password` | Caller = Active; target ∈ {Active, Pending, Locked} |
| `wallet.transfer.execute` | Caller = Active (no other status can transfer) |
| `template.create` | Caller = Active |
| `commchannel.purchase` | Caller = Active |

> **Universal axiom:** **No non-Active user can invoke any mutation.** The first PES check at every command handler is `caller.status == Active`.

### §9.2 PES key cross-reference

Per Vol 44 (Q-AM-16 still open) + PES Catalog under `_obsidian/66-PES-Rules/` — the full 47 PES keys × 6 canonical roles grid is the audit target of Vol 50 (Wave 17 in the autopilot plan).

---

## §10 — Cross-Bounded-Context Sync

### §10.1 Commerce ↔ Identity Kafka topology

User lifecycle events flow across Commerce (owner) → Identity (Zitadel sync):

| Event | Producer | Consumer | Effect |
|---|---|---|---|
| `UserCreated` | Commerce | Identity | Create Zitadel user, issue initial creds |
| `UserSuspended` | Commerce | Identity | Invalidate sessions, block Zitadel login |
| `UserDeleted` | Commerce | Identity | Disable Zitadel user (NOT delete) |
| `UserUndeleted` | Commerce | Identity | Re-enable Zitadel user |
| `UserLocked` | Commerce | Identity | Lock Zitadel user, revoke sessions |
| `UserUnlocked` | Commerce | Identity | Unlock Zitadel; user re-onboards |
| `UserPermissionsChanged` | Commerce | Identity | Re-issue JWT claims on next refresh |
| `TenantSettingsUpdated` | Commerce | Identity | Apply new OTP/password policy |

### §10.2 Sync latency

[INFERRED] sub-second under normal load; up to several seconds under Kafka backlog. **Implication:** Admin changes have eventual consistency — UI should communicate this (e.g., "Suspension applied; may take a moment to take effect").

### §10.3 Failure modes

If Identity fails to apply an event:
- Kafka consumer retries with backoff.
- Persistent failure → dead-letter queue (DLQ).
- Falcon-admin alert triggered.

The Commerce-side user state is the **authoritative** state; Identity is a **projection**. If they diverge, Commerce wins.

---

## §11 — Audit & SAMA

### §11.1 Audit events emitted per lifecycle action

Every user-mutation handler MUST emit an audit event:
```
AuditEvent {
  id, timestamp,
  type: 'UserCreated' | 'UserSuspended' | ... ,
  actor: { userId, role, ip, deviceId },
  target: { userId, status_before, status_after },
  reason?: string (optional admin comment),
  correlationId,
  account: accountId,
}
```

### §11.2 SAMA requirements

- 10-year retention.
- Append-only at DB level (or strict app-enforcement).
- Audit-export endpoint with strict authorization.
- Searchable by user, by actor, by timestamp, by action type.

### §11.3 Audit log destination

[INFERRED] — the audit log is likely a separate Mongo collection `audit_events` with a daily-rolling partition. Q-AUD-01: confirm destination + partition strategy.

---

## §12 — Edge Cases

### §12.1 User suspends self
**Setup:** AO tries to suspend their own account.
**Behavior:** Should be blocked at PES + command-handler level. Otherwise the AO would lock themselves out and recovery requires Falcon intervention.

### §12.2 Last Admin scenario
**Setup:** AO tries to delete the last NA in the account, OR delete themselves.
**Behavior:** Block at command-handler. An account MUST have at least one Active AO at all times.

### §12.3 Concurrent suspend + delete by two admins
**Setup:** Admin A suspends User-X; Admin B deletes User-X at the same time.
**Behavior:** Optimistic concurrency on User entity (Version++). Whichever lands second gets a `VersionConflict` and must retry. Final state is consistent.

### §12.4 OTP delivery failure
**Setup:** OTP fired to WhatsApp; WhatsApp message fails (recipient not on WA).
**Behavior:** Fallback to SMS (if account configured) or surface error. OTP TTL (5 min) starts at issuance, not at delivery confirmation.

### §12.5 Stale Zitadel session after Commerce-side suspend
**Setup:** User has active JWT; admin suspends them; Kafka event delayed.
**Behavior:** Suspended user MAY make 1-2 more authenticated calls before Identity processes the event. Gateway-side enforcement should NOT rely on cached status — re-check on each request.

### §12.6 Account-level deletion cascades to users
**Setup:** Account is deleted (rare; e.g., commercial off-boarding).
**Behavior:** All users under the account transition to Deleted. The deletion is **cascading** at the Commerce level + projected via Kafka to Identity.

---

## §13 — Error Catalog (user-domain)

| Error code | When thrown | Recovery |
|---|---|---|
| `UserNotFound` | Step 1 of login; user doesn't exist OR Deleted (no IncludeDeleted flag) | Verify credentials |
| `UserSuspended` | Login step 1; status = Suspended | Admin must resume |
| `UserDeleted` | Login step 1; status = Deleted | Admin must un-delete |
| `UserLocked` | Login step 1; status = Locked | Admin must unlock |
| `InvalidCredentials` | Step 2; wrong password | Try again or Forget-Password |
| `TooManyFailedAttempts` | Step 2; N failures in window | User auto-Locked; admin unlock required |
| `OtpExpired` | Step 3; OTP TTL exceeded | Re-request OTP |
| `OtpInvalid` | Step 3; wrong OTP code | Retry (limited attempts) |
| `ForgetPasswordNotAllowed` | Forget-Password requested for non-Active user | Admin resolves |
| `UserAlreadyExists` | Create-user; email/phone unique violation | Use different identity |
| `UserLimitExceeded` | Create-user; account at limit | Upgrade plan or delete existing |
| `LastAdminCannotBeDeleted` | Delete-user; would leave account without AO | Promote another user first |
| `CannotSuspendSelf` | Suspend-user; target = caller | Different admin must act |
| `IpNotAllowed` | Login at any step; caller IP not in account allowlist | Connect from allowed IP |
| `PasswordTooWeak` | Set/Reset password; below tier requirements | Use stronger password |

---

## §14 — PR Review Checklist

When reviewing user-lifecycle code, check:

- [ ] Is the caller status checked = Active before any mutation?
- [ ] Is the target status check honored (e.g., can't suspend already-Deleted)?
- [ ] Is the PES key applied at the command-handler entry (not buried)?
- [ ] Is the Kafka event emitted in the same transaction as the entity update?
- [ ] Is the audit event written?
- [ ] Is the user-limit count updated correctly (if applicable)?
- [ ] Is the optimistic concurrency token honored?
- [ ] Is the session revocation hook triggered on Suspend/Delete/Lock?
- [ ] Is the cascading effect handled (e.g., user-delete also un-shares CGs they shared)?
- [ ] Is the IncludeDeleted flag respected for Falcon-side reads?
- [ ] Is the Last-Admin guard enforced for Delete/Suspend on AO role?
- [ ] Is the lockout-attempt counter incremented atomically on failed login?
- [ ] Is the Forget-Password gate at Step 2 (status validation)?
- [ ] Is the password security tier enforced on set/reset?

---

## §15 — Cross-References

- [[VOL-44-TRUTH-TAUTOLOGIES]] §User Status (US-TT-01..05) — atomic tautologies
- Vol 35 — Module 02 User Management Conclusion (this volume operationalizes it)
- Vol 44 §3 — BRD-extracted status definitions + transition graph
- Vol 45 — Wallet Specialist (wallet authority requires Active status)
- Vol 46 — Campaigns Specialist (template/send authority requires Active)
- WAVE-14-CODE-MINING-USER-LIFECYCLE.md — agent code citations (pending completion)

---

**End of Volume 47 — User Lifecycle Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 44 §3 + Vol 35 (Module 02 conclusion)
**Pending:** §V47-CODE-VERIFICATION-ADDENDUM (Wave 14 agent will produce)


---

## §V47-CODE-VERIFICATION-ADDENDUM (Added 2026-05-18 — Wave 14 mining agent)

> **3 BRD-vs-code drifts surfaced.** Two are bugs (webhook + password); one is a known-not-implemented (per-tenant OTP toggle). All flagged for follow-up.

### Correction §1 — User entity ownership (REVISES §5.2 + §10)

**Was inferred:** "Commerce owns user lifecycle (master entity); Identity is a projection."

**Code says:** **User aggregate lives ONLY in Identity** — `Domain\Entities\User.cs` in `falcon-core-identity-svc`, persisted in MongoDB `Users` collection in `FalconIdentityDb`. Commerce has **NO User entity**. Instead Commerce emits `UserCreationRequestedEvent` (with AES-256-GCM encrypted password) via Kafka → Identity creates the user.

**Refined cross-bounded-context model:**
- **Identity** owns User entity (creation, status, transitions, password, sessions).
- **Commerce** owns Account, Node, Permissions, and the **request** to create a user — not the user itself.
- **Kafka direction:** Commerce → Identity for creation; Identity → Commerce for "user-event-occurred" if Commerce needs to react.
- **Authoritative state:** **Identity wins** on user-lifecycle conflicts (opposite of what §10.3 inferred). 

This is a **significant** correction to my Vol 47 §5.2 + §10 — the ownership arrow is reversed.

### Correction §2 — eUserStatus enum values (LOCKS §1.1)

**Code:** `eUserStatus { Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5 }`.

**Implication:** Code numbering does not match Vol 44 §3.2 row order (which has Locked listed *after* Deleted). The code order is: Pending(1) · Active(2) · Suspended(3) · **Locked(4)** · **Deleted(5)**. Updates to entity-mapping code should use these enum integers.

### Correction §3 — Transition policy location (CONFIRMS §2.1)

`UserStatusTransitionPolicy.cs:16-40` codifies the entire state machine, including:
- **Deleted → Active** is Falcon-only via `OnlyFalconUserCanRestoreDeletedUser` policy. **CONFIRMS US-TT-03** (rehydration is a Falcon power).

### Correction §4 — Login eligibility (CONFIRMS §3.2)

`LoginEligibilityPolicy.cs:14-26`:
- Locked → throw `UserLocked`
- Suspended → throw `UserSuspended`
- **Deleted → masked as `InvalidCredentials`** ⚠️ — security-by-obscurity (deliberate; doesn't reveal account is deleted)

**Implication for error catalog §13:** `UserDeleted` is NOT thrown at login. The client always sees `InvalidCredentials` for a deleted user. This is a **deliberate hardening**, not a bug.

### Correction §5 — Forget-Password gate (CONFIRMS §4.2 / US-TT-04)

`ForgotPasswordProcess.cs:35-36` has an explicit `UserPending` block in addition to the Suspended/Deleted/Locked rejects. Only Active users qualify. **CONFIRMS US-TT-04 with code.**

### Correction §6 — Soft-delete is a SEPARATE flag, NOT the Deleted status (MAJOR CLARIFICATION)

**Was assumed:** "Deleted" status IS the soft-delete marker.

**Code says:** **`IsDeleted` is a separate boolean flag** on User, independent of `Status`. The soft-delete query filter at `UserAggregator.cs:29-31` filters by `IsDeleted == false`, NOT by `Status != Deleted`.

**Implication:** A user can theoretically be:
- `Status=Active, IsDeleted=false` — normal active user
- `Status=Deleted, IsDeleted=true` — deleted via the lifecycle action
- `Status=Active, IsDeleted=true` — **anomalous** — deleted via the flag but somehow still Active
- `Status=Deleted, IsDeleted=false` — **anomalous** — Deleted status but query filter hasn't excluded them

The Vol 44 §3.1 mapping "Deleted = soft-delete" is therefore **imprecise**. The truth is:
- `Status=Deleted` is the **policy-level** state (user-visible).
- `IsDeleted=true` is the **query-level** flag (hides from default reads).

These are **typically aligned** but two distinct fields. The lifecycle action probably sets both.

### Correction §7 — IncludeDeleted is Falcon-only (CONFIRMS §7.2)

`ListNodeUsersHandler.cs:55` and `GetUserByIdEndpoint.cs:20` accept the IncludeDeleted parameter ONLY for Falcon sessions. Confirms the PR #40937 lift behavior.

### Correction §8 — User-limit counting (RESOLVES Q-UM-19, partially)

**Code says:** User-limit counts **everything where `IsDeleted == false`** regardless of `Status`. So:
- Pending → counts ✅
- Active → counts ✅
- Suspended → counts ✅
- Locked → counts ✅
- Deleted-via-status-only-not-flag → counts ✅ (anomalous case)
- IsDeleted=true → does NOT count

**Q-UM-19 partial resolution:** All 5 statuses count toward the limit **unless** `IsDeleted=true`. Whether the `Status=Deleted` action also sets `IsDeleted=true` is the gap.

### ⚠️ BUG §1 — Zitadel webhook violates Locked→Pending policy

**Found at:** `ZitadelWebhookEndpoint.cs:112`.
**Behavior:** When Zitadel signals `UserUnlocked`, the webhook handler sets `Status = Active`.
**Policy:** `UserStatusTransitionPolicy.cs:16-40` says Locked → **Pending**, not Active.
**Severity:** **HIGH** — security regression. An attacker who triggers lockout then social-engineers an unlock would bypass the re-onboarding intent of US-TT-02.

**Fix recommendation:** Webhook handler should call `UserStatusTransitionPolicy.TransitionTo(Pending)` instead of directly setting Status.

### ⚠️ BUG §2 — Advanced password security is a no-op

**Found at:** `PasswordPolicy.cs`.
**Behavior:** `PasswordSecurityLevel` enum has Normal=1 and Advanced=2, but the policy rules applied are **identical** for both values.
**Q-UM-12 status:** PARTIALLY resolved — enum exists with 2 values, but the Advanced tier has no enforcement above Normal.
**Severity:** **MEDIUM** — clients selecting "Advanced" believe they have stronger password rules but actually don't. False sense of security.

**Fix recommendation:** Implement differentiated rules per `PasswordSecurityLevel` (e.g., Advanced requires length ≥12, symbol, no dictionary, no repeats > 3).

### ⚠️ KNOWN-GAP §3 — Per-tenant OTP toggle missing (Q-UM-13)

**Found:** No per-tenant OTP toggle in `TenantSettings`. OTP is global config; no admin/user differentiation.
**Prior memory:** "Q-UM-13 RESOLVED — same OTP path with per-user channel" was an over-statement. Code does NOT differentiate admin vs user OTP at all.
**Q-UM-13 status:** **NOT RESOLVED**. Re-opened.

**Fix recommendation:** Add `TenantOtpPolicy` to `TenantSettings` with fields `RequireOtpForAdmin`, `RequireOtpForUser`, `AdminOtpChannel`, `UserOtpChannel`.

### Correction §9 — `MaxSystemUserLimit` is dead config

**Found:** `MaxSystemUserLimit` is loaded from config but **never enforced** in the code.
**Implication:** System-level user-cap (e.g., for sandbox/trial accounts) is not actually applied. Could allow runaway resource consumption.
**Severity:** **LOW-MEDIUM** — operational risk, not security-critical.

### Updated code citations

| Concept | File:line |
|---|---|
| User aggregate | [CODE] `Domain\Entities\User.cs` (Identity service) |
| User collection | [CODE] `FalconIdentityDb.Users` |
| eUserStatus enum | [CODE] `Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5` |
| State machine | [CODE] `UserStatusTransitionPolicy.cs:16-40` |
| Deleted→Active guard | [CODE] `OnlyFalconUserCanRestoreDeletedUser` |
| Login eligibility | [CODE] `LoginEligibilityPolicy.cs:14-26` |
| Forget-password gate | [CODE] `ForgotPasswordProcess.cs:35-36` |
| Soft-delete query filter | [CODE] `UserAggregator.cs:29-31` |
| IncludeDeleted parameter (Falcon-only) | [CODE] `ListNodeUsersHandler.cs:55`, `GetUserByIdEndpoint.cs:20` |
| Webhook bug (Locked→Active) | [CODE] `ZitadelWebhookEndpoint.cs:112` ⚠️ |
| Password policy no-op | [CODE] `PasswordPolicy.cs` ⚠️ |

### Question status after Wave 14

| ID | Status | Outcome |
|---|---|---|
| Q-UM-12 | 🟡 PARTIAL | Enum verified (2-tier) but **Advanced is a no-op** — BUG flagged |
| Q-UM-13 | 🔴 REOPENED | Per-tenant OTP toggle does NOT exist — gap flagged |
| Q-UM-19 | 🟡 PARTIAL | All non-IsDeleted statuses count; whether Status=Deleted also sets IsDeleted=true is the remaining gap |
| Q-UM-20 (NEW) | 🟡 OPEN | When Status=Deleted vs IsDeleted=true diverge, who wins? |
| Q-UM-21 (NEW) | 🟡 OPEN | Should `MaxSystemUserLimit` be enforced, and where? |



---

## §V47-IDENTITY-DEEP-ADDENDUM (Added 2026-05-18 — Wave 23 mining agent)

> **5 major findings.** Two reverse my Vol 47 §10 inferences, one is a new security gap (HIGH), one is a JWT claim drift, and one fundamentally re-characterizes Identity as a thin Zitadel wrapper.

### Correction §1 — Identity is a THIN orchestrator over Zitadel (REVERSES §10.1 implication)

**Was implied:** Identity owns the User entity AND the authentication state.

**Code says:** **Zitadel owns** sessions, password hashing, OTP generation, lockout counters, JWT signing. **Identity is a thin orchestrator** that wraps Zitadel via three named HTTP clients at `ServiceCollectionExtensions.cs:217-248`:
- `ZitadelLogin` — login flow + authorize/token endpoints
- `ZitadelAdmin` — user CRUD + metadata writes
- `ZitadelNoRedirect` — server-side calls that bypass redirect flows

**The login dance:** `ZitadelAuthService.cs` orchestrates a multi-step `authorize → create-session → password+otp PATCH → finalize → token` flow. Identity coordinates; Zitadel executes.

**Implication for Vol 47:** The User entity DOES live in `FalconIdentityDb.Users` (Wave 14 confirmed) — but it carries Falcon-specific metadata (status, custom fields). The **authentication / credential / session state** lives in Zitadel, not in Identity's database.

This is **a cleaner architecture** than I documented:
- Falcon User entity = business identity (with status, hierarchy, custom flags).
- Zitadel user = credential identity (with password hash, OTP factors, sessions).
- They're linked 1:1 via the `user-id` claim.

### Correction §2 — Falcon session in HybridCache, NOT DB (CLARIFIES §3.1)

**Was implied:** Sessions are tracked somewhere persistent.

**Code says:** Falcon's `AuthenticationSession` lives in **HybridCache** (L1 in-memory + L2 Redis) with a **10-minute TTL** (`AuthSessionCache.cs:11-14`).

The Zitadel session ALSO exists (managed by Zitadel internally). **No DB-backed sessions, no cookies.**

**Implication:**
- A Falcon session can be invalidated by clearing the HybridCache entry.
- A Zitadel session can be invalidated via Zitadel API.
- The two are coordinated via the JWT lifecycle.

**Q-IDENTITY-01 (NEW):** What happens if Redis is unavailable? Does the L1 cache provide fallback, or does login fail until Redis returns?

### Correction §3 — JWT custom claims via Zitadel metadata (NEW KNOWLEDGE)

**Storage:** Falcon's custom claims are stored as **Zitadel user metadata** (base64-encoded bag, written via `ZitadelAdmin` client).

**Promotion:** `ZitadelClaimsTransformation.cs:19-51` runs at token-validation time and **promotes the metadata bag to top-level claims**. This means the final JWT seen by gateways/handlers has these as first-class claims, not buried in metadata.

**The 4 Falcon claims** (`ZitadelClaimTypes.cs:23-26`):
- `user-id` — Mongo ObjectId of the User entity (NOT the Zitadel user ID)
- `user-type` — role tier (Falcon vs Client typing)
- `tenant-id` — for the tenant boundary check (Vol 50 §9)
- `node-id` — the node the user is anchored to

### ⚠️ DRIFT §4 — `path` claim missing from JWT metadata (NEW)

**Code says:** The User entity has a `Path` field (e.g., `/account/node-a/node-b`), but it is **NOT** included in the Zitadel metadata → NOT promoted to JWT.

**Implication for Vol 50 §8** (hierarchy/node-scope at handler layer):
- Vol 50 §8 said "the `User.Path` field is used at the handler layer".
- If `path` is NOT in the JWT, the handler must **query the database** for the path on every authorization check.
- This is a hot-path read on every API call. Could be a perf concern at scale.
- More importantly, it's a **stale-data risk** — if the user's path changes (re-parented), the JWT carries an outdated path... unless the handler always re-reads.

**Q-IDENTITY-02 (NEW):** Is the missing `path` claim deliberate (avoid stale-path) or accidental (oversight)? If deliberate, document the hot-path read pattern. If accidental, add `path` to metadata sync.

### ⚠️ SECURITY GAP §5 — IP allowlist not applied to refresh-token + password-change (HIGH)

**Code says:** IP allowlist enforcement lives at **Identity-side**, not (only) gateway-side. The middleware (`IpAllowlistGuard.cs` + `IpAllowlistPreProcessor.cs`) is opted-in by **ONLY 4 endpoints**:
1. Login
2. ForgotPassword
3. ResendOtp
4. VerifyOtp

**The gaps:**
- **Refresh-token endpoint is NOT gated** by IP allowlist.
- **Password-change endpoint is NOT gated** by IP allowlist.

**Why this is a HIGH security gap:**
- An attacker who stole a valid refresh token can refresh from ANY IP (bypassing IP allowlist).
- A user who's been re-located outside the allowed IP range can still change their password (could be intended OR a leak).
- The protection of the initial Login is undermined if a follow-up refresh isn't gated.

**Q-IDENTITY-03 (NEW HIGH):** Confirm if this is by design (e.g., refresh tokens are short-lived enough that IP gating is unnecessary) OR a bug. Either way, document it explicitly.

### Drift §6 — Identity Kafka topology (REVERSES Vol 51 §2.2)

**Was inferred (Vol 51 §2.2):** Identity produces 5 topics: `user-created`, `user-creation-failed`, `password-changed`, `session-started`, `session-revoked`.

**Code says:** Identity is a **NET CONSUMER, not publisher**:
- **Consumes** `commerce.user-creation-requested.v1` + `commerce.identity-settings-sync.v1`.
- **Produces ONLY** `identity.user-events.v1` (currently carries `UserRoleLinkSyncRequestedAvroEvent` only).

**Implication:**
- The Wave 14-hinted "user-created", "password-changed", etc. topics **do not exist as Identity-produced topics**.
- Audit logging happens via direct MongoDB write to `AuditLogs` collection (in same `FalconIdentityDb`), NOT via Kafka fan-out.
- Other services that need to know about identity events (e.g., Audit aggregator, Commerce UI sync) must either poll the DB OR rely on the single `identity.user-events.v1` topic which is currently underutilized.

**Q-IDENTITY-04 (NEW):** Is this designed minimalism, or should more Identity events be published for other consumers? E.g., Charging may want `password-changed` for audit.

### New Knowledge §1 — Password never persisted by Falcon

The password journey:
1. Admin sets it during user creation.
2. Commerce **encrypts** with AES-GCM and emits via Kafka.
3. Identity consumer **decrypts** (brief plaintext in memory only).
4. Identity forwards to Zitadel via `ZitadelAdmin.SetPassword`.
5. Zitadel stores hash; plaintext never persisted by Falcon.

This is good security posture — Falcon never has a password at rest.

### New Knowledge §2 — Logout semantics

Logout revokes **only the refresh token** — does **NOT delete the Zitadel session**. The Zitadel session naturally expires per Zitadel's TTL.

**Implication:**
- If a user logs out then tries to re-login within the Zitadel session lifetime, they may get a faster sign-in path (Zitadel session still valid).
- If an attacker captured the **access token** before logout, the token is still valid until its expiry. Logout doesn't immediately kill access.

**Q-IDENTITY-05 (NEW):** Is the logout semantic intentional? Or should logout also revoke the Zitadel session for stricter session-management?

### New Knowledge §3 — Audit log destination

Audit events for Identity actions write to MongoDB collection **`AuditLogs`** in the same `FalconIdentityDb` (NOT a separate audit DB, NOT a Kafka topic).

**Implication for Vol 51 §8** (audit aggregator): Identity audit is a local Mongo collection. Cross-service audit aggregation must either:
- Poll each service's audit collection.
- OR have services publish audit events to a shared audit Kafka topic (currently NOT happening from Identity).

**Q-IDENTITY-06 (NEW):** Is there a cross-service audit aggregator? Or does each service own its own audit log?

### Code citations added

| Concept | File:line |
|---|---|
| Three Zitadel HTTP clients | [CODE] `ServiceCollectionExtensions.cs:217-248` |
| Login flow orchestrator | [CODE] `ZitadelAuthService.cs` |
| HybridCache 10-min TTL for AuthSession | [CODE] `AuthSessionCache.cs:11-14` |
| Claims transformation | [CODE] `ZitadelClaimsTransformation.cs:19-51` |
| 4 Falcon claim names | [CODE] `ZitadelClaimTypes.cs:23-26` |
| IP allowlist guard | [CODE] `IpAllowlistGuard.cs` |
| IP allowlist pre-processor | [CODE] `IpAllowlistPreProcessor.cs` |
| Audit log collection | [CODE] `FalconIdentityDb.AuditLogs` |
| Identity Kafka producer (single topic) | [CODE] `identity.user-events.v1` |

### Status of Q-* questions after Wave 23

| ID | Status | Note |
|---|---|---|
| Q-IDENTITY-01 (NEW) | 🟡 OPEN | Redis unavailability fallback for HybridCache |
| Q-IDENTITY-02 (NEW) | 🟡 OPEN | Why `path` claim missing from JWT metadata |
| Q-IDENTITY-03 (NEW) | 🔴 HIGH | IP allowlist not gating refresh-token / password-change |
| Q-IDENTITY-04 (NEW) | 🟡 OPEN | Should Identity publish more topics (user-created etc.)? |
| Q-IDENTITY-05 (NEW) | 🟡 OPEN | Logout doesn't revoke Zitadel session — intentional? |
| Q-IDENTITY-06 (NEW) | 🟡 OPEN | Cross-service audit aggregator topology |

