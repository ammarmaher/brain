---
type: knowledge
status: authored
verified-at: 2026-05-18
authored-by: session 2026-05-18 (org-hierarchy tree enhancements)
tags: [knowledge, layer/frontend, scope/org-hierarchy, component/falcon-tree-panel]
related:
  - "[[30-Components/falcon-tree-panel]]"
  - "[[20-Pages/Organization-Hierarchy]]"
  - "[[35-Libraries/Falcon-UI-Core]]"
---

> [!tldr]
> Hand-authored knowledge note for the **Organization Hierarchy tree** — the left-rail tree on the Org Hierarchy pages. Covers the 2-layer architecture, the full caller-configurable input API, the layout/action-column design, and the wizard-lock pattern. Authored 2026-05-18 after the action-column + configuration-inputs work. Unlike `[[30-Components/falcon-tree-panel]]` (an auto-projection), this note is maintained by hand.

# Organization Hierarchy Tree — Component Knowledge

> [!important] Which tree component is this?
> Falcon has **four** tree-shaped components and it is easy to grab the wrong one. The production org-hierarchy tree is **`<falcon-tree-panel>`** (consumed via the `<app-organization-hierarchy-tree>` wrapper). It is **not** `<falcon-angular-tree>` and **not** `<falcon-organization-hierarchy-tree-tw>` (a same-named look-alike that is **not** used in production). Full breakdown in §11 below.

## 1. What it is

The tree shown in the left rail of the Organization Hierarchy page (admin-console and management-console). It renders the Falcon root, the "Falcon Clients" section, the client nodes, and their sub-nodes, with per-row + root 3-dot action menus.

## 2. Architecture — two layers

The tree follows the Falcon rule **"Library = Skeleton, App = API"**:

| Layer | Component | Path | Responsibility |
|---|---|---|---|
| **Skeleton** | `<falcon-tree-panel>` (+ internal `<falcon-tree-node>`) | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/` | Pure presentational. Renders chrome + rows + menus. No service injection, no data fetch. Consumer owns `expandedIds` / `selectedId`. |
| **App wrapper** | `<app-organization-hierarchy-tree>` | `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/` | Owns PES gating, internal tree fetch (`GET commerce/Node`), lazy children, user-fetch trigger. Maps a high-level `mode` to skeleton inputs. Passes config inputs through. |

- **Admin-console and management-console consume the WRAPPER**, never the skeleton directly — via `org-hierarchy-page-menu` (`apps/admin-console/src/app/features/org-hierarchy-page/components/`).
- The skeleton is also usable standalone (e.g. playground) when the caller wants to own the data.

## 3. How it renders

`falcon-tree-panel.component.html` lays out, top to bottom:

1. **Root row** — fixed band. `mode='falcon'` → Falcon brand SVG + "Falcon" label; `mode='client'` → `root.imageUrl` (initials-chip fallback) + `root.name`.
2. **"Falcon Clients" section label** — i18n `clientsLabelKey`; empty string hides it.
3. **`.falcon-tree`** — the only vertical scroll region; recursively renders `<falcon-tree-node>` rows.
4. **Popup menus** — root + per-node `<falcon-angular-menu>`, rendered at the tail of `<aside>`, anchored via `showAt()`.

## 4. Input / output API (caller-configurable)

All inputs are Angular signal `input()`s with defaults — individual inputs (not a config object) for discoverability + independent override.

### Skeleton `<falcon-tree-panel>` inputs

| Input | Default | Effect |
|---|---|---|
| `root`, `expandedIds`, `selectedId`, `trackBy` | — | Data + selection/expansion state (consumer-owned). |
| `mode` | `'falcon'` | `'falcon'` = branded root; `'client'` = root rendered as a client. |
| `clientsLabelKey` | `'falconTree.clientsLabel'` | i18n key for the section label; **empty string hides it**. |
| `rootActions` / `nodeActions` | `[]` | Declarative `FalconTreeAction[]` for the 3-dot menus. |
| `showArrows` | `true` | `false` hides all chevrons. |
| `showActions` | `true` | `false` hides every per-row 3-dot. |
| `showRootActions` | `true` | `false` hides only the root 3-dot. |
| `showSubNodes` | `true` | `false` = clients-only (depth-0 rows, no chevrons). |
| `rootSelectable` | `true` | **(new 2026-05-18)** `false` → root not clickable (no `select`, no pointer/hover). |
| `nodesSelectable` | `true` | **(new 2026-05-18)** `false` → client rows not clickable (no `select`, no pointer/hover). Chevron + 3-dot still work. |

Outputs: `toggle`, `select`, `action` (single stream, `nodeId===null` for root), `hoverPathChange`.

### Wrapper `<app-organization-hierarchy-tree>`

Pass-through inputs: `mode` (`'falcon-clients' | 'falcon-full' | 'client'`), `showActions`, `showRootActions`, `showArrows`, `rootSelectable`, `nodesSelectable`, `clientsLabelKey`, `refreshTick`, `selectedIdInput`. Outputs: `treeReady`, `treeChange`, `nodeSelect`, `toggle`, `actionInvoke`, `nodeIdReady`. The wrapper **auto-hides** the clients label when `mode='client'` (`effectiveClientsLabelKey` computed).

## 5. Layout & action-column design (2026-05-18)

- **Token** `--spacing-row-action-inset` (10px, in `falcon-tailwind-tokens.css`) — the single source for the action-button column inset. Used by the root row and every client row (`pe-row-action-inset`).
- **Rows are full panel width** — `.falcon-tree` has no horizontal padding; the root row and `.client-row` are `w-full`. Hover/selected backgrounds fill edge-to-edge.
- **`scrollbar-gutter: stable`** on both the root row and `.falcon-tree` — reserves an identical scrollbar rail so the kebab column never shifts whether or not the vertical scrollbar shows.
- **Kebabs are transparent ghost buttons**, hover-revealed (`opacity-0` → `group-hover`), revealed also on selection / while the popup is open. Root + per-node kebabs are visually identical and in one X column.

## 6. Caller-driven locking — the wizard-lock pattern

The tree is dumb; the **caller** flips inputs to lock it. In admin-console `org-hierarchy-page-menu`:

```ts
treeNavigable      = computed(() => !state.addClientOpen());
treeActionsVisible = computed(() => !state.addClientOpen() && !state.addUserOpen());
```

Bindings: `[nodesSelectable]` + `[showArrows]` ← `treeNavigable()`; `[showActions]` + `[showRootActions]` ← `treeActionsVisible()`.

| Tree input | Add Client open | Add User open | Neither |
|---|---|---|---|
| `nodesSelectable` | **false** | true | true |
| `showArrows` | **false** | true | true |
| `showActions` | **false** | **false** | true |
| `showRootActions` | **false** | **false** | true |
| `rootSelectable` | true | true | true |

- **Add Client → full lock:** nodes not clickable, chevrons hidden, all 3-dot menus hidden. Root row stays clickable.
- **Add User → actions-only lock:** 3-dot menus hidden; nodes stay clickable + expandable.
- Both revert automatically on wizard close — pure reactive `computed`.

## 7. What CAN be done (by the caller)

- Render the root as Falcon brand OR as a client (`mode`).
- Hide the "Falcon Clients" label (`clientsLabelKey=''`; auto in client mode via the wrapper).
- Hide chevrons (`showArrows`), per-row actions (`showActions`), root action (`showRootActions`), sub-nodes (`showSubNodes`).
- Make the root and/or client rows non-clickable (`rootSelectable`, `nodesSelectable`).
- Drive selection/expansion externally; supply declarative action menus.
- Compose any locked/read-only state by binding inputs to a `computed` off the caller's own flags (the wizard-lock pattern).

## 8. What CANNOT be done (today)

- No input to hide the **root row** entirely (would need a new `showRoot` input).
- No multi-select — `selectedId` is single-selection.
- Per-node disable of *only* the chevron or *only* selection is global, not per-node (per-node filtering exists only for `nodeActions` via `FalconTreeAction.visible(node)`).
- The skeleton has no service injection / no data fetch — that is the wrapper's job.

## 9. Session changelog — 2026-05-18

1. **Action-column unified** — `--spacing-row-action-inset` token; full-width rows; mirrored `scrollbar-gutter:stable` → root + client kebabs in one fixed X column.
2. **Kebabs** — transparent ghost buttons, hover-revealed (root kebab was previously always-on and white-on-white invisible).
3. **New config inputs** — `rootSelectable`, `nodesSelectable` on skeleton + wrapper; `showArrows` exposed on the wrapper; clients-label auto-hide in client mode.
4. **Wizard locks wired** in admin-console — `treeNavigable` / `treeActionsVisible` computeds → Add Client full lock, Add User actions-only lock.

## 10. Related

- [[30-Components/falcon-tree-panel]] — auto-projection of the canonical dossier.
- [[20-Pages/Organization-Hierarchy]] — the page that hosts this tree.
- Canonical dossier: `Brain Outputs/understanding/frontend/components/falcon-tree-panel/`.
- Memory: `project_tree_config_inputs_2026_05_18`, `project_tree_action_column_unify_2026_05_18`.

## 11. Tree component landscape — disambiguation

Falcon has **four** distinct tree-shaped components. Pick by this table:

| Component | What it is | Use it for | Production org-hierarchy? |
|---|---|---|---|
| **`<falcon-tree-panel>`** | Bespoke Angular tree — chrome + root row + per-row/root 3-dot menus + hover-path. Renders its OWN internal `<falcon-tree-node>`. | The org-hierarchy left rail, via the `<app-organization-hierarchy-tree>` wrapper. | ✅ **YES — this is the one.** |
| `<falcon-angular-tree>` | Angular wrapper of the Stencil `<falcon-tree>` / `<falcon-tree-tw>`. Generic bare recursive tree ("Tier 7 locked-spec"). | A bare tree when you build your own chrome around it. | ❌ No — a **parallel** implementation; `falcon-tree-panel` does NOT compose it. |
| `<falcon-angular-tree-table>` | Recursive tree with tabular data columns. | Hierarchical data that needs columns. | ❌ No. |
| `<falcon-organization-hierarchy-tree-tw>` | Stencil Light-DOM org-hierarchy panel — a visual look-alike. | Nothing in production — grep finds **no** production org-hierarchy consumers (playground/showcase only). | ❌ **No — name trap.** Do not assume this is the live tree. |

**Rule:** for anything touching the live Organization Hierarchy page, the component is `<falcon-tree-panel>` behind the `<app-organization-hierarchy-tree>` wrapper. The other three are different code paths — choosing one of them for org-hierarchy work is a mistake.
