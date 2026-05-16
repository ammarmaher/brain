# Phase 7 — Claude-Generated Wave Plan

**Run:** 2026-05-14 — Brain SK Night Shift
**Synthesis inputs:** Reports 00–08 (all complete)
**Total waves:** 20 (W0 + W1 + W2 + W3 already done; W4–W19 implementation)

---

## Wave matrix overview

| Wave | Phase | Title | Goal | Risk | Est | Stop condition |
|:---:|:---:|---|---|:---:|---|---|
| W0 | Discovery | TouchBase + health check | Confirm env, paths, servers | LOW | 30 m | ✅ DONE |
| W1 | Discovery | Source system test + screenshot baseline | Test 27 source flows | LOW | 60 m | ✅ DONE (synthesis) |
| W2 | Discovery | Existing Angular structure discovery | Catalog reference | LOW | 60 m | ✅ DONE |
| W3 | Discovery | Component knowledge check + mapping | Mapping + upgrade plan | LOW | 60 m | ✅ DONE |
| **W4** | Impl | Frontend route + page skeleton | New folder skeleton compiles green | LOW | 60 m | build red after 2 fix attempts |
| **W5** | Impl | Host-shell menu integration | Menu item visible, clicks navigate | LOW | 30 m | build red after 2 fix attempts |
| W6 | Impl | (Library upgrades) | DEFER — no lib upgrades in this feature wave | — | — | n/a |
| **W7** | Impl | org-hierarchy-page menu shell + state service | Shell renders with 3 modes (list/chart/info) wired off `HierarchyPageStateService` | MED | 2 h | runtime errors after 3 fix attempts |
| **W8** | Impl | Hierarchy tree + node actions (3-dot kebab) | Tree panel, selection, ctx-menu, hover trail | MED | 2 h | tree-panel encapsulation issue blocks |
| **W9** | Impl | Add Client wizard (5 steps + service-row-table) | Wizard runs end-to-end with mock submit | MED | 2.5 h | wizard step API mismatch blocks |
| **W10** | Impl | Add User wizard (3 steps) | Wizard runs end-to-end with mock submit | MED | 2 h | wizard step API mismatch blocks |
| **W11** | Impl | Users table + statuses + row actions | Table renders, status badges, row-action template | MED | 1.5 h | data-table action-slot pattern fails |
| **W12** | Impl | User details / information drill-down | Drill-down page with 3 view + 3 edit tabs | MED | 2 h | tab swap pattern fails |
| **W13** | Impl | Phone / email verification + OTP popup | Verify pills open OTP; rule = task-brief; resend timer | MED | 1.5 h | otp-send-dialog API mismatch blocks |
| **W14** | Impl | Tabs / info-panel edit / settings tab | InfoPanel edit, Settings tab view+edit modes | MED | 1.5 h | photo-uploader replacement issue |
| **W15** | Impl | List / Tree-chart view modes | Chart view with pan/zoom and focus mode | HIGH | 2.5 h | pan/zoom directive port issue |
| **W16** | Impl | Backend/API integration finalization | OrgHierarchyMockFacade wired; tree fetches real data with mock fallback | LOW | 1 h | NodeService incompat |
| **W17** | Impl | Visual parity repair loop (bounded ≤ 5 rounds) | 90 % section parity vs React | MED | 2 h | round 5 reached |
| **W18** | Verify | Regression / build / testing sweep | Build + lint + test green; route works after login | LOW | 1 h | build red |
| **W19** | Wrap | Final report, Obsidian links, Git (PUSH only on user "push") | Reports complete; commits staged on user "commit" | LOW | 1 h | — |

**Implementation total estimate:** ~20–25 hours single-pass; with parity loop and breaks, realistically a 3–4 session multi-day execution.

---

## Per-wave detail

### W4 — Frontend route + page skeleton

**Goal:** Land the minimum file set so `nx build admin-console` is green with the new route present.

**Scope (files to create):**
- `apps/admin-console/src/app/features/org-hierarchy-page/org-hierarchy-page.routes.ts`
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.{ts,html}` — minimal "Hello from Org Hierarchy Page" placeholder body
- `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` — placeholder (will be filled in W7)
- `apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts` — copy from reference verbatim
- `apps/admin-console/src/app/features/org-hierarchy-page/services/services.ts` — minimal `OrgHierarchyMockFacade` skeleton with `getTree()` returning SEED_TREE stub; rest throw NotImplemented
- `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` — copy from reference; remove BRAND hex anti-pattern
- `apps/admin-console/src/app/features/org-hierarchy-page/services/mock-tree.ts` — minimal seed (3 clients, 1 sub-node)

**Scope (files to edit):**
- `apps/admin-console/src/app/app.routes.ts` — add the `org-hierarchy-page` route entry per Phase 5 §2.1

**Agents involved:** Orchestrator only (no subagents).

**Falcon components reused:** none yet — just route + placeholder
**Components upgraded:** 0
**Data approach:** SEED_TREE stub
**Validation:**
- `npx nx build admin-console` GREEN
- `npx nx lint admin-console` GREEN
**Visual checks:** none
**Tests:** none
**Risk:** Module Federation discovery — admin-console must keep exporting `routes`/`default`
**Acceptance:**
- New folder exists with above files
- `nx build admin-console` succeeds
- `nx lint admin-console` succeeds
- Route registered + lazy-loads
**Stop condition:** 2 fix attempts on build red
**Report:** `wave-04-report.md`

---

### W5 — Host-shell menu integration

**Goal:** Sidebar shows "Org Hierarchy (Admin)" entry that navigates to `/admin-console/org-hierarchy-page`.

**Scope (files to edit):**
- `apps/host-shell/src/app/layout/layout.component.ts` — add 1 constant + 1 NavItem inside `createNavItems()` Account Administration section (Phase 5 §3)

**No other edits.**

**Agents involved:** Orchestrator only
**Falcon components reused:** Existing sidebar/topbar/layout
**Components upgraded:** 0
**Data approach:** Static NavItem
**Validation:**
- `npx nx build host-shell` GREEN
- `npx nx lint host-shell` GREEN
**Visual checks:** Live in browser AFTER user logs in (deferred to Wave 17 or earlier user demo). For now, code-only verification.
**Tests:** none
**Risk:** Sidebar real-mode item ordering / userType gating
**Acceptance:**
- Build green
- Code review shows the new NavItem follows the existing pattern
- New item placed above the legacy "Organization Hierarchy (New Page)" entry
**Stop condition:** build red after 2 attempts; or sidebar test fails
**Report:** `wave-05-report.md`

---

### W7 — Page menu shell + state service + 3 view-mode wiring

**Goal:** OrgHierarchyPageMenuComponent renders the full chrome (tree column + tabs + view toggle + content panel) without any tabs filled. State signals wire view-mode + activeTab + selectedNode.

**Scope (files to create / fill):**
- `components/org-hierarchy-page-menu.component.{ts,html}` — full template wiring (tree column + tabs + view toggle + content panel placeholder)
- `components/skeleton/org-hierarchy-skeleton.component.ts` — verbatim from reference
- `services/hierarchy-page-state.service.ts` — full state per Phase 5 §5
- `components/tab-components/hierarchy-tab/falcon-org-view-toggle/` — verbatim from reference
- `components/tab-components/hierarchy-tab/falcon-org-node-header/` — verbatim from reference (BRAND hex → token replacement)

**Scope (files to edit):**
- `org-hierarchy-page.routes.ts` — add `providers: [{provide: HIERARCHY_FACADE, useClass: OrgHierarchyMockFacade}, HierarchyPageStateService]`

**Agents involved:** Orchestrator + `ammar-web-platform-ui` for component port
**Falcon components reused:** `<falcon-angular-tabs>`, `<falcon-icon>`
**Components upgraded:** 0
**Data approach:** SEED_TREE
**Validation:** build + lint green; signal-binding manual code review
**Visual checks:** deferred to W17
**Tests:** unit-skeleton: `expect(menu.visibleTabs()).toEqual(['hierarchy','settings'])` for root
**Risk:** Reference component has 26 `@falcon` imports — barrel-path resolution
**Acceptance:**
- Page renders without errors when route hit
- Tab switch updates signal
- View toggle updates signal
- Selecting a node updates signal
**Stop condition:** runtime injection error after 3 fix attempts
**Report:** `wave-07-report.md`

---

### W8 — Hierarchy tree + node actions

**Goal:** Tree panel renders left column with 5 mock clients + sub-nodes. Hover trail works. Selecting a node updates state. 3-dot kebab menu opens with correct items per node type (root: Add Client + Add User; non-root: Add Node + Edit Node + Add User).

**Scope (files to create):**
- `services/mock-tree.ts` — expand to canonical seed (Aramco / Al-Rajhi / SNB / Bupa / + 10-deep BMW chain)
- `services/services.ts` — `OrgHierarchyMockFacade.getTree()` returns full SEED_TREE; tree adapter from `OrgHierarchyNode[]` if real backend
- Tree column inside `<app-org-hierarchy-page-menu>` template — `<falcon-tree-panel>` with `[items]` + `(onAction)` + `[tree-actions]`

**Scope (files to edit):**
- `components/org-hierarchy-page-menu.component.{html,ts}` — wire tree

**Agents involved:** Orchestrator + `ammar-web-platform-ui`
**Falcon components reused:** `<falcon-tree-panel>` (LEGACY), `<falcon-icon>`
**Components upgraded:** 0
**Data approach:** SEED_TREE
**Validation:**
- Click node → state changes, content panel re-binds
- Hover row → trail glow on ancestors
- 3-dot opens → correct items per node type
**Visual checks:** open `/admin-console/org-hierarchy-page` after login; sidebar→menu→tree visible
**Tests:** none yet
**Risk:** `<falcon-tree-panel>` SCSS encapsulation issue (Agent 4 §3 item 3) may surface
**Acceptance:**
- All 5 clients visible, expandable
- Selection visible
- Hover trail works
- Ctx-menu items match per node type
**Stop condition:** tree-panel renders blank or kebab menu broken after 3 fix attempts → switch to `<falcon-angular-tree>` fallback (no row actions) and document UC-W01 dep
**Report:** `wave-08-report.md`

---

### W9 — Add Client wizard (5 steps + service-row-table)

**Goal:** Clicking "Add Client" opens 5-step wizard that submits via `OrgHierarchyMockFacade.createClient()`.

**Scope (files to create):**
- `components/wizard-components/add-client-wizard/add-client-wizard.component.{ts,html}`
- `components/wizard-components/add-client-wizard/index.ts`
- `models/models.ts` — wizard-local types
- `services/services.ts` — `AddClientApiService` (calls facade)
- `client-information-step/`, `client-settings-step/`, `client-comm-channels-step/`, `client-applications-step/`, `client-account-owner-step/`
- `client-service-row-table/`

**Falcon components reused:** `<falcon-angular-wizard>`, `<falcon-angular-input>`, `<falcon-angular-radio>`, `<falcon-angular-input-number>`, `<falcon-angular-data-table>`, `<falcon-angular-single-uploader>` (replaces legacy photo-uploader), `<send-credentials-popup>`
**Components upgraded:** 0
**Data approach:** Mock submit → seed mutation + toast
**Validation:**
- All 5 steps render
- Footer Next/Previous gating works
- Finish triggers facade + closes wizard
**Visual checks:** deferred
**Tests:** none yet
**Risk:** Photo uploader replacement (single-uploader needs circular mask token); IP chips widget local component
**Acceptance:**
- Wizard ends with toast + new node in tree
**Stop condition:** wizard step API mismatch after 3 fix attempts
**Report:** `wave-09-report.md`

---

### W10 — Add User wizard (3 steps)

**Goal:** Clicking "Add User" opens 3-step wizard that submits via `OrgHierarchyMockFacade.createUser()`.

**Scope (files):** mirror of W9 with 3 steps: `user-personal-step`, `user-role-status-step`, `user-permissions-step`; + `add-user-wizard.component.*` + models + service
**Falcon components reused:** `<falcon-angular-wizard>`, `<falcon-angular-input>`, `<falcon-angular-phone-field>` (replaces legacy mobile-number), `<falcon-angular-email-field>`, `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`
**Data approach:** mock submit → users[] mutation + toast
**Validation:** all 3 steps + Finish toast + user in selected node's users array
**Visual checks:** deferred
**Risk:** phone-field +966 default needs explicit `defaultCountry="SA"` input
**Acceptance:** new user appears in UsersTable after Finish
**Stop condition:** 3 fix attempts
**Report:** `wave-10-report.md`

---

### W11 — Users table + statuses + row actions

**Goal:** UsersTable renders per-node users with all 5 statuses + row 3-dot action ("More Details").

**Scope:** none new from reference (data-table already present in tab). Wire `<falcon-angular-data-table>` with:
- `[data]` bound to `state.selectedNode()?.users`
- Status column → `<falcon-angular-status-badge>`
- Action column → custom template slot with single button (overrides FT-01 inherited PrimeIcon)
- Pagination via `<falcon-angular-paginator>` if needed

**Files affected:**
- `components/org-hierarchy-page-menu.component.{ts,html}` — content area
- `components/tab-components/hierarchy-tab/` — inline users-table OR new local component

**Falcon components reused:** `<falcon-angular-data-table>`, `<falcon-angular-status-badge>`, `<falcon-angular-paginator>`
**Data approach:** state-driven
**Validation:**
- Switching node → table re-binds
- Status badges show correct color per status
- Row action opens UserDetailsPage (W12)
**Visual checks:** deferred
**Risk:** Inherited FT-01 → use template slot to override icon
**Acceptance:** Test cases 9, 10, 11 from Phase 1 pass
**Stop condition:** data-table action-slot doesn't accept template after 3 attempts
**Report:** `wave-11-report.md`

---

### W12 — User details / information drill-down

**Goal:** "More Details" row action opens `UserDetailsPage` with 3 view tabs and edit mode.

**Scope (files to create):** Either child route (`users/:id`) or in-place panel swap. Pick child route per Phase 5 §2.2 placeholder.
- `components/user-details/user-details-page.component.{ts,html}` (NEW — not in reference structure)
- View tabs: Personal / Role / Permissions
- Edit pill toggles edit-mode tab set

**Falcon components reused:** `<falcon-angular-tabs>`, `<falcon-angular-input>`, `<falcon-angular-dropdown>`
**Components upgraded:** 0
**Data approach:** state.selectedUser signal
**Validation:** test cases 11, 12, 13 from Phase 1 pass
**Visual checks:** deferred
**Risk:** Page-route vs inline panel decision affects URL + state shape
**Acceptance:** Edit save toasts + returns to view; Cancel discards
**Stop condition:** 3 fix attempts
**Report:** `wave-12-report.md`

---

### W13 — Phone / Email verification + OTP popup

**Goal:** Verify pill on phone/email opens 6-digit OTP modal with 60 s resend timer. Validation per task-brief rule (code === '000000' passes).

**Scope (files to create):**
- `components/verify/otp-dialog.component.{ts,html}` (NEW or page-local wrapping `<falcon-angular-otp-send-dialog>`)
- `services/otp-mock.service.ts` per Phase 5 §7

**Falcon components reused:** `<falcon-angular-otp-send-dialog>` (if it bundles timer) OR `<falcon-angular-otp>` + `<falcon-angular-popup>`
**Components upgraded:** 0
**Data approach:** Client-side validation only
**Validation:**
- Phone Verify → modal open
- All-zeros code → success + dismiss
- Any other 6-digit → invalid state
- Resend timer 60 s tick + reset
**Visual checks:** deferred
**Risk:** Wrapper `(falconComplete)` not implemented (G1 workaround needed)
**Acceptance:** Test cases 15, 16, 17, 18 from Phase 1 pass
**Stop condition:** 3 fix attempts
**Report:** `wave-13-report.md`

---

### W14 — Info-panel edit + Settings tab

**Goal:** Information panel view/edit mode (17 fields) + Settings tab view/edit mode (radio cards + IP chips + numeric limits).

**Scope (files):**
- `components/tab-components/hierarchy-tab/falcon-org-info-panel/` — verbatim from reference; token migration for SVG strokes
- `components/tab-components/settings-tab/` — verbatim
- `components/tab-components/hierarchy-tab/falcon-org-node-drawer/` — Add/Edit Node drawer

**Falcon components reused:** `<falcon-angular-input>`, `<falcon-angular-input-number>`, `<falcon-angular-radio-group>`, `<falcon-angular-single-uploader>`, `<falcon-angular-drawer>`, `<falcon-angular-popup>`
**Data approach:** in-memory (info save = toast only per Agent 2 §1.16)
**Validation:**
- Edit pill toggles fields editable
- Cancel discards
- Save toasts (no persist for v1)
- Drawer open/close
- Settings IP chips add/remove
**Visual checks:** deferred
**Risk:** Photo uploader needs circular mask token
**Acceptance:** Test cases 13, 14 from Phase 1 pass
**Stop condition:** 3 fix attempts
**Report:** `wave-14-report.md`

---

### W15 — List / Tree-chart view modes

**Goal:** Toggle between list-view (UsersTable) and tree-chart view (cards with pan/zoom + focus mode).

**Scope (files):**
- `components/tab-components/hierarchy-tab/falcon-org-chart/` — verbatim from reference; subtree: chart-card, chart-toolbar, directives, services, models

**Falcon components reused:** `<falcon-icon>`, custom `<falcon-org-chart>` page-local
**Components upgraded:** 0
**Data approach:** state.viewMode signal
**Validation:**
- View toggle pill switches list ↔ chart
- Chart shows all nodes as cards
- Pan/zoom RAF-throttled
- Card click → focus mode with user-circle ring
- Wheel zoom anchored to cursor
- Pan drag suppresses trailing click
**Visual checks:** deferred to W17
**Risk:** Pan/zoom directive port — math sensitive
**Acceptance:** Test cases 19, 20 from Phase 1 pass + behaviors 12–15 from Agent 2
**Stop condition:** 3 fix attempts
**Report:** `wave-15-report.md`

---

### W16 — Backend/API integration finalization

**Goal:** Real `NodeService.getNode()` populates tree via adapter; mock fallback on error; everything else mocked. Ready for backend swap when endpoints land.

**Scope (files to edit):**
- `services/services.ts` — finalize `OrgHierarchyMockFacade.getTree()` adapter + error handling
- `services/services.ts` — add `OrgHierarchyRealFacade` skeleton with `// TODO backend` per Phase 6 §10

**Falcon components reused:** —
**Components upgraded:** 0
**Data approach:** real tree fetch + mock fallback
**Validation:**
- If backend reachable → real tree
- If 401/500/timeout → SEED_TREE fallback + console.warn
**Visual checks:** Wave 17
**Risk:** Adapter shape mismatch
**Acceptance:** Tree renders consistently
**Stop condition:** 3 fix attempts → leave mock-only
**Report:** `wave-16-report.md`

---

### W17 — Visual parity repair loop (bounded ≤ 5 rounds)

**Goal:** ≥ 90 % section-by-section visual parity vs React reference.

**Scope:** No new files. Iterate on existing templates + Tailwind utility / token tweaks.

**Required dev servers (user must start):**
- `npx nx serve host-shell` → http://localhost:4200
- React already at http://localhost:5500/T2 Falcon Admin.html

**Required user action:** login at `http://localhost:4200/#/login` with FalconAdmin credentials (Claude cannot type password).

**Per-round procedure:**
1. Side-by-side screenshot — React vs Angular for each section
2. Diff list (visual mismatches)
3. Fix top 5 mismatches
4. `nx build admin-console` GREEN gate
5. Re-screenshot
6. If parity ≥ 90 % → exit; else repeat (max 5 rounds)

**Sections to score:**
- Sidebar / Topbar (host-shell — not in scope; skip)
- Tree panel header + rows + kebab menu
- Node header + action buttons
- Tab strip
- View toggle pill
- Users table + status badges + row action
- InfoPanel grid + Account Official divider + photo block
- Settings tab cards
- Apps & Services / CommChannels tables
- Add Client wizard chrome + each step
- Add User wizard chrome + each step
- Node drawer
- OTP modal + timer

**Risk:** Tree-panel SCSS encapsulation issues; FT-01 icon override
**Acceptance:** Mean parity ≥ 90 %
**Stop condition:** Round 5 reached
**Report:** `visual-parity-report.md`

---

### W18 — Regression / build / testing sweep

**Goal:** Full quality gate before final report.

**Scope:**
- `npx nx build admin-console` GREEN
- `npx nx build host-shell` GREEN
- `npx nx build management-console` GREEN (must not regress)
- `npx nx lint admin-console` GREEN
- `npx nx lint host-shell` GREEN
- `npx nx test admin-console --watch=false` PASS (only added-this-feature specs)
- Manual regression: management-console org-hierarchy-page still works (open `/management-console/organization-hierarchy-page` after login)
- Manual regression: legacy admin-console redirect still routes (no crash)
- No new PrimeNG imports
- No new SCSS files
- No hardcoded hex outside `falcon-*` vars

**Acceptance:** All gates green
**Stop condition:** Build red after 3 fix attempts → escalate
**Report:** `test-and-regression-report.md`

---

### W19 — Final report, Obsidian, Git

**Goal:** Produce final reports, link Obsidian, prepare commits (do NOT push without explicit user "push").

**Scope (files to create):**
- `implementation-summary.md` — what landed, line counts, time spent
- `gaps-and-next-actions.md` — open questions + library upgrades queued
- `time-estimation.md` — actual vs estimated per wave
- `TASK_REPORT.md` — executive summary with KPIs
- `TASK_REPORT.pdf` (if pdf-creator skill is invoked)

**Obsidian updates:**
- Append page to `C:\Falcon\Brain SK\_obsidian` with wave summaries and links
- Wikilink to mapping, architecture, wave plan

**Git:**
- `git add` only the implementation files + Brain Outputs
- Stage commit message: `add organization hierarchy`
- Brain commit message: `docs(brain-sk): add org hierarchy page night shift wave report`
- **DO NOT commit / push** until user explicitly says "commit" / "push" (standing rule)

**Acceptance:** Reports complete; commits staged-ready
**Stop condition:** —
**Report:** `TASK_REPORT.md`

---

## Continuous wave rule

After each wave passes acceptance criteria:
1. Auto-advance to next wave
2. Pause only on (a) blocking decision (b) source-truth unavailable (c) build / test blocked (d) Git conflict (e) max repair rounds reached
3. On any "open question" surface to user; never invent business logic silently
4. Update todos after each wave completion
5. Save brain checkpoint at end of each major wave

## Boundary rules (per task spec)

- Max visual parity repair rounds per major UI area: **5**
- Target visual parity: **≥ 90 %**
- **No destructive file sync**, no `robocopy /MIR`
- **No secrets committed**
- **No commits / pushes without explicit user "commit" / "push"**
- **No edits outside the new feature folder** except: `apps/admin-console/src/app/app.routes.ts` (1 entry) + `apps/host-shell/src/app/layout/layout.component.ts` (1 NavItem + 1 constant)
- Library code (`libs/...`) is **READ-ONLY** for this feature wave

## Decision register (cross-reference)

All locked decisions from Phases 4-6 are referenced as `D1..D15` (Phase 4 §4) + `D-Auth` (Phase 5 §12). New decisions surfaced during implementation will be logged in `gaps-and-next-actions.md`.

End of Phase 7 wave plan. Implementation can now begin at Wave 4.
