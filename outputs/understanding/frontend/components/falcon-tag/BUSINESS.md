# falcon-tag — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Renders a **compact labelled chip** that names a discrete business attribute and, optionally, lets the operator **remove it inline**. In business terms a tag is how the UI shows a *member of a set* — an applied filter, a selected option, a permission held by a user, a severity classification of an audit entry. The dismissible variant turns the chip into the control that *retracts* that membership (drop a filter, deselect an option).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[CODE]` Account settings surface labelled attribute chips | `[CODE]` `USAGE.md:103` — `settings-tab.component.html` | The Settings tab uses tags to show settings-related labelled values as non-status chips. |
| `[CODE]` Add Client settings step shows attribute chips | `[CODE]` `USAGE.md:104` — `add-client-wizard/client-settings-step.component.html` | The Add Client settings step renders tags for labelled values during client creation. |
| `[INFERRED]` Permissions are a multi-value set on a user | `[INFERRED]` from `OVERVIEW.md:13` / `USAGE.md:28-39` | Each permission a user holds is one `secondary` tag inside a cell — the set of chips *is* the visible permission set. |
| `[INFERRED]` Filters are a removable set of predicates | `[INFERRED]` from `OVERVIEW.md:13` / `USAGE.md:3-14` | Each active filter is a dismissible tag; dismissing it retracts that predicate from the query. |

## Business constraints baked in
- `[CODE]` `API.md:36-38` / `falcon-tag.types.ts:2-9` **Severity vocabulary is fixed at 7 values** — `success`, `info`, `warning`, `warn` (legacy alias for `warning`), `danger`, `secondary`, `contrast`. `secondary` is the **neutral default** — the correct choice for a *non-status* attribute chip (a permission, a filter label). The severity is a *visual classification*, not a domain status enum (see the gotcha below).
- `[CODE]` `USAGE.md:80,97` / `GAPS_AND_UPGRADES.md:9-11` **`warn` is a deprecated legacy alias** — it must render identically to `warning`. New code must use `warning`; `warn` exists only so old consumers do not break.
- `[CODE]` `API.md:24-25,57` **Not a form control (no CVA)** — a tag does not *capture* a value; it *displays* one and optionally signals "remove me". The owning collection lives in the parent's state.
- `[CODE]` `API.md:26-27` **Dismiss is opt-in** — `[dismissible]="true"` is required to show the ✕; without it the tag is a pure read-only label. `(falconDismiss)` emits the tag's own `value` so the parent can identify which chip to drop.

## Severity vs domain status — IMPORTANT
`[CODE]` `OVERVIEW.md:20-21` / `USAGE.md:78,96` / `DECISION.md:13` **`<falcon-tag>` does NOT carry workflow / lifecycle status semantics.** Its 7 `severity` values are a *generic visual palette* (success/info/warning/danger/secondary/contrast), not the account/user/service status enums. Workflow state (`active` / `pending` / `suspended` / `locked` / `deleted` / `inactive` / `paid` / `expired` / `disabled`) belongs to **`<falcon-status-badge>`**, which owns the 9-severity → 4-bucket status mapping. A builder must:
- use `<falcon-tag severity="…">` for **non-status classification** (severity of an audit log line, a category label, a filter chip, a permission);
- use `<falcon-status-badge>` for any **user/account/service lifecycle status**.
Mixing the two on the same row is a `[CODE]`-flagged risk (`GAPS_AND_UPGRADES.md:51`) — they look similar but mean different things.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Settings attribute chips | admin-console org-hierarchy `settings-tab` | Labelled value chips for settings-related attributes. |
| Add Client — settings step | admin-console `add-client-wizard/client-settings-step` | Attribute chips shown during client creation. |
| Filter chips | admin-console org-hierarchy tabs (`[INFERRED]`) | Each active filter is a dismissible chip; ✕ retracts the predicate. |
| Permission tags in a table cell | user list cells (`[INFERRED]` per `USAGE.md:28-39`) | One `secondary` tag per permission — the chip set is the visible permission list. |
| Multi-select selected values | anywhere `<falcon-angular-multi-select>` is used | Each selected option renders as a dismissible chip; ✕ deselects it. |

## Business gotchas
- A tag is a **mirror of state, not a store of it** — dismissing a chip does nothing until the parent handles `(falconDismiss)` and mutates the collection. A builder who forgets the handler ships a ✕ that visibly does nothing.
- `severity` is a *visual* bucket, not a domain status — choosing `severity="warning"` for a "pending" account status is semantically wrong even though it might look right; use `<falcon-status-badge severity="pending">`.
- `secondary` is the default and the right choice for *neutral, non-status* chips — do not reach for `info`/`success` to make a plain label "look nicer"; that overloads a severity color with no meaning.
- The dismiss `aria-label` is hardcoded English `"Remove"` (`GAPS_AND_UPGRADES.md:26-27`) — for an Arabic / RTL UI this is an i18n gap; the chip text itself must still be translated by the consumer before being passed to `[value]`.

## Verification
🟡 CODE-DERIVED from the 6 UI dossier files + `[CODE]` `falcon-tag.types.ts` severity enum. Settings-tab and Add Client settings-step uses are 🟡 CODE-DERIVED (present in admin-console source per `USAGE.md:103-104`); filter-chip and permission-tag uses are `[INFERRED]`. Severity-vs-status separation is ✅ VERIFIED against `falcon-tag.types.ts` (7 generic values) and `falcon-status-badge.types.ts` (9 status values) — two distinct enums confirmed in code.
