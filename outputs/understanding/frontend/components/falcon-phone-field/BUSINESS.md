# falcon-phone-field — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` `falcon-phone-field.tsx:1-6` — The canonical way an operator commits a **contactable phone identity** to the platform: a country selection + a national number, normalized into one E.164 value. In business terms this is the field through which the platform learns *how to reach a person by SMS* — the side-channel that underpins OTP delivery, account-owner verification, and forgot-password recovery. It is not "a number input"; it is the binding between a human and an SMS-reachable address.

## What it CAN do (business capability)
- `[CODE]` `falcon-phone-field.utils.ts:8-34` Offer a curated country list (25 countries, GCC + MENA-first ordering: SA, AE, EG, JO, KW, BH, QA, OM…) so the operator picks the dial code rather than memorizing it.
- `[CODE]` `falcon-phone-field.tsx:200-209` Compose the full number as `"+<dial> <national>"` and emit all four facets (`value` E.164-ish, `country`, `dialCode`, `nationalNumber`) so a flow can store the canonical form and still display the national part.
- `[CODE]` `falcon-phone-field.tsx:62-63,268-272` Expose an optional **Verify** button (`verifyButton`) that fires `falcon-verify` — the trigger that hands the number to an OTP-send flow.
- `[CODE]` `falcon-phone-field.component.ts:76` Accept a business-restricted country set via `[countries]` — e.g. a tenant that only operates in the GCC.

## What it CANNOT do (business limits — do not assume otherwise)
- `[CODE]` `falcon-phone-field.tsx:2-6` + `OVERVIEW.md` **It does not validate the number.** It strips non-digits (`digitsOnly`) and composes a string — it never checks length, prefix validity, or that the number is real for the chosen country. A builder MUST add a Reactive Forms validator. Treating an emitted value as "a valid phone" is a business correctness bug.
- `[CODE]` `falcon-phone-field.tsx:268-272` The Verify button only *emits an intent* — it does not send an OTP, does not call the backend, does not show a verified state. The flow owns delivery + confirmation.
- `[INFERRED]` There is no "verified ✓" business state surfaced — a number the user verified looks identical to one they did not. A flow that needs to gate on verification must track that itself.
- `[CODE]` `falcon-phone-field.utils.ts:8-34` The default list is 25 countries only — a country outside it cannot be chosen unless the consumer passes a wider `[countries]`.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Account-owner must have a reachable phone | `[BRAIN-OUT]` Add Client / Add User playbooks (`USAGE.md` consumer list) | Account-owner step renders this with `[required]="true"` + `verifyButton` — the phone is a mandatory, verifiable account-owner attribute. |
| OTP delivery channel | `[CODE]` `forgot-password-flow.service.ts:20-28` | The phone captured here is the `phoneNumber` submitted to `auth/forgot-password` for SMS OTP delivery. |
| E.164 storage canonicalization | `[INFERRED]` from `composeFullNumber` + `nationalNumber` split | The platform stores a single canonical number; the component is the normalization boundary at data entry. |

## Business constraints baked in
- `[CODE]` `falcon-phone-field.tsx:51` Default country `SA` — Saudi-first product default. A builder should override `country` only when the business context differs.
- `[CODE]` `falcon-phone-field.tsx:258-266` Selecting a new country re-emits `falcon-change` and refocuses the input — a country switch is a *business event*, not just a cosmetic change, because it changes the dial code that prefixes the stored value.
- `[INFERRED]` Validation-deferred is itself a business decision: the library refuses to encode one country's number rules, leaving the flow (which knows the regulatory context) to validate.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard — account-owner step | organization-hierarchy | Captures + offers verify for the account-owner phone. |
| Add User wizard — personal step | organization-hierarchy | Captures the new user's phone. |
| Forgot-password flow | host-shell auth | Captures the phone that receives the recovery OTP (via the `<falcon-mobile-number>` legacy facade in the old UI; new code uses this directly). |
| Profile phone update | host-shell | Edits a user's reachable number. |

## Business gotchas
- An emitted `value` is **not proof of a valid or owned number** — only the Verify→OTP round-trip proves ownership. Do not skip verification because "the field looked filled in."
- A disabled Verify button (`disabled`) means the *whole field* is locked, not just verification — it is a business statement that the phone is not editable in this context.
- If the country a tenant needs is missing, that is a **country-list business gap** (extend `[countries]`), not a UI defect.

## Verification
🟢 code-verified (2026-06-03) — re-read `falcon-phone-field.tsx` (`buildDetail`/`composeFullNumber` `:202-211`, `selectCountry` re-emit `:260-268`, `handleVerifyClick` guard `:270-274`, default `country='SA'` `:51`) + `.utils.ts` (`DEFAULT_PHONE_COUNTRIES` = 25, `:8-34`). All business facts confirmed; no corrections needed this pass. Flagship consumer is the shared User-Details page (`verifyButton`+`verifyIcon`, PES-gated `canEditPhone`) + the forgot-password SMS-OTP capture. Verified-state absence ✅ VERIFIED against source (no `verified` prop on either tag).
