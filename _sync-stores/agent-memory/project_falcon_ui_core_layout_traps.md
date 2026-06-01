---
name: Falcon UI Core layout traps
description: Recurring layout bugs in Falcon UI Core Stencil components and their canonical fixes — host display, empty-state min-height, popup-anchor line-boxes, doubled borders
type: project
originSessionId: d13d136a-036b-4212-8a55-b03d825530d6
---
# Falcon UI Core — Layout traps & canonical fixes

Lessons extracted from the falcon-table footer-gap investigation (Org Hierarchy page, 2026-05-15). Every fact below is a real, observed bug in `libs/falcon-ui-core/`. Apply these BEFORE inventing new diagnoses on similar gap/spacing reports.

## 1. Stencil `shadow: false` host defaults to `display: inline` — block-content children produce an empty post-block line-box

**Trap.** A Stencil component declared `@Component({ tag: 'foo', shadow: false })` with **no `styleUrl`** has its host element default to `display: inline` (browser default for unknown elements). When the host wraps block content (table, div, flex column), CSS inline-splitting generates an **anonymous post-block line-box** of inherited `line-height` (Tailwind v4 preflight = `1.5` × 16px = **~24px**) BELOW the block content but still INSIDE the host. DevTools fingerprint: the host's bounding rect is `<width> × ~1-2px` (just the closing inline baseline).

**Confirmed cases (fixed 2026-05-15):**
- `<falcon-table-tw>` — `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx`
- `<falcon-empty-data-tw>` — `libs/falcon-ui-core/src/components/falcon-empty-data-tw/falcon-empty-data-tw.tsx`

**Canonical fix.**
1. Create `<component>.css` next to the `.tsx` with `:host { display: block; }`.
2. Add `styleUrl: '<component>.css'` to the `@Component` decorator.
3. **CSS comments MUST be `/* ... */` wrapped.** Falcon banner-style `*** … ***` is NOT valid CSS — PostCSS silently drops the file and the fix never lands in the bundle. Always: `/* *** … *** */`.
4. Run `nx build falcon-ui-core` — Stencil compiles `.css` into the dist bundle at build time. Source edits alone are invisible to the running app.

**Where else to audit.** Any other Stencil `*-tw.tsx` in `libs/falcon-ui-core/src/components/` declared `shadow: false` with no `styleUrl` is likely the same bug. Token `--falcon-table-display: block` at `libs/falcon-ui-tokens/src/components/table.tokens.css:28` is **dead** — no rule consumes it. Don't be fooled into thinking it works.

## 2. Empty-state cards must size to content by default — `min-h-[var(--falcon-empty-data-table-min-height)]` + `justify-center` is a slack trap

**Trap.** Wrapper at `libs/falcon-ui-core/src/tailwind/empty-data-tailwind-classes.ts` mode `table` was unconditionally `flex items-center justify-center` PLUS `min-h: 360px` (token at `libs/falcon-ui-tokens/src/components/empty-data.tokens.css:121`, commented `/* ≈ 6 rows */`). When card content is shorter than 360px (which it always is — typical card ≈ 188px), `justify-center` splits the leftover slack into **~70px above + ~70px below** the card. The bottom slack looks like a "gap" between the empty card and the next sibling.

**Canonical fix.** Drop `min-h-[…]` from the `mode === 'table'` branch — empty cards size to content by default. Consumers who genuinely want a 360px reservation opt in by setting the token on their own wrapper or via CSS — the token still exists.

**General rule.** When designing empty/loading states, default to **content-sized**. Reserve space only via explicit opt-in. Never combine `min-h` with `justify-center` without an explicit "design wants 360px" reason.

## 3. Popup menus with `[appendTo]="'body'"` must not participate in inline flow

**Trap.** `<falcon-angular-menu>` host CSS is `:host { display: inline-block }` (at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.css:2-4`). When placed between two block siblings (e.g. inside `<falcon-angular-data-table>` between table and footer) AND closed in popup mode, the host has effectively-empty content but **still generates a ~20px line-box** of inherited line-height. Visible as mysterious "20px of nothing" between siblings.

**Why it's safe to collapse.** With `[popup]="true" + [appendTo]="'body'"`, the panel portals to `<body>` on open. The in-tree element is just an anchor placeholder for the directive — it does NOT need to participate in layout. Anchor logic uses `[anchorEl]` and `showAt(anchor)`, not DOM position.

**Canonical fix (scoped — do not touch the menu component itself).** Wrap the in-tree placeholder in `<div class="h-0 overflow-visible">…</div>`. The wrapper has `height: 0`, the empty inline-block paints into the overflow zone (invisible because empty), and the following sibling sits flush against the previous block. No regression in other menu usages.

## 4. Doubled 1px borders at sibling-component boundaries

**Trap.** When a container component renders its own `border-bottom` and an immediately-following sibling component renders its own `border-top`, two 1px lines stack and a separator zone forms between them. This was visible at the `<falcon-table-tw>` container (`border-[…]` from `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts:15-25`) ↔ `<falcon-angular-custom-table-footer>` (`border-t` at template line 9).

**Canonical fix.** Drop the border on whichever component is **the more internal-only one**. `<falcon-angular-custom-table-footer>` is grep-verified internal to `<falcon-angular-data-table>` (only consumer = `falcon-data-table.component.html`), so its `border-t` was redundant. Container border stays as the single source for the table-bottom edge. Footer bg-tint (`bg-falcon-neutral-30` vs body `bg-falcon-neutral-0`) provides the visual divider.

**General rule.** Whenever you see two adjacent sibling components both contributing 1px lines at the same boundary, audit which one is internal-only — that one's the redundant border.

## How to investigate a "mysterious vertical gap" in Falcon UI Core

1. **Inspect host computed `display`** in DevTools. If a Stencil `shadow: false` component reads `inline`, that's trap #1 — there's a ~24px line-box.
2. **Inspect the empty-state wrapper** for `min-h-[var(--falcon-empty-data-…-min-height)]` paired with `justify-center`. If present, that's trap #2 — measure card content vs min-h to compute slack.
3. **Inspect any sibling that's `display: inline-block`** but has no visible content. Trap #3 — line-box from inherited line-height.
4. **Inspect adjacent component borders**. Two 1px lines = trap #4.
5. **Always verify Stencil dist is rebuilt** before declaring a fix "didn't work". Source edits to `.css` / `@Component` are invisible without `nx build falcon-ui-core`.

## Files cited (absolute paths under `C:\Falcon\falcon-web-platform-ui\`)

- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` + `.css`
- `libs/falcon-ui-core/src/components/falcon-empty-data-tw/falcon-empty-data-tw.tsx` + `.css`
- `libs/falcon-ui-core/src/tailwind/empty-data-tailwind-classes.ts:43`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:9`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.css:2-4`
- `libs/falcon-ui-tokens/src/components/empty-data.tokens.css:121`
- `libs/falcon-ui-tokens/src/components/table.tokens.css:28` (dead token `--falcon-table-display: block`)
