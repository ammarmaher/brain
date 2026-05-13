# Understanding — User Management

## Module purpose

Own the full lifecycle of every Falcon user: creation, activation, status transitions, login (incl. OTP + IP enforcement + lockout), password management, and profile editing. Also owns the role matrix between Falcon-side and Client-side users, enforced in combination with the Permissions module.

## Actors / users

Two user types × three roles each:

- **Falcon (admin portal only)** — System Administrator, Operation, Product.
- **Client (client portal only)** — Account Owner (Main node only), Node Admin, Normal User.

Both sides include an automatic agent: the system itself is an actor for lockout, idle timeout, and status transitions driven by account limits.

## Main screens / pages

1. **Organization Hierarchy → Hierarchy tab → Users list** with filters (Username, Email, Phone, Role, Status, Permission Group) and `More details` / `Edit`.
2. **Add User wizard** (3 tabs).
3. **More Details / View User** (read-only).
4. **Edit User** (admin-driven).
5. **My Profile** (from side menu beside username).
6. **Change Password** (from side menu).
7. **Login / OTP / Forgot Password** screens.

## Main actions

- Add user (with credential delivery choice).
- Edit user (personal / role-status / permissions).
- Change user status (per allowed transitions).
- Change password (self).
- Forgot password (self).
- View user list with filters.
- Enable / disable the user via Suspended / Locked / Deleted states.

## Business rules

- **R1** Only Falcon usertypes live on the Root node; Client usertypes live on Main / Sub nodes.
- **R2** Only Falcon System Admin can `Add Client`. Product can add clients too; Operation cannot.
- **R3** Username is immutable.
- **R4** Email and Phone are editable one-at-a-time via OTP; simultaneous edit is rejected.
- **R5** Status transitions obey the matrix. Deleted users can only be restored by Falcon usertype.
- **R6** Active/Pending/Suspended/Locked count against the account's Normal-User limit; Deleted does not.
- **R7** ≥3 wrong login attempts → auto-Locked.
- **R8** ≥3 wrong OTP or resend count → auto-Locked.
- **R9** OTP validity 60s; Resend appears on expiry.
- **R10** IP check runs before credentials check; reject message is generic to avoid leaking whether credentials are right.
- **R11** Password complexity rules live per account security level (Normal / Advance) — defined in Account Management.
- **R12** 30-min idle auto-logout.
- **R13** OTP length (4 or 6) is a system-wide App Setting.

## Permission rules

Per the companion sheet `Permission list - Jawad`, permissions are page-/tab-/action-level across many domains (Organization Hierarchy, CommChannels & Services, Apps & Services, Settings). Format: each row is a single UI action (`View <X>`, `Edit <X>`) for each Falcon role, and the allowed values are `Allow`, `Not Allow`, or `Deny`.

Examples (captured during sync):

- System Admin: virtually all `Allow`.
- Operation: `Not Allow` for `Add Client`, `Edit Price Type/Value`, `Do Payment`, `Edit Password Security Level on Root/Main`, `Edit Account Limitations`, `Edit Account basic/official information`.
- Product: similar breadth to System Admin except cannot edit Root-node security level, Allowed IPs on Root, or Sub-node password security.

The sheet is authoritative for per-action gating. See `attachments.md` and the cached CSV.

## Main workflows

### Create
Organization Hierarchy → `Add User` → 3 tabs → Save → (Normal-User limit check) → confirmation + credentials delivery choice → user receives credentials → first-login flow.

### First login
Enter username + password → IP check → credentials check → OTP → force password change → status Active.

### Regular login
Same path but without the forced password change step. Non-Active statuses → specific alert messages (Locked / Suspended / Deleted / Pending).

### Edit user
Admin opens More Details → Edit → modify personal / role-status / permissions → Save. Email/Phone edits go through OTP; simultaneous edit rejected.

### Status change
Allowed transitions: Active↔Suspended; Active↔Deleted (Deleted→Active only by Falcon); Active↔Locked (auto or manual); Locked→Pending (manual; re-activate flow). On Normal-User change-to-Active, validate account Normal-User limit.

## Edge cases

- User saves edit with BOTH email and phone modified → reject with specific alert.
- User edits email only → OTP to new email → if OTP fails/expires, old email stays; other modified fields on the same save still persist.
- Forgot password while Pending → not allowed; alert asks user to log in first.
- Deleted user attempts Forgot Password → treated as `Username is incorrect` (no info leak).
- 3rd failed OTP during Forgot Password → user status set to Locked? PRD says "status is still active" if OTP wrong — differs from login flow. Worth verifying.
- OTP request during Forgot Password → only if username+phone match in DB; else silent.

## Validations (consolidated)

Names: ≤50, letters only, mandatory.
Username: starts with letter, ≤30, unique.
Email / Phone: valid format, mandatory; duplicates allowed across users.
Password: per account security level.
Login attempts ≥3 → Locked.
OTP wrong or resend-count ≥3 → Locked.
Email+Phone simultaneous edit → rejected.
New/confirm password must match.
OTP valid 60s.
Idle 30 min → logout.

## Dependencies

- **Account Management** — password complexity levels (Normal / Advance), Allowed IPs, Account Limitations (Normal-User count).
- **Permission module** — Permission Groups assigned on user create/edit; the `Permission list - Jawad` sheet is the authoritative role→action matrix.
- **Notification module** — delivery of credentials and OTPs via Email / SMS.
- **Identity Service** — sits behind the frontend (per Falcon platform rule) to issue tokens; this module consumes the Identity Service, it does NOT call Zitadel directly.
- **Hierarchy module** — all user list screens are scoped by current node in the hierarchy tree.

## Data entities

- `User` { id, usertype, role, firstName, lastName, username, email, phone, passwordHash, profilePic, status, permissionGroupId, nodeId, createdAt, updatedAt, lastLoginAt }
- `UserStatusHistory` { userId, from, to, actor, at, reason }
- `LoginAttempt` { userId?, username, ip, success, reason, at } — for lockout counters.
- `OtpChallenge` { id, userId, channel, destination, code, expiresAt, attempts, resendCount, purpose: login/edit-email/edit-phone/forgot }

## API expectations (implied)

- `POST /users` — create.
- `GET /users?nodeId=&role=&status=...` — list with filters.
- `GET /users/{id}` — detail.
- `PATCH /users/{id}` — edit personal / role / status / permissions (split endpoints possible).
- `POST /users/{id}/status` — transition with reason.
- `POST /auth/login` — username+password, returns OTP challenge ID.
- `POST /auth/otp/verify` — completes login.
- `POST /auth/otp/resend` — new OTP (counts toward resend limit).
- `POST /auth/forgot-password` — username+phone → OTP on phone.
- `POST /auth/reset-password` — with OTP → new password.
- `POST /me/change-password` — current + new + confirm.
- `POST /me/edit-email` / `POST /me/edit-phone` — trigger OTP to new value.

All requests run behind the Identity Service; frontend never calls Zitadel directly.

## Assumptions

- "Username or Password is incorrect" is the generic message used everywhere to prevent enumeration.
- Email/Phone uniqueness is scoped to Falcon-wide — PRD says "could be duplicated or used by diff usernames", so they're not unique.
- Permission Group assignment is single-valued per user (one group).
- Session timeout is per-user, not per-tab.
- IP allowlist is account-scoped, not user-scoped.

## Risks / unclear areas

- Forgot Password's handling of repeated wrong OTP diverges from login (status stays Active per PRD vs Locked in login). Bug or intended?
- "Normal user limit" is mentioned repeatedly but its source is "account settings" — lives in Account Management PRD; confirm field name and scope (Main node only? Sub nodes too?).
- Deleted → Active restore: does original password still work, or is user re-sent credentials? PRD doesn't say.
- Idle 30-min logout — is this client-side or server-side enforced?
- Profile picture format/size limits not specified.
- "Contact administrator" messaging — unclear if system surfaces contact info or is generic.

## Clarifying questions

1. On Forgot Password, should wrong OTP count toward lockout like in login?
2. After Deleted → Active, is the password reset or preserved?
3. Does changing password invalidate existing sessions on other devices?
4. Profile picture — file type / size constraints?
5. Should the "contact your manager" alerts include manager contact info pulled from the hierarchy?
6. How is the 30-min idle logout implemented — JWT expiry, server-side session tracker, or client-side timer?
