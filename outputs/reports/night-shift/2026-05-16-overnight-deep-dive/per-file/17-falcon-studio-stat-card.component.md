---
rank: 17
filePath: libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts
violationCount: 9
violatedRules:
  - R-FE-003 (no inline styles) (9x)
totalLines: 242
violationDensity: 3.7
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: falcon-studio (lib)
---

## File summary

This file lives in `libs/falcon-studio/` — the Theme Studio editor that lets a designer drag-mutate every Falcon token live. Inline `[style.X]="..."` bindings here are the studio's RAISON D'ÊTRE: they bind preview elements to the user's in-flight token values BEFORE those values are committed back to `falcon.theme.css`. This file ranks #17 (9 violations across 242 lines) because Studio's dynamic preview model fundamentally requires runtime style bindings.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 92 | ` [style.background]="bgStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 93 | ` [style.border]="borderStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 94 | ` [style.border-radius]="radiusStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 95 | ` [style.box-shadow]="shadowStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 100 | ` [style.background]="iconBgStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 101 | ` [style.color]="iconColor()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 102 | ` style="font-size: var(--falcon-icon-lg);"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 113 | ` [style.background]="trendBgStyle()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 114 | ` [style.color]="trendColor()"` | Move to Tailwind class or `--falcon-*` token-driven custom property |

## Fix plan (ordered)

1. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
2. Run `nx build falcon-studio` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
4. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

## Refactor opportunity

Two options. **(A)** Mark `libs/falcon-studio/**` as R-FE-003 exempt in `frontend/R-FE-003-no-inline-styles.md` `exemptPaths` — Studio is architecturally identical to `libs/falcon-ui-core/**` (the existing exemption) in that it owns its primitives. **(B)** Reroute every `[style.X]` through a single `[ngStyle]="previewStyles()"` computed signal, then add ONE exempt comment per file. Option A is cleaner and matches the spirit of the rule (the rule targets app-level theme bypass, not the theme tool itself).

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Inline-style replacement strategy:
  - Resolve at the **rule level** — add `libs/falcon-studio/**` to `R-FE-003` `exemptPaths` (Studio is a theme tool, structurally analogous to `libs/falcon-ui-core/**`)

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build falcon-studio`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Do NOT mechanically replace `[style.background]="bgStyle()"` with Tailwind utilities — the values are user-controlled at runtime. The fix is at the **rule level** (exempt the directory), not at the source level. Block on a Brain decision before any edit.

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
