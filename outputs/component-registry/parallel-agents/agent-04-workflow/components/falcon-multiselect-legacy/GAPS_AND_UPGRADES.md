# falcon-multiselect (LEGACY STUB) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Dual-panel UX missing
- Original feature; not reimplemented.
- **Recommendation:** if a future page needs dual-panel multi-select, build a new component `<falcon-angular-dual-multi-select>` from scratch. Don't revive this façade.

### 2. (P0) Server-filter / infinite-scroll missing
- Original feature; not reimplemented.
- **Recommendation:** if needed, propose it as an extension to `<falcon-angular-multi-select>` (lazy mode).

### 3. (P0) Select-All-with-cross-page-cache missing
- Same.

### 4. (P0) SCSS file violates project rule
- Delete during cleanup.

### 5. (P1) `subtitle` field on `FalconMultiselectItem` lost in mapping
- The adapter `get options()` returns `{ value: it.id, label: it.displayName }` — drops `subtitle`.
- **Recommendation:** N/A — migrate.

## Missing accessibility features
- Delegated.

## Missing tests
- N/A.

## Missing Tailwind / token parity
- N/A.

## Performance risks
- Stub is lightweight.

## Visual / interaction risks
- Consumers expecting dual-panel see only a single-list dropdown — silent regression.

## Reusable upgrade priority
- DO NOT upgrade.

## Workaround availability
- For new code: use `<falcon-angular-multi-select>`.
