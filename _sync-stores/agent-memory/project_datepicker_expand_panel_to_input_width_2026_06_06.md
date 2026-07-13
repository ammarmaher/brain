---
name: project_datepicker_expand_panel_to_input_width_2026_06_06
description: "New Falcon date-picker prop expandPanelToInputWidth makes the calendar dropdown fill the trigger-input (caller) width; applied to admin contract Start/Expiration pickers (add+edit). Build+test verified, NO commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2c67afd0-84ec-431e-9fc5-eda8fcfad789
---

# Date picker — `expandPanelToInputWidth` (calendar dropdown fills the caller/input width)

2026-06-06 (claude). User: the contract **Start Date** + **Expiration Date** calendar dropdowns render at a fixed ~280px and don't fill the full-width input; make the panel **expand to the caller box and FILL it**. Also: a boolean input the user previously tried "was always false when passed true" — make it actually apply. Apply across add/edit/view + both apps.

## Root causes
- **Panel never fills**: `--falcon-calendar-popover-max-width:280px` caps the popover ([CODE] `libs/falcon-ui-tokens/src/components/calendar.tokens.css:167`) and `--falcon-calendar-width:260px` (`inline-block`) fixes the calendar. Default `appendTo='body'` calls `positionPopoverFixed(inputWrap, popover)` with **no opts** → only `min-width` is matched, never `width`, and `max-w-280` clamps it anyway.
- **"Passed true stayed false"**: a boolean must reach the **rendered** Stencil element. Default `useTailwind=true` renders `<falcon-date-picker-tw>` (NOT the Shadow `<falcon-date-picker>`). If a prop is added only to the Shadow twin, or the Angular wrapper has no `[attr.…]` binding, `true` never lands. (Wrapper consumed from SOURCE via tsconfig `@falcon/ui-core/angular`; Stencil cores loaded at runtime from `dist/components/*` via `define-falcon-tw-component.ts` → **rebuild falcon-ui-core after .tsx/.css edits**.)

## Fix — new prop `expandPanelToInputWidth` (boolean, default false; mirrors `iconLeft` idiom). 8 source files, NO libs/util signature break:
- `tailwind/date-picker-tailwind-classes.ts` — `falconDatePickerPopoverClasses(expandToInputWidth=false)`; true → `w-full max-w-none` (lifts the cap; `max-width` ALWAYS clamps used width, even past inline `width !important`, so `max-w-none` is what lets the pinned width through). **Only ONE caller** (the `-tw` comp) → safe. `false` output is byte-identical to legacy.
- `components/falcon-date-picker-tw/falcon-date-picker-tw.tsx` — `@Prop() expandPanelToInputWidth`; both `positionPopoverFixed(... , this.expandPanelToInputWidth ? { exactWidth: true } : {})` (pins panel `width`+`min-width` to inputWrap rect — the SAME mechanism `falcon-dropdown-tw` already uses); popover `class={falconDatePickerPopoverClasses(this.expandPanelToInputWidth)}`; calendar host gets `block w-full` + inline `--falcon-calendar-width:100% / --falcon-calendar-min-width:0` so the grid FILLS the widened panel.
- `components/falcon-date-picker/falcon-date-picker.tsx` (Shadow, parity) — `@Prop` + `.falcon-date-picker-popover--full-width` modifier class.
- `components/falcon-date-picker/falcon-date-picker.css` (Shadow) — modifier rule `width:100%;max-width:none;min-width:0` + `… falcon-calendar{display:block;width:100%;--falcon-calendar-width:100%;--falcon-calendar-min-width:0}`.
- wrapper `falcon-date-picker.component.ts` — `@Input() expandPanelToInputWidth=false`.
- wrapper `falcon-date-picker.component.html` — `[attr.expand-panel-to-input-width]="expandPanelToInputWidth ? '' : null"` in **BOTH** branches (tw + shadow).
- consumers (ADMIN only): `contracts-add-wizard/contract-information-step.component.html` (Start+Expiration) + `contracts-edit-contract.component.html` (Start+Expiration) → `[expandPanelToInputWidth]="true"`.

## Scope reality (corrects the "add/edit/view + both apps" ask)
Contract date pickers exist **ONLY in admin** add-wizard + admin edit. Mgmt + admin **VIEW** render dates as read-only `<falcon-angular-input>` text (no date picker) — nothing to change there. Grep of `<falcon-angular-date-picker` across the whole repo confirms it. The library fix is shared, so any future date picker can opt in.

## Robust to both render modes & zero regression
Body-portal mode: exactWidth pins width + `max-w-none` lifts cap + calendar fill. Inline (`appendTo="inline"`) mode: `w-full` panel = wrapper width + calendar fill. Default false → `positionPopoverFixed({})`, byte-identical classes, calendar class/style `undefined` → every other date picker untouched.
**Note:** in body mode the panel matches the trigger cell EXACTLY — on the edit page's `lg:grid-cols-4` layout the cell is narrower so the calendar is more compact there (matches the caller as requested; add a min floor if a wider minimum is later wanted).

## ⚠️ GOTCHA — BOTH positionPopoverFixed call sites must pass exactWidth
`falcon-date-picker-tw.tsx` has TWO `positionPopoverFixed(inputWrap, popover, ...)` calls: `handleReposition` (8-space indent) AND `componentDidRender` initial-open (6-space indent). A `replace_all` keyed on the 8-space string updated ONLY the reposition one; the 6-space initial-open call was missed. **Build + 775 tests STILL PASSED** (layout is runtime, not unit-tested) — caught only by re-reading the file. If the initial-open call lacks exactWidth, on first open the `w-full` class resolves against the full-viewport `.falcon-overlay-container` → panel opens VIEWPORT-WIDE (only the inline `width` from exactWidth pins it). Fix: both calls pass `this.expandPanelToInputWidth ? { exactWidth: true } : {}`. Lesson: verify EVERY call site by reading, not just trusting "all occurrences replaced" (indent differs).

## Verification (NO COMMITS)
`nx build falcon-ui-core` EXIT 0 (Stencil dist regen — REQUIRED, cores load from dist/components/*; 106 Vue proxies + components.d.ts + web-types.json regen incl. new prop) · `nx build admin-console --configuration=development` EXIT 0 (final Hash **7894247cf761e174** after the both-call-sites fix; first pass a75d5f7c21d78dd5) · `nx test admin-console` EXIT 0 = **38 files / 775 passed / 0 failed** (re-run after the fix; all contracts specs green) · `nx lint falcon-ui-core` — my 6 lib files CLEAN; the only error (`falcon-input-number-tw.tsx:215 prefer-const` in `groupWhileTypingDisplay`) is a **concurrent session's** in-flight input-number work, NOT mine/date-picker, left untouched. ⚠️ live pixel-verify pending user login (assistant cannot type passwords; MF remote → user may need npm start restart / hard-refresh to load the rebuilt dist).

Related [[project_datepicker_required_star_red_2026_06_06]] · [[reference_gate12_component_token_scope_portal_2026_06_02]] · [[reference_static_remote_rebuild_after_app_edit_2026_06_04]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
