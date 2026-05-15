---
type: flow
flow-name: Add User
page-slug: organization-hierarchy
prd: PRD-02
form: single-file
created: 2026-05-15
---
*** Flow note — Add User (3-tab wizard) ***
*** Vault file: 10-Pages/Add User Flow.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Add User.md ***
*** Created 2026-05-15 by Brain SK Phase 2D — flow playbook layer ***

# Add User Flow

> 3-tab wizard for creating a Falcon user. Falcon-side admins create users at any node (Falcon or Client tenant); Client AO / Node Admin create sub-users inside their own hierarchy. Initiated standalone from the Users list on [[Organization Hierarchy]]. Step 5 of [[Add Client Flow]] is the **sibling** path that creates the first Account Owner via Kafka instead of a direct call — same `CreateUserRequest` shape, async transport.
>
> **Source of truth:** the playbook at [Add User.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md) — read it end-to-end before implementing. This vault note holds links + minimal context only.

## Entry point in Brain Outputs

- [Add User playbook (SoT)](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md) — full 3-tab playbook, permission matrix, field tables, endpoint summary, error map, implementation checklist
- [PAGE_OVERVIEW.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md) — host page (Organization Hierarchy → Hierarchy tab → Users list)
- [WORKFLOWS.md (PRD-02)](../../../Brain%20Outputs/prd/modules/02-user-management/WORKFLOWS.md) — W1 Add User (3 tabs) — original PRD workflow

## Implements PRDs

- [[02 User Management]] — **primary**. W1 Add User flow + permission matrix + status defaults.
- [[01 Account Management]] — touches the password security level + IP allowlist + Normal-User limit (all account-scoped settings that constrain Add User).

## The 3 tabs (linked to SoT)

| # | Tab | What it captures | Backend DTO slice |
|---|---|---|---|
| 1 | **Personal Information** | First / Last name · Username · Email · Phone · Profile picture · server-generated password preview | `CreateUserRequest.PersonalInfo` (`UserPersonalInformation { FirstName, LastName, UserName, NationalId, PhoneNumber, Email, ProfilePictureInfo }`) |
| 2 | **Role & Permissions** | Role · Permission Group · Node assignment · sub-node scope | `CreateUserRequest.{Role, RoleKey, PermissionGroupId, TenantId, NodeId, Path}` |
| 3 | **Notification & Credentials** | Delivery method (Email / SMS / Both) · welcome message · confirmation | `CreateUserRequest.DeliveryMethod` |

## Validation rules (linked, not duplicated)

- [[V-user-first-last-name-letters-only]] — Tab 1 First / Last name: ≤ 50 chars, letters only (BR-UM-11)
- [[V-username-format-uniqueness-immutable]] — Tab 1 Username: starts with letter, ≤ 30 chars (PRD) / ≤ 100 (backend — **HIGH drift**), unique system-wide, immutable after create (BR-UM-12 / BR-UM-19 / BR-UM-37)
- [[V-normal-user-limit-enforcement]] — Tab 2 Role: when `Role = normal-user`, account-level `MaxNormalUserLimit` enforced via `UserQuotaPolicy` → `NormalUserLimitReached` 422 (BR-UM-07 / BR-UM-09 / BR-UM-17 / BR-UM-38)
- [[V-password-complexity-per-security-level]] — auto-generated password obeys account's `ePasswordSecurityLevel` tier via `PasswordPolicy` (BR-UM-15 / BR-UM-20)
- [[V-account-ip-allowlist-enforcement]] — **first-login** gate (post-creation, before Active): IP check runs at the FastEndpoints pre-processor before credentials (BR-UM-24 / BR-AM-10)
- [[V-login-lockout-3-wrong-attempts]] — **first-login** lockout: 3 wrong passwords / 3 wrong OTPs → `User.status = Locked` (BR-UM-25 / BR-UM-27)

## Entities touched

- [[E-user]] — primary write target. New user created in `Pending` (BR-UM-10). Full PRD ↔ backend field reconciliation including HIGH drift on Username max length.
- [[E-otp-challenge]] — first-login OTP after Add User completes. `AuthenticationSession` backing store; 60-sec validity (BR-UM-26); 4-vs-6-digit length per `OtpAppSetting`.
- [[E-session]] — created on first successful login (Pending → Active activation gate).

## Permission gating

- [[Falcon Roles Permission Matrix]] — who can add which target roles. System Administrator + Product can add any role; Operation restricted; Client AO restricted to Node Admin / Normal User in own hierarchy; Client Node Admin restricted to Normal User in own sub-nodes; Normal User cannot add users.
- [[User Statuses]] — new user defaults to `Pending`; status transitions per BR-UM-08 (post-creation lifecycle).
- [[Access PES Service]] — runtime gate; `authorize/resources` returns the grantable role set on wizard mount.

## Backend services

- [[Identity Service]] — **owner**. `CreateUserRequest` lands here. Endpoints touched: `POST /api/user/` (create — route TBC), `POST /api/user/exist` (uniqueness), `POST /api/user/generate-password` (anonymous, password preview), `GET /api/user/count` (Normal-User quota).
- [[Access PES Service]] — role/permission-group taxonomy; consumes `identity.user-events.v1` Kafka post-create.
- [[Commerce Service]] — owns `MaxNormalUserLimit` + `PasswordSecurityLevel` per tenant (read via `GET /Setting`); also publishes `commerce.user-created.v1` for the Add-Client-Step-5 path.
- [[Core Gateway Service]] — Client-user route (port 7038 local).
- [[System Gateway Service]] — Falcon-admin route (port 7256 local).

## Falcon components used in this wizard

- [[Falcon Wizard]] — multi-step shell (3 steps; architect §5.12.3 contract) — preferred long-term target. Existing wizards use [[Falcon Stepper Legacy]] directly per the Wizard dossier.
- [[Falcon Tabs]] — alternative shell if the page uses tabs instead of stepper navigation (PRD wording is "tabs").
- [[Falcon Input]] — First name · Last name · Username · National ID
- [[Falcon Email Field]] — Email
- [[Falcon Phone Field]] — Phone number
- [[Falcon Password]] — server-generated password preview (read-only)
- [[Falcon Dropdown]] — Role · Permission Group · Delivery method
- [[Falcon Tree]] / [[Falcon Tree Panel]] — node-picker (`falcon-full` mode for Falcon admins, `client` mode for Client AO/NA — per the [[Organization Hierarchy Tree TW]] wrapper)
- [[Falcon Uploader (generic)]] — Profile picture (or photo-uploader skeleton if available)
- [[Falcon Button]] — Next / Back / Finish / Cancel / Regenerate password
- [[Falcon Status Badge]] — Status chip (display-only `Pending`)
- [[Falcon Notification]] — success toast after submit
- [[Send Credentials Popup]] — Tab 3 final confirmation summary (reused across wizards)
- [[Falcon Dialog]] — generic dialog container (used by Send Credentials Popup + any inline confirmations)

## Backend endpoint summary

| Method | Path (via gateway → service) | Service | Request | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/identity/users` → `/api/user/` | [[Identity Service]] | `CreateUserRequest` | `ServiceOperationResult<CreateUserResponse>` (id, status=Pending) | Composite create. **Explicit route binding undocumented — verify via OpenAPI at first integration.** |
| `POST` | `/identity/user/exist` → `/api/user/exist` | [[Identity Service]] | `UserExistRequest { Username }` | `ExistResponse { Exists }` | Tab 1 async uniqueness validator |
| `POST` | `/identity/user/generate-password` → `/api/user/generate-password` (**Anonymous**) | [[Identity Service]] | `GeneratePasswordRequest { PasswordSecurityLevel }` | `GeneratePasswordResponse { Password }` | Tab 1 password preview |
| `GET` | `/identity/user/count?TenantId=...&Roles[]=normal-user` → `/api/user/count` | [[Identity Service]] | `GetUserCountRequest` | `long` | Tab 2 quota chip |
| `POST` | `/pes/authorize/resources` | [[Access PES Service]] | _(see Access registry)_ | _(grantable resources)_ | Tab 2 Role dropdown gate |
| `GET` | `/commerce/Setting` | [[Commerce Service]] | _(tenant from JWT)_ | `GetSettingsResponse` | `PasswordSecurityLevel` + `MaxNormalUserLimit` |

Full error code map and post-create side-effects (Kafka, Zitadel adapter) live in the [SoT playbook](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md).

## Critical drift / call-outs

- **Username length** — PRD-02 BR-UM-12 says ≤ 30; backend `CreateUserRequestValidator` says `MaximumLength(100)`. **FE enforces 30** (PRD wins on the wire). See [[V-username-format-uniqueness-immutable]].
- **`PasswordSecurityLevel` vocabulary** — PRD says Normal/Advanced; code says Low/Medium/High/Strict. Open question Q-UM-12. See [[V-password-complexity-per-security-level]].
- **`DevOtpCode`** — populated in dev only (per [[E-otp-challenge]]). **Must be OFF in production.** Surfaces on the new user's first-login `LoginStepResponse`, not on the Add User response.
- **Tab naming divergence** — PRD W1 names the tabs "Personal Information / Role & Status / Permissions". Status is non-editable on create (defaults Pending — BR-UM-10), so the practical split is "Personal / Role & Permissions / Notification & Credentials". The playbook uses the latter; both are conformant.
- **No FE re-dispatch surface** — if credentials never arrive (Email bounced, SMS quota exceeded), there is no built-in "Resend credentials" action today. Flagged as a UX gap in the playbook.

## First-login flow (post-creation)

After Add User finishes, the new user enters [[First Login Flow]] (Pending → Active path — playbook TBC). Touch-points:

- [[V-account-ip-allowlist-enforcement]] — IP check at gateway (BR-UM-24)
- [[V-login-lockout-3-wrong-attempts]] — 3 wrong passwords / OTPs → Locked (BR-UM-25/27)
- [[V-password-complexity-per-security-level]] — force-change password obeys tier
- [[E-otp-challenge]] — `AuthenticationSession` with 60-sec OTP (BR-UM-26)
- [[E-session]] — created on activation
- `User.status: Pending → Active` per [[User Statuses]]

## Cross-flow dependencies

- Sub-flow of [[Add Client Flow]] Step 5 — same DTO shape, **Kafka transport** (`commerce.user-created.v1`) instead of direct Identity call. Validation errors surface differently — see Add Client playbook.
- Triggers [[First Login Flow]] for the new user.
- Depends on a tenant existing for Client-side roles (created via Add Client).
- Permission decisions consulted in [[Access PES Service]] on both ends.

## Page parent

- [[Organization Hierarchy]] — Add User is launched from the Users list on the Hierarchy tab (or from the node right-pane). The page's [PAGE_OVERVIEW](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md) lists "Add User wizard" as HTML §13 — 3-step full-page replacement.

## Tags

#type/flow #prd/01 #prd/02 #service/access #service/commerce #service/core-gateway #service/identity #service/system-gateway #drift #gap #security

## Hubs

[[Organization Hierarchy]] · [[02 User Management]] · [[Add Client Flow]] · [[Edit User Flow]] · [[First Login Flow]] · [[Identity Service]] · [[Access PES Service]] · [[Commerce Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[E-user]] · [[E-otp-challenge]] · [[E-session]] · [[User Statuses]] · [[Falcon Roles Permission Matrix]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[PAGES_INDEX]]
