*** Flow Playbook — Add User (3-tab wizard) ***
*** SoT for implementation: this file ***
*** Page: Organization Hierarchy · PRD: PRD-02 User Management · 2026-05-15 ***

# Add User — implementation playbook

> Authoritative spec for building the **Add User** flow end-to-end (frontend wizard + backend integration). Load this file *first*; it links the PRD source rows, Identity backend DTO/validator surface, V-rules, entity reconciliation notes, permission matrix, and component dossiers. Read here, implement once.
>
> **Scope:** standalone Add User wizard initiated from the Users list on the Hierarchy tab (and from the right-pane Add User button on a selected node). Falcon admins use this to seed Falcon-side users (sys-admin / operation / product) and to create users inside a client tenant; Client AO / Node Admin use this to create sub-users within their own hierarchy.
>
> **Out of scope (handled elsewhere):** Step 5 of [[Add Client Flow]] (which seeds the **first** Account Owner user via the Commerce → Kafka → Identity path — same `CreateUserRequest` shape, different transport). Edit User and Edit Own Profile are separate flows ([[Edit User Flow]] / [[Edit Own Profile Flow]] — not yet authored). First Login is its own playbook ([[First Login Flow]] — not yet authored) but the **post-creation** OTP + force-change-password experience is summarized here because credentials are dispatched as the final step of this flow.

## Trigger / entry point

| Surface | Who clicks | Permission gate |
|---|---|---|
| **Users list** on the Hierarchy tab of [[Organization Hierarchy]] → `Add User` button (header) | Falcon admin (any of sys-admin / operation / product, per role matrix); Client AO; Client Node Admin | PES `Allow` on `Add User` action for the selected node + Falcon role matrix row |
| **Node right-pane** → `Add User` quick-action (after selecting a node in the tree) | Same as above — auto-scopes the wizard to the selected node | Same |
| **More-Details / View User page** → no Add User from here (Add User is list-level only) | n/a | n/a |

The wizard opens as a **full-page replacement** (HTML §13, per [PAGE_OVERVIEW](../PAGE_OVERVIEW.md)) — not a modal — and uses [[Falcon Wizard]] / [[Falcon Tabs]] as the shell. PRD-02 wording is "3 tabs" (W1 in [WORKFLOWS](../../../../prd/modules/02-user-management/WORKFLOWS.md)) — in practice the implementation uses the wizard stepper, with each "tab" gated by validation of the previous one.

## Permission matrix (who can run this flow)

| Role | Can run? | Restricted to which target user roles? | Source |
|---|---|---|---|
| Falcon **System Administrator** | ✅ | Can create any role (sys-admin / operation / product / account-owner / node-admin / normal-user) | [[Falcon Roles Permission Matrix]] · BR-UM-01..05 |
| Falcon **Operation** | ✅ | Can create operation / product / node-admin / normal-user. **Cannot** add Client (`Add Client` is `Not Allow` for Operation per Permission list - Jawad) — but can still add internal Falcon-side users + client-side sub-users on existing clients. | [[Falcon Roles Permission Matrix]] |
| Falcon **Product** | ✅ | Like System Administrator but cannot edit Root-node security settings (orthogonal — not an Add User constraint). Can create any user role. | [[Falcon Roles Permission Matrix]] |
| Client **Account Owner** (AO) | ✅ | Can create **Node Admin** or **Normal User** scoped to own hierarchy only. Cannot create Falcon-side roles or another AO (one AO per account — BR-UM-03). | PRD-02 BR-UM-03 + BR-UM-04 |
| Client **Node Admin** | ✅ | Can create **Normal User** scoped to own sub-nodes only (BR-UM-04). Cannot add on Main node. | PRD-02 BR-UM-04 |
| **Normal User** | ❌ | Transactional role — cannot add users (BR-UM-05). | PRD-02 BR-UM-05 |

**Open question Q-UM-08:** "Are Account Owner / Node Admin allowed to add Falcon-side users?" PRD does not explicitly forbid it; the permission matrix is silent on Client → Falcon role granting. Treat as **blocked at the UI** (filter the Role dropdown in Tab 2 to only the roles the current actor can grant) and rely on backend `InvalidRoleForUserType` (422) as a fallback.

PES enforcement runs through [[Access PES Service]] (`POST /pes/authorize` decision). The frontend should:
1. Call PES once on wizard open to obtain the list of grantable roles for the current actor + target node.
2. Render Tab 2's Role dropdown from that PES response, not from a static client-side enum.
3. Trust backend rejection (`InvalidRoleForUserType`, `UnauthorizedUserToPerformThisAction`) as the final gate.

## Overview — the 3 tabs

| # | Tab | Purpose | Source-of-truth |
|---|---|---|---|
| 1 | **Personal Information** | First name · Last name · Username · Email · Phone · Profile picture · (server-generated password preview) | PRD-02 BR-UM-11..16 + BR-UM-19; Identity `CreateUserRequest.PersonalInfo` |
| 2 | **Role & Permissions** | Role · Permission Group · Node assignment · Sub-node scope (Client AO/NA only) | PRD-02 BR-UM-10/17/42; Identity `CreateUserRequest.{Role, RoleKey, PermissionGroupId, TenantId, NodeId, Path}` + Access PES policies |
| 3 | **Notification & Credentials** | Delivery method (Email / SMS / Both) · Welcome message (optional) · Confirmation that the auto-generated password will be sent | PRD-02 BR-UM-15/18; Identity `CreateUserRequest.DeliveryMethod` |

After Tab 3 → `Finish` submits one composite `CreateUserRequest` to Identity; on success the new user is created in `Pending`, credentials are dispatched via `DeliveryMethod`, and the wizard closes back to the Users list with a [[Falcon Notification]] toast.

> **PRD divergence (honest call):** PRD-02 WORKFLOWS W1 names the three tabs **Personal Information / Role & Status / Permissions** (in that order). Practically the Status field defaults to Pending and is non-editable on create (BR-UM-10) — so Tab 2 collapses into "Role & Permission Group" and Tab 3 surfaces the credential-delivery concern that PRD-02 BR-UM-18 mentions only as a "confirmation dialog" after save. This playbook adopts the more usable "Role & Permissions / Notification & Credentials" split. Either split is conformant; what matters is that on save the composite request contains all five required fields: `PersonalInfo`, `RoleKey`, `PermissionGroupId`, `DeliveryMethod`, and the node-scope inputs.

---

## Tab 1 — Personal Information

### Fields

| Field | Type | Required | Constraints | Backend DTO path | V-rule | Component |
|---|---|---|---|---|---|---|
| First name | string | ✅ | letters only, ≤ 50 chars | `CreateUserRequest.PersonalInfo.FirstName` | [[V-user-first-last-name-letters-only]] | [[Falcon Input]] |
| Last name | string | ✅ | letters only, ≤ 50 chars | `CreateUserRequest.PersonalInfo.LastName` | [[V-user-first-last-name-letters-only]] | [[Falcon Input]] |
| Username | string | ✅ | starts with a letter, **≤ 30 chars per PRD** (≤ 100 on backend — see drift below), unique system-wide, immutable after create | `CreateUserRequest.PersonalInfo.UserName` | [[V-username-format-uniqueness-immutable]] | [[Falcon Input]] |
| Email | string | ✅ | valid email format; may be duplicated across usernames; used for credential / OTP delivery if `DeliveryMethod ∈ {Email, Both}` | `CreateUserRequest.PersonalInfo.Email` | _(format-only — no dedicated V-rule yet; flagged as Phase 2C candidate in [[E-user]])_ | [[Falcon Email Field]] |
| Phone number | string | ✅ | valid phone format; may be duplicated across usernames; used for SMS OTP delivery | `CreateUserRequest.PersonalInfo.PhoneNumber` | _(no dedicated V-rule yet)_ | [[Falcon Phone Field]] |
| National ID | string | ⚠ | present on `UserPersonalInformation.NationalId` in the DTO but **not required by PRD-02**. Treat as optional FE field; surface only if business confirms | `CreateUserRequest.PersonalInfo.NationalId` | _(none — DTO-only field)_ | [[Falcon Input]] |
| Profile picture | base64 + extension | ❌ optional | format/size limits **silent in PRD (BR-UM-48)** — Identity rejects with `ProfilePictureSizeExceeded` / `ImageExtensionNotAllowed` / `FileSizeExceeded` / `ExecutableFileNotAllowed` / `InvalidImageFile`. Inferred safe defaults: JPG/PNG/WEBP, ≤ 2 MB | `CreateUserRequest.PersonalInfo.ProfilePictureInfo` (`{Extension, FileBase64String}`) | _(none yet — Q-UM-05)_ | [[Falcon Uploader (generic)]] or photo-uploader skeleton (per `<falcon-angular-photo-uploader>` if present) |
| Password (auto-generated, **display-only**) | string | n/a | not user-typed; server-generated per `account.PasswordSecurityLevel` via `POST /user/generate-password` | _not on `CreateUserRequest`_ — handler generates it server-side at create | [[V-password-complexity-per-security-level]] | [[Falcon Password]] (read-only) |

### V-rules in scope

- [[V-user-first-last-name-letters-only]] — `FirstName` + `LastName`: `NotEmpty` + `MaximumLength(50)` + `Matches(LettersOnly)`. Error codes: `RequiredFieldMissing` · `MaxLengthExceeded` · `FirstNameLettersOnly` · `LastNameLettersOnly` (all 400).
- [[V-username-format-uniqueness-immutable]] — `UserName`: `NotEmpty` + `MaximumLength(100)` (backend) + `Matches(StartsWithLetter)`. Uniqueness via handler-thrown `DuplicateUsername` (409). Immutability via DTO shape (no `UserName` field on `UpdateUserProfileRequest`).

### HIGH drift call-out — Username length

> ⚠⚠ **Username PRD cap is 30 chars; backend Validator cap is 100 chars.** Confirmed in [VALIDATIONS (Identity)](../../../../understanding/backend/identity/VALIDATIONS.md) (`MaximumLength(100)`) vs PRD-02 BR-UM-12 (`≤ 30`).
>
> **Frontend mandate:** enforce **30** in the form (the PRD cap). Submitting > 30 will succeed at the backend; submitting > 100 will fail with `MaxLengthExceeded` (400). Until the backend tightens its rule (Phase 2C candidate per [[V-username-format-uniqueness-immutable]]), the FE is the only thing keeping the system PRD-conformant.

### Username uniqueness flow

1. On `username` field blur (or debounced typing — 300 ms): `POST /api/user/exist` with `{ Username: <value> }`.
2. Response is `ExistResponse { Exists: bool }`.
3. If `Exists == true` → display inline error mapped to the localized `DuplicateUsername` message (do NOT call out the literal error code in the UI).
4. If 400 `InvalidUserExistQuery` (empty username) → don't surface (handled by `required` validator anyway).

### Password preview

- Tab 1 has a **display-only** password row showing what will be dispatched. To populate it:
  1. On wizard open (or when Tab 1 mounts), the FE reads `account.PasswordSecurityLevel` from Commerce (`GET /Setting` on the tenant — Commerce DTO `GetSettingsResponse`).
  2. The FE calls `POST /api/user/generate-password` with `{ PasswordSecurityLevel: <level> }` (this endpoint is **anonymous** — see Identity ENDPOINT_REGISTRY note: "`generate-password` is anonymous (overrides group policy)").
  3. The endpoint returns `GeneratePasswordResponse { Password: string }` — display masked, with a "regenerate" button that re-calls.
- The password is **not** sent on `CreateUserRequest`. Identity regenerates server-side at create time. The preview is for the admin's visibility; the actual delivered password may differ if generation is non-deterministic (verify with backend; if so, drop the preview).
- **Open question Q-UM-12** — vocabulary mismatch: PRD says `Normal/Advanced`, code says `Low/Medium/High/Strict`. Until reconciled, map UI to the 2-tier PRD wording and translate to the 4-tier enum on the wire.

### Cross-tab behavior

- **No advance to Tab 2** until: all required fields valid + username uniqueness check passed (debounced, not pending).
- Profile picture upload is asynchronous — show in-progress chip; do not block Tab 1 advance if the user wants to skip and add later (then revisit Tab 1 from the stepper).

---

## Tab 2 — Role & Permissions

### Fields

| Field | Type | Required | Constraints | Backend DTO path | V-rule | Component |
|---|---|---|---|---|---|---|
| Role | enum `eUserRoles` (sys-admin / operation / product / account-owner / node-admin / normal-user) | ✅ | One of the values granted to the current actor by PES + role matrix; if target = `normal-user`, see Normal-User-limit gate below | `CreateUserRequest.Role` (legacy enum) **AND** `CreateUserRequest.RoleKey` (canonical string) | n/a — bind to `RoleKey` going forward per [[E-user]] | [[Falcon Dropdown]] |
| Permission Group | string id | ✅ | One per user (BR-UM-42). Fetched from Access PES `GET /pes/policy-rules` (filter by role/tenant) | `CreateUserRequest.PermissionGroupId` | n/a — referential | [[Falcon Dropdown]] (single-select; multi-select **not** allowed per BR-UM-42) |
| Node assignment | string id | ✅ for Falcon admins targeting a client; auto-scoped for Client AO/NA | The node the user will belong to. For Falcon-side roles (sys-admin / operation / product) → root node (auto, hidden). For Account Owner → the account's Main node. For Node Admin → any node under the AO. For Normal User → any node. | `CreateUserRequest.NodeId` (+ `Path` for hierarchy enrichment + `TenantId` for tenant scoping) | n/a — referential | [[Falcon Tree]] / [[Falcon Tree Panel]] as a node-picker; auto-collapsed to a chip + "Change" link when the entry point already selected a node |
| Status | enum `eUserStatus` | display-only | Defaults to `Pending` on create (BR-UM-10). Not editable in this flow. | _not on `CreateUserRequest`_ — Identity sets to `Pending` server-side | n/a — fixed | (read-only chip — [[Falcon Status Badge]]) |

### V-rules in scope

- [[V-normal-user-limit-enforcement]] — when `Role = normal-user`, the Identity `UserQuotaPolicy` blocks the create with `NormalUserLimitReached` (422) if `account.MaxNormalUserLimit` is exceeded. Pending/Active/Suspended/Locked all count toward the cap; Deleted does NOT (BR-UM-07).

### Pre-flight quota gate (Normal User)

When the Role dropdown changes to `normal-user`:

1. Fire a non-blocking `GET /api/user/count?TenantId=<id>&Roles[]=normal-user` against Identity.
2. Compare with `account.MaxNormalUserLimit` (from Commerce settings).
3. Render a counter chip next to the dropdown: `"12 / 50 Normal Users"`.
4. If `count >= MaxNormalUserLimit` → disable Tab 2 advance, show inline message, and skip Tab 3. **Do not pre-empt with a hard client-side block** unless the count is fresh (within 30s) — the authoritative gate is the backend 422 at submit time.
5. On submit, if the response is `NormalUserLimitReached` (422), surface the localized message via [[Falcon Notification]] and keep the wizard on Tab 2 with the Role field flagged.

### PES gating cross-link

[[Access PES Service]] decides which Role values are grantable. Frontend wiring:

- On Tab 2 mount: `POST /pes/authorize/resources` with `{ subject: <currentUser>, action: "grant-role", resourceType: "user", scope: <selected-node-or-tenant> }` → returns the set of grantable role keys.
- Build the Role dropdown options from that result. If empty, the actor has no grant authority — surface a "you don't have permission to add users at this node" empty state and close the wizard.
- Assigning a Role provisions PES role linkage downstream — Identity produces a `identity.user-events.v1` Kafka event consumed by PES (`UserRoleLinkSyncRequestedConsumer`) to refresh the user/role binding without a synchronous PES write.

### Permission Group list

- Fetched from PES (`GET /pes/roles` or equivalent — confirm endpoint shape against [`Access ENDPOINT_REGISTRY`](../../../../understanding/backend/access/ENDPOINT_REGISTRY.md)).
- Filter the list by the just-picked Role (each Permission Group is tied to a single role per BR-UM-42).
- On change of Role, **reset** the Permission Group field — old selection no longer valid.

### Node picker

- Mode `falcon-full` of [[Organization Hierarchy Tree]] when actor is Falcon-side and target is a Client user.
- Mode `client` when actor is Client AO/NA (auto-scoped to own subtree — actor cannot pick outside).
- The auto-derived `Path` string travels with the request as `CreateUserRequest.Path` (used by Gateways for east-west hierarchy enrichment).

---

## Tab 3 — Notification & Credentials

### Fields

| Field | Type | Required | Constraints | Backend DTO path | V-rule | Component |
|---|---|---|---|---|---|---|
| Delivery method | enum `eDeliveryMethod` (Email / SMS / Both) | ✅ | The channel(s) used to dispatch the initial credentials + first-login OTP | `CreateUserRequest.DeliveryMethod` | n/a — referential | [[Falcon Dropdown]] (single-select) or radio group |
| Welcome message | string | ❌ optional | **Not on the wire DTO** — PRD-02 silent on the message field; treat as future enhancement. If implemented, must round-trip through a separate notification-service call _after_ user create succeeds. | n/a (not on `CreateUserRequest`) | n/a | [[Falcon Input]] (multiline if added; flag as deferred) |
| Confirmation summary | display-only | n/a | Shows the resolved password (masked, with a "show" toggle), email + phone destinations, and which channels will receive it. Last gate before submit. | n/a | n/a | [[Send Credentials Popup]] — reused from existing wizard |

### V-rules in scope

- [[V-password-complexity-per-security-level]] — the server-generated password obeys `PasswordPolicy` per tier. The FE does not validate the password against the policy on this tab (it's generated, not typed) but **must** re-fetch it if the user changed the tier-resolution input (unlikely in this flow — `PasswordSecurityLevel` is per-account, not per-user).

### Security call-out — `DevOtpCode`

> ⚠ **`LoginStepResponse.DevOtpCode?`** is populated in development environments only (per [DTO_DICTIONARY](../../../../understanding/backend/identity/DTO_DICTIONARY.md) line 46 and [FRONTEND_CONTRACT](../../../../understanding/backend/identity/FRONTEND_CONTRACT.md)). It surfaces in the **first-login** flow (after the new user clicks their credentials link), not in the Add User response. Confirm `appsettings.json` does NOT enable this in production. Flagged in [[E-otp-challenge]] as a security risk.

### UX after submit

1. On `Finish`: `POST /api/identity/users` (via [[Core Gateway Service]] or [[System Gateway Service]] depending on actor type) with the composite `CreateUserRequest`.
2. Identity creates the user in `Pending`, returns `UserResponse` (id, status=Pending).
3. Identity dispatches credentials via the chosen `DeliveryMethod` (Email / SMS / Both) — synchronous side-effect; the response does not include delivery status.
4. FE shows a [[Falcon Notification]] toast: `"User created. Credentials sent via {DeliveryMethod}."`
5. Wizard closes; Users list refreshes (debounce, then re-fetch `GET /api/user/` for the current node).
6. Optionally, navigate to the new user's More-Details page.

---

## Backend endpoint summary

| Method | Path | Service | Request DTO | Response DTO | Notable error codes |
|---|---|---|---|---|---|
| `POST` | `/identity/users` (via [[Core Gateway Service]]) → `/api/user/` (Identity, after gateway strip) | [[Identity Service]] (`CreateUserEndpoint` — DTO present in registry; FastEndpoints route shape inferred — verify the explicit route binding in `Endpoints/Users/`) | `CreateUserRequest { PersonalInfo, PermissionGroupId, DeliveryMethod, RoleKey?, Role?, TenantId?, NodeId?, Path? }` | `ServiceOperationResult<CreateUserResponse>` (id, status=Pending) | `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `DuplicateUsername` (409) · `UsernameMustStartWithLetter` (400) · `FirstNameLettersOnly` (400) · `LastNameLettersOnly` (400) · `NormalUserLimitReached` (422) · `InvalidValue` (400) · `InvalidRoleForUserType` (422) · `FalconUserMustNotHaveTenantId` (422) · `CreateIdentityUserFailed` (500) · `UnauthorizedUserToPerformThisAction` (403) · `ProfilePictureSizeExceeded` (400) · `ImageExtensionNotAllowed` (400) · `ExecutableFileNotAllowed` (400) · `InvalidImageFile` (400) |
| `POST` | `/identity/user/exist` (via gateway) → `/api/user/exist` | [[Identity Service]] (`UserExistEndpoint`) | `UserExistRequest { Username }` | `ExistResponse { Exists: bool }` | `InvalidUserExistQuery` (400) |
| `POST` | `/identity/user/generate-password` (via gateway) → `/api/user/generate-password` (**Anonymous**) | [[Identity Service]] (`GeneratePasswordEndpoint`) | `GeneratePasswordRequest { PasswordSecurityLevel: ePasswordSecurityLevel }` | `GeneratePasswordResponse { Password: string }` | `InvalidValue` (400) |
| `GET` | `/identity/user/count?TenantId=...&Roles[]=normal-user` (east-west; gateway forwarded) → `/api/user/count` | [[Identity Service]] (`GetUserCountEndpoint`) | `GetUserCountRequest { TenantId, Roles[]? }` | `long` (raw) | `TenantIdRequired` (400) |
| `POST` | `/pes/authorize/resources` | [[Access PES Service]] | _(see Access ENDPOINT_REGISTRY)_ | _(set of grantable resources/actions)_ | n/a (PES returns plain results) |
| `GET` | `/commerce/Setting` | [[Commerce Service]] | _(none — tenant scoped from JWT)_ | `GetSettingsResponse` (carries `PasswordSecurityLevel`, `MaxNormalUserLimit`) | n/a |

> **Route notes:**
> - The Identity registry currently lists no explicit `POST /api/user/` create route — only the request DTO is documented with the comment *"no FastEndpoints route observed for it"*. Verify the actual route on first integration. Two likely shapes: `POST /api/user/` (rest-style) or `POST /api/user/create` (verb-style). Use OpenAPI doc at `https://localhost:7777/openapi/v1.json` to confirm.
> - All Identity endpoints return the platform `ServiceOperationResult<T>` envelope: `{ isSuccessful, result, errorMessages }` (per [FRONTEND_CONTRACT](../../../../understanding/backend/identity/FRONTEND_CONTRACT.md)). Camel-case wire format.
> - The Frontend NEVER calls Zitadel directly — all auth + user CRUD flows through Identity via the gateway.
> - Falcon admins route through [[System Gateway Service]] (port 7256 local); Client users route through [[Core Gateway Service]] (port 7038 local) — but for Add User specifically, both paths land on the same Identity `/api/user/` endpoint, with `currentUser` discriminated server-side from the JWT.

---

## State / status transitions

### User lifecycle (per [[User Statuses]] / BR-UM-08)

```
                        Add User flow ends here
                                 │
                                 ▼
                              Pending ─────────────────┐
                                 │                      │ Locked → Pending
                                 │ First Login          │ (admin re-activate)
                                 │ (IP + creds + OTP    │
                                 │  + password change)  │
                                 ▼                      │
   ┌──────────── Suspended ◀──Active────────────────────┴── Locked
   │                            │                                 ▲
   │                            │ admin                           │ auto on 3 wrong
   │ admin                      │                                 │ logins / OTPs
   │                            ▼
   └────────────────────────► Deleted
                                 │
                                 │ Falcon usertype only
                                 ▼
                              Active
```

- New user is created in `Pending` (BR-UM-10). FE submits no `Status` field on `CreateUserRequest`.
- Status flips to `Active` only when First Login completes (W2 in [WORKFLOWS](../../../../prd/modules/02-user-management/WORKFLOWS.md) — IP check → credentials check → OTP → force-change-password).
- `UserStatusHistory` records the transition with `actor`, `at`, `reason`.

### Side-effect: Identity → PES Kafka

- After create succeeds, Identity emits `identity.user-events.v1` on Kafka. PES (`UserRoleLinkSyncRequestedConsumer`) consumes and updates the role/policy linkage for the new user.
- This is eventual consistency — the new user's PES decisions may lag by a few seconds. The wizard should NOT wait for PES sync to declare success.

### Side-effect: Identity → Zitadel

- Identity calls Zitadel to provision the underlying auth principal. On failure, the response is `CreateIdentityUserFailed` (500). Zitadel-specific errors propagate as `ZitadelCreateProjectFailed` / `ZitadelSearchUserFailed` / etc. — all surfaced as localized strings in `errorMessages`.

---

## First-login flow (post-creation summary)

> Brief — full playbook to be authored as [[First Login Flow]]. Documented here because the FE Add User flow is "done" only when the user can actually log in.

After the wizard closes:

1. The new user opens the credentials link / login page on whatever channel was chosen (`DeliveryMethod`).
2. They enter **Username + temp Password** → `POST /api/auth/login`.
3. **IP allowlist pre-processor** runs first: rejects with `IpNotAllowed` (403) if the caller IP isn't on the tenant's allowlist (V-rule below). The reject is **generic** to avoid leaking whether credentials would have been valid (BR-UM-24).
4. Credentials verified → `LoginStepResponse { Stage: OtpRequired, SessionId, OtpCodeLength, OtpExpiresInSeconds }` returned. OTP delivered via the channel set at create.
5. User enters OTP → `POST /api/auth/verify-otp { SessionId, Code }` → `LoginStepResponse { Stage: PasswordChangeRequired, SessionId }`.
6. User enters new password (must satisfy `PasswordPolicy`) → `POST /api/auth/first-login { SessionId, NewPassword }` → `LoginStepResponse { Stage: Authenticated, Tokens: AuthenticatedResult }`.
7. `User.status` flips to `Active`. A [[E-session]] record is created.

### V-rules touching first login

- [[V-account-ip-allowlist-enforcement]] — IP check runs at the FastEndpoints pre-processor **before** credentials. Configured per-tenant on the Commerce settings + propagated to Identity via the `commerce.tenant-ip-allowlist-changed.v1` Kafka topic + Redis cache.
- [[V-login-lockout-3-wrong-attempts]] — 3 wrong passwords OR 3 wrong OTPs / OTP-resend-counts → `User.status = Locked` (423 `UserLocked`). Zitadel manages the underlying lockout policy; Identity webhook (`/api/webhook/zitadel`) syncs the local Mongo status on receipt of `UserLocked` event.
- [[V-password-complexity-per-security-level]] — force-change password obeys the tier from `account.PasswordSecurityLevel`.

### Failure modes the admin should know about

- If the new user is `Locked` before they ever log in (e.g. IP-allowlist misconfigured + 3 retries), only an admin can unlock by flipping `Locked → Pending` (BR-UM-08) via `PUT /api/user/status`. Self-service unlock is **not** allowed.
- If the credentials never arrive (Email bounced, SMS quota exceeded), there is **no FE re-dispatch surface today** (gap — flagged in [[E-user]]). Workaround: admin uses `PUT /api/user/status` to flip status back through Pending and the user goes through Forgot Password — or the admin re-creates with the same username (will fail with `DuplicateUsername`) so a soft-delete + re-create is the only path. **Flag this as a UX gap.**

---

## Cross-flow dependencies

- **Sub-flow of [[Add Client Flow]] Step 5** (with [[Commerce Service]] producing a Kafka `commerce.user-created.v1` event instead of calling Identity directly). The DTO shape is identical (`CreateUserRequest` via the `AccountOwner` block of `CreateAccountRequest`), but the transport is async. Validation errors surface differently — see [[Add Client Flow]] for the Step 5 specifics.
- **Triggers [[First Login Flow]]** — the new user's first session is always first-login (Pending → Active path).
- **Depends on Account existing first** — for Client-side roles (AO / Node Admin / Normal User), the tenant must exist (created via [[Add Client Flow]]). For Falcon-side roles, no tenant scope.
- **Permission decisions consulted in [[Access PES Service]]** — both at wizard-open (which roles + permission groups the actor can grant) and at the new user's first PES check after activation.
- **Permission Group taxonomy** lives in PES — adding a role/permission-group pair without backing PES rules will create a user who can't actually do anything. Coordinate with the PES rule-author when introducing new permission groups.
- **National ID** field is present on `UserPersonalInformation` but not required by PRD-02 — if the business wants it required, surface as a [[Falcon Input]] with `Validators.required` and flag for backend validator update.

---

## Implementation checklist

### Frontend (Angular — admin-console `apps/admin-console/src/app/features/org-hierarchy-page` or shared host-shell add-user-wizard)

- [ ] Wire entry-point buttons on Users list + Node right-pane to open the wizard (gated by PES `Allow` on `Add User`).
- [ ] Scaffold a [[Falcon Wizard]] with 3 steps; bind step-validators to Reactive Forms for each tab.
- [ ] Tab 1 fields with V-rule wiring per the table above; debounced `POST /user/exist` async validator.
- [ ] Profile uploader using existing skeleton/wrapper pattern; map `ProfilePictureInfo { Extension, FileBase64String }` on submit.
- [ ] Server-generated password preview via `POST /user/generate-password`; "regenerate" button; surface masked.
- [ ] Tab 2 fields with PES `authorize/resources` call on mount; reset Permission Group on Role change; render quota counter chip when Role = Normal User.
- [ ] Node picker — auto-collapse when entry point pre-selected the node; otherwise show [[Falcon Tree Panel]] in the right mode for the actor.
- [ ] Tab 3 delivery method dropdown; reuse [[Send Credentials Popup]] for the final confirmation.
- [ ] On Finish: build composite `CreateUserRequest`, POST via the right gateway, handle the full error code map (toast for transport errors, inline for field-level validation errors).
- [ ] On success: toast + refresh Users list + (optional) navigate to More-Details.
- [ ] Handle `NormalUserLimitReached` (422) by routing back to Tab 2 with the Role field flagged.
- [ ] i18n — every visible string in English + Arabic resource files; respect RTL.
- [ ] PES `authorize` check on entry buttons (visibility) — hide the Add User button entirely when the actor has no grantable roles.

### Backend (Identity — `Falcon.Identity.Api`)

- [ ] Verify the explicit FastEndpoints route for `CreateUserRequest` (currently undocumented — see "Route notes" above). If absent, add it.
- [ ] Confirm `CreateUserRequestValidator` enforces the rules per [VALIDATIONS](../../../../understanding/backend/identity/VALIDATIONS.md). **Open backlog item:** tighten `UserName` `MaximumLength(100)` → `MaximumLength(30)` to match PRD-02 BR-UM-12.
- [ ] Confirm `UserQuotaPolicy.EnforceOnCreate(...)` is wired into the create handler for `Role = normal-user`.
- [ ] Confirm the Identity → Zitadel adapter handles `CreateIdentityUserFailed` cleanly (rollback any partial state).
- [ ] Confirm `DeliveryMethod` drives the credential-dispatch side-effect synchronously inside the handler (or fires a notification-service Kafka message — verify).
- [ ] Emit `identity.user-events.v1` Kafka message post-create for PES sync.

### Backend (Access PES — `T2.PES.API`)

- [ ] Confirm `UserRoleLinkSyncRequestedConsumer` handles new-user events idempotently.
- [ ] Confirm `authorize/resources` returns the right grantable-role set for actor + node combinations.

### Cross-cutting

- [ ] Smoke test all 6 actor × target-role combinations against the role matrix.
- [ ] Smoke test Normal-User quota boundary (one create at limit + one beyond).
- [ ] Smoke test profile-picture rejection paths (oversized, wrong extension, executable).
- [ ] Smoke test username uniqueness collision + immutability after create.
- [ ] Smoke test First Login completion for a freshly created user end-to-end (Pending → Active).
- [ ] Confirm `DevOtpCode` is OFF in production `appsettings.json`.

---

## Open questions surfaced to this flow

- **Q-UM-05** — Profile picture format/size constraints (PRD silent — [[E-user]] flags as gap).
- **Q-UM-07** — Permission list - Jawad Tab 2 not captured (per [[Falcon Roles Permission Matrix]]).
- **Q-UM-08** — Are Client AO / Node Admin allowed to add Falcon-side users? (PRD silent — block at UI as defensive default.)
- **Q-UM-12** — Vocabulary mismatch on `PasswordSecurityLevel` (PRD Normal/Advanced vs code Low/Medium/High/Strict) — per [[V-password-complexity-per-security-level]].
- **Q-UM-13** — Admin-driven email/phone OTP path unclear vs `/me/` flow — affects Edit User (not Add User) but tied to the same `VerificationSession` shape — per [[E-otp-challenge]].
- **Q-UM-14** — `RoleKey` (string) vs `eUserRoles` (int) — bind to `RoleKey` per DTO_DICTIONARY guidance.
- **GAP-UM-34** — "Contact administrator" alerts include manager info? — affects post-lockout messaging (not Add User flow itself but the new user's first-login experience).
- **GAP-UM-36** — No FE re-dispatch surface for failed credential delivery (Email bounced / SMS quota exceeded). Flagged above as a UX gap; recommend a "Resend credentials" action on the More-Details page as a follow-up.

---

## Hubs

[[Organization Hierarchy]] · [[02 User Management]] · [[Add Client Flow]] · [[Edit User Flow]] · [[First Login Flow]] · [[Identity Service]] · [[Access PES Service]] · [[Commerce Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[E-user]] · [[E-otp-challenge]] · [[E-session]] · [[User Statuses]] · [[Falcon Roles Permission Matrix]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
