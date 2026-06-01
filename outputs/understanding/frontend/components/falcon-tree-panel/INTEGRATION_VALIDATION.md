# falcon-tree-panel — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
The panel is **presentational** — it renders whatever `[root]` tree it is handed and owns no endpoint. The tree data it displays is owned by:
- **Commerce** — the organization hierarchy (accounts, clients, sub-nodes) is a Commerce-owned aggregate. `[MEMORY]` `project_info_panel_backend_integration_wave15` + `project_commchannels_apps_tabs_phase1` — the org-hierarchy page calls `commerce/Node/...` and `commerce/information` via the System Gateway; the tree is built from a Commerce node query.
- **Identity** — the *users* listed under a selected node (rendered by the sibling `<falcon-angular-data-table>`, not by this panel) come from Identity. `[MEMORY]` `project_pr40937_include_deleted_lift` — `user-api.service.ts` `listByNode`.

The panel itself never issues HTTP. The org-hierarchy **page state service** owns the fetch and feeds `[root]`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| organization hierarchy / node tree | `GET` | Commerce | node tree response → mapped to `FalconTreeNode<T>` | System Gateway (`useGateway()`) | `[INFERRED]` from `[MEMORY]` org-hierarchy entries — exact endpoint owned by the page state service |
| selected-node detail (Information) | `GET` `commerce/information?NodeId=` | Commerce | `GetMainNodeInfoResponse` | System Gateway | `[MEMORY]` Wave 15 — fired when `(select)` changes the node |
| `(action)` → Add Client / Node / Edit Node / Add User | wizard POST/PUT | Commerce / Identity | per-wizard create requests | System Gateway | `[BRAIN-OUT]` Brain SK playbooks — the panel only emits the action; the wizard owns the call |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The panel performs **no field validation** — it is a navigation control, not a form. |

`[CODE]` There is no `validations/validations.ts` for the panel. All V-rules belong to the wizard flows it *launches* (Add Client / Add Node / Edit Node / Add User), each of which owns its own `validations/` per the canonical component-folder doctrine. `[CODE]` `directives/directives.ts` holds `TreeHoverPathDirective` + `ScrollableTreeListDirective` — interaction directives, not validators.

## PES keys gating this component
The panel has no PES key of its own. Action availability is gated two ways:
- `[CODE]` `:48`,`:193-201` **`FalconTreeAction.visible(node)`** — the consumer's state slice filters `nodeActions` per node, typically against a `FalconAccess.*` resolution, so a node 3-dot menu only shows the actions the operator may perform on that node.
- `[CODE]` `:124`,`:128` **`showActions` / `showRootActions`** — coarse panel-level gates the consumer flips when the operator has no action rights at all.
- `[INFERRED]` The launched wizards carry their own PES gates (`[MEMORY]` Wave 14/15 — `FalconAccess.adminConsole.*`); the panel only surfaces the entry point.

## State / signal pattern
`[CODE]` The panel is a **controlled component** — signal-based but it owns no domain state:
- Inputs `root`, `expandedIds`, `selectedId` are `input()` signals owned by the consumer's **page state service** (`[MEMORY]` `hierarchy-page-state.service.ts`).
- Outputs `toggle`, `select`, `action`, `hoverPathChange` push events up; the consumer mutates its own signals.
- `[CODE]` `:143-151` internal signals: `targetNodeId` (which row's menu is open), `openMenuNodeId` (keeps the kebab lit while the popup is open), `hoveredPathIds` (hover-path mirror down to nodes).
- `[CODE]` `:188-201` `rootMenuItems` / `nodeMenuItems` are `computed` — `nodeMenuItems` rebuilds for the currently-targeted node, applying the `visible(node)` filter.
- `[CODE]` `:203-221` Two reactive bridges: an `effect()` on `selectedId` → `requestAnimationFrame` re-checks chevron overlap; a `queueMicrotask` + `fromEvent('mouseover')` + `takeUntilDestroyed` re-checks overlap on hover.
- Error pipeline: none — the panel has no async surface.

## Skeleton ↔ app-wrapper layering
This is the layering the Phase 1 brief specifically calls out — there are **three tree code paths** in the platform, and naming them precisely matters:
- `<falcon-tree-panel>` — **legacy bespoke Angular library component** in `libs/falcon/src/shared-ui/`. NOT a Stencil skeleton, NOT an Angular wrapper of one. It renders its OWN internal recursive `<falcon-tree-node>` component (`[CODE]` `:31` import). It is a self-contained library component.
- `<app-organization-hierarchy-tree>` — **the host-shell app wrapper**. `[CODE]` `USAGE.md` Wave 7 sweep — the only two consumers of `<falcon-tree-panel>` are `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.{html,ts}`. So host-shell wraps the library `<falcon-tree-panel>` inside its own `<app-organization-hierarchy-tree>` shared component, which is then projected into the org-hierarchy pages of admin-console + management-console. **The library skeleton is `<falcon-tree-panel>`; the host-shell wrapper is `<app-organization-hierarchy-tree>`.**
- `<falcon-organization-hierarchy-tree-tw>` — a **separate, parallel** Light-DOM Stencil org-hierarchy tree (its own dossier folder). Different code path again — NOT consumed by `<falcon-tree-panel>`.
- `<falcon-angular-tree>` — the Falcon UI core "bare" tree; the documented convergence target for `<falcon-tree-panel>` (`GAPS_AND_UPGRADES.md` item 1).
- `[CODE]` `:25` The panel composes `FalconAngularMenuComponent` from `@falcon/ui-core/angular` for the 3-dot popup — that one IS a proper Stencil-skeleton + Angular-wrapper pair.

## Integration gotchas
- `[CODE]` `:72` **`ViewEncapsulation.None`** — required so the host-class scrollbar utilities + menu `rootClass` utilities reach the externally-rendered popup. Every CSS rule the panel emits MUST be prefixed `.falcon-tree-panel` / `.falcon-tree-panel-menu` or it leaks globally.
- `[CODE]` `:73-90` **`h-full min-h-0` on the host is load-bearing** — without it the inner `<aside h-full>` resolves against a `height:auto` host, creating a circular height dependency so `overflow-auto` never triggers and rows render past the viewport. A builder removing those host classes breaks scrolling.
- `[CODE]` `:316-377` **`scrollLeft`-based auto-scroll is RTL-fragile** — `computeOverlapDelta` + `scrollTo({left})` assume LTR; `scrollLeft` is browser-inconsistent in RTL (`TOKENS.md` RTL note). Verify in Arabic.
- `[CODE]` `:345-366` **Menu panel re-clamp** — Stencil's `positionPanel()` reads `offsetHeight` on the first RAF, which is 0 for a just-mounted panel, so the flip-up branch never fires for bottom-of-screen rows. The panel works around this with a two-RAF `clampMenuPanelInViewport`. A builder must not "simplify" this away.
- `[CODE]` `:303-312` `findNode` is recursive O(n) and re-walks the full tree on every per-row menu open — fine for normal trees, a hotspot for very large ones (`GAPS_AND_UPGRADES.md` item 11).
- `[CODE]` `:99-101` The panel does NOT mutate `[root].children` — pass a fresh tree on every change; mutating in place will not re-render predictably.

## Verification
🟡 CODE-DERIVED from `falcon-tree-panel.component.ts` + `models/models.ts` (full source) + the 6 existing dossier files + `[MEMORY]` org-hierarchy Wave 14/15/Phase-1 entries. The skeleton↔wrapper layering (`<falcon-tree-panel>` library → `<app-organization-hierarchy-tree>` host-shell wrapper) is ✅ VERIFIED from the `USAGE.md` Wave 7 consumer sweep. Exact tree-fetch endpoint is `[INFERRED]` — owned by the page state service, not the panel.
