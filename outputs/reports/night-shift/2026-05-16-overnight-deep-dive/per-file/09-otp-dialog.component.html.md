---
rank: 9
filePath: apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html
violationCount: 23
violatedRules:
  - R-FE-003 (no inline styles) (11x)
  - R-FE-004 (tokens only) (8x)
  - R-FE-005 (Falcon library first) (4x)
totalLines: 149
violationDensity: 15.4
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 34
runId: 2026-05-16-overnight-deep-dive
app: admin-console
---

## File summary

This is the OTP verification dialog. It uses a native `<dialog>` element to leverage the top-layer (above all overlays), and 11 inline `style=` declarations for sizing, gradient backdrop, and font-size tuning. Ranks #9 because the OTP dialog has very specific motion + geometry that wasn't yet expressible in tokens (per Wave 13m comment in the file).

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |
| ... | ... | _(11 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
4. Run `nx build admin-console` and fix any errors before declaring done.
5. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Two paths. **(A)** Keep the native `<dialog>` element (legitimate GAP — top-layer behavior is browser-native), add a `<!-- GAP: R-FE-005 native top-layer dialog -->` marker, and convert inline `style=` to classes. Sizes (`width: 750px`, `gap: 36px`, `font-size: 22px`) become `--falcon-otp-dialog-*` tokens; the circular timer (`width: 140px; height: 140px`) becomes `--falcon-otp-timer-size`. **(B)** Replace with a `<falcon-modal-dialog variant="otp">` skeleton + app wrapper following `feedback_library_skeleton_app_api`. Option A is the minimum-risk fix; B unlocks reuse for other top-layer dialogs.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build admin-console`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Native `<dialog>` top-layer is a deliberate decision (Wave 13m). Do NOT downgrade to a CDK-overlay popup without confirming with the org-hierarchy lead. Inline styles here may be the cleaner option until Falcon ships a `<falcon-modal-dialog>` skeleton — Option A (GAP + token sweep) is the recommended starting point.

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
