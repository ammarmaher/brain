# falcon-radio-group — DECISION

## Brain SK final recommendation

**STATUS: READY for basic radios. NEEDS-UPGRADE for card variant + per-option descriptions.**

## Use this component for

- Mutually-exclusive choice with ≤ 8 options.
- Wizards / settings / filter panels.

## Avoid this component for

- > 8 options → dropdown.
- Multi-value → checkbox-group / multi-select.
- Card-style pricing / tier picker → use `<falcon-angular-tabs mode='radio-cards'>` instead today.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (per-option description / template).

## Relationship to other components

- Composes `<falcon-angular-radio>`.
- Alternative: dropdown / tabs (radio-cards).

## Exact rule for future implementation

1. Pick-one ≤ 8 options? → `<falcon-angular-radio-group>`.
2. Bind via CVA.
3. Use `groupLabel`.
4. Use `errorText`.

---

## Dynamic capability assessment

### 1. Static?
- Label-only per-option.
- No card variant.

### 2. Dynamic via inputs/outputs?
- 11 inputs.
- 1 wrapper output.
- CVA.

### 3. Slots/templates?
- None on wrapper.

### 4. Tokens?
- Group container + label + spacing.

### 5. Tailwind?
- Host `class=`.

### 6. Missing for reuse?
- Per-option description / icon (G1, G7).
- Card variant (G3).
- Required marker (G4).
- `errorMessage` alias (G2).

### 7. Shared?
- Yes.

### 8. Flags?
- `description`, `iconUrl`, `appearance='card'`.

### 9. Safest path?
1. Add description.
2. Add card appearance.
3. Add required + errorMessage alias.

### 10. Risky?
- Selection comparison via `===` — switching to deep equality would break consumers.
- Auto-generated `name` — changing default could collide with existing CSS.
