*** PRD Understanding - User Management - OVERVIEW ***

# 02-user-management - Overview

> Source PRD: `Brain SK\skills\imported-business\prd-knowledge\modules\02-user-management\latest-prd.md` (`User Management Module - V2`, Drive sync 2026-04-24).
> Supporting sheet: `Permission list - Jawad` (authoritative per-action permission matrix).

## Purpose

Owns the lifecycle of every Falcon user — creation (3-tab wizard), authentication (first-login + regular-login with IP enforcement + OTP), status transitions (Pending / Active / Suspended / Locked / Deleted), password management (change, forgot, reset, force-change), profile editing (with OTP for email/phone changes), and idle-timeout. Falcon has two user types (Falcon admin = root-node, Client = main/sub) and three roles per type. Permissions sit alongside the user record and are gated through the Access (PES) policy engine. The frontend never calls Zitadel directly; all auth runs through the Identity Service (Falcon platform rule).

## Actors

| Actor | User Type | Role Key (per `eUserRoles`) | Where they live |
|---|---|---|---|
| System Administrator | Falcon | sys-admin | Root node — full hierarchy access |
| Operation | Falcon | operation | Root node — view hierarchy, no client-create, no pricing/payment |
| Product | Falcon | product | Root node — like Operation but can add clients, edit pricing, do wallet transfers |
| Account Owner (AO) | Client | account-owner | Main node only — full client-side hierarchy + user management |
| Node Admin | Client | node-admin | Main or Sub node — manages sub-nodes |
| Normal User | Client | normal-user | Any node — transactional only |
| System (agent) | n/a | n/a | Drives auto-lockout, idle-timeout, status transitions caused by account limits |

## Main Screens

| # | Screen | Source |
|---|---|---|
| 1 | Organization Hierarchy -> Hierarchy tab -> Users list (filters: Username, Email, Phone, Role, Status, Permission Group) | understanding.md:18 |
| 2 | Add User wizard (3 tabs: Personal Info / Role & Status / Permissions) | latest-prd.md:44-65 |
| 3 | More Details / View User (read-only) | understanding.md:20 |
| 4 | Edit User (admin) | latest-prd.md:91-105 |
| 5 | My Profile (from side menu beside username) | understanding.md:22 |
| 6 | Change Password (from side menu) | latest-prd.md:87-90 |
| 7 | Login screen | latest-prd.md:67-74 |
| 8 | OTP screen | latest-prd.md:71-72 |
| 9 | Force-change-password screen (post-first-login) | latest-prd.md:74 |
| 10 | Forgot Password screen | latest-prd.md:80-85 |

## Main Actions

| Action | Allowed By | Source |
|---|---|---|
| Add user (with credential delivery choice Email / Phone / Both) | Per role matrix | latest-prd.md:62-65 |
| Edit user (personal / role-status / permissions) | Admin actor only | latest-prd.md:91-105 |
| Edit own profile (no role/status/permissions) | Self | latest-prd.md:107 |
| Change user status (per allowed transitions) | Falcon usertype owns Deleted -> Active restoration | latest-prd.md:41-43 |
| Change password (self) | Self | latest-prd.md:87-90 |
| Forgot password (self) | Self (Active users only) | latest-prd.md:80-85 |
| First login + force-change-password | New users (Pending status) | latest-prd.md:68-74 |
| Regular login | Active users | latest-prd.md:76-78 |
| Verify email / phone (OTP) | Self | latest-prd.md:94 |
| Logout | Self / system idle-timeout | understanding.md:50, 100 |

## Module Dependencies

- **01-account-management** — Password complexity is per AccountSettings.passwordSecurityLevel (Normal/Advanced) (understanding.md:104). Allowed IPs are per account, enforced before credentials. Account Limits cap Normal User count (understanding.md:105).
- **Permission module (PES)** — Permission Groups assigned at create/edit; the `Permission list - Jawad` sheet is the authoritative role->action matrix (understanding.md:106).
- **Notification module** — Delivery of credentials and OTPs via Email / SMS (understanding.md:107).
- **Identity Service (Backend)** — Sits behind the frontend; issues tokens. **Frontend never calls Zitadel directly** (Falcon platform rule reaffirmed in `feedback_frontend_auth_identity_service.md`).
- **Hierarchy module** — All user list screens are scoped by current node in the hierarchy tree (understanding.md:109).
- **05-templates** (transitive) — Checker users on template approval flows come from the User Management roster.
