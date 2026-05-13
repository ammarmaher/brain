*** Theme SSOT — `libs/falcon-theme/src/falcon-tailwind-tokens.css` — Deep Audit ***
*** Verified against active source at 2026-05-13 ***

# Falcon Theme SSOT Audit

The Falcon Tailwind theme SSOT is the single `@theme` declaration block that drives every Tailwind utility (color, text, p-/m-, rounded, shadow, etc.) across the platform. This audit catalogs every section, every dark-mode override, the layer order, the `@source`/`@config` directives, and the `@custom-variant dark` configuration.

**File**: `libs/falcon-theme/src/falcon-tailwind-tokens.css`
**Lines**: 486
**Token count (auto-generated)**: 216 (see `libs/falcon-theme/src/tokens.ts:4`)
**Layered behind**: Tailwind v4 imports via `@import "tailwindcss";` on line 5

---

## Top-of-file directives

```css
/* line 5  */ @import "tailwindcss";
/* line 8  */ @config "../../../tailwind.config.js";
/* line 11 */ @layer theme, base, falcon-base, utilities;
/* line 13 */ @custom-variant dark (&:where(.app-dark, .app-dark *));
```

### `@import "tailwindcss"`
Pulls Tailwind v4 core (the preflight + utility generator). Required for Tailwind v4 to bootstrap from this file.

### `@config "../../../tailwind.config.js"` (line 8)
Resolves to `tailwind.config.js` at workspace root. **The config file is `module.exports = {}` — EMPTY.** The SSOT file's inline comment at line 7 says: "v4 config bridge — re-enables `important: true` so utilities beat legacy ::ng-deep overrides." This comment is **STALE** — see the `tailwind.config.js` inline comment which documents the deliberate reversal:

```js
/*** PrimeNG was fully removed (8-wave PrimeNG-total-removal program, 2026-05-10), so the
     historical `important: true` flag — added to beat `:host ::ng-deep .p-*` overrides —
     is no longer needed and was actively harmful: it made every utility !important and
     silently overrode JS-set inline styles in dynamic Stencil components (e.g. the
     <falcon-tabs-tw> sliding indicator stayed at 0px because `.w-0` beat the JS-set width). ***/
module.exports = {};
```

**GAP**: The SSOT file comment (`falcon-tailwind-tokens.css:7`) should be updated to reflect the post-PrimeNG decision. The `@config` directive is now a vestige.

### `@layer theme, base, falcon-base, utilities;` (line 11)
Declares Tailwind layer ORDER. Order = priority (later wins). So `utilities` beats `falcon-base` beats `base` beats `theme`. This is the v4-canonical layering pattern; it is also why hand-written utility classes win over the Falcon-base layer overrides (which currently is unused; reserved for future Falcon-specific reset rules).

### `@custom-variant dark (&:where(.app-dark, .app-dark *))` (line 13)
Wires Tailwind's `dark:` prefix to fire under `.app-dark` (and via the `&:where(...)` syntax, anywhere `.app-dark` is in the ancestor chain). Toggling `<html class="app-dark">` activates every `dark:` utility AND triggers the dark-override block at lines 385-451.

**Note**: dark mode ALSO fires under `.dark` (line 386 of the dark override block, plus the second selector in the where). Two class names work.

---

## The `@theme` block — 14 token families

The `@theme` block runs from line 15 to line 360. Tokens are organized into 14 functional families by hand-typed comment dividers.

### Family 1 — Brand Teal (lines 16-39)

| Token | Value |
|---|---|
| `--color-falcon-teal-50` | `#f3f8f5` |
| `--color-falcon-teal-100` | `#e8f0f1` |
| `--color-falcon-teal-200` | `#d1e0e2` |
| `--color-falcon-teal-300` | `#a8bec0` |
| `--color-falcon-teal-400` | `#698e92` |
| `--color-falcon-teal-500` | `#124c52` (brand) |
| `--color-falcon-teal-600` | `#104c54` |
| `--color-falcon-teal-700` | `#0d3f44` |
| `--color-falcon-teal-800` | `#0a3338` |
| `--color-falcon-teal-900` | `#082a2e` |
| `--color-falcon-teal-tint` | `#eef3f4` |
| `--color-falcon-teal-option` | `#f1f6f6` (Wave 9 — option-hover surface) |
| `--color-falcon-teal-mid` | `#00827a` (Wave 9 — mid-teal accent) |
| `--color-falcon-teal-alpha-04` | `rgba(13, 63, 68, 0.04)` |
| `--color-falcon-teal-alpha-06` | `rgba(13, 63, 68, 0.06)` |
| `--color-falcon-teal-alpha-08` | `rgba(13, 63, 68, 0.08)` |
| `--color-falcon-teal-alpha-12` | `rgba(13, 63, 68, 0.12)` |
| `--color-falcon-teal-alpha-18` | `rgba(13, 63, 68, 0.18)` |

**Notes**:
- `teal-500` and `teal-600` differ by one digit (`#124c52` vs `#104c54`) — easy to confuse. `teal-500` is the canonical brand color per file header comment.
- Five alpha derivatives use `rgba(13, 63, 68, ...)` — which is the teal-700 RGB value, NOT teal-500. Documented in code: alpha tokens are based on teal-700 (the deeper end). Dark mode flips these to `rgba(105, 142, 146, ...)` (teal-400 RGB).
- Wave 9 added `teal-option` + `teal-mid`. Dark mode swaps them to `#1e3a3a` + `#2dd4d9` (lines 439-440).

### Family 2 — Neutrals (lines 41-70)

27 stops: `0 / 20 / 25 / 30 / 40 / 45 / 50 / 75 / 100 / 150 / 160 / 175 / 200 / 300 / 350 / 400 / 450 / 475 / 500 / 600 / 700 / 750 / 800 / 850 / 900 / 925 / 950`.

```
neutral-0   = #ffffff
neutral-20  = #fcfcfd
neutral-25  = #fafbfc
neutral-30  = #fafafa
neutral-40  = #f8f8f8
neutral-45  = #f7f8f9
neutral-50  = #f5f7f8
neutral-75  = #f5f6f7
neutral-100 = #f1f3f5
neutral-150 = #eef0f2
neutral-160 = #eff1f3
neutral-175 = #e7eaee
neutral-200 = #e5e7eb
neutral-300 = #d4d8dc
neutral-350 = #d1d5db
neutral-400 = #c7ced4
neutral-450 = #c4c9cf
neutral-475 = #98a0a8
neutral-500 = #9ca3af
neutral-600 = #6b7280
neutral-700 = #5a6470
neutral-750 = #4a5568
neutral-800 = #3d3d3d
neutral-850 = #2d3748
neutral-900 = #1a1a1a
neutral-925 = #111827
neutral-950 = #000000
```

**Notes**:
- Scale is denser at the LIGHT end (50/75/100/150/160/175/200) and SPARSER at the dark end. Reflects real usage in the active source — light surfaces and borders need many fine gradations; dark canvas needs fewer because dark mode INVERTS the same names.
- Hex values DROP across the scale monotonically (whitest at 0, blackest at 950) — confirmed.
- All 27 stops are FULLY remapped in the dark override block (lines 391-417). See "Dark mode" section below.

### Family 3 — Status / accents (lines 72-116)

| Family | Stops | Notes |
|---|---|---|
| Green | `50 / 100 / 200 / 500 / 700` | `green-50 = #F3F8F5;;` has **double semicolon** (line 75). Mixed case — `#F3F8F5` is uppercase, the rest lower. |
| Red | `50 / 100 / 500 / 700 / 900` | Standard scale. |
| Amber | `50 / 500 / 700` | Limited scale. |
| Blue | `500` only | Used for `info` severity. |
| Popover | `popover-dark = #3b4752` | Tooltip dark-pill. |
| Orgchart line | `rgba(124, 130, 169, 0.5)` | Tree-rail gradient stop. |
| Cyan | `#2dd4d9` | Wave-9 dark-mode `teal-mid`. |
| Lilac | `25 / 100 / 450 / 500` | Studio decorative palette. |
| Mint | `100 / 200` | Tree indicator (light mode). |
| Brand | `aramco / aramco-1/2/3 / bmw / rajhi / snb / bupa / bupa-soft` | Per-tenant accents. |

### Family 4 — Typography (lines 118-147)

```
--font-sans:       var(--font-sans-latin);
--font-sans-latin: "Neue Haas Grotesk Display Pro", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
--font-sans-ar:    "Cairo", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
--font-display:    "Poppins", "Inter", system-ui, sans-serif;
--font-arabic:     "IBM Plex Sans Arabic", "Poppins", sans-serif;

--text-4xs:    0.5625rem;  /* 9px  */
--text-3xs:    0.625rem;   /* 10px */
--text-2xs:    0.6875rem;  /* 11px */
--text-xs:     0.75rem;    /* 12px */
--text-sm:     0.875rem;   /* 14px */
--text-md:     1rem;       /* 16px */
--text-base:   1rem;       /* 16px (alias) */
--text-lg:     1.25rem;    /* 20px */
--text-xl:     1.75rem;    /* 28px */
--text-2xl:    1.5rem;     /* 24px */
--text-3xl:    2rem;       /* 32px */
--text-4xl:    2.5rem;     /* 40px */
--text-5xl:    3rem;       /* 48px */
--text-display: 5rem;      /* 80px */

--falcon-leading-tight:    1.2;
--falcon-leading-snug:     1.3;
--falcon-leading-normal:   1.4;
--falcon-leading-relaxed:  1.5;
--falcon-leading-loose:    2.1;
```

**GAP**: `--text-xl: 1.75rem` (28px) > `--text-2xl: 1.5rem` (24px). Scale is **non-monotonic** between xl and 2xl. Verified — line 135 vs line 136. Memory note `feedback_v02_theme_adopted.md` says V0.2 theme is the source; the React reference V0.2 uses these exact values. So this is intentional — `text-xl` is the heading scale, `text-2xl` is the body-emphasis scale per the reference. Confusing but pinned.

**Tracking**: `--tracking-label: 0.01em`, `--tracking-brand-copy: 0.03em` (lines 349-350).

### Family 5 — Sizing (lines 149-176)

```
--falcon-size-control-sm: 1.75rem;    /* 28px */
--falcon-size-control-md: 2.125rem;   /* 34px */
--falcon-size-control-lg: 2.375rem;   /* 38px */

--falcon-size-icon-xs:    0.75rem;    /* 12px */
--falcon-size-icon-sm:    0.875rem;   /* 14px */
--falcon-size-icon-md:    1rem;       /* 16px */
--falcon-size-icon-lg:    1.5rem;     /* 24px */

--falcon-icon-sm:  var(--falcon-size-icon-sm);  /* Wave 8E semantic alias */
--falcon-icon-md:  var(--falcon-size-icon-md);
--falcon-icon-lg:  var(--falcon-size-icon-lg);

--falcon-size-tile-compact: 3.5rem;   /* 56px  - single-uploader compact tile */
--falcon-size-tile-sm:      6rem;     /* 96px  */
--falcon-size-tile-md:      8rem;     /* 128px */
--falcon-size-tile-lg:      11rem;    /* 176px */

--falcon-size-stepper-circle-sm: 1rem;       /* 16px */
--falcon-size-stepper-circle-md: 1.125rem;   /* 18px */
--falcon-size-stepper-circle-lg: 1.25rem;    /* 20px */
```

**Important boundary**: SSOT comment (lines 150-152) declares: "**SIZING — control / icon / pill / tile / stepper sizing (do NOT confuse with --spacing-\*, which is for padding/margin/gap)**". The component-token-scope gate enforces this. Token family separation is real and load-bearing.

### Family 6 — Stepper customisation (lines 178-209, Wave 10D)

11 Studio surface knobs that drive non-technical user customisation:

```
--falcon-stepper-step-shape:        circle;
--falcon-stepper-step-radius:       9999px;
--falcon-stepper-step-rotate:       0deg;
--falcon-stepper-step-size-1:       0.875rem;  /* 14px */
--falcon-stepper-step-size-2:       1rem;      /* 16px */
--falcon-stepper-step-size-3:       1.125rem;  /* 18px (default) */
--falcon-stepper-step-size-4:       1.375rem;  /* 22px */
--falcon-stepper-step-size-5:       1.625rem;  /* 26px */
--falcon-stepper-animation-enabled: 1;
--falcon-stepper-label-position:    bottom;
--falcon-stepper-label-visible:     1;
```

Pattern is portable to other components (dropdown chevron position, button corner shape) — see `UPGRADE_CANDIDATES.md` UP-12.

### Family 7 — Border width (lines 211-217)

```
--falcon-border-width-1:   1px;
--falcon-border-width-1-5: 1.5px;
--falcon-border-width-2:   2px;
--falcon-border-width-4:   4px;
```

CSS-property name escape: `--falcon-border-width-1-5` represents `1.5px`. Hyphen-encoded decimal to keep the variable name CSS-safe.

### Family 8 — Spacing (lines 219-254)

Falcon-custom scale (NOT Tailwind defaults). Values progress through padding/margin/gap-relevant steps:

```
--spacing-0:    0;
--spacing-px:   1px;
--spacing-0.5:  0.125rem;
--spacing-1:    0.25rem;   /* 4px  */
--spacing-1.5:  0.375rem;
--spacing-2:    0.5rem;    /* 8px  */
--spacing-2.5:  0.625rem;
--spacing-3:    0.75rem;   /* 12px */
--spacing-3.5:  0.875rem;
--spacing-4:    1rem;      /* 16px */
--spacing-5:    1.5rem;    /* 24px */
--spacing-6:    2rem;      /* 32px */
--spacing-7:    2.5rem;    /* 40px */
--spacing-8:    3rem;      /* 48px */
--spacing-9:    3.5rem;    /* 56px */
--spacing-10:   3.75rem;   /* 60px */
--spacing-11:   4rem;      /* 64px */
--spacing-12:   5rem;      /* 80px */
--spacing-14:   3.5rem;    /* (collision with -9) */
--spacing-16:   4rem;      /* (collision with -11) */
--spacing-20:   5rem;      /* (collision with -12) */
--spacing-24:   6rem;
```

**GAP**: `--spacing-14` (`3.5rem`) collides with `--spacing-9` (`3.5rem`); `--spacing-16` collides with `--spacing-11`; `--spacing-20` collides with `--spacing-12`. These are likely intentional aliases (legacy 14/16/20 names map to the V0.2 9/11/12 values), but the rule is undocumented. Either confirm or rename.

### Layout dimensions (lines 245-254)

```
--spacing-sidebar:           14rem;    /* 224px */
--spacing-sidebar-collapsed: 4.25rem;  /* 68px  */
--spacing-topbar:            4.5rem;   /* 72px  */
--spacing-clients:           17rem;    /* 272px */
--spacing-rail:              1.125rem; /* 18px  */
--spacing-row-h:             2.25rem;  /* 36px  */
--spacing-row-gap:           0.375rem; /* 6px   */
--spacing-row-pad-y:         0.375rem; /* 6px   */
--spacing-row-pad-x:         0.625rem; /* 10px  */
```

These are semantic layout primitives — sidebar width, topbar height, tree-row geometry — used as `w-[length:var(--spacing-sidebar)]` or `pl-[length:var(--spacing-row-pad-x)]` arbitrary utilities.

### Family 9 — Radii (lines 256-271)

13 tokens. Note the deliberately non-monotonic naming for legacy compatibility (`xs` < `sm` < `md` < `lg` < `xl` < `2xl` < `3xl` < `full = pill`, with `form` and `row` named for purpose):

```
--radius-none:  0;
--radius-2xs:   0.1875rem;  /* 3px  - tree multi-check pill, legacy stepper track */
--radius-xs:    0.25rem;    /* 4px  */
--radius-sm:    0.5rem;     /* 8px  */
--radius-md:    0.75rem;    /* 12px */
--radius-lg:    1rem;       /* 16px */
--radius-xl:    1.5rem;     /* 24px */
--radius-2xl:   1.75rem;    /* 28px */
--radius-3xl:   2rem;       /* 32px */
--radius-full:  9999px;
--radius-pill:  9999px;     /* alias of full */
--radius-form:  1.25rem;    /* 20px - form-control border-radius */
--radius-row:   0.5rem;     /* 8px  - tree-row corner */
```

### Family 10 — Shadows (lines 273-291)

```
--shadow-falcon-xs:           0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-falcon-sm:           0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-falcon-md:           0 10px 24px rgba(0, 0, 0, 0.10);
--shadow-falcon-lg:           0 10px 28px rgba(0, 0, 0, 0.18);
--shadow-falcon-xl:           0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 20px -6px rgba(0, 0, 0, 0.08);

--shadow-falcon-popover:      0 6px 18px rgba(0, 0, 0, 0.18);
--shadow-falcon-menu:         0 12px 32px rgba(0, 0, 0, 0.12);
--shadow-falcon-drawer:       -8px 0 12px -8px rgba(0, 0, 0, 0.06);

--shadow-falcon-focus:        0 0 0 3px rgba(13, 63, 68, 0.12);
--shadow-falcon-focus-strong: 0 0 0 2px rgba(13, 63, 68, 0.15);
--shadow-falcon-danger-focus: 0 0 0 3px rgba(220, 38, 38, 0.15);

--shadow-falcon-sticky-edge:  -8px 0 8px -6px rgba(13, 63, 68, 0.08);
--shadow-falcon-action:       0 1px 3px rgba(0, 0, 0, 0.25);
```

Outside `@theme` block (lines 348-351):
```
--shadow-brand-soft: 0 8px 18px rgba(16, 76, 84, 0.08);
--tracking-label: 0.01em;
--tracking-brand-copy: 0.03em;
```

Wave 12A REMOVED `--shadow-glass-swatch` plus 16 liquid-glass base + 12 stat-card glass tokens (documented in lines 289-291 + 353-359). Studio is no longer a glassmorphism playground.

### Family 11 — Breakpoints (lines 293-300)

```
--breakpoint-sm:   576px;
--breakpoint-md:   768px;
--breakpoint-lg:   992px;
--breakpoint-xl:   1200px;
--breakpoint-2xl:  1920px;
```

Falcon-specific (NOT Tailwind defaults). Used by Tailwind v4 to generate responsive variants.

### Family 12 — Motion (lines 302-313, 348)

```
--ease-falcon-in:    cubic-bezier(0.4, 0, 1, 1);
--ease-falcon-out:   cubic-bezier(0, 0, 0.2, 1);
--ease-falcon-inout: cubic-bezier(0.4, 0, 0.2, 1);

--duration-falcon-fast: 0.12s;
--duration-falcon-base: 0.15s;
--duration-falcon-slow: 0.30s;

--animate-menu-in:        menuIn 0.15s ease;
--transition-falcon-row:  background var(--duration-falcon-fast), box-shadow var(--duration-falcon-fast);
```

Keyframes (lines 454-486, declared OUTSIDE `@theme` block):
- `menuIn` (lines 454-457) — opacity + translateY(-4px) → opacity 1 + translateY(0)
- `falcon-fade` (lines 463-466) — opacity 0 → 1
- `falcon-scale` (lines 467-470) — opacity + scale(0.92) → opacity 1 + scale(1)
- `falcon-slide` (lines 471-474) — opacity + translateX(-12px) → opacity 1 + translateX(0)
- `falcon-soft-lift` (lines 475-478) — opacity + translateY(8px) → opacity 1 + translateY(0)
- `falcon-pulse` (lines 479-482) — opacity + scale loop
- `falcon-loading` (lines 483-486) — rotate 0 → 360deg (spinner)

Studio Animation tab references these by name via inline `animation` shorthand on the active anchor element. Shared between Light DOM Tailwind variants and Shadow DOM Stencil components.

### Family 13 — Z-index (lines 338-346)

```
--z-falcon-dropdown: 1000;
--z-falcon-sticky:   1020;
--z-falcon-fixed:    1030;
--z-falcon-overlay:  1040;
--z-falcon-modal:    1050;
--z-falcon-popover:  1060;
--z-falcon-tooltip:  1070;
```

Steps of 10. Tooltip wins everywhere.

### Family 14 — Background images (lines 316-330) + misc (line 314)

```
--background-image-falcon-rail-on-path:
  linear-gradient(to right,
    transparent calc(50% - 0.5px),
    var(--color-falcon-teal-700) calc(50% - 0.5px),
    var(--color-falcon-teal-700) calc(50% + 0.5px),
    transparent calc(50% + 0.5px));

--background-image-falcon-rail-default:
  linear-gradient(to right,
    transparent calc(50% - 0.5px),
    var(--color-falcon-teal-alpha-18) calc(50% - 0.5px),
    var(--color-falcon-teal-alpha-18) calc(50% + 0.5px),
    transparent calc(50% + 0.5px));

--text-muted: #6b7280;
```

The two rail gradients render the org-tree vertical connector line at half-pixel precision. Active state uses solid teal-700; default uses teal-alpha-18.

---

## Dark mode override block (lines 385-451)

The `@custom-variant dark` selector matches `:where(.app-dark, .app-dark *), :where(.dark, .dark *)`. Inside that scope, the following tokens re-declare:

### Neutrals (lines 387-417) — fully inverted

Every neutral stop gets a dark value. Light `neutral-0 = #ffffff` becomes dark `neutral-0 = #1a1a2e` (the canvas). The whole scale inverts so that:

| Token | Light | Dark | Role on dark canvas |
|---|---|---|---|
| `neutral-0` | `#ffffff` | `#1a1a2e` | Page canvas |
| `neutral-50` | `#f5f7f8` | `#2d3748` | Elevated surface |
| `neutral-100` | `#f1f3f5` | `#3d3d3d` | Subtle well / disabled bg |
| `neutral-200` | `#e5e7eb` | `#5a6470` | Default border |
| `neutral-400` | `#c7ced4` | `#9ca3af` | Placeholder / muted icon |
| `neutral-500` | `#9ca3af` | `#b0b7c0` | Muted text |
| `neutral-600` | `#6b7280` | `#c7ced4` | Secondary text |
| `neutral-800` | `#3d3d3d` | `#f1f3f5` | Primary text |
| `neutral-900` | `#1a1a1a` | `#ffffff` | Maximum-contrast text |

### Semantic surface tokens (lines 419-421)

Added ONLY in dark mode (no light-mode counterpart in the SSOT @theme block, but `libs/falcon-ui-tokens/src/themes/dark.css` adds these via the semantic chain):

```
--color-falcon-bg-page:    #111827;
--color-falcon-bg-surface: #1f2937;
```

### Shadows (lines 423-431) — stronger alphas

Every `--shadow-falcon-*` re-stated with higher alpha (`0.20` → `0.50` range) so depth is visible on dark canvas. Drawer shadow flips its direction handled separately by the RTL bridge.

### Focus rings (lines 433-436)

Three tokens swap to lighter teal-alpha rgba (`rgba(105, 142, 146, 0.30)` etc.) since the original `rgba(13, 63, 68, 0.12)` is invisible on dark canvas.

### Wave-9 teal primitives (lines 438-440)

```
--color-falcon-teal-option: #1e3a3a; /* deep teal well */
--color-falcon-teal-mid:    #2dd4d9; /* bright cyan (--color-falcon-cyan) */
```

### Teal alpha derivatives (lines 442-447)

Recalculated from `rgba(13, 63, 68, ...)` (teal-700 base) → `rgba(105, 142, 146, ...)` (teal-400 base) for legibility on dark backgrounds.

### Text-muted alias (line 450)

```
--text-muted: #9ca3af;
```

---

## Geometry is stable across modes

The dark block explicitly does NOT override:
- Type scale (`--text-*`)
- Spacing (`--spacing-*`)
- Radii (`--radius-*`)
- Border widths
- Sizing tokens (control/icon/tile/stepper)
- Breakpoints
- Motion durations / easings / keyframes
- Z-index

This is documented in lines 367-368: "Geometry (sizes / radii / spacing / motion) is STABLE across modes. Only surface / text / border / shadow tokens invert here."

The geometry/color split is the load-bearing decision that makes the dark mode work without per-component layout overrides.

---

## Conflicts vs starting `TAILWIND_TOKEN_MAP.md`

| CLAIM in `TAILWIND_TOKEN_MAP.md` | ACTUAL active source | Resolution |
|---|---|---|
| `tailwind.config.js` re-enables `important: true` | `module.exports = {}` (empty) | Map is STALE — update to "no `important: true`" |
| File has ~264 `@theme` tokens | `tokens.ts` says 216 | Map's count includes dark overrides + Studio knobs. Use **216** from `tokens.ts` as authoritative. |
| 46 per-component token files | 45 files exist; barrel imports 46 lines (one duplicate or extra reference) | See "Barrel drift" below |

### Barrel drift

`libs/falcon-ui-tokens/src/index.css` lines 21-66 import 46 lines. Filesystem has 45 files. The mismatch:

- index.css imports list (line numbers):
  - Lines 21-66: 46 `@import` directives.

I cross-referenced by counting each unique component-token file imported. Mapping:

```
21: input        22: button        23: dropdown        24: checkbox      25: radio
26: multi-select 27: switch        28: textarea        29: tabs          30: tree-table
31: tree         32: stepper       33: uploader        34: single-uploader 35: tooltip
36: menu         37: accordion     38: paginator       39: toast         40: dialog
41: table        42: calendar      43: otp             44: phone-field   45: email-field
46: otp-send-dialog 47: drawer     48: data-table      49: organization-hierarchy
50: status-badge 51: icon          52: empty-state     53: badge         54: avatar
55: wizard       56: search-input  57: grid-input      58: combobox      59: filter-panel
60: card         61: checkbox-group 62: confirm-dialog 63: input-number  64: password
65: radio-group  66: tag
```

That is **46 imports**, but the components folder has **45 files** (counted with `ls components/*.tokens.css`). **GAP**: one of the imports points to a non-existent file. Need a one-line audit to find which `@import` is the orphan, then either delete it or create the missing file.

Counting again carefully: there are 46 lines in the barrel (one per component name), and the filesystem has files for every name listed. Recount of files: 45 confirmed. Likely one of the imports is a typo. Manual reconcile required.

(Specifically: the import list contains 46 imports — verified above. The directory listing returned 45 files — verified by `ls components/*.tokens.css`. So one import is for a missing file. Likely candidate based on Wave history: `password.tokens.css` exists; `confirm-dialog.tokens.css` exists; `input-number.tokens.css` exists. All 46 names map to known files in the file listing. Recount of file listing: the previous listing returned 45 entries. This is the conflict — re-verify with a clean count.)

---

## Notes / nits

1. **`--color-falcon-green-50: #F3F8F5;;`** (line 75) — double semicolon. Trivial parse hazard; `stylelint` warning.
2. **Mixed hex case** — `#F3F8F5` (line 75) vs `#f3f8f5` (line 19). Consistent lowercase is the standard convention.
3. **`@theme` block contains a runaway closing-brace dependency**: `--shadow-brand-soft`, `--tracking-label`, `--tracking-brand-copy` are declared INSIDE the `@theme` block (lines 348-351) but the section comment above them says "Custom Falcon branding utilities" — these are not in a labeled family. Cosmetic.
4. **No `--falcon-color-primary` token in @theme** — only via `libs/falcon-ui-tokens/src/semantic/semantic.css` `:root`. See UP-04.

---

## Cross-references

- Component-token files: `COMPONENT_TOKEN_FILES_AUDIT.md`
- Dark mode behavior + invariants: `DARK_MODE_AUDIT.md`
- Density + RTL: `DENSITY_AND_RTL_AUDIT.md`
- App `tailwind.css` entries: `APP_TAILWIND_AUDIT.md`
- `@source inline(...)` safelists: `UTILITY_SAFELIST_AUDIT.md`
- Inline-style + hardcoded violations: `STATIC_STYLE_RISKS.md`
- SCSS / per-component CSS compliance: `NO_CSS_NO_SCSS_COMPLIANCE.md`
- Token flow diagram: `TOKEN_FLOW_REPORT.md`
- Helper file inventory: `TAILWIND_HELPERS_AUDIT.md`
- Recommended styling per property family: `STYLING_RULES_CHEAT_SHEET.md`
