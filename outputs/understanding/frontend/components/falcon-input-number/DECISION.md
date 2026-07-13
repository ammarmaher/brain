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

P1: **G5b** (Shadow path lacks the numeric keystroke filter — letters typeable in Shadow mode), G2 (prefix/suffix). P2: G5 (Shadow drops `state`), G6 (keyboard step). None block the default `useTailwind=true` path.

## Relationship

- `[CODE]` The **Stencil** layer composes `<falcon-input(-tw)>` + native spinner buttons (NOT the Angular `<falcon-angular-input>`/`<falcon-angular-button>` — that was the pre-2026-05-17 model). The Angular wrapper is a thin tag-switcher.
- Sibling: `<falcon-angular-grid-input>` (compact in-grid numeric).

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
- `[CODE]` **~25 inputs** (2026-06-03 recount) — incl. `state`/`disabled`/`iconLeft`/`iconRight`/`inputMode` (all boolean ones via `booleanAttribute`).
- `[CODE]` **1 real `@Output`: `valueChange`** (`number|null`). The `(falcon-blur)` is consumed internally for CVA touched — there is NO `@Output() blur` (a `(blur)` host binding will not fire).
- CVA (`coerce()` + `componentOnReady` push); Stencil owns reformatting on value/mode/locale via `@Watch`.

### 3. Slots/templates?
- `[CODE]` `slot="icon-left"` / `slot="icon-right"` (forwarded to inner `<falcon-input>`). No text prefix/suffix (G2). No `ng-template`.

### 4. Tokens?
- Input + button + spinner tokens.

### 5. Tailwind?
- 2 passthrough classes.

### 6. Missing for reuse?
- prefix/suffix text (G2).
- Shadow-path `state` forwarding + numeric filter (G5 / G5b) — the `-tw` default path is complete.
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
- `Intl.NumberFormat` parse behavior changes with browser updates — watch edge cases.
- `coerce()` regex strips locale-specific separators — relies on Stencil `parse()` for proper handling; changing the regex risks breaking locale inputs.
- Adding the Shadow numeric filter / `state` forwarding (G5/G5b) changes Shadow-path input behavior — additive but touches the input-filter hot path → human review before shipping.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a). Recommendation unchanged (READY for the default `useTailwind=true` path). Re-confirmed: thin tag-switcher (not Angular composition); ~25 inputs / 1 real `@Output` (`valueChange`); G5b numeric-filter Shadow gap flagged P1 / HIGH-RISK-QUEUE. W1-a verdict: PASS.
