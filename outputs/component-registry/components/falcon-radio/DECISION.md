# falcon-radio — DECISION

## Brain SK final recommendation

**STATUS: READY. Use inside `<falcon-angular-radio-group>` for almost all cases.**

## Use this component for

- A single radio inside a non-standard layout (e.g. one option per card).
- Composing inside `<falcon-angular-radio-group>` (the group does this internally).
- Composing inside `<falcon-angular-otp-send-dialog>` channel step.

## Avoid this component for

- Multiple radios → use `<falcon-angular-radio-group>`.
- Boolean → `<falcon-angular-checkbox>` / `<falcon-angular-switch>`.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking.

## Relationship to other components

- Composed by `<falcon-angular-radio-group>`, `<falcon-angular-otp-send-dialog>`.
- Sibling: checkbox, switch.

## Exact rule for future implementation

1. Need radio choice? → `<falcon-angular-radio-group>` first.
2. Need one standalone radio in custom layout? → `<falcon-angular-radio>` with `[checkedInput]` parent-driven, OR CVA with matching `value`.
3. Always set `name` consistently for exclusivity.
4. Use `errorText` + `state="error"`.

---

## Dynamic capability assessment

### 1. Static?
- Inner dot via border-width-5 trick.
- Native radio underneath.

### 2. Dynamic via inputs/outputs?
- 13 inputs.
- 1 wrapper output.
- CVA + `checkedInput` bypass.

### 3. Dynamic via slots/templates?
- Default slot for label content.

### 4. Dynamic via tokens?
- All visual axes.

### 5. Dynamic via Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- `description` (G2).
- Method proxies (G4).
- `errorMessage` alias (G1).

### 7. Shared?
- Yes.

### 8. Flags?
- `description`, `iconUrl`, `errorMessage`.

### 9. Safest upgrade path?
1. Add `description` + `errorMessage` alias.
2. Method proxies.

### 10. Risky?
- Border-width-5 dot trick — visual regressions if redone.
- `checkedInput` bypass — depended on by radio-group.
