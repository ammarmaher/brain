# falcon-multi-select — DECISION

## Brain SK final recommendation

**STATUS: READY for display-only chip-list AND basic multi-select. NEEDS-UPGRADE for advanced custom rendering / async / large lists / Tailwind-path custom option markup.**

The component has two faces and they are at different maturity in *production*:
- **chip-list display mode** — READY and the only live use today (Templates "Shared with").
- **selection picker** — feature-complete (search / tri-state select-all / chips / clear / portal) but exercised only in the Studio gallery; READY for typical pickers, with the gaps below for advanced needs.

## Use this component for

- A display-only chip strip + "+N" overflow dialog → `displayMode="chip-list"` (today's dominant real use).
- Any multi-value selection from a known, in-memory list of options.
- Permission pickers, tag pickers, filter-panel multi-categories (selection mode).
- Cases requiring a disabled-preserving "Select all" tri-state.

## Avoid this component for

- Single-select → `<falcon-angular-dropdown>`.
- Free-text combo → `<falcon-angular-combobox>`.
- Tree-shaped multi → `<falcon-angular-tree>`.
- An always-visible short list of independent checkboxes → `<falcon-angular-checkbox-group>`.
- Lists ≫ ~200 options without virtualization (G4).
- Custom option markup on the default (Tailwind) render path — `slot="options"` is Shadow-only (G11).

## Preferred variant / render path

- **Display:** `displayMode="chip-list"`.
- **Selection:** `displayMode="default"` + `useTailwind=true` (Light DOM, portaled panel — best for Studio token mutation + React/Vue parity). Switch to `useTailwind=false` (Shadow) ONLY for `slot="options"` custom rows or style isolation — note the Shadow panel renders inline (no portal) and can be clipped by overflow parents (G13).

## Required upgrades before wider use

None blocking for typical cases. Common asks: G11 (Tailwind-path `slot="options"` — HIGH-RISK), G7 (method proxies), G8 (`maxSelected` + `chipMode`), G3 (async loading), G12 (chip-list token-ization).

## Relationship to other components

- **Sibling:** `<falcon-angular-dropdown>` (single-select; shares option shape + portal + push-options race-guard).
- **Replaces:** PrimeNG `<p-multiSelect>` and legacy `<falcon-multiselect>`.
- **Confused with:** `<falcon-angular-checkbox-group>` — both commit a set, but checkbox-group shows every option inline (no panel/chips); multi-select hides options behind a trigger and shows chips.

## Exact rule for future implementation

1. Display an audience/tag set read-only? → `<falcon-angular-multi-select displayMode="chip-list">` with `maxChipsVisible` + `popoverTitle`.
2. Need a multi-value pick from a known list? → default mode, `useTailwind=true`.
3. Bind via Reactive Forms / `ngModel` — always; never `[values]` directly.
4. Set `searchable=true` if > 10 options; `clearable=true` if optional; `showSelectAll=true` when likely all.
5. Cap chips with `maxChipsVisible` to avoid overflow.
6. Override visuals via `--falcon-multi-select-*` token mutation, not Tailwind utilities.
7. For custom option rows use `useTailwind=false` + `slot="options"` (until G11 lands).

---

## Dynamic capability assessment

### 1. What is static today?
- Chip layout pattern (inline + "+N more" overflow); clear / chip-X / chevron / check SVGs (hardcoded paths).
- Tri-state select-all logic (none/some/all, disabled-preserving).
- chip-list popover geometry hardcoded as Tailwind arbitrary values (G12).
- Shadow tag always renders the panel inline (no portal — G13).

### 2. What is dynamic through inputs/outputs?
- ~25 wrapper `@Input`s (size/state/searchable/clearable/showSelectAll/maxChipsVisible/displayMode/popoverTitle/iconLeft/useTailwind/*Class/…).
- 4 wrapper `@Output`s (`valuesChange`, `opened`, `closed`, `showMoreClick`).
- 8 Stencil events per tag (`change`/`add`/`remove`/`search`/`open`/`close`/`clear`/`blur`) — only 4 surfaced.
- Full CVA (array value).

### 3. What is dynamic through slots / ng-template?
- Shadow: `slot="options"` + `slot="icon-left"`. `-tw`: `slot="icon-left"` only (G11). No per-chip / per-option Angular template (G1).

### 4. What is dynamic through token/theme overrides?
- Every selection-path visual axis (~120 `--falcon-multi-select-*` tokens incl. chip/pill/panel/search/select-all). Portaled panel reads them via the `.falcon-overlay-container` `:where` member. Dark mode + density automatic. chip-list path NOT token-driven (G12).

### 5. What is dynamic through Tailwind classes?
- 5 `*Class` passthrough inputs (`wrapperClass`/`triggerClass`/`panelClass`/`optionClass`/`labelClass`) on the Light path; host `class=` for layout.

### 6. What is missing to make this reusable across pages?
- Tailwind-path `slot="options"` (G11), per-option/per-chip templates (G1), `iconUrl` on options (G9), async loading (G3), method proxies (G7), `maxSelected`+`chipMode` (G8), grouping (G5), chip-list tokens (G12).

### 7. What capability should be added to the shared component (not a page hack)?
- All of the above — the wrapper is the single cross-framework chokepoint.

### 8. What flags / options / templates / slots would make it better?
- `FalconMultiSelectOptionTemplateDirective` + `FalconMultiSelectChipTemplateDirective`; `maxSelected`, `chipMode`; `loadOptions(query)` async hook; `searched`/`added`/`removed`/`chipRemoved` outputs; `<slot name="options">` on `-tw`.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** method proxies (G7), `searched`/`added`/`removed`/`chipRemoved` outputs (G6/G10), `errorMessage` alias (G2), `maxSelected`+`chipMode` (G8), `iconUrl` on option type (G9).
2. **Phase B (token-ize):** mint `--falcon-multi-select-chiplist-*` and repoint the chip-list template (G12).
3. **Phase C (Stencil parity):** add `<slot name="options">` to `-tw` + wrapper Tailwind branch (G11) — render-path change, gate behind tests.
4. **Phase D:** grouped options (G5), virtual scroll (G4), async loading (G3).

### 10. What is risky to change because other pages depend on it?
- The `pushOptions()` (options + values) race-fix — fragile; do not strip the `componentOnReady` push.
- The default `useTailwind=true` switch — flipping changes DOM (Light↔Shadow) + panel placement (portal↔inline).
- `displayMode="chip-list"` markup/classes — the 4 Templates consumers depend on the exact strip/dialog look + the per-instance `--falcon-multi-select-chip-row-gap` override.
- Renaming `errorText` without an alias.
- chip overflow / "+N more" behavior — visual regressions easy to introduce.

## Verification
🟢 code-verified against the wrapper + both Stencil tags + utils + token file (read 2026-06-03). Live consumer reality (4 chip-list, picker showcase-only) 🟢 grep-verified 2026-06-03. 🟢 RE-VERIFIED 2026-06-03 (W1-b) — recommendation + capability assessment accurate; no change.
