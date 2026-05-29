# falcon-select — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.
> **`falcon-select` is a pure TS alias of `falcon-dropdown`** — there is no separate component. For the canonical business layer read `../falcon-dropdown/BUSINESS.md`. This file states what is alias-specific.

## Business purpose
`[CODE] src/angular-wrapper/components/falcon-select/index.ts` — `falcon-select` exists for ONE reason: the architecture spec §5.12.1 L1 named the single-choice control "Select", but the platform shipped it as `<falcon-dropdown>`. The alias lets new spec-aligned code reference the spec name without code duplication. **Business behavior is 100 % identical to `falcon-dropdown`** — it commits a single categorical decision (which country, which role, which status).

## PRD / business rules touched
Identical to `falcon-dropdown`. The alias enforces the same rules because it *is* the same class:
| Rule | Source | How surfaced |
|---|---|---|
| BR-AM-19 — "Account Owner" is the invariant owner role | `[MEMORY]` project_add_client_wizard_wave7_1_prd_defaults | Owner-Role picker ships pre-selected + disabled. |
| User status not chooseable at creation | `[MEMORY]` project_add_user_dropdown_payload_fix | User-Status picker rendered disabled. |
| Country required before City | `[MEMORY]` project_info_panel_country_city_lookups_wave15b | City picker disabled until Country has a value. |

## Business constraints baked in
- `[CODE] index.ts` — **The alias is class-level only.** `FalconAngularSelectComponent` IS `FalconAngularDropdownComponent` under a renamed export; `FalconSelectOption` IS `FalconDropdownOption`. There is **no `<falcon-angular-select>` HTML tag** — the template tag stays `<falcon-angular-dropdown>`. A builder who writes `<falcon-angular-select>` in a template gets nothing.
- `[INFERRED]` Because the alias carries no own logic, every business invariant of `falcon-dropdown` (locked Owner-Role, locked status, dependent dropdowns) applies verbatim.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| (Any flow using `falcon-dropdown`) | — | The select alias appears wherever new code adopts the spec name; functionally it is the dropdown flows in `../falcon-dropdown/BUSINESS.md`. |

`[CODE]` Current observed consumer count of the *alias export* is effectively 0 — production code imports `FalconAngularDropdownComponent` directly. The alias is a naming bridge, not a distinct adoption surface.

## What it CAN do (business)
- `[INFERRED]` Everything `falcon-dropdown` can: single categorical pick, locked/defaulted values to encode invariants, dependent-dropdown gating.

## What it CANNOT do (business)
- `[CODE] index.ts` — It cannot behave differently from `falcon-dropdown`. There is **no business divergence** — by design.
- `[CODE]` It cannot be used as a distinct template tag — the alias does not register `<falcon-angular-select>`.
- `[INFERRED]` It cannot give native `<select>` semantics — the underlying component is a custom popover.

## Enhancement opportunities
- `[INFERRED]` If the spec name "Select" is to become first-class, register a real `falcon-angular-select` selector that extends/forwards to the dropdown — today the gap is purely cosmetic (name mismatch between spec and tag).
- `[INFERRED]` Otherwise: retire the alias and standardize on `falcon-dropdown` to remove the spec/code naming ambiguity.

## Business gotchas
- A builder reading the spec will look for a "Select" component and find this alias — they must know the **rendered tag is still `falcon-angular-dropdown`**.
- Do not treat `falcon-select` as a place to add select-specific business rules — any change here is a change to `falcon-dropdown`.

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-select/index.ts` + `../falcon-dropdown/BUSINESS.md`. Alias-only nature ✅ VERIFIED against the index.ts re-export. Dropdown business rules ✅ VERIFIED (Add Client / Add User confirmed working by user 2026-05-18).
