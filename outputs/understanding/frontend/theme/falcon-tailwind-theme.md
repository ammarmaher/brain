# Falcon Tailwind Theme — SoT

> Source of truth for THE Falcon Tailwind Theme governance — the styling rules every component, every wrapper, every consumer must follow. Vault graph node: `_obsidian/36-Theming/Falcon Tailwind Theme.md`.

**Created:** 2026-05-20
**Vault node:** `_obsidian/36-Theming/Falcon Tailwind Theme.md`
**Canonical theme file:** `libs/falcon-theme/src/falcon-tailwind-tokens.css`

## The single source of truth

The `@theme { … }` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` is the styling SSOT for the entire Falcon platform. Every utility class Tailwind v4 generates is born from a token in this block. Every framework (Angular, React, Vue, Stencil) consumes the same compiled CSS.

## Governance rules

### Rule 1 — `@theme` vs `:root` discipline

| Use `@theme` | Use `:root` |
|---|---|
| Token must generate a Tailwind utility class | Token is internal CSS plumbing |
| Token named by role (color, font, spacing, radius, shadow, breakpoint) | Token is component-internal state |
| Consumers need `bg-X`, `text-X`, `border-X` utilities | Consumers reference via `var(--X)` only |

### Rule 2 — Forbidden in component templates

- ❌ Inline styles
- ❌ Hardcoded colors / spacing / radius / shadows
- ❌ Arbitrary values unless explicitly justified
- ❌ Per-component CSS files that bypass tokens

### Rule 3 — Token gaps documented, not bypassed

If a needed token does not exist:
1. Stop. Do not hardcode.
2. Document the gap in `understanding/frontend/components/<name>/GAPS_AND_UPGRADES.md`.
3. Propose the token (name, value, family).
4. Await approval — extending the theme is a design-system decision.
5. Add to `falcon-tailwind-tokens.css` `@theme` block.

### Rule 4 — Interactive states use tokens

Every interactive component must define hover, focus-visible, active, disabled, loading, error, selected, expanded, and dark-mode states through tokens or utilities.

### Rule 5 — Cross-framework reusability

Theme values must work in Angular, React, Vue, Stencil, vanilla Web Components without any framework-specific theme code.

## Current state (per `THEME_SSOT_AUDIT.md`)

| Family | Stops | Status |
|---|---|---|
| Brand teal | 18 | Customer-invariant in dark |
| Neutral | 27 | Over-granulated — see `falcon-color-palette-audit.md` |
| Status (green/red/amber/blue/success) | 1-5 per family | Sparse but OK |
| Accents | 1-4 each | One-off semantic |
| Customer brands (aramco/bmw/rajhi/snb/bupa) | 1-4 each | Invariant |
| Typography | 4 fonts + 16+ sizes | |
| Sizing | control/icon/pill/tile/stepper | |
| Animations | duration-falcon-fast/base | |
| Shadows | shadow-falcon-focus/menu/popover | |

**~250 Tailwind utility classes generated.**

## The gap

Semantic Tier-2 tokens and per-component contract slots live in `:root` scope (not `@theme`), so they don't generate utilities. Templates fall back to `bg-[var(--falcon-X)]` arbitrary-value syntax. **Wave 1 of `falcon-tailwind-alignment-scorecard.md` fixes this.**

## Customization seams

| Seam | Status | Pattern |
|---|---|---|
| Light/dark toggle | ✅ Live | `<html class="app-dark">` cascade |
| Tenant whitelabel | ⚠️ Possible, not wired | `[data-tenant=X]` block in Brain Outputs |
| Accessibility moods | ❌ Not wired | `[data-mood=high-contrast]` block (future) |
| Per-page overrides | ⚠️ Inconsistent | `.org-hierarchy-page { --token: … }` (rare) |

## See also

- `THEME_SSOT_AUDIT.md` — primitive structure detail
- `falcon-tailwind-alignment-scorecard.md` — gap analysis + fix plan
- `falcon-component-theme-contract.md` — per-component contract (consumer of this theme)
- `falcon-multi-framework-wrapper-strategy.md` — how wrappers consume the theme
- `falcon-design-tokens-graph.md` — two-system bridge mechanics
- `falcon-color-palette-audit.md` — palette over-granulation

## Vault graph node

`_obsidian/36-Theming/Falcon Tailwind Theme.md`
