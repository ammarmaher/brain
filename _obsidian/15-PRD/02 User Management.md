---
type: prd-module
prd-id: PRD-02
module-name: User Management
coverage-percent: 0
sync-date: 2026-04-24
status: fresh
created: 2026-05-15
---
*** PRD-02 — User Management ***
*** SoT: Brain Outputs/prd/modules/02-user-management/ ***
*** Drive source: `User Management Module - V2` (sync 2026-04-24) ***

# PRD-02 — User Management

> Owns every Falcon user lifecycle: 3-tab create wizard · first/regular login · 5 status transitions (Pending/Active/Suspended/Locked/Deleted) · password mgmt (change · forgot · reset · force-change) · profile editing with OTP · idle-timeout. Permissions sit alongside user records and route through the Access (PES) policy engine. **Frontend NEVER calls Zitadel directly** — all auth runs through Identity Service.

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/02-user-management/OVERVIEW.md) | Purpose · actors · main screens · main actions |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) | All business rules with cited PRD-line evidence |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md) | User, UserStatusHistory, LoginAttempt, OtpChallenge, Session, PermissionGroup, Permission |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/02-user-management/WORKFLOWS.md) | Add User (3 tabs) · First Login (Pending→Active) · Regular Login · Forgot Password · Change Password · Edit User · Lockout · Idle Timeout |
| [GAPS](../../../Brain%20Outputs/prd/modules/02-user-management/GAPS.md) | 20 COVERED · 6 PARTIAL · 2 MISSING · 9 UNVERIFIABLE |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/02-user-management/QUESTIONS.md) | Q-UM-12 password security vocabulary; Q-UM-13 admin-driven email/phone OTP path |

## Pages that implement this PRD

- Add User wizard (3 tabs)
- Login flow (first-time + regular)
- Edit User · Change Password · Forgot Password
- OTP popups (`otp-popup` section also appears in [[Organization Hierarchy]])
- _Pages not yet seeded under `10-Pages/` — will join as Light Learning events accrue_

## Flow playbooks (implementation specs)

- [[Add User Flow]] — 3-tab wizard (Personal Info · Role & Permissions · Notification & Credentials)
- [[Add Client Flow]] — Step 5 of that wizard creates an Account-Owner user via Kafka `UserCreationRequested` event (cross-flow dependency)
- Hub: [[IMPLEMENTATION_KNOWLEDGE_MAP]]

## Falcon components used by this PRD

- [[Falcon Input]] (email · phone · password) · [[Falcon Dropdown]] (role · status) · [[Falcon Dialog]] (OTP popup) · [[Falcon Button]]
- [[Falcon Data Table]] (Users list, Status history, Login attempts)
- [[Falcon Status Badge]] (status pills)

## Backend services implementing this PRD

| Concern | Service | Folder |
|---|---|---|
| User lifecycle · password · OTP · session | identity | [`understanding/backend/identity/`](../../../Brain%20Outputs/understanding/backend/identity/) |
| Permission Group · Permission rows · PES gating | identity + access | [`understanding/backend/access/`](../../../Brain%20Outputs/understanding/backend/access/) |
| User ↔ Account binding | commerce | [`understanding/backend/commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) |
| Auth gateway proxying | core-gateway | [`understanding/backend/core-gateway/`](../../../Brain%20Outputs/understanding/backend/core-gateway/) |

**Vault service notes:** [[Identity Service]] · [[Access PES Service]] · [[Commerce Service]] · [[Core Gateway Service]] · [[BACKEND_INDEX]]

## Validation surface

Email/phone format · password complexity tiers · OTP validity windows · lockout thresholds · idle-timeout. All live in [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md). Hub: [[VALIDATION_INDEX]].

## Linked permission matrices

- [[Falcon Roles Permission Matrix]] — `Permission list - Jawad` sheet (System Administrator · Operation · Products × Hierarchy + CommChannels + Apps + Settings); Tab 2 not captured
- [[User Statuses]] — 5 statuses (Pending / Active / Suspended / Locked / Deleted) + counted-against-user-limit flag
- Folder hub: [[12-Permissions/README|12-Permissions]]

## Module dependencies

- **[[01 Account Management]]** — User is created in Account wizard Step 5 + user statuses gate logins
- **[[04 Contact Group Management]]** — Client user types (AO/NA/Normal) create+share contact groups

## Health

- **Status:** Well-built
- **Top concerns:** Password security vocabulary mismatch (Q-UM-12); admin-driven email/phone OTP path unclear (Q-UM-13). Permission sheet Tab 2 not captured (Q-UM-07).
- **Coverage:** 20 ✅ · 6 ⚠️ · 2 ❌ · 9 ❓

## Tags

#type/prd-module #prd/01 #prd/02 #prd/04 #service/access #service/commerce #service/core-gateway #service/identity #security

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]]
