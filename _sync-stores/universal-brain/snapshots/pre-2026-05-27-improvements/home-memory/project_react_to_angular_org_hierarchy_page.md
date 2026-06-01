---
name: React-to-Angular Organization Hierarchy Page conversion
description: Falcon admin-console /organization-hierarchy-page feature built fresh from React source `Falcone New3 (3)` — current state, files touched, verified fixes, known limitations, restart commands
type: project
originSessionId: f9327798-e9ce-4a55-b3d9-9e52fa5e85c2
---
# React → Angular conversion: /organization-hierarchy-page

**Status (2026-05-13):** PARTIAL — page builds + loads cleanly, all major visible fixes landed, deep-interaction perf needs one more optimization round.

**Why:** User invoked Night Shift + RAGE MODE to convert the React static-HTML prototype at `C:\Falcon\Source_of_truth_theme\React\Falcone New3 (3)\` into a new Angular feature parallel to the existing `organization-hierarchy/` reference. The new folder name was already wired in `app.routes.ts:10` but the folder did not exist (build was broken). Tailwind-only constraint, no new SCSS in the new folder. RAGE-MODE iteration loop until 100% parity is the goal; PES + business validations come AFTER parity.

**How to apply:** When resuming, read this file then:
- React source live URL: http://127.0.0.1:5177/T2%20Falcon%20Admin.html (run `npx http-server` from the React source folder)
- Angular live URL: http://localhost:4200/#/admin-console/organization-hierarchy-page (login `FalconAdmin` / `Admin@1234`, then sidebar "Organization Hierarchy (New Page)")
- Reference: existing `apps/admin-console/src/app/features/organization-hierarchy/` folder
- New: `apps/admin-console/src/app/features/organization-hierarchy-page/` (21 files)

## What landed and is verified live in browser

**Page shell**
- Title "Organization Hierarchy" (no "(React parity)" suffix)
- 272px tree column + main pane with tabs
- Top-right page-level toggle "List | Tree" (was wrong "Tree | Chart")
- Tabs: Hierarchy / CommChannels & Services / Apps & Services / Settings

**Tree panel (left column)**
- 3-dot menu icon persistent on selected row + on hover (lib SCSS edit)
- Tree context menu opens with Add Node / Edit Node / Add User options (works for top rows; off-screen for bottom rows — see limitation #1)

**Drawers**
- Add Node + Edit Node drawers: i18n keys translated (duplicate `hierarchy.drawer` block in en/ar.json removed; the duplicate at line 1568+ was shadowing the correct entry)

**Add User wizard**
- Step 1: 3-column grid (Row 1: First/Last/User Name; Row 2: National ID / Phone Number / Email Address)
- Password field removed from Step 1
- Phone Number field shows "SA | +966" country prefix
- Step 2 dropdowns load options correctly (Round 4 lib fix)
- Step 2/3 transition is SLOW (~30s render) — see limitation #2

**Add Client wizard**
- 5 steps: Information / Settings / CommChannels / Applications / Account Owner
- DI fix landed (NG0201 resolved via `useExisting` alias mapping new-folder state service to old-folder DI token)
- Step 5 password is auto-generated/readonly (matches React)

**Settings tab**
- 2-card layout: LEFT password security + Allowed IPs / RIGHT Account Limitations
- Selected-node header at top of tab (was missing)
- Outlined Edit button (was solid teal)

**Sub-tabs**
- CommChannels & Services: 9 columns (was 5)
- Apps & Services: 9 columns
- All include First Activation / Activation / Renew date columns + Status

**Photo uploader (Falcon shared-ui)**
- Edit (pencil) + Delete (×) overlay buttons after upload (was missing)

**Mock data**
- Brand logos seeded for Aramco, Al-Rajhi, SNB, Bupa in `mock-tree.ts`

## Files modified (full set, all UNSTAGED)

**New folder — 21 files:**
- `apps/admin-console/src/app/features/organization-hierarchy-page/organization-hierarchy-page.routes.ts`
- `.../models/models.ts`
- `.../services/services.ts` + `services/hierarchy-page-state.service.ts`
- `.../components/organization-hierarchy-page-menu.component.{ts,html}`
- `.../components/skeleton/react-org-page-skeleton.component.ts`
- `.../components/tab-components/hierarchy-tab/react-org-{view-toggle,node-header,node-drawer,chart,info-panel,kanban,user-card,users-table}.component.ts` (8 files)
- `.../components/tab-components/{comm-channels-tab,apps-services-tab,settings-tab,applications-table}/react-*.component.ts` (4 files)
- `.../components/wizard-components/{add-client-wizard,add-user-wizard}/react-*.component.ts` (2 wrappers)

**Reference folder edits (organization-hierarchy):**
- `.../components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.{html,ts}` (3-col grid, password removed)
- `.../components/wizard-components/add-user-wizard/models/models.ts` (default password seeded server-side)
- `.../services/mock-tree.ts` (brand-logo SVG data URIs)

**Falcon library edits:**
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` (3-dot persistent on selected via `.is-selected .row-action { opacity: 1 }`)
- `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.{html,ts}` (delegate to `<falcon-angular-phone-field>` for SA/+966 prefix)
- `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.{html,ts}` (edit/delete overlays)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.{html,ts}` (Stencil @Prop options race fix via `customElements.whenDefined + componentOnReady` re-push)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.{html,ts}` (same pattern as dropdown)

**i18n:**
- `libs/falcon/src/language/i18n/en.json` (drawer + settings keys; duplicate `hierarchy.drawer` block at line 1568+ removed)
- `libs/falcon/src/language/i18n/ar.json` (Arabic mirror)

**NOT modified (intentional revert in Round 7):**
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` — Round 5/6 rewrite froze the renderer; reverted via `git checkout HEAD -- <file>` to restore stability

**Untouched per scope rule:**
- `apps/admin-console/src/app/app.routes.ts` — route was pre-registered before this session

## Known limitations / next-round work

1. **Tree context menu off-screen for bottom-of-tree rows** — original lib bug, NOT introduced by this work. Tree-panel host is ~3339px tall with shared menu instance positioned at the bottom. Rounds 5+6 attempted Angular-wrapper fix and froze the renderer (reverted). Recommended next-session approach: Stencil-side body portal in `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu-tw.tsx` — detach panel to `document.body` on open, `position: fixed` from `anchor.getBoundingClientRect()`, reattach on close. Bypasses every Angular lifecycle.

2. **Add User Step 2/3 transition slow (~30s render)** — Round 4 dropdown wrapper uses `customElements.whenDefined + componentOnReady` polling per dropdown instance. With many dropdowns mounting at once this saturates the main thread. Recommended fix: replace polling with `queueMicrotask(() => el.options = this._options)` deferred a single tick, OR use a one-shot `MutationObserver` for the upgrade event.

3. **Add User Step 2 status options completeness** — only 2 visible (Active, Inactive); React shows 4 (+ Suspended, Pending). Quick data fix in the wizard's options config.

4. **Lint suppressions** — new folder's `react-*` selectors violate project's `app-*` rule (intentional per task); `submit`/`cancel` outputs collide with native DOM event names. Add `.eslintrc.json` override in `organization-hierarchy-page/` allowing `react-*` and the two output names.

5. **Mock-tree brand logos for non-seeded nodes** — backend HierarchyService doesn't return `imageUrl`; mock fallback only kicks in when backend fails.

6. **Wizards delegate to reference-folder steps via wrappers** — for full Tailwind purity in new folder, would need to fork ~25 step files. Current wrappers are pragmatic.

## Build status at session end

- `npx nx build admin-console` — GREEN
- `npx nx build host-shell` — GREEN
- `npx nx build management-console` — GREEN
- No commits, no pushes per standing rule

## Restart commands when resuming

```
# React source server (if not running):
cd "C:\Falcon\Source_of_truth_theme\React\Falcone New3 (3)" && npx http-server -p 5177

# Angular dev server (if not running):
cd C:\Falcon\falcon-web-platform-ui && npx nx serve host-shell

# Login: FalconAdmin / Admin@1234
# Then sidebar → "Organization Hierarchy (New Page)"
```

## Round-by-round log

- Round 1: scaffolding (21 new files, build green)
- Round 2: i18n drawer, AddUser 3-col + no password, Settings 2-card, 9-col tables, photo uploader, page title, view toggle labels, AddClient DI fix
- Round 3: Phone +966 prefix, Settings outlined Edit btn, mock-tree brand seeds, 3-dot persistent on selected
- Round 4: dropdown @Prop options array race fix (5 lib files)
- Round 5: menu wrapper rewrite — INTRODUCED FREEZE
- Round 6: hardening attempt — STILL FROZE
- Round 7: revert menu wrapper to HEAD — STABILITY RESTORED, off-screen menu bug returns (deferred per limitation #1)

## Restore packets

- `C:\Users\User\.claude\projects\C--Falcon\memory\backups\2026-05-13-ammar-web-platform-ui-organization-hierarchy-page-round5-resume.md`
- `C:\Users\User\.claude\projects\C--Falcon\memory\backups\2026-05-13-ammar-web-platform-ui-falcon-menu-revert.md`

## How to continue when resuming

1. Verify both servers running (curl checks above)
2. Hard-reload http://localhost:4200/#/admin-console/organization-hierarchy-page in browser
3. Pick from limitations list — recommended order: #2 (dropdown perf) → re-test wizards 6-10 → #1 (Stencil body-portal for menu) → #3 (status options) → #4 (lint) → Wave 4 PES + business validations
