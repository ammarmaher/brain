# Shared directives — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) `FalconFormValidateDirective` is heavy
- Uses `MutationObserver` + multiple bubbling/capture event listeners + ad-hoc `<small>` element insertion + inline styles.
- Targets PrimeNG selectors (`.p-dropdown`, `.p-inputnumber`, `.p-calendar`, `.p-multiselect`, `.p-password`, `.p-autocomplete`, `.p-inputwrapper`) — these no longer exist after Wave PR-8 removed PrimeNG.
- **Recommendation:** refactor to:
  - Drop PrimeNG selectors (they match nothing now).
  - Adopt Falcon UI core selectors (`falcon-angular-dropdown`, `falcon-angular-input`, `falcon-angular-multi-select`, etc.) where wrapper-level error rendering is needed.
  - Better: rely on each Falcon UI input's built-in `errorMessage` Input + state="error" pattern; deprecate this directive.

### 2. (P0) Inline styles violate project rule
- `FalconFormValidateDirective` writes inline `style.color`, `style.fontSize`, `style.marginTop`, `style.paddingLeft`, `style.paddingTop`, `style.fontWeight`. Per `feedback_no_inline_styles_tokens_only.md`, this is a hardened violation.
- **Recommendation:** define a `.falcon-error` CSS class with the same properties via tokens; the directive only adds the class.

### 3. (P0) `FalconEffectiveDateDirective` is a no-op stub since Wave 3
- The directive validates `null` always. Any consumer adding this expecting effective-date validation is silently broken.
- **Recommendation:** either re-implement on `<falcon-angular-date-picker>` OR delete the directive entirely.

### 4. (P1) `console.log` calls in production code
- `FalconFormValidateDirective` lines 303-310 and 601 use `console.log` for debug. Should be guarded by env or removed.
- **Recommendation:** remove or gate behind `if (isDevMode())`.

### 5. (P1) `setTimeout(…, 0)` heavy use
- Many `setTimeout(() => { … }, 0)` patterns inside `FalconFormValidateDirective`. Should use `queueMicrotask` or `requestAnimationFrame` for clarity.

### 6. (P1) `falconErrorMessage` attribute pattern is undocumented
- `FalconFormValidateDirective` reads `element.getAttribute('errorMessage')` to look up a custom error message. This isn't a standard Angular Input — it's a raw HTML attribute. Consumers need to know this.
- **Recommendation:** document or replace with a proper Input convention.

### 7. (P2) `FalconCheckExistsDirective` cache is per-instance
- The per-value cache is on the directive instance — switching components recreates it. Could be a service-level cache for cross-component reuse.
- **Recommendation:** offer a `FalconCheckExistsCache` injectable service variant.

### 8. (P2) `FalconPhoneMaskDirective` is locked to "XXX XXXXXXXX" format
- The space after first 3 digits is hardcoded. Some countries (especially in Europe / Asia) need a different format.
- **Recommendation:** accept a `format?: string` Input (e.g., `'XXX XXX XX XX'`) and apply by replacing `X` with digits.

### 9. (P2) `FalconColumnNameDirective` runs on every `valueChanges`
- Could be expensive on rapid typing. Recommend a `debounceTime` of 50ms.

### 10. (P3) `FalconTruncateDirective` does NOT handle DOM-rendered HTML
- Truncates the textContent; if the child contains markup (`<strong>foo</strong>`), it's flattened to text.
- **Recommendation:** document; or add `preserveMarkup?: boolean` that uses character count on raw text but renders the original HTML when below limit.

### 11. (P3) Validator directives don't accept custom error keys
- Each validator emits a fixed error key (e.g., `{ phoneNumber: … }`). Consumers can't rename.
- **Recommendation:** add an `errorKey?: string` Input to each validator.

## Missing accessibility features
- **(P1) `FalconFormValidateDirective` injects `<small class="falcon-error">` without an `id` or `aria-describedby` link** — AT users may not associate the error with the input.
- **(P2) `FalconFormValidateDirective` does not set `aria-invalid="true"` on the inner control** — should add it.

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- The injected error message + inline styles bypass tokens. P0 gap.

## Performance risks
- `FalconFormValidateDirective` runs O(controls) updates per event. For 20+ inputs, this can be tens of operations per keystroke.
- `MutationObserver` re-scans `setupRequiredAsterisks` on every childList change — debounced via setTimeout, but still busy.

## Visual / interaction risks
- Inline styles cause `!important` battles with consumer CSS.
- `findInsertionPoint()` walks the DOM up looking for `.flex.flex-col` — if the consumer's structure doesn't match, fallback to `parentElement` may misplace the error.

## Reusable upgrade priority
- Major refactor needed on `FalconFormValidateDirective`. The simpler directives are fine as-is.

## Workaround availability
- For #1 / #2 (FalconFormValidate): consumers can avoid the directive entirely by relying on each Falcon UI input's built-in `errorMessage` + `state` Inputs.
- For #3 (FalconEffectiveDate): consumer can write a custom validator function.
