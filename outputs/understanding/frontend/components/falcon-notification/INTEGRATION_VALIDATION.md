# falcon-notification — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-notification.component.ts` is presentational — it owns no data and calls no endpoint. The *content* of a notification (the `title`/`subtitle` strings passed to `FalconNotificationService.push`) originates wherever the firing code lives. Like the toast, the notification has no backend-module affinity; it renders whatever outcome string the firing flow hands it.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The component binds to **no endpoint**. Integration is entirely inbound from app code via the service API. |

## Service API surface (the real integration contract)
`[CODE]` `falcon-notification.service.ts`:
| Method | Signature | Purpose |
|---|---|---|
| `push` | `push(args: FalconNotificationPushArgs): number` | Fire a notification; returns the assigned numeric `id`. |
| `dismiss` | `dismiss(id: number): void` | Remove one notification by id. |
| `clear` | `clear(): void` | Remove every active notification. |
| `active` | `computed<FalconNotification[]>` | Signal the stack reads to render. |

`FalconNotificationPushArgs` `[CODE]` `falcon-notification.service.ts:21-27`: `{ intent, title, subtitle?, dismissMode?, dismissDuration? }`. `intent` + `title` are mandatory; `dismissMode` defaults `'auto'`, `dismissDuration` defaults `12` (seconds).

`[INFERRED]` Note the contrast with `FalconMessageService`: notification ids are **numbers** (`nextId++`), message-service ids are **strings** (`falcon-msg-N`); notification uses **signals**, message-service uses a **`BehaviorSubject`**. They are not interchangeable services.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Compile-time required | `title` | calling `push()` / `<falcon-angular-notification>` without `title` | `[CODE]` `input.required<string>()` — Angular template/type error, not a runtime V-rule. |

`[INFERRED]` The notification performs **no input validation and gates no form**. It is a display-only outcome surface; validation belongs to the flow that fires it.

## PES keys gating this component
**None.** `[INFERRED]` Transient feedback is not permission-gated — the PES gate is on the *action*, not on its acknowledgement.

## State / signal pattern
`[CODE]` `falcon-notification.service.ts:31-32` — the service holds `_active = signal<FalconNotification[]>([])`; `active` is a `computed` exposed read-only. `push` does `_active.update(list => [...list, notif])`.
`[CODE]` `falcon-notification-stack.component.ts:99-100` — the stack injects the service and renders `@for (n of active(); track n.id)`.
`[CODE]` `falcon-notification.component.ts:282-297` — each card's auto-dismiss runs inside an Angular `effect()` that re-runs on `open()` / `dismissMode` change; `setTimeout` for `dismissDuration*1000` ms; `clearTimer()` on `destroyRef.onDestroy` AND `ngOnDestroy` (double-guarded).
`[CODE]` `falcon-notification.component.ts:204-243` — the **resolved-getter pattern**: every appearance input is `input<T | undefined>(undefined)`; a `resolved*` computed does `this.input() ?? this.cfg.notification.<key>`. Priority chain: per-instance binding > `FalconConfigurationService` app override > JSON default.

## Skeleton ↔ app-wrapper layering
`[CODE]` `OVERVIEW.md` **There is no Stencil skeleton** — notification is **Angular-only**. No `<falcon-notification>` custom element, no Shadow/Light split, no `useTailwind` switch. The component template is inline with Tailwind utility classes and an inline `<style>` block for the slide-in + countdown keyframes.
- **Single card** — `<falcon-angular-notification>`: signal-input driven, `OnPush`.
- **Stack** — `<falcon-angular-notification-stack>`: injects `FalconNotificationService`, mounts once. This is the only layer that touches a service — the card itself is service-free except for `FalconConfigurationService` (read-only defaults).

## Error-pipeline behavior
`[INFERRED]` The notification is **not** currently wired into the host-shell HTTP error pipeline — `falcon-http-ui.config.ts` / `response-interceptor.ts` fire `FalconMessageService` (the toast path). A team migrating error feedback to the notification stack would need to re-point the interceptor at `FalconNotificationService.push`.

## Integration gotchas
- `[CODE]` `falcon-notification.component.ts:50-54` **`warning` intent renders the `info` icon** — the `INTENTS` map gives `warning` `icon:'info'`. The `'alert'` case exists in the SVG `@switch` but is unreachable. A consumer expecting a ⚠ triangle gets an info-circle.
- `[CODE]` `falcon-notification-stack.component.ts:29-40` **Stack position is a pure helper** — `falconNotificationStackContainerClasses(position)` maps `top/bottom`+`left/right` to Tailwind classes; `top` anchors at `top-[4.75rem]` (clears the topbar). RTL handled by the `left-6`/`right-6` choice, not logical properties — verify direction when mirroring.
- `[INFERRED]` **One stack per app** — singleton service + a second stack = duplicate cards.
- `[CODE]` `falcon-notification.component.ts:204-207` (Wave 19 comment) **`undefined` is the sentinel for "use config default"** — passing an explicit value always wins; passing nothing falls through to `FalconConfigurationService`. Do not pass `null` expecting a reset — only `undefined` triggers the fallback.
- `[CODE]` ids are per-service-instance counters (`nextId`), not globally unique — fine for a singleton, but do not persist a notification id across sessions.

## Verification
🟡 CODE-DERIVED from `falcon-notification.component.ts`, `falcon-notification.service.ts`, `falcon-notification-stack.component.ts` + the 6 UI dossier files. Error-pipeline non-wiring is `[INFERRED]` (toast path is the verified pipeline per `falcon-toast` memory).
