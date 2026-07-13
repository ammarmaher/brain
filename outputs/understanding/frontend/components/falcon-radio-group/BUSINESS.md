# falcon-radio-group — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The all-options-visible single-choice control. Where `<falcon-angular-dropdown>` hides the option list behind a chevron, the radio-group lays every choice on the page at once — so it is how Falcon asks the operator to make a *small, consequential, mutually-exclusive decision* where seeing all alternatives at once matters. It is the right control when the *set of choices is itself information the operator should weigh*.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Wallet balance distribution is a single choice | `[CODE]` wallet-balance-management.component.html:202-209 (`distributionRadioOptions` / `selectDistribution`) | The "balance type" picker is a vertical radio set — the operator picks exactly one distribution mode. |
| Wallet structure (single/multiple) is a single choice | `[CODE]` wallet-balance-management.component.html:219-226 (`structureRadioOptions` / `selectStructure`) | The "wallet type" picker is a vertical radio set; locked (`[disabled]`) once the wallet is configured or while loading. |
| A choice is single-value by definition | `[CODE]` falcon-radio-group.component.ts:107-114 (`handleSelect` sets one `selected` signal) | The shared `name` (forwarded to every child) enforces native radio exclusivity — selecting one clears the rest; the business value is always exactly one. |

> `[INFERRED]` The prior dossier mapped this control to "password security level" on the Settings tab and to "pricing tiers". Those are plausible uses but are NOT grep-confirmed in the current tree — the only live consumer is `wallet-balance-management`. Treat the security-level / pricing-tier mappings as illustrative, not verified.

## Business constraints baked in
- `[CODE]` falcon-radio-group.component.ts:107-110 **Single value, always** — `handleSelect` ignores `checked=false` and no-ops if the value is already selected. The "exactly one choice" invariant is structural, not validated after the fact.
- `[CODE]` falcon-radio-group.component.ts:99-101 **Selection equality is strict `===`** — `isChecked()` compares with `===`. Bind option `value`s and the model with matching primitive types; a `'1'` model will not check a `value: 1` option. (DECISION §10 flags this as risky-to-change.)
- `[CODE]` falcon-radio-group.component.ts:103-105 **Disable cascades from three sources** — `isDisabled()` = `wrapperDisabled || cvaDisabled() || option.disabled`. A single option can be locked out (e.g. an entitlement the tenant lacks) while the rest stay live. The wallet pickers use the top-level `[disabled]` to lock the whole set when already-configured.
- `[INFERRED]` falcon-radio-group.component.ts:86-88 **Empty / unset normalises to `null`** — `writeValue(undefined) → null`. An un-chosen group and a falsy-but-set value are distinct; payload builders must preserve `null`.
- `[BRAIN-OUT]` **Best for ≤ ~8 options** — beyond that the business should switch to `<falcon-angular-dropdown>`; a 20-row radio-group buries the consequential choice.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Wallet balance config | admin wallet-balance-management | Single-select of balance distribution + wallet structure |
| `[INFERRED]` Settings one-of-N | org-hierarchy settings-tab | one-of-N policy/level (illustrative — not grep-confirmed in current tree) |
| `[INFERRED]` Filter status picker | org-hierarchy tabs | status one-of-many (illustrative) |

## Business gotchas
- A radio-group with all-but-one option `disabled` is a **business entitlement statement** ("only this is available to you"), not a bug — driven by `option.disabled`.
- **Type mismatch silently de-selects:** if the persisted value returns as a string but the options use numeric `value`s, the group renders with *nothing* checked. This looks like data loss but is the `===` rule — align the types.
- A "pick one" with more than ~8 alternatives belongs in a dropdown.
- There is no card/boxed variant — for an icon+title+description picker, use `<falcon-angular-tabs mode='radio-cards'>` (GAP G3), not this component.
- **Layout caveat (not a business rule but business-visible):** on the Angular path the group ships no styling for its own wrapper classes, so a builder must supply layout `class` or the options can render with default/awkward spacing (GAPS G2) — the wallet consumer does exactly this.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B06) — single-value `handleSelect`, `===` equality, 3-source disable, and `null` normalisation re-confirmed in live source. Business flows re-grounded to the grep-confirmed wallet consumer; the prior password-security-level / pricing-tier / settings-tab mappings demoted to `[INFERRED]` (not found in the current tree).
