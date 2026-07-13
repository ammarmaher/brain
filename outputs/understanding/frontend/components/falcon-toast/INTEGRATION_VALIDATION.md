# falcon-toast — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` falcon-toast.tsx is purely presentational — it owns no data, calls no endpoint. The *content* of any message originates wherever the firing code lives. In the CURRENT architecture, the firing code calls the orchestrator (not the toast), and the orchestrator renders `<falcon-angular-notification>` (not `<falcon-toast>`).

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The component binds to **no endpoint**. It is a display-only card. |

`[INFERRED]` Integration is entirely *inbound from app code*; there is no outbound HTTP from this component.

## The live integration contract — the orchestrator + HTTP dispatcher (NOT FalconMessageService)

`[CODE]` The platform's actual message integration runs through three layers (the prior dossier documented `FalconMessageService.add()` as the contract — that is the LEGACY shim, no longer mounted):

1. **`FalconMessageOrchestratorService.show(request)`** (`[CODE]` falcon-message-orchestrator.service.ts:94-112) — strict-category routing. `request: { category, title, message, source, dedupeKey?, actionLabel?, actionCallback?, correlationId?, params? }`. 7 categories (`action-required` / `configuration-required` / `business-error` / `validation-error` / `warning` / `info` / `success`); `modal` vs `toast` presentation per `message-priorities.json`. Returns the assigned id (or `''` if dropped/deduped).
2. **`FalconHttpUiDispatcherService`** (`[CODE]` falcon-http-ui-dispatcher.service.ts) — the HTTP error/success bridge. `dispatchError` / `dispatchApplicationError` / `renderSuccess` all funnel into `orchestrator.show({ category, … })` with `source: 'http-interceptor'`.
3. **`<falcon-toast-adapter>`** (`[CODE]` falcon-toast-adapter.component.ts) — subscribes to `orchestrator.activeToast()` and renders ONE `<falcon-angular-notification>` card. **This is the renderer — NOT `<falcon-toast>`.**

`[CODE]` The legacy `FalconMessageService` API (`add`/`addAll`/`remove`/`clear`/`messages$`) is what `<falcon-angular-message-host>` consumes to drive `<falcon-toast>`, but that host is dead-mounted (`app.ts` uses the adapter).

## The 400 → top-right toast HTTP error pipeline (canonical, CODE-VERIFIED)

`[CODE]` `apps/host-shell/src/app/core/http-ui/falcon-http-ui.config.ts` defines the global `errorRules`; `FalconHttpUiDispatcherService.dispatchError` resolves a rule by status and calls `orchestrator.show(...)`. The rendered surface for EVERY rule is the orchestrator's notification card (top-right), regardless of `surface:'popup'` vs `'toast'` — `surface:'popup'` does NOT mean a blocking `<dialog>` here, it maps to the top-tier `business-error` category (`[CODE]` falcon-http-ui-dispatcher.service.ts:180-184). The live ladder:

| HTTP status | errorRule | Orchestrator category | Rendered as |
|---|---|---|---|
| **400** | `{ surface:'toast', toastIntent:'error', title:'Bad request' }` | `business-error` (intent error → business-error) | top-right error notification card |
| 401 | (none — owned by AuthService refresh flow; never reaches dispatcher) | — | — |
| 403 | `{ surface:'popup', title:'Access denied' }` | `business-error` | top-right card (NOT a blocking modal) |
| 404 | `{ surface:'popup', title:'Not found' }` | `business-error` | top-right card |
| 422 | `{ surface:'toast', toastIntent:'warning' }` | `warning` | top-right warning card |
| applicationError (HTTP 200 + `isSuccessful:false`) | `{ surface:'toast', toastIntent:'error', title:'Validation error' }` | `validation-error` | top-right warning card |
| 4xx (catch-all) / 5xx / network / default | `{ surface:'popup', … }` | `business-error` | top-right card |
| per-call success (`withSuccess`/`withMessages`) | — | `success` (intent→category) | top-right success card |

`[CODE]` Dedupe: `http|<status>|<ruleKey>` / `http-interceptor|<suffix>|<title>` coalesces repeated 500s within the orchestrator's 3s window (`[CODE]` falcon-http-ui-dispatcher.service.ts:162/194). Auto-dismiss timing is owned by the notification CARD (reads `dismissDurationSec` from `falcon-defaults.json` via `FalconConfigurationService`), NOT the orchestrator and NOT `<falcon-toast>`.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error |
|---|---|---|---|
| — | — | — | **No validation.** The toast neither validates input nor gates submission. It is a display-only outcome surface. |

`[INFERRED]` Validation belongs to the flow that fires the message; the card merely paints the result.

## PES keys gating this component

**None.** `[INFERRED]` Transient feedback is not permission-gated — PES gating happens on the *action*, not on its acknowledgement.

## State / signal pattern

`[CODE]` `<falcon-toast>` itself owns its auto-dismiss timer (`autoTimer`, `remainingMs`, `timerStartedAt`) — `[CODE]` falcon-toast.tsx:47-98. Hover/focus pause is per-element state. The Angular wrapper is a thin `@Input()` pass-through with `defineFalconTwComponent('falcon-toast')` lazy registration (`[CODE]` falcon-toast.component.ts:33).

`[CODE]` `<falcon-angular-message-host>` (the legacy composition) holds a `signal<FalconMessage[]>` fed by `service.messages$` with `takeUntilDestroyed(this.destroyRef)` (`[CODE]` falcon-message-host.component.ts:38-48) — and that explicit `DestroyRef` is mandatory because `ngOnInit` is outside the injection context (omitting it throws NG0203, blank render — documented in the source comment).

## Skeleton ↔ app-wrapper layering

- **Stencil skeleton** — `<falcon-toast>` (Shadow) / `<falcon-toast-tw>` (Light DOM). Owns the timer.
- **Stencil host skeleton** — `<falcon-toast-host>` / `<falcon-toast-host-tw>`. Positioner only.
- **Angular wrappers** — `<falcon-angular-toast>` + `<falcon-angular-toast-host>`: thin `@Input()` pass-through, no CVA.
- **Angular composition** — `<falcon-angular-message-host>` injects `FalconMessageService` and composes toast + host. **Only this layer touches a service** — per `feedback_library_skeleton_app_api` the skeleton stays service-free. (Dead-mounted; the live equivalent is `<falcon-toast-adapter>` injecting the orchestrator, but that adapter renders the notification card, not the toast.)

## Integration gotchas

- `[CODE]` `<falcon-toast>` is NOT what the running app renders — wiring a feature to `<falcon-angular-toast>` directly produces a toast that no orchestrator/dispatcher will ever fire. Use `orchestrator.show(...)` / `FalconNotificationService.push(...)` / `withMessages(...)` instead.
- `[CODE]` `takeUntilDestroyed` in `<falcon-angular-message-host>` MUST receive an explicit `DestroyRef` (NG0203 trap) — only relevant if you revive the legacy host.
- `[CODE]` `maxToasts` on the host wrappers is unused — there is NO max-queue cap on either the legacy host or the orchestrator's single-active-toast model (the orchestrator shows one at a time by design).
- `[INFERRED]` One renderer per app — a second adapter/host = duplicate cards.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-toast.tsx, falcon-message-host.component.ts, falcon-message-orchestrator.service.ts, falcon-http-ui-dispatcher.service.ts, falcon-http-ui.config.ts. The 400→toast pipeline table is 🟢 CODE-VERIFIED against the live errorRules + dispatcher mapping. CORRECTED: `surface:'popup'` routes to the `business-error` top-tier toast (NOT a blocking modal); the live renderer is `<falcon-toast-adapter>` → notification card, NOT `<falcon-toast>`.
