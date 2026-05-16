---
rank: 14
filePath: apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html
violationCount: 10
violatedRules:
  - R-FE-004 (tokens only) (2x)
  - R-FE-005 (Falcon library first) (8x)
totalLines: 332
violationDensity: 3.0
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This is an auth flow page (login / change-password / forgot-password / OTP). It violates R-FE-005 because the password reveal button + the main form inputs are still raw `<input>` and `<button>` tags. These predate the Falcon library and the auth team has not yet migrated. Ranks #14 because each password screen has 3-4 inputs and 2-3 buttons all repeated for current / new / confirm slots.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-005 | 26 | ` <input` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 61 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 182 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 228 | ` <input` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 237 | ` <button type="button" class="fpf-icon-right" (click)="toggleNewPasswordVisibility()" tabi...` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 268 | ` <input` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 277 | ` <button type="button" class="fpf-icon-right" (click)="toggleConfirmPasswordVisibility()" ...` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 313 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-004 | 94 | ` <circle cx="32" cy="32" r="30" stroke="var(--color-falcon-teal-700, #104C54)" stroke-widt...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 95 | ` <path d="M20 33l8 8 16-16" stroke="var(--color-falcon-teal-700, #104C54)" stroke-width="3...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build host-shell` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Replace every `<input type="password">` with `<falcon-password>` (already exists per memory note `project_zindex_calendar_portal_root_cause_fix.md` — it has the eye-toggle built in). Replace `<input type="email|text">` with `<falcon-input>`. Replace every `<button>` with `<falcon-button>`. This removes the need for `cp-icon-right`, `cp-verify-btn`, `fpf-icon-right` ad-hoc CSS classes — they all become falcon variants. After the swap, the per-file CSS class budget should drop close to zero.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Falcon components needed:
  - `<falcon-password>` (with eye-toggle, [disabled], password-strength binding)
  - `<falcon-input>` (with [label], [error], [hint])
  - `<falcon-button>` (variants: primary, ghost, secondary)
- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - Map each hex / arbitrary-px in the violation table to an existing `--falcon-*` token or add a new one

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Falcon `<falcon-password>` component must support `[disabled]`, autocomplete tokens, and password-strength meter binding — check `Brain Outputs/understanding/frontend/components/falcon-password/` for parity before swap. Auth flows are critical-path; require visual diff and that the same e2e tests pass.

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
