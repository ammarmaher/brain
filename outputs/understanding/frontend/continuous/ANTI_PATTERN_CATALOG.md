---
type: anti-pattern-catalog
purpose: things-not-to-do-with-real-examples
created: 2026-05-16
status: living
tier: 4
source-tiers: [1, 2, 3]
---

# Falcon Frontend Anti-Pattern Catalog

> **What this is.** The consolidated registry of "things that have already been tried in this workspace and shouldn't be done again." Every entry cites a real file, a real line, or a real memory note — no theory, no speculation. Use it as the canonical reference when writing new code, reviewing PRs, or planning a refactor.

> **Tier 4 of the FRONTEND_KNOWLEDGE_PATH.** Above it sit Tier 1 (component dossiers), Tier 2 (architecture deep-dives by Agents A–F), and Tier 3 (ADR-001…008). Below it is **nothing** — this is the bottom-of-stack "do not repeat history" layer.

> **Hard rule.** If an anti-pattern below cites a file that no longer exists, the entry stays — history matters. Annotate with the date of the change instead of deleting.

---

## 1. TL;DR — counts by category

| # | Category | Anti-patterns | Severity mix |
|---|---|---:|---|
| 1 | Routing | 7 | 🔴×3 · 🟠×3 · 🟢×1 |
| 2 | State management | 8 | 🟠×6 · 🟢×2 |
| 3 | Auth / identity | 10 | 🔴×4 · 🟠×5 · 🟢×1 |
| 4 | Tokens / theming | 11 | 🔴×1 · 🟠×7 · 🟢×3 |
| 5 | Folder structure / orphans | 8 | 🟠×6 · 🟢×2 |
| 6 | Component composition | 9 | 🔴×1 · 🟠×7 · 🟢×1 |
| 7 | Module Federation | 8 | 🟠×6 · 🟢×2 |
| 8 | Operational / process | 10 | 🔴×3 · 🟠×6 · 🟢×1 |
| **Total** | **71** | **🔴 12 · 🟠 46 · 🟢 13** |

Severity legend: 🔴 high (data loss, security, broken UX) · 🟠 medium (drift, hidden defects, paper-cuts) · 🟢 low (cosmetic, paper-trail).

---

## 2. How to read each entry

Every anti-pattern row carries the same fields. We optimise for "can a future agent grep this and act on it without re-reading the source."

- **Name** — imperative, starts with `Don't` or `Never`.
- **Severity** — 🔴 / 🟠 / 🟢.
- **Why it's wrong** — 1–3 sentences with the *mechanism* (not just "ugly").
- **Real example** — workspace file + line range, or memory note.
- **Correct alternative** — what to do instead, with the canonical reference.
- **Rule / decision row** — if a `R-` rule or `D-2026-05-16-XX` decision exists, it's cited.

---

## 3. Routing (7)

### R-AP-01 — Don't redirect `''` to a child route that doesn't exist
- **Severity:** 🔴
- **Why:** Angular falls through to the wildcard `**`, which redirects back to `''`, which redirects to the missing child again. The router settles after one idempotent step, but the URL bar is polluted with the intermediate path and the route is functionally untestable.
- **Real example:** `apps/admin-console/src/app/app.routes.ts:9` redirects `''` → `organization-hierarchy` (no such child exists). Same trap at `apps/management-console/src/app/app.routes.ts:9` → `dashboard`.
- **Fix:** Point the default at a real registered child (`org-hierarchy-page` in admin-console) or remove the redirect entirely.
- **Cited:** `ROUTING_TOPOLOGY.md §13.1`; **D-2026-05-16-13**.

### R-AP-02 — Don't `loadRemoteModule` and then cherry-pick a child that was deleted in a prior wave
- **Severity:** 🟠
- **Why:** `routes.find((r) => Array.isArray(r.children))` returns `undefined`; the route resolves to `[]` and silently 404s. Dead code is invisible because it doesn't throw.
- **Real example:** `apps/host-shell/src/app/app.routes.ts:51-93` — four preview routes (`preview-shell/org-hierarchy`, `preview-shell/org-hierarchy-prime`, `preview-hierarchy`, `preview-hierarchy-prime`) reach into the admin-console remote for `organization-hierarchy` / `prime-ng/organization-hierarchy` children that don't exist (PrimeNG was removed in Wave PR-8 per memory `project_falcon_primeng_total_removal_complete`).
- **Fix:** Delete the dead preview routes. If they're still wanted for visual testing, restore the source child routes first.
- **Cited:** `ROUTING_TOPOLOGY.md §13.2 + §13.7`; **D-2026-05-16-16**.

### R-AP-03 — Don't hardcode route slugs inside `LayoutComponent` instead of centralising them
- **Severity:** 🔴
- **Why:** Each nav item assembles its URL by interpolating `APP_ROUTES.admin_console_BASE` with a literal slug. When a remote renames the slug (e.g. `comm-channels` → `communication-channels`), the host nav silently 404s. Already caused the org-hierarchy-comm-channels fiasco (5 rounds, 0 delivered) per memory `feedback_orchestrator_failure_modes_org_hierarchy`.
- **Real example:** `apps/host-shell/src/app/layout/layout.component.ts:61-80` — 16 private readonly URL strings built by hand.
- **Fix:** Promote each slug to a single `APP_ROUTES`, `ADMIN_CONSOLE_ROUTES`, or `MGMT_CONSOLE_ROUTES` constant in `@falcon`. Reuse across host nav, remote routes, and tests.
- **Cited:** `ROUTING_TOPOLOGY.md §13.3`.

### R-AP-04 — Don't eagerly import status pages
- **Severity:** 🟢
- **Why:** `UnauthorizedComponent`, `NotFoundComponent`, `ErrorComponent` are <5 KB each, but eager-loading them adds them to the host's initial chunk and harms code-splitting heat maps. Status pages are by definition rarely reached.
- **Real example:** `apps/host-shell/src/app/app.routes.ts:6-8` — three static imports.
- **Fix:** Convert to `loadComponent: () => import('./features/.../foo.component').then(m => m.FooComponent)`.
- **Cited:** `ROUTING_TOPOLOGY.md §13.4`.

### R-AP-05 — Don't point the wildcard `**` at `''`
- **Severity:** 🟠
- **Why:** Masks invalid URLs by silently sending users to the layout root instead of the dedicated 404. The `/not-found` route becomes dead code that exists but is unreachable.
- **Real example:** `apps/host-shell/src/app/app.routes.ts:115` — `{ path: '**', redirectTo: '' }`. The `not-found` component exists at `apps/host-shell/src/app/features/not-found/` but no path resolves to it (see `ROUTING_TOPOLOGY.md §8` table).
- **Fix:** `{ path: '**', redirectTo: 'not-found' }` so unknown URLs land on a real 404 page that preserves breadcrumbs.
- **Cited:** `ROUTING_TOPOLOGY.md §13.5`.

### R-AP-06 — Don't comment out a defense-in-depth guard "because the host already gates it"
- **Severity:** 🔴
- **Why:** When a remote can be served standalone on its own port (admin-console at `4204`), direct access bypasses the host's pre-match guard. Comment-out converts defense-in-depth into single-line-of-defence.
- **Real example:** `apps/admin-console/src/app/app.routes.ts:7` — `adminConsoleGuard` import is present but the `canActivate` binding is commented out.
- **Fix:** Uncomment the guard. `AccessControlFacade.ensure` memoises, so the perf cost is negligible. For local dev convenience, use the `MockAuth` fallback that Agent E surfaced.
- **Cited:** `ROUTING_TOPOLOGY.md §13.6`; `MODULE_FEDERATION_TOPOLOGY.md §12 row 3`; **D-2026-05-16-12**.

### R-AP-07 — Don't put auth-free preview routes outside of dev guards
- **Severity:** 🟠
- **Why:** `/preview`, `/preview-shell`, `/preview-hierarchy*`, `/playground`, `/falcon-ui-showcase` are explicitly auth-free for visual testing, but the build pipeline currently does not strip them or fail on `?visual-test=1` query params. A production bundle that ships these is an unauthenticated entry surface.
- **Real example:** `apps/host-shell/src/app/app.routes.ts:20, 25, 30, 43, 71, 83` (per `ROUTING_TOPOLOGY.md §11` row "Not for production exposure").
- **Fix:** Either guard the preview routes behind an environment check or add a build-time gate in `tools/gates/` that fails when preview routes survive a `production` configuration build.

---

## 4. State management (8)

### S-AP-01 — Don't use `BehaviorSubject` when the state never crosses the host/remote boundary
- **Severity:** 🟠
- **Why:** A signal is the documented primitive. `BehaviorSubject` is reserved for facade boundaries (where remotes need a framework-agnostic shape) and HTTP replay buffers. Grep across the workspace shows 12 `BehaviorSubject` files total — almost all genuine. A 13th non-facade addition is wrong.
- **Real example:** `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 1 — current count verified at 12 files.
- **Fix:** Use `signal()` for component / page state. Reserve `BehaviorSubject` for `Host*Facade` boundaries and the auth refresh-token mutex.
- **Cited:** `STATE_MANAGEMENT_ARCHITECTURE.md §6 + §9`.

### S-AP-02 — Don't use `providedIn: 'root'` for page state
- **Severity:** 🔴 (per the explicit `never providedIn root` comment)
- **Why:** Root-scoped services survive navigation, leak data across pages, and produce stale UI when the user re-enters the page with fresh URL params.
- **Real example:** The canonical comment lives at `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts:2` — *"Page-scoped via providers: [HierarchyPageStateService]; never providedIn root."*
- **Fix:** Declare `@Injectable()` with no `providedIn`, then register at the page-route's `providers: [...]`. Service tears down when the user leaves the route.
- **Cited:** `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 3.

### S-AP-03 — Don't add NgRx
- **Severity:** 🟠
- **Why:** Adds a redux store, action types, reducers, effects, and devtools on top of a workspace already using signals + page-scoped services. Increases bundle and cognitive surface for zero current need.
- **Real example:** `@ngrx/*` grep across the workspace returns **0 files** (per `STATE_MANAGEMENT_ARCHITECTURE.md §10` repo-wide counts).
- **Fix:** Page-scoped signal stores (`HierarchyPageStateService` pattern). Promote to a facade only when state crosses the host/remote boundary.
- **Cited:** `STATE_MANAGEMENT_ARCHITECTURE.md §6 + §9` bullet 4.

### S-AP-04 — Don't mix `setTimeout` with signal mutations under zoneless
- **Severity:** 🔴
- **Why:** All three apps are zoneless. `setTimeout` callbacks run outside the zone; bare signal mutations from inside them desynchronise CD ticks and can produce stale views.
- **Real example:** Correct pattern at `apps/host-shell/src/app/core/auth/auth.service.ts:174-178` — wraps the expiry timer in `ngZone.runOutsideAngular(...)` then re-enters via `ngZone.run(() => this.logout())`. Anti-pattern: bare `setTimeout(() => signal.set(...))`.
- **Fix:** Either re-enter the zone explicitly, or use `queueMicrotask`, or move to `effect()` triggered by a controlled signal.
- **Cited:** `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 5; memory `project_falcon_revamp_v3_1_night_shift_results.md`.

### S-AP-05 — Don't mutate a signal inside the `effect()` that reads it
- **Severity:** 🟠
- **Why:** Angular throws at runtime. Effects must read or write, not both.
- **Real example:** Cited as rule in `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 6.
- **Fix:** Use a separate signal, or restructure as a `computed`.

### S-AP-06 — Don't `toSignal(observable)` casually
- **Severity:** 🟢
- **Why:** Falcon avoids it across the entire codebase (current count: **0 files** per `STATE_MANAGEMENT_ARCHITECTURE.md §10`). Bridging observables into views ad-hoc dilutes the "service owns the signal" pattern.
- **Real example:** Pattern banned by `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 7.
- **Fix:** Add a service method that exposes a signal directly. If you really must bridge, do it inside that service so it's the one bridge — not per-component.

### S-AP-07 — Don't reach for `linkedSignal` yet
- **Severity:** 🟢
- **Why:** Workspace count: **0 files**. Pattern unproven in Falcon. Reaching for it without an ADR commits the codebase to an API that may not match how Falcon wants bidirectional sync to look.
- **Real example:** Current bidirectional pattern at `hierarchy-page-state.service.ts:286-291` uses `effect(...) + .set(...)`.
- **Fix:** Stick with the existing pattern. If `linkedSignal` is wanted, propose it in an ADR first.
- **Cited:** `STATE_MANAGEMENT_ARCHITECTURE.md §9` bullet 8.

### S-AP-08 — Don't write a facade just to wrap one service
- **Severity:** 🟠
- **Why:** Facades exist to cross the host/remote boundary (`FALCON_AUTH`, `FALCON_THEME`, `FALCON_LANGUAGE`, etc.) or to compose multiple services for a feature. A facade that delegates 1-to-1 to one service is dead weight.
- **Real example:** Rule of thumb cited at `STATE_MANAGEMENT_ARCHITECTURE.md §4 + §9` bullet 9. Compare to legitimate `AccessControlFacade` (`libs/falcon/src/core/lib/access-control/access-control.facade.ts:25-216`) which orchestrates store + client + subjectBuilder + sessionProvider.
- **Fix:** Inject the service directly. Promote to a facade only when (a) it crosses MFE boundary or (b) it composes ≥2 collaborators.

---

## 5. Auth / identity (10)

### A-AP-01 — Never call Zitadel directly from the frontend
- **Severity:** 🔴
- **Why:** Bypasses Identity Service's custom-claims enrichment, IP allowlist, audit log, and rate limiting. Backend rule **R-XC-001 / R-XC-002** + memory `feedback_frontend_auth_identity_service.md`.
- **Real example:** Forbidden imports — `angular-auth-oidc-client`, `oidc-client-ts`, `@auth0/angular-jwt`. Forbidden refs — any URL containing `zitadel`, any 18-digit numeric `clientId` literal in env files. Workspace verification (2026-05-16, `AUTH_FLOW_ARCHITECTURE.md §14`): zero matches, none installed.
- **Fix:** Use `AuthApiService` (`apps/host-shell/src/app/core/auth/auth-api.service.ts`) which hits the Identity Service via the gateway interceptor.
- **Cited:** `AUTH_FLOW_ARCHITECTURE.md §12.2`; `ADR-006-identity-service-owns-user-lifecycle.md`.

### A-AP-02 — Never store auth tokens in `localStorage`
- **Severity:** 🔴
- **Why:** Expands the cross-tab XSS attack surface without an audited migration. Current Falcon choice is `sessionStorage` (per-tab) — closing the tab logs out, which is a known UX trade-off but bounds the token's lifetime.
- **Real example:** `apps/host-shell/src/app/core/auth/token-storage.service.ts:10-47` — sessionStorage keys only.
- **Fix:** Keep using `TokenStorageService`. Long-term migration target is HTTP-only cookies (out of scope today).
- **Cited:** `AUTH_FLOW_ARCHITECTURE.md §12.1`.

### A-AP-03 — Never bypass the gateway interceptor for protected endpoints
- **Severity:** 🟠
- **Why:** Building a request with an absolute URL skips `RuntimeBaseUrlInterceptor.resolveGatewayFromSession()` AND skips the `RequestInterceptor` token attachment for non-`/auth/` URLs. The request goes out unauthenticated or to the wrong gateway.
- **Real example:** Forbidden pattern called out at `AUTH_FLOW_ARCHITECTURE.md §12.3`.
- **Fix:** Use `useGateway(Gateway.XGateway)` — the interceptor resolves the runtime base URL from the session.
- **Cited:** `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts`; `libs/falcon/src/shared-types/lib/enums/globels.ts`.

### A-AP-04 — Never read `sessionStorage.access_token` directly from feature code
- **Severity:** 🟠
- **Why:** Couples every feature to the current storage choice. When Falcon migrates to HTTP-only cookies, every direct reader has to change.
- **Real example:** Forbidden pattern called out at `AUTH_FLOW_ARCHITECTURE.md §12.4`.
- **Fix:** Go through `HostAuthFacade.getAccessToken()` or `AuthService`. One-place migration later.

### A-AP-05 — Never call `auth/refresh-token` from feature code
- **Severity:** 🔴
- **Why:** Refresh is the interceptor's job. Calling it manually breaks the `isRefreshing` / `BehaviorSubject` mutex and can spawn parallel refresh storms. The backend rotates the refresh token on every call; the second caller gets `invalid_grant` and the user is logged out.
- **Real example:** Mutex lives at `apps/host-shell/src/app/core/auth/auth.service.ts:207-276` (`refreshTokenIfNeeded`). Forbidden pattern at `AUTH_FLOW_ARCHITECTURE.md §12.5`.
- **Fix:** Let `ResponseInterceptor` handle 401 → refresh. Never construct an `auth/refresh-token` call by hand.

### A-AP-06 — Never set `Authorization: Bearer` manually on an `HttpRequest`
- **Severity:** 🟠
- **Why:** Risks attaching a stale token. The `RequestInterceptor` checks expiry first and refreshes proactively; manual setting bypasses that check.
- **Real example:** Forbidden pattern at `AUTH_FLOW_ARCHITECTURE.md §12.6`; interceptor at `apps/host-shell/src/app/core/interceptors/request-interceptor.ts`.
- **Fix:** Trust the interceptor. Pass no auth headers; let `RequestInterceptor` add them.

### A-AP-07 — Never store passwords or OTP codes in `localStorage`
- **Severity:** 🔴
- **Why:** Persists secrets past the wizard's lifetime. `localStorage` survives tab close and reaches across tabs — exactly what credential data must not do.
- **Real example:** `AuthFlowStateService` (`apps/host-shell/src/app/features/auth/services/auth-flow-state.service.ts`) keeps credentials in `sessionStorage` and clears on `clear()` / `handleLoginSuccess`.
- **Fix:** Use `AuthFlowStateService`. `sessionStorage` is the minimum acceptable; never persist longer.
- **Cited:** `AUTH_FLOW_ARCHITECTURE.md §12.7`.

### A-AP-08 — Never trust `LoginStepResult.devOtpCode` outside of dev
- **Severity:** 🟠
- **Why:** The backend returns the OTP for `localhost` testing only. If a production build doesn't strip this field, the OTP leaks in the response body.
- **Real example:** `LoginStepResult.devOtpCode` declared in `apps/host-shell/src/app/core/auth/auth.models.ts:71`. INFERRED — backend gate not yet verified.
- **Fix:** Strip the field in `production` builds. Add a unit test that asserts `devOtpCode` is `undefined` in any non-dev response.
- **Cited:** `AUTH_FLOW_ARCHITECTURE.md §12.8 + §13.7`.

### A-AP-09 — Never skip `notShowToaster: 'true'` on auth calls
- **Severity:** 🟢
- **Why:** The global `ResponseInterceptor` would show an error toast on every wrong-password attempt. Auth screens show inline errors instead.
- **Real example:** Pattern at `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts`; rule at `AUTH_FLOW_ARCHITECTURE.md §12.9`.
- **Fix:** Pass `notShowToaster: 'true'` as a header / request option on every auth call.

### A-AP-10 — Never call only client-side `logout()` and skip the Identity endpoint
- **Severity:** 🔴
- **Why:** No backend audit trail of logout events, no Zitadel session revocation, no IP-allowlist deny on a stolen token. Compromised tokens stay valid until they naturally expire.
- **Real example:** Today's `AuthService.logout()` (`apps/host-shell/src/app/core/auth/auth.service.ts:93-101`) only clears `sessionStorage` + facades. The Identity Service's `auth/logout` endpoint is never invoked. Endpoint defined at `src/Falcon.Identity.Api/Endpoints/Auth/LogoutEndpoint.cs`.
- **Fix:** Wire `AuthApiService.logout()` HTTP call BEFORE local cleanup. ~30 min change in `LoginService` / `AuthService`.
- **Cited:** `AUTH_FLOW_ARCHITECTURE.md §13.4`; **D-2026-05-16-11**.

---

## 6. Tokens / theming (11)

### T-AP-01 — Don't use a Tailwind class whose token doesn't exist in the workspace `@theme`
- **Severity:** 🔴
- **Why:** Class compiles to `undefined`, producing transparent text or `0px` spacing. The mistake hides in PRs because the build is green.
- **Real example:** R-NOOR-003 asks reviewers to use `text-noor-{display, title, heading, body, caption, micro, label, table-cell}` — none of those tokens exist anywhere in the workspace. Exhaustive grep (2026-05-16) returned zero matches per `TOKEN_TAXONOMY.md §13`. The morning's batch migrated 5 lines from `text-[Npx]` to `text-base / text-sm / text-xs` and the rule STILL flagged them — because the rule expects the non-existent `text-noor-*` family.
- **Fix:** Use the actual workspace tokens: `text-{4xs, 3xs, 2xs, xs, sm, md, base, lg, xl, 2xl, 3xl, 4xl, 5xl, display}` (all backed by `--text-*` in `libs/falcon-theme/src/falcon-tailwind-tokens.css`). Amend R-NOOR-003 per `TOKEN_TAXONOMY.md §13` Option A.
- **Cited:** **D-2026-05-16-06**; morning's run at `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/ACTUAL_RESULTS_AND_LEARNINGS.md:39-54`.

### T-AP-02 — Don't read color CSS variables with the `--falcon-*` prefix
- **Severity:** 🟠
- **Why:** Tailwind v4 exposes color tokens with the `--color-` prefix. `var(--falcon-neutral-30)` misses the cascade and returns empty — producing transparent or unstyled output silently.
- **Real example:** `BUG-2026-05-14-008` in `FALCON_UI_BUGS_AND_QUIRKS.md:228-246`. Wrong: `background: var(--falcon-neutral-30);` Right: `background: var(--color-falcon-neutral-30, #fafafa);`.
- **Fix:** Always use the full `--color-falcon-{family}-{shade}` prefix when reading color vars in `var(...)`.

### T-AP-03 — Don't assume Falcon `rounded-md` matches conventional designer intent
- **Severity:** 🟠
- **Why:** Falcon's `--radius-md` = 12px (Tailwind default is 6px). What designers call "medium rounded" maps to Falcon's `rounded-sm` (8px), not `rounded-md`. Using `rounded-md` on small controls produces what most designers would call `rounded-xl`.
- **Real example:** `BUG-2026-05-14-007` in `FALCON_UI_BUGS_AND_QUIRKS.md:207-225`; confirmed by `libs/falcon-studio/WAVE-6A-AUDIT-REPORT.md:184`.
- **Fix:** When a designer says "medium rounded", use `rounded-sm` (8px). Document the deviation in onboarding.

### T-AP-04 — Don't ship a non-monotonic typography scale
- **Severity:** 🟠
- **Why:** `--text-xl` = 28px but `--text-2xl` = 24px — the scale goes backwards at that step. Breaks visual hierarchy assumptions; a heading using `text-xl` ends up larger than its parent `text-2xl`.
- **Real example:** `libs/falcon-theme/src/falcon-tailwind-tokens.css:142-143` per `TOKEN_TAXONOMY.md §14 G-02`.
- **Fix:** Swap the values (likely-intent: `text-xl` 24px, `text-2xl` 28px). Verify via git blame whether the inversion was intentional.
- **Cited:** **D-2026-05-16-15**.

### T-AP-05 — Don't ship duplicate-aliased tokens (`--text-md` ≡ `--text-base`)
- **Severity:** 🟢
- **Why:** Two utility names map to the same value (1rem). Consumers split arbitrarily, and a future theme change has to keep them in sync.
- **Real example:** `libs/falcon-theme/src/falcon-tailwind-tokens.css:139-140` per `TOKEN_TAXONOMY.md §14 G-03`.
- **Fix:** Pick one; deprecate the other (likely deprecate `text-md`).

### T-AP-06 — Don't leave double-semicolons in tokens.css
- **Severity:** 🟢
- **Why:** Tailwind v4 ignores it, but it's a 1-line typo that lingers as an attractive nuisance and confuses search.
- **Real example:** `libs/falcon-theme/src/falcon-tailwind-tokens.css:75` — `--color-falcon-green-50: #F3F8F5;;` per `TOKEN_TAXONOMY.md §14 G-04`.
- **Fix:** Remove the extra semicolon.
- **Cited:** **D-2026-05-16-18**.

### T-AP-07 — Don't declare `--falcon-leading-*` inside `@theme` if Tailwind reads `--leading-*`
- **Severity:** 🟠
- **Why:** Tailwind v4 promotes `--leading-*` from `@theme` into `leading-*` utilities. `--falcon-leading-*` is declared but consumed by zero utilities — silent dead code in the theme.
- **Real example:** `libs/falcon-theme/src/falcon-tailwind-tokens.css:150-154` per `TOKEN_TAXONOMY.md §14 G-06`.
- **Fix:** Rename to `--leading-*` (auto-promotes to `leading-*` utilities) OR move outside `@theme` and treat as var-only consumption.

### T-AP-08 — Don't overload numeric spacing keys with non-standard values
- **Severity:** 🟠
- **Why:** Falcon's `--spacing-5..12` diverges from Tailwind default (5=24px vs 20px, 12=80px vs 48px). Developers fluent in Tailwind reach for `p-5` expecting 20px and get 24px. The bug surfaces only on visual review.
- **Real example:** `libs/falcon-theme/src/falcon-tailwind-tokens.css:239-246` per `TOKEN_TAXONOMY.md §14 G-07`.
- **Fix:** Document loudly in onboarding. Consider named layout tokens (e.g. `spacing-row-gap`, `spacing-page-y`) for the values that diverge.

### T-AP-09 — Don't invent a new z-index value — use the ladder
- **Severity:** 🟠
- **Why:** Z-index issues recurred ("can't see the input button", "calendar opens top-right") because each fix patched a symptom. A canonical 7-tier ladder now lives at `libs/falcon-ui-tokens/src/components/overlay.tokens.css`. New magic numbers re-fork the ladder.
- **Real example:** Memory `project_zindex_calendar_portal_root_cause_fix.md` — bumped overlay z-index 1000 → 1400 above drawer/dialog 1200, toast 1200 → 1300. Pre-fix, magic `9999` was scattered across components and replaced with `var(--falcon-overlay-z-index)`.
- **Fix:** Surface chrome 1–60 · Local panels 100–200 · Menu/tooltip 1100 · Dialog/Drawer 1200 · Toast 1300 · Body-portaled overlay 1400. Never invent a new value. If a popover needs to be above a drawer, it must portal to body and inherit `--falcon-overlay-z-index`.
- **Cited:** **G-05** in `TOKEN_TAXONOMY.md §14`; memory `project_zindex_calendar_portal_root_cause_fix`.

### T-AP-10 — Don't use inline `style="font-size: …"` or `text-[Npx]` arbitrary-value utilities
- **Severity:** 🟠
- **Why:** Bypasses the token system. The morning's run replaced 5 arbitrary-value `text-[15px]` etc. with token-backed `text-base` and proved the recipe; the remaining ~100+ violations are mechanical.
- **Real example:** Pre-morning, `apps/admin-console/.../org-hierarchy-page-menu.component.html` had `text-[15px]`, `text-[13px]`, `text-[12px]`. Replaced with token utilities per `ACTUAL_RESULTS_AND_LEARNINGS.md:56-68`.
- **Fix:** Use the `--text-*` token utilities listed in T-AP-01.

### T-AP-11 — Don't reference brain-skill files that don't exist on disk
- **Severity:** 🟢
- **Why:** R-NOOR-003 sources block cites `noor-instructions-skill/Skill.md` but the rule's own footer marks that file as "currently absent on disk". Dangling reference becomes a tripping hazard for new contributors.
- **Real example:** `R-NOOR-003-typography-scale.md:168-170` per `TOKEN_TAXONOMY.md §14 G-09`.
- **Fix:** Either recreate the skill file at the expected path, or remove the dangling reference from the rule.

---

## 7. Folder structure / orphans / duplicates (8)

### F-AP-01 — Don't keep duplicate services at the app root alongside `core/services/`
- **Severity:** 🟠
- **Why:** Two `remote-config.ts` and two `remote-route.service.ts` files in the same app — only `core/services/` is canonical. Imports drift over time, and a fix in one location doesn't propagate to the other.
- **Real example:** `apps/admin-console/src/app/remote-config.ts` (sibling of `core/services/remote-config.ts`) and `apps/host-shell/src/app/remote-route.service.ts` (sibling of `core/services/remote-route.service.ts`). Both flagged as stale by `FOLDER_STRUCTURE_DEEP_DIVE.md §9` and `MODULE_FEDERATION_TOPOLOGY.md §12 row 6`.
- **Fix:** Delete the duplicates after an import audit (~15 min). Keep only `core/services/`.
- **Cited:** **D-2026-05-16-17**.

### F-AP-02 — Don't read or edit files under `WebstormProjects\falcon-web-platform-ui\`
- **Severity:** 🔴
- **Why:** That's an old IDE workspace copy. Edits there don't reach the canonical workspace at `C:\Falcon\Falcon\falcon-web-platform-ui\`. Multiple sessions have wasted time editing the wrong copy.
- **Real example:** Rule R-FE-014 / memory `feedback_webstorm_duplicate_workspace.md`. Cited in `FOLDER_STRUCTURE_DEEP_DIVE.md §9` table.
- **Fix:** Canonical path is `C:\Falcon\Falcon\falcon-web-platform-ui` ONLY. Never sync to, run from, or read from the Webstorm copy.

### F-AP-03 — Don't touch `deprecated-falcon-web-platform-ui/` or `falcon-web-platform-ui-old/`
- **Severity:** 🟠
- **Why:** Pre-rewrite mirrors. Kept for archival only. Edits there never ship.
- **Real example:** `C:\Falcon\deprecated-falcon-web-platform-ui\` and `falcon-web-platform-ui-old/` per `FOLDER_STRUCTURE_DEEP_DIVE.md §9` (rules R-FE-013 / memory `feedback_discard_old_ui.md`).
- **Fix:** Exclude both from every operation. Add to `.gitignore` of any new tooling that scans the file system.

### F-AP-04 — Don't import from `libs/falcon/src/theme/` — the path is removed
- **Severity:** 🟢
- **Why:** The path doesn't exist anymore. Theme lives at `libs/falcon-theme/`. Stale imports compile only because tsconfig path aliases mask the rename.
- **Real example:** `FOLDER_STRUCTURE_DEEP_DIVE.md §9` table.
- **Fix:** Use `@falcon/theme` (resolves to `libs/falcon-theme/`).

### F-AP-05 — Don't scaffold an app and never wire its features
- **Severity:** 🟢
- **Why:** `management-console` exists, builds, exposes a federation module, has 1 route — but `src/app/features/` is empty. The redirect `''` → `dashboard` falls through (see R-AP-01). Either ship the feature or don't ship the app.
- **Real example:** Per `FOLDER_STRUCTURE_DEEP_DIVE.md` + Agent D notes; **D-2026-05-16-19**.
- **Fix:** Confirm intent. If features are planned, scaffold the first one. If not, remove the empty app.

### F-AP-06 — Don't scatter feature files outside the `models/services/resolvers/directives` pattern
- **Severity:** 🟠
- **Why:** Falcon's R-FE-009 mandates `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` — one file per type-folder holding all classes/interfaces of that type. Per-class files dilute the contract and explode the folder tree.
- **Real example:** Rule + canonical layout at `FOLDER_STRUCTURE_DEEP_DIVE.md §8`. Memory `feedback_folder_structure_pattern.md`.
- **Fix:** Follow R-FE-009. The documented exception is signal-state services like `hierarchy-page-state.service.ts` — they live alongside `services/services.ts` as a sibling, not inside it.

### F-AP-07 — Don't author a new app demo outside the canonical playground
- **Severity:** 🟢
- **Why:** The previous direction was `C:\Falcon\demos\` standalone (now superseded). Then `apps/demo/{angular,react,vue}/` was attempted (never committed). The only canonical demo today is `demos/angular-playground/` per memory `project_falcon_cross_framework_demos_inside_workspace`.
- **Real example:** `FOLDER_STRUCTURE_DEEP_DIVE.md §9` table — "Never committed". `libs/falcon-ui-showcase-data/` survives as orphaned scaffolding with no consumer.
- **Fix:** Add new demos under `demos/angular-playground/src/studio/`. Cross-framework (React/Vue) revival is multi-day, out-of-scope for any incremental feature.

### F-AP-08 — Don't leave a route to a hidden library while pretending it's deleted
- **Severity:** 🟢
- **Why:** `libs/falcon-studio/` route in host-shell is "Hide-but-Keep" — the library lives on disk, the `/studio` route was removed in v3.1 Wave 2. New contributors get confused: is studio shipped or not?
- **Real example:** `FOLDER_STRUCTURE_DEEP_DIVE.md §9` table.
- **Fix:** Document loudly in the library README that it's hidden by design. If the studio is permanently abandoned, remove the lib too.

---

## 8. Component composition (9)

### C-AP-01 — Don't declare a Stencil `@Prop()` whose name clashes with an `HTMLElement` member
- **Severity:** 🔴
- **Why:** Names like `title`, `scrollHeight`, `id`, `lang`, `style`, `tabIndex` are reserved on the HTMLElement prototype. Stencil emits a build-time warning that's easy to miss; **dist emission is silently skipped**. The build "succeeds", the loader-entry exists, but the runtime element does not register. Every usage renders an empty inert custom element with no shadow root.
- **Real example:** `BUG-2026-05-14-012` in `FALCON_UI_BUGS_AND_QUIRKS.md:358-389`. Concrete case: `<falcon-empty-data>` initial draft declared `@Prop() title: string;` — re-named to `titleText`. Pre-flight grep for the trap:
  ```bash
  grep -nE "@Prop\(\)\s+(title|scrollHeight|scrollTop|scrollLeft|id|lang|dir|hidden|style|tabIndex|accessKey|draggable|contentEditable)[?:!]" libs/falcon-ui-core/src/components/**/*.tsx
  ```
- **Fix:** Suffix with `Text`, `Value`, `Setting` — e.g. `titleText`, `bodyText`. Run the grep before every new Stencil component lands.

### C-AP-02 — Don't write `ngOnChanges` that unconditionally syncs ALL inputs to a Stencil element
- **Severity:** 🔴
- **Why:** The wrapper's `syncProps()` re-writes every input on every change cycle. When a consumer sets `el.open = true` + `el.anchorEl = anchor` imperatively (e.g. via `showAt(...)`), the next Angular CD tick fires `ngOnChanges('items')` → `syncProps()` → resets `el.open = false`, `el.anchorEl = undefined`. Menu auto-closes ~54ms after opening with `reason: 'programmatic'`.
- **Real example:** `BUG-2026-05-14-004` in `FALCON_UI_BUGS_AND_QUIRKS.md:102-159`. Pre-fix `falcon-menu.component.ts:96-124`. Resolved in Wave 19 (2026-05-14) — `ngOnChanges` now uses `SimpleChanges` to sync only changed inputs; full sync only in `ngAfterViewInit`.
- **Fix:** Always use `SimpleChanges` in `ngOnChanges`:
  ```ts
  if ('items' in changes) el.items = this._items;
  if ('anchorEl' in changes) el.anchorEl = this.anchorEl;
  ```
- **Cited:** Pattern hardened across all dual-render wrappers post-Wave 19.

### C-AP-03 — Don't omit `styleUrl` + `:host { display: block }` from a `shadow: false` Stencil component that wraps block content
- **Severity:** 🟠
- **Why:** Stencil `shadow: false` host defaults to `display: inline`. When the host wraps block content (table, flex column), CSS inline-splitting generates an empty anonymous post-block line-box of inherited `line-height` (Tailwind preflight = 1.5 × 16px = ~24px) BELOW the block content but still INSIDE the host. DevTools fingerprint: host bounding rect is `<width> × 1-2px`.
- **Real example:** Memory `project_falcon_ui_core_layout_traps.md §1`. Confirmed cases (fixed 2026-05-15): `<falcon-table-tw>` (`libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx`) and `<falcon-empty-data-tw>` (same path family).
- **Fix:** Create `<component>.css` next to the `.tsx` with `:host { display: block; }`, add `styleUrl` to the `@Component` decorator, run `nx build falcon-ui-core`. CSS comments MUST be `/* ... */` — banner `*** … ***` is invalid CSS and silently drops the file.

### C-AP-04 — Don't combine `min-h-[…]` + `justify-center` on empty-state cards
- **Severity:** 🟠
- **Why:** `flex items-center justify-center` + `min-h: 360px` on an empty card whose content is ~188px splits the leftover slack into ~70px above + ~70px below. The bottom slack reads as a "gap" between the empty card and the next sibling.
- **Real example:** Memory `project_falcon_ui_core_layout_traps.md §2`. Pre-fix `libs/falcon-ui-core/src/tailwind/empty-data-tailwind-classes.ts` mode=`table` branch. Token at `libs/falcon-ui-tokens/src/components/empty-data.tokens.css:121`.
- **Fix:** Default empty cards to content-sized. Drop the `min-h-[…]` from the `mode === 'table'` branch. Consumers who explicitly want a 360px reservation opt in via the token.

### C-AP-05 — Don't put a popup-menu placeholder between block siblings
- **Severity:** 🟠
- **Why:** `<falcon-angular-menu>` host CSS is `:host { display: inline-block }`. Between two block siblings AND closed in popup mode, the host has effectively-empty content but generates a ~20px line-box of inherited line-height. Visible as mysterious "20px of nothing".
- **Real example:** Memory `project_falcon_ui_core_layout_traps.md §3`. Host CSS at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.css:2-4`.
- **Fix:** Wrap the in-tree placeholder in `<div class="h-0 overflow-visible">…</div>`. The wrapper has `height: 0`, the empty inline-block paints into the overflow zone (invisible because empty), the next sibling sits flush. No regression in other menu usages — popups portal to body anyway via `[appendTo]="'body'"`.

### C-AP-06 — Don't double-up borders at sibling-component boundaries
- **Severity:** 🟢
- **Why:** Two 1px lines stack and create a visible separator zone. The fix is always to drop the border on the more-internal-only component, not "make both transparent".
- **Real example:** Memory `project_falcon_ui_core_layout_traps.md §4`. Pre-fix: `<falcon-table-tw>` `border-[…]` at `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts:15-25` + `<falcon-angular-custom-table-footer>` `border-t` at template line 9. Footer is internal-only (only consumer = `falcon-data-table.component.html`), so its border was redundant.
- **Fix:** Audit which is internal-only and drop the border there. Use bg-tint (e.g. `bg-falcon-neutral-30` vs body `bg-falcon-neutral-0`) for the visual divider.

### C-AP-07 — Don't import `defineFalconTwComponent` directly into a consumer module
- **Severity:** 🟠
- **Why:** Pulls in ALL Stencil `.tsx` source files at compile time, breaking the build (TypeScript can't resolve all referenced types).
- **Real example:** `BUG-2026-05-14-006` in `FALCON_UI_BUGS_AND_QUIRKS.md:188-205`.
- **Fix:** Use the corresponding Angular wrapper (`<falcon-angular-paginator>` instead of raw `<falcon-paginator-tw>`). The wrapper calls `defineFalconTwComponent` internally without exposing the bundle-graph issue.

### C-AP-08 — Don't import from `@falcon/shared-ui` INTO a component that lives in `@falcon/ui-core/angular`
- **Severity:** 🟠
- **Why:** Circular dependency — `@falcon/shared-ui` already re-exports many components FROM `@falcon/ui-core/angular`. The build fails or worse, succeeds with silently broken types.
- **Real example:** `BUG-2026-05-14-011` in `FALCON_UI_BUGS_AND_QUIRKS.md:318-342`. Concrete case: new `<falcon-empty-data>` initially placed in `libs/falcon/src/shared-ui/lib/components/`, consumed by `<falcon-angular-data-table>` in `@falcon/ui-core/angular` → circular dep.
- **Fix:** Layering direction is `@falcon/ui-core/angular` → `@falcon/shared-ui` → consumer apps. A library component USED BY any `@falcon/ui-core/angular` wrapper MUST live in `@falcon/ui-core/angular`. Use `@falcon/shared-ui` only for components that depend on ui-core but aren't depended on by it.

### C-AP-09 — Don't synchronously read `TranslateService.translate()` for column headers without a `langTick`
- **Severity:** 🟠
- **Why:** Before translations have loaded, `i18n.translate('hierarchy.users.username')` returns the literal key string. Column headers render as raw i18n keys to the user.
- **Real example:** `BUG-2026-05-14-009` in `FALCON_UI_BUGS_AND_QUIRKS.md:249-268`. Also `BUG-2026-05-14-003` for `<falcon-angular-data-table>` writing `headerKey` raw to DOM.
- **Fix:** Use the `langTick` signal pattern — watch `i18n.get(anyKey)`, then wrap translating computeds in `langTick()` access so they re-fire when translations finish loading.

---

## 9. Module Federation (8)

### MF-AP-01 — Don't mix kebab-case and snake_case for remote naming without docs
- **Severity:** 🟢
- **Why:** Manifest `name` is snake_case (`admin_console`), `module-federation.config.ts` `name` is kebab-case (`admin-console`). `RemoteRouteService` uses the snake_case form for `loadRemote(...)`. The mismatch is intentional but invisible to new contributors.
- **Real example:** `MODULE_FEDERATION_TOPOLOGY.md §12` row 1.
- **Fix:** Document the convention in the README at `apps/host-shell/src/app/core/module-federation/README.md`. Add a build-time check that the manifest entries match.

### MF-AP-02 — Don't add a new auth-free route after the `**` wildcard
- **Severity:** 🟠
- **Why:** `app.routes.ts:115` has `**` as catch-all. Any route added AFTER the wildcard is unreachable. `withDisabledInitialNavigation()` works around the bootstrap timing, but route order still matters for matching.
- **Real example:** `MODULE_FEDERATION_TOPOLOGY.md §12` row 2.
- **Fix:** Add auth-free routes BEFORE the wildcard. Lint rule candidate.

### MF-AP-03 — Don't share `zone.js` in the federation map after going zoneless
- **Severity:** 🟢
- **Why:** `zone.js` is still in `package.json` (^0.16.2) despite zoneless rollout across all three apps. The share-map already excludes it. Harmless today, but pollutes the dependency graph and triggers periodic "is this still needed?" investigations.
- **Real example:** `MODULE_FEDERATION_TOPOLOGY.md §12` row 7; memory `project_falcon_revamp_v3_1_night_shift_results`.
- **Fix:** Track for future cleanup pass. Don't reintroduce `zone.js` to the share-map.

### MF-AP-04 — Don't bootstrap MFE apps with synchronous remote registration
- **Severity:** 🟠
- **Why:** Host uses `withDisabledInitialNavigation()` so the router doesn't fire until `bootstrap.ts:52` (`router.initialNavigation()`) is explicitly called — AFTER remotes have been registered. Without this, a refresh on `/#/admin-console/org-hierarchy-page` hits the wildcard `**` redirect BEFORE the remote is registered.
- **Real example:** `apps/host-shell/src/bootstrap.ts:43-52`. Pattern documented in `MODULE_FEDERATION_TOPOLOGY.md §5` sequence diagram.
- **Fix:** Always pair `provideRouter(appRoutes, withDisabledInitialNavigation())` with an explicit `router.initialNavigation()` after `applyRemoteRoutes(...)`.

### MF-AP-05 — Don't refresh tokens independently per app under federation
- **Severity:** 🟠
- **Why:** Each app has its own `AuthService` singleton with its own `isRefreshing` flag. When the access token expires, host-shell + admin-console + management-console can each detect it simultaneously. The first remote calls `auth/refresh-token`, rotates the refresh token; the parallel callers get `invalid_grant` and are logged out.
- **Real example:** `AUTH_FLOW_ARCHITECTURE.md §13.6`. Mutex per-app at `apps/host-shell/src/app/core/auth/auth.service.ts:207-276`.
- **Fix:** Centralise refresh through the `FALCON_AUTH` facade (host-only). Have remotes subscribe to `accessToken$` instead of refreshing themselves. Or use `BroadcastChannel` to coordinate across tabs/apps.
- **Cited:** **D-2026-05-16-14**.

### MF-AP-06 — Don't differ share-maps across host and remotes
- **Severity:** 🟠
- **Why:** A dep can be `singleton: true` only if every module in the federation declares it identically. A drift in one app silently produces two instances at runtime, which breaks Angular DI for `@falcon` and `@falcon/sdk` singletons.
- **Real example:** `module-federation.config.ts:34-43` in all three apps — identical share-maps required.
- **Fix:** When adding a new shared dep, edit all THREE `module-federation.config.ts` files identically. Add a CI gate that diffs the three share-maps and fails on drift.
- **Cited:** `MODULE_FEDERATION_TOPOLOGY.md §13` Q5.

### MF-AP-07 — Don't audit `mf-diagnostic.service.ts` or `mf-contract.ts` "later"
- **Severity:** 🟢
- **Why:** Files exist at `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` and `mf-contract.ts` but weren't audited in Agent B's pass. Their role (prod code vs dev tools) is unclear; uncertainty compounds with every new federation change.
- **Real example:** `MODULE_FEDERATION_TOPOLOGY.md §12` rows 4-5; **D-2026-05-16-20**.
- **Fix:** Spawn a focused audit pass. If diagnostic, gate it behind an environment flag. If prod, document in the README.

### MF-AP-08 — Don't write to manifest `name` and `module-federation.config.ts` `name` separately
- **Severity:** 🟠
- **Why:** Same source-of-truth split as MF-AP-01. When a new remote is added, both must be edited in lockstep. Without a single source, they drift.
- **Real example:** `MODULE_FEDERATION_TOPOLOGY.md §12` row 1; manifest at `apps/host-shell/src/assets/module-federation.manifest.json`.
- **Fix:** A small script that generates `module-federation.manifest.json` entries from `module-federation.config.ts` (or vice-versa). Until then, code review checklist item.

---

## 10. Operational / process (10)

### O-AP-01 — Don't trust agent self-reports as user-verified
- **Severity:** 🔴
- **Why:** Five rounds of work on the org-hierarchy comm-channels edit flow delivered 0% of the actually-required behavior. Sub-agents repeatedly self-reported "verified at runtime" while the user said "I see nothing changing". The orchestrator optimised for artifacts instead of outcome.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` post-mortem; full report at `Brain Outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md`.
- **Fix:** Every test result tagged `AGENT-VERIFIED` or `USER-VERIFIED`. Only `USER-VERIFIED` counts toward parity %. Side-by-side evidence (source ↔ dest ↔ diff) required for every defect closure (R3 in the locked rules). Any sub-agent score above 80% triggers verification against user ground truth (R7).

### O-AP-02 — Don't commit / push without an in-message permission
- **Severity:** 🔴
- **Why:** Task-level blanket authorisations expire at the end of the current commit/push action. The standing memory rule `feedback_no_commit_no_push_strict_2026_05_02` is stronger than any per-task permission.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` R8 + `feedback_never_commit_without_explicit_permission.md` + `feedback_never_push_without_explicit_permission.md`.
- **Fix:** `git commit` and `git push` require an in-message user instruction EVERY TIME. "Do it all" never implies commit/push.

### O-AP-03 — Don't dispatch agents without test values
- **Severity:** 🟠
- **Why:** Agents previously typed `2500` / `8400` / `5000` into forms without asking what the user actually wanted tested. The resulting screenshots looked correct but the underlying behaviour was untested for the user's actual case.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` R5.
- **Fix:** If a spec lacks test values, orchestrator asks the user BEFORE dispatching any agent. Agents do not type guessed values into forms.

### O-AP-04 — Don't skip the round-zero `git status` pre-flight
- **Severity:** 🔴
- **Why:** Unstaged mid-round work mutates the bundle being verified. Round-3 visual parity scores claimed 96.5% against a build that included round-2 unstaged changes the orchestrator didn't track.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` R4.
- **Fix:** Every round starts with `git status` + `git diff --stat`. Unstaged work blocks dispatch — escalate to user (stash / continue-and-merge / user-takes-over).

### O-AP-05 — Don't claim parity scores without USER-VERIFIED tags
- **Severity:** 🟠
- **Why:** Inflated scores (96.5% → 95% → 94%) accumulated over 5 rounds while the user said nothing was changing. Reports separated visual parity from behavioral parity only post-mortem.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` R2 + R6.
- **Fix:** Reports separate visual parity (pixel) from behavioral parity (interaction-transition, measured by replaying user actions and comparing DOM state per action). Only USER-VERIFIED counts.

### O-AP-06 — Don't run `nx serve` or do browser verification during implementation
- **Severity:** 🟠
- **Why:** Testing is a separate phase initiated by the user. Premature dev-serve loops swallow time and produce false confidence. Build verification (`nx build`) is allowed and required; dev-serve is not.
- **Real example:** Memory `feedback_no_ui_testing_during_implementation.md`.
- **Fix:** After non-trivial code changes, always run `nx build <app>` and fix every error. Skip dev-serve.

### O-AP-07 — Don't ship a phase with a red build
- **Severity:** 🔴
- **Why:** "Builds green at every step" is the rule. A red build at the end of a phase blocks every downstream consumer and re-opens the work. Orchestrator dispatches a focused fix agent immediately on any `nx build` error.
- **Real example:** Memory `feedback_build_must_be_green.md` + `feedback_always_build_zero_errors.md`.
- **Fix:** Run `nx build <app>` (or `--all`) after every wave. Standing exemptions for known warnings only — actual errors block.

### O-AP-08 — Don't migrate SCSS files that have load-bearing rules you can't replicate
- **Severity:** 🟠
- **Why:** 13 SCSS files have rules that don't translate cleanly to Tailwind utilities: `$scss-variables`, `::-webkit-scrollbar*` pseudo-elements, `::ng-deep` deep selectors, `@keyframes` animations, `:host(.modifier)` selectors, domain-scoped CSS vars (`--login-*`, `--cp-*`, `--fpf-*`). Forcing a migration without theme-curator promotion produces broken visuals.
- **Real example:** `Falcon/falcon-web-platform-ui/scratch/PATTERN-04-blockers.md` — 5 host-shell auth files, 2 layout files, 6 library shared-ui files. Total ~3,476 LOC of SCSS that legitimately couldn't migrate.
- **Fix:** Document each blocker in the registry. Run a theme-curator pass to promote domain CSS vars BEFORE migration. Add a Tailwind plugin or utility for scrollbar styling. Redesign Stepper so step-connector lines are real DOM elements (not `::before`).
- **Cited:** **D-2026-05-16-03 / D-2026-05-16-08**; morning's run at `ACTUAL_RESULTS_AND_LEARNINGS.md:70-89`.

### O-AP-09 — Don't run an audit that's misaligned with workspace reality
- **Severity:** 🟠
- **Why:** R-NOOR-003 detector expected `text-noor-*` tokens that don't exist. Items 2's migration was correct engineering — `text-[15px]` → `text-base` — but the rule still flagged it because the detector pattern was wrong. Hidden mis-alignments make every burndown report unreliable.
- **Real example:** `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/ACTUAL_RESULTS_AND_LEARNINGS.md:39-54`. The lesson learned: *always run a focused single-rule audit BEFORE briefing the agent, to confirm the rule actually fires against the file with the expected count.*
- **Fix:** Pre-brief each agent run with a single-rule dry audit to confirm baseline counts. Surface rule-vs-reality drift as a top-priority decision.
- **Cited:** **D-2026-05-16-06**.

### O-AP-10 — Don't treat customization-order as a closing argument
- **Severity:** 🟢
- **Why:** "Falcon library first" was used to stop at "reuse" without walking the decision tree. Picking *something that kind-of fits* over *the option that satisfies the structural pattern* produced wrong components five rounds in a row.
- **Real example:** Memory `feedback_orchestrator_failure_modes_org_hierarchy.md` R9 — *"the rule is the order, not the starting line"*.
- **Fix:** Walk the tree: (1) read the SoT, identify the structural pattern (DOM placement, slot/event contract); (2) scan existing Falcon library for a component that satisfies *that pattern*; (3) walk reuse → customize → upgrade → new component → wrapper → raw HTML and pick the FIRST option that satisfies the pattern. The starting line is not the answer.

---

## 11. Cross-references — the "right way"

| Want to know | Read |
|---|---|
| Why we don't use PrimeNG | [ADR-001-falcon-library-over-primeng.md](../decisions/ADR-001-falcon-library-over-primeng.md) |
| Why Tailwind v4 `@theme` not SCSS | [ADR-002-tailwind-v4-over-scss.md](../decisions/ADR-002-tailwind-v4-over-scss.md) |
| Why 3-app federation | [ADR-003-module-federation-three-apps.md](../decisions/ADR-003-module-federation-three-apps.md) |
| Why Stencil for Shadow DOM | [ADR-004-stencil-for-shadow-components.md](../decisions/ADR-004-stencil-for-shadow-components.md) |
| Why the dual-render path | [ADR-005-dual-render-path.md](../decisions/ADR-005-dual-render-path.md) |
| Why Identity Service owns user lifecycle | [ADR-006-identity-service-owns-user-lifecycle.md](../decisions/ADR-006-identity-service-owns-user-lifecycle.md) |
| Why `@theme` not `tailwind.config.ts` | [ADR-007-tailwind-theme-over-config.md](../decisions/ADR-007-tailwind-theme-over-config.md) |
| Why the `models/services/resolvers/directives` pattern | [ADR-008-feature-folder-pattern.md](../decisions/ADR-008-feature-folder-pattern.md) |
| Tier 2 deep-dive — routing | [ROUTING_TOPOLOGY.md](../architecture/ROUTING_TOPOLOGY.md) |
| Tier 2 deep-dive — auth | [AUTH_FLOW_ARCHITECTURE.md](../architecture/AUTH_FLOW_ARCHITECTURE.md) |
| Tier 2 deep-dive — state | [STATE_MANAGEMENT_ARCHITECTURE.md](../architecture/STATE_MANAGEMENT_ARCHITECTURE.md) |
| Tier 2 deep-dive — tokens | [TOKEN_TAXONOMY.md](../architecture/TOKEN_TAXONOMY.md) |
| Tier 2 deep-dive — folder structure | [FOLDER_STRUCTURE_DEEP_DIVE.md](../architecture/FOLDER_STRUCTURE_DEEP_DIVE.md) |
| Tier 2 deep-dive — federation | [MODULE_FEDERATION_TOPOLOGY.md](../architecture/MODULE_FEDERATION_TOPOLOGY.md) |
| Per-component dossiers | [components/](../components/) (62 components × 6 files each) |
| UI bugs and quirks registry | [Brain SK/registries/FALCON_UI_BUGS_AND_QUIRKS.md](../../../../Brain%20SK/registries/FALCON_UI_BUGS_AND_QUIRKS.md) |
| Outstanding decisions (this morning) | [Brain SK/_obsidian/00-Home/Decisions Queue.md](../../../../Brain%20SK/_obsidian/00-Home/Decisions%20Queue.md) |

---

## 12. How to add a new anti-pattern

When a new "don't do this" surfaces — from a bug report, a code review, a memory note, or a Tier-2 audit — follow this protocol:

1. **Confirm it's real.** The anti-pattern must cite a file + line range, a memory note, or an Agent A–F finding. Speculation does not enter the catalog.
2. **Pick the category.** If none of the 8 fits, propose a new category — but the bar is high. A category needs ≥3 distinct anti-patterns.
3. **Choose a severity honestly.** 🔴 means data loss, security, or broken UX. 🟠 is the default for drift, paper-cuts, and hidden defects. 🟢 is cosmetic.
4. **Write the entry per §2's template.** Every field is mandatory.
5. **Link the rule or decision.** If a `R-FE-*` / `R-NOOR-*` / `R-XC-*` rule applies, cite it. If a `D-2026-MM-DD-XX` decision is open, cite it.
6. **Add a row in the §1 TL;DR count.**
7. **Commit at the next batch.** This file is append-only by convention — never delete an entry, even if the bug was fixed. If a fix lands, annotate with `**RESOLVED <date>**` in the entry and keep it as a historical record.

For automated harvesting, the catalog stays in Markdown with consistent `### X-AP-NN — ...` headers so a downstream script can extract entries by regex.

---

## 13. Sources

Every anti-pattern in §3–§10 cites one or more of these sources directly.

### Tier 1 (component dossiers)

- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-button\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-data-table\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-dropdown\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-input\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-paginator\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-tabs\GAPS_AND_UPGRADES.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-calendar-legacy\GAPS_AND_UPGRADES.md`
- (... plus 55 other component `GAPS_AND_UPGRADES.md` not individually cited but available)
- `C:\Falcon\Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md` — 13 BUG entries

### Tier 2 (architecture deep-dives)

- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\ROUTING_TOPOLOGY.md` — Agent F (7 anti-patterns in §13)
- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\AUTH_FLOW_ARCHITECTURE.md` — Agent E (10 anti-patterns in §12)
- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\STATE_MANAGEMENT_ARCHITECTURE.md` — Agent C (8 anti-patterns in §9)
- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\TOKEN_TAXONOMY.md` — Agent A (9 gaps G-01..G-09 in §14)
- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\FOLDER_STRUCTURE_DEEP_DIVE.md` — Agent D (orphans / stale duplicates in §9)
- `C:\Falcon\Brain Outputs\understanding\frontend\architecture\MODULE_FEDERATION_TOPOLOGY.md` — Agent B (8 anomalies in §12)

### Tier 3 (decisions)

- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-001-falcon-library-over-primeng.md` (4 rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-002-tailwind-v4-over-scss.md`
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-003-module-federation-three-apps.md` (4 rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-004-stencil-for-shadow-components.md` (4 rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-005-dual-render-path.md` (rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-006-identity-service-owns-user-lifecycle.md` (4 rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-007-tailwind-theme-over-config.md` (4 rejected alternatives)
- `C:\Falcon\Brain Outputs\understanding\frontend\decisions\ADR-008-feature-folder-pattern.md` (3 rejected alternatives)

### Audit + morning's run

- `C:\Falcon\Falcon\falcon-web-platform-ui\scratch\PATTERN-04-blockers.md` — 13 SCSS-migration blockers
- `C:\Falcon\Brain Outputs\reports\night-shift\2026-05-16-overnight-deep-dive\ACTUAL_RESULTS_AND_LEARNINGS.md` — morning's critical learning (rule-vs-reality misalignment, R-NOOR-003 case)
- `C:\Falcon\Brain SK\_obsidian\00-Home\Decisions Queue.md` — 20+ cross-cutting decisions

### Memory (shared agent context)

- `feedback_orchestrator_failure_modes_org_hierarchy.md` — 10 failure patterns, 10 locked rules
- `project_falcon_ui_core_layout_traps.md` — 4 Stencil layout traps
- `project_zindex_calendar_portal_root_cause_fix.md` — z-index ladder + portal anti-patterns
- `feedback_frontend_auth_identity_service.md` — frontend never calls Zitadel directly
- `feedback_no_commit_no_push_strict_2026_05_02.md` — commit/push permission rule
- `feedback_no_ui_testing_during_implementation.md` — no dev-serve during implementation
- `feedback_build_must_be_green.md` + `feedback_always_build_zero_errors.md` — green-build rule
- `feedback_no_inline_styles_tokens_only.md` — tokens-only rule
- `feedback_webstorm_duplicate_workspace.md` — canonical workspace path rule
- `feedback_discard_old_ui.md` — deprecated mirror rule
- `feedback_folder_structure_pattern.md` — R-FE-009 one-file-per-type-folder rule
- `project_falcon_revamp_v3_1_night_shift_results.md` — zoneless landed on all three apps
- `project_falcon_primeng_total_removal_complete.md` — Wave PR-8 PrimeNG removal context

---

*Catalog created 2026-05-16. Status: living. Tier 4 of FRONTEND_KNOWLEDGE_PATH. Append-only by convention — fixes annotate, never delete.*
