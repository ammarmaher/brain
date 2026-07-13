# falcon-error-dialog-host — DECISION

## Brain SK final recommendation

**STATUS: READY (ACTIVE, correct). Use the `ErrorDialogService` for any blocking, multi-message backend-error acknowledgement; mount the host once in the app shell.** The component is small, clean (zero raw style literals), signal-driven, OnPush, and the FE-CYCLE-01 relocation is verified complete.

## Use this component (the service) for

- A backend operation returning **one or more** messages the operator must acknowledge before continuing (validation list, business-rule rejection, conflict).
- Surfaces that **own their error UX** (suppress the global toaster via `notShowToaster: 'true'`) — settings tab, info panel, add-user wizard.
- Any flow that wants a **status-aware** title + count + bulleted list, with `422` distinctly rendered as a business-rule warning.
- A flow that wants to **await** acknowledgement (the `openError` Promise resolves on dismiss).

## Avoid this component for

- Single-message OK-only interceptor popups → `FalconHttpErrorDialogService` → `<falcon-angular-http-error-dialog-host>`.
- Transient status toasts → `FalconMessageOrchestratorService` → `<falcon-toast-adapter>`.
- Confirm/cancel decisions → `FalconConfirmService` → `<falcon-angular-confirm-dialog-host>`.
- Unsaved-changes guards → `FalconUnsavedChangesService` → `<falcon-unsaved-changes-host>`.
- Custom-content modals (forms, rich body) → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.

## Preferred variant / render path

**N/A** — single-render Angular host (no Shadow/`-tw`/`useTailwind` axis). The rendered primitive `<falcon-angular-alert-dialog>` defaults to `useTailwind=true` internally; the host pins `size="md"`, `position="center"`, `hideCancel=true`.

## Required upgrades before wider use

**None.** Production-quality today. The gaps in `GAPS_AND_UPGRADES.md` (spec coverage G6, `messagesAreKeys` flag G5, empty-list guard G2, extra title keys G3, `aria-live` G1) are improvements, not blockers.

## Relationship to other components

- **Renders:** `<falcon-angular-alert-dialog>` (dual-render primitive — overlay/card/severity/ARIA).
- **Driven by:** `ErrorDialogService` (UI-agnostic signal state holder in shared-data-access).
- **Parallel sibling (distinct doctrine):** `<falcon-angular-http-error-dialog-host>` + `FalconHttpErrorDialogService` (single-message popup).
- **Same "service + shell-mounted host" family:** confirm-dialog-host, unsaved-changes-host, message-host, modal-adapter, toast-adapter.

## Exact rule for future implementation tasks

1. **Need a blocking, multi-message backend-error acknowledgement?** Inject `ErrorDialogService` and call `openError({ httpStatus, errorMessages })`. Do NOT `new` a dialog.
2. **Suppress the toaster** on the failing HTTP call (`headers: { notShowToaster: 'true' }`) so the operator gets the dialog, not a toast + dialog.
3. **Pass already-translated copy** (or a real i18n key) in `errorMessages`; pass the numeric `httpStatus`, not the raw error object.
4. **Do not recolor `422`** — it auto-renders in warning severity by design.
5. **Mount `<falcon-angular-error-dialog-host>` exactly once** in the app shell (host-shell `app.ts` already does).
6. **For a single interceptor message → use `FalconHttpErrorDialogService` instead** (the parallel popup).
7. **To await acknowledgement:** `await errorDialog.openError({...})`.

---

## Dynamic capability assessment

### 1. What is static today?

- The body shape (a bulleted `<ul>` of messages) — fixed markup, no template input. `[CODE]` html:18-24.
- The dialog chrome pins: `size="md"`, `position="center"`, `hideCancel=true`, `closable/closeOnBackdrop/closeOnEsc=true`. `[CODE]` html:11-15.
- Severity mapping is hardwired binary: `422`→warning, else→danger. `[CODE]` ts:74-78.
- The OK label is fixed to `common.ok`. `[CODE]` ts:91-93.
- The subtitle is the count only (countOne/countOther). `[CODE]` ts:63-69.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **Zero `@Input`s / `@Output`s on the component.** The dynamic surface is the **service payload** `ErrorDialogState` = `{ httpStatus, errorMessages, titleKey? }` (service:12-19). `httpStatus` drives title + severity; `errorMessages` drives the body + count; `titleKey` overrides the title.
- The host re-translates reactively if the active language changes while open (computeds re-run on the `TranslateService` signal).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` The host PROJECTS its bullet `<ul>` into the alert-dialog default slot (html:18). It exposes NO slots of its own to consumers — it is the projector, not the projectee.

### 4. What is dynamic through token/theme overrides?

- The chrome is fully token-driven via the embedded `<falcon-angular-alert-dialog>` (`--falcon-alert-dialog-*`); the bullet text uses token-backed Falcon utilities (`text-falcon-neutral-800`). Dark mode + RTL are inherited. The host itself has **no token file** to override.

### 5. What is dynamic through Tailwind classes?

- Only the fixed bullet-list classes (html:18). There is no consumer-facing `wrapperClass`/`class` passthrough on the host (it is shell chrome, not a placed control).

### 6. What is missing to make this component reusable across pages?

- A `messagesAreKeys` flag to kill the translate-heuristic ambiguity (G5).
- An empty-message-list fallback (G2).
- Title keys for the long-tail statuses (`429`/`503`) (G3).
- An `aria-live` count region (G1).
- Spec coverage (G6).

### 7. What capability should be added to shared component (not page hack)?

- `messagesAreKeys` + `subtitleKey` on `ErrorDialogState` (G5) — every caller currently relies on the heuristic.
- A reusable `statusFromHttpError` + message-extractor helper (callers each re-implement `statusFromHttpError(err)`) — promote to a shared util so the `{ httpStatus, errorMessages }` shape is built consistently.

### 8. What flags / options / templates / slots would make it better?

- `@Input subtitleKey?` / `messagesAreKeys?` (via the service payload).
- An optional `bodyTemplate` for the rare case a caller needs richer-than-bullets content (low priority — use `<falcon-angular-dialog>` instead).
- `info` / `success` severity escape hatch (currently unused range) — probably out of scope (it is an ERROR host).

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add `subtitleKey?` + `messagesAreKeys?` to `ErrorDialogState`; honor them in the computeds. Add the empty-list fallback bullet. Add `429`/`503` title keys to en/ar.
2. **Phase B (test):** add `error-dialog.service.spec.ts` + `falcon-error-dialog-host.component.spec.ts` (pure signal/function — easy).
3. **Phase C (a11y):** add `aria-live="polite"` around the count.
4. **Phase D (util):** promote `statusFromHttpError` + message extractor into a shared helper consumed by all callers.

All phases additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- The `ErrorDialogState` interface shape (`{ httpStatus, errorMessages, titleKey? }`) — every caller constructs it; adding optional fields is safe, renaming/removing is not. `[CODE]` service:12-19.
- The `422`→warning / else→danger mapping — the settings/info-panel flows visually depend on the amber-for-business-rule signal. `[CODE]` ts:74-78.
- The `401`-suppression — feature code blindly calls `openError` assuming `401` is silently handled. Removing the suppression would surface unexpected logout dialogs. `[CODE]` service:32-33.
- The single-mount assumption — code expects exactly one host; the service is `providedIn: 'root'` singleton.
- The `common.ok` confirm label + Esc/backdrop dismiss contract — e2e/Cypress flows may key off the OK button / dismiss behavior.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Recommendation READY/ACTIVE. Zero `@Input`/`@Output` (ts:41-97); service payload is the dynamic surface (service:12-19); severity binary + `401`-suppress + last-wins re-confirmed. Gaps G1–G6 are additive improvements; no HIGH-RISK change required. B/E rubric N/A (single-render host).
