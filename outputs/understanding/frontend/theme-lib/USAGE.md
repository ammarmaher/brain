# falcon-theme — USAGE

> Batch **L07**. How `@falcon/theme` is consumed in the live codebase, the recommended usage, the Do/Don't table, and the grep-verified Consumer Sweep (2026-06-03).

## 1. How apps consume the SSOT (the canonical path)

Each app's `tailwind.css` entry `@import`s the SSOT by **filesystem-relative path** (Tailwind v4 does not resolve TS aliases inside `.css`), then declares `@source` scan paths and `@source not` exclusions. `[CODE]`

`apps/admin-console/src/tailwind.css:1-31` (host-shell + management-console are near-identical):
```css
/*** Admin Console — Tailwind v4 entry. SSOT lives in libs/falcon-theme/src/falcon-tailwind-tokens.css (alias @falcon/theme). ***/
@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";   /* the @theme SSOT (L07) */
@import "../../../libs/falcon-ui-tokens/src/index.css";                /* component tokens (L06) — imported AFTER */

@source "./";
@source "../../../libs/falcon/src/shared-ui";
@source "../../../libs/falcon-ui-core/src/tailwind";        /* tailwind-classes.ts helpers */
@source "../../../libs/falcon-ui-core/src/angular-wrapper"; /* Angular wrappers */
@source "../../../libs/falcon-ui-core/src/components";      /* Stencil -tw templates */

@source not "../../../node_modules";  @source not "../../../dist";
@source not "../../../.angular";      @source not "../../../.nx";
@source not "../../../demos";
@source not "../../../**/*.spec.ts";  @source not "../../../**/*.e2e.ts";
@source not "../../../**/*.md";        /* Studio audit MD leaks orphan utilities */
```

**Load order matters:** the theme SSOT is imported FIRST, then `falcon-ui-tokens` — so component tokens can reference theme primitives (`var(--color-falcon-teal-500)`) and the `@layer` order locked at `falcon-tailwind-tokens.css:18` governs everything downstream. `[CODE]`

The icon CSS is reached via the barrel (`index.css`) OR imported directly where needed; the `@theme` `@import` does not pull in `falcon-icons.css` (only `index.css` does). `[CODE] index.css:7-8`.

## 2. Consuming tokens (recommended)

### In Tailwind templates (the normal case)
Use the generated utilities — `bg-falcon-teal-500`, `text-falcon-neutral-900`, `p-5`, `rounded-pane`, `shadow-falcon-md`, `z-falcon-modal`, `leading-falcon-snug`, `tracking-section-label`, `gap-falcon-node-gap`, `bg-falcon-chart-grid`, `dark:bg-falcon-neutral-50`. Every `@theme` token name maps to a Tailwind utility prefix.

### In component CSS / Stencil (`var()` reference)
```css
.thing { border-radius: var(--radius-pane); box-shadow: var(--shadow-falcon-md); }
```
Component-token files (L06) are built this way on top of the theme primitives.

### Dark mode
Toggle `<html class="app-dark">` (or `.dark`). Every `dark:` utility fires AND the override block re-declares surface/text/border/shadow token VALUES — so a component that reads `--color-falcon-neutral-900` flips automatically without any per-component dark rule. `[CODE] falcon-tailwind-tokens.css:553-640`.

### Per-instance token override
Because tokens are CSS custom properties, a consumer can scope-override one on a host element (the documented pattern for component visual tweaks — see `falcon-input` DECISION.md). Do NOT hardcode hex/px.

## 3. Consuming the icon font

```html
<i class="falcon-icon falcon-icon-wallet"></i>            <!-- raw class contract -->
<i class="falcon-icon falcon-icon-spinner falcon-icon-spin"></i>  <!-- animated -->
<i class="falcon-icon falcon-icon-cog falcon-icon-fw"></i>        <!-- fixed-width -->
```
**Preferred:** route through `<falcon-angular-icon name="wallet">` (B11) for size + a11y standardization. The raw `<i class="falcon-icon …">` pattern is the genuine adoption gap (B11 G1) — most consumers still write the bare `<i>`. `[CODE] falcon-icons.css:4`, `[MEMORY]` raw-`<i>`→wrapper not lint-gated.

## 4. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Add a NEW global primitive (radius/shadow/color) here when ≥2 components need it. | Add a single-component value here — use that component's `*.tokens.css` (L06). `[CODE] README.md:45-47` |
| `@import` the SSOT by relative path in `tailwind.css`. | `import` tokens into an Angular component (tokens flow via CSS at build time). `[CODE] README.md:40-42` |
| Reference tokens via Tailwind utilities OR `var(--…)`. | Hardcode hex/px/rgb in templates or CSS (house rule). `[MEMORY] reference_fe_structure_standard_angular21` |
| Let dark mode flip values via the override block. | Write per-component dark overrides for color/surface tokens already remapped. |
| Edit `falcon-tailwind-tokens.css` then regenerate `tokens.ts` via the nx target. | Hand-edit `tokens.ts` (AUTO-GENERATED — header forbids it). `[CODE] tokens.ts:1` |
| Use `<falcon-angular-icon>` for new icon usage. | Reintroduce `pi pi-*` / PrimeIcons / `tailwindcss-primeui` / `@plugin` (PrimeNG uninstalled 2026-05-10). `[CODE] README.md:52-53` |
| Keep geometry (size/radius/spacing/motion) mode-stable. | Add geometry overrides to the dark block (breaks the geometry/color split). `[CODE] :536-537` |

## 5. Consumer Sweep (grep-verified 2026-06-03)

**Direct `@import` of the SSOT (`falcon-tailwind-tokens.css`):** 3 files — the Tailwind entry of every app.
- `[CODE] apps/admin-console/src/tailwind.css:4`
- `[CODE] apps/management-console/src/tailwind.css:4`
- `[CODE] apps/host-shell/src/tailwind.css:4`

(`admin-console/src/tailwind.css:2159` also *references* the SSOT in a comment, not an import.)

**Effective consumers (transitive):** **everything**. Because the 3 app Tailwind entries import the SSOT, every component, every template, every Stencil `-tw` helper, and every L06 component-token file in all three apps resolves its color/spacing/radius/shadow/etc. from this file. There is no FE artifact that does NOT transitively depend on it.

**Icon-font consumers:** the `.falcon-icon-*` classes + `<falcon-angular-icon>` are consumed across app features (heaviest set documented in `falcon-icon` B11: `apps/*` topbar/drawer/settings + `libs/falcon/.../comm-mkt-view`). The font *binary* is served at `/assets/fonts/falcon-icons/falcon-icons.woff2`.

**`@falcon/theme/tokens` (TS) consumers:** rare/none in app code by design (`[CODE] README.md:40-42`). Used by build-config / the Falcon Studio token registry (`[CODE] README.md:49-51`).

**Count:** 3 direct CSS importers · 0 intended TS importers · transitive = whole FE platform (3 apps + every lib that renders).

## 6. Why this lib has no "recommended new usage" of its own

`@falcon/theme` is not *called* — it is *imported once per app and inherited everywhere*. The "new usage" guidance is therefore the house-rule discipline above: **reference tokens, never literals; add primitives here, component knobs in L06; regenerate `tokens.ts` after editing the CSS.**

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L07). All 3 app `tailwind.css` entries read (head) and the SSOT `@import` grep-verified across `apps/`; barrel `@import` chain confirmed (`index.css`); load-order (theme-before-ui-tokens) verified in each entry; icon class contract read from `falcon-icons.css`; consumer counts are grep-measured. No source edited.
