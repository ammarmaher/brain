# falcon-date-picker — DECISION

## Brain SK final recommendation

**STATUS: READY for basic date entry. NEEDS-UPGRADE for CVA + range + time + Hijri.**

## Use this component for

- Single-date entry with popover UX.
- All form-level date pickers across consoles.

## Avoid this component for

- Inline always-visible → calendar.
- Range → compose two with external coordination.
- Date + time → use this + a separate time control until G3 lands.
- Hijri only → format externally.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (CVA), G2 (range), G3 (time).

## Relationship

- Composes `<falcon-angular-calendar>`.
- Sibling: `<falcon-angular-input>`.

## Exact rule

1. Date entry? → `<falcon-angular-date-picker>`.
2. Use `[value]` + `(valueChange)` two-way until CVA lands.
3. Set `min` / `max` / `disabledDates` for business rules.
4. Pass `firstDayOfWeek` per locale.
5. Override tokens via host class.

---

## Dynamic capability assessment

### 1. Static?
- Single-date selection.
- ISO display format.
- Gregorian calendar.
- No time component.

### 2. Dynamic via inputs/outputs?
- 19 inputs.
- 5 outputs.
- NO CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- All input + calendar tokens.

### 5. Tailwind?
- 1 passthrough class.

### 6. Missing for reuse?
- CVA (G1).
- Range (G2).
- Time (G3).
- Display format (G4).
- Calendar systems (G5).
- Method proxies (G6).

### 7. Shared?
- Yes.

### 8. Flags?
- `mode`, `showTime`, `displayFormat`, `calendar`.

### 9. Safest path?
1. Add CVA — most impactful single change. Additive (keeps current `(valueChange)`).
2. Add display format.
3. Add method proxies.
4. Add time picker.
5. Add range (big — schedule separately).

### 10. Risky?
- Adding CVA could conflict with existing `(valueChange)` users — must be additive.
- Range mode breaks value type — opt-in via `mode` input.
- Popover positioning — visual regressions easy.
