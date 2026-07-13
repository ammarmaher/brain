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
- 16 wrapper inputs (label, helperText, errorText, size, state, readonly, required, name, value, inputId, indeterminate, checkedInput, useTailwind, rowClass, boxClass, labelClass). NO `disabled` input (CVA-only — G8).
- 1 wrapper output (`valueChange`).
- Stencil events: `falcon-change`, `falcon-blur`, `falcon-focus` (last NOT bound by the wrapper — G7).
- Stencil methods: `setFocus()`, `toggle()` (NOT proxied — G4).

### 3. Dynamic via slots/templates?
- **None.** No default slot, no `<ng-content>`, no `ng-template` — `label` is plain text only (G2).

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
- `checkedInput` bypass mechanism — used by checkbox-group AND the wallet allocation table. Don't remove without a parallel API.
- The CVA-only `disabled` contract — anything relying on `setDisabledState` would break if disabled were re-routed.
- Default check glyph / indeterminate-bar SVG — visual regression risk.
- `indeterminate`-resets-on-toggle — table headers depend on this native-matching behavior.

## Verification
🟢 code-verified against the wrapper + both Stencil tags + token file (read 2026-06-03). Live consumer reality (5: wallet + Templates wizard + contact-groups) 🟢 grep-verified 2026-06-03. **Corrected:** dynamic-assessment slot row (no slot) + added `falcon-focus`/`setFocus`/`toggle`/`disabled` gaps.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS. 16-input enumeration + CVA-only-`disabled` (G8) re-confirmed against live code; recommendation unchanged (READY).
