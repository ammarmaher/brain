# falcon-search-input — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for all search inputs.**

## Use this component for

- Filter panel search bars.
- Header global search.
- Table global filter.
- Any debounced search field.

## Avoid this component for

- Free-text → input.
- Combo with suggestions → combobox.
- Dropdown with internal search → dropdown's `searchable=true`.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking.

## Relationship

- Composes `<falcon-angular-input variant='search'>`.

## Exact rule

1. Search bar? → `<falcon-angular-search-input>`.
2. Wire `(falconSearch)` directly to your API call.
3. Set `loading=true` while in-flight.
4. Trust the built-in debounce — don't add external.

---

## Dynamic capability assessment

### 1. Static?
- Search-icon-left + clear-X-right layout.
- Loading spinner placement.

### 2. Dynamic via inputs/outputs?
- 7 inputs.
- 2 outputs.
- No CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- All visual axes.

### 5. Tailwind?
- Host class only.

### 6. Missing for reuse?
- CVA (G1).
- Method proxies (G3).
- Focus shortcut (G7).

### 7. Shared?
- Yes.

### 8. Flags?
- `focusShortcut`, method proxies.

### 9. Safest path?
1. Add CVA (additive).
2. Add method proxies.

### 10. Risky?
- Changing default `debounceMs=300` — visible UX shift.
- Spinner placement — visual regressions.
