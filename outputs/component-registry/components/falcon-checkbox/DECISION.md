# falcon-checkbox — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for all standalone boolean form controls.**

## Use this component for

- Any standalone boolean form control with optional label.
- Tri-state "Select all" indicators (via `indeterminate`).
- Composing inside `<falcon-angular-checkbox-group>` (via `checkedInput`).

## Avoid this component for

- Multiple options sharing a state → `<falcon-angular-checkbox-group>`.
- Visual switch (left/right toggle) → `<falcon-angular-switch>`.
- Mutually exclusive choice → `<falcon-angular-radio>` / radio-group.

## Preferred render path

`useTailwind=true` (default).

## Required upgrades before wider use

None blocking.

## Relationship to other components

- Composed by `<falcon-angular-checkbox-group>`, `<falcon-angular-multi-select>`, `<falcon-angular-table>`.
- Sibling: `<falcon-angular-switch>`, `<falcon-angular-radio>`.

## Exact rule for future implementation

1. Standalone boolean? → `<falcon-angular-checkbox>` with CVA.
2. Required indicator? → `[required]="true"`.
3. Error? → `[state]="'error'"` + `[errorText]="'msg'"`.
4. Tri-state? → `[indeterminate]="true"` + reset on toggle.
5. Inside a group? → use `<falcon-angular-checkbox-group>`, not raw checkbox loop.

---

## Dynamic capability assessment

### 1. Static?
- Check glyph SVG.
- Indeterminate-bar shape.

### 2. Dynamic via inputs/outputs?
- 14 inputs (label, helperText, errorText, size, state, readonly, required, name, value, inputId, indeterminate, checkedInput, useTailwind, classes).
- 1 wrapper output (`valueChange`).
- Stencil events: `falcon-change`, `falcon-blur`.

### 3. Dynamic via slots/templates?
- Default slot for label content (rich label).

### 4. Dynamic via tokens?
- All visual axes (~40 tokens).

### 5. Dynamic via Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- `description` sub-label (G2).
- Method proxies (G4).
- `errorMessage` alias (G1).

### 7. Shared, not page hack?
- Yes for all gaps.

### 8. Flags / options?
- `description`, `errorMessage`, `preserveIndeterminate`.
- `setFocus()` / `toggle()` method proxies.

### 9. Safest upgrade path?
1. Add `description` + `errorMessage` alias.
2. Add method proxies.
3. Add `preserveIndeterminate` opt-in.

### 10. Risky to change?
- `checkedInput` bypass mechanism — used by checkbox-group. Don't remove without parallel API.
- Default check glyph SVG — visual regression risk.
