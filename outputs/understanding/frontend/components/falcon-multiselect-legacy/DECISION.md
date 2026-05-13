# falcon-multiselect (LEGACY STUB) — DECISION

## Brain SK final recommendation

### Status
- **DEPRECATED / REFERENCE-ONLY.** Wave 3 stub.
- Roadmap: delete in a future cleanup wave.

### Use this component for
- Nothing new. No production consumers.

### Avoid this component for
- All new code.

### Preferred variant / render path
- N/A.

### Required upgrades before wider use
- **NONE.** Delete.

### Relationship to other components
- `<falcon-angular-multi-select>` — the canonical replacement.

### Exact rule for future implementation tasks
> "Do NOT use `<falcon-multiselect>`. Use `<falcon-angular-multi-select>` directly. The legacy stub will be deleted."

---

## Dynamic capability assessment

### 1. What is static today?
- All 24 inputs are silent no-ops except `items`, `selectedIds`, `placeholder` (partial).

### 2. What is already dynamic through inputs/outputs?
- `items`, `selectedIds`, all 7 outputs (most only fire via the embedded multi-select).

### 3. What is already dynamic through slots / ng-template?
- _None._

### 4. What is dynamic through token / theme overrides?
- Via the embedded multi-select.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper.

### 6. What is missing?
- Dual-panel, server-filter, infinite-scroll, Select-All-cache — all missing.

### 7. What capability should be added to the shared component vs a one-off page hack?
- N/A — do not extend.

### 8. What flags / options / templates / slots would make it better?
- Delete.

### 9. What is the safest upgrade path?
- Run a grep across `apps/` + `libs/` for `<falcon-multiselect`. If zero matches, delete the folder.

### 10. What would be risky to change because other pages depend on it?
- Nothing currently depends on it.
