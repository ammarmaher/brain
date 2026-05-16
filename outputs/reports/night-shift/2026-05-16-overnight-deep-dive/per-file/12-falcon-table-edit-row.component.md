---
rank: 12
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html
violationCount: 14
violatedRules:
  - R-FE-003 (no inline styles) (9x)
  - R-FE-004 (tokens only) (5x)
totalLines: 85
violationDensity: 16.5
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 21
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is an inline-edit row that appears inside the Falcon table when adding a new client/account/owner. It uses 9 inline `style="width: NNNpx"` declarations because the row must exactly match the parent table's column widths — column widths the Falcon table doesn't yet expose as design tokens. Ranks #12 because every column gets its own hard-coded width.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 18 | ` style="background: #F3F8F5; padding-inline: 16px;">` | see fix plan |
| R-FE-003 | 22 | ` <div class="flex-shrink-0" style="width: 96px;"></div>` | see fix plan |
| R-FE-003 | 24 | ` <div class="flex-shrink-0" style="width: 140px;"></div>` | see fix plan |
| R-FE-003 | 27 | ` <div class="flex flex-col gap-1" style="width: 180px;">` | see fix plan |
| R-FE-003 | 39 | ` <div class="flex flex-col gap-1" style="width: 220px;">` | see fix plan |
| R-FE-003 | 52 | ` <div class="flex-shrink-0" style="width: 96px;"></div>` | see fix plan |
| R-FE-003 | 54 | ` <div class="flex-shrink-0" style="width: 140px;"></div>` | see fix plan |
| R-FE-003 | 56 | ` <div class="flex-shrink-0" style="width: 180px;"></div>` | see fix plan |
| R-FE-003 | 59 | ` <div class="flex flex-col gap-1" style="width: 260px;">` | see fix plan |
| R-FE-004 | 4 | ` - Background = #F3F8F5 (light green-teal stripe).` | see fix plan |
| R-FE-004 | 18 | ` style="background: #F3F8F5; padding-inline: 16px;">` | see fix plan |
| R-FE-004 | 28 | ` <span class="text-[11px] font-medium text-falcon-neutral-500">` | see fix plan |
| ... | ... | _(2 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Promote column widths to a per-table token map: `--falcon-table-col-icon: 96px`, `--falcon-table-col-tag: 140px`, `--falcon-table-col-name: 180px`, `--falcon-table-col-email: 220px`, `--falcon-table-col-actions: 96px`. Better still: expose `<falcon-table>` column-defs that the edit-row reads via a shared service — eliminate the duplication entirely. The `background: #F3F8F5` should become `bg-falcon-edit-row-stripe` (promote token). The 9 inline widths collapse to 1 wrapper attribute + 9 utility classes.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Falcon table column-def API must support edit-row registration. May require a falcon-ui-core upgrade — check `Brain Outputs/understanding/frontend/components/falcon-table/GAPS_AND_UPGRADES.md` first.

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
