# falcon-calendar (LEGACY FACADE) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) `useEffectiveDateValidation` and friends are no-op
- 5 inputs are silent no-ops: `useEffectiveDateValidation`, `visibility`, `status`, `pricingType`, `renewDate`.
- **Recommendation:** Wave 4 was supposed to re-implement, but most likely should just delete these inputs and migrate consumers off the façade.

### 2. (P0) Set/Cancel overlay UX missing
- Original feature dropped. No way to restore without reverting to PrimeNG.
- **Recommendation:** N/A — accepted behavior change.

### 3. (P1) `dateFormat` is ignored
- Falcon date-picker uses ISO internally; the visible format is its own concern.
- **Recommendation:** if a consumer needs a specific display format, configure the Falcon date-picker directly.

### 4. (P1) `appendTo` is ignored
- The Falcon date-picker uses a popover that auto-positions; `appendTo="body"` is no longer a concern.
- **Recommendation:** N/A — accepted.

### 5. (P2) `placeholder` may not render correctly if Falcon date-picker's empty state differs.

## Missing accessibility features
- Delegated.

## Missing tests
- _None observed._

## Missing Tailwind / token parity
- N/A.

## Performance risks
- toIso / fromIso run on every CVA write — negligible.

## Visual / interaction risks
- Consumers expecting Set/Cancel overlay see immediate-commit. Silent regression.

## Reusable upgrade priority
- DO NOT upgrade. Migrate consumers.

## Workaround availability
- For new date fields: use `<falcon-angular-date-picker>`.
