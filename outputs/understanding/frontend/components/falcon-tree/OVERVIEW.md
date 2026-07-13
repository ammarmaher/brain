# falcon-angular-tree — OVERVIEW

> [!important] Not the production org-hierarchy tree
> The live Organization Hierarchy left rail is `<falcon-tree-panel>` (via the `<app-organization-hierarchy-tree>` wrapper) — a **parallel** bespoke implementation that renders its own `<falcon-tree-node>` and does NOT compose `<falcon-angular-tree>`. Use `<falcon-angular-tree>` for a bare generic recursive selection tree; for org-hierarchy work see `falcon-wiki/00-MOCs/Org-Hierarchy-Tree-Component-Knowledge.md`.

## Component purpose

`[CODE]` Recursive expandable tree component with hover-path highlighting, rail SVG connectors, focus mode, programmatic select+`scrollIntoView`, an exact 18px indentation rail, and chevron expand/collapse transitions. It is the dual-render Stencil pattern (Shadow DOM `<falcon-tree>` + Light DOM `<falcon-tree-tw>` + Angular CVA wrapper `<falcon-angular-tree>`), built to mirror the V0.2 React reference `NodeRow + ClientsTree` from `admin/hierarchy.jsx:7-279` + `admin/styles.css:436-628` — the "Tier 7 locked-spec" component (`[CODE]` falcon-tree.tsx:2-11).

## Business / UI use case

- `[BRAIN-OUT]` Recursive single/multiple/none selection within a parent-child hierarchy: org-chart picker, category tree, file-explorer-style selector.
- Renders the *shape* of a hierarchy and lets the user select within it; it does NOT render per-row data columns (that is `<falcon-angular-tree-table>`) and does NOT own the org-hierarchy page chrome (that is `<falcon-tree-panel>` / `<falcon-organization-hierarchy-tree-tw>`).

## Locked spec contract (7 points)

`[CODE]` falcon-tree.tsx:4-11 + `[CODE]` tree.tokens.css:8-15:
1. Hover-path highlighting — `Set<id>` of ancestors highlighted.
2. Child indicator symbol — chevron + per-row leading marker (initials chip).
3. Rail SVG pseudo-elements — vertical through-line + horizontal elbow connectors.
4. Focus mode — distinct from hover, visible on light + dark.
5. Programmatic select — `scrollIntoView({block:'nearest'})` via `selectAndScrollTo()`.
6. Indentation rail — exact 18px gutter widths (`--falcon-tree-indent-step: 18px`).
7. Expand/collapse animation — match React reference timing.

## When to use it / when NOT to use it

**Use it for:**
- Recursive hierarchical single/multi selection (org chart, category tree, file explorer).
- The bare `<falcon-angular-tree>` when you want to assemble custom panel chrome around it.

**Do NOT use it for:**
- Flat lists with no indentation → use `<falcon-angular-data-table>`.
- Indented rows that ALSO show data columns → use `<falcon-angular-tree-table>`.
- Static menu navigation → use `<falcon-angular-menu>`.
- Org-hierarchy with per-row 3-dot menus → use `<falcon-tree-panel>` (no per-row action slot here — GAP).
- Very large trees (1000+ nodes) → not virtualized yet (GAP).
- Lazy-loaded hierarchies → no `loadChildren` hook; the whole forest must be in memory.

## Status

`[CODE]` **ACTIVE / built / not deprecated**, but **currently has NO production render consumer** (consumer sweep below). The Tier-7 locked-spec rendering is correct and dual-render parity is high; it is **NEEDS-UPGRADE** for full org-hierarchy parity (missing per-row template/action slot is exactly why `<falcon-tree-panel>` exists as a parallel implementation).

## Replaces

- PrimeNG `<p-tree>` (the Falcon cross-framework replacement).
- Native nested `<ul><li>` + `<details>` tree markup.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/falcon-tree.component.ts` (212 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/falcon-tree.component.html` (59 ln — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/falcon-tree.component.css` (5 ln — `:host { display:block; width:100% }` only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/index.ts` (re-aliases row types to `FalconTreeRow*` to avoid clash with tree-table) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.tsx` (611 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tree-tw/falcon-tree-tw.tsx` (642 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.types.ts` (54 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.utils.ts` (238 ln — pure helpers shared by both paths) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/tree-tailwind-classes.ts` (272 ln — cross-framework SSOT class builders) |
| Component token file | `libs/falcon-ui-tokens/src/components/tree.tokens.css` (231 ln; 14 categories; `:where()` scope) |
| Spec / e2e | **NONE** in `libs/falcon-ui-core/src/components/falcon-tree*/`. (A separate host-shell e2e exists: `apps/host-shell/tests/tree-rail-highlight.spec.ts` — targets `falcon-tree-panel`, not this component.) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-tree` |
| Stencil Shadow tag | `<falcon-tree>` (rendered when `useTailwind=false`) |
| Stencil Light tag | `<falcon-tree-tw>` (rendered when `useTailwind=true`, the default) |

## Known consumers (grep verified 2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-tree[\s>]` across the whole repo (excluding `dist/`) returned **0 render consumers**. The only matches are non-render references:
- `libs/falcon-ui-core/src/angular-wrapper/index.ts:121` — barrel re-export comment.
- `libs/falcon-ui-core/src/types/tree.types.ts:5` — type doc-comment.
- (`wallet-balance-management.component.ts` matches are for the SIBLING `<falcon-angular-tree-table>`, not this component.)

**The prior dossier's `apps/host-shell/src/app/playground/playground.page.html` consumer is STALE** — the `playground/` route folder no longer exists on disk (`[CODE]` glob returned nothing). See `USAGE.md` Consumer Sweep.

## Related components

- `<falcon-tree-panel>` — bespoke org-hierarchy shell with chrome + root row + recursive `<falcon-tree-node>` + per-row 3-dot menus. **PARALLEL implementation, not a wrapper around `<falcon-tree>`** (`[CODE]` falcon-tree-panel.component.html:1 renders `<falcon-tree-node>`). Convergence is the long-term target.
- `<falcon-angular-tree-table>` — tabular cousin: recursive rows PLUS aligned data columns (own `FalconTreeNode` shape — hence the wrapper barrel re-aliases this component's row type to `FalconTreeRowNode`).
- `<falcon-organization-hierarchy-tree-tw>` — bespoke Light-DOM org-hierarchy tree (separate component family).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework Stencil + Angular wrapper). Owned by the Falcon UI team. Token contract lives in `libs/falcon-ui-tokens/src/components/tree.tokens.css` (14 categories). The 7 locked-spec points are non-negotiable visual contracts against the React V0.2 reference — do not refactor without updating the reference.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 sweep). Source-file table re-confirmed on disk (wrapper 212 ln / Shadow 611 ln / `-tw` 642 ln / utils 238 ln / tokens 231 ln). Consumer count corrected to **0 render consumers** — the prior `playground.page.html` claim is stale (folder removed). `<falcon-tree-panel>` parallel-implementation relationship re-confirmed against `falcon-tree-panel.component.html:1`.
