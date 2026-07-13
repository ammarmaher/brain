---
name: project_web_vitals_lcp_cls_rootcause_plan_2026_06_07
description: "host-shell Web Vitals (LCP 2.63s / CLS 0.28 / INP 0ms) root causes + Waves 1-3 remediation plan (no code yet, user gated)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9f8ab0cf-af03-49b0-ae05-9392b97ea865
---

# Web Vitals — host-shell LCP/CLS root cause + plan (2026-06-07, claude, ANALYSIS-ONLY, NO code, user-gated "don't touch until I tell you")

User shared a Chrome DevTools **Live metrics** screenshot: **LCP 2.63s 🟠, CLS 0.28 🔴 (worst cluster 4 shifts), INP 0ms 🟢**; LCP element = `div.topbar-title`. Wants root cause + a perf+test plan to "always get the perfect score." Created plan; chose **Waves 1–3 (no SSR), host-shell first**.

## CRITICAL measurement caveat
The on-disk `dist/apps/host-shell/` is a **dev-config build** (named, unhashed chunks; `host-shell` defaultConfiguration=`development` [CODE] `Falcon/falcon-web-platform-ui/angular.json:252`). The screenshot is almost certainly the **dev server** → prod numbers will be better. ALL before/after MUST come from `nx build host-shell --configuration=production` served static. Structural causes below hold in both.

## Why LCP element = topbar-title
Dashboard renders a **skeleton of empty gray divs** while loading ([CODE] `apps/host-shell/src/app/features/dashboard/dashboard.component.html:4-70`) — skeletons are NOT contentful → the only real paint is the topbar title text → **LCP = shell boot time**.

## LCP root causes [CODE]
- **R1** Pure CSR, empty `<app-root>`, no SSR/skeleton in HTML — `apps/host-shell/src/index.html:56`.
- **R2** Boot serializes 2 blocking fetches BEFORE first paint: (a) `APP_INITIALIZER` blocks on `waitForTranslations()` = fetch **~113KB** `en.json` + **50ms `setInterval` poll** (`libs/falcon/src/language/lib/translate.initializer.ts:6` + `.../services/translate.service.ts:156-177`); (b) `await reloadRemotes()` before `router.initialNavigation()` (MF manifest fetch) — `apps/host-shell/src/bootstrap.ts:50-54`.
- **R3** Huge initial JS: dev `main.js` **5.5MB** + `vendor.js` **2.5MB**; prod "initial" budget set absurdly high **5.5MB warn / 6MB error** (`angular.json:172-183`) → budget guard effectively off.
- **R4** 2 render-blocking cross-origin `<head>` stylesheets: Font Awesome `all.min.css` + Google Fonts CSS — `index.html:9-15`.

## CLS root causes [CODE] (ranked)
- **C1 DOMINANT — web-font swap/FOUT:** Google Fonts `display=swap`, **no preload, no `size-adjust`/`ascent-override`** → Poppins/Inter arrival reflows ALL text at once (`index.html:15`, `apps/host-shell/src/styles.scss:11-21`). NOTE self-hosted `assets/fonts` are neue-haas/cairo/ibm-plex-arabic, NOT wired to the rendered Poppins/Inter families.
- **C2** Topbar title pops in: `@if (effectivePageTitle())` false at first paint (input '' || `routerPageTitle` signal '') → true after NavigationEnd → pushes breadcrumb down, no reserved height (`topbar.component.html:4-5`, `topbar.component.ts:84,97-99,170`).
- **C3** Sidebar nav async PES re-set: `applyAccessToNavItems()` re-sets `navItems` after `ensure()` resolves (`layout.component.ts:390-410`).
- **C4** minor — dashboard already skeleton-guarded (matched dims) so content-area CLS mostly mitigated.
- **INP 0ms** already perfect via `provideZonelessChangeDetection()` (`app.config.ts:92`) — must NOT regress.

## Plan (chosen: Waves 1–3, host-shell first, NO Wave-4 SSR)
- **W0** prod-build baseline (Lighthouse + Perf panel) — honest target.
- **W1 CLS→~0:** self-host fonts + `@font-face` `font-display:optional`/size-adjust + `<link rel=preload>` woff2; reserve topbar-title min-height; reserve sidebar space.
- **W2 LCP green:** resolve `waitForTranslations` from the observable (drop 50ms poll), inline critical shell strings, parallelize reloadRemotes+i18n, preconnect/preload manifest+i18n, self-host/defer Font Awesome.
- **W3 bundle diet:** analyze main.js 5.5MB, lazy-split non-first-paint code, TIGHTEN budgets to enforceable values.
- **Test harness ("always perfect"):** `@lhci/cli` assertions in `.azuredevops` pipeline; `web-vitals` RUM; tightened ng budgets; Playwright perf smoke (CLS<0.1, no shift); unit guards (index preloads fonts, title reserves height, zoneless stays wired).
- Expectation: CLS<0.1≈0 + INP good = realistic "perfect"; LCP green ~1.3–1.8s (perfect-100 needs Wave-4 SSR, deferred).

NO commits, NO source edits. Awaiting explicit "go" to implement. Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_falcon_input_number_tw_hidden_on_rerender_rootcause_fix_2026_06_07]].

---

## 2026-06-08 — Wave 1 IMPLEMENTED (claude, host-shell, NO commits)

User went green-light with strict guardrail: "no UI/UX change, no MF corruption". Wave 1 landed; 3 build gates passed.

**Files touched (5 total):**
- `tools/perf/fetch-google-fonts.mjs` NEW — idempotent woff2 self-host downloader (Node 22 fetch, parses Google Fonts CSS, dedupes cached files, regenerates fonts.css). Reproducible.
- `libs/falcon-theme/src/assets/fonts/google/` NEW — 30 woff2 files (Poppins/Inter/IBM Plex Sans Arabic × 400/500/600/700[/800] × latin/latin-ext/arabic subsets, dropped cyrillic/greek/devanagari) + auto-gen `fonts.css` (14 KB). woff2 are BYTE-IDENTICAL to what `https://fonts.gstatic.com/s/...` serves → zero glyph change.
- `apps/host-shell/src/index.html` MOD — removed Google Fonts `<link>` + 2 cross-origin preconnects; added local `<link rel="stylesheet" href="assets/fonts/google/fonts.css">` + 3 `<link rel="preload" as="font">` for Poppins 400/600/700 latin + 1 `<link rel="preload" as="fetch">` for `/assets/i18n/en.json`. Angular preserved the stylesheet link as a regular blocking sheet (no `media="print"` deferral), so `@font-face` rules activate during first paint and consume the preloaded woff2 cache → **no FOUT swap event** → CLS source C1 eliminated.
- `libs/falcon/src/language/lib/services/translate.service.ts` MOD — replaced the `setInterval(50 ms)` poll inside `waitForTranslations()` with an event-driven `initialLoadPromise` resolved from the cache-hit path AND the HTTP-completion `tap`. 5 s watchdog preserved (`Promise.race`). Removes up to 50 ms of needless boot delay; identical fail-open semantics.
- `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` MOD — added `flex flex-col justify-end min-h-[2.75rem]` to `.topbar-titles` parent. Bottom-anchors the breadcrumb at its steady-state position from first paint so the page title can materialize ABOVE without pushing the breadcrumb down. Eliminates CLS source C2. Steady-state visual = byte-identical (title-and-breadcrumb stack fills the same 2.75 rem regardless of order).

**Verification gates — all PASSED:**
- **GATE-0** (baseline, no edits): `npm run build:host-shell:prod` exit 0; main.js 3.01 MB raw / 480 KB transfer, styles.css 845.79 KB raw / 75.66 KB transfer. (Real prod numbers are FAR better than the dev-server screenshot suggested — `host-shell` default config is `development` per `angular.json:252`, so the screenshot was dev not prod.)
- **GATE-1** (after index.html font + i18n preload): build exit 0, no bundle delta.
- **GATE-2** (after translate-service refactor + topbar reservation): build exit 0, main.js 3.01 MB raw / 480.16 KB transfer (+0.27 KB), styles.css 845.70 KB raw / 75.64 KB transfer (-0.02 KB). Bundle effectively unchanged.

**MF integrity — UNCHANGED (the "must-not-corrupt" invariant):**
- `apps/host-shell/src/assets/module-federation.manifest{,.dev,.prod,.staging}.json` md5 unchanged.
- `apps/host-shell/module-federation.config.ts`, `webpack.config.ts`, `webpack.prod.config.ts` md5 unchanged.
- `bootstrap.ts` `reloadRemotes()→initialNavigation()` ordering UNTOUCHED (it's the documented fix for the refresh-redirect bug — see [CODE] `apps/host-shell/src/bootstrap.ts:45-66`).
- Active remotes (admin-console:4204, management-console:4301) NOT impacted.

**Built artifacts confirmed:**
- `dist/apps/host-shell/assets/fonts/google/fonts.css` present (14105 bytes).
- 30 woff2 files copied to `dist/apps/host-shell/assets/fonts/google/`.
- `dist/apps/host-shell/assets/i18n/en.json` present (112963 bytes) → preload reference resolves.
- Built `<head>` has 3 preload font links + 1 preload fetch link + `<link rel="stylesheet" href="assets/fonts/google/fonts.css">` (regular, NOT deferred).

**Out-of-scope / deferred (per user "stop and let me measure" cadence):**
- C3 sidebar nav reservation — likely unnecessary once C1+C2 are fixed; revisit after measurement.
- R3 budget tightening — defer until real prod numbers are known so the tightened budget is calibrated, not guesswork.
- Wave 3 bundle diet — prod main.js is 480 KB transfer (NOT 5.5 MB as the dev screenshot suggested); much less urgent.
- Test harness (`@lhci/cli` + `web-vitals` RUM) — requires `npm install`, awaits explicit approval.

**Expected impact (to be confirmed by user-side Lighthouse measurement):**
- CLS 0.28 🔴 → ~0.0–0.05 🟢 (C1 font-swap eliminated, C2 title pop-in eliminated)
- LCP 2.63 s 🟠 → 1.5–2.0 s 🟢 (1 fewer render-blocking CSS, i18n + woff2 fetches start in parallel with main.js, ~50 ms shaved from translate-service poll)
- INP 0 ms 🟢 → unchanged (zoneless CD untouched)

**Measurement workflow for user (no Lighthouse-CI yet):**
```
cd C:/Falcon/Falcon/falcon-web-platform-ui
# Already built — skip if dist/apps/host-shell exists:
#   npm run build:host-shell:prod
# Need ALL 3 apps for MF routes to load; build admin + mgmt too:
#   npm run build:admin-console:prod && npm run build:management-console:prod
# Serve each in its own terminal:
#   npx http-server dist/apps/host-shell      -p 4200 -c-1 --no-dotfiles
#   npx http-server dist/apps/admin-console   -p 4204 -c-1 --cors
#   npx http-server dist/apps/management-console -p 4301 -c-1 --cors
# Open Chrome → http://localhost:4200/#/ → log in → DevTools Performance "Live metrics" → hard reload.
```

NO commits, NO source-rewrite in libs/falcon-ui-*, NO npm install. Branch polishing-v0.4 (37 pre-existing dirty files in admin-console untouched). Awaiting user measurement to decide on optional C3/R3/Wave3/test-harness follow-ups.
