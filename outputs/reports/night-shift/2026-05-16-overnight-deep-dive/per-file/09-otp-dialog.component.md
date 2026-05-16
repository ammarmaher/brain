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
| R-FE-003 | 18 | ` style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 0...` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 44 | ` style="width: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 48 | ` <div class="w-full bg-falcon-teal-700" style="height: 8px;" aria-hidden="true"></div>` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 53 | ` style="top: 32px; inset-inline-end: 36px; width: 28px; height: 28px;"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 63 | ` style="padding: 72px 72px 64px 72px; gap: 36px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 67 | ` style="font-size: 40px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 72 | ` <div class="flex flex-col items-center text-center" style="gap: 6px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 73 | ` <p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 76 | ` <p class="font-extrabold italic text-falcon-teal-700" style="font-size: 22px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 111 | ` <div class="relative" style="width: 140px; height: 140px; margin-top: 12px;" [attr.aria-l...` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 127 | ` style="font-size: 38px;">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-005 | 1 | `<!-- Wave 13m (2026-05-15) — OTP modal in native <dialog> top-layer.` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 16 | `<dialog #dlg` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 51 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 134 | ` <button type="button"` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-004 | 28 | ` background: rgba(13, 63, 68, 0.55);` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 44 | ` style="width: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);"` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 92 | ` <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-falcon-neut...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 99 | ` <span class="text-[13px] text-falcon-red-500 font-medium">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 104 | ` <span class="text-[13px] text-falcon-red-500 font-medium">` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 115 | ` stroke="var(--color-falcon-neutral-150, #e6eaee)"` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 119 | ` stroke="var(--color-falcon-teal-700, #0d3f44)"` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 135 | ` class="inline-flex items-center gap-1.5 mt-1 text-[13px] font-medium disabled:cursor-not-...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
4. Run `nx build admin-console` and fix any errors before declaring done.
5. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Two paths. **(A)** Keep the native `<dialog>` element (legitimate GAP — top-layer behavior is browser-native), add a `<!-- GAP: R-FE-005 native top-layer dialog -->` marker, and convert inline `style=` to classes. Sizes (`width: 750px`, `gap: 36px`, `font-size: 22px`) become `--falcon-otp-dialog-*` tokens; the circular timer (`width: 140px; height: 140px`) becomes `--falcon-otp-timer-size`. **(B)** Replace with a `<falcon-modal-dialog variant="otp">` skeleton + app wrapper following `feedback_library_skeleton_app_api`. Option A is the minimum-risk fix; B unlocks reuse for other top-layer dialogs.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Falcon components needed:
  - `<falcon-modal-dialog variant="otp">` (top-layer; may be Phase-2)
  - `<falcon-otp-input>` (already shipped per memory note)
  - `<falcon-button>`
- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--width-falcon-otp-dialog: 750px`, `--gap-falcon-otp-content: 36px`
  - `--size-falcon-otp-timer: 140px`, `--text-falcon-otp-code: 38px`
- Inline-style replacement strategy:
  - Map each inline `style="font-size: NNpx"` to a token-named class (`text-falcon-otp-code`, etc.)
  - The `rgba(13, 63, 68, 0.30)` shadow → promote to `--shadow-falcon-otp-dialog`

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
