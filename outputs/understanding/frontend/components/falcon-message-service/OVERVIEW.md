# falcon-message-service — OVERVIEW

> **Supersession note (2026-06-03, B18):** this dossier is the **live successor** of the older `understanding/frontend/components/falcon-message-host/` dossier. That dossier described `FalconMessageService` as a `BehaviorSubject`-owning toast queue feeding `<falcon-angular-message-host>`. `[CODE]` `falcon-message-service.ts:1-23` — **as of Phase 5 (2026-05-24) that is no longer true:** the service is a thin **shim that routes every `.add()` through `FalconMessageOrchestratorService.show()`**, and `<falcon-angular-message-host>` is a **no-op host pending removal**. The old `falcon-message-host` dossier is flagged for formal deprecation by the **B23 reconcile cluster** (not edited here).

## Component purpose

The `falcon-message-service` unit is the **PrimeNG-`MessageService`-compatible imperative shim** (`FalconMessageService`) plus its now-vestigial host (`<falcon-angular-message-host>`). It lets any code that was written against PrimeNG's `MessageService.add({severity, summary, detail, life, closable, icon})` keep firing transient feedback **without rewriting the call site** — the shim translates the call into the canonical `FalconMessageOrchestratorService.show()` API. The host is the legacy render endpoint; it is now inert.

## Business / UI use case

- **PrimeNG migration substrate** — apps moving off `<p-toast>` + `MessageService` keep the `.add()` ergonomics; only the import path changes.
- **Imperative global feedback** from non-component code (HTTP interceptors, state-signal services, row-action handlers) where injecting a service and calling `.add()` is more natural than binding a component to a signal.
- Live callers today (`[CODE]` grep 2026-06-03): `apps/{admin,management}-console/.../templates-page/components/templates-list.component.ts` inject it as `toast` and fire approve/reject/submit outcome toasts.

## When to use it / when NOT to use it

**Use it for:**
- Keeping an existing PrimeNG-shaped `.add({severity, summary, detail})` call working through the Falcon orchestrator with zero refactor.

**Do NOT use it for:**
- **NEW code** — call `FalconMessageOrchestratorService.show({ category, title, message, source })` directly. The orchestrator is the canonical SoT; the shim only exists for back-compat.
- **Action-required decisions** (must-acknowledge / confirm) — use `FalconConfirmService` / `FalconUnsavedChangesService` (which route to the orchestrator's `action-required` modal).
- **Relying on `life` / `closable` / `icon`** — `[CODE]` `falcon-message-service.ts:38-46` those PrimeNG fields are **IGNORED in Phase 5** (the orchestrator's toast-adapter owns timing/dismiss/icon via `falcon-defaults.json`).
- **Subscribing to `messages$`** — `[CODE]` `:65-69` it always emits `[]` now.

## Status

**ACTIVE — back-compat shim.** `FalconMessageService` (the injectable) is alive and load-bearing for PrimeNG-shaped callers. `<falcon-angular-message-host>` (the component) is a **no-op host kept mounted to avoid a churny diff; flagged for removal** (`[CODE]` `falcon-message-service.ts:21-23`). The canonical replacement for both is `FalconMessageOrchestratorService` + its adapters (`FalconModalAdapterComponent` / `FalconToastAdapterComponent`).

## Replaces

- PrimeNG `<p-toast>` + `MessageService` (Wave PR-8).
- Itself superseded INTERNALLY by `FalconMessageOrchestratorService` (Phase 5, 2026-05-24) — the shim now forwards to it.

## Source file paths

| Layer | Path |
|---|---|
| Shim service TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-service.ts` (104 ln) |
| Host component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts` (56 ln) |
| Host template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.html` (20 ln) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/index.ts` (re-exports `FalconMessageService`, `FalconMessage`, `FalconAngularMessageHostComponent`) |
| Top-level barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:41` (`export * from './components/falcon-message-service'`) → consumers import from `@falcon/ui-core/angular` |
| **Live successor (service)** | `libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.service.ts` (319 ln) |
| Live successor (types) | `libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.types.ts` |
| Live successor (config) | `libs/falcon-ui-core/src/services/message-orchestrator/message-priorities.json` (7 categories) |
| Live successor (provider) | `libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.providers.ts` (`provideMessageOrchestrator()`) |
| Stencil sources | _None_ — Angular-only (the host renders Stencil-backed `<falcon-angular-toast>` children, but those are NEVER mounted in Phase 5). |
| Token file | _None_ — no `message-service.tokens.css` / `message-host.tokens.css`. |
| Spec/tests | _None_ for the shim or host. The successor IS tested: `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` (30+ tests). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular host selector | `falcon-angular-message-host` (no-op) |
| Injectable | `FalconMessageService` (`providedIn: 'root'`) |
| Stencil tag | _None_ |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `FalconMessageService` import/inject across `apps/`:
- `apps/admin-console/src/app/features/templates-page/components/templates-list.component.ts:27,161` — injected as `toast`; 12 `.add()` sites (approve/reject/submit/error toasts).
- `apps/management-console/src/app/features/templates-page/components/templates-list.component.ts:27,165` — same pattern.
- `apps/host-shell/src/app/app.config.ts:57,139` — provider registration (`providedIn:'root'` makes this redundant but harmless).
- `apps/host-shell/src/app/app.ts:6,26,38` — mounts `<falcon-angular-message-host position="top-right">` (no-op).
- Comments-only references (migration trail): `apps/{admin,management}-console/.../templates-wizard.component.ts` (migrated AWAY to orchestrator), `.../add-user-wizard/services/user.service.ts`, `.../org-hierarchy-page/services/state/users-state.signals.ts`, `apps/admin-console/tests/add-client-state-signals.spec.ts` (notes the swap to `FalconToastService`).

> `[CODE]` The shim's own JSDoc claim "ZERO live callers of `.add()`" (`:8-9`) was true at the Phase-5 commit; `templates-list` retained/adopted it afterward (see USAGE Consumer Sweep). See `GAPS_AND_UPGRADES.md` G-DEAD-HOST.

## Related components

- **Live successor:** `FalconMessageOrchestratorService` (the single message-routing layer) + `FalconModalAdapterComponent` + `FalconToastAdapterComponent`.
- **Renders (when mounted, which it never is in Phase 5):** `<falcon-angular-toast>` + `<falcon-angular-toast-host>`.
- **Sibling shims** that ALSO route to the orchestrator: `FalconUnsavedChangesService` + `<falcon-unsaved-changes-host>` (B18), `FalconConfirmService` + `<falcon-angular-confirm-dialog-host>`, `falcon-http-error-dialog-host`.
- **Type collision:** the shim exports `FalconMessage` (PrimeNG shape); the orchestrator exports a different `FalconMessage` re-exported as `FalconOrchestratorMessage` (`[CODE]` `angular-wrapper/index.ts:89-97`) to avoid the clash.

## Ownership / responsibility

`libs/falcon-ui-core` (Angular-wrapper layer). Owned by Falcon UI team. The canonical message contract lives in `libs/falcon-ui-core/src/services/message-orchestrator`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18 sweep, NEW dossier). Supersession confirmed against `falcon-message-service.ts` (104 ln), `falcon-message-host.component.{ts,html}`, the orchestrator service (319 ln), `message-priorities.json`, and `app.ts` mounts. Old `falcon-message-host` dossier facts carried forward (PrimeNG lineage, `'warn'→'warning'`, mount-once, `NG0203` trap on the host's `takeUntilDestroyed`) and corrected (queue → orchestrator shim; host is a no-op).
