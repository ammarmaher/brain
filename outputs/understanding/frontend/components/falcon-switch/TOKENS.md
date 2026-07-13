# falcon-switch — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/switch.tokens.css` (**215 lines** — recount 2026-06-03).

`[CODE]` Scoped under `:where(falcon-switch, falcon-switch-tw, falcon-angular-switch, .falcon-switch, [data-falcon-switch])` (line 38) — specificity 0, per-instance overrides win. **gate-12 compliant** (NOT `:root`).

## Token categories (14 declared)

`[CODE]` Headers in switch.tokens.css:
1. CONTAINER — `--falcon-switch-width / min-width / max-width / row-gap`.
2. LABEL — color (+ disabled/error), font family/size/weight/line-height, margin-bottom, cursor, `--falcon-switch-required-color`.
3. SIZING (per variant) — **three sub-blocks**, one per variant: `track-w/h`, `knob-size`, `knob-inset`, `knob-translate`, `track-radius` for `dot-knob` (38×22, knob 16, translate 16, radius 999px), `hidden-input` (32×18, knob 14, translate 14), `channel-pill` (44×22, knob 12, inset 4, translate 22, radius 100px). PLUS `--falcon-switch-size-scale-{sm,md,lg}` (0.85/1/1.15) — **declared but UNUSED by the CSS/helper (see GAPS G8)** — and `--falcon-switch-label-font-size-{sm,md,lg}` (which `size` DOES use).
4. TYPOGRAPHY — font-weight, line-height, letter-spacing.
5. BACKGROUND (track) — `track-bg-{off,on,off-hover,on-hover,disabled-off,disabled-on,error}` + channel-pill `track-bg-channel-pill-{off (transparent),on (teal-50)}`.
6. KNOB — `knob-bg`, `knob-bg-on`, `knob-bg-disabled`, `knob-radius` (999px), `knob-shadow`, `knob-shadow-disabled`, + channel-pill `knob-bg-channel-pill-{off,on}`.
7. TEXT COLOR — `text-color`, `text-color-disabled`, `text-color-error` (alias the label colors).
8. BORDER (track) — `track-border-width-{dot-knob (0), hidden-input (0), channel-pill (1.5px)}`, `track-border-style`, `track-border-color-{off,on,channel-pill-off,channel-pill-on,error,disabled}`.
9. FOCUS RING — `shadow-focus` (3px teal-alpha), `shadow-error`, `ring-width`, `ring-color-focus`, `ring-color-error`, `ring-offset`.
10. HELPER TEXT — color, font-size, weight, margin-top, padding-x.
11. ERROR TEXT — color, font-size, weight, line-height, margin-top, padding-x.
12. TRACK INNER LABELS — `inner-label-color-{on,off}`, `inner-label-font-size` (9px), `inner-label-font-weight`, `inner-label-letter-spacing`, `inner-label-padding-x` (used when `textOn`/`textOff` set, in any variant).
13. GROUP — `group-gap-vertical/horizontal`, group-label color/font/weight/margin — **declared but there is no switch-group component (reserved, GAPS G9).**
14. MOTION — `transition-duration` (180ms, knob), `transition-easing` (ease), `track-transition-duration` (150ms).

## Related Falcon theme tokens

| Falcon theme token | Used by switch via |
|---|---|
| `--color-falcon-neutral-300` (`#d1d5db`) | Off-track background. |
| `--color-falcon-teal-500` (`#124c52`) | On-track background + on-border. |
| `--color-falcon-teal-600` | On-track hover. |
| `--color-falcon-neutral-0` | Knob background (always white). |
| `--color-falcon-teal-50` | channel-pill on-track tint. |
| `--color-falcon-red-100 / 500` | Error track bg / border / required+error text. |
| `--color-falcon-neutral-200 / 400` | Disabled / channel-pill knob-off / hover. |
| `--color-falcon-teal-alpha-12` | Focus halo. |
| `--falcon-font-size-sm / xs / xxs` | Label / helper / error type. |

## Tailwind utility guidance for this component

`[CODE]` The `-tw` path reads the SAME `--falcon-switch-*` tokens through arbitrary-value utilities in `switch-tailwind-classes.ts` — e.g. track width `w-[length:var(--falcon-switch-track-w-dot-knob)]`, knob slide `translate-x-[var(--falcon-switch-knob-translate-<variant>)]`, knob inset `start-[length:var(--falcon-switch-knob-inset-<variant>)]`, vertical centering `mt-[length:calc(var(--falcon-switch-knob-size-<variant>)*-0.5)]`. Override **tokens**, not classes; pass `rowClass`/`trackClass`/`labelClass` for layout.

## Dark mode support

Inherits the theme's `:where(.app-dark, .app-dark *)` neutral inversions — off-track flips to a dark surface, teal stays for on, knob stays white, halo strengthens. No per-switch dark override needed.

## Density support

`--falcon-switch-size-scale-{sm,md,lg}` is declared (tokens:91-93) for density, but **neither the Shadow CSS nor the Tailwind helper multiplies geometry by it** — so `size` only changes the label font today (GAPS G8). True density would need wiring those scale tokens into the track/knob dimensions.

## RTL support

`[CODE]` The knob slides via `translate-x-[var(--falcon-switch-knob-translate-<variant>)]` + `start-[length:…]` (logical `start`, not `left`), and the label sits inline-end via flex gap, so the toggle direction + inner-label order auto-flip under `[dir='rtl']`. Theme RTL overrides live in `libs/falcon-ui-tokens/src/rtl/`.

> Not verified end-to-end this audit — flag for the theme/tokens agent.

## Static style risks

- `[CODE]` Shadow CSS `falcon-switch.css` (278 ln) is `@apply` structural + token-driven; **VERIFIED token-only 2026-06-03** except a single structural `gap: 4px` (line 198). No raw color hex.
- `[CODE]` `falcon-switch.component.css` (Angular wrapper) is `:host{display:inline-block}` + inner-display — no risk.
- `[CODE]` `switch-tailwind-classes.ts` writes no inline `style` — pure class strings reading tokens.
- `[CODE]` `falcon-switch.utils.ts` produces class maps only — no inline style.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates.
- Per-instance overrides MUST mutate `--falcon-switch-*` (per-variant geometry + colors) via a host class — never hardcode hex/px.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Off (track) | `--falcon-switch-track-bg-off`, `--falcon-switch-track-border-color-off`, hover `…-off-hover` |
| On (track) | `--falcon-switch-track-bg-on`, `--falcon-switch-track-border-color-on`, hover `…-on-hover` (channel-pill uses `…-channel-pill-on`) |
| Knob position | `--falcon-switch-knob-translate-<variant>` (checked) / `translate-x-0` (off) + `--falcon-switch-knob-inset-<variant>` |
| Knob | `--falcon-switch-knob-bg` (or `…-channel-pill-{on,off}`), `--falcon-switch-knob-radius`, `--falcon-switch-knob-shadow` |
| Focus | `--falcon-switch-shadow-focus`, `--falcon-switch-ring-color-focus`, `--falcon-switch-ring-width` |
| Error | `--falcon-switch-track-bg-error`, `--falcon-switch-track-border-color-error`, `--falcon-switch-shadow-error`, `--falcon-switch-error-color`, `--falcon-switch-label-color-error` |
| Disabled | `--falcon-switch-track-bg-disabled-{off,on}`, `--falcon-switch-track-border-color-disabled`, `--falcon-switch-knob-bg-disabled`, `--falcon-switch-label-color-disabled` |
| Inner labels | `--falcon-switch-inner-label-color-{on,off}`, `--falcon-switch-inner-label-font-size`, `…-padding-x` |
| Motion | `--falcon-switch-transition-duration` (knob 180ms), `--falcon-switch-track-transition-duration` (150ms), `--falcon-switch-transition-easing` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 215 lines, `:where()` scope (gate-12) confirmed, Shadow CSS verified token-only. Corrected prior dossier: removed fabricated tokens (`--falcon-switch-knob-position-off/on`, `--falcon-switch-track-border-error`, `--falcon-switch-text-on-padding-x`); documented per-variant geometry, the unused `size-scale-*` (G8), and the reserved-but-unused group tokens (G9).
