# falcon-message-host — OVERVIEW

> [!warning] SUPERSEDED by [[falcon-message-service]] · canonical service is `FalconMessageOrchestratorService`
> **This dossier is a stale duplicate.** The `<falcon-angular-message-host>` COMPONENT still exists on disk and is still mounted ([CODE] `apps/host-shell/src/app/app.ts:38` — `<falcon-angular-message-host position="top-right">`), but it is now a **no-op host pending removal** ([CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-service.ts:21-23`). The unit (service + host) is documented canonically in the consolidated **[[falcon-message-service]]** dossier ([BRAIN-OUT] `understanding/frontend/components/falcon-message-service/`), which the B18 sweep created as the live successor and which explicitly flagged THIS dossier for deprecation by the B23 reconcile cluster.
>
> **What this old dossier got wrong:** it claims the host "renders the `FalconMessageService.add()` stream as `<falcon-angular-toast>` instances." As of Phase 5 (2026-05-24) that is no longer true — `FalconMessageService` is a thin **shim that routes every `.add()` through `FalconMessageOrchestratorService.show()`** ([CODE] `falcon-message-service.ts:1-23`), the host renders nothing, and `messages$` always emits `[]` ([CODE] `:65-69`). For accurate, current facts read **[[falcon-message-service]]**.
>
> _Reconciled 2026-06-03 (B23 reconcile cluster) — dossier was a 4-file orphan with no live 1:1 component of its own (the host folder is owned by the `falcon-message-service` unit). Status flipped ACTIVE→SUPERSEDED; not rebuilt — see the live successor dossier instead._

## Component purpose
Renders the `FalconMessageService.add()` stream as `<falcon-angular-toast>` instances inside a `<falcon-angular-toast-host>`. **Drop-in replacement for PrimeNG `<p-toast>` + `MessageService`.** Mount ONCE in any app shell — any component can call `FalconMessageService.add({...})` to fire a message. _(STALE as of Phase 5 — see banner above; the host is now inert and the service forwards to the orchestrator.)_

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
**SUPERSEDED (dossier) — documented canonically at [[falcon-message-service]].** The `<falcon-angular-message-host>` component is a **no-op host kept mounted to avoid a churny diff; flagged for removal** ([CODE] `falcon-message-service.ts:21-23`). The injectable `FalconMessageService` is still alive as a PrimeNG-compat shim, but it forwards to `FalconMessageOrchestratorService.show()` and is itself back-compat-only. New code: call `FalconMessageOrchestratorService.show({category, title, message, source})` directly.

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
Owned by Falcon UI Core. The PrimeNG-compat API (`add({severity, summary, detail, life, closable, icon})`) is preserved for migration ease — but `life` / `closable` / `icon` are IGNORED in Phase 5 ([CODE] `falcon-message-service.ts:38-46`); the orchestrator's toast-adapter owns timing/dismiss/icon.

## Verification
🟡 code-derived (B23 reconcile 2026-06-03) — host component still on disk + mounted [CODE] `apps/host-shell/src/app/app.ts:38`; shim/no-op facts cross-checked against the live successor dossier [BRAIN-OUT] `understanding/frontend/components/falcon-message-service/OVERVIEW.md:1-45` (B18, itself 🟢 against `falcon-message-service.ts`). Sections below the banner describe the pre-Phase-5 behavior and are STALE.
