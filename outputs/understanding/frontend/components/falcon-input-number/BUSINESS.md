# falcon-input-number — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The control for committing a *quantified* business value: a price, an amount, a quota, a count. Where `<falcon-angular-input>` captures a name, `<falcon-angular-input-number>` captures a *number the business will compute on* — so it carries format, locale, currency, decimal precision and min/max clamping as first-class concerns. It exists because a money field rendered as plain text is a billing-correctness risk.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Account quota is a numeric setting on the Settings tab | `[MEMORY]` project_settings_tab_standalone_wave14 + `[CODE]` USAGE.md:99 (settings-tab.component.html consumer) | Settings tab renders the quota field as `<falcon-angular-input-number>` so the operator commits an integer count, not free text. |
| Client settings carry numeric thresholds | `[CODE]` USAGE.md:100 (client-settings-step.component.html consumer) | Add Client Step "Settings" uses input-number for numeric threshold fields. |
| Money fields must format per locale / currency | `[CODE]` falcon-input-number.component.ts:67-71 (`mode`, `currency`, `locale`) | `mode='currency'` defers symbol + decimal rules to `Intl.NumberFormat` — the business symbol is never hand-typed. |
| Counts must be whole numbers | `[CODE]` falcon-input-number.component.ts:72,154-159 (`integer` → `Math.trunc`) | `integer=true` truncates any fractional keystroke — a quantity of "3.5 users" can never reach the payload. |

## Business constraints baked in
- `[CODE]` **`integer=true` truncates, it does not round** — `coerce()` calls `Math.trunc(n)` (falcon-input-number.component.ts:158). A builder must not assume `2.9 → 3`; it becomes `2`. Business rules that need rounding must round upstream.
- `[CODE]` **Empty / blank coerces to `null`, not `0`** — `coerce()` returns `null` for `null | '' ` (line 155). This is deliberate: an *unset* quota and a quota *of zero* are different business states. Payload builders must preserve `null`.
- `[CODE]` **`min` / `max` clamp on commit (blur), not on keystroke** — typing past `max` is allowed mid-edit and only clamped on blur (`[VAULT]` API.md:72; GAP G1). A submit triggered by Enter (no blur) can carry an unclamped value — the form's Reactive validators are the real guard.
- `[INFERRED]` **`minFractionDigits` / `maxFractionDigits` are ignored in `mode='currency'`** — Intl owns currency decimal rules (API.md:30-31). Setting them in currency mode is a silent no-op, not an error.
- `[CODE]` **Value type is `number | null`** — never bind to a `FormControl<string>`. A string-typed control would defeat numeric comparison validators (`Validators.min` etc.).

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — Settings step | organization-hierarchy | numeric threshold / quota capture |
| Settings tab (standalone) | organization-hierarchy | account quota numeric setting |
| Pricing / amount fields | admin-console (services / pricing) | currency-mode money entry |
| Quantity pickers | detail forms | `showButtons=true` low-step counts |

## Business gotchas
- A currency field that shows "$" when the business runs in SAR is a **locale misconfiguration** — pass `currency` + `locale` explicitly; the browser default is not the tenant's locale.
- Clamp-on-blur means the *displayed* value can momentarily exceed `max` while editing. Do not screenshot a mid-edit field and report it as a clamp bug.
- An `integer` quota that silently truncated a pasted decimal is *correct* behaviour — the business rule is "whole numbers only," not "reject decimals."
- `null` vs `0`: an empty quota field is "no quota set," a `0` is "quota of zero." Treating them the same is a business error.

## Verification
🟡 CODE-DERIVED from `falcon-input-number.component.ts` + `[VAULT]` API/USAGE dossiers. Settings-tab + Add Client Settings-step consumers ✅ VERIFIED (Wave 14 settings tab user-confirmed working, `[MEMORY]`). Clamp-on-blur + integer-truncate ✅ VERIFIED in source.
