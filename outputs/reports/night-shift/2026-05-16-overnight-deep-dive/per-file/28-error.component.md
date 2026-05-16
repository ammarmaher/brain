---
rank: 28
filePath: apps/host-shell/src/app/features/error/error.component.ts
violationCount: 7
violatedRules:
  - R-FE-004 (tokens only) (7x)
totalLines: 61
violationDensity: 11.5
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
| R-FE-004 | 26 | ` background: linear-gradient(135deg, #f4f7fb 0%, #e7eef9 100%);` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 32 | ` background: #ffffff;` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 34 | ` box-shadow: 0 1.5rem 3rem rgba(24, 39, 75, 0.12);` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 41 | ` color: #1f2937;` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 47 | ` color: #4b5563;` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 55 | ` background: #1d4ed8;` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 56 | ` color: #ffffff;` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Run `nx build host-shell` and fix any errors before declaring done.
3. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Promote error-page typography to tokens: `--falcon-error-heading-size: 42px`, `--falcon-error-body-size: 18px`. Better: create a shared `<falcon-error-page [code] [message] [actions]>` skeleton + app wrapper (one skeleton, one wrapper, three reuses: 404 / 500 / unauthorized). Error pages share 80% of their markup — collapsing them into one skeleton eliminates 3 files' worth of drift.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--text-falcon-error-heading: 42px`, `--text-falcon-error-body: 18px`

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
