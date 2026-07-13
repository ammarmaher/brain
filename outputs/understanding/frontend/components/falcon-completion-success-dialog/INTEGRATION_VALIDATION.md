# falcon-completion-success-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` the dialog is purely presentational — it owns no data and calls no endpoint. It opens AFTER the creation flow's `submitFn()` (owned by Commerce for client/node, Identity for user) has already succeeded and credentials have been sent. The component is the **success terminus** of a flow whose backend work happened upstream.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The dialog binds to **no endpoint**. The owning flow (`<falcon-angular-wizard-finalization>`'s `submitFn`) calls the create + send-credentials endpoints; this dialog only renders the success outcome. |

> `[INFERRED]` For Add User the upstream call is the Identity user-create + credential delivery; for Add Client it is the Commerce client-create + owner credential delivery. The dialog never sees the DTOs — it receives only `[title]`/`[subtitle]` strings the flow computed.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | **No validation.** The dialog neither validates input nor gates a form. It is a display-only success ack shown after upstream validation + persistence succeeded. |

## PES keys gating this component

**None.** `[INFERRED]` The success ack is not permission-gated — it inherits the gate of the creation flow that produced it (the operator already passed the create-permission check to reach `submitFn`).

## State / signal pattern

`[CODE]` `falcon-completion-success-dialog.component.ts`:
- **One-way visibility:** `open = input<boolean>(false)` — the consumer owns the open state (`successOpen()` in the finalization component). The dialog never sets it itself; it emits `(closed)` and the consumer flips the signal back.
- **Auto-dismiss timer:** an `effect()` (:115-124) watches `open()`; on `false→true` it arms `setTimeout(() => onClose(), autoDismissMs)` (if `> 0`); on `true→false` it clears. `clearTimer()` also runs on `ngOnDestroy` (:127-129) — no leaked timer.
- **Dismissal collapse:** every path (timer / backdrop / panel-click / × / ESC) funnels through `onClose()` (guarded by `open()` so it fires once) → `closed.emit()`.
- **Top-Layer lifecycle:** delegated to the `[falconOverlay]="modal"` directive (`showModal()`/`close()` + `FalconStackingService` register/unregister). The component keeps only a `viewChild('dlg')` ref for the backdrop-click target check.

## Skeleton ↔ app-wrapper layering

`[CODE]` **No Stencil skeleton.** Pure-Angular standalone — the same architecture as `falcon-popup` (native `<dialog>` + `[falconOverlay]`, no Shadow/`-tw` twin). There is no library-skeleton ↔ app-wrapper split here; it is a single Angular component composed by another Angular component (`falcon-wizard-finalization`).
- Per `feedback_library_skeleton_app_api`, the component fetches no data — the owning flow's `submitFn` does. The dialog is a dumb terminus. ✅

## Overlay-substrate integration (B14)

`[CODE]` `falcon-overlay.directive.ts` — the dialog declares `<dialog falconOverlay="modal" [falconOpen]="open()" (falconClose)="onClose()" (falconCancel)="onNativeCancel($event)">` (`.html:12-24`). The directive:
- Calls `showModal()` on `open()=true` → enters the browser **Top Layer** (OS-level focus containment + inertness; the success ack's focus trap is "free").
- Registers with `FalconStackingService` (kind `modal`) so notification toasts re-assert above it.
- Mirrors native `cancel` (ESC) → `(falconCancel)` (the component no-ops it, letting native close proceed) and native `close` → `(falconClose)` → `onClose()`.

> Backdrop-click dismissal is **Falcon-specific** (gated by `dismissOnOverlayClick`) and NOT owned by the directive — the component keeps its own `viewChild` + `onDialogClick` target check for it.

## Integration gotchas

- `[CODE]` **The consumer must reset `open` on `(closed)`** — the dialog does not self-close its `[open]` input (one-way). If the consumer ignores `(closed)`, the dialog stays logically "open" and re-arms on the next `open()` toggle oddly. The finalization component resets correctly (`onSuccessClosed()`).
- `[CODE]` **`autoDismissMs` re-arms on every `false→true`** — toggling `open` rapidly resets the timer (intended). A consumer that flickers `open` will keep deferring the auto-dismiss.
- `[CODE]` **ESC always closes** — there is no `closeOnEsc=false` escape hatch (unlike `falcon-popup`'s `falconCancel.preventDefault()` path). For a success ack this is fine; do not use this dialog where ESC must be blocked.
- `[CODE]` **Title/subtitle ride camelCase nothing** — they are plain pre-translated UI strings, not wire payloads. No backend contract.
- `[CODE]` **No `confirm`/decision output** — integrating code that needs a "did the user acknowledge vs auto-dismiss?" distinction CANNOT get it; both fire `(closed)` identically (by design).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — one-way visibility, `effect()`-driven auto-dismiss + teardown, dismissal-collapse, and the `[falconOverlay]` Top-Layer integration all confirmed in `falcon-completion-success-dialog.component.{ts,html}` + `falcon-overlay.directive.ts`. Backend wiring = none (the dialog is a success terminus). Upstream create/credential endpoints 🟡 INFERRED from the owning flow (not re-read from backend source).
