---
type: cross-cut-matrix
axis-a: non-pes-gate-types (6)
axis-b: features (7)
purpose: "Answers 'what hides/shows UI on feature F BESIDES PES (session-type, node-type, mode, tab-visibility, server-driven rows, composite gates)'. Open before porting any feature admin → mgmt."
extracted: 2026-05-16
source: old-ui-dataset/10-pages/admin-console/<feature>/05-PES.md
---

# Non-PES Gates × Feature — Cross-Cut Matrix

> [!tldr]
> PES is ONE of many gate types. Every "is this UI element visible / clickable" decision can layer up to six gates on top of PES — session-type, node-type, mode, tab-visibility, server-driven rows, and composite gates. A porter who migrates a feature admin→mgmt without re-evaluating these gates ships broken UI. This matrix catalogs all 5 (+ the composite pattern) across the 7 features.

## 1. The 6 non-PES gate types — definitions

### 1.1 Session-type gate
Checks the current user's session `userType` claim directly. Independent of role; based on which **console** the user is in.

```typescript
// hierarchy-tab.component.ts:321-328
const userTypeStr = String(session.userType || '').trim();
return userTypeStr === USER_TYPE_STRINGS.FALCON_USER
    || userTypeStr === USER_TYPE_STRINGS.CLIENT_USER;
```

Source of truth: [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/07-cross-cutting/session-shape.md` — `userType: 'Falcon' | 'Client' | 1 | 2`. Mirrored on Zitadel `urn:zitadel:iam:user:metadata:user-type`.

### 1.2 Node-type gate
Tree-data property check. The selected node carries `isFalconNode` / `isFirstLevelChild` flags from backend; UI gates on these.

```typescript
// node-settings-tab.component.ts:103-134
isRootSelection = computed(() => this.selectedNode()?.data?.isFalconNode === true);
isMainNodeSelection = computed(() => this.selectedNode()?.data?.isFirstLevelChild === true);
```

Used to distinguish: **synthetic Falcon root** (no real account) vs **Main node** (one account) vs **Sub-node** (Nth-level child).

### 1.3 Mode gate
Component-local `mode` enum check. Hides/shows controls based on edit vs view state.

```typescript
// hierarchy-tab.component.ts:328
get canShowEditButton(): boolean {
  return this.mode === HierarchyTabMode.View && this.canShow() && this.canEditAccountProfile;
}
```

Pure UI-state gate; no security.

### 1.4 Tab-visibility gate
Per-tab `enabled` predicate, evaluated at tab-bar render time. Combines node-type + session-type into a single boolean.

```typescript
// tabs-layout.component.ts:91-125
defaultTabsConfig = [
  { id: 'hierarchy',  enabled: true },                       // always-on
  { id: 'settings',   enabled: true },                       // always-on (row-level gating)
  { id: 'comm-channels', enabled: !isFalcon && isMain },     // not Falcon root, IS main node
  { id: 'apps-services', enabled: !isFalcon && isMain },     // not Falcon root, IS main node
];
```

### 1.5 Server-driven row gate
Backend stamps each row with an `allowedActions: FalconRowAction[]` array; UI's row-action `visible` predicate honors this. **Default-deny** if missing.

```typescript
// marketplace-applications.component.ts:1032-1043
visible: (row: AppServiceItem) => {
  if (row.allowedActions !== undefined && row.allowedActions !== null
      && Array.isArray(row.allowedActions)) {
    return row.allowedActions.map(a => a as FalconRowAction).includes(actionEnum);
  }
  return false;
}
```

[INFERRED] The backend computes `allowedActions` per row based on FSM state (e.g. an `Inactive` row can be Enabled but not Disabled; an `Expired` row can be DoPayment-renewed but not Disabled). FSM rules are server-owned.

### 1.6 Composite gate
A getter that AND-combines two or more of the above with a PES flag. Captures business-rule semantics that span multiple axes.

```typescript
// node-settings-tab.component.ts:129-134
get canEditSelectedSettings(): boolean {
  return this.canEditAccountQuota
      && (this.isRootSelection || this.isMainNodeSelection);
}
// "Can edit Quota AND we're on root OR Main (not Sub-node-or-deeper)"
```

[CODE] Quote from [BRAIN-OUT] `old-ui-dataset/.../organization-hierarchy/05-PES.md:112`:
> `canEditSelectedSettings` (129-134) **also requires** the node to be root OR main-node — this prevents editing settings on a 2nd-level-or-deeper sub-node. **This is a business rule embedded as a PES dependency.**

## 2. Master matrix — gate type × feature

✓ = feature uses this gate; — = feature does not.

| Gate type | organization-hierarchy | comms-hub | marketplace-applications | contact-groups | wallet-balance-management | contracts-cost-management | testing-charging |
|---|---|---|---|---|---|---|---|
| **Session-type** (`USER_TYPE_STRINGS.FALCON_USER` / `CLIENT_USER`) | ✓ (3 use-sites) | — | — | ✓ (`identityUserId` ownership) | ✓ (`isFalconUser` Master Wallet click) | — | ✓ (sidebar `requiredUserTypes`) |
| **Node-type** (`isFalconNode`, `isFirstLevelChild`, `isRootSelection`, `isMainNodeSelection`) | ✓ (4 flags) | — | — | — | ✓ (`canSave` server-driven hint) | ✓ (selected-node walletStrategy) | — |
| **Mode** (View/Edit enums) | ✓ (`HierarchyTabMode`) | ✓ (`editMode` per-row) | ✓ (`editMode` per-row) | ✓ (wizard step state) | ✓ (`isSettingsDisabled`) | ✓ (`canEditContractStatus`) | — |
| **Tab-visibility** (`enabled: !isFalcon && isMain`) | ✓ (4 tabs) | — | — | ✓ (`Contact Groups` + `Shared Groups` per BR-CGM-20/21/22) | — | — | — |
| **Server-driven row** (`row.allowedActions[]`) | ✓ (services tabs) | ✓ (every row) | ✓ (every row) | ✓ (`rowFlags()` per-row) | — | — | — |
| **Composite** (PES × node-type × business-rule) | ✓ (`canEditSelectedSettings`, `canShowEditButton`) | — | — | ✓ (`canEdit = isCreator && canEdit`) | ✓ (`isSaveEnabled = canEditWalletStrategy && canSave`) | ✓ (`canEdit && !restrictedFields`) | — |

[INFERRED] **Insights**:
- `organization-hierarchy` uses **all 6 gate types** — the most gate-rich feature in the workspace.
- `testing-charging` uses **the fewest** (1) — internal QA tool with minimal gating beyond app-entry + sidebar visibility.
- `comms-hub` and `marketplace-applications` are mirror images — same 3 gate types (mode + server-row + mode).
- `contact-groups` is the only feature that combines tab-visibility with creator-vs-other ownership composite gate.
- `wallet-balance-management` is the only feature that has a backend-driven scalar `canSave` overlay on PES (the backend can disable Save even with PES allow).

## 3. Per-feature non-PES gate inventory

### 3.1 `organization-hierarchy` — most gate-rich

[CODE] All citations from [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/organization-hierarchy/05-PES.md`.

**Session-type gates (3 use-sites):**
- `hierarchy-tab.component.ts:321-328` — `canShow()` requires `userType === FALCON_USER || CLIENT_USER`. Returns false for unknown user-types. Hides the entire info-view chrome.
- `node-settings-tab.component.ts` — uses `sessionProvider.session` for default-IPs hint behavior [INFERRED from sibling pattern]
- Container — session-type drives Add Client button visibility composition

**Node-type gates (4 flags):**
- `isMainMenu` — "selected node is at depth 1 from root" — `HierarchyTabComponent.canShow():322`
- `isFalconMenu` — "selected node is the synthetic Falcon root" — same site
- `isRootSelection` (`selectedNode?.data?.isFalconNode === true`) — `node-settings-tab.component.ts:103-105`
- `isMainNodeSelection` (`selectedNode?.data?.isFirstLevelChild === true`) — `node-settings-tab.component.ts:106-108`

What they gate:
- Tab-bar — `comm-channels` + `apps-services` enabled only on Main-non-Falcon (`tabs-layout.component.ts:91-125`)
- Info-view Edit button — visible only on Main-non-Falcon in View mode
- Settings — `canEditSelectedSettings` requires root OR Main (not Sub)
- Add Client button — added to `allowedTreeActions` only when PES `canAddAccount` is true (cross-cuts with session-type that limits SA + Product)

**Mode gates:**
- `HierarchyTabMode.View` / `HierarchyTabMode.Edit` — toggles between info display and edit form. Bound via `mode === HierarchyTabMode.View` in `canShowEditButton`.

**Tab-visibility gate:**
- `tabs-layout.component.ts:91-125`:
  ```typescript
  { id: 'comm-channels', enabled: !isFalcon && isMain }
  { id: 'apps-services',  enabled: !isFalcon && isMain }
  ```
- [CODE] Falcon root → both Service tabs hidden. Sub-node-deeper → both Service tabs hidden. Main-non-Falcon → both visible.

**Server-driven row gates:**
- `apps-services-tab.component.ts:724-737` — filters row-menu actions by `row.allowedActions.includes(actionEnum)`. The 4 service-payment PES keys (payment, edit-price-type, edit-price-value, visibility) are **not** read client-side; backend computes per row.
- `comm-channels-services-tab.component.ts:733-748` — same pattern.

**Composite gates:**
- `canShowEditButton` (`hierarchy-tab.component.ts:328`) — `mode === View && canShow() && canEditAccountProfile`. PES × mode × session-type × node-type.
- `canEditSelectedSettings` (`node-settings-tab.component.ts:129-134`) — `canEditAccountQuota && (isRootSelection || isMainNodeSelection)`. PES × node-type × business-rule.

### 3.2 `comms-hub` — server-row first

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../comms-hub/05-PES.md`:

**Mode gates:**
- Per-row inline edit — `editMode` state per row. `canEditDetail(detailItem)` (`comms-hub.component.ts:871-875`) gates pen/trash icons on each pending-change row.
- Inline templates check `[disabled]="!canEditPriceType" / "!canEditPriceValue"` — guarded at save time too.

**Server-driven row gates:**
- `comms-hub.component.ts:1061-1073`:
  ```typescript
  visible: (row: CommChannelServiceItem) => {
    if (row.allowedActions !== undefined && Array.isArray(row.allowedActions)) {
      return row.allowedActions.map(a => a as FalconRowAction).includes(actionEnum);
    }
    return false;
  }
  ```
- Service-level alias: `CommsHubService.getList` aliases backend `availableActions` → frontend `allowedActions` (`comms-hub.service.ts:46-49`).
- Default-deny when missing.
- Note: per-row `canHide?: boolean` is a separate eligibility signal that disables visibility toggle independently of PES (`comms-hub.component.ts:867-869`).

**No session-type, node-type, or tab-visibility gates.** Page is flat — every row evaluated independently.

### 3.3 `marketplace-applications` — server-row + double-gate

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../marketplace-applications/05-PES.md`:

**Mode gates:**
- Inline edit `editMode` — same pattern as comms-hub. `onSaveEdit` early-returns at lines 706, 775.

**Server-driven row gates:**
- `marketplace-applications.component.ts:1032-1043` — identical pattern to comms-hub.
- **The "double-gate" pattern** ([CODE] quote from 05-PES.md):
  > A row menu action is included **only if** (a) the PES flag passed AND (b) the backend included that action in `row.allowedActions`. If the backend omits `allowedActions` for a row, that row gets **no menu entries**.

**No session-type, node-type, tab-visibility, or composite gates** [verified — no `USER_TYPE_STRINGS` references in `marketplace-applications.component.ts`].

### 3.4 `contact-groups` — creator-vs-other composite

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../contact-groups/05-PES.md`:

**Session-type gate (identityUserId ownership):**
- `models.ts:42-45` (banner comment): "NEVER compare with `session.subjectId` (Zitadel id space)."
- Ownership decision:
  ```typescript
  const isOwner = !!session?.identityUserId
    && session.identityUserId === row.createdByUserId;
  ```
- Note: this uses **`identityUserId`** (Mongo `_id` mirror) not `subjectId` (Zitadel `sub`). [BRAIN-OUT] cross-references `feedback_frontend_auth_identity_service.md`. The PES `subjectId` is a different concept (Zitadel-namespaced).

**Tab-visibility gates:**
- `Contact Groups` tab — always shown
- `Shared Groups` tab — gated on `canViewSharedGroups` (PES `viewShared`) + BR-CGM-21 (only Normal Users on own node see this tab in mgmt). Admin-console batches the flag but never shows the tab for sys-* users by BR-CGM-13.

**Server-driven row gates (rowFlags):**
- `contact-groups.component.ts:301-303`:
  ```typescript
  rowFlagsFor(row: ContactGroupTableRowVm): RowActionFlags {
    return rowFlags(row, this.sessionProvider.session, this.permissions());
  }
  ```
- Predicates: `canEditRow`, `canShareRow`, `canDeleteRow` on the row-menu actions.
- These predicates combine: (1) tenant PES flag, (2) per-row `createdByUserId` ownership check, (3) per-row creator-flag.

**Composite gate (creator-only):**
- `contact-group-details.component.ts:166-169`:
  ```typescript
  get canEdit(): boolean {
    // Creator-only for Edit — BE also enforces; tenant flag alone is insufficient.
    return this.detail?.isCreator === true && this.permissions().canEdit;
  }
  ```
- **PES × ownership-from-backend** — both must pass.

**Mode gate:** wizard step state (Step 1..5 with conditional Step 5 — Share is optional).

### 3.5 `wallet-balance-management` — server-side `canSave` overlay

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../wallet-balance-management/05-PES.md`:

**Session-type gate (`isFalconUser`):**
- `wallet-balance-management.component.ts:479-482`:
  ```typescript
  onMasterWalletTransferClick() {
    if (!this.isFalconUser || !this.canTransferWallet) return;
    // ...
  }
  ```
- `isFalconUser = sessionProvider.session?.userType === USER_TYPE_STRINGS.FALCON_USER`
- **Client users cannot trigger Master Wallet transfer entry-point even if they hold `wallet.transfer` PES** — explicit comment in 05-PES.md:77.

**Node-type gate (implicit via `canSave`):**
- Server-driven scalar `IWalletDataResponse.canSave: boolean` ([CODE] `wallet-balance.models.ts:206`) — backend can disable Save even with PES allow. Likely fires when the selected node is the Falcon root or another non-editable scope.

**Mode gate (`isSettingsDisabled`):**
- `isSettingsDisabled = !canEditWalletStrategy || !canSave`
- Bound on inputs: `[disabled]="isSettingsDisabled"` ([CODE] `:250, :271, :292`)

**Composite gate (`isSaveEnabled`):**
- `isSaveEnabled = canEditWalletStrategy && canSave`
- **PES × server-driven** — both must pass.
- `saveChanges()` early-returns on miss ([CODE] container `:434-437`).

**No tab-visibility, no server-driven row, no node-type explicit gate** (the `canSave` flag implicitly carries node-type semantics from the backend's perspective).

### 3.6 `contracts-cost-management` — status-state composite

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../contracts-cost-management/05-PES.md`:

**Status-based mode gate:**
- `canEditContractStatus(status)` (`models.ts:579-581`) — returns true for `pending | active | expired`.
- `hasRestrictedContractCommercialFields(status)` (`models.ts:583-585`) — returns true for `active | expired`.
- These drive read-only-style classes + per-field edit gates per BR-CC-15/16.

**Server-side `canEdit` master:**
- `currentContract.canEdit` from backend. When false, the in-view Edit button is hidden.

**Eligibility soft-gate (`walletStrategy === null`):**
- When the selected node has no `walletStrategy` → Add Contract button disabled + warning banner (template `:80-84`).
- `onAddContract()` returns early if `!isWalletStrategyConfigured` (`:103-109`).
- Business key: `contractsCostManagement.walletStrategyRequired`.

**Composite gate (visible + backend + status):**
- `canEdit && !hasRestrictedFields(status) && PES` — three-way AND for per-field edit.

**No session-type, no PES queries** ([CODE] 05-PES.md says "Permission keys used (in this feature): **None.**"). The feature relies entirely on:
1. Parent `adminConsoleGuard` (app-level)
2. UI button-hiding via backend-driven `canEdit`
3. Status-based field-level locks
4. `walletStrategy === null` soft-gate

This is a **PES gap** — flagged as a recommendation in the 05-PES.md "Recommendation for new theme" section: add `FalconAccess.adminConsole.contracts.view/create/edit` keys.

### 3.7 `testing-charging` — minimal gating

[CODE] From [BRAIN-OUT] `old-ui-dataset/.../testing-charging/05-PES.md`:

**Session-type gate (sidebar):**
- `host-shell/src/app/layout/layout.component.ts:397-405`:
  ```typescript
  {
    label: 'Testing Charging Lab',
    requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
    hidden: userType === USER_TYPE_STRINGS.CLIENT_USER
  }
  ```
- Sidebar link visible only to FALCON_USER. URL-hack to `/admin-console/testing/charging` is denied by parent `adminConsoleGuard` (client users lack `app.admin-console / view`).

**Eligibility filter (`walletStrategyConfigured`):**
- `testing-charging.component.ts:133-135`:
  ```typescript
  get walletStrategyAccounts(): TestingChargingAccount[] {
    return this.accounts.filter(a => a.walletStrategyConfigured);
  }
  ```
- Business-state filter — hides accounts without wallet strategy from left-column list. **Not a PBAC check.**

**Implicit feature flags:**
- Backend `TestingCharging` enable/disable at system-gateway AND charging service level — surfaced via error messages ([CODE] component lines 129, 239, 258).
- No frontend toggle; backend signals via failed API.

**No node-type, no tab-visibility, no server-driven row, no composite, no in-feature PES.** The feature relies on parent-route guard + sidebar filter + backend feature flag.

## 4. The "composite gate" pattern — `canEditSelectedSettings`

The canonical 3-way composite from `organization-hierarchy` ([CODE] `node-settings-tab.component.ts:129-134`):

```typescript
get canEditSelectedSettings(): boolean {
  return this.canEditAccountQuota                                  // (1) PES flag
      && (this.isRootSelection || this.isMainNodeSelection);       // (2) node-type
}
```

Implicit (3): the `if (!this.canEditSelectedSettings && this.isEditingSettings)` reset in `ensureAccess()` ([CODE] :340-344) — flips the component back to view mode if the user loses permission after entering edit. This is **per-node-change re-evaluation** — the only place in the codebase that re-runs PES on node change.

### Three layers all required

| Layer | What it carries | Failure |
|---|---|---|
| **PES** (`canEditAccountQuota`) | Role × action | Silent — feature unavailable |
| **Node-type** (`isRootSelection || isMainNodeSelection`) | BR-AM rule that Settings only edits at root/Main | Silent — Sub-node selected, Settings still visible but inputs disabled |
| **Mode flip-back** | UX consistency on permission change | Without this, user could land in Edit mode after losing PES |

### Why composite gates matter for porting

[INFERRED] When a feature is copied admin→mgmt, **the composite gate's component pieces may have different semantics in the destination console**:
- PES flag namespace flips `FalconAccess.adminConsole.*` → `FalconAccess.managementConsole.*`
- Node-type flags may need re-evaluation (no synthetic Falcon root in mgmt)
- Mode-flip-back must still re-run

If the copy is mechanical (just rename namespaces) without re-thinking the composite, the destination console may either over-restrict (no path to Edit) or over-permit (Edit on a Sub-node where the rule says no).

## 5. Server-driven row visibility — `row.allowedActions`

The most aggressive non-PES gate. Used in `comms-hub`, `marketplace-applications`, `contact-groups` (via `rowFlags`), and `organization-hierarchy` (apps-services + comm-channels tabs).

### Pattern

```typescript
visible: (row) => {
  if (row.allowedActions !== undefined && row.allowedActions !== null
      && Array.isArray(row.allowedActions)) {
    return row.allowedActions.map(a => a as FalconRowAction).includes(actionEnum);
  }
  return false;  // DEFAULT-DENY when missing
}
```

### What the backend computes

[INFERRED] The backend evaluates **per row**:
1. **FSM state** — current status enum (e.g. `eCommChannelStatus = Active`) — only transitions allowed by FSM rules appear in `allowedActions`.
2. **PES** — the user's role on this resource.
3. **Eligibility** — feature flags, subscription state, contract state.

The result is an array of action codes. The frontend trusts this list verbatim.

### Why this matters

[CODE] Quote from `organization-hierarchy/05-PES.md:19`:
> The 4 service-payment keys (#11-13) are listed in the registry for completeness, but this feature only enforces them **indirectly** via `row.allowedActions`. The backend computes them per row and embeds the result in the response. **New UI must preserve this contract** — do not start gating service actions client-side on the new theme.

This is a hard architectural rule:
- **DO**: trust `row.allowedActions` from backend.
- **DON'T**: re-implement the FSM client-side. The backend is the source of truth.

### Cited in this matrix

| Feature | File:line | Action source |
|---|---|---|
| `comms-hub` | `comms-hub.component.ts:1061-1073` | Backend `availableActions` aliased to `allowedActions` in service:46-49 |
| `marketplace-applications` | `marketplace-applications.component.ts:1032-1043` | Same pattern; double-gate with PES flag |
| `organization-hierarchy` apps-services | `apps-services-tab.component.ts:724-737` | Backend `row.allowedActions` |
| `organization-hierarchy` comm-channels | `comm-channels-services-tab.component.ts:733-748` | Same |
| `contact-groups` | `rowFlags()` at `contact-groups.component.ts:301-303` + `models.ts:55-57` | Combines tenant PES + per-row `createdByUserId` ownership |

## 6. Why this matters for porting admin → mgmt

[INFERRED] Mechanical copy of a feature from `apps/admin-console/.../<feature>/` to `apps/management-console/.../<feature>/` requires re-evaluating every non-PES gate:

### 6.1 Session-type gates flip
- Admin: `session.userType === FALCON_USER` is **always true** (sys-* users).
- Mgmt: `session.userType === CLIENT_USER` is **always true** (acc-* users).
- A check `if (!isFalconUser) return;` is a no-op on admin and a blanket-deny on mgmt.
- **Fix**: drop the check, or flip the literal to `CLIENT_USER`, or replace with PES.

### 6.2 Node-type gates may not exist on mgmt
- Mgmt does **not** have a synthetic Falcon root (mgmt tree starts at the tenant's Main node).
- `isFalconNode === true` is never true on mgmt.
- A check `if (isFalconNode) return early` is dead code on mgmt; a check `if (!isFalconNode) showThing()` is always true.
- **Fix**: replace with a node-depth or role check; or remove if the rule was Falcon-only by design.

### 6.3 Tab-visibility gates need different conditions
- `enabled: !isFalcon && isMain` collapses to `enabled: isMain` on mgmt (no synthetic Falcon root). Semantics shift: tabs that were hidden only on the synthetic root are now hidden on... nothing.
- **Fix**: re-derive from the BR rule. If the rule is "tab visible on Main node", say `enabled: isMain`.

### 6.4 Server-driven row gates SHOULD work as-is
[INFERRED] The backend computes `row.allowedActions` based on PES + FSM + eligibility — all of which are session-aware. So the same endpoint called from mgmt-console returns mgmt-appropriate actions. **No frontend change needed** if the endpoint correctly propagates session context. Verify by checking that gateway forwards JWT downstream.

### 6.5 Composite gates need re-derivation
- If composite is `PES × node-type`, and node-type semantics shifted (per 6.2), the composite must be re-derived from the BR rule, not literally copied.
- **Fix**: re-read the BR-* rule, re-express the composite from scratch in mgmt's terms.

### 6.6 Eligibility soft-gates (`walletStrategy === null`)
Same on both consoles — backend-driven. Should work as-is.

## 7. Drift watch — when this matrix needs refresh

- Any feature adds a new `if (session.userType...)` check → re-evaluate session-type column.
- Any new `tree-data.<flag>` boolean added to tree-node DTOs → potential new node-type gate.
- Any new tab added to a `TabsLayoutComponent.defaultTabsConfig` → re-evaluate tab-visibility column.
- Backend adds a new `allowedActions` enum value → expand server-driven row section.
- Any composite getter `canX(): boolean` added to a component → audit for new composite gate.

## 8. See also

- [[../04-feature-parity-matrix/MATRIX]] — the 7 features (axis-b source)
- [[../05-capability-maps/_INDEX]] — per-role × action tables
- [[../07-cross-cutting/session-shape]] — `userType` claim source-of-truth
- [[../09-business-rules-by-feature/MATRIX]] — the OTHER cross-cut matrix (BR-* axis)
- [[../00-VERIFICATION-GATE]] — 10 questions the dataset must answer

## 9. Source citations

- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/organization-hierarchy/05-PES.md` (4 node-type flags, composite gates, tab-visibility)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/comms-hub/05-PES.md` (server-row pattern)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/marketplace-applications/05-PES.md` (double-gate pattern)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/contact-groups/05-PES.md` (creator-vs-other composite + rowFlags)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/wallet-balance-management/05-PES.md` (canSave overlay)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/contracts-cost-management/05-PES.md` (status-state composite + walletStrategy soft-gate)
- [BRAIN-OUT] `old-ui-dataset/10-pages/admin-console/testing-charging/05-PES.md` (sidebar filter + eligibility)
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/07-cross-cutting/session-shape.md` (userType claim)
- [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121` (services PES keys)
- [CODE] `apps/admin-console/.../tabs-layout.component.ts:91-125` (tab-visibility config)
