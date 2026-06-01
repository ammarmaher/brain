---
name: Org-hierarchy users list — PathPrefix subtree fix
description: GET /user NodeId is exact-match; use PathPrefix for the node's whole subtree. Fixed missing deep-sub-node users.
type: project
originSessionId: a8853276-9745-4ce1-8626-4531781606e3
---
**Bug:** clicking an org-hierarchy node showed an incomplete users list — users created in deep sub-nodes (level 2/3+) were missing.

**Root cause (verified against backend contract):** Identity `GET /api/user/` (`ListNodeUsers`) supports TWO node filters — `NodeId` (EXACT-match: that one node only) and `PathPrefix` (path-prefix: the node + its whole subtree). [BRAIN-OUT] `understanding/backend/identity/controllers/UserController/ENDPOINTS.md §4` + `FRONTEND_CONTRACT.md`. The admin-console `HierarchyService.getUsers` sent only `NodeId` → descendant-sub-node users were excluded. (Not a parse bug — `PagedListWire` matches backend `PagedResponse` 1:1.)

**Fix (2026-05-18, admin-console org-hierarchy-page):** users list now shows the selected node + its whole subtree.
- `HierarchyService.getUsers(nodeId, path, pageNumber, pageSize)` — new `path` param; sends `PathPrefix=<path>` for non-root nodes. Falls back to exact `NodeId` only when the node has no path (defensive — avoids an unfiltered whole-tenant query for a Falcon admin). Root unchanged (system-wide, no node filter).
- `TreeStateSlice.effectiveNodePath` — new computed = `selectedNode()?.path`.
- `UsersStateSlice` — `effectiveNodePath` added to the `combineLatest` users-fetch trigger.
- The tree already carries `path` on every node (`ClientNode.path`, from `GetNodeResponse.path`).

**Standing fact:** for any Identity user-list call, `NodeId` = exact node, `PathPrefix` = subtree. Use `PathPrefix` when "all users under a node" is wanted.

**PRIMARY root cause (found after first fix didn't work — every node still empty):** `HierarchyService.getUsers` called the WRONG endpoint — path `'user'` + `useGateway(Gateway.IdentityGateway)`. The real route is service-prefixed `'identity/user'` through the System Gateway. The bare `'user'` path never resolved → 404 → empty list for EVERY node (root + all clients). Fixed to `'identity/user'` + `useGateway(Gateway.SystemGateway)` — mirrors the proven Add User wizard (`UserService` path `'identity/user'`) and the in-service `getTree` (`'commerce/Node'` + SystemGateway). Lesson: gateway paths are service-prefixed (`commerce/…`, `identity/…`); a bare resource path silently 404s.

**THIRD root cause (still empty after the first two fixes):** `getUsers` never sent `TenantId`. `ListNodeUsers` scopes by tenant — Client callers use the JWT tenant, but **Falcon callers must supply request `TenantId`** ([BRAIN-OUT] `UserController/ENDPOINTS.md §4`). The admin console is Falcon-only → JWT tenant is empty → backend resolved an empty tenant → zero users for every node. Fix: `getUsers(nodeId, path, tenantId, pageNumber, pageSize)` now sends `TenantId=<node.tenantId>` for non-root nodes; `TreeStateSlice.effectiveNodeTenantId` computed feeds it via the `combineLatest` trigger. The tree carries `tenantId` on every node (`ClientNode.tenantId`).

**Why:** user wants a node click to show all users related to that node's subtree.
**How to apply:** THREE layered fixes — (1) correct endpoint path/gateway `identity/user`+SystemGateway, (2) `PathPrefix` subtree filter, (3) `TenantId` for the Falcon-admin tenant scope. Not browser-verified yet — user will test.
