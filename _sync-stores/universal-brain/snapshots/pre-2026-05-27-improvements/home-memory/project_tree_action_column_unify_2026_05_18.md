---
name: Org-hierarchy tree action-column unify + hover
description: Unified root + per-node kebab X-column via full-width rows + row-action-inset token; root kebab now hover-gated
type: project
originSessionId: a8853276-9745-4ce1-8626-4531781606e3
---
Org-hierarchy tree (`falcon-tree-panel`): root ("Falcon Admin") kebab and per-node kebab were in different X columns, the node row hover/select highlight did not reach the panel edge, and the root kebab was always visible (per-node kebabs are hover-only).

**Root cause:** `.falcon-tree` (the scroll body) had horizontal padding (`ps-1 pe-row-action-inset`) plus a reserved `scrollbar-gutter`, all of which inset the client rows inside its content box. The root row spans the full `<aside>` width. So client rows (and their kebabs) were narrower/offset vs the root row.

**Fix (2026-05-18, final):**
- New token `--spacing-row-action-inset` (10px) in `falcon-tailwind-tokens.css` tree-layout group — abstraction-level name, no action name baked in. It is the inline-end inset of the action-button column.
- `.falcon-tree` has NO horizontal padding → client rows run edge-to-edge (full panel width); their hover/selected background fills the full width.
- Tree body wrapper `min-w-max` → `w-full`; `.client-row` `min-w-[100cqi]` → `w-full` (rows never grow past the panel; tree scrolls only vertically). `container-type:inline-size` removed (unused).
- `[scrollbar-gutter:stable]` on BOTH `.falcon-tree` and the root row (root row also gets `overflow-hidden` to be a scroll container). This reserves the same scrollbar rail on both, so the kebab column is fixed whether or not the vertical scrollbar shows — the scrollbar can't push node kebabs out of the root kebab's column.
- Both the root row and every `.client-row` carry `pe-row-action-inset` → root + client kebabs land in one X column.
- Both kebabs are transparent ghost buttons (`bg-transparent`, dark dots, `hover:bg-falcon-teal-100`) — the earlier white-pill (`bg-falcon-neutral-0` + `shadow-falcon-sticky-edge`) was invisible on the white root header. The white-pill / `sticky end-0` were h-scroll artifacts, removed since rows no longer scroll horizontally.
- Root kebab hover-gated (`opacity-0` + `group/tree-root` reveal); new `rootMenuOpen` signal keeps it lit while its popup is open.

**Why:** user reported misaligned action column, node highlight not full-width, and a "gone" (invisible-on-white) root kebab; wanted one fixed action column for root + all client nodes.
**How to apply:** any tree row carrying an action button uses `pe-row-action-inset` + `scrollbar-gutter:stable`. User-confirmed working in the browser 2026-05-18.
