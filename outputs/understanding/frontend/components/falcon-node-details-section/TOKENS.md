# falcon-node-details-section — TOKENS

> **No dedicated component token file.** `[CODE]` There is no `libs/falcon-ui-tokens/src/components/node-details-section.tokens.css` (Glob 2026-06-03). This single-render shared-ui component styles itself with **platform Falcon-Tailwind utility classes** baked into its template — it does not declare or consume a `--falcon-node-details-section-*` token contract. The dual-render TOKENS layer (component-scoped `:where(...)` token file, gate-12) is therefore **N/A** here.

## Component token file

**NONE.** Unlike the dual-render Stencil components (which each ship a `*.tokens.css` under `:where(...)`), and unlike its sibling `<falcon-resizable-split-pane>` (which DOES have `resizable-split-pane.tokens.css`), this component has **no token file**. All visual values are Falcon-Tailwind utility classes in `falcon-node-details-section.component.html`.

## Token categories (declared)

**None declared by this component.** It indirectly resolves a handful of platform Falcon palette/spacing tokens **through** the Tailwind utility classes it uses (Tailwind maps e.g. `text-falcon-neutral-925` → `var(--color-falcon-neutral-925)`). The utilities used:

`[CODE]` from falcon-node-details-section.component.html:

| Utility (template) | Resolves to platform token (via Tailwind) | Where |
|---|---|---|
| `bg-falcon-neutral-0` | `--color-falcon-neutral-0` | strip background (html:11), `<img>` circle bg (html:23) |
| `text-falcon-neutral-925` | `--color-falcon-neutral-925` | label text (html:32) |
| `bg-falcon-teal-700` | `--color-falcon-teal-700` | initials-chip circle (html:27) |
| `border-falcon-neutral-150` | `--color-falcon-neutral-150` | `<img>` circle border (html:23) + (stale comment) divider |
| `text-white` | white | initials text (html:27) |
| `text-sm` / `text-xs` | `--font-size-*` scale | label / initials sizing (html:27/32) |
| `font-semibold` / `font-bold` | `--font-weight-*` | label / initials weight |
| `px-5 pt-5 pb-5 gap-4 gap-3 gap-2` | `--spacing-*` scale | header padding + gaps (html:11/12/34) |
| `w-7 h-7 / w-9 h-9 / rounded-full` | `--spacing-*` / `--radius-full` | avatar circle dims (html:23/27) |

These are token-backed (no raw hex/px/rgb) — the component is **house-rule clean on the "tokens-over-literals" axis** (no arbitrary `[...]` values, no inline `style=`, except the `[attr.aria-label]`/`[title]`/`[alt]` bindings which are not styles).

## Related Falcon theme tokens

`[BRAIN-OUT]` All colours/spacing flow from `libs/falcon-theme/src/falcon-tailwind-tokens.css` via the Tailwind utility → CSS-var mapping listed above. No component-specific theme tokens.

## Tailwind utility guidance for this component

`[CODE]` The component is itself styled entirely by Falcon-Tailwind utilities. Consumers should NOT hand-roll overrides of its internal colours; if a different surface/divider is needed, add layout utilities on the **host** `class=` (e.g. `border-b border-falcon-neutral-150`). The internal colours are not exposed for per-instance override (GAP G6 — no token contract).

## Dark mode support

`[CODE]` **NONE on the strip itself.** The template has **zero `dark:` variants** — `bg-falcon-neutral-0` / `text-falcon-neutral-925` / `bg-falcon-teal-700` are light-mode utilities. On a dark canvas the strip renders light-on-light unless the surrounding page provides a dark surface. (GAP G5 — same class of finding as B25 `<falcon-org-node-header>` "no dark mode".) **Caveat:** the projected `<app-org-node-avatar>` and `<falcon-angular-button>`s handle their own dark mode; the gap is specifically the strip background + label colour.

## Density support

**N/A** — no density axis, no `size` input. Header padding (`px-5 pt-5 pb-5`) and avatar dims are fixed (GAP G2).

## RTL support

`[CODE]` The layout uses logical flex (`flex items-center justify-between gap-4`) which respects writing direction, and the actions/avatar groups are gap-based flex — so the strip **mirrors correctly under RTL** structurally. `truncate` + `gap-*` are direction-agnostic. Not runtime-verified in this audit — flag for the theme/RTL agent.

## Static style risks

- `[CODE]` **No inline `style=`** anywhere (the only `[style...]`-shaped bindings are `[attr.aria-label]`, `[title]`, `[alt]`, `[src]` — content, not style). Clean.
- `[CODE]` **No arbitrary Tailwind values** (`[...]`), **no raw hex/rgb/px** in the template. Clean on tokens-over-literals.
- `[CODE]` **Avatar-circle size mismatch** (not a style *risk* per se but a visual inconsistency): `<img>` branch is `w-7 h-7` (28px), initials branch is `w-9 h-9` (36px) — the avatar changes size depending on which branch renders (GAP G3).
- `[CODE]` **Stale comment** claims a `border-b` divider (html:7-10) that the live `<header>` class does not apply (GAP G4) — a documentation/style-intent risk, not a CSS bug.

## No CSS / no SCSS guidance

`[CODE]` There is **no `.css`/`.scss` file** for this component (Glob empty) — and there should not be. Styling stays as Falcon-Tailwind utilities in the template. Consumers must add only **layout** utilities on the host `class=`; never add a SCSS rule to restyle the strip.

## Token usage by state

`[CODE]` The component is **stateless** (no hover/focus/error/disabled states of its own — it is a static header). There is no per-state token table. The only conditional rendering is the avatar precedence (`@if`/`@else if`) and the actions presence (`@if`), neither of which swaps tokens.

| "State" | Tokens / utilities |
|---|---|
| Default (only state) | `bg-falcon-neutral-0` strip, `text-falcon-neutral-925` label, `bg-falcon-teal-700` initials chip, `border-falcon-neutral-150` img circle |
| Hover / Focus / Error / Disabled / Loading | _None — the component has no interactive states._ |

## Verification
🟡 CODE-DERIVED 2026-06-03 (B26) — no token file exists (Glob confirmed); the template's Tailwind utilities were read directly from falcon-node-details-section.component.html and mapped to their platform CSS-vars. Dark-mode absence + avatar size mismatch + stale `border-b` comment 🟢 code-verified. RTL correctness 🟡 structurally inferred (logical flex), not runtime-verified.
