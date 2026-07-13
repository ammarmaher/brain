# falcon-tooltip — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/tooltip.tokens.css` (**95 lines** — recount 2026-06-03).

`[CODE]` Scoped under `:where(falcon-tooltip, falcon-tooltip-tw, falcon-angular-tooltip, .falcon-tooltip, [data-falcon-tooltip])` (`[CODE]` tooltip.tokens.css:26). `:where()` keeps specificity 0 → per-instance overrides win. **gate-12 compliant** (scoped, not `:root`).

## Token categories (14 declared, per the file header)

1. CONTAINER — `--falcon-tooltip-display` (inline-flex), `-trigger-display`.
2. TRIGGER — `-trigger-cursor` (**`help`**), `-trigger-outline` (none).
3. PANEL — `-panel-bg` (neutral-900 = dark), `-panel-color` (neutral-0 = white), padding-x/y (10px/6px), border-width (0) / style / color, radius (6px), shadow, max-width (240px), min-width (0).
4. TYPOGRAPHY — font-family, size (11.5px), weight (normal), line-height (1.4), letter-spacing (0.1px).
5. ARROW / CARET — `-arrow-size` (6px), `-arrow-color` (= panel-bg).
6. PLACEMENT OFFSET — `--falcon-tooltip-offset` (8px) — trigger-to-panel gap, read by `parseOffset()`.
7. INTERACTIVE — `-interactive-pointer-events` (auto), `-default-pointer-events` (none).
8. MOTION — `-show-delay` (100ms), `-hide-delay` (80ms), `-transition-duration` (140ms), `-transition-easing` (cubic-bezier).
9. FOCUS RING — `-trigger-focus-ring-color` (teal-alpha-12), `-trigger-focus-ring-width` (3px) — on the TRIGGER, not the panel.
10. Z-INDEX — `--falcon-tooltip-z-index: 1100`.
11. STATE — `-disabled-opacity` (0.6), `-disabled-cursor` (not-allowed).
12. COLOR ALIASES — `-light-bg` / `-light-color` / `-light-border-color` (optional light-variant override; not used by default).
13. ENTER / EXIT — `-enter-scale` (0.96), `-enter-opacity` (0). (The actual translate is JS-set — see escape hatch.)
14. BREAKPOINT — `-panel-max-width-mobile` (`calc(100vw - 24px)`) — small-screen clamp at `@media (max-width: 640px)`.

> `[CODE]` Note the MOTION tokens `-show-delay` / `-hide-delay` exist in CSS but the Stencil component reads `delay` from the PROP (default 100) and HARDCODES hide at 80ms (`[CODE]` falcon-tooltip.tsx:110) — the CSS `-show-delay`/`-hide-delay` tokens are NOT consumed by the timer logic (only `--falcon-tooltip-offset` is read via `parseOffset()`). A latent token/behavior disconnect (GAP).

## Related Falcon theme tokens

| Tooltip token | References |
|---|---|
| `--falcon-tooltip-panel-bg` | `var(--color-falcon-neutral-900, #1a1a1a)` — dark panel |
| `--falcon-tooltip-panel-color` | `var(--color-falcon-neutral-0, #ffffff)` — white text |
| `--falcon-tooltip-panel-border-color` | `transparent` |
| `--falcon-tooltip-arrow-color` | `var(--falcon-tooltip-panel-bg)` (self-ref) |
| `--falcon-tooltip-panel-shadow` | `0 4px 12px rgba(0,0,0,0.18)` (mirrors the dropdown panel shadow language) |
| `--falcon-tooltip-panel-font-family` | `var(--falcon-font-family)` |
| `--falcon-tooltip-trigger-focus-ring-color` | `var(--color-falcon-teal-alpha-12)` |

## Tailwind utility guidance

`[CODE]` The `-tw` helpers (`tooltip-tailwind-classes.ts`) emit arbitrary-value utilities reading the SAME `--falcon-tooltip-*` tokens (panel: `bg-[var(--falcon-tooltip-panel-bg)]`, `z-[var(--falcon-tooltip-z-index)]`, etc.). **EXCEPTION:** the arrow CANNOT be done in pure Tailwind — `falconTooltipArrowClasses()` returns only `'absolute w-0 h-0 border-solid border-transparent'`, and the per-side border-width/color is applied via an INLINE `getArrowStyle()` style object in the `-tw` twin (`[CODE]` falcon-tooltip-tw.tsx:155-191) because Tailwind has no attribute-selector arbitrary value to replace the Shadow CSS's `[data-placement^='top'] .arrow {…}` rules. This is a documented, accepted divergence (the inline styles still read `--falcon-tooltip-arrow-*` tokens).

## Dark mode support

`[CODE]` ⚠ **Semantic-flip risk.** The panel is intentionally dark-on-light (`panel-bg: neutral-900`, white text). In the global dark map `--color-falcon-neutral-900` flips toward white → the tooltip would become white-bg + dark text, REVERSING the intended dark-tooltip look. The token file provides `-light-*` aliases for an explicit light variant but does NOT auto-apply a dark override. NOT verified end-to-end this pass — flag for the theme agent (the dark map may special-case tooltip).

## Density support

None — no `size` prop.

## RTL support

`[CODE]` Placement values are **physical** (`top`/`right`/`bottom`/`left`), NOT logical — under `dir="rtl"` the consumer must flip `right`↔`left` themselves; `computeOffset` does no RTL mirroring. The Shadow panel uses `inset-inline-start: 0` (`[CODE]` falcon-tooltip.css:38) so the fixed-origin is logical, but the JS transform is computed in physical viewport coordinates. NOT verified end-to-end.

## Static style risks

- `[CODE]` Panel `transform` is JS-set (documented escape hatch, `[CODE]` falcon-tooltip.tsx:157-162) — the ONE place geometry isn't a token.
- `[CODE]` `-tw` arrow uses inline `getArrowStyle()` per-side styles (token-backed, accepted divergence — see Tailwind guidance).
- `[CODE]` `--falcon-tooltip-panel-bg: var(--color-falcon-neutral-900, #1a1a1a)` carries a hex FALLBACK inside `var(token, fallback)` — acceptable.
- `[CODE]` Shadow CSS `.falcon-tooltip-trigger:focus-visible { … border-radius: 4px; }` (`[CODE]` falcon-tooltip.css:22) + the `-tw` helper's `focus-visible:rounded-[4px]` (`[CODE]` tooltip-tailwind-classes.ts:13) hardcode `4px` — minor literal.

## Token usage by concern

| Concern | Token |
|---|---|
| Panel bg / text | `--falcon-tooltip-panel-bg` / `-panel-color` |
| Panel padding / radius / shadow | `--falcon-tooltip-panel-padding-{x,y}` / `-panel-border-radius` / `-panel-shadow` |
| Panel max-width / min-width | `--falcon-tooltip-panel-max-width` (240px) / `-panel-min-width` |
| Typography | `--falcon-tooltip-panel-font-{family,size,weight}` / `-panel-line-height` / `-panel-letter-spacing` |
| Arrow | `--falcon-tooltip-arrow-size` / `-arrow-color` |
| Trigger-to-panel gap | `--falcon-tooltip-offset` (8px — the only token read by JS) |
| Trigger cursor / focus ring | `--falcon-tooltip-trigger-cursor` (help) / `-trigger-focus-ring-{color,width}` |
| Interactive / default pointer-events | `--falcon-tooltip-interactive-pointer-events` / `-default-pointer-events` |
| Motion | `--falcon-tooltip-transition-{duration,easing}` (delays NOT consumed by timer) |
| Z-index | `--falcon-tooltip-z-index` (1100) |
| Disabled | `--falcon-tooltip-disabled-{opacity,cursor}` |
| Mobile clamp | `--falcon-tooltip-panel-max-width-mobile` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) — token file recounted at 95 lines; `:where()` scope + 14 categories confirmed. ADDED: the `-tw` arrow inline-style divergence (Tailwind can't do attribute-selector arbitrary values) + the show/hide-delay token-vs-behavior disconnect (timer reads only `--falcon-tooltip-offset`). Dark-flip + RTL deferred to theme agent.
