# falcon-email-field — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/email-field.tokens.css` (14 categories).

`[CODE]` Scoped under `:where(falcon-email-field, falcon-email-field-tw, falcon-angular-email-field, .falcon-email-field, [data-falcon-email-field])` — **gate-12 compliant** (not on `:root`). Shadow + Light + Angular host + utility-class consumers all read the same vars.

> **Correction vs prior dossier:** email-field is NOT a thin "inherits all `<falcon-input>` tokens" delta. It declares its **own complete `--falcon-email-field-*` token set** (label, wrapper sizing/border/bg/shadow per state, input color/caret/placeholder, verify button, verify divider, helper/error, motion). It references the shared *theme palette* (`--color-falcon-*`, `--falcon-density-*`, `--falcon-radius-*`, `--falcon-font-size-*`, `--falcon-spacing-*`) but NOT the `--falcon-input-*` component tokens (the one exception is `--falcon-email-field-icon-color: var(--falcon-input-icon-color)` for the icon slot). The prior TOKENS doc invented `--falcon-email-field-partition-*` and `--falcon-email-field-verified-*` names that do **not** exist in source.

## Token categories (14, per the file header `[CODE]` `email-field.tokens.css:9-24`)

1. CONTAINER — `width` / `min-width` / `max-width`.
2. LABEL — `color`, `color-error`, font family/size/weight/line-height, `margin-bottom`, `required-color`.
3. WRAPPER (sizing + border) — `height-{sm,md,lg}`, `border-width`, `border-style`, `border-radius`.
4. WRAPPER-STATE — `border-color{,-hover,-focus,-error,-disabled}`, `bg{,-hover,-focus,-error,-disabled}`.
5. WRAPPER-PADDING — `padding-inline-start` (12px), `padding-inline-end` (4px).
6. WRAPPER-SHADOW — `shadow` (none), `shadow-focus` (3-stop teal halo), `shadow-error` (micro-drop).
7. INPUT-SIZING — `input-font-size-{sm,md,lg}`.
8. INPUT-COLOR — `input-color`, `input-color-disabled`, `input-placeholder-color`, `input-caret-color`.
9. INPUT-PADDING — `input-padding-x` (4px).
10. VERIFY-BUTTON-SIZE — `verify-height-{sm,md,lg}`, `verify-padding-x`, `verify-gap`, `verify-radius`, `verify-icon-size`, `verify-font-size`, `verify-font-weight`.
11. VERIFY-BUTTON-STATE — `verify-bg{,-hover,-disabled}`, `verify-color{,-hover,-disabled}`.
12. VERIFY-DIVIDER — `verify-divider-width` (1px), `-height` (22px), `-color`, `-margin-inline-start/-end`.
13. HELPER + ERROR TEXT — `helper-*` + `error-*` (color/font-size/weight/line-height/margin-top/padding-x).
14. MOTION — `transition-duration` (140ms), `transition-easing` (ease), `disabled-opacity` (0.6).

## Related Falcon theme tokens (palette the email-field tokens resolve to)

| Theme token | Used by email-field via |
|---|---|
| `--color-falcon-neutral-0 / 50 / 100 / 200 / 400 / 475 / 700 / 800 / 900` | bg / disabled bg / verify hover bg / borders / placeholder / helper / label / input text. |
| `--color-falcon-teal-500 / 700` | focus border, caret, verify color (idle/hover). |
| `--color-falcon-red-50 / 500` | error bg / error border + text + required + label-error. |
| `--falcon-density-input-height-{sm,md,lg}` | wrapper heights. |
| `--falcon-radius-md` | border radius (10px). |
| `--font-display`, `--falcon-font-family` | label font. |
| `--falcon-font-size-xs / xxs` | label / helper / error sizes. |
| `--falcon-spacing-1 / 2` | helper/error margins + padding. |
| `--falcon-input-icon-color` | the ONLY `--falcon-input-*` reference — icon-slot color. |

## Tailwind helper for this component

`libs/falcon-ui-core/src/tailwind/email-field-tailwind-classes.ts` (9 builders: `base`, `wrapper`, `input`, `verifyDivider`, `verify`, `label`, `requiredMarker`, `helper`, `error`). Every class reads a `--falcon-email-field-*` token via Tailwind v4 arbitrary-value utilities — the SAME token chain as the Shadow CSS. The `-tw` twin imports all 9 (`[CODE]` `falcon-email-field-tw.tsx:22-32`). **Cross-framework SSOT — clean** (unlike password, whose tailwind helper is dead).

## Dark mode support

Token-driven via the shared neutral inversions; brand teal stays constant; error red stays constant. No per-component dark override.

## Density support

Heights ride `--falcon-density-input-height-*` aliases; verify-button heights are fixed-px per size token. To compact a single field, override `--falcon-email-field-height-md`.

## RTL support

`[CODE]` Padding + divider + verify button use logical properties (`padding-inline-*`, `margin-inline-*`) → flip under `dir="rtl"`. Icon slots use `start-2.5`/`end-2.5` logical Tailwind. Verify button + its divider move to the inline-start in RTL.

> Not re-verified end-to-end — flag for the theme/tokens agent.

## Static style risks

- `[CODE]` `falcon-email-field.css` (Shadow) — token-only; `@import '../../styles/tailwind.css'` + `@import '../../styles/base.css'` + `@apply` utilities, every visual a `var(--falcon-email-field-*)`. **No raw hex/px sinks.** ✅ clean.
- `[CODE]` `falcon-email-field-tw.css` — host display rule only. ✅ clean.
- `[CODE]` The `verifyIcon` SVG (`-tw` only) hardcodes `width/height=13`, `stroke-width=2.2`, `marginInlineEnd:5px` inline (`falcon-email-field-tw.tsx:232-248`) — cosmetic px literals on a decorative glyph, low risk, but not tokenized (minor — see GAPS).

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; consumer per-instance overrides mutate `--falcon-email-field-*` via a host class + CSS. Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Border | `--falcon-email-field-border-color{,-hover,-focus,-error,-disabled}` |
| Radius | `--falcon-email-field-border-radius` |
| Shadow | `--falcon-email-field-shadow{,-focus,-error}` |
| Background | `--falcon-email-field-bg{,-hover,-focus,-error,-disabled}` |
| Text | `--falcon-email-field-input-color{,-disabled}`, `-placeholder-color`, `-caret-color`, label `-color{,-error}`, `-required-color` |
| Hover | `-bg-hover`, `-border-color-hover` |
| Focus | `-bg-focus`, `-border-color-focus`, `-shadow-focus` (also `focus-within:` in the `-tw` helper) |
| Error | `-bg-error`, `-border-color-error`, `-shadow-error`, `-error-color`, `-label-color-error` |
| Disabled | `-bg-disabled`, `-border-color-disabled`, `-disabled-opacity`, `-input-color-disabled` |
| Verify button | `-verify-bg{,-hover,-disabled}`, `-verify-color{,-hover,-disabled}`, `-verify-height-*`, `-verify-padding-x`, `-verify-radius`, `-verify-font-*` |
| Verify divider | `-verify-divider-width`, `-height`, `-color`, `-margin-inline-*` |

## Verification
🟢 code-verified against `email-field.tokens.css`, `falcon-email-field.css`, `falcon-email-field-tw.css`, `email-field-tailwind-classes.ts`, both `.tsx` (2026-06-03). Replaced the prior "inherits all input tokens" model + invented `partition`/`verified` token names with the actual standalone 14-category set.
