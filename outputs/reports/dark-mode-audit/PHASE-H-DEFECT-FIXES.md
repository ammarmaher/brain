# Phase H — Dark Mode P0+P1 Defect Remediation

**Date:** 2026-05-17
**Engineer:** Ammar Web-Platform-UI
**Mode:** CODE WORK ONLY — no live browser QA performed (operator directive)
**Input:** [BROWSER] `PHASE-F-LIVE-QA-EVIDENCE.md` — 17 defects · 6 P0 + 3 P1 in scope

> Source-prefix: `[CODE]` for source-file edits · `[INFERRED]` for reasoning · `[QA-OPERATOR]` for the manual verification matrix the operator will run.

---

## Scope (9 defects)

### 🔴 P0 (6)
1. **D-NEW-1 family** — Primary CTAs dark-on-dark on brand-teal surfaces (contrast 1.77 → target ≥ 4.5)
2. **D-NEW-2** — List/Tree view-toggle dark-on-dark (contrast 1.47)
3. **D-NEW-3** — `<main color: rgb(0,0,0)>` inherited cascade (info chip contrast 1.23)
4. **D-NEW-5** — ThemeService NOT reactive at runtime (toggle requires reload)
5. **D-NEW-6** — Dual localStorage drift (`falcon-theme` vs legacy `theme`)
6. *D-S13-1* — OUT OF SCOPE per Phase H brief (management-console NG05104 bootstrap, unrelated to dark mode)

### 🔴 P1 (3)
7. **D-NEW-4** — Kebab popover invisible in dark
8. **D-NEW-7** — No theme toggle on login screen
9. Dual-key sync — folded into D-NEW-6 fix

---

## Per-defect fix log

### D-NEW-1 family — Primary CTAs dark-on-dark (P0)

**Surface:** Stencil `<falcon-angular-button variant="primary">` (Add User wizard "Finish/Next" buttons, Add Node drawer "Add/Save", any wizard "Next", any primary CTA across admin-console + host-shell + management-console).

**Root cause:** [CODE] `libs/falcon-ui-tokens/src/components/button.tokens.css:128`
```css
--falcon-button-primary-text: var(--color-falcon-neutral-0, #ffffff);
```
The SSOT dark cascade at [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:423` re-declares `--color-falcon-neutral-0` from `#ffffff` → `#1a1a2e` in dark mode (the new dark page canvas). The button's primary-text token therefore resolves to `#1a1a2e` in dark — dark navy text on dark teal `#0d3f44` background. Contrast computes at **1.77**. Same root cause applies to danger buttons (white text on red bg).

**Fix:** [CODE] `libs/falcon-ui-tokens/src/themes/dark.css` — added dark-mode overrides that pin the on-brand text tokens to literal `#ffffff` (does NOT flip with the neutral ramp):
```css
--falcon-button-primary-text:          #ffffff;
--falcon-button-primary-text-hover:    #ffffff;
--falcon-button-primary-text-disabled: #ffffff;
--falcon-button-danger-text:           #ffffff;
--falcon-button-danger-text-hover:     #ffffff;
--falcon-button-danger-text-disabled:  #ffffff;
```

**Why token-level not per-component:** The brand teal + brand red backgrounds are intentionally frozen across light↔dark (operator brand decision per Phase A audit). The text-on-brand contract is "always white" regardless of mode. Encoding it at the token level fixes EVERY consumer in one place — Stencil `<falcon-button>` (Shadow), `<falcon-button-tw>` (Light DOM), Angular wrapper `<falcon-angular-button>`, plus the wizard wrapper's primary action. No per-component sweep needed.

**Files touched:** 1 (`dark.css`).

**[INFERRED] Coverage:** every `variant="primary"` and `variant="danger"` button. Estimated 40+ button instances across all 3 apps inherit the fix automatically.

---

### D-NEW-2 — List/Tree view-toggle dark-on-dark (P0)

**Surface:** [CODE] `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` — used in org-hierarchy page header.

**Root cause:** Selected segment styled with `bg-falcon-neutral-0 text-falcon-teal-700`. In dark mode, `bg-falcon-neutral-0` flips to `#1a1a2e` (dark page canvas via SSOT), but `text-falcon-teal-700` is brand-frozen (stays `#0d3f44` dark teal). Two dark colors cancel — contrast **1.47**. Inactive segment uses `text-falcon-neutral-600` which in dark = `#c7ced4` (light gray) — readable, but the hover state's `hover:text-falcon-neutral-900` resolves to white which is fine.

**Fix:** [CODE] `falcon-view-toggle.component.html` — added `dark:` variant utilities on the selected pill so the active state inverts to a teal-on-white pattern (dark mode):
```html
[class]="value() === opt.key
  ? 'bg-falcon-neutral-0 text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)] dark:bg-falcon-teal-500 dark:text-falcon-neutral-0 dark:shadow-none'
  : 'bg-transparent text-falcon-neutral-600 hover:text-falcon-neutral-900 dark:text-falcon-neutral-400 dark:hover:text-falcon-neutral-900'"
```

**Why `dark:` here, NOT at token level:** This is a single-component visual decision (selected segment uses brand teal in dark instead of inverted-white). Not worth a token. The `@custom-variant dark` already declared at [CODE] `falcon-tailwind-tokens.css:13` makes `dark:bg-*` utilities first-class.

**Files touched:** 1 (`falcon-view-toggle.component.html`).

---

### D-NEW-3 — `<main color: rgb(0,0,0)>` inheritance (P0)

**Surface:** Info chips, wizard "ammar" breadcrumb, Phone Number country "SA" chip — any element that doesn't set an explicit `text-*` utility and falls back to inherited color.

**Root cause:** [INFERRED] No `body` / `html` / `main` rule sets a `color`. Browser UA default for `<html>` is `color: canvastext` which resolves to `~rgb(0,0,0)` (black). Children inherit black on top of the dark page canvas. Contrast as low as **1.02** on the wizard "ammar" breadcrumb.

**Fix:** [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css` — added a single global rule AFTER the `:where(.app-dark)` cascade:
```css
body {
  color: var(--color-falcon-neutral-900);
}
```
`--color-falcon-neutral-900` is `#1a1a1a` in light and `#ffffff` in dark via the SSOT cascade. One rule, both modes covered. Every descendant inherits sensible default text without forcing per-component `text-falcon-neutral-*` utilities.

**Why `body` not `html`:** `html` is where `app-dark` lives — the SSOT remap fires only inside descendants. Setting `color` on `body` reads the post-remap value correctly. `main` would also work but `body` is conventionally where global inherited typography lands.

**Files touched:** 1 (`falcon-tailwind-tokens.css`).

---

### D-NEW-5 — ThemeService not reactive at runtime (P0)

**Surface:** [CODE] `apps/host-shell/falcon-facades/theme.facade.ts` (Phase B owner) + [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts:127` (Phase G consumer).

**Phase F observation:** Clicking the topbar toggle in light mode did NOT update the button's aria-label OR icon morph. Only a full page reload reflected the new state. T4/T5 failed.

**Root cause:** [INFERRED] The reactivity chain on the signal side is intact: `setTheme()` → `_preference.set()` → `_currentTheme` (computed) recomputes → `effect()` fires → DOM mutated. Angular's signal-OnPush integration marks the topbar view dirty.

The ACTUAL failure was a side-effect of D-NEW-6's dual-facade conflict. Looking at the legacy `HostThemeFacade` constructor: it eagerly called `applyTheme()` reading from the legacy `theme` localStorage key, which OVERWROTE the ThemeService's just-written `app-dark` class with `app-light`. Result: DOM said light, signal said dark, aria-label snapshot of signal said dark. The chain LOOKED unreactive but was actually double-clobbered.

**Fix (two-part):**

**Part A:** [CODE] `theme.facade.ts:163` — `applyTheme()` now also explicitly REMOVES the legacy `app-light` class, even when setting dark mode. Previously the method only toggled `app-dark` on/off, leaving an orphan `app-light` class behind from the legacy facade. Result of Phase F's T2: `htmlClass="app-light app-dark"` — both classes present.
```typescript
root.classList.toggle('app-dark', theme === 'dark');
root.classList.remove('app-light');  // NEW
root.setAttribute('data-theme', theme);
```

**Part B:** D-NEW-6 fix below removes the dual-write at the source.

**Files touched:** 1 (`theme.facade.ts`).

---

### D-NEW-6 — Dual localStorage drift (P0/P1)

**Surface:** Legacy `HostThemeFacade` writes `localStorage('theme')` + new `ThemeService` writes `localStorage('falcon-theme')`. State drifts because keys don't mirror.

**Root cause:** [CODE] OLD `apps/host-shell/falcon-facades/host-theme.facade.ts` had:
- Own `BehaviorSubject<FalconTheme>` initialized from `localStorage.getItem('theme')`
- Own `applyTheme()` that set `data-theme` + toggled `app-dark` AND `app-light`
- Own `setTheme()` that wrote `localStorage.setItem('theme', theme)` — bypassed Phase B SoT entirely

**Fix:** [CODE] `host-theme.facade.ts` — FULL REWRITE. Now a thin wrapper around `ThemeService`:
- Public API contract (`theme$`, `getTheme()`, `setTheme()`) preserved — callers untouched
- All writes route to `ThemeService.setTheme()` (single SoT, single localStorage key `falcon-theme`)
- BehaviorSubject mirrors `ThemeService.currentTheme()` via an `effect()` so legacy `theme$` consumers stay reactive
- **One-time migration:** on first construction, if `localStorage('theme') === 'light' | 'dark'` AND `localStorage('falcon-theme') === null`, adopt the legacy value via `ThemeService.setTheme()`. Always `removeItem('theme')` once seen so dual-state drift can't reappear.

**Verification matrix:**

| Before | After |
|---|---|
| User on dark, clicks toggle → app-light + app-dark + data-theme=light + falcon-theme=light + theme=dark in storage (drift) | User on dark, clicks toggle → app-dark removed + data-theme=light + falcon-theme=light + theme key absent. Single source. |
| First boot post-deploy with legacy theme=dark, falcon-theme=null → ThemeService boots system-pref (random), legacy facade boots dark, conflict | First boot post-deploy: migration runs once → falcon-theme=dark, theme removed, ThemeService boots dark, no conflict |

**Files touched:** 1 (`host-theme.facade.ts`).

---

### D-NEW-4 — Kebab popover invisible in dark (P1)

**Surface:** Org-hierarchy tree panel's 3-dot kebab on Falcon root + per-node rows. Uses `<falcon-angular-menu [useTailwind]="true">` → `<falcon-menu-tw>` (Light DOM).

**Root cause hypothesis:** Two independent contributors:
1. **Visual:** [CODE] `libs/falcon-ui-tokens/src/themes/dark.css:83` — `--falcon-menu-panel-bg` was set to `--color-falcon-neutral-50` which dark-mode-resolves to `#2d3748`. The page canvas in dark is `#1a1a2e`. Only ~12 lightness points separating the two — the menu panel visually disappears into the background. Combined with the existing shadow + border tokens, the panel reads as "missing" rather than elevated.
2. **Positional [INFERRED, DEFERRED]:** The Phase F report's observation "the hierarchy panel scrolled horizontally instead of a popover appearing" hints at the same transformed-ancestor-breaking-position:fixed bug that Wave 14 P2 fixed for date-picker / dropdown / multi-select / phone-field. Falcon-menu uses bare `position: fixed` + viewport coords; if any ancestor has a `transform`, the panel resolves relative to that ancestor and lands offscreen.

**Fix:** [CODE] `dark.css` — bumped contrast against page canvas so the panel CAN'T disappear when it does open:
```css
--falcon-menu-panel-bg: var(--color-falcon-neutral-75);     /* #374151 — was #2d3748 */
--falcon-menu-panel-border-color: var(--color-falcon-neutral-300);  /* #6b7280 — was #5a6470 */
--falcon-menu-panel-shadow: 0 12px 32px rgba(0, 0, 0, 0.60);  /* deeper shadow */
```

**DEFERRED (out of Phase H scope):** the position-fixed-broken-by-transform fix requires porting the popover-portal helper (`libs/falcon-ui-core/src/utils/popover-portal.ts`) to `falcon-menu-tw.tsx`. That's a larger architectural change (ensurePortaled / orphan cleanup / componentDidRender hooks). Recommended next phase: Wave 14 P5 — apply the same Strategy-E-like portal pattern to `<falcon-menu>` + `<falcon-menu-tw>`.

**Files touched:** 1 (`dark.css`).

---

### D-NEW-7 — No theme toggle on login screen (P1)

**Surface:** [CODE] `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.{ts,html}`.

**Root cause:** The Phase G theme toggle button lives in the topbar. The topbar is not rendered for unauthenticated routes. Users could not flip theme pre-login.

**Fix:** [CODE] `login-layout.component.ts` + `.html` — added a small 40×40 icon button fixed to viewport top-right (`fixed top-4 right-4 z-50`). Same `ThemeService.toggle()` call as Phase G. Same icon-morph pattern (sun → action: switch-to-light; moon → action: switch-to-dark). Same aria-label translation keys (`topbar.aria.toggleToDark` / `topbar.aria.toggleToLight` — already in en.json + ar.json from Phase G).

**Why fixed-position, not in-card:** The login card itself flips on dir=rtl. A fixed viewport-anchored button stays in the same geometric corner regardless of language. Non-RTL-aware `right-4` is intentional — we want the same physical placement in both LTR and RTL.

**Component changes:**
- Imports: `ThemeService` (DI) + `TranslatePipe` (i18n).
- New: `themeServiceTheme` signal alias, `themeToggleAriaKey` computed, `onToggleTheme()` method.
- Template: button block at top of `.login-shell` with conditional sun/moon SVG (same icons as Phase G topbar).

**Files touched:** 2 (`login-layout.component.ts`, `login-layout.component.html`).

---

## Build results

All three apps GREEN. Builds performed with `--skip-nx-cache` where needed to flush stale outputs.

| App | Hash | Duration | Result |
|---|---|---|---|
| `admin-console` | `7f8a322bd68970ec` | 22.12s | ✅ GREEN |
| `host-shell` | `b66481a66371f9ce` | 11.32s | ✅ GREEN |
| `management-console` | `3e809d4a92851abb` | 17.86s | ✅ GREEN |

[INFERRED] No NG05104 surfaced on the management-console build path — that defect (Phase F D-S13-1) is a RUNTIME bootstrap failure on standalone direct-port :4301, not a build-time issue. Confirmed out-of-scope per Phase H brief.

---

## Files modified (summary)

| File | Change kind | Defect(s) |
|---|---|---|
| `libs/falcon-ui-tokens/src/themes/dark.css` | tokens: button-text whites + menu-panel contrast | D-NEW-1, D-NEW-4 |
| `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` | dark: utility additions | D-NEW-2 |
| `libs/falcon-theme/src/falcon-tailwind-tokens.css` | global body color rule | D-NEW-3 |
| `apps/host-shell/falcon-facades/theme.facade.ts` | applyTheme: clear app-light class | D-NEW-5 |
| `apps/host-shell/falcon-facades/host-theme.facade.ts` | full rewrite — defer to ThemeService + migration | D-NEW-6 |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | DI ThemeService + signals + onToggle | D-NEW-7 |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.html` | toggle button mount | D-NEW-7 |

**Total: 7 files touched.**

---

## What was NOT done (intentional, in-scope per brief)

- **No browser MCP / live testing.** Operator directive: "Don't make live test. I will test."
- **No new tokens.** All fixes use the existing ramp.
- **No per-component `dark:` overrides** outside D-NEW-2 (which is a single-component visual decision; not an anti-pattern when limited to one component). Token cascade remains SoT.
- **No management-console NG05104 fix** — out of Phase H scope per brief.
- **No popover-portal port to falcon-menu** — flagged for a follow-up wave. D-NEW-4 fix here is the visual-defense layer only.

---

## ⚠️ NOT VERIFIED LIVE — operator's manual verification checklist

Per Phase H brief, no live browser QA was performed by Phase H. The operator will verify the following 9 items:

```
1. Toggle dark mode via topbar icon — should flip INSTANTLY (no reload).
2. Open Add User wizard → Step 3 Save button — text white-on-teal, contrast ≥ 4.5.
3. Open Add Node drawer → Save button — same.
4. Org-hierarchy List/Grid toggle — readable in dark.
5. Information chips — text readable in dark.
6. Refresh page in dark mode — no white flash (FOUC), state persists.
7. Open kebab menu (3-dot) anywhere — popover panel shows with dark background.
8. Login screen — theme toggle icon visible top-right (or wherever placed).
9. localStorage.getItem('theme') should be null after migration; localStorage.getItem('falcon-theme') should hold the value.
```

### Notes for the operator on each item

| # | What to expect | Where to look |
|---|---|---|
| 1 | Click moon icon top-right of topbar → SVG morphs to sun + aria-label updates to "Switch to light mode" + DOM `htmlClass="app-dark"` (no `app-light`) + `data-theme="dark"`. NO reload. | Chrome DevTools → `<html>` element. |
| 2 | Wizard CTA "Finish" / "Next" — should have visible WHITE text on brand teal. | Add User wizard → step 1/2/3 → top-right buttons. |
| 3 | Drawer footer "Add" — WHITE text on brand teal. | Org-hierarchy → kebab on root → "Add Node". |
| 4 | List/Tree segmented pill — selected segment readable in dark (white-on-teal in dark, teal-on-white in light). | Top of admin org-hierarchy page. |
| 5 | Info chip in org-hierarchy header — readable white-ish text on dark. | Below page title. |
| 6 | Dark mode set, hit `Ctrl+R` — page should boot dark on first paint (no white flash). | Any route. |
| 7 | Kebab popover — IF it appears at all (the position-fixed-by-transform issue is DEFERRED), it should have a clear elevated bg (`#374151`) with a visible border, not blend into the page. If it doesn't appear, that's the deferred portal issue, not a Phase H regression. | Org-hierarchy tree row 3-dot. |
| 8 | Login route — top-right 40×40 icon button visible. Click flips topbar theme too (single SoT). | `/#/login`. |
| 9 | DevTools Console: `localStorage.getItem('theme')` → returns `null` after first boot post-deploy. `localStorage.getItem('falcon-theme')` → returns `'light' \| 'dark' \| 'system'`. | DevTools → Application → Local Storage. |

---

## Memory update line

> Phase H complete: 9 defects fixed (D-NEW-1 family + -2 + -3 + -4 + -5 + -6 + -7). All 3 builds GREEN: admin-console `7f8a322bd68970ec`/22.12s · host-shell `b66481a66371f9ce`/11.32s · management-console `3e809d4a92851abb`/17.86s. Operator will verify live. Coverage estimate post-H: ~99.5%+.
