---
type: flow-integration
flows:
  - Add Node
  - Edit Node
playbooks:
  - Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md
  - Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md
prd-module: PRD-01 Account Management
purpose: "Answers 'who can Add/Edit Node + scope constraints (own-subtree vs anywhere) + which 2 entities (E-node + E-account-settings) apply'. Open when implementing tree-row Add/Rename actions."
extracted: 2026-05-16
---

# Add Node & Edit Node — Flow × Authority Integration

> [!tldr]
> Two single-dialog flows on the Organization Hierarchy tree. **Add Node** creates a sub-node under an existing parent (`POST /api/Node/create-SubNode`). **Edit Node** renames an existing node — immediately or scheduled (`PUT /api/Node/ChangeNodeName` with optional `EffectiveDate?`). Both flows are bounded by `AccountSettings.MaxNodeLevel` and the role-x-scope matrix. Same 5-of-6 role gate as each other; same 2 entities (E-node primary + E-account-settings read-only). **Move node** and **Archive/Delete node** operations are explicitly MISSING — UI must NOT surface them.

## Shared permission gate

> Source: `[BRAIN-OUT] flows/Add Node.md:18-30` + `[BRAIN-OUT] flows/Edit Node.md:30-43`. Same matrix applies to both flows (scope-restricted for acc-* in both cases).

| Role | Add Node | Edit Node (rename) | Scope constraint | Cited from |
|---|---|---|---|---|
| `sys-admin` | ✅ | ✅ | Anywhere | `[BRAIN-OUT] flows/Add Node.md:24` + `[BRAIN-OUT] 01-roles/sys-admin.md:75-78` |
| `sys-products` | ✅ | ✅ | Anywhere (same as sys-admin for these flows) | `[BRAIN-OUT] flows/Add Node.md:25` + `[BRAIN-OUT] 01-roles/sys-products.md:73-81` |
| `sys-ops` | ✅ | ✅ | Anywhere; Operation can add nodes / users (cannot add **clients**) | `[BRAIN-OUT] flows/Add Node.md:26` |
| `acc-owner` | ✅ | ✅ | Within own Main subtree only | `[BRAIN-OUT] flows/Add Node.md:27` + `[BRAIN-OUT] 01-roles/acc-owner.md:51` (`acc.organization.add` allow) |
| `acc-admin` | ✅ | ✅ | Within own sub-nodes only | `[BRAIN-OUT] flows/Add Node.md:28` + `[BRAIN-OUT] 01-roles/acc-admin.md:51` (`acc.organization.add` allow) |
| `acc-user` | ❌ | ❌ | Transactional only — `acc.organization.add` explicitly denied | `[BRAIN-OUT] flows/Add Node.md:29` + `[BRAIN-OUT] 01-roles/acc-user.md:51` |

**Conclusion:** 5 of 6 roles can run both flows.

**Frontend gate (Add Node):** `AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode')` (or admin-side equivalent) `[BRAIN-OUT] flows/Add Node.md:30`. Backend gate: class-level `[Authorize]` on `NodeController` — no `FalconOnly` policy (Client users CAN call) `[BRAIN-OUT] flows/Add Node.md:52`. Error: 403 `UnauthorizedAction` / `UnauthorizedUserToPerformThisAction`.

**Frontend gate (Edit Node):** `FalconAccess.managementConsole.organizationHierarchy.renameNode()` (per playbook; no separate seed PES key — gated through tree row action) `[BRAIN-OUT] flows/Edit Node.md:43`.

**Gateway routing:** Same Commerce endpoint serves both gateways. sys-* via System Gateway (`:7256`); acc-* via Core Gateway (`:7038`). No re-routing rules `[BRAIN-OUT] flows/Add Node.md:50-52`.

## Add Node — authority cross-cut

> Single-dialog flow, no wizard chrome. 2 form fields (Parent Node read-only + Node Name input).

| Field × authority | Detail | Reference |
|---|---|---|
| **PES key checked** | `managementConsole.organizationHierarchy.addSubNode` (FE only); backend class-level `[Authorize]` + handler-time scope check | `[BRAIN-OUT] flows/Add Node.md:30` |
| **V-rules used** | `V-subnode-name-maxlength-30` (Name: `Validators.required` + `Validators.maxLength(30)` + suggested mirrored letter-prefix client-side pattern — no backend mirror) `[BRAIN-OUT] flows/Add Node.md:98` · `V-account-limits-zero-means-no-limit` (gates `MaxNodeLevel`; 0 = no limit; breach surfaces as 422 `MaxNodeLevelReached`) `[BRAIN-OUT] flows/Add Node.md:99` · `V-account-name-format-uniqueness` (sister rule on Main-node Account Name; letter-prefix portion may or may not apply to sub-node names — PRD silent) `[BRAIN-OUT] flows/Add Node.md:100` | per the playbook |
| **Entities consumed** | `E-node` (primary; created child of `ParentId`) `[BRAIN-OUT] flows/Add Node.md:93` · `E-account-settings` (read-only — `MaxNodeLevel` gate; sub-nodes inherit settings from owning Account, no per-sub-node settings table) `[BRAIN-OUT] flows/Add Node.md:57, 94` | per playbook §Entity references |
| **BR rules** | `BR-AM-01` (3-level Root/Main/Sub hierarchy) | `[BRAIN-OUT] flows/Add Node.md:19` |
| **Status transition** | New `Node` row created (no explicit status field exposed); wallet topology: no new wallet record auto-created (wallets bound to commchannels / users, not sub-nodes) | `[BRAIN-OUT] flows/Add Node.md:56-58` |
| **Kafka events** | NodeCreated event for sub-node NOT visible in Commerce `ENDPOINT_REGISTRY.md` — unverified (Commerce produces 11 Kafka topics total per GAP-AM-24) | `[BRAIN-OUT] flows/Add Node.md:60` |
| **Error codes** | 400: `ParentIdRequired` · `RequiredFieldMissing` · `MaxLengthExceeded` · 404: `ParentNodeRequired` · `NodeNotFound` · 409 (typical): `DuplicateNodeName` · 422: `MaxNodeLevelReached` · `RootNodeCannotHaveSubNodes` · `ActionsNotAllowedOnDeletedNode` · `InvalidNodeLevel` · 403: `UnauthorizedAction` | `[BRAIN-OUT] flows/Add Node.md:49, 65-76` |

### Backend endpoint

| Method | Path | Service | Request | Response |
|---|---|---|---|---|
| POST | `/commerce/Node/create-SubNode` | [[Commerce Service]] `NodeController.CreateSubNode` | `CreateSubNodeRequest { ParentId, Name }` (both `[ThrowIfNotPassed]`; `Name` has `[ThrowIfMaxLengthExceed(30)]`) | `ServiceOperationResult<bool>` (success flag) |

### Drift / gap notes (Add Node)

| Field | Drift | Reference |
|---|---|---|
| `type` on Node | PRD lists `type` (root/main/sub) but **not on `CreateSubNodeRequest`** — backend infers from position. UI must NOT expose this field. | `[BRAIN-OUT] flows/Add Node.md:40` |
| `settings` on Node | PRD-hinted per-node settings but **no DTO surfaces it**. Sub-nodes inherit from Main. UI must NOT expose a settings step on Add Node dialog. | `[BRAIN-OUT] flows/Add Node.md:41` |
| Letter-prefix on sub-node name | PRD silent; backend does NOT enforce. Cosmetic FE rule only. | `[BRAIN-OUT] flows/Add Node.md:100, 136` |
| Uniqueness scope on `DuplicateNodeName` | Per-parent, per-account, or globally? Confirm with `ICreateSubNodeHandler`. PRD silent. | `[BRAIN-OUT] flows/Add Node.md:135` |

## Edit Node — authority cross-cut

> Family of operations. Operations 1 (immediate rename) + 2 (scheduled rename) are **LIVE**. Operations 3 (move node) + 4 (archive/delete) are **MISSING** — UI must NOT surface them. Operation 5 (edit AccountSettings on Main only) is documented here for cross-flow awareness but belongs to the Settings-tab sub-flow.

### Operation 1 — Rename (immediate) · LIVE

| Field × authority | Detail | Reference |
|---|---|---|
| **PES key checked** | `FalconAccess.managementConsole.organizationHierarchy.renameNode()` (FE only); backend class-level `[Authorize]` | `[BRAIN-OUT] flows/Edit Node.md:43` |
| **V-rules used** | `V-subnode-name-maxlength-30` (NewName: required + maxLength(30)) · `V-account-name-format-uniqueness` (sister rule — letter-prefix may apply, PRD silent) | `[BRAIN-OUT] flows/Edit Node.md:56` |
| **Entities mutated** | `E-node` (primary; `Name` updated immediately) | `[BRAIN-OUT] flows/Edit Node.md:67` |
| **Status transition** | `Node.Name` updated; node label updates in tree on cache refresh | `[BRAIN-OUT] flows/Edit Node.md:66-69` |
| **Kafka events** | Possible `NodeRenamed` event — **unverified** in backend | `[BRAIN-OUT] flows/Edit Node.md:69` |
| **Error codes** | 400: `NodeNameRequired` · `RequiredFieldMissing` · `MaxLengthExceeded` · 404: `NodeNotFound` · 409 (likely): `DuplicateNodeName` · 422 (likely): `NoChangesToUpdate` · `NewNodeNameNotApplyed` (note backend typo) · `ActionsNotAllowedOnDeletedNode` · 403: `UnauthorizedAction` | `[BRAIN-OUT] flows/Edit Node.md:63, 73-82` |

### Operation 2 — Scheduled rename · LIVE (backend ➕ extra)

> **Important:** This capability is a backend extra per `[BRAIN-OUT] E-node` row 6. PRD does NOT document scheduled rename. Confirm with product before exposing in UI for v1 `[BRAIN-OUT] flows/Edit Node.md:88-89`.

| Field × authority | Detail | Reference |
|---|---|---|
| **V-rules used** | `V-subnode-name-maxlength-30` + `V-account-name-format-uniqueness` (sister); `EffectiveDate?` must be strictly future (client-side `futureDateValidator`); same error semantics as price-type/value changes — `EffectiveDateMustBeInFuture` (422) is the canonical mismatch code (documented for price changes; rename-handler reuse is unverified — surface as gap) | `[BRAIN-OUT] flows/Edit Node.md:95-96` |
| **Status transition** | Rename queued; current name remains until `EffectiveDate`. Annotate row with pending-change badge ([[Falcon Status Badge]]) — shadow-row pattern from Wave 20 (UIUX-SHADOW-001..005) | `[BRAIN-OUT] flows/Edit Node.md:104` |
| **Cancellation** | **NO explicit endpoint observed** for cancelling a pending scheduled rename. Surface as gap `Q-AM-RENAME-CANCEL`. Workaround: submit another `ChangeNodeName` with current name + future date, or with `EffectiveDate = null`. | `[BRAIN-OUT] flows/Edit Node.md:105` |
| **Additional error codes** | 400 `EffectiveDateRequired` (likely; documented for price changes — confirm rename-handler reuse) · 422 `EffectiveDateMustBeInFuture` (likely) | `[BRAIN-OUT] flows/Edit Node.md:111-115` |

### Operations 3 & 4 — Move node / Archive-Delete node · MISSING

| Op | Status | UI rule | Cited from |
|---|---|---|---|
| Move node | Not implemented (Q-AM-18 open; GAP-AM-07 MISSING) — no `MoveNode` / `ReParentNode` endpoint | UI must NOT surface a `Move node` action. Drag-drop reorder, if added, must be feature-flagged off. | `[BRAIN-OUT] flows/Edit Node.md:118-124` |
| Archive / delete node | Not implemented (Q-AM-08 open; GAP-AM-29 MISSING) — no `DELETE /api/Node/{id}` and no `archive` field on `GetMainNodeInfoResponse` | UI must NOT surface `Archive node` / `Delete node` actions. Do NOT wire a [[Falcon Confirm Dialog]]. | `[BRAIN-OUT] flows/Edit Node.md:127-139` |

Backend codes `ActionsNotAllowedOnDeletedNode` (422) + `RootNodeDeletionNotAllowed` (422) are already defined — suggesting the model expects a soft-delete state, but no write path to enter it `[BRAIN-OUT] flows/Edit Node.md:131-135`.

### Operation 5 — Edit AccountSettings on Main node · LIVE (cross-flow link)

> Main-node only (sub-nodes get 422 `MainNodeOnlyOperation`). Surface = Settings tab of the Organization Hierarchy page, not a dialog. Out of scope for the Hierarchy-tab kebab; cross-link only `[BRAIN-OUT] flows/Edit Node.md:143-151`. Endpoint: `PUT /api/Setting` (`UpdateSettingsRequest`); read via `GET /api/Setting?ownerId=`. V-rules: `V-account-limits-zero-means-no-limit` · `V-password-security-level-enum` · `V-account-ip-allowlist-enforcement`. PES gate: "Edit Account Limitations" and "Edit Password Security Level on Root/Main" are Falcon-only with Operation = Not Allow per W7 workflow.

### Backend endpoint (Operations 1 & 2)

| Method | Path | Service | Request | Response |
|---|---|---|---|---|
| PUT | `/commerce/Node/ChangeNodeName` | [[Commerce Service]] `NodeController.ChangeNodeName` | `ChangeNodeNameRequest { NodeId, NewName, EffectiveDate? }` (`EffectiveDate=null` → immediate; future ISO-8601 → scheduled) | `ServiceOperationResult<string>` (new node name) |

## Cross-cluster citations

### V-rules consolidated (4 across both flows)

| V-rule | Add Node | Edit Node | Reference |
|---|---|---|---|
| `V-subnode-name-maxlength-30` | ✅ on `Name` | ✅ on `NewName` | `[BRAIN-OUT] flows/Add Node.md:98` + `[BRAIN-OUT] flows/Edit Node.md:56` |
| `V-account-name-format-uniqueness` | ✅ (sister; letter-prefix may apply) | ✅ (sister; letter-prefix may apply on rename) | `[BRAIN-OUT] flows/Add Node.md:100` + `[BRAIN-OUT] flows/Edit Node.md:174` |
| `V-account-limits-zero-means-no-limit` | ✅ (gates `MaxNodeLevel`) | ✅ (Op 5 only — settings edit) | `[BRAIN-OUT] flows/Add Node.md:99` + `[BRAIN-OUT] flows/Edit Node.md:175` |
| `V-password-security-level-enum` | — | ✅ (Op 5 only — settings edit) | `[BRAIN-OUT] flows/Edit Node.md:176` |

### Entity drift consolidated

| Entity | Add Node | Edit Node | Drift notes |
|---|---|---|---|
| `E-node` | Created | Mutated (name) — `EffectiveDate?` is a backend ➕ extra not in PRD | `type` not on response DTO (carries through both flows) · `settings` PRD-hinted on Node but no DTO surfaces it `[BRAIN-OUT] flows/Add Node.md:40-41` + `[BRAIN-OUT] flows/Edit Node.md:166-168` |
| `E-account-settings` | Read-only (`MaxNodeLevel`) | Read+write (Op 5 only) | `[BRAIN-OUT] flows/Add Node.md:94` + `[BRAIN-OUT] flows/Edit Node.md:169` |

### Business rules consolidated

| Rule | Where it fires | Reference |
|---|---|---|
| `BR-AM-01` (3-level Root/Main/Sub hierarchy) | Add Node | `[BRAIN-OUT] flows/Add Node.md:19` |
| `BR-AM-03` (account-name letter-prefix + uniqueness) | Edit Node (rename — may apply to sub-node names, PRD silent) | `[BRAIN-OUT] flows/Edit Node.md:56` |

### Non-PES gates

| Gate type | Where | Effect |
|---|---|---|
| Class-level `[Authorize]` on `NodeController` (no `FalconOnly`) | Both flows | Both gateways serve; Client users CAN call sub-node-create and rename `[BRAIN-OUT] flows/Add Node.md:52` |
| `MaxNodeLevel` cap (from `AccountSettings`) | Add Node submit | 422 `MaxNodeLevelReached` |
| `ActionsNotAllowedOnDeletedNode` guard | Both flows | 422 if target node was soft-deleted (model expects state; no write path) |
| `RootNodeCannotHaveSubNodes` guard | Add Node submit | 422 if parent = Falcon Root (UI must prevent triggering Add Node on Root) |
| `MainNodeOnlyOperation` guard | Edit Node Op 5 only | 422 on sub-nodes (Op 5 is Main-only) |
| Future-date client-side validator | Edit Node Op 2 | Pre-empts 422 `EffectiveDateMustBeInFuture` |

### Error codes consolidated

> Full mappings in `[BRAIN-OUT] flows/Add Node.md:65-76` + `[BRAIN-OUT] flows/Edit Node.md:73-82, 111-115`.

| HTTP | Add Node | Edit Node (immediate) | Edit Node (scheduled) |
|---|---|---|---|
| 400 | `ParentIdRequired` · `RequiredFieldMissing` · `MaxLengthExceeded` | `NodeNameRequired` · `RequiredFieldMissing` · `MaxLengthExceeded` | + `EffectiveDateRequired` |
| 404 | `ParentNodeRequired` · `NodeNotFound` | `NodeNotFound` | `NodeNotFound` |
| 409 | `DuplicateNodeName` (typical) | `DuplicateNodeName` (likely) | `DuplicateNodeName` (likely) |
| 422 | `MaxNodeLevelReached` · `RootNodeCannotHaveSubNodes` · `ActionsNotAllowedOnDeletedNode` · `InvalidNodeLevel` | `NoChangesToUpdate` · `NewNodeNameNotApplyed` (typo) · `ActionsNotAllowedOnDeletedNode` | + `EffectiveDateMustBeInFuture` |
| 403 | `UnauthorizedAction` | `UnauthorizedAction` | `UnauthorizedAction` |

## Cross-flow dependencies

- **Add Node depends on Add Client** (the Main node / Account must exist before any sub-node can be added). Root + Main creation paths are separate; Add Node is for the Sub-node tier only `[BRAIN-OUT] flows/Add Node.md:82`.
- **Edit Node depends on Add Node** (rename is for the newly-created sub-node) — and on Add Client (Main-node creation precedes any rename of Main).
- **Edit Node sibling — Settings tab edit (Op 5)** uses `PUT /api/Setting`, not `PUT /api/Node/ChangeNodeName`. Owned by the Settings-tab portion of the page.
- **Move sub-node — OUT of scope** (Q-AM-18 open; UI must stay off).
- **Archive/delete node — OUT of scope** (GAP-AM-29 missing; UI must stay off; cascade rules need PRD definition before backend builds).
- **Children of Add Node:** Edit Node (rename of newly-created sub-node) · Add User (users counted against `MaxNormalUserLimit` / `MaxSystemUserLimit`).
- **Untouched siblings on the same page:** CommChannels & Services tab + Apps & Services tab are Account-level only (not per-sub-node); Settings tab Op 5 is Main-only.

## Cross-references

- Playbooks (canonical SoT):
  - `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md` (143 lines)
  - `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md` (224 lines)
- Authority dataset
  - [01-roles/sys-admin](../01-roles/sys-admin.md) · [01-roles/sys-ops](../01-roles/sys-ops.md) · [01-roles/sys-products](../01-roles/sys-products.md)
  - [01-roles/acc-owner](../01-roles/acc-owner.md) · [01-roles/acc-admin](../01-roles/acc-admin.md) · [01-roles/acc-user](../01-roles/acc-user.md)
  - [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md)
  - [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
  - [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md)
- Sibling integration files
  - [MATRIX](MATRIX.md)
  - [Add-Client.integration](Add-Client.integration.md) — creates the Main node + Account that Add Node + Edit Node act on
  - [Add-User.integration](Add-User.integration.md) — users live on nodes; counts against `MaxNormalUserLimit`
- Open question registers
  - Q-AM-08 (archive state) · Q-AM-18 (move node) · GAP-AM-07 (no MoveNode endpoint) · GAP-AM-29 (no DELETE Node endpoint) · Q-AM-RENAME-CANCEL (no cancel-pending-scheduled-rename endpoint)
