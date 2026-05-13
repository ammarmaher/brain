# falcon-status-badge — DECISION

## Brain SK final recommendation

### USE FOR

- Every list cell rendering user/account/service workflow state.
- Inside `<ng-template falconDataTableCell="status">` projection.

### AVOID FOR

- Generic count / notification badges → use `<falcon-badge>`.
- Severity tags with dismiss action → use `<falcon-tag dismissible>`.

## Preferred variant

Light DOM `<falcon-status-badge-tw>` via the Angular wrapper.

## Required upgrades before broader rollout

| ID | Priority |
|---|---|
| FSB-01 Refactor consoles to use the shared component | **P1** |
| FSB-03/04 Wrapper `<ng-content>` + `[ariaLabel]` | **P2** |

## Relationship to other components

- Sibling to `<falcon-badge>` (generic) and `<falcon-tag>` (chip/tag). Three distinct components for three distinct purposes.
- Common consumer: `<falcon-angular-data-table>` cells.

## Exact rule

1. Status cell → `<falcon-angular-status-badge [severity]="row.status" [label]="('status.' + row.status) | translate">`.
2. NEVER hand-roll `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind classes for status chips.
3. NEVER use `<falcon-badge>` or `<falcon-tag>` for workflow state — they have different semantic + visual contracts.
4. For dot-only mode: pass `aria-label` so screen readers announce.

## Status

**READY** for production use. Main gap is consumer adoption (admin / management consoles hand-roll status chips today).

## Dynamic capability assessment

1. **Static today:** Severity → bucket mapping is fixed in tokens. 9 severities + 4 visual buckets.
2. **Dynamic via inputs/outputs:** severity, label, size, dot, useTailwind.
3. **Dynamic via slots:** Default slot on Stencil (NOT on Angular wrapper — gap).
4. **Dynamic via tokens:** Full surface — bg / fg / dot bg per bucket can be overridden per-instance.
5. **Dynamic via Tailwind classes:** None at component level (`useTailwind` flag only).
6. **Missing for reuse:** Wrapper `<ng-content>` for richer label + `[ariaLabel]` input.
7. **Add to shared component:** Refactor consumers, expose `<ng-content>` + `[ariaLabel]` (FSB-03/04).
8. **Better flags/options:** `[iconName]` shortcut.
9. **Safest upgrade path:** Wrapper additions are fully additive. Consumer refactor is mechanical.
10. **Risky to change:** Severity → bucket mapping. Renaming a severity (e.g. `'locked'` → `'restricted'`) breaks every consumer typed with `FalconStatusBadgeSeverity`.

**Verdict:** Mature component. Adoption is the only barrier.
