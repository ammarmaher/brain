# falcon-error-dialog-host — Recognition Layer

> Given a design / requirement for "show a blocking modal listing backend errors," identify the **`ErrorDialogService` + `<falcon-angular-error-dialog-host>`** pair as the answer, and how to compose it. (The host is rendered ONCE; the recognition target for new code is the **service**.)

## Visual fingerprint

A centered modal over a dimmed backdrop with: a **status-aware title** (e.g. "Business rule rejected (HTTP 422)"), a small **count subtitle** ("3 errors"), a **bulleted list** of error messages in neutral body text, and a single **OK** button (no Cancel). Severity tints the chrome: **amber/warning** for a `422` business-rule rejection, **red/danger** for everything else. Esc, backdrop-click, and OK all dismiss it. The chrome is the standard `<falcon-angular-alert-dialog>` look.

## Cross-library equivalents

| Library | Their construct | Parity notes |
|---|---|---|
| MUI | `<Dialog>` opened by a global error-context + `<Alert severity>` body | MUI hand-wires a context; Falcon bakes the service + host pair. |
| PrimeNG | `MessageService` + `<p-dialog>` (or `ConfirmationService`) | The Falcon `ErrorDialogService` ≈ a dedicated error-only `MessageService` whose sink is one modal. |
| Ant Design | `Modal.error({ title, content: <ul> })` (imperative) | Ant's static `Modal.error` is the closest 1:1 — imperative open, OK-only, list body. |
| Bootstrap | a global toast/modal + manual `.modal('show')` | upgrade target — replace bespoke modals with the service. |
| shadcn / Radix | `<AlertDialog>` + a custom error store | shadcn composes primitives + your own store; Falcon ships the store (`ErrorDialogService`) + host. |
| plain JS | `alert(messages.join('\n'))` | always replace — `alert()` is unstyled, blocks the thread, and can't show severity. |

## Use THIS vs siblings

| If the requirement is… | Use | Not |
|---|---|---|
| a **blocking modal listing one-or-more** backend errors to acknowledge | `ErrorDialogService.openError(...)` → `<falcon-angular-error-dialog-host>` | — |
| a **single-message OK-only** popup (esp. from the HTTP interceptor) | `FalconHttpErrorDialogService.show(...)` → `<falcon-angular-http-error-dialog-host>` | this host (it's multi-message) |
| a transient **status toast** (success/info/warn/error, auto-dismiss) | `FalconMessageOrchestratorService` → `<falcon-toast-adapter>` (or legacy `FalconMessageService`) | a modal |
| a **confirm / cancel** decision | `FalconConfirmService` → `<falcon-angular-confirm-dialog-host>` | this host (it's OK-only) |
| an **unsaved-changes** leave-guard | `FalconUnsavedChangesService` → `<falcon-unsaved-changes-host>` | this host |
| a **custom-content** modal (forms, rich body) | `<falcon-angular-dialog>` / `<falcon-angular-popup>` directly | this host (fixed bullet-list body) |

## Composition recipe to reach parity

Customization order: inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — N/A on the host (zero `@Input`s). The "inputs" are the **service payload**: `openError({ httpStatus, errorMessages, titleKey? })`.
2. **Templates** — none. The body shape (bulleted list) is fixed.
3. **Slots** — the host already projects a `<ul>` into the alert-dialog body slot; consumers do not add slots.
4. **Variants** — severity is auto-derived (`422`→warning, else danger). You do not pick it; you pick the `httpStatus`.
5. **Token override** — N/A on the host; override `--falcon-alert-dialog-*` at the primitive if the chrome needs change.
6. **Upgrade** — need messages-are-keys control, or a `503` title, or `aria-live`? Raise GAP G5/G3/G1 — do not fork the host.
7. **Wrapper** — never wrap the host. If you need a different error UX (custom body), use `<falcon-angular-dialog>` directly instead.

## Anti-patterns

- **`new`-ing a dialog in feature code** for a save failure — banned; funnel through `ErrorDialogService`.
- **Passing the raw `HttpErrorResponse`** to `openError` — it wants `{ httpStatus, errorMessages }`, not the error object. `[CODE]` service:12-19.
- **Passing untranslated backend slugs** and expecting localization — best-effort only; pass real keys or translated copy. `[CODE]` ts:84-88.
- **Recoloring a `422` to danger** "for consistency" — the amber warning IS the business signal. `[CODE]` ts:74-78.
- **Letting the toaster AND this dialog both fire** for one failure — set `notShowToaster: 'true'`. `[CODE]` settings.service.ts:62.
- **Routing a single interceptor error here** — that's `FalconHttpErrorDialogService` (the popup), not this (the alert-dialog). `[CODE]` falcon-http-error-dialog.service.ts:6.
- **Mounting it twice** — duplicate modal. `[CODE]` ts:6.
- **Using `*ngIf`/`*ngFor`** in any related template — the host already uses `@if`/`@for`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B27, NEW) from falcon-error-dialog-host.component.ts/.html + error-dialog.service.ts. Sibling routing table cross-checked against app.ts:37-57 (the five shell-mounted service/host pairs) + falcon-http-error-dialog.service.ts:6 (explicit "parallel to ErrorDialogService" doctrine). Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
