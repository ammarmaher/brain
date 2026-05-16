---
rank: 18
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html
violationCount: 9
violatedRules:
  - R-FE-004 (tokens only) (7x)
  - R-FE-005 (Falcon library first) (2x)
totalLines: 81
violationDensity: 11.1
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is part of the Add Client / Add User wizard (a multi-step modal). It violates R-FE-005 with raw `<input type="text">` + increment/decrement spinner `<button>`s for IP allowlist and service-row counts. R-FE-004 fires on hand-tuned font-sizes (`text-[13px]`, `text-[11.5px]`) and tracking (`tracking-[0.04em]`). Per Brain SK playbook `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`, the wizard predates the typography scale freeze. Ranks #18.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 16 | ` <button type="button" role="switch" [attr.aria-checked]="r.visible"` | see fix plan |
| R-FE-005 | 56 | ` <input type="number" min="0"` | see fix plan |
| R-FE-004 | 17 | ` class="relative inline-block w-[34px] h-4 rounded-full transition-colors"` | see fix plan |
| R-FE-004 | 22 | ` [class.left-[18px]]="r.visible"` | see fix plan |
| R-FE-004 | 44 | ` <span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.required' ` | see fix plan |
| R-FE-004 | 57 | ` class="w-full h-[34px] pl-8 pr-3 rounded-md border border-falcon-neutral-200 bg-white text-sm focus...` | see fix plan |
| R-FE-004 | 66 | ` <span class="text-[10px] text-falcon-red-500 mt-1">*{{ 'hierarchy.validation.required' ` | see fix plan |
| R-FE-004 | 72 | ` <span class="inline-flex items-center h-6 px-3.5 rounded-full bg-white border border-falcon-neutral...` | see fix plan |
| R-FE-004 | 76 | ` <span class="text-falcon-neutral-500 text-[13px] tracking-[0.5px]">------</span>` | see fix plan |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Two-part refactor. **(1)** Promote the wizard typography to `--falcon-wizard-section-title-size: 13px`, `--falcon-wizard-helper-size: 11.5px`, `--falcon-wizard-section-tracking: 0.04em` — then the apps consume `text-falcon-wizard-section-title` / `text-falcon-wizard-helper`. **(2)** The IP-input `<input falconIpAddress>` already has a directive; create a `<falcon-input>` variant that accepts `[customDirective]` or specifically `[falconIpAddress]` — keeps the input within the library and removes the GAP. The spinner +/- `<button>`s should be wrapped as `<falcon-number-stepper>` skeleton.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Brain SK playbook is the implementation spec for Add Client. Read `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md` BEFORE editing any wizard step file (per CLAUDE.md hard rule). Validation V-rules must not regress; consult `VALIDATION_INDEX.md`.

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
