# falcon-wizard-finalization — DECISION

## Brain SK final recommendation

**STATUS: READY / IN PRODUCTION. Use for the credential-delivery close-out of any entity-creation flow.** It is live in both consoles (Add Client + Add User) and is one of the cleaner, best-practice components in the library.

## Use this component for

- The terminal step of an entity-creation wizard: pick a credential delivery channel (email / SMS / both) → run the host's create-and-send call behind a perceivable loader → confirm with a branded success ack or surface a business-error toast.
- Any flow that can supply a `submitFn: (method) => Observable<unknown>` and wants the standard "Sending Credentials" UX shared with Add Client / Add User.

## Avoid this component for

- The wizard chrome (stepper + steps + Next/Back/Finish) → `<falcon-angular-wizard>`.
- The channel picker alone → `<falcon-angular-sending-credentials-dialog>`.
- A standalone success dialog → `<falcon-angular-completion-success-dialog>`.
- A generic confirm/alert → `<falcon-angular-popup>` / `FalconMessageOrchestratorService`.
- Any flow where the API call must NOT be host-injected.

## Preferred variant / render path

n/a — single Angular composite (no Shadow/`-tw`/Studio render path). The picker↔loader↔success↔error state machine is fixed.

## Required upgrades before wider use

None blocking. The component is production-quality. The gaps in `GAPS_AND_UPGRADES.md` (an `(error)` output, parameterized toast source, Promise overload, configurable gate, a spec) are additive improvements.

## Relationship to other components

- **Composes:** `<falcon-angular-sending-credentials-dialog>` (channel picker) + `<falcon-angular-completion-success-dialog>` (success ack).
- **Uses:** `FalconMessageOrchestratorService` (error toast) + `FalconLoaderService` (central overlay, `@falcon/studio/runtime`).
- **Mounted alongside:** the legacy `<falcon-stepper>` / `<falcon-angular-wizard>` finish — it is the close-out, not the wizard.
- **Replaces:** the previous per-wizard pair of hand-wired dialogs.

## Exact rule for future implementation tasks

1. **Closing an entity-creation flow with a credential send?** Use `<falcon-angular-wizard-finalization>`.
2. **Provide `[submitFn]`** (`(method) => Observable<unknown>`) — keep ALL API code in the host state slice; the orchestrator is HTTP-free.
3. **Flip `[open]`** from the wizard's Finish; pass the owner summary (`ownerName`/`Phone`/`Email`) + `defaultDelivery`.
4. **Translate every label/title/body input** (`channelTitle`, `successTitle`, `successSubtitle`, `errorToastTitle`, `errorToastBody`, method labels) — the component does no i18n.
5. **Listen to `(finalized)`** to close the flow + refresh; `(cancelled)` to close the picker.
6. **Do NOT** drive the inner picker `[open]`, show your own loader, or re-route the success ack through the orchestrator.
7. **Restyle via the CHILD dialogs' tokens** — this component has none of its own.

---

## Dynamic capability assessment

### 1. What is static today?
- The picker↔loader↔success↔error sequence (fixed state machine).
- The two composed child dialogs (not swappable).
- The inline success-ack choice (deliberately NOT the orchestrator — 2026-05-24 revert).
- `MIN_LOADER_VISIBLE_MS = 600` (module constant).
- The toast `source: 'wizard-finalization'` and `category: 'business-error'`.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **22 signal inputs** — `open` + owner summary (3) + `defaultDelivery` + the required `submitFn` + success copy (3) + error copy (2) + channel-dialog label passthroughs (11).
- `[CODE]` **2 outputs** — `finalized`, `cancelled`.
- Internal `submitting`/`successOpen` signals + `pickerOpen` computed drive the flow.

### 3. What is already dynamic through slots / ng-template?
- **Nothing** — no `<slot>` / `<ng-content>` / `ng-template`. The two child dialogs are fixed mounts.

### 4. What is dynamic through token/theme overrides?
- Nothing on THIS component (no own tokens). Restyle via the two child dialogs' token contracts.

### 5. What is dynamic through Tailwind classes?
- Nothing — `display: contents` makes host classes inert.

### 6. What is missing to make this component reusable across pages?
- An `(error)` output (G1) — currently only success/cancel are observable to the host.
- A `Promise` overload for `submitFn` (G4).
- A configurable toast source (G2) + min-loader threshold (G5).
- A spec (none today).

### 7. What capability should be added to the shared component (not page hack)?
- The `(error)` output + the `Promise` overload belong in this shared orchestrator (3 consumers already; per-page error handling would fragment the contract).

### 8. What flags / options / templates / slots would make it better?
- `@Output() error` (+ optional `@Output() submittingChange`).
- `@Input() toastSource?: string`.
- `@Input() minLoaderVisibleMs?: number`.
- `submitFn` accepting `Observable | Promise`.

### 9. What is the safest upgrade path?
1. **Phase A (additive):** add `@Output() error` emitted in the error branch (alongside the toast) + optional `submittingChange`. Zero break.
2. **Phase B (additive):** `toastSource` + `minLoaderVisibleMs` inputs with current defaults.
3. **Phase C (additive):** normalize `submitFn` via `from()` to accept Promises.
4. **Phase D (tests):** Vitest spec (single-shot / success / error / gate / destroy).

All phases additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- **The inline success ack** — re-routing it through `FalconMessageOrchestratorService` re-introduces the wrong small red alert (2026-05-24 revert); do not "consolidate" it.
- **The `submitFn` Observable contract** — the rxjs gate depends on it; changing the signature breaks all 3 mounts.
- **The `finalized`/`cancelled` semantics** — Add Client + Add User reactions (close popup, refresh tree) key off them.
- **The minimum-visibility gate** — removing it makes the loader flash/imperceptible on fast backends (a real UX regression the gate was added to fix).
- **The loader-dismiss-before-next-UI ordering** — reordering would stack the success dialog on top of the loader.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier). Recommendation READY/IN-PRODUCTION; 22 inputs / 2 outputs / fixed state machine confirmed. Gaps are additive (no blockers). The inline-success-ack + minimum-visibility-gate + loader-ordering are the load-bearing invariants future refactors must preserve.
