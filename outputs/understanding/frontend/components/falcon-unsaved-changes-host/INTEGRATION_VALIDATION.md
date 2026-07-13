# falcon-unsaved-changes-host — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` the service + host are client-side leave-protection plumbing — they own no data and call no endpoint. The decision (`true`/`false`) is consumed entirely in the browser by the leave path (router guard / tab / wizard). Any subsequent save/discard is the consumer's concern, not this unit's.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The unit binds to **no endpoint**. `confirm()` calls `orchestrator.show()` (in-app) and returns an Observable. |

## Route-guard ↔ host ↔ confirm wiring (the real integration contract)

`[CODE]` This is a **route-guard-driven imperative host**. The chain (Phase 5):

```
Router CanDeactivate / tab-switch / tree-select / menu / wizard-close
        │  (consumer decides "is dirty?")
        ▼
consumer.confirmDiscardIfDirty()  ──not dirty──▶ of(true)  (proceed, no prompt)
        │  dirty
        ▼
FalconUnsavedChangesService.confirm({ titleOverride, bodyOverride, confirmLabelOverride, … })
        │
        ▼
orchestrator.show({ category:'action-required', actionCallback:()=>resolve(true), cancelCallback:()=>resolve(false), correlationId })
        │                                            │
        ▼ (priority 1000, modal, blocking)           ▼
FalconModalAdapterComponent renders <falcon-angular-popup>  →  Discard ⇒ actionCallback ⇒ resolve(true)
                                                            →  Stay/×/Esc/backdrop ⇒ cancelCallback ⇒ resolve(false)
        │
        ▼
Observable<boolean> emits once → consumer proceeds (true) or stays (false)
```

`[CODE]` `hierarchy-page-state.service.ts:205-260` is the canonical consumer: `confirmDiscardIfDirty()` aggregates `infoDirty || settingsDirty || addClientDirty || addUserDirty || drawerDirty`, picks a context body key, calls `confirm()`, and on `true` resets the dirty surface (`tap((leave) => …)`) BEFORE the leave proceeds. A functional `CanDeactivateFn` returns this Observable.

> **The `<falcon-unsaved-changes-host>` component is NOT in this live chain in Phase 5** — `service.active()` is always null, so the host's `@if (active())` popup never mounts. The orchestrator's modal-adapter is the renderer. The host is dead weight (G-DEAD-HOST).

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Strict category | orchestrator `category` | `confirm()` always passes `'action-required'` (valid) | N/A — the service can never trigger the orchestrator's unknown-category throw. |
| — | `confirm()` options | — | **No validation.** Empty options → English-default copy; no rejection. |

## PES keys gating this unit

**None.** `[INFERRED]` The leave-confirmation is not permission-gated — it inherits the gate of whatever surface holds the dirty edits (the operator already passed the edit-permission check to have unsaved changes).

## State / signal pattern

`[CODE]` `falcon-unsaved-changes.service.ts`:
- **Active resolver:** `activeResolve: ((leave: boolean) => void) | null` (:34) — the in-flight `confirm()`'s settle fn. A new `confirm()` resolves the previous one `false` first (:46-50).
- **One-shot Observable:** `confirm()` returns `new Observable<boolean>((subscriber) => { … })` (:44) with a `settled` guard so it emits exactly once + completes (:54-61). The teardown fn (:83-88) retracts via `dismissByCorrelationId` + resolves `false` if unsubscribed before settle.
- **Legacy slot:** `_active = signal(null)` + `active = computed(...)` (:37-38) — always null in Phase 5; only the no-op host reads it.
- **Orchestrator state:** the real modal lives in `orchestrator._activeModal` (signal); the modal-adapter binds `activeModal()`. `correlationId` (`falcon-unsaved|{ts}|{rand}`, :52) ties the service's retract to the orchestrator's message.

## Skeleton ↔ app-wrapper layering

`[CODE]` **No Stencil skeleton.** Angular-only. The (never-rendered) `<falcon-angular-popup>` is itself a pure-Angular component (no Stencil twin) composing `[falconOverlay]`.
- **Service-touching layer:** `FalconUnsavedChangesService` (delegates to the orchestrator).
- **Render layer (live):** `FalconModalAdapterComponent` (orchestrator-bound), NOT this host.
- Per `feedback_library_skeleton_app_api`, the service is cleanly separated from any skeleton — there just is no skeleton here.

## Integration gotchas

- `[CODE]` **`confirm()` is one-shot** — subscribe once per decision; it completes after the single emit. Re-subscribing a cold Observable would open a SECOND confirm.
- `[CODE]` **Sequential cancel** — overlapping `confirm()` calls resolve the earlier `false`. Two leave-gates racing → the first silently "stays".
- `[CODE]` **`hintOverride` + `cancelLabelOverride` are dropped/unmapped** — the orchestrator `action-required` message has no `hint` or `cancelLabel` field (`falcon-message-orchestrator.types.ts:38-82`). Callers passing them (org-hierarchy gate, both wizards) get no hint line and the modal-adapter's default cancel label. (G-HINT-DROP.)
- `[CODE]` **`accept()`/`reject()` are courtesy shims** — they settle the active resolver; the no-op host's `(confirm)`/`(cancel)` call them, but since the host never renders, they are reachable in Phase 5 only via a direct call (rare).
- `[CODE]` **Unsubscribe = stay** — if the consumer's `takeUntilDestroyed` tears down the subscription (component destroyed) before the user decides, the teardown resolves `false` + retracts the orchestrator message. Correct, but means a navigated-away-by-other-means component cancels its own prompt.
- `[INFERRED]` **Dirty-state is the consumer's** — the unit never inspects forms; "didn't prompt" = the consumer's dirty flag was false.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — one-shot Observable + sequential-cancel + unsubscribe-teardown + `correlationId` retract + the dropped `hintOverride`/`cancelLabelOverride` all confirmed in `falcon-unsaved-changes.service.ts` + the orchestrator types. The route-guard↔confirm chain anchored to `hierarchy-page-state.service.ts confirmDiscardIfDirty()`. Backend wiring = none.
