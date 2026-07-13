# falcon-dropdown — DECISION

> Sweep-refreshed 2026-06-03 (B04).

## Brain SK final recommendation

**STATUS: READY for single-select. NEEDS-UPGRADE for advanced customization (per-option templates, async loading, multi-mode).** The most heavily-consumed form control after `<falcon-input>` (54 distinct consumer files: 51 in `apps/` + 3 in `libs/falcon/` — verified 2026-06-03 W1-b).

## Use this component for

- Single-value picker from a static list of options.
- Searchable picker when option count > ~10 (`searchable=true`).
- Type-ahead navigation (closed dropdown picks via printable keys, native-`<select>`-style).
- Language / locale picker (via `iconUrl` Wave 4 pattern).
- Status / role / country / category / currency / channel pickers inside wizards and drawers.

## Avoid this component for

- Multi-value selection → `<falcon-angular-multi-select>`.
- Free-text + selectable suggestions → `<falcon-angular-combobox>`.
- Server-side async-loaded options → wait for G4 (or wire the raw tag's `falcon-search`).
- Tree-shaped options → `<falcon-angular-tree>`.
- Country picker INSIDE a phone field → `<falcon-angular-phone-field>`.
- Structured per-option rows → blocked on G1.

## Preferred variant / render path

**`useTailwind=true` (default).** Best for Studio token-runtime mutation, cross-framework parity, Tailwind overrides, AND the **body-portaled panel** that escapes ancestor stacking contexts (critical inside drawers/dialogs/data-table cells). Toggle to **`useTailwind=false` (Shadow)** ONLY when you need:
- `slot="options"` for fully custom panel content (Tailwind path has no options slot — G1), or
- style isolation from a noisy parent stylesheet.

> Note: the Shadow path renders its panel INLINE (no portal) — it can be clipped by `overflow:hidden` ancestors. Do not switch to Shadow inside a drawer unless you also control the clipping.

## Required upgrades before wider use

None blocking. Per use-case: per-option custom rendering → G1; server-side options → G4; multi-select → use the multi-select component. The 10 gaps in `GAPS_AND_UPGRADES.md` are improvements, not blockers.

## Relationship to other components

- **Aliased BY:** `<falcon-angular-select>` (a re-export of this class, DEAD CANDIDATE — see falcon-select dossier).
- **Sibling specialists:** `<falcon-angular-multi-select>` (multi), `<falcon-angular-combobox>` (free-text combo).
- **Shares form-control DNA with:** `<falcon-angular-input>`, `<falcon-angular-textarea>`, `<falcon-angular-input-number>` (size/state/variant/appearance + CVA + dual-render).
- **Often composed inside:** `<falcon-angular-data-table>` filter rows + wizard steps + the wallet transfer drawer.

## Exact rule for future implementation tasks

1. **Single value from a known list?** → `<falcon-angular-dropdown>` with `useTailwind=true` (default).
2. Set `searchable=true` if > ~10 options; `clearable=true` for optional fields.
3. Bind via `formControlName` or `[(ngModel)]` — never `[value]`.
4. Use `errorText` + `state="error"` together (note: input name is `errorText`, NOT `errorMessage`).
5. Use `[disabled]="cond"` — a **property** binding, never `[attr.disabled]`.
6. Use `iconUrl` on options for flags/avatars.
7. Use per-instance token overrides (host class mutating `--falcon-dropdown-*`) for visual tweaks; for the portaled panel use `panelClass`. Never hardcode hex/px.
8. Switch to `useTailwind=false` only for a fully custom `slot="options"` panel.

---

## Dynamic capability assessment

### 1. What is static today?
- Inline SVG paths for chevron / clear / search icons (hardcoded in both `.tsx`).
- Type-ahead drain timer (600ms hardcoded).
- Shadow-path panel placement (always inline below trigger); `-tw` placement is computed by `positionPopoverFixed`.
- `slot="options"` only on the Shadow path; no per-option template.
- `appendTo` is `-tw`-only; Shadow is always inline.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` 24 wrapper `@Input`s (incl. `iconLeft`, `loading`, `disabled` setter) covering size/state/variant/appearance/searchable/clearable + 5 Tailwind class hooks.
- 3 wrapper outputs (`valueChange`, `opened`, `closed`); Stencil-side 6 events + 4 methods.
- Full CVA.

### 3. What is dynamic through slots / ng-template?
- Shadow: `slot="options"` + `slot="icon-left"`. Tailwind: `slot="icon-left"` only (no options slot).
- No `ng-template` inputs on the wrapper (G1).

### 4. What is dynamic through token/theme overrides?
- Every visual axis (~100 `--falcon-dropdown-*` tokens incl. panel/option/search/chevron). Per-instance host-class scope works for the trigger; the body-portaled panel inherits via `.falcon-overlay-container` in the token `:where()`.
- Dark mode flips neutrals automatically; density presets shift heights.

### 5. What is dynamic through Tailwind classes?
- `wrapperClass`/`triggerClass`/`panelClass`/`optionClass`/`labelClass` (Tailwind path) + host `class=` for layout. Variant/appearance overlays are Tailwind-encoded on the `-tw` path.

### 6. What is missing to make this component reusable across pages?
- Per-option template + Tailwind options slot (G1).
- `setFocus()`/`openPanel()`/`clear()` proxies (G6).
- Async option loading (G4).
- `searched` event re-emission (G7).
- Grouped options (G5).
- `errorMessage` alias (G2).
- `aria-activedescendant` on trigger (A2).

### 7. What capability should be added to the shared component (not page hack)?
- All of the above — per-page per-option rendering or async loading would re-implement the same plumbing.

### 8. What flags / options / templates / slots would make it better?
- `<ng-template falconDropdownOption let-option>` directive.
- `loadOptions(query)` async source + `searched` output.
- `group` field on options.
- `virtualScroll` for large lists.
- Method proxies + `errorMessage` alias + `typeAheadDelay`.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** wrapper method proxies (`setFocus`/`openPanel`/`closePanel`/`clear`), `errorMessage` alias, `searched` `@Output`, `typeAheadDelay`, `group` field. `safe-local`.
2. **Phase B (a11y):** add `aria-activedescendant` on the trigger in both `.tsx`. `HIGH-RISK-QUEUE` (semantics).
3. **Phase C (slot parity):** add `<slot name="options">` to `<falcon-dropdown-tw>` + a `FalconDropdownOptionTemplateDirective`. `HIGH-RISK-QUEUE`.
4. **Phase D (async):** `loadOptions` hook + loading token. `HIGH-RISK-QUEUE`.

### 10. What is risky to change because other pages depend on it?
- `[CODE]` The `pushOptions()` / `writeValue` `componentOnReady` race-fix — backs the data-table cell-remount-empty fix; don't refactor without tests.
- The default `useTailwind=true` — flipping it changes DOM (Light↔Shadow) AND drops body-portaling → drawers/dialogs would clip the panel + tests break.
- Renaming `errorText` → `errorMessage` without an alias — silent breakage in ~54 consumer files.
- The reflected Shadow-only attrs (`variant`/`appearance`/`state`) — Studio CSS keyed on `:host([...])` would need updating.
- The `[disabled]` property setter — business role-locks (Owner-Role, User-Status) depend on it; never convert to `[attr.disabled]`.
- The 600ms type-ahead drain — some accessibility flows depend on the timing.

## Verification
🟢 RE-VERIFIED 2026-06-03 (W1-b) against the live wrapper. Recommendation + capability assessment accurate; consumer count corrected to 54 distinct files (51 `apps/` + 3 `libs/falcon/`).
