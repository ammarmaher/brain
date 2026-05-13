# falcon-switch — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for boolean toggles where switch metaphor is preferred.**

## Use this component for

- Feature toggles / preferences.
- Quick on/off in tables / cards / settings.
- Use `channel-pill` when ON/OFF text labels add clarity.

## Avoid this component for

- "I agree" acceptance → checkbox.
- Mutually-exclusive choice → radio.
- Tri-state → no native support.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking. Common ask: G3 (loading state).

## Relationship to other components

- Sibling: checkbox, radio.

## Exact rule

1. Boolean toggle with switch metaphor? → `<falcon-angular-switch>`.
2. Pick variant by context: `dot-knob` (default), `channel-pill` (text-labeled), `hidden-input` (compact).
3. Bind via CVA.

---

## Dynamic capability assessment

### 1. Static?
- Knob shape.
- 3 hardcoded variants.

### 2. Dynamic via inputs/outputs?
- 14 inputs.
- 1 wrapper output.
- CVA + `checkedInput` bypass.

### 3. Slots/templates?
- Default slot for label.

### 4. Tokens?
- All visual axes per variant.

### 5. Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- `description` (G2).
- Loading (G3).
- Method proxies (G4).
- `errorMessage` alias (G1).

### 7. Shared?
- Yes.

### 8. Flags?
- `description`, `loading`, `onIcon` / `offIcon`, `errorMessage`.

### 9. Safest path?
1. Add `description` + `errorMessage` alias.
2. Add `loading` state.
3. Add method proxies.

### 10. Risky?
- The 3 variants are reflected — adding a 4th would expand reflected-attr CSS surface.
- Knob position tokens — visual regressions easy.
