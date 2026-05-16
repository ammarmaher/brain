---
rank: 24
filePath: apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts
violationCount: 8
violatedRules:
  - R-FE-004 (tokens only) (8x)
totalLines: 62
violationDensity: 12.9
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This file is part of the Falcon UI Showcase — a host-shell-internal preview page that renders the entire `<falcon-*>` component catalogue. It exists to demonstrate every component variant side-by-side; the bulk of its violations are arbitrary pixel values (`text-[9px]`, `max-w-[180px]`) used to fit miniature previews into showcase tiles. It ranks #24 because the file is dense with thumbnail-sized literal sizes that have no Falcon token equivalent. Total lines: 62. Violation density: 12.9/100 LOC.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-004 | 29 | ` <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-falcon-neutra...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 35 | ` <p class="mt-1 text-[11px] text-falcon-teal-50/70 truncate max-w-[64ch]">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 43 | ` <div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 border bo...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 44 | ` <span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Components</sp...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 47 | ` <div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 border bo...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 48 | ` <span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Stack</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 51 | ` <div class="flex flex-col items-end px-4 py-2 rounded-lg bg-falcon-neutral-0/10 border bo...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 52 | ` <span class="text-[10px] uppercase tracking-wider text-falcon-teal-100/90">Port</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Run `nx build host-shell` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
4. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

## Refactor opportunity

Showcase tiles need a NEW token family: `text-falcon-preview-xxs` / `w-falcon-preview-tile` / `gap-falcon-preview-row`. Promote these to `libs/falcon-theme/src/falcon-tailwind-tokens.css` first, then sweep this file (and its 3 showcase-related siblings ranked #2-4) in one pass — they share the same anti-pattern. After that, consider adding an `exemptions/EXEMPTIONS.md` block listing the showcase folder for R-FE-004 if Theme Studio scope explicitly excludes preview tiles.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--text-falcon-preview-xxs: 9px` / `--text-falcon-preview-xs: 10px` (showcase tile labels)
  - `--max-w-falcon-preview-tile: 180px` (showcase tile width)
  - OR designate `apps/host-shell/src/app/features/falcon-ui-showcase/**` as R-FE-004 exempt

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
