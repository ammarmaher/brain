# falcon-mobile-number (LEGACY FACADE) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Silent no-op inputs
- `preferredCountries`, `showDialCode`, `maxLength` accept values but do nothing.
- **Recommendation:** during cleanup, remove these inputs. Consumers must migrate to `<falcon-angular-phone-field>`.

### 2. (P0) SCSS file violates project rule
- `falcon-mobile-number.component.scss` exists. Delete during cleanup.

### 3. (P1) Limited country list (25 countries)
- `ISO2_TO_DIAL` map covers 25 countries. If a consumer needs e.g. Singapore (+65), it's missing.
- **Recommendation:** the Falcon phone-field has a complete country list — use it directly instead of this façade.

### 4. (P1) `requiredErrorMessageKey` is not surfaced if `error` is true
- Order: if `error && errorMessageKey` → use that; ELSE if `showRequiredError` → use `requiredErrorMessageKey`. If consumer toggles `error=true` without `errorMessageKey`, no message renders.
- Recommendation: irrelevant — migrate consumers off this façade.

### 5. (P2) No country-change Output
- Falcon phone-field emits `falcon-country-change` — the façade does not re-emit it. Consumer cannot react to country change.
- **Recommendation:** add `(countryChange)` Output. Or just migrate consumers.

## Missing accessibility features
- Delegated to Falcon phone-field.

## Missing tests
- _None observed._

## Missing Tailwind / token parity
- The component has NO tokens; uses inherited Falcon theme + Falcon phone-field tokens.

## Performance risks
- The dial-code → ISO-2 detection runs synchronously on every `writeValue` call. With 25 entries, negligible.

## Visual / interaction risks
- The `useCustomStyle` flag drives a `@HostBinding('class.fpf-standard')` — its visual effect depends on consumer SCSS (not the component).

## Reusable upgrade priority
- DO NOT upgrade. Migrate to `<falcon-angular-phone-field>`.

## Workaround availability
- For #3: use `<falcon-angular-phone-field>` (complete country list).
