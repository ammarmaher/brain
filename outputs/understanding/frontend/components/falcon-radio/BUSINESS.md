# falcon-radio — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` A single radio button — the atom of a **mutually-exclusive choice**. In business terms it commits the operator to exactly one option out of a small, fully-visible set: which wallet balance-type / wallet-type applies, which message/flow type a template uses, which of two or three branching paths a wizard takes. Unlike a dropdown (one value from a possibly-long *hidden* list), the radio is for short choice sets where seeing all options at once is the point. It is intended to be composed inside a group; standalone use is reserved for non-standard layouts (one radio per card/pill).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Wallet balance-type / wallet-type is a single choice | `[CODE]` wallet-balance-management.component.html:202-209 / 219-226 | The "balance type" and "wallet type" pickers are radio sets — the operator picks exactly one; `[disabled]="settingsDisabled() \|\| dataLoading()"` locks them when the wallet is already configured or loading. |
| Template message-type / flow-type is a single choice | `[CODE]` step1-basic-info.component.html:125 / flow-type-modal.component.html:56,97 | Each type is a radio card; some are rendered `disabled` + pre-checked to communicate a locked/pre-decided choice visually. |
| Mutual exclusivity is platform-enforced | `[CODE]` falcon-radio.tsx:2-8,157 | A real native `<input type="radio">` underneath — the browser guarantees only one radio per `name` is selected; the business never has to police it. |
| A radio cannot be un-picked by the operator | `[CODE]` falcon-radio.tsx:83-87,100-105 | `select()` is one-way and clicking an already-checked radio fires nothing — once a choice is made it can only change to another option, never back to "nothing". |

## Business constraints baked in
- `[CODE]` falcon-radio.tsx:48 **A radio carries a business value** — `value` (`string \| number \| boolean`, default `'on'`). The selected radio's `value` *is* the committed decision. A builder must set a meaningful `value` per option, not leave the default.
- `[CODE]` falcon-radio.tsx:47 **`name` is the exclusivity key** — all radios in one logical choice MUST share a `name`; that is what makes them one group at the platform level.
- `[CODE]` falcon-radio.component.ts:102-104 **CVA value is the group's value** — `writeValue` receives the *group's* current value and the radio self-checks if it equals its own `value`; `onChange` emits this radio's `value` when it becomes checked, `null` otherwise. The radio reasons about the whole choice, not its own boolean.
- `[CODE]` falcon-radio.component.ts:64-73,116-128 **A disabled radio is genuinely inert** — the `disabledInput` setter + the `handleChange` early-return (`if (this.disabled()) return`) close the "view-mode card still clickable" bug: a locked choice cannot move selection. This is a deliberate role/state gate (e.g. wallet already configured), not a defect.
- `[CODE]` falcon-radio.tsx:118-123 **Enter does not submit** — `keydown` Enter is suppressed so selecting a radio inside a form never accidentally fires submit; Space/arrows behave natively.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Wallet balance-type / wallet-type config | admin new/old wallet-balance | Single-select of the balance distribution + wallet structure |
| Template type / flow-type selection | templates wizard (both consoles) | One radio per type card; locked cards shown disabled+checked |
| Wizard branching choices | org-hierarchy add-client/add-user steps | Single-row mutually-exclusive option (one path of N) |
| Settings single-choice rows | org-hierarchy settings-tab | One option from a small set |

## Business gotchas
- A choice with **only two options** that is a true on/off is usually a `<falcon-angular-switch>` or `<falcon-angular-checkbox>`, not radios — radios are for *named alternatives*, not booleans.
- For more than one option, the intent is "use the group" — but be aware the Angular `<falcon-angular-radio-group>` ships no Light-DOM styling for its own wrapper classes (see that dossier), so production code today often lays out radios directly.
- The radio has **no concept of "unselected is invalid"** on its own — "the operator must pick something" is a `required` rule the group/parent enforces; a lone radio will not block submit.
- A **disabled, pre-checked radio is a statement** ("this choice is fixed / already made"), not a defect — used by the templates cards and the configured-wallet pickers.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B06) — one-way `select()`, native exclusivity, group-valued CVA, and the `disabledInput` inert-disable gate re-confirmed in live source. Business-rule rows 🟡 CODE-DERIVED from the cited wallet/templates consumer templates. Prior dossier's OTP-send-dialog channel-step example REMOVED (unverified — no radio reference in `falcon-otp-send-dialog`); replaced with the grep-confirmed wallet + templates flows.
