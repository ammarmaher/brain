---
type: a-to-z-trace
feature: Add User wizard
trace-depth: 18 layers
exemplar: false
purpose: "Walks the Add User wizard from business intent through PRD, business rules, validation, entities, backend, frontend, tests, and verification. Companion to Add-Client.trace.md (Step 5 of Add Client is the async-Kafka twin of this flow)."
audience: AI agents + developers implementing the 3-tab Add User wizard in admin-console and management-console
extracted: 2026-05-16
---

# Add User — A→Z Implementation Trace

## TL;DR

Add User is Falcon's standalone 3-tab wizard (Personal Information · Role & Permissions · Notification & Credentials) that composes **one `CreateUserRequest`** sent to Identity (`POST /api/user/`) to create a single `Pending` user. **5 of 6 PES roles can run it** — but the role of the user being created is constrained by the actor's role-edit matrix (BR-UM-03..05). On success Identity emits `identity.user-events.v1` for PES role-link sync and dispatches credentials via the chosen `DeliveryMethod`; first-login flips the new user to `Active`. This trace is the canonical 18-layer view of the standalone wizard; Step 5 of Add Client is the **async-via-Kafka** twin (same `CreateUserRequest` shape, different transport).

## The 18-layer trace at a glance

| # | Layer | What it answers | Primary source |
|---|---|---|---|
| 1 | Business intent | What user need does this serve? | `[BRAIN-OUT] flows/Add User.md:9-12` |
| 2 | PRD requirement | Which PRD lines authorize this flow? | `[BRAIN-OUT] prd/modules/02-user-management/WORKFLOWS.md` §W1 + `BUSINESS_RULES.md` BR-UM-01..48 |
| 3 | Permission gate | Who can run it (role × resource × action)? | `[BRAIN-OUT] flows/Add User.md:25-39` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-User.integration.md:18-31` |
| 4 | BR-UM rules | What cross-field / workflow rules apply? | `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:99-110` |
| 5 | V-rules per tab | What field-level validation rules govern each tab? | `[BRAIN-OUT] flows/Add User.md:72-79, 117, 163` + 5 V-rule notes in `[VAULT] _obsidian/30-Validation/` |
| 6 | E-* entity drift | Which entities does this create + drift items? | `[VAULT] _obsidian/40-API/E-user.md` + `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:98` |
| 7 | Backend DTOs | `CreateUserRequest` shape + `[ThrowIf*]` attributes | `[BRAIN-OUT] flows/Add User.md:60-67, 109-114` + `[BRAIN-OUT] Add-User.integration.md:55-62` |
| 8 | Backend endpoint + handler | Route + endpoint + handler flow | `[BRAIN-OUT] flows/Add User.md:180-195` + `[BRAIN-OUT] Add-User.integration.md:54-62` |
| 9 | FluentValidator + handler-time gate | What runs server-side after `[ThrowIf*]`? | `[BRAIN-OUT] flows/Add User.md:72-79, 117-127` |
| 10 | Kafka events | What downstream events fire on success? | `[BRAIN-OUT] flows/Add User.md:230-237` + `[BRAIN-OUT] Add-User.integration.md:51` |
| 11 | Error codes | Every `FalconKeys.Error.*` Add User can surface | `[BRAIN-OUT] flows/Add User.md:184` + `[BRAIN-OUT] 13-error-catalog/CATALOG.md:45-47, 172, 209` |
| 12 | FE route + PES gate | Route path + `data.access` + `FalconAccess.*` key | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:53, 69-70` + `[BRAIN-OUT] flows/Add User.md:13-39` |
| 13 | FE components | Falcon UI Core components used per tab | `[BRAIN-OUT] flows/Add User.md:60-67, 109-114, 156-159` |
| 14 | FE form + state | Reactive form choice per tab + wizard state | `[BRAIN-OUT] flows/Add User.md:97-100` + `[CODE] add-user-wizard/` directory |
| 15 | FE i18n keys | Translation keys (en + ar resolutions) | `[INFERRED]` — playbook silent; recommended namespace inferred from admin-console conventions |
| 16 | Test case (Gherkin) | 5+ scenarios with realistic assertions | composed from layers 3 + 4 + 5 + 11 |
| 17 | Port artifact | Where it lives in admin-console; does it port to mgmt? | `[BRAIN-OUT] flows/Add User.md:280-294` + `[CODE] apps/admin-console/.../add-user-wizard/` |
| 18 | Capability map per role | 6 roles × can-run verdict | `[BRAIN-OUT] 05-capability-maps/*.capability.md:51` + `[BRAIN-OUT] Add-User.integration.md:23-29` |

---

## Layer 1 — Business intent

**The user need.** A Falcon staff member or Client admin onboards a single new user — Falcon-side (sys-admin / sys-ops / sys-products) or Client-side (acc-owner / acc-admin / acc-user) — into the platform with the correct role, permission group, node assignment, and credential-delivery channel. Unlike Add Client which mints a new tenant scope, Add User operates **within** an existing scope: Falcon-namespace users belong to the root tenant; Client-namespace users belong to the actor's tenant + a node.

**Why this is hard.** Without the wizard:
- The operator would need to know the role-edit matrix by heart — which target roles the actor's own role can grant (`BR-UM-01..05`).
- The PRD `Username` cap (30) and the backend cap (100) diverge — **the FE is the only line keeping the system PRD-conformant** `[BRAIN-OUT] flows/Add User.md:76-79`.
- Tab 2's Role dropdown must be **server-driven** (from PES `authorize/resources` call) to avoid showing a role the actor cannot actually grant `[BRAIN-OUT] flows/Add User.md:130-135`.
- Quota for Normal Users is enforced backend-side at submit — the FE can pre-flight `/api/user/count` for a counter chip but the authoritative gate is the 422 `NormalUserLimitReached`.
- Credentials are dispatched in the same handler — the operator has one chance to pick a `DeliveryMethod` that the user can actually receive.

**The wizard's promise.** One composite request, one server-side transaction, one consolidated error surface. The new user lands in `Pending`; the channel-delivered credentials kick off the separate **First Login** flow that flips `Pending → Active`. `[BRAIN-OUT] flows/Add User.md:9-11`

**Scope vs Add Client Step 5.** This trace covers the **standalone** wizard. Step 5 of Add Client uses the same `CreateUserRequest` payload shape but submits it via Commerce → Kafka (`commerce.user-creation-requested.v1`) → Identity rather than direct HTTP to Identity. The validation rules, error codes, and entity drift are identical; only the transport differs. `[BRAIN-OUT] flows/Add User.md:269` + `[BRAIN-OUT] Add-User.integration.md:14`.

---

## Layer 2 — PRD requirement

**Module:** PRD-02 User Management.

**Authoring source.** `[BRAIN-OUT] prd/modules/02-user-management/` — load-bearing PRD artifacts for Add User:

| PRD artifact | What it carries | Used by Add User for |
|---|---|---|
| `OVERVIEW.md` Actors row | Who is allowed to add users (sys-* + acc-owner + acc-admin) | Permission gate (Layer 3) |
| `WORKFLOWS.md` §W1 | The 3-tab wizard definition | Wizard shape + tab boundaries |
| `BUSINESS_RULES.md` BR-UM-01..48 | Role grantability + field rules + status lifecycle | Field rules (Layer 4) |
| `ENTITIES.md` User | User entity shape (FirstName · LastName · UserName · Email · PhoneNumber · NationalId? · Role · RoleKey · PermissionGroupId · TenantId? · NodeId? · Path? · Status) | Entity drift (Layer 6) |

**The 3 tabs per PRD-02 WORKFLOWS §W1.** `[BRAIN-OUT] flows/Add User.md:41-48`:

1. **Personal Information** (mandatory) — First name · Last name · Username · Email · Phone · Profile picture? · (server-generated password preview)
2. **Role & Permissions** (mandatory) — Role · Permission Group · Node assignment · Sub-node scope (Client AO/NA only) (PRD-02 names this "Role & Status / Permissions"; the playbook collapses Status — which defaults to `Pending` and is non-editable on create — and routes the credential-delivery concern to Tab 3) `[BRAIN-OUT] flows/Add User.md:50-51`
3. **Notification & Credentials** (mandatory) — Delivery method (Email / SMS / Both) · Welcome message? · Confirmation summary

**Critical implementation note.** The wizard is NOT per-tab API submission. Tab 1's username uniqueness check (`POST /api/user/exist`) is the only network call before Submit; the composite `CreateUserRequest` is submitted **once** on Tab 3 Finish. `[BRAIN-OUT] flows/Add User.md:171-176`

**PRD divergence (honest call).** PRD-02 names the three tabs "Personal Information / Role & Status / Permissions". This playbook adopts "Personal Information / Role & Permissions / Notification & Credentials" — either split is conformant; what matters is that the composite request carries all five required blocks (`PersonalInfo` · `RoleKey` · `PermissionGroupId` · `DeliveryMethod` · node-scope inputs). `[BRAIN-OUT] flows/Add User.md:50-51`.

---

## Layer 3 — Permission gate

**The matrix — three actor paths producing different user types.** `[BRAIN-OUT] flows/Add User.md:25-39` + `[BRAIN-OUT] Add-User.integration.md:23-29`:

| Role | Can run? | Console | PES key checked | Target roles grantable | Source |
|---|---|---|---|---|---|
| `sys-admin` (System Administrator) | ✅ YES | admin-console | `sys.user / add` (Wave 1.3.0; not in seed `BuiltInRoleCatalog.cs` yet) `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:53` | ANY of: `sys-admin` · `sys-ops` · `sys-products` · `acc-owner` · `acc-admin` · `acc-user` | `[BRAIN-OUT] 01-roles/sys-admin.md:75-78` |
| `sys-ops` (Operation) | ✅ YES | admin-console | `sys.user / add` (Wave 1.3.0) — `[INFERRED]` (no explicit deny rule; seed catalog silent for sys-ops on this key) | `sys-ops` (keep own) **OR** any `acc-*`. Cannot grant `sys-admin` or `sys-products` | `[BRAIN-OUT] 01-roles/sys-ops.md:73-77` |
| `sys-products` (Products) | ✅ YES | admin-console | `sys.user / add` (Wave 1.3.0) | `sys-products` (keep own) **OR** any `acc-*`. Cannot grant `sys-admin` or `sys-ops` | `[BRAIN-OUT] 01-roles/sys-products.md:73-81` |
| `acc-owner` (Account Owner) | ✅ YES | management-console | `acc.account-user / add` (root-node Add User) **AND** `acc.org-user / add` (sub-node Add User) | All `acc-*`: `acc-owner` · `acc-admin` · `acc-user` — but **one AO per tenant** per BR-UM-03 → second AO is rejected | `[BRAIN-OUT] 01-roles/acc-owner.md:52-53, 80-83` + `[CODE] pes-account-role-rules.json:8-9` |
| `acc-admin` (Node Admin) | ✅ YES (sub-node only) | management-console | **ONLY** `acc.org-user / add`; `acc.account-user / add` has **no rule** (silent deny) | `acc-admin` (keep) **OR** `acc-user`. Cannot grant `acc-owner` | `[BRAIN-OUT] 01-roles/acc-admin.md:52-53, 79-83` + `[CODE] pes-account-role-rules.json:40` |
| `acc-user` (Normal User) | ❌ NO | (cannot reach the wizard) | none — BR-UM-05 transactional role | none — empty list per role-edit matrix | `[BRAIN-OUT] 01-roles/acc-user.md:80-86` + `[CODE] pes-account-role-rules.json:66` |

**Conclusion — 5 of 6 roles can run Add User.** That is the **widest** role surface in the Org Hierarchy feature family (compare: Add Client is 2 / 6, Add Node + Edit Node are 4 / 6). `[BRAIN-OUT] 18-a-to-z-traces/Add-Client.trace.md:840-843`.

**The three-layer gate** — defense in depth, same as Add Client:

1. **Frontend visibility (UX gate)** — `Add User` button only renders when the relevant PES factory passes (`FalconAccess.adminConsole.user.add()` for sys-*, `FalconAccess.managementConsole.accountUser.add()` for acc-owner root, `FalconAccess.managementConsole.orgUser.add()` for acc-owner sub + acc-admin). `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:53, 69-70`.
2. **PES policy at the Gateway** — System Gateway (sys-*) or Core Gateway (acc-*) routes the request to Identity only if PES decides allow on `sys.user / add` or the `acc.*-user / add` key matching the call path.
3. **Backend `[Authorize]` on `CreateUserEndpoint`** — class-level attribute rejects anonymous calls `[BRAIN-OUT] flows/Add User.md:184`. The handler also runs role-edit-matrix validation against the actor's JWT claims and rejects with 422 `InvalidRoleForUserType` if the actor cannot grant the requested target role `[BRAIN-OUT] flows/Add User.md:184` + `[BRAIN-OUT] 13-error-catalog/CATALOG.md:209`.

**Gateway routing — actor-dispatched.** sys-* through System Gateway (`:7256` dev); acc-* through Core Gateway (`:7038` dev). Both paths land on the same Identity `/api/user/` endpoint; Identity discriminates server-side from the JWT (`currentUser` + `userType` claim). `[BRAIN-OUT] flows/Add User.md:193-195`.

**Open questions surfaced.**
- **Q-UM-07** — "Are Account Owner / Node Admin allowed to add Falcon-side users?" PRD silent. **Block at UI** (filter Role dropdown to grantable set only) and rely on backend `InvalidRoleForUserType` (422) as the fallback. `[BRAIN-OUT] flows/Add User.md:34`.
- **Q-AM-16 / Q-UM-07** — PES rule sync drift with the Permission spreadsheet (Jawad). PES is the runtime authority; the sheet is for reference only.

---

## Layer 4 — BR-UM business rules

Add User touches **~17 of 48 BR-UM rules** plus 2 cross-references to BR-AM (Account Limits + IP allowlist for first-login). `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:99-110` + `[BRAIN-OUT] Add-User.integration.md:89-104`. Listed in tab/lifecycle order:

| BR # | Rule | Wizard surface |
|---|---|---|
| BR-UM-01 | Falcon usertypes on Root only; Client on Main/Sub | Node-picker mode gating (Falcon admin → `falcon-full`; Client admin → `client`) |
| BR-UM-02 | Only SA + Product can Add Client (cross-ref) | Excludes Add Client from Add User scope — confirms one-wizard-per-flow |
| BR-UM-03 | **One Account Owner per Account** | Tab 2 Role dropdown filtering · Identity 422 `InvalidRoleForUserType` if violated `[BRAIN-OUT] flows/Add User.md:30, 271` |
| BR-UM-04 | Node Admin scope = own sub-nodes only | Tab 2 Node picker `client` mode auto-scoped to actor's subtree `[BRAIN-OUT] flows/Add User.md:31, 144-148` |
| BR-UM-05 | Normal User cannot add users (transactional) | Wizard entry gate hidden for acc-user `[BRAIN-OUT] flows/Add User.md:32` |
| BR-UM-07 | Quota counts: Pending + Active + Suspended + Locked; Deleted excluded | Tab 2 quota counter (preflight + authoritative 422) `[BRAIN-OUT] flows/Add User.md:117` |
| BR-UM-08 | User-status transitions (incl. 3-strikes → Locked) | Post-creation lifecycle (Active happens on first-login, not at create) `[BRAIN-OUT] flows/Add User.md:200-228` |
| BR-UM-09 | New user created in `Pending` | Tab 2 Status field display-only · Identity sets server-side `[BRAIN-OUT] flows/Add User.md:225-226` |
| BR-UM-10 | Status not editable on create | Tab 2 Status read-only chip |
| BR-UM-11 | FirstName/LastName ≤50 chars letters-only mandatory | Tab 1 — `PersonalInfo.FirstName` + `PersonalInfo.LastName` |
| BR-UM-12 | **Username ≤30 chars letter-first unique mandatory** | Tab 1 (FE-only — backend caps at 100; HIGH drift) `[BRAIN-OUT] flows/Add User.md:78-79` |
| BR-UM-13 | Email valid format mandatory | Tab 1 — `PersonalInfo.Email` |
| BR-UM-14 | PhoneNumber valid format mandatory (OTP delivery) | Tab 1 — `PersonalInfo.PhoneNumber` |
| BR-UM-15 | Initial password auto-generated | Tab 1 password preview · server regenerates at create-time `[BRAIN-OUT] flows/Add User.md:90-95` |
| BR-UM-18 | Save → delivery dialog (Email / Phone / Both) | Tab 3 confirmation · Identity dispatches `[BRAIN-OUT] flows/Add User.md:47, 173` |
| BR-UM-19 | (Step 5 reuse — first AO creation rule) | Cross-flow — Add Client Step 5 invokes the same `CreateUserRequest` |
| BR-UM-24 | IP-allowlist reject is generic (no enumeration leak) | First-login (post-creation) — generic toast, not "user exists" leak `[BRAIN-OUT] flows/Add User.md:248` |
| BR-UM-42 | One Permission Group per user | Tab 2 Permission Group dropdown — **single-select**, not multi `[BRAIN-OUT] flows/Add User.md:46, 111` |
| BR-UM-48 | Profile picture format/size silent in PRD | Tab 1 uploader uses safe defaults (JPG/PNG/WEBP, ≤2 MB) — flagged Q-UM-05 `[BRAIN-OUT] flows/Add User.md:67, 323` |

**Cross-flow BR-AM rules touched** (read-only — Add User consumes these from Account settings):

- BR-AM-09 — `PasswordSecurityLevel` is account-level → drives Tab 1 password preview tier `[BRAIN-OUT] flows/Add User.md:90-95`
- BR-AM-11 — Account Limits `MaxNormalUserLimit` → drives Tab 2 quota counter
- BR-AM-10 — IP allowlist enforcement → applied at first-login, not at Add User submit

---

## Layer 5 — V-rules per tab

Add User surfaces **5 V-rules** directly + 1 cross-cut (`V-account-ip-allowlist-enforcement` at first-login). Per-tab distribution from `[BRAIN-OUT] flows/Add User.md:72-79, 117, 163` and `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:114-117`:

### Tab 1 — Personal Information

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-user-first-last-name-letters-only`](../../../../Brain%20SK/_obsidian/30-Validation/V-user-first-last-name-letters-only.md) | `PersonalInfo.FirstName` + `PersonalInfo.LastName` | `NotEmpty` + `MaximumLength(50)` + `Matches(LettersOnly)` (Arabic Unicode allowed). Spaces/hyphens open — PRD silent. Error codes: `RequiredFieldMissing` · `MaxLengthExceeded` · `FirstNameLettersOnly` · `LastNameLettersOnly` (all 400) `[BRAIN-OUT] flows/Add User.md:72`. |
| [`V-username-format-uniqueness-immutable`](../../../../Brain%20SK/_obsidian/30-Validation/V-username-format-uniqueness-immutable.md) | `PersonalInfo.UserName` | **HIGH DRIFT** — PRD cap 30, backend FluentValidation cap 100. **FE enforces 30** per `[BRAIN-OUT] flows/Add User.md:76-79`. Async uniqueness via Identity `POST /api/user/exist` (debounced 300 ms `[BRAIN-OUT] flows/Add User.md:82-86`). Immutability not relevant at create — DTO shape just enforces it (no `UserName` on `UpdateUserProfileRequest`). |
| [`V-password-complexity-per-security-level`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-complexity-per-security-level.md) | `PersonalInfo.Password` (preview-only, server-regenerated) | Complexity tier resolved from `account.PasswordSecurityLevel` read via Commerce `GET /Setting`. **No password input** — FE calls `POST /api/user/generate-password` (anonymous endpoint that overrides group policy `[BRAIN-OUT] flows/Add User.md:186`) for display masked + "regenerate" button. The preview may differ from the delivered password if generation is non-deterministic — verify per backend. `[BRAIN-OUT] flows/Add User.md:90-95`. |

### Tab 2 — Role & Permissions

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-normal-user-limit-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-normal-user-limit-enforcement.md) | `Role = normal-user` selection | Identity `UserQuotaPolicy.EnforceOnCreate(...)` blocks with 422 `NormalUserLimitReached` if `account.MaxNormalUserLimit` exceeded. **Quota counts:** Pending + Active + Suspended + Locked (Deleted does NOT) per BR-UM-07. FE pre-flight via `GET /api/user/count?TenantId=<id>&Roles[]=normal-user` for non-blocking counter chip. `[BRAIN-OUT] flows/Add User.md:117-127`. |

### Tab 3 — Notification & Credentials

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-password-complexity-per-security-level`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-complexity-per-security-level.md) | `DeliveryMethod` (channel side-effect) | The server-generated password obeys `PasswordPolicy(level)` per tier. FE does not re-validate at this tab — the password is generated, not typed. The V-rule shows up at first-login when the new user must change their password to one that satisfies the same tier. `[BRAIN-OUT] flows/Add User.md:163`. |

### Cross-cut (first-login)

| V-rule | Surface | Why it fires |
|---|---|---|
| [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md) | First-login IP check | Runs at FastEndpoints pre-processor **before** credentials. Generic reject per BR-UM-24 (no enumeration leak — does not differentiate "wrong IP" from "wrong password"). Configured per-tenant on Commerce settings; propagated to Identity via `commerce.tenant-ip-allowlist-changed.v1` + Redis cache. `[BRAIN-OUT] flows/Add User.md:256`. |
| [`V-login-lockout-3-wrong-attempts`](../../../../Brain%20SK/_obsidian/30-Validation/V-login-lockout-3-wrong-attempts.md) | First-login | 3 wrong passwords OR 3 wrong OTPs / OTP-resend-counts → `User.status = Locked` (423 `UserLocked`). Zitadel manages the underlying lockout; Identity webhook syncs the local Mongo status. `[BRAIN-OUT] flows/Add User.md:257`. |

### Async uniqueness check (debounced 300 ms + cancel-on-input)

`[BRAIN-OUT] flows/Add User.md:82-86`:

| Check | Endpoint | Tab | FE behavior |
|---|---|---|---|
| Username | Identity `POST /api/user/exist` → `ExistResponse { bool Exists }` | Tab 1 | Map `Exists: true` → `usernameTaken` validator error |

### Cross-field validation contract per tab

`[BRAIN-OUT] flows/Add User.md:97-100, 121-127`:

- **Tab 1:** all required fields valid + username uniqueness check passed (debounced, not pending) before advance.
- **Tab 2:** Role change to `normal-user` triggers quota pre-flight; if at cap, disable advance with inline message (authoritative gate remains backend 422).
- **Tab 3:** before Submit, fetch fresh password preview (re-call `generate-password`) if the user revisited Tab 2 changing `Role`.

---

## Layer 6 — E-* entity drift

Add User creates/touches **4 entities** (1 created, 3 read/post-creation). Drift counts and notable items from `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:98-100` and the per-entity vault notes.

| Entity | Created | Drift count | Notable drift |
|---|---|---|---|
| `E-user` | ✅ Tab 3 Finish | 9 | `username` 30↔100 cap drift (HIGH — FE enforces 30 per PRD-02 BR-UM-12). `role` exposed twice (enum `eUserRoles` + `RoleKey` string — **bind to `RoleKey`** per Q-UM-14 `[BRAIN-OUT] flows/Add User.md:328`). `profilePicture` write/read asymmetry. Audit `CreatedBy` extra on backend not in PRD. `AccountOwner.PhoneNumber` + `AccountOwner.EmailAddress` missing `[ThrowIfNotPassed]` despite required (drift visible at Add Client Step 5; same DTO surface here). National ID field present on DTO but **not required by PRD-02** `[BRAIN-OUT] flows/Add User.md:66`. Profile picture format/size silent in PRD (Q-UM-05; FE infers JPG/PNG/WEBP ≤ 2 MB) `[BRAIN-OUT] flows/Add User.md:67, 323`. |
| `E-otp-challenge` | (post-creation first-login) | — | `LoginStepResponse.DevOtpCode?` populated **in dev environments only** — security risk. Confirm `appsettings.json` does NOT enable this in production. `[BRAIN-OUT] flows/Add User.md:166-167`. |
| `E-session` | (post-creation first-login) | — | Created when first-login completes Pending → Active. `[BRAIN-OUT] flows/Add User.md:251`. |
| `E-account` (read-only) | — | (16, but Add User reads 2 fields) | Reads `account.PasswordSecurityLevel` (drives password preview) + `account.MaxNormalUserLimit` (drives quota counter) via Commerce `GET /Setting`. Vocabulary drift on `PasswordSecurityLevel` (Q-UM-12 — PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict`) applies here transitively. |

**Cross-service entity ownership notes:**

- **User entity owned by Identity, NOT Commerce.** `CreateUserRequest` flows directly to Identity for standalone Add User. (For Step 5 of Add Client, the same payload flows Commerce → Kafka `commerce.user-creation-requested.v1` → Identity.) Commerce never persists users. `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:308` referenced by Add-Client.trace.md.
- **PES subject MUST use Zitadel id, NEVER Mongo `_id`** — `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md`. Frontend `CurrentSubjectBuilder` derives subject from `JWT.sub` (= Zitadel id); Identity backend `AccessRoleLinkClient.SyncPrimaryRoleAsync` correctly passes `user.IdentityUserId`.
- **Identity → PES sync is eventual consistency.** After Identity creates the user, it emits `identity.user-events.v1` consumed by PES `UserRoleLinkSyncRequestedConsumer` — the wizard does **not** wait for sync to declare success `[BRAIN-OUT] flows/Add User.md:231-232`.

---

## Layer 7 — Backend DTOs

**Top-level DTO:** `CreateUserRequest` (composite). `[BRAIN-OUT] flows/Add User.md:184, 60-67, 109-114`.

```jsonc
{
  "PersonalInfo": {                          // Tab 1
    "FirstName": "...",                      // [ThrowIfNotPassed] (+ FE: maxLength 50 + letters-only pattern)
    "LastName": "...",                       // [ThrowIfNotPassed]
    "UserName": "...",                       // [ThrowIfNotPassed][MaximumLength(100)] backend; FE caps at 30 (PRD)
    "Email": "...",                          // [ThrowIfNotPassed] (no dedicated V-rule yet — format-only)
    "PhoneNumber": "...",                    // [ThrowIfNotPassed] (no dedicated V-rule yet)
    "NationalId": null,                      // DTO-only — NOT required by PRD-02 (Q-UM-05)
    "ProfilePictureInfo": {                  // optional
      "Extension": "...",
      "FileBase64String": "..."
    }
  },
  "Role": <int>,                              // [ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>] legacy enum
  "RoleKey": "...",                           // canonical string — BIND TO THIS per Q-UM-14
  "PermissionGroupId": "...",                 // [ThrowIfNotPassed] - one per user (BR-UM-42)
  "TenantId": "<tenantId>" | null,            // null for sys-* roles (Falcon-side); required for acc-* roles
  "NodeId": "<nodeId>" | null,                // null for sys-* (auto-routes to root); required for acc-*
  "Path": "<hierarchy-path>" | null,          // east-west hierarchy enrichment for gateways
  "DeliveryMethod": <int>                     // [ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]
}
```

**Notably NOT on `CreateUserRequest`:**
- `Password` — server-generated at create-time per `account.PasswordSecurityLevel`. The Tab 1 preview is a separate `POST /api/user/generate-password` call.
- `Status` — Identity sets to `Pending` server-side per BR-UM-09/10.
- `WelcomeMessage` — PRD-02 silent on the message field; not on wire DTO. If implemented, must round-trip through a separate notification-service call **after** user create succeeds. `[BRAIN-OUT] flows/Add User.md:158`.

**`[ThrowIf*]` attribute taxonomy** (recap from Add-Client.trace.md Layer 7):

| Attribute | Triggers on | Maps to error code |
|---|---|---|
| `[ThrowIfNotPassed]` | null / missing scalar | `RequiredFieldMissing` / `<Field>Required` (400) |
| `[ThrowIfMaxLengthExceed(N)]` | string length > N | `MaxLengthExceeded` / `<Field>TooLong` (400) |
| `[ThrowIfNotEnumValue<TEnum>]` | value outside enum set | `InvalidValue` (422) |

**`[ThrowIf*]` runs BEFORE handler logic** (FastEndpoints pre-processor chain). Empty/malformed values never reach the handler. Handler-level checks (role-edit matrix, quota enforcement, Zitadel adapter, role-to-tenant compat) run after.

**Casing note.** Identity uses **camelCase** on the wire `[BRAIN-OUT] flows/Add User.md:193-194` (verify against `ServiceOperationResult<T>` shape in `[BRAIN-OUT] FRONTEND_CONTRACT.md`). This contrasts with Commerce's PascalCase — relevant when Add User is launched as Step 5 of Add Client (Commerce composite wraps the payload in PascalCase and emits via Kafka).

---

## Layer 8 — Backend endpoint + handler

**The endpoint.** `[BRAIN-OUT] flows/Add User.md:181-186` + `[BRAIN-OUT] Add-User.integration.md:54-62`:

| Attribute | Value |
|---|---|
| Method | POST |
| Path (internal) | `/api/user/` (route shape — registry observation: no explicit FastEndpoints binding seen; verify via OpenAPI doc at `https://localhost:7777/openapi/v1.json`) `[BRAIN-OUT] flows/Add User.md:191-192` |
| Path (via gateway) | `<system-gateway>/identity/users` (sys-* path) **OR** `<core-gateway>/identity/users` (acc-* path) — gateway strips `/identity`, prepends `/api/` |
| Service | Identity (`falcon-core-identity-svc`) — `CreateUserEndpoint` |
| Auth | Class-level `[Authorize]` — anonymous rejected. **`generate-password` endpoint is anonymous** (overrides group policy per Identity ENDPOINT_REGISTRY) `[BRAIN-OUT] flows/Add User.md:186`. |
| Request | `CreateUserRequest` |
| Response | `ServiceOperationResult<CreateUserResponse>` (carries new User `Id`, `Status: Pending`) |

**The gateway — actor-dispatched.** `[BRAIN-OUT] flows/Add User.md:193-195`:

- Falcon admins (sys-* roles) route through **System Gateway** (`:7256` dev). Auth header: `Authorization: Bearer <zitadel-jwt>` (Falcon admin's token).
- Client admins (acc-owner, acc-admin) route through **Core Gateway** (`:7038` dev). Same auth header (Client admin's token).
- Both gateways land on the same Identity `/api/user/` endpoint; Identity discriminates server-side from the JWT `userType` claim.

**Sister endpoints (Tab 1 / Tab 2 preflights).** `[BRAIN-OUT] flows/Add User.md:184-189`:

| Method | Path | Service | Auth | Purpose |
|---|---|---|---|---|
| POST | `/api/user/exist` | Identity (`UserExistEndpoint`) | Class-level auth | Tab 1 async uniqueness — `UserExistRequest { Username }` → `ExistResponse { Exists: bool }`. 400 `InvalidUserExistQuery` on empty username. |
| POST | `/api/user/generate-password` | Identity | **Anonymous** | Tab 1 password preview — `GeneratePasswordRequest { PasswordSecurityLevel }` → `GeneratePasswordResponse { Password }`. |
| GET | `/api/user/count?TenantId=...&Roles[]=normal-user` | Identity (`GetUserCountEndpoint`) | Class-level auth | Tab 2 quota counter — `GetUserCountRequest { TenantId, Roles[]? }` → `long`. 400 `TenantIdRequired` on missing tenant. |
| POST | `/pes/authorize/resources` | Access PES | Class-level auth | Tab 2 grantable-roles query — populates Role dropdown server-side. |
| GET | `/commerce/Setting` | Commerce | Class-level auth | Tab 1 + Tab 2 read — carries `PasswordSecurityLevel`, `MaxNormalUserLimit`. |

**Handler flow.** Identity `CreateUserEndpoint` handler (high-level, source: `[BRAIN-OUT] flows/Add User.md:200-237` + `[BRAIN-OUT] Add-User.integration.md:51`):

1. `[ThrowIf*]` pre-processor chain (rejects 400 / 422 on null / over-length / out-of-enum).
2. Role-edit matrix check against caller's JWT claims → 422 `InvalidRoleForUserType` if actor cannot grant requested role; 422 `FalconUserMustNotHaveTenantId` if sys-* request carries `TenantId`.
3. Username uniqueness check (Mongo) → 409 `DuplicateUsername` on collision.
4. `UserQuotaPolicy.EnforceOnCreate(...)` when `Role = normal-user` → 422 `NormalUserLimitReached` on cap breach.
5. Generate initial password per `account.PasswordSecurityLevel` (`PasswordPolicy(level)`).
6. Provision underlying Zitadel auth principal → 500 `CreateIdentityUserFailed` / `ZitadelCreateProjectFailed` / `ZitadelSearchUserFailed` on Zitadel-adapter failure (rollback partial state).
7. Persist User entity in Mongo with `Status: Pending` per BR-UM-09.
8. Dispatch credentials via `DeliveryMethod` (Email / SMS / Both) — synchronous side-effect inside handler (or fires a notification-service Kafka message — verify per implementation).
9. Emit Kafka `identity.user-events.v1` (Layer 10).
10. Return `ServiceOperationResult<CreateUserResponse>` carrying new User `Id`, `Status: Pending`.

---

## Layer 9 — FluentValidator + handler-time gate

**Two-tier server-side validation:**

### Tier 1 — `[ThrowIf*]` (pre-processor, before handler)

Catches null / empty / over-length / out-of-enum. Surfaces 400/422 codes per Layer 7 attribute table. Empty submissions never reach the handler.

**Critical FluentValidator drift.** `CreateUserRequestValidator` enforces `MaximumLength(100)` on `UserName` — **but PRD-02 BR-UM-12 caps at 30**. The FE is the only thing keeping the system PRD-conformant. Backlog item: tighten validator to `MaximumLength(30)` `[BRAIN-OUT] flows/Add User.md:299`.

### Tier 2 — Handler-level cross-field + uniqueness + business

Runs after pre-processor passes. Specifically responsible for `[BRAIN-OUT] flows/Add User.md:72-79, 117-127, 200-237`:

- **Username uniqueness** — checked against Mongo + Zitadel on commit. Surfaces 409 `DuplicateUsername`. Can race the FE Tab 1 async pre-check (small window between debounce-success and submit).
- **Role-edit matrix enforcement** — handler validates `Role` (target) against the actor's role (current) per `BuiltInRoleCatalog.cs:18-75` matrix. Surfaces 422 `InvalidRoleForUserType` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:209`.
- **Falcon-vs-Client compatibility** — handler enforces "sys-* users must NOT carry TenantId" → 422 `FalconUserMustNotHaveTenantId` `[BRAIN-OUT] flows/Add User.md:184`.
- **Normal User quota** — `UserQuotaPolicy.EnforceOnCreate(...)` runs when `Role = normal-user` → 422 `NormalUserLimitReached`. Counts Pending + Active + Suspended + Locked; Deleted excluded per BR-UM-07.
- **Zitadel adapter** — partial-state rollback on failure → 500 `CreateIdentityUserFailed` and Zitadel-specific (`ZitadelCreateProjectFailed` · `ZitadelSearchUserFailed` · other `Zitadel*Failed`) `[BRAIN-OUT] flows/Add User.md:236-237`.

**Critical FE rule** — use HTTP status code as the **primary routing signal**. Display localized `errorMessages[0]` directly. **Do NOT parse error codes for copy** `[BRAIN-OUT] flows/Add User.md:184`. Use codes for logging / instrumentation only.

---

## Layer 10 — Kafka events

On `IsSuccessful: true`, Identity `CreateUserEndpoint` handler produces **1 Kafka event** `[BRAIN-OUT] flows/Add User.md:230-237` + `[BRAIN-OUT] Add-User.integration.md:51`:

| Topic | Producer | Consumer | Side-effect |
|---|---|---|---|
| `identity.user-events.v1` | Identity post-create | PES `UserRoleLinkSyncRequestedConsumer` | Refreshes the user/role binding without a synchronous PES write — eventual consistency, **wizard does NOT wait** for sync to declare success |

**Sequence diagram** (composed from `[BRAIN-OUT] flows/Add User.md:171-237`):

```
Actor (sys-* OR acc-* role per Layer 3)
    │
    ▼
[Add User wizard — Tab 3 Finish] ──► [Gateway: System or Core per actor]
                                              │
                                              ▼
                              [Identity: POST /api/user/] ─────┐
                                              │                │ runs synchronously:
                                              │                │  - [ThrowIf*] pre-processor chain
                                              │                │  - Role-edit matrix check
                                              │                │  - Username uniqueness check (Mongo)
                                              │                │  - UserQuotaPolicy (if Normal User)
                                              │                │  - Generate initial password (per tier)
                                              │                │  - Provision Zitadel auth principal
                                              │                │  - Persist User (Status: Pending)
                                              │                │  - Dispatch credentials via DeliveryMethod
                                              │                │
                                              ▼                ▼
                          returns ServiceOperationResult<CreateUserResponse>
                                              │                │ {Id, Status: Pending}
                                              │
                                              │    ┌──── Kafka: identity.user-events.v1 ───► [PES Service]
                                              │    │                                              │
                                              │    │                                              ▼
                                              │    │                                  UserRoleLinkSyncRequestedConsumer
                                              │    │                                  → refreshes role/policy linkage
                                              ▼
[Wizard: success toast · close · Users list refresh]
                                              │
                                              │ (asynchronously — separate flow)
                                              ▼
[New user clicks credential link from Email/SMS]
    │
    ▼
[First Login Flow] — see separate playbook
    │
    ▼ IP allowlist → Credentials → OTP → Force-change-password
    │
    ▼
[Status: Pending → Active]
```

**Partial-failure case.** If Zitadel hop fails after the User record is partially persisted, response is HTTP 500 with `errorMessages[0]` = (localized) and code `CreateIdentityUserFailed`. The handler rolls back partial state. FE must show "User creation failed — contact support" and preserve wizard state for retry `[BRAIN-OUT] flows/Add User.md:236-237`.

**Cross-flow reuse — Add Client Step 5 is the async-Kafka twin.** When Step 5 of Add Client runs, Commerce emits `commerce.user-creation-requested.v1` consumed by Identity (same `UserCreationRequestedConsumer` flow producing the same User entity in `Pending`). The DTO shape is identical; only the transport differs. Validation errors surface differently (Commerce returns 200 then Identity-async failure propagates as 500 `CreateIdentityUserFailed`). `[BRAIN-OUT] flows/Add User.md:269` + `[BRAIN-OUT] Add-Client.trace.md` Layer 10.

---

## Layer 11 — Error codes

Add User surfaces **~25 error codes** across **5 HTTP status classes**. Catalog: `[BRAIN-OUT] 13-error-catalog/CATALOG.md:45-47, 64, 86, 172, 209`. Per-flow placement: `[BRAIN-OUT] flows/Add User.md:184`.

### 400 — validation / required-field / format (~13 codes)

`RequiredFieldMissing` · `MaxLengthExceeded` · `UsernameMustStartWithLetter` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:47` · `FirstNameLettersOnly` `[BRAIN-OUT] CATALOG.md:45` · `LastNameLettersOnly` `[BRAIN-OUT] CATALOG.md:46` · `InvalidValue` · `InvalidPhoneNumber` `[BRAIN-OUT] CATALOG.md:86` · `ProfilePictureSizeExceeded` `[BRAIN-OUT] CATALOG.md:64` · `ImageExtensionNotAllowed` · `ExecutableFileNotAllowed` · `InvalidImageFile` · `InvalidUserExistQuery` · `TenantIdRequired`

**UX:** inline error on the missing field. Wizard stepper highlights affected tab in error state. Scroll to first error.

### 401 — re-auth (2 codes)

`Unauthorized` · `InvalidCredentials` — triggers re-auth flow. Rare at Add User submit (caller is already logged in).

### 403 — auth / IP allowlist (3 codes)

`Forbidden` · `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction`

**UX:** "You don't have permission to add this user" toast + close wizard.

### 409 — uniqueness collisions (1 code)

`DuplicateUsername` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:172`

**UX:** Inline error on the Username field (Tab 1). Stepper highlights Tab 1.

### 422 — semantic / cross-field (3 codes)

`NormalUserLimitReached` · `InvalidRoleForUserType` `[BRAIN-OUT] CATALOG.md:209` · `FalconUserMustNotHaveTenantId`

**UX:** Route back to Tab 2 with Role field flagged. For `NormalUserLimitReached`, route to Tab 2 with the Role dropdown flagged and a counter chip showing `<count> / <cap>`.

### 500 — downstream Identity / Zitadel failure (5+ codes)

`CreateIdentityUserFailed` · `ZitadelCreateProjectFailed` · `ZitadelSearchUserFailed` · other `Zitadel*Failed` · `ExternalServiceError` · `ExternalServiceConnectionError` · `ExternalServiceTimeout`

**UX:** Toast "User creation failed — contact support". **Preserve wizard state** so the operator can retry. The wizard does NOT close automatically. `[BRAIN-OUT] flows/Add User.md:236-237`.

### FE error-handling contract

`[BRAIN-OUT] 13-error-catalog/FE-CONTRACT.md` (referenced from Add-Client.trace.md Layer 11):

1. Use HTTP status code as the **primary routing signal** (which UI to show).
2. Use `errorMessages[0]` for **display copy** (already localized by backend).
3. Error codes are for **logging / instrumentation only** — never branch UI copy on them.

### Open UX gap (GAP-UM-36)

No FE re-dispatch surface for failed credential delivery (Email bounced / SMS quota exceeded). Workaround: soft-delete + re-create — but `DuplicateUsername` blocks re-create with the same username. **Recommend a "Resend credentials" action on the More-Details page as a follow-up.** `[BRAIN-OUT] flows/Add User.md:263, 330`.

---

## Layer 12 — FE route + PES gate

**Route + Angular guard.**

| Aspect | Value | Source |
|---|---|---|
| App (Falcon-side) | `apps/admin-console` (System Gateway-backed) | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:53` |
| App (Client-side) | `apps/management-console` (Core Gateway-backed) | `[BRAIN-OUT] 05-capability-maps/acc-owner.capability.md:111` |
| Page route | `/organization-hierarchy` (entry point) → wizard route (`/profile?mode=add-wizard` per sys-admin capability map) | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:53` |
| `data.access` (route guard, page-level) | admin-console: `FalconAccess.adminConsole.enter()` · management-console: `FalconAccess.managementConsole.enter()` | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:35, 63` |
| Action gate — Falcon admin (sys-*) | `FalconAccess.adminConsole.user.add()` (Wave 1.3.0 PES key — `sys.user / add`) | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:53` |
| Action gate — Client AO root-node | `FalconAccess.managementConsole.accountUser.add()` (`acc.account-user / add`) — only acc-owner | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:69` |
| Action gate — Client AO/NA sub-node | `FalconAccess.managementConsole.orgUser.add()` (`acc.org-user / add`) — acc-owner + acc-admin | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:70` |

**Tree-level Add User logic** (management-console only):

```
canAddUserForNode(nodeId) = isRootSelection ? canAddAccountUser : canAddOrgUser
```

For acc-admin: root-node selection returns false (no `acc.account-user / add` rule); sub-node selection returns true. UI hides "Add User" entry on root node for acc-admin. `[BRAIN-OUT] 05-capability-maps/acc-admin.capability.md:110`.

**Two PES checks gate the action** (matches Add Client's three-layer model):

1. **Route guard** — `FalconAccess.adminConsole.enter()` OR `FalconAccess.managementConsole.enter()` resolves the relevant `app.*` view. Fails for cross-namespace access (sys-* cannot enter management-console, acc-* cannot enter admin-console).
2. **Action gate** — namespace-specific factory call. Passes only for the appropriate combination of role + console + scope.

**Source of truth:** `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (47 factory methods, 7 top-level namespaces) `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:5`.

**Gateway behavior.** Like Add Client, the FE never hits the route directly — it goes through the relevant gateway which validates the JWT, forwards `tenantId` + `nodeId` + `path` claims, and either passes the request through to Identity or returns 403 if PES denies.

---

## Layer 13 — FE components

**Wizard shell + 3 tabs.** Falcon UI Core components used per tab (no PrimeNG; no SCSS; Tailwind utilities only per `[MEMORY] feedback_falcon_custom_library_mandatory.md`). `[BRAIN-OUT] flows/Add User.md:60-67, 109-114, 156-159`.

### Wizard shell (all tabs)

| Component | Role |
|---|---|
| `<falcon-wizard>` or `<falcon-tabs>` (per Falcon Wizard / Falcon Tabs lib docs) | 3-tab stepper; per-tab error state. PRD-02 calls this "3 tabs"; implementation uses wizard stepper with each tab gated by previous-tab validation `[BRAIN-OUT] flows/Add User.md:21` |
| `<falcon-button>` | Next / Previous / Finish / Cancel |
| `<falcon-notification>` / `<falcon-toast>` | Error toasts (403, 422 quota, 500 Zitadel failure) |

### Tab 1 — Personal Information

| Component | Field |
|---|---|
| `<falcon-input>` | First Name · Last Name · Username · National ID (optional) |
| `<falcon-email-field>` | Email |
| `<falcon-phone-field>` | Phone Number |
| `<falcon-uploader>` (generic) or `<falcon-angular-photo-uploader>` skeleton | Profile Picture (optional) — per `[MEMORY] feedback_library_skeleton_app_api.md` use skeleton + app-level wrapper |
| `<falcon-password>` (read-only) | Password preview — server-generated via `POST /user/generate-password`; "regenerate" button re-calls |

### Tab 2 — Role & Permissions

| Component | Field |
|---|---|
| `<falcon-dropdown>` (single-select) | Role — options populated from PES `authorize/resources` response (NOT static client-side enum) `[BRAIN-OUT] flows/Add User.md:131-134` |
| `<falcon-dropdown>` (single-select) | Permission Group — filtered by Role (one per user per BR-UM-42); reset on Role change `[BRAIN-OUT] flows/Add User.md:139-141` |
| `<falcon-tree>` / `<falcon-tree-panel>` (as node-picker) | Node assignment — auto-collapsed to chip + "Change" link when entry-point pre-selected; `falcon-full` mode for Falcon admins, `client` mode for Client admins (auto-scoped) `[BRAIN-OUT] flows/Add User.md:144-148` |
| `<falcon-status-badge>` (read-only chip) | Status — display-only `Pending` per BR-UM-10 |
| `<falcon-tag>` or counter chip | Quota counter — `"12 / 50 Normal Users"` when Role = Normal User `[BRAIN-OUT] flows/Add User.md:122-126` |

### Tab 3 — Notification & Credentials

| Component | Field |
|---|---|
| `<falcon-dropdown>` (single-select) or `<falcon-radio-group>` | Delivery Method (Email / SMS / Both) |
| `<falcon-textarea>` (optional, deferred) | Welcome message — NOT on wire DTO; round-trip via separate notification-service call after user create succeeds `[BRAIN-OUT] flows/Add User.md:158` |
| Reused `<send-credentials-popup>` (existing app-level wrapper) | Confirmation summary — masked password, email + phone destinations, channels list `[BRAIN-OUT] flows/Add User.md:159` |

### Customization order rule (standing)

Per `[MEMORY] feedback_falcon_custom_library_mandatory.md`:

```
inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP
```

Add User must be implemented as an **app-level wrapper** under `apps/admin-console/.../organization-hierarchy-page/components/wizard-components/add-user-wizard/` (admin-console, already exists per `[CODE]`) and the mgmt-console mirror at `apps/management-console/.../org-hierarchy-page/components/wizard-components/add-user-wizard/` (verify-and-create-if-missing). Backend service calls live in the wrapper, never in the library skeleton (per `[MEMORY] feedback_library_skeleton_app_api.md`).

**Existing admin-console structure** `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/`:

```
add-user-wizard/
├── add-user-wizard.component.{ts,html}
├── index.ts
├── models/
├── services/user.service.ts
├── user-permissions-step/
├── user-personal-step/
│   ├── index.ts
│   ├── user-personal-step.component.{ts,html}
│   └── validations/
└── user-role-status-step/
```

This matches the canonical pattern in `[BRAIN-OUT] strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §7.

---

## Layer 14 — FE form + state

**Form choice per tab.** Reactive Forms (`FormGroup`) for every tab — every tab carries either cross-field rules (Tab 1 username uniqueness + password preview side-effect; Tab 2 Role → Permission Group cascade; Tab 3 Delivery confirmation) or async validators.

| Tab | Form pattern | Why |
|---|---|---|
| 1 | Reactive `FormGroup` | Async username uniqueness validator (`POST /user/exist`) + password preview side-effect on PasswordSecurityLevel resolution |
| 2 | Reactive `FormGroup` | Cross-field cascade: `role.valueChanges.subscribe(r => permissionGroup.reset(); fetchPermissionGroupsFor(r); if (r === normalUser) preflightQuota())` |
| 3 | Reactive `FormGroup` | Delivery method coupling with Tab 1 Email + Phone destinations |

**Wizard state machine (FE-side).** Each tab's form is buffered locally; submission only fires on Tab 3 Finish. State container can be:

- An Angular service (e.g. `AddUserWizardStateService`) holding 3 `FormGroup` instances + a navigation pointer
- A signal-based store (`signal<TabState | null>` × 3 + `currentTab: signal<1..3>`)

**Tab transitions** `[BRAIN-OUT] flows/Add User.md:97-100`:

```
[open wizard]
   │
   ▼ (parallel on open:
   │     1. GET /commerce/Setting  → PasswordSecurityLevel + MaxNormalUserLimit
   │     2. POST /pes/authorize/resources → grantable roles
   │     3. POST /user/generate-password → initial password preview)
   │
Tab 1 ─Next─► Tab 2 ─Next─► Tab 3 ─Finish─► [composite POST]
   ▲             ▲             ▲                      │
   └─Previous────┴─Previous────┘                      ▼
                                              [success toast + nav + list refresh]
```

**Critical wiring patterns** (composed from `[BRAIN-OUT] flows/Add User.md:97-100, 122-127, 139-141`):

```typescript
// Tab 1 — Async username uniqueness validator
username.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(name => name?.length >= 1 ? userService.exists({ Username: name }) : of(null))
).subscribe(result => {
  if (result?.Exists) {
    username.setErrors({ usernameTaken: true });
  } else {
    if (username.hasError('usernameTaken')) {
      const errs = { ...username.errors };
      delete errs['usernameTaken'];
      username.setErrors(Object.keys(errs).length ? errs : null);
    }
  }
});

// Tab 2 — Role change → Permission Group reset + quota preflight
role.valueChanges.subscribe(r => {
  permissionGroup.reset();
  fetchPermissionGroupsFor(r);
  if (r === 'normal-user') {
    userService.count({ TenantId, Roles: ['normal-user'] }).subscribe(count => {
      this.quotaCount = count;
      this.quotaCap = account.MaxNormalUserLimit;
      if (count >= account.MaxNormalUserLimit) {
        role.setErrors({ quotaExceeded: true });
        this.disableNext = true;
      }
    });
  } else {
    this.disableNext = false;
  }
});
```

**Pre-load on wizard open** (parallel fetches): `GET /commerce/Setting` · `POST /pes/authorize/resources` · `POST /user/generate-password`. `[BRAIN-OUT] flows/Add User.md:91-95, 131-134`.

---

## Layer 15 — FE i18n keys

`[INFERRED]` — The Add User playbook does NOT enumerate concrete i18n keys (playbook silent on this layer). Below is the **recommended** key namespace, inferred from `apps/admin-console/.../organization-hierarchy-page` conventions and the standing rule that Falcon supports En + Ar via `MultiLanguage(En, Ar)` per platform standards.

**Recommended key prefix:** `admin-console.organization-hierarchy.add-user.*` (and parallel `management-console.organization-hierarchy.add-user.*` for the mgmt-side mirror).

| Key | En | Ar |
|---|---|---|
| `add-user.title` | Add User | إضافة مستخدم |
| `add-user.tabs.1.title` | Personal Information | المعلومات الشخصية |
| `add-user.tabs.2.title` | Role & Permissions | الدور والصلاحيات |
| `add-user.tabs.3.title` | Notification & Credentials | الإشعار وبيانات الاعتماد |
| `add-user.tab1.first-name.label` | First Name | الاسم الأول |
| `add-user.tab1.last-name.label` | Last Name | اسم العائلة |
| `add-user.tab1.username.label` | Username | اسم المستخدم |
| `add-user.tab1.username.placeholder` | Enter a unique username | أدخل اسم مستخدم فريد |
| `add-user.tab1.username.error.taken` | This username is already in use | اسم المستخدم هذا مستخدم بالفعل |
| `add-user.tab1.username.error.must-start-with-letter` | Username must start with a letter | يجب أن يبدأ اسم المستخدم بحرف |
| `add-user.tab1.email.label` | Email | البريد الإلكتروني |
| `add-user.tab1.phone.label` | Phone Number | رقم الهاتف |
| `add-user.tab1.profile-picture.label` | Profile Picture (optional) | صورة الملف الشخصي (اختياري) |
| `add-user.tab1.password-preview.label` | Generated Password | كلمة المرور المُنشأة |
| `add-user.tab1.password-preview.regenerate` | Regenerate | إعادة الإنشاء |
| `add-user.tab2.role.label` | Role | الدور |
| `add-user.tab2.permission-group.label` | Permission Group | مجموعة الصلاحيات |
| `add-user.tab2.node-assignment.label` | Node Assignment | تعيين العقدة |
| `add-user.tab2.quota.label` | Normal Users | المستخدمون العاديون |
| `add-user.tab2.quota.exceeded` | Normal User limit reached | تم الوصول للحد الأقصى للمستخدمين العاديين |
| `add-user.tab3.delivery-method.label` | Delivery Method | طريقة التسليم |
| `add-user.tab3.delivery-method.email` | Email | البريد الإلكتروني |
| `add-user.tab3.delivery-method.sms` | SMS | الرسائل النصية |
| `add-user.tab3.delivery-method.both` | Both | كلاهما |
| `add-user.actions.next` | Next | التالي |
| `add-user.actions.previous` | Previous | السابق |
| `add-user.actions.finish` | Finish | إنهاء |
| `add-user.actions.cancel` | Cancel | إلغاء |
| `add-user.toast.success` | User created. Credentials sent via {{deliveryMethod}}. | تم إنشاء المستخدم. تم إرسال بيانات الاعتماد عبر {{deliveryMethod}}. |
| `add-user.toast.failure` | User creation failed — contact support | فشل إنشاء المستخدم — تواصل مع الدعم |
| `add-user.toast.no-permission` | You don't have permission to add users at this node | ليس لديك صلاحية لإضافة مستخدمين في هذه العقدة |

**Localization contract.** Error messages from `ServiceOperationResult<T>.errorMessages[0]` are **already localized server-side** — do NOT re-translate. The FE displays them as-is `[BRAIN-OUT] flows/Add User.md:184` (per the FE error-handling contract referenced from Add-Client.trace.md Layer 15).

`(no source — needs investigation)` — concrete i18n key names should be confirmed against the existing `apps/admin-console/src/assets/i18n/{en,ar}.json` files when this trace is acted on. The playbook is silent on the exact namespace convention.

---

## Layer 16 — Test case (Gherkin)

Six scenarios cover happy path + the five most important failure modes. Assertions trace back to BR-UM-* (Layer 4), V-rules (Layer 5), and error codes (Layer 11).

```gherkin
Feature: Add User wizard (3-tab)
  As a Falcon System Administrator (or Client Account Owner / Node Admin)
  I want to onboard a new user in one composite operation
  So that the new user has identity, role, permission group, node binding, and credential dispatch in one transaction

  Background:
    Given the Identity service is reachable at /api/user/
    And the Access PES service is reachable at /pes/authorize/resources
    And the Commerce service is reachable at /Setting
    And the account "AcmeCorp" has PasswordSecurityLevel=High and MaxNormalUserLimit=50

  Scenario: Happy path — sys-admin creates a Falcon-side operation user
    Given I am logged in to admin-console as "sysadmin" (sys-admin role)
    And I am on the Organization Hierarchy page
    And I select the Falcon Clients root node
    When I click "Add User"
    Then the Add User wizard opens at Tab 1 (Personal Information)
    And the wizard pre-fetches in parallel:
      | GET /commerce/Setting                           |
      | POST /pes/authorize/resources (grant-role)      |
      | POST /api/user/generate-password (PasswordSecurityLevel=High) |
    And the Role dropdown options come from PES response (not static enum)
    When I fill Tab 1 with:
      | First Name      | Sara               |
      | Last Name       | Ali                |
      | Username        | sara.ali           |
      | Email           | sara@falconhub.sa  |
      | Phone Number    | +966500000001      |
      | Profile Picture | (skip)             |
    Then after 300 ms the FE calls POST /api/user/exist with { Username: "sara.ali" }
    And the response is { Exists: false }
    And the Username field passes
    When I click Next
    Then the wizard advances to Tab 2 (Role & Permissions)
    When I select Role = "sys-ops"
    And I select Permission Group = "ops-default" (filtered to sys-ops role)
    And the Node Assignment is auto-set to root (hidden for sys-* roles)
    And I click Next
    And I select Delivery Method = "Both" on Tab 3
    And I click Finish
    Then the FE composes CreateUserRequest from buffered Tabs 1-3
    And POSTs to <system-gateway>/identity/users with Bearer JWT
    And receives HTTP 200 with ServiceOperationResult { IsSuccessful: true, Result: { Id: <new-user-id>, Status: "Pending" } }
    And Identity persists synchronously: User entity in Mongo (Status: Pending) + Zitadel auth principal
    And Identity dispatches credentials via Email + SMS to sara@falconhub.sa and +966500000001
    And Identity emits 1 Kafka event:
      | Topic                       | Effect                                                    |
      | identity.user-events.v1     | PES UserRoleLinkSyncRequestedConsumer refreshes binding   |
    And the wizard shows a success toast "User created. Credentials sent via Both."
    And navigates back to Org Hierarchy with the Users list refreshed
    And the new user "sara.ali" is in "Pending" status (per BR-UM-09)

  Scenario: Username uniqueness conflict — backend returns 409 DuplicateUsername
    Given a user with username "sara.ali" already exists
    And I open the Add User wizard
    When I type "sara.ali" into the Username field
    Then after 300 ms the FE calls POST /api/user/exist
    And the response is { Exists: true }
    And the field shows the inline error "This username is already in use"
    And the Next button is disabled
    # Defense in depth: even if the async check is bypassed
    When I (somehow) bypass the FE check and submit via Tab 3
    Then the backend returns HTTP 409 with errorMessages[0] = "Username already in use"
    And the FE displays the localized errorMessages[0] inline on the Username field
    And the Wizard stepper highlights Tab 1 in error state
    And the wizard scrolls to the first error

  Scenario: Normal User quota exceeded — backend returns 422 NormalUserLimitReached
    Given the account "AcmeCorp" already has 50 Normal Users (at MaxNormalUserLimit=50)
    And I am logged in to management-console as "ao@acmecorp" (acc-owner role)
    And I open the Add User wizard
    And I fill Tab 1 with valid values
    When I select Role = "normal-user" on Tab 2
    Then the FE fires GET /api/user/count?TenantId=acme&Roles[]=normal-user (non-blocking)
    And the response is "50"
    And the quota counter chip shows "50 / 50 Normal Users"
    And the Role field shows an inline warning "Normal User limit reached"
    And the Next button is disabled
    # Defense in depth: backend re-checks at submit
    When I (somehow) bypass the FE check and submit via Tab 3
    Then the backend returns HTTP 422 with errorMessages[0] = "Normal user limit reached"
    And the error code is NormalUserLimitReached
    And the FE routes back to Tab 2 with the Role field flagged
    And the wizard does NOT close

  Scenario: Cross-namespace role violation — sys-* user with TenantId returns 422
    Given I am logged in to admin-console as "sysadmin" (sys-admin role)
    And I open the Add User wizard
    And I fill Tab 1 with valid values
    When I select Role = "sys-products" on Tab 2
    And (erroneously) the request carries TenantId = "acme-corp"
    Then on Finish, the backend returns HTTP 422 with errorMessages[0] = (localized "Falcon users must not have a tenant")
    And the error code is FalconUserMustNotHaveTenantId
    And the FE routes back to Tab 2 with the Role field flagged
    # Correct behavior: FE should NOT send TenantId when Role starts with "sys-"
    And the FE should clear TenantId from the payload when the selected Role is in {sys-admin, sys-ops, sys-products}

  Scenario: Second Account Owner attempt — BR-UM-03 enforcement returns 422
    Given the account "AcmeCorp" already has one Account Owner "ao@acmecorp" (acc-owner role)
    And I am logged in as that AO ("ao@acmecorp")
    And I open the Add User wizard
    When I (somehow — Role dropdown should not show acc-owner) select Role = "account-owner" on Tab 2
    And I submit via Tab 3
    Then the backend returns HTTP 422 with errorMessages[0] = (localized "One Account Owner per account")
    And the error code is InvalidRoleForUserType
    And the FE routes back to Tab 2 with the Role field flagged
    # Expected UX: Tab 2 Role dropdown should NOT include "account-owner" when the tenant already has one.

  Scenario: Partial failure — Zitadel hop fails after user persistence start
    Given I complete Tabs 1-3 successfully and click Finish
    But Identity's Zitadel adapter fails when calling Zitadel (network timeout)
    Then Identity rolls back the partial state
    And the response is HTTP 500 with errorMessages[0] = (localized "External service unavailable")
    And the error code is CreateIdentityUserFailed or ZitadelCreateProjectFailed or ExternalServiceTimeout
    And the FE displays the toast: "User creation failed — contact support"
    And the FE preserves the wizard state (Tabs 1-3 inputs retained in memory)
    And the FE does NOT close the wizard automatically (operator can retry Finish)
    # Recovery: re-trigger from Tab 3 Finish; no half-persisted state should remain.
```

---

## Layer 17 — Port artifact

**admin-console source path** — already exists `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/`:

```
apps/admin-console/
└── src/app/features/org-hierarchy-page/
    └── components/wizard-components/
        └── add-user-wizard/
            ├── add-user-wizard.component.{ts,html}    ← top-level wizard shell
            ├── index.ts                                ← barrel export
            ├── models/                                 ← types + DTOs
            ├── services/user.service.ts                ← composite POST + Tab 1 async uniqueness + Tab 1 password preview + Tab 2 quota preflight + Tab 2 PES grantable-roles fetch
            ├── user-personal-step/                     ← Tab 1
            │   ├── index.ts
            │   ├── user-personal-step.component.{ts,html}
            │   └── validations/                        ← per-tab cross-field validators
            ├── user-role-status-step/                  ← Tab 2 (NB: legacy folder name "role-status" matches PRD-02 §W1; functionally "Role & Permissions" per playbook)
            └── user-permissions-step/                  ← Tab 3
```

Reference for the canonical folder + validation doctrine: `[BRAIN-OUT] strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §7 (per `[MEMORY] project_falcon_component_validation_convention.md`). Add User in admin-console already follows this pattern.

**Does Add User port to management-console?**

**YES — and the rationale is load-bearing (in contrast to Add Client which is admin-only).** Per Layer 3, 5 of 6 roles can run Add User; specifically `acc-owner` and `acc-admin` are Client-side roles that operate inside the management-console (`:4301`). The management-console app entry gate (`app.management-console / view`) admits all 3 acc-* roles, so the wizard must exist on the Client-facing app.

**Critical port differences:**

- **Console entry gate** — admin-console uses `FalconAccess.adminConsole.user.add()` (sys-* roles); management-console uses `FalconAccess.managementConsole.accountUser.add()` for root-node and `FalconAccess.managementConsole.orgUser.add()` for sub-node.
- **Node-picker mode** — Falcon admins get `falcon-full` (full tree); Client admins get `client` (auto-scoped to own subtree).
- **Role dropdown set** — Falcon admins can grant any role (sys-* or acc-*); Client admins can grant only `acc-*` (within actor's grantable subset per role-edit matrix).
- **Gateway** — admin-console routes through System Gateway (`:7256`); management-console routes through Core Gateway (`:7038`). Both land on the same Identity endpoint.
- **Acc-admin root vs sub** — on management-console, acc-admin hides the "Add User" entry on the root node (no `acc.account-user / add` rule) but shows it on sub-nodes (has `acc.org-user / add`).

**Verify-and-create-if-missing** the mgmt-side wrapper at `apps/management-console/src/app/.../org-hierarchy-page/.../add-user-wizard/` mirroring the admin-console structure but binding to the Core-Gateway-backed service and the mgmt-side PES factories. The library skeletons (`<falcon-wizard>`, `<falcon-input>`, etc.) are shared — only the app-level wrapper differs.

**Verdict.** Add User is the **only flow in the Org Hierarchy family that ports both ways** (Add Client is admin-only; Add Node + Edit Node are admin + mgmt). The cross-flow integration playbook lives at `[BRAIN-OUT] 14-flow-playbook-integration/Add-User.integration.md`.

---

## Layer 18 — Capability map verdict per role

The final answer: of the 6 PES-defined roles, **5 PASS** the Add User gate. `[BRAIN-OUT] 14-flow-playbook-integration/Add-User.integration.md:23-29`.

| Role | App entry | PES key checked | Verdict | Target roles grantable | Reason |
|---|---|---|---|---|---|
| `sys-admin` (System Administrator) | admin-console ✅ | `sys.user / add` (Wave 1.3.0 — `[INFERRED]` from seed silence; FE wires `FalconAccess.adminConsole.user.add()`) | **✅ PASS** | ANY (sys-* + acc-*) | Top Falcon staff role; widest grantability `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:53` |
| `sys-ops` (Operation) | admin-console ✅ | `sys.user / add` (Wave 1.3.0) | **✅ PASS (limited)** | `sys-ops` (self) + any `acc-*` | Cannot grant `sys-admin` or `sys-products` per role-edit matrix `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md:53` |
| `sys-products` (Products) | admin-console ✅ | `sys.user / add` (Wave 1.3.0) | **✅ PASS (limited)** | `sys-products` (self) + any `acc-*` | Cannot grant `sys-admin` or `sys-ops` per role-edit matrix `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md:53` |
| `acc-owner` (Account Owner) | management-console ✅ | `acc.account-user / add` (root) **OR** `acc.org-user / add` (sub-node) | **✅ PASS** | All `acc-*` — but BR-UM-03 blocks 2nd AO | One AO per tenant — `account-owner` should be filtered from Role dropdown when tenant already has one `[BRAIN-OUT] 05-capability-maps/acc-owner.capability.md:111` |
| `acc-admin` (Node Admin) | management-console ✅ | **ONLY** `acc.org-user / add`; `acc.account-user / add` silent deny | **✅ PASS (sub-node only)** | `acc-admin` (keep) + `acc-user` | Cannot grant `acc-owner`; root-node Add User entry hidden — only sub-node Add User visible `[BRAIN-OUT] 05-capability-maps/acc-admin.capability.md:110` |
| `acc-user` (Normal User) | management-console ✅ | none — BR-UM-05 transactional role | **❌ FAIL** | none | Transactional only; explicit deny on every `acc.*-user / add` key `[BRAIN-OUT] 05-capability-maps/acc-user.capability.md:105` |

**Wider context** — Add User is the **widest** Org Hierarchy flow by role count:

| Flow | Roles that can run | Source |
|---|---|---|
| Add Client | 2 / 6 (sys-admin + sys-products) | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md` + Add-Client.trace.md Layer 18 |
| **Add User** | **5 / 6 (sys-admin + sys-ops + sys-products + acc-owner + acc-admin)** | `[BRAIN-OUT] flows/Add User.md:25-32` + this trace |
| Add Node | 4 / 6 | `[BRAIN-OUT] flows/Add Node.md` |
| Edit Node | 4 / 6 | `[BRAIN-OUT] flows/Edit Node.md` |

This asymmetry reflects the business model: only Falcon staff can mint new scopes (clients), but **inside** a scope, both Falcon admins and the scope's own owner/admins can manage users. Normal Users are transactional consumers, not managers.

---

## The traceability backbone

This section shows how **layer N+1 is uniquely determined by layer N** — the data flows downhill, each layer is consequent on the one above.

```
[1] Business intent: "onboard one user (Falcon-side or Client-side) into the platform"
    │
    │ (PRD authors translate the intent into rules)
    ▼
[2] PRD requirement: PRD-02 WORKFLOWS §W1 — 3-tab wizard authored
    │
    │ (BR-UM-01..05 fix the role gates at PRD level)
    ▼
[3] Permission gate: 5 of 6 roles can run; actor's role bounds target roles
    │
    │ (PRD BR-UM-01..48 fix field rules + status lifecycle at workflow level)
    ▼
[4] BR-UM rules: ~17 BR-UM + 2 cross-cut BR-AM rules apply
    │
    │ (Each rule that's a per-field invariant becomes a V-rule)
    ▼
[5] V-rules per tab: 5 V-rules cover field-level invariants (+ 2 cross-cut for first-login)
    │
    │ (Each V-rule names the DTO field + attribute that enforces it)
    ▼
[6] E-* entity drift: 1 entity created (User Pending) + 3 read/post-creation (Account, OTP, Session)
    │
    │ (Backend persists User via composite DTO)
    ▼
[7] Backend DTO: CreateUserRequest composite shape + [ThrowIf*] attributes
    │
    │ (The DTO is consumed by ONE endpoint)
    ▼
[8] Backend endpoint: POST /api/user/ on Identity (CreateUserEndpoint)
    │
    │ (Pre-processor runs [ThrowIf*]; handler runs cross-field + role-edit + quota + Zitadel)
    ▼
[9] FluentValidator + handler-time gate
    │
    │ (On commit success, the handler produces 1 Kafka event)
    ▼
[10] Kafka event: identity.user-events.v1 → PES role-link sync
    │
    │ (Every validation/handler/Zitadel path can fail with mapped error codes)
    ▼
[11] Error codes: ~25 codes across 5 HTTP status classes
    │
    │ (Frontend must surface them; FE route must gate access)
    ▼
[12] FE route + PES gate: data.access = FalconAccess.{adminConsole|managementConsole}.{user|accountUser|orgUser}.add
    │
    │ (Once gated, FE composes the wizard from Falcon UI Core)
    ▼
[13] FE components: 3 tab panels using <falcon-*> kit
    │
    │ (Each component wires into a FormGroup state machine)
    ▼
[14] FE form + state: Reactive FormGroups buffered locally, composite POST on Tab 3 Finish
    │
    │ (Display copy is i18n-resolved; error messages from backend already localized)
    ▼
[15] FE i18n keys: en + ar resolutions per field (inferred — not in playbook)
    │
    │ (Tests assert the full chain — happy + failure modes)
    ▼
[16] Test case (Gherkin): 6 scenarios — happy + uniqueness + quota + cross-namespace + 2nd-AO + partial-fail
    │
    │ (Code lives somewhere — verify port vs admin/mgmt)
    ▼
[17] Port artifact: BOTH admin-console (exists) AND management-console (verify-or-create)
    │
    │ (Whom does the gate pass for?)
    ▼
[18] Capability map per role: 5 of 6 PASS; acc-user FAILS
```

The chain is tight: every layer is consequent on the one above, every fact source-prefixed (or honestly marked `[INFERRED]` / `(no source — needs investigation)`).

---

## Runtime verification status

**Per-layer verification status for Add User** (best assessment from available evidence):

| Layer | Verdict | Evidence |
|---|---|---|
| 1 — Business intent | 🟢 spec-verified | `[BRAIN-OUT] flows/Add User.md` published as canonical spec |
| 2 — PRD requirement | 🟢 spec-verified | PRD-02 BR-UM-* + WORKFLOWS §W1 are authored documents |
| 3 — Permission gate | 🟡 partially code-verified | acc-* PES rules verified in `[CODE] pes-account-role-rules.json:8-9, 40, 66`; sys-* `sys.user / add` is Wave 1.3.0 (not in seed `BuiltInRoleCatalog.cs` yet — silence is `[INFERRED]` allow) |
| 4 — BR-UM rules | 🟢 spec-verified | 48 rules enumerated in PRD `BUSINESS_RULES.md` |
| 5 — V-rules per tab | 🟢 vault-verified | 5 V-rules with code citations in `[VAULT] _obsidian/30-Validation/` |
| 6 — E-* entity drift | 🟢 vault-verified | E-user / E-otp-challenge / E-session / E-account mapped in `[VAULT] _obsidian/40-API/E-*.md` |
| 7 — Backend DTOs | 🟡 spot-checked | DTO shape from `[BRAIN-OUT] flows/Add User.md:184` + `[BRAIN-OUT] DTO_DICTIONARY.md`; route binding "no FastEndpoints route observed" — verify via OpenAPI doc on first integration `[BRAIN-OUT] flows/Add User.md:191-192` |
| 8 — Backend endpoint + handler | 🟡 spot-checked | Endpoint path + auth verified; handler internals composed from playbook narrative not source-cited line-by-line |
| 9 — FluentValidator + handler-time gate | 🟢 spec-verified | Cross-field rules + error codes documented in playbook + V-rule notes; **HIGH drift**: backend `MaximumLength(100)` vs PRD-02 `≤ 30` for Username |
| 10 — Kafka events | 🟢 spec-verified | 1 topic + producer + consumer documented `[BRAIN-OUT] flows/Add User.md:230-237` |
| 11 — Error codes | 🟢 catalog-verified | ~25 codes mapped to HTTP status in `[BRAIN-OUT] 13-error-catalog/CATALOG.md` |
| 12 — FE route + PES gate | 🟢 code-verified | `falcon-access.registry.ts` is the SoT; all keys exist (sys.user.add at Wave 1.3.0 line 53; acc keys at lines 69-70) |
| 13 — FE components | 🟡 partially code-verified | Falcon UI Core component map enumerated in playbook; admin-console `add-user-wizard/` exists at `[CODE]` and matches canonical pattern; mgmt-console mirror not yet verified |
| 14 — FE form + state | 🟡 spot-checked | Reactive Forms pattern is canonical; existing admin-console folder structure verified at `[CODE]`; specific state-container choice (signal vs service) not fixed in playbook |
| 15 — FE i18n keys | 🔴 unverified | `[INFERRED]` — playbook silent; concrete keys need to be confirmed against existing i18n bundles (`apps/admin-console/src/assets/i18n/{en,ar}.json` + management-console parallel) |
| 16 — Test case (Gherkin) | 🟡 spot-checked | Scenarios composed from documented BRs + V-rules + error codes; need to be run against a live stack |
| 17 — Port artifact | 🟢 spec-verified + admin-console structurally verified | Admin-console folder exists at `[CODE]`; mgmt-console mirror inferred from PES gate availability |
| 18 — Capability map per role | 🟡 partially code-verified | acc-* verdicts code-verified via `pes-account-role-rules.json`; sys-* verdicts depend on Wave 1.3.0 PES seed which is not yet in `BuiltInRoleCatalog.cs` |

**No layer has been ✋ runtime-verified for Add User specifically.** The closest runtime evidence is the sister `comms-hub` flow verification (21/21 backend PES gates PASS) and the local stack at `[MEMORY] project_local_backend_test_users_2026_05_16.md` (6 test users seeded — 3 sys-* + 3 acc-* on tenant `test-tenant-001`, password `Admin@1234` per `[MEMORY] feedback_test_user_password_standard.md`). Add User runtime verification awaits:

1. Confirmation that `sys.user / add` PES rule is seeded in `BuiltInRoleCatalog.cs` (Wave 1.3.0 not yet in seed per `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:53`).
2. Confirmation that `CreateUserEndpoint` route binding exists in Identity FastEndpoints registration.
3. End-to-end run of all 6 actor × target-role combinations from layer 18 against the live stack.

---

## Cross-references

### Sibling traces (this cluster)

- [`Add-Client.trace.md`](Add-Client.trace.md) — the canonical exemplar; Step 5 of Add Client is the **async-via-Kafka** twin of Add User
- [`_INDEX.md`](_INDEX.md) — cluster index, authoring checklist, source-prefix legend

### Authority dataset (sibling clusters)

- [`../00-INDEX.md`](../00-INDEX.md) — dataset entry point
- [`../00-VERIFICATION-GATE.md`](../00-VERIFICATION-GATE.md) — 19 verification questions
- [`../01-roles/sys-admin.md`](../01-roles/sys-admin.md) — broadest target reach
- [`../01-roles/sys-ops.md`](../01-roles/sys-ops.md) · [`../01-roles/sys-products.md`](../01-roles/sys-products.md)
- [`../01-roles/acc-owner.md`](../01-roles/acc-owner.md) — only role with `acc.account-user.add`
- [`../01-roles/acc-admin.md`](../01-roles/acc-admin.md) — `acc.org-user.add` only
- [`../02-statuses/user-status.md`](../02-statuses/user-status.md) — Pending → Active lifecycle
- [`../03-pes-keys/REGISTRY-RAW.md`](../03-pes-keys/REGISTRY-RAW.md) — PES key universe
- [`../05-capability-maps/_INDEX.md`](../05-capability-maps/_INDEX.md) — per-role action enumeration
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — V-rules × features (Add User V-rule columns documented)
- [`../07-cross-cutting/gateway-routing-map.md`](../07-cross-cutting/gateway-routing-map.md) — System vs Core gateway dispatch
- [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md) — E-user drift (9 items)
- [`../09-business-rules-by-feature/MATRIX.md`](../09-business-rules-by-feature/MATRIX.md) — BR-UM rules per feature
- [`../13-error-catalog/CATALOG.md`](../13-error-catalog/CATALOG.md) — ~130-code error catalog
- [`../14-flow-playbook-integration/Add-User.integration.md`](../14-flow-playbook-integration/Add-User.integration.md) — authority-lens integration (this trace's primary cross-reference)
- [`../15-implementation-pitfalls/`](../15-implementation-pitfalls/) — known traps
- [`../16-trigger-phrases/`](../16-trigger-phrases/) — `implement Add User`, `which V-rules apply to <field>`

### Flow playbook (Brain Outputs — primary source)

- [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`](../../../understanding/pages/organization-hierarchy/flows/Add%20User.md) — 337-line canonical SoT

### Brain SK vault hubs

- `[VAULT] _obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` — top-of-session entry point
- `[VAULT] _obsidian/00-Home/AI-Agent-Onboarding.md` — agent retrieval contract
- `[VAULT] _obsidian/00-Home/VALIDATION_INDEX.md` — 25 V-rule index (5 directly cited here)
- `[VAULT] _obsidian/00-Home/API_INDEX.md` — E-* entity index (E-user with 9 drift items)
- `[VAULT] _obsidian/40-API/E-user.md` — User entity dossier
- `[VAULT] _obsidian/40-API/E-otp-challenge.md` — OTP challenge entity (first-login)
- `[VAULT] _obsidian/40-API/E-session.md` — session entity (first-login completion)

### Standing rules from MEMORY.md

- `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md` — PES subject MUST use Zitadel id, not Mongo `_id`
- `[MEMORY] feedback_test_user_password_standard.md` — all test users use password `Admin@1234`
- `[MEMORY] feedback_falcon_custom_library_mandatory.md` — library skeleton + app wrapper pattern
- `[MEMORY] feedback_library_skeleton_app_api.md` — wrapper owns service calls
- `[MEMORY] project_falcon_component_validation_convention.md` — canonical folder + validation doctrine
- `[MEMORY] feedback_no_inline_styles_tokens_only.md` — zero inline styles, tokens only (Tailwind utilities + falcon-* tokens)

### Code references (admin-console)

- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/` — top-level wrapper (already exists)
- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/` — Tab 1
- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-role-status-step/` — Tab 2 (folder names "role-status" matches PRD-02 §W1)
- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/` — Tab 3
- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/services/user.service.ts` — composite POST + preflights

### Open questions surfaced

| Q | Description | Source |
|---|---|---|
| Q-UM-05 | Profile picture format/size constraints (PRD silent — `[VAULT] E-user.md` flags as gap) | `[BRAIN-OUT] flows/Add User.md:323` |
| Q-UM-07 | Permission list - Jawad Tab 2 not captured | `[BRAIN-OUT] flows/Add User.md:324` |
| Q-UM-08 | Are Client AO / Node Admin allowed to add Falcon-side users? PRD silent — block at UI as defensive default | `[BRAIN-OUT] flows/Add User.md:325` |
| Q-UM-12 | Vocabulary mismatch on `PasswordSecurityLevel` (PRD `Normal/Advanced` vs code `Low/Medium/High/Strict`) | `[BRAIN-OUT] flows/Add User.md:326` |
| Q-UM-13 | Admin-driven email/phone OTP path unclear vs `/me/` flow — affects Edit User (not Add User) but tied to same `VerificationSession` shape | `[BRAIN-OUT] flows/Add User.md:327` |
| Q-UM-14 | `RoleKey` (string) vs `eUserRoles` (int) — bind to `RoleKey` per DTO_DICTIONARY guidance | `[BRAIN-OUT] flows/Add User.md:328` |
| GAP-UM-34 | "Contact administrator" alerts include manager info? — affects post-lockout messaging | `[BRAIN-OUT] flows/Add User.md:329` |
| GAP-UM-36 | No FE re-dispatch surface for failed credential delivery — flagged as UX gap | `[BRAIN-OUT] flows/Add User.md:330` |
