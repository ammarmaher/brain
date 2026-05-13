# falcon-filter-panel — DECISION

## Brain SK final recommendation

### USE FOR (limited)

- Quick prototypes / showcase pages that need a multi-field filter strip and don't mind native field chrome.

### AVOID FOR (in production today)

- Production feature pages where visual consistency with Falcon atoms matters. The native `<input>` / `<select>` / `<input type="date">` look different from `<falcon-angular-input>` / `<falcon-angular-dropdown>` / `<falcon-angular-date-picker>`.
- Filter strips needing custom field types (multi-select, switch, search-input).
- Filter strips needing Apply-on-Enter UX.

### PREFER

For real Angular feature pages today, **build a custom filter toolbar** using `<falcon-angular-input>` + `<falcon-angular-dropdown>` + `<falcon-angular-date-picker>` + `<falcon-angular-button>` directly. Drive `values` via a signal. This gives you visual parity now while waiting for FFP-01 / FFP-02 to land.

## Preferred variant

Light DOM `<falcon-filter-panel-tw>` via the Angular wrapper with `[useTailwind]="true"` (default).

## Required upgrades before wider use

| ID | Priority |
|---|---|
| FFP-01 Falcon atoms inside | **P1** |
| FFP-02 Custom field type / template projection | **P1** |
| FFP-03 Kebab-case event names | **P2** |

## Relationship to other components

- Composes (today): native `<input>`, `<select>` — should compose `<falcon-input>` / `<falcon-dropdown>` / `<falcon-date-picker>` after FFP-01.
- Sits above: `<falcon-angular-data-table>` / `<falcon-angular-table>` — the canonical filtered-list pattern.
- Sibling: table built-in `[showGlobalFilter]` for single-field search.

## Exact rule

1. For multi-field filter strips in production today: hand-roll using `<falcon-angular-input>` + `<falcon-angular-dropdown>` etc. Don't use this panel yet — visual inconsistency dominates.
2. For showcase / playground / prototypes: this panel is fine.
3. Once FFP-01 lands, this becomes the canonical filter-strip primitive.

## Status

**NEEDS-UPGRADE.** The component is structurally sound but visually inconsistent because its field atoms are native HTML controls.

## Dynamic capability assessment

1. **Static today:** Field atoms are native HTML controls; no custom-field type; no Apply-on-Enter; camelCase event names; no kebab-case parity.
2. **Dynamic via inputs/outputs:** filters, values, density, showApply, showClearAll, applyLabel, clearAllLabel, wrapperClass, slotClass, inputClass.
3. **Dynamic via slots:** None.
4. **Dynamic via tokens:** Full token surface.
5. **Dynamic via Tailwind classes:** `wrapperClass`, `slotClass`, `inputClass`.
6. **Missing for reuse:** Falcon atoms, custom field type.
7. **Add to shared component:** FFP-01 to FFP-05.
8. **Better flags/options:** Custom field type with `<ng-template>` projection.
9. **Safest upgrade path:** Add `'custom'` field type FIRST (additive). Then migrate text/select/date atoms one at a time.
10. **Risky to change:** Event name standardisation breaks existing consumers (playground only today — low risk).

**Verdict:** Lowest-priority component in Agent 2's roster for production-readiness. Quick to upgrade given limited consumer base.
