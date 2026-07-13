# falcon-notification — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` The notification is how the platform delivers a *business-status message* — the outcome of an action ("Saved successfully", "Email already in use", "Failed to publish"). It is the **canonical, live** acknowledgement surface: the orchestrator renders THIS card for every transient message the app produces.

`[CODE]` falcon-notification.component.ts:24 — the unit of business meaning is `intent` (`success`/`info`/`warning`/`error`). Intent is the business signal; the other 15 inputs are pure appearance.

## The transient-messaging family — this card is the canonical surface (CORRECTED 2026-06-03)

`[CODE]` The prior dossier framed this as a "modern alternative to the toast substrate, thin production adoption." That is STALE. The current truth:

| Surface | Business role | Status |
|---|---|---|
| **`FalconMessageOrchestratorService.show({ category, … })`** → `<falcon-toast-adapter>` → **this card** | The single routing layer + the live renderer. What the running app fires. | ACTIVE — canonical. |
| **`FalconNotificationService.push(...)`** | Phase-5 thin shim into the orchestrator (`[CODE]` falcon-notification.service.ts:75-86). Legacy slices still call it. | ACTIVE — facade over orchestrator. |
| **`FalconToastService` / `withSuccess`/`withMessages`** | Imperative + per-HTTP-call builders → orchestrator. | ACTIVE — preferred for non-HTTP + HTTP feedback. |
| `FalconMessageService` + `<falcon-angular-message-host>` + `<falcon-toast>` | Original PrimeNG-parity path. | LEGACY — host dead-mounted. |
| `<falcon-angular-notification-stack>` | The card's OWN companion stack. | SUPERSEDED — `app.ts` mounts `<falcon-toast-adapter>` instead; its service feed returns `[]`. |

`[INFERRED]` Resolution for a builder: this CARD is the rendered surface for everything, but you reach it through the orchestrator (directly or via the facades) — not by embedding `<falcon-angular-notification>` or mounting the stack.

## PRD / business rules touched

`[CODE]` The orchestrator (not the card) enforces the message-routing PRD rules (`[CODE]` falcon-message-orchestrator.service.ts:1-37 + message-priorities.json):

| Rule | Source | How it is surfaced |
|---|---|---|
| Only ONE message visible per channel | `[CODE]` orchestrator `showOnlyOneMessage` | The orchestrator keeps one `activeToast`; the adapter renders one card. No stacking of multiple cards in the live path. |
| Action-required modal ALWAYS beats toast | `[CODE]` orchestrator `routeModal` + `suppressToastsWhenBlockingPopupVisible` | A blocking modal suppresses the toast card (stashed in `pendingToast`, promoted on modal close). |
| Latest-wins within a channel; no queues | `[CODE]` orchestrator `routeToast` (replace same-category / higher-priority) | A newer message replaces the visible card; lower-priority is dropped. |
| 3s duplicate suppression | `[CODE]` orchestrator `DEDUPE_WINDOW_MS = 3000` | Identical messages within 3s are coalesced. |
| Async-action feedback must be non-blocking | `[CODE]` falcon-notification.component.ts:282-294 (auto-dismiss `effect`) | `dismissMode:'auto'` self-dismisses after `dismissDurationSec` — the card never blocks. |
| Title is mandatory | `[CODE]` falcon-notification.component.ts:201 `input.required<string>()` | Every business message must state *what happened* (compile-time enforced). |

## Business constraints baked in

- `[CODE]` falcon-notification.component.ts:201 **`title` is REQUIRED** — a business message must always have a headline.
- `[CODE]` falcon-notification.component.ts:204-243 **Per-instance appearance > config default** (the `resolved*` computeds) — a page can override the look without touching global config; unset inputs fall back to `falcon-defaults.json.notification.*`. **Dismiss timing is config-owned** (`dismissDurationSec`), NOT a hardcoded 12s — the prior dossier's "12s default" is STALE (the card now reads config; the adapter passes no override).
- `[CODE]` falcon-notification.component.ts:73-74 **`role="status"` + `aria-live="polite"` ALWAYS** — unlike the toast, the card NEVER escalates to `assertive`, even for `error`. `[INFERRED]` business consequence: a notification is *informational*, never an interruption; truly assertive errors route through the orchestrator's `business-error` (top-tier) or the modal channel.
- `[CODE]` falcon-notification.component.ts:287-288 **`dismissMode:'manual'` disables the timer; `auto` clamps duration to `Math.max(1, …)`** — `auto` + `dismissDuration=0` does NOT mean "persistent," it means "1 second."
- `[INFERRED]` **One renderer per app** — a second adapter/stack renders duplicate cards.

## Business flows using this component

`[CODE]` The card renders the feedback for essentially every create/edit/HTTP flow, via the facades:

| Flow | Page | How it reaches the card |
|---|---|---|
| Add Client / Add User wizards | org-hierarchy-page | `FalconNotificationService.push` / `withMessages` → orchestrator → card. |
| Settings tab / Info panel | org-hierarchy-page | `FalconNotificationService.push` (settings-tab.signals.ts / info-panel-state.signals.ts). |
| Contracts cost management | admin-console | `FalconToastService` / `withMessages` (wizard / edit). |
| New wallet balance (both apps) | admin + management | `withMessages` / `FalconToastService` on transfer/save (wallet.service.ts). |
| Templates wizard | both apps | `FalconToastService` / `FalconNotificationService`. |
| Service pricing | host-shell | `FalconToastService`. |
| Global HTTP error/success | host-shell (all pages) | `FalconHttpUiDispatcherService` → orchestrator → card (incl. the 400→top-right error card). |
| Remote-MFE notifier facade | host-shell | `host-notifier.facade.ts` → `FalconNotificationService.push` (remotes call `window.FalconSDK` notify → this). |

## Business gotchas

- `[CODE]` falcon-notification.component.ts:50-54 **`warning` intent uses the `info` icon, not a ⚠ triangle** — a builder expecting an alert glyph for `warning` is surprised; the `'alert'` SVG case exists but no intent selects it (GAP G2).
- A notification auto-dismisses by default — it is **not a record**. For audit trails / re-readable history, the wrong surface.
- `[BRAIN-OUT]` Action-required decisions ("Delete this node?") must NOT be a notification — it has only a × dismiss, no confirm/cancel. Use the orchestrator's `action-required`/`configuration-required` (modal channel) — `[CODE]` the `FalconMessage` type carries `actionLabel`/`actionCallback`/`cancelCallback`/`hideCancel` for exactly this (`[CODE]` falcon-message-orchestrator.types.ts:59-77), rendered by `<falcon-modal-adapter>`.
- `[CODE]` There are **no slots** — `title` + `subtitle` TEXT only (GAP G3). Do not embed markup.
- The card has a visible countdown bar (the toast does not) — a deliberate UX upgrade: the user *sees* how long the message will stay.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-notification.component.ts + falcon-notification.service.ts + falcon-message-orchestrator.service.ts + .types.ts + the UI dossier files. CORRECTED: this card is the CANONICAL live surface (not "thin adoption"); `dismissDuration` is config-owned not 12s; routing PRD rules live in the orchestrator. Family split + routing rules are `[CODE]`-anchored to the orchestrator source.
