# falcon-message-host — OVERVIEW

## Component purpose
Renders the `FalconMessageService.add()` stream as `<falcon-angular-toast>` instances inside a `<falcon-angular-toast-host>`. **Drop-in replacement for PrimeNG `<p-toast>` + `MessageService`.** Mount ONCE in any app shell — any component can call `FalconMessageService.add({...})` to fire a message.

## Business / UI use case
- Migrating apps from PrimeNG `<p-toast>` + `MessageService` to Falcon without rewriting message-firing code.
- Centralised toast stack across the app.
- Cross-feature messaging (HTTP interceptors fire toasts).

## When to use it
- Migrating from PrimeNG `MessageService`.
- When the existing service API (`add`, `addAll`, `remove`, `clear`) is needed.
- When the toast visual is preferred over notification visual.

## When NOT to use it
- For new business-status messages — prefer `<falcon-angular-notification>` + `FalconNotificationService.push()` (per registry deprecation chain).
- For single-shot messages where you don't need a queue — use `<falcon-angular-notification>` directly.
- For action-required decisions — use `<falcon-angular-popup>`.

## Active / preferred / deprecated / legacy status
**ACTIVE — substrate.** This component itself is not deprecated, but the toast it renders is (per registry). The message-host's value is the `MessageService` API parity for PrimeNG migration.

## Replaces
- PrimeNG `<p-toast>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.html` |
| Angular service | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-service.ts` |
| Stencil sources | _None_ — Angular-only. |

## Selectors / tags
- Angular: `<falcon-angular-message-host>`
- No Stencil tag.

## Known consumers
- `apps/host-shell/src/app/core/interceptors/response-interceptor.ts` — HTTP interceptor uses `FalconMessageService`.
- `apps/host-shell/src/app/app.ts` — host mount.
- `apps/host-shell/src/app/app.config.ts` — service provider registration.

Production use IS established — host-shell uses this pattern. Admin / management consoles likely inherit via the shared interceptor.

## Related components
- `falcon-angular-toast` — composed internally.
- `falcon-angular-toast-host` — composed internally.
- `FalconMessageService` — the queue API.
- `falcon-angular-notification` / `FalconNotificationService` — preferred alternative for new code.

## Ownership / responsibility
Owned by Falcon UI Core. The PrimeNG-compat API (`add({severity, summary, detail, life, closable, icon})`) is preserved for migration ease.
