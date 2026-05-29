---
type: reference
library: "[[Tailwind CSS]]"
topic: falcon-design-tokens
created: 2026-05-20
---
*** Falcon Design Tokens — how the @theme block is structured ***
*** Two parallel systems: Tailwind layer + Stencil/UI-tokens layer (bridged via var() ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-design-tokens-graph.md ***

# Falcon Design Tokens

> Falcon ships TWO parallel token systems sharing primitive values via a bridge. Tailwind layer drives utility classes; Stencil layer drives per-component CSS-var contracts. The bridge keeps them in sync.

## The two systems

```
┌───────────────────────────────────────────┐   ┌──────────────────────────────────────────┐
│  SYSTEM 1: Tailwind layer                  │   │  SYSTEM 2: Stencil/UI-tokens layer        │
│  libs/falcon-theme/src/                    │   │  libs/falcon-ui-tokens/src/               │
│  └── falcon-tailwind-tokens.css            │   │  ├── primitives/                          │
│      @theme {                              │   │  ├── semantic/                            │
│        --color-falcon-teal-700: #0d3f44    │   │  ├── themes/light.css + dark.css          │
│        --color-falcon-neutral-30: #fafafa  │   │  ├── density/comfortable + compact        │
│      }                                     │   │  ├── rtl/                                 │
│                                            │   │  └── components/ (51 contracts)           │
│  Generates Tailwind utilities:             │   │                                            │
│    bg-falcon-teal-700, etc.                │   │  Generates CSS-var contracts:             │
│                                            │   │    var(--falcon-color-primary)            │
│  Selector: <html class="app-dark">         │   │  Selector: <html data-theme="dark">       │
│                                            │   │                                            │
│  Naming: --color-falcon-{role}-{stop}      │   │  Naming: --falcon-color-{role}-{stop}     │
│                                            │   │          --falcon-{component}-{slot}      │
└───────────────────────────────────────────┘   └──────────────────────────────────────────┘
                       │                                            │
                       └────────────── BRIDGE ──────────────────────┘
            primitives/colors.css: var(--color-falcon-teal-50, fallback)
            Stencil layer references Tailwind primitives with hex fallback.
            Both systems compute identical values.
```

## SSOT @theme — what's there

[CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:15-200`:

| Family | Stops | Notes |
|---|---|---|
| Brand teal | 10 + 8 extras (`tint`, `option`, `mid`, 5 alphas) | Customer-invariant in dark mode |
| Neutral | 27 stops | **Over-granulated — see [[Falcon Color Palette Audit]]** |
| Status (green/red/amber/blue) | Sparse 1-5 per family | OK |
| Success | 10/20/50 | Soft tints for shadow rows |
| Accents | popover, orgchart-line, cyan, lilac, mint | One-offs |
| Customer brands | aramco/bmw/rajhi/snb/bupa | Invariant across themes |
| Typography | 4 font families + 16+ sizes | |
| Sizing | control / icon / pill / tile / stepper | |

**Total Tailwind utilities generated: ~250.**

## What's NOT in @theme (the gap)

- Semantic Tier-2 tokens (`semantic/semantic.css`) — `:root` scope, no utility classes
- 51 per-component contracts (`components/*.tokens.css`) — `:where(<host>)` scope, no utility classes

This forces templates into `bg-[var(--falcon-X)]` arbitrary-value syntax. See [[Tailwind Falcon Alignment Scorecard]] Wave 1 fix.

## Token layer ordering

[CODE] `falcon-tailwind-tokens.css:11`:

```css
@layer theme, base, falcon-base, utilities;
```

Order: theme < base < falcon-base < utilities. Later wins.

[CODE] `libs/falcon-ui-tokens/src/index.css`:

```css
@import './primitives/colors.css';
@import './semantic/semantic.css';
@import './themes/light.css';
@import './themes/dark.css';
@import './density/comfortable.css';
@import './rtl/rtl.css';
@import './components/*.tokens.css';   /* 51 files */
```

## Dark cascade

[CODE] `falcon-tailwind-tokens.css:505-592` re-declares the neutral ramp + selected aliases under:

```css
:where(.app-dark, .app-dark *),
:where(.dark, .dark *) { … }
```

Tailwind utility values flip automatically because `--color-falcon-neutral-*` is re-declared in this cascade. Component contracts that point at neutral primitives also flip transitively.

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Dark Mode]] · [[Falcon Color Palette Audit]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-design-tokens-graph](../../Brain%20Outputs/understanding/frontend/theme/falcon-design-tokens-graph.md) · [THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md) · [TOKEN_FLOW_REPORT](../../Brain%20Outputs/understanding/frontend/theme/TOKEN_FLOW_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
