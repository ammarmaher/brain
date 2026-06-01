# Task History — Org Hierarchy: hide Comm/App tabs on sub-nodes (both consoles)

- **Date:** 2026-05-31
- **Status:** ✅ COMPLETED (build-green + 7 unit tests; NO COMMITS)
- **Repo / branch:** `C:/Falcon/Falcon/falcon-web-platform-ui` · `polishing-v0.4`
- **Plan:** `C:/Users/User/.claude/plans/luminous-singing-lightning.md` (user-approved via ExitPlanMode)
- **Implemented via:** `ammar-web-platform-ui` specialist (per user request "use AmmarSk"), code directly verified by reading diffs.

## Goal
On the Organization Hierarchy page, show the **Communication Channels** + **Applications** tabs only on the account-top node and hide them on all deeper sub-nodes, in BOTH consoles.
- Mgmt: Comm/App on the root/Main node only; hidden on sub-nodes.
- Admin: Comm/App on the first-layer account nodes only; hidden on their children (deeper sub-nodes).

## Key insight
`node.type` is depth-derived (`organization-hierarchy-tree/services/services.ts:188` → depth 1 = `'client'`, depth 2+ = `'sub-node'`; synthetic Falcon top = `'root'`). So admin "first layer" == mgmt "root/Main node" == `type 'client'`, and everything deeper == `'sub-node'`. The user's per-console spec collapses to ONE identical change in both consoles.

## Change (4 files)
- `apps/admin-console/.../org-hierarchy-page/services/state/users-state.signals.ts` — `visibleTabs` `'sub-node'` branch `['hierarchy','commChannels','apps']` → `['hierarchy']` + dated override comment.
- `apps/management-console/.../org-hierarchy-page/services/state/users-state.signals.ts` — same branch edit + override/PES-gate comments (PES gate code unchanged).
- `apps/admin-console/tests/users-state-visible-tabs.spec.ts` — NEW (3 tests).
- `apps/management-console/tests/org-hierarchy/users-state-visible-tabs.spec.ts` — NEW (4 tests).

Unchanged: `'client'` branch (all 4 tabs), admin `isRootSelected()`/mgmt `'root'` branches, mgmt `_canViewServices` PES gate, all templates.

## Authority override (flagged + approved)
Overrides UIUX-016 / PRD-02 `OVERVIEW.md:27` / React SoT `hierarchy.jsx:1191-1200` (all spec sub-nodes with 4 tabs). User is the business authority; plan approval = override approval. Future "restore sub-node comm/apps" needs fresh authority.

## Verification
- Build: `nx run-many --target=build --projects=admin-console,management-console --configuration=development --skip-nx-cache` → EXIT 0, no new warnings on edited files.
- Tests: 7 new regression tests pass (admin 3, mgmt 4) — assert exact tab membership per node type incl. mgmt PES interaction.
- Runtime not driven (local login env-flaky per memory; build + unit tests are the approved gate).

## Out-of-scope flag
Pre-existing UNRELATED failure in `apps/admin-console/tests/wire-builders.spec.ts` (add-client wizard `priceType` enum drift 2/1/4 vs builder 1/3/2). FE agent raised a spin-off task. Not touched.

## Next
Awaiting user decision on whether to commit (polishing-v0.4 only; no push without explicit instruction).
