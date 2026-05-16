---
rank: 28
filePath: apps/host-shell/src/app/features/error/error.component.ts
violationCount: 7
violatedRules:
  - R-FE-004 (tokens only) (7x)
totalLines: 62
violationDensity: 11.3
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This is an error / unauthorized page (full-screen 404 / 500 / unauthorized layout) defined inline in a TS component. Violates R-FE-004 with hand-tuned page-level typography (`text-[42px]`, `text-[18px]`) and arbitrary spacing. Ranks #28.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Run `nx build host-shell` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Promote error-page typography to tokens: `--falcon-error-heading-size: 42px`, `--falcon-error-body-size: 18px`. Better: create a shared `<falcon-error-page [code] [message] [actions]>` skeleton + app wrapper (one skeleton, one wrapper, three reuses: 404 / 500 / unauthorized). Error pages share 80% of their markup — collapsing them into one skeleton eliminates 3 files' worth of drift.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Low — these are leaf pages with no business logic.

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
