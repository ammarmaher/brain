# Light Learning — CommChannels & Services Shadow Row Notch Alignment

**learningId:** LE-20260515-commchannels-shadow-row-notch-alignment
**Status:** RESOLVED (fix landed Wave 20)
**Date:** 2026-05-15
**Page:** Organization Hierarchy
**Section:** CommChannels & Services (also Apps & Services — shared `applications-table` component)
**Component:** falcon-data-table (Wave 19 shadow row feature; Wave 20 notch alignment fix)

## Classification
- UI/UX
- Falcon Data Table behavior
- Dynamic table row editing
- Column alignment rule

## What was wrong

The shadow row's green band, edit form, and Cancel/Save buttons all rendered, but the column-targeted notch (arrow at the top edge pointing at the target column) was invisible. User annotation on the screenshot read "Notch not found".

## Root cause

The arrow span used Tailwind classes `top-0 -translate-y-full` on a `w-0 h-0` zero-sized box. Tailwind's percentage `translate-y-full` is calculated relative to the element's own CSS height — `h-0` makes that height 0, so `translate-y-full = 0`. The triangle therefore did NOT shift upward at all.

The triangle stayed at `top: 0` of the shadow `<td>` with the visible bottom-border of the CSS triangle extending DOWN INTO the green band. The triangle's fill colour (`--falcon-data-table-shadow-arrow-color`) defaults to the row background (`--falcon-data-table-shadow-row-bg`) — a green triangle on a green band = invisible.

Secondary contributors:
1. JSX inline-style `style={{ left: '0px' }}` on the arrow span was reset to `0px` on every Stencil render, fighting the DOM mutation by `updateShadowArrowPositions`. First-paint flash at `left: 0`.
2. No `window.resize` listener — arrow drifted if the user resized the viewport.
3. No z-index — arrow could sit behind the parent row's bottom border on some browsers.
4. Silent failure when `targetColumn` didn't resolve — arrow stayed at the stale position.

## What the rule is going forward (promoted to UI_UX_RULES.md)

The notch alignment is **library-owned**. Consumers pass `ShadowRow.targetColumn = '<columnField>'` — the library computes the x-position and renders the triangle centred above the target column's header. Consumers MUST NEVER hardcode the notch position or render their own indicator in a page-level layout.

The notch positioning logic ALSO uses an explicit negative `top` equal to the arrow size: `top: calc(-1 * var(--falcon-data-table-shadow-arrow-size))`. Tailwind's `translate-y-full` is forbidden in any context where the element has `h-0` (or any CSS-zero height) — use explicit pixel/calc offsets instead.

## Files changed (Wave 20 fix)

| File | Change |
|---|---|
| `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` | `falconTableShadowArrowClasses()`: replaced `top-0 -translate-y-full` with `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]`; added `z-[var(--falcon-data-table-shadow-arrow-z,1)]` |
| `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` | (1) Removed `style={{ left: '0px' }}` from arrow `<span>` JSX; (2) added `requestAnimationFrame`-coalesced `scheduleShadowArrowUpdate`; (3) added `window.resize` listener with matching cleanup in `disconnectedCallback`; (4) `updateShadowArrowPositions` now sets `arrow.style.display = 'none'` on unresolved `targetColumn` and `arrow.style.display = ''` + `data-shadow-arrow-ready=""` after a successful position |
| `libs/falcon-ui-tokens/src/components/data-table.tokens.css` | Added `--falcon-data-table-shadow-arrow-z: 2` token |

## Links

- **Page:** organization-hierarchy
- **Tab:** CommChannels & Services
- **Component:** falcon-data-table
- **API surface added:** Shadow rows (see `Brain Outputs/understanding/frontend/components/falcon-data-table/API.md` § Shadow rows)
- **Evidence:** `Brain Outputs/evidence/org-hierarchy/2026-05-15-commchannels-notch-missing/SCREENSHOT_NOTES.md` (EVIDENCE_INDEX.md entry: EV-20260515-commchannels-notch-missing)
- **Gap:** GAP-COMMCHANNELS-NOTCH-001 (resolved)
- **Closed lib gaps:** FDT-SHADOW-NOTCH-01 through 06
- **Open follow-ups:** FDT-SHADOW-FU-01 through 08

## Cross-links to component docs

- API: `Brain Outputs/understanding/frontend/components/falcon-data-table/API.md` § "Shadow rows — column-targeted inline detail rows (Wave 20, 2026-05-15)"
- USAGE: `Brain Outputs/understanding/frontend/components/falcon-data-table/USAGE.md` § "Multi-shadow editable rows (Wave 20, 2026-05-15)"
- TOKENS: `Brain Outputs/understanding/frontend/components/falcon-data-table/TOKENS.md` § "Shadow row tokens (Wave 20, 2026-05-15)"
- GAPS: `Brain Outputs/understanding/frontend/components/falcon-data-table/GAPS_AND_UPGRADES.md` § "Closed in Wave 20"
- DECISION: `Brain Outputs/understanding/frontend/components/falcon-data-table/DECISION.md` § "Wave 20 (2026-05-15) — Shadow rows: ng-template + Strategy E"
