# falcon-notification — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` falcon-notification.component.ts is presentational — owns no data, calls no endpoint. The *content* (`title`/`subtitle`) originates wherever the firing code lives. No backend-module affinity.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The card binds to no endpoint. Integration is inbound from app code, via the orchestrator + facades. |

## The orchestrator — the routing contract behind the card (the real integration surface)

`[CODE]` `FalconMessageOrchestratorService` (`libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.service.ts`, 320 ln) is THE integration layer:

- `show(request): string` — strict-category routing (`[CODE]` lines 94-112). `request: FalconMessageRequest = Omit<FalconMessage, 'id'|'priority'|'createdAt'>` → `{ category, title, message, source, dedupeKey?, actionLabel?, actionCallback?, cancelCallback?, hideCancel?, correlationId?, params? }`. Returns the assigned id (`''` if dropped/deduped).
- `dismiss(id?)` / `dismissByCorrelationId(correlationId)` / `clearAll()` (`[CODE]` lines 116-165).
- Internal signals: `_activeModal` / `_activeToast` / `_pendingToast` (`[CODE]` lines 70-83). Public read-only `activeModal` / `activeToast` computeds — bound by the two adapters.
- 7 strict categories (`[CODE]` falcon-message-orchestrator.types.ts:22-29): `action-required` / `configuration-required` / `business-error` / `validation-error` / `warning` / `info` / `success`. Throws on unknown category (`[CODE]` lines 277-289).
- `presentation` ∈ `modal` | `toast` per `message-priorities.json` (loaded by `provideMessageOrchestrator()` into `MESSAGE_PRIORITIES`). `modal`-presentation categories render via `<falcon-modal-adapter>`; `toast`-presentation via `<falcon-toast-adapter>` → **this card**.

`[CODE]` Routing rules (the PRD acceptance criteria, in code):
- Modal: lower-priority DROPPED, same/higher REPLACE (latest-wins); a blocking modal `clearActiveToastButPreservePending()` (`[CODE]` lines 171-192).
- Toast: same-category → latest-wins; different category → higher priority replaces, lower DROPPED; if a blocking modal is active, stash in `pendingToast`, promote on modal close (`[CODE]` lines 194-261).
- Dedupe: identical `dedupeKey` within 3s suppressed (`[CODE]` lines 296-309).

## The 400 → top-right toast HTTP error pipeline (canonical, CODE-VERIFIED)

`[CODE]` `apps/host-shell/src/app/core/http-ui/falcon-http-ui.config.ts` defines `errorRules`; `FalconHttpUiDispatcherService` (`falcon-http-ui-dispatcher.service.ts`) resolves a rule and calls `orchestrator.show(...)` (`source: 'http-interceptor'`); the orchestrator → `<falcon-toast-adapter>` → **this card** renders it top-right. `surface:'popup'` does NOT mean a blocking `<dialog>` — it maps to the `business-error` category (top-tier toast) — `[CODE]` falcon-http-ui-dispatcher.service.ts:180-184. Live ladder:

| HTTP status | errorRule | Orchestrator category | Rendered as (this card, top-right) |
|---|---|---|---|
| **400** | `{ surface:'toast', toastIntent:'error', title:'Bad request' }` | `business-error` | error card |
| 403 | `{ surface:'popup', title:'Access denied' }` | `business-error` | error card |
| 404 | `{ surface:'popup', title:'Not found' }` | `business-error` | error card |
| 422 | `{ surface:'toast', toastIntent:'warning' }` | `warning` | warning card |
| applicationError (200 + `isSuccessful:false`) | `{ surface:'toast', toastIntent:'error', title:'Validation error' }` | `validation-error` | warning card |
| 4xx/5xx/network/default | `{ surface:'popup', … }` | `business-error` | error card |
| per-call success (`withSuccess`) | — | `success` | success card |

`[CODE]` 401 is owned by the AuthService refresh flow inside ResponseInterceptor and never reaches the dispatcher. Auto-dismiss timing is owned by THIS card (reads `dismissDurationSec` from `falcon-defaults.json` via `FalconConfigurationService`) — the orchestrator schedules NO timer (`[CODE]` falcon-message-orchestrator.service.ts:239-248). `category → intent` in the adapter: `business-error`/`action-required`→`error`, `validation-error`/`configuration-required`/`warning`→`warning`, `info`→`info`, `success`→`success` (`[CODE]` falcon-toast-adapter.component.ts:58-66).

## Service API surface (facades)

| Service | Method | Purpose |
|---|---|---|
| `FalconNotificationService` (Phase-5 shim) | `push(args): number` | → `orchestrator.show(...)`; returns a stable numeric id via `correlationId: 'falcon-notification|<id>'`. `active()` ALWAYS `[]`. `dismiss(id)` → `dismissByCorrelationId`. `clear()` → `clearAll()`. |
| `FalconToastService` | `show / success / error / warning / info` | → `FalconNotificationService.push` → orchestrator. Non-HTTP imperative facade. |
| per-call HTTP | `withSuccess / withError / withMessages / withMessagesOn` | Attach `FalconHttpMessages` to the request context; the interceptor reads `FALCON_HTTP_MESSAGES` and fires via the dispatcher → orchestrator. |

## Validation rules (V-*)

| V-rule | Field | Trigger | Error |
|---|---|---|---|
| Compile-time required | `title` | calling `push()` / the card without `title` | `[CODE]` `input.required<string>()` — Angular type error, not a runtime V-rule. |

`[INFERRED]` The card performs NO input validation and gates NO form — display-only.

## PES keys gating this component

**None.** `[INFERRED]` Transient feedback is not permission-gated — the gate is on the *action*.

## State / signal pattern

`[CODE]` falcon-notification.service.ts:66-67 — the shim holds `_active = signal<FalconNotification[]>([])`; `active` is a read-only `computed` that **always returns `[]`** because the orchestrator (not the shim) owns the queue. `push` no longer updates `_active` — it routes to `orchestrator.show()`.
`[CODE]` falcon-notification-stack.component.ts:173-187 — the stack injects `FalconNotificationService` and renders `@for (n of active(); track n.id)`. Since `active()` is `[]`, **a mounted stack renders nothing** (it is doubly dead: not mounted in `app.ts`, and fed an empty signal). 
`[CODE]` falcon-notification.component.ts:282-297 — each card's auto-dismiss runs in an Angular `effect()` (re-runs on `open()`/`dismissMode` change); `setTimeout(dismissDuration*1000)`; cleared on `destroyRef.onDestroy` AND `ngOnDestroy` (double-guarded).
`[CODE]` falcon-notification.component.ts:204-243 — the resolved-getter pattern: appearance inputs are `input<T|undefined>(undefined)`; `resolved* = input() ?? cfg.notification.<key>`. Priority: instance > config app-override > JSON default.

## Top Layer / Popover integration (stack + adapter)

`[CODE]` Both the stack and the toast-adapter wrap their container in `[falconOverlay]="'toast'"` + `[falconOpen]="true"` (`FalconOverlayDirective`) (`[CODE]` falcon-notification-stack.component.ts:62-72 / falcon-toast-adapter.component.ts:75-81). While a message is active, the container enters the browser Top Layer (`popover="manual"` + `showPopover()`) above every modal/drawer; `FalconStackingService` re-asserts it on every subsequent modal/drawer registration so notifications stay topmost (priority-1 rule). The `@layer falcon-overlay { :host [popover] {…} }` block clears UA popover defaults WITHOUT `!important` so the Tailwind anchor utilities (`top-[4.75rem]`/`right-6`) win (`[CODE]` falcon-notification-stack.component.ts:110-149 — a documented 2026-05-24 positioning-regression fix). The legacy `z-[100001]` is a defence-in-depth fallback for browsers without Popover support.

## Skeleton ↔ app-wrapper layering

`[CODE]` **No Stencil skeleton** — notification is Angular-only. No custom element, no Shadow/Light split, no `useTailwind`.
- **Single card** — `<falcon-angular-notification>`: signal-input driven, `OnPush`. Service-free except `FalconConfigurationService` (read-only defaults).
- **Stack** (superseded) — `<falcon-angular-notification-stack>`: injects `FalconNotificationService` (the shim → `[]`).
- **Live renderer** — `<falcon-toast-adapter>`: injects `FalconMessageOrchestratorService`, renders one card off `activeToast()`. THIS is the layer that touches the routing service — per `feedback_library_skeleton_app_api` the card stays service-free.

## Integration gotchas

- `[CODE]` falcon-notification.component.ts:50-54 **`warning` renders the `info` icon** — the `'alert'` SVG case is unreachable (GAP G2).
- `[CODE]` falcon-notification.service.ts:66-67 **`active()` always returns `[]`** — any code reading the signal sees nothing; the orchestrator is the source of truth.
- `[CODE]` **A mounted `<falcon-angular-notification-stack>` is inert** — superseded by `<falcon-toast-adapter>` (app.ts) AND fed an empty signal. Do not mount it.
- `[CODE]` falcon-notification.component.ts:288 **`auto` + `dismissDuration=0` ≠ persistent** — `Math.max(1, …)` clamps to 1s. Use `manual`.
- `[CODE]` falcon-notification.component.ts:204-207 **`undefined` (not `null`) is the config-fallback sentinel.**
- `[CODE]` ids are per-service-instance counters (shim `nextId`) / orchestrator UUIDs — not interchangeable; don't persist across sessions.
- `[CODE]` falcon-http-ui-dispatcher.service.ts:45-67 **DI-identity trap** — `FALCON_HTTP_UI_CONFIG` + `FalconMessageOrchestratorService` MUST be imported via the umbrella `@falcon/ui-core/angular` (NOT a deep path) or Module Federation registers two share-scope entries → two tokens → NG0201. (Documented in the dispatcher source.)

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) from falcon-notification.component.ts, .service.ts, -stack.component.ts, falcon-message-orchestrator.service.ts + .types.ts, falcon-toast-adapter.component.ts, falcon-http-ui-dispatcher.service.ts, falcon-http-ui.config.ts. The 400→toast table is 🟢 CODE-VERIFIED. CORRECTED the prior "not wired into HTTP pipeline" (it IS, via orchestrator) + "stack is the live queue" (superseded + `active()`→`[]`). Added the orchestrator routing rules, the Top-Layer integration, and the DI-identity MF trap.
