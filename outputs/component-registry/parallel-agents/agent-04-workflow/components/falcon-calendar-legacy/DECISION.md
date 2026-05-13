# falcon-calendar (LEGACY FACADE) — DECISION

## Brain SK final recommendation

### Status
- **DEPRECATED / REFERENCE-ONLY.** Wave 3 façade.
- Roadmap: delete after consumers migrate to `<falcon-angular-date-picker>`.

### Use this component for
- Latent compile-compat only.

### Avoid this component for
- All new code.

### Preferred variant / render path
- N/A.

### Required upgrades before wider use
- **NONE.** Delete.

### Relationship to other components
- `<falcon-angular-date-picker>` — replacement.

### Exact rule for future implementation tasks
> "Do NOT use `<falcon-calendar>`. Use `<falcon-angular-date-picker>` directly. The legacy façade exists only for compile compat and will be deleted."

---

## Dynamic capability assessment

### 1. What is static today?
- 5 inputs are silent no-ops.
- Set/Cancel UX is gone.

### 2. What is already dynamic through inputs/outputs?
- `placeholder`, `disabled`, `styleClass`.
- `[(ngModel)]` Date binding.
- `(dateChange)` Output.

### 3. What is already dynamic through slots / ng-template?
- _None._

### 4. What is dynamic through token / theme overrides?
- Via the embedded date-picker.

### 5. What is dynamic through Tailwind classes?
- `styleClass` Input forwarded.

### 6. What is missing?
- Set/Cancel UX.
- Effective-date validation rules.

### 7. What capability should be added to the shared component vs a one-off page hack?
- N/A — migrate.

### 8. What flags / options / templates / slots would make it better?
- Delete.

### 9. What is the safest upgrade path?
- grep `apps/` + `libs/` for `<falcon-calendar`. Migrate any consumers to `<falcon-angular-date-picker>`. Delete folder.

### 10. What would be risky to change because other pages depend on it?
- Any latent consumer using the no-op effective-date inputs.
