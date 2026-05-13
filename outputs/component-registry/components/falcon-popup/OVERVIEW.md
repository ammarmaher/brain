# falcon-popup — OVERVIEW

## Component purpose
Action-required modal with **4 canonical variants** — `error`, `delete`, `unsaved`, `save`. Each variant ships:
- A pre-defined intent (danger / warning / success / primary).
- A pre-defined icon (custom inline SVG per variant).
- Default copy strings (title / body / hint / button labels).
- A confirm tone (danger / primary / success).

The popup is **NOT** a substrate of `falcon-dialog` — it's a self-contained Angular component using its own Tailwind template + `<falcon-button-tw>` for the footer buttons. ARIA `role="dialog"` + `aria-modal="true"`.

## Business / UI use case
- Confirm destructive deletion of a record.
- Warn about unsaved changes before navigation.
- Confirm publish / save with summary hint ("3 fields changed").
- Generic error fallback when an action fails.

## When to use it
- Whenever the page needs an action-required modal matching one of the 4 variants.
- For ANY confirmation that maps cleanly to error / delete / unsaved / save.

## When NOT to use it
- For passive notifications — use `falcon-angular-notification`.
- For tooltips, menus, drawers, dialogs — use the dedicated components.
- For confirmations with non-standard semantics (e.g. "Schedule for later") — fall back to `falcon-angular-confirm-dialog` or compose your own using `falcon-angular-dialog`.

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred for action-required modals.** Wave 5 (promoted from `apps/demo/angular`). Replaces direct `<falcon-angular-dialog>` use for these 4 canonical flows.

## Replaces
- Hand-rolled confirm dialogs from V0.2.
- Direct `<falcon-angular-dialog>` use for delete/unsaved/save/error patterns.

## Paths

| Artifact | Path |
|---|---|
| Angular component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` (315 lines, INLINE TEMPLATE) |
| Stencil sources | _None_ — this is an Angular-only component. |
| Token file | _None_ — uses Falcon theme tokens directly via Tailwind utilities. |
| Footer button source | Composes `<falcon-button-tw>` (Light DOM Stencil) directly. |

## Selectors / tags
- Angular only: `<falcon-angular-popup>`
- No Stencil tag.

## Known consumers
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html`
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/add-user-wizard.component.html`
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.html`
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts`

## Related components
- `falcon-angular-dialog` — sibling base modal. Popup does NOT compose dialog — they're parallel implementations.
- `falcon-angular-confirm-dialog` — alternative for OK/Cancel that DOES compose dialog. Pick popup for the 4 canonical flows; confirm-dialog for everything else.
- `falcon-button-tw` (Stencil Light DOM) — composed internally for the footer buttons.

## Ownership / responsibility
Owned by Falcon UI Core. Variants are HARDCODED in a `VARIANTS: Record<FalconPopupVariant, VariantContent>` const — adding a new variant requires source changes (not configuration).
