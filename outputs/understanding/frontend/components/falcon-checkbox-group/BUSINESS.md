# falcon-checkbox-group — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `OVERVIEW.md` — The checkbox group is how an operator commits a **set of independent yes/no decisions that must all stay visible**. Each option is a standalone boolean; the group binds them into one `selectedValues` array. In business terms it serves short, decision-critical lists — the permissions a role holds, the toggles in a settings section, the criteria in a filter — where the operator should see *every* choice at once rather than open a panel.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Role permission lists | `[BRAIN-OUT]` `OVERVIEW.md` "Role permission selectors (admin-console user-role wizard)" | the group renders one checkbox per permission; the role's permission set is the `selectedValues` array. |
| Grouped settings toggles | `[BRAIN-OUT]` `OVERVIEW.md` "Settings pages with grouped toggles" | a settings section's boolean options are committed as a set. |
| Filter criteria | `[BRAIN-OUT]` `OVERVIEW.md` "Filter panel sections" | a multi-criterion filter expresses an OR-set of checkboxes. |

`[CODE]` grep 2026-06-03 — **consumer count is 0** (showcase-only; the permission/settings/filter uses are design intent, not yet wired — real grouped checkboxes today are hand-rolled). `[INFERRED]` No specific `BR-*` id is mapped; the business contract is "a visible set of independent booleans", enforced structurally by the array CVA.

## Business constraints baked in
- `[CODE] falcon-checkbox-group.component.ts:90-92` — selection is decided by **value equality** (`selected().includes(value)`); each option's `value` is the business key committed to the array.
- `[CODE] falcon-checkbox-group.component.ts:94-96` — a checkbox is disabled when the group `disabled` is set **OR** CVA `setDisabledState` is true **OR** the per-option `disabled` flag is set. Business meaning: per-option `disabled` encodes "this choice is not available to this operator/context" — a locked individual decision, while group `disabled` freezes the whole set.
- `[CODE] falcon-checkbox-group.component.ts:98-113` — `handleToggle` only mutates the array on a genuine state change (add if checked-and-absent, remove if unchecked-and-present) — the committed set has no duplicates and no phantom writes.
- `[CODE] GAPS_AND_UPGRADES.md` G5 — there is **no min/max selection enforcement**. A rule like "a role must hold at least one permission" or "pick at most 3 criteria" cannot be enforced by the component — it must be a parent `Validators` rule.
- `[CODE] GAPS_AND_UPGRADES.md` G6 — there is **no `required` indicator** — the group label cannot itself mark the set mandatory.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| User-role wizard permission selection | admin-console user-role wizard | renders the permission set as an always-visible checkbox list |
| Settings sections | settings pages | grouped boolean toggles committed as a set |
| Filter panel sections | filter panels | multi-criterion checkbox filter |

## What it CAN do (business)
- `[CODE] falcon-checkbox-group.component.ts` — Commit a set of independent boolean decisions as one array-valued form field.
- `[CODE] falcon-checkbox-group.component.ts:94-96` — Lock individual options (per-option `disabled`) or the whole set (group `disabled`) to encode availability rules.
- `[CODE] falcon-checkbox-group.component.ts:56` — Lay options vertically or horizontally to fit the form's reading order.
- `[CODE] falcon-checkbox-group.component.ts:59` — Surface a group-level `errorText` so a failed business validation is shown under the set.

## What it CANNOT do (business)
- `[CODE] GAPS_AND_UPGRADES.md` G5 — It cannot enforce a minimum or maximum number of checked options.
- `[CODE] GAPS_AND_UPGRADES.md` G2 — It cannot offer a "Select all" bulk action (unlike `falcon-multi-select`) — every option must be toggled individually.
- `[CODE] GAPS_AND_UPGRADES.md` G1 — It cannot show business context per option — only `label` text; no description, status, or icon per row.
- `[CODE] GAPS_AND_UPGRADES.md` G3 — It cannot group options into business sections (no `group?` on the option type).
- `[CODE] GAPS_AND_UPGRADES.md` G6 — It cannot itself mark the group as required.
- `[INFERRED]` It does not scale to long lists — it has no search/filter; a permission catalogue of dozens of rows becomes an unreadable wall (use `falcon-multi-select`).

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` G1 — Per-option `description` + custom template so a permission row can explain *what the permission grants* — high business value for permission UX.
- `[CODE] GAPS_AND_UPGRADES.md` G5/G6 — `minSelected` / `maxSelected` / `required` so quota and mandatory rules live in the control instead of being re-implemented per consumer.
- `[CODE] GAPS_AND_UPGRADES.md` G2 — A "Select all" tri-state row for parity with `falcon-multi-select` when a section is long enough to warrant it.
- `[INFERRED]` A `BR-*` rule should be formally mapped for the permission-picker use — the business contract is currently implicit in the user-role wizard.

## Business gotchas
- An empty `selectedValues` array is a legitimate committed state ("no options chosen") — distinguish it from "untouched" via `touched`, not emptiness.
- Per-option `disabled` is a **business statement** ("this choice is not yours"), not a styling toggle — do not enable it to "fix" a greyed row.
- Choosing checkbox-group over `falcon-multi-select` is a business-readability call: use the group when the operator must *see every option* (permissions a reviewer signs off); use multi-select when the list is long enough that hiding it behind a trigger is acceptable.

## Verification
🟢 code-verified from `falcon-checkbox-group.component.ts` (read 2026-06-03) — value-equality (ts:90-92), disabled-OR (ts:94-96), no-phantom-write toggle (ts:98-113) all confirmed. Consumer count corrected 1→0 (grep-verified — showcase-only; permission-picker use is design intent, NOT a live feature). No `BR-*` id formally mapped — business rules code-derived.
