# falcon-confirm-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet that looks like a small confirm prompt, decide what to use. **Spoiler: not this component** — it is dormant. Route to `FalconConfirmService` (popup) or `<falcon-angular-alert-dialog>`.

## Visual fingerprint (as-designed)

`[CODE]` falcon-confirm-dialog.tsx:97-144 — a **small, compact modal** (`size` default `sm`):
- A standard dialog header with a **heading** (left-aligned).
- A body region (`falcon-confirm-body`, centered) holding an **optional icon** (`falcon-confirm-icon`, ~32px, centered via `align-items: center`) above/beside a **short message** (`[CODE]` css:10-28).
- An optional default `<slot>` below the message for extra context.
- A **2-button footer** — Reject FIRST, Accept SECOND (`[CODE]` tsx:124-139) — raw `<button>`s.
- Backdrop + close-X + focus-trap inherited from `<falcon-dialog>`.

> ⚠️ **You will never see this fingerprint in the live app** — the component does not render anywhere. If you see a small confirm modal in Falcon today, it is `<falcon-angular-popup variant="error">` (driven by `FalconConfirmService`) or `<falcon-angular-alert-dialog>`.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + `<DialogActions>` with two `<Button>`s | Basic confirm with custom action labels. In Falcon → use `FalconConfirmService.confirm()`. |
| PrimeNG | `<p-confirmDialog>` / `confirmationService.confirm()` | The confirm-dialog was meant to replace this — but the LIVE Falcon analogue of `confirmationService.confirm()` is `FalconConfirmService.confirm()` (Observable instead of callback options). |
| Ant Design | `Modal.confirm({ okText, cancelText })` | Imperative confirm → `FalconConfirmService.confirm()`. |
| Bootstrap | `.modal` + `.modal-footer` two buttons | Replace with `FalconConfirmService` or `<falcon-angular-alert-dialog>`. |
| shadcn / Radix | `<AlertDialog>` + `<AlertDialogAction>` / `<AlertDialogCancel>` | The icon-led variant maps to `<falcon-angular-alert-dialog>`; the plain variant to the popup. |
| plain HTML | `window.confirm()` | **Banned.** `[CODE]` contact-groups replaced `window.confirm` with `FalconConfirmService` (Wave 15). |

## Use THIS vs siblings

| If the design shows… | Use | NOT |
|---|---|---|
| small modal, one-line message, custom verbs (imperative "are you sure?") | **`FalconConfirmService.confirm()`** (renders `<falcon-angular-popup variant="error">`) | this dormant confirm-dialog |
| centered big icon + title + subtitle + body, a high-stakes acknowledgement | `<falcon-angular-alert-dialog>` | confirm-dialog |
| one of the 4 canonical flows: error / delete / unsaved / save | `<falcon-angular-popup>` (right variant) | confirm-dialog |
| a form / multi-field editing / custom header+footer | `<falcon-angular-dialog>` (primitive) | confirm-dialog |
| a transient "Done" after the action | toast / `<falcon-angular-notification>` | confirm-dialog |

## Composition recipe to reach parity

**Do not reach for this component.** The customization order (`[VAULT]` `feedback_falcon_custom_library_mandatory`: inputs → templates → slots → variants → token → shared upgrade → wrapper → GAP) resolves at step 1 for confirms:

1. **Inputs** — call `this.confirm.confirm({ title, body, confirmLabel?, cancelLabel?, severity?, hideCancel? }).subscribe(accepted => …)` (`[CODE]` falcon-confirm.service.ts:30-41, 65). That IS the confirm primitive.
2. If you need an **icon-led / subtitle / acknowledgement** look → `<falcon-angular-alert-dialog>` (B-substrate).
3. If the dormant confirm-dialog itself is genuinely required (it is not, today) → that is GAP G1 (delete-or-revive); raise it, do not uncomment ad-hoc.

## Anti-patterns

- **Reviving / uncommenting this wrapper to use it** — `[CODE]` index.ts ships `export {}`; the platform confirm path is `FalconConfirmService`. Do not re-introduce a third confirm surface (GAP G1/G2).
- Using `window.confirm()` — banned; replaced by `FalconConfirmService` (`[CODE]` contact-groups-list.component.ts:379).
- Using confirm-dialog for the 4 canonical flows — `<falcon-popup>` carries the right copy + icon.
- Expecting to project replacement footer buttons — the accept/reject pair is hardcoded.
- Treating backdrop / Esc dismissal as distinct from rejection — all dismissals fire reject (the live service mirrors this: `false`).
- Passing an `<svg>` to `[icon]` — it is a CSS class string.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B15) from `falcon-confirm-dialog.tsx` + the live `FalconConfirmService`/modal-adapter source. Routing table re-pointed to the LIVE surfaces (popup via service / alert-dialog) since the confirm-dialog is dormant. Cross-library map `[INFERRED]` from each library's documented confirm primitive.
