# falcon-dropdown — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`. Sweep-refreshed 2026-06-03 (B04) — business facts below preserved from prior dossier (still accurate vs `[MEMORY]`).

## Business purpose
`[BRAIN-OUT]` Lets a user pick exactly one value from a known business list — the canonical single-choice control in Falcon forms. In business terms it is how the operator commits a *categorical decision*: which country an account belongs to, which role a user holds, which status applies, which template flow type to use, which currency a wallet transfers in.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| BR-AM-19 — "Account Owner" is the invariant owner role | `[MEMORY]` project_add_client_wizard_wave7_1_prd_defaults | Add Client owner-role dropdown ships pre-selected `Account Owner` and **disabled** — the user cannot change it. |
| User status not chooseable at creation (Pending default) | `[MEMORY]` project_add_user_dropdown_payload_fix | Add User user-status dropdown is rendered **disabled** — status is a lifecycle outcome, not a creation input. |
| Country required before City | `[MEMORY]` project_info_panel_country_city_lookups_wave15b | City dropdown is `[disabled]` until the Country dropdown has a value — encodes the dependency. |

## Business constraints baked in
- `[MEMORY]` **Owner-Role locked** — `<falcon-angular-dropdown [disabled]="true">`, value `Account Owner`. Reason: BR-AM-19 invariant. A builder must NOT make it editable to "fix" the greyed-out look.
- `[MEMORY]` **User-Status locked at creation** — disabled, no selectable alternative. Reason: a new user is always `Pending`.
- `[INFERRED]` **Dependent dropdowns** — a child dropdown (City) stays disabled until its parent (Country) resolves; selecting the parent clears the child.
- `[CODE]` **`errorText` (wrapper) drives the error look** — the wrapper input `errorText` maps to the Stencil `error-message` attr; `hasError` is `state==='error' || !!errorMessage` (`falcon-dropdown-tw.tsx:266-268`). Setting `errorText` alone paints red; pair with `[state]="'error'"` for consistency.
- `[CODE]` **`disabled` MUST be a property binding** (`disabledFromInput` setter) — a business-locked dropdown bound via `[attr.disabled]` would silently stay interactive (the role-gate would not hold). This is the exact trap the Owner-Role / User-Status locks depend on.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard | organization-hierarchy | Country, Category, Owner-Role, comm-channel / application pickers |
| Add User wizard | organization-hierarchy | User-Role, User-Status, permissions pickers |
| Information panel edit | organization-hierarchy | Country / City pickers (per-country city lookup) |
| Contracts cost management | contracts-cost-management | Currency / rate-card / contract-detail pickers |
| Templates wizard | templates-page | Flow-type / button-type / basic-info category pickers |
| Wallet (new-wallet-balance, balance-transfer) | wallet | Currency / channel pickers |
| Language picker | host-shell login-layout / topbar | UI language switch (uses `iconUrl` flag images) |

## Business gotchas
- A disabled dropdown is a *business statement* ("this value is not yours to choose"), not a bug — do not "fix" it by enabling.
- The option list is business reference data (lookups/roles/currencies) — an empty dropdown usually means a **backend lookup seed gap**, not a UI fault (see `INTEGRATION_VALIDATION.md`).
- `[CODE]` On cell-remount inside `<falcon-angular-data-table>` (e.g. wizard step navigation), a dropdown could render empty until the wrapper's `pushOptions` + value re-assert lands — a transient that the Wave 7.4 race-fix already guards. Do not "fix" it by pushing options imperatively.

## Verification
🟡 CODE-DERIVED business-rule mapping + ✅ VERIFIED Owner-Role / User-Status locks (Add Client / Add User user-confirmed 2026-05-18, `[MEMORY]`). `errorText`/`disabled` mechanics 🟢 code-verified 2026-06-03.
