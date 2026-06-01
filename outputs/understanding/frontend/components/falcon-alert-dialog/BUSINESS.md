# falcon-alert-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` The alert-dialog is how Falcon makes a user **stop and acknowledge a high-consequence decision before it happens**. In business terms it is the platform's "are you sure?" gate — the moment an operator commits to something that costs money, destroys data, or cannot be undone. It deliberately slows the user down: a large centered severity icon, a heavy title, a narrow centered subtitle, and a 2-button footer separated by whitespace. `[CODE]` `falcon-alert-dialog.tsx:104-131` — the severity (`danger`/`warning`/`info`/`success`) drives the icon glyph; `[CODE]` `:73-78` — Confirm and Cancel are distinct emitted events so the calling flow can branch on the operator's decision.

It is the canonical replacement for every legacy `window.confirm()` and hand-rolled "ConfirmModal" — `[CODE]` `OVERVIEW.md:13` — and is the centered-callout sibling of the small-prompt `falcon-confirm-dialog` and the 4-variant `falcon-popup`.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Insufficient-balance funding decision before payment | `[BRAIN-OUT]` `SPEC.md:5-12` (SoT `InsufficientBalanceModal`) | Add Client wizard → Payment step opens the alert-dialog when the chosen funding source cannot cover the order; the user must prioritise wallet channels and explicitly Confirm before the do-payment call fires. |
| Discard-unsaved-changes confirmation | `[INFERRED]` from `USAGE.md:103-108` (settings-tab + client-settings-step consumers) | Settings tab and Add Client Step 5 raise an alert-dialog before navigating away from a dirty form — the edit is only discarded on Confirm. |
| Destructive operations require explicit acknowledgement | `[CODE]` `USAGE.md:57-70` (destructive-confirmation template) | Account/record deletion opens `severity="danger"` with `[closeOnBackdrop]="false"` so the user cannot dismiss the warning by accident. |

## Business constraints baked in
- `[CODE]` `falcon-alert-dialog.tsx:134` — **severity is a business signal, not decoration.** `danger`/`warning` render `role="alertdialog"` (assertive); `info`/`success` render `role="dialog"`. Reserve `danger` for genuinely irreversible operations — `[CODE]` `OVERVIEW.md:52` ("overuse trains users to ignore the red").
- `[CODE]` `falcon-alert-dialog.tsx:161-178` — **the dialog must keep at least one action button.** A builder must NOT set both `hideConfirm` and `hideCancel` true (`[CODE]` `OVERVIEW.md:54`) or the user is trapped.
- `[CODE]` `falcon-alert-dialog.tsx:95-99` — **every dismissal is a business "no".** Backdrop / Esc / close-X / Cancel all emit `falcon-alert-cancel` with a `reason`; only the Confirm button emits `falcon-alert-confirm`. The flow must treat all four cancel reasons as "operator declined".
- `[INFERRED]` **alert-dialog is BEFORE the action, never after.** `[CODE]` `OVERVIEW.md:52` — post-action "saved!" feedback belongs to `falcon-toast`, not here.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — Payment step | organization-hierarchy | Insufficient-balance funding decision: prioritise wallet channels then Confirm/Cancel the payment `[CODE]` `USAGE.md:108` |
| Client Settings step (Add Client wizard) | organization-hierarchy | Discard-unsaved-changes / settings-confirm callout `[CODE]` `USAGE.md:107` |
| Settings tab (standalone) | organization-hierarchy | Exit-edit-mode / discard confirmation `[CODE]` `USAGE.md:106` |
| Destructive deletion (recommended) | platform-wide | `severity="danger"` "this cannot be undone" gate `[CODE]` `USAGE.md:57-70` |

## Business gotchas
- A `severity="warning"` and `severity="danger"` share the SAME red icon and the SAME teal Confirm color `[CODE]` `TOKENS.md:34-38` — the only behavioural difference is the ARIA role. Do not assume `danger` produces a red Confirm button; it does not.
- The dialog body is the ONLY consumer-projected region `[CODE]` `falcon-alert-dialog.tsx:156-158` — header and footer are component-rendered. A flow that needs a custom header (e.g. a step indicator) is using the wrong component; drop to `falcon-dialog`.
- `title` / `subtitle` are **plain-text inputs** `[CODE]` `OVERVIEW.md:54` — passing an HTML string renders the literal markup. Rich content goes in the body slot.
- The component closes itself optimistically on Confirm (`[CODE]` `falcon-alert-dialog.tsx:90-93` sets `open = false`) — if the confirmed business action then fails async, the dialog is already gone. The owning flow must surface the failure separately (toast / error dialog) — see `INTEGRATION_VALIDATION.md`.

## Verification
🟡 CODE-DERIVED from `falcon-alert-dialog.tsx` + dossier files. Insufficient-balance funding flow ✅ VERIFIED as the documented SoT origin (`SPEC.md`). Discard-confirmation usage in settings-tab / client-settings-step ✅ VERIFIED by Wave 7 consumer sweep (`USAGE.md:103-108`).
