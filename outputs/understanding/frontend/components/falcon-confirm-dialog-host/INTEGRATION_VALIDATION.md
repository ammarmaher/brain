# falcon-confirm-dialog-host — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None — purely client-side orchestration.** The host + `FalconConfirmService` make zero HTTP calls. They gate a decision; the *confirmed action* (the DELETE / save / discard) belongs to the calling flow's module:
- **Commerce** — contact-group delete, Add Client / Add Node discard (`[INFERRED]` from the wizard callers).
- **Identity** — Add User discard.
- **Charging** — do-payment failure acknowledgement (`do-payment-priority-popup`).

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the host/service) | — | — | — | — | The service emits `Observable<boolean>`; the caller fires the API on `true`. e.g. `contact-groups-list.component.ts:397 this.api.delete(row.id)` runs only after `accepted` (`[CODE]` :395-398). |

## The service↔host↔renderer wiring (the integration this dossier is about)

`[CODE]` Three layers, two eras:

**Service (`FalconConfirmService`, `providedIn: 'root'`)** — `[CODE]` falcon-confirm.service.ts:43-128:
1. `confirm(request)` builds a cold `Observable<boolean>` with a `settled`-guarded `resolve(accepted)` (`[CODE]` :65-88).
2. It calls `orchestrator.show({ category: 'action-required', title, message: body ?? '', source: 'falcon-confirm-service', actionLabel: confirmLabel ?? 'Confirm', actionCallback: () => resolve(true), cancelCallback: () => resolve(false), hideCancel, correlationId })` (`[CODE]` :91-105).
3. Sequential: resolves any prior in-flight confirm as `false` first (`[CODE]` :67-72). Teardown dismisses by `correlationId` + resolves `false` (`[CODE]` :109-114).

**Phase-5 renderer (`FalconModalAdapterComponent`)** — `[CODE]` falcon-modal-adapter.component.ts:
- Subscribes to `orchestrator.activeModal()` (`[CODE]` :101-103).
- For `category === 'action-required'` → `renderKind = 'popup-error'` → renders `<falcon-angular-popup variant="error" [titleOverride] [bodyOverride] [confirmLabelOverride] [hideCancel] (confirm)=onConfirm() (cancel)=onClose() />` (`[CODE]` :51-61, :108).
- `onConfirm()` fires the message's `actionCallback` (→ `resolve(true)`) before dismissing; `onClose()` fires `cancelCallback` (→ `resolve(false)`).

**Legacy host (`FalconAngularConfirmDialogHostComponent`)** — `[CODE]` falcon-confirm-dialog-host.component.ts + .html:
- `@if (active(); as req)` renders `<falcon-angular-alert-dialog [open]="true" [title]=req.title [subtitle]=req.body … (falconConfirm)=onAccept() (falconCancel)=onReject() />` (`[CODE]` .html:4-22).
- In Phase 5 `service.active()` is ALWAYS null (`[CODE]` service.ts:59-60), so this template body NEVER instantiates. The host is dead-but-mounted.

> **Net:** a `confirm()` call → orchestrator → `<falcon-angular-popup>` is rendered by the modal-adapter, NOT by this host. The host element is a vestige kept for compile-compatibility, flagged for removal (`[CODE]` service.ts:14-15).

## The confirm-result contract (promise/observable)

`[CODE]` Observable<boolean>, single-shot, completes after one emission. `true` only on explicit confirm; `false` on cancel / × / ESC / backdrop / supersession / teardown (`[CODE]` :86-88, :97-98, :109-114). Idempotent via `settled` (`:77-88`). NOT a Promise — subscribe; pipe `takeUntilDestroyed`.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | No form fields; no validators. The confirm gates a decision, it does not validate input. |

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The host/service have no PES key. `[INFERRED]` The PES gate lives on the *trigger* (e.g. the delete button) in the owning feature; if the action is denied, the confirm is never requested. |

## State / signal pattern

- `[CODE]` Service: `activeResolve: ((accepted: boolean) => void) | null` + `activeCorrelationId: string | null` track the in-flight confirm (`[CODE]` :51-55). The legacy `_active = signal<FalconConfirmRequest | null>(null)` + `active = computed(...)` are kept null (`[CODE]` :59-60).
- `[CODE]` Host: `active = this.service.active` (signal), `OnPush`, `CUSTOM_ELEMENTS_SCHEMA`. No internal mutable state beyond the projected signal.
- **Zoneless-safe:** signal-driven + `OnPush`. The orchestrator (which actually renders) is also signal-driven.
- **MF singleton:** the service is `providedIn: 'root'` and shared as an `@falcon/ui-core` MF singleton, so host-shell + remotes share ONE instance + ONE queue (`[CODE]` app.ts:49-52).

## Skeleton ↔ app-wrapper layering

- **Library layer** — the host + service are pure orchestration (no business data). Per `[VAULT]` `feedback_library_skeleton_app_api`, they never fetch.
- **App layer** — the caller (wizard / state-service / list component) holds the Observable subscription, the API service, and the post-confirm action.
- **Renderer layer** — the orchestrator + modal-adapter own the actual DOM (`<falcon-angular-popup>`); the substrate (`<falcon-angular-popup>` → composes the dialog chrome) owns focus-trap / Top-Layer / backdrop.

## Integration gotchas

- `[CODE]` **Always pipe `takeUntilDestroyed`** — teardown resolves `false` + dismisses the modal by `correlationId` (`[CODE]` :109-114). A raw subscribe leaks and the modal won't auto-dismiss when the component dies.
- `[CODE]` **`active()` is always null** — do not read it expecting the in-flight request (Phase 5).
- `[CODE]` **`severity` / `icon` / `cancelLabel` / `closeOnBackdrop` / `closeOnEsc` / `hideConfirm` are inert in Phase 5** — accepted on `FalconConfirmRequest` (`[CODE]` :30-41) but the orchestrator/popup path ignores them. Only `title` / `body` / `confirmLabel` / `hideCancel` reach the popup.
- `[CODE]` **Wrong-service trap** — `FalconConfirmService.confirm({ title, body, … })` vs `FalconUnsavedChangesService.confirm({ titleOverride, bodyOverride, hintOverride, … })`. Different shapes; pick by intent (`[CODE]` hierarchy-page-state.service.ts:236-243).
- `[CODE]` **One modal at a time** — a second `confirm()` cancels the first. Don't fire two confirms in parallel expecting both.
- `[CODE]` **Do not mount the host twice** — singleton; mounted in `host-shell/app.ts:53` only.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). The full service→orchestrator→popup wiring traced in `falcon-confirm.service.ts` + `falcon-modal-adapter.component.ts`; the legacy host→alert-dialog template confirmed dead (always-null `active()`). Observable<boolean> contract, MF-singleton queue, and the `takeUntilDestroyed`/inert-fields gotchas all source-verified. The confirmed-action API call (`this.api.delete`) cited at the contact-groups caller. No PES/V-rules (orchestration only).
