---
type: a-to-z-trace
feature: Add Node
trace-depth: 18 layers
exemplar: false
purpose: "Full A→Z trace for the Add Node (sub-node creation) flow — single-dialog, no wizard, backed by POST /api/Node/create-SubNode. Models exactly on the Add-Client.trace.md exemplar."
audience: AI agents + developers needing a complete picture of the Add Node sub-flow on Organization Hierarchy
extracted: 2026-05-16
---

# Add Node — A→Z Implementation Trace

## TL;DR

Add Node creates a **sub-node under an existing parent node** in the Falcon account hierarchy. It is a **single-dialog flow** (NOT a wizard like Add Client) backed by exactly one HTTP call to `POST /api/Node/create-SubNode` with a 2-field DTO (`ParentId` + `Name`). The action lives on **both** consoles — admin-console (for sys-* users via System Gateway) and management-console (for acc-owner / acc-admin via Core Gateway) — because the gating is per-scope, not per-namespace: 5 of 6 roles can run it. The runtime cap is `AccountSettings.MaxNodeLevel`; breach surfaces as 422 `MaxNodeLevelReached`. This trace walks the 18 standard layers in the same shape as `Add-Client.trace.md`. `[BRAIN-OUT] flows/Add Node.md:5-15`.

## The 18-layer trace at a glance

| # | Layer | What it answers | Primary source |
|---|---|---|---|
| 1 | Business intent | What user need does this serve? | `[BRAIN-OUT] flows/Add Node.md:7` |
| 2 | PRD requirement | Which PRD lines authorize this flow? | `[BRAIN-OUT] prd/modules/01-account-management/BUSINESS_RULES.md` BR-AM-01 + `[BRAIN-OUT] prd/modules/01-account-management/ENTITIES.md` (Node entity) |
| 3 | Permission gate | Who can run it (role × resource × action × scope)? | `[BRAIN-OUT] flows/Add Node.md:18-30` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:21-38` |
| 4 | BR-* rules | Cross-field / workflow rules | `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:62-97` (rows for `BR-AM-01`) + `[BRAIN-OUT] flows/Add Node.md:19` |
| 5 | V-rules per step | Field-level validation | `[BRAIN-OUT] flows/Add Node.md:36-44, 96-100` + `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` (rule 16 — sister `V-subnode-name-maxlength-30`) |
| 6 | E-* entity drift | Which entities + drift items | `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:95, 127-138` + `[BRAIN-OUT] flows/Add Node.md:40-41, 93-94` |
| 7 | Backend DTOs | `CreateSubNodeRequest` shape + `[ThrowIf*]` | `[BRAIN-OUT] flows/Add Node.md:34, 49, 58` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:58` |
| 8 | Backend endpoint + handler | Route + controller + handler flow | `[BRAIN-OUT] flows/Add Node.md:45-52` |
| 9 | FluentValidator + handler-time gate | What runs server-side after `[ThrowIf*]` | `[BRAIN-OUT] flows/Add Node.md:49, 60` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:64-68` |
| 10 | Kafka events | What downstream events fire on success | `[BRAIN-OUT] flows/Add Node.md:60` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:51` |
| 11 | Error codes | Every `FalconKeys.Error.*` Add Node can surface | `[BRAIN-OUT] flows/Add Node.md:49, 65-76` + `[BRAIN-OUT] 13-error-catalog/CATALOG.md` |
| 12 | FE route + PES gate | Route path + `data.access` + `FalconAccess.*` key | `[BRAIN-OUT] flows/Add Node.md:30` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:34` |
| 13 | FE components | Falcon UI Core components used | `[BRAIN-OUT] flows/Add Node.md:102-112` |
| 14 | FE form + state | FormGroup choice + state machine | `[BRAIN-OUT] flows/Add Node.md:120-131` |
| 15 | FE i18n keys | Translation keys (en + ar resolutions) | `[INFERRED]` — playbook silent on concrete keys |
| 16 | Test case (Gherkin) | 5+ scenarios with realistic assertions | composed from layers 4 + 5 + 11 |
| 17 | Port artifact | Where it lives in admin-console; does it port to mgmt? | `[BRAIN-OUT] flows/Add Node.md:21-30` (matrix is for **both** consoles) + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:38` |
| 18 | Capability map per role | 6 roles × can-run verdict | `[BRAIN-OUT] 05-capability-maps/{sys-admin,sys-products,sys-ops,acc-owner,acc-admin,acc-user}.capability.md:52, 52, 52, 110, 109, 105` |

---

## Layer 1 — Business intent

**The user need.** A Falcon staff member (or, equally, a Client's Account Owner / Node Admin) needs to **organize a tenant's tree** into sub-units — branches, departments, regions, projects — so that users, contracts, and (indirectly) wallets can be scoped against the new sub-node. Unlike Add Client (which mints a brand-new tenant), Add Node operates **inside an existing tenant's Main subtree**.

**Why this is hard.** The depth and shape of the tree are governed by a single runtime cap (`AccountSettings.MaxNodeLevel`). Without that cap, a client could grow an unbounded tree; without server-side guarding, a Sub-node could end up under the Falcon synthetic Root (which is structurally forbidden — `RootNodeCannotHaveSubNodes`); without scope checks, an acc-admin could create a node above their own subtree (which would be a permission-escalation primitive). The single-call write must enforce all three guards before persisting. `[BRAIN-OUT] flows/Add Node.md:5-7`.

**The flow's promise.** One composite-shaped-but-actually-tiny request, one server-side transaction, one consolidated error surface. Single-dialog, no wizard chrome, no per-step async pre-flight other than the optional name-uniqueness check. `[BRAIN-OUT] flows/Add Node.md:5-7, 122-128`.

**Comparison to Add Client.** Add Client = 5 steps × 7 entities × 4 Kafka events; Add Node = 1 step × 1 entity (`Node`) × **no observed Kafka events** for sub-node create (per `[BRAIN-OUT] flows/Add Node.md:60` Kafka emission for sub-node creation is **unverified**). The architectural payoff: a sub-node is a structural child only — it inherits settings, wallet topology, and PES rules from its owning Main-node Account. `[BRAIN-OUT] flows/Add Node.md:57-58`.

---

## Layer 2 — PRD requirement

**Module:** PRD-01 Account Management (same module as Add Client).

**Authoring source.** `[BRAIN-OUT] prd/modules/01-account-management/` — the load-bearing files for Add Node:

| PRD artifact | What it carries | Used by Add Node for |
|---|---|---|
| `BUSINESS_RULES.md` BR-AM-01 | 3-level hierarchy (Root / Main / Sub) | Layer 4 + Layer 8 hierarchy enforcement |
| `ENTITIES.md` (Node) | `type` enum (root/main/sub) + relation to parent | Layer 6 entity drift (`type` PRD-present, DTO-absent) |
| `ENTITIES.md` (AccountSettings) | `MaxNodeLevel` cap | Layer 4 + Layer 9 runtime gate |

**Exact PRD line citations.**

- "3-level hierarchy (Root / Main / Sub)" — `[BRAIN-OUT] flows/Add Node.md:19` quoting `BUSINESS_RULES.md` BR-AM-01.
- Node entity is PRD-defined with `type` field surfaced in `ENTITIES.md` — `[BRAIN-OUT] flows/Add Node.md:40`.
- `MaxNodeLevel` lives on `AccountSettings` and gates depth — `[BRAIN-OUT] flows/Add Node.md:41, 69`.

**PRD silences (load-bearing).** Three areas where PRD is silent and the implementation must adopt a documented default:

1. **Letter-prefix on sub-node names** — PRD does not enumerate node-name format separately. Add Client (Step 1) enforces letter-prefix on the Main-node `AccountName` per BR-AM-03. Whether that rule mirrors to sub-node names is **PRD-silent**; backend does **NOT** enforce it. `[BRAIN-OUT] flows/Add Node.md:39, 100, 136`.
2. **DuplicateNodeName uniqueness scope** — is it per-parent, per-account, or globally? PRD silent; confirm in `ICreateSubNodeHandler`. `[BRAIN-OUT] flows/Add Node.md:135`.
3. **Per-node `settings` override** — PRD entity diagram suggests a `settings` field on Node; backend has none. Settings live on the Account. `[BRAIN-OUT] flows/Add Node.md:41, 137`.

**Critical implementation note.** Add Node is a **single composite POST**; there is no per-step API. Local form state is two fields. The server-side state machine is also single-step (`Node.Created`). Compare to Add Client's 7-stage `account-creation-status`.

---

## Layer 3 — Permission gate

**The matrix.** Add Node is the **second-widest gate** of the 4 Organization Hierarchy flows (tied with Add User and Edit Node). 5 of 6 roles can run it; the only role denied is `acc-user`. `[BRAIN-OUT] flows/Add Node.md:21-30`:

| Role | Can run? | PES rule | Source |
|---|---|---|---|
| `sys-admin` (System Administrator) | ✅ YES | (no separate PES — always in `allowedTreeActions` on admin-console) | `[BRAIN-OUT] flows/Add Node.md:24` + `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:52` |
| `sys-products` (Products) | ✅ YES | (no separate PES — `allowedTreeActions`) | `[BRAIN-OUT] flows/Add Node.md:25` + `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md:52` |
| `sys-ops` (Operation) | ✅ YES | (no separate PES — `allowedTreeActions`) | `[BRAIN-OUT] flows/Add Node.md:26` + `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md:52` |
| `acc-owner` (Account Owner) | ✅ YES | `acc.organization / add` allow (within own Main subtree only) | `[BRAIN-OUT] flows/Add Node.md:27` + `[CODE] pes-account-role-rules.json:7` + `[BRAIN-OUT] 05-capability-maps/acc-owner.capability.md:110` |
| `acc-admin` (Node Admin) | ✅ YES | `acc.organization / add` allow (within own sub-nodes only) | `[BRAIN-OUT] flows/Add Node.md:28` + `[CODE] pes-account-role-rules.json:39` + `[BRAIN-OUT] 05-capability-maps/acc-admin.capability.md:109` |
| `acc-user` (Normal User) | ❌ NO | `acc.organization / add` explicit deny | `[BRAIN-OUT] flows/Add Node.md:29` + `[BRAIN-OUT] 05-capability-maps/acc-user.capability.md:105` |

**Asymmetry vs Add Client.** Add Client is `sys.account / add` — a **Falcon-only** namespace (`sys.*`), gated to 2 roles. Add Node is **dual-namespace**: sys-* users on admin-console don't need a `sys.*` PES key for it (handled as a structural tree action), while acc-* users on mgmt-console DO need `acc.organization / add`. The reason: adding a sub-node is intra-tenant (organizational) not cross-tenant (provisioning) — the Client's own Owner/Admin should be able to do it without Falcon-staff involvement.

**Scope is enforced separately from action.** Even though sys-* and acc-* roles all pass the action gate:

- **sys-* anywhere** — no scope cap.
- **acc-owner** — bounded to **own Main subtree** (cannot add nodes outside).
- **acc-admin** — bounded to **own sub-nodes only** (cannot add above their own sub-node — would be permission escalation).
- **acc-user** — transactional role only; explicit deny.

This scope constraint is enforced **handler-side** in Commerce via the `JWT.path` claim — the gateway forwards the path; the handler refuses requests whose `ParentId` is not within the caller's path. `[BRAIN-OUT] flows/Add Node.md:30, 52`.

**The three-layer gate** — same defense-in-depth shape as Add Client:

1. **Frontend visibility (UX gate)** — `AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode')` before rendering the `Add sub-node` menu item / row `+` button. On admin-console, the action is always in `allowedTreeActions` (no separate PES). `[BRAIN-OUT] flows/Add Node.md:30` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:34`.
2. **Gateway** — System Gateway for sys-* users; Core Gateway for acc-*; both forward to the same Commerce endpoint. `[BRAIN-OUT] flows/Add Node.md:50-52`.
3. **Backend `[Authorize]`** — class-level on `NodeController`. **NO `FalconOnly` policy** — Client users CAN call this endpoint (in scope per the role-x-scope matrix). Handler-time role+scope check enforces the namespace asymmetry. `[BRAIN-OUT] flows/Add Node.md:52, 49`.

**PES key in registry.** `FalconAccess.managementConsole.organization.add()` resolves to `{ action: 'add', resource: 'acc.organization' }`. `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:68`. Note: the playbook's reference `managementConsole.organizationHierarchy.addSubNode` is the **canonical FE convenience accessor name** used by `AccessControlFacade`; under the hood it maps to the same `acc.organization / add` resource pair. `[INFERRED]` — the registry catalog at `REGISTRY-RAW.md:68` lists `managementConsole.organization.add`; the playbook at `flows/Add Node.md:30` references `managementConsole.organizationHierarchy.addSubNode` — these are two FE accessor names for the same underlying PES rule. Reconcile against `falcon-access.registry.ts` when implementing.

---

## Layer 4 — BR-* business rules

Add Node touches a **much smaller** set of BR-* rules than Add Client. Per `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:62-97` Add Node sits under the `organization-hierarchy` column; the BR-AM rows that apply specifically to sub-node creation:

| BR # | Rule | Add Node surface |
|---|---|---|
| BR-AM-01 | 3-level hierarchy (Root / Main / Sub) | Tree topology + Layer 8 hierarchy guard (`RootNodeCannotHaveSubNodes` if `ParentId` resolves to Root) |
| BR-AM-09 | `PasswordSecurityLevel` is account-level (inherited by sub-node) | Sub-node does NOT carry its own password tier — inherits from owning Account |
| BR-AM-10 | IP allowlist enforced at gateway (inherited) | Sub-node user logins still pass through the Main-account allowlist |
| BR-AM-11 | Account Limits zero-means-no-limit (4 fields) — `MaxNodeLevel` is the gate | Layer 9 handler check; breach = 422 `MaxNodeLevelReached` |
| BR-AM-12 | System User and Normal User counts are independent | Indirect — counts roll up to Main-node's `MaxNormalUserLimit` / `MaxSystemUserLimit`, not per-sub-node |

**Cross-flow BR rules touched.** Add Node has no BR-UM-* rules of its own (it does not create users) but BR-UM-01 (Falcon usertypes on Root only; Client on Main/Sub) is enforced indirectly — only sys-* roles can land on Root via admin-console, and Root cannot have sub-nodes (`RootNodeCannotHaveSubNodes`).

**Comparison to Add Client.** Add Client touches **28 of 42 BR-AM rules**; Add Node touches **at most 5** — and most of those are read-only inheritance (Account-level settings the sub-node simply receives).

---

## Layer 5 — V-rules per step

Add Node has **2 form fields**, not 5 steps, so V-rule density is low. Per `[BRAIN-OUT] flows/Add Node.md:36-44, 96-100`:

### Single dialog — 2 fields

| V-rule | Field | Why it fires |
|---|---|---|
| `V-subnode-name-maxlength-30` | `Name` (the only user-input field) | 30-char cap + required on `CreateSubNodeRequest.Name`. **Note from `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` rule 16** — `V-subnode-name-maxlength-30` is **referenced from `V-account-name-format-uniqueness` as a sister rule but has no `.md` file in the vault** (only 25 V-rule notes seeded). `[INFERRED]` per the 06-MATRIX §4 item #16, this is the candidate "26th rule" the brief mentioned; flag for seeding before the next dataset refresh. |
| [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) | `Name` (cosmetic mirror) | Sister rule on Main-node Account Name. Letter-prefix portion **may or may not** apply to sub-node names; PRD silent. Backend does **NOT** enforce; FE may opt-in to `Validators.pattern(/^[A-Za-z].*$/)` as a cosmetic mirror. `[BRAIN-OUT] flows/Add Node.md:39, 100, 136`. |
| [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) | (no field — runtime gate) | `MaxNodeLevel` is the runtime cap on hierarchy depth; 0 = no limit. Breach surfaces as 422 `MaxNodeLevelReached` at handler-time, NOT as a form validator. `[BRAIN-OUT] flows/Add Node.md:69, 99` + `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` rule 2. |

### No async uniqueness check documented

Unlike Add Client (which has `GET /api/Node/ValidateAccountName?AccountName=` debounced 300 ms), the Add Node playbook **does not enumerate an async sub-node-name uniqueness pre-flight**. `[BRAIN-OUT] flows/Add Node.md` is silent — the only uniqueness signal is the 409 `DuplicateNodeName` returned at submit. `(no source — needs investigation)` — an async pre-flight is a candidate FE polish item (UX parity with Add Client) but is not documented in the playbook.

### No cross-field validation

The `CreateSubNodeRequest` has only 2 fields and no documented cross-field rules. `ParentId` is auto-populated from the trigger row click context (hidden form field); `Name` is user-input. Compare to Add Client's `CountryRequiredWhenCityProvided` / `CityRequiredWhenDistrictProvided` cascade.

---

## Layer 6 — E-* entity drift

Add Node creates **1 entity** (Node) and reads **1 entity** (AccountSettings). Per `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:95, 127-138`:

| Entity | Created/Read | Drift count | Notable drift on Add Node specifically |
|---|---|---|---|
| `E-node` | ✅ created | 8 | `type` (root/main/sub) **NOT on `CreateSubNodeRequest`** — backend infers from position (Sub iff parent is Main or Sub). UI must NOT expose this field. `settings` PRD-hinted on Node but no DTO surfaces it — sub-nodes inherit from Main. `EffectiveDate` extra on `ChangeNodeNameRequest` (different flow — Edit Node — but same entity). `[BRAIN-OUT] flows/Add Node.md:40-41` + `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:95, 131`. |
| `E-account-settings` | (read-only — runtime gate) | 14 | `MaxNodeLevel` is the gate; PRD says `maxNodeLevels` (plural), backend says `MaxNodeLevel` (singular) — casing+plural drift. **Sub-nodes inherit all settings from the owning Account** — no per-sub-node settings table on backend. `[BRAIN-OUT] flows/Add Node.md:41, 57-58, 94`. |

**Cross-service entity ownership notes:**

- **Node entity is Commerce-owned** — `CreateSubNodeRequest` → `NodeController.CreateSubNode` → Commerce datastore. `[BRAIN-OUT] flows/Add Node.md:49`.
- **AccountSettings is Commerce-owned (read here)** — handler reads `AccountSettings.MaxNodeLevel` from the owning Account before persisting the new Node. `[BRAIN-OUT] flows/Add Node.md:69`.
- **No User entity touched** — Add Node does NOT create users. Compare to Add Client Step 5 which Kafka-creates an AO user.
- **No Wallet entity touched** — per `[BRAIN-OUT] flows/Add Node.md:57-58`, no new wallet record is created automatically; wallets are bound to commchannels / users, not sub-nodes per se. If `WalletTypeConfig.balanceType = Node`, downstream wallet creation happens when **users** are added under the sub-node.

---

## Layer 7 — Backend DTOs

**Top-level DTO:** `CreateSubNodeRequest`. Tiny — just 2 fields. `[BRAIN-OUT] flows/Add Node.md:34, 49`:

```jsonc
{
  "ParentId": "<guid>",   // [ThrowIfNotPassed] — pre-filled from trigger row context (hidden in UI)
  "Name": "..."           // [ThrowIfNotPassed, ThrowIfMaxLengthExceed(30)] — user-input, ≤ 30 chars
}
```

**`[ThrowIf*]` attribute taxonomy** (recap from `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:251-258` — see Add-Client.trace.md Layer 7 for the full table). Applied to Add Node DTO fields:

| Attribute | Field | Triggers on | Maps to error code |
|---|---|---|---|
| `[ThrowIfNotPassed]` | `ParentId` | null / missing | `ParentIdRequired` (400) |
| `[ThrowIfNotPassed]` | `Name` | null / missing | `RequiredFieldMissing` / `NodeNameRequired` (400) |
| `[ThrowIfMaxLengthExceed(30)]` | `Name` | length > 30 | `MaxLengthExceeded` (400) |

**`[ThrowIf*]` runs BEFORE handler logic** (FastEndpoints pre-processor chain) — empty/over-length values never reach the handler. The handler-level checks (parent existence, root-child guard, max-depth, soft-delete tombstone, name uniqueness) run after — see Layer 9.

**Casing note.** Commerce uses **PascalCase** on the wire — both `ParentId` and `Name` are PascalCase on `CreateSubNodeRequest`. Consistent with the Add Client convention. `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:58`.

**Drift / gap notes (per `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:64-68`):**

| Field | Drift | Reference |
|---|---|---|
| `type` on Node | PRD lists `type` (root/main/sub) but NOT on `CreateSubNodeRequest` — backend infers from position. **UI must NOT expose this field.** | `[BRAIN-OUT] flows/Add Node.md:40` |
| `settings` on Node | PRD-hinted per-node settings but NO DTO surfaces it. Sub-nodes inherit from Main. **UI must NOT expose a settings step on Add Node dialog.** | `[BRAIN-OUT] flows/Add Node.md:41` |
| Letter-prefix on sub-node name | PRD silent; backend does NOT enforce. Cosmetic FE rule only. | `[BRAIN-OUT] flows/Add Node.md:100, 136` |
| Uniqueness scope on `DuplicateNodeName` | Per-parent, per-account, or globally? Confirm with `ICreateSubNodeHandler`. PRD silent. | `[BRAIN-OUT] flows/Add Node.md:135` |

---

## Layer 8 — Backend endpoint + handler

**The endpoint.** `[BRAIN-OUT] flows/Add Node.md:45-52`:

| Attribute | Value |
|---|---|
| Method | POST |
| Path (internal) | `/api/Node/create-SubNode` |
| Path (via System Gateway, sys-* users) | `<system-gateway>/commerce/Node/create-SubNode` — gateway strips `/commerce`, prepends `/api/` |
| Path (via Core Gateway, acc-* users) | `<core-gateway>/commerce/Node/create-SubNode` — same shape |
| Service | Commerce (`falcon-core-commerce-svc`) |
| Controller | `NodeController.CreateSubNode` |
| Auth | class-level `[Authorize]` — anonymous rejected. **NO `FalconOnly` policy** — both user types are allowed. Handler-time enforces the namespace + scope constraint. |
| Request | `CreateSubNodeRequest { ParentId, Name }` |
| Response | `ServiceOperationResult<bool>` (success flag) |

**The gateway.** **Both gateways serve** this endpoint — System Gateway (`:7256` dev) for sys-* users, Core Gateway (`:7038` dev) for acc-* users. Same Commerce endpoint behind both. `[BRAIN-OUT] flows/Add Node.md:50-52`. Auth header: `Authorization: Bearer <zitadel-jwt>` carrying the user's `JWT.sub` (Zitadel id), `tenantId`, `nodeId`, and `path` claims.

**Handler flow** (best inference from `[BRAIN-OUT] flows/Add Node.md:49, 60`):

1. **Pre-processor** runs `[ThrowIf*]` attributes — surface 400 if `ParentId` or `Name` missing, 400 if `Name > 30`.
2. **Resolve parent Node** by `ParentId` — return 404 `ParentNodeRequired` / `NodeNotFound` if not found.
3. **Soft-delete check** — return 422 `ActionsNotAllowedOnDeletedNode` if parent has tombstone flag.
4. **Root-child guard** — return 422 `RootNodeCannotHaveSubNodes` if `ParentId` is the Falcon synthetic Root.
5. **Hierarchy depth check** — read owning Account's `AccountSettings.MaxNodeLevel`, compute target depth (`parent.depth + 1`), return 422 `MaxNodeLevelReached` if exceeded; return 422 `InvalidNodeLevel` if structurally invalid.
6. **Scope check** — for acc-* users, ensure `ParentId` is within `JWT.path`. Return 403 `UnauthorizedAction` if outside.
7. **Name uniqueness** — return 409 `DuplicateNodeName` if duplicate. Uniqueness scope (per-parent / per-account / global) is **PRD-silent** — `[BRAIN-OUT] flows/Add Node.md:135` flags as open question.
8. **Persist** — insert `Node` row with `Name`, `ParentId`, computed `Path`, inferred `type = sub`.
9. **Return** `ServiceOperationResult<bool> { IsSuccessful: true }`.

**No server-side wizard status enum.** Unlike Add Client's 7-stage `account-creation-status` (Pending → InfoCompleted → … → Completed), Add Node is single-step on commit; the Node row goes from non-existent to `Created` in one transaction.

---

## Layer 9 — FluentValidator + handler-time gate

**Two-tier server-side validation** — same architecture as Add Client:

### Tier 1 — `[ThrowIf*]` (pre-processor, before handler)

Catches null / empty / over-length. Surfaces 400 codes per Layer 7 attribute table. Specifically:

- `ParentId` null → 400 `ParentIdRequired` / `RequiredFieldMissing`
- `Name` null → 400 `RequiredFieldMissing` / `NodeNameRequired`
- `Name` length > 30 → 400 `MaxLengthExceeded`

### Tier 2 — Handler-level checks (after pre-processor passes)

Runs after `[ThrowIf*]` passes. Maps to non-400 codes:

| Check | Code | HTTP | Reference |
|---|---|---|---|
| Parent Node not found | `ParentNodeRequired` / `NodeNotFound` | 404 | `[BRAIN-OUT] flows/Add Node.md:70` |
| Parent is Falcon Root (cannot have sub-nodes) | `RootNodeCannotHaveSubNodes` | 422 | `[BRAIN-OUT] flows/Add Node.md:72` |
| Parent is soft-deleted | `ActionsNotAllowedOnDeletedNode` | 422 | `[BRAIN-OUT] flows/Add Node.md:73` |
| Target depth exceeds `MaxNodeLevel` | `MaxNodeLevelReached` | 422 | `[BRAIN-OUT] flows/Add Node.md:69` |
| Structural depth violation | `InvalidNodeLevel` | 422 | `[BRAIN-OUT] flows/Add Node.md:74` |
| Name duplicate (scope: PRD-silent) | `DuplicateNodeName` | 409 (typical) | `[BRAIN-OUT] flows/Add Node.md:71, 135` |
| Caller's path does not include `ParentId` (scope) | `UnauthorizedAction` / `UnauthorizedUserToPerformThisAction` | 403 | `[BRAIN-OUT] flows/Add Node.md:75, 30` |

**No FluentValidator chain documented for Add Node** — `(no source — needs investigation)`. The Add Node playbook does not enumerate a per-request `IValidator<CreateSubNodeRequest>` (compare with Add Client where `07-VALIDATIONS.md` enumerates the cross-field rules). All Tier-2 checks above appear to live in the handler itself, not in a FluentValidator. Confirm against the Commerce source.

**Critical FE rule** — use HTTP status code as the **primary routing signal**. Display localized `errorMessages[0]` directly. Do NOT parse error codes for copy. Use codes for logging / instrumentation only. `[BRAIN-OUT] 13-error-catalog/CATALOG.md:290-302`.

---

## Layer 10 — Kafka events

**Per `[BRAIN-OUT] flows/Add Node.md:60`:**

> Events / Kafka: **Not visible in the `ENDPOINT_REGISTRY.md` for `CreateSubNode` specifically** — Commerce produces 11 Kafka topics total (per `GAPS.md` GAP-AM-24); whether a `NodeCreated` event fires for sub-node creation is **unverified**.

**Verdict:** Layer 10 is **🔴 unverified** for Add Node. No documented Kafka emission. Compare to Add Client which emits 4 Kafka events (`commerce.user-creation-requested.v1`, `commerce.wallet-configured.v1`, `commerce.identity-settings-sync.v1`, `commerce.tenant-ip-allowlist-changed.v1`).

**Reasonable implication.** Since:

- No new User is created (no `UserCreationRequested`).
- No new Wallet is created automatically (sub-nodes do not have their own wallets unless `balanceType = Node` AND users are added under them — see `[BRAIN-OUT] flows/Add Node.md:57-58`).
- AccountSettings are not changed (sub-nodes inherit).
- IP allowlist is not changed (still Account-level).

…it is **plausible** that no Kafka events fire on `CreateSubNode`. But this is `[INFERRED]` — the playbook explicitly flags this as unverified. Confirm against `Commerce/.../Kafka/Publishers/*.cs` source before relying on it.

**FE implication.** The FE must NOT depend on a downstream side-effect to refresh the tree. After a successful POST, the FE explicitly **re-fetches** `GET /commerce/Node?NodeId=<rootId>` to render the new node. `[BRAIN-OUT] flows/Add Node.md:61, 128`.

---

## Layer 11 — Error codes

Add Node surfaces **~12 error codes** across **5 HTTP status classes** — far fewer than Add Client (30+). Catalog: `[BRAIN-OUT] 13-error-catalog/CATALOG.md`. Per-flow placement: `[BRAIN-OUT] flows/Add Node.md:49, 65-76`.

### 400 — validation / required-field / format (4 codes)

| Code | When | V-rule |
|---|---|---|
| `RequiredFieldMissing` | Any `[ThrowIfNotPassed]` fires | — |
| `ParentIdRequired` | `ParentId` null/missing | — |
| `NodeNameRequired` | `Name` null/missing | — `[BRAIN-OUT] 13-error-catalog/CATALOG.md:43` |
| `MaxLengthExceeded` | `Name` length > 30 | `V-subnode-name-maxlength-30` (sister rule, not yet seeded in vault) |

**UX:** inline error below the Node Name field. Dialog stays open. `[BRAIN-OUT] flows/Add Node.md:67-68`.

### 403 — authorization (2 codes)

| Code | When |
|---|---|
| `UnauthorizedAction` | Caller's path does not include `ParentId` (acc-* scope check) |
| `UnauthorizedUserToPerformThisAction` | Caller is not authorized for the resource |

**UX:** full-dialog banner; close dialog. "You don't have permission to add a sub-node here." Should not happen — PES gate hides the menu. `[BRAIN-OUT] flows/Add Node.md:75`.

### 404 — not-found (2 codes)

| Code | When |
|---|---|
| `ParentNodeRequired` | Parent Node entity required but resolution failed |
| `NodeNotFound` | Parent Node does not exist |

**UX:** full-dialog banner: "The parent node could not be found. The tree may be stale — refresh and try again." Trigger a hierarchy re-fetch on dismiss. `[BRAIN-OUT] flows/Add Node.md:70`.

### 409 — uniqueness collision (1 code)

| Code | When |
|---|---|
| `DuplicateNodeName` (typical) | Sub-node Name duplicate within parent (scope PRD-silent) |

**UX:** inline error below Node Name input: "A node with this name already exists under the selected parent." Confirm uniqueness scope with handler. `[BRAIN-OUT] flows/Add Node.md:71`.

### 422 — semantic / business / quota (4 codes)

| Code | When | V-rule |
|---|---|---|
| `MaxNodeLevelReached` | Target depth > `AccountSettings.MaxNodeLevel` | `V-account-limits-zero-means-no-limit` |
| `RootNodeCannotHaveSubNodes` | `ParentId` is the Falcon synthetic Root | — |
| `ActionsNotAllowedOnDeletedNode` | Parent has soft-delete tombstone | — |
| `InvalidNodeLevel` | Structural depth violation (catch-all) | — |

**UX:** full-dialog banner. `MaxNodeLevelReached` should show a **permanent banner** with a "View account settings" link to the Settings tab → Account Limitation section (Falcon-only edit per BR-AM-11). `[BRAIN-OUT] flows/Add Node.md:69, 72-74`.

### 500 — network / external (catch-all)

| Code (typical) | When |
|---|---|
| `ExternalServiceError` / `ExternalServiceConnectionError` / `ExternalServiceTimeout` | Network or Commerce↔dependent-service failure |

**UX:** global toast with standard retry message. `[BRAIN-OUT] flows/Add Node.md:76`.

### FE error-handling contract

`[BRAIN-OUT] 13-error-catalog/CATALOG.md:290-302`:

1. Use HTTP status code as the **primary routing signal**.
2. Use `errorMessages[0]` for **display copy** (already localized by backend).
3. Error codes are for **logging / instrumentation only** — never branch UI copy on them.

---

## Layer 12 — FE route + PES gate

**Route + Angular guard.**

| Aspect | admin-console | management-console |
|---|---|---|
| App | `apps/admin-console` (System Gateway-backed) | `apps/management-console` (Core Gateway-backed) |
| Page route | `/organization-hierarchy` | `/organization-hierarchy` (same path; different host) |
| Entry point | Tree row 3-dot kebab → `Add sub-node` menu item; OR row-hover `+` icon-button | Same — tree row kebab on hierarchy-tab |
| `data.access` (route guard) | `FalconAccess.adminConsole.enter()` (page-level) | `FalconAccess.managementConsole.enter()` (page-level) |
| Action gate (menu-item visibility) | Always in `allowedTreeActions` for admin-console (no separate PES) | `AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode')` → resolves to `acc.organization / add` |

**The PES check for mgmt-side gating** — `FalconAccess.managementConsole.organization.add()` resolves to `{ action: 'add', resource: 'acc.organization' }` per `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:68`.

**Asymmetry.** admin-console treats Add Node as a **structural tree action** with no separate PES — every sys-* role that can land on the page can run it. mgmt-console gates it on `acc.organization / add` which separates acc-owner+acc-admin (allow) from acc-user (deny). `[BRAIN-OUT] 05-capability-maps/{sys-admin,sys-ops,sys-products}.capability.md:52` versus `[BRAIN-OUT] 05-capability-maps/{acc-owner,acc-admin}.capability.md:110, 109`.

**Source of truth:** `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (47 factory methods, 7 top-level namespaces). `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:3`.

**Gateway behavior.** The FE never hits the route directly — it goes through the right gateway (System for sys-*, Core for acc-*) which validates the JWT, forwards `tenantId` + `nodeId` + `path` claims, and either passes the request through to Commerce or returns 403 if PES denies on mgmt-side.

---

## Layer 13 — FE components

**Single dialog (no wizard shell).** Falcon UI Core components — no PrimeNG; no SCSS; Tailwind utilities only per `[MEMORY] feedback_falcon_custom_library_mandatory.md`. `[BRAIN-OUT] flows/Add Node.md:102-112`:

### Trigger components (in tree row)

| Component | Role |
|---|---|
| `<falcon-menu>` | 3-dot kebab on each tree row exposing the `Add sub-node` item |
| `<falcon-button>` (alt) | Row-hover `+` icon-button (existing pattern on `<falcon-organization-hierarchy-tree-tw>`) |
| `<falcon-organization-hierarchy-tree>` / `<falcon-tree-panel>` | Renders the hierarchy and surfaces the trigger row + holds the parent-node-id context |

### Dialog body components

| Component | Role / Field |
|---|---|
| `<falcon-dialog>` | Desktop primary surface (single-step, no wizard chrome) |
| `<falcon-drawer>` | Mobile / narrow viewport fallback (≤ tablet width) |
| `<falcon-input>` | Node Name field — the only user-input control |
| (hidden field) | `parentNodeId` — pre-filled from trigger context, not rendered |
| `<falcon-button>` | Save / Cancel buttons |
| `<falcon-notification>` / `<falcon-toast>` | Error toasts (403, 500) |

### Components NOT used (relative to Add Client)

- No `<falcon-stepper>` / `<falcon-wizard>` — single step.
- No `<falcon-dropdown>` — no enum fields (per Layer 6, `type` is backend-inferred).
- No `<falcon-single-uploader>` — no profile picture.
- No `<falcon-data-table>` — no per-row visibility / pricing.
- No `<falcon-phone-field>` / `<falcon-email-field>` — no user creation.

### Existing host-shell wrapper available

Per `[MEMORY] project_org_hierarchy_tree_shared_component.md`, the `<app-organization-hierarchy-tree>` host-shell shared wrapper already gates internally on `AccessControlFacade` + `FalconAccess.managementConsole.accountHierarchy.view()`, exposes normalized `(actionInvoke)` events that include `add-sub-node` as an action key, and is **the consumption surface** for the kebab menu wiring. Component authors should NOT re-wire the tree from scratch.

### Customization order rule (standing)

Per `[MEMORY] feedback_falcon_custom_library_mandatory.md`:

```
inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP
```

Add Node must be implemented as an **app-level wrapper** under `apps/admin-console/.../organization-hierarchy-page/add-sub-node-dialog/` (and mirrored under `apps/management-console/.../organization-hierarchy-page/add-sub-node-dialog/`) consuming pure-presentational library skeletons. Backend service call lives in the wrapper, never in the library skeleton (per `[MEMORY] feedback_library_skeleton_app_api.md`).

---

## Layer 14 — FE form + state

**Form choice.** Reactive `FormGroup` — required because:

1. `parentNodeId` must be programmatically set (hidden control) from the tree-row trigger context.
2. `Validators.maxLength(30)` + `Validators.required` need to be applied imperatively.
3. (Optional) `Validators.pattern(/^[A-Za-z].*$/)` letter-prefix client-side cosmetic mirror — per `[BRAIN-OUT] flows/Add Node.md:39, 126`.

```typescript
this.form = this.fb.group({
  parentNodeId: [null, Validators.required],   // hidden, populated from trigger
  nodeName: ['', [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern(/^[A-Za-z].*$/),         // optional cosmetic — no backend mirror
  ]],
});
```

**No multi-step state machine.** Compare to Add Client's 5-step `AddClientWizardStateService` with 5 buffered `FormGroup` instances + navigation pointer. Add Node is single-form, single-submit:

```
[tree row "Add sub-node" click]
   │ capture parentNodeId from row context
   ▼
[<falcon-dialog> opens with form seeded]
   │
   ▼
[user types Node Name (sync validators fire on input)]
   │
   ▼
[Save click — POST /commerce/Node/create-SubNode { ParentId, Name }]
   │ disable Save + show spinner (no optimistic tree update)
   │
   ▼
[200 ServiceOperationResult<bool> success]
   │ close dialog
   │ re-fetch GET /commerce/Node?NodeId=<rootId>
   │ expand parent + focus new node
   │
   ▼
[tree refreshed; user sees new sub-node highlighted]
```

**No async uniqueness pre-flight.** Unlike Add Client (debounced 300 ms uniqueness call), Add Node does not have a documented async pre-check. Server-side 409 `DuplicateNodeName` is the only uniqueness signal. `(no source — needs investigation)` — adding an async pre-check would be a candidate FE polish to surface the collision before submit.

**No pre-load of master catalogs.** Compare to Add Client which loads `CommunicationChannel`, `Application`, `Lookup` catalogs in parallel at open. Add Node needs **none** — the form is intrinsically self-contained.

**Critical wiring** — the dialog must seed `parentNodeId` from the click context and NOT show it to the user. From `[BRAIN-OUT] flows/Add Node.md:38, 125`:

> Hidden field, `Validators.required`; populated from the tree-row click context

---

## Layer 15 — FE i18n keys

`[INFERRED]` — The Add Node playbook does NOT enumerate concrete i18n keys (Brain Outputs playbook silent on this layer). Below is the **recommended** key namespace, inferred from `apps/admin-console/.../organization-hierarchy-page` conventions and the standing rule that Falcon supports En + Ar via `MultiLanguage(En, Ar)`.

**Recommended key prefix:** `organization-hierarchy.add-sub-node.*` (shared between admin-console and management-console because the dialog is the same shape on both)

| Key | En | Ar |
|---|---|---|
| `add-sub-node.title` | Add Sub-Node | إضافة عقدة فرعية |
| `add-sub-node.parent.label` | Parent Node | العقدة الأم |
| `add-sub-node.parent.read-only-hint` | (Inherited from selected node) | (موروثة من العقدة المحددة) |
| `add-sub-node.name.label` | Node Name | اسم العقدة |
| `add-sub-node.name.placeholder` | Enter sub-node name | أدخل اسم العقدة الفرعية |
| `add-sub-node.name.error.required` | Node name is required | اسم العقدة مطلوب |
| `add-sub-node.name.error.max-length` | Node name must be at most 30 characters | يجب ألا يتجاوز اسم العقدة 30 حرفًا |
| `add-sub-node.name.error.format` | Node name must start with a letter | يجب أن يبدأ اسم العقدة بحرف |
| `add-sub-node.name.error.taken` | A node with this name already exists under the selected parent | توجد عقدة بهذا الاسم تحت العقدة الأم المحددة بالفعل |
| `add-sub-node.actions.save` | Save | حفظ |
| `add-sub-node.actions.cancel` | Cancel | إلغاء |
| `add-sub-node.toast.success` | Sub-node created | تم إنشاء العقدة الفرعية |
| `add-sub-node.error.max-depth` | This account's maximum hierarchy depth has been reached. | تم الوصول إلى الحد الأقصى لعمق التسلسل الهرمي لهذا الحساب. |
| `add-sub-node.error.max-depth.cta` | View account settings | عرض إعدادات الحساب |
| `add-sub-node.error.parent-deleted` | This node has been removed. Refresh the tree. | تمت إزالة هذه العقدة. حدّث الشجرة. |
| `add-sub-node.error.root-no-children` | Sub-nodes cannot be created directly under the Falcon Root. Choose a Main node or one of its sub-nodes. | لا يمكن إنشاء عقد فرعية مباشرة تحت Falcon Root. اختر عقدة رئيسية أو إحدى عقدها الفرعية. |
| `add-sub-node.error.parent-not-found` | The parent node could not be found. The tree may be stale — refresh and try again. | تعذّر العثور على العقدة الأم. قد تكون الشجرة قديمة — حدّث وحاول مجددًا. |
| `add-sub-node.error.no-permission` | You don't have permission to add a sub-node here. | ليس لديك صلاحية لإضافة عقدة فرعية هنا. |

**Localization contract.** Error messages from `ServiceOperationResult<T>.errorMessages[0]` are **already localized server-side** — do NOT re-translate. The FE displays them as-is. `[BRAIN-OUT] 13-error-catalog/CATALOG.md:290-302`.

`(no source — needs investigation)` — concrete i18n key names should be confirmed against the existing `apps/{admin,management}-console/src/assets/i18n/{en,ar}.json` files when this trace is acted on.

---

## Layer 16 — Test case (Gherkin)

Six scenarios cover happy path + the five most important failure modes. Assertions trace back to BR-AM-* (Layer 4), V-rules (Layer 5), error codes (Layer 11), and capability map (Layer 18).

```gherkin
Feature: Add Node (sub-node creation)
  As a user with permission to organize my tenant's hierarchy
  I want to add a sub-node under an existing parent node
  So that I can scope users, contracts, and services more granularly within my account

  Background:
    Given I am logged in to the appropriate console (admin or management) for my role
    And I have permission to add a sub-node per the role-x-scope matrix
    And I am on the Organization Hierarchy page (/organization-hierarchy)
    And the hierarchy tree is rendered in the left panel

  Scenario: Happy path — acc-owner adds a sub-node under their own Main node
    Given I am logged in to management-console as "owner@acmecorp" (acc-owner role on tenant AcmeCorp)
    And the AcmeCorp Main node is selected and expanded
    And the account's MaxNodeLevel is 5 and current depth is 2
    When I click the 3-dot kebab on the Main node row
    Then the menu shows "Add sub-node" (gated by AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode'))
    When I click "Add sub-node"
    Then a <falcon-dialog> opens titled "Add Sub-Node"
    And the Parent Node field is read-only and labeled "AcmeCorp" (pre-filled from trigger row)
    And the Node Name field is empty and focused
    When I type "Sales" into Node Name
    Then no client-side validation error fires (1 ≤ length ≤ 30; starts with letter)
    And the Save button becomes enabled
    When I click Save
    Then the FE POSTs to <core-gateway>/commerce/Node/create-SubNode with body { "ParentId": "<acme-main-id>", "Name": "Sales" }
    And the request carries Authorization: Bearer <acc-owner-jwt>
    And receives HTTP 200 with ServiceOperationResult { IsSuccessful: true }
    And no Kafka event for sub-node creation fires (per playbook §State / side effects — unverified-but-expected)
    And the dialog closes
    And the FE re-fetches GET /commerce/Node?NodeId=<acme-root-id> (hierarchy refresh)
    And the AcmeCorp Main node expands
    And the new "Sales" sub-node is highlighted in the tree

  Scenario: Name validation — empty Node Name blocks submit
    Given the Add Sub-Node dialog is open
    When I leave Node Name empty
    And I click Save
    Then the Validators.required client-side validator fires
    And an inline error displays below the Node Name input: "Node name is required"
    And no network request is made
    # Defense in depth: even if FE check is bypassed, backend returns 400
    When I (somehow) bypass the FE check and submit
    Then the backend returns HTTP 400 with errorMessages[0] = (localized "Node name is required")
    And the error code is RequiredFieldMissing or NodeNameRequired

  Scenario: Name length validation — over 30 chars blocks submit
    Given the Add Sub-Node dialog is open
    When I type a 31-character Node Name like "ThisNameIsLongerThanThirtyChars1"
    Then the Validators.maxLength(30) client-side validator fires
    And an inline error displays: "Node name must be at most 30 characters"
    And the Save button is disabled
    # Defense in depth: backend rejects with 400 MaxLengthExceeded if submitted
    When I (somehow) bypass the FE check and submit
    Then the backend returns HTTP 400 with errorMessages[0] = (localized "Node name must be at most 30 characters")
    And the error code is MaxLengthExceeded

  Scenario: Max-depth gate — MaxNodeLevelReached
    Given I am logged in to management-console as "owner@acmecorp"
    And the account's MaxNodeLevel is 3 and current selected node is already at depth 3
    When I trigger Add sub-node on the depth-3 node
    Then the dialog opens (FE does NOT pre-check depth — server-side gate per BR-AM-11)
    When I fill Node Name "Branch4" and click Save
    Then the backend returns HTTP 422 with errorMessages[0] = (localized "This account's maximum hierarchy depth (3 levels) has been reached.")
    And the error code is MaxNodeLevelReached (V-account-limits-zero-means-no-limit governs)
    And the dialog shows a permanent banner above the form with the localized message
    And the banner includes a "View account settings" link to the Settings tab → Account Limitation section
    And the link is enabled only if the user has acc.account-quota / view (acc-owner only on mgmt; sys-admin/sys-products on admin)

  Scenario: Root-child guard — sys-admin tries to add a sub-node under the Falcon synthetic Root
    Given I am logged in to admin-console as "sysadmin" (sys-admin role)
    And the Falcon synthetic Root is selected in the tree
    Then the "Add sub-node" menu item is NOT shown on the Root row (UI must prevent triggering)
    # Defense in depth: if a developer bypasses the UI guard…
    When I (somehow) call POST /api/Node/create-SubNode with { "ParentId": "<falcon-root-id>", "Name": "ShouldNotExist" }
    Then the backend returns HTTP 422 with errorMessages[0] = (localized "Sub-nodes cannot be created directly under the Falcon Root. Choose a Main node or one of its sub-nodes.")
    And the error code is RootNodeCannotHaveSubNodes

  Scenario: Scope-violation — acc-admin tries to add a sub-node OUTSIDE their own subtree
    Given I am logged in to management-console as "admin@acmecorp" (acc-admin role)
    And my JWT.path is "/AcmeCorp/Engineering" (I own only the Engineering subtree)
    # The FE should have hidden the menu item, but if a developer crafts a direct request…
    When I (somehow) call POST /commerce/Node/create-SubNode with { "ParentId": "<acme-finance-id>", "Name": "Branch1" }
    Then the backend returns HTTP 403 with errorMessages[0] = (localized "You don't have permission to add a sub-node here.")
    And the error code is UnauthorizedAction or UnauthorizedUserToPerformThisAction
    And the FE displays the toast and closes the dialog
    And the tree state is preserved (no tree refresh required)
```

---

## Layer 17 — Port artifact

**Add Node ports to BOTH consoles.** Unlike Add Client (admin-only by architectural design), Add Node lives on **both** admin-console and management-console because the action is intra-tenant (organizational), not cross-tenant (provisioning). `[BRAIN-OUT] flows/Add Node.md:21-30, 50-52` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:38`.

### admin-console source path (sys-* users)

Recommended placement, per `[MEMORY] feedback_library_skeleton_app_api.md` + `[MEMORY] project_falcon_component_validation_convention.md`:

```
apps/admin-console/
└── src/app/.../organization-hierarchy-page/
    └── add-sub-node-dialog/
        ├── add-sub-node-dialog.component.{ts,html}
        ├── models/models.ts                      ← CreateSubNodeRequest + AddSubNodeFormState
        ├── services/add-sub-node.service.ts      ← POST /commerce/Node/create-SubNode + tree-refresh trigger
        └── validations/validations.ts            ← Validators.maxLength(30) + optional letter-prefix pattern
```

### management-console source path (acc-owner / acc-admin)

```
apps/management-console/
└── src/app/.../organization-hierarchy-page/
    └── add-sub-node-dialog/
        ├── add-sub-node-dialog.component.{ts,html}   ← SAME shape as admin-console
        ├── models/models.ts
        ├── services/add-sub-node.service.ts          ← targets Core Gateway instead of System
        └── validations/validations.ts
```

### Shared host-shell wrapper available

Per `[MEMORY] project_org_hierarchy_tree_shared_component.md`, the `<app-organization-hierarchy-tree>` host-shell shared wrapper already:

- Internally gates on PES via `AccessControlFacade` + `FalconAccess.managementConsole.accountHierarchy.view()`
- Emits normalized `(actionInvoke)` events including `add-sub-node` as a recognized action key
- Supports 3 modes (`falcon-clients` / `falcon-full` / `client`)

…so both consoles consume the same tree wrapper; only the **dialog body + service call target gateway** differ between consoles.

### What does NOT differ between admin and mgmt

| Aspect | Same on both consoles |
|---|---|
| DTO shape | `{ ParentId, Name }` |
| Endpoint path | `/api/Node/create-SubNode` |
| Backend service | Commerce |
| Validators | `Validators.required` + `Validators.maxLength(30)` (+ optional pattern) |
| Error codes | All 12 codes in Layer 11 |
| Dialog body shape | 2 fields, single Save / Cancel |
| Component palette | `<falcon-dialog>` + `<falcon-input>` + `<falcon-button>` + `<falcon-menu>` |

### What DOES differ

| Aspect | admin-console | management-console |
|---|---|---|
| Gateway target | System Gateway (`:7256` dev) | Core Gateway (`:7038` dev) |
| FE PES gate | (none — always in `allowedTreeActions`) | `managementConsole.organizationHierarchy.addSubNode` → `acc.organization / add` |
| Visible roles | sys-admin, sys-ops, sys-products | acc-owner, acc-admin (acc-user denied) |
| Tree scope (visible parents) | All tenants (Falcon Clients synthetic root + every Main subtree) | Caller's own Account subtree only (gateway scopes by `JWT.path`) |

**Verdict.** Add Node is a **dual-console feature** — same library skeleton, same DTO, same endpoint, two wrapper folders (one per app) differing only in service-call target gateway + FE PES gate wiring.

---

## Layer 18 — Capability map verdict per role

The final answer: of the 6 PES-defined roles, **5 PASS** the Add Node gate. Per `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:21-32` and the per-role capability maps:

| Role | App entry | Add Node action gate | Scope | Verdict | Source |
|---|---|---|---|---|---|
| `sys-admin` (System Administrator) | admin-console allow | (no separate PES — `allowedTreeActions`) | Anywhere | **✅ PASS** | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:52` |
| `sys-products` (Products) | admin-console allow | (no separate PES — `allowedTreeActions`) | Anywhere | **✅ PASS** | `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md:52` |
| `sys-ops` (Operation) | admin-console allow | (no separate PES — `allowedTreeActions`) | Anywhere; per OVERVIEW.md actor row: "Operation can add nodes/users (cannot add clients)" | **✅ PASS** | `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md:52` + `[BRAIN-OUT] flows/Add Node.md:25` |
| `acc-owner` (Account Owner) | management-console allow | `acc.organization / add` allow → `canAddOrganization = true` → `'add-node'` in `allowedTreeActions` | Within own Main subtree only | **✅ PASS** | `[BRAIN-OUT] 05-capability-maps/acc-owner.capability.md:110` + `[CODE] pes-account-role-rules.json:7` |
| `acc-admin` (Node Admin) | management-console allow | `acc.organization / add` allow → `canAddOrganization = true` | Within own sub-nodes only — cannot add above their own sub-node | **✅ PASS** | `[BRAIN-OUT] 05-capability-maps/acc-admin.capability.md:109` + `[CODE] pes-account-role-rules.json:39` |
| `acc-user` (Normal User) | management-console allow | `acc.organization / add` **explicit deny** | n/a | ❌ FAIL | `[BRAIN-OUT] 05-capability-maps/acc-user.capability.md:105` + `[CODE] pes-account-role-rules.json:66` |

**Wider context** — Add Node is **tied with Add User and Edit Node** at the widest gate of the 4 Organization Hierarchy flows by role count:

| Flow | Roles that can run | Source |
|---|---|---|
| Add Client | 2 / 6 (sys-admin + sys-products) | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md` |
| Add User | 4 / 6 (varies by path: sys-* + acc-owner + acc-admin; sys-ops scope-limited) | `[BRAIN-OUT] flows/Add User.md` |
| **Add Node** | **5 / 6** (all sys-* + acc-owner + acc-admin) | `[BRAIN-OUT] flows/Add Node.md` |
| Edit Node | 5 / 6 (same as Add Node) | `[BRAIN-OUT] flows/Edit Node.md` |

This asymmetry reflects the business model: **adding a client mints a new scope** (Falcon-staff-only privilege per BR-AM-02), but **adding a sub-node organizes an existing scope** (intra-tenant op, available to both Falcon staff and the tenant's own owner/admin). Only the dead-end `acc-user` (transactional role) is denied.

---

## Runtime verification status

`[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md` shows a sister flow (comms-hub mgmt-console gate) is `🟡 PARTIAL` — backend PES gate verified (21/21 PASS) but the FE-level UI gate is blocked on dev-server + env drift.

**Per-layer verification status for Add Node** (best assessment from available evidence):

| Layer | Verdict | Evidence |
|---|---|---|
| 1 — Business intent | 🟢 spec-verified | `[BRAIN-OUT] flows/Add Node.md:5-15` published as canonical playbook |
| 2 — PRD requirement | 🟢 spec-verified | PRD-01 BR-AM-01 + Node entity in `ENTITIES.md` |
| 3 — Permission gate | 🟢 code-verified | `[CODE] pes-account-role-rules.json:7, 39, 66` for acc-* + admin-console-default-allow pattern for sys-* |
| 4 — BR-* rules | 🟢 spec-verified | BR-AM-01 enumerated in PRD `BUSINESS_RULES.md` |
| 5 — V-rules per step | 🟡 partial — V-subnode-name-maxlength-30 referenced but not seeded in vault | `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` rule #16 §4 |
| 6 — E-* entity drift | 🟢 vault-verified | E-node (8 drifts) + E-account-settings (14 drifts) documented in `[VAULT] _obsidian/40-API/E-*.md` |
| 7 — Backend DTOs | 🟡 spot-checked | `CreateSubNodeRequest { ParentId, Name }` shape from `[BRAIN-OUT] flows/Add Node.md:34, 49`; `[ThrowIf*]` attributes from same source |
| 8 — Backend endpoint + handler | 🟡 spot-checked | Endpoint path + auth verified; handler internals (`ICreateSubNodeHandler`) not source-cited |
| 9 — FluentValidator + handler-time gate | 🟡 spot-checked | Handler-level checks documented; no FluentValidator chain enumerated `(no source — needs investigation)` |
| 10 — Kafka events | 🔴 unverified | `[BRAIN-OUT] flows/Add Node.md:60` explicitly says "whether a NodeCreated event fires for sub-node creation is unverified" |
| 11 — Error codes | 🟢 catalog-verified | 12 codes mapped to HTTP status in `[BRAIN-OUT] 13-error-catalog/CATALOG.md` |
| 12 — FE route + PES gate | 🟢 code-verified | `falcon-access.registry.ts` is the SoT; PES registry entry `managementConsole.organization.add` exists at `REGISTRY-RAW.md:68` |
| 13 — FE components | 🟢 spec-verified | Falcon UI Core component map enumerated in `[BRAIN-OUT] flows/Add Node.md:102-112` |
| 14 — FE form + state | 🟡 spot-checked | Reactive `FormGroup` pattern is canonical; no documented async pre-flight `(no source — needs investigation)` |
| 15 — FE i18n keys | 🔴 unverified | `[INFERRED]` — playbook silent; concrete keys need to be confirmed against existing i18n bundles |
| 16 — Test case (Gherkin) | 🟡 spot-checked | Scenarios composed from documented BRs + V-rules + error codes; need to be run against a live stack |
| 17 — Port artifact | 🟢 spec-verified | Dual-console by architectural design; same DTO + endpoint, two wrapper folders |
| 18 — Capability map per role | 🟢 code-verified | `pes-account-role-rules.json` seed rules + per-role capability maps |

**No layer has been ✋ runtime-verified for Add Node specifically.** The closest runtime evidence is the sister `comms-hub` flow verification in `[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md`, which showed the backend PES gate works correctly (21/21) but the FE was blocked on infrastructure issues. Add Node runtime verification awaits a working FE stack with seeded test users (`[MEMORY] project_local_backend_test_users_2026_05_16.md` — every test user uses `Admin@1234` per `[MEMORY] feedback_test_user_password_standard.md`).

---

## The traceability backbone

This section shows how **layer N+1 is uniquely determined by layer N** — the data flows downhill, each layer is consequent on the one above.

```
[1] Business intent: "organize a tenant tree into sub-units"
    │
    │ (PRD authors translate the intent into rules)
    ▼
[2] PRD requirement: PRD-01 BUSINESS_RULES.md BR-AM-01 (3-level hierarchy)
    │
    │ (BR-AM-01 + the role-x-scope matrix fix the role gate at PRD level)
    ▼
[3] Permission gate: 5/6 roles allowed (all sys-* + acc-owner + acc-admin)
    │
    │ (PRD BR-AM-11 fixes MaxNodeLevel as the runtime depth cap)
    ▼
[4] BR-AM rules: 5 cross-feature rules touched (BR-AM-01/09/10/11/12)
    │
    │ (BR-AM-03's letter-prefix is a sister rule from Account Name — may apply, PRD silent)
    ▼
[5] V-rules per step: 2 direct (V-subnode-name-maxlength-30 + V-account-limits-zero-means-no-limit) + 1 sister (V-account-name-format-uniqueness)
    │
    │ (Each V-rule names the DTO field + handler check that enforces it)
    ▼
[6] E-* entity drift: 2 entities — E-node created + E-account-settings read
    │
    │ (Backend persists Node via single-call DTO)
    ▼
[7] Backend DTO: CreateSubNodeRequest { ParentId, Name } + [ThrowIf*] attributes
    │
    │ (The DTO is consumed by ONE endpoint)
    ▼
[8] Backend endpoint: POST /api/Node/create-SubNode on NodeController
    │
    │ (Pre-processor runs [ThrowIf*]; handler runs scope + structure + depth + uniqueness)
    ▼
[9] FluentValidator + handler-time gate
    │
    │ (On commit success, handler returns ServiceOperationResult<bool> — no Kafka emit observed)
    ▼
[10] Kafka events: NONE observed (per playbook §State / side effects — unverified-but-likely-zero)
    │
    │ (Every validation/handler path can fail with mapped error codes)
    ▼
[11] Error codes: ~12 codes across 5 HTTP status classes
    │
    │ (Frontend must surface them; FE route must gate access)
    ▼
[12] FE route + PES gate: /organization-hierarchy + AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode')
    │
    │ (Once gated, FE renders a single <falcon-dialog> from Falcon UI Core)
    ▼
[13] FE components: 1 dialog + 1 input + 2 buttons — single form, no wizard
    │
    │ (The input wires into a Reactive FormGroup with 2 controls)
    ▼
[14] FE form + state: Reactive FormGroup, single submit, immediate tree-refresh on success
    │
    │ (Display copy is i18n-resolved; error messages from backend already localized)
    ▼
[15] FE i18n keys: en + ar resolutions per field + per error class
    │
    │ (Tests assert the full chain — happy + failure modes)
    ▼
[16] Test case (Gherkin): 6 scenarios covering happy + 5 failure modes
    │
    │ (Codebase placement follows folder doctrine — dual-console)
    ▼
[17] Port artifact: BOTH admin-console + management-console (organizational, intra-tenant)
    │
    │ (Per-role capability verdict — the actual runtime answer)
    ▼
[18] Capability map per role: 5 of 6 roles PASS
```

**Implication.** A change in layer 1 (e.g. "add a per-sub-node settings override") cascades downward and re-opens every layer below — it would require a new DTO field (Layer 7), a new endpoint or DTO version (Layer 8), a new FluentValidator (Layer 9), possibly new Kafka events for settings propagation (Layer 10), new error codes (Layer 11), new form controls (Layer 14), new i18n keys (Layer 15), and updated capability maps (Layer 18). Conversely, an audit at layer 18 (a role's verdict) can be unwound back to layer 2 (BR-AM-01 + the role-x-scope matrix) — making this trace **bidirectional** for compliance and impact analysis.

---

## Honest gaps surfaced

This trace flags the following **honest gaps** that future authors should close:

| # | Gap | Layer | Source flag |
|---|---|---|---|
| 1 | `V-subnode-name-maxlength-30` referenced but no `.md` in the vault — candidate "26th V-rule" | 5 | `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` §4 rule 16 |
| 2 | Letter-prefix on sub-node name — PRD silent; backend NOT enforcing | 2, 5 | `[BRAIN-OUT] flows/Add Node.md:39, 100, 136` |
| 3 | `DuplicateNodeName` uniqueness scope (per-parent / per-account / global) — PRD silent | 4, 8, 11 | `[BRAIN-OUT] flows/Add Node.md:135` |
| 4 | Per-node `settings` override — PRD entity diagram suggests, backend has none | 6 | `[BRAIN-OUT] flows/Add Node.md:41, 137` |
| 5 | NodeCreated Kafka event for sub-node — **unverified** (not in `ENDPOINT_REGISTRY.md`) | 10 | `[BRAIN-OUT] flows/Add Node.md:60` |
| 6 | FluentValidator chain for `CreateSubNodeRequest` — not enumerated in any source | 9 | `(no source — needs investigation)` |
| 7 | Async sub-node-name uniqueness pre-flight — not documented (compare to Add Client's debounced 300 ms) | 5, 14 | `(no source — needs investigation)` |
| 8 | FE PES accessor name mismatch — `REGISTRY-RAW.md:68` lists `managementConsole.organization.add` while `flows/Add Node.md:30` references `managementConsole.organizationHierarchy.addSubNode` — likely two accessor names for the same rule | 3, 12 | `[INFERRED]` |
| 9 | Move sub-node — Q-AM-18 open; GAP-AM-07 MISSING; UI must NOT surface | 17 (cross-flow) | `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:97-102` |
| 10 | Concrete i18n keys — playbook silent | 15 | `[INFERRED]` |

---

## Cross-references

### Source playbook (Brain Outputs — canonical SoT)

- [Add Node playbook](../../../understanding/pages/organization-hierarchy/flows/Add%20Node.md) — single-file playbook (143 lines), the primary source for this trace
- [Edit Node playbook](../../../understanding/pages/organization-hierarchy/flows/Edit%20Node.md) — sibling rename flow on the same page

### Authority dataset clusters (this dataset)

- [01-roles/sys-admin](../01-roles/sys-admin.md) · [01-roles/sys-products](../01-roles/sys-products.md) · [01-roles/sys-ops](../01-roles/sys-ops.md)
- [01-roles/acc-owner](../01-roles/acc-owner.md) · [01-roles/acc-admin](../01-roles/acc-admin.md) · [01-roles/acc-user](../01-roles/acc-user.md)
- [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md) — `managementConsole.organization.add` at line 68
- [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md) — OH page parity admin↔mgmt
- [05-capability-maps/sys-admin.capability](../05-capability-maps/sys-admin.capability.md) — Add Node row at `:52`
- [05-capability-maps/sys-products.capability](../05-capability-maps/sys-products.capability.md) — `:52`
- [05-capability-maps/sys-ops.capability](../05-capability-maps/sys-ops.capability.md) — `:52`
- [05-capability-maps/acc-owner.capability](../05-capability-maps/acc-owner.capability.md) — `:110`
- [05-capability-maps/acc-admin.capability](../05-capability-maps/acc-admin.capability.md) — `:109`
- [05-capability-maps/acc-user.capability](../05-capability-maps/acc-user.capability.md) — `:105` (deny)
- [06-validation-by-feature/MATRIX](../06-validation-by-feature/MATRIX.md) — §4 rule 16 (V-subnode-name-maxlength-30 sister)
- [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md) — System Gateway + Core Gateway path transforms
- [08-entity-drift-by-feature/MATRIX](../08-entity-drift-by-feature/MATRIX.md) — E-node + E-account-settings on OH column
- [09-business-rules-by-feature/MATRIX](../09-business-rules-by-feature/MATRIX.md) — BR-AM-* rows for OH
- [10-non-pes-gates-by-feature/MATRIX](../10-non-pes-gates-by-feature/MATRIX.md) — node-type gate (Root cannot have sub-nodes)
- [13-error-catalog/CATALOG](../13-error-catalog/CATALOG.md) — 12 Add-Node-surfacing codes
- [13-error-catalog/FE-CONTRACT](../13-error-catalog/FE-CONTRACT.md) — FE error-handling rule
- [14-flow-playbook-integration/Add-Node-and-Edit-Node.integration](../14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md) — authority-lens already done
- [Add-Client.trace.md](Add-Client.trace.md) — the canonical exemplar this trace mirrors

### Brain SK vault notes (V-rules + Entities)

- [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) — `MaxNodeLevel` runtime gate
- [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) — sister rule (letter-prefix cosmetic mirror)
- `V-subnode-name-maxlength-30` — **referenced but NOT YET SEEDED** in `_obsidian/30-Validation/`; candidate 26th rule
- [`E-node`](../../../../Brain%20SK/_obsidian/40-API/E-node.md) — primary entity created
- [`E-account-settings`](../../../../Brain%20SK/_obsidian/40-API/E-account-settings.md) — `MaxNodeLevel` source

### Memory standing rules (load-bearing for implementation)

- `[MEMORY] project_falcon_component_validation_convention.md` — folder + DI doctrine
- `[MEMORY] feedback_library_skeleton_app_api.md` — library vs app-level wrapper rule
- `[MEMORY] feedback_falcon_custom_library_mandatory.md` — Falcon UI kit first; no PrimeNG
- `[MEMORY] feedback_no_inline_styles_tokens_only.md` — Tailwind utilities + tokens only
- `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md` — PES subject MUST be Zitadel id
- `[MEMORY] feedback_frontend_auth_identity_service.md` — FE never calls Zitadel directly
- `[MEMORY] feedback_test_user_password_standard.md` — every test user uses `Admin@1234`
- `[MEMORY] project_org_hierarchy_tree_shared_component.md` — `<app-organization-hierarchy-tree>` wrapper exposes `add-sub-node` action key

### Sibling integration files (authority-dataset 14- cluster)

- [Add-Client.integration](../14-flow-playbook-integration/Add-Client.integration.md) — creates the Main node + Account that Add Node operates inside
- [Add-User.integration](../14-flow-playbook-integration/Add-User.integration.md) — users live on nodes; counts against `MaxNormalUserLimit`
- [Add-Node-and-Edit-Node.integration](../14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md) — combined authority lens for both flows
- [MATRIX](../14-flow-playbook-integration/MATRIX.md) — master 4-flows view

### Open question registers

- Q-AM-08 (archive state — soft-delete tombstone model expects state but no write path)
- Q-AM-18 (move node — Q-AM-18 open; GAP-AM-07 MISSING; no `MoveNode` endpoint)
- Q-AM-24 (Kafka topic enumeration — sub-node-create emission unverified)
- (new candidate) `Q-AM-SUBNODE-UNIQ-SCOPE` — `DuplicateNodeName` per-parent / per-account / global? PRD silent
- (new candidate) `Q-AM-SUBNODE-NAME-FORMAT` — does BR-AM-03 letter-prefix mirror to sub-node names? PRD silent
