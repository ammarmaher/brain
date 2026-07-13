# falcon-phone-field — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/phone-field.tokens.css` (14 categories).

`[CODE]` Scoped under:

```css
:where(
  falcon-phone-field, falcon-phone-field-tw, falcon-angular-phone-field,
  .falcon-phone-field, [data-falcon-phone-field],
  .falcon-overlay-container
)
```

**gate-12 compliant** (not on `:root`). The `.falcon-overlay-container` host is included because the `-tw` country panel is **body-portaled** there (`popover-portal.ts portalToOverlay`) — without it, the portaled panel would render unstyled. `[CODE]` `phone-field.tokens.css:29-44` documents this (the `gate-12-rescope` wave, 2026-06-02, moved these off `:root` where the 2026-05-15 portal wave had wrongly promoted them).

> **Correction vs prior dossier:** phone-field declares its **own complete `--falcon-phone-field-*` token set** (it does NOT "inherit all `<falcon-input>` tokens"). It references the shared theme palette but not `--falcon-input-*` (except `--falcon-phone-field-icon-right-color: var(--falcon-input-icon-color)`). The prior doc invented `--falcon-phone-field-country-*`, `-partition-*`, `-dial-code-*` names; the real names are `-cc-*`, `-divider-*`, `-dial-*` (below).

## Token categories (14, per the file header `[CODE]` `phone-field.tokens.css:12-26`)

1. CONTAINER — `width` / `min-width` / `max-width`.
2. LABEL — `color`, `color-error`, font family/size/weight/line-height, `margin-bottom`, `required-color`.
3. WRAPPER — `height-{sm,md,lg}`, `border-width/style/radius`, `border-color{,-hover,-focus,-error,-disabled}`, `bg{,-hover,-focus,-error,-disabled}`, `shadow{,-focus,-error}`, `padding-inline-start` (6px) / `-end` (4px).
4. COUNTRY-CHOOSER (`cc-`) — `cc-padding-y/-x`, `cc-border-radius`, `cc-bg`, `cc-bg-hover`, `cc-color`, `cc-chev-color`, `cc-chev-size`, `cc-gap`; + the chooser→dial `divider-{width,height,color,margin-inline-start,-end}`.
5. FLAG — `flag-size-{sm,md,lg}`, `flag-bg`, `flag-radius`, `flag-option-size`, `flag-name-gap`.
6. DIAL-CODE (`dial-`) — `dial-font-size`, `dial-color`, `dial-font-weight`, `dial-margin-inline-end`.
7. INPUT — `input-font-size-{sm,md,lg}`, `input-color{,-disabled}`, `input-placeholder-color`, `input-caret-color`, `input-padding-x`.
8. VERIFY-BUTTON — `verify-height-{sm,md,lg}`, `-padding-x`, `-gap`, `-bg{,-hover,-disabled}`, `-color{,-hover,-disabled}`, `-font-size`, `-font-weight`, `-radius`, `-icon-size`; + `verify-divider-{width,height,color,margin-inline-start,-end}`.
9. PANEL — `panel-bg`, `-border-width/-color`, `-border-radius`, `-shadow`, `-max-height` (320px), `-z-index` (200), `-offset`, `-padding-y`.
10. SEARCH — `search-padding-y/-x`, `-gap`, `-border-bottom-color`, `-icon-size`, `-icon-color`, `-font-size`, `-color`, `-placeholder-color`.
11. OPTION — `option-padding-y/-x`, `-gap`, `-bg{,-hover,-selected,-disabled}`, `-color{,-disabled}`, `-name-font-size/-weight`, dial-pill (`-dialpill-*`), separator (`-separator-*`).
12. EMPTY-MESSAGE — `empty-color`, `-font-size`, `-padding-y/-x`.
13. HELPER + ERROR TEXT — `helper-*` + `error-*`.
14. MOTION — `transition-duration` (140ms), `transition-easing` (ease), `disabled-opacity` (0.6).

## Related Falcon theme tokens

| Theme token | Used by phone-field via |
|---|---|
| `--color-falcon-neutral-0 / 50 / 100 / 200 / 400 / 475 / 700 / 800 / 900` | bg / disabled / chooser hover / option hover+selected / borders / dividers / dial-pill / placeholder / text. |
| `--color-falcon-teal-500 / 700` | focus border, caret, verify color (idle/hover). |
| `--color-falcon-red-50 / 500` | error bg / error border + text + required. |
| `--falcon-density-input-height-{sm,md,lg}` | wrapper heights. |
| `--falcon-radius-md` | border radius (10px). |
| `--font-display`, `--falcon-font-family` | label font. |
| `--falcon-font-size-xs / xxs` | label / helper / error sizes. |
| `--falcon-spacing-1 / 2` | helper/error margins + padding. |
| `--falcon-input-icon-color` | the ONLY `--falcon-input-*` reference — the `icon-right` slot color. |

## Tailwind helper for this component

`libs/falcon-ui-core/src/tailwind/phone-field-tailwind-classes.ts` — ~22 class builders (base, wrapper, chooser, flag, chevron, divider, dial, input, verify(+divider), panel, search(+icon+input), listbox, option(+flag+name+dial), empty, label, requiredMarker, helper, error). Every class reads a `--falcon-phone-field-*` token via Tailwind v4 arbitrary-value utilities — the SAME token chain as the Shadow CSS. The `-tw` twin imports all of them (`[CODE]` `falcon-phone-field-tw.tsx:32-57`). **Cross-framework SSOT — clean.**

## Dark mode support

Token-driven via shared neutral inversions; brand teal + error red constant. The portaled panel (in `.falcon-overlay-container`) inherits the same tokens, so dark mode applies to the popover too. No per-component dark override.

## Density support

Heights ride `--falcon-density-input-height-*`; flag size + verify height are fixed-px per `size`. Override `--falcon-phone-field-height-md` / `-flag-size-md` for a compact instance.

## RTL support

`[CODE]` All gutters/dividers use logical properties (`padding-inline-*`, `margin-inline-*`); the chooser sits at the inline-start → flips to the inline-end under `dir="rtl"`; option rows + dial-pill mirror. Native tel input follows page direction.

> Not re-verified end-to-end — flag for the theme/tokens agent.

## Static style risks

- `[CODE]` `phone-field.tokens.css` — the focus/error shadows are raw `rgba(…)` triples (e.g. `rgba(13,63,68,0.09) 0 0 0 2.22185px`) rather than palette aliases; this matches email-field + the V0.3 spec and is the documented Falcon halo recipe — low risk but not palette-tracking.
- `[CODE]` The flag glyphs are emoji strings in `DEFAULT_PHONE_COUNTRIES` — OS-dependent rendering (visual variance across platforms). `flag-bg`/`flag-radius` tokens style the container, not the glyph.
- `[CODE]` `falcon-phone-field-tw.tsx` verify-icon SVG hardcodes `width/height=13`, `stroke-width=2.2`, inline `marginInlineEnd:5px` — decorative px literals, low risk (same as email-field).

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; per-instance overrides mutate `--falcon-phone-field-*` via a host class. Never hardcode hex/px inline.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Wrapper border / bg / shadow | `--falcon-phone-field-border-color{,-hover,-focus,-error,-disabled}`, `-bg{,…}`, `-shadow{,-focus,-error}` |
| Country chooser | `-cc-bg{,-hover}`, `-cc-color`, `-cc-chev-color`, `-cc-padding-*`, `-cc-border-radius`, `-cc-gap` |
| Flag | `-flag-size-*`, `-flag-bg`, `-flag-radius`, `-flag-option-size`, `-flag-name-gap` |
| Dial code | `-dial-font-size`, `-dial-color`, `-dial-font-weight`, `-dial-margin-inline-end` |
| Dividers (3) | chooser→dial `-divider-*`; pre-verify `-verify-divider-*` |
| Input | `-input-font-size-*`, `-input-color{,-disabled}`, `-input-placeholder-color`, `-input-caret-color`, `-input-padding-x` |
| Verify button | `-verify-height-*`, `-verify-bg{,-hover,-disabled}`, `-verify-color{,-hover,-disabled}`, `-verify-padding-x`, `-verify-radius`, `-verify-font-*` |
| Panel | `-panel-bg`, `-panel-border-*`, `-panel-radius`, `-panel-shadow`, `-panel-max-height`, `-panel-z-index`, `-panel-offset`, `-panel-padding-y` |
| Search | `-search-*` |
| Option (idle/hover/selected/disabled) | `-option-bg{,-hover,-selected,-disabled}`, `-option-color{,-disabled}`, `-option-name-*`, `-option-dialpill-*`, `-option-separator-*` |
| Empty | `-empty-color`, `-empty-font-size`, `-empty-padding-*` |

## Verification
🟢 code-verified against `phone-field.tokens.css`, `phone-field-tailwind-classes.ts`, both `.tsx` (2026-06-03). Replaced the prior "inherits input tokens" + invented `country-*`/`partition-*` names with the actual standalone 14-category `--falcon-phone-field-*` set; documented the `.falcon-overlay-container` portal-scope inclusion.
