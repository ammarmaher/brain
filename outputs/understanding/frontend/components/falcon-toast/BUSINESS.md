# falcon-toast — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` The toast is how the platform tells the operator *"the thing you just did finished"* — a transient, self-dismissing acknowledgement. It confirms the outcome of an async operation (a save, an email send, a payment kick-off) without interrupting the next action. It carries no decision: the user is informed, not asked.

`[CODE]` falcon-toast.tsx:31-38 — the unit of business meaning is the `severity` prop (`info`/`success`/`warning`/`error`). Severity is the only business-bearing input; everything else (`duration`, `dismissible`, `actionLabel`) is presentation.

## The transient-messaging family — who is the canonical surface (CORRECTED 2026-06-03)

`[CODE]` This is the most-confused area of the library. The CURRENT canonical split (the prior dossier's claim that `FalconMessageService` is "the live production substrate" is now STALE):

| Surface | Role | Status (2026-06-03) |
|---|---|---|
| **`FalconMessageOrchestratorService.show({ category, … })`** → `<falcon-toast-adapter>` → `<falcon-angular-notification>` | The single message-routing layer (latest-wins, one-per-channel, 3s dedupe, modal-vs-toast). **THIS is what the running app fires.** Mounted once in `app.ts` (`[CODE]` app.ts:47-48). | ACTIVE — canonical. |
| **`FalconNotificationService.push({ intent, … })`** | Phase-5 thin shim that routes every push into the orchestrator (`[CODE]` falcon-notification.service.ts:75-86). Kept so legacy slices (settings-tab, info-panel, service-pricing, host-notifier facade) keep working. | ACTIVE — legacy facade over the orchestrator. |
| **`FalconToastService` / `FalconToastMessage` / `withSuccess`/`withMessages`** | Imperative + per-HTTP-call message builders; route through `FalconNotificationService` → orchestrator. | ACTIVE — preferred for non-HTTP + per-call HTTP feedback. |
| **`FalconMessageService` + `<falcon-angular-message-host>` + `<falcon-angular-toast>`** (THIS component) | Original PrimeNG `MessageService`/`<p-toast>` drop-in. `<falcon-toast>` is rendered ONLY here. | LEGACY — and the host is **dead-mounted** (app.ts uses the orchestrator adapters instead). |

`[INFERRED]` Resolution for a builder: `<falcon-toast>` is never instantiated in app code, and even its one composition (`<falcon-angular-message-host>`) is no longer mounted. The business surface for "did-what-you-asked" feedback is the orchestrator (directly or via the `FalconNotificationService`/`FalconToastService` facades), which renders the `notification` card — NOT this toast.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| Only ONE message visible per channel; action-required modal beats toast; latest-wins | `[CODE]` falcon-message-orchestrator.service.ts:1-37 + message-priorities.json | The toast COMPONENT does not enforce this — the orchestrator does. The toast is a dumb card; routing is upstream. |
| Async-action feedback must be non-blocking | `[INFERRED]` from auto-dismiss design (`[CODE]` falcon-toast.tsx:78-85) | Toast self-dismisses after `duration` (default 5000ms) — the operator is never required to acknowledge. |
| Critical errors must be acknowledged | `[BRAIN-OUT]` OVERVIEW "When NOT to use it" + `[CODE]` falcon-http-ui.config.ts:33-37 (403/404→`surface:'popup'`) | A toast is the wrong surface for must-acknowledge errors; the orchestrator routes those to `business-error` (top-tier) or a blocking modal. |
| Severity drives a11y urgency | `[CODE]` falcon-toast.tsx:132-133 | `warning`/`error` → `role="alert"` + `aria-live="assertive"`; `info`/`success` → `role="status"` + `aria-live="polite"`. |

## Business constraints baked in

- `[CODE]` falcon-toast.tsx:78-79 **Auto-dismiss is the default contract** — `duration=5000`. Making it permanent (`duration<=0`) contradicts its business role.
- `[CODE]` falcon-toast.tsx:87-98 **Hover/focus pauses the timer** — "don't let a message vanish while the user is reading it." `handlePauseTimer` halts; `handleResumeTimer` restarts with the remaining time.
- `[CODE]` falcon-toast.tsx:158 **`message` is rendered as TEXT, not HTML** — business messages cannot embed links/markup; use the `action` slot for an actionable affordance.
- `[INFERRED]` **The deprecation of `<falcon-toast>` is a code-style + architecture statement, not a behavior change** — it still works; it is simply no longer the surface the platform renders.

## Business flows using this component

`[CODE]` In the CURRENT codebase, the create/edit flows that historically fired toasts now go through the orchestrator-backed facades:

| Flow | Page | How feedback is fired today |
|---|---|---|
| Add Client wizard | org-hierarchy-page | `[CODE]` add-client-wizard.signals.ts uses `FalconNotificationService` / `withMessages` → orchestrator → notification card (NOT `<falcon-toast>`). |
| Add User wizard | org-hierarchy-page | `[CODE]` add-user-wizard/services/user.service.ts → same orchestrator-backed path. |
| Settings tab / Info panel | org-hierarchy-page | `[CODE]` settings-tab.signals.ts + info-panel-state.signals.ts → `FalconNotificationService` → orchestrator. |
| Global HTTP error/success | host-shell (all pages) | `[CODE]` falcon-http-ui-dispatcher.service.ts → `orchestrator.show(...)` → notification card. |

> The `<falcon-toast>` component itself participates in NONE of these at runtime today.

## Business gotchas

- A toast that auto-dismisses is **not a record** — fire-and-forget. If the business needs an audit trail or re-readable history, the toast (and the notification card) is the wrong surface.
- `[BRAIN-OUT]` Putting a critical, must-act error in a toast is a *business bug* — the user can miss it. The orchestrator routes such errors to `business-error` (top-tier toast) or the modal channel.
- `[CODE]` PrimeNG used `severity:'warn'`; the legacy `FalconMessageService` normalized it to `'warning'` — irrelevant to new code, which uses orchestrator `category` values.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-toast.tsx + falcon-message-orchestrator.service.ts + falcon-notification.service.ts + falcon-http-ui.config.ts + the UI dossier files. CORRECTED the prior "FalconMessageService is the live substrate" claim: the live surface is the orchestrator → notification card (`[CODE]` app.ts:47-48 mounts the adapters, not the message-host). Family split is `[CODE]`-anchored to the orchestrator source + Phase-5 shim comments.
