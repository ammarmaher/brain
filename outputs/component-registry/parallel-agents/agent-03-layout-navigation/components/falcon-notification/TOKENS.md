# falcon-notification — TOKENS

## Token file
**None.** Like popup, notification has no dedicated token CSS file.

Visual values come from Falcon palette tokens accessed through Tailwind utilities in the inline template:
- `bg-falcon-neutral-0/85` / `bg-falcon-neutral-0/75` — glossy gradient endpoints.
- `border-falcon-green-500` / `-falcon-teal-500` / `-falcon-amber-500` / `-falcon-red-500` — per-intent border.
- `bg-gradient-to-b from-falcon-green-100 to-falcon-green-200 text-falcon-green-700 ring-falcon-green-200` — icon chip (when iconBg=true).
- Plus motion keyframes inline in the `styles: []` decorator entry.

## Related Falcon theme tokens

| Family | Used for |
|---|---|
| `falcon-green-{100,200,500,700}` | Success intent surface + border + chip + icon |
| `falcon-teal-{100,200,500,700}` | Info intent |
| `falcon-amber-{100,200,500,700}` | Warning intent |
| `falcon-red-{100,200,500,700}` | Error intent |
| `falcon-neutral-{0,500,600,700,900,100}` | Surface, text, dismiss button |

## Tailwind utility guidance
- The component is Tailwind-direct.
- For platform-wide changes, override the palette in the global theme.

## Dark mode support
- Neutrals invert via the global dark map.
- Intent palette colors (green/red/amber/teal) stay or have dark variants per theme.

## Density support
None — fixed `max-w-sm`, `px-3 py-2`.

## RTL support
- Stack is `right-6` — physical right. RTL pages may want left.
- Layout is symmetrical inside.

## Static style risks
- Border style is `'solid'` set inline `[style.border-style]="'solid'"`.
- Border width is computed inline `[style.border-width.px]="borderWidth()"` + `leftAccent()` / `rightAccent()`.
- Radius is inline `[style.border-radius.px]="radius()"`.

These inline styles are intentional escape hatches for the highly-tunable per-instance appearance — but they bypass any future tokenisation.

## No CSS / no SCSS guidance
- No external CSS.
- The `styles: []` decorator entry holds keyframes (`falconNotifIn`, `falconNotifCountdown`).

## Token usage cheat-sheet

| Concern | Source |
|---|---|
| Surface (glossy) | `bg-gradient-to-b from-falcon-neutral-0/85 to-falcon-neutral-0/75 backdrop-blur-xl backdrop-saturate-150` |
| Surface (flat) | `bg-falcon-neutral-0` |
| Border (success) | `border-falcon-green-500` |
| Border (info) | `border-falcon-teal-500` |
| Border (warning) | `border-falcon-amber-500` |
| Border (error) | `border-falcon-red-500` |
| Icon chip (when iconBg=true) | per-intent `bg-gradient-to-b from-X-100 to-X-200 text-X-700 ring-1 ring-X-200` |
| Icon stroke (when iconBg=false) | per-intent `text-X-700` |
| Title | `text-sm font-semibold text-falcon-neutral-900 leading-snug` |
| Subtitle | `text-xs text-falcon-neutral-600 leading-relaxed` |
| Dismiss × button | `text-falcon-neutral-500 hover:bg-falcon-neutral-100 hover:text-falcon-neutral-900` |
| Countdown bar | per-intent `bg-X-500` |
| Animation in | `falconNotifIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both` |
| Countdown animation | `falconNotifCountdown linear forwards` (duration from `dismissDuration()`) |
| Stack position | `fixed top-[4.75rem] right-6 z-40` (hardcoded — see gaps) |
| Stack width | `max-w-sm w-[calc(100%-3rem)]` |

## Per-instance override
**Not possible** today — no token file. The `borderWidth`, `leftAccent`, `rightAccent`, `radius`, `dismissDuration`, `countdownHeight`, `glossy`, `iconBg` inputs are the only customisation knobs.

## Future-token recommendation
Introduce `libs/falcon-ui-tokens/src/components/notification.tokens.css` with per-instance / per-intent tokens. Refactor the template to consume them via Tailwind arbitrary value syntax (`bg-[var(--falcon-notification-surface-bg)]`).
