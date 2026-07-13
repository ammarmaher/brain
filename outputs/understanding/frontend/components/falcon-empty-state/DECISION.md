# falcon-empty-state — DECISION

## Brain SK final recommendation

### USE FOR

- Empty data-table state via `<ng-template falconDataTableEmpty>`.
- Standalone empty list / search-result / dashboard / first-run pages.
- Composed with `<falcon-angular-button>` action(s) inside `slot="action"`.

### AVOID FOR

- Loading states (use table `[loading]` skeleton).
- Error states (different semantic; consider a dedicated error panel pattern with retry).

## Preferred variant

Light DOM `<falcon-empty-state-tw>` via the Angular wrapper.

## Required upgrades before broader use

| ID | Priority |
|---|---|
| FES-01 Auto-compose inside `<falcon-table>` core | **P2** |
| FES-05 Expose `[ariaLabel]` on wrapper | **P3** |

## Relationship to other components

- **Richer sibling `<falcon-empty-data>`** — the decorated card tier (dashed border + gradient + disc + built-in CTA + info chip), which the data-table **auto-mounts** via `[emptyData]`. The two are complementary fidelity tiers, NOT duplicates. **Selection rule:** minimal look / projected-or-custom action (`slot="action"`) / heading semantics (`<h3>`) → THIS (`empty-state`); decorated card / empty data-table → `empty-data`.
- Projected into a `<falcon-angular-data-table>` only via the manual `falconDataTableEmpty` directive (the auto-mount path uses `empty-data`, not this).
- Composes with `<falcon-angular-button>` inside `slot="action"`.

## Exact rule

1. Empty table → `<ng-template falconDataTableEmpty>` + `<falcon-angular-empty-state>` with iconName + titleText + descriptionText + action button(s).
2. Empty page → wrap in a centring container and use `size="lg"`.
3. Translate `titleText` / `descriptionText` outside the component — the component accepts pre-translated strings only.
4. Use `<falcon-angular-button slot="action">` to project action buttons.

## Status

**READY** for adoption. Stencil core + Angular wrapper both project content correctly. Gap is auto-composition inside the table empty cell (FES-01) — until then, consumers must use the projection directive.

## Dynamic capability assessment

1. **Static today:** Layout (icon top → title → description → action). No illustration. No variant.
2. **Dynamic via inputs/outputs:** iconName, titleText, descriptionText, size, useTailwind.
3. **Dynamic via slots:** Named `action` slot via Stencil — projected through `<ng-content select="[slot=action]">` on the wrapper.
4. **Dynamic via tokens:** Full surface.
5. **Dynamic via Tailwind classes:** None at component level (host class on wrapper).
6. **Missing for reuse:** Auto-compose inside table, `[ariaLabel]` parity, illustration slot.
7. **Add to shared component:** FES-01, FES-04, FES-05.
8. **Better flags/options:** `[variant]` for error/success/info, `[actionLayout]` for row/column.
9. **Safest upgrade path:** All upgrades are additive.
10. **Risky to change:**
   - `slot="action"` name — consumers (projection examples) rely on the literal `'action'` slot name.
   - `role="img"` semantics — screen readers expect a single accessible label.

**Verdict:** Mature presentational component, the **minimal-tier** empty visual. 3 minimal/action-less consumers (B12). Auto-composition inside the table is met by the sibling `<falcon-empty-data>` (FES-01 superseded); this component's path forward is the slot-projected / heading-semantics use case + the FES-05 `ariaLabel`-on-wrapper parity.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). Recommendation unchanged (READY, minimal tier). Added the empty-data selection rule + FES-01-superseded note; consumer count 3 (all minimal). Reconcile flag (no merge) queued HIGH-RISK in FINDINGS/B12.
