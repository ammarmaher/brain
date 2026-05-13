# falcon-tooltip — OVERVIEW

## Component purpose
Decorator-style wrapper that reveals a small floating panel on hover / focus of its trigger. 12 placement options (top / right / bottom / left × default + -start + -end suffixes). Interactive mode keeps the panel open while hovering the panel body (for clickable links inside). Panel positioning is JS-computed (escape hatch — `panel.style.transform` from `computeOffset()`); all other paint stays in tokens.

## Business / UI use case
- Icon-button affordance labels ("Edit", "Delete").
- Truncated text expansion.
- Field hints for compact forms.
- Status indicator legends.

## When to use it
- Pure informational hover.
- For icon-only buttons that need visible labels for sighted users.
- For truncated labels.

## When NOT to use it
- For action menus (use `<falcon-angular-menu>`).
- For popovers with interactive content beyond a single link (use a custom popup OR `<falcon-angular-popup>`).
- For decision flows (use `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>`).
- For passive notifications (use `<falcon-angular-notification>`).

## Active / preferred / deprecated / legacy status
**ACTIVE.** Wave 9.F. Production-grade.

## Replaces
- PrimeNG `[pTooltip]` directive (Wave PR-8).
- HTML `title=""` attributes (visually unstyled).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.types.ts` |
| Stencil Shadow utils | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.utils.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tooltip-tw/falcon-tooltip-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/tooltip.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-tooltip>`
- Stencil Shadow: `<falcon-tooltip>`
- Stencil Light: `<falcon-tooltip-tw>`

## Known consumers
- `apps/host-shell/src/app/playground/playground.page.html` (showcase only).

Zero matches in admin / management consoles' feature templates. Under-leveraged primitive — should be paired with icon-only buttons more broadly.

## Related components
- `falcon-angular-icon` — common trigger child.
- `falcon-angular-button` (especially `iconOnly`) — primary use case (button-with-tooltip combo).

## Ownership / responsibility
Owned by Falcon UI Core. Production-ready, low-risk.
