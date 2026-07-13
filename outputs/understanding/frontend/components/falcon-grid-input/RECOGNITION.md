# falcon-grid-input — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-grid-input>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A **compact, borderless-or-thin-bordered single-line input that fills a table cell** — no label, no helper text, no error line, minimal padding, often no focus ring `[CODE]` `falcon-grid-input.tsx:135-142` (`variant="grid" size="sm" clearable={false}`). It only appears *inside a data-grid row*, replacing the static cell text while that cell is being edited; the rest of the row stays as plain table cells. Recognition is contextual: a tiny input sitting flush inside a grid cell, appearing on cell-click/double-click, is this component. If you see a labeled bordered field with helper text, it is NOT this — that is `<falcon-angular-input>`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | MUI X DataGrid built-in cell edit (`renderEditCell` / default edit input) | MUI X cell-edit input ≈ grid-input; Falcon's is a standalone editor the table composes |
| PrimeNG | `<p-table editMode="cell">` cell editor template with `<input pInputText>` | direct analogue — PrimeNG cell-edit input maps 1:1 to grid-input |
| Ant Design | `<Table>` editable-cell pattern (`EditableCell` with a `<Form.Item><Input/>`) | Ant's editable-cell input ≈ grid-input (Ant wraps it in a Form.Item; Falcon's is form-free) |
| Bootstrap | `<input class="form-control form-control-sm">` placed in a `<td>` | upgrade target — no Enter/Escape/Tab semantics |
| shadcn / Radix | TanStack Table editable cell with a shadcn `<Input>` | shadcn has no grid editor — composed by hand |
| plain HTML | a `contenteditable` `<td>` or `<input>` in a `<td>` | always replace with this for grid editing |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a tiny input editing one cell inside a data table | `<falcon-angular-grid-input>` | input |
| a labeled bordered text field in a form | `<falcon-angular-input>` | grid-input |
| a multi-line cell edit | `<falcon-angular-textarea variant="grid">` | grid-input (single-line only) |
| a numeric cell with steppers / formatting | `<falcon-angular-input-number>` | grid-input (string-only, no numeric mode) |
| a search box above the grid | `<falcon-angular-search-input>` | grid-input |
| a dropdown picker inside a cell | `<falcon-angular-dropdown>` (in a cell template) | grid-input |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory` — inputs → templates → slots → variants → token override → upgrade → wrapper):
1. **Inputs** — `[value]` (current cell value), `[originalValue]` (the persisted value for Escape-revert — always set this), `[autoFocus]` (leave `true`), `[disabled]` for read-only cells.
2. **Wiring** — handle `(falconGridCommit)` → send the cell write; `(falconGridCancel)` → close the editor, no write; `(falconGridNavigate)` → move focus to the adjacent cell (the host table MUST implement this or Tab loses focus).
3. **Host integration** — render it from the table's custom-cell / edit-cell template; the table owns which cell is editing.
4. **Tokens** — restyle via the inherited `--falcon-input-*` tokens (compact bg/border, focus ring) — NOT `--falcon-grid-input-*` (those 2 focus-ring tokens are orphan/unwired today; see TOKENS.md). Never hardcode.
5. **Upgrade** — a numeric `mode`, an error state, or method proxies are GAPs (`DECISION.md` G1/G2/G3) — raise, do not hand-roll a red border.

## Anti-patterns
- Using it outside a grid — it has no label/helper/error and assumes the keyboard contract; in a form it is the wrong control.
- Not passing `originalValue` — Escape then reverts the cell to an empty string instead of the real value.
- Implementing "click-away cancels" — blur **commits** in this component; design around that or use Escape for abandon.
- Ignoring `(falconGridNavigate)` — Tab is hijacked into a navigate event; without a host handler, Tab silently does nothing useful.
- Committing again in a host blur handler — the internal `committed` flag already de-dups; you would double-write.
- Expecting numeric parsing or a red error border — string-only, no error state; the consumer owns both.

## Verification
🟢 code-verified (re-read 2026-06-03) from `[CODE]` `falcon-grid-input.tsx` + `falcon-grid-input-tw.tsx` + `falcon-grid-input.component.ts` + `.html`. Blur-commits, Tab-hijack, string-only, no-error-state ✅ source-verified. Live fingerprint confirmed against the Contracts cost-management matrix consumer. Cross-library map 🔴 INFERRED from each library's public API. Token reference corrected (`--falcon-input-*`, not orphan `--falcon-grid-input-*`).
