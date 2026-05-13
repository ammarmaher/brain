# Latest PRD — User Management

| Field | Value |
|---|---|
| Drive folder | `2- User Mngmnt Module` |
| Selected PRD file | `User Management Module - V2` |
| Detected version | `V2` → numeric 2 |
| Mime type | Google Doc |
| Sync date | 2026-04-24 |
| Selection reason | Explicit `V2` marker beats the unversioned alternative. |

## Ignored duplicates

- `User Management Module` — no `v<n>` marker; treated as older/unknown.

## Summary

Covers User Management and Login authentication for every user role in Falcon. Falcon has two user types (Falcon / System and Client) with three roles each. Users go through statuses (Pending, Active, Suspended, Locked, Deleted) that gate login. The PRD describes create, edit, view, change-password, forgot-password, first-login, and regular-login flows with IP enforcement and OTP. Permissions are detailed across two companion sheets referenced in the PRD.

## User types & roles

### Falcon user type (admin portal only, root node)
- **System Administrator** — full hierarchy access, adds clients, adds users of any role, edits all account info, full CommChannel/Apps/Contract/Wallet control.
- **Operation** — view hierarchy + nodes, add nodes + operation users + client roles, edit operation / AO / NA / Normal User, can disable CommChannel/Apps but cannot edit price/payment, no wallet transfers, no wallet config view, contract view-only. Limited root/account edits.
- **Product** — like Operation but can add clients, edit price/payment, do wallet transfers, view/edit wallet config, edit contracts, edit account limitations, edit account basic + official info.

### Client user type (client portal only)
- **Account Owner** — Main-node only. Full hierarchy/node/user management within Main + sub-nodes. Can disable / do-payment on CommChannel & Apps, but cannot edit price/visibility. Contracts view-only. Wallet transfers yes; wallet config no.
- **Node Admin** — Main or Sub node. Manages sub-nodes. Cannot add users on Main node. No access to settings or CommChannel/Apps actions. No contract edits. Wallet transfers yes.
- **Normal User** — transaction role. Views + edits only own profile, changes own password.

## User statuses

| Status | Meaning | Counted in limit |
|---|---|---|
| Pending | Created, not yet activated. Needs login + OTP + password change. | Yes |
| Active | Fully enabled, per role. | Yes |
| Suspended | Temporarily disabled by admin. Cannot login. | Yes |
| Locked | Automatic on 3 failed login attempts; or manual. Cannot login until reset. | Yes |
| Deleted | Permanently deactivated. Only Falcon usertype can restore to Active. | No |

Transitions: Active→{Deleted,Locked,Suspended}; Locked→Pending; Suspended→Active; Deleted→Active (Falcon only). When changing to Active for a Normal User, enforce account Normal-User limit.

## Create user (3 tabs)

### Tab 1 — Personal Information
- First Name (≤50, letters only, mandatory)
- Last Name (≤50, letters only, mandatory)
- Username (≤30, starts with a letter, unique across system, mandatory)
- Email (valid, may be duplicated across usernames, mandatory)
- Phone Number (valid, may be duplicated, used for OTP, mandatory)
- Password (auto-generated, complexity per account security level)
- Profile Picture (optional)

### Tab 2 — Role & Status
- Role (per previous list)
- Status (defaults to `Pending` for new users)

### Tab 3 — Permissions
- Permission Group (dropdown; Permission module owns the list).

### Save rules
- If role is Normal User and the account has reached its Normal-User limit → reject with alert.
- On success → confirmation dialog offers to send credentials via Email / Phone / Both.

## Login flows

### First login (Pending → Active)
1. Receive credentials via email / phone.
2. Enter Username + Password → IP check (reject if IP not allowed for account).
3. Credentials check; ≥ 3 wrong attempts → Locked.
4. OTP sent → valid 60s → Resend after expiry.
5. ≥ 3 wrong OTP OR resend counts → Locked.
6. Force password change → status → Active.

### Regular login (Active only)
- Locked / Suspended / Deleted / Pending → specific alerts (see PRD for exact wording).
- Same IP + credentials + OTP sequence as first login.

### Forgot password (Active only)
- Enter Username + Phone.
- IP check.
- If username+phone match in account → OTP to phone → correct OTP → enter new password → redirect to login.
- Incorrect OTP → silent (status stays Active).
- Mismatch → alert.

### Change password (from profile)
- Current Password (mandatory), New Password (mandatory, complexity), Confirm (must match).
- On success → force logout, re-login with new password.

## Edit user (admin)

### Editable — Personal
First Name, Last Name, Profile Picture, Email (with OTP verification to new email), Phone (with OTP verification to new phone). **Cannot edit email AND phone in the same request.**

### Non-editable — Personal
Username (ever), Password (user owns via Change Password).

### Editable — Role & Status
- Role. Changing to Normal User re-validates the Normal-User limit.
- Status. Transitions per status rules.

### Editable — Permissions
- Permission Group.

## Edit own profile
Same editable set as admin except Role and Status are NOT editable, and Permission Group is NOT editable.

## Validations (consolidated)

- First / Last name — no numbers, no special chars, ≤50 chars, mandatory.
- Username — starts with a letter, ≤30 chars, unique, mandatory.
- Email / Phone — valid format, mandatory; duplicates allowed across usernames.
- Password — complexity per account security level (see Account Management sheet).
- Login attempts — ≥3 wrong → Locked.
- OTP — 60s validity; Resend appears on expiry; ≥3 wrong/resend → Locked.
- Cannot edit email and phone in the same save.
- 30-minute idle auto-logout.
- OTP length (4 or 6) is a system-wide App Setting editable by Operation.

## Open questions

- Exact complexity rules per security level are only referenced (via another sheet). Not included in this PRD.
- "Forgot password" IP-check message reuses the login-failure message but PRD uses "Login is not allowed" wording for a password-reset endpoint — probably copy-paste, worth verifying UX wording.
- For `Active → Locked` via manual change, does the system notify the user?
- On Deleted → Active restore, does the user keep old password or get reset?
- `Re-login after Change Password` — PRD says force logout. What's the session invalidation strategy (single device vs all devices)?
