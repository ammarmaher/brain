---
name: project-dashboard-main-parity-tailwind-scrape-2026-06-08
description: "host-shell dashboard made faithful zero-CSS Tailwind parity to origin/main; the port had drifted because it was built against SCSS var() fallbacks not main's real theme tokens; falcon-skel zero-CSS shimmer pattern."
metadata: 
  node_type: memory
  type: project
  originSessionId: c0b6d45c-6e5f-4f20-8353-83311e1a1f9d
---

**host-shell dashboard → faithful, zero-CSS, Tailwind-only parity with origin/main** (2026-06-08, claude, FE-only, NO commits, branch polishing-v0.4 working tree).

User ask: "find the dashboard inside the main branch, scrape it, add it to our dashboard, no CSS just Tailwind + brain skills, follow the FE rules." After loading brain + master-index + verification-status + FE rules ([BRAIN-OUT] `understanding/frontend/ANGULAR_AND_TAILWIND_RULES.md` + night-shift-audit §2 + [[reference-fe-structure-standard-angular21-2026-06-02]]).

**Discovery:** our dashboard was ALREADY a structural Tailwind port of main (skeleton+loaded, 4 stat cards, revenue bar-chart, service-status, recent-activity; already `@if/@for` + extracted models + `falcon-icon`). The REAL gaps were: (1) **geometry built against the SCSS `var(--x, fallback)` FALLBACKS, not main's real theme** — cards `12→16px` (radius-lg), icon tiles `10→12px` (radius-md), chart bars `6→8px` (radius-sm); (2) **skeleton shimmer BROKEN** — `dashboard.component.scss` read `var(--skel-base/-wave/-duration/-radius)` with NO fallback and those vars are undefined in the current libs (died with the old platform theme); (3) a component `.scss` still existed (violates Tailwind-only); (4) dead `getStatusClass()`.

**Main's true values are git-recoverable:** `[CODE] origin/main:libs/falcon/src/theme/styles/tokens/` — `01-palettes.css` (raw hex) + `02-semantics.css` (`--color-*`→`--palette-*` chain) + `04-spacing`/`05-radius`(sm8/md12/lg16)/`06-shadow`(md=`0 10px 24px rgba(0,0,0,.1)` = `shadow-falcon-md` EXACT). Main used a GENERIC slate/emerald/amber palette; current app rebranded to `falcon-*` → ~10 of main's colors have NO exact falcon token.

**Decisions (user, AskUserQuestion ×3):** A=Faithful lean port (keep raw-div+Tailwind, mirror main geometry, do NOT rebuild on `falcon-angular-*`); B=true zero-CSS (relocate shimmer, delete component scss); C=Falcon brand tokens for color (nearest token, app-consistent, NO token-lib edit, document deltas).

**Edits (4 files):** `dashboard.component.html` rewritten (radii→main real values; `skel`/`skel-bar`→`falcon-skel` ×17; text-skel +`rounded-md`; colors unchanged); `dashboard.component.ts` (removed `styleUrls` + dead `getStatusClass`); `apps/host-shell/src/tailwind.css` (+`@utility falcon-skel` + `@keyframes falcon-skel-shimmer`, gradient endpoints = `var(--color-falcon-neutral-100)`/`-0`, app-scoped, no shared-theme edit, no `tokens.ts` regen); **DELETED** `dashboard.component.scss` → feature is now zero-CSS.

**Gate:** `nx build host-shell --skip-nx-cache` GREEN (exit 0, hash `412bcaf9922ff706`, ~19s, "+6 tasks"). Bundle-verified `dist/apps/host-shell/styles.css`: `falcon-skel` ×7 (utility+keyframe wired), `rounded-2xl`/`rounded-t-lg` emitted. Live browser visual diff NOT run (rule §8 forbids browser verification during impl → separate user-gated step).

**Color deltas kept intentionally (decision C):** accent `teal-700 #0d3f44` vs main `teal-600 #104c54`; success `green-500 #16a34a`/`green-100 #dfece6` vs emerald `#10b981`/mint `#d1fae5`; warning `amber-500 #f59e0b` EXACT, soft `amber-50 #ffeccb` vs `#fef3c7`; danger `red-500 #dc2626` vs `#ef4444`.

**LESSONS:** (1) a Tailwind port built against SCSS `var(--x, FALLBACK)` fallbacks silently diverges from the REAL theme — always resolve the actual theme-token chain (here radii were all wrong + shimmer dead). (2) **Zero-CSS shimmer pattern:** app `tailwind.css` `@utility name { background-image:linear-gradient(...token vars...); background-size:200% 100%; animation:kf 1.5s ...; }` + `@keyframes kf {...}`; Tailwind v4 accepts `@utility`, emits when used + scanned via `@source`. (3) `--skel-*` are referenced by `enter-otp`/`forgot-password` too (with their OWN fallbacks) — don't globally redefine; scope per-feature.

**ROUTE FOLLOW-UP (same day):** the dashboard wasn't even REACHABLE — `[CODE] apps/host-shell/src/app/app.routes.ts` had DROPPED main's default child route `{ path:'', pathMatch:'full', component: DashboardComponent, data:{breadcrumb:'Dashboard'} }`. Content area is 100% router-driven (`layout.component.html` = `<router-outlet>`, no hardcoded `<app-dashboard>`), so `/` rendered `LayoutComponent` + EMPTY outlet → blank after login + sidebar "Dashboard" (path `/`, `onItemClick`→`navigateByUrl('/')`) went nowhere. Already-correct: `[CODE] auth.service.ts:136` navigates `redirectUrl||'/'` post-login; `login-transition` `landingRoute$` only needs any non-`/login` NavigationEnd. FIX = re-import `DashboardComponent` (eager, like main) + restore the `''` child as first child of the LayoutComponent route. `layout.component.ts:468`'s "root '/' renders DashboardComponent" comment is now TRUE. Did NOT add main's other demo children (shell/auth-view/profile/:nodeId)=out of scope. `nx build host-shell` GREEN hash `602ceb3ec232549c`. LESSON: a "scrape main's page" task isn't done until the page is ROUTED like main — check `app.routes.ts` default child + post-login nav target + sidebar nav path, not just the component.
