# falcon-search-input — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The control that lets an operator **narrow a large set of business records to the one(s) they want** — search-as-you-type over accounts, users, services, table rows. In business terms it is not a data-entry field at all: its value is never persisted. It exists to make big lists navigable. The built-in debounce is a *cost-control* decision — it throttles how often a search request hits the backend so a busy operator typing fast does not generate one query per keystroke.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Search must not flood the backend | `[CODE]` `falcon-search-input.tsx:37,91-93` (`debounceMs=300`) | The component fires `falconSearch` only after a 300ms typing pause — one request per intent, not per character. |
| Clearing search is a first-class action | `[CODE]` `falcon-search-input.tsx:96-106` | A clear-X emits `falconSearchClear` AND a `falconSearch` with `''` — clearing immediately resets the list to its unfiltered business state. |
| `[INFERRED]` Search reflects async truth, not optimism | `[CODE]` `falcon-search-input.tsx:39,128-135` (`loading`) | The spinner is consumer-driven; the UI tells the operator "results are still being computed" so they do not act on a stale list. |

## Business constraints baked in
- `[CODE]` `falcon-search-input.tsx:31` **The value is transient** — there is no CVA on the wrapper (`[CODE]` `falcon-search-input.component.ts:38`). A search term is a view concern, never part of a saved record. A builder must not bind it into a form payload.
- `[CODE]` `falcon-search-input.tsx:114-123` **It is search-only by construction** — no `label` / `helperText` / `errorMessage` / `required` props exist. The component cannot be repurposed as a labeled form field; that is deliberate.
- `[CODE]` `falcon-search-input.tsx:104-105` **Clear is also a search** — emptying the box always re-runs search with an empty term. The business never has to special-case "user cleared the box" — it is just another `falconSearch`.
- `[INFERRED]` **The component does not search** — it emits intent; the consumer owns the query, the endpoint, and the result rendering. `loading` is set BY the consumer, not by the component.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Header global search | host-shell / admin-console / management-console topbar | Cross-record lookup entry point |
| Filter panel search | list / table pages | Narrowing a result set |
| Table global filter | data-table toolbars | Free-text filter across visible columns |
| Lookup pickers | wizards / drawers | Filtering long reference lists before selection |

## Business gotchas
- The 300ms debounce is a **business knob** — lowering it makes search feel snappier but multiplies backend load; raising it cuts cost but feels laggy. Treat `debounceMs` changes as a cost/UX trade-off, not a cosmetic tweak.
- An empty search box is the **"show everything" business state**, not an error — never gate on it being filled.
- The spinner does not mean the component is working — it means the *consumer* said a search is in flight. If results never arrive, the bug is in the consumer's query, not here.

## Verification
🟢 code-verified (re-read 2026-06-03) from `[CODE]` `falcon-search-input.tsx` + `falcon-search-input.component.ts`. No-CVA / search-only construction / debounce-as-cost-knob / clear-also-searches ✅ source-verified. Consumer usage (header / filter / table) 🔴 INFERRED — there are **zero live consumers** (grep 2026-06-03); the business flows listed are intended homes, not observed usage.
