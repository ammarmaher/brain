*** Flow Playbook — Edit Node (rename · scheduled rename · move · archive · settings) ***
*** SoT for implementation: this file ***
*** Page: Organization Hierarchy · PRD: PRD-01 Account Management · 2026-05-15 ***

# Edit Node — implementation playbook

> Family of operations against an existing node in the Falcon hierarchy. Some operations are **LIVE** (rename + scheduled rename + settings edit at Main); others are **MISSING** in PRD and backend (move-node Q-AM-18, archive/delete-node GAP-AM-29). UI must not surface MISSING operations.

## Operations covered

| Op | Status | Backend endpoint | Notes |
|---|---|---|---|
| ✅ Rename (immediate) | LIVE | `PUT /api/Node/ChangeNodeName` | Field `EffectiveDate?` omitted → immediate |
| ✅ Scheduled rename | LIVE (➕ backend extra per [[E-node]]) | `PUT /api/Node/ChangeNodeName` with `EffectiveDate?` in future | PRD does NOT document this — backend supports it |
| ❌ Move node | MISSING (`Q-AM-18`) | _no `MoveNode` endpoint_ | Do NOT expose in UI |
| ❌ Archive / delete node | MISSING (`GAP-AM-29`) | _no `DELETE /api/Node/{id}` endpoint_ | Do NOT expose in UI |
| ✅ Edit AccountSettings on this node | LIVE (Main-node only) | `PUT /api/Setting` ([[E-account-settings]]) | `MainNodeOnlyOperation` (422) on sub-nodes — own sub-flow |

## Trigger / entry point

- **Page:** [[Organization Hierarchy]] → Hierarchy tab (the tree panel).
- **Surface:**
  - 3-dot kebab menu on a tree node row → `Rename` / `Schedule rename` menu items (handled via [[Falcon Menu]]).
  - Optional inline edit on double-click of the node label — verify against existing [[Falcon Organization Hierarchy Tree TW]] behavior; if absent, kebab-only.
- **Result of trigger:**
  - Rename → opens a small [[Falcon Dialog]] (or inline editor) with the current name pre-filled.
  - Scheduled rename → opens a [[Falcon Dialog]] with the current name pre-filled + a [[Falcon Date Picker]] for `EffectiveDate`.
  - Edit settings → routes to the Settings tab of the page (not a dialog) — Main node only.

## Permission matrix

> Source: [[Falcon Roles Permission Matrix]]; same scoping as [[Add Node Flow]].

| Role | Rename / Scheduled rename | Edit Settings on Main | Notes |
|---|---|---|---|
| System Administrator (Falcon) | ✅ Anywhere | ✅ | |
| Product (Falcon) | ✅ Anywhere | ✅ (Account Limitations + price/visibility) | |
| Operation (Falcon) | ✅ Anywhere | ❌ on Account Limitations / Password Security per W7 workflow text | view-only on certain settings rows |
| Account Owner (Client) | ✅ inside own Main subtree | ⚠ limited — AO can `Disable` / `Do Payment` commchannels; cannot `Edit Price` | per PRD-01 OVERVIEW Actors |
| Node Admin (Client) | ✅ inside own sub-nodes only | ❌ | no settings actions |
| Normal User (Client) | ❌ | ❌ | transactional only |

**Frontend gate:** call [[Access PES Service]] via `AccessControlFacade` to evaluate `FalconAccess.managementConsole.organizationHierarchy.renameNode()` (and similar for scheduled rename, settings edit). Backend gate: class-level `[Authorize]` on `NodeController`; settings updates have additional handler checks.

---

## Operation 1 — Rename (immediate)

### Form fields

> DTO: `ChangeNodeNameRequest` ([DTOS.md](../../../../backend/commerce/controllers/NodeController/DTOS.md) §`ChangeNodeNameRequest`) — fields `NodeId, NewName, EffectiveDate?`.

| Field | Type | PRD rule | Backend DTO field | V-rule | Frontend validator |
|---|---|---|---|---|---|
| Node Id | guid (read-only) | implicit from trigger row | `NodeId` (required) | _no V-rule (carry from context)_ | hidden field, populated from tree-row click |
| New Name | string ≤ 30 chars | parity with [[V-account-name-format-uniqueness]] sister rule for Main; sub-node naming is silent in PRD | `NewName` | [[V-subnode-name-maxlength-30]] (cap+required); [[V-account-name-format-uniqueness]] (sister) | `Validators.required` + `Validators.maxLength(30)`; suggest mirrored `Validators.pattern(/^[A-Za-z].*$/)` for letter-prefix (no backend mirror) |
| Effective Date | _omitted_ | — | `EffectiveDate?` — leave null for immediate rename | — | _not rendered in immediate-rename dialog_ |

### Backend endpoint

| Method | Path | Service | Request | Response | Auth | Notable errors |
|---|---|---|---|---|---|---|
| PUT | `/commerce/Node/ChangeNodeName` | [[Commerce Service]] · `NodeController.ChangeNodeName` | `ChangeNodeNameRequest { NodeId, NewName, EffectiveDate?: null }` | `ServiceOperationResult<string>` (new node name) | Class `[Authorize]` — no `FalconOnly` policy; Client users can call | `NodeNameRequired` (400) · `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `NoChangesToUpdate` (likely 422) · `NewNodeNameNotApplyed` (likely 422 — typo in error key per [VALIDATIONS.md](../../../../backend/commerce/controllers/NodeController/VALIDATIONS.md)) · `ActionsNotAllowedOnDeletedNode` (422) · `NodeNotFound` (404) · `DuplicateNodeName` (likely 409) · `UnauthorizedAction` (403) |

### State / side effects

- Persisted: `Node.Name` updated immediately.
- Cache: refresh tree (`GET /commerce/Node?NodeId=<rootId>`); the node label updates in place.
- Events: PRD does not specify; backend may emit a `NodeRenamed` Kafka event — unverified.

### Error states + UX

| Backend error | HTTP | UX surface | Message guidance |
|---|---:|---|---|
| `NodeNameRequired` / `RequiredFieldMissing` | 400 | inline below New Name | "Node name is required." |
| `MaxLengthExceeded` | 400 | inline below New Name | "Node name must be at most 30 characters." |
| `NoChangesToUpdate` | 422 (likely) | inline banner | "The new name is the same as the current name." (Or block Save when name unchanged client-side.) |
| `NewNodeNameNotApplyed` | 422 (likely; note backend typo) | full-dialog banner | "The node name could not be updated. Try again." Log the typo as a backend bug. |
| `DuplicateNodeName` | 409 (likely) | inline below New Name | "A node with this name already exists." (Verify uniqueness scope — per-parent vs per-account; PRD silent.) |
| `ActionsNotAllowedOnDeletedNode` | 422 | banner; close dialog | "This node has been removed. Refresh the tree." |
| `NodeNotFound` | 404 | banner; close dialog | "Node not found. Refresh the tree." |
| `UnauthorizedAction` | 403 | banner; close dialog | "You don't have permission to rename this node." |

---

## Operation 2 — Scheduled rename (`EffectiveDate?`)

> **Important:** This capability is a backend ➕ extra per [[E-node]] field reconciliation row 6. PRD does **not** document scheduled rename. Confirm with product owner whether to expose it in UI for v1 or hide behind a flag.

### Form fields

| Field | Type | PRD rule | Backend DTO field | V-rule | Frontend validator |
|---|---|---|---|---|---|
| Node Id | guid (read-only) | implicit from trigger | `NodeId` | — | hidden field |
| New Name | string ≤ 30 chars | parity with sister rules | `NewName` | [[V-subnode-name-maxlength-30]] + [[V-account-name-format-uniqueness]] (sister) | `Validators.required` + `Validators.maxLength(30)` |
| Effective Date | DateTime (future) | _PRD silent_ — backend supports | `EffectiveDate?` (DateTime?) | — | `Validators.required` + custom `futureDateValidator` (must be strictly after `Date.now()`); date picker should default to "tomorrow". Same error surface as price-type/value changes — `EffectiveDateMustBeInFuture` (422) is the canonical mismatch code per [ERRORS.md](../../../../backend/commerce/controllers/NodeController/ERRORS.md) (note that error is documented for price changes; whether the rename handler reuses it is unverified — surface as gap). |

### Backend endpoint

Same endpoint as immediate rename: `PUT /commerce/Node/ChangeNodeName` with `EffectiveDate` set to a future ISO-8601 date.

### State / side effects

- The rename is queued; current name remains until `EffectiveDate`. Display the pending rename as a [[Falcon Status Badge]] or inline annotation on the tree row (existing shadow-row pattern from Wave 20 — `UIUX-SHADOW-001..005` — may apply; see [UI_UX_RULES.md](../UI_UX_RULES.md)).
- Cancellation of a pending scheduled rename: **NO explicit endpoint observed** for rename (price changes have `DELETE /comm-channel/new-price-type`; rename has no mirror). Surface as gap: `Q-AM-RENAME-CANCEL — how to cancel a pending scheduled rename?` Workaround: submit another `ChangeNodeName` with the current name + a future date, or with `EffectiveDate = null` to overwrite.

### Error states + UX

Same as immediate rename, **plus**:

| Backend error | HTTP | UX |
|---|---:|---|
| `EffectiveDateRequired` (likely) | 400 | inline below Date Picker — "Effective date is required." (Note: this code is documented for price changes — confirm rename handler reuses it.) |
| `EffectiveDateMustBeInFuture` (likely) | 422 | inline below Date Picker — "Effective date must be in the future." Block submit client-side. |

---

## Operation 3 — Move node (MISSING)

- **Status:** Not implemented today. PRD `Q-AM-18` ("Moving node from level to level") is OPEN; `GAPS.md` `GAP-AM-07` is MISSING — no `MoveNode` / `ReParentNode` endpoint visible in [ENDPOINT_REGISTRY.md](../../../../backend/commerce/ENDPOINT_REGISTRY.md).
- **Frontend rule:** UI must NOT surface a `Move node` action until PRD + backend agree. If a drag-and-drop reorder is added to the tree in future, gate it behind a feature flag.
- **If approved:** would need a new `MoveNodeRequest { NodeId, NewParentId }` DTO + handler in `NodeController` + gateway route exposure. Sister-error candidates: `InvalidNodeLevel`, `MaxNodeLevelReached`, `RootNodeCannotHaveSubNodes`. Server-side check: target parent must respect `MaxNodeLevel`; cycle detection (cannot move ancestor under its descendant).
- **Surface in:** [GAP_REGISTRY.md](../GAP_REGISTRY.md) as `GAP-AM-MOVE-NODE-001` (link existing `GAP-AM-07`).

---

## Operation 4 — Archive / delete node (MISSING)

- **Status:** Not implemented today. PRD `Q-AM-08` ("Is there an Account archive state, or only Active / Deleted?") is OPEN; `GAPS.md` `GAP-AM-29` MISSING — no `DELETE /api/Node/{id}` endpoint and no `archive` field on `GetMainNodeInfoResponse`.
- **Frontend rule:** UI must NOT surface a `Archive node` or `Delete node` action. Do NOT add a [[Falcon Confirm Dialog]] for delete until backend exposes the endpoint.
- **Related error codes (already defined on backend, suggesting prior intent):**
  - `ActionsNotAllowedOnDeletedNode` (422) — implies a soft-delete state exists conceptually
  - `RootNodeDeletionNotAllowed` (422) — explicit root-protection
  - These codes are referenced by other handlers (rename, sub-node-create) — suggesting the model expects a deleted state, but no write path to enter it.
- **If approved:** would need:
  - `DELETE /api/Node/{id}` (or `POST /api/Node/{id}/archive`) endpoint
  - Cascade rules: what happens to sub-nodes, users, commchannels, wallets under an archived node? PRD silent.
  - Reactivation path: can an archived node be un-archived? PRD silent.
- **Surface in:** [GAP_REGISTRY.md](../GAP_REGISTRY.md) as `GAP-AM-ARCHIVE-NODE-001` (link existing `GAP-AM-29`).

---

## Operation 5 — Edit AccountSettings on this node (Main only)

- **Status:** LIVE for Main node (= Account). Sub-nodes get `MainNodeOnlyOperation` (422) per [ERRORS.md](../../../../backend/commerce/controllers/NodeController/ERRORS.md).
- **Surface:** Settings tab of the Organization Hierarchy page — not a dialog. Out of scope for the Hierarchy-tab kebab; documented here for cross-flow awareness.
- **Endpoint:** `PUT /api/Setting` (with `UpdateSettingsRequest`); read via `GET /api/Setting?ownerId=`. See [[E-account-settings]] for full field reconciliation.
- **Fields exposed:** `PasswordSecurityLevel` (enum drift Normal/Advanced ↔ Low/Medium/High/Strict — Q-UM-12), `AllowedIPs[]`, `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevel`, `BalanceTransferLimit`.
- **V-rules:** [[V-account-limits-zero-means-no-limit]] · [[V-password-security-level-enum]] · [[V-account-ip-allowlist-enforcement]].
- **PES gate:** `Edit Account Limitations` and `Edit Password Security Level on Root/Main` are Falcon-only with Operation = `Not Allow` per W7 workflow.
- **This sub-flow is owned by the Settings-tab portion of [[Organization Hierarchy]] — separate from the Hierarchy-tab Edit Node dialog. Link only.**

---

## Cross-flow dependencies

- **Depends on:** [[Add Node Flow]] (the node must exist before it can be edited) and [[Add Client Flow]] (Main node creation precedes any rename of Main).
- **Sibling:**
  - [[Add User Flow]] — users under a renamed node are unaffected (rename does not cascade).
  - CommChannels/Apps tabs — unaffected by node rename.
- **Children:** none. Rename completes the flow.

## Entity references

- [[E-node]] — primary; surfaces:
  - `type` not on response DTO (drift)
  - `settings` missing on backend (PRD-hinted inheritance not modeled)
  - `EffectiveDate?` ➕ extra (scheduled rename)
- [[E-account-settings]] — Operation 5 (edit settings on Main node)

## V-rules in play

- [[V-subnode-name-maxlength-30]] — applies to `NewName` on rename (30-char cap + required)
- [[V-account-name-format-uniqueness]] — sister rule on Main-node Account Name (the letter-prefix portion may apply to rename — PRD silent)
- [[V-account-limits-zero-means-no-limit]] — relevant to Operation 5 (settings edit on Main); not directly for rename
- [[V-password-security-level-enum]] — relevant to Operation 5 only

## Falcon components used

| Role | Component | Purpose |
|---|---|---|
| Trigger | [[Falcon Menu]] | kebab on tree row exposing `Rename` + `Schedule rename` |
| Trigger (alt) | [[Falcon Tree]] / [[Falcon Organization Hierarchy Tree TW]] | inline-edit-on-double-click (verify) |
| Container | [[Falcon Dialog]] | rename dialog (immediate + scheduled) |
| Container (mobile) | [[Falcon Drawer]] | narrow-viewport fallback |
| Form input | [[Falcon Input]] | New Name field |
| Date input | [[Falcon Date Picker]] | Effective Date (scheduled rename only) |
| Pending state | [[Falcon Status Badge]] | annotate row when a scheduled rename is queued (shadow-row pattern from Wave 20) |
| Action | [[Falcon Button]] | Save / Cancel |
| **Not used (MISSING ops)** | [[Falcon Confirm Dialog]] | reserved for Archive / Delete — do NOT wire until backend exists |

## Page sections touched

- `hierarchy-tab` (kebab + inline label update on rename success; shadow-row annotation for scheduled rename)
- `settings-tab-edit-mode` (Operation 5 only — separate Settings sub-flow)

## Implementation checklist

1. **PES gate** — `AccessControlFacade.has('managementConsole.organizationHierarchy.renameNode')`. Same for scheduled rename if exposed.
2. **Trigger** — kebab menu items: `Rename` (always) and `Schedule rename` (behind feature flag if v1 should not expose backend ➕).
3. **Rename dialog (immediate)** — [[Falcon Dialog]] with [[Falcon Input]] pre-filled with current name. Validators: required + maxLength(30) + optional pattern.
4. **Scheduled rename dialog** — same dialog with [[Falcon Date Picker]] added; validate future-date client-side; disable Save when invalid.
5. **Submit** — `PUT /commerce/Node/ChangeNodeName` with `{ NodeId, NewName, EffectiveDate? }`. Immediate omits `EffectiveDate`.
6. **Success (immediate)** — close dialog, update node label in tree without full refetch if possible; otherwise refetch.
7. **Success (scheduled)** — close dialog, annotate row with pending-change badge ([[Falcon Status Badge]]); show original name + small `→ NewName @ EffectiveDate` annotation.
8. **Errors** — map per the per-operation tables above.
9. **MISSING ops** — DO NOT render `Move node` or `Archive node` / `Delete node` actions in the kebab. Add `TODO` linked to `Q-AM-18` and `GAP-AM-29` in component source comments.
10. **Telemetry** — `renameNode.attempt/success/error<Code>`; `scheduleRenameNode.attempt/success/error<Code>`.
11. **i18n** — `Rename`, `Schedule rename`, `Effective date`, `Save`, `Cancel`, error strings.

## Open questions / surface to PRD owner

- **Expose scheduled rename in v1?** Backend supports it; PRD doesn't document it. Confirm with product before exposing the UI.
- **Cancel pending scheduled rename** — no explicit DELETE endpoint observed; workaround documented above. Surface as `Q-AM-RENAME-CANCEL`.
- **Move node** — `Q-AM-18` still open; UI must stay off.
- **Archive / delete node** — `GAP-AM-29` still missing; UI must stay off; cascade rules need PRD definition before backend builds.
- **Letter-prefix rule on rename** — does `BR-AM-03` apply to sub-node renames? PRD silent.
- **Uniqueness scope on rename** — same question as Add Node: per-parent, per-account, or global?
- **Audit trail** — does rename log to an audit table? PRD silent; security/audit expectations should be confirmed.

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[PRD_INDEX]] · [[API_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
