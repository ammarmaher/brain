---
type: integration-matrix
cluster: 14-flow-playbook-integration
flows: 4
purpose: "Answers 'all 4 org-hierarchy flows indexed by PES, roles, V-rules, entities, BR rules, status, errors, Kafka — at a glance'. Open to compare flows or find which flow uses which rule."
extracted: 2026-05-16
---

# Flow Playbook Integration Matrix — 4 flows × authority lens

> [!tldr]
> Four flow playbooks (Add Client · Add User · Add Node · Edit Node) indexed by authority lens: PES gate · allowed roles · V-rules · entities consumed · BR rules · status transitions · error codes · Kafka events. Every row cites the playbook line where the fact lives — do not re-discover.

## Flow inventory

| Flow | Trigger entry point | Primary role(s) | # steps | PRD module | Playbook file path |
|---|---|---|---|---|---|
| **Add Client** | Admin-console Organization-Hierarchy page → `Add Client` button (only rendered for `FalconAccess.adminConsole.account.add()` `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md:74`) | `sys-admin` · `sys-products` (2 of 6 roles) `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:9-16` | 5-step wizard | PRD-01 Account Management | `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` (folder, 17 files) |
| **Add User** | Both consoles · Users list `Add User` button **or** Node right-pane `Add User` quick-action **or** tree `'add-user'` action `[BRAIN-OUT] flows/Add User.md:14-19` | 5 of 6 roles (all except `acc-user`): `sys-admin` · `sys-ops` · `sys-products` (any user type) · `acc-owner` (account-user + org-user) · `acc-admin` (org-user only) `[BRAIN-OUT] flows/Add User.md:25-32` | 3-tab wizard | PRD-02 User Management | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md` |
| **Add Node** | Both consoles · Hierarchy tab → tree row kebab `Add sub-node` (or row-hover `+` icon) `[BRAIN-OUT] flows/Add Node.md:11-16` | `sys-admin` · `sys-ops` · `sys-products` · `acc-owner` · `acc-admin` (5 of 6 — all except `acc-user`) `[BRAIN-OUT] flows/Add Node.md:21-29` | 1-dialog | PRD-01 Account Management | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md` |
| **Edit Node** (rename / scheduled rename) | Both consoles · Hierarchy tab → tree row kebab `Rename` / `Schedule rename` `[BRAIN-OUT] flows/Edit Node.md:20-29` | Same as Add Node (scope-restricted for acc-*) — 5 of 6 roles `[BRAIN-OUT] flows/Edit Node.md:32-41` | 1-dialog (immediate or scheduled) | PRD-01 Account Management | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md` |

## Master matrix — 4 flows × authority lens

| | Add Client | Add User | Add Node | Edit Node (rename) |
|---|---|---|---|---|
| **PES gate (FE)** | `FalconAccess.adminConsole.account.add()` → resource `sys.account` · action `add` `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:36` | `FalconAccess.managementConsole.accountUser.add()` (account-level) **OR** `FalconAccess.managementConsole.orgUser.add()` (org-level) **OR** Falcon-side via `sys.user.add` (Wave 1.3.0) `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:52, 68-69` | `FalconAccess.managementConsole.organization.add()` → `acc.organization.add` (Client side); no separate sys-side key — tree `'add-node'` action is always in `allowedTreeActions` for admin `[BRAIN-OUT] flows/Add Node.md:30` + `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md:91` | `FalconAccess.managementConsole.organizationHierarchy.renameNode()` (per playbook); no separate seed PES key — gated through tree row action `[BRAIN-OUT] flows/Edit Node.md:43` |
| **Allowed roles (✅ count)** | 2 of 6 — sys-admin · sys-products `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:9-16` | 5 of 6 — sys-admin · sys-ops · sys-products · acc-owner (broadest target reach) · acc-admin (org-user only) `[BRAIN-OUT] flows/Add User.md:27-32` | 5 of 6 — all except acc-user `[BRAIN-OUT] flows/Add Node.md:22-29` | 5 of 6 — same as Add Node (with acc-* scope-restricted to own subtree) `[BRAIN-OUT] flows/Edit Node.md:36-41` |
| **V-rules used** | 9 — V-account-name-format-uniqueness · V-password-security-level-enum · V-account-ip-allowlist-enforcement · V-account-limits-zero-means-no-limit · V-service-visibility-pricing-required · V-user-first-last-name-letters-only · V-username-format-uniqueness-immutable · V-password-complexity-per-security-level · V-normal-user-limit-enforcement `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:11-22` | 5 — V-user-first-last-name-letters-only · V-username-format-uniqueness-immutable · V-password-complexity-per-security-level · V-normal-user-limit-enforcement · V-account-ip-allowlist-enforcement (at first-login, post-creation) `[BRAIN-OUT] flows/Add User.md:72-74, 117, 256-258` | 3 — V-subnode-name-maxlength-30 · V-account-limits-zero-means-no-limit (gates `MaxNodeLevel`) · V-account-name-format-uniqueness (sister rule — letter-prefix may or may not apply) `[BRAIN-OUT] flows/Add Node.md:96-100` | 4 — V-subnode-name-maxlength-30 · V-account-name-format-uniqueness (sister) · V-account-limits-zero-means-no-limit (Op 5 only) · V-password-security-level-enum (Op 5 only) `[BRAIN-OUT] flows/Edit Node.md:171-175` |
| **Entities consumed (E-\*)** | 7 — E-account · E-account-settings · E-comm-channel-config · E-app-config · E-user (AO) · E-master-wallet · E-node (Main) `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:11-19` | 3 — E-user (created) · E-otp-challenge (post-creation first-login) · E-session (post-creation first-login) `[BRAIN-OUT] flows/Add User.md:336` | 2 — E-node (primary; created) · E-account-settings (read-only — `MaxNodeLevel` gate) `[BRAIN-OUT] flows/Add Node.md:92-94` | 2 — E-node (mutated) · E-account-settings (Op 5 only) `[BRAIN-OUT] flows/Edit Node.md:165-169` |
| **BR rules** (PRD business rules) | BR-AM-02 (who can create accounts) · BR-AM-03 (account-name letter-prefix + uniqueness) · BR-AM-20 (initial service status = `InActive (First time)`) · BR-AM-28 (Master Wallet lump sum = 0 until first contract activates) · BR-UM-03/04 (one AO per account · Node Admin scope) · BR-UM-09 (new user in `Pending`) · BR-UM-15/18 (credential delivery) `[BRAIN-OUT] Add Client/README.md:69 + Add Client/01-PERMISSIONS.md:7` | BR-UM-01..05 (role catalog) · BR-UM-07 (quota counts Pending/Active/Suspended/Locked; Deleted excluded) · BR-UM-08 (status transitions) · BR-UM-10 (default Pending on create) · BR-UM-11..16/19 (Personal Info rules) · BR-UM-17 (status on create) · BR-UM-18 (delivery method confirmation) · BR-UM-24 (IP-allowlist generic reject) · BR-UM-42 (one Permission Group per user) · BR-UM-48 (profile-picture limits — silent) `[BRAIN-OUT] flows/Add User.md:27, 45-47, 117-118, 263` | BR-AM-01 (3-level Root/Main/Sub hierarchy) `[BRAIN-OUT] flows/Add Node.md:19` | BR-AM-03 (rename name format — letter-prefix may apply) · sister rules to Add Node `[BRAIN-OUT] flows/Edit Node.md:56, 175` |
| **Status transitions (initial → next)** | Account: → `Pending` (→ Active on first Contract activate · W8) · AO User: → `Pending` (→ Active on first-login) · CommChannelConfig × N: → `InActive (First time)` (→ Paid → Active via W4) · AppConfig × N: same · Master Wallet: → abstract (lump sum 0; → Funded on first ContractActivated) `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:11-19` + `[BRAIN-OUT] 02-statuses/account-creation-status.md:14-24` (7-stage wizard lifecycle: Pending → InfoCompleted → SettingsCompleted → ServicesConfigured → AppsConfigured → OwnerCreated → Completed) | User: → `Pending` (→ Active on first-login + IP + OTP + force-change-password · → Locked on 3 wrong logins/OTPs) `[BRAIN-OUT] flows/Add User.md:200-228` + `[BRAIN-OUT] 02-statuses/user-status.md:13-37` | Node: created (no explicit status) `[BRAIN-OUT] flows/Add Node.md:56-61` | Node: `Name` mutated immediately (or queued by `EffectiveDate` for scheduled rename) `[BRAIN-OUT] flows/Edit Node.md:66-69, 102-105` |
| **Error codes** (HTTP status range) | 400 (~17) · 409 (3: `DuplicateTenantName` · `DuplicateUsername` · `DuplicateNodeName`) · 422 (~7) · 403 (3) · 401 (2) · 500 (5+ Identity/Zitadel) `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:11-30` | 400 (~8) · 409 (`DuplicateUsername`) · 422 (`NormalUserLimitReached` · `InvalidRoleForUserType` · `FalconUserMustNotHaveTenantId`) · 403 (`UnauthorizedUserToPerformThisAction`) · 500 (`CreateIdentityUserFailed`) `[BRAIN-OUT] flows/Add User.md:184` | 400 (`ParentIdRequired` · `RequiredFieldMissing` · `MaxLengthExceeded`) · 404 (`ParentNodeRequired` · `NodeNotFound`) · 409 (`DuplicateNodeName`) · 422 (`MaxNodeLevelReached` · `RootNodeCannotHaveSubNodes` · `ActionsNotAllowedOnDeletedNode` · `InvalidNodeLevel`) · 403 (`UnauthorizedAction`) `[BRAIN-OUT] flows/Add Node.md:49, 65-76` | 400 (`NodeNameRequired` · `MaxLengthExceeded`) · 404 (`NodeNotFound`) · 409 (`DuplicateNodeName`) · 422 (`NoChangesToUpdate` · `NewNodeNameNotApplyed` (typo) · `ActionsNotAllowedOnDeletedNode` · `EffectiveDateMustBeInFuture`) · 403 (`UnauthorizedAction`) `[BRAIN-OUT] flows/Edit Node.md:63, 73-82, 111-115` |
| **Kafka events emitted** | 4 — `commerce.user-creation-requested.v1` (→ Identity creates AO user · Zitadel + credential dispatch) · `commerce.wallet-configured.v1` (→ Charging materializes Master Wallet + sub-wallets) · `commerce.identity-settings-sync.v1` (→ Identity syncs tenant settings) · `commerce.tenant-ip-allowlist-changed.v1` (→ Core Gateway refreshes Redis IP cache) `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:27-33` | 1 — `identity.user-events.v1` (→ PES `UserRoleLinkSyncRequestedConsumer` refreshes role/policy linkage; eventual consistency — wizard does NOT wait) `[BRAIN-OUT] flows/Add User.md:135, 231-232` | 0 verified — `NodeCreated` not visible in Commerce ENDPOINT_REGISTRY for `CreateSubNode`; Kafka emission unverified `[BRAIN-OUT] flows/Add Node.md:60` | 0 verified — `NodeRenamed` event possible but unverified `[BRAIN-OUT] flows/Edit Node.md:69` |

## Per-flow drill-downs

The columns above are summaries. Each flow has its own integration file with full sourcing.

| Flow | Drill into |
|---|---|
| Add Client | [Add-Client.integration](Add-Client.integration.md) |
| Add User | [Add-User.integration](Add-User.integration.md) |
| Add Node | [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) §Add Node |
| Edit Node | [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) §Edit Node |

## Cross-flow dependencies

```
                       ┌─────────────────────────────────────────┐
                       │  Add Client (Falcon staff only · sys)   │
                       │  · Step 1-4 build Commerce-side state   │
                       │  · Step 5 produces UserCreationRequested│
                       │    Kafka → Identity creates AO user     │
                       └────────────┬────────────────────────────┘
                                    │  produces "first AO user" — same DTO shape
                                    │  (CreateUserRequest) but ASYNC via Kafka
                                    ▼
   ┌────────────────────────────────────────────────────────────────┐
   │              Tenant now exists with an Account Owner            │
   │              (AccountSettings · MaxNodeLevel = N · MaxUserLimit)│
   └────────────┬────────────────────────────────┬──────────────────┘
                │                                │
                ▼                                ▼
   ┌─────────────────────────┐    ┌─────────────────────────────────┐
   │  Add Node (acc-owner +  │    │  Add User (Falcon staff for     │
   │  acc-admin + sys-*)     │    │  sys-*, acc-owner for acc-*,    │
   │  · synchronous · 1 POST │    │  acc-admin for org-user only)   │
   │  · bounded by MaxNodeLvl│    │  · synchronous · 3-tab wizard   │
   │  · cannot run before    │    │  · bounded by MaxNormalUserLimit│
   │    Main Node exists     │    │  · BR-UM-03: one AO per tenant  │
   └────────────┬────────────┘    └────────────────────────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  Edit Node (rename)     │
   │  · acts on existing node│
   │  · same role matrix     │
   │  · scheduled rename =   │
   │    backend ➕ extra      │
   └─────────────────────────┘
```

Hard ordering:

1. **Add Client MUST precede Add User on the new tenant** — Add User for `acc-*` roles requires the tenant to exist. The first AO user is produced by Step 5 of Add Client via Kafka; subsequent users go through the dedicated Add User wizard.
2. **Add Client MUST precede Add Node on the new tenant** — A Main node (= Account) must exist before any sub-node can be added. The Main node is created **inside** the `CreateAccountRequest` server-side; there is no standalone "create main node" endpoint.
3. **Add Node MUST precede Edit Node on the same node** — Trivially, the node must exist before its name can be edited.
4. **Add User has independent ordering vs Add Node within the same tenant** — Users can be added before or after additional sub-nodes; users are created against any existing node (Main or sub).

Cross-flow validation interactions:

- `BR-UM-03` "one AO per account" — enforced **at submit time** on Add User if Role = account-owner is selected on a tenant that already has one (Identity handler returns 422). The Add User UI should filter the Role dropdown via PES to remove account-owner when an AO already exists. The check is **not** part of the Add Client Step 5 path because that's the *first* AO and the tenant is being created in the same transaction.
- `MaxNormalUserLimit` — set in Add Client Step 2 (or default 0 = no limit per `V-account-limits-zero-means-no-limit`); enforced at Add User submit via `UserQuotaPolicy.EnforceOnCreate(...)` → 422 `NormalUserLimitReached`.
- `MaxNodeLevel` — set in Add Client Step 2; enforced at Add Node submit → 422 `MaxNodeLevelReached`.
- `account.PasswordSecurityLevel` — set in Add Client Step 2; read by Add User at Tab 1 to generate the auto-password preview via anonymous `POST /api/user/generate-password`. Vocabulary drift Q-UM-12 (PRD `Normal/Advanced` vs code `Low/Medium/High/Strict`).

## Cross-references

### Upstream — authority dataset
- [01-roles/sys-admin](../01-roles/sys-admin.md) · [01-roles/sys-products](../01-roles/sys-products.md) · [01-roles/sys-ops](../01-roles/sys-ops.md)
- [01-roles/acc-owner](../01-roles/acc-owner.md) · [01-roles/acc-admin](../01-roles/acc-admin.md) · [01-roles/acc-user](../01-roles/acc-user.md)
- [02-statuses/account-creation-status](../02-statuses/account-creation-status.md) · [02-statuses/user-status](../02-statuses/user-status.md)
- [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md)
- [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
- [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md)

### Downstream — playbooks
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/01-PERMISSIONS.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/08-BACKEND_API.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/10-KAFKA_SIDE_EFFECTS.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/11-STATE_TRANSITIONS.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`
- `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`

### Phase 2 cross-cluster matrices (not yet materialized)
- `06-validation-by-feature/MATRIX.md` (TBD)
- `08-entity-drift-by-feature/MATRIX.md` (TBD)
- `09-business-rules-by-feature/MATRIX.md` (TBD)
- `10-non-pes-gates-by-feature/MATRIX.md` (TBD)
- `13-error-catalog/CATALOG.md` (TBD)

When these land, every per-flow file in this cluster should be updated to cite the matrix line instead of the playbook directly.
