# falcon-view-toggle — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` falcon-view-toggle.component.ts:1-15 — In business terms this control answers **"how do I want to *look at* this data?"**, not "what value do I want to save". At the only live site it lets a Falcon admin / client operator flip the **organization hierarchy** between a flat **List** and a structural **Tree (org-chart)** rendering of the same nodes (`[CODE]` tree-state.signals.ts:42-45). It carries **no business data of its own** — it is a presentation-mode switch over a view that the org-hierarchy state slice already holds.

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Org-hierarchy offers a List view and a Tree/structure view | `[CODE]` tree-state.signals.ts:39-45 (`StructureView = 'tree' \| 'chart'`; options labelled `hierarchy.view.list` / `hierarchy.view.tree`) | The toggle is the UI affordance that exposes the two layouts; selecting `chart` flips `showOrgChart()` true (`[CODE]` tree-state.signals.ts:124). |
| View change must respect the page's unsaved-changes guard | `[CODE]` org-hierarchy-page-menu.component.html:121-123 (comment) + .ts:259-273 (`onStructureViewChange` veto) | The host binds one-way `[value]` + `(valueChange)` so a pending unsaved edit can BLOCK the view switch; the toggle visually snaps back when vetoed. |

> `[INFERRED]` No dedicated V-rule or PRD clause names the toggle itself; it is a UI convenience over the hierarchy feature's "List vs Tree" presentation requirement. The business contract lives in the org-hierarchy feature, not in this primitive.

## Business constraints baked in

- `[CODE]` **One option is always selected** — clicking the active pill is a no-op (ts:44 guard), so there is never a "no view" state. Business-correct for a view switcher (the page must always render *some* layout).
- `[CODE]` **The toggle does not itself persist or fetch anything** — it emits `valueChange`; the org-hierarchy state slice owns `structureView` and the downstream `showOrgChart()` derivation. A builder must NOT add a backend call inside the toggle.
- `[CODE]` **State keys (`tree`/`chart`) intentionally differ from the labels (List/Tree)** — `tree-state.signals.ts:41` comment: "HTML truth: toggle reads 'List | Tree'. State keys 'tree'/'chart' kept for code stability." Do not rename the keys to match the labels; downstream code keys off `tree`/`chart`.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse organization hierarchy | org-hierarchy-page (admin-console) | Switch the hierarchy tab between List and Tree/org-chart layout. |
| Browse organization hierarchy | org-hierarchy-page (management-console) | Same — client-facing parity. |

> `[CODE]` Both flows are the *same* feature in the two consoles; the toggle sits in the `<falcon-angular-tabs>` action slot of the hierarchy tab.

## Business gotchas

- `[CODE]` **A blocked view switch is a feature, not a bug** — if the operator has unsaved hierarchy edits, the page's `onStructureViewChange` guard can veto the switch and the pill snaps back. A builder must NOT "fix" this by switching to `[(value)]` (two-way commits immediately and bypasses the guard).
- `[CODE]` **It is not a form input** — there is no CVA. Putting it inside a Reactive Form and expecting `formControlName` to capture the view is wrong; the view mode is page/UI state, not a submitted field.
- `[INFERRED]` **Low blast radius** — only the two org-hierarchy menus consume it, so changing its labels/icons affects only the List/Tree switcher. But because it is a *shared* primitive, any visual change ripples to any future adopter — treat changes as shared-component changes.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — `StructureView` keys, `STRUCTURE_OPTIONS` labels/icons, the always-one-selected guard (ts:44), and the unsaved-changes veto (`onStructureViewChange`, .ts:259-273 + html comment) all re-confirmed in live source. No PRD/V-rule names the toggle itself — business contract inferred from the org-hierarchy feature it serves.
