---
name: Falcon node-identity unification (avatar + select-before-action)
description: Centralized "what to display for a node" as a single NodeIdentity contract + shared <app-org-node-avatar>. Action invocations on a node ALWAYS select it first, so wizard chrome + header strip + tree row stay in lockstep. Fixes "Add Client/User on Falcon root targets BMW instead" + "wizard shows BMW logo when targeting Falcon root".
type: project
originSessionId: a39cbc78-46a3-472c-beee-814a4ec78645
---
# Falcon node-identity unification — select-before-action + brand-aware avatar

**Status (2026-05-16):** 🟢 LANDED to current working tree. Builds GREEN for `admin-console` (hash `1a20705f767b4f9c`) + `host-shell` + `management-console`. No commit/push per standing rule. Working tree dirty.

## Symptoms we fixed

User-reported on admin-console Organization Hierarchy:

1. Clicking **Add Client / Add User on the Falcon root** kebab opened the wizard targeting the **previously-selected client** (e.g. BMW), not Falcon. Even fixing that, the wizard's top-strip avatar/name showed the prior selection.
2. Wizard top-strip showed initials of the synthetic root's name instead of the **Falcon brand SVG** when targeting Falcon root.
3. Selection-state drift between kebab actions and wizard chrome — "the signal wasn't 100% updated".

## Root cause chain

[CODE] [organization-hierarchy-tree.component.ts:272-284](Falcon/falcon-web-platform-ui/apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts:272) — wrapper emits `actionInvoke({nodeId: null, accountId: null, isRoot: implied})` for Falcon root in `falcon-full` mode. Falcon top is synthetic — there's no backend nodeId.

[CODE] [org-hierarchy-page-menu.component.ts:284-302](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts:284) (PRE-FIX) — `const id = event.nodeId ?? ''; if (id) ensureNodeSelected(id);` bailed when id was empty → `state.onHeaderAddUser()` ran against the previously-selected `selectedNodeId()`. Wizard opened for the wrong node.

[CODE] [add-user-wizard.component.html:6-17](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html:6) (PRE-FIX) — chrome read `state.selectedNode()` raw and rendered `imageUrl` OR `initials(name)`. No `isFalconRoot` branch → never rendered the brand SVG.

[CODE] [falcon-node-details-section.component.html:11-22](Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.html:11) (PRE-FIX) — library section had `imageUrl` OR first-letter chip only. Same gap.

## Five-phase fix

### Phase 1 — wrapper enriches action event with `isRoot`
- [CODE] `OrgHierarchyActionEvent` now has `readonly isRoot: boolean`.
- [CODE] `onSkeletonAction` emits `isRoot: event.nodeId === null`.
- Non-breaking: additive field; existing consumers that destructure `{id, nodeId}` continue working.

### Phase 2 — page-menu: select-before-dispatch for ALL actions, including Falcon root
- [CODE] rewrote `onActionInvoke` in [org-hierarchy-page-menu.component.ts](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts:284):
  ```ts
  const root = this.state.treeRoot();
  const targetId = event.nodeId ?? (event.isRoot ? (root?.id ?? null) : null);
  if (!targetId) return;
  this.ensureNodeSelected(targetId);  // ← unconditional
  switch (event.id) {
    case 'addClient': this.state.onHeaderAddClient(); break;
    case 'addUser':   this.state.onHeaderAddUser();   break;
    case 'addNode':   this.state.onHeaderAddNode();   break;
    case 'editNode':  this.state.onHeaderEditNode();  break;
  }
  ```
- Dropped the band-aid `state.onTreeContextAction({nodeId, action:'open'})` calls. `selectedTreeNode` is now the authoritative source.
- One rule: **select first, dispatch second**.

### Phase 3 — state: `selectedNodeIdentity` (single source of truth for "what to show")
- [CODE] [hierarchy-page-state.service.ts:189-211](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts:189):
  ```ts
  readonly selectedNodeIdentity = computed<NodeIdentity | null>(() => {
    const n = this.selectedNode();
    if (!n) return null;
    if (n.type === 'root') return { name: 'Falcon', kind: 'falcon-brand', imageUrl: null, initials: '' };
    const src = toNodeImageSrc(n.imageUrl);
    if (src) return { name: n.name, kind: 'image', imageUrl: src, initials: '' };
    return { name: n.name, kind: 'initials', imageUrl: null, initials: this.initialsFor(n.name) };
  });
  ```
- `NodeIdentity` type imported from `@host-shell/shared/org-node-avatar` so management-console can adopt the same contract.

### Phase 4 — new shared `<app-org-node-avatar>` at host-shell
- [CODE] new files at `apps/host-shell/src/app/shared-components/org-node-avatar/`:
  - `models/models.ts` — `NodeIdentity` + `NodeIdentityKind` + `OrgNodeAvatarSize` types.
  - `org-node-avatar.component.ts` — pure presentational `OnPush` with `identity = input.required<NodeIdentity>()` + `size = input<OrgNodeAvatarSize>('md')`.
  - `org-node-avatar.component.html` — `@switch (identity().kind)` branches: `falcon-brand` → inline brand SVG (mirrors falcon-tree-panel's root row SVG path), `image` → `<img>`, `initials` → teal chip.
  - `index.ts` — exports component + types.
- Path alias: `@host-shell/shared/org-node-avatar` (auto-resolved by existing tsconfig `@host-shell/shared/*`).

### Phase 5 — consume the shared avatar in 3 sites

**5a · add-user wizard chrome (dynamic via avatar)** — binds `state.selectedNodeIdentity()` and renders `<app-org-node-avatar [identity]="id" size="md" />` + sibling label span. Add User runs against ANY node (Falcon root, client, sub-node), so dynamic identity is required.
- [CODE] [add-user-wizard.component.html](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html) — added `<app-org-node-avatar>` projection.
- [CODE] [add-user-wizard.component.ts](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.ts) — added `OrgNodeAvatarComponent` to the `imports` array.

**5b · add-client wizard chrome (hardcoded Falcon brand)** — Add Client is root-only by design (`state.canAddClient = computed(() => this.isRootSelected())`). The wizard ALWAYS targets Falcon root, so the chrome hardcodes the Falcon brand SVG + literal "Falcon" label inline (no need for the dynamic identity path). This reconciliation landed via linter/user revert during this session — preserved because Add Client cannot logically target any other node.

**5c · `<falcon-node-details-section>` library extension + page-menu projection**
- [CODE] new directive [falcon-node-details-avatar.directive.ts](Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-avatar.directive.ts) — structural marker mirroring the existing `FalconNodeDetailsActionsDirective`.
- [CODE] library section template now branches: projected avatar template > `imageUrl` > first-letter fallback. Existing callers unaffected.
- [CODE] [org-hierarchy-page-menu.component.html:103-118](Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:103) — projects `<app-org-node-avatar [identity]="id" size="md" />` via `<ng-template falconNodeDetailsAvatar>`. Label now reads `state.selectedNodeIdentity()?.name ?? node.name`.
- [CODE] library barrel [index.ts](Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/index.ts) exports the new directive; the wider `libs/falcon/src/shared-ui/index.ts` already has `export * from './lib/components/falcon-node-details-section'` so `@falcon` picks it up automatically.

## Build verification

| Project | Result | Hash |
|---|---|---|
| `admin-console` | 🟢 | `1a20705f767b4f9c`, ~17s |
| `host-shell` | 🟢 | cached / re-built |
| `management-console` | 🟢 | re-built (consumes the wrapper change too) |

## Files touched (9 files, ~150 lines net)

**New (5 files):**
- `apps/host-shell/src/app/shared-components/org-node-avatar/models/models.ts`
- `apps/host-shell/src/app/shared-components/org-node-avatar/org-node-avatar.component.ts`
- `apps/host-shell/src/app/shared-components/org-node-avatar/org-node-avatar.component.html`
- `apps/host-shell/src/app/shared-components/org-node-avatar/index.ts`
- `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-avatar.directive.ts`

**Edited (8 files):**
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/models/models.ts` (+isRoot)
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` (+isRoot on emit)
- `apps/admin-console/.../components/org-hierarchy-page-menu.component.ts` (+imports, simplified handler)
- `apps/admin-console/.../components/org-hierarchy-page-menu.component.html` (avatar projection in node-details-section)
- `apps/admin-console/.../services/hierarchy-page-state.service.ts` (+selectedNodeIdentity computed + import)
- `apps/admin-console/.../components/wizard-components/add-user-wizard/add-user-wizard.component.{ts,html}`
- `apps/admin-console/.../components/wizard-components/add-client-wizard/add-client-wizard.component.{ts,html}`
- `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.{ts,html}` (+avatar slot)
- `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/index.ts` (+directive export)

## What user should runtime-verify

1. Click on any client (e.g. BMW) → header shows BMW logo + name. ✓
2. Click **Falcon root** in the tree → header shows **Falcon brand SVG + "Falcon"**. ✓ NEW.
3. Click any client kebab → Add User → wizard top-strip shows **that client's image + name**.
4. Click Falcon root kebab → Add Client → wizard top-strip shows **Falcon brand SVG + "Falcon"**. ✓ NEW.
5. Click Falcon root kebab → Add User → same — Falcon SVG + "Falcon". ✓ NEW.
6. Click sub-node kebab → Add Node → drawer opens against THAT sub-node's parent (header reflects parent).
7. After any wizard close, repeat kebab → identity tracks the kebab's target. No "stale BMW logo".

## Known follow-ups (deferred)

- **Drawer parent context-card** (`falcon-org-node-drawer`) — should also project `<app-org-node-avatar>` for the parent display. User chose "Full plan" (without drawer), so this is parked. Recipe: pass `state.parentNodeOf(targetId, mode)` through the same NodeIdentity classification (small helper on state service to project arbitrary node → identity), project into the drawer's parent slot.
- **Management-console org-hierarchy-page** — has the same page-menu/state-service pattern. The wrapper change auto-applies, but the page-level Phase 2/3/5 swap needs porting. Recipe: copy the 4 edits made to admin-console files into the mgmt-console counterparts. ~30 min.
- **Tree-panel's own root row** — already renders the brand SVG via its `mode='falcon'` computeds. Could swap to `<app-org-node-avatar>` for full consistency, but it's [MEMORY] `feedback_library_skeleton_app_api.md` library code so we leave it alone.

## How to resume

In a new session at `C:\Falcon`:
```
read memory project_falcon_node_identity_unification
```
Then either:
- "port node-identity to management-console org-hierarchy-page" → apply Phase 2/3/5 to that page.
- "wire shared avatar into falcon-org-node-drawer parent card" → projector + parent-identity helper.
