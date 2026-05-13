# falcon-toast — OVERVIEW

## Component purpose
Single auto-dismissing toast message with severity (`info` / `success` / `warning` / `error`), title, message, optional icon, optional action (label + href / button). Hover-pause / focus-pause for the auto-dismiss timer. Stacked inside a `<falcon-toast-host>` container that renders multiple toasts at one of 6 positions.

## Business / UI use case
- Transient feedback after async actions ("Saved", "Email sent").
- Error fallback messages.
- Drop-in replacement for PrimeNG `<p-toast>` driven by `FalconMessageService` queue.

## When to use it
- For transient, dismissible feedback messages.
- When `FalconMessageService.add({severity, summary, detail})` semantics are needed (PrimeNG-compat).
- For "did-what-you-asked-for" confirmations.

## When NOT to use it
- **PREFER `falcon-angular-notification`** for business-status messages, validation feedback, async-action results (per registry: "preferred over `<falcon-toast>` for business-status messages").
- For decision-required prompts — use `falcon-angular-popup` or `confirm-dialog`.
- For persistent messages — toasts auto-dismiss.

## Active / preferred / deprecated / legacy status
**@deprecated** — per registry: "prefer `<falcon-angular-notification>` for new code. Kept for the existing `FalconMessageService` queue (drop-in for PrimeNG `MessageService` + `<p-toast>`)."

The Stencil source does NOT have a JSDoc `@deprecated` annotation. The deprecation is documented in project memory + registry but not enforced at the API surface.

**NEW CODE should prefer `falcon-angular-notification` + `FalconNotificationService`.**

## Replaces
- PrimeNG `<p-toast>` (Wave PR-8) — when used via `FalconMessageService`.

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast.component.ts` |
| Angular wrapper host | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast-host.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast.component.html` |
| Angular host template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast-host.component.html` |
| Stencil Shadow source (toast) | `libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-toast-tw/falcon-toast-tw.tsx` |
| Stencil Shadow source (host) | `libs/falcon-ui-core/src/components/falcon-toast-host/falcon-toast-host.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/toast.tokens.css` |

## Selectors / tags
- Angular toast: `<falcon-angular-toast>`
- Angular host: `<falcon-angular-toast-host>`
- Stencil Shadow toast: `<falcon-toast>`
- Stencil Light toast: `<falcon-toast-tw>`
- Stencil Shadow host: `<falcon-toast-host>`
- Stencil Light host: `<falcon-toast-host-tw>`

## Known consumers
- `apps/host-shell/src/app/playground/playground.page.html` (showcase only).
- Composed by `<falcon-angular-message-host>` (which subscribes to `FalconMessageService.messages$`).

Production templates use `FalconMessageService.add({...})` indirectly, NOT the toast component directly.

## Related components
- `falcon-angular-message-host` — composes this with the `FalconMessageService` queue (drop-in for PrimeNG `<p-toast>`).
- `falcon-angular-notification` — preferred passive-intent message card for new code.
- `FalconMessageService` — Angular service mirroring PrimeNG `MessageService.add()` API.

## Ownership / responsibility
Owned by Falcon UI Core. Kept for PrimeNG-compat migration substrate. New code should prefer notification.
