# falcon-tree-panel — TOKENS

> Re-swept 2026-05-18. The component is fully Tailwind utilities bound to Falcon theme tokens — there are no SCSS files and no per-component token file.

## Token file path
- **None.** No per-component `*.tokens.css`. Styling is Tailwind utilities in the templates, resolving to Falcon theme tokens declared in `libs/falcon-theme/src/falcon-tailwind-tokens.css`.

## Tree-layout spacing tokens (consumed via Tailwind utilities)
| Token | Value | Used for |
|---|---|---|
| `--spacing-rail` | 18px | rail / chevron column width (`w-rail`) |
| `--spacing-row-h` | 36px | tree row min-height (`min-h-row-h`) |
| `--spacing-row-gap` | 6px | in-row gap (`gap-row-gap`) |
| `--spacing-row-pad-y` | 6px | row vertical pad (`py-row-pad-y`) |
| `--spacing-row-pad-x` | 10px | row inline-start pad (`ps-row-pad-x`) |
| `--spacing-row-action-inset` | 10px | **(2026-05-18)** action-column inline-end inset — shared by the root row + every client row (`pe-row-action-inset`) so all kebabs land in one X column |

## Other Falcon theme tokens consumed
- `--color-falcon-teal-*` — selection (`bg-falcon-teal-100`), hover, brand accent, on-path rails.
- `--color-falcon-neutral-*` — surfaces, borders, dividers, text.
- `--color-falcon-mint-*` — sub-node initials badge.
- `--background-image-falcon-rail-default` / `--background-image-falcon-rail-on-path` — the 1px vertical connector gradients.
- `--shadow-falcon-sticky-edge` — defined; no longer applied to the kebabs (removed when they became transparent ghost buttons 2026-05-18).
- `--duration-falcon-fast` / `--duration-falcon-base` — transition timing.

## Layout design notes (2026-05-18)
- Rows are full panel width (`w-full`); `.falcon-tree` has no horizontal padding so hover/selected backgrounds fill edge-to-edge.
- `scrollbar-gutter: stable` is set on BOTH the root row and `.falcon-tree` — reserves the same scrollbar rail so the action-column X never shifts whether or not the scrollbar shows.
- Action kebabs are transparent ghost buttons revealed on hover (`opacity-0` → `group-hover`).

## Dark mode support
- No dedicated dark rules in the component. It uses `falcon-neutral` / `falcon-teal` theme tokens, so it follows whatever those tokens resolve to under the active theme.

## Density support
- **None.** Single density (the `--spacing-row-*` tokens are global, not density-scoped here).

## RTL support
- **RTL-safe.** The templates use logical Tailwind utilities throughout — `ps-*` / `pe-*`, `ms-*` / `me-*`, `start-*` / `end-*`, and `rtl:` variants on the chevron rotation. `scrollbar-gutter` follows writing mode.

## Static style risks
- **Low.** No SCSS, no hardcoded color literals of concern; values flow from theme tokens via Tailwind. A few arbitrary pixel utilities remain (`w-[22px]`, `text-[10px]`) for icon-button geometry.

## No CSS / No SCSS guidance
- Compliant — there are no SCSS or component CSS files. Keep new visuals as Tailwind utilities bound to tokens; never reintroduce a `.scss` file.
