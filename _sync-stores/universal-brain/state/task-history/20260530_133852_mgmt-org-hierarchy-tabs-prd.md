# Mgmt Org-Hierarchy tabs → PRD alignment (2026-05-30)

**Outcome:** DONE, build-green, NO commits. Management-console Organization Hierarchy now follows the PRD 4-tab model on the account Main node.

## What & why
User: "follow the PRDs about showing the tabs, for management console." PRD ([PRD] 01-account-management/OVERVIEW.md:27) = Org-Hierarchy menu has 4 tabs; React SoT (new react/admin/hierarchy.jsx:1191-1200) = a client/account node shows all 4, only the synthetic Falcon root shows 2. Mgmt suppresses the Falcon root, so the account Main node (type 'client', mapped by wrapper services.ts:207) IS the tree top — the old isRootSelected() check wrongly gave it the Falcon-root 2-tab layout (admin-semantics leak).

## Edits (management-console only)
1. users-state.signals.ts `visibleTabs`: `this.tree.isRootSelected()` → `node?.type === 'root'`. Mgmt Main node → 4 tabs (Hierarchy + CommChannels & Services + Apps & Services + Settings). PES acc.services.view (acc-owner) still strips CommChannels/Apps for acc-admin. Sub-nodes unchanged (3 tabs; Settings hidden per backend SettingsOnlyAllowedForMainNode). Admin = no-op (root is type 'root').
2. org-hierarchy-page-menu.component.html:239 Add-Sub-Node header button: `!state.isRootSelected()` → `node.type !== 'root'`. Account owner can now add a first sub-node under the Main node (tree-kebab already offered it).

## Verification
nx build management-console → exit 0 ("Successfully ran target build ... and 6 tasks"). Build-verified, NOT runtime-verified.

## Decisions / notes
- KEPT the standalone comm-mgmt + marketplace menus (duplication with the new tabs accepted, per user).
- comm-mkt-view.component.ts:260 TS2339 that briefly broke the build was a CONCURRENT session's half-done DoPayment/gate refactor — they fixed it externally (commMktActionVisible(row,a)); I did NOT touch it. ≥5 concurrent sessions were editing this tree.
- NO COMMITS.
