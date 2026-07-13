# falcon-message-service — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify when the answer is the imperative message API, and which Falcon API to reach for (the canonical orchestrator vs the legacy shim).

## Visual fingerprint

`[CODE]` **The shim + host have NO visual fingerprint of their own** — and in Phase 5 the host renders nothing at all. What a viewer sees is a transient **toast** (compact rounded corner card, intent icon, ×, optional countdown bar, auto-vanishing, stacked at a corner) — but that toast is produced by the **orchestrator's notification card** (`FalconToastAdapterComponent`), not by this unit. You never recognize a "message-service" from a screenshot; you recognize a **toast**, then choose the *mechanism* that fires it.

## When the design points HERE (the shim) vs the orchestrator

A design / snippet implies **imperative, global, fire-and-forget toast feedback** when:
- It shows a transient corner toast (auto-dismiss), NOT a must-acknowledge modal.
- The firing is imperative + global — "any service / interceptor / component can pop a message" — i.e. a `MessageService.add()` / `toast()` call pattern, not a card bound to component state.

Then choose between two Falcon APIs:
- **NEW code → `FalconMessageOrchestratorService.show({ category, title, message, source })`** — the canonical authority. Use this.
- **Migrating PrimeNG `MessageService.add(...)` → `FalconMessageService.add(...)`** — the shim. Use ONLY to avoid rewriting an existing call site.

## Cross-library equivalents

| Library | Their equivalent | Parity notes |
|---|---|---|
| PrimeNG | `MessageService` (injectable) driving `<p-toast>` | **direct 1:1 lineage** — `FalconMessageService` IS the drop-in. `add/addAll/remove/clear` + `{severity,summary,detail}` preserved; `life`/`closable`/`icon` now ignored. |
| MUI | `notistack` `<SnackbarProvider>` + `useSnackbar().enqueueSnackbar()` | provider-mounted-once + imperative-enqueue. Falcon's modern equivalent is the orchestrator + adapters. |
| Ant Design | global `message` / `notification` static API | Ant's app-wide static API ≈ the singleton service. |
| shadcn / Radix | `sonner`'s `<Toaster/>` + `toast()` | mount-once container + imperative call. Falcon: orchestrator adapters mounted once + `show()`. |
| plain HTML | a fixed container + `showToast()` | always replace with `FalconMessageOrchestratorService.show()`. |

## Use THIS vs siblings

| If the scenario shows… | Use | Not |
|---|---|---|
| **net-new** imperative global toast | `FalconMessageOrchestratorService.show()` | `FalconMessageService` (legacy) |
| migrating a PrimeNG `MessageService.add()` call site | `FalconMessageService.add()` (shim) | rewriting to the orchestrator immediately (do it later) |
| component-bound passive feedback / countdown card | `FalconNotificationService.push()` + `<falcon-angular-notification-stack>` | the shim |
| a must-acknowledge decision (confirm/discard) | `FalconConfirmService` / `FalconUnsavedChangesService` (→ orchestrator `action-required` modal) | the shim (it can't produce a modal) |
| a single toast bound to one component's local state | `<falcon-angular-toast>` in a local `<falcon-angular-toast-host>` | the shim |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Provider** — `providers: [...provideMessageOrchestrator(), ...]` once per app; mount the adapters (`<falcon-angular-toast-adapter>` + `<falcon-angular-modal-adapter>`) once in the shell. (NOT a new `<falcon-angular-message-host>`.)
2. **Inputs** — none on the shim service. The orchestrator `show()` request carries `category` / `title` / `message` / `source` (+ optional `dedupeKey`, `correlationId`, `params`, and for modals `actionLabel`/`actionCallback`/`cancelCallback`/`hideCancel`).
3. **No slots / no templates** — neither the shim nor the orchestrator projects content; the card visual is the notification component.
4. **Tokens** — none on this unit. Configure `falcon-defaults.json.notification` to restyle/retime.
5. **Upgrade** — do not extend the shim. New capability goes in the orchestrator.
6. **Wrapper** — only the shim itself is a "wrapper" (over the orchestrator); do not add another.

## Anti-patterns

- Reaching for `FalconMessageService` in **net-new** code — use the orchestrator.
- Subscribing to `FalconMessageService.messages$` — dead (`[]`).
- Mounting `<falcon-angular-message-host>` expecting it to render toasts — it renders nothing in Phase 5.
- Relying on `life`/`closable`/`icon` — ignored.
- Importing the wrong `FalconMessage` — use `FalconOrchestratorMessage` for the orchestrator shape.
- Trying to fire a blocking modal via `.add()` — impossible; `severityToCategory` only emits toast categories.

## Verification
🟡 CODE-DERIVED from `falcon-message-service.ts` + the orchestrator service. The "no visual fingerprint — recognize the toast instead" framing is `[INFERRED]` (carried forward from the old `falcon-message-host` dossier, still valid). PrimeNG 1:1 lineage ✅ via OVERVIEW "Replaces". Cross-library map `[INFERRED]`.
