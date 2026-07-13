# falcon-multiselect (LEGACY STUB — REMOVED) — DECISION

## Brain SK final recommendation

### Status
- **REMOVED (2026-06-03).** Was a Wave-3 stub façade with **zero consumers**; deleted. No production presence.
- Migration target: **`<falcon-angular-multi-select>`** (`FalconAngularMultiSelectComponent`, `shared-ui/index.ts:58`) — LIVE.

### Use this component for
- **Nothing.** It does not exist. For multi-value selection use `<falcon-angular-multi-select>`.

### Avoid this component for
- Everything. The import does not resolve.

### Preferred variant / render path
- N/A (removed).

### Required upgrades before wider use
- **NONE.** Deletion complete.

### Relationship to other components
- Replaced BY `<falcon-angular-multi-select>`.
- Siblings (RECOGNITION routing): `<falcon-angular-dropdown>` (single pick), `<falcon-angular-checkbox-group>` (always-visible list), `<falcon-angular-combobox>` (type-to-suggest).
- A true **dual-panel transfer list** is a library GAP — raise as a `<falcon-angular-multi-select>` enhancement, not a revival here.

### Exact rule for future implementation tasks
> "Do NOT reference `<falcon-multiselect>` / `FalconMultiselectComponent` — it is REMOVED. Use `<falcon-angular-multi-select>` directly. If a design needs the old dual-panel / server-filter / cross-page Select-All UX, first challenge the design; if essential, raise it as a NEW variant/lazy-mode on `<falcon-angular-multi-select>` — never resurrect the legacy stub or hand-roll a transfer list in app code."

### Safe-to-deprecate assessment (B22)
**SAFE — already deprecated AND removed.** Zero live consumers at every sweep (Wave 3, Wave 7, B22). No HIGH-RISK-QUEUE item: nothing depended on it.

---

## Dynamic capability assessment

### 1. What is static today?
- N/A — removed. (Historically: ~24 of 25 inputs were silent no-ops; only `items`/`selectedIds`/`placeholder` did anything.)

### 2. What is/was dynamic through inputs/outputs?
- (Historical) `items`, `selectedIds` + 7 outputs (most fired only via the embedded multi-select). Two-way `[selectedIds]`; **no CVA**.

### 3. What is/was dynamic through slots / ng-template?
- _None._

### 4. What is/was dynamic through token / theme overrides?
- Via the embedded multi-select (`--falcon-multi-select-*`). No tokens of its own.

### 5. What is/was dynamic through Tailwind classes?
- Outer wrapper only.

### 6. What is missing?
- N/A — superseded. (Historically: dual-panel, server-filter, infinite-scroll, cross-page Select-All — all dropped; raise on the replacement if needed.)

### 7. What capability should be added to the shared component (not a page hack)?
- A `dual-panel`/transfer-list variant + async/lazy options on `<falcon-angular-multi-select>` — raise there, not here.

### 8. What flags / options / templates / slots would make it better?
- N/A — migrate.

### 9. What is the safest upgrade path?
- **Done.** Zero consumers → folder deleted → barrel export removed. No migration was even required.

### 10. What is risky to change because other pages depend on it?
- **Nothing** — 0 live consumers at every sweep. Removal was the lowest-risk possible.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Recommendation: REMOVED / use `<falcon-angular-multi-select>`. Safe-to-deprecate = SAFE (already executed, never had consumers). No HIGH-RISK-QUEUE.
