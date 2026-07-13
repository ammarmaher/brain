# falcon-tree-panel — DECISION

> Re-swept 2026-05-18; **re-verified 2026-06-03 (B24)** — status unchanged. Note the cross-dossier corrections this pass (API type `readonly number[]`; single shared `#actionMenu`; no SCSS) do not change the recommendation.

## Status
- **ACTIVE production component.** Bespoke Angular (standalone, signal inputs, `OnPush`, `ViewEncapsulation.None`). Fully Tailwind — the SCSS→Tailwind conversion is **done** (no `.scss` files remain).
- It is THE org-hierarchy tree, consumed through the `<app-organization-hierarchy-tree>` host-shell wrapper. Actively enhanced (action-column unification + configuration inputs landed 2026-05-18).
- A separate `<falcon-angular-tree>` exists as a bare-tree alternative. A convergence of the two was once proposed; it is **not** a verified-active roadmap item — treat the two as independent today.

## Use this component for
- The org-hierarchy left rail (admin-console + management-console), via the wrapper.
- Any tree-with-chrome use case needing per-row 3-dot menus with declarative action configs + a branded/client root row.

## Avoid this component for
- Generic trees without action menus / chrome.
- Direct app consumption of the skeleton — always go through the wrapper.

## What is static today
- Chrome shape (aside + root row + section label + tree body) — fixed.
- Root row visual is `mode: 'falcon' | 'client'` — no custom template slot.
- Section label position — fixed between root row and tree body.
- Single-selection only.
- Chevron-overlap auto-scroll — opaque to the consumer.

## What is dynamic through inputs/outputs (current API)
- Data/state: `[root]`, `[expandedIds]`, `[selectedId]`, `[trackBy]`, `[clientId]`.
- Visual mode: `[mode]`, `[clientsLabelKey]` (empty hides).
- Actions: `[rootActions]`, `[nodeActions]` (declarative `FalconTreeAction[]`, per-node `visible` predicate).
- Visibility toggles: `[showArrows]`, `[showActions]`, `[showRootActions]`, `[showSubNodes]`.
- Interactivity gates: `[rootSelectable]`, `[nodesSelectable]` — **added 2026-05-18**.
- Outputs: `(toggle)`, `(select)`, `(action)`, `(hoverPathChange)`.

## What is still missing (additive upgrade ideas, NOT yet implemented)
- `FalconTreeAction.disabled?: (node) => boolean` — per-node action disable.
- `FalconTreeAction.variant?: 'default' | 'highlighted' | 'destructive' | 'warning'` — richer action emphasis (today only `highlighted: boolean`).
- Multi-selection (`selectionMode`).
- Custom root-row / section-label template slots (`ng-content`).
- A `showRoot` input to hide the whole root row (today only its 3-dot is independently hideable via `showRootActions`).
- Keyboard activation for the 3-dot trigger.

## Exact rule for future implementation tasks
> "For org-hierarchy-like rails, consume `<app-organization-hierarchy-tree>` (the wrapper). The wrapper owns PES + fetch; the skeleton `<falcon-tree-panel>` is presentational. Drive any locked/read-only behaviour by binding the config inputs to a `computed` off the caller's own flags — never fork the component. The declarative `FalconTreeAction[]` API is the canonical action-menu pattern."

## Risky to change (consumers depend on it)
- `[root]` shape (`FalconTreeNode<T>`) and the `(toggle)` / `(select)` / `(action)` / `(hoverPathChange)` output types.
- `mode` semantics — `'falcon'` ignores `root.imageUrl`.
- `FalconTreeAction.highlighted` semantics — any future `variant` must stay backwards-compatible.
- Default `true` on all visibility / interactivity inputs — flipping a default would silently change every existing consumer.
- The `--spacing-row-action-inset` token + `scrollbar-gutter: stable` mirroring — the action-column alignment depends on both the root row and `.falcon-tree` keeping them.

## Session decisions — 2026-05-18
- **Action-column unified** via the `--spacing-row-action-inset` token + full-width rows + mirrored `scrollbar-gutter: stable`. Chose a token + structural gutter mirror over a hardcoded magic number.
- **Config inputs as individual signal `input()`s** (not a config object) — discoverable, independently overridable, OnPush-friendly, consistent with the existing API.
- **`rootSelectable` / `nodesSelectable`** added to gate clickability without forking the component — enables the caller-driven wizard-lock pattern.
