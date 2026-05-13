# falcon-drawer — OVERVIEW

## Component purpose
Edge-anchored slide-in panel (drawer / off-canvas). Position-driven sizing (right/left → width; top/bottom → height). ARIA `role=dialog` + `aria-modal=true`, with focus trap, focus restore on close, Esc + backdrop dismiss, and slide-from-edge `transform: translateX/translateY ±100%` transitions.

## Business / UI use case
- Right-side detail panels — "Add node" / "Edit node" drawers on Org Hierarchy tree.
- Filter panels.
- Side-anchored wizards.
- Mobile menu / off-canvas nav.

## When to use it
- When a sheet should slide in from a screen edge rather than scale-fade in the center (use `falcon-angular-dialog` for centered).
- When the form / list inside is tall and benefits from full-height layout.
- For a "preview / detail" pattern that doesn't fully block the page underneath.

## When NOT to use it
- For confirm / accept / cancel flows — use `falcon-angular-popup` or `falcon-angular-confirm-dialog`.
- For passive notifications — use `falcon-angular-notification`.
- For tooltips — use `falcon-angular-tooltip`.
- For destructive confirmation — too heavy, use `falcon-angular-popup variant="delete"`.

## Active / preferred / deprecated / legacy status
**ACTIVE.** Used in production. Preferred for side-anchored panels.

## Replaces
- PrimeNG `<p-sidebar>` (Wave PR-8).
- Hand-rolled `.drawer` HTML patterns from V0.2.

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-drawer-tw/falcon-drawer-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/drawer.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-drawer>`
- Stencil Shadow: `<falcon-drawer>`
- Stencil Light: `<falcon-drawer-tw>`

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` — Add/Edit node drawer.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` — twin app.

## Related components
- `falcon-angular-button` — drawer footer Cancel + Save pair (canonical pattern).
- `falcon-angular-input` / `falcon-angular-dropdown` / form controls — typical body content.
- `falcon-angular-dialog` — sibling component for centered modals (same focus-trap / Esc logic).

## Ownership / responsibility
Owned by Falcon UI Core. The focus-trap + restore logic is shared with `falcon-angular-dialog`.
