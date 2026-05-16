---
rank: 8
filePath: apps/host-shell/src/app/layout/components/topbar/topbar.component.html
violationCount: 28
violatedRules:
  - R-FE-004 (tokens only) (21x)
  - R-FE-005 (Falcon library first) (7x)
totalLines: 171
violationDensity: 16.4
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 42
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This is the topbar layout chrome (present on every authenticated page). It violates R-FE-005 with 7 raw `<button>` icon-only triggers (notifications, settings, profile menu, language switch, etc.) and R-FE-004 with hand-tuned arbitrary sizes (`size-[38px]`, `rounded-[10px]`, `gap-[18px]`). Ranks #8 because every icon button repeats the same anti-pattern.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| (none) | - | - | - |
| ... | ... | _(16 more rows of the same rule families omitted)_ | apply same fix |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Run `nx build host-shell` and fix any errors before declaring done.
4. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Replace every icon-only `<button>` with `<falcon-icon-button>` (or `<falcon-button variant="ghost" icon-only>`). Promote the recurring sizes to tokens: `--falcon-icon-button-size: 38px`, `--falcon-icon-button-radius: 10px`, `--falcon-topbar-action-gap: 18px`, then use `size-falcon-icon-btn rounded-falcon-icon-btn gap-falcon-topbar`. The `[style.transform]="rotate(180deg)"` for the collapse chevron must become `class="rotate-180"` + a transition utility. One topbar + one sidebar fix covers every authenticated page in the platform.

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Layout chrome touches every page — visual regression must be checked on host-shell + admin-console + management-console host views. Falcon icon-button must support badge slot (notifications dot).

## Related fix plans

- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
