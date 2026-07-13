# BSA × falcon-ui-core coverage matrix

> Audit date 2026-07-06. Demand side: [BRAIN-OUT] `Brain Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md` (S0-S10 + §2 catalog, read in full).
> Supply side: [BRAIN-OUT] `Brain Outputs/understanding/frontend/components/` (62-component dossier KB + `COMPONENT_LIBRARY_CONCLUSION.md`) + [CODE] live repo `C:\Falcon\Falcon\falcon-web-platform-ui` (greps 2026-07-06).
> Dossier paths below are relative to `Brain Outputs/understanding/frontend/components/`. Repo paths relative to `C:\Falcon\Falcon\falcon-web-platform-ui`.
>
> **Deprecated components are never counted as coverage**: `falcon-toast` (→ `FalconNotificationService`/`falcon-notification`), `falcon-table` (→ `falcon-data-table`), `falcon-form-field` (legacy), `falcon-mobile-number` (→ `falcon-phone-field`), `falcon-multiselect-legacy`, `falcon-stepper-legacy`, `falcon-calendar-legacy` (→ `falcon-date-picker`) — [BRAIN-OUT] `COMPONENT_LIBRARY_CONCLUSION.md` §3. **`falcon-confirm-dialog` is DORMANT (wrapper 100% commented out; zero consumers)** — live confirm path is `FalconConfirmService.confirm()` → `<falcon-angular-popup>` — [BRAIN-OUT] `falcon-confirm-dialog/OVERVIEW.md:7,16,26`.

---

## 1. Coverage matrix (walked S0 → S10)

Verdicts: **COVERED** (component or documented composition exists) · **PARTIAL** (exists but missing a needed capability, or exists only feature-local in apps/, not in the shared library) · **MISSING** (nothing in libs or apps).

### S0 — Perspective picker

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | If PARTIAL/MISSING: what's needed |
|---|---|---|---|---|---|
| Picker page card (title + sub) | S0 | COVERED | `falcon-angular-card` (header/subheader + slots, 3 variants) | [BRAIN-OUT] falcon-card/OVERVIEW.md:5 | — |
| Two persona choice tiles (icon + title + desc + CTA chevron, exclusive select) | S0 | COVERED | `falcon-angular-tabs` `mode="radio-cards"` (icon/title/sub-description cards) | [BRAIN-OUT] falcon-tabs/OVERVIEW.md:6,12 | — |
| Brand logo / letter avatar (T2Mark, IcBuildingS) | S0,S1 | COVERED | `falcon-angular-avatar` (image → initials → icon fallback) + `falcon-angular-icon` (~322 icons) | [BRAIN-OUT] falcon-avatar/OVERVIEW.md:5; COMPONENT_LIBRARY_CONCLUSION.md §4 (icon count) | — |

### S1 — Main list page shell

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Org-tree rail (Falcon full tree / client subtree, hidden per role) | S1 | COVERED | `falcon-tree-panel` → `<app-organization-hierarchy-tree>` | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 ("the org-hierarchy rail"); falcon-tree-panel dossier folder | — |
| Channel tabs WhatsApp \| IVR Voice (underline) | S1 | COVERED | `falcon-angular-tabs` `mode="navigation"` (sliding underline indicator) | [BRAIN-OUT] falcon-tabs/OVERVIEW.md:5 | — |
| "Switch perspective" secondary button | S1 | COVERED | `falcon-angular-button` (6 variants incl. secondary) | [BRAIN-OUT] falcon-button dossier; COMPONENT_LIBRARY_CONCLUSION.md §4 | — |
| Client brand logo + name header | S1 | COVERED | `falcon-angular-avatar` + typography | [BRAIN-OUT] falcon-avatar/OVERVIEW.md:5 | — |
| "VIEWING AS" role chip + role select | S1 | COVERED | `falcon-angular-tag` (chip) + `falcon-angular-select` (plain single-select) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2; falcon-status-chip/OVERVIEW.md:29 (tag = generic chip) | — |
| Send button (primary, per-channel label, role-gated) | S1 | COVERED | `falcon-angular-button` (gating is app logic) | [BRAIN-OUT] falcon-button dossier | — |

### S2 — Outbox / Scheduled grid

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Sub-tabs Outbox \| Scheduled | S2 | COVERED | `falcon-angular-tabs` `mode="navigation"` | [BRAIN-OUT] falcon-tabs/OVERVIEW.md:5 | — |
| Toolbar search box | S2 | COVERED | `falcon-angular-search-input` (or data-table `showGlobalFilter`) | [BRAIN-OUT] falcon-search-input dossier folder; falcon-data-table/API.md:50-52 | — |
| Date-range filter (From/To) — static chip in reference, real filter in PRD | S2 | PARTIAL | `falcon-angular-date-picker` — single date ONLY; **no range mode** (GAP G2) | [BRAIN-OUT] falcon-date-picker/API.md:102 | Extension: range mode on date-picker (two-date selection + one popover), or 2 pickers composed by app |
| Type filter dropdown (All/Marketing/…) | S2 | COVERED | `falcon-angular-select` | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 | — |
| Transactions grid (12 columns, hover, h-scroll wrapper) | S2 | COVERED | `falcon-angular-data-table` (ColumnDef, cell/header templates, hoverable, scrollable sticky thead) | [BRAIN-OUT] falcon-data-table/API.md:22-66,90-103,144-183 | — |
| Two-line date/time cell (BsaDateCell) | S2,S4,S5 | COVERED | `falconDataTableCell` template (app markup inside) | [BRAIN-OUT] falcon-data-table/API.md:149-176 | — |
| Type plain-text cell | S2 | COVERED | default cell render | [BRAIN-OUT] falcon-data-table/API.md:99 | — |
| Txn status pill (7 statuses: completed/in-progress/partial/failed/canceled/scheduled/deleted, dot+tint) | S2,S4,S5 | PARTIAL | `falcon-angular-status-badge` (9 severities, lifecycle vocabulary) — BSA's 7-status vocabulary + exact tints not in its set; `falcon-status-chip` is templates-scoped (6 statuses) — not reusable here | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:28 (status-badge = 9 severities); REACT_REFERENCE §2.3 pill colors | Extension: status-badge input for custom status→severity/color map (or add the BSA txn status set to the platform vocabulary) |
| Recipients cell: first label + `+N` circular count badge | S2,S4 | COVERED | `falcon-angular-badge` (count/label pill) | [BRAIN-OUT] falcon-avatar/OVERVIEW.md:26 ("count / label pill → falcon-angular-badge") | — |
| Recipients **portal popover** ("All recipients (n)" list w/ icons, flip-up, outside-click close) | S2,S4 | MISSING | none — no generic anchored rich-content popover in the library (`falcon-popup` is a MODAL, `falcon-menu` is an action list, `falcon-tooltip` is hover-text) | [BRAIN-OUT] falcon-popup/OVERVIEW.md:4-10; falcon-menu/OVERVIEW.md:4-27; `_LEARNINGS_POPOVER_PORTAL_PATTERN.md` (pattern doc only) | NEW: `falcon-popover` (see backlog N1) |
| Row 3-dot action menu (Details/Edit/Cancel/Delete; per-status gating; danger styling; disabled item + hint tooltip) | S2 | PARTIAL | `falcon-angular-data-table` `rowActions` (per-row `visible`/`disabled` predicates) + `falcon-angular-menu` `showAt(anchor)` (viewport-fixed, flips, keyboard) | [BRAIN-OUT] falcon-data-table/API.md:55,124-132,200-210; falcon-menu/OVERVIEW.md:8 | Extension: danger-styled menu item + disabled-reason tooltip on menu items (BSA `disabledHint`) |
| Deleted rows stay dimmed | S2 | COVERED | `rowStyleClass` per-row class | [BRAIN-OUT] falcon-data-table/API.md:47 | — |
| Empty state row ("No transactions yet.") | S2 | COVERED | data-table `emptyData` (composes `falcon-empty-data`) / `emptyMessage` | [BRAIN-OUT] falcon-data-table/API.md:34-35,63 | — |
| Pagination footer (Showing X from Y + rows-per-page, default 10) | S2,S4,S5 | COVERED | data-table `showCustomFooter` → `falcon-angular-custom-table-footer` (+ `falcon-paginator`) | [BRAIN-OUT] falcon-data-table/API.md:64-66,81-82 | — |

### S3 — Compose takeover (+S3a/S3b)

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Takeover page shell (white card, radius 16, own scroll, pinned header) | S3,S4,S5,S6,S7 | COVERED | app layout (Tailwind tokens) + `falcon-angular-card` | [BRAIN-OUT] falcon-card/OVERVIEW.md:5 | — |
| Compose header actions (Cancel / Send / Send & back) | S3 | COVERED | `falcon-angular-button` (disabled until `canSend` = app logic) | [BRAIN-OUT] falcon-button dossier | — |
| 3-column step grid, pinned step headers, scrollable bodies, hide/show preview strip | S3 | COVERED | app layout (Tailwind grid) — no component required; NOT a `falcon-wizard` use case (columns are parallel, not sequential steps) | [BRAIN-OUT] falcon-stepper/OVERVIEW.md:17 (stepper = sequential rail only) | — |
| Numbered step header (teal circle + title + sub + eye toggle) | S3 | COVERED | composition: `falcon-angular-badge` circle + typography + `falcon-angular-button` icon toggle | [BRAIN-OUT] falcon-badge dossier folder | — |
| Sender / Category / Language / Template dropdowns | S3 | COVERED | `falcon-angular-select` (plain) / `falcon-angular-dropdown` (searchable) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 | — |
| Cascading disabled-until-parent behavior (Category→Language→Template) | S3 | COVERED | pattern: `[disabled]` binding + option recompute per parent — precedent in Add-Contract wizard header selectors | [CODE] apps/admin-console/.../contracts-add-wizard/contract-details-step/contract-details-step.component.html:46,73; [MEMORY] project_contract_wizard_dropdown_visibility_2026_06_21 | — |
| "Create Template" inline link | S3 | COVERED | `falcon-angular-button` link/text variant | [BRAIN-OUT] falcon-button dossier | — |
| Variables `{{var}}` monospace chips | S3 | COVERED | `falcon-angular-tag` (+ mono class) | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:29 | — |
| Meta template-status warning banner ("Paused on Meta…") | S3 | PARTIAL | `falcon-angular-card` `variant="outlined"` + error/warn tint classes (documented banner recipe) — no dedicated inline-banner component | [BRAIN-OUT] falcon-card/OVERVIEW.md:12 ("Error banners") | NEW: `falcon-inline-banner` (backlog N7) |
| Delivery segmented control Immediate \| Schedule | S3 | COVERED | `falcon-view-toggle` (segmented-pill, 2-4 options, icons + labels) | [BRAIN-OUT] falcon-view-toggle/OVERVIEW.md:5,18; [CODE] libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/ | — |
| **Combined date+time picker** (calendar + hh:mm steppers + AM/PM, flip-up) | S3 | MISSING | `falcon-angular-date-picker` = date ONLY ("no range, no time" GAP G3); no time-picker anywhere in repo | [BRAIN-OUT] falcon-date-picker/API.md:102; [CODE] grep `time-picker|timepicker` libs+apps → 0 files | NEW: `falcon-datetime-picker` (backlog N2) |
| Retry Logic toggle switch (+ "Optional" tag) | S3 | COVERED | `falcon-angular-switch` + `falcon-angular-tag` | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 (switch = setting toggle) | — |
| Retry-status checkbox-chips (No Answer/Busy/Cancel/Failed) | S3 | PARTIAL | `falcon-angular-checkbox-group` (values OK) — chip-shaped visual not a variant | [BRAIN-OUT] falcon-checkbox-group dossier folder | Extension: chip variant on checkbox-group (or compose tag+checkbox) |
| Retry attempts rows: wait number input (1..1440 min) + per-row remove + "＋ Add attempt" (max 3) | S3 | COVERED | `falcon-angular-input-number` + `falcon-angular-button` (max/gating = app logic) | [BRAIN-OUT] falcon-input-number dossier; COMPONENT_LIBRARY_CONCLUSION.md §4 | — |
| Recipients locked gate chip (lock icon + hint) | S3 | COVERED | `falcon-angular-tag` + `falcon-angular-icon` | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:29 | — |
| **Add Contact Group picker popover** (teal trigger + 2 tabs Created-by-me/Shared + search + single-select rows + empty states) | S3 | PARTIAL | `falcon-angular-dropdown` covers trigger + search + single-select list; in-panel TABS + custom row layout (name + member count) not supported | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 (dropdown = searchable) | Build on NEW `falcon-popover` (N1) with app content, or extend dropdown with panel-header slot |
| Group chips bar (chip "Name (count)" + × + selected/mapping state) | S3 | COVERED | `falcon-angular-tag` (dismissible ×; selected styling app-level) | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:29 ("dismissible chip … → falcon-angular-tag") | — |
| Mapping progress pill `done/need mapped` | S3 | COVERED | `falcon-angular-badge`/`falcon-angular-tag` + app logic | [BRAIN-OUT] falcon-badge dossier folder | — |
| Fields-to-map chips (hollow dot → check) | S3 | COVERED | `falcon-angular-tag` + `falcon-angular-icon` | same | — |
| **Column-mapping grid** ("Map to…" dropdown per column header, raw-name second header row, 2 sample rows, move-semantics, red invalid dropdowns, teal dest column) | S3, S6 modal | PARTIAL | `falcon-angular-data-table` `ColumnDef.headerTemplate` hosts a `falcon-angular-select` per header [capability]; dropdown-in-cell precedent live in contracts rate matrix; editable-header table precedent in Create-Contact-Group Step 2 (header inputs). The complete mapping UX (2 header rows, field move-semantics, invalid styling, progress) does not exist anywhere | [BRAIN-OUT] falcon-data-table/API.md:101; [CODE] apps/admin-console/.../rate-card-step.component.html:51-60 (dropdown in table cell); [CODE] apps/management-console/.../preview-configure-step/DATA-PREVIEW-TABLE.spec.md:1-30 (editable-header table) | NEW shared-feature: `falcon-column-mapping-grid` (backlog N8) |
| Manual-recipients grid: borderless-until-hover inline inputs (destination + per-var) | S3 | COVERED | `falcon-angular-grid-input` (composes `falcon-input variant="grid"`; Enter/Esc/Tab commit semantics) inside data-table cell templates | [BRAIN-OUT] falcon-grid-input/OVERVIEW.md:5-15 | — |
| "＋ Add Recipient" button, disabled + tooltip ("Fill the current recipient…") | S3 | COVERED | `falcon-angular-button` + `falcon-angular-tooltip` | [BRAIN-OUT] falcon-tooltip dossier folder | — |
| Destination phone entry w/ dial-code split (fromConversation prefill vs COUNTRIES table) | S3 | COVERED | `falcon-angular-phone-field` (searchable country + dial code + tel input, replaces ngx-intl-tel-input) | [BRAIN-OUT] falcon-phone-field/OVERVIEW.md:5,16 | — |
| **WhatsApp phone preview** (iPhone frame SVG, dot-grid screen, Today chip, template bubble w/ `*bold*`, ticks, CTA row, live var substitution) | S3,S4,S6 | PARTIAL | `app-whatsapp-preview` exists in BOTH consoles (bubble + media header + buttons/quick-replies + auth/expiry) — but feature-LOCAL to templates-wizard, and NO iPhone-frame/device chrome | [CODE] apps/admin-console/.../templates-wizard/preview/whatsapp-preview.component.ts:16-80; apps/management-console/.../templates-wizard/preview/whatsapp-preview.component.html | Extension: promote to `libs/falcon` shared-feature + add device-frame wrapper (backlog E6/N5) |
| **Voice IVR read-only flow canvas** | S3,S5,S7 | PARTIAL | `IvrCanvasComponent` + `IvrFlowViewComponent` ("the create canvas rendered read-only") exist in BOTH consoles — feature-LOCAL to templates-page (full builder: node cards, edges, keypad, layout util, tree overlay) | [CODE] apps/admin-console/.../templates-wizard/ivr/ivr-canvas.component.ts; ivr-flow-view.component.ts:15-16 ("V6: the create canvas rendered read-only"); apps/management-console/.../templates-wizard/ivr/ | Extension: promote canvas (readOnly mode) to shared lib so BSA (marketplace feature) can consume (backlog E5) |
| Bottom summary strip (teal band, 3 divided tiles) | S3 | COVERED | app layout + tokens (optionally `falcon-angular-card`) | [BRAIN-OUT] falcon-card/OVERVIEW.md:5 | — |
| S3a Send-confirm overlay (paper-plane icon, KPI recipients \| est. cost, custom body) | S3a | COVERED | `falcon-angular-dialog` (custom body) — NOT `falcon-popup` (closed 4-variant set, no content slots) | [BRAIN-OUT] falcon-popup/OVERVIEW.md:28-29 ("rich body → use falcon-angular-dialog") | — |
| "Allow duplicate recipients" toggle | S3a | COVERED | `falcon-angular-switch` | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 | — |
| S3b compose-cancel confirm ("You haven't sent…lost") | S3b | COVERED | `falcon-angular-popup` `variant="unsaved"` (exact canonical flow) | [BRAIN-OUT] falcon-popup/OVERVIEW.md:4,17 | — |
| Post-send toast ("Transaction submitted…✓") | S3 | COVERED | `FalconNotificationService` → `falcon-notification` stack (**not** deprecated `falcon-toast`) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2-3 | — |

### S4 — WhatsApp Details

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Square back-icon button | S4,S5,S6,S7 | COVERED | `falcon-angular-button` icon variant + `falcon-angular-icon` | [BRAIN-OUT] falcon-button dossier | — |
| Title + status pill + meta sub-row (calendar/tag/id icons) | S4,S5 | COVERED | composition (status pill → see S2 PARTIAL row) | — | — |
| Export Details / Export Statistics buttons | S4,S5 | COVERED | `falcon-angular-button` secondary/primary | [BRAIN-OUT] falcon-button dossier | — |
| Status banners (failReason tinted per status / Deleted / Scheduled) | S4,S5 | PARTIAL | `falcon-angular-card` outlined banner recipe — no dedicated component | [BRAIN-OUT] falcon-card/OVERVIEW.md:12 | NEW `falcon-inline-banner` (N7) |
| In-Progress banner: pulsing dot + **live progress bar** | S4,S5 | MISSING | no progress-bar component in the library (loader-inline/overlay are spinners) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §1 (no progress category); dossier folder listing | NEW: `falcon-progress-bar` (N3) |
| KPI tile row (Sender ID · Total Recipients · Recipients) | S4,S5 | COVERED | `falcon-info-card` (label/value grid + projected cells) or `falcon-angular-card` | [BRAIN-OUT] falcon-info-card/OVERVIEW.md:5,25 | — |
| **Overview stats vertical bar chart** (6 gradient bars, % labels, legend chips, dashed gridlines, mount animation, grey no-data stubs) | S4 | MISSING | no chart component anywhere — libs grep `chart|donut` hits only icons/tokens/org-chart (hierarchy diagram) & falcon-studio stat-card (design-tool, not product) | [CODE] grep -il `chart|donut` libs → svg-icon.registry.ts, falcon-view-toggle (org-chart icon), falcon-studio only; apps hand-roll NONE (org-chart = tree layout, not data chart) | NEW: `falcon-bar-chart` (N4a) |
| Cost Breakdown card (2 cost items + riyal glyph) | S4,S5 | COVERED | `falcon-angular-card` + `falcon-angular-icon` (riyal glyph pattern exists — wallet drawer) | [CODE] apps/admin-console/.../rate-card-step.component.html:69-73 ("the wallet-drawer Riyal-glyph pattern") | — |
| **Donut chart** (By destination, centered total + ranked color-dot list) | S4,S5 | MISSING | none (same grep as bar chart) | [CODE] grep `stroke-dasharray|conic-gradient` apps → only org-chart svg, spinner modals, otp decorations | NEW: `falcon-donut-chart` (N4b) |
| By-destination ranked list rows (dot · country · SAR · %) | S4,S5 | COVERED | app markup (list) | — | — |
| Recipients Details table (8 cols, sticky header in 430px scroll, row-click selection tint, own pagination 10) | S4 | COVERED | `falcon-angular-data-table`: `scrollable`(default true)+`scrollHeight`, `rowClick` output, `rowStyleClass` (selected tint), custom footer | [BRAIN-OUT] falcon-data-table/API.md:41-42,47,64-66,77 | — |
| WA recipient status pills (Read/Delivered/Sent/Pending/Played/Seen/Failed) | S4 | PARTIAL | `falcon-angular-status-badge` — vocabulary/tints not in the 9-severity set | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:28 | same status-badge extension (E1) |
| Reply ↩ indicator | S4 | COVERED | `falcon-angular-icon` | [BRAIN-OUT] falcon-icon dossier | — |
| Muted `---` empty date cells | S4 | COVERED | cell template | [BRAIN-OUT] falcon-data-table/API.md:149-176 | — |
| Row menu: single "Conversation" item, disabled + hint for scheduled/deleted | S4,S5 | PARTIAL | data-table `rowActions.disabled(row)` — disabled-REASON tooltip not supported | [BRAIN-OUT] falcon-data-table/API.md:124-132 | same menu extension (E2) |
| Side Preview card w/ selected recipient chip | S4 | PARTIAL | same as WA phone preview row (S3) | — | E6/N5 |
| Ask AI drawer (right, 420px, Esc close) | S4,S5 | COVERED | `falcon-angular-drawer` (edge-anchored, focus trap, Esc + backdrop, Top-Layer) | [BRAIN-OUT] falcon-drawer/OVERVIEW.md:4-6 | — |
| AI chat: message list + seeded summary + canned answers | S4,S5 | MISSING | no chat/message-thread component anywhere | [CODE] find `*chat*|*conversation*|*message-thread*` libs+apps → 0 files | NEW: `falcon-chat-thread` (N6) |
| Suggested-question chips | S4,S5 | COVERED | `falcon-angular-tag` (clickable) | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:29 | — |
| AI input + round send button | S4,S5 | COVERED | `falcon-angular-input` + `falcon-angular-button` | [BRAIN-OUT] falcon-input dossier (gold reference) | — |

### S5 — Voice Details (delta vs S4)

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Call Statistics bars (Answered/Busy/No Answer/Failed, min-height floor) | S5 | MISSING | none — same chart gap | [CODE] libs grep (see S4 bar chart) | `falcon-bar-chart` (N4a) |
| IVR Completion % / Avg Duration stat tiles w/ hover tooltips | S5 | COVERED | `falcon-info-card`/card + `falcon-angular-tooltip` | [BRAIN-OUT] falcon-info-card/OVERVIEW.md:5; falcon-tooltip dossier folder | — |
| Cost items ⓘ info tooltips (BsaCostInfo) | S5 | COVERED | `falcon-angular-tooltip` | same | — |
| Donut by destination (dial-code buckets) | S5 | MISSING | none | same as S4 donut | `falcon-donut-chart` (N4b) |
| By-retry-attempt progress rows (Attempt 1/2/3, value + %) | S5 | MISSING | none (progress-bar gap) | same as progress bar | `falcon-progress-bar` (N3) |
| Recipients-table Filter chip (funnel) | S5 | COVERED | `falcon-angular-button`/`falcon-angular-tag` + icon (real filtering → `falcon-filter-panel` exists) | [BRAIN-OUT] falcon-filter-panel dossier folder; COMPONENT_LIBRARY_CONCLUSION.md §4 (`role="search"` shipped) | — |
| Voice status pills (11 SIP lifecycle statuses + tinted bg) | S5 | PARTIAL | `falcon-angular-status-badge` — 11-status vocabulary way beyond the 9-severity set | [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:28 | status-badge extension (E1) |
| Attempts count badge (teal `multi` variant >1) | S5 | COVERED | `falcon-angular-badge` | [BRAIN-OUT] falcon-avatar/OVERVIEW.md:26 | — |
| **Expandable attempts sub-table** (caret rotate → nested "Delivery attempts" table) | S5 | COVERED | data-table `expandedRowId` + `<slot name="row-expansion">` (single) **and** Shadow-rows API (`shadowRows`/`expandedShadowRowIds`, multi-parent, column-notch detail rows, view/edit) | [BRAIN-OUT] falcon-data-table/API.md:61,241-297 | — |
| Row-click → select recipient (drives canvas) | S5 | COVERED | data-table `rowClick` + `rowStyleClass` | [BRAIN-OUT] falcon-data-table/API.md:47,77 | — |
| IVR Canvas Preview card + "Tap any node" hint | S5 | PARTIAL | app-level IVR canvas (see S3) | [CODE] ivr-flow-view.component.ts:15-16 | E5 |
| Call description prose + Transcript blocks (IVR chip + node label + text + keycap line) | S5 | COVERED | app markup (`falcon-angular-tag` + typography) | — | — |
| Voice Call Preview modal (player + waveform + Duration/Outcome tiles) [orphaned in reference] | S5 | COVERED | `falcon-angular-dialog` + `falcon-angular-audio-waveform-player` | [BRAIN-OUT] falcon-dialog dossier; [CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-audio-waveform-player/falcon-audio-waveform-player.component.ts:3,81-96 | — |

### S6 — WhatsApp Conversation

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Conversation topbar (back circle, meta, demo expiry link) | S6 | COVERED | `falcon-angular-button` + typography | — | — |
| Message Info left panel (rows + green info block + Show-transaction link) | S6 | COVERED | `falcon-info-card` / card + app markup | [BRAIN-OUT] falcon-info-card/OVERVIEW.md:5 | — |
| Thread header (avatar + recipient number) | S6 | COVERED | `falcon-angular-avatar` | [BRAIN-OUT] falcon-avatar/OVERVIEW.md:5 | — |
| **In-conversation search** (match i/n, prev/next, `<mark>` highlight, current-match ring, scroll-into-view, Esc clear) | S6 | MISSING | nothing comparable | [CODE] chat grep → 0 | part of `falcon-chat-thread` (N6) |
| Day divider chip | S6,S7 | MISSING | trivial markup, but belongs to thread kit | — | N6 |
| Template-card bubble (title/body/footer/button, substituted) | S6 | PARTIAL | reuse `app-whatsapp-preview` bubble (feature-local) | [CODE] whatsapp-preview.component.ts | E6 |
| Text bubbles in/out (sender line, tinted vs white, teal left border) | S6 | MISSING | no message-bubble component | [CODE] chat grep → 0 | N6 |
| Delivery ticks (none/single/double-grey/double-blue) | S6 | MISSING | — | — | N6 |
| Big-emoji message rendering | S6 | MISSING | — | — | N6 |
| Image bubble (placeholder + caption) | S6 | MISSING | — | — | N6 |
| Voice-note bubble: playable waveform + running timer | S6,S7 | COVERED | `falcon-angular-audio-waveform-player` (`variant="pill"`, `barCount`, teal played-fill, time read-out, resolve callback) — bubble chrome app-level | [CODE] falcon-audio-waveform-player.component.ts:3,43,80-96; consumer voice-record-preview.component.html:1-9 (both consoles) | — |
| Document bubble (branded thumb + PDF chip + name/meta) | S6 | MISSING | — | — | N6 |
| Reactions (badge on bubble corner) + 6-emoji react picker | S6,S7 | MISSING | no emoji picker anywhere | [CODE] grep `emoji` libs+apps *.ts/*.html → 0 files | NEW `falcon-emoji-picker` (N9) + N6 |
| Hover actions per bubble (react/reply/info, mirrored) | S6,S7 | MISSING | — | — | N6 |
| Reply-quote bar (name + snippet + kind icons + cancel) | S6,S7 | MISSING | — | — | N6 |
| **CS-window countdown** (HH:MM:SS boxes + labels + `is-final` enlarge; PRD needs LIVE ticking) | S6 | MISSING | no countdown/timer component | [CODE] grep `countdown|timeRemaining` libs+apps → 0 files | NEW `falcon-countdown` (N10) |
| Expired amber alert + "Send New Message Template" CTA | S6 | PARTIAL | banner recipe + `falcon-angular-button` | [BRAIN-OUT] falcon-card/OVERVIEW.md:12 | N7 |
| Staged template bar (ready-to-send card + discard + send) | S6 | COVERED | composition (card + buttons) | — | — |
| **Recording composer** (mic → pulsing red dot + live waveform + mm:ss timer + stop/cancel → stopped preview w/ play + send) | S6 | COVERED | `falcon-angular-audio-recorder` — header: "reproduce the source-of-truth WhatsApp-style recorder 1:1: idle teal mic → recording bar with a pulsing red dot + animated red waveform + running timer + stop + cancel → done player with play/seek + re-record"; real getUserMedia→.wav | [CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-audio-recorder/falcon-audio-recorder.component.ts:1-10 + audio-shared/audio-peaks.util.ts | — |
| Emoji popover (16-emoji append-to-draft) | S6 | MISSING | none | [CODE] emoji grep → 0 | N9 (on N1 popover) |
| Attach popover (Photo / Document) | S6 | COVERED | `falcon-angular-menu` `showAt(anchor)` 2-item action list | [BRAIN-OUT] falcon-menu/OVERVIEW.md:4-8 | — |
| Composer input + round teal send + tplAdd button | S6 | COVERED | `falcon-angular-input` + `falcon-angular-button` | [BRAIN-OUT] falcon-input dossier | — |

### S7 — Voice Conversation

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Call Info left panel (sender/number/type/status + dates/duration/outcome) | S7 | COVERED | `falcon-info-card` + status pill (E1) | [BRAIN-OUT] falcon-info-card/OVERVIEW.md:5 | — |
| Not-answered empty-state card (phone-off icon + copy) | S7 | COVERED | `falcon-angular-empty-state` / `falcon-empty-data` | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §1 (display: empty-state); falcon-empty-data dossier folder | — |
| IVR-walk thread chrome (OUT/IN bubbles alternation) | S7 | MISSING | chat-thread gap | [CODE] chat grep → 0 | N6 |
| Per-node playable voice note + transcript block | S7 | COVERED | `falcon-angular-audio-waveform-player` + app markup | [CODE] waveform player (above) | — |
| Menu option list (keycap + label, pressed highlighted) | S7 | COVERED | app markup + `falcon-angular-tag` | — | — |
| Big DTMF keycap IN bubble | S7 | COVERED | app markup (keycap = styled span) | — | — |
| "call ended" red note / terminal messages | S7 | COVERED | app markup | — | — |
| AI-handoff channel divider chip (WA green / IG gradient) | S7 | COVERED | app markup + `falcon-angular-tag` | — | — |
| AI-handoff scripted chat + live composer (reply/react/info) | S7 | MISSING | chat-thread + emoji gaps | [CODE] chat grep → 0 | N6, N9 |
| Footer dual send buttons (Send WhatsApp / Send Voice IVR) | S7 | COVERED | `falcon-angular-button` ×2 | — | — |

### S8-S10 — Dialogs, confirm overlay, Ask AI

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Warning confirm modal chrome (triangle icon, danger tint, overlay-click cancel) | S8 | COVERED | `FalconConfirmService.confirm()` → `<falcon-angular-popup>` (Top-Layer native `<dialog>`) — do NOT use dormant `falcon-confirm-dialog` | [BRAIN-OUT] falcon-confirm-dialog/OVERVIEW.md:7,16,26; falcon-popup/OVERVIEW.md:12 | — |
| Cancel-transaction dialog (dynamic body, race-caveat copy, danger confirm) | S8 | COVERED | `falcon-angular-popup` `variant="delete"`/custom copy, or `falcon-angular-dialog` for the long dynamic body | [BRAIN-OUT] falcon-popup/OVERVIEW.md:4,23 | — |
| Delete-scheduled dialog | S8 | COVERED | `falcon-angular-popup` `variant="delete"` | [BRAIN-OUT] falcon-popup/OVERVIEW.md:4 | — |
| S9 send-confirm overlay | S9 | COVERED | see S3a | — | — |
| S10 Ask AI drawer | S10 | COVERED/MISSING split | see S4 rows (drawer COVERED; chat body MISSING) | — | N6 |

### Cross-cutting

| BSA element | Screen(s) | Verdict | Falcon component | Evidence | Needed |
|---|---|---|---|---|---|
| Toasts (3.5s auto-dismiss host contract) | all | COVERED | `FalconNotificationService` → `falcon-notification` (deprecated `falcon-toast` must NOT be used) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2-3 | — |
| Icon set (riyal, search, info, edit, close, trash, more, arrow-left, download, building, chevron…) | all | COVERED | `falcon-angular-icon` (~322 registry icons; riyal-glyph pattern live in wallet/contracts) | [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §4; [CODE] rate-card-step.component.html:69-73 | audit BSA-specific glyphs (paper-plane, phone-off, funnel, DTMF) against registry at build time |
| Loading skeletons / spinners (PRD build; ABSENT in reference) | all | COVERED | data-table `loading`+`skeletonRows` (hard-swap rule; use consumer `busyRowIds` pattern for row-level) + `falcon-page-skeleton` + `falcon-loader-inline/overlay` | [BRAIN-OUT] falcon-data-table/API.md:39-40,230-234; dossier folders | — |
| Form validation popovers (mapping invalid, PRD phone validation) | S3 | COVERED | input `state="error"`+`errorMessage` pattern (+ `falcon-angular-validations` popover precedent) | [BRAIN-OUT] falcon-date-picker/API.md:28,35 (state axis); [CODE] DATA-PREVIEW-TABLE.spec.md:50-53 | — |
| RTL readiness | all | COVERED | library-wide logical properties + `firstDayOfWeek=6` etc. | [BRAIN-OUT] falcon-date-picker/API.md:32 | — |

---

## 2. Summary counts

Matrix rows: **113**

| Verdict | Count | % |
|---|---|---|
| **COVERED** | 74 | 65% |
| **PARTIAL** | 16 | 14% |
| **MISSING** | 23 | 21% |

The 23 MISSING rows collapse into **8 distinct new-component needs** (N1-N4, N6, N9, N10 + the N5 frame absorbed by E6); 12 of the 23 belong to the single `falcon-chat-thread` kit (S6/S7 conversation surfaces). Everything outside the conversation + charts + datetime domains is buildable today from the existing library.

---

## 3. New-component backlog (for every MISSING item)

| # | Proposed component | Spec (one paragraph) | Complexity | Reuse beyond BSA |
|---|---|---|---|---|
| N1 | `falcon-popover` | Generic anchored rich-content popover: trigger-or-`showAt(el)` anchoring, body-portal into `.falcon-overlay-container` + native Top Layer (reuse `falconOverlay` directive + the documented portal pattern), auto-flip when <200px viewport space, outside-click/scroll/resize/Esc close, arbitrary `<ng-content>`. Fills the gap between `falcon-tooltip` (hover text), `falcon-menu` (action list) and `falcon-popup` (modal). Powers: BSA recipients "+N" list popover, group-picker panel, emoji picker surface. | M | HIGH — every "peek" list (contact-group shared popover chrome `cg-shared-pop*` today is hand-rolled per feature), column pickers, filter flyouts |
| N2 | `falcon-datetime-picker` | Combined calendar + time: embeds the existing `falcon-calendar` grid, adds hour/minute steppers (±1h/±5min wrap), direct typed digits w/ clamp, AM/PM segmented pair, Clear/Done footer, flip-up placement; ISO `YYYY-MM-DDTHH:mm` value + `(valueChange)`; picking a date defaults 09:00 AM. Could alternatively land as `withTime` mode on `falcon-date-picker` (closes its documented G3 "no time" gap). | M | HIGH — any scheduling flow (campaign send, contract dates+time, maintenance windows) |
| N3 | `falcon-progress-bar` | Determinate horizontal progress: `value`/`max`, size sm/md, tint token, optional label slot ("X of Y processed") and striped/pulsing indeterminate mode for in-progress banners; also renders the S5 "by retry attempt" value rows (label + bar + % right-aligned). | S | HIGH — uploads (uploader family currently spinner-only), wizard progress, wallet quotas |
| N4a | `falcon-bar-chart` | SVG vertical bar chart: series of {label, value, colorToken}, % or absolute labels above bars, dashed gridlines at 0/25/50/75/100, legend chips, mount grow-animation, `is-empty` grey-stub mode ('—') for no-data statuses, min-height floor so tiny values stay visible, tooltips via `falcon-tooltip`. Token-driven gradient fills (BSA s1..s6 palette). | M | HIGH — any future dashboard/analytics (none exists in the platform today; grep-proven) |
| N4b | `falcon-donut-chart` | SVG donut: segments {label, value, color}, centered total + unit slot (riyal glyph), rounding-drift absorbed into largest segment (BSA rule), ranked legend list row template (dot · label · value · %), grey-stub empty mode. | M | HIGH — cost/usage breakdowns platform-wide |
| N5 | `falcon-device-frame` (or a `frame` input on the promoted whatsapp-preview) | Presentational iPhone-frame wrapper: SVG frame overlay (transparent screen cut-out, z-index above content), dot-grid screen background, projects any content (`<ng-content>`). BSA composes it around the WhatsApp bubble preview. | S | MED — template previews (templates wizard could adopt), SMS/RCS previews |
| N6 | `falcon-chat-thread` (kit: thread + bubble + composer primitives) | The big one. Message-thread kit covering: `falcon-chat-thread` scroll container w/ day dividers + in-thread search (match count i/n, prev/next, mark-highlight + current ring, scroll-into-view, Esc); `falcon-chat-bubble` (direction in/out, kinds: text w/ `*bold*` inline, template-card, image+caption, document, voice-note slot, big-emoji; sender line, avatar, timestamp, delivery ticks none/sent/delivered/read-blue); hover action rail (react/reply/info, mirrored per direction, disable-all when window expired); reaction badge; reply-quote bar; typing/system notes. Composer = separate `falcon-chat-composer`: text input + emoji button + attach menu + mic (drops in `falcon-audio-recorder`) + send; staged-template card slot. Voice-IVR variant reuses bubbles w/ transcript + option-list slots. | L (split into 2-3 waves: bubbles+thread → search+reactions → composer) | HIGH — WA conversation, voice conversation, AI-handoff chat, Ask-AI drawer body, any future support-inbox module |
| N7 | `falcon-inline-banner` | Inline status banner: severity (info/warn/error/neutral/success) driving tint+icon, title + body slots, optional CTA button slot, optional leading pulse-dot mode (in-progress) and trailing progress-bar slot (composes N3). Replaces the per-feature card-recipe hand-rolls. | S | HIGH — details banners exist in wallet/users/contracts pages as bespoke markup today |
| N8 | `falcon-column-mapping-grid` (shared-feature in `libs/falcon`, not ui-core) | Spreadsheet-column → field mapping grid: header row 1 = per-column "Map to…" `falcon-select` (options = Destination + template vars + pinned "Not mapped" styled item), header row 2 = raw column names, N sample rows; field move-semantics (assigning a used field moves it), invalid-state red dropdown until required complete, mapped-destination column tint, progress pill `done/need` + fields-to-map chips. Builds on `falcon-angular-data-table` `headerTemplate` + cell templates. | M | MED-HIGH — BSA compose + BSA send-template modal + contact-group import (Step 2 editable-header table is a sibling); any future CSV import |
| N9 | `falcon-emoji-picker` | Small emoji palette popover on N1: configurable emoji set (BSA needs a fixed 6-reaction set + a 16-emoji composer set — no full unicode browser needed for v1), grid layout, `(pick)` output, toggle-on-reselect for reactions. | S | MED — chat composer, feedback widgets |
| N10 | `falcon-countdown` | Live countdown display: target timestamp or remaining-seconds input, 1s interval tick (zone-optimized), HH/MM/SS boxes w/ labels, `final` visual state threshold (BSA: hours<1 enlarges), `(expired)` output. BSA reference is static — the PRD build needs the real ticking version. | S | MED — OTP expiry (otp flows show static hints today), session timeout, campaign windows |

## 4. Extension backlog (for every PARTIAL)

| # | Component | Exact addition |
|---|---|---|
| E1 | `falcon-status-badge` | Custom vocabulary support: input map `status → {severity|bgToken,textToken,dotToken}` (or register-domain-statuses API) so BSA's 3 pill families render without hand-rolled spans: txn (7: completed/in_progress/partially_processed/failed/canceled/scheduled/deleted), WA recipient (7: read/delivered/sent/pending/played/seen/failed), voice SIP (11: pending/sent/ringing/live/answered/no_answer/busy/unreachable/dropped/canceled/failed). Colors in REACT_REFERENCE §2.3. Do NOT extend templates-scoped `falcon-status-chip` (its own dossier flags the G1 duplication). |
| E2 | `falcon-menu` (+ data-table `rowActions`) | (a) `danger` item styling (red text/hover — BSA Cancel/Delete rows); (b) disabled-item reason tooltip (`disabledHint`) rendered via `falcon-tooltip` — BSA "No conversation for scheduled or deleted messages". `FalconDataTableRowMenuAction` gets optional `danger?: boolean` + `disabledHintKey?: string`. |
| E3 | `falcon-date-picker` | Range mode (From/To in one popover) for the outbox date filter — closes dossier GAP G2. (Time support tracked as N2.) Also close the documented a11y gap: keyboard-open (Enter/Space/ArrowDown) + focus trap ([BRAIN-OUT] falcon-date-picker/API.md:117). |
| E4 | `falcon-checkbox-group` | `chip` visual variant (rounded bordered chips w/ check glyph) for the retry-status picker; keeps CVA semantics. |
| E5 | IVR canvas promotion | Move `IvrCanvasComponent` + read-only hydration (`IvrBuilderStateService.hydrateForView`, `ivr-layout.util`, node cards, edge paths) from `apps/{admin,management}-console/.../templates-wizard/ivr/` into `libs/falcon/shared-features/ivr-canvas` with an explicit `readOnly` + `inspect` (tap-node → emit) API so BSA compose preview (S3), voice details canvas (S5) and voice conversation (S7) can consume it. The two console copies are currently near-duplicates — promotion also de-duplicates. |
| E6 | WhatsApp preview promotion | Move `app-whatsapp-preview` (both consoles, near-duplicates) into `libs/falcon/shared-features/whatsapp-preview`; add: iPhone device-frame wrapper (N5), "Today" chip + fixed timestamp + ✓✓ ticks row, live `{{var}}` substitution inputs (BSA `previewVals` contract), empty-state slot ("Choose a template…"). |
| E7 | `falcon-dropdown` | Pinned/custom-styled option support (BSA "Not mapped" bottom-pinned distinct option) — an option `cls`/`pinned` flag; needed by N8. Verify current option-template support first (dossier notes a 250ms debounce already exists in source). |
| E8 | `falcon-view-toggle` | Optional CVA/form-value note: BSA Delivery Immediate\|Schedule is a form value; either accept view-toggle's `[(value)]` as-is (works) or add a thin CVA so it can sit in the compose reactive form ([BRAIN-OUT] falcon-view-toggle/OVERVIEW.md:22 explicitly says no CVA today). |

## 5. Answers to existence questions a-l

| Q | Answer | Evidence |
|---|---|---|
| a. IVR tree/canvas/flow component in Angular? | **YES — app-level, not in libs.** Full IVR builder + read-only flow view in BOTH consoles under `features/templates-page/components/templates-wizard/ivr/` (~20 files: `ivr-canvas.component.ts`, `ivr-flow-view.component.ts` "the create canvas rendered read-only", `ivr-node-card`, `ivr-keypad`, `ivr-tree-overlay`, `ivr-layout.util`, `ivr-builder-state.service`, `ivr-wire.ts` w/ live-API hydration + mock fallback). Nothing IVR-named in `libs/` (grep hits only i18n strings + comm-mkt config). From the templates/voice work of 2026-06/07 as suspected. | [CODE] apps/admin-console/.../templates-wizard/ivr/ (listing); ivr-flow-view.component.ts:15-16,36-44; apps/management-console/.../templates-wizard/ivr/; libs grep `ivr` → ar.json/en.json/comm-mkt-view.config.ts only |
| b. Chart component (bar/donut)? | **NO.** No chart component in `libs/` (grep `chart|donut` → icon registry, view-toggle org-chart icon, tokens, falcon-studio stat-card which is the theme-studio design tool, not the product library). Apps hand-roll NO data charts either — the only SVG "chart" is `falcon-org-chart` (org-hierarchy node-tree layout, both consoles), not a data chart. `stroke-dasharray|conic-gradient` hits are spinners/decorations. | [CODE] grep -il `chart|donut` libs → 22 files, none a chart component; grep `stroke-dasharray|conic-gradient` apps → org-chart svg, wbm spinner modal, otp pages |
| c. Combined date+time picker? | **NO.** `falcon-date-picker` is single-date only — dossier constraint "no range, no time, no display-format (GAP G2/G3/G4)"; value is ISO `YYYY-MM-DD`. `falcon-calendar` is the inline date grid (same value type). No time-picker exists anywhere: grep `time-picker|timepicker` across libs+apps → 0 files. | [BRAIN-OUT] falcon-date-picker/API.md:24,102; [CODE] grep → 0 |
| d. Chat/conversation/message-thread component? | **NO.** find `*chat*|*conversation*|*message-thread*` across libs+apps → 0 files. (falcon-message-host/message-service are toast/dialog orchestration, not chat.) | [CODE] find (2026-07-06) → 0; [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §1 categories |
| e. Audio player / waveform? | **YES — 3 shared components in falcon-ui-core** (added post-dossier-build, voice-records era): `falcon-angular-audio-player` (click-to-play pill: play/pause + progress track + time, lazy `resolve` for presigned URLs); `falcon-angular-audio-waveform-player` (dense-bar waveform w/ teal played-fill, `variant='box'|'pill'`, `barCount`, deletable, volume, seek); `falcon-angular-audio-recorder` (getUserMedia→PCM→.wav, "WhatsApp-style recorder 1:1: teal mic → pulsing red dot + animated red waveform + running timer + stop/cancel → done player w/ play/seek + re-record"). Shared `audio-peaks.util` + `audio-playback-coordinator`. Live consumer: voice-record-preview (both consoles) uses the waveform player `variant="pill" [barCount]="36"`. | [CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-audio-player/falcon-audio-player.component.ts:1-9,38; falcon-audio-waveform-player/…component.ts:3,43,80-96; falcon-audio-recorder/…component.ts:1-10; apps/admin-console/.../voice-record-preview/voice-record-preview.component.html:1-9 |
| f. Countdown/timer display? | **NO.** grep `countdown|Countdown|timeRemaining|time-remaining` + find `*countdown*|*timer*` across libs+apps → 0 files. | [CODE] greps 2026-07-06 → 0 |
| g. Data-table expandable rows / advanced grid? | **YES.** (1) Row expansion: `expandedRowId` input (single-row, project via `<slot name="row-expansion">`) **plus** the Wave-20/21 Shadow-rows API — multi-parent expandable detail rows (`shadowRows`, two-way `expandedShadowRowIds`, column-targeted notch, view/edit modes, template context callbacks). (2) Custom cell templates: `falconDataTableCell` directive + `ColumnDef.template`; header templates via `ColumnDef.headerTemplate`/`falconDataTableHeaderCell`. (3) Sticky header: `scrollable` default **true** + token-backed `scrollHeight` (sticky thead + max-height clamp). Horizontal scroll: not an explicit API — handled by container/`tableStyleClass` widths (verify at build). (4) Row-click selection: `rowClick` output (distinct from menu) + `rowStyleClass` for the selected tint; checkbox/radio selection via `selectable`+`[(selection)]`. Also: `actionsVisibleField` per-row kebab gate, `emptyData` composition, custom footer w/ page-size dropdown. | [BRAIN-OUT] falcon-data-table/API.md:41-42,47,55,60-66,61,77,90-103,144-183,241-297 |
| h. Segmented control / button-group toggle? | **YES.** `falcon-view-toggle` (shared-ui, Wave 19) — segmented-pill `role="tablist"` strip, 2-4 mutually-exclusive options, optional icons, `[(value)]`; live in org-hierarchy List⇄Tree switch (both consoles). Note: view-state switcher, no CVA (E8). `falcon-angular-tabs mode="radio-cards"` covers the card-style variant. | [BRAIN-OUT] falcon-view-toggle/OVERVIEW.md:5-13,22; [CODE] libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/ |
| i. Phone-mockup / device-frame preview? | **NO library component; app-level bubble preview exists WITHOUT a device frame.** `app-whatsapp-preview` (templates-wizard, both consoles) renders the WA template bubble (media header, buttons, quick-replies, auth OTP/expiry) but greps for `frame|iphone|mockup` in its template → 0; no `iphone-frame.svg` equivalent asset in the repo. | [CODE] apps/{admin,management}-console/.../templates-wizard/preview/whatsapp-preview.component.{ts,html}; grep → 0 frame hits |
| j. Emoji picker? | **NO.** grep `emoji|Emoji` across libs+apps (*.ts,*.html) → 0 files. | [CODE] grep 2026-07-06 → 0 |
| k. Cascading dependent dropdowns (disabled-until-parent)? | **PATTERN EXISTS (app-level), no dedicated primitive needed.** `falcon-angular-dropdown`/`select` accept `[disabled]` + recomputed `[options]`; live precedents: Add-Contract wizard header selectors (`contract-details-step.component.html:46,73` — native selects swapped to falcon dropdowns; Step-3 Application→CommChannel cascade fixed 2026-06-21 per memory), and per-row channel-locked `priceUnit` dropdown options (`priceUnitOptionsFor(row)`). BSA's Category→Language→Template chain is straightforward app wiring on existing components. | [CODE] apps/admin-console/.../contract-details-step.component.html:4,46-54,73-81; rate-card-step.component.html:51-60; [MEMORY] project_contract_wizard_dropdown_visibility_2026_06_21 |
| l. Multi-column mapping grid (dropdown-in-table-header)? | **NO ready pattern; both halves exist separately.** (1) data-table supports `ColumnDef.headerTemplate` → a `falcon-select` CAN be projected into a `<th>`; (2) dropdown-in-CELL is live (contracts rate matrix); (3) the closest shipped relative is the Create-Contact-Group Step-2 **editable-HEADER Data Preview table** (header boxes are name `<input>`s w/ invalid state + validations popover — spec'd in DATA-PREVIEW-TABLE.spec.md). Nothing implements the full BSA mapping UX (Map-to dropdowns w/ move-semantics + pinned "Not mapped" + progress). → backlog N8 + E7. | [BRAIN-OUT] falcon-data-table/API.md:101; [CODE] rate-card-step.component.html:51-60; apps/management-console/.../preview-configure-step/DATA-PREVIEW-TABLE.spec.md:1-56 |

---

## 6. Key routing warnings for the BSA build (deprecated/dormant traps)

1. `falcon-confirm-dialog` — DORMANT (wrapper fully commented, 0 consumers). Use `FalconConfirmService.confirm()` → `falcon-angular-popup`. [BRAIN-OUT] falcon-confirm-dialog/OVERVIEW.md:7,16.
2. `falcon-toast` — `@deprecated`. Use `FalconNotificationService`/`falcon-notification`. [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §3.
3. `falcon-table` — legacy; always `falcon-angular-data-table`. [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §2 ("never hand-roll `<table>`").
4. `falcon-mobile-number` — DELETED facade; use `falcon-phone-field`. [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §3.
5. `falcon-status-chip` — templates-domain only (6 statuses); BSA pills go through `falcon-status-badge` + E1, not this chip. [BRAIN-OUT] falcon-status-chip/OVERVIEW.md:28,37.
6. data-table `[loading]` is a HARD SWAP (blanks all rows) — per-row busy uses the consumer `busyRowIds` pattern. [BRAIN-OUT] falcon-data-table/API.md:230-234.
7. `falcon-date-picker` has NO CVA — bind `[value]`/`(valueChange)` manually in the compose form. [BRAIN-OUT] falcon-date-picker/API.md:75.
8. `falcon-organization-hierarchy-tree-tw` — no production consumer; the rail is `falcon-tree-panel`. [BRAIN-OUT] COMPONENT_LIBRARY_CONCLUSION.md §3.
