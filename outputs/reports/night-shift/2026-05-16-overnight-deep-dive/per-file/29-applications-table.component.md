---
rank: 29
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html
violationCount: 7
violatedRules:
  - R-FE-003 (no inline styles) (1x)
  - R-FE-004 (tokens only) (6x)
totalLines: 269
violationDensity: 2.6
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is a sub-tab inside org-hierarchy showing applications/subscriptions for the selected node. Uses raw HTML for one custom expand toggle, plus hand-tuned column sizing. Ranks #29.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 157 | ` To override per page, set \`style="--falcon-data-table-shadow-row-min-height: 48px"\`` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-004 | 17 | ` component sets header-bg + footer-bg to the canonical SoT colour (#F5F5F5) via the` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 19 | ` here was overriding the menu patch and producing a #FAFAFA header / #FAFAFA footer` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 71 | ` <span class="text-falcon-neutral-400 tracking-[0.5px]">—————</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 80 | ` <span class="text-falcon-neutral-400 tracking-[0.5px]">—————</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 89 | ` <span class="text-falcon-neutral-400 tracking-[0.5px]">—————</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 101 | ` <span class="text-falcon-neutral-400 tracking-[0.5px]">—————</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
3. Run `nx build admin-console` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Replace the expand toggle `<button>` with `<falcon-icon-button>`. Column widths follow the same fix as falcon-table-edit-row above — promote to per-column tokens. The 1 `[style]` violation should become a class (likely a width or transform that already has a Tailwind utility).

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - Map each hex / arbitrary-px in the violation table to an existing `--falcon-*` token or add a new one
- Inline-style replacement strategy:
  - Convert each `style="..."` to Tailwind class or token-driven CSS custom property per R-FE-003 fix recipe

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Low.

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
