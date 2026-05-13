*** Styling rules cheat sheet ***
*** Design property → recommended SSOT token → recommended Tailwind utility ***
*** Verified against active source at 2026-05-13 ***

# Styling rules cheat sheet

For every design-property family, this sheet records:
1. **Token** to use — the SSOT primitive name.
2. **Tailwind utility** — the canonical utility class.
3. **State variant** — utilities to layer per state.
4. **Notes** — gotchas, dark-mode behavior, density behavior, RTL behavior.

This is the authoritative recipe for new code. New components / pages should never invent new tokens or use raw values — pick from this sheet.

---

## 1. Color — text

### Default body text
- **Token**: `--color-falcon-neutral-900` (`#1a1a1a` light → `#ffffff` dark via SSOT remap)
- **Utility**: `text-falcon-neutral-900`
- **Dark mode**: Auto via SSOT cascade.

### Muted / secondary text
- **Token**: `--color-falcon-neutral-600` (`#6b7280` light → `#c7ced4` dark)
- **Utility**: `text-falcon-neutral-600`
- Or use the semantic alias: `--text-muted` (`#6b7280` light / `#9ca3af` dark) via `text-muted`

### Disabled / tertiary
- **Token**: `--color-falcon-neutral-500` (`#9ca3af` light → `#b0b7c0` dark)
- **Utility**: `text-falcon-neutral-500`

### Placeholder
- **Token**: `--color-falcon-neutral-475` (`#98a0a8`)
- **Utility**: `placeholder:text-falcon-neutral-475`

### Brand-emphasis text (links / active labels)
- **Token**: `--color-falcon-teal-500` (`#124c52`)
- **Utility**: `text-falcon-teal-500`
- **Brand-hover**: `--color-falcon-teal-600` (`#104c54`) — `hover:text-falcon-teal-600`

### Status text
- **Success**: `--color-falcon-green-700` (`#0f7a3a`) — `text-falcon-green-700`
- **Danger**:  `--color-falcon-red-500` (`#dc2626`)  — `text-falcon-red-500`
- **Warning**: `--color-falcon-amber-700` (`#a85a00`) — `text-falcon-amber-700`
- **Info**:    `--color-falcon-blue-500` (`#0ea5e9`) — `text-falcon-blue-500`

### Inversed (on solid teal background)
- **Token**: `--color-falcon-neutral-0` (`#ffffff`)
- **Utility**: `text-falcon-neutral-0`

---

## 2. Color — background

### Page canvas
- **Token**: `--color-falcon-neutral-0` (light: `#ffffff`, dark: `#1a1a2e`)
- **Utility**: `bg-falcon-neutral-0`

### Elevated surface (card / panel)
- **Token**: `--color-falcon-neutral-0` (cards mostly are white-on-white)
- **Utility**: `bg-falcon-neutral-0`
- **Dark mode**: SSOT defines `--color-falcon-bg-surface: #1f2937` in dark-only block. Cards on dark canvas should switch via `dark:bg-falcon-neutral-50` (which inverts to `#2d3748` elevated).

### Subtle well / muted bg
- **Token**: `--color-falcon-neutral-50` (light: `#f5f7f8`, dark: `#2d3748`)
- **Utility**: `bg-falcon-neutral-50`

### Hover state on neutral surface
- **Token**: `--color-falcon-neutral-100` (light: `#f1f3f5`, dark: `#3d3d3d`)
- **Utility**: `hover:bg-falcon-neutral-100`

### Brand surface (active/selected on neutral context)
- **Token**: `--color-falcon-teal-100` (`#e8f0f1`)
- **Utility**: `bg-falcon-teal-100`

### Status surfaces
- **Success bg**: `--color-falcon-green-50/100/200`  — `bg-falcon-green-100`
- **Danger bg**:  `--color-falcon-red-50/100`        — `bg-falcon-red-100`
- **Warning bg**: `--color-falcon-amber-50`          — `bg-falcon-amber-50`

### Brand teal alpha (overlay / focus halo backgrounds)
- **Tokens**: `--color-falcon-teal-alpha-{04,06,08,12,18}` (light: `rgba(13, 63, 68, X)` based on teal-700; dark: `rgba(105, 142, 146, X)` based on teal-400)
- **Utility**: `bg-falcon-teal-alpha-04` etc.
- **Use for**: focus halos, hover overlays on teal surfaces, tree selection bg.

### Dropdown / menu / popover panel bg
- **Token**: `--color-falcon-neutral-0` light / `--color-falcon-neutral-50` dark
- **Utility**: `bg-falcon-neutral-0 dark:bg-falcon-neutral-50`

---

## 3. Border — width

### Default border
- **Token**: `--falcon-border-width-1` (1 px)
- **Utility**: `border` (1px default) or `border-[length:var(--falcon-border-width-1)]` for explicit

### Emphasized — checkboxes / tree multi-check pill
- **Token**: `--falcon-border-width-1-5` (1.5 px)
- **Utility**: `border-[length:var(--falcon-border-width-1-5)]`
- **Notes**: Used by checkbox stroke + tree multi-check pill.

### Focus / send-credentials-popup
- **Token**: `--falcon-border-width-2` (2 px)
- **Utility**: `border-[length:var(--falcon-border-width-2)]`

### Stepper track
- **Token**: `--falcon-border-width-4` (4 px)
- **Utility**: rarely used outside stepper internals.

---

## 4. Border — radius

| TOKEN | PX | USE FOR |
|---|---|---|
| `--radius-none`   | 0     | Native input chrome |
| `--radius-2xs`    | 3 px  | Tree multi-check pill, legacy stepper track |
| `--radius-xs`     | 4 px  | Inline tag, badge |
| `--radius-sm`     | 8 px  | Default input border-radius, `--falcon-radius-md` aliases this |
| `--radius-md`     | 12 px | Card / panel inner |
| `--radius-lg`     | 16 px | Card / panel outer |
| `--radius-xl`     | 24 px | Hero element, primary modal |
| `--radius-2xl`    | 28 px | Special modal / spotlight |
| `--radius-3xl`    | 32 px | Largest decorative radius |
| `--radius-full`   | 9999  | Pills, avatars, switches |
| `--radius-pill`   | 9999  | Alias of `full` |
| `--radius-form`   | 20 px | Form-control variants per spec |
| `--radius-row`    | 8 px  | Tree-row + table-row corner |

**Utilities**: `rounded-none`, `rounded-2xs`, `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`.
**For named radii (`-form`, `-row`)** — use `rounded-[var(--radius-form)]` / `rounded-[var(--radius-row)]`.

---

## 5. Shadows

| TOKEN | LIGHT VALUE | DARK VALUE | USE FOR |
|---|---|---|---|
| `--shadow-falcon-xs` | `0 1px 2px rgba(0,0,0,0.04)` | `..0.20` | Subtle press |
| `--shadow-falcon-sm` | `0 1px 2px rgba(0,0,0,0.06)` | `..0.28` | Default lift |
| `--shadow-falcon-md` | `0 10px 24px rgba(0,0,0,0.10)` | `..0.35` | Card / panel |
| `--shadow-falcon-lg` | `0 10px 28px rgba(0,0,0,0.18)` | `..0.50` | Modal / drawer |
| `--shadow-falcon-xl` | `0 20px 60px ...` (2-stop) | `..` (deeper) | Hero overlay |
| `--shadow-falcon-popover` | `0 6px 18px rgba(0,0,0,0.18)` | `..0.50` | Dropdown / popover panels |
| `--shadow-falcon-menu`    | `0 12px 32px rgba(0,0,0,0.12)` | `..0.45` | Menu panels |
| `--shadow-falcon-drawer`  | `-8px 0 12px -8px rgba(0,0,0,0.06)` | `..0.35` | Drawer side panels (RTL flips to `+8px 0 ...`) |
| `--shadow-falcon-focus`        | `0 0 0 3px rgba(13,63,68,0.12)` | `..rgba(105,142,146,0.30)` | Default focus halo (teal alpha) |
| `--shadow-falcon-focus-strong` | `0 0 0 2px rgba(13,63,68,0.15)` | `..rgba(105,142,146,0.35)` | Tighter focus (button) |
| `--shadow-falcon-danger-focus` | `0 0 0 3px rgba(220,38,38,0.15)` | `..0.35` | Error-state focus halo |
| `--shadow-falcon-sticky-edge`  | `-8px 0 8px -6px rgba(13,63,68,0.08)` | (stable) | Tree-node sticky edge (RTL flips) |
| `--shadow-falcon-action`       | `0 1px 3px rgba(0,0,0,0.25)` | (stable) | Single-uploader action button |
| `--shadow-brand-soft`          | `0 8px 18px rgba(16,76,84,0.08)` | (stable) | Brand-soft decorative |

**Utilities**: `shadow-falcon-xs`, `shadow-falcon-sm`, ..., `shadow-falcon-focus`, `shadow-falcon-danger-focus`, etc.

---

## 6. Spacing — padding / margin / gap (`--spacing-*`)

| TOKEN | VALUE | USE FOR |
|---|---|---|
| `--spacing-0`    | 0       | Reset |
| `--spacing-px`   | 1 px    | Hairline / border placeholder |
| `--spacing-0.5`  | 2 px    | Micro-gap |
| `--spacing-1`    | 4 px    | Tight inline gap |
| `--spacing-1.5`  | 6 px    | Default form gap |
| `--spacing-2`    | 8 px    | Default control internal padding |
| `--spacing-2.5`  | 10 px   | Tighter card padding |
| `--spacing-3`    | 12 px   | Standard card padding |
| `--spacing-3.5`  | 14 px   | Card body |
| `--spacing-4`    | 16 px   | Comfortable card padding |
| `--spacing-5`    | 24 px   | Section separator |
| `--spacing-6`    | 32 px   | Heading-to-body |
| `--spacing-7`    | 40 px   | Sectional gap |
| `--spacing-8`    | 48 px   | Major-section gap |
| `--spacing-9`    | 56 px   | (also `--spacing-14`) |
| `--spacing-10`   | 60 px   | Hero padding |
| `--spacing-11`   | 64 px   | (also `--spacing-16`) |
| `--spacing-12`   | 80 px   | (also `--spacing-20`) |
| `--spacing-24`   | 96 px   | Page-top padding |

**Utilities**: `p-{0..24}`, `m-{0..24}`, `gap-{0..24}` etc. Tailwind v4 reads `--spacing-N` for the `N` in those utilities.

### Layout-specific spacing tokens (use for ALL layout primitives)
- `--spacing-sidebar` (`14rem` = 224 px) — sidebar width.
- `--spacing-sidebar-collapsed` (`4.25rem` = 68 px) — collapsed sidebar.
- `--spacing-topbar` (`4.5rem` = 72 px) — topbar height.
- `--spacing-clients` (`17rem` = 272 px) — clients panel width.
- `--spacing-rail` (`1.125rem` = 18 px) — tree rail width.
- `--spacing-row-h` (`2.25rem` = 36 px) — tree row min-height.
- `--spacing-row-gap` (`0.375rem` = 6 px) — tree row gap.
- `--spacing-row-pad-x` (`0.625rem` = 10 px) — tree row horizontal padding.
- `--spacing-row-pad-y` (`0.375rem` = 6 px) — tree row vertical padding.

**Utilities**: `w-[length:var(--spacing-sidebar)]`, `h-[length:var(--spacing-topbar)]`, etc.

---

## 7. Sizing (controls / icons / tiles / stepper) — `--falcon-size-*`

These are NOT for padding/margin — they're for setting `width` and `height` directly. SSOT comment (`falcon-tailwind-tokens.css:150-152`) makes this rule explicit. Gate `gate-12-component-token-scope.mjs` enforces.

### Control heights (input / button / dropdown trigger)
- `--falcon-size-control-sm` (28 px) — small height.
- `--falcon-size-control-md` (34 px) — uploader button, multi-select trigger.
- `--falcon-size-control-lg` (38 px) — default form control height.

### Icon sizes (semantic)
- `--falcon-size-icon-xs` (12 px) — toast dismiss x.
- `--falcon-size-icon-sm` (14 px) — chevron, multi-check pill, popup chrome.
- `--falcon-size-icon-md` (16 px) — generic / default icon.
- `--falcon-size-icon-lg` (24 px) — compact uploader icon, paginator nav.

### Iconify-facing aliases (Wave 8E)
- `--falcon-icon-sm` → `var(--falcon-size-icon-sm)` (14 px)
- `--falcon-icon-md` → `var(--falcon-size-icon-md)` (16 px)
- `--falcon-icon-lg` → `var(--falcon-size-icon-lg)` (24 px)

### Tile sizes (uploader / single-uploader)
- `--falcon-size-tile-compact` (56 px)
- `--falcon-size-tile-sm` (96 px)
- `--falcon-size-tile-md` (128 px)
- `--falcon-size-tile-lg` (176 px)

### Stepper circle sizes
- `--falcon-size-stepper-circle-sm` (16 px)
- `--falcon-size-stepper-circle-md` (18 px) — default
- `--falcon-size-stepper-circle-lg` (20 px)

**Utilities**: `h-[length:var(--falcon-size-control-md)]`, `w-[length:var(--falcon-size-icon-md)]`, etc. (Arbitrary-value Tailwind utilities — safelist these or use them where they get scanned.)

---

## 8. Typography

### Font family
- `--font-sans` (default = `var(--font-sans-latin)`) — most apps.
- `--font-sans-latin` (Neue Haas Grotesk Display Pro) — body Latin text.
- `--font-sans-ar` (Cairo) — body Arabic text.
- `--font-display` (Poppins, Inter) — headings + display.
- `--font-arabic` (IBM Plex Sans Arabic, Poppins) — Arabic display.

**Utilities**: `font-sans`, `font-sans-latin`, `font-sans-ar`, `font-display`, `font-arabic`.

**Note**: `apps/host-shell/src/styles.scss` overrides `--font-sans: 'Poppins', 'Inter', ...` with `!important`. Conflict with SSOT — see UPGRADE_CANDIDATES UP-10.

### Type scale (font-size)
| TOKEN | VALUE | USE FOR |
|---|---|---|
| `--text-4xs` | `9 px`   | Tree-node badge counts |
| `--text-3xs` | `10 px`  | Studio meta-labels |
| `--text-2xs` | `11 px`  | Section labels |
| `--text-xs`  | `12 px`  | Form labels, captions |
| `--text-sm`  | `14 px`  | Body small |
| `--text-md`  | `16 px`  | Body (default) |
| `--text-base`| `16 px`  | Alias |
| `--text-lg`  | `20 px`  | Body emphasis |
| `--text-xl`  | `28 px`  | Heading H4 |
| `--text-2xl` | `24 px`  | Heading H3 |
| `--text-3xl` | `32 px`  | Heading H2 |
| `--text-4xl` | `40 px`  | Heading H1 |
| `--text-5xl` | `48 px`  | Hero |
| `--text-display` | `80 px` | Display headline |

**GAP**: `xl` > `2xl` in value (28 px > 24 px) — non-monotonic. Per V0.2 reference. Use with awareness.

**Utilities**: `text-4xs`, `text-3xs`, ..., `text-display`.

### Line-height
- `--falcon-leading-tight`   (1.2) — display
- `--falcon-leading-snug`    (1.3) — input field text
- `--falcon-leading-normal`  (1.4) — body
- `--falcon-leading-relaxed` (1.5) — readable body
- `--falcon-leading-loose`   (2.1) — special long-form

**Utilities**: `leading-[var(--falcon-leading-snug)]`, etc.

### Letter-spacing
- `--tracking-label`        (0.01em) — labels.
- `--tracking-brand-copy`   (0.03em) — brand copy.

**Utilities**: `tracking-label`, `tracking-brand-copy`.

---

## 9. Hover / focus / error / success / warning / disabled / loading

These are STATES, not properties. The recipe is:

1. **Pick the property** (color/bg/border/shadow).
2. **Reference the component-token by state**:
   - Default: `--falcon-X-{prop}`
   - Hover: `--falcon-X-{prop}-hover`
   - Focus: `--falcon-X-{prop}-focus`
   - Error: `--falcon-X-{prop}-error`
   - Success: `--falcon-X-{prop}-success`
   - Warning: `--falcon-X-{prop}-warning`
   - Disabled: `--falcon-X-{prop}-disabled`
   - Loading: depends on component — see button/spinner tokens.
3. **Apply the right Tailwind variant prefix**: `hover:`, `focus:`, `disabled:`. Error/success/warning are state-bound, not pseudo-class-bound, so they're typically applied via `[data-state=error]` attribute selectors or by the wrapper's class-string helper.

### Examples

```html
<!-- Default bg, hover bg, focus border, error border -->
<div class="bg-[var(--falcon-input-bg)]
            hover:bg-[var(--falcon-input-bg-hover)]
            focus:bg-[var(--falcon-input-bg-focus)]
            focus:border-[var(--falcon-input-border-color-focus)]
            data-[state=error]:border-[var(--falcon-input-border-color-error)]">
</div>
```

(Real wrapper helper emits this conditionally — see `falconInputWrapperClasses` in `libs/falcon-ui-core/src/tailwind/input-tailwind-classes.ts`.)

### Loading state
- Buttons: `--falcon-button-spinner-size-md` + `--falcon-button-loading-label-opacity` (0). The label fades out; the spinner shows. Width stays stable.

---

## 10. Dark mode

Trigger: `<html class="app-dark">` (canonical) or `<html class="dark">` (compat).
Wired as `@custom-variant dark (&:where(.app-dark, .app-dark *))` in SSOT line 13.

### Tokens that MOVE
- Neutrals (all 27 stops invert per dark block lines 391-417).
- Surface aliases `--color-falcon-bg-page`, `--color-falcon-bg-surface` added only in dark.
- Shadows strengthen (alpha doubles or triples per stop).
- Focus rings shift from teal-700-base alpha to teal-400-base alpha.
- Wave-9 teal-option / teal-mid flip values.
- Teal alpha derivatives recalculate.
- Text-muted alias shifts.

### Tokens that STAY (geometry stable)
- Type scale.
- Spacing scale.
- Radii.
- Border widths.
- Sizing tokens (control/icon/tile/stepper).
- Breakpoints.
- Motion durations + easings + keyframes.
- Z-index.
- Status colors (green/red/amber/blue) — intentionally unchanged.
- Brand teal swatches (`teal-500` etc.) — unchanged.

### Tokens that need component-token bypass (`themes/dark.css`)
- Per-component focus halos that hardcode `rgba(...)`.
- Toast severity bg/color (sky-blue tint without an SSOT chain).
- Specific bg-readonly / bg-disabled where the cascade doesn't naturally invert.
- Wizard btn-back fg/border / btn-draft fg.
- Stepper hardcoded rgba halos.
- Table / data-table loading-overlay-bg.
- Chip / option hover backgrounds in multi-select / dropdown / combobox.
- Various others — see `themes/dark.css` (178 lines).

### Usage in templates

```html
<div class="bg-falcon-neutral-0 text-falcon-neutral-900
            dark:bg-falcon-neutral-50 dark:text-falcon-neutral-900">
  <!-- Note: dark:text-falcon-neutral-900 RESOLVES to dark:#ffffff via SSOT remap. -->
  <!-- For most cases, no `dark:` prefix is needed because neutrals auto-invert. -->
</div>
```

**Recommendation**: Most of the time you do NOT need `dark:` prefixes on Falcon tokens. The cascade does it. Only add `dark:` when the dark value diverges semantically (e.g. a card that should be `neutral-0` in light but `neutral-50` in dark — different stops, not just inverted).

---

## 11. Density

Toggled via `[data-density='comfortable']` (default) or `[data-density='compact']` on any ancestor. Pattern set in `density/comfortable.css` and `density/compact.css`.

### Density-aware components
- input / dropdown / combobox / multi-select (heights + paddings)
- button (height + padding)
- menu (item min-height + padding)
- table (row-height + cell padding)

### Density-stable components
- icon
- avatar
- badge (size-keyed but density doesn't kick in)
- tag
- tree (uses its own row tokens directly from SSOT)
- card (padding is variant-keyed, not density-keyed)

### Switching at runtime
- Today: NO runtime UI switches density. The theme service (`PrimeNGThemeService` — name vestige; renames to `FalconThemeService` per its real role) does not yet write `data-density`. See UPGRADE_CANDIDATES UP-16.
- Cascade is ready: set `data-density='compact'` on `<html>` and every density-aware component re-renders tighter.

### Recommended utility
```html
<div data-density="compact">
  <falcon-angular-input></falcon-angular-input>  <!-- height shrinks to 34 / 28 px -->
</div>
```

---

## 12. RTL

Toggled via `[dir='rtl']` on `<html>` (Angular `RtlService` writes this).

### Auto-flips (logical CSS properties handle these)
- `padding-inline-*` / `margin-inline-*` / `inset-inline-*`
- Text direction
- Chevron position (uses `inset-inline-end`)
- Most icon positions

### Explicit RTL token overrides (`rtl/rtl.css`)
- `--shadow-falcon-drawer` flips from `-8px 0 ...` to `+8px 0 ...`
- `--shadow-falcon-sticky-edge` flips direction
- `--falcon-toast-slide-distance` flips from `-12px` to `+12px`
- `--falcon-dialog-side-right-enter-translate-x` flips to `-100%`

### Notes
- Tailwind v4 supports logical-property utilities: `ps-*` (padding-inline-start), `me-*` (margin-inline-end), `start-*` (inset-inline-start). Prefer these over `pl-*`/`mr-*`/`left-*` for RTL safety.
- Falcon icon font CSS (`falcon-icons.css`) does NOT mirror. Some glyphs may need a CSS transform on `[dir='rtl']` — not currently in scope per `rtl.css`.

---

## Common pitfalls and how to avoid them

### ❌ Avoid: hardcoded hex
```html
<div class="bg-[#ffffff] text-[#1a1a1a]">  <!-- DON'T -->
```

### ✅ Use tokens
```html
<div class="bg-falcon-neutral-0 text-falcon-neutral-900">  <!-- DO -->
```

### ❌ Avoid: inline style attribute
```html
<div style="padding: 12px; border-radius: 8px;">  <!-- DON'T -->
```

### ✅ Use utilities
```html
<div class="p-3 rounded-sm">  <!-- DO -->
```

### ❌ Avoid: Angular `[style.X]=` binding (except for unavoidable dynamic geometry like SVG transforms)
```html
<button [style.background-color]="bg">  <!-- DON'T -->
```

### ✅ Use class binding or CSS custom property mutation
```html
<button [class.bg-falcon-teal-500]="isPrimary" [class.bg-falcon-neutral-0]="!isPrimary">
```

### ❌ Avoid: SCSS / component-CSS rules in `*.component.scss`
```scss
.my-section { padding: 16px; }  /* DON'T — no SCSS allowed per ANGULAR_AND_TAILWIND_RULES */
```

### ✅ Use Tailwind utilities in the template
```html
<section class="p-4">  <!-- DO -->
```

### ❌ Avoid: inventing new tokens
```css
.my-form { --custom-padding: 17px; }  /* DON'T */
```

### ✅ Use existing tokens or extend the SSOT
- Pick the nearest SSOT spacing (16 px = `--spacing-4`).
- If a new value is truly required, add it to `libs/falcon-theme/src/falcon-tailwind-tokens.css` `@theme` block AND `tokens.ts` (via `nx run falcon-theme:generate-tokens-ts`).

### ❌ Avoid: importing PrimeNG / PrimeIcons
```ts
import { ButtonModule } from 'primeng/button';  /* DON'T — Wave PR-8 removed PrimeNG */
```

### ✅ Use Falcon UI components
```ts
import { FalconAngularButtonComponent } from '@falcon/ui-core';
```

---

## Cross-references

- See `THEME_SSOT_AUDIT.md` for full token enumeration.
- See `TOKEN_FLOW_REPORT.md` for cascade propagation.
- See `COMPONENT_TOKEN_FILES_AUDIT.md` for per-component token contracts.
- See `DARK_MODE_AUDIT.md`, `DENSITY_AND_RTL_AUDIT.md` for state-specific behavior.
- See `STATIC_STYLE_RISKS.md` for known violations.
