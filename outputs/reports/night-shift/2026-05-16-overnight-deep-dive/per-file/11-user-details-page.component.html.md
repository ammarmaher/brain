---
rank: 11
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html
violationCount: 15
violatedRules:
  - R-FE-004 (tokens only) (9x)
  - R-FE-005 (Falcon library first) (6x)
totalLines: 315
violationDensity: 4.8
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 22
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is the user-details page (drill-down from org-hierarchy → user row). It has 6 raw `<button>` instances for header back/menu actions + edit/save/cancel buttons in editable sections. R-FE-004 fires on hand-tuned text sizes (`text-[14px]`, `text-[15px]`). Ranks #11.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |
| ... | ... | _(3 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

All `<button>` → `<falcon-button variant="ghost|primary|secondary">`. Header back-button → `<falcon-back-button>` (or `<falcon-button variant="ghost" icon="arrow-left">`). The Edit/Save/Cancel triplet is a repeating pattern — extract `<app-inline-edit-actions [editing]="..." (save)="..." (cancel)="..." (edit)="...">` shared component (3+ uses across user-details + client-details). Typography promotions: `--falcon-detail-row-title-size: 15px`, `--falcon-detail-row-meta-size: 14px`.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Low. Standard CRUD page; Falcon button covers all variants.

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
