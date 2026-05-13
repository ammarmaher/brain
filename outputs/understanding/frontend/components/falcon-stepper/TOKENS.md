# falcon-angular-stepper — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/stepper.tokens.css`

Selector scope (applies tokens to all 4 render surfaces):
```css
:where(falcon-stepper, falcon-stepper-tw, falcon-angular-stepper, .falcon-stepper, [data-falcon-stepper]) { … }
```

## Related Falcon theme tokens
From `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
- `--color-falcon-teal-500` (primary active/completed fill)
- `--color-falcon-teal-100` (selected node bg)
- `--color-falcon-neutral-200` (upcoming track / dot bg)
- `--color-falcon-neutral-500` (upcoming label text / chevron)
- `--color-falcon-neutral-900` (default text / completed label)
- `--color-falcon-neutral-400` (disabled label)
- `--color-falcon-red-500` (error dot bg + error message text)
- `--falcon-font-weight-medium` / `--falcon-font-weight-semibold` / `--falcon-font-weight-bold`

## 14 token categories (verbatim from stepper.tokens.css)
1. **CONTAINER** — `--falcon-stepper-max-width`, `--falcon-stepper-padding-x`, `--falcon-stepper-padding-top`, `--falcon-stepper-padding-bottom`.
2. **STEP CIRCLE** — `--falcon-stepper-circle-size-{sm,md,lg}`, `-circle-bg-{upcoming,active,completed,error,disabled}`, `-circle-color-{upcoming,active,completed,error,disabled}`, `-circle-border-{width,color}`, `-circle-disabled-opacity`, `-circle-shadow-{active,focus}`.
3. **STEP NUMBER / CHECK** — `--falcon-stepper-number-font-size-{sm,md,lg}`, `-number-font-weight`, `-number-line-height`, `-check-size-{sm,md,lg}`, `-pulse-{size,color}`.
4. **STEP LABEL** — `--falcon-stepper-label-font-size-{sm,md,lg}`, `-label-font-weight{,-active}`, `-label-line-height`, `-label-margin-top`, `-label-text-align`, `-label-max-width-bottom-center`, `-label-padding-x-bottom-center`, `-label-color-{upcoming,active,completed,error,disabled}`.
5. **STEP DESCRIPTION** — `--falcon-stepper-desc-{font-size,line-height,margin-top,color}`.
6. **CONNECTOR LINE** — `--falcon-stepper-track-{thickness,radius,margin-top,color,color-completed}`.
7. **SPACING** — `--falcon-stepper-gap-{horizontal,vertical}`.
8. **ICON** — `--falcon-stepper-icon-size-{sm,md,lg}`, `-icon-color-{upcoming,active,completed,error,disabled}`.
9. **ERROR INDICATOR** — `--falcon-stepper-error-ring-shadow`, `-error-icon-size`.
10. **OPTIONAL TAG** — `--falcon-stepper-optional-{font-size,color,margin-top,font-weight}`.
11. **GROUP LABEL** — `--falcon-stepper-group-label-{font-size,font-weight,color,margin-bottom}`.
12. **HELPER / ERROR TEXT** — `--falcon-stepper-helper-{color,font-size,margin-top,line-height}` + `-error-text-{color,font-size,margin-top,line-height,font-weight}`.
13. **FOCUS RING** — `--falcon-stepper-focus-{outline,outline-offset}`.
14. **MOTION** — `--falcon-stepper-fill-transition-{duration,easing}`, `-circle-transition-{duration,easing}`, `-label-transition-{duration,easing}`, `-pulse-duration`.

## Tailwind utility guidance
- ALL utility class strings used by `<falcon-stepper-tw>` come from `libs/falcon-ui-core/src/tailwind/stepper-tailwind-classes.ts`. They read from the same `--falcon-stepper-*` variables — never hardcode hex / px.
- Consumers SHOULD NOT add Tailwind utilities to override visuals — override tokens instead.
- The wrapper's `rootClass` Input can layer extra Tailwind (e.g., margin / padding around the stepper card), but not visual properties of the dots/labels.

## Dark mode support
- **Missing.** No `@custom-variant dark` rules in `stepper.tokens.css`.
- Per `feedback_v02_theme_adopted.md`, the theme file enables a dark mode variant; but stepper-scoped overrides for `--falcon-stepper-circle-bg-upcoming`, `-track-color`, `-label-color-upcoming` are not provided.
- **Recommendation:** add dark overrides at lines 385-451 of `falcon-tailwind-tokens.css` for stepper.

## Density support
- Partial. `size` toggles a 3-step size scale (`sm/md/lg`) but not a true "compact density". The Tailwind helper's spacing values do not change with density.
- **Recommendation:** add a `density?: 'comfortable' | 'compact'` Prop (mirroring `falcon-tree`, `falcon-table`). Compact reduces `--falcon-stepper-gap-vertical` and `--falcon-stepper-label-margin-top`.

## RTL support
- Uses `inset-inline-start` for dot positioning (good — logical property; flips automatically in `dir="rtl"`).
- Uses `aria-orientation` but does not flip arrow-key handlers (`ArrowRight`/`ArrowLeft`) in RTL — Arabic users may find the arrow direction inverted.
- **Recommendation:** detect `dir="rtl"` (or read `getComputedStyle(host).direction === 'rtl'`) and swap arrow-key intent.

## Static style risks
- **Risk:** `aria-orientation` not yet emitted for vertical mode (see GAPS).
- **Risk:** inline width on `.falcon-stepper-fill` is `${fillPercent}%` — this is the documented "stepper fill bar escape hatch" (geometry from data, not a CSS var). No risk.
- **Risk:** the `cubic-bezier(0.65, 0, 0.35, 1)` easing is captured in the token, but the `0.4s` literal in the Shadow CSS may be duplicated in the Tailwind helper. Audit.

## No CSS / No SCSS guidance
- No `.component.scss` files in the Falcon-UI-core path. Stencil consumes `falcon-stepper.css` only.
- Consumer Angular pages MUST NOT add `*.component.css` with rules — override tokens instead.

## Token usage matrix per state
| State | Border | Radius | Shadow | Spacing | Color | Hover | Focus | Error | Success | Warning | Disabled | Loading |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dot — upcoming | `-circle-border-{width,color}` | (n/a circle) | — | size-md | `-circle-color-upcoming` | — | — | — | — | — | — | — |
| Dot — active | same | — | `-circle-shadow-active` | size-md | `-circle-color-active` | — | `-circle-shadow-focus` | — | — | — | — | — |
| Dot — completed | same | — | — | size-md | `-circle-color-completed` | — | — | — | (teal-500 fill) | — | — | — |
| Dot — error | same | — | `-error-ring-shadow` | size-md | `-circle-color-error` | — | — | `-circle-bg-error` | — | — | — | — |
| Dot — disabled | same | — | — | size-md | `-circle-color-disabled` | — | — | — | — | — | `-circle-bg-disabled`, `-circle-disabled-opacity` | — |
| Track | — | `-track-radius` | — | — | `-track-color` | — | — | — | — | — | — | — |
| Fill | — | `-track-radius` | — | — | `-track-color-completed` | — | — | — | — | — | — | — |
| Label — upcoming | — | — | — | `-label-margin-top` | `-label-color-upcoming` | — | — | — | — | — | — | — |
| Label — active | — | — | — | `-label-margin-top` | `-label-color-active` | — | — | — | — | — | — | — |
| Label — completed | — | — | — | `-label-margin-top` | `-label-color-completed` | — | — | — | — | — | — | — |
| Label — error | — | — | — | `-label-margin-top` | `-label-color-error` | — | — | `-label-color-error` | — | — | — | — |
| Group label | — | — | — | `-group-label-margin-bottom` | `-group-label-color` | — | — | — | — | — | — | — |
| Helper text | — | — | — | `-helper-margin-top` | `-helper-color` | — | — | — | — | — | — | — |
| Error text | — | — | — | `-error-text-margin-top` | `-error-text-color` | — | — | `-error-text-color` | — | — | — | — |
