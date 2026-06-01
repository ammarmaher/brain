---
type: a-to-z-trace
feature: Edit Node
trace-depth: 18 layers
exemplar: false
purpose: "Complete A→Z trace of the Edit Node flow family (immediate rename · scheduled rename · settings edit on Main · two MISSING ops). Mirrors the Add-Client exemplar shape with per-operation drill-downs and explicit MISSING-op carve-outs."
audience: AI agents + developers needing the per-operation contract for tree-row rename actions
extracted: 2026-05-16
---

# Edit Node — A→Z Implementation Trace

## TL;DR

Edit Node is the **most operationally fragmented** flow on the Organization Hierarchy page — five operations under one umbrella, of which only **two are LIVE end-to-end** (immediate rename + scheduled rename via `PUT /api/Node/ChangeNodeName`), one is **LIVE but Main-only** (Edit AccountSettings via `PUT /api/Setting`), and **two are MISSING** (Move node `Q-AM-18` + Archive/Delete node `GAP-AM-29`). Authority granularity is **higher** than Add Client: the same role can rename a node, fail to edit its settings, and have no Move/Delete option — three different PES verdicts on the same tree row. Unlike Add Client which gates on **one** PES key (`sys.account / add`), Edit Node layers **per-operation** PES + **per-node-type** composite gates (`isFalconNode` / `isMainNodeSelection` / `isFirstLevelChild`) + **handler-level** scope filters (`MainNodeOnlyOperation`, `ActionsNotAllowedOnDeletedNode`, `RootNodeDeletionNotAllowed`). A porter that wires "rename" without re-evaluating the four other ops ships a UI that exposes phantom Move/Archive actions or a Settings sub-flow on the wrong node tier.

## The 18-layer trace at a glance

| # | Layer | What it answers | Primary source |
|---|---|---|---|
| 1 | Business intent | What user need does this serve? | `[BRAIN-OUT] flows/Edit Node.md:5-7` |
| 2 | PRD requirement | Which PRD lines authorize this flow? | `[BRAIN-OUT] prd/modules/01-account-management/BUSINESS_RULES.md` BR-AM-03; **scheduled rename + archive PRD-silent** |
| 3 | Permission gate | Who can run it (role × resource × action)? | `[BRAIN-OUT] flows/Edit Node.md:30-43` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:19-37` |
| 4 | BR-AM rules | What cross-field / workflow rules apply? | `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:64-98` + `[BRAIN-OUT] flows/Edit Node.md:171-176` |
| 5 | V-rules per step | What field-level validation rules govern each step? | `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:103-119` (OH drill-down) + `[BRAIN-OUT] flows/Edit Node.md:50-58, 91-96` |
| 6 | E-* entity drift | Which entities does this mutate + drift items? | `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:127-138` + `[BRAIN-OUT] flows/Edit Node.md:163-169` |
| 7 | Backend DTO | Request shape + `[ThrowIf*]` attributes | `[BRAIN-OUT] flows/Edit Node.md:51, 62` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:112` |
| 8 | Backend endpoint + handler | Route + controller + handler flow | `[BRAIN-OUT] flows/Edit Node.md:59-69` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:108-112` |
| 9 | FluentValidator + handler-time gate | What runs server-side after `[ThrowIf*]`? | `[BRAIN-OUT] flows/Edit Node.md:73-82, 105` |
| 10 | Kafka events | What downstream events fire on success? | `[BRAIN-OUT] flows/Edit Node.md:69` (unverified) + `[BRAIN-OUT] 14-flow-playbook-integration/MATRIX.md:34` |
| 11 | Error codes | Every `FalconKeys.Error.*` Edit Node can surface | `[BRAIN-OUT] 13-error-catalog/CATALOG.md:43, 140, 175, 220-256` + `[BRAIN-OUT] flows/Edit Node.md:73-82, 111-115` |
| 12 | FE route + PES gate | Route path + `data.access` + `FalconAccess.*` key | `[BRAIN-OUT] flows/Edit Node.md:43` (claim) + `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md` (gap — no canonical key) |
| 13 | FE components | Falcon UI Core components used per surface | `[BRAIN-OUT] flows/Edit Node.md:178-190` |
| 14 | FE form + state | NgForm/FormGroup choice + state machine | `[BRAIN-OUT] flows/Edit Node.md:200-209` + `[MEMORY] project_falcon_component_validation_convention.md` |
| 15 | FE i18n keys | Translation keys (en + ar resolutions) | `[INFERRED]` — playbook silent; recommended namespace inferred from sister flows |
| 16 | Test case (Gherkin) | 5+ scenarios with realistic assertions | composed from layers 3 + 4 + 5 + 11 |
| 17 | Port artifact | admin-console vs management-console | `[BRAIN-OUT] flows/Edit Node.md:32-43` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:21-38` |
| 18 | Capability map per role | 6 roles × per-op verdict matrix | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:54` + 5 sister files |

---

## Layer 1 — Business intent

**The user need.** An operator (Falcon staff or Client admin) needs to change a property of an **existing** node in the hierarchy tree. The "property" is intentionally broad — the playbook authors group five distinct operations under "Edit Node":

| Op # | Operation | Status | What it actually changes |
|---|---|---|---|
| 1 | Rename (immediate) | ✅ LIVE | `Node.Name` updated in-place |
| 2 | Scheduled rename | ✅ LIVE (backend ➕ extra; PRD-silent) | `Node.Name` queued; current name remains until `EffectiveDate` |
| 3 | Move node | ❌ MISSING (`Q-AM-18` open · `GAP-AM-07`) | _no endpoint exists_ — UI MUST NOT expose |
| 4 | Archive / delete node | ❌ MISSING (`Q-AM-08` open · `GAP-AM-29`) | _no endpoint exists_ — UI MUST NOT expose |
| 5 | Edit AccountSettings on Main | ✅ LIVE (Main-only; sub-nodes get 422) | `AccountSettings.{PasswordSecurityLevel, AllowedIPs, 4 limits}` |

`[BRAIN-OUT] flows/Edit Node.md:11-17`

**Why this is harder than Add Client.** Add Client is one composite POST; Edit Node is **five distinct contracts**. Each operation has its own:
- PES verdict (rename != settings-edit != move)
- DTO shape (`ChangeNodeNameRequest` vs `UpdateSettingsRequest` vs none)
- Node-type gate (settings-edit is Main-only; rename works on any non-root node)
- Status guard (`ActionsNotAllowedOnDeletedNode` for all writes; `MainNodeOnlyOperation` for settings)

The trace below treats the **two LIVE rename ops** as the primary subject (they share one endpoint and one DTO), with the settings-edit op as a cross-link and the two MISSING ops as **explicit no-go zones** that the UI must enforce.

**The flow's promise.** A safe, role-scoped, type-aware mutation of node identity (Operations 1 + 2) with explicit boundaries so an operator never sees an action they cannot complete.

---

## Layer 2 — PRD requirement

**Module:** PRD-01 Account Management. `[BRAIN-OUT] flows/Edit Node.md:3`

**Authoring source.** Edit Node has a **smaller** PRD surface than Add Client — most of the operations' contracts are inferred from sister rules.

| PRD artifact | What it carries | Used by Edit Node for |
|---|---|---|
| `BUSINESS_RULES.md` BR-AM-03 (account-name letter-prefix + uniqueness) | Naming rule on Main node | Rename of Main node — **may** apply to sub-nodes (PRD silent) `[BRAIN-OUT] flows/Edit Node.md:56, 174` |
| `BUSINESS_RULES.md` BR-AM-09..13 (account settings rules) | Password level + 4 limits | Operation 5 (settings edit on Main) `[BRAIN-OUT] flows/Edit Node.md:148-151` |
| `OVERVIEW.md` Actors row 3 (Operation = view-only on some settings) | Falcon Operation scope | Op 5 (Operation cannot edit Account Limitations / Password Security) `[BRAIN-OUT] flows/Edit Node.md:38, 150` |
| `Q-AM-18` (open question — move node) | Move-node business need | Operation 3 — explicitly out of scope `[BRAIN-OUT] flows/Edit Node.md:120` |
| `Q-AM-08` (open question — archive vs deleted state) | Archive lifecycle | Operation 4 — explicitly out of scope `[BRAIN-OUT] flows/Edit Node.md:129` |
| `GAP-AM-07` + `GAP-AM-29` | Missing endpoints | Operations 3 + 4 — UI must not surface `[BRAIN-OUT] flows/Edit Node.md:120, 129` |

**Critical PRD silences** (each is an open question the implementer surfaces back to the product owner per `[BRAIN-OUT] flows/Edit Node.md:213-219`):

1. **PRD does NOT document scheduled rename.** Backend supports `ChangeNodeNameRequest.EffectiveDate?` — this is a backend ➕ extra per `[VAULT] E-node.md` field reconciliation row 6.
2. **PRD does NOT document a cancel-pending-scheduled-rename path.** No `DELETE /api/Node/scheduled-rename/{id}` observed. Workaround: re-submit `ChangeNodeName` with `EffectiveDate=null` or a different future date.
3. **PRD does NOT confirm whether BR-AM-03 letter-prefix applies to sub-node renames.** Sister-rule borrow from Add Client Step 1.
4. **PRD does NOT define DuplicateNodeName uniqueness scope** — per-parent, per-account, or global?
5. **PRD does NOT specify an audit trail** for renames. Security/audit expectations unconfirmed.

---

## Layer 3 — Permission gate

**The matrix.** `[BRAIN-OUT] flows/Edit Node.md:30-43` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:19-37`

| Role | Rename (Ops 1+2) | Edit Settings on Main (Op 5) | Scope | Source |
|---|---|---|---|---|
| `sys-admin` (System Administrator) | ✅ Anywhere | ✅ | global | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:54` |
| `sys-products` (Products) | ✅ Anywhere | ✅ (Account Limitations + price/visibility) | global | `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md:54` |
| `sys-ops` (Operation) | ✅ Anywhere | ⚠ view-only on Account Limitations + Password Security | global rename, restricted settings | `[BRAIN-OUT] flows/Edit Node.md:38` + `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md:54` (silent deny on `sys.account-profile / edit`) |
| `acc-owner` (Account Owner) | ✅ inside own Main subtree | ⚠ limited — AO can `Disable` / `Do Payment` commchannels; **cannot `Edit Price`** | tenant subtree | `[BRAIN-OUT] flows/Edit Node.md:39` + `[BRAIN-OUT] 01-roles/acc-owner.md:51-52, 62` (`acc.account-profile.edit` allow) |
| `acc-admin` (Node Admin) | ✅ inside own sub-nodes only | ❌ no settings actions | own sub-nodes | `[BRAIN-OUT] flows/Edit Node.md:40` + `[BRAIN-OUT] 01-roles/acc-admin.md:51-52, 61` (`acc.account-profile.edit` **deny**) |
| `acc-user` (Normal User) | ❌ | ❌ | none | `[BRAIN-OUT] flows/Edit Node.md:41` + `[BRAIN-OUT] 01-roles/acc-user.md:51-52, 62` (transactional only) |

**Two-flow asymmetry hidden inside one "Edit Node":** `acc-owner` and `acc-admin` agree on rename (✅) but **diverge** on settings-edit (`acc-owner` ✅ vs `acc-admin` ❌). This is a **field-level PES divergence** that a porter wiring "edit node" as one button will get wrong. The settings sub-flow MUST gate independently on `acc.account-profile.edit` per `[BRAIN-OUT] 01-roles/acc-admin.md:61`.

**The three-layer gate** — same defense-in-depth pattern as Add Client:

1. **Frontend visibility (UX gate)** — `AccessControlFacade.has('managementConsole.organizationHierarchy.renameNode')` per `[BRAIN-OUT] flows/Edit Node.md:43`. **GAP**: this key is NOT in the canonical PES registry — see Layer 12. `[INFERRED]` the implementer must either (a) add a new factory method to `falcon-access.registry.ts`, or (b) re-purpose an existing key like `acc.organization / add` (which only gates Add Node, not rename).
2. **PES policy at the gateway** — class-level `[Authorize]` on `NodeController` rejects anonymous calls but **does NOT carry `FalconOnly`** — Client users CAN call `ChangeNodeName` `[BRAIN-OUT] flows/Edit Node.md:63`. Scope enforcement is handler-level (own-subtree check for acc-* roles).
3. **Backend handler-time scope check** — handler verifies the node lives within the caller's `path` claim subtree. Out-of-scope rename returns 403 `UnauthorizedAction`.

**Open question — Q-AM-16 (PES↔sheet drift).** Same risk as Add Client: PRD permission sheet (Jawad) may diverge from `BuiltInRoleCatalog.cs` seed. PES is the runtime authority; sheet divergence is silent `[MEMORY] project_authority_dataset_2026_05_16.md`.

---

## Layer 4 — BR-AM business rules

Edit Node touches a **smaller** BR set than Add Client (rename is a mutation, not a creation, so most of the 28 Add-Client BR-AM rules don't fire here). The relevant rules concentrate around naming, scope, and the Op-5 settings sub-flow.

| BR # | Rule | Operation surface |
|---|---|---|
| BR-AM-01 | 3-level hierarchy (Root / Main / Sub) | All ops — Root cannot be renamed (no UI surface); Main + Sub can `[BRAIN-OUT] 09-business-rules-by-feature/MATRIX.md:70` |
| BR-AM-03 | AccountName uniqueness/format/required — **sister rule** for Main; sub-node naming PRD-silent | Ops 1+2 — letter-prefix `[INFERRED]` may apply; mirrored client-side only `[BRAIN-OUT] flows/Edit Node.md:56, 174` |
| BR-AM-09 | **PasswordSecurityLevel is account-level** | Op 5 only — settings tab on Main `[BRAIN-OUT] flows/Edit Node.md:148, 176` |
| BR-AM-10 | **IP allowlist enforcement** | Op 5 only — settings tab on Main `[BRAIN-OUT] flows/Edit Node.md:148` |
| BR-AM-11 | Account Limits zero-means-no-limit (4 limits) | Op 5 only `[BRAIN-OUT] flows/Edit Node.md:148, 175` |
| BR-AM-12 | System User / Normal User counts independent | Op 5 only |
| BR-AM-39 | Account Limits enforcement when over-limit — **OPEN** | Op 5 — runtime behavior post-edit |
| BR-AM-40 | Visibility flip Show→Hide while Active — **OPEN** | Cross-flow (CommChannels tab Op 5 sibling) |
| BR-AM-41 | BalanceType / WalletType mid-life change — **OPEN** | Op 5 — settings change semantics |
| BR-AM-42 | Normal User deletion balance fate — **OPEN** | Operation 4 (archive) — relevant when delete-cascade lands |

**No BR rule exists for scheduled rename or move-node.** Both Op 2 (scheduled rename) and Op 3 (move) are unbacked by PRD-authored rules — this is a **gap** an implementer must surface to the product owner before shipping Op 2 to v1 `[BRAIN-OUT] flows/Edit Node.md:88-89, 213-214`.

**Non-PRD authority gates** (these aren't BR rules but they DO gate the operation — see Layer 10 for the full non-PES gate inventory):

| Gate | Fires on | Effect |
|---|---|---|
| `ActionsNotAllowedOnDeletedNode` (422) | Any write on a soft-deleted node | Closes dialog; refresh tree `[BRAIN-OUT] 13-error-catalog/CATALOG.md:224` |
| `MainNodeOnlyOperation` (422) | Op 5 on a sub-node | UI must hide Settings tab on sub-node `[BRAIN-OUT] flows/Edit Node.md:145` |
| `RootNodeDeletionNotAllowed` (422) | Op 4 on root (would-be) | Op 4 is MISSING — gate exists in error catalog suggesting prior intent `[BRAIN-OUT] 13-error-catalog/CATALOG.md:222` |
| `RootNodeCannotHaveSubNodes` (422) | Add Node sister gate on root | Mentioned here for cross-flow awareness `[BRAIN-OUT] 13-error-catalog/CATALOG.md:223` |

---

## Layer 5 — V-rules per step

Edit Node surfaces **4 V-rules** across the LIVE operations. Per-op distribution from `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:103-119` + `[BRAIN-OUT] flows/Edit Node.md:171-176`:

### Operation 1 — Rename (immediate)

| V-rule | Field | Why it fires |
|---|---|---|
| `V-subnode-name-maxlength-30` | `NewName` | Required + ≤30 chars cap. **GAP** — the V-rule note for `V-subnode-name-maxlength-30` is referenced but **not yet seeded in the vault** `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:217`. The `[INFERRED]` candidate "26th rule" the matrix author flagged. Falls under organization-hierarchy Add Node + Edit Node flow. |
| [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) (sister) | `NewName` (Main rename only) | Letter-prefix + ≤30 + unique. PRD silent on whether the letter-prefix portion applies to **sub-node** renames `[BRAIN-OUT] flows/Edit Node.md:56`. **FE mirrors** `Validators.pattern(/^[A-Za-z].*$/)` client-side; backend has no mirror. |

### Operation 2 — Scheduled rename

| V-rule | Field | Why it fires |
|---|---|---|
| `V-subnode-name-maxlength-30` (same as Op 1) | `NewName` | Same cap + required |
| `V-account-name-format-uniqueness` (sister) | `NewName` | Same letter-prefix borrow |
| (date validator — no V-rule) | `EffectiveDate` | `Validators.required` + custom `futureDateValidator` (must be strictly after `Date.now()`). **Reuses `EffectiveDateMustBeInFuture` 422** from the price-type/value change family — whether the rename handler reuses this code is **unverified** `[BRAIN-OUT] flows/Edit Node.md:96`. Surface as gap. |

### Operation 5 — Edit AccountSettings on Main (cross-link)

| V-rule | Field | Why it fires |
|---|---|---|
| [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) | 4 limits | `0 = no limit`; empty disallowed; default 0. **Backend missing per-field `[ThrowIf*]`** — handler-only `InvalidAccountLimits` 422 `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:206` |
| [`V-password-security-level-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-security-level-enum.md) | `PasswordSecurityLevel` | Enum membership + **Q-UM-12 HIGH drift**: PRD `Normal/Advanced` ↔ Identity backend `Low/Medium/High/Strict`. FE displays PRD labels, submits backend codes `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:203` |
| [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md) | `AllowedIPs[]` | List validity at edit; enforcement runs at gateway pre-processor on every login (platform cross-cut) `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:111` |

### No async uniqueness checks at rename

Unlike Add Client Step 1 (which calls `GET /api/Node/ValidateAccountName?AccountName=` 300 ms debounced), Edit Node does NOT document a pre-submit uniqueness check. **`DuplicateNodeName` (409 likely)** surfaces post-submit only `[BRAIN-OUT] flows/Edit Node.md:79`. `[INFERRED]` — the implementer SHOULD add an async pre-check using the same endpoint pattern, scoped per-parent if the uniqueness scope question is resolved per-parent (PRD silent — surface as gap).

### Defense-in-depth for "no change submitted"

The handler emits **`NoChangesToUpdate` (422 likely)** when `NewName == currentName` `[BRAIN-OUT] flows/Edit Node.md:77`. FE should block Save when the input equals the prefilled value — pre-empt the 422.

---

## Layer 6 — E-* entity drift

Edit Node mutates **2 entities** (rename ops touch `E-node`; Op 5 touches `E-account-settings`). Drift counts and notable items from `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:127-138`.

| Entity | Op | Drift count | Notable drift |
|---|---|---|---|
| `E-node` | Ops 1 + 2 (mutate Name) | 8 | `type` (Root/Main/Sub) **NOT on response DTO** — FE infers from position `[BRAIN-OUT] 08-entity-drift-by-feature/MATRIX.md:95`. Per-node `settings` PRD-hinted but no DTO surfaces it (settings live on Account, see Op 5). **`EffectiveDate?` is a backend ➕ EXTRA** not in PRD — enables scheduled rename `[BRAIN-OUT] flows/Edit Node.md:166-168`. |
| `E-account-settings` | Op 5 (mutate password level + IPs + 4 limits) | 14 | `PasswordSecurityLevel` Normal/Advanced ↔ Low/Medium/High/Strict (Q-UM-12 HIGH) `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:203`. `maxNodeLevels` (PRD) vs `MaxNodeLevel` (backend) singular/plural casing. `BalanceTransferLimit` unit hint dropped (PRD has `%`, backend bare decimal). `Enabled` toggle extra on backend read DTO. |

**Cross-entity reads at rename time** (no mutation, but the FE renders them):

| Read | Why |
|---|---|
| `E-account-settings.MaxNodeLevel` | Drives Add Node sister gate but not rename — informational only |
| `E-account` (`AccountName`) | If renaming a Main node, the AccountName is the same field — `[INFERRED]` the rename here also updates Account display name (whether backend cascades is unverified) |
| `E-node.SubNodes[]` | Tree refresh post-rename rebuilds the immediate parent's children list |

**Cross-service entity ownership notes:**
- **`E-node` is owned by Commerce.** Rename = `PUT /api/Node/ChangeNodeName` on `NodeController`. No cross-service Kafka fan-out documented `[BRAIN-OUT] flows/Edit Node.md:69`.
- **`E-account-settings` is owned by Commerce.** Op 5 = `PUT /api/Setting` (`UpdateSettingsRequest`); read via `GET /api/Setting?ownerId=` `[BRAIN-OUT] flows/Edit Node.md:147`.
- **PES subject for scope enforcement MUST use Zitadel id, NEVER Mongo `_id`** — `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md`. Frontend `CurrentSubjectBuilder` derives subject from `JWT.sub`.

---

## Layer 7 — Backend DTO

**Top-level DTO (Operations 1 + 2 share one):** `ChangeNodeNameRequest`. `[BRAIN-OUT] flows/Edit Node.md:51` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:112`.

```jsonc
{
  "NodeId": "<guid>",                      // [ThrowIfNotPassed] — required
  "NewName": "<string ≤ 30 chars>",        // [ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]
  "EffectiveDate": null                    // DateTime? — null = immediate; future ISO-8601 = scheduled
}
```

**Field-by-field `[ThrowIf*]` attribute table:**

| Field | Attributes | Maps to error code |
|---|---|---|
| `NodeId` | `[ThrowIfNotPassed]` `[INFERRED]` from PRD context — playbook lists "required" `[BRAIN-OUT] flows/Edit Node.md:56` | `RequiredFieldMissing` (400) |
| `NewName` | `[ThrowIfNotPassed]` + `[ThrowIfMaxLengthExceed(30)]` `[BRAIN-OUT] flows/Edit Node.md:56` (mirrors `CreateSubNodeRequest.Name` per `[BRAIN-OUT] flows/Add Node.md:39`) | `NodeNameRequired` / `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) |
| `EffectiveDate` | Optional `DateTime?` — no `[ThrowIf*]` (nullable by design); future-date check is **handler-time** not pre-processor `[BRAIN-OUT] flows/Edit Node.md:96` | `EffectiveDateMustBeInFuture` (422 likely) |

**Top-level DTO (Operation 5 — settings edit on Main):** `UpdateSettingsRequest`. `[BRAIN-OUT] flows/Edit Node.md:147` + `[VAULT] E-account-settings.md`.

```jsonc
{
  "OwnerId": "<mainNodeId>",                   // required — gate for MainNodeOnlyOperation 422
  "PasswordSecurityLevel": <int>,              // [ThrowIfNotEnumValue<ePasswordSecurityLevel>] — Q-UM-12 drift
  "AllowedIPs": ["..."],                       // List<string>; empty = no allowlist
  "MaxNormalUserLimit": 0,                     // no [ThrowIf*] — handler-only InvalidAccountLimits
  "MaxSystemUserLimit": 0,                     //   "
  "MaxNodeLevel": 0,                           //   " (singular per backend; PRD says maxNodeLevels)
  "BalanceTransferLimit": 0                    //   " (decimal; PRD has %, backend bare)
}
```

**Casing note.** Commerce uses **PascalCase** on the wire `[BRAIN-OUT] Add Client/08-BACKEND_API.md:64-66` (recap). Identity / Contact Group / Templates use camelCase. Same FE serialization rule applies as Add Client.

**Asymmetric sparsity** — Unlike Add Client which composes all fields into one big DTO, Op 5 is a **full overwrite** of `AccountSettings`; partial-edit semantics aren't enumerated in the playbook (`[INFERRED]` the FE must read the current settings first, mutate only the changed fields, and POST the full object).

---

## Layer 8 — Backend endpoint + handler

**Two endpoints serve Edit Node:** one for rename (Ops 1+2), one for settings (Op 5). `[BRAIN-OUT] flows/Edit Node.md:59-69, 147` + `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:108-112`.

### Rename endpoint (Operations 1 + 2)

| Attribute | Value |
|---|---|
| Method | PUT |
| Path (internal) | `/api/Node/ChangeNodeName` |
| Path (via gateway) | `<gateway>/commerce/Node/ChangeNodeName` |
| Service | Commerce (`falcon-core-commerce-svc`) |
| Controller | `NodeController.ChangeNodeName` |
| Auth | class-level `[Authorize]` — **no** `FalconOnly` policy `[BRAIN-OUT] flows/Edit Node.md:63` |
| Request | `ChangeNodeNameRequest` |
| Response | `ServiceOperationResult<string>` (new node name) |

**Gateway routing.** Both gateways serve. `[BRAIN-OUT] flows/Add Node.md:50-52` confirms same Commerce endpoint via System Gateway for Falcon users and Core Gateway for Client users — no re-routing rules. Edit Node inherits this dual-gateway routing.

### Settings endpoint (Operation 5)

| Attribute | Value |
|---|---|
| Method | PUT |
| Path (internal) | `/api/Setting` |
| Path (via gateway) | `<gateway>/commerce/Setting` |
| Service | Commerce |
| Controller | `SettingsController.Update` `[INFERRED]` from `[VAULT] E-account-settings.md` |
| Auth | class-level `[Authorize]` + handler `MainNodeOnlyOperation` gate |
| Request | `UpdateSettingsRequest` |
| Response | `ServiceOperationResult<bool>` |
| Companion read | `GET /api/Setting?ownerId=<mainNodeId>` |

### Handler flow (rename)

`[INFERRED]` — playbook does not enumerate handler internals; the following is reconstructed from sister flows + error codes.

1. **Pre-processor** runs `[ThrowIf*]` on `NodeId` + `NewName` → 400 on missing/over-length.
2. **Fetch node** by `NodeId` → 404 `NodeNotFound` if absent.
3. **Tombstone check** — if node is soft-deleted → 422 `ActionsNotAllowedOnDeletedNode` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:224`.
4. **Scope check** — verify caller's `path` claim covers the target node → 403 `UnauthorizedAction` if out-of-scope.
5. **No-op check** — if `NewName == currentNode.Name` AND `EffectiveDate == null` → 422 `NoChangesToUpdate` `[BRAIN-OUT] flows/Edit Node.md:77`.
6. **Uniqueness check** — verify `NewName` is unique within parent's children → 409 `DuplicateNodeName` (likely) `[BRAIN-OUT] flows/Edit Node.md:79`. **Scope unknown** — per-parent vs per-account, PRD silent.
7. **`EffectiveDate` branch**:
   - If null → immediate `Node.Name = NewName`; persist.
   - If future → queue scheduled rename row; `Node.Name` unchanged until `EffectiveDate`.
   - If past or invalid → 422 `EffectiveDateMustBeInFuture` (likely, reused from price-change family — unverified) `[BRAIN-OUT] flows/Edit Node.md:96`.
8. **Persist + return** `ServiceOperationResult<string>` carrying new name.

**Possible Kafka emission** — `NodeRenamed` event is **unverified** `[BRAIN-OUT] flows/Edit Node.md:69`. See Layer 10.

### Handler flow (settings edit on Main)

`[INFERRED]` from sister patterns:

1. Pre-processor on `PasswordSecurityLevel` enum + structural fields.
2. **Node-type check** — if `OwnerId` resolves to a sub-node → 422 `MainNodeOnlyOperation` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:220`.
3. **Limits validity** — `InvalidAccountLimits` (422) handler-only check.
4. **Persist + emit** `commerce.identity-settings-sync.v1` Kafka event (same as Add Client Step 2-equivalent) to keep Identity in sync.

---

## Layer 9 — FluentValidator + handler-time gate

**Two-tier server-side validation** (same architecture as Add Client; recap):

### Tier 1 — `[ThrowIf*]` (pre-processor, before handler)

Catches null / empty / over-length. Empty submissions never reach the handler. Surfaces 400 codes on `NodeId` + `NewName` per Layer 7 attribute table.

### Tier 2 — Handler-level cross-field + uniqueness + business

`[BRAIN-OUT] flows/Edit Node.md:73-82, 105`:

- **Tombstone guard** — `ActionsNotAllowedOnDeletedNode` (422) on any write to a soft-deleted node `[BRAIN-OUT] 13-error-catalog/CATALOG.md:224`.
- **No-op guard** — `NoChangesToUpdate` (422 likely) when `NewName == currentName`. **FE should pre-empt** by blocking Save when input is unchanged.
- **Uniqueness** — `DuplicateNodeName` (409 likely). PRD silent on scope (per-parent / per-account / global) — surface as gap.
- **Scheduled-rename-specific** — `EffectiveDateRequired` (400 likely, documented for price changes — **rename handler reuse unverified**); `EffectiveDateMustBeInFuture` (422 likely, same source — unverified) `[BRAIN-OUT] flows/Edit Node.md:111-115`.
- **Backend typo** — `NewNodeNameNotApplyed` (422 likely; note the misspelling in the backend error key) `[BRAIN-OUT] flows/Edit Node.md:78`. The implementer should log this typo as a backend bug. Frontend displays the localized message; do not echo the key.

**For Operation 5 — settings edit on Main:**

- **`MainNodeOnlyOperation`** (422) on any sub-node `OwnerId` `[BRAIN-OUT] 13-error-catalog/CATALOG.md:220`.
- **`InvalidAccountLimits`** (422) handler-only because the 4 limit fields lack `[ThrowIf*]` (same gap as Add Client Step 2).
- **`InvalidIpAddress`** (403 per `[BRAIN-OUT] 13-error-catalog/CATALOG.md:281`) on malformed IP in `AllowedIPs[]`.

**Critical FE rule** — use HTTP status code as the **primary routing signal**. Display localized `errorMessages[0]` directly. **Do NOT parse error codes for copy.** Use codes for logging/instrumentation only `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:290-302`.

---

## Layer 10 — Kafka events

**No Kafka events verified for the rename ops.** `[BRAIN-OUT] flows/Edit Node.md:69`:

> "PRD does not specify; backend may emit a `NodeRenamed` Kafka event — unverified."

`[BRAIN-OUT] 14-flow-playbook-integration/MATRIX.md:34` confirms: **"0 verified — `NodeRenamed` event possible but unverified."**

**Why this matters.** Add Client emits 4 Kafka events to fan out user creation, wallet topology, identity-settings sync, and IP-allowlist cache refresh. If Edit Node DOES emit `NodeRenamed` but no consumer is wired:
- The hierarchy tree refresh in the FE (the documented strategy `[BRAIN-OUT] flows/Edit Node.md:68`) is the only way downstream views (other open browser tabs, sister apps, search indexes) learn of the rename.
- Audit log generation (Q from Layer 2) has no Kafka entry point.

**For Operation 5 (settings edit on Main):** the `commerce.identity-settings-sync.v1` event SHOULD fire (same as Add Client Step 2 commit) to keep Identity's tenant-level password policy + lockout policy aligned. `[INFERRED]` from `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:31`. Unverified for the Op 5 path specifically.

**For IP-allowlist changes (Op 5 sub-case):** the `commerce.tenant-ip-allowlist-changed.v1` event SHOULD fire to refresh the gateway Redis cache `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:32`. Same `[INFERRED]` caveat.

`(no source — needs investigation)` — Confirm Kafka topic emission by reading the actual `NodeController.ChangeNodeName` handler and `SettingsController.Update` handler source.

---

## Layer 11 — Error codes

Edit Node surfaces **~14 codes** across 4 HTTP status classes (rename ops) + 5 more in Op 5. Catalog: `[BRAIN-OUT] 13-error-catalog/CATALOG.md:43, 140, 175, 220-256`. Per-flow placement: `[BRAIN-OUT] flows/Edit Node.md:73-82, 111-115`.

### Operations 1 + 2 — Rename (immediate + scheduled)

#### 400 — validation / required-field / format

| Code | Trigger | UX |
|---|---|---|
| `NodeNameRequired` | `NewName` empty | Inline below New Name input — "Node name is required." `[BRAIN-OUT] flows/Edit Node.md:75` |
| `RequiredFieldMissing` | `NodeId` absent (should not happen — hidden field) | Banner + log; refresh tree `[BRAIN-OUT] flows/Edit Node.md:75` |
| `MaxLengthExceeded` | `NewName` > 30 chars | Inline below input — "Node name must be at most 30 characters." `[BRAIN-OUT] flows/Edit Node.md:76` |
| `EffectiveDateRequired` (Op 2 only, likely — reused from price changes; unverified) | Empty `EffectiveDate` on scheduled rename | Inline below Date Picker — "Effective date is required." `[BRAIN-OUT] flows/Edit Node.md:113` |

#### 404 — not found

| Code | Trigger | UX |
|---|---|---|
| `NodeNotFound` | `NodeId` does not resolve | Banner; close dialog; refresh tree `[BRAIN-OUT] flows/Edit Node.md:81` |

#### 409 — uniqueness collision

| Code | Trigger | UX |
|---|---|---|
| `DuplicateNodeName` (likely — verify uniqueness scope) | `NewName` collides under parent | Inline below New Name input — "A node with this name already exists." `[BRAIN-OUT] flows/Edit Node.md:79` |

#### 422 — semantic / cross-field / state

| Code | Trigger | UX |
|---|---|---|
| `NoChangesToUpdate` (likely) | `NewName == currentName` AND `EffectiveDate == null` | Inline banner OR FE pre-empts by blocking Save when unchanged `[BRAIN-OUT] flows/Edit Node.md:77` |
| `NewNodeNameNotApplyed` (likely; **backend typo**) | Server-side commit failure | Full-dialog banner — "The node name could not be updated. Try again." Log the typo as a backend bug `[BRAIN-OUT] flows/Edit Node.md:78` |
| `ActionsNotAllowedOnDeletedNode` | Target node soft-deleted | Banner; close dialog; refresh `[BRAIN-OUT] flows/Edit Node.md:80` |
| `EffectiveDateMustBeInFuture` (Op 2 only, likely — reused; unverified) | `EffectiveDate ≤ now` | Inline below Date Picker; block submit client-side `[BRAIN-OUT] flows/Edit Node.md:114` |

#### 403 — auth / scope

| Code | Trigger | UX |
|---|---|---|
| `UnauthorizedAction` | Caller's path claim does not cover target node | Banner; close dialog `[BRAIN-OUT] flows/Edit Node.md:82` |
| `UnauthorizedUserToPerformThisAction` | Cross-namespace attempt (sys-* on `acc.*` or vice versa) | Same as `UnauthorizedAction` — generic "no permission" per BR-UM-24 enumeration-leak protection |

### Operation 5 — Edit Settings on Main

Adds 5+ codes on top:

| Code | HTTP | Trigger |
|---|---|---|
| `MainNodeOnlyOperation` | 422 | Op 5 on a sub-node `[BRAIN-OUT] 13-error-catalog/CATALOG.md:220` |
| `SettingsOnlyAllowedForMainNode` | 422 | Variant of above for some sub-sections `[BRAIN-OUT] 13-error-catalog/CATALOG.md:255` |
| `WalletSettingsOnlyForMainNode` | 422 | Wallet sub-section gate `[BRAIN-OUT] 13-error-catalog/CATALOG.md:256` |
| `InvalidAccountLimits` | 422 | One of the 4 limit fields out-of-bounds — handler-only |
| `InvalidIpAddress` | 403 | Malformed IP in `AllowedIPs[]` (gateway-side per `V-account-ip-allowlist-enforcement`) |
| `InvalidValue` | 422 | `PasswordSecurityLevel` outside enum (Q-UM-12 vocabulary mismatch surface) |

### FE error-handling contract (recap)

`[BRAIN-OUT] 13-error-catalog/CATALOG.md` + `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:60-61`:

1. HTTP status code = **primary routing signal**.
2. `errorMessages[0]` = **display copy** (already localized).
3. Error codes = **logging only**; do not branch UI on codes.

---

## Layer 12 — FE route + PES gate

**Route + Angular guard.**

| Aspect | Value | Source |
|---|---|---|
| Apps | `apps/admin-console` (Falcon staff) + `apps/management-console` (Client) — Edit Node is dual-console | `[BRAIN-OUT] flows/Edit Node.md:21` |
| Page route | `/organization-hierarchy` (both consoles) | `[BRAIN-OUT] 14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md:38` |
| Entry point | Hierarchy tab → tree row 3-dot kebab → `Rename` / `Schedule rename` | `[BRAIN-OUT] flows/Edit Node.md:22-24` |
| Surface | `<falcon-dialog>` (immediate + scheduled rename); Settings tab page (Op 5) | `[BRAIN-OUT] flows/Edit Node.md:26-28` |
| `data.access` (route guard) | `FalconAccess.adminConsole.accountHierarchy.view()` (admin) / `FalconAccess.managementConsole.accountHierarchy.view()` (mgmt) — same as the page itself | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:36, 64` |
| **Action gate (button visibility)** | **`FalconAccess.managementConsole.organizationHierarchy.renameNode()`** per playbook `[BRAIN-OUT] flows/Edit Node.md:43`. **GAP** — this key is NOT in the canonical registry. | `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md` (absent) |

**The PES key gap.** `FalconAccess.managementConsole.organizationHierarchy.renameNode()` does not exist in `falcon-access.registry.ts` (47 factory methods enumerated; none for rename). `[INFERRED]` — the implementer has three options:

1. **Add a new factory method** to the registry — e.g. `managementConsole.organizationHierarchy.renameNode()` returning `{ action: 'edit', resource: 'acc.organization' }`. Seed rule needed in `BuiltInRoleCatalog.cs`.
2. **Reuse an existing resource** — `acc.account-profile / edit` for Main node renames (acc-owner only — but excludes acc-admin who CAN rename sub-nodes), or `acc.organization / add` (semantically wrong — `add` ≠ `edit`).
3. **No PES key — rely on backend scope check** — the handler-level path-claim check would still 403 out-of-scope renames. **FE risk** — every role sees the menu item; legitimate-but-out-of-scope attempts get 403. Worse UX, defensible security.

`(no source — needs investigation)` — Resolve this PES key question with the product owner before implementation. The playbook claims a key that does not exist.

**Gateway behavior.** Same as Add Client: FE → System Gateway (sys-* users) or Core Gateway (acc-* users) → Commerce. JWT carries `tenantId`, `nodeId`, `path` claims. Gateway forwards header; Commerce enforces scope at handler.

---

## Layer 13 — FE components

**Two surfaces** — a dialog for rename, a tab page for settings. Falcon UI Core components used per the customization-order rule. `[BRAIN-OUT] flows/Edit Node.md:178-190`.

### Rename dialog (Operations 1 + 2)

| Component | Role |
|---|---|
| `<falcon-menu>` | Kebab on tree row exposing `Rename` + `Schedule rename` |
| `<falcon-tree>` / `<falcon-organization-hierarchy-tree-tw>` | Trigger surface — optional inline-edit-on-double-click (verify) |
| `<falcon-dialog>` | Rename dialog container (immediate + scheduled use same dialog with conditionally-rendered `<falcon-date-picker>`) |
| `<falcon-drawer>` | Mobile-width fallback `[BRAIN-OUT] flows/Edit Node.md:185` |
| `<falcon-input>` | New Name field (pre-filled with current name) |
| `<falcon-date-picker>` | Effective Date — **only rendered for scheduled rename** |
| `<falcon-status-badge>` | Annotate row when a scheduled rename is queued (shadow-row pattern from Wave 20 — `UIUX-SHADOW-001..005`) `[BRAIN-OUT] flows/Edit Node.md:188` |
| `<falcon-button>` | Save · Cancel |
| `<falcon-notification>` / `<falcon-toast>` | Error toasts (403, 404, 500) |

**Components NOT used (MISSING ops):**

| Component | Why withheld |
|---|---|
| `<falcon-confirm-dialog>` | Reserved for Archive / Delete (Op 4) — **DO NOT WIRE** until backend exposes the endpoint `[BRAIN-OUT] flows/Edit Node.md:190` |
| Drag-drop reorder on `<falcon-tree>` | Reserved for Move (Op 3) — if added, feature-flag off `[BRAIN-OUT] flows/Edit Node.md:121` |

### Settings tab page (Operation 5 — cross-link)

Out of scope for the dialog surface; uses `<falcon-tabs>` + `<falcon-data-table>` + `<falcon-input-number>` (per Add Client Step 2 component map) on the Settings tab of the Organization Hierarchy page. **Settings tab itself is gated by `node-type === Main`** — see Layer 10 composite gate notes.

### Customization order rule (standing)

Per `[MEMORY] feedback_falcon_custom_library_mandatory.md`:

```
inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP
```

Edit Node rename should be implemented as an **app-level wrapper** under `apps/<console>/.../organization-hierarchy-page/edit-node-dialog/` consuming the pure-presentational `<falcon-dialog>` + `<falcon-input>` + `<falcon-date-picker>` skeletons. Backend service calls live in the wrapper, never in the library skeleton (per `[MEMORY] feedback_library_skeleton_app_api.md`).

---

## Layer 14 — FE form + state

**Form choice — Reactive `FormGroup`** for both immediate and scheduled rename. `[INFERRED]` from sister flow pattern — Add Client Steps 1+2+5 use Reactive Forms for cross-field rules and async checks.

| Form | Pattern | Why |
|---|---|---|
| Immediate rename | Reactive `FormGroup` with `NewName: FormControl` | Single field, but uses `Validators.maxLength(30)` + custom `notSameAsCurrent` validator (defense vs `NoChangesToUpdate` 422) |
| Scheduled rename | Reactive `FormGroup` with `NewName` + `EffectiveDate` controls | Cross-field — `EffectiveDate` validator (`Validators.required` + custom `futureDateValidator`); same `NewName` validators |

**Critical wiring** — the canonical pattern from `[BRAIN-OUT] flows/Edit Node.md:200-209`:

```typescript
// Future-date validator for scheduled rename
function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const now = new Date();
  return selected > now ? null : { effectiveDateNotInFuture: true };
}

// No-op pre-empt — blocks Save when NewName equals prefilled current
function notSameAsCurrent(currentName: string): ValidatorFn {
  return (control: AbstractControl) =>
    control.value === currentName ? { noChangeFromCurrent: true } : null;
}
```

**State container.**

| State | Where |
|---|---|
| Selected tree node | Page-level signal/service (shared with Hierarchy tab) |
| Current name (for pre-fill + no-op check) | Read from selected node row |
| Dialog open state | Signal in the page component or service |
| Form value | Reactive `FormGroup` instance per dialog open |
| Pending-rename badge | Computed signal on tree row: `node.pendingRename ? badge : null` `[INFERRED]` from shadow-row pattern |

**Wizard state machine — N/A.** Edit Node is single-dialog, not multi-step. State is flat.

**Pre-fetch at dialog open** — none required beyond reading the already-loaded tree node. No master catalog fetches (unlike Add Client which pre-fetches CommChannel + Application + Lookup in parallel).

**Cache invalidation post-success** (`[BRAIN-OUT] flows/Edit Node.md:68, 204`):

| Op | Cache strategy |
|---|---|
| Immediate rename | Close dialog; update node label in tree in-place if possible; else refetch `GET /commerce/Node?NodeId=<rootId>` |
| Scheduled rename | Close dialog; annotate row with pending-change badge; current name unchanged |
| Op 5 settings | Refetch `GET /api/Setting?ownerId=<mainNodeId>` |

---

## Layer 15 — FE i18n keys

`[INFERRED]` — The Edit Node playbook lists i18n string buckets but does NOT enumerate concrete keys `[BRAIN-OUT] flows/Edit Node.md:209`:

> "i18n — `Rename`, `Schedule rename`, `Effective date`, `Save`, `Cancel`, error strings."

Below is the **recommended** key namespace, inferred from the same `apps/admin-console/.../organization-hierarchy-page` conventions used for Add Client Layer 15.

**Recommended key prefix:** `organization-hierarchy.edit-node.*`

| Key | En | Ar |
|---|---|---|
| `edit-node.menu.rename` | Rename | إعادة تسمية |
| `edit-node.menu.schedule-rename` | Schedule rename | جدولة إعادة التسمية |
| `edit-node.rename.title` | Rename node | إعادة تسمية العقدة |
| `edit-node.schedule.title` | Schedule node rename | جدولة إعادة تسمية العقدة |
| `edit-node.new-name.label` | New name | الاسم الجديد |
| `edit-node.new-name.placeholder` | Enter the new node name | أدخل اسم العقدة الجديد |
| `edit-node.new-name.error.required` | Node name is required | اسم العقدة مطلوب |
| `edit-node.new-name.error.max-length` | Node name must be at most 30 characters | يجب ألا يتجاوز اسم العقدة 30 حرفًا |
| `edit-node.new-name.error.duplicate` | A node with this name already exists | عقدة بهذا الاسم موجودة بالفعل |
| `edit-node.new-name.error.no-change` | The new name is the same as the current name | الاسم الجديد مطابق للاسم الحالي |
| `edit-node.effective-date.label` | Effective date | تاريخ السريان |
| `edit-node.effective-date.error.required` | Effective date is required | تاريخ السريان مطلوب |
| `edit-node.effective-date.error.not-future` | Effective date must be in the future | يجب أن يكون تاريخ السريان في المستقبل |
| `edit-node.pending-badge.label` | Pending rename | إعادة تسمية معلقة |
| `edit-node.pending-badge.tooltip` | Will rename to "{newName}" on {effectiveDate} | ستعاد التسمية إلى "{newName}" في {effectiveDate} |
| `edit-node.actions.save` | Save | حفظ |
| `edit-node.actions.cancel` | Cancel | إلغاء |
| `edit-node.toast.rename-success` | Node renamed | تمت إعادة تسمية العقدة |
| `edit-node.toast.schedule-success` | Rename scheduled | تمت جدولة إعادة التسمية |
| `edit-node.toast.error-generic` | The node could not be updated. Try again. | تعذر تحديث العقدة. حاول مرة أخرى. |
| `edit-node.toast.error-deleted` | This node has been removed. Refresh the tree. | تمت إزالة هذه العقدة. حدّث الشجرة. |
| `edit-node.toast.error-unauthorized` | You don't have permission to rename this node | ليس لديك إذن لإعادة تسمية هذه العقدة |

**Localization contract** (recap from Add Client Layer 15): error messages from `ServiceOperationResult<T>.errorMessages[0]` are already localized server-side — do NOT re-translate. The FE displays them as-is `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:103-105`.

`(no source — needs investigation)` — concrete key names must be confirmed against the existing `apps/<console>/src/assets/i18n/{en,ar}.json` files when this trace is acted on.

---

## Layer 16 — Test case (Gherkin)

Five scenarios cover the rename ops + denied-field + the two MISSING-op guardrails. Assertions trace back to BR-AM-* (Layer 4), V-rules (Layer 5), error codes (Layer 11), and per-role verdicts (Layer 18).

```gherkin
Feature: Edit Node (rename + scheduled rename + scope guards)
  As an authorized user (sys-* or acc-owner / acc-admin)
  I want to rename or schedule-rename a node in the hierarchy
  So that the node's name reflects current business state — without exposing missing ops

  Background:
    Given I am logged in to a Falcon console
    And the Organization Hierarchy page is loaded
    And a node "EngineeringDept" exists at depth 1 under my tenant's Main node

  Scenario: Happy path — sys-admin renames a sub-node immediately
    Given I am logged in as "sysadmin" (sys-admin role)
    And I am viewing admin-console
    And I am on the Hierarchy tab
    When I open the 3-dot kebab on row "EngineeringDept"
    Then I see menu items "Rename" and "Schedule rename"
    And I do NOT see "Move node"
    And I do NOT see "Archive node"
    And I do NOT see "Delete node"
    When I click "Rename"
    Then a <falcon-dialog> opens with title "Rename node"
    And the New Name input is pre-filled with "EngineeringDept"
    And the Effective Date picker is NOT rendered
    When I clear the input and type "ProductEngineering"
    And the input passes Validators.required + Validators.maxLength(30) + notSameAsCurrent
    And I click Save
    Then the FE PUTs <gateway>/commerce/Node/ChangeNodeName with Bearer JWT
    And the request body is { NodeId: "<engDeptId>", NewName: "ProductEngineering", EffectiveDate: null }
    And the backend returns HTTP 200 with ServiceOperationResult { IsSuccessful: true, Result: "ProductEngineering" }
    And the dialog closes
    And the tree row label updates from "EngineeringDept" to "ProductEngineering"
    And a success toast shows "Node renamed"
    And no pending-rename badge is rendered on the row

  Scenario: Scheduled rename — acc-owner queues a future rename
    Given I am logged in as "acmecorp-owner" (acc-owner role)
    And I am viewing management-console
    And the Falcon Account = "AcmeCorp"
    And node "EngineeringDept" lives in my tenant's subtree
    When I open the kebab on "EngineeringDept" and click "Schedule rename"
    Then a <falcon-dialog> opens with title "Schedule node rename"
    And the New Name input is pre-filled with "EngineeringDept"
    And a <falcon-date-picker> for Effective Date is rendered
    And the picker default value is "tomorrow"
    When I change the name to "Engineering" and pick Effective Date = 7 days from now
    And the form passes both validators (notSameAsCurrent + futureDateValidator)
    And I click Save
    Then the FE PUTs <gateway>/commerce/Node/ChangeNodeName with
      | NodeId        | <engDeptId>           |
      | NewName       | Engineering            |
      | EffectiveDate | 2026-05-23T00:00:00Z   |
    And the backend returns HTTP 200 with the queued name
    And the dialog closes
    And the tree row STILL shows "EngineeringDept" (current name unchanged)
    And a <falcon-status-badge> "Pending rename" is rendered on the row
    And the badge tooltip reads 'Will rename to "Engineering" on 2026-05-23'
    And a success toast shows "Rename scheduled"
    # Cancellation gap — no DELETE endpoint observed; workaround documented in playbook line 105

  Scenario: Duplicate-name conflict — backend returns 409 DuplicateNodeName
    Given I am logged in as "sysadmin"
    And a sibling node "Marketing" already exists under the same parent as "EngineeringDept"
    When I open the rename dialog on "EngineeringDept"
    And I type "Marketing" as the new name
    And I click Save
    Then the backend returns HTTP 409 with errorMessages[0] = (localized "A node with this name already exists")
    And the FE displays the localized errorMessages[0] inline on the New Name input
    And the dialog remains open
    And the operator can correct the name and resubmit
    # Open question — PRD silent on uniqueness scope (per-parent vs per-account); needs confirmation

  Scenario: Out-of-scope rename — acc-admin tries to rename a node outside their own sub-nodes
    Given I am logged in as "team-admin" (acc-admin role)
    And my path claim covers nodes under "AcmeCorp/Marketing/*" only
    And "EngineeringDept" lives under "AcmeCorp/Engineering/*" (outside my scope)
    # The FE PES check is ambiguous — playbook references FalconAccess.managementConsole.organizationHierarchy.renameNode()
    # but this key is NOT in falcon-access.registry.ts. Test the backend defense-in-depth.
    When I (somehow) open the rename dialog on "EngineeringDept"
    And I type a new name and click Save
    Then the backend returns HTTP 403 with errorMessages[0] = (localized "You don't have permission to rename this node")
    And per BR-UM-24 enumeration-leak protection, the FE shows the generic localized message
    And does NOT differentiate from a node-not-found or credentials error
    And the dialog closes
    # Gap noted: FE should hide the menu item entirely on out-of-scope rows — pending PES key resolution

  Scenario: MISSING-op guardrails — Move / Archive / Delete never appear
    Given I am logged in as any role with rename access (sys-admin / sys-products / sys-ops / acc-owner / acc-admin)
    And I am on the Hierarchy tab
    When I open the kebab on any tree row
    Then the menu contains AT MOST these items: Rename, Schedule rename, Add sub-node, Add user
    And the menu does NOT contain "Move node"
    And the menu does NOT contain "Archive node"
    And the menu does NOT contain "Delete node"
    # GAP-AM-07 (no MoveNode endpoint) + GAP-AM-29 (no DELETE Node endpoint)
    # Backend codes ActionsNotAllowedOnDeletedNode + RootNodeDeletionNotAllowed exist — suggesting prior intent,
    # but no write path enters those states. UI MUST NOT surface these actions until PRD + backend agree.

  Scenario: Op 5 cross-flow — settings edit on Main, denied on sub-node
    Given I am logged in as "sysadmin"
    And I select the Main node of "AcmeCorp"
    When I navigate to the Settings tab
    Then the Settings tab IS enabled (node-type Main, not Falcon root, not sub)
    And I can edit Password Security Level + Allowed IPs + 4 limit fields
    When I select a sub-node "EngineeringDept" instead
    Then the Settings tab is either hidden OR shown disabled (per tab-visibility composite gate)
    # Backend defense-in-depth: if the FE-level guard were bypassed, PUT /api/Setting on sub-node returns 422 MainNodeOnlyOperation
    And the FE displays the localized errorMessages[0] inline
```

---

## Layer 17 — Port artifact

**Both consoles host Edit Node** — unlike Add Client which is admin-only. The flow ports to BOTH.

### admin-console (Falcon staff scope)

```
apps/admin-console/
└── src/app/.../organization-hierarchy-page/
    └── edit-node-dialog/
        ├── edit-node-dialog.component.{ts,html}
        ├── models/models.ts                              ← ChangeNodeNameRequest + types
        ├── services/edit-node.service.ts                 ← PUT /commerce/Node/ChangeNodeName
        ├── validations/validations.ts                    ← notSameAsCurrent + futureDateValidator
        └── shared/
            └── edit-node-dialog-state.service.ts         ← per-dialog FormGroup factory
```

### management-console (Client scope)

```
apps/management-console/
└── src/app/.../organization-hierarchy-page/
    └── edit-node-dialog/
        ├── edit-node-dialog.component.{ts,html}         ← same shape; different gateway
        ├── models/models.ts
        ├── services/edit-node.service.ts                 ← PUT /commerce/Node/ChangeNodeName via Core Gateway
        ├── validations/validations.ts
        └── shared/
            └── edit-node-dialog-state.service.ts
```

Reference for the canonical folder + validation doctrine: `[BRAIN-OUT] strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §7 (per `[MEMORY] project_falcon_component_validation_convention.md`). Reference implementation: add-user-wizard (all 3 steps + per-component validation rules).

**Why Edit Node ports to mgmt but Add Client does not** — Add Client gates on `sys.account / add` (Falcon-only resource). Edit Node's rename op gates on `acc.organization` semantics (with `[INFERRED]` registry gap noted in Layer 12). The `acc.*` namespace IS reachable by acc-owner + acc-admin per `[BRAIN-OUT] 01-roles/acc-owner.md:51-52` + `[BRAIN-OUT] 01-roles/acc-admin.md:51-52`. So:

| Op | admin-console | management-console |
|---|---|---|
| 1 — Immediate rename | ✅ for sys-admin / sys-ops / sys-products | ✅ for acc-owner / acc-admin within own subtree |
| 2 — Scheduled rename | ✅ same | ✅ same |
| 3 — Move node | ❌ MISSING | ❌ MISSING |
| 4 — Archive node | ❌ MISSING | ❌ MISSING |
| 5 — Settings edit on Main | ✅ for sys-admin / sys-products (full); sys-ops view-only on some rows | ✅ for acc-owner only; **acc-admin denied** (`acc.account-profile.edit` explicit deny `[BRAIN-OUT] 01-roles/acc-admin.md:61`) |

**Port artifact verdict.** Both consoles. Shared component pattern (library skeleton in `libs/falcon-ui-core/`, app-level wrappers under each console's organization-hierarchy-page) per `[MEMORY] feedback_library_skeleton_app_api.md`.

**Settings sub-flow (Op 5) port note.** Op 5 lives on the Settings tab, NOT the Hierarchy-tab kebab. Already documented as a cross-link in the playbook `[BRAIN-OUT] flows/Edit Node.md:150-151`. The Settings tab itself is gated by node-type composite (`isFalconNode==false && isFirstLevelChild==true`) per `[BRAIN-OUT] 10-non-pes-gates-by-feature/MATRIX.md:144-148`.

---

## Layer 18 — Capability map verdict per role

**The most granular layer.** Of the 6 PES-defined roles, the per-op verdict matrix has **5 cells per role × 6 roles = 30 verdicts**, with field-level divergence (acc-owner vs acc-admin on Op 5).

| Role | Op 1 Rename (immediate) | Op 2 Scheduled rename | Op 3 Move node | Op 4 Archive node | Op 5 Settings edit on Main | Source |
|---|---|---|---|---|---|---|
| `sys-admin` (System Administrator) | ✅ Anywhere | ✅ Anywhere | ❌ MISSING | ❌ MISSING | ✅ Full | `[BRAIN-OUT] 05-capability-maps/sys-admin.capability.md:54` + sister rows |
| `sys-products` (Products) | ✅ Anywhere | ✅ Anywhere | ❌ MISSING | ❌ MISSING | ✅ (Account Limitations + price/visibility) | `[BRAIN-OUT] 05-capability-maps/sys-products.capability.md:54` |
| `sys-ops` (Operation) | ✅ Anywhere | ✅ Anywhere | ❌ MISSING | ❌ MISSING | ⚠ view-only on Account Limitations + Password Security (per W7 workflow text) | `[BRAIN-OUT] flows/Edit Node.md:38` + `[BRAIN-OUT] 05-capability-maps/sys-ops.capability.md:54` |
| `acc-owner` (Account Owner) | ✅ own subtree | ✅ own subtree | ❌ MISSING | ❌ MISSING | ⚠ limited — `Disable` / `Do Payment` commchannels; **cannot `Edit Price`** | `[BRAIN-OUT] flows/Edit Node.md:39` + `[BRAIN-OUT] 01-roles/acc-owner.md:51-52, 62` |
| `acc-admin` (Node Admin) | ✅ own sub-nodes only | ✅ own sub-nodes only | ❌ MISSING | ❌ MISSING | ❌ **explicit deny** on `acc.account-profile.edit` | `[BRAIN-OUT] flows/Edit Node.md:40` + `[BRAIN-OUT] 01-roles/acc-admin.md:61` |
| `acc-user` (Normal User) | ❌ | ❌ | ❌ MISSING | ❌ MISSING | ❌ | `[BRAIN-OUT] flows/Edit Node.md:41` + `[BRAIN-OUT] 01-roles/acc-user.md:51-52, 62` |

**Field-level PES asymmetries** (where the same role passes one Edit Node op but fails another):

1. **`sys-ops` Op 1 ✅ vs Op 5 ⚠** — sys-ops can rename a node but is view-only on Account Limitations + Password Security per PRD W7 workflow text `[BRAIN-OUT] flows/Edit Node.md:38`. Field-level: sys-ops can edit `AllowedIPs[]` per `[BRAIN-OUT] 03-pes-keys/REGISTRY-RAW.md:43` (`sys.account-allowed-ips / edit` allow); cannot edit `Password Security Level` or 4 limits.
2. **`acc-owner` Op 1 ✅ vs Op 5 ⚠** — can rename anywhere in own subtree; can edit some settings rows but **cannot `Edit Price`** on CommChannels/Apps `[BRAIN-OUT] flows/Edit Node.md:39`.
3. **`acc-admin` Op 1 ✅ vs Op 5 ❌** — explicit deny on `acc.account-profile.edit` per `[BRAIN-OUT] 01-roles/acc-admin.md:61`. **CAN rename sub-nodes, CANNOT touch settings.** This is the cleanest field-level asymmetry in the matrix.

**Wider context** — Edit Node has the **broadest role reach** of the 4 Org Hierarchy flows (tied with Add Node and Add User):

| Flow | Roles that can run | Source |
|---|---|---|
| Add Client | 2 / 6 (sys-admin + sys-products) | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md` |
| Add User | 4 / 6 (sys-admin + sys-products + acc-owner + acc-admin) — Add User can scope by acc-* role | `[BRAIN-OUT] flows/Add User.md` |
| **Add Node** | **5 / 6** (all except acc-user) | `[BRAIN-OUT] flows/Add Node.md:22-29` |
| **Edit Node (rename)** | **5 / 6** (same as Add Node; scope-restricted for acc-*) | `[BRAIN-OUT] flows/Edit Node.md:36-41` |
| **Edit Node (settings)** | **3-4 / 6** (sys-admin + sys-products + acc-owner full; sys-ops partial; acc-admin **denied**; acc-user denied) | `[BRAIN-OUT] flows/Edit Node.md:38-40` |

**The granularity insight.** Edit Node is the only flow in the dataset where a **single role's verdict differs across operations on the same trigger row**. A naive "edit button gated by one PES key" wires a broken UI:
- An acc-admin sees the kebab menu, clicks Rename — works.
- The same acc-admin sees the same row, navigates to Settings tab — backend 403s OR FE hides the tab.
- An acc-owner can rename + edit some settings rows but not all (sys.services.payment vs sys.services.editPriceValue divergence).

This is why the **capability map per role × per op** is the canonical lookup, not a single allowlist.

---

## Runtime verification status

`[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md` shows a sister flow (comms-hub mgmt-console gate) is `🟡 PARTIAL` — backend PES gate verified (21/21 PASS) but the FE-level UI gate is blocked on dev-server + env drift. Edit Node has not been runtime-tested.

**Per-layer verification status for Edit Node:**

| Layer | Verdict | Evidence |
|---|---|---|
| 1 — Business intent | 🟢 spec-verified | Playbook authored at `[BRAIN-OUT] flows/Edit Node.md` |
| 2 — PRD requirement | 🟡 spot-checked | Most fields trace to PRD; **scheduled rename is undocumented in PRD** (backend ➕ extra); **archive lifecycle is OPEN** (Q-AM-08 / GAP-AM-29) |
| 3 — Permission gate | 🟡 spot-checked | Per-role verdicts traceable to `BuiltInRoleCatalog.cs` for most ops; **`renameNode()` PES key claimed but absent from registry** — gap noted in Layer 12 |
| 4 — BR-AM rules | 🟡 spot-checked | Naming rule borrowed from BR-AM-03 sister; Op 5 rules well-traced; **no BR rule exists for scheduled rename or move-node** |
| 5 — V-rules per step | 🟡 spot-checked | `V-account-name-format-uniqueness` + `V-account-limits-zero-means-no-limit` etc. well-documented; **`V-subnode-name-maxlength-30` referenced but NOT yet seeded in vault** `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:217` |
| 6 — E-* entity drift | 🟢 vault-verified | `E-node` + `E-account-settings` mapped at `[VAULT] _obsidian/40-API/E-*.md` |
| 7 — Backend DTO | 🟡 spot-checked | `ChangeNodeNameRequest` shape from playbook; `[ThrowIf*]` attributes mirror Add Node sister; `EffectiveDate?` confirmed as backend ➕ extra per `E-node` row 6 |
| 8 — Backend endpoint + handler | 🟡 spot-checked | Endpoint path + auth verified; handler internals `[INFERRED]` from sister patterns |
| 9 — FluentValidator + handler-time gate | 🟡 spot-checked | Cross-field rules + error codes documented; full validator chain not source-cited |
| 10 — Kafka events | 🔴 unverified | `NodeRenamed` event **possible but unverified** per `[BRAIN-OUT] flows/Edit Node.md:69` + `[BRAIN-OUT] 14-flow-playbook-integration/MATRIX.md:34` |
| 11 — Error codes | 🟢 catalog-verified | All ~14 codes mapped to HTTP status in `[BRAIN-OUT] 13-error-catalog/CATALOG.md`; **`NewNodeNameNotApplyed` typo flagged** as backend bug |
| 12 — FE route + PES gate | 🔴 unverified | **Claimed `renameNode()` key is NOT in `falcon-access.registry.ts`** — gap to resolve before implementation |
| 13 — FE components | 🟢 spec-verified | Falcon UI Core component map enumerated in `[BRAIN-OUT] flows/Edit Node.md:178-190` |
| 14 — FE form + state | 🟡 spot-checked | Reactive Forms pattern `[INFERRED]` from sister flows; specific state container not fixed by playbook |
| 15 — FE i18n keys | 🔴 unverified | `[INFERRED]` — playbook silent; concrete keys need confirmation against existing i18n bundles |
| 16 — Test case (Gherkin) | 🟡 spot-checked | Scenarios composed from documented BRs + V-rules + error codes; need to run against a live stack |
| 17 — Port artifact | 🟢 spec-verified | Both consoles host Edit Node; per-role per-op port matrix derived from role capability maps |
| 18 — Capability map per role | 🟢 code-verified | `BuiltInRoleCatalog.cs` seed rules + per-role capability maps; field-level divergences cited |

**No layer has been ✋ runtime-verified for Edit Node specifically.** Closest evidence is the sister `comms-hub` flow at `[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md` (backend PES gate works 21/21; FE blocked on infra). Edit Node runtime verification awaits a working FE stack with seeded test users per `[MEMORY] project_local_backend_test_users_2026_05_16.md` (`Admin@1234` standard).

---

## The traceability backbone

This section shows how **layer N+1 is uniquely determined by layer N** for Edit Node — with explicit per-operation branching where Add Client had linear flow.

```
[1] Business intent: "mutate an existing node's name, schedule, or settings"
    │
    │ (PRD authors mostly silent — BR-AM-03 borrow for naming; Q-AM-08/18 open)
    ▼
[2] PRD requirement: PRD-01 BR-AM-03 (rename) + BR-AM-09..13 (settings on Main) — incomplete coverage
    │
    │ (PRD silence on scheduled rename → backend ➕ extra; PRD silence on move/archive → MISSING)
    ▼
[3] Permission gate: 5/6 roles can rename (scope-restricted); 3-4/6 can edit settings (per-field)
    │
    │ (PRD + BR rule borrows fix the cross-field rules)
    ▼
[4] BR-AM rules: BR-AM-03 (naming) + BR-AM-09..13 (settings) + tombstone/scope gates
    │
    │ (Each rule that's a per-field invariant becomes a V-rule)
    ▼
[5] V-rules per step: 2 for rename (subnode-name-maxlength + name-format-uniqueness sister) + 3 for Op 5
    │
    │ (Each V-rule names the DTO field + attribute that enforces it)
    ▼
[6] E-* entity drift: 2 entities (E-node mutated; E-account-settings for Op 5) — 8 + 14 drifts
    │
    │ (Backend persists via separate DTOs per op)
    ▼
[7] Backend DTOs: ChangeNodeNameRequest (Ops 1+2) + UpdateSettingsRequest (Op 5) + [ThrowIf*] attrs
    │
    │ (Each DTO is consumed by ONE endpoint)
    ▼
[8] Backend endpoints: PUT /api/Node/ChangeNodeName + PUT /api/Setting on Commerce
    │
    │ (Pre-processor runs [ThrowIf*]; handler runs cross-field + scope + tombstone + uniqueness)
    ▼
[9] FluentValidator + handler-time gate
    │
    │ (On commit success, the handler MAY produce Kafka events — unverified for Edit Node)
    ▼
[10] Kafka events: 0 verified (NodeRenamed unconfirmed); Op 5 likely produces identity-settings-sync.v1
    │
    │ (Every validation/handler/scope path can fail with mapped error codes)
    ▼
[11] Error codes: ~14 for rename ops + 5 more for Op 5 across 5 HTTP status classes
    │
    │ (Frontend must surface them; FE route must gate access)
    ▼
[12] FE route + PES gate: BOTH consoles; renameNode() PES key claimed but ABSENT from registry (GAP)
    │
    │ (Once gated, FE composes the dialog from Falcon UI Core)
    ▼
[13] FE components: <falcon-dialog> + <falcon-input> + <falcon-date-picker> + <falcon-status-badge>
    │
    │ (Each component wires into a FormGroup)
    ▼
[14] FE form + state: Reactive FormGroup with notSameAsCurrent + futureDateValidator
    │
    │ (Display copy is i18n-resolved; error messages from backend already localized)
    ▼
[15] FE i18n keys: en + ar resolutions per field — inferred namespace, needs i18n bundle check
    │
    │ (Tests assert the full chain — happy + scheduled + dup + scope + missing-op guardrails)
    ▼
[16] Test case (Gherkin): 6 scenarios — happy, scheduled, duplicate, out-of-scope, MISSING guardrail, Op 5 cross
    │
    │ (Codebase placement follows folder doctrine; ports to BOTH consoles)
    ▼
[17] Port artifact: BOTH consoles — different from Add Client; per-role per-op port matrix
    │
    │ (Per-role × per-op capability verdict — the actual runtime answer)
    ▼
[18] Capability map per role: 5/6 can rename; 3-4/6 can edit settings; 0/6 can move or archive
```

**Implication.** A change in layer 1 (e.g. "now acc-admin can edit some settings on the Main of their own tenant") cascades downward and re-opens layers 3 + 5 + 12 + 18 — but does **not** automatically touch Ops 1+2 (rename) because they live in a different PES dimension. Conversely, an audit at layer 18 (acc-admin's settings deny) traces back to `[CODE] BuiltInRoleCatalog.cs:227-240` (the explicit-deny block) — making the bidirectional path tighter than Add Client's because the asymmetry is encoded in PES.

---

## Cross-references

### Source playbook (Brain Outputs, single file — canonical SoT)

- [Edit Node flow playbook](../../../understanding/pages/organization-hierarchy/flows/Edit%20Node.md) — 224 lines, the only canonical source for this trace

### Sister flow playbooks (Brain Outputs)

- [Add Client](../../../understanding/pages/organization-hierarchy/Add%20Client/) — folder form (17 files); Step 1 of Add Client is where the Main node + its initial name are created (Edit Node mutates the result)
- [Add Node](../../../understanding/pages/organization-hierarchy/flows/Add%20Node.md) — single file; the sister flow that CREATES the sub-nodes Edit Node renames
- [Add User](../../../understanding/pages/organization-hierarchy/flows/Add%20User.md) — single file; unaffected by node rename (users live on nodes by id, not name)

### Authority dataset clusters (this dataset)

- [01-roles/sys-admin](../01-roles/sys-admin.md) — primary Falcon role; Op 1 + 5 full reach
- [01-roles/sys-products](../01-roles/sys-products.md) — secondary Falcon role; same reach
- [01-roles/sys-ops](../01-roles/sys-ops.md) — Falcon Operation; Op 1 ✅ + Op 5 ⚠ partial
- [01-roles/acc-owner](../01-roles/acc-owner.md) — tenant top role; Op 1 ✅ own-subtree + Op 5 ⚠ limited
- [01-roles/acc-admin](../01-roles/acc-admin.md) — **the asymmetry role** — Op 1 ✅ + Op 5 ❌ explicit deny
- [01-roles/acc-user](../01-roles/acc-user.md) — transactional only; all denied
- [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md) — **gap noted**: `renameNode()` not in canonical registry
- [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
- [05-capability-maps/sys-admin.capability](../05-capability-maps/sys-admin.capability.md) — Edit Node row at `:54`
- [05-capability-maps/sys-ops.capability](../05-capability-maps/sys-ops.capability.md) — Edit Node row at `:54` (silent deny on account-profile / edit)
- [05-capability-maps/sys-products.capability](../05-capability-maps/sys-products.capability.md) — Edit Node row at `:54`
- [05-capability-maps/acc-owner.capability](../05-capability-maps/acc-owner.capability.md)
- [05-capability-maps/acc-admin.capability](../05-capability-maps/acc-admin.capability.md)
- [05-capability-maps/acc-user.capability](../05-capability-maps/acc-user.capability.md)
- [06-validation-by-feature/MATRIX](../06-validation-by-feature/MATRIX.md) — OH drill-down at `§3.1` lists the V-rules; `V-subnode-name-maxlength-30` gap at line 217
- [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md) — both gateways serve `ChangeNodeName`
- [08-entity-drift-by-feature/MATRIX](../08-entity-drift-by-feature/MATRIX.md) — `E-node` + `E-account-settings` at `:127-138`
- [09-business-rules-by-feature/MATRIX](../09-business-rules-by-feature/MATRIX.md) — BR-AM-* applicable rules at `§4.1`
- [10-non-pes-gates-by-feature/MATRIX](../10-non-pes-gates-by-feature/MATRIX.md) — node-type + composite gates at `§3.1`
- [13-error-catalog/CATALOG](../13-error-catalog/CATALOG.md) — all 14+ error codes for Edit Node mapped to HTTP status
- [14-flow-playbook-integration/Add-Node-and-Edit-Node.integration](../14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md) — authority-lens integration shared with Add Node
- [14-flow-playbook-integration/MATRIX](../14-flow-playbook-integration/MATRIX.md) — 4-flow master view
- [15-implementation-pitfalls/](../15-implementation-pitfalls/) — known traps catalogue
- [18-a-to-z-traces/Add-Client.trace](Add-Client.trace.md) — the exemplar this trace mirrors

### Brain SK vault notes (V-rules + Entities)

- [`V-account-name-format-uniqueness`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md) — sister rule applied to NewName
- [`V-account-limits-zero-means-no-limit`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-limits-zero-means-no-limit.md) — Op 5 limits
- [`V-password-security-level-enum`](../../../../Brain%20SK/_obsidian/30-Validation/V-password-security-level-enum.md) — Op 5 password tier (Q-UM-12)
- [`V-account-ip-allowlist-enforcement`](../../../../Brain%20SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md) — Op 5 IPs
- **`V-subnode-name-maxlength-30`** — **NOT YET SEEDED** in `Brain SK/_obsidian/30-Validation/` per `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md:217`. Implementer should seed before the next dataset refresh.
- [`E-node`](../../../../Brain%20SK/_obsidian/40-API/E-node.md) — mutated by Ops 1+2; `EffectiveDate?` row 6 is the backend ➕ extra
- [`E-account-settings`](../../../../Brain%20SK/_obsidian/40-API/E-account-settings.md) — mutated by Op 5

### Memory standing rules (load-bearing for implementation)

- `[MEMORY] project_falcon_component_validation_convention.md` — folder + DI doctrine
- `[MEMORY] feedback_library_skeleton_app_api.md` — library vs app-level wrapper rule (Edit Node ports to BOTH consoles)
- `[MEMORY] feedback_falcon_custom_library_mandatory.md` — Falcon UI kit first; no PrimeNG; no SCSS
- `[MEMORY] feedback_no_inline_styles_tokens_only.md` — Tailwind utilities + tokens only
- `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md` — PES subject MUST be Zitadel id
- `[MEMORY] feedback_frontend_auth_identity_service.md` — FE never calls Zitadel directly
- `[MEMORY] feedback_test_user_password_standard.md` — every test user uses `Admin@1234`
- `[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy.md` — 10 failure patterns from org-hierarchy work
- `[MEMORY] project_falcon_knowledge_graph_vault.md` — source-prefix rule + retrieval contract

### Open questions / blockers surfaced by this trace

- **Q-AM-08** (archive vs Active/Deleted state) — Operation 4 blocked
- **Q-AM-18** (move node) — Operation 3 blocked; GAP-AM-07 (no MoveNode endpoint)
- **Q-AM-29** (no DELETE Node endpoint) — Operation 4 blocked
- **Q-AM-RENAME-CANCEL** — no DELETE for pending scheduled rename; workaround documented `[BRAIN-OUT] flows/Edit Node.md:105`
- **Q-UM-12** — `PasswordSecurityLevel` vocabulary drift Normal/Advanced ↔ Low/Medium/High/Strict (Op 5 concern)
- **PRD silence: uniqueness scope** for `DuplicateNodeName` (per-parent / per-account / global?)
- **PRD silence: letter-prefix** rule application to sub-node names (BR-AM-03 sister-rule borrow ambiguous)
- **PRD silence: audit trail** for renames
- **PES key gap**: `FalconAccess.managementConsole.organizationHierarchy.renameNode()` claimed but absent from `falcon-access.registry.ts`
- **V-rule gap**: `V-subnode-name-maxlength-30` referenced but not seeded in vault
- **Kafka unverified**: `NodeRenamed` event possible; needs handler-source confirmation
- **Backend typo**: `NewNodeNameNotApplyed` (missing "i") — log as backend bug

### Sibling integration files (authority-dataset 14- cluster)

- [Add-Client.integration](../14-flow-playbook-integration/Add-Client.integration.md) — creates the Main node + Account that Edit Node mutates
- [Add-User.integration](../14-flow-playbook-integration/Add-User.integration.md) — Users on nodes are NOT affected by rename (linked by id, not name)
- [Add-Node-and-Edit-Node.integration](../14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md) — authority-lens integration shared with Add Node (this trace's authority lens)
- [MATRIX](../14-flow-playbook-integration/MATRIX.md) — master 4-flow view
