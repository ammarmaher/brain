# falcon-radio-group — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The all-options-visible single-choice control. Where `<falcon-angular-dropdown>` hides the option list behind a chevron, `<falcon-angular-radio-group>` lays every choice on the page at once — so it is how Falcon asks the operator to make a *small, consequential, mutually-exclusive decision* where seeing all alternatives at once matters: a password security level, a pricing tier, a status. It is the right control when the *set of choices is itself information the operator should weigh*.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Password security level is a one-of-N tenant setting | `[MEMORY]` project_settings_tab_standalone_wave14 (`rootPasswordSecurityLevel` / `accountPasswordSecurityLevel` PES sections) | Settings tab exposes the security level as a small fixed set of mutually-exclusive options — radio-group is the natural control for it. |
| A choice is single-value by definition | `[CODE]` falcon-radio-group.component.ts:107-114 (`handleSelect` sets one `selected` signal) | The shared `name` enforces native radio exclusivity — selecting one option clears the rest; the business value is always exactly one. |
| Pricing tier is one-of-many | `[CODE]` USAGE.md:21-27 (horizontal pricing-tier example) | A pricing/tier picker renders all tiers side-by-side so the operator compares before committing. |

## Business constraints baked in
- `[CODE]` **Single value, always** — `handleSelect` ignores `checked=false` and no-ops if the value is already selected (falcon-radio-group.component.ts:107-110). The business invariant "exactly one choice" is structural, not validated after the fact.
- `[CODE]` **Selection equality is strict `===`** — `isChecked()` compares with `===` (line 100). A builder must bind option `value`s and the model with matching primitive types; a `'1'` model will not check a `value: 1` option. (`[VAULT]` DECISION §10 flags this as a risky-to-change behaviour.)
- `[CODE]` **Disable cascades from three sources** — `isDisabled()` is `wrapperDisabled || cvaDisabled || option.disabled` (lines 103-105). A single option can be locked out (e.g. a tier the tenant is not entitled to) while the rest stay live.
- `[INFERRED]` **Empty / unset normalises to `null`** — `writeValue(undefined)` → `null` (line 86-88). An *un-chosen* group and a group whose value is falsy-but-set are distinct; payload builders must preserve `null`.
- `[VAULT]` **Best for ≤ 8 options** — beyond that, the business should switch to `<falcon-angular-dropdown>` (USAGE.md:41). A 20-row radio-group is a UX/business-readability failure.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Settings tab | organization-hierarchy | password-security-level / one-of-N setting choice |
| Add Client wizard — Settings step | organization-hierarchy | one-of-N policy / level selection |
| Filter panels | organization-hierarchy tabs | status one-of-many filter |
| Playground reference | host-shell | variant/orientation demo matrix |

## Business gotchas
- A radio-group with all-but-one option `disabled` is a **business entitlement statement** ("only this tier is available to you"), not a bug — driven by `option.disabled`.
- Type mismatch silently de-selects: if the persisted value comes back as a string but the options use numeric `value`s, the group renders with *nothing* checked. This looks like data loss but is the `===` comparison rule — align the types.
- A "pick one" with more than ~8 alternatives belongs in a dropdown. Cramming a long list into a radio-group buries the consequential choice.
- There is no card/boxed variant — for an icon+title+description pricing-card picker, the business should use `<falcon-angular-tabs mode='radio-cards'>` (`[VAULT]` GAP G3), not this component.

## Verification
🟡 CODE-DERIVED from `falcon-radio-group.component.ts` + `[VAULT]` dossiers. Settings-tab consumer ✅ VERIFIED (Wave 14 Settings tab user-confirmed working, `[MEMORY]`). Single-value + `===` + 3-source disable ✅ VERIFIED in source. PRD rule mapping 🟡 CODE-DERIVED — exact PRD BR numbers for password-security-level not located in this pass.
