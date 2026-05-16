---
rank: 6
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts
violationCount: 46
violatedRules:
  - R-FE-003 (no inline styles) (2x)
  - R-FE-004 (tokens only) (44x)
totalLines: 180
violationDensity: 25.6
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 69
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This file is a loading skeleton (placeholder shimmer cards). It violates R-FE-004 because it uses raw `bg-emerald-100`, `bg-rose-100`, `bg-slate-200/300/300/70` etc. — Tailwind default palette names — instead of the `falcon-{family}-{shade}` prefixed tokens. Also has a small number of `[style]` bindings for dynamic indent and viewport height. Ranks #6 for raw-palette density (46 hits across 180 lines).

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 71 | ` style="height: calc(95vh - 40px)">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 83 | ` [style]="indentStyle(row.indent)">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-004 | 20 | ` success: 'bg-emerald-100',` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 21 | ` warning: 'bg-amber-100',` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 22 | ` danger: 'bg-rose-100',` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 23 | ` muted: 'bg-slate-200',` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 70 | ` class="hidden lg:flex lg:col-span-1 flex-col gap-3 rounded-2xl border border-slate-200 sh...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 74 | ` <div class="h-3.5 w-1/2 rounded-md bg-slate-300/70 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 77 | ` <div class="h-3 w-2/5 rounded-md bg-slate-300/70 animate-pulse mb-1"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 87 | ` <div class="w-3 h-3 rounded-sm bg-slate-300/70 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 89 | ` <div class="h-3.5 rounded-md bg-slate-300/70 animate-pulse" [class]="row.width"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 94 | ` <main class="lg:col-span-4 min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 95 | ` <div class="grid grid-cols-[1fr_auto] items-center gap-4 h-16 px-7 border-b border-slate-...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 98 | ` <div class="h-3.5 rounded-md bg-slate-200/80 animate-pulse" [class]="w"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 101 | ` <div class="h-9 w-28 rounded-full bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 107 | ` <div class="h-6 w-56 rounded-md bg-slate-300/70 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 110 | ` <div class="h-3.5 w-28 rounded-md bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 111 | ` <div class="h-14 w-35 rounded-xl bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 115 | ` <section class="rounded-xl border border-slate-200 bg-white overflow-hidden">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 116 | ` <div class="grid grid-cols-[1fr_auto] items-center h-16 px-5 border-b border-slate-100">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 117 | ` <div class="h-4 w-20 rounded-md bg-slate-300/70 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 118 | ` <div class="h-9 w-28 rounded-full bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 121 | ` <div class="grid grid-cols-[36px_1.1fr_1fr_1.35fr_1.2fr_1fr_1.15fr_0.9fr_32px] items-cent...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 122 | ` <div class="w-3.5 h-3.5 rounded-sm bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 123 | ` <div class="h-3 w-14 rounded bg-slate-200/80 animate-pulse"></div>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| ... | ... | _(21 more rows of the same rule families omitted — apply identical fix recipe per rule)_ | see Fix plan |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Add a single `falcon-skeleton` color family to `falcon.theme.css` (`--color-falcon-skeleton-shimmer`, `--color-falcon-skeleton-base`, `--color-falcon-skeleton-accent-success/-warning/-danger/-muted`) and replace the entire SHADE_BG map with the Falcon-prefixed equivalents. The `[style.height]="calc(95vh - 40px)"` and `[style]="indentStyle(...)"` can become Tailwind classes (`h-[calc(95vh-40px)]` → promote to `h-falcon-page-canvas`, indent → `pl-[calc(var(--falcon-tree-indent)*var(--depth))]` driven by a CSS custom property set on the row root).

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--color-falcon-skeleton-base` / `-shimmer` / `-accent-success/-warning/-danger/-muted`
  - Replace SHADE_BG map values (bg-emerald-100, bg-rose-100, bg-slate-200, etc.)
- Inline-style replacement strategy:
  - Convert `[style]="indentStyle(...)"` to a CSS custom property bound on the row host: `[style.--falcon-row-indent]="depth"`, consumed via Tailwind `pl-[calc(var(--falcon-tree-indent)*var(--falcon-row-indent))]`
  - `[style.height]="'calc(95vh - 40px)'"` → promote calc to `--h-falcon-page-canvas`

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
