# falcon-message-host — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-message-host.component.ts` is presentational plumbing — it owns no data and calls no endpoint. The message *content* originates wherever `FalconMessageService.add()` is called. The most consequential firing point is the HTTP response interceptor, so the toasts the host renders effectively surface errors from **any** backend module (Commerce / Charging / Provisioning / Identity) — but the host itself has no module affinity.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The host binds to **no endpoint**. It subscribes to an in-app RxJS stream (`FalconMessageService.messages$`). |

## Service API surface (the real integration contract)
`[CODE]` `falcon-message-service.ts` — `FalconMessageService` (`providedIn:'root'`):
| Member | Signature | Purpose |
|---|---|---|
| `add` | `add(message: FalconMessage \| FalconMessage[]): void` | Fire one or many messages. PrimeNG-compatible. |
| `addAll` | `addAll(messages: FalconMessage[]): void` | Alias of `add`. |
| `remove` | `remove(id: string): void` | Drop one message by id. |
| `clear` | `clear(): void` | Drop all messages. |
| `messages$` | `Observable<FalconMessage[]>` | `BehaviorSubject`-backed stream the host subscribes to. |

`FalconMessage` `[CODE]` `falcon-message-service.ts:9-21`: `{ id?, severity?, summary?, detail?, life?, closable?, icon? }` — the PrimeNG-`MessageService`-compatible shape. `stamp()` auto-assigns `id = falcon-msg-{seq}` and maps `severity:'warn'→'warning'`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | **No validation.** The host neither validates input nor gates any form. It is a display-only rendering bridge. |

## PES keys gating this component
**None.** `[INFERRED]` The transient-feedback channel is not permission-gated.

## State / signal pattern
`[CODE]` `falcon-message-host.component.ts:38-48` — the host holds `messages = signal<FalconMessage[]>([])`. `ngOnInit` does `service.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(next => this.messages.set(next))`. The template `@for`s over `messages()` with `trackById` (uses `m.id`).
`[CODE]` `falcon-message-service.ts:27` — the service holds the source of truth: `_messages$ = new BehaviorSubject<FalconMessage[]>([])`. `add` does `_messages$.next([...value, ...stamped])`.

Two-layer state: the **service** owns an RxJS `BehaviorSubject`; the **host** mirrors it into an Angular `signal` for `OnPush` template rendering. Note this differs from `FalconNotificationService`, which is signal-native end to end.

## Skeleton ↔ app-wrapper layering
`[CODE]` `OVERVIEW.md` **There is no Stencil skeleton** — message-host is **Angular-only**. No `<falcon-message-host>` custom element.
- **The host** — `<falcon-angular-message-host>`: injects `FalconMessageService`, subscribes the stream, composes `<falcon-angular-toast>` + `<falcon-angular-toast-host>`. This is the app-wrapper layer that touches a service.
- **The rendered children** — `<falcon-angular-toast>` (Stencil-backed) + `<falcon-angular-toast-host>` (Stencil-backed positioner) — those carry the Shadow/Light skeleton split; the message-host itself does not.
- Per `feedback_library_skeleton_app_api`, the service-touching layer (this host) is separate from the presentational skeleton (the toast) — a clean adherence.

## Error-pipeline behavior
`[CODE]` `response-interceptor.ts` (per `OVERVIEW.md` known consumers) — the host-shell HTTP response interceptor injects `FalconMessageService` and fires `add({severity:'error', summary, detail})` on caught failures. `[MEMORY]` the broader pipeline at `falcon-http-ui.config.ts` (400 → 12s business-validation toast, 422 → warning toast) routes through this same service → host → toast chain. The message-host is the **render endpoint** of the platform error pipeline.

## Integration gotchas
- `[CODE]` `falcon-message-host.component.ts:41-48` **`takeUntilDestroyed(this.destroyRef)` is mandatory** — the subscription happens in `ngOnInit`, outside the injection context. The source comment is explicit: without the explicit `DestroyRef`, Angular throws `NG0203` and **the host renders a blank page**. This is the single most important trap for this component.
- `[INFERRED]` **Host not mounted → silent no-op** — `add()` calls queue in the `BehaviorSubject` and render nothing. "Toasts not showing" = missing host mount in the app shell.
- `[INFERRED]` **One host per app** — singleton service; a second host double-subscribes and renders duplicates.
- `[CODE]` `falcon-message-service.ts:23` **`__idSeq` is a module-level counter** — ids are unique per app session, not globally. Fine for `trackById`; do not persist.
- `[CODE]` `falcon-message-host.component.ts:50-52` `onDismiss(id)` calls `service.remove(id)` — dismissing a toast removes it from the service stream, not just the view. The service is the single source of truth.

## Verification
🟡 CODE-DERIVED from `falcon-message-host.component.ts` + `falcon-message-service.ts` + the 6 UI dossier files. Error-pipeline routing is `[MEMORY]`-anchored. Production consumer set ✅ VERIFIED via `[CODE]` grep in `USAGE.md`. The `NG0203` trap ✅ VERIFIED in the source comment itself.
