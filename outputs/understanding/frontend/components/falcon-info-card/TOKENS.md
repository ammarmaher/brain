# falcon-info-card — TOKENS

## Component token file

`[CODE]` **NONE.** There is no `libs/falcon-ui-tokens/src/components/info-card.tokens.css` and no per-component CSS file. This is a single-render pure-Angular shared-ui component styled entirely with **inline Tailwind utility classes** in `falcon-info-card.component.html`. The gate-12 `:where()` token-scope machinery does not apply (no token file). Contrast falcon-input's ~237-line tokenized `input.tokens.css`.

## How styling actually works

`[CODE]` falcon-info-card.component.html + the `gridClass()` computed (ts:54-62) — all visual values are **Falcon-token utilities** (this component is notably cleaner than the other two B25 components — see Static style risks):

| Surface | Utilities | Falcon token(s) behind them |
|---|---|---|
| Card shell | `bg-white border border-falcon-neutral-200 rounded-lg overflow-hidden mb-4` (html:8) | `--color-falcon-neutral-200`, `--falcon-radius-lg` |
| Card shell (dark) | `dark:bg-falcon-neutral-925 dark:border-falcon-neutral-800` (html:8) | `--color-falcon-neutral-925/800` |
| Header bar | `py-3.5 px-4 border-b border-falcon-neutral-150 text-sm font-bold text-falcon-neutral-900` (html:10-12) | `--color-falcon-neutral-150/900`, `--font-size-sm`, `--font-weight-bold` |
| Header bar (dark) | `dark:border-falcon-neutral-800 dark:text-falcon-neutral-0` (html:11) | `--color-falcon-neutral-800/0` |
| Grid container | `py-4 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-{2\|3\|4} gap-x-5 gap-y-4` (ts:61) | spacing-4/5, responsive grid |
| Field label | `text-2xs text-falcon-neutral-500` (html:19) | `--font-size-2xs`, `--color-falcon-neutral-500` |
| Field label (dark) | `dark:text-falcon-neutral-400` (html:19) | `--color-falcon-neutral-400` |
| Field value | `text-sm font-semibold text-falcon-neutral-900` (html:22) | `--font-size-sm`, `--font-weight-semibold`, `--color-falcon-neutral-900` |
| Field value (dark) | `dark:text-falcon-neutral-0` (html:22) | `--color-falcon-neutral-0` |

## Token categories

`[CODE]` N/A — no `--falcon-info-card-*` token namespace. Everything is theme-token-backed Tailwind utilities. Unlike the other two B25 components, info-card uses **only** standard token utilities + responsive grid classes — no arbitrary `rgba()`/px literals (see Static style risks).

## Related Falcon theme tokens (consumed via utilities)

| Falcon theme token | Used via |
|---|---|
| `--color-falcon-neutral-{0,150,200,400,500,800,900,925}` | shell/header border + bg, label/value text (light + dark) |
| `--falcon-radius-lg` | card radius (`rounded-lg`) |
| `--font-size-{2xs,sm}` | label / value / header type |
| `--font-weight-{semibold,bold}` | value / header weight |

## Tailwind utility guidance for this component

Consumers add layout utilities on the host `block` element via `class=` (e.g. the live `class="px-5"`, templates-details.component.html:83). There is no class hook into the inner card/header; deeper visual change requires a token contract (GAP G6). Do NOT add consumer CSS targeting the inner card.

## Dark mode support

`[CODE]` **Dark mode IS handled** via inline `dark:` variants on every surface (html:8/11/19/22 — shell bg/border, header border/text, label text, value text). This is the cleanest dark-mode story of the three B25 components (org-node-header has none; view-toggle has it only on the pill). Works without a token layer, but couples dark-mode to the template (a token-driven `:where(.app-dark)` approach would be cleaner — see GAP G6).

## Density support

`[CODE]` None — fixed `py-4 px-5` grid padding, `py-3.5 px-4` header, fixed `text-sm`/`text-2xs` type. No density alias, no `dense` input. (A `dense` toggle is a reasonable future add — GAP G5.)

## RTL support

`[INFERRED]` The grid (`grid grid-cols-* gap-x-5 gap-y-4`) and flex cells (`flex flex-col gap-1`) mirror automatically under `[dir='rtl']` via the global theme — column order and label/value stacking flip correctly. No explicit RTL handling needed in the component (the grid is logical-direction-aware). NOT verified end-to-end; flag for theme review.

## Static style risks

- `[CODE]` **CLEAN** — unlike the other two B25 components, `falcon-info-card` uses **only Falcon-token utilities** (`text-sm`, `rounded-lg`, `text-falcon-neutral-*`, etc.) + responsive grid classes. **No arbitrary `[...]` values, no raw `rgba()`/hex, no inline `style=`.** This is the house-rule-compliant exemplar of the three.
- `[CODE]` The one nuance: `gridClass()` builds the grid utility string in TS (ts:54-62) with the responsive class names as **literals** (`'lg:grid-cols-4'` etc.) precisely so Tailwind's JIT scanner can see them (ts:51-53 comment). This is correct — do NOT refactor into dynamic fragment concatenation, or the columns silently break (the only "risk" is a future refactor regressing this).

## No CSS / no SCSS guidance

- Zero `.css`/`.scss` — correct per the no-SCSS / Tailwind-only rule, and (unlike org-node-header) there is no false "SCSS handles X" comment.
- No token-override path; deeper customization must be upstreamed as a token contract (GAP G6). Use the host `class=` for layout only.

## Token usage by state

| State | "Token"(s) consumed (via utilities) |
|---|---|
| Card shell | `border-falcon-neutral-200`, `rounded-lg`, dark: `bg-falcon-neutral-925`/`border-falcon-neutral-800` |
| Header bar | `border-falcon-neutral-150`, `text-falcon-neutral-900`, `font-bold`, dark: `text-falcon-neutral-0` |
| Field label | `text-falcon-neutral-500`, `text-2xs`, dark: `text-falcon-neutral-400` |
| Field value | `text-falcon-neutral-900`, `text-sm`, `font-semibold`, dark: `text-falcon-neutral-0` |
| Disabled | _None — no disabled/loading state._ |
| Loading | _None — no loading state (GAP G3)._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Confirmed NO token file + NO component CSS (styling 100% inline Tailwind). **House-rule CLEAN** — only Falcon-token utilities + responsive grid, NO arbitrary/raw values (the exemplar of the three B25 components). Dark mode handled via inline `dark:` on every surface. `gridClass()` literal-string technique (ts:54-62) is deliberate JIT-safety.
