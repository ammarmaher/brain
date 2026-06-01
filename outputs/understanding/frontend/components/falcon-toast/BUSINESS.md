# falcon-toast — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The toast is how the platform tells the operator *"the thing you just did finished"* — a transient, self-dismissing acknowledgement. In business terms it confirms the outcome of an async operation (a save, an email send, a payment kick-off) without interrupting the user's next action. It carries no decision: the user is informed, not asked.

`[CODE]` `falcon-toast.tsx:31-38` — the unit of business meaning is the `severity` prop (`info`/`success`/`warning`/`error`). Severity is the only business-bearing input; everything else (`duration`, `dismissible`, `actionLabel`) is presentation.

## The notification family — toast vs notification vs message-host
`[MEMORY]` + `[CODE]` This is the most-confused area of the library. The canonical split:

| Surface | Role | Status |
|---|---|---|
| **`FalconMessageService` + `<falcon-angular-message-host>` + `<falcon-angular-toast>`** | PrimeNG-compat substrate. `add({severity,summary,detail,life})` mirrors PrimeNG `MessageService`. **This is the surface production code actually fires today** — `[CODE]` `response-interceptor.ts`, `add-client-wizard.signals.ts`, `add-user-state.signals.ts` all inject `FalconMessageService`. | `<falcon-toast>` itself is `@deprecated` per registry; the *service path* is the live production substrate. |
| **`FalconNotificationService` + `<falcon-angular-notification-stack>` + `<falcon-angular-notification>`** | Modern signal-based stack. Preferred for *new* business-status messages. | ACTIVE — preferred. |
| **`<falcon-angular-message-host>`** | The bridge component that turns `FalconMessageService` events into stacked toasts. Not deprecated — it is the substrate. | ACTIVE — substrate. |

`[INFERRED]` Resolution for a builder: `<falcon-toast>` is never instantiated directly in app code. You either (a) fire `FalconMessageService.add(...)` and let the message-host render toasts for you, or (b) for net-new code use the notification path. The toast component is plumbing under the message-host, not a consumer-facing widget.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Async-action feedback must be non-blocking | `[INFERRED]` from auto-dismiss design (`falcon-toast.tsx:78-85`) | Toast self-dismisses after `duration` (default 5000ms) — the operator is never required to acknowledge. |
| Critical errors must be acknowledged | `[BRAIN-OUT]` `OVERVIEW.md` "When NOT to use it" | A toast is the *wrong* surface for must-acknowledge errors — those belong in `<falcon-angular-popup>` / confirm-dialog. The toast deliberately cannot enforce acknowledgement. |
| Severity drives a11y urgency | `[CODE]` `falcon-toast.tsx:132-133` | `warning`/`error` → `role="alert"` + `aria-live="assertive"`; `info`/`success` → `role="status"` + `aria-live="polite"`. The business severity directly sets how assertively a screen reader interrupts. |

## Business constraints baked in
- `[CODE]` `falcon-toast.tsx:78-79` **Auto-dismiss is the default contract** — `duration=5000`. A toast is *transient by design*; making it permanent (`duration<=0`) contradicts its business role.
- `[CODE]` `falcon-toast.tsx:87-98` **Hover/focus pauses the timer** — the business intent is "don't let a message vanish while the user is reading it." `handlePauseTimer` halts the countdown; `handleResumeTimer` restarts with the remaining time.
- `[CODE]` `falcon-message-service.ts:55-64` **`severity:'warn'` is aliased to `'warning'`** — PrimeNG used `'warn'`; Falcon normalizes it so migrated code keeps working without a rename.
- `[INFERRED]` **One message-host per app** — `FalconMessageService` is a root singleton; a second host would render duplicate toasts. The "one source of truth for transient feedback" is a business invariant of the substrate.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard | organization-hierarchy | `[CODE]` `add-client-wizard.signals.ts` fires `FalconMessageService.add(...)` on step/submit outcomes — message-host renders the toast. |
| Add User wizard | organization-hierarchy | `[CODE]` `add-user-state.signals.ts` — same pattern, success/error feedback. |
| Global HTTP error feedback | host-shell (all pages) | `[CODE]` `response-interceptor.ts` fires an error toast on failed requests — platform-wide async-failure surface. |

## Business gotchas
- A toast that auto-dismisses is **not a record** — if the business needs an audit trail or a re-readable history, the toast is the wrong surface (it is fire-and-forget).
- `[BRAIN-OUT]` `OVERVIEW.md` Putting a critical, must-act error in a toast is a *business bug* — the user can miss it entirely. Errors that block the flow belong in a dialog.
- `[CODE]` `falcon-toast.tsx:158` The `message` prop is rendered as **text, not HTML** — business messages cannot embed links/markup in `message`; use the `action` slot for an actionable affordance.
- The deprecation of `<falcon-toast>` is a *code-style* statement, not a behavior change — the `FalconMessageService` path it powers is fully supported and is what real flows use.

## Verification
🟡 CODE-DERIVED from `falcon-toast.tsx` + `falcon-message-service.ts` + the 6 UI dossier files. Production consumer set ✅ VERIFIED via `[CODE]` grep in `USAGE.md` (Add Client / Add User / response-interceptor confirmed). The notification-family split is `[MEMORY]`-anchored doctrine.
