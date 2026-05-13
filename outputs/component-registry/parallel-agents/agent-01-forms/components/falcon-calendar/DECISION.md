# falcon-calendar — DECISION

## Brain SK final recommendation

**STATUS: NEEDS-UPGRADE for full forms integration (no CVA) + range selection. READY for inline presentational use.**

## Use this component for

- Inline always-visible calendar UI.
- As the composition target inside `<falcon-angular-date-picker>` (the wrapper composes this — don't double-use).

## Avoid this component for

- Input + popover → `<falcon-angular-date-picker>`.
- Range / multi-select — not yet implemented.
- Hijri/Islamic calendar — use external Intl formatting then pass strings.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (CVA), G2 (range). P2: G3 (view mode), G4 (Hijri).

## Relationship

- Composed by `<falcon-angular-date-picker>`.
- Legacy facade exists at `libs/falcon/src/shared-ui/lib/components/falcon-calendar/` — OUT OF SCOPE.

## Exact rule

1. Inline always-visible calendar? → `<falcon-angular-calendar>`.
2. Field + popover? → `<falcon-angular-date-picker>`.
3. Bind via `[value]` + `(valueChange)` two-way (no ngModel).
4. Pass `disabledDates` as JS array/fn — never a string.

---

## Dynamic capability assessment

### 1. Static?
- Single-month grid.
- Single-date selection.
- Gregorian calendar.

### 2. Dynamic via inputs/outputs?
- 11 inputs.
- 3 outputs.
- NO CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- All visual axes.

### 5. Tailwind?
- 1 passthrough class.

### 6. Missing for reuse?
- CVA (G1).
- Range (G2).
- View modes (G3).
- Calendar systems (G4).
- Method proxies (G5).
- Today button (G6).

### 7. Shared?
- Yes.

### 8. Flags?
- `mode`, `viewMode`, `calendar`, `showToday`.
- Method proxies.

### 9. Safest path?
1. Add CVA + maintain `(valueChange)` simultaneously.
2. Add today button.
3. Add view-mode switching.
4. Add range (big, schedule separately).

### 10. Risky?
- `disabledDates` re-binding timing — current pattern depends on stable prop identity.
- Adding range fundamentally changes the value shape — breaking unless mode-flag is opt-in.
