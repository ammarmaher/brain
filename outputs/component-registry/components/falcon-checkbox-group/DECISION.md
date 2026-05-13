# falcon-checkbox-group — DECISION

## Brain SK final recommendation

**STATUS: READY for basic multi-checkbox. NEEDS-UPGRADE for select-all / min-max / per-option description.**

## Use this component for

- Multi-value boolean selection rendered as inline / stacked checkboxes (≤ 12).
- Always-visible permission / channel / preference lists.

## Avoid this component for

- Long lists → `<falcon-angular-multi-select>`.
- Mutually exclusive choice → `<falcon-angular-radio-group>`.

## Preferred render path

`useTailwind=true` — passes through to children.

## Required upgrades

P2: G2 (select-all), G4 (alias), G5 (min/max), G6 (required marker).

## Relationship to other components

- Composes `<falcon-angular-checkbox>` via `checkedInput`.
- Alternative: `<falcon-angular-multi-select>` (dropdown form).

## Exact rule for future implementation

1. ≤ 12 visible options? → `<falcon-angular-checkbox-group>`.
2. Long list? → `<falcon-angular-multi-select>`.
3. Always bind via CVA.
4. Use `orientation` for layout.
5. Wrap label content via template if rich text needed (gap until G1).

---

## Dynamic capability assessment

### 1. Static?
- Per-option label-only rendering.
- No select-all UI.

### 2. Dynamic via inputs/outputs?
- 9 inputs.
- 1 wrapper output (`selectedValuesChange`).
- Full CVA.

### 3. Dynamic via slots/templates?
- None on Angular wrapper.

### 4. Dynamic via tokens?
- Group container + label + spacing.

### 5. Dynamic via Tailwind?
- Host `class=` for layout. No path-specific classes.

### 6. Missing for cross-page reuse?
- Per-option description / icon / template (G1).
- Select-all (G2).
- Min/max enforcement (G5).
- Required marker (G6).
- `errorMessage` alias (G4).

### 7. Shared, not page hack?
- Yes.

### 8. Flags / options / templates?
- `description` on option type.
- `showSelectAll`, `minSelected`, `maxSelected`, `required`, `errorMessage`.
- `FalconCheckboxGroupItemTemplateDirective`.

### 9. Safest upgrade path?
1. Add `description` field + render below label (additive).
2. Add `select-all` toggle (additive).
3. Add `required` + `errorMessage` alias.
4. Add `minSelected` / `maxSelected` inputs (validation responsibility still on form — these only drive visual hints).

### 10. Risky?
- Selection comparison via `===` and `Array.includes` — switching to `trackByFn` semantics would break consumers tracking by identity. Maintain value equality.
