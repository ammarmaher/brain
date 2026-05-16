---
rank: 6
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts
violationCount: 46
violatedRules:
  - R-FE-003 (no inline styles) (2x)
  - R-FE-004 (tokens only) (44x)
totalLines: 181
violationDensity: 25.4
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 69
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This file is a loading skeleton (placeholder shimmer cards). It violates R-FE-004 because it uses raw `bg-emerald-100`, `bg-rose-100`, `bg-slate-200/300/300/70` etc. — Tailwind default palette names — instead of the `falcon-{family}-{shade}` prefixed tokens. Also has a small number of `[style]` bindings for dynamic indent and viewport height. Ranks #6 for raw-palette density (46 hits across 181 lines).

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |
| ... | ... | _(34 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Add a single `falcon-skeleton` color family to `falcon.theme.css` (`--color-falcon-skeleton-shimmer`, `--color-falcon-skeleton-base`, `--color-falcon-skeleton-accent-success/-warning/-danger/-muted`) and replace the entire SHADE_BG map with the Falcon-prefixed equivalents. The `[style.height]="calc(95vh - 40px)"` and `[style]="indentStyle(...)"` can become Tailwind classes (`h-[calc(95vh-40px)]` → promote to `h-falcon-page-canvas`, indent → `pl-[calc(var(--falcon-tree-indent)*var(--depth))]` driven by a CSS custom property set on the row root).

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Low. Skeleton colors are by definition non-brand — adding the falcon-skeleton family is a one-time theme write. `[style.height]="calc(95vh - 40px)"` and `[style]="indentStyle(...)"` are both genuine runtime values; they need a CSS custom property bound on the host, then consumed via Tailwind arbitrary-value referencing the var (which is exempt).

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
