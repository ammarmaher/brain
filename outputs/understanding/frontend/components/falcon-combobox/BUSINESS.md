# falcon-combobox — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `OVERVIEW.md` — The combobox is the **"choose or create"** control. Where `falcon-dropdown` forces the user to commit to one of a *closed* set of business values, the combobox lets the user either pick a known value **or type a value that is not in the list** (`allowFreeText`). In business terms it serves cases where the canonical list is reference data but the operator may legitimately enter something new — a tag, a free-form company name, a contact, an address fragment.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none mapped) | `[CODE]` grep | No `BR-*` rule currently binds to this component. |

`[CODE] GAPS_AND_UPGRADES.md` Wave 7 — **consumer count is 0**: the combobox is showcase/playground-only today. It carries no live business rule because no production flow has adopted it yet. `[INFERRED]` This is the single most important business fact about it: it is a *capability the platform owns but does not yet use*.

## Business constraints baked in
- `[CODE] falcon-combobox.tsx:165-169` — **`allowFreeText` is the business switch.** When `false` (default), pressing Enter on a query that matches no option does NOT commit a value — only an item from the list can be selected. This encodes "the list is authoritative." When `true`, free text is accepted as the value verbatim.
- `[CODE] falcon-combobox.tsx:193` — when `allowFreeText` is `false`, typing that does not resolve to a selection sets `value = ''`: an unmatched query is treated as *no decision made*, not as a partial value.
- `[INFERRED]` Business meaning: `allowFreeText=false` makes the combobox a searchable-but-closed picker (a richer `falcon-dropdown`); `allowFreeText=true` makes it a genuine "create-new" control.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| (none in production) | playground only | `[CODE]` Wave 7 grep — 0 consumers. Demo route only. |

## What it CAN do (business)
- `[CODE] falcon-combobox.tsx` — Let an operator pick a known reference value via type-ahead search.
- `[CODE] falcon-combobox.tsx:165` — Let an operator submit a brand-new value not in the list (`allowFreeText`) — the "create" half of choose-or-create.
- `[CODE] falcon-combobox.component.ts:67` — Surface every keystroke (`filterChange`) so a parent flow can drive async/server suggestions while the user types.

## What it CANNOT do (business)
- `[CODE] falcon-combobox.component.ts` — It cannot commit **multiple** values — single string only.
- `[CODE] GAPS_AND_UPGRADES.md` G6 — It cannot show business context per option (no icon, sub-label, status badge) — only `label` text renders.
- `[CODE] GAPS_AND_UPGRADES.md` G1/G2/G4/G6 — It cannot render its own form-level error/required state — there is no `helperText`, `errorMessage`, `state`, or `required` input on the wrapper, so it cannot itself signal "this business field is invalid/mandatory."
- `[INFERRED]` It cannot, by itself, validate that a typed free-text value is *business-acceptable* — that gate must live in the parent flow's validators.

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` Wave 7 — **Adopt it in a real flow or retire it.** A combobox with 0 consumers is a maintenance liability; the recommendation is to promote it in a "choose or create" feature (tag picker, contact picker) so it earns a business rule.
- `[INFERRED]` Once adopted, the "choose or create" pattern needs a business policy: who may create new values, and does a free-text value need backend de-duplication / approval? That policy is not encoded anywhere today.
- `[CODE] GAPS_AND_UPGRADES.md` G1/G2 — Add `helperText` + `errorMessage` + `state` so a business field built on it can show validation inline like every other Falcon form control.

## Business gotchas
- `allowFreeText=false` is **not** the same as `falcon-dropdown`: it still shows a free-typing search box; it just refuses to commit unmatched text. Choosing combobox-closed over dropdown is a UX call, not a business one.
- A free-text value is *raw operator input* — treat it as untrusted business data: trim, normalize, and de-dupe before persisting.
- The component is currently a **business capability with no business owner** — do not assume any PRD rule is enforced here until a flow adopts it.

## Verification
🟡 CODE-DERIVED from `[CODE] src/components/falcon-combobox/falcon-combobox.tsx` + `[CODE] src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.ts` + `[CODE] GAPS_AND_UPGRADES.md`. 0-consumer status ✅ VERIFIED via Wave 7 grep. No production flow exercises this component — business behavior is code-derived, not feature-confirmed.
