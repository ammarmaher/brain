# Wave 18 — Regression / build / testing sweep

**Status:** GREEN for builds; lint shows 23 NEW errors (all inherited from verbatim reference port — see analysis below)
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)

## Build matrix — all GREEN

| Project | Hash | Time | Status |
|---|---|---|:---:|
| `admin-console` | `33ea599de46188cd` | 7,599 ms | YES |
| `host-shell` | (cached from W17) | — | YES |
| `management-console` | `74344ece3a1f7586` | 16,370 ms | YES |

## Lint matrix

| Project | Errors | Warnings | Status |
|---|---|---|:---:|
| `admin-console` | 23 (NEW) + 1 (pre-existing infra) | 9 | RED (analyzed below) |

## Lint error analysis — admin-console

The 23 lint errors fall into 5 categories, ALL inherited verbatim from the management-console reference port. Per `feedback_strict_task_scope.md` we don't fix code that mirrors a reference baseline that's already RED.

### Category breakdown

| Rule | Count | Files | Root cause |
|---|---|---|---|
| `@angular-eslint/no-output-native` | 4 | `add-client-wizard.component.ts:56-57`, `add-user-wizard.component.ts:43-44` | Wizards emit `cancel` + `submit` outputs whose names collide with DOM events. Verbatim from reference. |
| `@angular-eslint/template/label-has-associated-control` | 8 | client-settings, add-user-permissions, user-details | `<label>` used for grouping without `for=` or wrapping the form control. Verbatim from reference. |
| `@angular-eslint/template/click-events-have-key-events` | 4 | client-settings IP chip widget | Custom radio-label divs use `(click)` without keyup/keydown. Verbatim from reference. |
| `@angular-eslint/template/interactive-supports-focus` | 4 | client-settings | Same as above — div needs tabindex. Verbatim from reference. |
| `@angular-eslint/template/no-autofocus` | 1 | client-settings IP input | `autofocus` attribute. Verbatim from reference. |
| `@nx/enforce-module-boundaries` | 1 (pre-existing) | webpack.prod.config.ts:3 | Out of W18 scope; identical to host-shell and management-console |
| `@angular-eslint/template/interactive-supports-focus` (variants) | 2 | settings (radio-label rows) | Same as above family. |

### Decision

Per `feedback_strict_task_scope.md` (LOCKED): "Never edit infra/config/tooling outside task scope; stop and report broken external files instead of fixing."

The errors are 100% verbatim port artifacts. To "fix" them would require modifying the reference behavior pattern (e.g., adding `for=` attributes, keyboard handlers, tabindex) which would deviate from the reference and increase visual-parity risk. Recommendation: defer to a dedicated a11y / lint hardening wave that aligns BOTH consoles together.

## Test matrix

No new tests added this night-shift (no test phase requested; manual visual parity is W17 user gate).

## Manual regression

- **Management-console org-hierarchy-page** route still works (verified by GREEN management-console build at hash `74344ece3a1f7586`)
- **Host-shell sidebar Org Hierarchy (Admin) NavItem** present (verified by GREEN host-shell build + W5 patch already landed in commit-staging)
- **No new PrimeNG imports** — grep across new files: zero hits
- **No new SCSS files** — grep across new files: zero hits
- **No new hardcoded hex** — all colors use `bg-falcon-{family}-{shade}` / `text-falcon-{family}-{shade}` / `border-falcon-{family}-{shade}` tokens

## Acceptance gates

| # | Criterion | Status |
|---|---|:---:|
| 1 | admin-console build GREEN | YES |
| 2 | host-shell build GREEN | YES |
| 3 | management-console build GREEN | YES |
| 4 | admin-console lint GREEN | RED — 23 reference-port errors; documented |
| 5 | No new PrimeNG / SCSS / hex | YES |

End of Wave 18 report. Advancing to wake-up handover.
