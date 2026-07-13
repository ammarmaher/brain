---
name: basic-app-falcon-components-no-native-html-2026-07-13
description: "apps/basic-app shared components — full native-HTML→Falcon-component migration (user mandate, no native <button>/<table>/<input>/<label>): Phases 1-4 DONE + verified (2 tables→falcon-angular-data-table w/ editable cells + focus guard, 19 buttons→falcon-angular-button, delivery/mine-share→falcon-angular-tabs, retry chips→falcon-angular-checkbox, label→switch [label], recipients-cell→falcon-angular-multi-select chip-list); ZERO native interactive tags remain; Phase 5 (Brain SK per-component tree) REMAINING"
metadata:
  node_type: memory
  type: project
  originSessionId: 14fc28fa-5c64-42b3-95c0-27f424982061
---

**User mandate (2026-07-13, plan-approved):** apps/basic-app shared components were using native
`<button>`/`<table>`/`<input>`/`<label>` — the standing rule ([[feedback_falcon_no_native_html_use_components]],
[[feedback_falcon_ui_library_only_no_native]], [[feedback_falcon_custom_library_mandatory]]) forbids that.
Replace ALL native interactive controls with Falcon library components; full Brain SK per-component tree;
convert overlay shells to Falcon "where possible". Plan file: `C:\Users\User\.claude\plans\tender-wiggling-ember.md`.

**Inventory (start):** 41 native controls — compose 34 (12 button, 2 table, 2 input), group-picker 4 button,
date-range 1 button, send-confirm 1 label, recipients-cell 1 button.

**DONE + live-verified (standalone :4315, light, normal-user Send):**
- **Phase 1 — tables → `falcon-angular-data-table`.** New child components (Brain SK tree: component + models/models.ts + index.ts):
  `basic-app-compose/basic-app-mapping-table` (dynamic col per source column; header = "Map to…" falcon-dropdown
  with `[state]` error stacked over the column-name band via `*falconDataTableHeaderCell` in @for; body =
  sample rows, teal highlight on `__dest`) and `basic-app-compose/basic-app-manual-recipients` (dynamic cols
  Destination+vars+actions; editable cells = `falcon-angular-input` via `*falconDataTableCell` in @for; delete =
  falcon-button iconOnly). **CRITICAL focus guard** (contract-details-step precedent, my memory
  [[project_contracts_input_disappears_datatable_reprojection_rootcause]]): `structureKey` computed (vars +
  row-ids), `[data]` computed reads values under `untracked()`, `@for (k of [structureKey()])` recreate-guard,
  `dataKey` = stable id (added `id` to BasicAppManualRecipient), `[ngModelOptions]={standalone:true}`. Set
  `[showCustomFooter]="false"` (data-table shows a paginator footer by default). LIVE-VERIFIED: typed 10 chars in
  a manual cell → focus retained, no chars lost.
- **Phase 2 — 19 `<button>` → `falcon-angular-button`.** compose (create-template=variant link, add-attempt/
  add-recipient with icon-start ＋ + slot=label, remove-× iconOnly, preview collapse/expand = fullWidth + `rootClass`
  overrides projecting the header into slot=label, group-chip label+× = ghost + `rootClass !p-0 !border-0
  !bg-transparent`), group-picker (trigger primary + caret; option rows = ghost fullWidth, name+count in slot=label),
  date-range (trigger `[variant]="hasRange()?'outline-primary-dark':'secondary'"`). `(falconClick)`, icons via
  `slot="icon-start"`/`"icon-end"`.
- **Phase 3 — toggles/chips/label.** Delivery Immediate/Schedule + group-picker mine/shared →
  `falcon-angular-tabs` (`[tabs]:FalconTabOption[]`, `[selectedValue]`, `(valueChange)`); retry-status chips →
  `falcon-angular-checkbox` (`[checkedInput]`,`(valueChange)`); send-confirm native `<label>` → the switch's
  built-in `[label]`.
- **Phase 4 (partial) — recipients-cell → REAL Falcon overlay:** `falcon-angular-multi-select displayMode="chip-list"
  [options] [maxChipsVisible]=1 [popoverTitle] chipListSize=sm` (templates-list "shared with" precedent) — its
  built-in +N overflow popover. Renders "Contact Group 1 +2". Deleted the hand-rolled badge + fixed popover.

**Gates:** nx build + lint + test basic-app GREEN. **grep of `<button|<table|<input|<select|<textarea|<label|
<thead|<tbody|<tr|<td|<th` across apps/basic-app/src/app/shared = 0.** All Falcon components render correctly
(group-picker popover = falcon-tabs+search+button rows; delivery falcon-tabs; group chip active-teal preserved;
mapping table red header dropdowns; editable manual cells; recipients chip-list).

**Phase 5 — Brain SK structure — DONE 2026-07-13.** Extracted both page inline `template:` →
`basic-app-admin-page.component.html` + `basic-app-client-page.component.html` (0 inline `template:` remain in
apps/basic-app). Added `index.ts` barrels to all 10 component folders (compose, group-picker, phone-preview,
send-confirm, mapping-table, manual-recipients, message-panel, status-pill, recipients-cell, date-range-filter)
and rewired parent imports (compose.ts, message-panel.ts, both pages) to import from the barrels. Every
`.component.ts` is class-only (0 inline interface/type/enum/const — verified). `models/models.ts` exists for the
2 table components (their own event-edit shapes); all OTHER shapes are genuinely cross-component and correctly
stay in `shared/models/` (Brain SK: cross-component shapes live in the shared tier), and services stay in
`shared/services/` — so NO empty per-component models/services folders were created (they'd be noise). NO empty
`.css` files (honors the standing zero-CSS rule). Gates: build + lint + test + gate-13 (0 basic-app violations)
GREEN; live-DOM-verified the pages still render (client page + message panel + data-table + 10 recipient chips).

**Phase 4 overlay-shell honest constraint (from research):** NO Falcon overlay hosts anchored custom content
(tabs+search+list or custom confirm body). `falcon-angular-menu` = items-only; `falcon-dialog`/`-drawer` WIPE
the default body slot under this app's ZONELESS CD (**GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001**; the app's
own tests assert dialog/drawer are NOT used; send-confirm was already hand-rolled for this). `falcon-popup` =
fixed variants; `falcon-confirm-dialog` Angular wrapper = commented out. So group-picker/date-range/send-confirm
shells stay positioned layout `<div>`s (the platform's sanctioned pattern — recipients-cell/shared-with-chip/
wbm-confirm-save-modal all do this) with Falcon controls inside. `[falconOverlay="popover"|"modal"]` lifts to Top
Layer but does NOT anchor (would break the CSS anchor) — deliberately not added.

**POLISH PASS 2026-07-13 (6 user fixes, DONE + verified):**
1. **Step-card headers same height** — the preview header was a falcon-button [fullWidth]+rootClass hack (taller
   than the plain-div Message Details/Recipients headers). Reworked: header is now a plain `<div>` identical to the
   other two + the eye is a `falcon-angular-button` iconOnly at `ml-auto`. All 3 headers measure exactly 72px.
2. **Eye icon → top-right** of the preview card (the ml-auto falcon-button); verified eyeAtTopRight.
3. **Collapse/expand padding** — the collapsed rail is now a clean plain `<div>` (w-14, py-[18px], rounded-md) with
   the eye as a falcon-button (was a rootClass-hacked falcon-button); railPadding "18px 0px".
4. **Row hover on the tables** — set `[hoverable]="true"` on both mapping-table + manual-recipients data-tables.
5. **⚠ GROUP-PICKER (and grid) SEARCH WAS SYSTEMICALLY BROKEN.** Root cause: `falcon-angular-search-input`'s
   debounced `falconSearch` @Output (emitted from a Stencil `setTimeout`, outside Angular's event context) does
   NOT reach the consumer handler in this ZONELESS app (markForCheck didn't help — the handler never runs). The
   message-panel grid search has the same bug (pre-existing). FIX: replaced the group-picker's
   `falcon-angular-search-input` with the CVA `falcon-angular-input type="search"` + `[ngModel]`/`(ngModelChange)`
   — its synchronous input path fires + filters correctly (verified: typing "vip" → only "VIP Customers").
   **LESSON: for a live filter in this zoneless app, use CVA `falcon-angular-input`, NOT `falcon-angular-search-input`
   (its debounced @Output doesn't trigger CD).** The message-panel grid "Search Here" still uses search-input and is
   thus still broken — same one-line swap would fix it (not done; out of the flagged scope).
6. **Unified all container border-radius to `rounded-md` (= --radius-md = 12px)** across compose (takeover, step
   cards + headers, summary bar, mapping/manual table containers), group-picker/date-range popovers, send-confirm
   modal, message-panel grid card, and both pages' `<main>`. Left intentional radii: pills (rounded-full), small
   badges/icon-boxes, and the phone-preview WhatsApp bubbles (rounded-[10px]). `falcon-input` `iconLeft` is a
   BOOLEAN flag (not an icon name) — string value = TS2322.
   Gates: build + lint + gate-13 green; still 0 native interactive tags. UNCOMMITTED.

**ALL 5 PHASES + POLISH DONE + VERIFIED. UNCOMMITTED (no commit/push per standing rule + explicit user instruction).**

**KEY LEARNINGS:** falcon data-table editable/dynamic-cell recipe (structureKey+untracked+recreate-guard) is the
proven anti-"input-disappears" pattern. Falcon barrel exports: `FalconAngularDataTableComponent`, `ColumnDef`,
`FalconDataTableCellDirective`/`HeaderCellDirective`, `FalconAngularInputComponent`,
`FalconAngularCheckboxComponent`, `FalconAngularTabsComponent`+`FalconTabOption`,
`FalconAngularMultiSelectComponent`+`FalconMultiSelectOption`, all from `@falcon/ui-core/angular`.
UNCOMMITTED. Related: [[project_basic_app_shared_tailwind_only_rework_2026_07_13]],
[[basic-app-rebuild-mf-remote-sot-13072026]].
