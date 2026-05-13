*** Component Token Files Audit ***
*** Every file under `libs/falcon-ui-tokens/src/components/` enumerated ***
*** Verified against active source at 2026-05-13 ***

# Per-component token file audit

The Falcon UI dual-render pattern (Shadow DOM `<falcon-X>` + Light DOM `<falcon-X-tw>` + Angular wrapper `<falcon-angular-X>`) depends on a SINGLE per-component CSS variable block that BOTH render paths read from. These tokens are declared in `libs/falcon-ui-tokens/src/components/<name>.tokens.css`.

This audit catalogs every file: path, declared token list, light-mode source values, dark-mode override path, and which render paths consume them.

---

## Common shape pattern

Every file follows this contract:

```css
/* Header comment block — spec source, categories index */
:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X]) {
  /*** Category 1 — typically CONTAINER ***/
  --falcon-X-{prop}: var(--ssot-primitive, hardcoded-fallback);
  ...
  /*** Category 14 — typically MOTION ***/
}
```

The 5-selector `:where(...)` lets the SAME declaration block scope to:
1. Shadow DOM custom element (`falcon-X`)
2. Light DOM (Tailwind-mode) custom element (`falcon-X-tw`)
3. Angular wrapper element (`falcon-angular-X`)
4. Plain HTML class consumer (`.falcon-X`)
5. Data-attribute consumer (`[data-falcon-X]`)

All five resolve to the same token block via CSS `:where()` (which has zero specificity, so per-instance overrides on host classes still win).

---

## File-by-file enumeration

### 1. `accordion.tokens.css` (139 lines, 86 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/accordion.tokens.css`
**Selector**: `:where(falcon-accordion, falcon-accordion-tw, falcon-angular-accordion, .falcon-accordion, [data-falcon-accordion])`
**Categories**: CONTAINER · ITEM · ICON CHEVRON · HEADER · CONTENT · DENSITY · STATE · MOTION · SHADOW
**Light values**: surfaces from neutral-0/50; borders from neutral-150/200; expanded chevron rotation via `--falcon-accordion-chevron-rotate`; text colors from neutral-900 idle, neutral-700 muted, neutral-500 disabled.
**Dark overrides**: All cascades flow via SSOT neutral remap; no explicit override needed in `themes/dark.css`.
**Consumed by**: `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.tsx` (Shadow) + `falcon-accordion-tw/falcon-accordion-tw.tsx` (Light) + `libs/falcon-ui-core/src/tailwind/accordion-tailwind-classes.ts`.

### 2. `avatar.tokens.css` (57 lines, 23 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/avatar.tokens.css`
**Selector**: `:where(falcon-avatar, falcon-avatar-tw, falcon-angular-avatar, .falcon-avatar, [data-falcon-avatar])`
**Categories**: SIZING (xs/sm/md/lg/xl) · SHAPE (square/rounded/circle) · COLORS (bg, text, ring) · TYPOGRAPHY (initials) · STATUS (online/away/busy/offline ring)
**Light values**: bg fallback `--color-falcon-neutral-100`; text fallback `--color-falcon-neutral-700`; status ring colors from green/amber/red 500 + neutral-400 (offline).
**Dark overrides**: explicit override `--falcon-avatar-status-ring-color: var(--color-falcon-neutral-50)` in `themes/dark.css:107` so the ring is visible against dark canvas.
**Consumed by**: `falcon-avatar.tsx` + `-tw` + `avatar-tailwind-classes.ts`.

### 3. `badge.tokens.css` (84 lines, 36 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/badge.tokens.css`
**Selector**: `:where(falcon-badge, falcon-badge-tw, falcon-angular-badge, .falcon-badge, [data-falcon-badge])`
**Categories**: SIZE (count-pill height/min-width) · SEVERITY (success/info/warning/danger/secondary/contrast) · TYPOGRAPHY · POSITION · ANIMATION
**Light values**: severity-keyed bg + text per palette (green-500/blue-500/amber-500/red-500/neutral-100/neutral-900).
**Dark overrides**: auto-inherits via neutral SSOT remap; severity colors STAY (status colors do not flip in dark mode).
**Consumed by**: `falcon-badge.tsx` + `-tw` + `badge-tailwind-classes.ts`.
**Notes**: Distinct from `<falcon-tag>` (severity chip) and `<falcon-status-badge>` (workflow state).

### 4. `button.tokens.css` (214 lines, 93 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/button.tokens.css`
**Selector**: `:where(falcon-button, falcon-button-tw, falcon-angular-button, .falcon-button, [data-falcon-button])`
**Categories**: 14 — CONTAINER · SIZING (sm/md/lg) · TYPOGRAPHY · BORDER · BACKGROUND (4 variants × 4 states = 16 bg tokens) · TEXT COLOR (matching) · BORDER COLOR (matching) · SHADOW / FOCUS RING · ICON · SPINNER · DISABLED · ICON-ONLY · FULL-WIDTH · MOTION
**Light values**: 4 variants × 4 states = 16 bg, text, and border-color tokens; ICON sizes 14/16/18; spinner sizes match icons; focus halo `rgba(13, 63, 68, 0.18) 0 0 0 3px, ...`.
**Dark overrides**: `--falcon-button-shadow-focus: rgba(105, 142, 146, 0.35) 0 0 0 3px, ...` in `themes/dark.css:65-68`.
**Consumed by**: `falcon-button.tsx` + `-tw` + `button-tailwind-classes.ts`.
**FALLBACK DRIFT**: `--falcon-button-primary-bg: var(--color-falcon-teal-500, #0d3f44)` — SSOT teal-500 is `#124c52` (the fallback hex is teal-700, not teal-500). Same hex drift on primary border + danger-hover (`--falcon-button-danger-bg-hover: var(--color-falcon-red-100, #b91c1c)` — red-100 is `#fde2e4`; fallback `#b91c1c` is closer to red-600). See UPGRADE_CANDIDATES UP-01.

### 5. `calendar.tokens.css` (194 lines, 123 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/calendar.tokens.css`
**Selector**: `:where(falcon-calendar, falcon-calendar-tw, falcon-angular-calendar, .falcon-calendar, [data-falcon-calendar])`
**Categories**: PANEL · HEADER (month/year navigation) · WEEKDAY ROW · DAY CELL (default/hover/today/selected/range/range-start/range-end/disabled/outside-month) · YEAR/MONTH VIEW · FOCUS RING · MOTION
**Light values**: panel surface neutral-0; today underline teal-500; selected day bg teal-500 + text neutral-0; range-fill via `--color-falcon-teal-alpha-08`.
**Dark overrides**: focus-ring-color → `--color-falcon-teal-alpha-18`; disabled day bg/color (`themes/dark.css:131-135`).
**Consumed by**: `falcon-calendar.tsx` + `-tw`; ALSO shared with `<falcon-date-picker>` (see date-picker-tailwind-classes.ts).

### 6. `card.tokens.css` (65 lines, 26 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/card.tokens.css`
**Selector**: `:where(falcon-card, falcon-card-tw, falcon-angular-card, .falcon-card, [data-falcon-card])`
**Categories**: SURFACE · PADDING per density · BORDER + RADIUS · SHADOW · STATES (default/hover/selected/interactive) · HEADER + FOOTER divider
**Light values**: bg neutral-0; border neutral-200; radius 16px (lg); padding density variants 12/16/20.
**Dark overrides**: auto-cascade.
**Consumed by**: `falcon-card.tsx` + `-tw` + `card-tailwind-classes.ts`.

### 7. `checkbox.tokens.css` (182 lines, 87 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/checkbox.tokens.css`
**Selector**: `:where(falcon-checkbox, falcon-checkbox-tw, falcon-angular-checkbox, .falcon-checkbox, [data-falcon-checkbox])`
**Categories**: BOX size + radius · STROKE · ICON (check + indeterminate marks) · COLOR per state (default/hover/checked/disabled/error/readonly) · TYPOGRAPHY (label) · GAP · MOTION
**Light values**: box 16px sm / 18px md / 20px lg; border 1.5px (uses `--falcon-border-width-1-5`); checked bg teal-500.
**Dark overrides**: auto-cascade.

### 8. `checkbox-group.tokens.css` (21 lines, 10 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/checkbox-group.tokens.css`
**Selector**: `:where(falcon-checkbox-group, falcon-checkbox-group-tw, falcon-angular-checkbox-group, .falcon-checkbox-group, [data-falcon-checkbox-group])`
**Categories**: LAYOUT (orientation gaps) · LABEL (group title)
**Light values**: gap `var(--falcon-spacing-3)`; orientation horizontal-default.
**Notes**: Group wraps multiple `<falcon-checkbox>` instances; geometry-only tokens.

### 9. `combobox.tokens.css` (152 lines, 90 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/combobox.tokens.css`
**Selector**: `:where(falcon-combobox, falcon-combobox-tw, falcon-angular-combobox, .falcon-combobox, [data-falcon-combobox])`
**Categories**: As dropdown PLUS creatable-option visual + chip mode (when used as multi-combobox).
**Dark overrides**: option-bg-hover/active in `themes/dark.css:169-170`.

### 10. `confirm-dialog.tokens.css` (29 lines, 16 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/confirm-dialog.tokens.css`
**Selector**: `:where(falcon-confirm-dialog, falcon-confirm-dialog-tw, falcon-angular-confirm-dialog, .falcon-confirm-dialog, [data-falcon-confirm-dialog])`
**Categories**: ICON SIZE + COLOR per severity · TITLE + MESSAGE colors · BUTTON LAYOUT (accept/reject) · GAP
**Light values**: severity-keyed icon colors (info=blue-500, warn=amber-500, danger=red-500).
**Notes**: Often composes `<falcon-dialog>`; this file only carries dialog-FREE tokens (the icon header + button row).

### 11. `data-table.tokens.css` (206 lines, 100 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/data-table.tokens.css`
**Selector**: `:where(falcon-data-table, falcon-data-table-tw, falcon-angular-data-table, .falcon-data-table, [data-falcon-data-table])`
**Categories**: Mirrors `table` token set with extension for `data-table` (Strategy E projection wrapper) — row-action column, custom cell template gap, loading-overlay.
**Dark overrides**: `--falcon-data-table-loading-overlay-bg: rgba(26, 26, 46, 0.75)` (`themes/dark.css:124`).
**Notes**: Angular-only wrapper composes `<falcon-table-tw>`; the data-table tokens overlap heavily with table tokens by design.

### 12. `dialog.tokens.css` (224 lines, 117 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/dialog.tokens.css`
**Selector**: `:where(falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog])`
**Categories**: 14 — CONTAINER · BACKDROP (color/opacity/blur) · PANEL (bg/border/radius/shadow/padding/3 size widths) · HEADER · TITLE · DESCRIPTION · CLOSE BUTTON · BODY · FOOTER · SEVERITY ACCENT (info/success/warn/danger) · POSITION variants (center/top/side-right) · FOCUS RING · MOTION · Z-INDEX
**Light values**: panel bg neutral-0 / panel radius 18px / shadow `0 24px 60px rgba(0, 0, 0, 0.18)` / animation `acModalIn 220ms cubic-bezier(.2,.8,.3,1)`; backdrop teal-alpha-18 with 4px blur.
**Dark overrides**: backdrop `rgba(0, 0, 0, 0.60)`; panel-bg `--color-falcon-neutral-50` (inverts to dark elevated surface); shadow `0 24px 60px rgba(0, 0, 0, 0.55)`. See `themes/dark.css:70-80`.

### 13. `drawer.tokens.css` (99 lines, 49 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/drawer.tokens.css`
**Selector**: `:where(falcon-drawer, falcon-drawer-tw, falcon-angular-drawer, .falcon-drawer, [data-falcon-drawer])`
**Categories**: BACKDROP · PANEL per position (top/right/bottom/left) · HEADER · BODY · FOOTER · MOTION (slide in/out per position)
**Light values**: panel bg neutral-0; backdrop teal-alpha-18; shadow uses `--shadow-falcon-drawer` (light: `-8px 0 12px -8px rgba(0, 0, 0, 0.06)`; RTL flips to `+8px 0 ...` via `rtl/rtl.css:8`).

### 14. `dropdown.tokens.css` (257 lines, 132 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/dropdown.tokens.css`
**Selector**: `:where(falcon-dropdown, falcon-dropdown-tw, falcon-angular-dropdown, .falcon-dropdown, [data-falcon-dropdown])`
**Categories**: 14 — CONTAINER · LABEL · SIZING (sm/md/lg) · TYPOGRAPHY · BG per state · TEXT per state · BORDER per state · SHADOW per state · FOCUS RING · CHEVRON + SEARCH · HELPER + ERROR · CLEAR + TRIGGER · MOTION + PANEL (popup) · OPTION · SCROLLBAR
**Light values**: 8 bg-by-state, 8 border-color-by-state, 8 shadow-by-state per spec (`REFERENCE-V02-INVENTORY.md` §2-4). Panel max-height 240px; option padding 8/10; option radius 7; option font 12.5px.
**Dark overrides**: option bg-hover/active in `themes/dark.css:167-168`.
**FALLBACK DRIFT**: `--falcon-dropdown-bg-error: var(--color-falcon-red-100, #fef5f5)` — red-100 is `#fde2e4`; fallback is red-50 hex. UP-01.

### 15. `email-field.tokens.css` (138 lines, 75 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/email-field.tokens.css`
**Selector**: `:where(falcon-email-field, falcon-email-field-tw, falcon-angular-email-field, .falcon-email-field, [data-falcon-email-field])`
**Categories**: INPUT block (mirrors input.tokens.css) · VERIFY BUTTON (size/bg/color per state) · DIVIDER (the 1px vertical line between input and verify button) · ICON · MOTION
**Notes**: Inherits most input visuals via composition with `<falcon-input>` but declares its OWN tokens for the verify-button affordance.

### 16. `empty-state.tokens.css` (56 lines, 23 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/empty-state.tokens.css`
**Selector**: `:where(falcon-empty-state, falcon-empty-state-tw, falcon-angular-empty-state, .falcon-empty-state, [data-falcon-empty-state])`
**Categories**: SIZE (sm/md/lg) · ICON · TITLE · DESCRIPTION · ACTION SLOT
**Light values**: title color neutral-800; description neutral-600; icon size 48px md.
**Dark overrides**: auto-cascade (per `themes/dark.css:110` comment: title auto-inherits via neutral-800 SSOT remap).

### 17. `filter-panel.tokens.css` (70 lines, 40 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/filter-panel.tokens.css`
**Selector**: `:where(falcon-filter-panel, falcon-filter-panel-tw, falcon-angular-filter-panel, .falcon-filter-panel, [data-falcon-filter-panel])`
**Categories**: PANEL · HEADER · FIELD ROW · ACTIONS · DENSITY · ORIENTATION

### 18. `grid-input.tokens.css` (21 lines, 2 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/grid-input.tokens.css`
**Selector**: `:where(falcon-grid-input, falcon-grid-input-tw, falcon-angular-grid-input, .falcon-grid-input, [data-falcon-grid-input])`
**Categories**: CELL FOCUS only (2 tokens total: `--falcon-grid-input-focus-ring-color`, `--falcon-grid-input-focus-ring-width`)
**Light values**: focus ring `var(--color-falcon-primary-400, #60a5fa)`.
**Notes**: This file is a thin overlay on `<falcon-input variant="grid" size="sm">`. Inherits most visuals from `input.tokens.css`.
**GAP**: `--color-falcon-primary-400` does not exist in the SSOT or in any primitive — the fallback `#60a5fa` is generic blue. Either: (a) add primary-400 to SSOT, (b) point at `--color-falcon-teal-400` instead.

### 19. `icon.tokens.css` (31 lines, 7 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/icon.tokens.css`
**Selector**: `:where(falcon-icon, falcon-icon-tw, falcon-angular-icon, .falcon-icon-host, [data-falcon-icon])` (note: 4th selector is `.falcon-icon-host` to avoid conflict with the `.falcon-icon` font class)
**Categories**: SIZE (xs/sm/md/lg) · COLOR (current/explicit)
**Light values**: sizes alias the SSOT `--falcon-icon-{xs,sm,md,lg}` scale (12/14/16/24px).

### 20. `input.tokens.css` (203 lines, 89 tokens)

Already deep-read in the audit. **Reference implementation** for the entire system. See `THEME_SSOT_AUDIT.md` for full token tour and UPGRADE_CANDIDATES UP-01 for the input fallback-drift items.

### 21. `input-number.tokens.css` (15 lines, 7 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/input-number.tokens.css`
**Selector**: `:where(falcon-input-number, falcon-input-number-tw, falcon-angular-input-number, .falcon-input-number, [data-falcon-input-number])`
**Categories**: STEPPER (up/down button size, padding) · PREFIX/SUFFIX gap
**Notes**: Thin overlay on `<falcon-input type="number">`; inherits everything else.

### 22. `menu.tokens.css` (110 lines, 62 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/menu.tokens.css`
**Selector**: `:where(falcon-menu, falcon-menu-tw, falcon-angular-menu, .falcon-menu, [data-falcon-menu])`
**Categories**: TRIGGER · PANEL · ITEM (default/hover/disabled/active/danger) · ICON · SHORTCUT KEY · DIVIDER · GROUP HEADER · MOTION
**Dark overrides**: panel bg/border/shadow + item bg-hover in `themes/dark.css:83-87`.

### 23. `multi-select.tokens.css` (311 lines, 181 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/multi-select.tokens.css`
**Selector**: `:where(falcon-multi-select, falcon-multi-select-tw, falcon-angular-multi-select, .falcon-multi-select, [data-falcon-multi-select])`
**Categories**: As dropdown PLUS chip (size/padding/radius/bg/text/dismiss) + "+N more" overflow pill + clear-all button + check-row visual.
**Largest single-component token block.** 181 tokens reflect the multi-select's three visual modes (inline chip / overflow pill / open panel) and the per-option checkbox composition.
**Dark overrides**: chip-bg + option bg-hover/active in `themes/dark.css:164-168`.

### 24. `organization-hierarchy.tokens.css` (172 lines, 73 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css`
**Selector**: `:where(falcon-organization-hierarchy, falcon-organization-hierarchy-tw, falcon-angular-organization-hierarchy, .falcon-organization-hierarchy, [data-falcon-organization-hierarchy])`
**Categories**: A. PANEL · FONT FAMILY · B. ROOT HEADER · C. SECTION LABEL · LIST · CHILD ROW HOVER · D. ROW MENU BUTTON (sticky ⋮) · E. CTX MENU (floating action menu) · LABEL CLAMP · CHEVRON ↔ MENU-BUTTON GAP
**Notes**: This is the canonical bespoke component for the org-hierarchy tree (Light-DOM-only). Heavy use of literal pixel values (14px, 16px, 220px max-width, 8px CTX item gap) — not bug; this is the "truth set" tree per SSOT comment line 2.
**Notes**: This is the ONLY component-token file that does NOT have a matching Shadow DOM pair. Component is Light DOM only.

### 25. `otp.tokens.css` (156 lines, 67 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/otp.tokens.css`
**Selector**: `:where(falcon-otp, falcon-otp-tw, falcon-angular-otp, .falcon-otp, [data-falcon-otp])`
**Categories**: BOX size/gap · BORDER · TEXT · STATES (default/filled/focused/error/disabled) · MASK · MOTION
**Light values**: box 40px md / 48px lg; gap 8px between boxes.

### 26. `otp-send-dialog.tokens.css` (149 lines, 94 tokens)

**Path**: `libs/falcon-ui-tokens/src/components/otp-send-dialog.tokens.css`
**Categories**: 2-step dialog (channel-select + OTP-entry); inherits dialog + radio + otp; declares step-specific labels/dividers.

### 27. `paginator.tokens.css` (109 lines, 54 tokens)

**Categories**: STRIP · NAV BUTTONS · PAGE BUTTONS (default/active/hover/disabled) · ELLIPSIS · PAGE INFO TEMPLATE · ROWS-PER-PAGE selector

### 28. `password.tokens.css` (22 lines, 13 tokens)

**Categories**: REVEAL TOGGLE button · STRENGTH METER segments (weak/medium/strong/excellent colors + gap + height)

### 29. `phone-field.tokens.css` (218 lines, 142 tokens)

**Categories**: COUNTRY CHOOSER (flag size + chevron) · DIAL CODE · INPUT (extends input tokens) · DIVIDER (1px vertical between sections) · VERIFY BUTTON · DROPDOWN PANEL (country picker search list)
**Notes**: Single-element look composes 3 visual partitions inside ONE outer border — partition dividers are 1px vertical lines via `--falcon-phone-field-divider-*` tokens.

### 30. `radio.tokens.css` (186 lines, 78 tokens)

**Categories**: CIRCLE size/gap · DOT (visible center on checked, via border-width trick) · COLOR per state · TYPOGRAPHY · MOTION

### 31. `radio-group.tokens.css` (22 lines, 11 tokens)

**Categories**: LAYOUT (orientation gap) · LABEL

### 32. `search-input.tokens.css` (21 lines, 4 tokens)

**Selector**: `:where(falcon-search-input, falcon-search-input-tw, falcon-angular-search-input, .falcon-search-input, [data-falcon-search-input])`
**Categories**: LOADING SPINNER only (4 tokens — `--falcon-search-input-loading-inset`, `--falcon-search-input-spinner-size`, `--falcon-search-input-spinner-track`, `--falcon-search-input-spinner-color`).
**GAP**: `--color-falcon-primary-500` does NOT exist in the SSOT (similar to grid-input's primary-400). Either add to SSOT or point at `--color-falcon-teal-500`.
**Notes**: Inherits all input visuals via composition with `<falcon-input variant="search">`.

### 33. `single-uploader.tokens.css` (199 lines, 98 tokens)

**Categories**: DROPZONE (empty) · TILE (filled, 3 preview modes thumbnail/icon-only/compact) · ACTION BUTTONS (delete-danger top-right + edit-secondary bottom-right) · FILE INFO · PROGRESS · ERROR · MOTION
**Dark overrides**: `--falcon-single-uploader-empty-bg: var(--color-falcon-neutral-45)` in `themes/dark.css:142`.

### 34. `status-badge.tokens.css` (91 lines, 39 tokens)

**Categories**: STATE-keyed palette (success/info/warning/danger/secondary/contrast + workflow states like draft/pending/approved) · SIZE · ICON · DOT-LEADING-INDICATOR

### 35. `stepper.tokens.css` (219 lines, 94 tokens)

**Categories**: TRACK · CIRCLE (size sm/md/lg) per state (upcoming/active/completed/error/disabled) · LABEL · STEP NUMBER · CONNECTOR · STUDIO KNOBS (shape/radius/rotate/sizes 1-5/animation/label-pos/label-visible)
**Dark overrides**: hardcoded rgba halos restated in `themes/dark.css:118-120` (active-shadow, focus-shadow, error-ring-shadow).

### 36. `switch.tokens.css` (215 lines, 103 tokens)

**Categories**: TRACK (width/height/radius/bg per state) · KNOB (size/offset/transition) · 3 VISUAL VARIANTS (dot-knob/hidden-input/channel-pill) · LABEL · ICON CHECKED/UNCHECKED slot · DISABLED · FOCUS RING

### 37. `table.tokens.css` (157 lines, 96 tokens)

**Categories**: 14 — CONTAINER (wrap) · HEADER ROW · HEADER SORT INDICATOR · ROW per state · STRIPED ROW · CELL · CELL BY TYPE (number tabular-nums) · CHECKBOX CELL · DENSITY · EMPTY STATE · LOADING OVERLAY · PAGINATION FOOTER · FOCUS + MOTION · BORDERED + DISABLED
**Light values**: header padding 12/10; border-bottom neutral-150; row-h 44 comfortable / 34 compact.
**Dark overrides**: row-bg-hover/selected/focus + loading overlay in `themes/dark.css:122-148`.

### 38. `tabs.tokens.css` (243 lines, 128 tokens)

**Categories**: TABLIST · TAB BUTTON per state · UNDERLINE INDICATOR · PANEL · RADIO-CARDS MODE (separate visual cards w/ icon/title/sub) · ORIENTATION · MOTION
**Dark overrides**: rc-tab-bg-active, rc-card-bg-selected, rc-card-border-color-hover, rc-radio-border-color in `themes/dark.css:154-157`.

### 39. `tag.tokens.css` (51 lines, 20 tokens)

**Categories**: LAYOUT (gap/padding/radius/border) · TYPOGRAPHY (sm/md/lg sizes) · SURFACE (severity-keyed bg + fg) · SIZING · DISMISS button
**Notes**: Severity colors live in the Stencil component file; this token block carries shape + neutral surface.

### 40. `textarea.tokens.css` (197 lines, 89 tokens)

**Categories**: Mirrors input.tokens.css PLUS rows-height, auto-resize-max-height, counter color/size, line-numbers (off by default).

### 41. `toast.tokens.css` (119 lines, 65 tokens)

**Categories**: CONTAINER · SEVERITY ICON BG/COLOR (info/success/warning/error) · TITLE · MESSAGE · ACTION · DISMISS · HOST POSITION (6 corners) · SLIDE ANIMATION · LIFE/COUNTDOWN
**Dark overrides**: bg/color/border/shadow + icon-info-bg/color + dismiss-bg-hover in `themes/dark.css:90-101, 127-128`.

### 42. `tooltip.tokens.css` (95 lines, 40 tokens)

**Categories**: PANEL · ARROW · TYPOGRAPHY · 12 PLACEMENT MODIFIERS · FOCUS + INTERACTIVE MODE · DELAY

### 43. `tree.tokens.css` (231 lines, 106 tokens)

**Categories**: 14 — CONTAINER · NODE per state (default/hover/hover-ancestor/focus/selected/disabled) · NODE LABEL · CHEVRON · CHILD INDICATOR · RAIL · RAIL HORIZONTAL · INDENT · ICON · BADGE per variant · FOCUS RING · EXPAND/COLLAPSE MOTION · HELPER/ERROR · MOTION
**Dark overrides**: indicator-bg + border in `themes/dark.css:160-161`.
**Notes**: Tier-7 locked-spec component. 7 non-negotiable spec points listed in file header.

### 44. `tree-table.tokens.css` (241 lines, 114 tokens)

**Categories**: COLUMNS · HEADER (sticky) · ROW per state · EXPAND CHEVRON · INDENT · COLUMN TYPES (text/badge/number/radio/custom) · DENSITY · SELECTION
**Dark overrides**: header-bg, row-bg-hover, badge-bg in `themes/dark.css:150-152, 178`.

### 45. `uploader.tokens.css` (223 lines, 120 tokens)

**Categories**: DROPZONE per state (idle/drag-over/error) · FILE LIST · FILE ITEM per state (queued/uploading/success/error) · PROGRESS · ACTIONS (remove/retry) · MODE VARIANTS (dropzone/button/inline-list)
**Dark overrides**: dropzone-bg, item-bg-hover, badge-bg-uploading in `themes/dark.css:141, 174-175`.

### 46. `wizard.tokens.css` (62 lines, 27 tokens)

**Categories**: SHELL · STEP TRACKER (composes stepper) · BODY PADDING · ACTION ROW (back/draft/cancel/save buttons) · DIVIDER
**Dark overrides**: btn-back-fg, btn-back-border, btn-draft-fg in `themes/dark.css:113-115`.

---

## Cross-component token-naming patterns

1. **State-keyed bg + border + shadow** — every interactive component declares at minimum 8 background tokens (default, hover, focus, error, success, warning, disabled, readonly) + matching border-color + matching shadow. Pattern is uniform across button / input / dropdown / multi-select / combobox / radio / checkbox / switch.

2. **Per-size scaling triplet** — every sized component declares `-sm`, `-md`, `-lg` for at least height, padding-x, padding-y, font-size. Optionally icon-size and gap. Pattern is uniform.

3. **Variant overlays for the layout itself** — buttons have `primary`, `secondary`, `ghost`, `danger`, `link` (5 visual variants). Tags have severity. Tabs have `navigation` and `radio-cards`. Visual variant tokens are namespaced as `--falcon-X-{variant}-{prop}` (e.g. `--falcon-button-primary-bg`, `--falcon-button-secondary-bg`).

4. **Composed components carry SHIM token files** — `grid-input.tokens.css`, `search-input.tokens.css`, `input-number.tokens.css`, `password.tokens.css` are 4-22 tokens each because they compose `<falcon-input>` and only need to declare their unique visual additions (loading spinner, cell focus, reveal toggle, strength meter).

5. **Token aliasing via `var(--ssot, fallback)`** — every value chains: `--falcon-input-bg: var(--color-falcon-neutral-0, #ffffff)`. The SSOT primitive is FIRST; the hex fallback is the standalone-mode safety net. **GAP**: Fallback hex MUST match SSOT primitive — UP-01 catches drift.

6. **Density cascade entry point** — components that respond to density read from `--falcon-density-{component}-*` then resolve to `--falcon-{component}-*` via a one-level cascade. Example in `density/comfortable.css:52-59`: `--falcon-input-height-sm: var(--falcon-density-input-height-sm);`.

7. **Per-instance override pattern (`feedback_shadow_is_token_ssot.md`)** — consumers add a host class on the wrapper, then redeclare `--falcon-input-bg` in scoped CSS for that one element. Sample:

```css
/* per-page scoped style — recipe form Brain SK UP-11 */
.add-client-special-input {
  --falcon-input-bg: #fafafa;
  --falcon-input-border-color: var(--color-falcon-teal-500);
}
```

---

## Gaps observed

| FILE | GAP | PRIORITY |
|---|---|---|
| `button.tokens.css` | `--falcon-button-primary-bg fallback #0d3f44` vs SSOT teal-500 `#124c52` | P0 (UP-01) |
| `input.tokens.css` | `--falcon-input-bg-error fallback #dc2626` vs SSOT red-100 `#fde2e4` | P0 (UP-01) |
| `dropdown.tokens.css` | `--falcon-dropdown-bg-error fallback #fef5f5` vs SSOT red-100 `#fde2e4` | P0 (UP-01) |
| `grid-input.tokens.css` | `--color-falcon-primary-400` does not exist in SSOT | P1 (UP-04) |
| `search-input.tokens.css` | `--color-falcon-primary-500` does not exist in SSOT | P1 (UP-04) |
| `organization-hierarchy.tokens.css` | Heavy use of literal pixel values (14px, 16px, 220px) — flagged but justified as "truth set" geometry per spec | P3 |
| Multiple files | Literal `rgba(13, 63, 68, X)` instead of `var(--color-falcon-teal-alpha-X)` — bypasses dark-mode auto-cascade | P1 (UP-06) |
| `themes/dark.css` | 178 lines of per-component bypass overrides — collapsible if UP-06 lands | P1 |

---

## Cross-references

- See `THEME_SSOT_AUDIT.md` for SSOT primitive enumeration.
- See `TOKEN_FLOW_REPORT.md` for the propagation diagram: primitives → semantic → themes → density → rtl → components.
- See `DARK_MODE_AUDIT.md` for dark override invariants.
- See `DENSITY_AND_RTL_AUDIT.md` for density + RTL token coverage.
