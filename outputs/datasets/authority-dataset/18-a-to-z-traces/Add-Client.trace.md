---
type: a-to-z-trace
feature: Add Client wizard
trace-depth: 18 layers
exemplar: true
purpose: "Canonical template showing how to trace ONE feature from business intent down through PRD, business rules, validation, entities, backend, frontend, tests, and verification."
audience: AI agents + developers needing a complete picture of one feature
extracted: 2026-05-16
---

# Add Client — A→Z Implementation Trace (canonical exemplar)

## TL;DR

The Add Client wizard is Falcon's 5-step onboarding flow that turns one composite POST (`/api/Node/create-account`) into seven persisted/async-materialized entities — Main Node + Account + AccountSettings + N×CommChannelConfig + N×AppConfig + AO User (Kafka) + Master Wallet (Kafka). This A→Z trace is the **canonical template** for tracing any Falcon feature: 18 layers, every layer cited from a single primary source, every fact source-prefixed. Copy this shape when documenting any other feature.

## The 18-layer trace at a glance

| # | Layer | What it answers | Primary source |
|---|---|---|---|
| 1 | Business intent | What user need does this serve? | `[BRAIN-OUT] Add Client/00-OVERVIEW.md:30-37` |
| 2 | PRD requirement | Which PRD lines authorize this flow? | `[BRAIN-OUT] prd/modules/01-account-management/WORKFLOWS.md` §W1 + `BUSINESS_RULES.md` BR-AM-01..42 |
| 3 | Permission gate | Who can run it (role × resource × action)? | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:9-16` + `[CODE] BuiltInRoleCatalog.cs:79-167` |
| 4 | BR-AM rules | What cross-field / workflow rules apply? | `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:65-96` |
| 5 | V-rules per step | What field-level validation rules govern each step? | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:10-22` + 9 V-rule notes in `[VAULT] _obsidian/30-Validation/` |
| 6 | E-* entity drift | Which entities does this create + drift items? | `[VAULT] _obsidian/40-API/E-*.md` + `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md` |
| 7 | Backend DTOs | Composite request shape + `[ThrowIf*]` attributes | `[BRAIN-OUT] Add Client/08-BACKEND_API.md:27-66` + `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:73-89` |
| 8 | Backend endpoint + handler | Route + controller + handler flow | `[BRAIN-OUT] Add Client/08-BACKEND_API.md:9-25` + `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:9-23` |
| 9 | FluentValidator + handler gate | What runs server-side after `[ThrowIf*]`? | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:23-36` |
| 10 | Kafka events | What downstream events fire on success? | `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:25-33` |
| 11 | Error codes | Every `FalconKeys.Error.*` Add Client can surface | `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:9-30` + `[BRAIN-OUT] 13-error-catalog/CATALOG.md` |
| 12 | FE route + PES gate | Route path + `data.access` + `FalconAccess.*` key | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:36` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Client.integration.md:28` |
| 13 | FE components | Falcon UI Core components used per step | `[BRAIN-OUT] Add Client/09-COMPONENTS.md:9-33` |
| 14 | FE form + state | NgForm/FormGroup choice per step + wizard state machine | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:43-58` + `[BRAIN-OUT] Add Client/00-OVERVIEW.md:47-49` |
| 15 | FE i18n keys | Translation keys (en + ar resolutions) | `[INFERRED]` — playbook silent; recommended namespace inferred from `apps/admin-console/.../organization-hierarchy-page` conventions |
| 16 | Test case (Gherkin) | 5 scenarios with realistic assertions | composed from layers 4 + 5 + 11 |
| 17 | Port artifact | Where it lives in admin-console; does it port to mgmt? | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Client.integration.md:26` |
| 18 | Capability map per role | 6 roles × can-run verdict | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:50` + sister capability maps |

---

## Layer 1 — Business intent

**The user need.** A Falcon staff member onboards a new client tenant. The act spans seven persisted artifacts (one tenant, one main node, one account, settings, two service catalogs, one Account Owner user) and four asynchronous side-effects (Identity user create, wallet topology, identity-settings sync, gateway IP cache refresh). The wizard exists so this multi-entity creation looks like a single business action to the operator.

**Why this is hard.** Without the wizard:
- The operator would have to call ~7 separate endpoints across 3 services in the right order.
- A failure in any one step would leave a half-onboarded client (Account but no AO User, Settings but no wallet topology, etc.).
- The operator would have to know which entities can drift (e.g. Account Settings `PasswordSecurityLevel` vocabulary mismatch — see Layer 5).

**The wizard's promise.** One composite request, one server-side transaction (best-effort), one consolidated error surface. `[BRAIN-OUT] Add Client/00-OVERVIEW.md:30-37`

---

## Layer 2 — PRD requirement

**Module:** PRD-01 Account Management.

**Authoring source.** `[BRAIN-OUT] prd/modules/01-account-management/` — three files load-bearing for Add Client:

| PRD artifact | What it carries | Used by Add Client for |
|---|---|---|
| `OVERVIEW.md` Actors row | Who is allowed to onboard clients | Permission gate (Layer 3) |
| `WORKFLOWS.md` §W1 (`latest-prd.md:33-54`) | The 5-step wizard definition | Wizard shape + step boundaries |
| `BUSINESS_RULES.md` BR-AM-01..42 | 28 of 42 rules apply to this flow | Field rules (Layer 4) |
| `ENTITIES.md` Account + AccountOfficialData + AccountSettings + CommChannelConfig + AppConfig | Persisted artifact shapes | Entity drift (Layer 6) |
| PRD-02 `WORKFLOWS.md` §W1 (Add User) | Step 5 = degenerate Add User with `role = account-owner` | Step 5 cross-flow reuse |
| PRD-02 `ENTITIES.md` User | AO User entity shape | Entity drift (Layer 6) |

**Exact PRD line citations.**

- "Account Name must be unique across Falcon, <=30 chars, must start with a letter, mandatory." — `[VAULT] V-account-name-format-uniqueness.md:23` quoting `latest-prd.md:34`
- Add Client wizard authoring + 5-step shape — `latest-prd.md:33-54` (referenced from `[BRAIN-OUT] Add Client/00-OVERVIEW.md:14`)
- Step 5 produces an AO user via PRD-02 Add User pattern — `[BRAIN-OUT] Add Client/00-OVERVIEW.md:53` citing PRD-01 BR-AM-19

**The 5 steps per PRD-01 WORKFLOWS §W1** `[BRAIN-OUT] Add Client/00-OVERVIEW.md:39-45`:

1. Account Information (mandatory) — Account Name + classification + Profile Picture + Official Data
2. Account Settings (mandatory) — Password Security Level + IP Allowlist + 4 Limits
3. CommChannels & Services (optional) — per-channel Visibility + PricingType + PriceValue
4. Applications & Services (optional) — same shape as Step 3
5. Account Owner user (mandatory) — Personal Info + Role + Delivery Method

**Critical implementation note.** The wizard is NOT per-step API submission. Steps 1-4 are local form state; the composite `CreateAccountRequest` is submitted **once** on Step 5. `[BRAIN-OUT] Add Client/00-OVERVIEW.md:49`

---

## Layer 3 — Permission gate

**The matrix.** `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:9-16`

| Role | Can run? | PES rule (`sys.account / add`) | Source |
|---|---|---|---|
| `sys-admin` (System Administrator) | ✅ YES | allow | `[CODE] BuiltInRoleCatalog.cs:87` |
| `sys-products` (Products) | ✅ YES | allow | `[CODE] BuiltInRoleCatalog.cs:142` |
| `sys-ops` (Operation) | ❌ NO | silent deny (no rule) | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:13` — "Operation cannot add clients" |
| `acc-owner` (Account Owner) | ❌ NO | no `sys.*` rules at all | `[BRAIN-OUT] 01-roles/acc-owner.md` |
| `acc-admin` (Node Admin) | ❌ NO | no `sys.*` rules | `[BRAIN-OUT] 01-roles/acc-admin.md` |
| `acc-user` (Normal User) | ❌ NO | no `sys.*` rules | `[BRAIN-OUT] 01-roles/acc-user.md` |

**The three-layer gate** — same decision enforced three times for defense in depth. `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:22-24`:

1. **Frontend visibility (UX gate)** — `<button>` only renders when `FalconAccess.adminConsole.account.add()` resolves to allow. Hides for sys-ops + every acc-* role.
2. **PES policy at the System Gateway** — the authoritative gate. PES checks `sys.account / add` against the caller's role from JWT claims. Seed rules in `[CODE] BuiltInRoleCatalog.cs:79-167`.
3. **Backend `[Authorize]` on `NodeController`** — class-level attribute rejects anonymous calls. `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:23`. Note: no `FalconOnly` policy at the controller level — Commerce relies on PES at the gateway + the JWT user-type claim. Standalone visibility/pricing edit endpoints (post-create) DO carry `[Authorize(Policy = "FalconOnly")]` (`[BRAIN-OUT] Add Client/01-PERMISSIONS.md:28`).

**Open question.** Q-AM-16 — PES rule sync drift with the Permission spreadsheet (Jawad). `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:32`. PES is the runtime authority; if the sheet diverges, the runtime wins silently.

---

## Layer 4 — BR-AM business rules

Add Client touches **28 of 42 BR-AM rules**. `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:46`. Listed in step order:

| BR # | Rule | Wizard surface |
|---|---|---|
| BR-AM-01 | 3-level hierarchy (Root / Main / Sub) | Tree topology |
| BR-AM-02 | **Falcon SA + Products only** | Action button visibility + PES rule (Layer 3) |
| BR-AM-03 | AccountName uniqueness + format + required | Step 1 — `Info.AccountName` |
| BR-AM-04 | AccountId auto-generated | Step 1 — read-only field |
| BR-AM-05 | FinanceId sourced from Finance, mandatory | Step 1 — `Info.FinanceId` |
| BR-AM-06 | ClassificationCategory enum (VIP/Critical/Normal), optional | Step 1 dropdown |
| BR-AM-07 | ClassificationSubCategory enum (Bank/Gov/SemiGov/Large/Medium/SME), optional | Step 1 dropdown |
| BR-AM-08 | AuthorityLetterType (Gov/Commercial/Charity) with 2 linked fields | Step 1 — type + Sector + AuthorityLetterId |
| BR-AM-09 | PasswordSecurityLevel is account-level | Step 2 dropdown + Settings tab |
| BR-AM-10 | IP allowlist enforcement | Step 2 list + every login gateway check |
| BR-AM-11 | Account Limits zero-means-no-limit (4 fields) | Step 2 — limit grid |
| BR-AM-12 | System User and Normal User counts independent | Step 2 limit fields |
| BR-AM-13 | Account Limits set in Step 2 (mandatory step) | Step 2 wiring |
| BR-AM-14 | CommChannel visibility default = Hide | Step 3 toggle initial state |
| BR-AM-15 | **Visibility=Show → Pricing mandatory** | Step 3 + Step 4 cross-field rule |
| BR-AM-16 | PricingType enum (Monthly/Yearly/OneTimePayment) | Step 3 + Step 4 dropdown |
| BR-AM-17 | PriceValue >= 0 SAR | Step 3 + Step 4 numeric input |
| BR-AM-18 | Steps 3 + 4 OPTIONAL | Wizard navigation |
| BR-AM-19 | Step 5 creates Account Owner user (mandatory) | Step 5 final submit |
| BR-AM-20 | New CommChannel/App config starts `InActive (First time)` | State machine on commit (Layer 8) |
| BR-AM-25 | BalanceType + WalletType are Falcon-only configs | Settings tab — not in Add Client UI |
| BR-AM-26 | Wallet matrix — 4 combinations | Settings tab |
| BR-AM-27 | Node-based — only Normal Users consume | Wallet strategy |
| BR-AM-28 | Master Wallet aggregate (lump sum = 0 until first contract activates) | Layer 10 — Master Wallet lifecycle |
| BR-AM-29 | Comm Wallet only in Multiple-wallet mode | Settings tab — derived UI |
| BR-AM-39 | Account Limits enforcement when over-limit — **OPEN** | Settings tab edit flow (post-create) |
| BR-AM-40 | Visibility flip Show→Hide while Active — **OPEN** | Steps 3 + 4 (post-create edits) |
| BR-AM-41 | BalanceType / WalletType mid-life change — **OPEN** | Settings tab |
| BR-AM-42 | Normal User deletion balance fate — **OPEN** | Hierarchy delete flow |

**Cross-flow BR-UM rules touched at Step 5** `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:99-110`:

- BR-UM-03 — One Account Owner per Account (Step 5 creates the first; subsequent attempts fail with 422 `InvalidRoleForUserType`)
- BR-UM-09 — New user created in `Pending`
- BR-UM-11 — FirstName/LastName ≤50 chars letters-only mandatory
- BR-UM-12 — Username ≤30 chars letter-first unique mandatory
- BR-UM-13 — Email valid format mandatory
- BR-UM-14 — PhoneNumber valid format mandatory (OTP)
- BR-UM-15 — Initial password auto-generated
- BR-UM-18 — Save → delivery dialog (Email / Phone / Both)

---

## Layer 5 — V-rules per step

Add Client surfaces **9 V-rules**. Per-step distribution from `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:10-22`:

### Step 1 — Basic Info

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) | `Info.AccountName` | Letter-prefix + ≤30 + unique. Backend missing letter-prefix regex `[VAULT] V-account-name-format-uniqueness.md:42`. FE enforces `Validators.pattern(/^[A-Za-z]/)`. Async uniqueness via `GET /api/Node/ValidateAccountName?AccountName=` debounced 300 ms `[BRAIN-OUT] Add Client/08-BACKEND_API.md:84`. |

### Step 2 — Settings

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-password-security-level-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-security-level-enum.md) | `Settings.PasswordSecurityLevel` | Enum membership. **Q-UM-12 HIGH drift** — PRD says `Normal/Advanced`; Identity backend `ePasswordSecurityLevel` is `Low/Medium/High/Strict`. FE recommendation: display PRD labels, submit backend codes `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:97-101`. |
| [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md) | `Settings.AllowedIPs[]` | List validity at edit; enforcement runs at gateway pre-processor on every login. `InvalidIpAddress` (403) on malformed value. |
| [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) | 4 limits (`MaxNormalUserLimit` · `MaxSystemUserLimit` · `MaxNodeLevel` · `BalanceTransferLimit`) | `0` = no limit. Empty disallowed. Default 0. **Backend missing per-field `[ThrowIf*]`** — enforcement handler-only via `InvalidAccountLimits` 422 `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:35`. |

### Steps 3 + 4 — CommChannels + Apps

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-service-visibility-pricing-required`](../../../../Brain%20SK/_obsidian/30-Validation/V-service-visibility-pricing-required.md) | Per-row `Visibility` ↔ `PriceType` + `PriceValue` | Cross-field reactive form. `Visibility=Show` requires `PriceType + PriceValue`. `Visibility=Hide` must NOT carry pricing (defense in depth — backend 422 `HiddenProductMustNotHavePricing`). Canonical wiring in `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:43-58`. |

### Step 5 — Account Owner

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-user-first-last-name-letters-only`](../../../../Brain%20SK/_obsidian/30-Validation/V-user-first-last-name-letters-only.md) | `AccountOwner.FirstName` + `AccountOwner.LastName` | ≤50 + letters-only (Arabic Unicode allowed). Spaces/hyphens open — PRD silent `[BRAIN-OUT] Add Client/06-STEP_5_ACCOUNT_OWNER.md:24`. |
| [`V-username-format-uniqueness-immutable`](../../../../Brain%20SK/_obsidian/30-Validation/V-username-format-uniqueness-immutable.md) | `AccountOwner.UserName` | **HIGH DRIFT** — PRD cap 30, backend FluentValidation cap 100. **FE enforces 30** per `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:91-95`. Async uniqueness via Identity `POST /api/user/exist`. Immutability not relevant at create. |
| [`V-password-complexity-per-security-level`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-complexity-per-security-level.md) | `AccountOwner.Password` (server-side auto-gen) | Complexity tier resolved from Step 2's `PasswordSecurityLevel`. **No password input on Step 5** — backend generates and sends via `DeliveryMethod` `[BRAIN-OUT] Add Client/06-STEP_5_ACCOUNT_OWNER.md:34`. |
| [`V-normal-user-limit-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-normal-user-limit-enforcement.md) | (indirect) | AO is `account-owner` role, not Normal User — no immediate breach at Add Client. Runtime cap on subsequent Add User flows. |

### Async uniqueness checks (debounced 300 ms + cancel-on-input)

`[BRAIN-OUT] Add Client/07-VALIDATIONS.md:68-71`:

| Check | Endpoint | Step | FE behavior |
|---|---|---|---|
| Account Name | Commerce `GET /api/Node/ValidateAccountName?AccountName=` → `bool` | Step 1 | Map `true` → `accountNameTaken` validator error |
| Username | Identity `POST /api/user/exist` → `ExistResponse { bool Exists }` | Step 5 | Map `Exists: true` → `usernameTaken` validator error |

### Cross-field validation contract per step

`[BRAIN-OUT] Add Client/07-VALIDATIONS.md:23-65`:

- **Step 1:** `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` (all 400)
- **Step 2:** `MainAccountSettingsRequired` (400) · `InvalidAccountLimits` (422 — handler-only)
- **Steps 3 + 4:** `HiddenProductMustNotHavePricing` · `PriceValueNotConfigured` · `PricingTypeNotConfigured` (all 422)
- **Step 5:** `RequiredFieldMissing` (400) · `DuplicateUsername` (409)

---

## Layer 6 — E-* entity drift

Add Client creates/touches **7 entities**. Drift counts and notable items from `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md` and the per-entity vault notes.

| Entity | Created | Drift count | Notable drift |
|---|---|---|---|
| `E-account` | ✅ Step 5 commit | 16 | `accountId` (business id) vs `id` (technical) collapsed on backend `[VAULT] E-account.md:51`. `financeId` not enumerated in `DTO_DICTIONARY.md` `[VAULT] E-account.md:52`. `profilePicture` account-vs-owner mismatch `[VAULT] E-account.md:54`. AccountOfficialData per-field DTO opacity `[VAULT] E-account.md:55-59`. |
| `E-account-settings` | ✅ Step 5 commit | 14 | `PasswordSecurityLevel` Normal/Advanced ↔ Low/Medium/High/Strict vocabulary drift (Q-UM-12). `maxNodeLevels` (PRD) vs `MaxNodeLevel` (backend) singular/plural casing `[BRAIN-OUT] Add Client/03-STEP_2_SETTINGS.md:27`. `BalanceTransferLimit` unit hint dropped (PRD has `%`, backend bare decimal) `[BRAIN-OUT] Add Client/03-STEP_2_SETTINGS.md:28`. `Enabled` toggle extra on backend read DTO not in PRD. |
| `E-comm-channel-config` × N | ✅ Step 5 commit | 13 | `accountId` ↔ `NodeId` rename. Visibility PRD-enum `Show/Hide` → backend `bool`. 6-state status enum (`InActive (First time)` → `Paid` → `Active` → `Expired` → `Disabled` → `Renewing`) **not exposed as a single response field** `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:55`. Scheduled price change + cancel-pending extras on backend not in PRD. |
| `E-app-config` × N | ✅ Step 5 commit | 13 | Same shape as `E-comm-channel-config`. Backend code reuses the `Service` nested type with confusing `AppId` field name for both channel and app rows `[BRAIN-OUT] Add Client/05-STEP_4_APPS_SERVICES.md:28`. |
| `E-user` (AO) | ✅ Step 5 commit (async via Kafka) | 9 | `username` 30↔100 cap drift (HIGH). `Role` exposed twice (enum + `RoleKey` string — use `RoleKey`). `AccountOwner.PhoneNumber` + `AccountOwner.EmailAddress` missing `[ThrowIfNotPassed]` attribute despite required `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:86-87`. `profilePicture` write/read asymmetry. |
| `E-master-wallet` | ✅ Step 5 commit (async via Kafka) | 17 | Abstract aggregate, lump sum = 0 until first ContractActivated (BR-AM-28) `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:83`. Master Wallet `decimal?` vs CommChannel Wallet `decimal` nullability inconsistency. No public CRUD. Currency missing on per-wallet response. |
| `E-node` (Main) | ✅ Step 5 commit | 8 | `type` (Root/Main/Sub) NOT on response DTO — FE infers from position `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:94`. Per-node `settings` PRD-hinted but not on DTO (settings live on Account). `EffectiveDate` extra on `ChangeNodeNameRequest`. |

**Cross-service entity ownership notes:**

- **User entity owned by Identity, NOT Commerce.** `CreateAccountRequest.AccountOwner` flows to Identity via Kafka `UserCreationRequested`. Commerce never persists users `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:308`.
- **Wallet 3-tier hierarchy is backend-only.** PRD models one Wallet; backend exposes Master / CommChannel / Owner / CommChannelSubWallet `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:310`.
- **PES subject MUST use Zitadel id, NEVER Mongo `_id`** — `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md`. Frontend `CurrentSubjectBuilder` derives subject from `JWT.sub`.

---

## Layer 7 — Backend DTOs

**Top-level DTO:** `CreateAccountRequest` (composite). `[BRAIN-OUT] Add Client/08-BACKEND_API.md:27-62`.

```jsonc
{
  "Info": {                              // Step 1 — ~20 fields
    "AccountName": "...",                // [ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]
    "ClassificationCategory": <int>,     // [ThrowIfNotEnumValue<eClassificationCategory>]
    "ClassificationSubCategory": <int>,  // [ThrowIfNotEnumValue<eClassificationSubCategory>]
    "AuthorityLetterType": <int>,        // [ThrowIfNotEnumValue<eAuthorityLetterType>]
    "FinanceId": "...",
    "Sector": "...",
    "AuthorityLetterId": "...",
    "EntityName": "...",
    "CountryId": "...",
    "CityId": "...",
    "District": "...",
    "Street": "...",
    "BuildingNumber": "...",
    "PostalCode": "...",
    "AdditionalAddress": "...",
    "AnotherId": "...",
    "VatRegistrationNumber": "...",
    "BudgetNo": "...",
    "ProfilePictureInfo": { "Extension": "...", "FileBase64String": "..." }  // optional
  },
  "Settings": {                           // Step 2 — mandatory
    "PasswordSecurityLevel": <int>,      // [ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]
    "AllowedIPs": ["..."],               // List<string> — optional empty = no allowlist
    "MaxNormalUserLimit": 0,             // no [ThrowIf*] — handler-only InvalidAccountLimits 422
    "MaxSystemUserLimit": 0,
    "MaxNodeLevel": 0,                   // singular per backend (drift: PRD says maxNodeLevels)
    "BalanceTransferLimit": 0            // decimal — unit hint dropped (PRD says %)
  },
  "CommChannels": {                       // Step 3 — optional (sparse list, omit if untouched)
    "Services": [
      {
        "AppId": "<channelId>",          // Reused field name — actually channel id here
        "PriceType": <int>,              // [ThrowIfNotEnumValue<ePricingType>]
        "PriceValue": <decimal>          // inferred — Service nested type not fully documented
      }
    ]
  },
  "Applications": {                       // Step 4 — optional
    "Services": [
      { "AppId": "<appId>", "PriceType": <int>, "PriceValue": <decimal> }
    ]
  },
  "AccountOwner": {                       // Step 5 — mandatory
    "AccountOwnerProfilePictureInfo": null,
    "FirstName": "...",                  // [ThrowIfNotPassed] (+ FE: maxLength 50 + letters-only pattern)
    "LastName": "...",                   // [ThrowIfNotPassed]
    "UserName": "...",                   // [ThrowIfNotPassed] — backend cap 100, FE enforces 30 (PRD)
    "Password": null,                    // OPTIONAL — auto-generated if absent
    "NationalId": null,
    "PhoneNumber": "...",                // **MISSING** [ThrowIfNotPassed] despite required (drift)
    "EmailAddress": "...",               // **MISSING** [ThrowIfNotPassed] despite required (drift)
    "Role": <int>                        // [ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]
  },
  "DeliveryMethod": <int>                 // top-level, [ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]
}
```

**`[ThrowIf*]` attribute taxonomy** (recap from `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:246-258`):

| Attribute | Triggers on | Maps to error code |
|---|---|---|
| `[ThrowIfNotPassed]` | null / missing scalar | `RequiredFieldMissing` / `<Field>Required` (400) |
| `[ThrowIfMaxLengthExceed(N)]` | string length > N | `MaxLengthExceeded` / `<Field>TooLong` (400) |
| `[ThrowIfNotEnumValue<TEnum>]` | value outside enum set | `InvalidValue` (422) |

**`[ThrowIf*]` runs BEFORE handler logic** (FastEndpoints pre-processor chain). Empty/malformed values never reach the handler. Handler-level checks (e.g. `InvalidAccountLimits`, `OfficialDataRequired`, `BudgetNoRequired`) run after.

**Casing note.** Commerce uses **PascalCase** on the wire `[BRAIN-OUT] Add Client/08-BACKEND_API.md:64-66`. Deviation from Identity / Contact Group / Templates which use camelCase. Frontend HttpClient interceptor or DTO module must serialize PascalCase for Commerce calls.

---

## Layer 8 — Backend endpoint + handler

**The endpoint.** `[BRAIN-OUT] Add Client/08-BACKEND_API.md:18`

| Attribute | Value |
|---|---|
| Method | POST |
| Path (internal) | `/api/Node/create-account` |
| Path (via gateway) | `<system-gateway>/commerce/Node/create-account` — gateway strips `/commerce`, prepends `/api/` |
| Service | Commerce (`falcon-core-commerce-svc`) |
| Controller | `NodeController.CreateAccount` |
| Auth | class-level `[Authorize]` — anonymous rejected |
| Request | `CreateAccountRequest` |
| Response | `ServiceOperationResult<CreateAccountResponse>` — carries new Account `Id` |

**The gateway.** **System Gateway only** (`:7256` dev). `[BRAIN-OUT] Add Client/08-BACKEND_API.md:22`. Auth header: `Authorization: Bearer <zitadel-jwt>` (Falcon admin's token).

**Handler flow.** `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:9-23`. The handler is `CreateMainNodeProcess` (Application Service). Synchronous persistence sequence:

1. Create Root → Main Node binding (Main Node persisted with `AccountName`)
2. Create Account entity bound to Main Node (`Id`, `TenantId`, `CreatedAt`)
3. Create AccountSettings record (password level, IPs, 4 limits)
4. Create CommChannelConfig × N (one per `CommChannels.Services` entry, default status `InActive (First time)`)
5. Create AppConfig × N (one per `Applications.Services` entry, default status `InActive (First time)`)
6. **Produce 4 Kafka events** (see Layer 10)
7. Return `CreateAccountResponse` carrying new Account `Id` (mapped via `request.ToResponse(result.Id)`)

**Server-side wizard status enum.** A 7-stage `account-creation-status` lifecycle tracks server-side commit progress: Pending → InfoCompleted → SettingsCompleted → ServicesConfigured → AppsConfigured → OwnerCreated → Completed `[BRAIN-OUT] 02-statuses/account-creation-status.md:16-24` (referenced in `[BRAIN-OUT] 14-flow-playbook-integration/Add-Client.integration.md:34`).

---

## Layer 9 — FluentValidator + handler-time gate

**Two-tier server-side validation:**

### Tier 1 — `[ThrowIf*]` (pre-processor, before handler)

Catches null / empty / over-length / out-of-enum. Surfaces 400/422 codes per Layer 7 attribute table. Empty submissions never reach the handler.

### Tier 2 — Handler-level cross-field + uniqueness + business

Runs after pre-processor passes. Specifically responsible for `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:23-65`:

- **Account name uniqueness** — checked against Zitadel + Mongo on commit. Surfaces 409 `DuplicateTenantName`.
- **Username uniqueness** — checked at Identity via Kafka consumer. Surfaces 409 `DuplicateUsername` (post-async — can race the FE pre-check).
- **Step 1 address cross-field rules** — `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` (all 400).
- **Step 2 account-limits cross-field rule** — `InvalidAccountLimits` (422 — handler-only because the 4 limit fields lack documented `[ThrowIf*]` attributes).
- **Steps 3+4 cross-field rule** — `HiddenProductMustNotHavePricing` · `PriceValueNotConfigured` · `PricingTypeNotConfigured` (all 422).
- **Step 5 AO uniqueness + delivery** — `RequiredFieldMissing` (400) on any missing `FirstName/LastName/UserName/Role/DeliveryMethod` slipping past `[ThrowIf*]` (FE-side checks should prevent this).

**Critical FE rule** — use HTTP status code as the **primary routing signal**. Display localized `errorMessages[0]` directly. **Do NOT parse error codes for copy** `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:103-105`. Use codes for logging / instrumentation only.

---

## Layer 10 — Kafka events

On `IsSuccessful: true`, `CreateMainNodeProcess` produces **4 Kafka events** `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:27-33`:

| Topic | Producer | Consumer | Side-effect |
|---|---|---|---|
| `commerce.user-creation-requested.v1` | Commerce `UserCreationRequestedEventPublisher` | Identity `UserCreationRequestedConsumer` | Creates Zitadel user · applies `PasswordPolicy(level)` from Step 2 · sends credentials per `DeliveryMethod` |
| `commerce.wallet-configured.v1` | Commerce `WalletConfiguredEventPublisher` | Charging `WalletConfiguredEventConsumer` | Materializes Master Wallet (abstract aggregate lump sum = 0) + per-comm-channel sub-wallets if Multiple-wallet mode |
| `commerce.identity-settings-sync.v1` | Commerce `TenantIdentitySettingsSyncEventPublisher` | Identity (and others) | Syncs tenant identity settings (password policy, lockout policy, OTP config) |
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce `TenantIpAllowlistChangedEventPublisher` | Core Gateway | Refreshes Redis IP-allowlist cache (for the `acc.*`-bound login path) |

**Sequence diagram** `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:34-75`:

```
Admin (sys-admin / sys-products)
    │
    ▼
[Admin Console — Add Client button] ──► [System Gateway: 7256]
                                              │
                                              ▼
                         [Commerce: POST /api/Node/create-account] ───┐
                                              │                       │ persists synchronously:
                                              │                       │  - Main Node
                                              │                       │  - Account
                                              │                       │  - AccountSettings
                                              │                       │  - CommChannelConfig × N
                                              │                       │  - AppConfig × N
                                              │                       │
                                              ▼                       ▼
                          returns ServiceOperationResult<CreateAccountResponse>
                                              │                       │
                                              │    ┌──── Kafka: commerce.user-creation-requested.v1 ────► [Identity Service]
                                              │    │                                                          │
                                              │    │                                                          ▼
                                              │    │                                          creates Zitadel user · applies PasswordPolicy(level)
                                              │    │                                          · sends credentials per DeliveryMethod
                                              │    │
                                              │    ├──── Kafka: commerce.wallet-configured.v1 ────► [Charging Service]
                                              │    │                                                   │
                                              │    │                                                   ▼
                                              │    │                                       materializes Master Wallet (abstract)
                                              │    │                                       + sub-wallets per topology
                                              │    │
                                              │    ├──── Kafka: commerce.identity-settings-sync.v1 ────► [Identity Service]
                                              │    │
                                              │    └──── Kafka: commerce.tenant-ip-allowlist-changed.v1 ────► [Core Gateway]
                                              │                                                                  │
                                              │                                                                  ▼
                                              │                                                       refreshes Redis IP allowlist cache
                                              ▼
[Admin Console: success toast · navigate to Org Hierarchy with new client highlighted]
```

**Partial-failure case.** The Account may be created server-side **before** the async Identity consumer fails to create the AO user. Surfaces as 500 `CreateIdentityUserFailed` / `ZitadelCreateMachineUserFailed`. FE must show "Account created but Account Owner creation failed — contact support" and preserve wizard state for retry `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:78-81`.

---

## Layer 11 — Error codes

Add Client surfaces **30+ error codes** across **5 HTTP status classes**. Catalog: `[BRAIN-OUT] 13-error-catalog/CATALOG.md`. Per-flow placement: `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:9-30`.

### 400 — validation / required-field / format (~20 codes)

`RequiredFieldMissing` · `AccountNameRequired` · `AccountNameTooLong` · `MaxLengthExceeded` · `BelowMinimumLength` · `AccountIdRequired` · `FinanceIdRequired` · `BudgetNoRequired` · `ParentIdRequired` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` · `MainAccountSettingsRequired` · `OwnerIdRequired` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` · `InvalidPriceValue` · `InvalidPriceType` · `PriceValueRequired` · `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · `ImageExtensionNotAllowed` · `InvalidImageFile` · `ExecutableFileNotAllowed` · `ProfilePictureSizeExceeded` · `FileSizeExceeded`

**UX:** inline error on the missing field. Wizard stepper highlights affected step in error state. Scroll to first error.

### 401 — re-auth (2 codes)

`Unauthorized` · `InvalidCredentials` — triggers re-auth flow.

### 403 — auth / IP allowlist (5 codes)

`Forbidden` · `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction` · `InvalidIpAddress` · `IpNotAllowed`

**UX:** Generic "Request not permitted from your network" toast. **Do NOT differentiate from credential errors** — per BR-UM-24 enumeration-leak protection `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:25`. Permission errors → "You do not have permission to add a client" + close wizard.

### 409 — uniqueness collisions (3 codes)

`DuplicateTenantName` (Step 1) · `DuplicateUsername` (Step 5) · `DuplicateNodeName` (Step 1 — Main Node naming collision separate from tenant)

**UX:** Inline error on the offending field. Stepper highlights step.

### 422 — semantic / cross-field (~7 codes)

`InvalidAccountLimits` · `InvalidNodeLevel` · `InvalidValue` · `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` · `InvalidAuthorityLetterType`

**UX:** Inline error in the affected step's section.

### 500 — downstream Identity / Zitadel failure (5+ codes)

`CreateIdentityUserFailed` · `GetIdentityUserFailed` · `ExternalServiceError` · `ExternalServiceConnectionError` · `ExternalServiceTimeout` · `ZitadelCreateMachineUserFailed`

**UX:** Toast "Account created but Account Owner creation failed — contact support". **Preserve wizard state** so the operator can retry Step 5 user creation. Account may have been created server-side before Identity hop failed `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:28`.

### FE error-handling contract

`[BRAIN-OUT] Add Client/12-ERROR_STATES.md:60-61` + `[BRAIN-OUT] 13-error-catalog/FE-CONTRACT.md`:

1. Use HTTP status code as the **primary routing signal** (which UI to show).
2. Use `errorMessages[0]` for **display copy** (already localized by backend).
3. Error codes are for **logging / instrumentation only** — never branch UI copy on them.

---

## Layer 12 — FE route + PES gate

**Route + Angular guard.**

| Aspect | Value | Source |
|---|---|---|
| App | `apps/admin-console` (System Gateway-backed) | `[BRAIN-OUT] Add Client/00-OVERVIEW.md:34` |
| Page route | `/organization-hierarchy` | `[BRAIN-OUT] 14-flow-playbook-integration/Add-Client.integration.md:28` |
| Entry point | Right-pane primary action "Add Client" — visible only via PES | `[BRAIN-OUT] Add Client/00-OVERVIEW.md:35` |
| `data.access` (route guard) | `FalconAccess.adminConsole.enter()` (page-level) | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:34` |
| Action gate (button visibility) | `FalconAccess.adminConsole.account.add()` | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:36` |

**Two PES checks gate the action:**

1. **Route guard** — `FalconAccess.adminConsole.enter()` resolves `app.admin-console / view` for the role. Fails for every `acc-*` role (silent deny — no rule).
2. **Action gate** — `FalconAccess.adminConsole.account.add()` resolves `sys.account / add`. Passes only for sys-admin + sys-products. Fails for sys-ops (silent deny — no rule).

**Source of truth:** `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (47 factory methods, 7 top-level namespaces) `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:3`.

**Gateway behavior.** The FE never hits the route directly — it goes through the System Gateway which validates the JWT, forwards `tenantId` + `nodeId` + `path` claims, and either passes the request through to Commerce or returns 403 if PES denies.

---

## Layer 13 — FE components

**Wizard shell + 5 steps.** Falcon UI Core components used per step (no PrimeNG; no SCSS; Tailwind utilities only per `[MEMORY] feedback_falcon_custom_library_mandatory.md`). `[BRAIN-OUT] Add Client/09-COMPONENTS.md:9-33`.

### Wizard shell (all steps)

| Component | Role |
|---|---|
| `<falcon-stepper>` or `<falcon-wizard>` | 5-step horizontal stepper; per-step error state |
| `<falcon-dialog>` | Modal container (alternative: drawer) |
| `<falcon-button>` | Next / Previous / Submit / Save Draft / Cancel |
| `<falcon-notification>` / `<falcon-toast>` | Error toasts (403, 500, partial-failure) |

### Step 1 — Basic Info

| Component | Field |
|---|---|
| `<falcon-input>` | Account Name · Finance ID · Sector · Authority Letter ID · Entity Name · District · Street · Building Number · Postal Code · Another ID · VAT Registration · Budget No |
| `<falcon-dropdown>` | Classification Category · Sub-Category · Authority Letter Type · Country · City |
| `<falcon-textarea>` | Additional Address |
| `<falcon-single-uploader>` | Profile Picture (optional) |

### Step 2 — Settings

| Component | Field |
|---|---|
| `<falcon-dropdown>` | Password Security Level |
| `<falcon-input>` (rows w/ add/remove) | Allowed IPs list |
| `<falcon-input-number>` | Max Normal User Limit · Max System User Limit · Max Node Levels · Balance Transfer Limit (%) |

### Step 3 — CommChannels & Services

| Component | Role |
|---|---|
| `<falcon-data-table>` | Per-channel row list |
| `<falcon-tag>` / `<falcon-icon>` | Channel name + icon (read-only) |
| `<falcon-toggle>` | Visibility (default OFF = Hide) |
| `<falcon-dropdown>` | Pricing Type (Monthly / Yearly / OneTimePayment) — conditional on Visibility=Show |
| `<falcon-input-number>` | Price Value SAR — conditional on Visibility=Show |

### Step 4 — Apps & Services

Identical component set to Step 3 (mirror by design per `[BRAIN-OUT] Add Client/05-STEP_4_APPS_SERVICES.md:27`).

### Step 5 — Account Owner

| Component | Field |
|---|---|
| `<falcon-single-uploader>` | Profile Picture |
| `<falcon-input>` | First Name · Last Name · Username · National ID |
| `<falcon-phone-field>` | Phone Number |
| `<falcon-email-field>` | Email |
| `<falcon-dropdown>` (or read-only) | Role (locked to `account-owner` per BR-AM-19) |
| `<falcon-dropdown>` or `<falcon-radio-group>` | Delivery Method (Email / SMS / Both) |
| (none) | **No password input** — server auto-generates per Step 2's `PasswordSecurityLevel` `[BRAIN-OUT] Add Client/06-STEP_5_ACCOUNT_OWNER.md:34` |

### Customization order rule (standing)

Per `[MEMORY] feedback_falcon_custom_library_mandatory.md`:

```
inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP
```

Add Client must be implemented as an **app-level wrapper** under `apps/admin-console/.../organization-hierarchy-page/add-client-wizard/` consuming pure-presentational library skeletons. Backend service calls live in the wrapper, never in the library skeleton (per `[MEMORY] feedback_library_skeleton_app_api.md`).

---

## Layer 14 — FE form + state

**Form choice per step.** Mix of Template-driven and Reactive Forms — Reactive Forms for steps with cross-field rules.

| Step | Form pattern | Why |
|---|---|---|
| 1 | Reactive `FormGroup` | Cross-field address cascade (`CountryRequiredWhenCityProvided`, etc.) requires programmatic validators |
| 2 | Reactive `FormGroup` | Cross-field `InvalidAccountLimits` + dynamic IP-list rows |
| 3 | Reactive `FormGroup` per row | `visibility.valueChanges.subscribe(...)` toggles validators on `priceType` + `priceValue` per `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:43-58` |
| 4 | Reactive `FormGroup` per row | Same as Step 3 |
| 5 | Reactive `FormGroup` | Async username uniqueness + delivery method coupling |

**Wizard state machine (FE-side).** Each step's form is buffered locally; submission only fires on Step 5 Submit. State container can be:
- An Angular service (e.g. `AddClientWizardStateService`) holding 5 `FormGroup` instances + a navigation pointer
- A signal-based store (`signal<Step1State | null>` × 5 + `currentStep: signal<1..5>`)

**Step transitions.** `[BRAIN-OUT] Add Client/00-OVERVIEW.md:47`:

```
[open wizard]
   │
   ▼ (load master catalogs in parallel: CommChannel, Application, Lookup)
Step 1 ─Next─► Step 2 ─Next─► Step 3 ─Next─► Step 4 ─Next─► Step 5 ─Submit─► [composite POST]
   ▲             ▲             ▲             ▲             ▲                       │
   └─Previous────┴─Previous────┴─Previous────┴─Previous────┘                       ▼
   │                                                                       [success toast + nav]
   └─Save Draft (FE-local; PRD silent on persistence)
```

**Critical wiring** — the canonical Step 3/4 reactive form pattern from `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:43-58`:

```typescript
visibility.valueChanges.subscribe(v => {
  if (v === true) { // 'Show'
    priceType.setValidators([Validators.required]);
    priceValue.setValidators([Validators.required, Validators.min(0)]);
  } else {
    priceType.clearValidators();
    priceValue.clearValidators();
    priceType.reset();
    priceValue.reset();   // clear stale value (defense in depth vs HiddenProductMustNotHavePricing 422)
  }
  priceType.updateValueAndValidity();
  priceValue.updateValueAndValidity();
});
```

**Pre-load master catalogs at wizard open** (parallel fetches): `GET /api/CommunicationChannel` · `GET /api/Application` · `GET /api/Lookup/{id}` × N for country/city/sector. `[BRAIN-OUT] Add Client/08-BACKEND_API.md:75-80`.

---

## Layer 15 — FE i18n keys

`[INFERRED]` — The Add Client playbook does NOT enumerate concrete i18n keys (Brain Outputs playbook silent on this layer). Below is the **recommended** key namespace, inferred from `apps/admin-console/.../organization-hierarchy-page` conventions and the standing rule that Falcon supports En + Ar via `MultiLanguage(En, Ar)` `[BRAIN-OUT] Add Client/09-COMPONENTS.md:49`.

**Recommended key prefix:** `admin-console.organization-hierarchy.add-client.*`

| Key | En | Ar |
|---|---|---|
| `add-client.title` | Add Client | إضافة عميل |
| `add-client.steps.1.title` | Account Information | معلومات الحساب |
| `add-client.steps.2.title` | Account Settings | إعدادات الحساب |
| `add-client.steps.3.title` | CommChannels & Services | قنوات الاتصال والخدمات |
| `add-client.steps.4.title` | Applications & Services | التطبيقات والخدمات |
| `add-client.steps.5.title` | Account Owner | مالك الحساب |
| `add-client.step1.account-name.label` | Account Name | اسم الحساب |
| `add-client.step1.account-name.placeholder` | Enter unique account name | أدخل اسم حساب فريد |
| `add-client.step1.account-name.error.taken` | This name is already in use | هذا الاسم مستخدم بالفعل |
| `add-client.step2.password-security.label` | Password Security Level | مستوى أمان كلمة المرور |
| `add-client.step2.allowed-ips.label` | Allowed IPs | عناوين IP المسموح بها |
| `add-client.step3.visibility.label` | Visibility | الظهور |
| `add-client.step3.pricing-type.label` | Pricing Type | نوع التسعير |
| `add-client.step5.delivery-method.label` | Delivery Method | طريقة التسليم |
| `add-client.actions.next` | Next | التالي |
| `add-client.actions.previous` | Previous | السابق |
| `add-client.actions.submit` | Submit | إرسال |
| `add-client.actions.cancel` | Cancel | إلغاء |
| `add-client.toast.success` | Client account created | تم إنشاء حساب العميل |
| `add-client.toast.partial-failure` | Account created but Account Owner creation failed — contact support | تم إنشاء الحساب لكن فشل إنشاء مالك الحساب — تواصل مع الدعم |

**Localization contract.** Error messages from `ServiceOperationResult<T>.errorMessages[0]` are **already localized server-side** — do NOT re-translate. The FE displays them as-is `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:103-105`.

`(no source — needs investigation)` — concrete i18n key names should be confirmed against the existing `apps/admin-console/src/assets/i18n/{en,ar}.json` files when this trace is acted on.

---

## Layer 16 — Test case (Gherkin)

Five scenarios cover happy path + the four most important failure modes. Assertions trace back to BR-AM-* (Layer 4), V-rules (Layer 5), and error codes (Layer 11).

```gherkin
Feature: Add Client wizard (5-step)
  As a Falcon System Administrator
  I want to onboard a new client tenant in one composite operation
  So that the new client has Account + Settings + Services + AO User + Wallet topology in one transaction

  Background:
    Given I am logged in to admin-console as "sysadmin" (sys-admin role)
    And I am on the Organization Hierarchy page
    And the "Falcon Clients" synthetic root is selected
    And the System Gateway is reachable at :7256

  Scenario: Happy path — sys-admin runs the full 5-step wizard
    Given I click "Add Client"
    Then the Add Client wizard dialog opens at Step 1 (Account Information)
    And the wizard pre-fetches in parallel: GET /api/CommunicationChannel, GET /api/Application, GET /api/Lookup/{country}
    When I fill Step 1 with:
      | Account Name      | AcmeCorp                                      |
      | Finance ID        | FIN-2026-001                                   |
      | Classification    | Critical                                       |
      | Sub-Category      | Bank                                           |
      | Authority Letter  | Government                                     |
      | Sector            | Public Sector                                  |
      | AuthorityLetterId | GOV-LIC-12345                                 |
      | Entity Name       | Acme Holding Co.                               |
      | Country           | Saudi Arabia                                   |
      | City              | Riyadh                                         |
    And I click Next
    Then the FE buffers Step 1 state locally (no API call)
    And the wizard advances to Step 2 (Account Settings)
    When I fill Step 2 with:
      | Password Security Level   | Advanced (submits as "High" per Q-UM-12 mapping) |
      | Allowed IPs               | 10.0.0.0/24, 192.168.1.50                         |
      | Max Normal User Limit     | 50                                                |
      | Max System User Limit     | 10                                                |
      | Max Node Levels           | 3                                                 |
      | Balance Transfer Limit %  | 80                                                |
    And I click Next
    And I configure 2 CommChannels in Step 3 (WhatsApp: Show + Monthly + 500; SMS: Show + OneTimePayment + 100)
    And I click Next
    And I skip Step 4 (no Applications configured — step is optional per BR-AM-18)
    And I click Next
    When I fill Step 5 with:
      | First Name      | Layla                |
      | Last Name       | Ahmad                |
      | Username        | layla.ahmad          |
      | Phone Number    | +966500000001        |
      | Email           | layla@acmecorp.sa    |
      | Role            | account-owner        |
      | Delivery Method | Both (Email + SMS)   |
    And I click Submit
    Then the FE composes CreateAccountRequest from buffered Steps 1-5
    And POSTs to <system-gateway>/commerce/Node/create-account with Bearer JWT
    And receives HTTP 200 with ServiceOperationResult { IsSuccessful: true, Result: { Id: <new-account-id> } }
    And Commerce persists synchronously: Main Node + Account + AccountSettings + 2 CommChannelConfig (both InActive (First time)) + 0 AppConfig
    And Commerce emits 4 Kafka events:
      | Topic                                       | Effect                                                                                |
      | commerce.user-creation-requested.v1         | Identity creates Zitadel user with PasswordPolicy(High); sends creds via Email + SMS  |
      | commerce.wallet-configured.v1               | Charging materializes Master Wallet (lump sum=0) + 2 sub-wallets if Multiple mode     |
      | commerce.identity-settings-sync.v1          | Identity syncs tenant identity settings (password policy + lockout)                   |
      | commerce.tenant-ip-allowlist-changed.v1     | Core Gateway refreshes Redis IP allowlist cache                                       |
    And the wizard shows a success toast
    And navigates back to Org Hierarchy with the new "AcmeCorp" client highlighted in the tree
    And the AO user "layla.ahmad" is in "Pending" status (per BR-UM-09; activates on first login)

  Scenario: Unique-name conflict — backend returns 409 DuplicateTenantName
    Given a client with Account Name "AcmeCorp" already exists in the system
    And I open the Add Client wizard
    When I type "AcmeCorp" into the Account Name field
    Then after 300 ms the FE calls GET /api/Node/ValidateAccountName?AccountName=AcmeCorp
    And the response is "true" (name exists)
    And the field shows the inline error "This name is already in use"
    And the Next button is disabled
    # Defense in depth: even if the async check is bypassed, backend returns 409 on submit
    When I (somehow) bypass the FE check and submit via Step 5
    Then the backend returns HTTP 409 with errorMessages[0] = "Tenant name already in use"
    And the FE displays the localized errorMessages[0] inline on the Account Name field
    And the Falcon Stepper highlights Step 1 in error state
    And the wizard scrolls to the first error

  Scenario: IP validation failure — backend returns 403 InvalidIpAddress
    Given I am on Step 2
    When I add an invalid IP "10.0.300.1" to the Allowed IPs list
    And I click Submit on Step 5 (composite POST)
    Then the backend returns HTTP 403 with errorMessages[0] = (localized "Invalid IP address")
    And per BR-UM-24 enumeration-leak protection, the FE shows a GENERIC toast "Request not permitted from your network"
    And the FE does NOT differentiate this from a credentials error
    And the wizard state is preserved (operator can correct the IP and resubmit)

  Scenario: OTP-style password delivery — auto-generated password via Email
    Given I complete Steps 1-4 successfully
    And I fill Step 5 with Delivery Method = "Email" (only)
    When I click Submit
    Then the composite POST succeeds (HTTP 200)
    And the Commerce handler emits commerce.user-creation-requested.v1 with DeliveryMethod = Email
    And Identity's UserCreationRequestedConsumer:
      | Step                                                      | Outcome                                              |
      | Creates a Zitadel user with username "layla.ahmad"        | Zitadel returns userId                               |
      | Resolves the tenant's PasswordSecurityLevel from Step 2   | Tier = "High"                                        |
      | Generates a complexity-compliant initial password         | e.g. "Kx7!mP9qR2$z" (length + class per High tier)   |
      | Sends the password email to layla@acmecorp.sa             | Email delivered (no SMS, per DeliveryMethod = Email) |
      | Sets the user status to "Pending" per BR-UM-09            | User pending until first successful login            |
    And the FE never sees the generated password (server-only)
    And the AO must change the password on first login (force-change per PRD-02 W2)

  Scenario: Partial failure — Account persisted but Identity hop fails after
    Given I complete Steps 1-5 successfully and click Submit
    And Commerce persists synchronously: Main Node + Account + AccountSettings + N×CommChannelConfig + N×AppConfig
    But Identity's UserCreationRequestedConsumer fails when calling Zitadel (network timeout)
    Then the Commerce handler still returns HTTP 500 with errorMessages[0] = (localized "External service unavailable")
    And the error code is CreateIdentityUserFailed or ZitadelCreateMachineUserFailed or ExternalServiceTimeout
    And the FE displays the toast: "Account created but Account Owner creation failed — contact support"
    And the FE preserves the wizard state (Steps 1-5 inputs retained in memory)
    And the FE does NOT close the dialog automatically (operator can retry Step 5)
    # Recovery (documented as a gap): re-trigger Identity user creation for an existing Account
    # may require a different endpoint than the original composite POST. See 12-ERROR_STATES.md:56.
```

---

## Layer 17 — Port artifact

**admin-console source path** (recommended placement, per `[BRAIN-OUT] Add Client/09-COMPONENTS.md:53` + `[MEMORY] feedback_library_skeleton_app_api.md`):

```
apps/admin-console/
└── src/app/.../organization-hierarchy-page/
    └── add-client-wizard/
        ├── add-client-wizard.component.{ts,html}
        ├── models/models.ts                      ← types + DTOs
        ├── services/add-client.service.ts        ← composite POST + pre-fetch + async uniqueness
        ├── validations/validations.ts            ← per-step cross-field validators
        ├── steps/
        │   ├── step-1-account-info/
        │   │   ├── step-1-account-info.component.{ts,html}
        │   │   ├── models/models.ts
        │   │   ├── services/info.service.ts      ← async account-name uniqueness
        │   │   └── validations/validations.ts
        │   ├── step-2-settings/
        │   ├── step-3-comm-channels/
        │   ├── step-4-apps/
        │   └── step-5-account-owner/
        │       └── services/user.service.ts      ← async username uniqueness
        └── shared/
            └── add-client-wizard-state.service.ts ← 5 buffered FormGroups
```

Reference for the canonical folder + validation doctrine: `[BRAIN-OUT] strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §7 (per `[MEMORY] project_falcon_component_validation_convention.md`).

**Does Add Client port to mgmt-console (management-console)?**

**NO — and the rationale is load-bearing.** Per Layer 3, only `sys-admin` + `sys-products` can run Add Client (`sys.account / add` is allow-only for these two roles). Both are Falcon-namespace roles (`eUserType.Falcon` = 1). The `acc-*` namespace (Client-side users — `acc-owner`, `acc-admin`, `acc-user`) has **no rule** for `sys.account / add` — silent deny.

The management-console (`mgmt-console:4301`) is the Client-facing app. Its app entry gate is `app.management-console / view`, which:
- `sys-admin` cannot access (no rule — `[BRAIN-OUT] sys-admin.md:95`)
- `sys-products` cannot access (no rule)
- `acc-*` roles CAN access (per their seed rules)

Since the act of adding a client is a Falcon-staff operation (BR-AM-02), it logically cannot exist in the Client-facing console. **Adding a port to mgmt would create a security boundary violation** — a client should never be able to onboard another client.

**Document instead of port.** The mgmt-side equivalents are:
- `acc-owner` (Account Owner) on mgmt-console can **invite users** into their own account hierarchy via the Add User flow (`acc.user / add`). That's a different operation (intra-tenant user mgmt), not client onboarding.
- `acc-admin` (Node Admin) can manage users on sub-nodes within their account (`acc.user / add` scoped by path).

So the mgmt-side counterpart of Add Client is **not Add Client** — it is **Add User** (sister flow with its own playbook at `[BRAIN-OUT] understanding/pages/organization-hierarchy/flows/Add User.md`).

**Verdict.** Add Client is **admin-only** by hard architectural design. Cross-references in this document point at the Add User playbook for the mgmt-side analogue.

---

## Layer 18 — Capability map verdict per role

The final answer: of the 6 PES-defined roles, **only 2 PASS** the Add Client gate. `[BRAIN-OUT] 14-flow-playbook-integration/Add-Client.integration.md:18-26`.

| Role | App entry | `sys.account / add` | Verdict | Reason |
|---|---|---|---|---|
| `sys-admin` (System Administrator) | admin-console allow | ✅ allow `[CODE] BuiltInRoleCatalog.cs:87` | **✅ PASS** | Top Falcon staff role; explicit allow |
| `sys-products` (Products) | admin-console allow | ✅ allow `[CODE] BuiltInRoleCatalog.cs:142` | **✅ PASS** | Commercial admin; explicit allow |
| `sys-ops` (Operation) | admin-console allow | — silent deny (no rule) | ❌ FAIL | Per PRD-01 OVERVIEW Actors row 3: "Operation cannot add clients" |
| `acc-owner` (Account Owner) | management-console allow | — silent deny (no `sys.*` rules) | ❌ FAIL | Cross-namespace — `acc-*` has no `sys.*` reach |
| `acc-admin` (Node Admin) | management-console allow | — silent deny | ❌ FAIL | Same cross-namespace bar |
| `acc-user` (Normal User) | management-console allow | — silent deny | ❌ FAIL | Transactional only; no admin rights |

**Wider context** — Add Client is the **tightest** of the 4 Organization Hierarchy flows by role count:

| Flow | Roles that can run | Source |
|---|---|---|
| Add Client | 2 / 6 (sys-admin + sys-products) | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md` |
| Add User | 4 / 6 (sys-admin + sys-products + acc-owner + acc-admin) | `[BRAIN-OUT] flows/Add User.md` |
| Add Node | 4 / 6 | `[BRAIN-OUT] flows/Add Node.md` |
| Edit Node | 4 / 6 | `[BRAIN-OUT] flows/Edit Node.md` |

This asymmetry reflects the business model: clients are the **scope** of Falcon — only Falcon staff can mint new scopes; everything else (users, nodes, services) is intra-scope and reachable by both Falcon and the client's own owner/admin.

---

## Runtime verification status

`[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md` shows a sister flow (comms-hub mgmt-console gate) is `🟡 PARTIAL` — backend PES gate verified (21/21 PASS) but the FE-level UI gate is blocked on dev-server + env drift.

**Per-layer verification status for Add Client** (best assessment from available evidence):

| Layer | Verdict | Evidence |
|---|---|---|
| 1 — Business intent | 🟢 spec-verified | `[BRAIN-OUT] Add Client/00-OVERVIEW.md` published as canonical spec |
| 2 — PRD requirement | 🟢 spec-verified | PRD-01 BR-AM-* + WORKFLOWS §W1 are authored documents |
| 3 — Permission gate | 🟢 code-verified | `[CODE] BuiltInRoleCatalog.cs:79-167` reads as the seed; backend PES enforces |
| 4 — BR-AM rules | 🟢 spec-verified | 42 rules enumerated in PRD `BUSINESS_RULES.md` |
| 5 — V-rules per step | 🟢 vault-verified | 9 V-rules with code citations in `[VAULT] _obsidian/30-Validation/` |
| 6 — E-* entity drift | 🟢 vault-verified | 7 entities mapped in `[VAULT] _obsidian/40-API/E-*.md` |
| 7 — Backend DTOs | 🟡 spot-checked | DTO shape from `[BRAIN-OUT] DTO_DICTIONARY.md`; nested `Service` type partially undocumented `[BRAIN-OUT] Add Client/04-STEP_3_COMM_CHANNELS.md:24` |
| 8 — Backend endpoint + handler | 🟡 spot-checked | Endpoint path + auth verified; handler internals not source-cited |
| 9 — FluentValidator + handler-time gate | 🟡 spot-checked | Cross-field rules + error codes documented; full validator chain not source-cited |
| 10 — Kafka events | 🟢 spec-verified | 4 topics + publishers + consumers documented `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:29-32` |
| 11 — Error codes | 🟢 catalog-verified | 30+ codes mapped to HTTP status in `[BRAIN-OUT] 13-error-catalog/CATALOG.md` |
| 12 — FE route + PES gate | 🟢 code-verified | `falcon-access.registry.ts` is the SoT; both keys exist |
| 13 — FE components | 🟢 spec-verified | Falcon UI Core component map enumerated in `[BRAIN-OUT] Add Client/09-COMPONENTS.md` |
| 14 — FE form + state | 🟡 spot-checked | Reactive Forms pattern is canonical; specific state-container choice (signal vs service) not fixed |
| 15 — FE i18n keys | 🔴 unverified | `[INFERRED]` — playbook silent; concrete keys need to be confirmed against existing i18n bundles |
| 16 — Test case (Gherkin) | 🟡 spot-checked | Scenarios composed from documented BRs + V-rules + error codes; need to be run against a live stack |
| 17 — Port artifact | 🟢 spec-verified | admin-only by architectural design; rationale traced to BR-AM-02 |
| 18 — Capability map per role | 🟢 code-verified | `BuiltInRoleCatalog.cs` seed rules + per-role capability maps |

**No layer has been ✋ runtime-verified for Add Client specifically.** The closest runtime evidence is the sister `comms-hub` flow verification in `[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md`, which showed the backend PES gate works correctly (21/21) but the FE was blocked on infrastructure issues. Add Client runtime verification awaits a working FE stack with seeded sysadmin user (`[MEMORY] project_local_backend_test_users_2026_05_16.md` — sysadmin password is `Admin@1234`).

---

## The traceability backbone

This section shows how **layer N+1 is uniquely determined by layer N** — the data flows downhill, each layer is consequent on the one above.

```
[1] Business intent: "onboard a new client tenant"
    │
    │ (PRD authors translate the intent into rules)
    ▼
[2] PRD requirement: PRD-01 WORKFLOWS §W1 — 5-step wizard authored
    │
    │ (BR-AM-02 fixes the role gate at PRD level)
    ▼
[3] Permission gate: sys-admin + sys-products only (PES allow)
    │
    │ (PRD BR-AM-01..42 fixes the field rules at workflow level)
    ▼
[4] BR-AM rules: 28 cross-field/workflow rules apply
    │
    │ (Each rule that's a per-field invariant becomes a V-rule)
    ▼
[5] V-rules per step: 9 V-rules cover the field-level invariants
    │
    │ (Each V-rule names the DTO field + attribute that enforces it)
    ▼
[6] E-* entity drift: 7 entities created (Account, Settings, Configs, User, Wallet, Node) — drift items per entity
    │
    │ (Backend persists entities via composite DTO)
    ▼
[7] Backend DTO: CreateAccountRequest composite shape + [ThrowIf*] attributes
    │
    │ (The DTO is consumed by ONE endpoint)
    ▼
[8] Backend endpoint: POST /api/Node/create-account on NodeController
    │
    │ (Pre-processor runs [ThrowIf*]; handler runs cross-field + handler-time gates)
    ▼
[9] FluentValidator + handler-time gate
    │
    │ (On commit success, the handler produces 4 Kafka events)
    ▼
[10] Kafka events: 4 topics — Identity + Charging + Identity-settings + Core-Gateway
    │
    │ (Every validation/handler/Kafka path can fail with mapped error codes)
    ▼
[11] Error codes: 30+ codes across 5 HTTP status classes
    │
    │ (Frontend must surface them; FE route must gate access)
    ▼
[12] FE route + PES gate: data.access = FalconAccess.adminConsole.account.add
    │
    │ (Once gated, FE composes the wizard from Falcon UI Core)
    ▼
[13] FE components: 5 step panels using <falcon-*> kit
    │
    │ (Each component wires into a FormGroup state machine)
    ▼
[14] FE form + state: Reactive FormGroups buffered locally, composite POST on Step 5
    │
    │ (Display copy is i18n-resolved; error messages from backend already localized)
    ▼
[15] FE i18n keys: en + ar resolutions per field
    │
    │ (Tests assert the full chain — happy + failure modes)
    ▼
[16] Test case (Gherkin): 5 scenarios covering happy + 4 failure modes
    │
    │ (Codebase placement follows folder doctrine)
    ▼
[17] Port artifact: admin-console only — no mgmt-console port (security boundary)
    │
    │ (Per-role capability verdict — the actual runtime answer)
    ▼
[18] Capability map per role: 2 of 6 roles PASS
```

**Implication.** A change in layer 1 (e.g. "now clients can also onboard sub-clients") cascades downward and re-opens every layer below. Conversely, an audit at layer 18 (a role's capability map) can be unwound back to layer 2 (which BR or PRD line authorized this) — making this trace **bidirectional** for compliance and impact analysis.

---

## Cross-references

### Source playbook (Brain Outputs, 17 files — canonical SoT)

- [README](../../../understanding/pages/organization-hierarchy/Add%20Client/README.md) — load first
- [00-OVERVIEW](../../../understanding/pages/organization-hierarchy/Add%20Client/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../understanding/pages/organization-hierarchy/Add%20Client/01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](../../../understanding/pages/organization-hierarchy/Add%20Client/02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](../../../understanding/pages/organization-hierarchy/Add%20Client/03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](../../../understanding/pages/organization-hierarchy/Add%20Client/04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](../../../understanding/pages/organization-hierarchy/Add%20Client/05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](../../../understanding/pages/organization-hierarchy/Add%20Client/06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](../../../understanding/pages/organization-hierarchy/Add%20Client/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../understanding/pages/organization-hierarchy/Add%20Client/08-BACKEND_API.md)
- [09-COMPONENTS](../../../understanding/pages/organization-hierarchy/Add%20Client/09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](../../../understanding/pages/organization-hierarchy/Add%20Client/10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](../../../understanding/pages/organization-hierarchy/Add%20Client/11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](../../../understanding/pages/organization-hierarchy/Add%20Client/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../understanding/pages/organization-hierarchy/Add%20Client/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../understanding/pages/organization-hierarchy/Add%20Client/14-IMPLEMENTATION_CHECKLIST.md)

### Authority dataset clusters (this dataset)

- [01-roles/sys-admin](../01-roles/sys-admin.md) — full PES rule list for sys-admin (the primary role)
- [01-roles/sys-products](../01-roles/sys-products.md) — secondary role
- [02-statuses/account-creation-status](../02-statuses/account-creation-status.md) — 7-stage server-side wizard status
- [02-statuses/user-status](../02-statuses/user-status.md) — AO user lifecycle (`Pending` → `Active`)
- [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md) — `FalconAccess.adminConsole.account.add` line 36
- [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
- [05-capability-maps/sys-admin.capability](../05-capability-maps/sys-admin.capability.md) — Add Client row at `:50`
- [05-capability-maps/sys-products.capability](../05-capability-maps/sys-products.capability.md)
- [06-validation-by-feature/MATRIX](../06-validation-by-feature/MATRIX.md) — 9 V-rules applied to OH column
- [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md) — System Gateway path-transform
- [08-entity-drift-by-feature/MATRIX](../08-entity-drift-by-feature/MATRIX.md) — 7 entities × OH column
- [09-business-rules-by-feature/MATRIX](../09-business-rules-by-feature/MATRIX.md) — 28 BR-AM-* rules in OH column
- [13-error-catalog/CATALOG](../13-error-catalog/CATALOG.md) — full FalconKeys.Error.* catalog
- [13-error-catalog/FE-CONTRACT](../13-error-catalog/FE-CONTRACT.md) — FE handling contract
- [14-flow-playbook-integration/Add-Client.integration](../14-flow-playbook-integration/Add-Client.integration.md) — authority-lens integration

### Brain SK vault notes (V-rules + Entities)

- [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md)
- [`V-password-security-level-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-security-level-enum.md)
- [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md)
- [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md)
- [`V-service-visibility-pricing-required`](../../../../Brain%20SK/_obsidian/30-Validation/V-service-visibility-pricing-required.md)
- [`V-user-first-last-name-letters-only`](../../../../Brain%20SK/_obsidian/30-Validation/V-user-first-last-name-letters-only.md)
- [`V-username-format-uniqueness-immutable`](../../../../Brain%20SK/_obsidian/30-Validation/V-username-format-uniqueness-immutable.md)
- [`V-password-complexity-per-security-level`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-complexity-per-security-level.md)
- [`V-normal-user-limit-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-normal-user-limit-enforcement.md)
- [`E-account`](../../../../Brain%20SK/_obsidian/40-API/E-account.md)
- [`E-account-settings`](../../../../Brain%20SK/_obsidian/40-API/E-account-settings.md)
- [`E-user`](../../../../Brain%20SK/_obsidian/40-API/E-user.md)
- [`E-node`](../../../../Brain%20SK/_obsidian/40-API/E-node.md)

### Memory standing rules (load-bearing for implementation)

- `[MEMORY] project_falcon_component_validation_convention.md` — folder + DI doctrine
- `[MEMORY] feedback_library_skeleton_app_api.md` — library vs app-level wrapper rule
- `[MEMORY] feedback_falcon_custom_library_mandatory.md` — Falcon UI kit first; no PrimeNG
- `[MEMORY] feedback_no_inline_styles_tokens_only.md` — Tailwind utilities + tokens only
- `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md` — PES subject MUST be Zitadel id
- `[MEMORY] feedback_frontend_auth_identity_service.md` — FE never calls Zitadel directly
- `[MEMORY] feedback_test_user_password_standard.md` — every test user uses `Admin@1234`

### Sibling integration files (authority-dataset 14- cluster)

- [Add-User.integration](../14-flow-playbook-integration/Add-User.integration.md) — Step 5 of Add Client produces an AO via the same DTO shape (`CreateUserRequest`) but via Kafka (vs HTTP for standalone Add User)
- [Add-Node-and-Edit-Node.integration](../14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md) — sister flows on the same page
- [MATRIX](../14-flow-playbook-integration/MATRIX.md) — master 4-flows view
