---
rank: 4
filePath: apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts
violationCount: 62
violatedRules:
  - R-FE-004 (tokens only) (62x)
totalLines: 937
violationDensity: 6.6
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 93
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This file is part of the Falcon UI Showcase — a host-shell-internal preview page that renders the entire `<falcon-*>` component catalogue. It exists to demonstrate every component variant side-by-side; the bulk of its violations are arbitrary pixel values (`text-[9px]`, `max-w-[180px]`) used to fit miniature previews into showcase tiles. It ranks #4 because the file is dense with thumbnail-sized literal sizes that have no Falcon token equivalent. Total lines: 937. Violation density: 6.6/100 LOC.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-004 | 9 | `/*** lights, filename pill, line-number gutter, #1A2424 body, Prism token tints tuned for low-contra...` | see fix plan |
| R-FE-004 | 210 | ` <div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[2px] border border-...` | see fix plan |
| R-FE-004 | 225 | ` <div class="inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-md p-[2px] border border-...` | see fix plan |
| R-FE-004 | 233 | ` class="px-2.5 py-[5px] rounded-md text-[11.5px] font-medium bg-falcon-teal-50 text-falcon-teal-700 ...` | see fix plan |
| R-FE-004 | 515 | ` /*** • The deeply-nested \`<pre>\` / \`<code>\` / line-number gutter — the user must SEE the #1A242...` | see fix plan |
| R-FE-004 | 527 | ` border: 1px solid #050a0a;` | see fix plan |
| R-FE-004 | 528 | ` background: #1A2424;` | see fix plan |
| R-FE-004 | 530 | ` 0 1px 2px rgba(0, 0, 0, 0.2),` | see fix plan |
| R-FE-004 | 531 | ` 0 14px 36px -18px rgba(0, 0, 0, 0.55),` | see fix plan |
| R-FE-004 | 532 | ` inset 0 1px 0 rgba(255, 255, 255, 0.04);` | see fix plan |
| R-FE-004 | 540 | ` background: linear-gradient(to bottom, #202f2f 0%, #1a2727 100%);` | see fix plan |
| R-FE-004 | 541 | ` border-bottom: 1px solid #050a0a;` | see fix plan |
| ... | ... | _(50 more rows of the same rule families omitted)_ | apply same fix |

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
