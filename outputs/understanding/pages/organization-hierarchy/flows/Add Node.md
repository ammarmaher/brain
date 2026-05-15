*** Flow Playbook — Add Node (sub-node creation) ***
*** SoT for implementation: this file ***
*** Page: Organization Hierarchy · PRD: PRD-01 Account Management · 2026-05-15 ***

# Add Node — implementation playbook

> Falcon admin or Client admin creates a **sub-node** under an existing parent node within the same account hierarchy. Single-dialog flow (no wizard) backed by `POST /api/Node/create-SubNode`. Bounded by `AccountSettings.MaxNodeLevel` and the role-x-scope matrix.

## Trigger / entry point

- **Page:** [[Organization Hierarchy]] → Hierarchy tab (the tree panel on the left side of the page).
- **Surface:**
  - 3-dot kebab menu on a tree node row → menu item `Add sub-node` (handled via [[Falcon Menu]] on each row of the tree).
  - Optional row-level `+` icon-button on hover (existing pattern on [[Falcon Organization Hierarchy Tree TW]]).
- **Result of trigger:** opens a [[Falcon Dialog]] (or [[Falcon Drawer]] on mobile-width) seeded with the parent node id pre-filled.

## Permission matrix

> Source: [[Falcon Roles Permission Matrix]]; PRD-01 [BUSINESS_RULES.md](../../../../prd/modules/01-account-management/BUSINESS_RULES.md) `BR-AM-01` (3-level Root/Main/Sub hierarchy) and the Permission sheet (`Permission list - Jawad`, user-management attachments).

| Role | Scope | Allowed? | Notes |
|---|---|---|---|
| System Administrator (Falcon) | Anywhere | ✅ | Full hierarchy access |
| Product (Falcon) | Anywhere | ✅ | Same as Sys Admin for Add Node |
| Operation (Falcon) | Anywhere | ✅ | Per OVERVIEW.md actor row: Operation **can** add nodes/users (cannot add clients) |
| Account Owner (Client) | Under their own Main + sub-nodes | ✅ | Cannot add nodes outside their Main subtree |
| Node Admin (Client) | Under their own sub-nodes only | ✅ | Cannot add above their own sub-node |
| Normal User (Client) | Anywhere | ❌ | Transactional only |

**Frontend gate:** call [[Access PES Service]] via `AccessControlFacade` to evaluate `FalconAccess.managementConsole.organizationHierarchy.addSubNode()` before exposing the menu item. Server-side gate is class-level `[Authorize]` on `NodeController` + handler-time role check; backend errors map to `UnauthorizedAction` / `UnauthorizedUserToPerformThisAction` (403).

## Form fields (single dialog)

> DTO: `CreateSubNodeRequest` ([DTOS.md](../../../../backend/commerce/controllers/NodeController/DTOS.md) §`CreateSubNodeRequest`) — fields `ParentId` + `Name`.

| Field | Type | PRD rule | Backend DTO field | V-rule | Frontend validator |
|---|---|---|---|---|---|
| Parent Node | guid (read-only display) | implicit from trigger row; user does not re-pick | `ParentId` — `[ThrowIfNotPassed]` | _no dedicated V-rule (carry from trigger context)_ | hidden field, `Validators.required`; populated from the tree-row click context |
| Node Name | string ≤ 30 chars | PRD does not enumerate node-name format separately; assume parity with Account Name `BR-AM-03` (letter-prefix + unique within parent) | `Name` — `[ThrowIfNotPassed, ThrowIfMaxLengthExceed(30)]` | [[V-subnode-name-maxlength-30]] (cap+required); [[V-account-name-format-uniqueness]] (sister rule, applied at Main level — confirm whether letter-prefix applies to sub-node names) | `Validators.required` + `Validators.maxLength(30)`; suggest `Validators.pattern(/^[A-Za-z].*$/)` mirrored from Account Name letter-prefix rule (server does not enforce this on sub-node) |
| Node Type | enum (`root` / `main` / `sub`) per PRD ENTITIES.md | PRD lists `type` on Node entity | ❌ not on `CreateSubNodeRequest` | — | ⚠ **DRIFT** ([[E-node]] field reconciliation row 2): PRD lists `type` but backend does not carry it on create. UI must NOT expose this field — backend infers the type from position (sub-node under Main) |
| Node Settings (per-node overrides) | object | PRD ENTITIES.md lists `settings` as inferred per-node | ❌ no per-node settings DTO | — | ❌ **MISSING on backend** ([[E-node]] field reconciliation row 5): PRD hints at per-node settings but no DTO surfaces it. Settings live on Account via [[E-account-settings]]. Do NOT expose a settings step on Add Node dialog. Sub-nodes inherit from Main. |

**Total form fields exposed in UI: 2** (`Parent Node` read-only + `Node Name` input). The other two PRD-implied fields (`type`, `settings`) are surfaced here as drift/missing notes, not UI inputs.

## Backend endpoint summary

| Method | Path (gateway-prefixed) | Service | Request | Response | Auth | Error codes |
|---|---|---|---|---|---|---|
| POST | `/commerce/Node/create-SubNode` (Core Gateway — Client users) | [[Commerce Service]] · `NodeController.CreateSubNode` | `CreateSubNodeRequest { ParentId, Name }` | `ServiceOperationResult<bool>` (success flag) — see [FRONTEND_CONTRACT.md](../../../../backend/commerce/controllers/NodeController/FRONTEND_CONTRACT.md) | Class `[Authorize]` only — no `FalconOnly` policy → Client users CAN call this (in scope per permission matrix) | `ParentIdRequired` (400) · `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `ParentNodeRequired` (404) · `NodeNotFound` (404) · `MaxNodeLevelReached` (422) · `DuplicateNodeName` (409 typical) · `RootNodeCannotHaveSubNodes` (422) · `ActionsNotAllowedOnDeletedNode` (422) · `InvalidNodeLevel` (422) · `UnauthorizedAction` (403) — see [ERRORS.md](../../../../backend/commerce/controllers/NodeController/ERRORS.md) |
| POST | `/commerce/Node/create-SubNode` (System Gateway — Falcon users) | same | same | same | Falcon JWT routed via [[System Gateway Service]] | same |

**Routing note:** Same Commerce endpoint serves both gateways; the difference is the JWT issuer + which gateway is configured in the frontend HttpClient. No `FalconOnly` policy on this endpoint — both user types are allowed by Commerce; scope enforcement is handler-level.

## State / side effects

- **Persisted:** New `Node` row in Commerce datastore as child of `ParentId`.
- **Inheritance:**
  - AccountSettings inherited from the owning Account (Main node) — no per-sub-node settings table (per [[E-account-settings]] + [[E-node]] missing-DTO finding).
  - Wallet topology: no new wallet record is created automatically — wallets are bound to commchannels / users, not sub-nodes per se. If `WalletTypeConfig.balanceType = Node`, downstream wallet creation happens when users are added under the sub-node (see [[E-account-settings]] cross-service touches).
- **Events / Kafka:** _Not visible in the [ENDPOINT_REGISTRY.md](../../../../backend/commerce/ENDPOINT_REGISTRY.md) for `CreateSubNode` specifically_ — Commerce produces 11 Kafka topics total (per [GAPS.md](../../../../../prd/modules/01-account-management/GAPS.md) GAP-AM-24); whether a `NodeCreated` event fires for sub-node creation is unverified.
- **Cache:** After success, the frontend MUST refresh the hierarchy tree (`GET /commerce/Node?NodeId=<rootId>`) to render the new node. Eventual consistency is fast (single-call write — no orchestrator), but assume the tree component will re-fetch.

## Error states + UX

| Backend error | HTTP | UX surface | Message guidance |
|---|---:|---|---|
| `RequiredFieldMissing` / `ParentIdRequired` | 400 | inline on form (should not happen — Parent is auto) | "Parent node is required." (Hidden — log if user sees this) |
| `MaxLengthExceeded` (on `Name`) | 400 | inline below Node Name input | "Node name must be at most 30 characters." Tied to [[V-subnode-name-maxlength-30]] |
| `MaxNodeLevelReached` | 422 | full-dialog banner OR inline above the form | "This account's maximum hierarchy depth (X levels) has been reached." Provide a "View account settings" link to [[Organization Hierarchy]] Settings tab → Account Limitation section (Falcon-only edit). Tied to [[V-account-limits-zero-means-no-limit]] (`MaxNodeLevel` semantics; 0 = no limit). |
| `ParentNodeRequired` / `NodeNotFound` | 404 | full-dialog banner | "The parent node could not be found. The tree may be stale — refresh and try again." Trigger a hierarchy re-fetch on dismiss. |
| `DuplicateNodeName` | 409 (typical) | inline below Node Name input | "A node with this name already exists under the selected parent." (Confirm uniqueness scope is per-parent, not per-account — verify with handler logic; PRD silent.) |
| `RootNodeCannotHaveSubNodes` | 422 | full-dialog banner; close dialog | "Sub-nodes cannot be created directly under the Falcon Root. Choose a Main node or one of its sub-nodes." (Should not happen — UI must prevent triggering Add Node on Root.) |
| `ActionsNotAllowedOnDeletedNode` | 422 | full-dialog banner; close dialog | "This node has been removed. Refresh the tree." |
| `InvalidNodeLevel` | 422 | full-dialog banner | "Sub-node depth is not valid for this account." (Catch-all; should be rare if `MaxNodeLevelReached` covers normal cases.) |
| `UnauthorizedAction` / `UnauthorizedUserToPerformThisAction` | 403 | full-dialog banner; close dialog | "You don't have permission to add a sub-node here." (Should not happen — PES gate hides the menu.) |
| Network / 500 | 500 | global toast (existing platform pattern) | Standard retry message |

**Loading state:** disable Save button + show spinner while POST is in flight. Do NOT optimistically add the row to the tree — wait for success then re-fetch.

## Cross-flow dependencies

- **Depends on:** [[Add Client Flow]] — an Account (Main node) must exist before a sub-node can be added under it. Root + Main creation paths are separate (`POST /create-account`); Add Node is for the Sub-node tier only.
- **Children:**
  - [[Edit Node Flow]] — rename / scheduled rename of the newly-created sub-node.
  - [[Add User Flow]] — users can be added under any node, including the newly-created sub-node (counts against `MaxNormalUserLimit` / `MaxSystemUserLimit`).
- **Sibling sub-flows on the same page:**
  - CommChannels & Services tab — visibility/pricing are Account-level only (not per-sub-node).
  - Apps & Services tab — same.
  - Settings tab — only at Main node per `MainNodeOnlyOperation` (422) error code (see [ERRORS.md](../../../../backend/commerce/controllers/NodeController/ERRORS.md) §Hierarchy/Account Errors).

## Entity references

- [[E-node]] — primary; surfaces `type`-not-on-DTO and `settings`-missing-on-backend drift
- [[E-account-settings]] — owns `MaxNodeLevel` which gates this flow; sub-nodes inherit settings from Account

## V-rules in play

- [[V-subnode-name-maxlength-30]] — `Name` 30-char cap + required on `CreateSubNodeRequest.Name`
- [[V-account-limits-zero-means-no-limit]] — `MaxNodeLevel` is the runtime cap; 0 = no limit; breach surfaces as `MaxNodeLevelReached`
- [[V-account-name-format-uniqueness]] — sister rule on Main-node name; letter-prefix portion may or may not apply to sub-node names (PRD silent — surface as gap)

## Falcon components used

| Role | Component | Purpose |
|---|---|---|
| Trigger | [[Falcon Menu]] | 3-dot kebab on each tree row exposing the `Add sub-node` item |
| Trigger (alt) | [[Falcon Button]] | row-hover `+` icon-button (existing pattern on [[Falcon Organization Hierarchy Tree TW]]) |
| Container | [[Falcon Dialog]] | desktop primary surface |
| Container (mobile) | [[Falcon Drawer]] | mobile/narrow viewport fallback |
| Form input | [[Falcon Input]] | Node Name field |
| Form action | [[Falcon Button]] | Save / Cancel buttons |
| Tree | [[Falcon Tree]] / [[Falcon Tree Panel]] / [[Falcon Organization Hierarchy Tree TW]] | renders the hierarchy and surfaces the trigger row |

## Page sections touched

- `hierarchy-tab` (the left tree panel — entry point + post-save tree refresh)
- _Add Node does not touch `comm-channels-tab`, `apps-services-tab`, `settings-*`, or `otp-popup`._

## Implementation checklist

1. **PES gate** — wire `AccessControlFacade.has('managementConsole.organizationHierarchy.addSubNode')` before exposing menu item / button.
2. **Trigger** — on each tree node row, render kebab + handle `Add sub-node` action: capture parent `nodeId` and open dialog.
3. **Dialog scaffold** — use [[Falcon Dialog]] (desktop) / [[Falcon Drawer]] (≤ tablet width). Single-step, no wizard chrome.
4. **Form** — two fields:
   - `parentNodeId` (hidden, read-only) — pre-filled from trigger context.
   - `nodeName` ([[Falcon Input]]) — `Validators.required`, `Validators.maxLength(30)`. Optional client-side `Validators.pattern(/^[A-Za-z].*$/)` mirrored from Account Name letter-prefix (no backend mirror — surface as candidate gap).
5. **Submit** — `POST /commerce/Node/create-SubNode` with `{ ParentId, Name }`. Disable Save + show spinner.
6. **Success** — close dialog, refresh `GET /commerce/Node?NodeId=<rootId>`, expand the parent node, focus/select the new node.
7. **Errors** — map per the error table above. `MaxNodeLevelReached` should show a permanent banner inside the dialog with a link to Settings.
8. **Telemetry** — log `addSubNode.attempt` / `addSubNode.success` / `addSubNode.error<Code>` for observability.
9. **i18n** — all strings via the i18n service; Arabic labels for Node Name + Save + Cancel.

## Open questions / surface to PRD owner

- **Uniqueness scope** — `DuplicateNodeName` 409: is uniqueness enforced per-parent, per-account, or globally? Confirm with Commerce handler (`ICreateSubNodeHandler`).
- **Letter-prefix on sub-node** — does `BR-AM-03` (letter-prefix) apply to sub-node names? PRD silent. Backend does not enforce. Cosmetic UI rule only.
- **Per-node settings** — PRD entity diagram suggests `settings` on Node; backend has none. Confirm intent (inherit-only vs override-allowed). If override-allowed, this is a missing feature; surface in `GAP_REGISTRY.md`.
- **Move sub-node** — out of scope here; see [[Edit Node Flow]] "Move node (MISSING)" section + `Q-AM-18`.

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[PRD_INDEX]] · [[API_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
