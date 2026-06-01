---
name: Tailwind CSS Grid is the default layout primitive for Falcon frontend
description: Use Tailwind's grid utilities for page/section/form/list layouts by default; flexbox only for small inline alignment
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** In the Falcon frontend (v2+), Tailwind CSS **Grid** is the default layout primitive. Flexbox is reserved for small inline alignment tasks (button icon + label, form label + input, breadcrumb chips). Every page shell, section container, form, card list, data panel layout uses `grid` + `grid-cols-*` + `gap-*` — not `flex`.

**Why:** The user explicitly confirmed on 2026-04-18 that Tailwind should be used as a grid view first. Grid gives: predictable two-dimensional layouts, better responsive control via `grid-cols-{breakpoint}`, no `flex-wrap` gymnastics, easier to reason about at scale. Also aligns with the move toward design-token–driven spacing scales.

**How to apply:**
- **Shell layout:** CSS Grid with named template areas — e.g., `grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] [grid-template-areas:'sidebar_header''sidebar_main''sidebar_footer']`. Header/sidebar/main/footer placed via `col-start`/`row-start`/`[grid-area:*]`.
- **Page-level container primitive** in `libs/theme` or `libs/layout`: a `FalconPageGrid` component exposing `cols`, `gap`, `rows` inputs that emit the right Tailwind classes. All feature pages use this instead of raw divs.
- **Form layout:** `grid grid-cols-12 gap-4` with fields spanning columns (`col-span-6` half-width, `col-span-12` full-width). No flex-based form layouts.
- **Card / list grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` — responsive by default. Empty-state/loading-state sit inside the grid (`col-span-full`) not outside it.
- **Data tables:** still PrimeNG `<p-table>` internally (tables are tables), but the container holding filters + table + pagination uses grid.
- **Flexbox is OK for:** inside a single row, icon + label inside a button, two items in a tight inline flow (e.g. `<span class="flex items-center gap-2"><icon/><label/></span>`). Everything larger should be grid.
- **Spacing:** always use token-scaled gaps (`gap-2`, `gap-4`, `gap-6`, `gap-8`) — never arbitrary pixel gaps.
- **No hardcoded widths/heights** for layout cells — let grid `fr` and `minmax()` do the work.
- **Named grid primitives** to create in `libs/ui` or `libs/layout`: `FalconPageGrid`, `FalconFormGrid`, `FalconCardGrid`, `FalconSplitLayout` (sidebar+content), `FalconStackGrid` (vertical rhythm).
- **Storybook rule:** every new primitive has a grid-based layout story showing it in context, not floating on a flex center.
