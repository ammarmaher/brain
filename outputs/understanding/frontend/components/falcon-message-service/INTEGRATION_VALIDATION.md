# falcon-message-service — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` the shim + host are presentational plumbing — they own no data and call no endpoint. Message *content* originates wherever `FalconMessageService.add()` (or, canonically, `FalconMessageOrchestratorService.show()`) is called. The most consequential firing points are the templates review actions and the platform HTTP-error pipeline, so the toasts surfaced can carry errors from **any** backend module (Commerce / Charging / Provisioning / Identity), but the unit has no module affinity.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The shim binds to **no endpoint**. It calls `orchestrator.show()` (in-app). |

## Service API surface (the real integration contract)

`[CODE]` `falcon-message-service.ts` — `FalconMessageService` (`providedIn:'root'`) delegates 1:1 to `FalconMessageOrchestratorService`:

| Shim member | Delegates to | 
|---|---|
| `add(msg)` | `orchestrator.show({ category, title, message, source:'falcon-message-service-shim', correlationId })` per message |
| `addAll(msgs)` | `add(msgs)` |
| `remove(id)` | `orchestrator.dismissByCorrelationId(id)` |
| `clear()` | `orchestrator.clearAll()` |
| `messages$` | dead `BehaviorSubject([])` — never updated |

### The successor contract (what the shim integrates with)

`[CODE]` `falcon-message-orchestrator.service.ts` `FalconMessageOrchestratorService` (`providedIn:'root'`):

| Member | Signature | Purpose |
|---|---|---|
| `show` | `show(request: FalconMessageRequest): string` | Resolve category → priority entry; dedupe (3s window); route to modal or toast; return assigned id or `''` if dropped/deduped. |
| `dismiss` | `dismiss(id?: string): void` | Dismiss by id, or topmost (modal-first) when no id. |
| `dismissByCorrelationId` | `dismissByCorrelationId(correlationId: string): void` | Retract by caller-supplied correlation (the shim's `remove` path). |
| `clearAll` | `clearAll(): void` | Clear every channel + dedupe ledger. |
| `activeModal` / `activeToast` | `Signal<FalconMessage \| null>` | Read-only signals the adapters bind. |

`[CODE]` `message-priorities.json` — 7 categories with priorities: `action-required` (1000, modal, blocking), `configuration-required` (900, modal, blocking), `business-error` (700, toast), `validation-error` (600, toast), `warning` (500, toast), `info` (400, toast), `success` (300, toast, latestOnly). Bound at bootstrap by `provideMessageOrchestrator()` (`[CODE]` `falcon-message-orchestrator.providers.ts:161-183`) via an app-initializer that validates the JSON and freezes the lookup map. **Misconfiguration throws at bootstrap, not at first `show()`** (`:163-167`).

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Strict category | orchestrator `category` | unknown category passed to `show()` | `[CODE]` `falcon-message-orchestrator.service.ts:281-288` — **throws** `[FalconMessageOrchestrator] Unknown category "X"`. The shim can NEVER trigger this (its mapping only emits valid categories), but a direct orchestrator caller can. |
| Config schema | `message-priorities.json` rows | bootstrap | `[CODE]` `providers.ts:63-95` — throws naming the missing/invalid field. |
| — | shim `add()` input | — | **No validation.** `add({})` (empty) produces an empty-title/empty-message toast (the orchestrator does not reject it). |

## PES keys gating this unit

**None.** `[INFERRED]` The transient-feedback channel is not permission-gated.

## State / signal pattern

`[CODE]` Two-shim-over-one-authority:
- **Shim service** holds a dead `_messages$ = new BehaviorSubject<FalconMessage[]>([])` (`:68`) that is never `.next()`-ed (the old write path was removed). It exists only so the no-op host compiles.
- **Orchestrator** holds the real state: `_activeModal` / `_activeToast` / `_pendingToast` writable signals + a `recentDedupe` Map (`:70-86`). Adapters bind `activeModal()` / `activeToast()`.
- **No-op host** mirrors the dead stream into a `signal<FalconMessage[]>([])` (`falcon-message-host.component.ts:38-47`) — always empty.

Auto-dismiss is owned by the toast-adapter's notification card (reads `dismissDurationSec` from `falcon-defaults.json`), NOT the orchestrator's own timer (`[CODE]` orchestrator `:239-248`). The orchestrator no longer schedules `setTimeout` for toasts.

## Skeleton ↔ app-wrapper layering

`[CODE]` **There is no Stencil skeleton for this unit** — Angular-only. The historical render children (`<falcon-angular-toast>` / `<falcon-angular-toast-host>`) carry the Shadow/Light split, but they are never mounted in Phase 5.
- **Service-touching layer:** the shim service (delegates to the orchestrator).
- **Render layer (live):** `FalconToastAdapterComponent` (orchestrator-bound), NOT the message-host.
- Per `feedback_library_skeleton_app_api`, the service is cleanly separated from any skeleton — there just is no skeleton here.

## Error-pipeline behavior

`[CODE]` In Phase 5 the platform HTTP-error pipeline routes through the orchestrator **directly** (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-http-messages.ts` + the host-shell HTTP-UI config), not through this shim. `[MEMORY]` the broader pipeline (400 → business-validation toast, 422 → warning) lands on the orchestrator's toast channel. The shim is now a *parallel side-entrance* used only by PrimeNG-shaped callers (templates-list).

## Integration gotchas

- `[CODE]` `falcon-message-host.component.ts:41-48` **`takeUntilDestroyed(this.destroyRef)` is still mandatory IF the host's subscription were ever live** — the source comment warns of `NG0203` + a blank page. In Phase 5 the stream is dead so the trap is moot, but the pattern is preserved (do not strip it while the host exists).
- `[CODE]` **`messages$` is a dead end** — subscribing yields only `[]`. The old dossier's "feature code MAY subscribe for analytics" is now a no-op trap.
- `[CODE]` **`remove(id)` only works if the caller passed a stable `id`** — auto-IDs (`falcon-msg|{seq}`) are not retained by the caller, so `remove()` of an auto-id message is impractical. Pass an `id` if you intend to retract.
- `[CODE]` **The shim never produces a modal** — if a legacy caller needs a blocking acknowledgement, it must move to `FalconConfirmService` / the orchestrator's `action-required` category.
- `[CODE]` `angular-wrapper/index.ts:89-97` **duplicate `FalconMessage` export** — the orchestrator type is aliased to `FalconOrchestratorMessage` to dodge the clash; importing the wrong one is a silent type mismatch.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — shim→orchestrator delegation (add/remove/clear), strict-category throw, bootstrap validation, dead `messages$`, and adapter-owned auto-dismiss all confirmed in live source. Backend wiring = none. HTTP-error pipeline routing to the orchestrator (not the shim) is `[CODE]`-anchored via `falcon-http-messages.ts` presence + `[MEMORY]`.
