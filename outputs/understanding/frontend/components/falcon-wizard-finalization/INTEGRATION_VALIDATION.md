# falcon-wizard-finalization — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The orchestrator is **presentational — NO HTTP, NO entity services, NO router** (`[CODE]` ts:58-60). The actual create-and-send call is the host-supplied `submitFn`, which targets whichever module owns the flow:
- **Add Client finalization** → the host `addClientSubmitFn` (account/owner creation + credential send) — **Commerce** (account/node) + **Identity** (owner user / credential delivery). `[INFERRED]` from the org-hierarchy domain.
- **Add User finalization** → the host `addUserSubmitFn` — **Identity** (user creation + credential delivery). `[INFERRED]`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req) | Gateway | Notes |
|---|---|---|---|---|---|
| (host `submitFn`) | `POST` | Identity / Commerce (host's choice) | host payload + `method: 'email'\|'sms'\|'both'` | System Gateway (admin) / Core Gateway (mgmt) | `[CODE]` The orchestrator only calls `submitFn()(method)` (ts:202); the endpoint/DTO/gateway are entirely the host's. |

> `[CODE]` ts:196-225 — the orchestrator's sole backend touch is invoking the injected `submitFn()(method): Observable<unknown>` and reacting to its `next`/`error`. It does NOT know the endpoint, DTO, gateway, or auth — those live in the host state slice (`add-client-wizard.signals.ts` / `add-user-state.signals.ts` / `client.service.ts`). Per `[MEMORY]` feedback_library_skeleton_app_api — the library never fetches.

## Validation rules (V-*)
The orchestrator runs **flow-control validation only**, not field validation:

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| Single-shot submit | — | second Send while in flight | `onSend` early-returns (`if submitting() return`, ts:197) + Send button disabled (`[disableSend]="submitting()"`) |
| Channel method required | delivery method | Send | the channel dialog supplies a non-empty `FalconCredentialDeliveryMethod` (`'email'\|'sms'\|'both'`) — there is no "no method" state |
| Error-message sanitation | thrown error | `submitFn` errors | `errorMessageFrom` (ts:283-293) returns `''` for empty/whitespace/bracket-sentinel → static `errorToastBody` used; otherwise the clean message is shown (BUG-14) |

> The owner name/phone/email are display passthroughs — there is no validation that they are well-formed; the host is responsible for supplying valid summary data.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits the wizard's create permission) | finalize / send credentials | the host only flips `[open]="true"` for an operator who was allowed to create the entity; the orchestrator has no PES key of its own |
| `[INFERRED]` backend create/send authorization | the real send | enforced by the backend on the `submitFn` POST — the orchestrator's flow gates are UX, not security |

The orchestrator has no PES key — it inherits the create-flow gate of the host wizard.

## State / signal pattern
`[CODE]` falcon-wizard-finalization.component.ts:
- Internal `submitting = signal(false)`, `successOpen = signal(false)`, `pickerOpen = computed(() => open() && !submitting() && !successOpen())` (ts:158-167).
- **Two injected platform services:** `FalconMessageOrchestratorService` (ts:169 — error toast) + `FalconLoaderService` from `@falcon/studio/runtime` (ts:170 — counter-based central overlay). Both are the SAME singletons every other Falcon caller uses; the host-shell app shell mounts `<falcon-angular-loader-inline>` bound to `loader.overlayVisible()`.
- **`loaderDismiss: FalconLoaderDismiss | null`** (ts:176) — the disposer for the in-flight loader slice; explicitly dismissed (ts:298-301) BEFORE the next UI mounts, so the success dialog never stacks on the loader. `ngOnDestroy` (ts:307-309) releases it if the host unmounts mid-flight (prevents the counter overlay leaking a slot).
- **The rxjs minimum-visibility gate** (ts:202-224): `submitFn()(method).pipe(concatMap(v => minLoaderGate$(startedAt).pipe(map(() => v))), catchError(err => minLoaderGate$(startedAt).pipe(switchMap(() => throwError(() => err)))), finalize(() => submitting.set(false)), takeUntilDestroyed(destroyRef))`. The gate emits after the remaining 600 ms or synchronously if already elapsed.
- Error pipeline: the submit error is surfaced by THIS component (orchestrator `business-error` toast); it does NOT flow through the host-shell HTTP error interceptor's generic 400→toast path (the orchestrator owns the message). 

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton** — this is a pure Angular composite (no `<falcon-image-uploader>`-style web component). It mounts two OTHER Angular dialog components.
- **Composite layer (this component)** — owns the picker↔loader↔success↔error state machine, the minimum-visibility gate, and the loader lifecycle. Injects two platform services. Pure orchestration.
- **App / state layer** — the host owns `submitFn` (the API call), the `open` signal, the owner summary, and the `finalized`/`cancelled` reactions (close the popup / refresh the tree). Per `feedback_library_skeleton_app_api`, the orchestrator never fetches.

## Integration gotchas
- `[CODE]` **`submitFn` MUST return an Observable** — the gate uses `concatMap`/`catchError`/`finalize`; a Promise-returning `submitFn` would need `from(...)`. The type is `(method) => Observable<unknown>`.
- `[CODE]` **The loader is dismissed BEFORE the success/error UI** — never mount your own success UI inside `submitFn`; let the orchestrator dismiss the loader then show the inline success dialog.
- `[CODE]` **Do not double-mount the child dialogs** — the orchestrator owns both `<falcon-angular-sending-credentials-dialog>` + `<falcon-angular-completion-success-dialog>`; mounting them separately alongside it would double-render.
- `[CODE]` **The success ack is INLINE by design** (2026-05-24 revert) — do not route it through `FalconMessageOrchestratorService` (renders the wrong small red alert).
- `[CODE]` **BUG-14 message contract** — for the host's error message to appear in the toast, `submitFn` must `throw`/`error` with an `Error` whose `message` is a clean user-facing, non-bracket-prefixed string. Empty/internal sentinels fall back to `errorToastBody`.
- `[INFERRED]` **Gateway/wire concerns** belong to the host `submitFn`, not the orchestrator — the camelCase-wire + `useGateway()` rules apply to the host's API call.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier) — the `submitFn` invocation (ts:202), the two injected services (ts:169-170), the loader-dismiss-before-next-UI ordering (ts:216-223 + 298-301), the `ngOnDestroy` safety net (ts:307-309), the rxjs minimum-visibility gate (ts:202-234), and BUG-14 sanitation (ts:283-293) all re-read from source. Backend endpoint/DTO/gateway rows are 🔴 INFERRED by design — the orchestrator has zero backend surface; data ownership is the host `submitFn` + state slice. PES gate 🟡 INFERRED (inherits the host create-flow permission).
