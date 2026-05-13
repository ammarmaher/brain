# falcon-badge — DECISION

## Brain SK final recommendation

### USE FOR

- Count indicators (notification count, inbox badge).
- Feature flags (Beta / New / Updated).
- Generic semantic labels with `variant` × `appearance` × `size` matrix.

### AVOID FOR

- Workflow state cells → `<falcon-status-badge>`.
- Dismissible chips → `<falcon-tag dismissible>`.

## Preferred variant

Light DOM `<falcon-badge-tw>` via the Angular wrapper. The wrapper projects `<ng-content>` in both render paths (verified in `falcon-badge.component.html`), so `<falcon-angular-badge>3</falcon-angular-badge>` works.

## Required upgrades before broader use

| ID | Priority |
|---|---|
| FB-01 `[ariaLabel]` on wrapper | **P2** |

## Relationship to other components

- Sibling to `<falcon-status-badge>` (workflow-state) and `<falcon-tag>` (chip/dismissible).
- Three components, three concerns. Don't conflate.

## Exact rule

1. Count / feature flag → `<falcon-angular-badge variant="…" appearance="…" size="…">text</falcon-angular-badge>`.
2. Workflow state → `<falcon-angular-status-badge>`.
3. Chip / removable tag → `<falcon-angular-tag>`.

## Status

**READY** — Stencil core + Angular wrapper both project content. Main barrier is adoption.

## Dynamic capability assessment

1. **Static today:** Variant → token mapping is fixed in tokens. 6 variants × 3 appearances × 3 sizes.
2. **Dynamic via inputs/outputs (wrapper):** variant, appearance, size, dot, iconName, useTailwind.
3. **Dynamic via slots:** Default slot on Stencil — projected through `<ng-content>` on the wrapper.
4. **Dynamic via tokens:** Full surface — 6 variants × 3 appearances all token-overridable.
5. **Dynamic via Tailwind classes:** None at component level (`useTailwind` flag only).
6. **Missing for reuse:** `[ariaLabel]` on the wrapper for dot-only badge a11y.
7. **Add to shared component:** FB-01 (`[ariaLabel]`).
8. **Better flags/options:** Nothing major.
9. **Safest upgrade path:** Additive input on the wrapper.
10. **Risky to change:** Variant → token mapping (changes break consumers). Variant vocabulary additions (e.g. `'tertiary'`) are additive — safe.

**Verdict:** Mature component. The Angular wrapper is feature-complete except for `[ariaLabel]` parity.
