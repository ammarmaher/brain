# Falcon Tailwind Mental Model — SoT

> Source of truth for the 3-layer token doctrine. Vault graph node: `_obsidian/36-Theming/Tailwind Mental Model.md`. Anchored on the Tailwind v4 utility-first philosophy + Falcon design-system reality.

**Created:** 2026-05-20
**Vault node:** `_obsidian/36-Theming/Tailwind Mental Model.md`

## The doctrine

Utility-first does NOT mean random classes everywhere. For Falcon it means:

1. **Utilities are generated from Falcon design tokens** (not arbitrary hex values)
2. **Tokens encode design decisions** at three layers (primitive → semantic → component)
3. **Components consume from the semantic layer** — never from raw primitives
4. **Wrappers consume the same component/theme contract** across frameworks

## The 3 layers

### Layer 1 — Primitive tokens

Raw design values. In `@theme { … }` so Tailwind generates utility classes.

Examples:
- `--color-falcon-teal-700`
- `--color-falcon-neutral-30`
- `--spacing` (base unit)
- `--radius-falcon-md`

**Rule:** primitives are raw. Components do NOT consume them directly.

### Layer 2 — Semantic tokens

Map primitives to design ROLES. In `@theme { … }` to generate utilities.

Examples:
- `--color-falcon-surface-primary`
- `--color-falcon-text-muted`
- `--color-falcon-border-subtle`
- `--shadow-falcon-card`

**Rule:** semantic tokens are the **preferred consumption layer for components**.

### Layer 3 — Component tokens

Per-component CSS-var slots. In `:where(<host>)` scope (NOT @theme).

Examples:
- `--falcon-button-bg-default`
- `--falcon-button-bg-hover`
- `--falcon-table-row-bg-selected`
- `--falcon-input-border-focus`

**Rule:** component tokens chain through Layer 2 — never Layer 1.

## Why

| Refactor scenario | Layer 1 leak cost | Layer 2 consumption cost |
|---|---|---|
| Rebrand teal → blue | Touch every component | Change one Layer 2 token |
| Tenant whitelabel | Touch every component | One `[data-tenant=X]` rule |
| Dark polarity fix | Touch every component | Cascade re-declares Layer 2 |
| New surface variant | Add utility everywhere | Add semantic token |

## Current Falcon reality

- ✅ Layer 1 in `@theme` — utilities generated
- ❌ Layer 2 in `:root` (`semantic.css`) — no utilities; templates fall back to `bg-[var(--falcon-X)]` arbitrary
- ❌ Layer 3 contracts reference Layer 1 primitives directly (not chained through Layer 2)

**Wave 1 fix:** promote Layer 2 to `@theme` + rewire Layer 3.

## See also

- `falcon-tailwind-theme.md` — the 5 governance rules
- `falcon-component-theme-contract.md` — 9-section component contract
- `falcon-design-tokens-graph.md` — dual-system architecture
- `falcon-tailwind-alignment-scorecard.md` — gap + fix plan
