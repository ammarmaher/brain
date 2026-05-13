# falcon-notification — OVERVIEW

## Component purpose
**Passive intent-keyed message card** with 4 intents (`success` / `info` / `warning` / `error`). Visual is a card with an intent-coloured icon chip, title + optional subtitle, optional left-accent border, optional countdown bar (top / bottom / both / glossy), glossy gradient backdrop optional. 14 inputs control appearance.

Companion `<falcon-angular-notification-stack>` mounts at fixed top-right and renders the global notification queue managed by `FalconNotificationService.push()`.

## Business / UI use case
- Async-action results ("Saved successfully", "Failed to publish").
- Validation feedback ("Email already in use").
- Business-status messages (preferred over toast for these per registry).
- Modern slide-in animation with countdown depletion bar.

## When to use it
- For passive feedback after async actions (PREFERRED over toast).
- For per-page status messages.
- For platform-wide notification stack via `FalconNotificationService`.

## When NOT to use it
- For action-required decisions — use `<falcon-angular-popup>`.
- For PrimeNG `MessageService` parity — use `<falcon-angular-toast>` via `FalconMessageService`.
- For tooltips, drawers, dialogs.

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred** for passive intent-keyed messages. Promoted from `apps/demo/angular` into `@falcon/ui-core/angular`.

## Replaces
- Bespoke alert / toast patterns in the legacy demo app.

## Paths

| Artifact | Path |
|---|---|
| Angular notification component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts` |
| Angular stack component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts` |
| Angular service | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification.service.ts` |
| Stencil sources | _None_ — notification is Angular-only (no Stencil tag). |
| Token file | _None_ — uses Falcon palette tokens directly through Tailwind utilities. |

## Selectors / tags
- Angular: `<falcon-angular-notification>` (single card).
- Angular stack: `<falcon-angular-notification-stack>` (queue mounted once).
- No Stencil tags.

## Known consumers
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts`
- `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts`

## Related components
- `falcon-angular-toast` — sibling for PrimeNG-compat (deprecated for new code).
- `falcon-angular-notification-stack` — companion stack container.
- `FalconNotificationService` — signal-based queue service.

## Ownership / responsibility
Owned by Falcon UI Core. The signal-based service is a modern alternative to the BehaviorSubject-driven `FalconMessageService`.
