# Falcon Design Tokens — Two-System Graph

> SoT for the dual-token-system architecture surfaced in the Brain SK Obsidian vault at `_obsidian/36-Theming/Falcon Design Tokens.md`. Tailwind layer + Stencil/UI-tokens layer + bridge.

**Created:** 2026-05-20
**Vault graph node:** `_obsidian/36-Theming/Falcon Design Tokens.md`

## The two systems

| Aspect | System 1 — Tailwind layer | System 2 — Stencil/UI-tokens layer |
|---|---|---|
| Folder | `libs/falcon-theme/src/` | `libs/falcon-ui-tokens/src/` |
| Entry file | `falcon-tailwind-tokens.css` | `index.css` |
| Naming convention | `--color-falcon-{role}-{stop}` | `--falcon-color-{role}-{stop}` + `--falcon-{component}-{slot}` |
| What it generates | Tailwind utility classes (~250) | CSS-var contracts consumed by Stencil scoped CSS |
| Dark selector | `<html class="app-dark">` | `<html data-theme="dark">` + `<html class="app-dark">` |
| Driven by | `@theme { … }` block | `:root` + `:where(<host>)` selectors |

## The bridge

`libs/falcon-ui-tokens/src/primitives/colors.css` declares each Stencil-side primitive as:

```css
--falcon-color-teal-50: var(--color-falcon-teal-50, #f3f8f5);
```

If the workspace SSOT is loaded, the Tailwind value wins. If not (lib used standalone elsewhere), the hex fallback applies. Both systems compute identical values within Falcon.

## Tailwind @theme contents

`libs/falcon-theme/src/falcon-tailwind-tokens.css:15-200`:

| Family | Stop count | Notes |
|---|---|---|
| Brand teal | 18 (10 standard + 8 named/alpha) | Customer-invariant in dark |
| Neutral | 27 | **Over-granulated — 11 off-grid stops** |
| Status (green/red/amber/blue/success) | 1-5 per family | Sparse, OK |
| Accents (popover, orgchart-line, cyan, lilac, mint) | 1-4 each | One-off |
| Customer brands (aramco/bmw/rajhi/snb/bupa) | 1-4 each | Invariant across themes |
| Typography | 4 fonts + 16 sizes | |
| Sizing | control/icon/pill/tile/stepper | |

## Stencil/UI-tokens layer structure

`libs/falcon-ui-tokens/src/`:

```
primitives/           ← bridges to Tailwind primitives (colors.css, motion, radius, shadow, spacing, typography)
semantic/             ← Tier-2 intent tokens (primary, danger, success, surface, text, border)
themes/               ← light.css + dark.css (re-declare semantic vars under data-theme=dark)
density/              ← comfortable.css + compact.css
rtl/                  ← rtl.css
components/           ← 51 per-component contracts
```

## Layer order (per index.css)

```css
@import './primitives/colors.css';
@import './primitives/spacing.css';
@import './primitives/radius.css';
@import './primitives/shadow.css';
@import './primitives/typography.css';
@import './primitives/motion.css';
@import './semantic/semantic.css';
@import './themes/light.css';
@import './themes/dark.css';
@import './density/comfortable.css';
@import './density/compact.css';
@import './rtl/rtl.css';
@import './components/input.tokens.css';
/* … 50 more component files … */
```

## Tailwind side layer order

`falcon-tailwind-tokens.css:11`:

```css
@layer theme, base, falcon-base, utilities;
```

Custom `falcon-base` layer sits between `base` and `utilities` for workspace-specific resets.

## Dark cascade

`falcon-tailwind-tokens.css:505-592` re-declares the neutral ramp under:

```css
:where(.app-dark, .app-dark *),
:where(.dark, .dark *) {
  --color-falcon-neutral-0:   #1a1a2e;
  --color-falcon-neutral-30:  #1e2741;
  --color-falcon-neutral-900: #ffffff;
  /* … 25 more remapped … */
}
```

Tailwind utility values flip automatically. Stencil layer mirrors via `themes/dark.css`.

## ThemeService selector setting

`apps/host-shell/falcon-facades/theme.facade.ts` sets BOTH selectors together:

```typescript
documentElement.classList.toggle('app-dark', resolvedTheme === 'dark');
documentElement.setAttribute('data-theme', resolvedTheme);
```

Both systems receive the toggle in sync.

## Gap

Semantic Tier-2 tokens live in System 2 (`semantic.css`) under `:root` — they don't generate Tailwind utilities. See `falcon-tailwind-alignment-scorecard.md` Wave 1 fix.

## See also

- `THEME_SSOT_AUDIT.md` — Tailwind side details
- `falcon-tailwind-alignment-scorecard.md` — gap analysis
- `falcon-color-palette-audit.md` — palette drift
- `falcon-angular-wrapper-pattern.md` — consumer pattern
