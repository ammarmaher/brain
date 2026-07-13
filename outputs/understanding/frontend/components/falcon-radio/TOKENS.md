# falcon-radio — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/radio.tokens.css` (**186 lines** — recount 2026-06-03).

`[CODE]` Scoped under `:where(falcon-radio, falcon-radio-tw, falcon-angular-radio, .falcon-radio, [data-falcon-radio])` (line 44) — specificity 0, so per-instance overrides win. **gate-12 compliant** (scoped, NOT `:root`).

> A SECOND file, `radio-group.tokens.css` (22 ln), declares the `--falcon-radio-group-*` vars and ALSO extends its `:where(...)` to cover `falcon-radio`/`falcon-radio-tw`/`falcon-angular-radio` (so a stray `--falcon-radio-accent` resolves on a lone radio). Documented in the `falcon-radio-group` dossier.

## Token categories (14 declared)

`[CODE]` Headers in radio.tokens.css:
1. CONTAINER — `--falcon-radio-width / min-width / max-width / row-gap`.
2. LABEL — color (+ disabled/error), font family/size/weight/line-height, margin-bottom, cursor, `--falcon-radio-required-color`.
3. SIZING — `--falcon-radio-size-{sm,md,lg}` (14/16/18px) + label font sizes per size.
4. TYPOGRAPHY — font-weight, line-height, letter-spacing.
5. BACKGROUND — `bg`, `bg-hover`, `bg-focus`, `bg-checked`, `bg-error`, `bg-disabled`, `bg-disabled-checked`. **All resolve to white** except disabled (neutral-50) — the checked dot is NOT a fill.
6. TEXT COLOR — `text-color`, `text-color-disabled`, `text-color-error` (alias the label colors).
7. BORDER — **the big one**: `--falcon-radio-border-width: 1.5px`, `--falcon-radio-border-width-checked: 5px` (the dot trick), `border-style`, `border-radius: 50%`, plus `border-color-{idle,hover,focus,checked,error,disabled,disabled-checked}`.
8. SHADOW / FOCUS RING — `shadow` (none), `shadow-focus` (3px teal-alpha halo), `shadow-error`, `shadow-disabled`, `ring-width`, `ring-color-focus`, `ring-color-error`, `ring-offset`.
9. LABEL ROW — `label-row-align`, `label-row-flex`, `label-row-gap`.
10. HELPER TEXT — color, font-size, weight, margin-top, padding-x.
11. ERROR TEXT — color, font-size, weight, line-height, margin-top, padding-x.
12. GROUP — `group-gap-vertical/horizontal`, group-label color/font/weight/margin (consumed by the group, not the lone radio).
13. MOTION — `transition-duration: 150ms`, `transition-easing: ease` (border-color + border-width animate).
14. DENSITY — `density-touch-target` (24px) + row padding knobs — **declared but unused by the CSS** (reserved for studio overrides).

## Related Falcon theme tokens

| Falcon theme token | Used by radio via |
|---|---|
| `--color-falcon-neutral-0` | Mark background (always white). |
| `--color-falcon-neutral-400` (`#cbd2d9`) | Idle border. |
| `--color-falcon-teal-500` (`#124c52`) | Hover/focus/checked border (the dot). |
| `--color-falcon-red-500` | Error border + required asterisk + error text. |
| `--color-falcon-teal-alpha-12` | Focus halo. |
| `--color-falcon-neutral-200 / 300` | Disabled / disabled-checked border. |
| `--falcon-font-size-sm / xs / xxs` | Label / helper / error type. |
| `--falcon-spacing-1` | Helper/error margin. |

## Tailwind utility guidance for this component

`[CODE]` The `-tw` path reads the SAME `--falcon-radio-*` tokens through arbitrary-value utilities in `radio-tailwind-classes.ts` (e.g. `border-[length:var(--falcon-radio-border-width-checked)]`, `bg-[var(--falcon-radio-bg-checked)]`). Consumers should override **tokens**, not hand-roll Tailwind that fights them. For layout, pass `rowClass`/`markClass`/`labelClass`.

## Dark mode support

Inherits the `:where(.app-dark, .app-dark *)` neutral inversions from the theme layer — mark background flips to a dark surface, teal stays for the checked dot, halo strengthens. No per-radio dark override needed.

> The thick-border "dot" is visually sensitive in dark mode — verify the 5px teal ring reads clearly against the dark mark fill (flag for theme agent).

## Density support

`size` selects `--falcon-radio-size-{sm,md,lg}`. The DENSITY category (`--falcon-radio-density-*`) is declared but currently inert.

## RTL support

`[CODE]` The label sits inline-end of the mark via flex `gap` (no left/right) and `margin-inline-start` on the required asterisk (falcon-radio.css:148-150), so the row auto-flips under `[dir='rtl']`. Theme RTL overrides live in the `libs/falcon-ui-tokens/src/rtl/` layer.

> Not verified end-to-end this audit — flag for the theme/tokens agent.

## Static style risks

- `[CODE]` Shadow CSS `falcon-radio.css` (170 ln) is **token-only — VERIFIED clean 2026-06-03**: `@apply` structural + every visual value reads a `--falcon-radio-*` var. Only literals are structural (`gap: 4px` on the label flex line:129, `inset:0` / `margin:0` on the native input). No raw color hex.
- `[CODE]` `falcon-radio.component.css` (Angular wrapper) is `:host{display:inline-block}` + an inner-display rule — no risk.
- `[CODE]` `radio-tailwind-classes.ts` writes no inline `style` — pure class strings reading tokens.
- App-level risk: `wb-radio-pill.component.ts` writes `styles:` rules targeting `falcon-radio-tw[disabled] label` (cursor) — reaches into the render-path internals (pragmatic, but couples the app to the Light-DOM structure).

## No CSS / no SCSS guidance

- Tailwind utilities only in templates.
- Per-instance overrides MUST mutate `--falcon-radio-*` via a host class — never hardcode hex/px.
- Do not add component CSS rules in consumer CSS to restyle the mark.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle | `--falcon-radio-bg`, `--falcon-radio-border-color`, `--falcon-radio-border-width`, `--falcon-radio-shadow` |
| Hover | `--falcon-radio-bg-hover`, `--falcon-radio-border-color-hover`, `--falcon-radio-shadow-hover` |
| Focus | `--falcon-radio-border-color-focus`, `--falcon-radio-shadow-focus`, `--falcon-radio-ring-color-focus`, `--falcon-radio-ring-width` |
| Checked | `--falcon-radio-bg-checked` (white), `--falcon-radio-border-color-checked` (teal), `--falcon-radio-border-width-checked` (5px) |
| Error | `--falcon-radio-bg-error`, `--falcon-radio-border-color-error`, `--falcon-radio-shadow-error`, `--falcon-radio-ring-color-error`, `--falcon-radio-error-color`, `--falcon-radio-label-color-error` |
| Disabled | `--falcon-radio-bg-disabled`, `--falcon-radio-border-color-disabled`, `--falcon-radio-shadow-disabled`, `--falcon-radio-label-color-disabled` |
| Disabled+checked | `--falcon-radio-bg-disabled-checked`, `--falcon-radio-border-color-disabled-checked`, `--falcon-radio-border-width-checked` |
| Radius | `--falcon-radio-border-radius` (50%) |
| Motion | `--falcon-radio-transition-duration`, `--falcon-radio-transition-easing` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 186 lines, `:where()` scope (gate-12) confirmed, Shadow CSS verified token-only. Corrected prior dossier: removed fabricated `--falcon-radio-bg-checked-inner` / "inner dot" token (real mechanism = `border-width-checked` 5px); category list re-derived (14 headers).
