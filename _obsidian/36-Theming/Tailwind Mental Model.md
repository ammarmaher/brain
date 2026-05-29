---
type: reference
library: "[[Tailwind CSS]]"
topic: mental-model
priority: critical
scope: current-angular-first
created: 2026-05-20
---
*** Tailwind Mental Model — 3-layer token doctrine for Falcon ***
*** Utility-first does not mean random classes — it means tokens drive utilities ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-tailwind-mental-model.md ***

# Tailwind Mental Model

> Utility-first does not mean "random classes everywhere." For Falcon, it means **utilities are generated from design tokens**, tokens encode design decisions, and components consume tokens via utilities. This note defines the 3-layer token model every Angular wrapper, every Stencil component, and every app template must respect.

## The 3-layer token model

### Layer 1 — Primitive tokens (raw scales)

Pure design values. No semantic meaning by themselves. Live in `@theme { … }` so Tailwind generates utility classes.

| Examples | What they encode |
|---|---|
| `--color-falcon-teal-700` | A specific color stop on the brand teal scale |
| `--color-falcon-neutral-30` | A specific neutral lightness |
| `--spacing` | The single spacing base unit |
| `--radius-falcon-md` | A specific radius size |
| `--shadow-falcon-md` | A specific shadow recipe |

**Rule:** primitives are raw values. Components should NOT consume them directly unless the component is itself primitive-level (e.g., a low-level icon container).

### Layer 2 — Semantic tokens (intent-named)

Map primitives to design ROLES. Also in `@theme { … }` so they generate utilities.

| Examples | What they encode |
|---|---|
| `--color-falcon-surface-primary` | The dominant surface color (resolves to teal-700 in light, neutral-30 in dark) |
| `--color-falcon-text-muted` | Body text muted variant |
| `--color-falcon-border-subtle` | Subtle divider |
| `--shadow-falcon-card` | Card-level elevation |
| `--shadow-falcon-popover` | Popover-level elevation |

**Rule:** semantic tokens are the **preferred consumption layer for components**. They survive palette refactors and theme switches transparently.

### Layer 3 — Component tokens (per-component contract)

Per-component CSS-var slots. Live in `libs/falcon-ui-tokens/components/*.tokens.css` under `:where(<host>)` scope (NOT in @theme — these don't need utilities).

| Examples | What they encode |
|---|---|
| `--falcon-button-bg-default` | Button idle background |
| `--falcon-button-bg-hover` | Button hover background |
| `--falcon-table-row-bg-selected` | Table row selected state |
| `--falcon-input-border-focus` | Input border on focus |

**Rule:** component tokens chain through semantic tokens (Layer 2), not primitives (Layer 1). So `--falcon-button-bg-default: var(--color-falcon-surface-primary)`, never `var(--color-falcon-teal-700)`.

## Falcon doctrine — the consumption ladder

```
Component template      → Tailwind utility (bg-falcon-surface-primary, etc.)
        ↓
@theme semantic token   → resolves to primitive
        ↓
@theme primitive token  → raw value (#0d3f44, etc.)
        ↓
Dark cascade overrides  → :where(.app-dark) re-declares Layer 1 + Layer 2
```

**Components consume from Layer 2 (semantic).** They never reach into Layer 1 (primitives) directly — that breaks future theme refactors.

## Why this matters

| Scenario | If component uses Layer 1 directly | If component uses Layer 2 |
|---|---|---|
| Rebrand teal → blue | Touch every component | Change one token; done |
| Add tenant whitelabel | Touch every component | One `[data-tenant=X]` rule overrides Layer 2 |
| Dark mode polarity fix | Touch every component | Cascade re-declares Layer 2 once |
| New surface variant | Add new utility everywhere | Add semantic token; reuse |

## Current Falcon reality

[[Tailwind Falcon Alignment Scorecard]] documents this gap:

- ✅ Layer 1 primitives exist in `@theme` — utilities generated correctly
- ❌ Layer 2 semantic tokens live in `:root` (in `semantic.css`) — no utilities generated; templates fall back to `bg-[var(--falcon-color-surface)]` arbitrary syntax
- ❌ 51 component contracts (Layer 3) reference Layer 1 primitives directly — not chained through Layer 2

**Wave 1 fix:** promote Layer 2 to `@theme` so utilities exist + rewire Layer 3 to chain through Layer 2.

## Applying this in Angular templates

```html
<!-- ❌ Layer 1 leak — bypasses semantic layer -->
<button class="bg-falcon-teal-700 hover:bg-falcon-teal-800">…</button>

<!-- ✅ Layer 2 consumption — survives palette refactors -->
<button class="bg-falcon-surface-primary hover:bg-falcon-surface-primary-hover">…</button>

<!-- ✅ Layer 3 (component-internal) — when consuming via component token -->
<falcon-angular-button variant="primary">…</falcon-angular-button>
<!-- Inside button TSX: bg-[var(--falcon-button-bg-default)] -->
```

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Falcon Tailwind Theme]] · [[Falcon Design Tokens]] · [[Falcon Component Theme Contract]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-tailwind-mental-model](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-mental-model.md) · [THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md)

## Tags

#type/reference #layer/frontend #layer/design #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
