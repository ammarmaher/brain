---
name: Dark Mode A→H End-to-End Orchestration
description: Jakco-orchestrated 8-phase dark-mode rollout on 2026-05-17. ALL phases LANDED. Phases A+B+C+E+G+H shipped code; Phase D paper-review (Phase F replaced it live); Pre-F brought stack up; Phase F live QA found 17 defects; Phase H fixed 6 P0 + 3 P1. Coverage 94%→99.5%+. Single deferred item: kebab popover positional fix (needs popover-portal port — architectural).
type: project
originSessionId: e4d28e9d-28d9-43e1-ac0f-c412532e588d
---
# Falcon Dark Mode — Phases A+B+C+D (2026-05-17)

**Status:** 🟢 A+B+C+E LANDED · 🟡 D PARTIAL (paper-review accepted, no live browser QA) · ✅ 96 leak migration DONE

## Phase A — Hardcoded color audit (READ-ONLY)
- Report: `Brain Outputs/reports/dark-mode-audit/HARDCODED-COLORS.md`
- 96 🔴 LEAKS / 84 🟡 INTENTIONAL / 17 🟢 false positives across 26 files
- Top hotspot: `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` — 40/96 = 42% of all leaks in ONE file (mechanical `bg-slate-* → bg-falcon-neutral-*` swap)
- 0 PrimeNG legacy tokens found (codebase already clean)
- 0 new tokens required (existing ramp covers all needed replacements)
- management-console: 0 leaks — already clean
- Dev-only excluded: playground.page.html (13), falcon-ui-showcase (43)

## Phase B — ThemeService + wiring
- New file: `apps/host-shell/falcon-facades/theme.facade.ts` (~165 lines)
- Public API: `currentTheme: Signal<'light'|'dark'>`, `preference: Signal<'light'|'dark'|'system'>`, `setTheme()`, `toggle()`
- Sets BOTH `<html class="app-dark">` AND `<html data-theme="dark|light">` together (Tailwind layer + Stencil layer)
- localStorage key: `falcon-theme`. Default: `'system'` (respects `prefers-color-scheme`)
- FOUC script added to ALL 3 index.html files (host-shell, admin-console, management-console) — runs before bundle, mirrors service logic
- `provideAppInitializer(() => inject(ThemeService))` in `app.config.ts`
- Live `matchMedia` listener — flips when user changes OS theme (only when preference === 'system')
- SSR-safe via `PLATFORM_ID` + `isPlatformBrowser` guards
- Builds GREEN: host-shell `940d5572db9fdd14`/20.70s · admin-console `1f5b37b0a92fa701`/19.05s · management-console `b408b2ccc96db650`/16.39s
- Legacy `HostThemeFacade` left in place (separate deprecation wave)
- NO UI toggle button shipped (deferred)

## Phase C — 6 new dark token counterparts
- Edited: `libs/falcon-theme/src/falcon-tailwind-tokens.css` (added new section under existing dark block: `/* --- Wave 14 (Phase C) --- */`)
- Doc updated: `libs/falcon-ui-tokens/WAVE-9-DARK-MODE.md` (new Wave 14 section)
- 6 tokens: popover-dark `#3b4752→#5a6470`, orgchart-line `rgba(124,130,169,0.5)→rgba(168,174,213,0.55)`, lilac-25 `#f8f8fc→#1f1f2e`, lilac-100 `#e8e8f0→#2a2a40`, success-20 `#E6EFE9→rgba(22,163,74,0.15)`, success-50 `#ecfdf5→rgba(22,163,74,0.10)`
- Zero new Stencil component overrides needed (SSOT cascade handled it; `data-table.tokens.css:216` already used `var()` fallback form)
- Tokens intentionally INVARIANT: cyan, lilac-450/500, mint scale (handled via tree-indicator chain), all brand-* (aramco/bmw/rajhi/snb/bupa)
- Same 3 builds GREEN at same hashes as Phase B (B+C ran in parallel, no conflicts)

## Phase D — QA matrix (PARTIAL — paper review only)
- Report: `Brain Outputs/reports/dark-mode-audit/PHASE-D-QA-EVIDENCE.md`
- Original verdict: ⚠️ BLOCKED (backend stack down + 2-browser ambiguity)
- Operator decision: skip live QA, accept paper review (this session)
- Paper review confirmed: ThemeService contract matches Phase B spec — STORAGE_KEY='falcon-theme', dual `app-dark`+`data-theme` write, signal-driven effect re-apply, OS-preference matchMedia binding
- 0/9 surfaces visually tested · 0/8 ThemeService functional tests run
- Unblock recipe documented: (1) Ammar Essentials runs `docker compose up -d` on falcon-essentials, (2) operator picks browser deviceId (Ammar PC: 7ff57e87-cd21-4bae-8189-cb5a7829e571)

## CRITICAL — what's STILL needed (residual scope)

### Phase E — 🟢 LANDED 2026-05-17
- 98 total edits across 27 files (96 from Phase A scope + 2 new structural discoveries in `settings-tab.component.html`)
- All 3 builds GREEN: admin-console `c3c6260390f30552`/18.39s · host-shell `95a9a1ab66e10bed`/24.59s · management-console `0179afc6ba0d2047`/17.39s
- Top hotspot cleaned: `org-hierarchy-skeleton.component.ts` (40 hits, mechanical `bg-slate-* → bg-falcon-neutral-*`)
- ZERO new tokens added (Phase A prediction confirmed — existing ramp covered 100% of replacements)
- Flagged-for-review (intentional, kept as-is): topbar mood-toggle pill, sidebar whites, `error.component.ts:55` white-on-blue button, falcon-chart-card root branch whites — all sit on brand-frozen teal/blue surfaces (correct in both modes)
- Deferred: 4 hits in `falcon-studio-slider.component.ts` + `falcon-studio-color-picker.component.ts` (Studio is internal designer tool)
- Dark coverage: 96% → ~99%+
- Report: `Brain Outputs/reports/dark-mode-audit/PHASE-E-MIGRATION-RESULTS.md`

### Phase F (NOT YET APPROVED) — Live QA after backend up
Re-run the QA matrix once Ammar Essentials brings the stack up + operator picks a browser. Cross-reference with Phase A report. ThemeService 8-test functional matrix.

### Phase G (NOT YET APPROVED) — UI toggle button
A user-facing theme switcher (icon button or settings menu entry). ThemeService API is ready for this — just needs the visual component.

## Token reference (canonical)
- SSOT light: `libs/falcon-theme/src/falcon-tailwind-tokens.css:15-392` (`@theme` block)
- SSOT dark: `libs/falcon-theme/src/falcon-tailwind-tokens.css:417-489` (dark override block — Wave 14 additions at end)
- Stencil semantic: `libs/falcon-ui-tokens/src/semantic/semantic.css`
- Stencil dark: `libs/falcon-ui-tokens/src/themes/dark.css` (179 lines, 52 token overrides, Wave 9 audit ~94% coverage)

## Trigger phrases
- `understand dark mode` / `what's dark mode status` → reload this dossier
- `migrate dark mode leaks` / `fix Phase A leaks` → triggers Phase E (96 file:line list ready)
- `run live dark mode QA` → triggers Phase F (needs stack + browser pick)
- `add dark mode toggle button` → triggers Phase G (ThemeService.toggle() is the call site)

## Architecture doctrine (genius lever — preserved here for future sessions)
The cascade does the work:
```
bg-falcon-neutral-0   ←   --color-falcon-neutral-0   ←   remapped under .app-dark
    (Tailwind utility)        (SSOT custom property)         (cascade override)
```
Adding `class="app-dark"` to `<html>` flips ~94% of pixels with zero per-component edits — Phase A leaks are the residual 6% that bypass the cascade with hardcoded `bg-white`/`text-black`/raw hex.
