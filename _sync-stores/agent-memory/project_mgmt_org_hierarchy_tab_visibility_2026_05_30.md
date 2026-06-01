---
name: project_mgmt_org_hierarchy_tab_visibility_2026_05_30
description: Mgmt-console Organization Hierarchy node-tab visibility rules (root/Main vs sub-node) by role — code-verified investigation + the one design-fork to confirm
metadata: 
  node_type: memory
  type: project
  originSessionId: c6a00b5a-2d1c-43fd-b7a9-afeb738574f0
---

Investigation 2026-05-30 → then FIX (build-green, NO commits). User asked: for the mgmt Org-Hierarchy page, what tabs should the root node show (Settings or not?) and do child nodes show channels+apps+settings — does impl match PRD. User then directed: "follow the PRD about showing the tabs, for management console" → IMPLEMENTED the PRD 4-tab model on the account Main node.

**IMPLEMENTED 2026-05-30 (build GREEN `nx build management-console`, NO commits):**
1. `users-state.signals.ts` `visibleTabs`: `this.tree.isRootSelected()` → `node?.type === 'root'`. Effect: mgmt account Main node (type 'client', = tree top) now falls into the 4-tab branch → **Hierarchy + CommChannels & Services + Apps & Services + Settings** (PES `acc.services.view` still strips CommChannels/Apps for acc-admin → it sees Hierarchy+Settings). Sub-nodes unchanged (3 tabs / Settings stays hidden per backend). Admin = behavioural no-op (its root is type 'root').
2. `org-hierarchy-page-menu.component.html:239` Add-Node header button: `!state.isRootSelected()` → `node.type !== 'root'` so the account owner can add a FIRST sub-node under their Main node (was wrongly hidden). Tree-kebab already offered it (wrapper rootActions client mode includes addNode). 
Grounding: [PRD] OVERVIEW.md:27 (Org-Hier menu=4 tabs) + [SoT] React `new react/admin/hierarchy.jsx:1191-1200` (client node=4 tabs; only Falcon root=2) + wrapper services.ts:207 (mgmt Main node=type'client'). Build-verified ONLY (NOT runtime).
3. (refinement, build-green) `visibleTabs` Falcon-root branch `['hierarchy','settings']`→`['hierarchy']`: mgmt never ported Falcon-root settings (settings-tab.signals.ts:142-148 errors `onlyMainNode` for isFalconRootId) so a Settings tab on the Falcon root would render only an error; the Falcon root appears in mgmt ONLY if a Falcon/sysadmin lands in the client console. **Falcon-root Settings = ADMIN yes / MGMT no.** ADMIN keeps it (real platform Password-Security + Allowed-IPs via root* PES keys + Falcon-self ownerId=null path; PRD permission sheet WORKFLOWS.md:85 "Edit Password Security Level on Root/Main" + SoT hierarchy.jsx:1191-1200 + BIZ-014 — so the user's "hide it" intuition is correct for mgmt but NOT for admin).
Decisions taken: KEEP standalone comm-mgmt+marketplace menus (duplication accepted, NOT removed). comm-mkt-view.component.ts:260 build-break (TS2339 a.rowAction) was a CONCURRENT session's half-done refactor — they fixed it (→ commMktActionVisible(row,a)) externally mid-task; I did NOT touch it. Active concurrent editing churned the tree (comm-mkt-view + this HTML changed under me).

**Page route** `/#/management-console/organization-hierarchy` · access `FalconAccess.managementConsole.accountHierarchy.view()` via shellAccessGuard → **acc-owner ✅ / acc-admin ✅ / acc-user ❌ /401** [CODE] org-hierarchy-page.routes.ts:32-37 + app.routes.ts:42.

**THE tab-visibility logic** [CODE] management-console/.../services/state/users-state.signals.ts:127-140 (`visibleTabs` computed). Ternary checks `isRootSelected()` FIRST:
- root selected → `['hierarchy','settings']`
- `type==='sub-node'` → `['hierarchy','commChannels','apps']`
- else (client/Main) → all 4
- then PES `canViewServices` (=`acc.services.view`, acc-owner ONLY; acc-admin explicit-deny ✋VERIFICATION-STATUS:65) strips commChannels+apps if denied.

**Mgmt nuance**: synthetic Falcon root is SUPPRESSED in client mode, so the account's Main node (type `'client'`) IS the tree root → `isRootSelected()` TRUE → it short-circuits to **Hierarchy + Settings only**. Sub-nodes (type `'sub-node'`) → Hierarchy + CommChannels + Apps (acc-owner) / Hierarchy-only (acc-admin). Settings HIDDEN on sub-nodes (backend `SettingsOnlyAllowedForMainNode` [CODE comment] UpdateSettingsHandler.cs:53-54; settings slice fail-fasts "onlyMainNode" settings-tab.signals.ts:124-148).

**Settings body** by node type (`hasQuota` settings-tab.signals.ts:81-91): root(synthetic Falcon)→no Account-Limitations (BIZ-014); sub-node→hidden; **client Main→full (Password Security + Allowed IPs + Account Limitations)**.

**Why Main node has NO inline CommChannels/Apps = INTENTIONAL, not a bug**: mgmt exposes them as SEPARATE acc-owner-only top-level menus — `comm-mgmt`(comms-hub) + `marketplace` [CODE] app.routes.ts:17-21 — which target `session.nodeId` = the Main node (no tree picker) [CODE] comms-hub.service.ts:49-51. So Main-node services live in dedicated menus; sub-node services live inline in org-hierarchy. Clean split, no duplication.

**Admin contrast**: admin `visibleTabs` is IDENTICAL ternary minus the PES filter [CODE] admin-console/.../users-state.signals.ts:107-116; there the Falcon synthetic root IS the tree root (→2 tabs) and the client Main node is level-1 (NOT tree root) so it gets ALL 4 tabs inline. React SoT screenshots confirm admin client = 4 tabs (`Organization Hierarchy - Clients - {CommChannels & Services|Apps & Services|Settings}.jpg`).

**FORK RESOLVED 2026-05-30**: user chose the PRD 4-tab model (above). Originally flagged: no dedicated org-hierarchy PRD (GAP-SOT-001); account-mgmt PRD lists all 4 tabs under the Org-Hierarchy menu [PRD] 01-account-management/OVERVIEW.md:27 without specifying the mgmt menu-split. The old "Main node shows only Hierarchy+Settings" was the admin-semantics leak — now fixed. LOW-sev code-clarity: `visibleTabs` still keys on `isRootSelected()` (admin semantics) while the Info-button fix already switched to `type==='client'` and called `!isRootSelected` "admin semantics" (org-hierarchy-page-menu.component.html:137-139) — works by accident in mgmt because Main node = tree root.

**Validations** (xlsx-sourced, code-verified): node name=`nodeNameValidator` (letters+digits+space+&+'+- , 2–30 chars, =accountName, BUG-08) [CODE] falcon-org-node-drawer/validations.ts:22-24; Settings 5 fields = Add-Client Step 2 (passwordSecurityLevel/allowedIpList/userLimit×2/maxNodeLevels(999); Balance-Transfer-% deferred, preserved on PUT; 0=no-limit BR-AM-11) [CODE] settings-tab/validations.ts:51-79; Add-User Step1 = personName×2/userName(+async uniq)/nationalId/phone/email [CODE] user-personal-step/validations.ts:61-71. Brain [BRAIN-OUT] organization-hierarchy/VALIDATION_RULES.md is STALE (2026-05-14, says "not wired") — code superseded it.

Related: [[project_mgmt_console_authority_pes_2026_05_29]] (P2.3 canViewServices gate), [[project_commchannels_marketplace_parity_2026_05_29]] (comms-hub/marketplace node-id 500 fix). NOT runtime-verified this session (code+brain only).
