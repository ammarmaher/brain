---
type: per-module-conclusion-knowledge
volume: 35
module: 02-user-management
title: "Module 02 — User Management CONCLUSION KNOWLEDGE"
purpose: "The single answer key for every question about User Management. Truth-grounded. Covers users + auth + login flows + OTP + passwords + permissions + edit-user."
authority: "CANONICAL for Module 02 — supersedes earlier volumes where they conflict"
prd-source: "User Management Module - V2 (Drive sync 2026-04-24) + Permission list - Jawad sheet"
---

# Module 02 — User Management CONCLUSION

> Master answer key for everything related to: user lifecycle, authentication, OTP, password policies, login/forgot-password/change-password flows, edit-user, permission groups, session management.

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **User Management owns the lifecycle of every Falcon user across two user types (Falcon admin = root-node; Client = main/sub) and 6 roles (sys-admin/operation/product on Falcon side; account-owner/node-admin/normal-user on Client side). Status FSM has 5 states: Pending → Active → {Suspended, Locked, Deleted}, with strict transition rules (LCK→PEN and DEL→ACT are Falcon-only). First Login flow forces OTP + password change; Regular Login skips force-change. IP allowlist enforcement is non-negotiable and runs BEFORE credentials check (BR-UM-24). OTP validity is 60s with resend; 3 wrong logins or OTPs = Locked, EXCEPT Forgot-Password OTPs which are silently ignored (anti-DoS design BR-UM-32). Password security level is 2-tier (Normal/Advanced) — code matches PRD exactly (Wave 5b corrected an earlier mis-finding about 4-tier). Username is immutable (BR-UM-19); email+phone simultaneous edit is forbidden (BR-UM-21 — backend validator currently missing). Admin-driven email/phone changes use deferred verification (Wave 5b resolution Q-UM-13): change applies immediately + `IsVerified=false` + user drives OTP themselves at next session. Sessions have a 30-min idle timeout. The module crosses heavily into 01 (Account Owner created in Add Client Step 5), into PES (permission group enforcement), into Identity webhook (Zitadel UserLocked event sync), and into every page that requires login.**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities (per [BRAIN-OUT] `prd/modules/02-user-management/ENTITIES.md`)

| Entity | Key fields | Lifecycle |
|---|---|---|
| **User** | id, usertype (Falcon/Client), role, firstName, lastName, username (≤30, unique, immutable), email, phoneNumber, status, permissionGroupId, nodeId, tenantId, path | Pending → Active → {Suspended,Locked,Deleted} |
| **UserStatusHistory** | userId, fromStatus, toStatus, actor, at, reason | Append-only |
| **LoginAttempt** | id, userId, username, ip, success, reason, at | Append-only |
| **OtpChallenge** | id, userId, channel (Email/Sms), destination, code, expiresAt (60s), attempts, resendCount, purpose | Active → Verified/Expired/Failed |
| **Session** | id, userId, ipAtLogin, createdAt, lastActivityAt, idleTimeoutAt (createdAt + 30 min), refreshTokenId | Active → Expired |
| **PermissionGroup** | id, name, tenantId?, permissions[] | Active / Archived |
| **Permission** | menuItem, pageTab, functionAction, role, value (Allow/Not Allow/Deny/CanBeOverriddenByDeny) | n/a |
| **PasswordPolicy** | passwordSecurityLevel (Normal/Advanced), complexity rules | n/a (embedded in AccountSettings) |
| **OtpAppSetting** | otpLength (4 or 6) — editable by Operation | n/a |

### Status enums

- **eUserStatus:** Active, Pending, Locked, Suspended, Deleted
- **eUserRoles:** sys-admin, operation, product, account-owner, node-admin, normal-user
- **eUserType:** Falcon, Client
- **eAuthenticationStage:** InProgress, OtpRequired, PasswordChangeRequired, Authenticated, Failed
- **ePasswordSecurityLevel:** Normal=1, Advanced=2 (2-tier code matches PRD — confirmed by Wave 5b)
- **eDeliveryMethod:** Email, Sms, Both
- **OtpChallenge.purpose:** login, first-login, edit-email, edit-phone, forgot-password

---

## §3 — WORKFLOWS (8 from PRD)

Per [BRAIN-OUT] `prd/modules/02-user-management/WORKFLOWS.md`:

### W1 — Add User (3 tabs)
**Trigger:** Admin clicks Add User in Org Hierarchy → Users list
**Tabs:** Personal Info → Role & Status → Permissions
**Validations:** Username unique + format; First/Last Name letters only; maxNormalUserLimit check on role=NormalUser
**Status:** ✅ FULLY MINED — `understanding/pages/organization-hierarchy/flows/Add User.md`

### W2 — First Login (Pending → Active)
**Steps:** IP check → Credentials → OTP (60s, 3 wrong = Locked) → force-change-password → Active
**Status:** ✅ Implemented; Identity AuthController (Wave 5b)

### W3 — Regular Login (Active only)
**Steps:** IP check → Credentials → OTP (if config) → Authenticated
**Status:** ✅ Implemented

### W4 — Forgot Password (Active users only)
**Steps:** Username+Phone → IP check → OTP (silent if wrong — anti-DoS BR-UM-32) → New password → Login redirect
**Status:** ✅ Implemented

### W5 — Change Password (from My Profile)
**Steps:** Current + New + Confirm → save → force logout all sessions (BR-UM-35)
**Status:** ✅ Implemented

### W6 — Edit User (Admin)
**Steps:** Personal info / email-OTP-deferred / phone-OTP-deferred / role / status / permission group
**Status:** 🟡 Backend partially implemented; Wave 5b resolved Q-UM-13 (deferred verification); BR-UM-21 simultaneous edit validator MISSING

### W7 — Edit Own Profile (BR-UM-41)
**Excludes:** Role, Status, Permission Group
**Status:** ✅ Implemented; Identity `PUT /api/user/profile`

### W8 — User Status Change
**Allowed transitions:** Per BR-UM-08; DEL→ACT is Falcon-only (BR-UM-39); LCK→PEN forces re-onboarding
**Status:** ✅ Implemented; Identity `PUT /api/user/status`

---

## §4 — BUSINESS RULES (50 rules summarized)

Per [BRAIN-OUT] `prd/modules/02-user-management/BUSINESS_RULES.md`:

### Status & Transitions (BR-UM-01..08, 23, 39)
- 5 states; Pending = default on create
- LCK → PEN = manual unlock (Falcon-only)
- DEL → ACT = Falcon-only

### Roles (BR-UM-02..05)
- 6 canonical roles split between Falcon + Client user types
- Role determines structural access scope
- Permission Group within role determines granular allow/deny

### Naming + Validation (BR-UM-11..14, 19)
- First/Last Name ≤50 letters only
- Username ≤30, starts with letter, unique, **immutable** (BR-UM-19)
- Email valid format
- Phone min-7-digits

### Password Policies (BR-UM-15, 34, 35, 40)
- Auto-generated password per security level (Normal/Advanced)
- Change Password: current + new + confirm; force logout all sessions
- 2-tier code matches PRD (Wave 5b confirmation)

### Authentication (BR-UM-22..29)
- IP check BEFORE credentials (BR-UM-24)
- 3 wrong logins/OTPs → Locked (BR-UM-25/27)
- OTP validity 60s with resend (BR-UM-26)
- OTP length 4 or 6, Operation-configurable (BR-UM-28)
- 30-min idle logout (BR-UM-29)

### Forgot Password (BR-UM-30..33)
- Active users only
- Generic mismatch alert (never reveal which field)
- **Wrong OTP silently ignored** — anti-DoS asymmetry (BR-UM-32)
- Mismatch generic alert (BR-UM-33)

### Edit User (BR-UM-36..41)
- Edit Email → OTP to NEW email (deferred verification per Wave 5b)
- Edit Phone → OTP to NEW phone
- **Reject Email AND Phone simultaneous edit** (BR-UM-21) — backend validator MISSING
- Role edit re-checks maxNormalUserLimit (BR-UM-38)
- Status edit per allowed transitions
- Self-edit excludes Role/Status/PermissionGroup (BR-UM-41)

### Limits (BR-UM-09, 17)
- maxNormalUserLimit per Account
- Re-check on role change to Normal User
- Re-check on status change to Active

### Other (BR-UM-16, 18, 42, 48, 49)
- Profile picture optional
- Credential delivery: Email/Phone/Both
- Permission Group: one per user (BR-UM-42)
- Profile picture size/type silent (BR-UM-48 — gap)
- Contact administrator message structure (BR-UM-49)

### OPEN questions
- Q-UM-01: Forgot-password OTP lockout policy (resolved as silent per BR-UM-32; needs explicit docs)
- Q-UM-04: Force logout scope on password change
- Q-UM-07: PRD Permission Sheet Tab 2 (blocked on Drive)
- Q-UM-10: User move across hierarchy (NOT implemented; GAP-UM-36)
- Q-UM-11: Bulk operations (NOT implemented; GAP-UM-35)
- Q-UM-16: Falcon-only skip-validation for phone/status

### RESOLVED in Wave 5b
- Q-UM-12: Password level is 2-tier in code (matches PRD)
- Q-UM-13: Admin email/phone edit = deferred verification

---

## §5 — PERMISSIONS MATRIX (Module 02 specific)

### Status transitions × actor

| From → To | SA/PR | OP | AO | NA | NU |
|---|---|---|---|---|---|
| Create → PEN | ✅ | ✅ | ✅ (own scope) | ✅ (sub-tree) | ❌ |
| PEN → ACT (self) | n/a (user does it) |  |  |  |  |
| ACT → SUS | ✅ | ✅ | ✅ | ✅ (NU only) | ❌ |
| SUS → ACT | ✅ | ✅ | ✅ | ✅ | ❌ |
| ACT → LCK | system only |  |  |  |  |
| **LCK → PEN** | ✅ **Falcon-only** | ✅ Falcon | ❌ | ❌ | ❌ |
| ACT → DEL | ✅ | ✅ | ✅ | ✅ | ❌ |
| **DEL → ACT** | ✅ **Falcon-only** | ✅ Falcon | ❌ | ❌ | ❌ |
| Edit own profile | n/a (self) — anyone Active | | | | ✅ |

### Edit User × actor (target user)

| Action | SA/PR | OP | AO (target in scope) | NA (target in sub-tree) | NU |
|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | own only |
| Edit Profile | ✅ | ✅ | ✅ | ✅ (NU only) | own |
| Edit Role | ✅ | ✅ | ✅ | ✅ (NU↔NU only) | ❌ |
| Edit Status | ✅ | ✅ | ✅ | ✅ (NU) | ❌ |
| Edit Permission Group | ✅ | ✅ | ✅ | 🟡 | ❌ |
| Reset Password | ✅ | ✅ | ✅ | ✅ (NU) | ❌ (own via change-password) |
| Force-Change-Password | ✅ | ✅ | ✅ | 🟡 | ❌ |
| Edit Email/Phone | ✅ (deferred verify) | ✅ | ✅ | ✅ | own |

---

## §6 — WHAT'S IMPLEMENTED (verified)

✅ **AuthController** (Wave 5b) — 9 endpoints: login, verify-otp, resend-otp, first-login, forgot-password, forgot-password/set-password, change-password, verify-email, verify-phone
✅ **UserController** (Wave 5b) — 20 endpoints including POST `/api/user/` (CreateUser) which was previously thought missing
✅ **SecurityController** (Wave 5b) — 1 endpoint: `GET /api/Security/ip-allowlists`
✅ **WebhookController** (Wave 5b) — 1 endpoint: `/api/webhook/zitadel` (Zitadel events sync)
✅ **IpAllowlistPreProcessor** — runs BEFORE credentials check
✅ **eAuthenticationStage** state machine
✅ **OTP 60s validity + 3-strike lockout**
✅ **Forgot-password silent wrong-OTP** (anti-DoS BR-UM-32)
✅ **Username immutability**
✅ **30-min session idle timeout** (via JWT TTL — verify BR-UM-29 config source)
✅ **Add User wizard 3-tab** — `understanding/pages/organization-hierarchy/flows/Add User.md`
✅ **Edit User page folder** — `understanding/pages/edit-user/` (Wave 4)
✅ **Login page folder** — `understanding/pages/login/` (Wave 4)
✅ **Forgot Password page** — `understanding/pages/forgot-password/` (Wave 4)
✅ **Change Password page** — `understanding/pages/change-password/` (Wave 4)
✅ **My Profile page** — `understanding/pages/my-profile/` (Wave 4)
✅ **Q-UM-12 RESOLVED** — password level 2-tier confirmed
✅ **Q-UM-13 RESOLVED** — admin edit = deferred verification

---

## §7 — WHAT'S NOT IMPLEMENTED / OPEN GAPS

🔴 **set-password Stage check MISSING** (Wave 5b — CRITICAL security) — privilege escalation risk
🔴 **Webhook HMAC non-constant-time** (Wave 5b — CRITICAL security) — timing attack
🟡 **BR-UM-21 simultaneous Email+Phone edit validator MISSING** (Wave 5b found)
🟡 **GAP-UM-35 Bulk user operations** — Q-UM-11 OPEN — design space in Vol 10
🟡 **GAP-UM-36 User move across hierarchy** — Q-UM-10 OPEN
🟡 **GAP-UM-34 Manager contact info in alerts** — BR-UM-49 unclear
🟡 **GAP-UM-37 Falcon-only skip-validation** — Q-UM-16 OPEN
🟡 **Force-logout on Permission Group change** — Vol 5 recommendation; not currently implemented
🟡 **Force-logout on Status change** — defense-in-depth gap; 30-min window of stale JWT
🟡 **GAP-UM-27 30-min idle config source** — not visible from endpoint signatures (Q-UM-29)
🟡 **`ChangeUserStatusByIdRequest` DTO declared but unused** (Wave 5b dead code finding)
🟡 **`eAuthenticationStage.Failed` declared but never assigned** (Wave 5b dead code)
🟡 **Manager contact information** in "Contact administrator" alerts — BR-UM-49 unverifiable

---

## §8 — CROSS-MODULE DEPENDENCIES

| Direction | What flows |
|---|---|
| **01 → 02** | Account Owner created in Step 5 of Add Client wizard |
| **02 → PES** | User's permissionGroupId + role drive PES decisions |
| **02 → Zitadel** | All authentication is Zitadel-backed; Falcon Identity proxies |
| **02 → 01** | maxNormalUserLimit + maxSystemUserLimit are Account-level settings checked at User creation |
| **02 → 04** | Contact Groups created by Client users (AO/NA/NU) |
| **02 → 05** | Maker/Checker for Templates are User roles (when built) |
| **02 → Identity webhook** | Zitadel UserLocked event syncs to Falcon User.status |

---

## §9 — TOP 10 BUSINESS QUESTIONS

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | What's the user status FSM? | PEN → ACT → {SUS, LCK, DEL}; LCK→PEN + DEL→ACT Falcon-only | BR-UM-08, BR-UM-39 |
| 2 | Why does Forgot-Password not lock on wrong OTP? | Anti-DoS — would let attackers lock arbitrary users | BR-UM-32 |
| 3 | Is Username editable? | NO — immutable for life | BR-UM-19 |
| 4 | Can admin change a user's email without OTP? | Change applies immediately + IsVerified=false; user drives OTP themselves | Wave 5b Q-UM-13 resolution |
| 5 | What's the password security level set? | 2-tier: Normal=1, Advanced=2 (code matches PRD) | BR-UM-09, Wave 5b |
| 6 | Can email AND phone be edited in one request? | NO — must reject (BR-UM-21); validator MISSING in code | BR-UM-21 |
| 7 | What's the OTP lockout count? | 3 wrong attempts → Locked (login + first-login); forgot-password is silent | BR-UM-25/27/32 |
| 8 | What's the session idle timeout? | 30 minutes (via JWT TTL) | BR-UM-29 |
| 9 | Can AO restore a Deleted user? | NO — Falcon-only restore | BR-UM-39 |
| 10 | Where does IP enforcement run? | IpAllowlistPreProcessor — BEFORE credentials check | BR-UM-24 |

---

## §10 — MODULE 02 NEW INSTRUCTIONS

1. **set-password Stage check is the #1 security fix** — one-line addition to SetPasswordHandler
2. **Webhook HMAC must be constant-time** — `CryptographicOperations.FixedTimeEquals`
3. **Email+Phone simultaneous edit validator must be added** — backend-side enforcement
4. **Force-logout on Permission Group change** — recommended for high-stakes role demotions
5. **Forgot-password silence is intentional** — document this for SOC 2 / SAMA audits
6. **DEL→ACT is Falcon-only** — never let AO/NA restore deleted users
7. **Username is immutable** — UI should disable the field, not silently accept
8. **OTP is 60s** — don't extend the window; build resend UX instead
9. **Idle timeout = 30 min** — confirmed via JWT TTL; per-tenant override doesn't exist (BR-UM-29 gap)
10. **Admin edit email/phone = deferred verification** — UI must show banner to target user

---

## §11 — CROSS-LINKS

- [BRAIN-OUT] `prd/modules/02-user-management/{OVERVIEW,BUSINESS_RULES,ENTITIES,WORKFLOWS,QUESTIONS,GAPS}.md`
- [BRAIN-OUT] `understanding/backend/identity/controllers/{Auth,User,Security,Webhook}Controller/`
- [BRAIN-OUT] `understanding/pages/{login,forgot-password,change-password,edit-user,my-profile}/`
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/flows/Add User.md`
- [BRAIN-OUT] `Brain SK/_obsidian/70-Gaps/SECURITY-FINDINGS-2026-05-18.md`
- [Atlas] Vol 1 Scenarios 4, 7 · Vol 2 Scenario 11 · Vol 5 (Edit User end-to-end) · Vol 28 Matrices 1, 2, 8

---

*Vol 35 · Module 02 User Management CONCLUSION · 2026-05-18 · Truth-grounded · Source-prefixed.*
