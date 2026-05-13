# falcon-multi-select — DECISION

## Brain SK final recommendation

**STATUS: READY for basic multi-select. NEEDS-UPGRADE for advanced custom rendering / async / large lists.**

## Use this component for

- Any multi-value selection from a known list of options.
- Permission pickers, tag pickers, filter-panel multi-categories.
- Cases requiring "Select all" tri-state.

## Avoid this component for

- Single-select → `<falcon-angular-dropdown>`.
- Free-text combo → `<falcon-angular-combobox>`.
- Tree-shaped multi → `<falcon-angular-tree>`.
- Lists > ~200 options without virtualization.

## Preferred render path

`useTailwind=true` (default).

## Required upgrades before wider use

None blocking for typical cases. For specific needs: G7 (method proxies), G8 (`maxSelected` + `chipMode`), G3 (async loading) are common asks.

## Relationship to other components

- Sibling: `<falcon-angular-dropdown>` (single).
- Replaces: PrimeNG `<p-multiSelect>` and legacy `<falcon-multiselect>`.

## Exact rule for future implementation

1. Need multi-value pick from known list? → `<falcon-angular-multi-select>`.
2. Bind via Reactive Forms / ngModel — always.
3. Set `searchable=true` if > 10 options.
4. Set `clearable=true` if optional.
5. Set `showSelectAll=true` when likely all.
6. Cap with `maxChipsVisible` to avoid overflow.
7. Override visuals via tokens, not utilities.

---

## Dynamic capability assessment

### 1. What is static?
- Chip layout pattern (inline + overflow).
- Built-in clear / chip-X SVG icons.
- Tri-state select-all logic.

### 2. What is dynamic via inputs/outputs?
- 19 wrapper inputs (size / state / searchable / clearable / showSelectAll / maxChipsVisible / etc.).
- 3 wrapper outputs (valuesChange, opened, closed).
- 6 Stencil events.
- Full CVA.

### 3. What is dynamic via slots / templates?
- Stencil-side slot likely (verify); Angular wrapper does NOT project — GAP.
- No per-chip / per-option templates — GAP.

### 4. What is dynamic via tokens?
- Every visual axis (~90+ `--falcon-multi-select-*` tokens including chip).

### 5. What is dynamic via Tailwind?
- 5 passthrough classes on Tailwind path.

### 6. Missing for cross-page reuse?
- Per-option / per-chip templates (G1).
- `iconUrl` on options (G9).
- Async loading (G3).
- Method proxies (G7).
- `maxSelected` + `chipMode` inputs (G8).
- Grouping (G5).

### 7. What goes in shared?
- All of the above.

### 8. Flags / options / templates?
- `FalconMultiSelectOptionTemplateDirective` + `FalconMultiSelectChipTemplateDirective`.
- `maxSelected`, `chipMode`.
- `loadOptions(query)` async hook.
- `searched`, `chipRemoved` outputs.

### 9. Safest upgrade path?
1. Add method proxies (additive).
2. Add `maxSelected` + `chipMode` (additive).
3. Add `searched` + `chipRemoved` (additive).
4. Add `errorMessage` alias.
5. Add `iconUrl` to option type.
6. Add per-chip / per-option templates.
7. Add async loading hook.

### 10. Risky to change?
- The `pushOptions()` (options + values) race-fix — fragile.
- Default `useTailwind=true` switch.
- Renaming `errorText` without alias.
- Chip overflow behaviour — visual regressions easy to introduce.
