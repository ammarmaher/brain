# falcon-mobile-number (LEGACY FACADE) — DECISION

## Brain SK final recommendation

### Status
- **REFERENCE-ONLY.** Compile-only compatibility shim from Wave 2.
- Roadmap: delete after consumers migrate to `<falcon-angular-phone-field>`.

### Use this component for
- Nothing new. Legacy compile compat only.

### Avoid this component for
- New code. Always.

### Preferred variant / render path
- N/A.

### Required upgrades before wider use
- **NONE.** Migrate consumers off and delete this facade.

### Relationship to other components
- `<falcon-angular-phone-field>` — the modern replacement.

### Exact rule for future implementation tasks
> "Do NOT use `<falcon-mobile-number>`. Use `<falcon-angular-phone-field>` directly. The legacy façade exists only for compile compat and will be deleted in a future cleanup wave."

---

## Dynamic capability assessment

### 1. What is static today?
- 3 inputs are silent no-ops (`preferredCountries`, `showDialCode`, `maxLength`).
- Dial-code → ISO-2 map is fixed at 25 countries.

### 2. What is already dynamic through inputs/outputs?
- `labelKey`, `required`, `defaultCountry`, `error`, `errorMessageKey`, `requiredErrorMessageKey`, `useCustomStyle`.
- CVA + Validator.

### 3. What is already dynamic through slots / ng-template?
- _None._

### 4. What is dynamic through token / theme overrides?
- Via the embedded Falcon phone-field.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper.

### 6. What is missing?
- (P1) Country-change Output.
- (P1) More countries.

### 7. What capability should be added to the shared component vs a one-off page hack?
- N/A — migrate.

### 8. What flags / options / templates / slots would make it better?
- N/A — migrate.

### 9. What is the safest upgrade path?
- Migrate consumers (if any) to `<falcon-angular-phone-field>`.
- Delete `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/`.

### 10. What would be risky to change because other pages depend on it?
- Any latent consumer expecting the silent no-op inputs to take effect. Unlikely, but audit before deletion.
