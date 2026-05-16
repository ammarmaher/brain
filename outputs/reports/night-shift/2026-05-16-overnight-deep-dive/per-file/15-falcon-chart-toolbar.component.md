---
rank: 15
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html
violationCount: 10
violatedRules:
  - R-FE-004 (tokens only) (6x)
  - R-FE-005 (Falcon library first) (4x)
totalLines: 46
violationDensity: 21.7
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is part of the Org Chart visualization (the tree-graph view of clients). It uses raw `<button>` for zoom / expand / collapse / fit controls and hand-tuned sizing (`text-[12px]`, `w-[280px]`) for compact card layouts. Ranks #15 because each card / control re-implements the same pattern.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 2 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 13 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 25 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 35 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-004 | 1 | `<div class="absolute bottom-3.5 end-3.5 z-[5] flex items-center gap-1 p-1 bg-white border ...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 4 | ` class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-800 trans...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 15 | ` class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-800 trans...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 24 | ` <div class="px-2 h-6 flex items-center text-[11.5px] font-semibold text-falcon-neutral-60...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 27 | ` class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-800 trans...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 37 | ` class="grid place-items-center w-[30px] h-[30px] rounded-md text-falcon-neutral-800 trans...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

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
