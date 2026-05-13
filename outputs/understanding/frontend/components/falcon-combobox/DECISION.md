# falcon-combobox — DECISION

## Brain SK final recommendation

**STATUS: NEEDS-UPGRADE before broad rollout. Functional but missing form-control inputs (helperText / errorMessage / state / disabled / required).**

## Use this component for

- Free-text + suggestion pickers ("choose or create" patterns).
- Async-loaded autocomplete fields.

## Avoid this component for

- Pure single-select → `<falcon-angular-dropdown>`.
- Pure search → `<falcon-angular-search-input>`.
- Multi-select → `<falcon-angular-multi-select>`.

## Preferred render path

`useTailwind=true` (default).

## Required upgrades before wider use

P1: G1 (helperText / errorMessage), G2 (state), G3 (disabled), G6 (per-item template).

## Relationship to other components

- Sibling: `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`, `<falcon-angular-search-input>`.

## Exact rule for future implementation

1. Free-text + suggestions? → `<falcon-angular-combobox>`.
2. Set `allowFreeText=true` for "choose or create".
3. Wire `filterChange` to RxJS pipeline for async.
4. Use `loading` for async progress.
5. Wrap in `<falcon-form-field>` for label/error UNTIL G1 lands.

---

## Dynamic capability assessment

### 1. What is static?
- No form-control inputs (helper/error/state/disabled/required).
- No variant / appearance.
- Inline SVG icons.

### 2. What is dynamic via inputs/outputs?
- 11 inputs.
- 3 outputs (`valueChange`, `filterChange`, `cleared`).
- CVA + filter event for async.

### 3. What is dynamic via slots/templates?
- None on Angular wrapper.

### 4. What is dynamic via tokens?
- All visual axes.

### 5. What is dynamic via Tailwind?
- 5 passthrough classes.

### 6. Missing for cross-page reuse?
- Form-control input contract (helper / error / state / disabled / required / variant / appearance).
- Per-item template / icon.
- Method proxies.
- Built-in debounce.
- `string | number` value.

### 7. What goes in shared?
- All of the above.

### 8. Flags / options?
- Form-control contract additions.
- `<ng-template falconComboboxItem>`.
- `debounceMs` input.
- Method proxies.

### 9. Safest upgrade path?
1. Add form-control inputs (P1).
2. Add method proxies.
3. Add per-item template directive.
4. Add `debounceMs`.
5. Broaden value to `string | number`.

### 10. Risky to change?
- Value type change from `string` to `string | number` — schema-breaking for typed forms. Stage as opt-in.
- Default `useTailwind=true` switch — leaves Shadow consumers unaffected (Shadow wasn't broadly adopted on this newer component).
