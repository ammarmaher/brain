# falcon-sending-credentials-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` This is the **credential-handoff confirmation gate** of every account-creation flow. When an operator finishes creating a client account (Add Client) or a user (Add User), the new account's username + initial password must reach the account owner **out-of-band** — Falcon does not show the password on screen. This dialog is where the operator chooses HOW that handoff happens (Email, SMS, or Both) and confirms the send. In business terms it is the bridge between "the record now exists" and "the human can log in."

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Initial credentials are delivered out-of-band after account creation | `[CODE]` ts:106-108 subtitle ("An email and/or SMS with the username and password will be sent to the account owner") + `[CODE]` falcon-wizard-finalization.component.ts:50-51 ("delivery-method picker") | The dialog is the mandatory confirm step; the operator cannot complete the create without choosing a delivery method and pressing Send (or cancelling). |
| Delivery method is operator-selectable per send | `[CODE]` ts:34 `FalconCredentialDeliveryMethod = 'email' \| 'sms' \| 'both'` + ts:159-161 `pickMethod` | Three first-class options; default seeded from `[defaultDelivery]`, overridable each open. |
| Owner contact context must be visible before sending | `[CODE]` html:132-175 owner-summary card (name / phone / email) | The operator sees exactly which name/phone/email the credentials go to before confirming — a guardrail against sending to the wrong target. |
| Send must be blocked while submitting | `[CODE]` ts:102 `disableSend` + ts:168-171 `onSend` guard | The primary button is disabled (`[attr.disabled]`) and `onSend()` early-returns while `disableSend()` is true — prevents double-send. |

## Business constraints baked in

- `[CODE]` **Single-confirm, no two-way state** — the parent owns `open`; the dialog only emits `(send)`/`(cancel)`. The business decision (which method) leaves the component as a one-shot payload; the dialog never persists or mutates anything itself.
- `[CODE]` **Default delivery is `email`** (`[CODE]` ts:99, ts:133) — the safest universal channel; SMS/Both are operator opt-ins. `[INFERRED]` mirrors the React SoT default.
- `[CODE]` **Labels are pre-translated by the parent** — the business copy (title/subtitle/method labels) is owned by the wizard-finalization composite's i18n, not the component. A builder must NOT hardcode English here; pass translated strings (the wizard already does).
- `[INFERRED]` **`both` means SMS+Email simultaneously** — the label "Both, SMS and Email" (`[CODE]` ts:120) and the SoT comment imply both channels fire; the actual fan-out is a backend concern (see `INTEGRATION_VALIDATION.md`).

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client — finalization | org-hierarchy-page Add Client wizard (admin + management) | After the client + account-owner are created, choose+confirm credential delivery to the owner. |
| Add User — finalization | org-hierarchy-page Add User wizard (admin + management) | After the user is created, choose+confirm credential delivery to the new user. |
| (any future create-account flow) | via `<falcon-angular-wizard-finalization>` | Same pattern — the composite pairs this picker with the success dialog. |

`[CODE]` All flows reach it through `<falcon-angular-wizard-finalization>` (`[CODE]` falcon-wizard-finalization.component.html:25); the chosen method is mapped to the backend delivery enum in `apps/admin-console/.../add-client-wizard/models/wire-builders.ts`.

## Business gotchas

- `[CODE]` **The dialog does not send anything** — it emits the chosen method; the wizard-finalization parent (and its API service) performs the actual create+send. Treating `(send)` firing as "credentials delivered" is wrong: delivery succeeds only when the backend call resolves. The parent gates `disableSend` on its own submitting signal until the API resolves.
- `[CODE]` **`both` does not validate that the owner has both a phone AND an email** — the component shows whatever `ownerPhone`/`ownerEmail` strings it is given (possibly empty) and offers all 3 cards unconditionally (`[CODE]` html:50-128). If business rules require a phone for SMS, that gate lives upstream (the wizard / backend), not here. `[INFERRED]` flag — see GAPS G4.
- **Supersession** — any business doc still referencing `send-credentials-popup` / `DeliveryMethod` enum + `submit` output is stale; the live contract is this dialog's `FalconCredentialDeliveryMethod` + `(send)`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) — subtitle copy (ts:106-108), `disableSend` guard (ts:168-171), `pickMethod`/`selected` (ts:159-161), owner-summary card (html:132-175), and the wizard-finalization ownership (falcon-wizard-finalization.component.ts:50-51) all read from live source. 🟡 The "out-of-band credential delivery" business rule is CODE-DERIVED from the subtitle + SoT comments; the exact PRD/V-rule IDs were not located in this pass (no V-rule prefix found) — `[INFERRED]` flag.
