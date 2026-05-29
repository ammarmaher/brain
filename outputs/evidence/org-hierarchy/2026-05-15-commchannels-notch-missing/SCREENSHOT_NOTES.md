*** Evidence Notes — Shadow Row Notch Missing ***
*** Captured 2026-05-15 in-session by user (Ammar Mk). ***

# CommChannels & Services — Shadow Row Notch Missing

**Page:** `http://localhost:4200/#/admin-console/org-hierarchy-page`
**Tab:** CommChannels & Services
**Component:** `<falcon-angular-data-table>` shadow row (Wave 19 first consumer)
**Captured:** 2026-05-15 (user-provided in-session screenshot)

## What the screenshot showed

- Parent applications-table row is selected.
- Shadow row underneath is fully rendered:
  - Green band background (token: `--falcon-data-table-shadow-row-bg`)
  - Edit form inside the shadow row (`falcon-angular-dropdown` + `falcon-angular-date-picker`)
  - Cancel / Save buttons in the trailing-action zone
- **The arrow notch at the top edge of the shadow row, which should point UP at the target column header (Price Type / Price Value), is NOT visible.**
- User annotation on the screenshot reads: "Notch not found".

## Why it was invisible (root cause confirmed Wave 20)

The arrow span used Tailwind classes `top-0 -translate-y-full` on a `w-0 h-0` element.
Tailwind's percentage `translate-y-full` is calculated against the element's own CSS height (`h-0` = 0px),
so the triangle did NOT shift upward at all. It stayed at `top: 0` of the shadow `<td>`, with the
visible bottom-border of the CSS triangle extending DOWN INTO the green band — same colour as the
band = invisible.

## Resolution

Wave 20 (2026-05-15) replaced `top-0 -translate-y-full` with `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]`.
The triangle now sits with its base AT the cell's top edge and its body extending UP into the
parent row's footer space. Also:
- Removed `style={{ left: '0px' }}` inline JSX style that was being reset on every render
- Added `requestAnimationFrame`-coalesced position updates
- Added `window.resize` listener
- Added z-index token `--falcon-data-table-shadow-arrow-z`
- Added silent suppression (display:none) when `targetColumn` doesn't resolve

## Files

- `Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — class fix
- `Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` — position logic + JSX cleanup
- `Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css` — new arrow-z token

## Cross-links

- GAP-COMMCHANNELS-NOTCH-001 (resolved Wave 20)
- Light Learning: `light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md`
- Falcon component docs: `Brain Outputs/understanding/frontend/components/falcon-data-table/`
- Closed GAPs: FDT-SHADOW-NOTCH-01 through 06
