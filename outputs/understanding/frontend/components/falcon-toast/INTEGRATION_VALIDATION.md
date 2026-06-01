# falcon-toast — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-toast.tsx` is purely presentational — it owns no data, calls no endpoint. The *content* of a toast (the `summary`/`detail` strings passed to `FalconMessageService.add`) originates wherever the firing code lives:
- `[CODE]` `response-interceptor.ts` — HTTP error responses from any backend module (Commerce / Charging / Provisioning / Identity) surface as error toasts. The toast has no module affinity; it renders whatever the interceptor caught.
- `[CODE]` `add-client-wizard.signals.ts` / `add-user-state.signals.ts` — outcome strings from Commerce/Identity flows.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The component binds to **no endpoint**. It renders strings handed to `FalconMessageService.add()` by the firing code. |

`[INFERRED]` Integration is entirely *inbound from app code* — there is no outbound HTTP from this component. The "integration surface" is the `FalconMessageService` API, not a network boundary.

## Service API surface (the real integration contract)
`[CODE]` `falcon-message-service.ts`:
| Method | Signature | Purpose |
|---|---|---|
| `add` | `add(message: FalconMessage \| FalconMessage[]): void` | Fire one or many toasts. PrimeNG-compatible. |
| `addAll` | `addAll(messages: FalconMessage[]): void` | Alias of `add` for PrimeNG parity. |
| `remove` | `remove(id: string): void` | Drop a single toast by auto-stamped id. |
| `clear` | `clear(): void` | Drop every active toast. |
| `messages$` | `Observable<FalconMessage[]>` | `BehaviorSubject`-backed stream the message-host subscribes to. |

`FalconMessage` shape `[CODE]` `falcon-message-service.ts:9-21`: `{ id?, severity?, summary?, detail?, life?, closable?, icon? }`. `life` maps to toast `duration`; `closable` maps to `dismissible`; `severity:'warn'` → `'warning'`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | **No validation.** The toast neither validates input nor gates form submission. It is a display-only outcome surface. |

`[INFERRED]` Validation belongs to the *flow that fires the toast* — the toast merely paints the result of validation that already happened upstream.

## PES keys gating this component
**None.** `[INFERRED]` Transient feedback is not permission-gated — every authenticated user sees the toast for actions they were already permitted to attempt. PES gating happens on the *action*, not on its acknowledgement.

## State / signal pattern
`[CODE]` `falcon-message-host.component.ts:38-48` — the message-host holds a `signal<FalconMessage[]>`; `ngOnInit` subscribes `service.messages$` with `takeUntilDestroyed(this.destroyRef)` and `.set()`s the signal. The template renders one `<falcon-angular-toast>` per message inside one `<falcon-angular-toast-host>`.
`[CODE]` `falcon-toast.tsx:47-98` — each toast owns its **own** auto-dismiss timer (`autoTimer`, `remainingMs`, `timerStartedAt`). The host does not drive the timer; it only stacks. Hover/focus pause is per-toast-element state.

`[CODE]` `falcon-toast.component.ts:32-33` — the Angular wrapper calls `defineFalconTwComponent('falcon-toast')` in `ngOnInit` to lazily register the Stencil custom element (Wave 5 on-demand registration).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-toast>` (Shadow, `shadow:true` `[CODE]` `falcon-toast.tsx:26`) / `<falcon-toast-tw>` (Light DOM). Pure presentational; owns the timer.
- **Stencil host skeleton** — `<falcon-toast-host>` / `<falcon-toast-host-tw>`. Positioner only.
- **Angular wrappers** — `<falcon-angular-toast>` + `<falcon-angular-toast-host>`: thin `@Input()`-based pass-through, no CVA. `useTailwind=true` default switches to the Light-DOM render path.
- **Angular composition** — `<falcon-angular-message-host>` injects `FalconMessageService` and composes toast + toast-host. **This is the only layer that touches a service** — per `feedback_library_skeleton_app_api`, the skeleton stays service-free.

## Error-pipeline behavior
`[CODE]` `response-interceptor.ts` (per `USAGE.md`) — the host-shell HTTP response interceptor fires `FalconMessageService.add({severity:'error', ...})` on caught request failures. `[MEMORY]` the broader error pipeline at `falcon-http-ui.config.ts` routes 400 → top-right business-validation toast (12s), 422 → warning toast — those toasts also flow through this same `FalconMessageService` → message-host → `<falcon-toast>` chain.

## Integration gotchas
- `[CODE]` `falcon-message-host.component.ts:41-48` **`takeUntilDestroyed` MUST receive an explicit `DestroyRef`** — it is called in `ngOnInit` (outside the injection context). Omitting it throws `NG0203` and the host renders blank. This is a documented trap in the source comment itself.
- `[INFERRED]` **`add()` before host mount queues silently** — `messages$` is a `BehaviorSubject`; messages fired before the host mounts sit in the subject and render on mount. Generally fine, but there is no max-queue cap (`GAPS_AND_UPGRADES.md` P2).
- `[CODE]` `falcon-message-service.ts:33-37` **`add([msg1,msg2])` is one `next()`** — batching is one render; calling `add()` in a loop triggers a render per call.
- `[INFERRED]` **One message-host per app** — singleton service + a second host = duplicate toasts.

## Verification
🟡 CODE-DERIVED from `falcon-toast.tsx`, `falcon-message-service.ts`, `falcon-message-host.component.ts`, `falcon-toast.component.ts`. Error-pipeline routing is `[MEMORY]`-anchored. Production consumer set ✅ VERIFIED via `[CODE]` grep in `USAGE.md`.
