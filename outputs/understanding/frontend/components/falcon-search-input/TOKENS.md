# falcon-search-input — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/search-input.tokens.css` (~22 lines — **spinner only**).

The selector is the gate-12-compliant `:where(falcon-search-input, falcon-search-input-tw, falcon-angular-search-input, .falcon-search-input, [data-falcon-search-input])` (`[CODE]` search-input.tokens.css:13) — Shadow + Light + Angular host + utility-class consumers all read the same vars. **Not on `:root`** → passes gate-12 component-token-scope.

## Token categories (1 declared — corrects prior "4 categories" claim)

Only **one** category exists in this file:

1. **LOADING SPINNER** (`[CODE]` search-input.tokens.css:17-20):
   - `--falcon-search-input-loading-inset: 10px;` — trailing inset of the spinner.
   - `--falcon-search-input-spinner-size: 14px;` — spinner diameter.
   - `--falcon-search-input-spinner-track: var(--color-falcon-neutral-200, #e5e7eb);` — ring track colour.
   - `--falcon-search-input-spinner-color: var(--color-falcon-primary-500, #3b82f6);` — ring active-arc colour.

> **Correction (drift):** the prior dossier listed SEARCH ICON, CLEAR BUTTON, and a "SPECIFIC bg" token category and named `--falcon-search-input-icon-color` / `--falcon-search-input-bg`. **None of those tokens exist.** The search ICON, the CLEAR-X, the background, border, focus ring, and height are all the composed `<falcon-input variant="search">` primitive → they are driven by the shared `--falcon-input-*` tokens, NOT by any `--falcon-search-input-*` token.

> **Finding (palette):** `--falcon-search-input-spinner-color` references `--color-falcon-primary-500` (`[CODE]` search-input.tokens.css:20), but **Falcon has no `primary` palette family** (the palette is neutral / teal / green / red / amber). The var is always undefined → the spinner always falls back to the literal `#3b82f6` (a generic blue), NOT a brand colour. Same for the helper's mirrored fallback (`[CODE]` search-input-tailwind-classes.ts:15). The spinner therefore renders OFF-brand by default. Safe-local fix: repoint to `--color-falcon-teal-500` (brand) with a teal hex fallback.

## Related Falcon theme tokens (the FIELD, inherited via composed input)

| Falcon theme token (via `--falcon-input-*`) | Used by search-input via |
|---|---|
| `--falcon-input-bg`, `--falcon-input-bg-disabled` | Field background (inner `<falcon-input>`). |
| `--falcon-input-border-color-{idle,focus,disabled}` | Field border. |
| `--falcon-input-border-radius`, `--falcon-input-shadow*` | Field shape + focus halo. |
| `--falcon-input-height-{sm,md,lg}` → `--falcon-density-input-height-*` | Field height per `size`. |
| `--falcon-input-clear-*` (clear-X color/bg) | The clear-X affordance. |
| `--color-falcon-neutral-200` | Spinner track fallback. |
| `--color-falcon-teal-500` | **Recommended** spinner colour (not currently used). |

## Tailwind utility guidance for this component

The Tailwind helper `libs/falcon-ui-core/src/tailwind/search-input-tailwind-classes.ts` exports exactly one builder, `falconSearchInputLoadingClasses()`, which positions the spinner via arbitrary-value utilities that read the same spinner tokens (`absolute end-[var(--falcon-search-input-loading-inset,10px)]` etc., `[CODE]` :9-18). Consumers should NOT hand-roll spinner classes — override the spinner tokens instead. For host layout use `class=` (the wrapper host-binds `block w-full`).

## Dark mode support

Token-driven. The field follows `<falcon-input>` dark-mode behaviour automatically (neutrals invert, brand teal stays). The spinner track `--color-falcon-neutral-200` will be a light grey on a dark surface — acceptable but low-contrast; consider a dark-mode track override if the spinner reads faint. No per-instance dark override is required.

## Density support

Field height inherits `--falcon-density-input-height-{sm,md,lg}` via the composed input. The spinner size is a fixed token (`--falcon-search-input-spinner-size`), not density-linked — it does not shrink with `size="sm"` automatically.

## RTL support

`[CODE]` Both the Shadow CSS (`inset-inline-end`, `[CODE]` falcon-search-input.css:21) and the Tailwind helper (`end-[…]`, `[CODE]` search-input-tailwind-classes.ts:11) use **logical** end-side positioning → the spinner auto-mirrors to the start edge under `[dir="rtl"]`. The magnifier + clear-X mirror because they are the composed `<falcon-input>` (logical-side too). 🟡 NOT runtime-verified RTL end-to-end — flag for theme agent.

## Static style risks

- `[CODE]` `falcon-search-input.css` (Shadow) declares the spinner `@keyframes falcon-search-spin` + the `.falcon-search-input-loading` rule with **token-backed** values + literal fallbacks only (`2px solid`, `border-radius: 50%`, `0.7s linear`) — geometry literals are unavoidable spinner mechanics, no hex/colour hardcoded except via token fallback. **Low risk.**
- The `#3b82f6` / `#e5e7eb` fallbacks in BOTH the token file and the Tailwind helper are the only raw hex — they are fallbacks behind `var(--color-falcon-*)`, acceptable per house rule, but the `primary` palette miss (above) means the colour fallback actually fires.
- No `.component.css` in the Angular wrapper → no wrapper-level static risk.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; spinner positioning lives in the helper.
- Per-instance overrides MUST mutate `--falcon-search-input-spinner-*` (spinner) or `--falcon-input-*` (field) via a host class. Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle (field) | `--falcon-input-bg`, `--falcon-input-border-color`, `--falcon-input-text-color` (inherited). |
| Focus (field) | `--falcon-input-border-color-focus`, `--falcon-input-shadow-focus`, `--falcon-input-ring-*` (inherited). |
| Clear-X visible | `--falcon-input-clear-*` (inherited; appears when value non-empty). |
| Loading | `--falcon-search-input-spinner-color`, `--falcon-search-input-spinner-track`, `--falcon-search-input-spinner-size`, `--falcon-search-input-loading-inset` (own). |
| Disabled (field) | `--falcon-input-bg-disabled`, `--falcon-input-border-color-disabled`, `--falcon-input-text-color-disabled` (inherited). |
| Error / Success / Warning | **None** — search-input forwards no `state` to the inner input; no validation visuals exist. |

## Verification
🟢 code-verified against `search-input.tokens.css` (read 2026-06-03) + `falcon-search-input.css` + `search-input-tailwind-classes.ts`. Spinner-only token surface, `primary`-palette miss, logical-side RTL ✅ source-verified. Corrects prior TOKENS.md inflated category list + non-existent token names. RTL end-to-end 🟡 not runtime-verified.
