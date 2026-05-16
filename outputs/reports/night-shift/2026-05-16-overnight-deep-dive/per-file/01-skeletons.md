---
rank: 1
filePath: apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts
violationCount: 154
violatedRules:
  - R-FE-004 (tokens only) (154x)
totalLines: 786
violationDensity: 19.6
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 180
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This file is part of the Falcon UI Showcase — a host-shell-internal preview page that renders the entire `<falcon-*>` component catalogue. It exists to demonstrate every component variant side-by-side; the bulk of its violations are arbitrary pixel values (`text-[9px]`, `max-w-[180px]`) used to fit miniature previews into showcase tiles. It ranks #1 because the file is dense with thumbnail-sized literal sizes that have no Falcon token equivalent. Total lines: 786. Violation density: 19.6/100 LOC.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-004 | 4 | `/*** Frame wrapper with bounded inner content (max-w-[180px]). ***/` | see fix plan |
| R-FE-004 | 19 | ` <div class="w-full max-w-[180px]">` | see fix plan |
| R-FE-004 | 21 | ` <span class="text-[9px] font-medium text-falcon-neutral-700">Label</span>` | see fix plan |
| R-FE-004 | 23 | ` <span class="text-[9px] text-falcon-neutral-475">Placeholder</span>` | see fix plan |
| R-FE-004 | 40 | ` <div class="w-full max-w-[180px]">` | see fix plan |
| R-FE-004 | 42 | ` <span class="inline-flex items-center justify-center h-7 px-3 rounded-md bg-falcon-teal-500 text-fa...` | see fix plan |
| R-FE-004 | 43 | ` <span class="inline-flex items-center justify-center h-7 px-3 rounded-md bg-falcon-neutral-0 border...` | see fix plan |
| R-FE-004 | 58 | ` <div class="w-full max-w-[180px]">` | see fix plan |
| R-FE-004 | 60 | ` <span class="text-[9px] font-medium text-falcon-neutral-700">Country</span>` | see fix plan |
| R-FE-004 | 62 | ` <span class="text-[9px] text-falcon-neutral-900">Saudi Arabia</span>` | see fix plan |
| R-FE-004 | 79 | ` <div class="w-full max-w-[180px]">` | see fix plan |
| R-FE-004 | 81 | ` <span class="text-[9px] font-medium text-falcon-neutral-700">Stack</span>` | see fix plan |
| ... | ... | _(142 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Run `nx build host-shell` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
4. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

## Refactor opportunity

Showcase tiles need a NEW token family: `text-falcon-preview-xxs` / `w-falcon-preview-tile` / `gap-falcon-preview-row`. Promote these to `libs/falcon-theme/src/falcon-tailwind-tokens.css` first, then sweep this file (and its 3 showcase-related siblings ranked #2-4) in one pass — they share the same anti-pattern. After that, consider adding an `exemptions/EXEMPTIONS.md` block listing the showcase folder for R-FE-004 if Theme Studio scope explicitly excludes preview tiles.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Without preview-tile tokens, the alternative is `[var(--falcon-preview-size)]` arbitrary values which still trip the detector. Coordinate with Theme Studio: showcase MIGHT be designated R-FE-004 exempt (similar to `libs/falcon-ui-tokens/`).

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
