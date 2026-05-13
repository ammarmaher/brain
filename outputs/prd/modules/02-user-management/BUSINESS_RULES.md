*** PRD Understanding - User Management - BUSINESS_RULES ***

# 02-user-management - Business Rules

> Citations point at `Brain SK\skills\imported-business\prd-knowledge\modules\02-user-management\latest-prd.md` unless otherwise noted.

## User Types & Roles

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-01 | Only Falcon usertypes (System Admin, Operation, Product) live on Root node; Client usertypes (AO, Node Admin, Normal User) live on Main / Sub nodes. | latest-prd.md:21-30; understanding.md:38 | [CONFIRMED] |
| BR-UM-02 | Only Falcon System Admin and Product can `Add Client`. Operation cannot. | latest-prd.md:23-26; understanding.md:39 | [CONFIRMED] |
| BR-UM-03 | Account Owner exists at the Main-node level only (one per account). | latest-prd.md:28 | [CONFIRMED] |
| BR-UM-04 | Node Admin manages sub-nodes; cannot add users on Main node. | latest-prd.md:29 | [CONFIRMED] |
| BR-UM-05 | Normal User is the transactional role; views + edits own profile only. | latest-prd.md:30 | [CONFIRMED] |

## User Statuses

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-06 | Status values are: Pending, Active, Suspended, Locked, Deleted. | latest-prd.md:33-40 | [CONFIRMED] |
| BR-UM-07 | Pending, Active, Suspended, Locked all count toward the account's Normal-User limit; Deleted does NOT count. | latest-prd.md:34-40; understanding.md:44 | [CONFIRMED] |
| BR-UM-08 | Status transitions allowed: Active <-> Suspended; Active <-> Deleted (Deleted -> Active by Falcon only); Active <-> Locked (auto or manual); Locked -> Pending (manual). | latest-prd.md:42 | [CONFIRMED] |
| BR-UM-09 | When changing to Active for a Normal User, enforce account Normal-User limit. | latest-prd.md:42; understanding.md:80 | [CONFIRMED] |
| BR-UM-10 | A user goes Pending when freshly created (default). | latest-prd.md:56-58 | [CONFIRMED] |

## Create User (3 tabs)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-11 | First Name + Last Name: <=50 chars, letters only, mandatory. | latest-prd.md:47-48 | [CONFIRMED] |
| BR-UM-12 | Username: <=30 chars, starts with a letter, unique across system, mandatory. | latest-prd.md:49 | [CONFIRMED] |
| BR-UM-13 | Email: valid format, may be duplicated across usernames, mandatory. | latest-prd.md:50 | [CONFIRMED] |
| BR-UM-14 | Phone Number: valid format, may be duplicated across usernames, used for OTP, mandatory. | latest-prd.md:51 | [CONFIRMED] |
| BR-UM-15 | Password is auto-generated; complexity follows account security level (Normal / Advanced). | latest-prd.md:52; understanding.md:48 | [CONFIRMED] |
| BR-UM-16 | Profile Picture is optional. | latest-prd.md:53 | [CONFIRMED] |
| BR-UM-17 | If role is Normal User and the account has reached its Normal-User limit -> reject. | latest-prd.md:62-63 | [CONFIRMED] |
| BR-UM-18 | On successful save -> confirmation dialog offers credential delivery via Email / Phone / Both. | latest-prd.md:64 | [CONFIRMED] |
| BR-UM-19 | Username is **immutable** after create. | latest-prd.md:96; understanding.md:40 | [CONFIRMED] |
| BR-UM-20 | Password is owned by the user (via Change Password), never by admin edit. | latest-prd.md:96 | [CONFIRMED] |
| BR-UM-21 | Email and Phone cannot be edited in the SAME save request (only one at a time, each requiring OTP verification). | latest-prd.md:94, 117; understanding.md:41 | [CONFIRMED] |

## Login & Auth

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-22 | First Login (Pending -> Active): Username + Password -> IP check -> credentials check -> OTP -> force-change-password -> Active. | latest-prd.md:67-74 | [CONFIRMED] |
| BR-UM-23 | Regular Login (Active only): Username + Password -> IP check -> credentials -> OTP. Non-Active statuses receive specific alerts. | latest-prd.md:76-78 | [CONFIRMED] |
| BR-UM-24 | IP check runs **before** credentials check; reject is generic to avoid leaking whether credentials are right. | latest-prd.md:71; understanding.md:47 | [CONFIRMED] |
| BR-UM-25 | >=3 wrong login attempts -> automatic Locked. | latest-prd.md:72; understanding.md:43 | [CONFIRMED] |
| BR-UM-26 | OTP validity is 60s; Resend appears on expiry. | latest-prd.md:73, 116 | [CONFIRMED] |
| BR-UM-27 | >=3 wrong OTP OR resend-counts -> automatic Locked. | latest-prd.md:73, 116; understanding.md:46 | [CONFIRMED] |
| BR-UM-28 | OTP length (4 or 6) is a system-wide App Setting editable by Operation. | latest-prd.md:119 | [CONFIRMED] |
| BR-UM-29 | 30-minute idle auto-logout. | latest-prd.md:118; understanding.md:49 | [CONFIRMED] |

## Forgot Password

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-30 | Forgot Password is available to Active users only. | latest-prd.md:80 | [CONFIRMED] |
| BR-UM-31 | Enter Username + Phone -> IP check -> if Username+Phone match in account -> OTP to phone -> correct OTP -> enter new password -> redirect to login. | latest-prd.md:81-83 | [CONFIRMED] |
| BR-UM-32 | Incorrect Forgot-Password OTP is **silent** (status stays Active). This diverges from the login flow (where 3 wrong OTPs = Locked). | latest-prd.md:84; understanding.md:86 | [CONFIRMED but FLAGGED as inconsistency vs BR-UM-27] |
| BR-UM-33 | If Username + Phone do not match, generic alert (no enumeration leak). | latest-prd.md:85 | [CONFIRMED] |

## Change Password

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-34 | Current Password mandatory; New Password complexity per account security level; Confirm must match. | latest-prd.md:87-89 | [CONFIRMED] |
| BR-UM-35 | On successful Change Password, force logout; user must re-login with new password. | latest-prd.md:90 | [CONFIRMED] |

## Edit User (Admin)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-36 | Editable personal fields (admin): First Name, Last Name, Profile Picture, Email (with OTP to new email), Phone (with OTP to new phone). | latest-prd.md:94 | [CONFIRMED] |
| BR-UM-37 | Non-editable personal fields (admin): Username (ever), Password (user-owned). | latest-prd.md:96 | [CONFIRMED] |
| BR-UM-38 | Role is editable; changing to Normal User re-validates the Normal-User limit. | latest-prd.md:99-100 | [CONFIRMED] |
| BR-UM-39 | Status is editable per the status transition rules in BR-UM-08. | latest-prd.md:101 | [CONFIRMED] |
| BR-UM-40 | Permission Group is editable. | latest-prd.md:103-104 | [CONFIRMED] |

## Edit Own Profile

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-41 | Same editable set as admin edit EXCEPT Role and Status are NOT editable, and Permission Group is NOT editable. | latest-prd.md:107 | [CONFIRMED] |

## Permission Engine

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-42 | Permission Group is assigned at user create + editable thereafter; one group per user. | latest-prd.md:60-61; understanding.md:138 | [CONFIRMED] |
| BR-UM-43 | The `Permission list - Jawad` sheet is the authoritative role->action matrix. PRD prose is secondary. | attachments.md:13, 41; understanding.md:55 | [CONFIRMED] |
| BR-UM-44 | Permission row values: `Allow`, `Not Allow`, `Deny`, `Can be overridden by Deny`. | attachments.md:15 | [CONFIRMED] |

## Open / Unstated

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-UM-45 | "Active -> Locked via manual change" - whether the system notifies the user is silent. | understanding.md:147 | [OPEN] |
| BR-UM-46 | "Deleted -> Active restore" - whether original password still works, or user is re-sent credentials, is silent. | latest-prd.md:126; understanding.md:148 | [OPEN] |
| BR-UM-47 | Idle 30-min logout - client-side vs server-side enforcement is silent. | understanding.md:149 | [OPEN] |
| BR-UM-48 | Profile picture format / size limits are silent. | understanding.md:150 | [OPEN] |
| BR-UM-49 | "Contact administrator" alert - whether it surfaces manager contact info from hierarchy is silent. | understanding.md:151 | [OPEN] |
| BR-UM-50 | Whether changing password invalidates sessions on other devices is silent in PRD. | understanding.md:127 | [OPEN] |
