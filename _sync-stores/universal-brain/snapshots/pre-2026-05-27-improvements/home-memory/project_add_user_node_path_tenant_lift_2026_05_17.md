---
name: Add User node-path + tenant lift
description: Wave NEW (2026-05-17) — lifted `path` and `tenantId` from selected ClientNode to Add User wizard payload, mirroring host-shell main-branch contract.
type: project
originSessionId: bbf47061-e8dc-42e8-ba10-12bb9689474b
---
# Add User wizard — `path` + `tenantId` lifted from selected node — Wave NEW (2026-05-17)

🟢 **LANDED 2026-05-17.** `nx build admin-console` GREEN `8e0722d9266008ce` / 16.58s / 7 tasks (3 fresh + 4 cached). Exit 0.

## Why
The new UI's Add User wizard sourced `tenantId` ONLY from the session JWT (Wave 5, 2026-05-17). Falcon admin's JWT carries empty `tenant_id`, so when a Falcon admin selected a Client subtree and clicked Add User, the wire payload sent `tenantId: ''` (clobbering the real tenant) and `path: null` (never populated at all). The `path` field had no code path at all — the mapper stripped it, `ClientNode` didn't declare it, the wizard didn't read it.

OLD UI main branch (worktree `falcon-old-ui-main` @ `803ac1d1`) gets this right: the host-shell `/profile` page reads both off the selected tree node via `wizardNodePath` + `getWizardTargetTenantId()`. The new UI was missing the entire pipeline because of mapper-strips-fields + missing domain-type + wizard-uses-wrong-source.

## What landed — 4 files, 8 edits

### `apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts`
1. **Edit 1**: Added `tenantId?: string | null` to `GetNodeResponse` (line ~294).
2. **Edit 2**: Added `path?: string | null` AND `tenantId?: string | null` to `ClientNode` (line ~22).
3. **Edit 3**: Mapper `mapGetNodeResponseToClientNode` now copies `path: n.path ?? null` + `tenantId: n.tenantId ?? null` (line ~366).
4. **Edit 4**: Added `path?: string | null` to `NewUserPayload` (line ~136).
5. **Edit 8**: Rewrote Wave-5 tenantId comment block on `NewUserPayload.tenantId` to document the new 3-step precedence: selected-node → session → '' (Falcon-root final fallback).

### `apps/admin-console/.../add-user-wizard/models/models.ts`
6. **Edit 5**: `buildCreateUserWireRequest` now applies symmetric Falcon-root override for `path`: `p.nodeId === FALCON_ROOT_NODE.id ? null : (p.path ?? path)`. Payload `p.path` wins over the legacy `path` parameter, mirroring the existing tenantId precedence.

### `apps/admin-console/.../add-user-wizard/add-user-wizard.component.ts`
7. **Edit 6** — the core fix. `buildPayload` now reads:
   ```ts
   const selected = this.state.selectedNode();
   return {
     ...
     tenantId: selected?.tenantId ?? this.sessionProvider.session?.tenantId ?? '',
     path: selected?.path ?? null,
   };
   ```
   Replaces Wave-5's session-only sourcing. Synthetic Falcon root resolves naturally (no `path`/`tenantId` fields on the constant → undefined → null/'').

### `apps/admin-console/.../add-user-wizard/services/user.service.ts`
8. **Edit 7**: Refreshed the stale `TODO(v1.4)` comment on `createUser` to document that the legacy `tenantId`/`path` positional params are now fallbacks for non-wizard callers; the wire builder's precedence rule (`p.tenantId ?? tenantId`, `p.path ?? path`) makes them harmless when the wizard payload carries the fields.

## Precedence rules

**`tenantId`:**
1. `ClientNode.tenantId` (selected node) — primary
2. `session.tenantId` — fallback (Client AO/Admin's own subtree)
3. `''` (empty string) — final fallback (wire-builder Falcon-root override)

**`path`:**
1. `ClientNode.path` (selected node) — primary
2. `null` — fallback
3. `null` — wire-builder Falcon-root override (defensive)

Wire-builder Falcon-root override fires when `p.nodeId === FALCON_ROOT_NODE.id` and forces `tenantId='' & path=null` regardless of payload contents — defense for non-wizard callers.

## Regression matrix — all 4 user×selection combinations confirmed via reasoning

| User type | Selected node | Old behavior | New behavior | Wire result |
|---|---|---|---|---|
| Falcon admin | Falcon synthetic root | tenantId=`''`, path=`null` | Same (selected has no fields → fallback chain → wire-builder root override) | ✓ unchanged |
| Falcon admin | Real Client sub-node | tenantId=`''`, path=`null` (BUG) | tenantId=real, path=real | ✓ FIXED |
| Client AO/Admin | Their tree root (their client) | tenantId=session, path=`null` | tenantId=node.tenantId (==session), path=node.path | ✓ unchanged or improved |
| Client AO/Admin | Sub-node in their tree | tenantId=session, path=`null` | tenantId=node.tenantId, path=node.path | ✓ improved |

No regression in any combination — additive correctness only.

## Source citations (main-branch reference)

- [CODE] `apps/host-shell/.../user-profile.component.ts:1205-1208` — `wizardNodePath` getter
- [CODE] `apps/host-shell/.../user-profile.component.ts:1210-1249` — `getWizardTargetTenantId` + `getSelectedNodeTenantId` chain
- [CODE] `apps/host-shell/.../user-profile/services/org-hierarchy.api.service.ts:28-42` — host-shell mapper that PRESERVES both fields
- [CODE] `apps/host-shell/.../user-profile/utils/org-hierarchy.mapper.ts:20-36` — TreeNode-data carries fields
- [CODE] `apps/host-shell/.../user-profile/models/node-api.models.ts:8-18` — wire DTO with `tenantId` + `path`
- [CODE] `apps/admin-console/.../organization-hierarchy/services/org-hierarchy.api.service.ts:39-48` — admin-console main-branch DUPLICATE mapper that STRIPS `path` (the original trap; we did NOT duplicate it in the new UI)
- [BRAIN-OUT] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/07-CROSS-PAGE.md:63-75` — cross-page contract spec

## Verification level
- 🟢 **Build-verified.** Type-check + bundle PASS. Hash `8e0722d9266008ce`. No new warnings introduced (existing TS-unused warnings about `falcon-org-node-header.component.ts` + `environment.staging.ts` predate this wave).
- 🔴 **NOT runtime-verified.** Per `Brain Outputs/datasets/authority-dataset/VERIFICATION-STATUS.md:99-115`, FE-runtime smoke remains blocked on 40+ pre-existing Stencil/Angular compile errors. The wire payload shape is correct; runtime POST-body confirmation defers until the workspace blocker clears.

## Trigger phrases to reload this knowledge
- `add user node path` / `add user tenant lift`
- `selected node path forwarding`
- `tenant from selected client node`
- `wizardNodePath new UI` / `getWizardTargetTenantId new UI`

## Doctrine extracted (one rule)
**When a wizard needs ANY piece of context attached to a node by the backend (path, tenantId, brand-id, parent-tier, etc.), read it from `state.selectedNode()` — not from the session. Session is only the fallback for the Client AO/Admin case where they're acting on their own subtree.** The mapper is the contract point: if the mapper drops the field, no downstream component will be able to read it without an extra round-trip.

## Known follow-up
- **Edit User flow (future)** will need the same lift — when it lands, audit it for the same gap. The legacy `tenantId`/`path` params on `UserService.createUser` are kept as fallbacks for that future caller.
- **Q-AM-?? backend confirmation**: does Commerce `GetNodeResponse` populate `tenantId` non-null at every tier (Client + every sub-node) or only at Client (level 1)? If level-2+ omits it, the fallback to session still works. Flag if a future ticket says "user created with wrong tenant on deep sub-node".
