---
rank: 5
filePath: apps/host-shell/src/app/playground/playground.page.html
violationCount: 51
violatedRules:
  - R-FE-004 (tokens only) (9x)
  - R-FE-005 (Falcon library first) (42x)
totalLines: 4080
violationDensity: 1.2
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 76
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This is a 4080-line `playground.page.html` — a private host-shell page used by the team to spike Falcon component variants, copy snippet code, and test layouts. It hosts dozens of raw `<button>` and `<input>` controls because it deliberately demonstrates BOTH the raw-HTML anti-pattern AND the Falcon equivalent side-by-side as a teaching tool. Ranks #5 because of its sheer size and a wall of raw primitives.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 1667 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 1848 | ` <button type="button" (click)="backLinearShadow()"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 1852 | ` <button type="button" (click)="advanceLinearShadow()"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2429 | ` <input` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2451 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2537 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2544 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2551 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2558 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2565 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2578 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2585 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2592 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2599 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2803 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2809 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2815 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2821 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2827 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2833 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2839 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2875 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2881 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2887 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 2893 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| ... | ... | _(26 more rows of the same rule families omitted — apply identical fix recipe per rule)_ | see Fix plan |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build host-shell` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.
5. If the conclusion is 'this file deserves an exemption rather than a fix', file the exemption in `Brain Outputs/exemptions/EXEMPTIONS.md` against the matching rule ID with a one-line rationale and link this fix-plan note.

## Refactor opportunity

Split this file. Move every `<button>` / `<input>` block intended as a 'before/after' demo into a dedicated showcase route, mark it with `<!-- GAP: R-FE-005 demo-only side-by-side -->`. The rest of the page (live wiring) should drop raw primitives entirely in favour of `<falcon-button>` / `<falcon-input>`. Consider also splitting playground.page.html into 4-6 lazy-loaded section components — its current size hurts editor performance and review.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Falcon components needed:
  - Every `<falcon-*>` already exists — playground is BY DESIGN a side-by-side raw-vs-falcon demo; expect GAP markers rather than swaps
- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - Map each hex / arbitrary-px in the violation table to an existing `--falcon-*` token or add a new one

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

This is a private dev tool, not production UI — getting buy-in to gate it the same way as production is the political risk. Recommend per-block GAP markers rather than a code rewrite.

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
