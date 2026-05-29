---
type: reference
library: "[[Tailwind CSS]]"
topic: falcon-theme-governance
priority: critical
scope: current-angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Tailwind Theme — THE styling source of truth ***
*** Current scope: Angular consumption + Stencil component layer ***
*** Architecture framework-neutral; React/Vue are future placeholders only ***

# Falcon Tailwind Theme

> 🟢 **CURRENT SCOPE: Falcon Tailwind Theme drives Angular apps + Stencil components.**
> 🟡 **FUTURE EXTENSION: Same theme will drive React/Vue wrappers** when they ship.
>
> One theme. One token system. The Falcon Tailwind Theme — declared in `libs/falcon-theme/src/falcon-tailwind-tokens.css` — is the single source of truth for every visual decision. **Today, all active consumers are Angular templates + Stencil components.** The architecture is framework-neutral by design so future React/Vue wrappers can join without theme changes — but **no current audit, implementation, or enforcement work targets React/Vue.**

## The single source of truth

**File:** `libs/falcon-theme/src/falcon-tailwind-tokens.css`
**Tier:** Top of the styling hierarchy. Everything chains back here.
**Layer:** Tailwind v4 `@theme { … }` block.
**Selector:** `<html class="app-dark">` for dark cascade; `[data-theme="dark"]` mirrored.

Every utility class Tailwind generates (`bg-falcon-teal-700`, `text-falcon-neutral-900`, …) is born from a CSS custom property declared in this `@theme` block. Move a token out of `@theme` → utility disappears.

## Governance rules (mandatory)

### Rule 1 — `@theme` vs `:root`

| Use `@theme` when… | Use `:root` when… |
|---|---|
| Token should generate a Tailwind utility class | Token is internal CSS plumbing |
| Token is named by role (color, font, spacing, radius, shadow, breakpoint, animate, ease) | Token is component-internal state |
| Consumers need `bg-X`, `text-X`, `border-X` utilities | Consumers reference via `var(--X)` only |

### Rule 2 — Forbidden in component templates

- ❌ Inline styles (`style="background: red"`)
- ❌ Hardcoded colors (`color: #ff0000`)
- ❌ Hardcoded spacing (`padding: 8px`)
- ❌ Hardcoded radius (`border-radius: 6px`)
- ❌ Hardcoded shadows (`box-shadow: 0 2px 4px black`)
- ❌ Arbitrary values (`bg-[#bada55]`, `top-[17px]`) **unless explicitly justified**

### Rule 3 — Token gaps are documented, not bypassed

If a needed token does not exist:
1. **Stop.** Do not hardcode.
2. **Document the gap** — add a row to the per-component `GAPS_AND_UPGRADES.md` in `Brain Outputs/understanding/frontend/components/<name>/`.
3. **Propose the token** — name, value, family (`@theme` namespace).
4. **Await approval** — extending the theme is a design-system decision, not a per-feature decision.
5. **Then add it** to `falcon-tailwind-tokens.css` `@theme` block.

### Rule 4 — Interactive states must use tokens

Every interactive component (button, input, row, link, chip) must define ALL of these states **through tokens/utilities**:

| State | Token / utility |
|---|---|
| Hover | `hover:bg-X` + `hover:text-X` + `hover:border-X` |
| Focus-visible | `focus-visible:[box-shadow:var(--shadow-falcon-focus)]` + `focus-visible:outline-none` |
| Active (pressed) | `active:bg-X` + `active:scale-X` (optional) |
| Disabled | `disabled:opacity-50` + `disabled:cursor-not-allowed` + `disabled:bg-X` |
| Loading | `aria-busy:opacity-X` + spinner overlay |
| Error | `aria-invalid:border-falcon-red-500` + helper text |
| Selected | `aria-selected:bg-X` or `[class.selected]="…"` + class |
| Expanded | `aria-expanded:rotate-X` (chevron) + `aria-expanded:bg-X` |
| Dark mode | Cascade handles via `:where(.app-dark)` re-declaration |

**No interactive component ships without all 9 states defined.** Documentation, not implementation, but the contract is mandatory.

### Rule 5 — Cross-framework reusability (architecture-neutral by design)

Theme values are framework-neutral. Current consumers + future-reserved paths:

| Framework | Status | Consumption path |
|---|---|---|
| **Angular** | ✅ ACTIVE — CURRENT PRIORITY | Tailwind utility classes in templates + `[style.--falcon-X]` for token overrides |
| **Stencil / Web Component** | ✅ ACTIVE | Tailwind utility classes in TSX templates (when `shadow: false`) + `var(--falcon-X)` in scoped CSS |
| React | 🟡 FUTURE PLACEHOLDER | (When wrappers ship: JSX `className` + CSS var override — see [[Falcon React Wrapper Future Pattern]]) |
| Vue | 🟡 FUTURE PLACEHOLDER | (When wrappers ship: Vue templates + CSS var override — see [[Falcon Vue Wrapper Future Pattern]]) |

**No framework-specific theme.** The compiled CSS bundle is shared. Today only Angular + Stencil paths are actively exercised.

## What's in @theme today

Per [[Falcon Design Tokens]]:

| Family | Stops | Notes |
|---|---|---|
| Brand teal | 18 (10 + 8 named/alpha) | Customer-invariant in dark |
| Neutral | 27 | Over-granulated — see [[Falcon Color Palette Audit]] |
| Status (green/red/amber/blue/success) | 1-5 per family | Sparse — OK |
| Accents (popover, orgchart, cyan, lilac, mint) | 1-4 each | One-off semantic |
| Customer brands (aramco/bmw/rajhi/snb/bupa) | 1-4 each | Invariant across themes |
| Typography | 4 fonts + 16+ sizes | |
| Sizing | control / icon / pill / tile / stepper | |
| Animations | duration-falcon-fast/base | |
| Shadows | shadow-falcon-focus/menu/popover/etc. | |

**~250 Tailwind utility classes generated.**

## What's NOT in @theme (the gap)

Per [[Tailwind Falcon Alignment Scorecard]]:

1. **Semantic Tier-2 tokens** — `--falcon-color-primary`, `--falcon-color-surface`, `--falcon-color-text` live in `libs/falcon-ui-tokens/src/semantic/semantic.css` under `:root`. **No utilities generated.**
2. **Per-component contract slots** — `--falcon-org-hierarchy-panel-bg`, etc., live in `libs/falcon-ui-tokens/src/components/*.tokens.css` under `:where(<host>)`. **No utilities generated.**

**Consequence:** templates must use `bg-[var(--falcon-X)]` arbitrary-value syntax instead of named utilities. Wave 1 fix promotes semantic tokens to `@theme`.

## The bridge to Stencil layer

`libs/falcon-ui-tokens/src/primitives/colors.css` bridges the Stencil layer to the Tailwind layer:

```css
--falcon-color-teal-50: var(--color-falcon-teal-50, #f3f8f5);
```

This way the Stencil-layer tokens (`--falcon-color-*`) inherit values from the Tailwind layer (`--color-falcon-*`) when both are loaded. **Same values, two names — bridged so Stencil components work standalone and in-workspace.**

See [[Falcon Design Tokens]] for the full two-system architecture.

## How to override per tenant / mood / page

**Per-tenant whitelabel:**
```css
[data-tenant="bmw"] {
  --color-falcon-surface-brand-strong: var(--color-falcon-brand-bmw);
}
```

**Per-mood (high-contrast / dim):**
```css
.app-high-contrast {
  --color-falcon-focus-ring: 0 0 0 4px #ffeb3b;
}
```

**Per-page (rare, scoped):**
```css
.org-hierarchy-page {
  --color-falcon-surface-brand-strong: var(--color-falcon-teal-600);
}
```

These customization seams require Wave 1 of the [[Tailwind Falcon Alignment Scorecard]] (semantic Tier-2 promoted to `@theme`) to be live.

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Falcon Design Tokens]] · [[Falcon Component Theme Contract]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-tailwind-theme](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-theme.md) · [THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md)

## Tags

#type/reference #layer/frontend #layer/design #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
