# falcon-dialog — OVERVIEW

## Component purpose
Centred modal overlay with backdrop, header / body / footer slots, focus trap, focus restore, Esc + backdrop dismiss. Severity tones (`info` / `success` / `warning` / `danger`), 5 sizes (`sm` / `md` / `lg` / `xl` / `full`), 3 positions (`center` / `top` / `side-right`).

## Business / UI use case
- Generic centered modal — when a custom-shaped dialog body is needed and `falcon-angular-popup` doesn't fit.
- Container for `send-credentials-popup` legacy component (still uses `<falcon-angular-dialog>` because popup doesn't have a slot-friendly variant yet — registry note).
- The underlying primitive composed by `falcon-angular-confirm-dialog` and the legacy popup variants.

## When to use it
- **Rarely directly.** Prefer:
  - `falcon-angular-popup` — for the 4 canonical action-required variants (error / delete / unsaved / save).
  - `falcon-angular-confirm-dialog` — for OK / Cancel prompts with severity.
  - `falcon-angular-drawer` — for side-anchored sheets.
- Use `falcon-angular-dialog` directly only when you genuinely need custom modal body + footer that doesn't match the popup variants.

## When NOT to use it
- For the 4 canonical decision flows — `popup` already does them.
- For confirms with simple OK/Cancel — `confirm-dialog` already does that.
- For side sheets — drawer is right.

## Active / preferred / deprecated / legacy status
**@deprecated.** Per the registry: `@deprecated — prefer <falcon-angular-popup> for action-required flows. Kept for slot-friendly custom dialogs (e.g. send-credentials-popup).`

The Stencil source itself does NOT have a JSDoc `@deprecated` annotation, but the project memory + registry explicitly mark it deprecated for new code. Today it remains the underlying primitive composed by `confirm-dialog` and (indirectly) by `popup`.

**Flagging this clearly: NEW CODE should not directly render `<falcon-angular-dialog>`.**

## Replaces
- PrimeNG `<p-dialog>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-dialog-tw/falcon-dialog-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/dialog.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-dialog>`
- Stencil Shadow: `<falcon-dialog>`
- Stencil Light: `<falcon-dialog-tw>`

## Known consumers
- Grep returned `Found 1 file` for `falcon-angular-dialog` in `apps/`: `apps/host-shell/src/app/playground/playground.page.html` (showcase only).
- Composed internally by `<falcon-angular-confirm-dialog>` (templates + wrapper).
- Composed historically by the legacy `send-credentials-popup` Angular legacy component.

## Related components
- `falcon-angular-confirm-dialog` — composes this for confirm/accept/reject layout.
- `falcon-angular-popup` — sibling action-required modal (DOES NOT compose this; uses raw `<falcon-button-tw>` + Tailwind directly).
- `falcon-angular-drawer` — sibling overlay with edge-anchored slide-in.
- `falcon-angular-button` — common footer content.

## Ownership / responsibility
Owned by Falcon UI Core. Kept for backwards-compat + composition substrate. Direct usage discouraged.
