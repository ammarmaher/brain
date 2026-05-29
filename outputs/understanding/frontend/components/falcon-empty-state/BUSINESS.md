# falcon-empty-state — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-empty-state.tsx:1-3 — falcon-empty-state is a **presentational placeholder for the zero-data moment**: icon + title + description + an action slot. In product terms it answers *"there is nothing here — and here is what to do about it."* It turns a blank screen into a guided next step. It carries **no business logic** and **no `BR-*` rule**.

`[INFERRED]` Its business value is *conversion and guidance*: an empty list is a dead end; an empty-state with a clear action ("No users found — Add the first user") is an onboarding nudge. The component standardises the *shape* of that nudge; the host supplies the copy and the action.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Empty-state is presentational — it guides, it enforces nothing. |
| `[INFERRED]` Empty ≠ error ≠ loading | `[CODE]` falcon-empty-state.tsx:1-3 + `[BRAIN-OUT]` OVERVIEW.md:18-21 | The component is for *empty data* only — `[BRAIN-OUT]` OVERVIEW.md:19-20 explicitly: "NOT for loading states (use the table skeleton)". Each of the three states is a distinct product moment. |

## Business constraints baked in
- `[CODE]` falcon-empty-state.tsx:17-18 — **`titleText` is the required heading.** A business-meaningful empty-state always names *what* is empty ("No users found"); an empty-state with no title is a defect.
- `[CODE]` falcon-empty-state.tsx:38-39 — **the root is `role="img"` with `aria-label = titleText`** by default. Business meaning: the entire placeholder is announced as one labelled image to assistive tech — the title carries the meaning. `[CODE]` :27-28,31 — passing `ariaLabel=""` (empty string) makes it **fully presentational** (`aria-hidden` effectively) — a deliberate choice for a purely decorative zero-state.
- `[CODE]` falcon-empty-state.tsx:56-58 — **the `action` slot is the conversion hook.** The component reserves a region for a call-to-action button but does not own it — the host projects the action (`[BRAIN-OUT]` OVERVIEW.md:46, USAGE — typically `<falcon-angular-button slot="action">`). Whether an empty-state *has* an action is a product decision (a search-no-results state often has none; a first-run state always does).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[BRAIN-OUT]` Empty data-table state | any list page | `[BRAIN-OUT]` OVERVIEW.md:42-43 — projected via `<ng-template falconDataTableEmpty>` into `<falcon-angular-data-table>`. |
| `[INFERRED]` "No results" search state | filtered lists / search pages | empty-state with a "clear filters" or no action. |
| `[INFERRED]` First-run / zero-state pages | new account dashboards | empty-state with an onboarding CTA in the action slot. |
| `[INFERRED]` Org-hierarchy empty tab | organization-hierarchy tabs | a tab with no rows (e.g. no comm-channels) — natural empty-state slot. |

`[BRAIN-OUT]` OVERVIEW.md:37-38 + GAPS_AND_UPGRADES.md:56-58 — **one production consumer** (Wave 7 sweep). Most current empty states are bare strings; the component is near-unadopted.

## Business gotchas
- `[CODE]` falcon-empty-state.tsx:1-3 + `[BRAIN-OUT]` OVERVIEW.md:19-21 — **do not use it for a loading state.** A spinner-while-fetching is the table's `[loading]` skeleton, a different product moment. An empty-state shown during a fetch falsely tells the user "there is no data" before the data arrives.
- `[CODE]` falcon-empty-state.tsx — there is **no error variant.** `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:21-23 (FES-04) — an empty-state cannot today double as an error placeholder ("Failed to load — Retry"); a `[variant]` driver is a proposed gap. A failed load needs a different treatment, not this component.
- `[CODE]` falcon-empty-state.tsx:46-48 — the title is a structural `<h3>`; `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:50 — pages with a strict heading outline must accept the `<h3>` level.
- `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:6-7 (FES-01) — `<falcon-table>` core renders only a bare text empty cell — it does **not** auto-compose this component. A builder wanting a rich empty-state in a table must project `<ng-template falconDataTableEmpty>` explicitly.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-empty-state.tsx + falcon-empty-state.component.ts + the 6 dossier files. No `BR-*` rule binds this presentational primitive. The empty-vs-error-vs-loading distinction and the `ariaLabel=""` presentational escape hatch are ✅ VERIFIED against source.
