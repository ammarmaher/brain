# falcon-email-field — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The control for capturing an **email address that the business may need to prove is reachable**. Beyond a plain text field, it carries an in-field **Verify** affordance so the operator can trigger an email-verification challenge at the point of entry. In business terms it is the entry point of the *email-ownership confirmation* flow — the account owner's address in Add Client, a user's contact email, a profile-update email — where a wrong or unverified address has real downstream cost (failed credential delivery, lost notifications).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Account owner email must be reachable | `[BRAIN-OUT]` Add Client wizard (OVERVIEW.md "Known consumers") | The account-owner email field can show a Verify button so the operator confirms the address before the client is created. |
| Email verification is an explicit operator action | `[CODE]` `falcon-email-field.tsx:69-70,125-128` | The component **emits `falcon-verify` only** — it never performs verification itself. The business flow (send OTP / verification code) is owned by the consumer. |
| `[INFERRED]` Verify is gateable independently of the field | `[CODE]` `falcon-email-field.tsx:50,210` (`verifyDisabled`) | `verifyDisabled` disables *only the button* — so a flow can let the operator type/correct the email yet block "Verify" until the value is a valid email. |

## Business constraints baked in
- `[CODE]` `falcon-email-field.tsx:39,53` **`type="email"` + `autocomplete="email"` by default** — the field declares its business meaning to the browser/AT; the operator gets email-appropriate keyboards and autofill.
- `[CODE]` `falcon-email-field.tsx:48` **Verify button is opt-in** (`verifyButton=false` default) — a plain email capture shows no button; the button is a deliberate signal that "this address will be challenged."
- `[CODE]` `falcon-email-field.tsx:126` **Verify is suppressed while disabled** — `handleVerifyClick` returns early if `disabled || verifyDisabled`; the business cannot trigger a verification on a locked field.
- `[BRAIN-OUT]` **Validation is deferred** — the component does not decide if an email is valid; the consumer's reactive `Validators.email` does. The field only *renders* the error the consumer hands it. A builder must not expect built-in format checking.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard | organization-hierarchy | Account-owner email entry (+ optional verify) |
| Add User wizard | organization-hierarchy | User contact email |
| Profile update | admin-console / management-console | Editing a stored email address |
| Verify-email screens | host-shell / consoles | Email entry that drives an OTP/code send |

## Business gotchas
- The Verify button is a **trigger, not a result** — pressing it fires `falcon-verify`; the actual challenge (and any "verified ✓" state) is the consumer's job. There is no built-in `verified` visual yet (`DECISION.md` G2 / `[CODE]` no such prop).
- `verifyDisabled` is a *separate business gate* from the input's disabled state — keep it in sync with form validity so the operator cannot verify an obviously-malformed address.
- A green/checked "email verified" badge seen in a design is **not** this component out-of-the-box — it is a future upgrade; today the consumer renders confirmation itself.

## Verification
🟢 code-verified (2026-06-03) — re-read `falcon-email-field.tsx` (`handleVerifyClick` guard `:125-128`, `type="email"`/`autocomplete` defaults `:40,53`, `verifyButton` opt-in `:48`). All cited business facts confirmed; no business-fact corrections needed this pass. Flagship consumer is the shared User-Details page (`verifyButton`+`verifyIcon`, PES-gated `canEditEmail`) — rendered by admin + management. "Verified state" absence ✅ VERIFIED against source (no `verified` prop on either tag).
