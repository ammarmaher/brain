# falcon-form-field (LEGACY) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) SCSS file violates project rule
- `falcon-form-field.component.scss` exists. Per project standard, "Tailwind utilities in templates only — no SCSS".
- **Recommendation:** rewrite visuals as Tailwind utilities OR migrate to a token-driven Falcon UI core component.

### 2. (P1) Double-painting of invalid state
- Consumer often passes BOTH `[errorKey]` to the form-field AND `state="error"` to the inner control. The form-field paints `.fff-error`; the inner control paints its own error visual. The two may conflict or duplicate.
- **Recommendation:** standardize ownership — let the form-field be the SOLE invalid-visual painter. The inner input should NOT also set `state="error"`.

### 3. (P1) No promotion to Falcon UI core
- This is a useful pattern; could be promoted to `<falcon-angular-form-field>` in `libs/falcon-ui-core/`.
- **Recommendation:** promote + add full token contract + dual-render path.

### 4. (P1) Label `for=` linking is manual
- The `<label>` element does not auto-link to the inner control's `id`. AT users may not get the click-to-focus association.
- **Recommendation:** during promotion, accept an `inputId` Input that the form-field renders as `for=` AND that the consumer also passes to the inner control.

### 5. (P2) Hint and error CANNOT coexist
- Current implementation: error replaces hint. No way to show both.
- **Recommendation:** add `showHintOnError?: boolean` Input.

### 6. (P2) No tooltip / info-circle next to the label
- Some labels need a tooltip explaining what to enter.
- **Recommendation:** add `tooltipKey?: string` Input that renders an info icon with `<falcon-angular-tooltip>`.

### 7. (P3) `label` accepts only an i18n key
- Some consumers want plain strings (e.g., a username typed by the admin).
- **Recommendation:** add `labelText?: string` Input as an i18n-bypass.

## Missing accessibility features
- Label `for=` not auto-linked.
- No `aria-describedby` linking hint/error to the inner control.

## Missing tests
- _None observed._

## Missing Tailwind / token parity
- None — bespoke SCSS.

## Performance risks
- Negligible.

## Visual / interaction risks
- Double-painting (item 2) may produce subtle visual inconsistency.

## Reusable upgrade priority
- Promote to Falcon UI core OR deprecate.

## Workaround availability
- For #4 (label linking): consumer passes `id` on the inner control and matches it manually.
