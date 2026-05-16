---
rank: 2
filePath: apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts
violationCount: 79
violatedRules:
  - R-FE-003 (no inline styles) (1x)
  - R-FE-004 (tokens only) (78x)
totalLines: 1493
violationDensity: 5.3
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 118
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This file is part of the Falcon UI Showcase — a host-shell-internal preview page that renders the entire `<falcon-*>` component catalogue. It exists to demonstrate every component variant side-by-side; the bulk of its violations are arbitrary pixel values (`text-[9px]`, `max-w-[180px]`) used to fit miniature previews into showcase tiles. It ranks #2 because the file is dense with thumbnail-sized literal sizes that have no Falcon token equivalent. Total lines: 1493. Violation density: 5.3/100 LOC.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 579 | ` [style.--ib-mirror-anim-duration]="ibAnimDurationMs() + 'ms'"` | see fix plan |
| R-FE-004 | 127 | ` <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-neutral-500">` | see fix plan |
| R-FE-004 | 131 | ` <p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` | see fix plan |
| R-FE-004 | 188 | ` class="self-start text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"` | see fix plan |
| R-FE-004 | 197 | ` <p class="text-[12.5px] text-falcon-neutral-500 leading-relaxed flex-1">` | see fix plan |
| R-FE-004 | 203 | ` <span class="text-[11.5px] text-falcon-neutral-400">Press to open</span>` | see fix plan |
| R-FE-004 | 249 | ` <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-neutral-500">` | see fix plan |
| R-FE-004 | 253 | ` <p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` | see fix plan |
| R-FE-004 | 267 | ` <span class="text-[11px] font-semibold uppercase tracking-wider text-falcon-neutral-500">` | see fix plan |
| R-FE-004 | 270 | ` <span class="text-[11.5px] text-falcon-neutral-400">When to fade away</span>` | see fix plan |
| R-FE-004 | 337 | ` <span class="text-[11px] font-semibold uppercase tracking-wider text-falcon-neutral-500">` | see fix plan |
| R-FE-004 | 340 | ` <span class="text-[11.5px] text-falcon-neutral-400">Pick any combination</span>` | see fix plan |
| ... | ... | _(67 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
3. Run `nx build host-shell` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
5. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

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

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
