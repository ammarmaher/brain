# falcon-message-host — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The message-host has **no visible business surface of its own** — it is the *bridge* that turns the legacy `FalconMessageService.add()` stream into stacked toasts. Its business value is **migration economics**: it preserves the PrimeNG `MessageService` firing API so an app can move off PrimeNG `<p-toast>` *without rewriting every `add()` call site*.

`[CODE]` `falcon-message-host.component.ts:29-56` — it subscribes to `FalconMessageService.messages$` and renders one `<falcon-angular-toast>` per active `FalconMessage` inside one `<falcon-angular-toast-host>`. It is plumbing, not a widget.

## Is this the legacy/dead surface?
`[MEMORY]` + `[CODE]` **Clarification — the message-host is NOT dead.** This is a frequent confusion. Precise status:

| Thing | Status | Why |
|---|---|---|
| `<falcon-toast>` (the Stencil component) | `@deprecated` per registry — prefer notification for new code. | Style guidance only. |
| `<falcon-angular-message-host>` (this component) | **ACTIVE — substrate.** Not deprecated. | It is the live bridge production code depends on. |
| `FalconMessageService` | **ACTIVE — substrate.** Not deprecated. | `[CODE]` `response-interceptor.ts`, `add-client-wizard.signals.ts`, `add-user-state.signals.ts` all fire it today. |
| `FalconNotificationService` + `<falcon-angular-notification-stack>` | ACTIVE — **preferred for net-new code.** | The modern signal-based path. |

`[INFERRED]` Resolution: "message-host is legacy/dead" overstates it. It is the **PrimeNG-compat substrate** — alive and load-bearing. What is *deprecated for new code* is reaching for the toast/message path **instead of** the notification path when writing something brand new. Existing flows that already fire `FalconMessageService` keep working through this host indefinitely.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Migration must not require rewriting message call-sites | `[BRAIN-OUT]` `OVERVIEW.md` "Replaces PrimeNG `<p-toast>`" | The host preserves `add()/addAll()/remove()/clear()` + the `{severity,summary,detail,life,closable,icon}` shape — call sites are import-path-only changes. |
| One transient-feedback surface per app | `[CODE]` singleton `FalconMessageService` + `[BRAIN-OUT]` "Mount ONCE" | Mounting two hosts renders duplicate toasts — the business invariant is a single feedback channel. |
| `severity:'warn'` (PrimeNG) must keep working | `[CODE]` `falcon-message-service.ts:55-58` | `stamp()` aliases `'warn'` → `'warning'` so migrated PrimeNG code is not broken by the rename. |

## Business constraints baked in
- `[CODE]` `falcon-message-host.component.ts:30` **Default `position='top-right'`** — the business-default corner for transient feedback.
- `[CODE]` `falcon-message-service.ts:33-37` **`add()` accepts a single message or an array** — PrimeNG parity; batching is one render.
- `[INFERRED]` **One host per app shell** — `FalconMessageService` is `providedIn:'root'`; a second host subscribes the same stream and double-renders every toast.
- `[CODE]` `falcon-message-host.component.ts:41-48` **Subscription is `DestroyRef`-scoped** — the host cleans up on destroy; it does not leak the `messages$` subscription.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| App-shell mount | host-shell `app.ts` | `[CODE]` mounted once — the single transient-feedback channel for the whole shell. |
| Global HTTP error feedback | host-shell (all pages) | `[CODE]` `response-interceptor.ts` fires `FalconMessageService` on request failure → this host renders the error toast. |
| Add Client wizard | organization-hierarchy | `[CODE]` `add-client-wizard.signals.ts` fires `FalconMessageService.add(...)` → this host renders step/submit outcome toasts. |
| Add User wizard | organization-hierarchy | `[CODE]` `add-user-state.signals.ts` — same pattern. |

## Business gotchas
- The message-host is invisible — it has **no anatomy of its own**; everything visible is the `<falcon-toast>` it renders. Restyling "the message-host" means restyling toast tokens.
- `[INFERRED]` "Use notification for new code" is a *style* rule about the firing API choice, not a reason to remove or distrust the message-host — it is a live substrate.
- A message-host that is never mounted means `FalconMessageService.add()` calls **render nothing** — the messages queue silently in the `BehaviorSubject`. A "toasts not appearing" bug is usually a missing host mount.
- `[CODE]` `falcon-message-service.ts:9` `life:0` makes a toast sticky (no auto-dismiss) — combining `life:0` with `closable:false` produces an immortal, un-closable toast (business anti-pattern).

## Verification
🟡 CODE-DERIVED from `falcon-message-host.component.ts` + `falcon-message-service.ts` + the 6 UI dossier files. The "not dead — substrate" clarification is `[MEMORY]` + `[CODE]`-anchored. Production consumer set ✅ VERIFIED via `[CODE]` grep in `USAGE.md`.
