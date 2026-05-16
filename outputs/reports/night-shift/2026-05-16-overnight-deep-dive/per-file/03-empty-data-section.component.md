---
rank: 3
filePath: apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts
violationCount: 77
violatedRules:
  - R-FE-004 (tokens only) (77x)
totalLines: 682
violationDensity: 11.3
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 115
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This file is part of the Falcon UI Showcase — a host-shell-internal preview page that renders the entire `<falcon-*>` component catalogue. It exists to demonstrate every component variant side-by-side; the bulk of its violations are arbitrary pixel values (`text-[9px]`, `max-w-[180px]`) used to fit miniature previews into showcase tiles. It ranks #3 because the file is dense with thumbnail-sized literal sizes that have no Falcon token equivalent. Total lines: 682. Violation density: 11.3/100 LOC.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-004 | 48 | ` <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-falcon-neutral-50...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 52 | ` <p class="text-[13px] text-falcon-neutral-500 leading-relaxed">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 92 | ` <h3 class="text-[13px] font-semibold text-falcon-neutral-900">Users</h3>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 93 | ` <span class="text-[11px] text-falcon-neutral-500">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 99 | ` <div class="min-h-[260px]">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 145 | ` <span class="text-[13px] font-semibold text-falcon-neutral-900">Empty-state controls</spa...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 152 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Card background</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 153 | ` <span class="text-[11px] text-falcon-neutral-500">Soft tinted panel behind everything</sp...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 161 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Glossy gradient</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 162 | ` <span class="text-[11px] text-falcon-neutral-500">Top-to-bottom sheen on the card</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 170 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon background</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 171 | ` <span class="text-[11px] text-falcon-neutral-500">Circular tinted disc behind the icon</s...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 179 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Colored icon</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 180 | ` <span class="text-[11px] text-falcon-neutral-500">Teal accent vs neutral grey</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 188 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon opacity</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 189 | ` <span class="text-[11px] text-falcon-neutral-500">Affects icon + chip only, never the tex...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 197 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Opacity value</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 198 | ` <span class="text-[11px] text-falcon-neutral-500">{{ opacity() }}%</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 201 | ` <span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-10 text-r...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 207 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 208 | ` <span class="text-[11px] text-falcon-neutral-500">Swap the glyph in the chip</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 268 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Icon size</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 269 | ` <span class="text-[11px] text-falcon-neutral-500">{{ iconSize() }}px</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 272 | ` <span class="text-[11.5px] font-semibold text-falcon-neutral-900 tabular-nums w-10 text-r...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 278 | ` <span class="text-[12.5px] font-medium text-falcon-neutral-900">Dismissable</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| ... | ... | _(52 more rows of the same rule families omitted — apply identical fix recipe per rule)_ | see Fix plan |

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
