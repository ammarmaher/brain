# falcon-grid-input — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The control for **editing a value in place inside a data table** — without opening a form, a drawer, or a wizard. In business terms it serves the high-frequency "operator corrects/sets one cell" pattern: an admin adjusting a price, a quota, a name directly on the row they are looking at. Its keyboard contract (Enter commits, Escape reverts, Tab commits-and-moves) is what makes a Falcon grid feel spreadsheet-like — fast, low-ceremony bulk editing.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Inline edits are explicit commits | `[CODE]` `falcon-grid-input.tsx:98-102,114-122` | A value is only committed on **Enter**, **Tab**, or **blur** — typing alone does not persist anything; the operator's keystroke is the commit signal. |
| Escape is a safe abandon | `[CODE]` `falcon-grid-input.tsx:105-112` | Escape restores `originalValue` and emits `falconGridCancel` — an operator can always back out of a mistaken edit with no side effect. |
| Edits are auditable / discrete | `[CODE]` `falcon-grid-input.tsx:42-51` | Every commit is one `falconGridCommit` event the consumer can route to a single backend write — one cell, one operation. |
| `[INFERRED]` Grid editing must keep flow | `[CODE]` `falcon-grid-input.tsx:114-122` | Tab commits AND emits `falconGridNavigate` so the host moves focus to the next cell — the operator never lifts hands from the keyboard. |

## Business constraints baked in
- `[CODE]` `falcon-grid-input.tsx:33` **`originalValue` is the abandon anchor** — the business value the cell had before editing. If the consumer does not pass it, Escape reverts to an empty string. Always supply the row's current persisted value.
- `[CODE]` `falcon-grid-input.tsx:36,66-69` **Auto-focus on mount** — when a cell enters edit mode the input grabs focus immediately, so the operator types straight away. Disabling this breaks the expected grid-edit rhythm.
- `[CODE]` `falcon-grid-input.tsx:30` **String value only** — the component carries a `string`. There is no numeric/typed mode; a price or quota cell still commits a string the consumer must parse/validate (`DECISION.md` G1).
- `[CODE]` `falcon-grid-input.tsx:88-93` **Blur is a commit, not a cancel** — clicking away saves. The business never loses a typed-but-unconfirmed edit to a stray click; if abandon is wanted the operator must press Escape.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Inline table-cell edit | data-table / table pages (admin + management consoles) | The cell editor itself — set/correct one value per row |
| Bulk row adjustments | service / pricing / quota grids | Tab-through editing of many cells in sequence |

## Business gotchas
- A grid-input commit is **not yet a saved record** — `falconGridCommit` is intent; the consumer still has to send the write and handle backend rejection. A committed cell can still fail server-side.
- There is **no built-in error state** (`DECISION.md` G2) — if a committed value is business-invalid, the consumer must surface that on the row/cell itself; the component will not show red.
- Escape only reverts to the `originalValue` the consumer gave it — if that value is stale (row changed underneath), Escape restores the stale value, not the live one.
- Numeric cells (price, quota) commit a raw string — the business rule "price must be a positive number" is entirely the consumer's to enforce.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-grid-input.tsx` + `falcon-grid-input.component.ts`. Consumer flows 🟡 from `OVERVIEW.md` "Known consumers" (data-table / table inline edit). String-only / blur-commits / no-error-state ✅ VERIFIED against source.
