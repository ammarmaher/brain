# falcon-dropdown — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Lets a user pick exactly one value from a known business list — the canonical single-choice control in Falcon forms. In business terms it is how the operator commits a *categorical decision*: which country an account belongs to, which role a user holds, which status applies.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| BR-AM-19 — "Account Owner" is the invariant owner role | `[MEMORY]` project_add_client_wizard_wave7_1_prd_defaults | Add Client Step 5 Owner-Role dropdown ships pre-selected `Account Owner` and **disabled** — the user cannot change it. |
| User status not chooseable at creation (Pending default) | `[MEMORY]` project_add_user_dropdown_payload_fix | Add User Step 2 User-Status dropdown is rendered **disabled** — status is a lifecycle outcome, not a creation input. |
| Country required before City | `[MEMORY]` project_info_panel_country_city_lookups_wave15b | City dropdown is `[disabled]` until the Country dropdown has a value — encodes the dependency. |

## Business constraints baked in
- `[MEMORY]` **Owner-Role locked** — `<falcon-angular-dropdown [disabled]="true">`, value `Account Owner`. Reason: BR-AM-19 invariant. A builder must NOT make it editable.
- `[MEMORY]` **User-Status locked at creation** — disabled, no selectable alternative. Reason: a new user is always `Pending`.
- `[INFERRED]` **Dependent dropdowns** — a child dropdown (City) stays disabled until its parent (Country) resolves; selecting the parent clears the child.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard | organization-hierarchy | Country, Category, Owner Role pickers |
| Add User wizard | organization-hierarchy | User Role, User Status pickers |
| Information panel edit | organization-hierarchy | Country / City pickers (per-country city lookup) |
| Language picker | host-shell topbar | UI language switch (uses `iconUrl` flag images) |

## Business gotchas
- A disabled dropdown is a *business statement* ("this value is not yours to choose"), not a bug — do not "fix" it by enabling.
- The option list is business reference data (lookups/roles) — an empty dropdown usually means a **backend lookup seed gap**, not a UI fault (see `INTEGRATION_VALIDATION.md`).

## Verification
🟡 CODE-DERIVED from `OVERVIEW.md` + `[MEMORY]` entries. Owner-role/status constraints ✅ VERIFIED (Add Client / Add User confirmed working by user 2026-05-18).
