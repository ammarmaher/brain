---
name: Library = Skeleton, App = API
description: Architectural rule — library components are presentational skeletons; API-driven flows live in app-level wrapper components in host-shell/shared-components.
type: feedback
originSessionId: f6482c51-521b-4dca-9c77-475df9deaa8a
---
**🔴 ABSOLUTE STANDING RULE (2026-05-15 — Wave 16)** — locked by user after the insufficient-balance-dialog rebuild surfaced this seam.

## The rule

Every Falcon component lives in exactly one of two layers:

1. **Library skeleton** (`libs/falcon-ui-core/`) — pure presentational. Takes data via `@Prop`/`@Input`, emits events. **Never injects a service that talks to a backend.** Works with default / caller-supplied data only.

2. **App-level wrapper** (`apps/host-shell/src/app/shared-components/<name>/`) — uses the library skeleton **as a tag** inside its template. **This is the only layer where backend services get injected.** Owns the API orchestration (HTTP, polling, retries, state-machine).

## Why

- **Skeleton ↔ live separation** — easier to test, theme, document, and reuse. The skeleton can render in any context (showcase, Storybook, generic non-commerce reuse) with mock data.
- **Backend coupling stays in the app** — library bundle doesn't ship HTTP code that consumers may not want. Apps that need different API shapes write different wrappers.
- **Cross-app reuse via host-shell** — admin-console, mgmt-console, and any future app consume the wrapper through `@host-shell/shared/*` TS path alias. Wrappers live ONCE in host-shell, consumed many times.

## How to apply

1. **Building a library component?** Make it a skeleton: accept inputs, emit outputs, NO `inject(SomeApiService)`. If you find yourself reaching for HttpClient inside a library component, STOP and author a wrapper instead.

2. **Need backend-driven UX?** Author the skeleton in `libs/falcon-ui-core/` (Stencil 3-artefact pattern). THEN author the wrapper in `apps/host-shell/src/app/shared-components/<verb-noun>-popup/`. Wrapper imports the skeleton's Angular wrapper as a tag, injects the services, exposes a clean `[trigger]` + `(succeeded)`/`(failed)` surface.

3. **Consumer apps** import the wrapper:
   ```ts
   import { DoPaymentPriorityPopupComponent } from '@host-shell/shared/do-payment-priority-popup';
   ```
   They NEVER inject the backend services directly for these flows.

4. **TS path alias** in `tsconfig.base.json`:
   ```json
   "@host-shell/shared/*": ["./apps/host-shell/src/app/shared-components/*/index.ts"]
   ```

## Reference implementation

- **Library skeleton:** `<falcon-angular-insufficient-balance-dialog>` (`libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/`) — accepts `items: {id, label}[]`, emits `falcon-proceed: { orderedIds }`. No services injected.
- **App-level wrapper:** `<app-do-payment-priority-popup>` (`apps/host-shell/src/app/shared-components/do-payment-priority-popup/`) — injects `CommChannelPaymentService`, `OrderStatusService`, `SimplePollService`. Owns doPayment → poll → reorder → resubmit flow. Exposes `[trigger]`, `(succeeded)`, `(failed)`.
- **Consumer:** `applications-table.component.html` in admin-console — `<app-do-payment-priority-popup [trigger]="ibTrigger()" (succeeded)="onIbSucceeded($event)" (failed)="onIbFailed($event)" />`. Three lines.

## Grandfathered (do NOT move)

Pre-Wave-16 HTTP services living in `libs/falcon/src/shared-data-access/` (e.g. `CommChannelPaymentService`, `OrderStatusService`, `AccountValidationService`, `LookupService`) — they stay where they are. The rule binds NEW authoring; existing code keeps working.

Pure utility services like `SimplePollService`, `HttpService` (low-level wrapper), formatters, validators stay in libs forever — they don't call domain APIs, they're framework infrastructure.

## What violates this rule

- ❌ A library Angular component with `inject(SomeService)` where SomeService makes HTTP calls
- ❌ A library component subscribing to RxJS streams from a backend
- ❌ An app component injecting an API service AND ALSO using the library skeleton directly (instead of going through a wrapper) — that's the wrapper's job
- ❌ A wrapper authored anywhere other than `apps/host-shell/src/app/shared-components/`

## Strategy doc reference

`Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6 — full doctrine + worked example. Logged in `09-CHANGELOG.md` v1.1.0.
