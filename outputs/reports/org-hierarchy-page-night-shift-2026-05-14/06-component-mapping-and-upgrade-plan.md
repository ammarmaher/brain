# Phase 4 — Component Mapping & Upgrade Plan

**Run:** 2026-05-14 — Brain SK Night Shift synthesis
**Inputs consumed:**
- `01-html-source-discovery.md` (Agent 1 — HTML rendered structure)
- `02-react-source-discovery.md` (Agent 2 — React behavior + 25 must-preserve)
- `04-existing-angular-structure-discovery.md` (Agent 3 — management-console reference, 38 components)
- `05-component-knowledge-check.md` (Agent 4 — 19 Falcon component dossiers, 4 P0 blockers)
- `08-backend-api-discovery-and-integration-plan.md` (Phase 6 — HierarchyFacade contract)

---

## 1. Master mapping table — Source UI → Falcon component → action

Legend:
- **REUSE** = use as-is from current `@falcon` / `@falcon/ui-core` library
- **REUSE+WORKAROUND** = use today; accept documented gap; do not block this wave
- **UPGRADE_THEN_REUSE** = land library upgrade first or in parallel; consumer waits
- **CUSTOM (page-local)** = bespoke component lives in this feature only; not promoted to lib

| # | Source UI area | React/HTML behavior | Falcon target | Reuse / Upgrade / Custom | Required dynamic capability | Gap | Decision |
|---|---|---|---|---|---|---|---|
| 1 | App chrome — sidebar | Section-grouped nav with icons, collapsible, active highlight | `host-shell/.../sidebar.component` (already exists) | REUSE (host-shell scope) | NavItem `iconClass`, `safePath`, `hidden`, `requiredUserTypes` | none | NavItem added to `layout.component.ts:178+` (Option B in §15 of Agent 3 report) |
| 2 | App chrome — topbar | Brand mark, language toggle, user menu | `host-shell/.../topbar.component` | REUSE | — | — | nothing to do |
| 3 | Page menu wrapper | `<organization-hierarchy-page-menu>` orchestrates tabs + tree + panels | local `<app-org-hierarchy-page-menu>` | CUSTOM (page-local, mirror of reference) | signal-based state, tab switching, info-panel toggle | none | copy from reference with rename |
| 4 | Page skeleton (loading) | Skeleton placeholder while tree loads | local `<falcon-org-hierarchy-skeleton>` | CUSTOM (page-local, verbatim) | tailwind-only | none | copy verbatim |
| 5 | Tree panel (left rail, 272 px) | T2 Falcon brand head, scrollable list, per-row brand icon, kebab `⋮`, hover trail, RTL anchor flip | `<falcon-tree-panel>` (LEGACY-IN-USE — production tested) | REUSE+WORKAROUND | `FalconTreeAction[]` declarative API | UC-W01 (parallel `<falcon-angular-tree>` lacks row template) — accepted tech debt | ⚓ USE `<falcon-tree-panel>` per Agent 4 recommendation |
| 6 | Tab strip (Hierarchy / CommChannels / Apps / Settings) | Visible-tabs computed by node type (root = 2 tabs, child = 4 tabs) | `<falcon-angular-tabs>` | REUSE | dynamic visible tab set | none | bind `[items]` to `visibleTabs()` signal |
| 7 | View toggle (List / Tree-chart) | Pill with icons; hidden when activeTab ≠ hierarchy | `<falcon-org-view-toggle>` (page-local) | CUSTOM (page-local, verbatim) | signal-driven toggle | none | copy from reference |
| 8 | Node-header (top-right of right pane) | Title + brand avatar + state-dependent action buttons (Add Client / Add User / Information / Back / Edit Info / Add Node) | `<falcon-org-node-header>` (page-local) | CUSTOM (page-local, verbatim) | computed button set from node type + view-mode | none | copy from reference, replace BRAND hex with token |
| 9 | Hierarchy tab → list mode | UsersTable (per-node users) on right | `<falcon-angular-data-table>` | REUSE+WORKAROUND | row-action template (Strategy E cell), status cell, pagination | P0 FT-01: `pi pi-ellipsis-v` inherited from `<falcon-table>` — page-local override via custom action template | ⚓ data-table with custom action cell |
| 10 | Hierarchy tab → tree-chart mode | Card-based chart, dotted bg, zoom toolbar, focus mode with user-circle ring, pan/zoom anchored to cursor | `<falcon-org-chart>` + `<falcon-chart-card>` + `<falcon-chart-toolbar>` + `FalconPanZoomDirective` + `ChartLayoutService` | CUSTOM (page-local, verbatim) | computed positions, pan/zoom, focus ring | none | copy from reference incl. directives + service |
| 11 | Hierarchy tab → info panel (right pane drilldown) | 17-field grid + Account Official section divider + edit/save/cancel + photo uploader in edit | `<falcon-org-info-panel>` (page-local) | CUSTOM (page-local, verbatim) | edit/view toggle, ngForms with validators | none | copy from reference; replaces field hex strokes with tokens |
| 12 | Hierarchy tab → kanban (status-grouped users — code present but unused per Agent 2 OQ #7) | KanbanView with `<falcon-org-user-card>` | `<falcon-org-kanban>` (page-local) | CUSTOM (page-local, verbatim) | grid by status | none | copy from reference; included for completeness even if not surfaced in v1 toolbar |
| 13 | Node drawer (Add Node / Edit Node) | Right slide-in, bottom-underline input, plain Cancel link + solid Add | `<falcon-org-node-drawer>` (page-local) wrapping `<falcon-angular-drawer>` | CUSTOM (page-local, verbatim) | open/close signal, ngForm | a11y focus-trap (P0 from popup chain) — drawer has its own gap; accept | copy from reference |
| 14 | Add-Client wizard (5 steps) | Stepper + 5 step components + SendCredentialsModal + SuccessModal | `<falcon-angular-wizard>` host + local step components | REUSE + CUSTOM | step-validity per step, `next`/`prev`/`finish` events | UC-W01 doesn't apply to wizard. Status: USE_AS_IS per Agent 4 §6 | wizard host = `<falcon-angular-wizard>`; steps remain page-local |
| 15 | Add-User wizard (3 steps) | Stepper + 3 step components + PhoneInput + EmailInput + OtpModal + CredentialsModal + UserSuccessModal | `<falcon-angular-wizard>` + `<falcon-angular-phone-field>` + `<falcon-angular-otp>` + `<falcon-angular-popup>` | REUSE | step-validity, completion, OTP digit count | OTP `(falconComplete)` not on wrapper — use length-check workaround per Agent 4 G1 | wizard + phone-field + otp; modal via popup |
| 16 | Add-Client wizard step 1 — Client Information | grid form with photo uploader + 17-ish fields | `<falcon-angular-single-uploader>` + `<falcon-angular-input>` + token-driven grid | REUSE + CUSTOM page-step | reactive forms, validators | photo-uploader legacy AVOIDED per Agent 4; use single-uploader + circular mask token | ⚓ replace legacy photo-uploader with single-uploader |
| 17 | Add-Client wizard step 2 — Settings | radio cards + IP chips + 3 number steppers | `<falcon-angular-radio>` / `<falcon-angular-radio-group>` + custom IP chip + `<falcon-angular-input-number>` | REUSE | reactive ip chip add/remove | IP chip custom — page-local component | ⚓ inline IP chip widget in step file |
| 18 | Add-Client wizard step 3+4 — Services rows | Service table with toggle, name, price-type, price-value, status | `<client-service-row-table>` (page-local) wrapping `<falcon-angular-data-table>` | CUSTOM (page-local, verbatim) | density, status badge in cell | none | copy from reference |
| 19 | Add-Client wizard step 5 — Account Owner | Read-only summary + auto-generated password | local step + `<send-credentials-popup>` from libs | REUSE + CUSTOM | password generation, copy-to-clipboard | none | use existing `send-credentials-popup` |
| 20 | Send Credentials Modal | "Choose how to send credentials (Email / SMS / Print)" + Success modal | `<send-credentials-popup>` (already in libs/falcon/src/shared-ui per Agent 4 scan listing) | REUSE | — | none | bind to wizard completion |
| 21 | Add-User wizard step 1 — Personal Info | First/Last/User/National ID/Phone/Email | `<falcon-angular-input>` + `<falcon-angular-phone-field>` + `<falcon-angular-email-field>` | REUSE | reactive forms, validators | phone +966 default; legacy `<falcon-mobile-number>` AVOIDED per Agent 4 | ⚓ phone-field directly |
| 22 | Add-User wizard step 2 — Role & Status | dropdowns for role / permission group / status | `<falcon-angular-dropdown>` | REUSE | option lists, signal binding | none | bind reactively |
| 23 | Add-User wizard step 3 — Permissions & Privilege | Multi-select / matrix permission list (TBD in code review) | `<falcon-angular-multi-select>` | REUSE | option lists | none | reference defines layout |
| 24 | Phone verification chip | "Verify" pill triggers OTP popup; pill state: pending/verified | inline button in `<falcon-angular-phone-field>` slot OR sibling button | REUSE | open OTP popup | none | declarative open/close |
| 25 | Email verification chip | "Verify" pill triggers OTP popup; pill state: pending/verified | inline button next to `<falcon-angular-email-field>` | REUSE | open OTP popup | none | declarative open/close |
| 26 | OTP popup | 6-box OTP input, 60 s resend timer with SVG circular progress, paste-aware, expires state | `<falcon-angular-otp-send-dialog>` (existing) OR `<falcon-angular-otp>` + `<falcon-angular-popup>` | REUSE | digit count, length completion event, paste handler | wrapper lacks `(falconComplete)` — use length workaround | ⚓ otp-send-dialog if it bundles timer; otherwise compose |
| 27 | OTP validation rule | Task spec: zeros pass / non-zero fails. React reality: `'150999'` fails, everything else passes | local `OtpMockService` | CUSTOM (page-local) | configurable rule | task vs React rule conflict — see §3 of this report | ⚓ implement task-brief rule with a `ValidationMode` toggle to flip to `'150999'` rule |
| 28 | UsersTable status badge | Active / Pending / Suspended / Locked / Deleted | `<falcon-angular-status-badge>` | REUSE | status enum → token mapping | none | bind value to status |
| 29 | UsersTable row 3-dot action | "More Details" → opens UserDetailsPage | data-table action template slot (Strategy E) | REUSE+WORKAROUND | per-row action with click handler | P0 FT-01 ellipsis icon inherited — override with token-driven icon button | ⚓ template slot with `<button>` |
| 30 | UserDetailsPage (drilldown) | 3 view tabs + 3 edit tabs, header with avatar | local components composing existing pieces | CUSTOM (page-local) | tab switch, edit mode, save toast | none | new page; not in reference structure — extend Wave plan |
| 31 | Apps & Services tab | 9-col table with status pill variations + row action | `<falcon-angular-data-table>` + `<falcon-angular-status-badge>` | REUSE | dynamic status enum, custom cell | inherited FT-01 | ⚓ data-table |
| 32 | CommChannels & Services tab | 9-col table, same shape as Apps | reuses Apps mechanism | REUSE | — | — | shared `<applications-table>` component |
| 33 | Settings tab — view mode | 2-card layout (radios + IPs + helper text \| numeric limits) + Edit pill | local `<settings-tab>` composing radios + chips + number-input | CUSTOM (page-local, verbatim) | view/edit toggle | none | copy from reference |
| 34 | Settings tab — edit mode | Same fields editable, twin "Current / Max" inputs | local | CUSTOM (page-local, verbatim) | reactive forms | none | copy from reference |
| 35 | Toasts | 3500 ms auto-dismiss, X-button, stacked corner | `<falcon-angular-toast>` (Notifier facade) | REUSE | injection token `FALCON_NOTIFIER` | none | inject `FalconNotifierFacade` |
| 36 | Confirmation dialogs (Delete, Unsaved, etc.) | OK / Cancel pattern | `<falcon-angular-popup>` or `<falcon-angular-confirm-dialog>` | REUSE+WORKAROUND | confirm/cancel events | P0-01 popup focus trap inherited | document gap in feature README |
| 37 | Empty state (no node selected, etc.) | Centered illustration + message | `<falcon-angular-empty-state>` | REUSE | label + icon | none | inject when tree empty |
| 38 | Tooltip / popovers | Hover-driven helper text | `<falcon-angular-tooltip>` | REUSE | — | none | per-element directive |
| 39 | Icons | All admin icons | `<falcon-icon>` + `FALCON_ICONS` constant | REUSE | string token | source uses inline SVG; Angular replaces with `<falcon-icon>` where available; some brand SVGs stay inline as data-URIs | brand logos remain inline tokens |

## 2. Components by recommendation bucket

### USE_AS_IS (REUSE) — 13
`<falcon-tree-panel>` (legacy-in-use, intentional), `<falcon-angular-data-table>`, `<falcon-angular-tabs>`, `<falcon-angular-drawer>`, `<falcon-angular-wizard>`, `<falcon-angular-popup>` (with focus-trap caveat), `<falcon-angular-confirm-dialog>`, `<falcon-angular-otp>` / `<falcon-angular-otp-send-dialog>`, `<falcon-angular-status-badge>`, `<falcon-angular-empty-state>`, `<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`, `<falcon-angular-input-number>`, `<falcon-angular-radio>` / `<falcon-angular-radio-group>`, `<falcon-angular-toast>` (via Notifier), `<falcon-angular-tooltip>`, `<falcon-icon>`, `<falcon-angular-phone-field>`, `<falcon-angular-email-field>`, `<falcon-angular-single-uploader>`, `<send-credentials-popup>`

### CUSTOM (page-local components verbatim from reference) — 38 (matches Agent 3 count)
Listed in Phase 5 architecture plan §3 — the 38 components from the reference, all kept locally inside `org-hierarchy-page/`.

### AVOID (do NOT use) — 4
`<falcon-angular-tree>` (lacks row template until UC-W01), `<falcon-angular-tree-table>` (no data-column use case here), `<falcon-angular-dialog>` (deprecated), `<falcon-angular-table>` (substrate — use data-table), `<falcon-mobile-number>` (legacy), `<falcon-photo-uploader>` (legacy)

## 3. Library upgrade opportunities surfaced (do NOT execute in this feature wave)

These are queued for separate library waves. Documented here so the wave plan can flag dependencies:

| Code | Component(s) | Description | Affects new feature how? | Wave plan note |
|---|---|---|---|---|
| **UC-W01** | `<falcon-angular-tree>` | Per-row template + action slot | We bypass by using `<falcon-tree-panel>` legacy | log dep; do not block |
| **P0-01** | `<falcon-angular-popup>` | Focus-trap (WCAG) | Our dialogs inherit gap | document in feature README |
| **FT-01** | `<falcon-table>` Stencil core | `pi pi-ellipsis-v` PrimeIcon | inherited by data-table row-action | override icon in our template slot |
| **P0-02** | `<falcon-angular-stepper>` (legacy) | Migrate to modern stepper | Wizard host already uses modern wizard, so neutral | log dep |
| **FT-02** | `<falcon-table>` | Keyboard sort | A11y gap — log only | document |
| **FT-03** | `<falcon-table>` | Grid keyboard nav | A11y gap — log only | document |
| **G1** | `<falcon-angular-otp>` wrapper | No `(falconComplete)` Output | use length-check workaround | one-liner in our code |
| **FDT-01** | `<falcon-angular-data-table>` | `(multiSortChange)` ergonomic | none — single sort is fine here | document |

## 4. Resolved decisions (locked for implementation)

| # | Decision point | Resolution | Source |
|---|---|---|---|
| D1 | Tree primitive | `<falcon-tree-panel>` (legacy, production tested) | Agent 4 §5 + §6 |
| D2 | Table primitive | `<falcon-angular-data-table>` (NOT `<falcon-angular-tree-table>`) | Agent 4 §5 |
| D3 | Phone | `<falcon-angular-phone-field>` (NOT `<falcon-mobile-number>`) | Agent 4 §3 item 17 |
| D4 | Photo upload | `<falcon-angular-single-uploader>` + circular mask token | Agent 4 §3 item 18 |
| D5 | OTP completion | Length-check workaround until `(falconComplete)` lands | Agent 4 §3 item 14 |
| D6 | OTP validation rule | Task-brief rule: code === '000000' passes; all else fails. Implementation behind a `ValidationMode` enum so flipping to React's `!== '150999'` rule is a 1-line change | Conflict resolution per Brain SK rule (safest = match user spec) |
| D7 | Menu integration | Option B: add a second NavItem `Org Hierarchy (Admin)` pointing at `/admin-console/org-hierarchy-page` | Agent 3 §15 |
| D8 | Route slug | `org-hierarchy-page` (matches task spec); new route stub in admin-console app.routes.ts | Task brief |
| D9 | HierarchyFacade implementation | New `OrgHierarchyMockFacade` provided at route level, wraps real `NodeService.getNode()` for tree + mocks the rest | Phase 6 report |
| D10 | Standalone + OnPush + signals + zoneless | All new components MUST follow admin-console's pilot pattern | Phase 0 §4 + Agent 3 §9 |
| D11 | i18n keys | 231 distinct keys from reference — reuse same key namespace `hierarchy.*` and `addClient.*`, `addUser.*` | Agent 3 §11 |
| D12 | Mock seed | Keep `mock-tree.ts` shape (ClientNode) but may slim down nodes in v1; preserve 10-level BMW chain for stress test in dev | React Agent §6 |
| D13 | Tokens | Replace 1 anti-pattern (BRAND hex + 2 SVG strokes) with `falcon-*` CSS vars during copy | Agent 3 §14 |
| D14 | Standalone selectors | Inner falcon-org-* selectors stay identical to reference (no global collision) | Agent 3 §16 deviation |
| D15 | Files renamed | Only top-level: `org-hierarchy-page.routes.ts` + `org-hierarchy-page-menu.component.{ts,html}` + selector `app-org-hierarchy-page-menu` | Agent 3 §16 deviation |

## 5. Confidence assessment

| Dimension | Value |
|---|---|
| Source-of-truth understanding | **96 %** (HTML + React + 25 must-preserve behaviors captured) |
| Falcon component readiness | **72 %** out-of-box, **95 %** with workarounds (Agent 4) |
| Backend integration readiness | **80 %** for tree (real `NodeService`), **100 %** for mocked rest |
| Architectural fidelity to reference | **100 %** (verbatim mirror, 91 files) |
| Risk of new library work in this wave | **LOW** — all required upgrades intentionally deferred to separate library waves |

## 6. Open items requiring user confirmation (none blocking implementation)

1. **OTP rule** (D6) — implemented as task-brief rule by default. Confirm or flip the `ValidationMode` enum to React rule at any time.
2. **InfoPanel persistence** (Agent 2 OQ #2) — kept in-memory for v1; no facade write call. Backend persistence is a follow-up ticket.
3. **AddUser Verify buttons** (Agent 2 OQ #3) — reference React code does NOT wire Verify in AddUser; only UserDetailsPage edit mode does. We'll mirror reference exactly (no Verify in AddUser).
4. **KanbanView surfacing** (Agent 2 OQ #7) — copy verbatim but not surface as a third view-toggle option in v1. Available for later flip.
5. **Brand logos** — Aramco PNG + Al-Rajhi/SNB/Bupa/BMW inline SVG/data-URIs — replicate as-is (asset path + data-URI seed).

End of Phase 4 component mapping.
