---
rank: 27
filePath: libs/falcon-studio/src/lib/components/common-actions-rail.component.ts
violationCount: 7
violatedRules:
  - R-FE-003 (no inline styles) (7x)
totalLines: 412
violationDensity: 1.7
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: falcon-studio (lib)
---

## File summary

This file lives in `libs/falcon-studio/` — the Theme Studio editor that lets a designer drag-mutate every Falcon token live. Inline `[style.X]="..."` bindings here are the studio's RAISON D'ÊTRE: they bind preview elements to the user's in-flight token values BEFORE those values are committed back to `falcon.theme.css`. This file ranks #27 (7 violations across 412 lines) because Studio's dynamic preview model fundamentally requires runtime style bindings.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |

## Fix plan (ordered)

1. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
2. Run `nx build falcon-studio` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
4. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

## Refactor opportunity

Two options. **(A)** Mark `libs/falcon-studio/**` as R-FE-003 exempt in `frontend/R-FE-003-no-inline-styles.md` `exemptPaths` — Studio is architecturally identical to `libs/falcon-ui-core/**` (the existing exemption) in that it owns its primitives. **(B)** Reroute every `[style.X]` through a single `[ngStyle]="previewStyles()"` computed signal, then add ONE exempt comment per file. Option A is cleaner and matches the spirit of the rule (the rule targets app-level theme bypass, not the theme tool itself).

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
