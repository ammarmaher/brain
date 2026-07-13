# falcon-sending-credentials-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-sending-credentials-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A centered modal (max-width ~880px) on a teal-tinted dim+blur backdrop. Top-end **close X**. A centered **title** ("Sending Credentials") + a muted **subtitle**. Below it, a "Delivery method:" label and **three side-by-side cards** — Email / SMS / Both — each with a small **radio dot** + label at the top and a **decorative illustration** (envelope / phone-with-bell / paper-plane) in the body; the selected card has a solid teal border + a soft teal ring, the others a dashed neutral border. Below the cards, a **teal-tinted owner-summary card** in 3 columns (Account owner / Phone Number / Email, each with a circular icon + key + value). Footer: a **Cancel** link button + a **Send Credentials** primary button, right-aligned. If you see a "how should we send the login details?" picker after creating an account, this is it.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + `<RadioGroup>` of `<Card>`-styled `<FormControlLabel>` + `<DialogActions>` | MUI composes Dialog+RadioGroup+actions; Falcon bakes the whole credential-send UX into one component. |
| PrimeNG | `<p-dialog>` + `<p-selectButton>`/`<p-radioButton>` + footer buttons | direct conceptual match; Falcon's is domain-specific (not generic). |
| Ant Design | `<Modal>` + `<Radio.Group>` of card radios + footer | Ant's card-radio pattern ≈ Falcon's illustrated method cards. |
| Bootstrap | `.modal` + custom radio cards + `.modal-footer` | upgrade target — replace wholesale. |
| shadcn / Radix | `<Dialog>` + `<RadioGroup>` (card items) + buttons | shadcn composes primitives; Falcon is one composite. |
| plain HTML | `<dialog>` + `<fieldset>` of `<input type=radio>` cards | replace with this for the credential-send domain. |
| React (Falcon SoT) | `SendCredentialsModal` (admin/addclient.jsx 680-749) | THIS is the verbatim port target. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a "choose how to send the new account's credentials" modal | `<falcon-angular-sending-credentials-dialog>` | a generic confirm |
| the full create→confirm-send→success wizard tail | `<falcon-angular-wizard-finalization>` (composes this) | this alone |
| a success "account created" acknowledgement | `<falcon-angular-completion-success-dialog>` | this |
| a generic yes/no or OK confirmation | `FalconMessageOrchestratorService.show()` / `<falcon-angular-popup>` | this |
| a destructive-action acknowledgement | `<falcon-angular-alert-dialog>` (severity) | this |
| an arbitrary form inside a dialog | a domain dialog over `<falcon-angular-dialog>` | this |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper. For THIS component the order collapses (no slots, no variants, no tokens):

1. **Inputs** — `[open]`, `[ownerName]`/`[ownerPhone]`/`[ownerEmail]`, `[defaultDelivery]`, `[disableSend]`, and the label inputs (`[title]`, `[subtitle]`, `[deliveryLabel]`, `[sendLabel]`, `[cancelLabel]`, `[emailMethodLabel]`/`[smsMethodLabel]`/`[bothMethodLabel]`, the summary key labels), plus `[closeOnBackdrop]`/`[closeOnEsc]`. Feed pre-translated strings.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — none (no `<ng-content>`). The cards + illustrations + summary are fixed.
4. **Variants** — none (single fixed visual).
5. **Token override** — none (no token file; G3).
6. **Upgrade** — need a radiogroup container / SMS gating / dark-mode SVGs? Those are GAPs (G1/G4/G2), raise them — do not fork the template.
7. **Wrapper** — for the standard flow, do NOT wrap — use `<falcon-angular-wizard-finalization>`, which already composes this dialog + the success dialog.

## Anti-patterns

- Treating `(send)` as "credentials delivered" — it is only "operator chose method X"; the parent performs the API send.
- Expecting `[(open)]` two-way binding — `open` is one-way; flip it in `(send)`/`(cancel)`.
- Trying `[(ngModel)]` / `formControlName` — no CVA.
- Importing `<falcon-send-credentials-popup>` / `FalconSendCredentialsPopupComponent` — **deleted from source**; the path no longer resolves.
- Adding SCSS or restyling via host `class=` — no token/override surface; copy is the only safe change.
- Building a generic confirm with this component — use the orchestrator / alert-dialog instead.
- Removing the inline `dialog.falcon-sc-dialog` reset to "clean up" — it is the load-bearing Top-Layer centring fix (ts:56-64).
- Using `*ngIf`/`*ngFor` around it — use `@if`/`@for`.

## Verification
🟡 CODE-DERIVED from falcon-sending-credentials-dialog.component.{ts,html} + the wizard-finalization composition. Sibling routing cross-checked against `OVERVIEW.md` "When NOT to use it". Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge. React SoT mapping per `[CODE]` ts:2 comment.
