---
name: Organization Hierarchy Tree shared component
description: New host-shell shared component wraps <falcon-tree-panel> with internal PES gating + 3 view modes + normalized events. Migrated management-console org-hierarchy-page in 2026-05-15 session. Contact-groups + wallet-balance-management still to migrate (playbook below).
type: project
originSessionId: 2198a35d-267a-4253-9b0e-1470ff9c9c30
---
# Organization Hierarchy Tree — host-shell shared wrapper

**Status (2026-05-15, Wave 20):** 🟢 SHIPPED to current branch. host-shell + management-console + admin-console all build GREEN. **Wrapper now owns ALL backend calls** (tree + users) — caller no longer passes data inputs. PES gating + tree fetch + user fetch on click + pagination all internal to the wrapper. Working tree dirty — no commits, no pushes per standing rule.

### Wave 20 inputs/outputs contract (current)

**Inputs caller still passes:**
- `mode` — `'falcon-clients' | 'falcon-full' | 'client'`
- `showActions` / `showRootActions` — boolean gates
- `clientsLabelKey` — section-label i18n key
- `usersPageNumber` / `usersPageSize` — paginator state (caller's paginator → wrapper input → re-fetch effect)

**Inputs DROPPED** (no longer in API): `treeData`, `selectedId`, `expandedIds`. Wrapper owns these internally.

**Outputs caller listens to:**
- `(treeReady)` → `{ tree, error }` — initial tree load completed (success / failure / PES denial)
- `(nodeSelect)` → normalized payload — fires on click
- `(toggle)` → expand/collapse id — caller may mirror to state
- `(usersLoading)` → boolean — fetch in flight
- `(usersLoaded)` → `{ nodeId, items, totalCount }` — users fetched, caller renders in right pane
- `(usersError)` → `{ nodeId, error }` — fetch failed
- `(actionInvoke)` → normalized action payload — 3-dot menu item invoked
- `(nodeIdReady)` → session.nodeId — PES denial session-seed fallback

**Backend service** (wrapper-private): `OrgHierarchyTreeApiService` at `services/services.ts`. Endpoints:
- `GET commerce/Node` (Gateway.SystemGateway) — root tree
- `GET commerce/Node?NodeId={id}` — lazy children on toggle
- `GET user?NodeId={id}&Role=…&PageNumber=…&PageSize=…` (Gateway.IdentityGateway) — users for selected node, role-filtered per Falcon-root-or-not

## What this component is

`<app-organization-hierarchy-tree>` lives at `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/`. Consumes the **library skeleton** `<falcon-tree-panel>` at `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`.

Follows the Falcon **library-skeleton + app-wrapper** doctrine. The library piece stays pure presentational (zero service inject). The app wrapper owns:

1. **PES gating** — internally injects `AccessControlFacade` and OR-resolves BOTH `FalconAccess.managementConsole.accountHierarchy.view()` (`acc.org-hierarchy`) AND `FalconAccess.adminConsole.accountHierarchy.view()` (`sys.acc-hierarchy`). A Falcon user in admin-console gets allow on `sys.*`; a Falcon user in management-console gets allow on `acc.*`; an acc-user without hierarchy permission gets deny on both → tree hides. When denied: wrapper renders nothing and the consumer's grid `auto`-track collapses. PES is *not* a caller input (host-agnostic by design).
2. **Mode → config mapping** — three modes drive skeleton inputs (`skeletonMode`, `showSubNodes`) + action sets.
3. **Action set computation** — derives `canAddOrganization` / `canAddUser` flags from PES and filters the root + per-row action lists.
4. **Session-seed fallback** — when PES denies the tree, emits `(nodeIdReady)` with `SessionProvider.session?.nodeId` so the consuming page can still load downstream data.
5. **Event normalization** — `(nodeSelect)`, `(actionInvoke)`, `(toggle)`, `(nodeIdReady)` payloads are consistent across modes.

## Modes

| Mode | Root | showSubNodes | Root menu items | Per-row menu items |
|---|---|---|---|---|
| `falcon-clients` | Falcon | **false** (clients only, no chevrons) | Add Client, Add User | — (no recursion) |
| `falcon-full` | Falcon | true | Add Client, Add User | Add Node, Edit Node, Add User |
| `client` | The user's client | true | Add User, Add Node, Edit Node | Add Node, Edit Node, Add User |

Action visibility is further filtered by PES flags resolved internally.

## Public API

**Inputs:**
- `mode: OrgHierarchyTreeMode` (default `'falcon-full'`)
- `treeData: OrgHierarchyTreeNodeLike | null` — payload from parent state service
- `selectedId: string | null`
- `expandedIds: ReadonlySet<string>`
- `showActions: boolean` (default true) — per-row 3-dots
- `showRootActions: boolean` (default true) — root 3-dot, gated independently
- `clientsLabelKey: string` — i18n key for the section label

**Outputs:**
- `(nodeSelect)` → `{ nodeId, accountId, type, isRoot }`
- `(nodeUnselect)` → void
- `(actionInvoke)` → `{ id: 'addClient'|'addUser'|'addNode'|'editNode', nodeId, accountId }`
- `(toggle)` → expand/collapse id (passthrough)
- `(nodeIdReady)` → `string | null` — session-seed fallback fired ONCE per (resolved, denied) state transition

**Layout contract:**
- Host element is `display: contents` → vanishes from layout.
- Inner wrapper div is 272×100% when permitted, `hidden` when denied.
- **Consumer's parent must use `grid-cols-[auto_1fr]` or `flex`** so the column collapses on denial.

## Library skeleton changes (`falcon-tree-panel`)

Made in the same 2026-05-15 session:

1. **Root-action column bug fix** — root row's physical padding (`pl-4 pr-2`) replaced with logical (`ps-4 pe-1`) to mirror `.falcon-tree`'s `px-1`, so root + per-row 3-dots share one X column in BOTH LTR and RTL.
2. **Root 3-dot geometry** — promoted from `w-[10px] h-6` to `w-[22px] h-[22px] rounded-xs` matching per-row `.row-action` (with `hover:bg-falcon-teal-100`).
3. **Root row hover state** — added `hover:bg-falcon-neutral-0 transition-[background-color]` matching `.client-row:hover`.
4. **Root menu clamp** — `onRootMenuClick` now runs `clampMenuPanelInViewport` after `showAt` resolves, same off-screen-prevention as per-row menus.
5. **New input `showSubNodes`** — false hides chevrons AND forces empty `expandedIds` so no deeper rows render. Wrapper uses this for `falcon-clients` mode.
6. **New input `showRootActions`** — gates root 3-dot independently of `showActions`.
7. **Computed signals `effectiveExpandedIds` + `effectiveShowArrows`** — clamp expansion/arrows to `showSubNodes` state internally so the node component doesn't need new inputs.

Prior 2026-05-15 fixes still in place from earlier in the same session:
- Kebab-flicker fix (`openMenuNodeId` signal piped to nodes; `[class.menu-open]` + `[attr.aria-expanded]` on `.row-action`).
- Off-screen menu clamp (2-RAF `clampMenuPanelInViewport` post `showAt`).

## Migration playbook for the OTHER two pages

PR 41231 (`Bug/FE-OrgHierarchy-HideTreeFromNormalUsers`) added the SAME PES boilerplate to three pages:
- ✅ `apps/management-console/src/app/features/organization-hierarchy-page/` — **migrated in this session**.
- ⏳ `apps/management-console/src/app/features/contact-groups/` — to migrate.
- ⏳ `apps/management-console/src/app/features/wallet-balance-management/` — to migrate.

**Recipe (copy from the org-hierarchy-page migration as the canonical pattern):**

1. In the page `.ts`:
   - Remove the page's own `private accessControlFacade = inject(AccessControlFacade)`.
   - Remove the `canViewTree`, `canAddOrganization`, `canAddAccountUser`, `canAddOrgUser`, `allowedTreeActions` fields.
   - Remove the `primeAccess()` method.
   - Remove the constructor `effect()` that seeds `selectedNodeId` from `SessionProvider.session.nodeId`.
   - Remove the `await this.primeAccess();` line from `ngOnInit`.
   - Drop `ROOT_ACTIONS` / `NODE_ACTIONS` consts.
   - Drop `FalconTreePanelComponent`, `FalconTreeAction`, `FalconTreePanelActionEvent` imports.
   - Add `OrganizationHierarchyTreeComponent`, `OrgHierarchyActionEvent`, `OrgHierarchyNodeSelectEvent` imports from `@host-shell/shared/organization-hierarchy-tree`.
   - Add a `onNodeIdReady(nodeId)` handler that re-seeds the page's data (this is where the lost session-seed effect re-lands).
2. In the page `.html`:
   - Change wrapping grid from `grid-cols-[272px_1fr]` to `grid-cols-[auto_1fr]` (or use `flex gap-4`).
   - Remove the `*ngIf="canViewTree"` guard from the wrapping div (wrapper owns this now).
   - Swap `<falcon-tree-panel ...>` for `<app-organization-hierarchy-tree mode="…" …>`.
   - Wire `(nodeSelect)`, `(actionInvoke)`, `(nodeIdReady)`, `(toggle)`.
3. Build green on `nx build management-console`. Done.

**Net diff per page:** ~−50 lines of PES boilerplate, ~+5 lines of wrapper config.

## Files touched in 2026-05-15 session

**New (4 files):**
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts`
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.html`
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/models/models.ts`
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/index.ts`

**Edited (6 files):**
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` (root padding, new inputs, computed effective signals, root menu clamp)
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` (logical padding, hover state, root 3-dot geometry, gating + bindings)
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` (`openMenuNodeId` input from earlier in session)
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` (kebab-flicker class wiring from earlier)
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.ts` (swap import + handlers)
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` (swap tag + grid track)

## Known gaps / next-session candidates

- **Tests** — no unit tests added (PR 41231 also had none). Opportunity to add coverage for the wrapper.
- **Contact-groups + wallet-balance-management** — migration playbook above; ~30 min per page.
- **PR 41231 status** — still open on `Bug/FE-OrgHierarchy-HideTreeFromNormalUsers`. After this wrapper merges, PR 41231 can be abandoned or rebased to use the wrapper instead.
- **admin-console scope** — wrapper currently hard-codes `managementConsole.accountHierarchy.view()`. If admin-console ever needs the same wrapper, add a `permissionScope: 'admin' | 'management'` input (or fork the wrapper).
- **`editNode` PES key** — there is no precise PES key for editing a sub-node. Wrapper always emits the action; the consuming page can re-gate if needed.

## How to resume

In a new session at `C:\Falcon`:
```
read memory project_org_hierarchy_tree_shared_component
```
Then either:
- "migrate contact-groups to the org-hierarchy-tree wrapper" → follow the playbook above for `apps/management-console/src/app/features/contact-groups/`.
- "migrate wallet-balance-management to the wrapper" → same recipe for that folder.
- "add tests to the org-hierarchy-tree wrapper" → start with `permitted` resolution + action-set computation per mode.
