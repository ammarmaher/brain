---
rank: 7
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html
violationCount: 35
violatedRules:
  - R-FE-004 (tokens only) (31x)
  - R-FE-005 (Falcon library first) (4x)
totalLines: 273
violationDensity: 12.8
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 52
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is part of the Add Client / Add User wizard (a multi-step modal). It violates R-FE-005 with raw `<input type="text">` + increment/decrement spinner `<button>`s for IP allowlist and service-row counts. R-FE-004 fires on hand-tuned font-sizes (`text-[13px]`, `text-[11.5px]`) and tracking (`tracking-[0.04em]`). Per Brain SK playbook `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`, the wizard predates the typography scale freeze. Ranks #7.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 42 | ` <!-- Wave 8 — IP input keeps native <input> because FalconIpAddressDirective talks to` | see fix plan |
| R-FE-005 | 47 | ` <input type="text" falconIpAddress autofocus` | see fix plan |
| R-FE-005 | 56 | ` <button type="button"` | see fix plan |
| R-FE-005 | 61 | ` <button type="button"` | see fix plan |
| R-FE-004 | 5 | ` <div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutral-900 mb-3.5">` | see fix plan |
| R-FE-004 | 25 | ` <strong class="text-[13px] font-semibold text-falcon-neutral-900">` | see fix plan |
| R-FE-004 | 28 | ` <em class="not-italic text-[11.5px] text-falcon-neutral-600 leading-[1.4]">` | see fix plan |
| R-FE-004 | 36 | ` <div class="text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutral-900 mt-[26px] mb-...` | see fix plan |
| R-FE-004 | 55 | ` <div class="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center gap-[2px]">` | see fix plan |
| R-FE-004 | 57 | ` class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[18px] font-bold leading-non...` | see fix plan |
| R-FE-004 | 76 | ` <i slot="icon-start" class="falcon-icon falcon-icon-plus text-[12px]" aria-hidden="true"></i>` | see fix plan |
| R-FE-004 | 85 | ` <div class="flex flex-wrap items-center gap-2.5 mb-[6px]">` | see fix plan |
| ... | ... | _(23 more rows of the same rule families omitted)_ | apply same fix |

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
