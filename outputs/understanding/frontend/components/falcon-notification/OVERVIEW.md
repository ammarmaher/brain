# falcon-notification — OVERVIEW

## Component purpose

**Passive intent-keyed message card** with 4 intents (`success` / `info` / `warning` / `error`). Visual: a card with an intent-coloured icon chip, title + optional subtitle, optional left-accent border, optional countdown depletion bar (top / bottom / glossy), and an optional glossy frosted-glass backdrop. 16 appearance inputs control the look. **Angular-only** — there is NO Stencil tag, no Shadow/Light split, no `useTailwind` switch (unlike toast/tooltip).

`[CODE]` **THIS card is the live renderer for ALL platform transient messages.** `<falcon-toast-adapter>` (mounted once in `app.ts`) subscribes to `FalconMessageOrchestratorService.activeToast()` and renders exactly one `<falcon-angular-notification>` per active message (`[CODE]` falcon-toast-adapter.component.ts:73-93, app.ts:48). Whatever a feature fires — `orchestrator.show(...)`, `FalconNotificationService.push(...)`, `FalconToastService`, the HTTP dispatcher's `withMessages()` — surfaces as THIS card.

## Business / UI use case

- Async-action results ("Saved successfully", "Failed to publish").
- Validation feedback ("Email already in use").
- HTTP error/success feedback (400 → top-right error card; per-call success via `withSuccess()`).
- Business-status messages (the canonical surface — preferred over toast for everything).

## When to use it / when NOT to use it

**Use it for:**
- Any transient feedback after an action (the live message surface).
- Per-page status messages (the single card, standalone, off the orchestrator).

**Do NOT use it for:**
- Action-required decisions (confirm/cancel) — use the orchestrator's `modal` channel (`action-required` / `configuration-required`) rendered by `<falcon-modal-adapter>`.
- Tooltips → `<falcon-angular-tooltip>`; drawers / dialogs → their components.
- PrimeNG `MessageService` parity — historically `<falcon-angular-toast>` (now superseded too).

## Status

`[CODE]` **ACTIVE — the canonical message card.** Promoted from `apps/demo/angular` into `@falcon/ui-core/angular`. The single card `<falcon-angular-notification>` is the live renderer (via the toast-adapter). The companion `<falcon-angular-notification-stack>` is **superseded** — `app.ts` mounts `<falcon-toast-adapter>` (NOT the stack) since the Phase-5 / Wave-7 migration (`[CODE]` app.ts:47-48); the stack class still exists + is functional but is no longer mounted.

## Replaces

- Bespoke alert / toast patterns in the legacy demo app.
- `[INFERRED]` Increasingly, `<falcon-angular-toast>` for app messaging (the orchestrator renders this card instead).

## Source file paths

| Layer | Path |
|---|---|
| Single card component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts` (315 ln; inline template + inline `styles:`) |
| Stack component (superseded) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts` (187 ln) |
| Notification service (Phase-5 shim) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification.service.ts` (101 ln) |
| Toast service (imperative facade) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-toast.service.ts` (52 ln) |
| HTTP messages (per-call) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-http-messages.ts` (134 ln) |
| HTTP-UI config token | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-http-ui.tokens.ts` (71 ln) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/index.ts` |
| Live renderer (adapter) | `libs/falcon-ui-core/src/services/message-orchestrator/adapters/falcon-toast-adapter.component.ts` |
| Routing layer (orchestrator) | `libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.service.ts` (320 ln) |
| Stencil sources | **None** — notification is Angular-only (no Stencil tag). |
| Token file | **None** — uses Falcon palette tokens directly through Tailwind utilities + inline `[style.*]`. |
| Spec / e2e | **None** for the card itself; the orchestrator + dispatcher + stack-position helper are tested in `apps/host-shell/tests/{falcon-message-orchestrator,falcon-http-ui-dispatcher,falcon-notification-stack-position}.spec.ts`. |

## Selectors / tags

- Single card: `falcon-angular-notification`.
- Stack (superseded): `falcon-angular-notification-stack`.
- No Stencil tags.

## Known consumers (grep verified 2026-06-03)

`[CODE]` grep across the repo (excl. node_modules) — the notification messaging family is consumed by **~45 files** (the actual platform message surface). Breakdown by entry point:

- **Live renderer:** `libs/falcon-ui-core/src/services/message-orchestrator/adapters/falcon-toast-adapter.component.ts` imports `FalconAngularNotificationComponent` directly. `apps/host-shell/src/app/app.ts` mounts `<falcon-toast-adapter />`.
- **`FalconNotificationService.push(...)`** consumers (legacy facade → orchestrator): `apps/host-shell/falcon-facades/host-notifier.facade.ts`, `apps/{admin,management}-console/.../org-hierarchy-page/.../settings-tab/signals/settings-tab.signals.ts`, `.../falcon-org-info-panel/signals/info-panel-state.signals.ts`, `.../add-user-wizard/services/user.service.ts`, `.../add-client-wizard/{signals,services}`, `.../org-hierarchy-page/services/services.ts`.
- **`FalconToastService` / `withSuccess` / `withMessages` / `FalconToastMessage`** consumers: `apps/admin-console/.../contracts-cost-management/**` (wizard / edit / models), `apps/{admin,management}-console/.../new-wallet-balance/**`, `apps/{admin,management}-console/.../templates-page/.../templates-wizard.component.ts`, `apps/host-shell/.../service-pricing/**`, `apps/host-shell/.../do-payment-priority-popup/**`.
- **HTTP dispatcher:** `apps/host-shell/src/app/core/http-ui/{falcon-http-ui-dispatcher.service.ts, falcon-http-ui.config.ts}`.
- **Barrel:** `libs/falcon/src/shared-ui/index.ts:371` re-exports `FalconAngularNotificationComponent`.
- **Showcase:** `apps/host-shell/.../falcon-ui-showcase/{library-section,falcon-ui-showcase}.component.ts`.

See `USAGE.md` Consumer Sweep for the enumerated list + counts. (The prior dossier listed only the showcase as a consumer — that was the SINGLE-CARD direct embed; the real adoption is via the service facades + orchestrator, ~45 files.)

## Related components

- `falcon-message-orchestrator` (`FalconMessageOrchestratorService`) — the routing brain; renders this card via the toast-adapter.
- `falcon-toast-adapter` — the live renderer off `orchestrator.activeToast()`.
- `falcon-modal-adapter` — the orchestrator's OTHER channel (blocking modal) — sibling renderer.
- `falcon-angular-toast` — the older PrimeNG-parity card; superseded by this one for app messaging.
- `FalconNotificationService` / `FalconToastService` — facades that route into the orchestrator.
- `FalconConfigurationService` (`configurations`) — supplies the card's appearance defaults (`notification.*` from `falcon-defaults.json`).
- `FalconStackingService` — the stack registers its Top-Layer'd container here.

## Ownership / responsibility

`libs/falcon-ui-core` (Angular wrapper layer). Owned by Falcon UI team. The orchestrator + adapter + this card together form the platform message system.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). All source paths re-confirmed; consumer sweep re-run (~45 files via orchestrator/facades, NOT just the showcase). CORRECTED: this card is the LIVE renderer (via toast-adapter); the STACK is superseded/dead-mounted (`[CODE]` app.ts:47-48); the service is a Phase-5 shim over the orchestrator.
