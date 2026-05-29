# falcon-notification — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The notification is how the platform delivers a *business-status message* — the modern, preferred surface for telling the operator the outcome of an action ("Saved successfully", "Email already in use", "Failed to publish"). Where the toast is a PrimeNG-compat substrate, the notification is the **forward-looking** acknowledgement surface for net-new code.

`[CODE]` `falcon-notification.component.ts:24` — the unit of business meaning is `intent` (`success`/`info`/`warning`/`error`). Intent is the business signal; the other 13 inputs are pure appearance (`glossy`, `countdownHeight`, `leftAccent`, etc.).

## The notification family — toast vs notification vs message-host
`[MEMORY]` + `[CODE]` The canonical split (see `falcon-toast/BUSINESS.md` for the full table):

| Surface | Business role | Status |
|---|---|---|
| **`FalconNotificationService` + `<falcon-angular-notification-stack>` + `<falcon-angular-notification>`** | Modern signal-based stack. **Preferred for new business-status messages.** | ACTIVE — preferred. |
| `FalconMessageService` + `<falcon-angular-message-host>` + `<falcon-toast>` | PrimeNG-compat substrate. What production flows fire *today*. | substrate; toast is `@deprecated`. |
| `<falcon-angular-message-host>` | Bridges the legacy `MessageService` stream to stacked toasts. | substrate. |

`[INFERRED]` Resolution for a builder: for any **new** acknowledgement surface, use `FalconNotificationService.push(...)`. The notification and toast are *parallel* stacks — do not mix their semantics on the same page (`USAGE`-level rule).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Async-action feedback must be non-blocking | `[CODE]` `falcon-notification.component.ts:282-294` (auto-dismiss `effect`) | `dismissMode:'auto'` self-dismisses after `dismissDuration` (default 12s) — the operator is informed, never required to acknowledge. |
| Validation feedback should be visible long enough to read | `[CODE]` service default `dismissDuration ?? 12` (`falcon-notification.service.ts:46`) | 12s default — longer than the toast's 5s, deliberately, because validation feedback ("Email already in use") needs reading time. |
| `manual` mode for messages that must not vanish | `[CODE]` `falcon-notification.component.ts:287` | `dismissMode:'manual'` disables the timer entirely — the card stays until the user clicks ×. Used for outcomes the business wants persistent but still non-blocking. |
| Title is mandatory on every notification | `[CODE]` `falcon-notification.component.ts:201` `input.required<string>()` | A notification with no headline is rejected at compile time — every business message must state *what happened*. |

## Business constraints baked in
- `[CODE]` `falcon-notification.component.ts:201` **`title` is REQUIRED** (`input.required`) — `FalconNotificationPushArgs.title` is non-optional. A business message must always have a headline.
- `[CODE]` `falcon-notification.service.ts:43-44` **Defaults are `dismissMode:'auto'`, `dismissDuration:12`** — the business default is "transient, 12 seconds."
- `[CODE]` `falcon-notification.component.ts:75-76` **`role="status"` + `aria-live="polite"` always** — unlike the toast, the notification never escalates to `assertive` even for `error` intent. `[INFERRED]` business consequence: a notification is *informational*, never an interruption; truly assertive errors belong in a dialog.
- `[CODE]` `falcon-notification.component.ts:204-219` **Per-instance appearance always wins over service defaults** — the `resolved*` computeds enforce `instance > FalconConfigurationService default`. A page can override the look without touching global config.
- `[INFERRED]` **One notification-stack per app** — `FalconNotificationService` is a root singleton; a second stack renders duplicates.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| UI library showcase | host-shell `falcon-ui-showcase` | `[CODE]` `library-section.component.ts` / `falcon-ui-showcase.component.ts` — demonstration of the component. |
| (recommended) net-new async-action feedback | any page | `[BRAIN-OUT]` the preferred surface for new save/publish/validation outcomes — `FalconNotificationService.push({intent, title, subtitle})`. |

`[INFERRED]` Production *flow* adoption is still thin — the verified Add Client / Add User wizards fire the **toast** substrate (`FalconMessageService`), not the notification. The notification is the recommended target, not yet the dominant production path.

## Business gotchas
- `[CODE]` `falcon-notification.component.ts:50-54` **`warning` intent uses the `info` icon, not an alert/triangle icon** — a builder expecting a ⚠ triangle for `warning` will be surprised; the icon map deliberately gives `warning` the info-circle. (The `alert` icon exists in the `@switch` but no intent selects it.)
- A notification auto-dismisses by default — it is **not a record**. For audit trails or re-readable history, this is the wrong surface.
- `[BRAIN-OUT]` Action-required decisions ("Delete this node?") must NOT be a notification — it has no confirm/cancel affordance, only a × dismiss. Use `<falcon-angular-popup>`.
- `[CODE]` `API.md` There are **no slots** — `title` + `subtitle` text only. Rich/HTML content is not supported; do not try to embed markup.
- Notification has a visible countdown bar (`falcon-notif-countdown`) — the toast does not. This is a deliberate UX upgrade: the user *sees* how long the message will stay.

## Verification
🟡 CODE-DERIVED from `falcon-notification.component.ts` + `falcon-notification.service.ts` + the 6 UI dossier files. The notification-family split is `[MEMORY]`-anchored doctrine. Production-flow adoption claim is `[INFERRED]` from the toast being the verified Add Client / Add User path.
