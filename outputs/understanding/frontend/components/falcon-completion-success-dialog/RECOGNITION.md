# falcon-completion-success-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-completion-success-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A **large, centered, white modal card** (≈560px wide) with rounded corners (18px) and a soft deep drop shadow, over a **teal-tinted blurred backdrop**. At the top-end a small × close button. Centered inside: a **decorative illustration** — a dark-teal clipboard with a checkmark, a green check-pill, a check badge, and a few sparkle/circle accents — above a **bold ~22px title** ("Completed successfully") and a smaller grey subtitle ("Credentials sent to the user"). **No action buttons.** It animates in (backdrop fade 160ms + panel rise/scale 220ms) and **auto-vanishes after ~10s**. Distinct from a toast (corner, small, countdown) and from `falcon-popup` (has buttons + an intent icon chip).

## When the design points HERE

A design / React-or-Angular snippet implies THIS component when **all** of these hold:
- It is a **large, modal, celebratory SUCCESS confirmation** at the end of a creation / send flow.
- It has **no decision buttons** (no OK/Cancel) — at most an × — and is expected to **auto-dismiss**.
- It carries a **branded illustration** (not a generic icon chip).
- The tone is "you're done / credentials sent", not "are you sure?" or "an error occurred".

If the design shows OK/Cancel buttons or an intent-icon chip → it's `<falcon-angular-popup>`. If it's a small auto-vanishing corner card → it's an orchestrator toast.

## Cross-library equivalents

| Library | Their equivalent | Parity notes |
|---|---|---|
| React (legacy Falcon) | `SuccessModal` + `SuccessIllo` (`admin/addclient.jsx 751-767, 809-834`) | **direct 1:1 port** — this component IS the Angular port. |
| MUI | a `<Dialog>` with a custom illustration + no `DialogActions`, auto-closed via `setTimeout` | structural twin (Dialog without action row). |
| Ant Design | `Modal.success({ … })` (the static success modal) — but Ant's has an OK button | closest is a custom `<Modal>` with `footer={null}`. |
| shadcn / Radix | `<Dialog>` / `<AlertDialog>` with no footer + a celebratory body | Radix `AlertDialog` maps to the `role="alertdialog"` choice (see G-ROLE). |
| Bootstrap | a `.modal` with a custom body + JS auto-hide | hand-rolled. |
| plain HTML | a centered overlay div + an illustration + a timer | always replace with this component (via `<falcon-angular-wizard-finalization>`). |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a large branded success ack, no buttons, auto-dismiss | `<falcon-angular-completion-success-dialog>` | — |
| a success/save **decision** (OK/Cancel) | `<falcon-angular-popup variant="save">` | this dialog |
| a small transient corner success | `FalconMessageOrchestratorService.show({category:'success'})` toast | this dialog |
| a passive notification with a countdown bar | `FalconNotificationService.push()` + `<falcon-angular-notification-stack>` | this dialog |
| a generic content modal / form | `<falcon-angular-dialog>` | this dialog |
| the WHOLE creation-finalization flow (picker → submit → ack) | `<falcon-angular-wizard-finalization>` (composes this dialog) | wiring this dialog by hand |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token → upgrade → wrapper.
1. **Inputs** — `[open]`, `[title]`, `[subtitle]` (pre-translated), `[autoDismissMs]` (10000 default; 0 to disable), `[dismissOnOverlayClick]`, `[closeAriaLabel]`. Bind `(closed)` to reset `open` + navigate/reset.
2. **Templates** — none. The illustration + title + subtitle are fixed/prop-driven.
3. **Slots** — none. No `<ng-content>`. (GAP: a richer body would require a slot — none exists.)
4. **Variants** — none. Single fixed visual.
5. **Token override** — none available (no token file; inline styles). GAP G-TOKENS. To change the dim/radius/shadow you must edit the component.
6. **Upgrade** — needs a decision button? That's the WRONG component — use `<falcon-angular-popup>`. Needs a different illustration? Edit the inlined SVG (no slot for it).
7. **Wrapper** — for a full creation flow, reuse `<falcon-angular-wizard-finalization>` (the existing wrapper that composes this dialog + the credentials picker) rather than building your own.

## Anti-patterns

- Using it as a decision/confirm dialog — it has no buttons.
- Putting copy-me text in it — clicking the panel dismisses it (G-CLICK-ANYWHERE).
- Routing it through the orchestrator's modal-adapter — tried + reverted (wrong visual; `falcon-wizard-finalization.component.html:14-23`).
- Passing untranslated i18n keys to `[title]`/`[subtitle]`.
- Using it for errors / warnings — wrong intent + wrong art.
- Expecting a token override to re-theme it — none exists.
- Forgetting to reset `[open]` on `(closed)` — the input is one-way.

## Verification
🟡 CODE-DERIVED from `falcon-completion-success-dialog.component.{ts,html}` + `falcon-wizard-finalization`. Visual fingerprint read directly from the template/SVG + inline styles. Cross-library mapping `[INFERRED]`; React 1:1 lineage ✅ via the component header (`admin/addclient.jsx` citation).
