# falcon-multi-select — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `OVERVIEW.md` — The multi-select is how an operator commits a **set of categorical decisions at once**: which permissions a role holds, which tags apply, which regions a filter covers. Where `falcon-dropdown` answers "which one", multi-select answers "which ones". Selections render as removable chips, and the panel can offer a tri-state "Select all" to commit the whole set in one action.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Permission assignment is a multi-value set | `[BRAIN-OUT]` `OVERVIEW.md` "Permission picker (multiple permissions per role)" | multi-select is the canonical permission picker — a role's permission set is selected here. |
| Multi-category / multi-region filtering | `[BRAIN-OUT]` `OVERVIEW.md` "Multi-category / multi-region selection in filter panels" | filter panels use it to express an OR-set of business categories. |

`[CODE] GAPS_AND_UPGRADES.md` Wave 7 — **consumer count is 3** (filter panels + permission selectors across admin-console + management-console). `[INFERRED]` No specific `BR-*` rule id is mapped in the dossiers; the business contract is "a set of values from a closed list", enforced structurally by the array-valued CVA.

## Business constraints baked in
- `[CODE] falcon-multi-select.component.ts:39` — the value is `ReadonlyArray<string | number>` — a multi-select **always commits a set** (possibly empty), never a scalar. The empty array is a valid business state ("nothing selected").
- `[CODE] falcon-multi-select.component.ts:91-92` — `showSelectAll` adds a **tri-state** row: unchecked / indeterminate / all-checked. Business meaning: "select all" is a bulk commit of every option; indeterminate means a partial set.
- `[CODE] falcon-multi-select.component.ts:89` — `maxChipsVisible` (default 3) caps how many selected values show as chips before a "+N more" overflow pill — a *display* cap, not a *selection* cap.
- `[CODE] GAPS_AND_UPGRADES.md` G8 — there is **no `maxSelected` business cap** on the wrapper. A flow that must limit how many values a user may pick (e.g. "at most 5 regions") cannot enforce it through this component today — it must cap externally.
- `[CODE] falcon-multi-select.component.ts:81-83` — `readonly` and `required` are present as inputs: `required` marks the set as mandatory (≥1 selection), `readonly` freezes the committed set.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Permission selection | admin-console user/role wizard | picks the permission set for a role |
| Filter panels | admin-console + management-console | expresses multi-category / multi-region filter criteria |
| (playground demo) | host-shell playground | showcase |

## What it CAN do (business)
- `[CODE] falcon-multi-select.component.ts` — Commit a set of categorical values (permissions, tags, regions) in one form field.
- `[CODE] falcon-multi-select.component.ts:91` — Offer a one-click "select everything" bulk decision (tri-state Select all).
- `[CODE] falcon-multi-select.component.ts:83` — Mark the set mandatory (`required`) or frozen (`readonly`).
- `[CODE] falcon-multi-select.component.ts:84` — Offer a clear-all affordance to reset the set to empty.

## What it CANNOT do (business)
- `[CODE] falcon-multi-select.component.ts` — It cannot enforce a **minimum or maximum count** of selections (`GAPS_AND_UPGRADES.md` G8) — "pick 2 to 5" must be enforced by parent validators.
- `[CODE] GAPS_AND_UPGRADES.md` G3 — It cannot lazy-load options — the whole option set must be in memory; a permission catalogue of thousands would all render up-front.
- `[CODE] GAPS_AND_UPGRADES.md` G1/G9 — It cannot show business context per option or per chip (no icon, status, sub-label) — only `label` text.
- `[CODE] GAPS_AND_UPGRADES.md` G5 — It cannot group options into business sections (no `group?` on the option type).
- `[INFERRED]` It cannot express ordered selection — the value is an unordered set; selection order is not preserved as business meaning.

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` G8 — Add `maxSelected` (and a min) so quota-style business rules ("at most N permissions") are enforced in the control, not duplicated across consumers.
- `[CODE] GAPS_AND_UPGRADES.md` G1/G9 — Per-option / per-chip templates + `iconUrl` parity so permission rows can show a status or scope glyph.
- `[CODE] GAPS_AND_UPGRADES.md` G5 — Grouped options so a permission picker can show "Account / User / Billing" sections.
- `[INFERRED]` A `BR-*` rule should be formally mapped for the permission-picker use — today the business contract is implicit in the consuming wizard.

## Business gotchas
- An empty array is a legitimate committed value — distinguish "user cleared the set" from "user has not touched the field" via `required` + `touched`, not via emptiness alone.
- `maxChipsVisible` is cosmetic — a "+2 more" pill does **not** mean only 3 values are selected; the full set is still committed. Never read selection count from visible chips.
- `showSelectAll` "select all" commits **every option currently in the list** — if options are filtered/partial, "all" means "all loaded", which can mislead in a paged dataset.

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts` + `[CODE] src/components/falcon-multi-select/falcon-multi-select.types.ts` + `[CODE] GAPS_AND_UPGRADES.md`. 3-consumer status ✅ VERIFIED via Wave 7 grep. Permission-picker / filter-panel use is real but no `BR-*` id is formally mapped — business rules are code-derived.
