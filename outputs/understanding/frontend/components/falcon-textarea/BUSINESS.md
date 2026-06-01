# falcon-textarea — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The canonical control for capturing **multi-line free-text** the operator authors in their own words — descriptions, notes, addresses, comments. In business terms it is how a longer, unstructured *narrative* enters a Falcon record, as opposed to a single categorical value (dropdown) or a short identifier (input). It exists so any field whose content can run past one line keeps a consistent, length-bounded, accountable shape across every wizard and panel.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Length-bounded free-text fields | `[CODE]` `falcon-textarea-tw.tsx:72,73` (`maxlength`, `showCounter`) | `maxlength` hard-caps input at the native level; `showCounter` surfaces remaining budget so an operator does not overrun a backend column limit. |
| Multi-line address / notes capture | `[BRAIN-OUT]` Add Client / Add User wizards (OVERVIEW.md "Known consumers") | Address and additional-info fields render as a textarea so the persisted value preserves line structure. |
| Grid-cell narrative editing | `[CODE]` `falcon-textarea.types.ts:12` (`variant: 'form' \| 'grid'`) | A `grid` variant lets a multi-line value be edited inline in a data grid without leaving the row. |

## Business constraints baked in
- `[CODE]` `falcon-textarea.types.ts:10-12` **No `search` variant** — a textarea is never a search affordance; the variant set is deliberately `form \| grid` only. A builder must not request a magnifier treatment here.
- `[CODE]` `falcon-textarea-tw.tsx:184-186` **Counter only renders when `maxlength` is a positive number** — `showCounter` alone is inert. The counter is a *business budget meter*; with no cap there is no budget to show.
- `[CODE]` `falcon-textarea-tw.tsx:155` **Auto-resize is bounded** — growth stops at `max(minRows,maxRows)` lines. The field will not expand without limit; long content scrolls. This keeps a wizard step from being pushed off-screen by one verbose field.
- `[INFERRED]` **Plain text only** — no rich-text/formatting. A description captured here is stored and re-displayed verbatim; business copy that needs emphasis or lists is out of scope (see `OVERVIEW.md`).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard | organization-hierarchy | Address / additional-info multi-line entry |
| Add User wizard | organization-hierarchy | Notes / description fields |
| Detail panels | admin-console / management-console | Comment / notes capture on a record |
| In-grid edit | data-table cells (`variant='grid'`) | Inline multi-line cell editing |

## Business gotchas
- A character counter approaching its cap is a **business signal**, not decoration — the backend column behind the field is finite. Lowering `maxlength` after data exists can make historical values un-editable; treat the cap as a contract.
- `[CODE]` The wrapper exposes **no `disabled` `@Input()`** — disabled state arrives only through Angular Forms (`setDisabledState`). Business code that needs a read-only-by-rule textarea must drive it via the form control's `disable()`, or use `readonly`. There is no standalone `[disabled]` knob.
- An empty textarea is a legitimate business state (free-text is usually optional); do not assume emptiness is an error unless a `required` rule says so.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-textarea-tw.tsx` + `falcon-textarea.component.ts` + `falcon-textarea.types.ts`, cross-checked against the existing 6 dossier files. Consumer flows ✅ VERIFIED as Add Client / Add User are user-confirmed working features (`[MEMORY]` 2026-05-18).
