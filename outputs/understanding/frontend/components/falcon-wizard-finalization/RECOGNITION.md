# falcon-wizard-finalization — Recognition Layer

> Given an external design / screenshot / flow description, identify `<falcon-angular-wizard-finalization>` as the component to use, and how to compose it.

## Visual fingerprint
This component has **no visual fingerprint of its own** (`display: contents`). What you SEE is the sequence it drives:
1. A **modal** asking "Sending Credentials" with an owner summary (name / phone / email) and a **delivery-method choice** — three cards/options: *Send via Email* · *Send via SMS* · *Both, SMS and Email* — plus **Send Credentials** / **Cancel** buttons.
2. The instant Send is clicked, the modal disappears and a **full-screen / central loader overlay** shows for at least ~600 ms.
3. On success, a **large branded confirmation dialog** (clipboard illustration, "Completed successfully" / "Credentials sent to the user", auto-dismiss).
4. On failure, a **red top-right toast** (5 s) with the reason.

Recognize it by the **whole sequence** (channel pick → loader → branded success / error toast at the END of a create flow), not by a single widget.

## Cross-library equivalents
| Library | Their pattern | Parity notes |
|---|---|---|
| MUI | a `<Dialog>` (radio group + buttons) → `<Backdrop>` loader → `<Snackbar>`/success `<Dialog>` wired by hand in the page | MUI has no packaged "finalization" orchestrator; you assemble it. This component is that assembly, reusable. |
| PrimeNG | `<p-dialog>` + `<p-blockUI>`/`<p-progressSpinner>` + `<p-toast>` | same — three primitives hand-wired; Falcon packages them with the state machine + perceivable-loader gate. |
| Ant Design | `<Modal>` + `Modal.confirm`/`message` + a global spin | no single component; Falcon's orchestrator owns the picker↔loader↔success↔error transitions. |
| plain HTML/JS | a form modal + a spinner + an alert, glued by promise callbacks | always replace with this for credential-send close-outs. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| the END of a create-entity flow: pick a credential channel → send behind a loader → confirm / error | `<falcon-angular-wizard-finalization>` | — |
| the multi-step wizard chrome (stepper + steps + Next/Back/Finish) | `<falcon-angular-wizard>` | this orchestrator |
| just the channel picker (no loader/success/error state machine) | `<falcon-angular-sending-credentials-dialog>` | this orchestrator |
| just a success ack dialog | `<falcon-angular-completion-success-dialog>` | this orchestrator |
| a generic confirm / alert | `<falcon-angular-popup>` / `FalconMessageOrchestratorService` | this orchestrator |

## Composition recipe to reach the flow
Customization order (`[MEMORY]` feedback_falcon_custom_library_mandatory): inputs → (no templates/slots) → token override on the CHILD dialogs → upgrade → wrapper.
1. **Inputs** — provide `[submitFn]` (REQUIRED — `(method) => Observable`), drive `[open]` from your wizard's Finish, pass `[ownerName]`/`[ownerPhone]`/`[ownerEmail]`, set `defaultDelivery`, and pass ALL translated label/title/body inputs (`channelTitle`, `successTitle`, `successSubtitle`, `errorToastTitle`, `errorToastBody`, the method labels).
2. **Templates / slots** — none. The component composes two fixed child dialogs; there is no content projection.
3. **Outputs** — wire `(finalized)` to close the wizard/popup + refresh the tree, `(cancelled)` to close the picker.
4. **Token override** — to restyle the picker / success dialog, override the CHILD dialogs' `--falcon-*` tokens (this orchestrator has none). 
5. **Upgrade** — need to react to a send failure beyond the toast? That is GAP G1 (`(error)` output) — raise it, or observe inside your `submitFn` meanwhile.
6. **Wrapper** — none needed; the component IS the reusable wrapper over the credential-send close-out.

## Anti-patterns
- Forgetting `[submitFn]` — it is required; the component throws.
- Putting the API call anywhere but `submitFn` — the orchestrator is HTTP-free by contract.
- Driving the inner channel dialog's `[open]` yourself — the orchestrator owns the picker↔loader↔success gate (`pickerOpen` computed).
- Showing your own loader during the send — the orchestrator manages the central overlay + the minimum-visibility gate.
- Re-routing the success ack through the message orchestrator — deliberately reverted (renders the wrong small red alert).
- Mounting `<falcon-angular-sending-credentials-dialog>` / `<falcon-angular-completion-success-dialog>` separately ALONGSIDE this — double render.
- Adding Tailwind/CSS to the host element — `display: contents` makes it inert; style the child dialogs via tokens.
- Treating it as the wizard shell — it is the FINISH close-out, mounted beside the wizard/stepper.

## Verification
🟡 CODE-DERIVED from `falcon-wizard-finalization.component.{ts,html}` + the two composed dialogs' inputs/outputs. The flow sequence is ✅ VERIFIED against the file header + `onSend`/`onSuccessClosed` logic. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
