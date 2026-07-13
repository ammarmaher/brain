# falcon-wizard-finalization — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` The component that **delivers a new account/user's credentials and confirms the hand-off**. After an operator finishes creating an entity, this orchestrator asks "how should the credentials reach the account owner?" (email / SMS / both), runs the host's create-and-send call behind a perceivable loader, and then either shows a branded "Credentials sent to the user" confirmation or a business-error toast. In business terms it is the **transactional close-out** of every entity-creation wizard — the moment the new identity becomes usable and the owner is notified.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Credentials are delivered via a chosen channel (email / SMS / both) | `[CODE]` ts:116 `defaultDelivery` + the channel dialog's `send` payload (`FalconCredentialDeliveryMethod`) | The channel picker lets the operator choose; the chosen method is the `submitFn` argument, so the host's send call honors it. |
| Add Client and Add User share ONE finalization flow | `[CODE]` org-hierarchy-page-menu.component.html:396-397 (comment) | Both wizards mount the SAME component; only `submitFn`/`open` differ — guarantees identical "send credentials" UX + copy across entity types. |
| The operator must see that the send is happening (no silent submit) | `[CODE]` ts:77-82 + `minLoaderGate$` (ts:230-234) | A 600 ms minimum-visibility gate makes the central loader perceivable even on a sub-200 ms backend, so the operator never perceives "nothing happened". |
| Success is acknowledged with the branded confirmation, not a generic alert | `[CODE]` ts:34-43 (Phase-3 partial-revert) | The success ack is the large branded `<falcon-angular-completion-success-dialog>` (clipboard illustration) — explicitly NOT the orchestrator's small red OK/Cancel alert. |
| A failed send shows the (localized) reason | `[CODE]` ts:262-293 (BUG-14) | On error, if the host threw a clean localized message (e.g. "Normal user limit reached…") it becomes the toast body; otherwise a generic fallback. |

## Business constraints baked in
- `[CODE]` **Send is single-shot per submission** — `onSend` early-returns if `submitting()` is already true (ts:197) and the picker's Send is disabled while submitting (`[disableSend]="submitting()"`). A double-click cannot fire two credential sends.
- `[CODE]` **The success dialog confirms delivery, not completion-of-everything** — its dismissal (`finalized`) is the operator acknowledging "credentials sent"; the host then closes the wizard/popup. The component does not itself navigate or close the page.
- `[CODE]` **Cancel ≠ failure** — `cancelled` (ts:154/237) is the operator backing out of the channel picker before sending; no toast, no error. The host simply closes the popup.
- `[CODE]` **Error is transient-by-design** — the submit error routes to a 5 s top-right `business-error` toast (ts:271-277), NOT a blocking modal. The business stance is "the create/send failed transiently; the operator may retry".
- `[INFERRED]` **The orchestrator owns no business data** — owner name/phone/email are passthrough display values; the actual entity payload + the credentials live in the host's state slice and `submitFn`.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client → finalize | org-hierarchy page menu (admin) | After the Add Client wizard Finish: pick channel → send account-owner credentials → confirm. ✅ live. |
| Add User → finalize | org-hierarchy page menu (admin + mgmt) | After the Add User wizard Finish (OTP step dropped): pick channel → send user credentials → confirm. ✅ live. |

## Business gotchas
- A success ack means **the host's send call resolved**, not that the email/SMS was physically received — delivery is the backend's responsibility downstream of the 200 response.
- The channel choice (`email`/`sms`/`both`) is a **business decision** the operator makes per creation; `defaultDelivery='email'` is just the pre-selected option.
- The error toast's body may be a backend business message (BUG-14) — so a "Normal user limit reached" failure surfaces its real reason, matching the Add Node "level limit exceeded" UX. A bracket-prefixed internal sentinel is suppressed in favor of the generic copy (ts:291).
- This is NOT the wizard itself — a business request to "change the steps" goes to the wizard/stepper, not here. This component only owns the credential hand-off close-out.
- The success ack auto-dismisses after `autoDismissMs` (default 10 s); pass `0` if the business wants it to persist until the operator explicitly closes it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier) — the channel-method payload, the single-shot Send guard, the inline-success-ack revert (ts:34-43), the business-error toast routing (ts:271-277), and the BUG-14 message passthrough (ts:283-293) all re-read from source. Cross-entity sharing confirmed by the two admin mounts + the mgmt Add User mount. The exact PRD rule IDs for credential delivery are 🟡 CODE-DERIVED from the component header + consumer comments, not re-read from a PRD this pass.
