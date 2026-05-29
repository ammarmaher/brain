# send-credentials-popup (LEGACY / ORPHAN) — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> ⚠ **Correction vs the old 6 dossier files:** the existing dossiers describe `send-credentials-popup` as a live legacy component at `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/`. **The source files no longer exist** (verified 2026-05-18 — `Glob **/send-credentials-popup/*.{ts,html}` returned nothing). This component is an **ORPHAN**. Its live successor is `falcon-sending-credentials-dialog` (`<falcon-angular-sending-credentials-dialog>`). This file documents the *business intent* the component carried and where that intent now lives.

## Business purpose
`[BRAIN-OUT]` `send-credentials-popup` was the **credential-delivery confirmation overlay** — after the platform creates a new account (a client or a user), the new account owner needs their initial username + password delivered out-of-band. This popup let the operator confirm **how** those credentials should be sent (email / SMS / both) before the platform dispatched them.

The exact business trigger is **a successful account creation that produces login credentials** — at the finalize step of the Add Client wizard and the Add User wizard. The popup is the operator's last confirmation: "the new owner is `<name>`, send their credentials via `<channel>`".

`[CODE]` `falcon-sending-credentials-dialog.component.ts:1-4` — the successor states its lineage explicitly: it is a "pixel-parity port of the React `SendCredentialsModal` (admin/addclient.jsx 680-749)" for **Add Client wizard Step 5**.

## PRD / business rules touched
| Rule | Source | How this component (and its successor) enforces / surfaces it |
|---|---|---|
| A new account owner must receive initial credentials out-of-band | `[INFERRED]` from the flow — Add Client / Add User finalize step | The popup is the confirmation gate before the platform sends username + password. |
| `[BRAIN-SK]` Add Client wizard is a 5-step flow; Step 5 finalizes | `[VAULT]` / `Brain Outputs/.../organization-hierarchy/Add Client/` (folder-form playbook) | The successor `falcon-sending-credentials-dialog` is explicitly the **Step 5 submission popup** — credential delivery is part of the canonical Add Client implementation spec. |
| Delivery method is operator-chosen at send time | `[CODE]` `falcon-sending-credentials-dialog.component.ts:62-63,99-110` | `defaultDelivery` seeds the selection; the operator may change it to `email` / `sms` / `both` before pressing Send. |

## Business constraints baked in
**Legacy `send-credentials-popup` (per the old API dossier — source now gone):**
- `[BRAIN-OUT]` `API.md:33` **Selection defaulted to `DeliveryMethod.Email`** — email was the assumed channel unless the operator changed it.
- `[BRAIN-OUT]` `API.md:53` **`loading=true` disabled Submit** — prevented a double-send while the dispatch API call was in flight; the consumer had to reset `loading` on both success and error.
- `[BRAIN-OUT]` `API.md` Delivery options came from the `DeliveryMethod` enum — the operator could only pick a defined, supported channel.

**Live successor `falcon-sending-credentials-dialog` (`[CODE]` source):**
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:106-110` **`selected` re-seeds from `defaultDelivery` on every open** (false→true `effect`) — each new account starts from a clean default, not the previous operator's choice.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:65,126-129` **`disableSend=true` blocks Send** — the same in-flight guard, now as a signal input.
- `[CODE]` `falcon-sending-credentials-dialog.component.ts:27` **Delivery method is a closed union** `'email' | 'sms' | 'both'` — exactly three supported channels, no free choice.
- `[CODE]` `falcon-sending-credentials-dialog.component.html:124-166` **The owner summary card shows name + phone + email** — the operator sees, before sending, exactly *who* receives the credentials and *to which* contact points.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — finalize / Step 5 | organization-hierarchy | `[CODE]` `falcon-sending-credentials-dialog.component.ts:1` — successor is the Step 5 submission popup; operator confirms credential delivery for the new account owner. |
| Add User wizard — finalize | organization-hierarchy | `[BRAIN-OUT]` `OVERVIEW.md:10` + `[MEMORY]` `USAGE.md:67` references `add-user-wizard.component.html:130` documenting the swap from the legacy popup to the successor. |
| Any account-creation flow needing out-of-band credentials | (general) | `[BRAIN-OUT]` `OVERVIEW.md:11` — the credential-delivery confirmation pattern generalizes to any flow that mints login credentials. |

## Business gotchas
- `[BRAIN-OUT]` `USAGE.md:63-67` **This component is an ORPHAN — do not use it.** No source, no consumers, no module-federation references as of Wave 7 (2026-05-17). It is superseded by `falcon-sending-credentials-dialog`. The only surviving textual trace is a comment in `add-user-wizard.component.html:130`.
- `[BRAIN-OUT]` `OVERVIEW.md:13` **It was domain-specific, never a generic confirm dialog** — and the same is true of the successor. For a generic OK/Cancel decision use `<falcon-angular-confirm-dialog>` or `<falcon-angular-popup>`.
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:19` The legacy popup hard-coded an English `recipientLabel='Account owner'` default — the successor fixes this by exposing every label as a pre-translated input (`ownerKeyLabel`, `phoneKeyLabel`, etc.).
- `[INFERRED]` The legacy popup emitted the `DeliveryMethod` **enum**; the successor emits a string **union** (`'email' | 'sms' | 'both'`). A flow migrated from the old component must map the union back to whatever enum the credential-dispatch API expects.

## Verification
🔴 INFERRED for the legacy component — its source no longer exists; the legacy facts are reconstructed from the existing 6 dossier files (`[BRAIN-OUT]`) which themselves flag the component as an ORPHAN. 🟡 CODE-DERIVED for the successor `falcon-sending-credentials-dialog` from `[CODE]` `falcon-sending-credentials-dialog.component.{ts,html}`. **Correction recorded:** the old dossiers' "LEGACY-IN-USE" framing is stale — the component is gone; treat `falcon-sending-credentials-dialog` as the real component.
