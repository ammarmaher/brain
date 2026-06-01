---
type: flow-integration
flow: Add User
playbook: Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md
prd-module: PRD-02 User Management
steps: 3
purpose: "Answers 'which 5 of 6 roles can Add User + what target user types each actor can grant + BR-UM-03 one-AO-per-tenant constraint'. Open when implementing the 3-tab Add User wizard."
extracted: 2026-05-16
---

# Add User — Flow × Authority Integration

> [!tldr]
> 3-tab wizard (Personal Information · Role & Permissions · Notification & Credentials) for creating any kind of user (Falcon-side or Client-side). 5 of 6 roles can run it, but **the role of the user being created** is constrained by the **role of the actor running the wizard** (role-edit matrix + `BR-UM-03..05`). Single composite POST to Identity (`/api/user/`); produces a `Pending` user; first-login flow (separate playbook) flips to `Active`. **Three actor paths** produce different user types — clarified below.

## Permission gate — three paths

> Source: `[BRAIN-OUT] flows/Add User.md:25-32`

Add User can be reached from **two consoles** (admin-console for Falcon staff, management-console for Client tenants) and produces **different user types** depending on the actor's role:

| Actor role | Path / console | PES key checked | Target user roles the actor can grant | Cited from |
|---|---|---|---|---|
| `sys-admin` | admin-console | `sys.user.add` (Wave 1.3.0; not in seed `BuiltInRoleCatalog.cs` yet) `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:52` | ANY of: `sys-admin` · `sys-ops` · `sys-products` · `acc-owner` · `acc-admin` · `acc-user` (full role-edit reach across BOTH sys-* and acc-* families) `[BRAIN-OUT] 01-roles/sys-admin.md:75-78` |
| `sys-ops` | admin-console | `sys.user.add` (Wave 1.3.0) — `[INFERRED]` (no explicit deny rule; seed catalog silent for sys-ops on this key) | `sys-ops` (keep own) **OR** any `acc-*` (full reach within acc family). Cannot grant `sys-admin` or `sys-products` `[BRAIN-OUT] 01-roles/sys-ops.md:73-77` |
| `sys-products` | admin-console | `sys.user.add` (Wave 1.3.0) — same caveat | `sys-products` (keep own) **OR** any `acc-*`. Cannot grant `sys-admin` or `sys-ops` `[BRAIN-OUT] 01-roles/sys-products.md:73-81` |
| `acc-owner` | management-console | `acc.account-user.add` (only acc-owner has this) **AND** `acc.org-user.add` `[BRAIN-OUT] 01-roles/acc-owner.md:52-53` · PES factories: `managementConsole.accountUser.add()` + `managementConsole.orgUser.add()` `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:68-69` | All `acc-*`: `acc-owner` · `acc-admin` · `acc-user` (full reach within acc family — note one-AO-per-tenant per `BR-UM-03`: a second `acc-owner` will be rejected at submit) `[BRAIN-OUT] 01-roles/acc-owner.md:80-83` |
| `acc-admin` | management-console | **ONLY** `acc.org-user.add`; explicitly **no rule** for `acc.account-user.add` (silent deny) `[BRAIN-OUT] 01-roles/acc-admin.md:52-53` | `acc-admin` (keep) **OR** `acc-user`. Cannot grant `acc-owner` `[BRAIN-OUT] 01-roles/acc-admin.md:79-83` |
| `acc-user` | (cannot reach the wizard) | none — `BR-UM-05` transactional role | none — empty list per role-edit matrix `[BRAIN-OUT] 01-roles/acc-user.md:80-86` |

**Conclusion:** 5 of 6 roles can run Add User. Wizard surfaces are gated by the relevant PES factory call on mount; the actor's grantable-role set drives the Tab 2 Role dropdown options (frontend should call `POST /pes/authorize/resources` with `action: "grant-role"` to populate it server-side rather than trusting a static client-side enum) `[BRAIN-OUT] flows/Add User.md:130-135`.

**Gateway routing:** depends on actor type — sys-* through System Gateway (`:7256`); acc-* through Core Gateway (`:7038`). Both paths land on the same Identity `/api/user/` endpoint; Identity discriminates server-side from the JWT `[BRAIN-OUT] flows/Add User.md:193-195`.

## Three actor paths produce different user types — clarified

| Actor → Target | What gets created | Special concerns |
|---|---|---|
| `sys-admin` → `sys-*` (own family) | Falcon-side user with `TenantId = null`, `NodeId = root` (auto, hidden) | If `Role = sys-*` and request carries `TenantId`, backend returns 422 `FalconUserMustNotHaveTenantId` `[BRAIN-OUT] flows/Add User.md:184` |
| `sys-admin` / `sys-products` → `acc-*` (any tenant) | Client-side user inside a chosen tenant; node-picker shows full tree (`falcon-full` mode) | `BR-UM-03` enforces one AO per tenant — if `Role = account-owner` and the tenant already has one, 422 `InvalidRoleForUserType`. Falcon admins should filter the Role dropdown via PES to avoid this. |
| `acc-owner` → `acc-owner` (would be the second) | **REJECTED** — `BR-UM-03` only allows one AO per account `[BRAIN-OUT] flows/Add User.md:30, 271` | Tab 2 Role dropdown should NOT include `account-owner` when the tenant already has one. |
| `acc-owner` → `acc-admin` / `acc-user` (own tenant) | Client-side sub-user inside the actor's tenant; node-picker auto-scoped to own subtree (`client` mode) `[BRAIN-OUT] flows/Add User.md:144-148` | Quota gate on `Normal User` (Role = `acc-user`) → 422 `NormalUserLimitReached` if `account.MaxNormalUserLimit` exceeded. |
| `acc-admin` → `acc-admin` / `acc-user` (sub-nodes only) | Client-side sub-user scoped to actor's own sub-nodes only `[BRAIN-OUT] flows/Add User.md:31` | Same quota gate; cannot add on Main node (per `BR-UM-04`). |

## Tab × authority cross-cut

| Tab | DTO sub-block on `CreateUserRequest` | PES key checked | V-rules used | Entity drift / consumed | Status transition | Kafka emit | Error codes (HTTP) |
|---|---|---|---|---|---|---|---|
| **1 — Personal Information** | `PersonalInfo` (FirstName · LastName · UserName · Email · PhoneNumber · NationalId? · ProfilePictureInfo? · `PasswordSecurityLevel` read-only) | (entry gate only) | `V-user-first-last-name-letters-only` (NotEmpty + MaximumLength(50) + Matches(LettersOnly)) `[BRAIN-OUT] flows/Add User.md:72` · `V-username-format-uniqueness-immutable` (PRD-30 vs backend-100 drift — **FE enforces 30**) `[BRAIN-OUT] flows/Add User.md:73, 78-79` · `V-password-complexity-per-security-level` (preview-only — server regenerates) `[BRAIN-OUT] flows/Add User.md:90-95` | reads: `account.PasswordSecurityLevel` from Commerce `GET /Setting` (drives password preview) `[BRAIN-OUT] flows/Add User.md:91` · async `POST /api/user/exist` debounced 300 ms `[BRAIN-OUT] flows/Add User.md:82-86` | (none on Tab 1 alone — commit at Tab 3) | (none on Tab 1 alone) | 400: `RequiredFieldMissing` · `MaxLengthExceeded` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · profile-picture variants (`ProfilePictureSizeExceeded` · `ImageExtensionNotAllowed` · `ExecutableFileNotAllowed` · `InvalidImageFile`) · 409 `DuplicateUsername` (Tab 1 surface; can also come from race at submit) `[BRAIN-OUT] flows/Add User.md:184` |
| **2 — Role & Permissions** | `Role` (legacy enum) · `RoleKey` (canonical string — bind to this) · `PermissionGroupId` · `TenantId?` · `NodeId?` · `Path?` | `POST /pes/authorize/resources` with `{ action: "grant-role", resourceType: "user", scope: <node-or-tenant> }` returns the **set of grantable role keys** which populates the Role dropdown `[BRAIN-OUT] flows/Add User.md:131-134` | `V-normal-user-limit-enforcement` `[BRAIN-OUT] flows/Add User.md:117` (when `Role = normal-user` → Identity `UserQuotaPolicy.EnforceOnCreate(...)` blocks with 422 `NormalUserLimitReached` if `account.MaxNormalUserLimit` exceeded; Pending+Active+Suspended+Locked count; Deleted does NOT per `BR-UM-07`) | reads: `GET /api/user/count?TenantId=<id>&Roles[]=normal-user` (pre-flight quota counter — non-blocking) `[BRAIN-OUT] flows/Add User.md:122-126` · reads: PES permission-group list (`GET /pes/roles` or equivalent — filter by Role) `[BRAIN-OUT] flows/Add User.md:139-141` | (none on Tab 2 alone) | (none on Tab 2 alone) | 422: `NormalUserLimitReached` · `InvalidRoleForUserType` · `FalconUserMustNotHaveTenantId` `[BRAIN-OUT] flows/Add User.md:184` · 403: `UnauthorizedUserToPerformThisAction` |
| **3 — Notification & Credentials** | `DeliveryMethod` (Email / SMS / Both) | (entry gate only) | (none unique to Tab 3 — preview password obeys `V-password-complexity-per-security-level` set in Tab 1) | reads: confirms `Email` + `PhoneNumber` destinations from Tab 1 | **Submit-time** (single composite POST to `/api/user/`): User entity → **`Pending`** per `BR-UM-10` `[BRAIN-OUT] flows/Add User.md:113, 226` (→ Active on first-login + IP + OTP + force-change-password; → Locked on 3 wrong logins/OTPs per `BR-UM-08`) | 1 event: `identity.user-events.v1` (→ PES `UserRoleLinkSyncRequestedConsumer` refreshes role/policy linkage — eventual consistency, wizard does NOT wait) `[BRAIN-OUT] flows/Add User.md:135, 231-232` | 500: `CreateIdentityUserFailed` (Zitadel hop failure — rollback partial state) `[BRAIN-OUT] flows/Add User.md:184, 236-237` |

### Backend endpoints

| Method | Path | Service | Auth | Request | Response | Notable |
|---|---|---|---|---|---|---|
| **POST** | **`/api/user/`** (via gateway; route shape verify — registry says no explicit route binding observed) `[BRAIN-OUT] flows/Add User.md:191-193` | [[Identity Service]] `CreateUserEndpoint` | Class-level auth | `CreateUserRequest { PersonalInfo, PermissionGroupId, DeliveryMethod, RoleKey?, Role?, TenantId?, NodeId?, Path? }` | `ServiceOperationResult<CreateUserResponse>` (id, status=Pending) | Camel-case wire format (Identity convention, unlike Commerce PascalCase) `[BRAIN-OUT] flows/Add User.md:193-194` |
| POST | `/api/user/exist` | [[Identity Service]] `UserExistEndpoint` | Class-level auth | `UserExistRequest { Username }` | `ExistResponse { Exists: bool }` | Tab 1 async uniqueness |
| POST | `/api/user/generate-password` | [[Identity Service]] | **Anonymous** (overrides group policy) `[BRAIN-OUT] flows/Add User.md:186` | `GeneratePasswordRequest { PasswordSecurityLevel }` | `GeneratePasswordResponse { Password }` | Server regenerates at create-time; preview may differ from delivered password — verify at runtime |
| GET | `/api/user/count?TenantId=...&Roles[]=normal-user` | [[Identity Service]] | Class-level auth | `GetUserCountRequest { TenantId, Roles[]? }` | `long` (raw) | Tab 2 pre-flight quota counter |
| POST | `/pes/authorize/resources` | [[Access PES Service]] | Class-level auth | grantable-resources query | set of grantable resources/actions | Tab 2 Role dropdown population |
| GET | `/commerce/Setting` | [[Commerce Service]] | Class-level auth | (tenant-scoped from JWT) | `GetSettingsResponse` (carries `PasswordSecurityLevel`, `MaxNormalUserLimit`) | Tab 1 password-preview seed + Tab 2 quota baseline |

## Cross-cluster citations

### V-rules (5)

| V-rule | Tab | Reference |
|---|---|---|
| `V-user-first-last-name-letters-only` | 1 | `[BRAIN-OUT] flows/Add User.md:72` |
| `V-username-format-uniqueness-immutable` | 1 (uniqueness only; immutability is post-create) | `[BRAIN-OUT] flows/Add User.md:73, 78-79` — **HIGH drift** PRD 30 vs backend 100 |
| `V-password-complexity-per-security-level` | 1 (server-side auto-gen + first-login force-change) | `[BRAIN-OUT] flows/Add User.md:90-95, 258` |
| `V-normal-user-limit-enforcement` | 2 | `[BRAIN-OUT] flows/Add User.md:117` |
| `V-account-ip-allowlist-enforcement` | (post-creation, at first-login) | `[BRAIN-OUT] flows/Add User.md:256` — IP check runs at FastEndpoints pre-processor **before** credentials; generic reject per `BR-UM-24` |

> **Phase 2 note:** `06-validation-by-feature/MATRIX.md` Add User column should consolidate these — currently we cite the playbook.

### Entity drift / consumed entities

| Entity | Role in flow | Drift / gap |
|---|---|---|
| `E-user` | Created (in `Pending`) | `RoleKey` (string) vs `eUserRoles` (int) — bind to `RoleKey` per `[BRAIN-OUT] flows/Add User.md:328` (Q-UM-14) · National ID field present on DTO but not required by PRD `[BRAIN-OUT] flows/Add User.md:66` · profile-picture format/size silent in PRD (Q-UM-05; FE infers JPG/PNG/WEBP ≤ 2 MB) `[BRAIN-OUT] flows/Add User.md:67, 323` |
| `E-otp-challenge` | (post-creation first-login) | `LoginStepResponse.DevOtpCode?` populated in dev environments only — security risk `[BRAIN-OUT] flows/Add User.md:166-167` |
| `E-session` | (post-creation first-login) | Created when first-login completes Pending → Active `[BRAIN-OUT] flows/Add User.md:251` |
| `E-account` (read-only) | Tab 2 quota check | Read via Commerce `GET /Setting` for `MaxNormalUserLimit` |

### Business rules

| Rule | Where it fires | Reference |
|---|---|---|
| `BR-UM-01..05` | Role catalog + grantability matrix | `[BRAIN-OUT] flows/Add User.md:27-32` |
| `BR-UM-03` "One AO per account" | Tab 2 Role dropdown filtering · Identity 422 at submit | `[BRAIN-OUT] flows/Add User.md:30, 271` |
| `BR-UM-04` "Node Admin scope = own sub-nodes only" | Tab 2 Node picker `client` mode | `[BRAIN-OUT] flows/Add User.md:31, 144-148` |
| `BR-UM-05` "Normal User cannot add users (transactional)" | Wizard gate hidden | `[BRAIN-OUT] flows/Add User.md:32` |
| `BR-UM-07` "Quota counts: Pending+Active+Suspended+Locked; Deleted excluded" | Tab 2 quota counter | `[BRAIN-OUT] flows/Add User.md:117` |
| `BR-UM-08` "User-status transitions (incl. 3-strikes → Locked)" | Post-creation lifecycle | `[BRAIN-OUT] flows/Add User.md:200-228` + `[BRAIN-OUT] 02-statuses/user-status.md:47-53` |
| `BR-UM-09/10` "New user created in `Pending`; status not editable on create" | Tab 2 Status field display-only | `[BRAIN-OUT] flows/Add User.md:113-114, 225-226` |
| `BR-UM-11..16, 19` | Tab 1 Personal Info field rules | `[BRAIN-OUT] flows/Add User.md:45` |
| `BR-UM-12` "Username ≤ 30 chars" | Tab 1 (FE-only — backend caps at 100; HIGH drift) | `[BRAIN-OUT] flows/Add User.md:78-79` |
| `BR-UM-15/18` "Credentials sent via DeliveryMethod" | Tab 3 confirmation + Identity dispatch | `[BRAIN-OUT] flows/Add User.md:47` |
| `BR-UM-24` "IP-allowlist reject is generic (no enumeration leak)" | First-login | `[BRAIN-OUT] flows/Add User.md:248` |
| `BR-UM-42` "One Permission Group per user" | Tab 2 Permission Group dropdown single-select | `[BRAIN-OUT] flows/Add User.md:46, 111` |
| `BR-UM-48` "Profile picture format/size silent in PRD" | Tab 1 uploader | `[BRAIN-OUT] flows/Add User.md:67` |

### Non-PES gates

| Gate type | Where | Effect |
|---|---|---|
| `POST /pes/authorize/resources` on wizard open | Tab 2 mount | Returns grantable-role set; if empty, actor sees "no permission to add users at this node" empty state and wizard closes `[BRAIN-OUT] flows/Add User.md:131-134` |
| Async uniqueness HTTP probe | Tab 1 client-side | Pre-empts 409 `DuplicateUsername` at submit |
| Quota pre-flight counter | Tab 2 client-side | Non-blocking, but disables Tab 2 advance if at cap (authoritative gate is backend 422) `[BRAIN-OUT] flows/Add User.md:122-126` |
| `UserQuotaPolicy.EnforceOnCreate(...)` | Backend handler | 422 `NormalUserLimitReached` on cap breach |
| Identity → Zitadel adapter | Backend | 500 `CreateIdentityUserFailed` triggers rollback of any partial state `[BRAIN-OUT] flows/Add User.md:236-237` |
| Identity → Kafka `identity.user-events.v1` | Backend post-create | PES role-link sync (eventual consistency) — UI does NOT wait `[BRAIN-OUT] flows/Add User.md:231-232` |

### Error codes (HTTP-grouped)

> Full mapping in `[BRAIN-OUT] flows/Add User.md:184`.

**400:** `RequiredFieldMissing` · `MaxLengthExceeded` · `UsernameMustStartWithLetter` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `InvalidValue` · `ProfilePictureSizeExceeded` · `ImageExtensionNotAllowed` · `ExecutableFileNotAllowed` · `InvalidImageFile` · `InvalidUserExistQuery` · `TenantIdRequired`.

**409:** `DuplicateUsername`.

**422:** `NormalUserLimitReached` · `InvalidRoleForUserType` · `FalconUserMustNotHaveTenantId`.

**403:** `UnauthorizedUserToPerformThisAction`.

**500:** `CreateIdentityUserFailed` · `ZitadelCreateProjectFailed` · `ZitadelSearchUserFailed` · other `Zitadel*` failures.

**Open UX gap (GAP-UM-36):** No FE re-dispatch surface for failed credential delivery (email bounced / SMS quota exceeded). Workaround: soft-delete + re-create — but `DuplicateUsername` blocks re-create with same username. `[BRAIN-OUT] flows/Add User.md:263`.

## Cross-references

- Playbook (canonical SoT): `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md` (337 lines)
- Authority dataset
  - [01-roles/sys-admin](../01-roles/sys-admin.md) — broadest target reach
  - [01-roles/sys-ops](../01-roles/sys-ops.md) · [01-roles/sys-products](../01-roles/sys-products.md)
  - [01-roles/acc-owner](../01-roles/acc-owner.md) — only role with `acc.account-user.add`
  - [01-roles/acc-admin](../01-roles/acc-admin.md) — `acc.org-user.add` only
  - [02-statuses/user-status](../02-statuses/user-status.md)
  - [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md)
  - [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md)
- Sibling integration files
  - [MATRIX](MATRIX.md)
  - [Add-Client.integration](Add-Client.integration.md) — Step 5 of Add Client is the **async Kafka** version of this flow (same `CreateUserRequest` shape, different transport)
- First-login flow (separate playbook, not yet authored) — `Pending → Active` transition is owned there.
