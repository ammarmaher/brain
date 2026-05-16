---
rank: 19
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html
violationCount: 9
violatedRules:
  - R-FE-004 (tokens only) (8x)
  - R-FE-005 (Falcon library first) (1x)
totalLines: 58
violationDensity: 15.5
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is part of the Org Chart visualization (the tree-graph view of clients). It uses raw `<button>` for zoom / expand / collapse / fit controls and hand-tuned sizing (`text-[12px]`, `w-[280px]`) for compact card layouts. Ranks #19 because each card / control re-implements the same pattern.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 1 | `<button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-004 | 3 | ` class="chart-card absolute flex items-center gap-2.5 px-3 py-2 rounded-[10px] border bg-w...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 30 | ` <div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.name }}</d...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 35 | ` <span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-teal-700 text-white t...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 37 | ` <div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.name }}</d...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 39 | ` <div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 47 | ` <span class="grid place-items-center w-7 h-7 rounded-full bg-falcon-mint-100 text-falcon-...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 49 | ` <div class="text-[12.5px] font-semibold leading-tight truncate">{{ card().data.name }}</d...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 51 | ` <div class="text-[10.5px] text-falcon-neutral-600 leading-tight mt-0.5">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Zoom / expand controls → `<falcon-icon-button variant="ghost" size="sm">`. Compact card sizing → promote `--falcon-org-card-width: 280px`, `--falcon-org-card-text-sm: 12px` to the theme file. The whole chart panel could be one shared `<falcon-org-chart>` shell with slotted toolbar — see `feedback_library_skeleton_app_api` for the canonical skeleton+wrapper pattern. Memory note `project_org_hierarchy_tree_shared_component.md` already shipped one shared wrapper (`<app-organization-hierarchy-tree>`); apply the same pattern here.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Falcon components needed:
  - `<falcon-icon-button variant="ghost" size="sm">`
  - `<falcon-tooltip>` (for zoom/fit/expand action hints)
- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--width-falcon-org-card: 280px`, `--text-falcon-org-card-sm: 12px`

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Org chart is the marquee feature of the page. Visual diff against `Brain Outputs/understanding/pages/organization-hierarchy/` reference screenshots is mandatory. Coordination with shared wrapper effort (memory: `project_org_hierarchy_tree_shared_component.md`).

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
