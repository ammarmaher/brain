# falcon-angular-tree — GAPS AND UPGRADES

> This is where the B09 AUDIT findings for `<falcon-angular-tree>` live in prose. We document — we do NOT fix this pass.

## Missing capabilities (active source verified)

### G1 — (P0) Parallel implementation in `<falcon-tree-panel>`
- **Gap:** `[CODE]` `<falcon-tree-panel>` (legacy bespoke under `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`) renders its own `<falcon-tree-node>` recursive component (`falcon-tree-panel.component.html:1`) — NOT `<falcon-angular-tree>`. Two separate code paths for the same visual contract (hover-path, rails, expand/collapse, focus mode).
- **Why it matters:** drift risk between the two implementations; and the org-hierarchy use case requires per-row 3-dot menus — which is exactly why `<falcon-tree-panel>` reinvented the whole thing (it needs the per-row action slot this component lacks — G2/G3).
- **Recommended fix:** refactor `<falcon-tree-panel>` to internally compose `<falcon-angular-tree>` + the chrome + 3-dot menus once G2/G3 land. Big wave; high-risk (changes the live org-hierarchy rail). HIGH-RISK-QUEUE.

### G2 — (P0) No row template / per-node custom rendering
- **Gap:** `[CODE]` falcon-tree.tsx:484-540 — the row structure is fixed (rails + chevron + multi-check + initials chip + icon + label + badge). No `ng-template`/slot to add custom decoration. The bare `<ng-content>` in the wrapper template has no mount point in the Stencil components.
- **Recommended fix:** add `<slot name="row-{id}">` per row OR an Angular `*falconTreeNode` directive providing a `TemplateRef` per node.

### G3 — (P0) No per-row action slot for a 3-dot menu trigger
- **Gap:** related to G2. Even without a full row template, a fixed trailing-edge "action slot" would cover the most common need (the org-hierarchy 3-dot menu).
- **Recommended fix:** add `<slot name="actions-{id}">` rendered absolutely at the row trailing edge, `pointer-events:auto` on row hover.

### G4 — (P1) No virtualization for large trees
- **Gap:** `[CODE]` falcon-tree.tsx:560/590 — `flattenTree(visibleNodes, effectiveExpanded)` builds an array of every visible row and `rows.map((_, idx) => renderRow(...))` renders all of them → O(n) DOM nodes. 1000+ nodes is a performance cliff.
- **Recommended fix:** integrate `@angular/cdk/scrolling` virtual-scroll OR Stencil-native windowing.

### G5 — (P1) No lazy children loader
- **Gap:** `[CODE]` `nodes` is the full forest in memory; no hook to fetch children on expand.
- **Recommended fix:** add `loadChildren?: (parentId) => Promise<FalconTreeNode[]>` Input + a spinner on the expanding parent.

### G6 — (P1) No drag-and-drop reordering
- **Gap:** users cannot drag a node to a new parent.
- **Recommended fix:** add `enableDragDrop?: boolean` Input + `(falcon-drop)` Output with `{ dragId, newParentId, newIndex }`.

### G7 — (P1) No "select all descendants" in multi mode
- **Gap:** `[CODE]` falcon-tree.tsx:184-194 — multi mode toggles ONLY the clicked node (`toggleInArray`); no cascade to children.
- **Recommended fix:** add `selectMode?: 'self-only' | 'cascading'` Input.

### G8 — (P2) Initials indicator always rendered + duplicates `node.icon`
- **Gap:** `[CODE]` falcon-tree.tsx:528-533 — every row renders the 2-letter initials chip, AND when `node.icon` is set the icon `<span>` renders ALONGSIDE the chip (both show). Visually heavy for deep trees; inconsistent.
- **Recommended fix:** add `showInitials?: boolean`; treat `node.icon` as a replacement for the chip when present.

### G9 — (P2) Search is case-insensitive substring only (CONFIRMED)
- **Gap:** `[CODE]` falcon-tree.utils.ts:173/185 — `filterTreeBySearch()` does `query.trim().toLowerCase()` + `n.label.toLowerCase().includes(q)`. Single-field, no fuzzy/regex/multi-field. (The prior dossier's "audit to confirm" — now CONFIRMED.)
- **Recommended fix:** expose a `searchPredicate?: (node, query) => boolean` Input.

### G10 — (P3) No "expand-all" keyboard chord
- **Gap:** `[CODE]` falcon-tree.tsx:262-323 — the keyboard handler covers Arrow/Home/End/Enter/Space but NOT `*` (the conventional "expand all" tree shortcut).
- **Recommended fix:** map `*` → `expandAll()`.

### G11 — (P3) `hoverPath` excludes the hovered node itself
- **Gap:** `[CODE]` falcon-tree.utils.ts:76-98 — `buildAncestorPath()` returns root→leaf INCLUDING the node, but the hover handler emits the precomputed `path` (the flat-row `path`, which includes self). NOTE: re-reading the code, `path` in `FlatTreeRow` DOES include the node's own id (`[...parentPath, node.id]`, utils:36), so the hovered node IS in `ancestorPath`. The prior dossier's "excludes self" claim is **CORRECTED → it includes self.** Documented for clarity; no action.

### G12 — (P2) Multi-check uses raw theme tokens, not component tokens
- **Gap:** `[CODE]` tree-tailwind-classes.ts:229-230 — `falconTreeMultiCheckClasses()` reaches for `--color-falcon-teal-500` / `--color-falcon-neutral-0` directly instead of dedicated `--falcon-tree-multi-check-*` tokens. The multi-check has no component-scoped tokens at all. Minor SSOT/naming inconsistency; per-instance theming of the multi-check is impossible without overriding the global teal.
- **Recommended fix:** mint `--falcon-tree-multi-check-{bg,bg-checked,border,check-color}` tokens. `safe-local`.

## Missing accessibility features

- **A1 (P1):** `[CODE]` falcon-tree.tsx:375-401 — chevron `<button>` has no `aria-controls` pointing to the subtree container. Fix: add `aria-controls={subtreeId}`.
- **A2 (P2):** the per-row multi-check `<span>` is `aria-hidden` and the row carries `aria-selected`, but there is no `role` exposing per-row toggle-ability to AT (no `aria-multiselectable` is enough for the container, but a checkbox affordance per row would be clearer).
- **A3 (P2):** `[CODE]` chevron `aria-label` is hardcoded English `'Collapse'`/`'Expand'` (falcon-tree.tsx:379) — no i18n hook. Same for the `"No matches"` empty text (falcon-tree.tsx:587).

## Missing tests

- `[CODE]` **NO `.spec.ts` / `.e2e.ts`** for `falcon-tree`, `falcon-tree-tw`, or the Angular wrapper exist under `libs/falcon-ui-core/src/components/falcon-tree*/`. The only tree-related spec is `apps/host-shell/tests/tree-rail-highlight.spec.ts`, which targets `<falcon-tree-panel>` (the parallel implementation), NOT this component. GAPs: (a) Stencil `newSpecPage` coverage for flatten/expand/select/keyboard/ARIA on BOTH tags; (b) an Angular wrapper spec for single-mode CVA `writeValue`/`onChange`/`onTouched` + the 5 `@Method` delegations. `safe-local`.

## Missing Tailwind / token parity

- `[CODE]` 14-category contract documented in `tree.tokens.css`; the Tailwind helper `tree-tailwind-classes.ts` references each EXCEPT the multi-check (G12) — that one element reaches for raw theme tokens. Otherwise **parity OK at the token level**; the companion `<style>` rail geometry reads the same tokens as the Shadow CSS.

## Dual-render parity (B09)

`[CODE]` Shadow `falcon-tree.tsx` (611 ln) and Light `falcon-tree-tw.tsx` (642 ln) are **1:1 in props, events, methods, keyboard nav, and ARIA.** Differences are render-mechanism only:
- Shadow uses class-name strings + `falcon-tree.css`; `-tw` uses the Tailwind helper + the companion `<style>` block.
- `-tw` adds `data-tree-row="true"` on each row (Shadow relies on `role="treeitem"`); the row-click chevron guard targets `[data-tree-chevron="true"]` in `-tw` vs `.falcon-tree-chevron` in Shadow (functionally equivalent).
- Shadow's `@Watch('selectedValue')` queries `this.host.shadowRoot`; `-tw` queries `this.host` (Light DOM). Both scroll identically.
- **No prop/event/slot divergence.** This is a model dual-render pair.

## Performance risks

- **High:** unvirtualized DOM for 1000+ nodes (G4).
- `flattenTree` runs every render; could be memoized off `nodes` + `expandedIds` + `searchQuery`.

## Visual / interaction risks

- `[CODE]` The hover-path `Set` is cleared on `mouseLeave` (falcon-tree.tsx:245-250) — rapid row-to-row movement can flicker the path empty↔full.
- `[CODE]` Programmatic scroll is `requestAnimationFrame`-deferred (falcon-tree.tsx:136) — the caller cannot await its visible completion.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G2/G3 | Per-row template + action slot | P0 | HIGH-RISK-QUEUE (public API + render) |
| G1 | Converge `<falcon-tree-panel>` onto this component | P0 | HIGH-RISK-QUEUE (live org rail) |
| G4 | Virtualization | P1 | safe-local (additive opt-in) |
| G5 | Lazy children loader | P1 | safe-local (additive opt-in) |
| G6 | Drag-and-drop | P1 | safe-local (additive opt-in) |
| G7 | Cascading multi-select | P1 | safe-local (additive opt-in) |
| A1 | chevron `aria-controls` | P1 | HIGH-RISK-QUEUE (a11y semantics) |
| A3 | i18n chevron label + empty text | P2 | safe-local |
| G12 | Multi-check component tokens | P2 | safe-local |
| spec | Add Stencil + wrapper specs | P2 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the **shared Falcon component**, not per-page. G2/G3 are the keystone — their absence is the documented reason the parallel `<falcon-tree-panel>` exists. Hand-rolling another tree per page would compound the duplication.

## Workarounds (if upgrade blocked)

- For G1: use the existing `<falcon-tree-panel>` for org-hierarchy with 3-dot menus today; use `<falcon-angular-tree>` directly for plain selection trees.
- For G2/G3: wrap `<falcon-angular-tree>` and overlay a custom absolutely-positioned action layer (hacky).
- For G4: truncate the tree client-side and load-more on scroll (manual).

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** (`apps/host-shell/src/app/playground/playground.page.html`). No new structural gaps beyond those listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B09)

**Consumer count: 0 render consumers** (`[CODE]` grep `<falcon-angular-tree[\s>]` → barrel/doc-comment matches only). The prior Wave 7 playground consumer was **removed** (folder absent on disk).

Corrections + new findings vs prior dossier (component stays ACTIVE / NEEDS-UPGRADE — no deletion/promotion flag):
- **Consumer count corrected** 1 → **0** (playground folder gone). The component is built + exported but un-consumed.
- **G9 search confirmed** case-insensitive single-field substring (was "audit to confirm").
- **G11 corrected** — `ancestorPath` DOES include the hovered node itself (prior "excludes self" was wrong; `FlatTreeRow.path` = `[...parentPath, node.id]`).
- **NEW G12** — multi-check Tailwind classes reach for raw theme tokens (no component-scoped multi-check tokens). `safe-local`.
- **NEW** — chevron `aria-label` + `"No matches"` empty text are hardcoded English (i18n gap, A3). `safe-local`.
- **NEW** — there are NO unit/e2e specs for this component (the only tree spec targets `falcon-tree-panel`). `safe-local`.
- **Dual-render parity = excellent** (model 1:1 pair). Token file recounted 231 ln / 14 categories, gate-12 `:where()` compliant.
- All findings are `safe-local` EXCEPT the pre-existing P0 upgrades (G1/G2/G3) + A1, which are HIGH-RISK-QUEUE because they change public API / a11y semantics / the live org rail. See FINDINGS/B09.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) against all source layers. Component remains ACTIVE/NEEDS-UPGRADE. Consumer count 0 (render). G9 confirmed; G11 corrected; G12 + i18n + missing-specs added. No deletion/promotion flag.
