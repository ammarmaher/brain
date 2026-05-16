---
rank: 13
filePath: apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html
violationCount: 10
violatedRules:
  - R-FE-003 (no inline styles) (2x)
  - R-FE-004 (tokens only) (2x)
  - R-FE-005 (Falcon library first) (6x)
totalLines: 156
violationDensity: 6.4
ammarAgent: ammar-web-platform-ui
estimatedFixTimeMinutes: 15
runId: 2026-05-16-overnight-deep-dive
app: host-shell
---

## File summary

This is the sidebar layout chrome (collapsible nav rail). It violates R-FE-005 with 6 raw `<button>` icon-only triggers (collapse, nav items, footer actions) and R-FE-003 with 2 `[style.transform]` / `[style.transition]` bindings on the collapse chevron. Ranks #13.

## Violations breakdown

| Rule | Line | Snippet | Suggested fix |
|---|---|---|---|
| R-FE-003 | 38 | ` [style.transform]="collapsed() ? 'rotate(180deg)' : 'rotate(0deg)'"` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-003 | 39 | ` [style.transition]="'transform 0.2s ease'">` | Move to Tailwind class or `--falcon-*` token-driven custom property |
| R-FE-005 | 28 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 54 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 74 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 94 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 118 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-005 | 137 | ` <button` | Replace with `<falcon-*>` equivalent OR mark with `<!-- GAP: R-FE-005 ... -->` |
| R-FE-004 | 19 | ` <div class="sidebar-logo flex items-center gap-2.5 text-xl font-bold tracking-[0.04em] te...` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |
| R-FE-004 | 25 | ` <span class="text-lg leading-none tracking-[0.06em]">{{ brandText() }}</span>` | Replace with `falcon-{family}-{shade}` token or add new token to `falcon-tailwind-tokens.css` |

## Fix plan (ordered)

1. Audit every hex / Tailwind-palette / arbitrary-px occurrence flagged below. For each: (a) map to an existing `--falcon-*` token, or (b) propose a new token to add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Use the existing `falcon-{family}-{shade}` naming.
2. Replace each raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<dialog>` with its Falcon equivalent (`<falcon-button>`, `<falcon-input>`, `<falcon-dropdown>`, `<falcon-textarea>`, `<falcon-modal-dialog>`). For each genuine GAP (e.g. native top-layer `<dialog>`, `falconIpAddress` directive on raw `<input>`), add `<!-- GAP: R-FE-005 <reason> -->` immediately before the tag and file a note in `Brain Outputs/70-Gaps/`.
3. Convert every inline `style=` / `[style.X]` / `[ngStyle]` to a Tailwind utility class or a token-driven custom property. Dynamic bindings should be replaced with an `ngClass` map keyed off a token-named class. For values that genuinely must be runtime-dynamic (e.g. Theme Studio preview), document via per-file exemption.
4. Run `nx build host-shell` and fix any errors before declaring done.
5. Re-run the detector script on this file path; expect ZERO matches for every flagged rule.

## Refactor opportunity

Replace every icon-only `<button>` with `<falcon-icon-button>` (or `<falcon-button variant="ghost" icon-only>`). Promote the recurring sizes to tokens: `--falcon-icon-button-size: 38px`, `--falcon-icon-button-radius: 10px`, `--falcon-topbar-action-gap: 18px`, then use `size-falcon-icon-btn rounded-falcon-icon-btn gap-falcon-topbar`. The `[style.transform]="rotate(180deg)"` for the collapse chevron must become `class="rotate-180"` + a transition utility. One topbar + one sidebar fix covers every authenticated page in the platform.

## Dependencies checklist

Before touching the file, confirm the following exist (or queue their creation):

- Falcon components needed:
  - `<falcon-icon-button>` (with badge slot, [icon], [variant])
  - `<falcon-menu>` + `<falcon-menu-item>` (for profile + language dropdowns)
- Tokens to add or confirm in `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
  - `--size-falcon-icon-btn: 38px`, `--radius-falcon-icon-btn: 10px`, `--gap-falcon-topbar: 18px`
- Inline-style replacement strategy:
  - `[style.transform]="...rotate(180deg)"` → `[class.rotate-180]="collapsed()"` + `transition-transform duration-200`

## Verification

- After fix, these MUST be true:
  - [ ] The file builds clean: `nx build host-shell`
  - [ ] Detector re-run shows zero violations on this file for every flagged rule
  - [ ] Visual smoke test of the page that hosts this component passes (Falcon Eyes baseline)
  - [ ] No regression in i18n / RTL behaviour (sanity-test `ar` locale)

## Risk / blockers

Layout chrome touches every page — visual regression must be checked on host-shell + admin-console + management-console host views. Falcon icon-button must support badge slot (notifications dot).

## Related fix plans

- See `../per-rule/r-fe-003-fix-plan.md` (no inline styles)
- See `../per-rule/r-fe-004-fix-plan.md` (tokens only)
- See `../per-rule/r-fe-005-fix-plan.md` (Falcon library first)
