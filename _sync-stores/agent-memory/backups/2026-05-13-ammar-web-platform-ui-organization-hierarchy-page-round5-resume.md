---
name: Session Backup - Organization Hierarchy Page Round 5 (Resume)
description: Resume after Round 5 API error — verified prior fixes are in working tree
type: project
agent: ammar-web-platform-ui
date: 2026-05-13
status: completed
originSessionId: a5f5a850e82180641
---
## Resume Findings

The Round 5 session hit an API error after 136 tool calls, but the menu fix DID land in the working tree before the crash. Key library fixes are present and the build is GREEN.

## Working-Tree State (libs/ scope)

### Library fixes in working tree (unstaged)
1. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` — **MENU OFF-SCREEN FIX LANDED**
   - Added `repositionPanel()` method using `getBoundingClientRect()` + `position: fixed`
   - Added `scheduleRepositioning()` setTimeout burst (~250ms) to cover Stencil's first-render lag
   - Switched `showAt()` to fire-and-forget the Stencil call then orchestrate positioning from the wrapper
   - Tightened `syncProps()` with `customElements.whenDefined` + `componentOnReady` double-gate
2. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts` — **DROPDOWN OPTIONS FIX**
   - Converted `@Input() options` from field to setter that pushes to Stencil eagerly via `pushOptions()`
   - Added `AfterViewInit` + `OnChanges` + `customElements.whenDefined` race-guard
3. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts` — same pattern as dropdown
4. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.html` — added `#dropdownEl` template ref
5. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.html` — added `#multiSelectEl` template ref
6. `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` — selected-row 3-dot persistence (Round 3 carry-over)
7. `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.{ts,html}` — Phone +966 prefix fix (Round 3 carry-over)
8. `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.{ts,html}` — modified
9. `libs/falcon/src/language/i18n/{en,ar}.json` — i18n key additions

### Application changes in working tree (unstaged)
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/models/models.ts` — modified
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.{ts,html}` — modified
- `apps/admin-console/src/app/features/organization-hierarchy/services/mock-tree.ts` — modified (Round 3 brand logos)
- `apps/management-console/src/app/app.routes.ts` — modified

### Untracked
- `apps/admin-console/src/app/features/organization-hierarchy-page/` — full new feature folder (Round 1-2 page rebuild)
- `apps/management-console/src/app/features/`
- `.dev-serve.log~`

### Staged for commit (deleted — earlier rename move?)
- All files under `apps/admin-console/src/app/features/organization-hierarchy-page/components/{tab-components,organization-hierarchy-page-menu*,organization-hierarchy-page.routes.ts}` show as `deleted` in `git status` BUT the actual files exist on disk in the untracked list above. This is the prior `git mv` half-applied rename — the working tree's untracked entries replace the staged deletes.

## Build Status — GREEN
- `npx nx build admin-console` → SUCCESS at 2026-05-13T00:13:13.846Z, hash d184a74c159e1efb, 19.2 s
- 1 of 3 tasks served from Nx cache (libs unchanged from cache hit)
- `features-organization-hierarchy-page-organization-hierarchy-page-routes` lazy chunk: 365 bytes (gzipped 213)

## What Round 5 Got Done (before API error)
1. ✅ Diagnosed the menu off-screen bug (y=3401 vs viewport 768) — root cause: Stencil's internal `positionPanel()` runs before the panel `<div>` mounts on first open, so it stays at -9999/-9999.
2. ✅ Fixed in `falcon-menu.component.ts` wrapper: 20-attempt setTimeout burst at 16ms intervals re-reading `getBoundingClientRect()` and applying `position:fixed` viewport coords with flip-up overflow handling and horizontal viewport clamping.
3. ✅ Fixed parallel dropdown/multi-select options forwarding race (Round 4 outstanding item from Round 3 backup).
4. ✅ Build verified GREEN.
5. ❌ **Did NOT reach the 20-screen re-test** — API error before that phase.

## What I Would Do Next (Round 6)
1. Live-verify the menu fix on `/organization-hierarchy-page` tree panel at viewport 1280×768 — click 3-dot on any tree row, confirm menu lands at click trigger and stays in viewport.
2. Live-verify dropdown options fix — Add User Step 2 (User Status / User Role dropdowns) and Add Client Step 1 (Country / City / Classification dropdowns).
3. Run the deferred 20-screen re-test sweep against React source at http://127.0.0.1:5177/.
4. Decide whether to commit working tree as Round 4-5 batch (4 lib files + 1 SCSS + 2 mobile-number + 1 mock-tree + i18n + new page folder) under message "fix(falcon-ui-core/falcon): menu off-screen + dropdown/multi-select options forwarding".
