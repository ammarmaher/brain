# falcon-grid-input — DECISION

## Brain SK final recommendation

**STATUS: READY for inline cell editing.**

## Use this component for

- Inline cell editors inside data tables / grids.
- Spreadsheet-style edit experiences.

## Avoid this component for

- Form fields → input.
- Numeric with format → input-number.
- Multi-line → textarea.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking. G1 (mode=number) is a common future need.

## Relationship

- Composed by table / data-table custom cells.

## Exact rule

1. Cell edit? → `<falcon-angular-grid-input>`.
2. Pass `originalValue` for Escape-revert.
3. Handle commit / cancel / navigate events.
4. Don't use outside grid context.

---

## Dynamic capability assessment

### 1. Static?
- Cell-only layout.
- String value only.
- No labels / helper / error.

### 2. Dynamic via inputs/outputs?
- 5 inputs.
- 3 outputs.
- No CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- Minimal — grid-friendly subset.

### 5. Tailwind?
- Host class.

### 6. Missing for reuse?
- Numeric mode (G1).
- Error feedback (G2).
- Method proxies (G3).

### 7. Shared?
- Yes.

### 8. Flags?
- `mode`, `errorState`, `errorMessage`, `ariaLabel`.

### 9. Safest path?
1. Add numeric mode.
2. Add error state.
3. Add method proxies.

### 10. Risky?
- Auto-focus default — changing breaks the cell-edit UX assumption.
- Tab/Shift+Tab as navigation events — host code depends on these.
