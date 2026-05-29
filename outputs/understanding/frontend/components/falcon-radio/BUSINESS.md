# falcon-radio — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` A single radio button — the atom of a **mutually-exclusive choice**. In business terms it commits the operator to exactly one option out of a small, fully-visible set: which OTP delivery channel to use, which mode/type applies, which of two or three branching paths a flow takes. Unlike a dropdown (one value from a possibly-long *hidden* list), the radio is for short choice sets where seeing all options at once is itself the point. It is almost always composed inside `<falcon-angular-radio-group>`; standalone use is reserved for non-standard layouts (one radio per card).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| OTP delivery channel is a single choice | `[BRAIN-OUT]` OTP-send-dialog step 1 (OVERVIEW.md "Known consumers") | The email / SMS / both channel chooser is a radio set — the operator picks one delivery path. |
| Mutual exclusivity is platform-enforced | `[CODE]` `falcon-radio.tsx:2-8,157` | A real native `<input type="radio">` underneath — the browser guarantees only one radio per `name` is selected; the business never has to police it. |
| A radio cannot be un-picked by the operator | `[CODE]` `falcon-radio.tsx:82-87,100-105` | `select()` is one-way and clicking an already-checked radio fires nothing — once a choice is made it can only change to another option, never go back to "nothing". |

## Business constraints baked in
- `[CODE]` `falcon-radio.tsx:48` **A radio carries a business value** — `value` (`string | number | boolean`, default `'on'`). The selected radio's `value` *is* the committed business decision. A builder must set a meaningful `value` per option, not leave the default.
- `[CODE]` `falcon-radio.tsx:47` **`name` is the exclusivity key** — all radios in one logical choice MUST share a `name`; that is what makes them one group at the platform level. `<falcon-angular-radio-group>` auto-generates and forwards it.
- `[CODE]` `falcon-radio.component.ts:91-93` **CVA value is the group's value** — `writeValue` receives the *group's* current value and the radio self-checks if it equals its own `value`; `onChange` emits this radio's `value` when it becomes checked, `null` otherwise. The radio reasons in terms of the whole choice, not its own boolean.
- `[CODE]` `falcon-radio.tsx:118-123` **Enter does not submit** — `keydown` Enter is suppressed so selecting a radio inside a form never accidentally fires submit; Space/arrows behave natively.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| OTP send dialog — step 1 | host-shell / consoles (`<falcon-angular-otp-send-dialog>`) | Email / SMS / both delivery-channel chooser |
| Wizard branching choices | organization-hierarchy wizards | Single-row mutually-exclusive option (one path of N) |
| Card-style option pickers | settings / config panels | One radio per option card (standalone use) |

## Business gotchas
- A choice with **only two options** that is a true on/off is usually a `<falcon-angular-switch>` or `<falcon-angular-checkbox>`, not radios — radios are for *named alternatives*, not booleans.
- For more than one option, **never hand-roll multiple `<falcon-angular-radio>`s** — use `<falcon-angular-radio-group>`; it owns the shared `name`, arrow-key navigation, and the single-value CVA contract.
- The radio has **no concept of "unselected is invalid"** on its own — "the operator must pick something" is a `required` rule the group/parent enforces; a lone radio will not block submit.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-radio.tsx` + `falcon-radio.component.ts`. OTP-send-dialog channel-step usage 🟡 from `OVERVIEW.md` "Known consumers". One-way-select, native-exclusivity, group-valued-CVA ✅ VERIFIED against source.
