# falcon-tag — DECISION

## Brain SK final recommendation

### USE FOR

- Dismissible chips (filter chips, multi-select selected-values).
- Severity-tagged labels using the 7-value vocabulary.
- Multi-tag cell content inside data tables.

### AVOID FOR

- Workflow state cells → `<falcon-status-badge>`.
- Generic count badges → `<falcon-badge>`.

## Preferred variant

Light DOM `<falcon-tag-tw>` via the Angular wrapper.

## Required upgrades before broader use

| ID | Priority |
|---|---|
| FT-01 Remove dead-code `classes` computed | **P2** |
| FT-02 i18n dismiss aria-label | **P2** |

## Relationship to other components

- Sibling to `<falcon-badge>` and `<falcon-status-badge>` — three distinct components for three distinct concerns.
- Likely composed by `<falcon-angular-multi-select>` for selected chips.
- Used inside `<falcon-angular-data-table>` cells for multi-value lists.

## Exact rule

1. Filter chip / multi-select chip → `<falcon-angular-tag [dismissible]="true" (falconDismiss)="…">`.
2. Permission tags / severity labels inside cells → `<falcon-angular-tag>` without dismiss.
3. Use `severity="secondary"` for neutral non-status chips.
4. Don't use `'warn'` in new code — use `'warning'`.

## Status

**READY** for production use. Dead-code cleanup (`classes` computed) is the only minor blocker for cleanliness.

## Dynamic capability assessment

1. **Static today:** Severity → token mapping fixed in tokens.
2. **Dynamic via inputs/outputs:** value, severity, size, icon, rounded, dismissible, useTailwind. Event: falconDismiss.
3. **Dynamic via slots:** Default slot on Stencil — projected through `<ng-content>` on the wrapper.
4. **Dynamic via tokens:** Full surface.
5. **Dynamic via Tailwind classes:** None at component level.
6. **Missing for reuse:** i18n dismiss label, dead-code cleanup.
7. **Add to shared component:** FT-01, FT-02, FT-03.
8. **Better flags/options:** `<falcon-tag-list>` orchestrator for overflow handling.
9. **Safest upgrade path:** Wrapper dead-code removal is internal — no API impact.
10. **Risky to change:**
   - Removing `'warn'` legacy alias — breaks consumers still passing it.
   - Renaming `(falconDismiss)` — kebab-case Stencil event `falcon-tag-dismiss` is the public contract; Angular wrapper alias must remain.

**Verdict:** Mature component. Recommended adoption.
