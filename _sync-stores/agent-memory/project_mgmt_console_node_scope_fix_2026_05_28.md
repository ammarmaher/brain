---
name: mgmt-console-node-scope-fix-2026-05-28
description: Mgmt-console API node-scoping fix — replace tenant-root scope with selected-node/token-nodeId on the org-hierarchy tree load + contact-groups list, mirroring origin/main's node-admin-hierarchy-scope branch. Build-green, NOT runtime-verified.
metadata:
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-28
  status: build-green
  originSessionId: 5765fd0b-7ece-42b3-ba8b-b4490986863b
---

# Mgmt-console node-scope fix (tree + contact-groups) — 2026-05-28 🟢 BUILD-GREEN

User ask: in management console, when calling any API do NOT send the root/Falcon-root node id — send the **selected node id** or the **node id from the token**. Deep-dive + verify against main + fix all related APIs. NO COMMITS.

## Token/session contract (the foundation — non-obvious)
- `session.tenantId` = tenant **root account id** (JWT `tenant_id`/`tenantId` or zitadel meta `tenant-id`) — [CODE] `libs/falcon/src/core/lib/services/session-provider.service.ts:101-103`. THIS is the "root" the user wants to stop sending.
- `session.nodeId` = **the node id from the token** (zitadel metadata `node-id`, base64) — [CODE] `session-provider.service.ts:122`. The port used this NOWHERE before this fix.
- `sessionProvider.node` (`OrgHierarchyNode`, set via `setNode()`, persisted `falcon_org_node`) = **the selected node** — [CODE] `session-provider.service.ts:57-71`.
- Canonical resolution = `sessionProvider.node?.id ?? session.nodeId`, guarded `!== FALCON_ROOT_NODE.id` (`libs/falcon/.../globals.ts:199`).

## Canonical reference (what main does)
- **origin/main has its OWN mgmt-console** under `apps/management-console/src/app/features/account-administration/organization-hierarchy/` (PrimeNG-based) — STRUCTURALLY DIVERGENT from the polishing-v0.4 **port** (`features/org-hierarchy-page/`, Falcon-UI-Core). Same feature names for comms-hub/marketplace/wallet/contracts/contact-groups, different org-hierarchy.
- Reference branch: **`origin/bug/management-console-node-admin-hierarchy-scope`** (1 commit `a1946670` "scope hierarchy tree to user's node + eliminate duplicate /Node call"). Pattern: selected node (used directly) → `session.nodeId` (fetched via `getRootNodes(nodeId)`) → guard `nodeId !== FALCON_ROOT_NODE.id`. Touches organization-hierarchy + org-hierarchy.api.service + contact-groups + wallet (tree-root load only).
- origin/main DELIBERATELY keeps account scope as `tenantId || client_id` for wallet (`wallet...component.ts:405-408`), service-pricing (comms-hub/marketplace `...606`/`...603`), contracts. Share-user picker (`getShareableUsers`) is account-scoped (no NodeId).

## Scope decision (user-confirmed via AskUserQuestion)
**Tree + contact-groups ONLY** (match main). Target = **current polishing-v0.4 port**. Wallet/service-pricing/contracts account scope LEFT as `tenantId||client_id` on purpose (changing wallet risks funding the wrong account).

## Files changed (4 edits, 3 files)
1. ⭐ [CODE] `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/services/services.ts` `getTree()` — the AUTHORITATIVE tree load (shared by admin+mgmt). Was sending NO NodeId. Now: for `!isFalconUser()` send `NodeId = node?.id ?? session.nodeId` (guard `!== FALCON_ROOT_NODE.id`). Falcon/admin unchanged (isFalconUser guard). `getChildren()` already guarded.
2. [CODE] `apps/management-console/.../contact-groups/services/contact-group-api.service.ts` — added `nodeId?` to `ListContactGroupsParams`; set `NodeId` (PascalCase) in `listAtMine` + `listAtShared` (matches origin/main `buildListParams`/`getSharedGroups`).
3. [CODE] `apps/management-console/.../contact-groups/contact-groups-list/contact-groups-list.component.ts` `loadCurrentTab()` — passes `nodeId = session.node?.id ?? session.session?.nodeId`.
4. [CODE] `apps/management-console/.../org-hierarchy-page/services/services.ts` `getTree()` — DEAD shim (no callers; only the wrapper's getTree is live) but aligned to the same node-scoping for hygiene (injected SessionProvider + FALCON_ROOT_NODE).

## Already-correct (Category 2, verified, NO change)
`loadNodeChildren`/`getUsers` (services.ts send NodeId+PathPrefix), `information.service.ts` (NodeId=selected), `settings.service.ts` (ownerId=selected), wrapper `getChildren`, add-user `createUser` (selected node's nodeId/tenantId/path).

## Verification
- 🟢 BUILD-GREEN: `nx run-many -t build -p management-console host-shell admin-console --skip-nx-cache` → exit 0, "Successfully ran target build for 3 projects" (admin-console hash `449f62f31ed15e48`). Shared-wrapper change did NOT break admin-console.
- 🔴 NOT runtime-verified. **KEY OPEN RISK**: backend contract for `GET commerce/Node?NodeId=X` — does it return [X as root] (what getTree/origin/main assume) or [children of X] (what the port's `getChildren`/`loadNodeChildren` assume)? Same URL+param used both ways = unresolved tension. If it returns children, getTree would root the tree at the first child. Mirrors origin/main's assumption so likely OK, but MUST confirm with a node-admin test user against live Docker before trusting. No node-admin in the canonical 3 acc-* users; need a sub-node admin (see brand users in `project_seed_test_users_state_2026_05_28`).
- NO COMMITS (per `C:\Falcon\.claude\CLAUDE.md`).

## Update 2 (same session) — FALCON_ROOT_NODE leak guard (runtime smoking gun)

User showed DevTools: a **sysadmin (Falcon user) in the mgmt console** fired `commerce/Setting?ownerId=FALCON_ROOT_NODE` (500), `identity/user?...&NodeId=FALCON_ROOT_NODE&Role=4,5,6` (400), `commerce/Node` (500). Cause: the shared tree wrapper `toRoot()` returns the synthetic `FALCON_ROOT_NODE` for any Falcon user ([CODE] `organization-hierarchy-tree/services/services.ts:128`), and the **port had DROPPED the `!== FALCON_ROOT_NODE.id` guards** that admin + origin/main keep — so the literal id (not a Mongo ObjectId) reached the backend → 400/500.

**Best-practice fix (user-approved): shared `@falcon` helper + guard everywhere + skip-reads-for-root.**
- NEW helper [CODE] `libs/falcon/src/shared-utils/lib/utils/node-scope.util.ts` (exported via `@falcon`): `isRealNodeId(id)` (`!!id && id !== FALCON_ROOT_NODE.id`), `appendNodeId(params, id, key='NodeId')` (sets only for a real id — single source of truth), `isFalconRootId(id)`.
- Guarded 7 leak sites via `appendNodeId`: mgmt `services.ts` getTree/loadNodeChildren/getUsers; mgmt + admin `settings.service.ts` (ownerId) + `information.service.ts`; host-shell `core/user/user-api.service.ts` listByNode. Refactored prior inline guards (wrapper getTree/getChildren, contact-groups list) to the helper.
- Skip node-scoped reads for synthetic root (caller level, mgmt): `users-state.signals.ts` `if(!id)`→`if(!isRealNodeId(id))`; `settings-tab.signals.ts reloadFor` early-return for `!isRealNodeId(node?.id ?? nodeId)`. Info-panel needed NO change — already gated on `node?.type === 'client'`.

**Console divergence (verified vs main — key insight):** admin's SystemGateway supports a null-owner Falcon-self lookup, so admin sends `ownerId = isFalconRoot ? null : id` (admin `settings-tab.signals.ts:157`) + SYSTEM roles & no NodeId for root (`services.ts:188-196`) — kept. mgmt's CoreGateway 400s on the no-owner call, so mgmt **skips** the read instead. admin's 2 remaining inline `set('NodeId')` (services.ts:141/196) are guarded (no leak) + load-bearing for roles — left intact.

**Status:** 🟢 BUILD-GREEN — `nx run-many` exit 0 twice (after Steps 1-2 and Step 3). 🔴 NOT runtime-verified — needs a **Falcon/sysadmin session in the browser** to confirm ZERO `FALCON_ROOT_NODE` in any request (the 3 acc-* users won't reproduce). NO COMMITS; new helper + mgmt files UNTRACKED (port) — `git add` on commit.

## Update 3 (same session) — mgmt org-tree must mount in `mode="client"`

Mgmt's `org-hierarchy-page-menu.component.html` mounted the shared `<app-organization-hierarchy-tree>` with **`mode="falcon-full"`** — wrong: that renders the synthetic Falcon root chrome, the "Falcon Clients" label, AND an invalid "Add Client" root action (mgmt has no Add Client). Fix = `mode="client"`. The shared wrapper's mode→skeleton mapping ([CODE] `organization-hierarchy-tree.component.ts`): `skeletonMode = mode==='client' ? 'client':'falcon'` (241); `effectiveClientsLabelKey = mode==='client' ? '' : key` (248, suppresses the Falcon label); `skeletonShowSubNodes = mode!=='falcon-clients'` (children shown); `rootActions` client set = Add User/Add Node/Edit Node, no Add Client (260-270). Net: renders the token-scoped selected node (own node) as root WITH its real `url` image (instead of the Falcon `buildings` icon) + children, all Tailwind (`falcon-tree-panel`). `[selectedIdInput]`/`[refreshTick]`/`[refreshPath]` were already bound; `getTree()` already token-scoped (Update 1). Also removed the now-dead `clientsLabelKey` binding. Build green (mgmt hash `4aa581ec80606630`). **RULE: any Client-console mount of `<app-organization-hierarchy-tree>` uses `mode="client"`; `falcon-full`/`falcon-clients` are admin-only.**

## Update 4 (same session) — getTree uses seeded node directly + seed fix + 🟢 LIVE E2E PASS

**FE refinement:** wrapper `getTree()` ([CODE] `organization-hierarchy-tree/services/services.ts`) now mirrors origin/main `loadRoot()` EXACTLY for Client users: uses `sessionProvider.node` DIRECTLY as the root (`of(orgNodeToFetchNode(localNode))`) — the node seeded into the session at login by `AuthService.fetchOrganizationNode → NodeService.getNode → setNode` — then fetches its children via `getChildren(root.id)`. Falls back to a `session.nodeId`-scoped fetch only when no session node. Fixes a latent bug: the prior version RE-fetched `commerce/Node?NodeId=node.id` and `toRoot(rows[0])` — but that endpoint returns the node's CHILDREN (getChildren contract), so it rooted the tree at the first CHILD. New `orgNodeToFetchNode` helper + `isRealNodeId`/`OrgHierarchyNode` imports. 3 consoles build-green.

**Root cause of "node id not taken" = SEED gap (not FE):** `NodeService.getNode()` is `GET commerce/Node` (no NodeId) == origin/main (no divergence). The real gaps were in the seed (`C:\Falcon\Falcon\Falcon\falcon-essentials\` — TRIPLE Falcon): (1) `set_zitadel_metadata` in `seed-test-users.sh` + `seed-toyota-users.sh` NEVER wrote `node-id` metadata → `session.nodeId` null for every user; (2) `test-tenant-001` (a NON-ObjectId tenant id) had NO commerce Main node at all → `getNode()` empty → `sessionProvider.node` null. Fixed by ammar-essentials (see [[project_seed_node_id_metadata_fix_2026_05_28]]): added `node-id` metadata = the user's commerce Main node `_id` (looked up live; Client-only — Commerce `SessionProvider` THROWS if a Falcon user carries node-id), seeded `ensureTestTenantNode()` (`_id=000000000000000000a11001`), then ENRICHED it with a PNG image (`accountDetails.profilePictureUrl` bytes → backend serves `data:image/png;base64`) + a child hierarchy (a11002–a11009: Human Resources, Digital Banking, Contact Center[+Inbound/Outbound/Customer Care], Marketing, IT & Cybersecurity).

**🟢 LIVE E2E PASS (ammar-qa-web, browser, accowner/Admin@1234):** logged in as CLIENT → mgmt org tree renders the IMAGE (real decoded `<img data:image/png;base64>`) + NAME ("Test Tenant 001") + 5 CHILDREN; expand Contact Center lazy-loads 3 grandchildren via `GET commerce/Node?NodeId=…a11004`. ZERO console errors, ZERO `FALCON_ROOT_NODE` in any request, all calls scoped to `a11001`/`a11004`, no synthetic Falcon node/label. Also resolved prior **B-12 RED** (`:7038/commerce/Node` 500 → now 200 with enriched data). Evidence: `C:/falcon/qa/runs/2026-05-28-hierarchy-accowner-image-children/`. CAVEAT: Chrome MCP `captureScreenshot` timed out on the heavy authenticated MFE (CDP/compositor env limit) — verification was via live DOM/accessibility-tree + network + console reads (robust), screenshot is a DOM-faithful render. KEY OPS NOTE: re-seed order = `seed-service-scenarios.js` BEFORE the user seeds (Main node must exist for the node-id lookup); run mongosh from PowerShell (Git-Bash rewrites `/tmp` paths — or `MSYS_NO_PATHCONV=1`).

**Still open (separate gap, flagged to user):** all seeded users sit at the tenant ROOT (no sub-node admins), so the node-admin SUBTREE-scoping path can't be exercised E2E until a sub-node + sub-node-admin user is seeded. NO COMMITS this session.

## Related
- [[project_seed_node_id_metadata_fix_2026_05_28]] (the seed node-id + test-tenant-001 node + enrichment — by ammar-essentials)
- [[project_wave_2_org_hierarchy_port_to_mgmt_2026_05_27]] (the port that dropped FALCON_ROOT_NODE → introduced tenantId-everywhere)
- [[project_admin_to_mgmt_contract_reconciliation_2026_05_28]] (the tenantId||client_id dynamic-value contract this fix narrows)
- [[project_seed_test_users_state_2026_05_28]] (brand sub-node users for node-admin runtime test)
