# falcon-popup — TOKENS

## Token file
**None.** Unlike every other Falcon UI component, popup has NO dedicated token CSS file.

The template uses Falcon palette tokens DIRECTLY through Tailwind utility classes:
- `bg-falcon-neutral-0` / `bg-falcon-teal-900/20` / `bg-falcon-neutral-900/25` — backdrop fill.
- `text-falcon-red-700` / `text-falcon-amber-700` / `text-falcon-green-700` / `text-falcon-teal-700` — icon stroke per intent.
- `bg-falcon-red-50` / `bg-falcon-amber-50` / `bg-falcon-green-50` / `bg-falcon-teal-50` — icon chip backgrounds.
- `ring-falcon-red-200` / `ring-falcon-amber-200` / etc. — icon chip rings.

## Related Falcon theme tokens
Heavy reliance on the palette:

| Palette family | Used for |
|---|---|
| `falcon-red-{50,200,700}` | Danger intent (error / delete variants) |
| `falcon-amber-{50,200,700}` | Warning intent (unsaved variant) |
| `falcon-green-{50,200,700}` | Success intent (save variant) |
| `falcon-teal-{50,200,700,900}` | Primary intent (info default), backdrop tint when glossy |
| `falcon-neutral-{0,50,100,200,500,600,700,900}` | Surface, text, borders |

## Tailwind utility guidance
- The component is Tailwind-direct — no escape hatch needed for normal styling.
- For custom brand styling, override the palette in the global theme (per `feedback_v02_theme_adopted.md`).

## Dark mode support
- Neutrals invert via the global dark map.
- Backdrop `bg-falcon-teal-900/20` becomes lighter in dark mode (teal-900 is unchanged but the `/20` overlay on dark canvas reads differently).
- Glossy gradient: `from-falcon-neutral-0/85 to-falcon-neutral-0/75` — in dark mode `falcon-neutral-0` flips to `#1a1a2e` and the gradient becomes dark.

## Density support
None. Popup has fixed dimensions:
- `max-w-md` (28rem = 448px).
- `min-h-[18rem] max-h-[22rem]` — height clamped between 288 and 352px.
- Fixed paddings (`px-6 py-3` for header / footer, `px-6 py-5` for body).

## RTL support
- The component layout is symmetric (centered icon + title in header, centered body, right-justified footer buttons).
- Footer `justify-end` works under RTL via flex's logical alignment.
- No per-direction overrides.

## Static style risks
- ALL paint is hardcoded Tailwind utilities — no per-instance token customisation possible without source changes.
- The popup-in animation (`falconPopupIn 180ms cubic-bezier(0.22, 1, 0.36, 1)`) is inline `styles: []` in the component decorator — not driven by a motion token.

## No CSS / no SCSS guidance
- No external CSS file.
- The `styles: []` decorator entry holds the keyframe animation — acceptable scope.

## Token usage cheat-sheet

| Concern | Source |
|---|---|
| Backdrop fill (glossy) | `bg-falcon-teal-900/20 backdrop-blur-md backdrop-saturate-150` |
| Backdrop fill (flat) | `bg-falcon-neutral-900/25` |
| Panel surface (glossy) | `bg-gradient-to-b from-falcon-neutral-0/85 to-falcon-neutral-0/75 backdrop-blur-xl backdrop-saturate-150` |
| Panel surface (flat) | `bg-falcon-neutral-0` |
| Panel ring | `ring-1 ring-falcon-neutral-200` |
| Panel shadow | `shadow-2xl` (Tailwind default — NOT a Falcon shadow token) |
| Icon chip (danger) | `bg-falcon-red-50 ring-falcon-red-200 text-falcon-red-700` |
| Icon chip (warning) | `bg-falcon-amber-50 ring-falcon-amber-200 text-falcon-amber-700` |
| Icon chip (success) | `bg-falcon-green-50 ring-falcon-green-200 text-falcon-green-700` |
| Icon chip (primary) | `bg-falcon-teal-50 ring-falcon-teal-200 text-falcon-teal-700` |
| Title | `text-lg font-semibold text-falcon-neutral-900` |
| Body | `text-sm text-falcon-neutral-700` |
| Hint | `text-xs text-falcon-neutral-500` |
| Close × button | `border border-falcon-neutral-500 bg-falcon-neutral-0 text-falcon-neutral-500 hover:bg-falcon-neutral-100 hover:text-falcon-neutral-900` |
| Footer bg (glossy) | `bg-falcon-neutral-0/25` |
| Footer bg (flat) | `bg-falcon-neutral-50` |
| Footer border | `border-t border-falcon-neutral-200/60` |

## Per-instance override
**Not possible** today without source changes. The `glossy`, `iconBg`, `iconColor` inputs are the only knobs.

## Future-token recommendation
Introduce `libs/falcon-ui-tokens/src/components/popup.tokens.css` with:

```css
:where(falcon-angular-popup, .falcon-popup, [data-falcon-popup]) {
  --falcon-popup-backdrop-bg: var(--color-falcon-teal-alpha-18);
  --falcon-popup-backdrop-blur: 12px;
  --falcon-popup-panel-bg: var(--color-falcon-neutral-0);
  --falcon-popup-panel-radius: 8px;
  --falcon-popup-panel-shadow: var(--shadow-falcon-xl);
  --falcon-popup-icon-chip-size: 28px;
  --falcon-popup-icon-chip-radius: 6px;
  --falcon-popup-title-font-size: 18px;
  --falcon-popup-title-font-weight: 600;
  --falcon-popup-body-font-size: 14px;
  --falcon-popup-hint-font-size: 12px;
  /* per-intent accent tokens */
  --falcon-popup-danger-chip-bg: var(--color-falcon-red-50);
  --falcon-popup-danger-chip-ring: var(--color-falcon-red-200);
  --falcon-popup-danger-chip-color: var(--color-falcon-red-700);
  /* ...repeat for warning / success / primary */
  --falcon-popup-motion-duration: 180ms;
  --falcon-popup-motion-easing: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Then refactor the template to reference these via Tailwind arbitrary value syntax (`bg-[var(--falcon-popup-panel-bg)]`) for true per-instance override.
