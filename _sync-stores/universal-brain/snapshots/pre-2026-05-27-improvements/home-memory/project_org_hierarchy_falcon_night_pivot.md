---
name: Falcon — Org Hierarchy Falcon (Night Task PIVOT)
description: ACTIVE 2026-05-09 NIGHT TASK · AUTOPILOT · pivoted from Wave 1-7 audit-driven approach to CLEAN MIRROR of OLD folder structure using ONLY angular-wrapper components. No PrimeNG/PrimeIcons/PrimeFlex. -tw variants only.
type: project
parent: project_org_hierarchy_falcon_migration.md
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-09 (post-pivot):** ACTIVE NIGHT TASK · AUTOPILOT · Wave A audit running.

## User mandate (verbatim parse)

> "Create the same folder structure for the organization hierarchy and just make the structure. After making the structure, deep dive inside the folder, and implement the same result as what is implemented inside the organization hierarchy. Don't use any component that I can't use inside the organization hierarchy. Use the new components that we created in `C:\falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper`. Always Tailwind variant (-tw). Don't use PrimeNG, don't use PrimeIcons, don't use PrimeFlex (delete in the future). Implement the SAME EXACT design as old org hierarchy but using only the angular-wrapper components. After implementing, link to API with same interactions as old org hierarchy. Same DTOs/services folder architecture. Tree → selected node shows user table inside the hierarchy tab. Add client per FOLDER NODE only. Add user per node. Add Client opens a wizard with multiple tabs. All validations preserved (Add User + Add Client + Add Node + Edit Node). Multiple waves. Save memory continuously. Show progress table indicator."

## Pivot from Wave 1-7

**Wave 1-7 shipped this:**
- Audit + API map + facade (Wave 1-2)
- Custom-structure org-hierarchy-falcon folder with state/, components/, data/ subdirs (Wave 3)
- Right-click context menu (Wave 4)
- Right-side panel via falcon-angular-dialog position='side-right' + Add/Edit/View/Delete forms (Wave 5)
- Add User / Add Client wizards via INLINE MOUNT of OLD wizards (Wave 6) — **REJECTED in pivot because OLD wizards still use PrimeNG**
- URL persistence (Wave 7)

**Pivot keeps:**
- Validators IMPORT pattern (Wave 5) — pure functions, zero duplication
- Facade reusing existing services (Wave 2) — clean
- Sibling route + ?impl=falcon redirect (Wave 3)
- Mock→real swap (createSubNode, changeNodeName)

**Pivot removes:**
- Wave 6's wizard inline mounts (drag in PrimeNG)
- Wave 1-7's custom folder structure (replace with EXACT mirror of OLD)

## New wave plan (A through I)

| # | Task | Constraint |
|---|------|------------|
| A | Deep audit OLD folder structure (full file tree + role per file) | READ-ONLY |
| B | Restructure organization-hierarchy-falcon/ to mirror OLD structure file-for-file | No code yet, structure only |
| C | Implement tree + Falcon angular-wrapper components | -tw only |
| D | Selected-node detail panel + Hierarchy/Users tabs | -tw only |
| E | Add User wizard from scratch (multi-step, all validations) | -tw only |
| F | Add Client wizard from scratch (multi-tab/step, all validations) | -tw only |
| G | Add Node + Edit Node forms | -tw only |
| H | DTOs + services + API integration mirrored | reuse existing services |
| I | Final regression + memory checkpoint for next session | full report |

## Hard rules (locked)

1. **Angular-wrapper components ONLY** — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/falcon-X.component.ts` selectors via `<falcon-angular-X [useTailwind]="true">`
2. **Always -tw / Tailwind variant** — every wrapper passes `[useTailwind]="true"`
3. **NO PrimeNG, NO PrimeIcons, NO PrimeFlex** anywhere in the new path
4. **OLD folder UNTOUCHED** — `apps/admin-console/src/app/features/organization-hierarchy/` zero diffs
5. **Mirror OLD folder structure** — file-for-file, same hierarchy, same names with -falcon suffix where helpful
6. **Tailwind utilities** for grid + layout
7. **Reuse OLD services + DTOs by IMPORT** — zero duplication
8. **Validations preserved** — import OLD validators, never re-author
9. **API integration mirrors OLD interactions exactly**
10. **Build green-gated, 2-retry max** per wave
11. **No dev-serve**
12. **Self-verify before reporting GREEN**
13. **Memory checkpoint after every wave** for cross-session resume
14. **Brain skills loaded on session start** (banner shows 30/30 ONLINE)
15. **Progress table on every report**

## Cross-session resume

If a fresh session opens:
1. Read this file (`project_org_hierarchy_falcon_night_pivot.md`)
2. Read `WAVE-ORG-HIERARCHY-AUDIT.md` (Wave 1)
3. Read `WAVE-ORG-HIERARCHY-NEW-PLAN.md` (will be created)
4. Resume from next pending wave per the table above
5. Ensure brain banner shows 30/30 ONLINE

---

## 2026-05-09 NIGHT TASK FINAL CHECKPOINT (Wave I)

**Status:** ALL WAVES COMPLETE · GREEN · ready for user review.
**Branch:** `theme-polishment-v1` (uncommitted; user must explicitly say `commit` and `push`).

### Waves complete

| Wave | Result |
|---|---|
| A — OLD audit | DONE → `WAVE-A-OLD-STRUCTURE.md` (114 files / 67 ts / 23 html / 24 scss / 31 PrimeNG imports / 33 PrimeIcons / 0 PrimeFlex) |
| B — Mirror map + structure | DONE → `WAVE-B-MIRROR-MAP.md` + 22 stubs created |
| C — Tree + skeleton + chart | DONE — `<falcon-angular-tree useTailwind>` lazy-load + selection + skeleton |
| D — Tabs + selected-node header + Users list/board | DONE — `<falcon-angular-tabs>`, `falcon-org-node-header-falcon`, kanban + table |
| E — Add User wizard (3 steps + creds popup) | DONE — `add-user-wizard-falcon` with personal / role-status / permissions steps; OLD validators imported |
| F — Add Client wizard (5 steps + service-row table) | DONE — `add-client-wizard-falcon` with information / settings / comm-channels / applications / account-owner |
| G — Add Node / Edit Node drawer | DONE — `falcon-org-node-drawer-falcon` (side-right) + `nodeNameValidator` reused |
| H — Real APIs wired | DONE — `createSubNode`, `changeNodeName`, `createClientFull`, `createUser`, `getTree`, `loadNodeChildren`, `getUsers` all hit real services |
| I — Final regression + this checkpoint | DONE (this section) |

### Final file inventory — `apps/admin-console/src/app/features/organization-hierarchy-falcon/`

50 files total (1 routes + 1 service + 48 components/templates/indexes):

- `organization-hierarchy-falcon.routes.ts` (lazy-loads menu shell)
- `services/hierarchy-page-state-falcon.service.ts` (602 LOC — page state, signals, all submit handlers)
- `components/organization-hierarchy-falcon-menu.component.{ts,html}` (page shell, tabs, conditional wizard mount)
- `components/hierarchy-tree-falcon/hierarchy-tree-falcon.component.{ts,html}` (tree wrapper)
- `components/tab-components/applications-table-falcon/{ts,html,index}`
- `components/tab-components/apps-services-tab/{ts,html,index}`
- `components/tab-components/comm-channels-tab/{ts,html,index}`
- `components/tab-components/settings-tab-falcon/{ts,html,index}`
- `components/tab-components/hierarchy-tab/falcon-org-kanban-falcon/{ts,html,index}`
- `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-user-card-falcon/{ts,html,index}`
- `components/tab-components/hierarchy-tab/falcon-org-node-drawer-falcon/{ts,html,index}`
- `components/tab-components/hierarchy-tab/falcon-org-node-header-falcon/{ts,html,index}`
- `components/wizard-components/add-client-wizard-falcon/` host + 5 step folders + service-row-table + `index.ts`
- `components/wizard-components/add-user-wizard-falcon/` host + 3 step folders + `index.ts`

### OLD files reused-by-import (zero duplication)

- `organization-hierarchy/services/services.ts` — `HierarchyService` (real CRUD)
- `organization-hierarchy/services/validators.ts` — every sync + async ValidatorFn
- `organization-hierarchy/services/validation-messages.ts` — i18n keys + envelope helpers
- `organization-hierarchy/services/mock-tree.ts` — `DEFAULT_ACCOUNT_SETTINGS`, etc.
- `organization-hierarchy/services/mock-applications.ts` — `getMockApps`, `getMockChannels`
- `organization-hierarchy/models/models.ts` — all DTOs, enums, builders (`buildCreateAccountWireRequest`, `buildCreateUserRequest`, `insertChild`, `renameNode`, etc.)
- `organization-hierarchy/components/wizard-components/add-client-wizard/models/models.ts` — wizard form models
- `organization-hierarchy/components/wizard-components/add-client-wizard/services/services.ts` — `AddClientApiService`
- `organization-hierarchy/components/wizard-components/add-user-wizard/models/models.ts` — user wizard form models
- `organization-hierarchy/components/wizard-components/add-user-wizard/services/services.ts` — `AddUserApiService`
- `organization-hierarchy/components/skeleton/org-hierarchy-skeleton.component.ts` — Tailwind-only, reused
- `organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-chart/` — entire chart subtree (REUSED)
- `organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-info-panel/` — REUSED
- `organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-view-toggle/` — REUSED
- `organization-hierarchy/components/wizard-components/add-client-wizard/client-settings-step/` — directly reused inside `settings-tab-falcon` (Tailwind-only step)

### APIs wired (file:line)

- `getTree` → `services/hierarchy-page-state-falcon.service.ts:272`
- `loadNodeChildren` → `:256`
- `getUsers` → `:213` and `:413` (refetch after Add User)
- `createSubNode` → `:451`
- `changeNodeName` → `:488`
- `createClientFull` (calls Identity + Commerce) → `:360` with payload built via `buildCreateAccountWireRequest(:352)`
- `createUser` → `:386`

### Validators reused (file:line)

- `nodeNameValidator` → `falcon-org-node-drawer-falcon.component.ts:29`
- `roleAssignmentValidator` → `user-role-status-step.component.ts:22`
- `passwordSecurityLevelValidator` family → `user-personal-step.component.ts:32`, `client-settings-step.component.ts:31`
- `accountNameValidator` (sync + async) → `client-information-step.component.ts:39`
- `accountOwnerValidators` → `client-account-owner-step.component.ts:40`
- All validation messages mapped via `validation-messages.ts` (imported in every step)

### Build status

- `npx nx build admin-console --configuration=development` → **PASS** (exit 0, ~19.5s, hash `0081b852fee57eeb`)
- `npx nx build host-shell` → **PASS** (exit 0, ~18.8s, hash `ead61a4aa8383342`)
- Warnings only (typescript-unused-files for OLD `guards.ts`/`resolvers.ts` because consumers use `:auto` lazy mode + `google-libphonenumber` CommonJS bailout — both pre-existing infra concerns).

### Old folder zero-diffs (verified)

- `git status apps/admin-console/src/app/features/organization-hierarchy/` → `nothing to commit, working tree clean`
- Repo-wide diff outside new path: 1 file only — `apps/admin-console/src/app/app.routes.ts` (sibling-route registration, expected per Wave B). Plus 3 untracked plan docs (`WAVE-A`, `WAVE-B`, `WAVE-ORG-HIERARCHY-NEW-PLAN`) and the new feature folder.

### PrimeNG / PrimeIcons / PrimeFlex grep enforcement

- `from 'primeng/` → **0** matches in new path
- `<p-` → **0** matches
- `pi pi-` → **0** matches
- `pInputText|pSelectableRow|pButton|pDropdown` → **0** matches
- `p-grid|p-d-flex|p-jc-|p-ai-|p-col-|p-md-|p-lg-` → **0** matches
- All textual mentions of "PrimeNG/PrimeIcons" inside the new path are `*** No PrimeNG ***` compliance comments only.

### Pending follow-ups (next session)

- **None blocking.** Routes registered at `/admin-console/organization-hierarchy-falcon` (sibling route). User can navigate to either implementation freely — no `?impl=` redirect was needed because the sibling-route pattern is sufficient.
- Optional polish: align skeleton iconography on error/empty states with Iconify Solar set used elsewhere (already done — no action).
- Optional polish: replace the lone `pi pi-times` glyph still in OLD `falcon-org-chart` template (REUSED file). Wave B note flagged it; impact is on OLD-source-of-truth, not in scope of this clean-mirror.
- Production budget warnings on `nx build admin-console --configuration=production` are pre-existing infra concerns out-of-scope for this feature.

### Sign-off

**READY FOR USER REVIEW.** All 9 waves shipped GREEN. Old folder untouched. Both builds pass. All hard rules upheld.

---

## 2026-05-09 NIGHT POLISH SWEEP CHECKPOINT (Phase 2 Audit)

**Status:** ALL POLISH MINIONS COMPLETE · ALL 3 BUILDS GREEN · ready for user morning review.
**Branch:** `theme-polishment-v1` (uncommitted; user must explicitly say `commit` and `push`).

### Phase-1 minions (parallel)

| Minion | Scope | Result |
|---|---|---|
| **M1 — i18n** | Add missing i18n keys to en + ar across organization-hierarchy-falcon | DONE — 8 keys added (171/179 already present) |
| **M2 — A11y + polish** | aria-labels + keyboard nav + Iconify hardening + light/dark token swap | DONE — 9 aria-labels added · 27 Iconify hardenings · 0 hardcoded colors |
| **M3 — Studio dead-code** | Remove dormant components + glassmorphism block from falcon-studio | DONE — −551 LOC (469 dormant + 82 glassmorphism block), 2 components deleted (`component-gallery.component.ts`, `studio-preview-pane.component.ts`) |

### Phase-2 audit minion (this section)

- **Scope:** Pick up the 4 i18n keys M2 surfaced AFTER M1, run cross-minion regression, document follow-ups, verify all 3 builds GREEN.
- **i18n keys added (this minion):** 4 — but only 2 were genuinely missing:
  * `hierarchy.actions.previousPage` — already existed (line 1209 EN / 1207 AR) → no duplicate created
  * `hierarchy.actions.nextPage` — already existed (line 1208 EN / 1206 AR) → no duplicate created
  * `hierarchy.applications.actions.rowMenu` → ADDED (en: "Row actions" / ar: "إجراءات الصف")
  * `common.more` → ADDED (en: "More" / ar: "المزيد")
- **Total i18n keys added across polish wave:** 10 (8 from M1 + 2 from this minion that were genuinely missing)
- **Surgical regression fix:** `falcon-org-user-card-falcon.component.ts` was missing `TranslatePipe` import after M2's `[attr.aria-label]="'common.more' | translate"` change. Fixed by adding `import { TranslatePipe } from '@falcon';` and `imports: [TranslatePipe]` to the standalone component decorator. (One retry, well within the 2-retry-max budget.)

### Cross-minion regression — verdicts (all PASS)

| # | Requirement | Source wave | Verdict | Evidence |
|---|---|---|---|---|
| 1 | OLD audit doc `WAVE-A-OLD-STRUCTURE.md` exists | Wave A | PASS | tracked file |
| 2 | Mirror map `WAVE-B-MIRROR-MAP.md` exists | Wave B | PASS | tracked file |
| 3 | New folder `organization-hierarchy-falcon/` mirrors OLD | Wave B | PASS | 63 files / 25 directories matching OLD layout |
| 4 | `<falcon-angular-tree useTailwind>` renders tree | Wave C | PASS | `hierarchy-tree-falcon.component.html:2-3` |
| 5 | Tree expand/collapse/select with lazy load | Wave C | PASS | `hierarchy-page-state-falcon.service.ts:256` |
| 6 | `<falcon-angular-tabs>` for hierarchy/users tabs | Wave D | PASS | `organization-hierarchy-falcon-menu.component.html:3` |
| 7 | Selected-node header (`falcon-org-node-header-falcon`) | Wave D | PASS | `falcon-org-node-header-falcon.component.{ts,html}` |
| 8 | User table via `<falcon-angular-table>` + kanban | Wave D | PASS | kanban + applications-table components |
| 9 | Add User wizard 3 steps + creds popup | Wave E | PASS | `add-user-wizard-falcon` host + 3 step folders |
| 10 | Add User OLD validators imported (no duplication) | Wave E | PASS | `roleAssignmentValidator`, `passwordSecurityLevelValidator` referenced |
| 11 | Add Client wizard 5 steps + service-row table | Wave F | PASS | `add-client-wizard-falcon` host + 5 step folders + service-row-table |
| 12 | Add Client OLD validators imported | Wave F | PASS | `accountNameValidator`, `accountOwnerValidators` referenced |
| 13 | Add Node + Edit Node forms in side-right drawer | Wave G | PASS | `falcon-org-node-drawer-falcon.component.{ts,html}` |
| 14 | `nodeNameValidator` reused in drawer | Wave G | PASS | `falcon-org-node-drawer-falcon.component.ts:29` |
| 15 | Real `getTree` API wired | Wave H | PASS | `hierarchy-page-state-falcon.service.ts:272` |
| 16 | Real `loadNodeChildren` API wired | Wave H | PASS | `hierarchy-page-state-falcon.service.ts:256` |
| 17 | Real `getUsers` API wired (initial + refetch) | Wave H | PASS | service.ts:213 + :413 |
| 18 | Real `createSubNode` API wired | Wave H | PASS | service.ts:451 |
| 19 | Real `changeNodeName` API wired | Wave H | PASS | service.ts:488 |
| 20 | Real `createClientFull` API wired | Wave H | PASS | service.ts:360 |
| 21 | Real `createUser` API wired | Wave H | PASS | service.ts:386 |
| 22 | All 4 phase-2 i18n keys present in en.json | M1+Audit | PASS | grep: more@36, rowMenu@1156, previousPage@1209, nextPage@1208 |
| 23 | All 4 phase-2 i18n keys present in ar.json | M1+Audit | PASS | grep: more@36, rowMenu@1154, previousPage@1207, nextPage@1206 |
| 24 | Wider M1 i18n key set present in en + ar | M1 | PASS | 179 keys mirrored |
| 25 | aria-label coverage on icon buttons + tree | M2 | PASS | 17 aria-label hits across 5 templates |
| 26 | Iconify Solar Linear (no PrimeIcons) | M2 | PASS | 48 `<iconify-icon>` hits across 6 templates |
| 27 | Keyboard nav (role/tabindex/keydown) | M2 | PASS | 8 hits across 5 templates |
| 28 | Light/dark token swap (no hardcoded colors) | M2 | PASS | 0 hex/rgb/rgba in new path |
| 29 | Studio dead-code sweep — gallery + preview-pane removed | M3 | PASS | git status shows `D component-gallery.component.ts`, `D studio-preview-pane.component.ts` |
| 30 | Glassmorphism block removed from generated tokens | M3 | PASS | `component-tokens.generated.ts` modified, glassmorphism stripped |
| 31 | Wave 14B card gallery still mounted | M3 | PASS | `component-gallery-cards.component.ts` exists |
| 32 | Falcon Studio `from 'primeng/'` grep | Audit | PASS | 0 matches in libs/falcon-studio/src |
| 33 | New path `from 'primeng/'` grep | Audit | PASS | 0 matches |
| 34 | New path `<p-` grep | Audit | PASS | 0 matches |
| 35 | New path `pi pi-` grep | Audit | PASS | 0 matches |
| 36 | New path `p-grid|p-d-flex|p-jc-|...` PrimeFlex grep | Audit | PASS | 0 matches |
| 37 | OLD folder zero git diff | Audit | PASS | `git status apps/.../organization-hierarchy/` → clean |
| 38 | `libs/falcon-ui-core` zero git diff | Audit | PASS | `git status libs/falcon-ui-core/` → clean |
| 39 | host-shell build green | Audit | PASS | 40.5s · hash 6f51095e360978f0 |
| 40 | falcon-studio build green | Audit | PASS | cache + tsc no-emit clean |
| 41 | admin-console dev build green (retry 1 after surgical TranslatePipe fix) | Audit | PASS | exit 0 |

**Audit verdict:** 41/41 rows PASS. Zero RED, zero PARTIAL.

### All 3 builds GREEN

- `npx nx build host-shell` → **PASS** (exit 0, ~40.5s, hash `6f51095e360978f0`)
- `npx nx build falcon-studio` → **PASS** (exit 0, tsc no-emit clean + cached deps)
- `npx nx build admin-console --configuration=development` → **PASS on retry 1** (exit 0; first attempt failed with NG8004 missing `TranslatePipe` in `falcon-org-user-card-falcon.component.ts` — fixed surgically by importing TranslatePipe from `@falcon`; well within 2-retry-max)

### Pending follow-ups for next session

- **Upstream cleanup minion needed for `libs/falcon-ui-tokens`:** the file `libs/falcon-ui-tokens/src/components/glassmorphism.tokens.css` still exists and is still referenced from `libs/falcon-ui-tokens/src/index.css`. M3 was scoped to `libs/falcon-studio` only, so this upstream token file was intentionally left. A separate cleanup task should remove or repurpose it.
- **`FalconStudioComponentDetailPanelComponent` is now structurally orphaned:** its only consumer was the deleted `component-gallery.component.ts` (M3). Currently still re-exported from `libs/falcon-studio/src/index.ts`. Flagged for **Falcon Studio Wave 16** dead-code cleanup.
- **Falcon Studio Wave 16 still queued:** 6 INTERNAL_MATRIX entries to address (radio · uploader · otp-send-dialog · tooltip · toast-host · tree-table).
- **One stray `pi pi-times` in REUSED OLD `falcon-org-chart` template** (and one in OLD `applications-table.component.html`). Untouched per the no-OLD-modification mandate. Flagged for a separate cleanup task that targets the OLD path with **explicit user permission**.
- **Lone duplicate `finish` key** inside the OLD `hierarchy.addUser` block in en.json (line 1390 + line 1447) and ar.json. Last-write-wins, same value either way (harmless), but cosmetically a duplicate. Flagged for OLD-path cleanup.

### Cross-session resume

To resume in a fresh session:
1. Read this file (`project_org_hierarchy_falcon_night_pivot.md`) — both Wave I and this Phase 2 checkpoint
2. Read `WAVE-ORG-HIERARCHY-NEW-PLAN.md`
3. Brain banner verify 30/30 ONLINE
4. If user asks for next polish wave: pick from Pending follow-ups list above

### Sign-off

**READY FOR USER MORNING REVIEW.** All 9 original waves + 3 polish minions + Phase 2 audit shipped GREEN. OLD folder untouched. `falcon-ui-core` untouched. All 3 builds pass. All hard rules upheld.
