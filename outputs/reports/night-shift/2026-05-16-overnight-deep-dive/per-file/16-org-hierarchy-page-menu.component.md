---
rank: 16
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html
violationCount: 10
violatedRules:
  - R-FE-003 (no inline styles) (1x)
  - R-FE-004 (tokens only) (8x)
  - R-FE-005 (Falcon library first) (1x)
totalLines: 273
violationDensity: 3.7
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is the page-level kebab menu (3-dot Actions dropdown at the top of the org-hierarchy page). Uses a raw `<button>` trigger and hand-tuned `text-[NNpx]` for menu items. Ranks #16.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 217 | ` style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg:...` | see fix plan |
| R-FE-005 | 192 | ` <button type="button"` | see fix plan |
| R-FE-004 | 40 | ` <main class="bg-white border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col...` | see fix plan |
| R-FE-004 | 164 | ` <div class="mx-5 mb-6 border border-falcon-neutral-200 rounded-md overflow-hidden bg-white min-h-[5...` | see fix plan |
| R-FE-004 | 187 | ` <div class="flex items-center justify-between gap-3 px-[18px] py-[14px] bg-white border-b border-fa...` | see fix plan |
| R-FE-004 | 188 | ` <h2 class="text-[15px] font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.users.title' ` | see fix plan |
| R-FE-004 | 193 | ` class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-falcon-neutral-200 b...` | see fix plan |
| R-FE-004 | 196 | ` <i class="falcon-icon falcon-icon-filter text-[13px]"></i>` | see fix plan |
| R-FE-004 | 200 | ` <i class="falcon-icon falcon-icon-search absolute left-2.5 text-falcon-neutral-500 text-[12px] poin...` | see fix plan |
| R-FE-004 | 217 | ` style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg:...` | see fix plan |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
4. Run `nx build admin-console` and fix any errors before declaring done.
5. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Replace with `<falcon-menu>` + `<falcon-menu-trigger>` (per Wave 17 of v3.1). Menu-item text size should be `text-falcon-menu-item` (token already exists from menu component shipping). One-shot fix; copy the exact pattern used by the v3.1 menu wave.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Very low. Falcon menu is mature (Wave 17).

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
