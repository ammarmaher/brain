# falcon-input-number — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for numeric inputs needing format / step / locale.**

## Use this component for

- Currency entry (mode='currency' + ISO currency code + locale).
- Quantity pickers (showButtons=true + integer=true).
- Decimal precision fields (min/maxFractionDigits).

## Avoid this component for

- Free-text "maybe number" → input.
- In-grid lightweight → `<falcon-angular-grid-input>`.
- Phone → `<falcon-angular-phone-field>`.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G2 (prefix/suffix). P2: G5 (state), G6 (keyboard step).

## Relationship

- Composes input + button.
- Sibling: grid-input (compact).

## Exact rule

1. Numeric with format/step/locale? → `<falcon-angular-input-number>`.
2. Set `mode`, `currency`, `locale` for currency.
3. Set `integer=true` for IDs / counts.
4. Set `showButtons=true` for low-step quantities.
5. Bind via CVA (value type is `number | null`).

---

## Dynamic capability assessment

### 1. Static?
- 4 hardcoded mode strings (decimal / currency).
- 4 fraction-digit inputs only.

### 2. Dynamic via inputs/outputs?
- 22 inputs.
- 1 wrapper output.
- CVA + ngOnChanges reformatting on mode/locale changes.

### 3. Slots/templates?
- None.

### 4. Tokens?
- Input + button + spinner tokens.

### 5. Tailwind?
- 2 passthrough classes.

### 6. Missing for reuse?
- prefix/suffix text (G2).
- state input (G5).
- Method proxies (G3).
- Keyboard step (G6).

### 7. Shared?
- Yes.

### 8. Flags?
- `prefix`, `suffix`, `state`, `signDisplay`, `longPressStep`.

### 9. Safest path?
1. Add prefix/suffix (additive).
2. Add `state`.
3. Add keyboard step (additive — improves UX).
4. Add method proxies.

### 10. Risky?
- `Intl.NumberFormat` parse behavior changes with browser updates — keep an eye on edge cases.
- `coerce()` regex strips locale-specific separators — relies on `parse()` for proper handling. Changing the regex risks breaking locale-specific inputs.
