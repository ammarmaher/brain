---
type: hub
purpose: master-architecture-view
created: 2026-05-16
updated: 2026-05-16
tier: 2
status: complete
canonical-source: C:\Falcon\Brain Outputs\understanding\frontend\architecture\
---

*** Falcon Frontend Architecture Atlas ***
*** The single hub for how the Falcon frontend is structured ***
*** Tier 2 of FRONTEND_KNOWLEDGE_PATH — ALL 6 DEEP-DIVES SHIPPED ***

# 🏛 Frontend Architecture Atlas

> The single place where you can see **how the Falcon frontend is wired together** — apps, libs, federation, state, auth, routing, theme. Each section links to a deep-dive document; this hub is the index.

## Tier 2 status: ✅ COMPLETE

All 6 deep-dives shipped. Each agent's full report is below; each has a deep-dive doc.

| Agent | Doc | Lines / Size | Commit |
|---|---|---:|---|
| A | [TOKEN_TAXONOMY.md](../../../Brain%20Outputs/understanding/frontend/architecture/TOKEN_TAXONOMY.md) | 647 / 37.5 KB | `f05676c` |
| B | [MODULE_FEDERATION_TOPOLOGY.md](../../../Brain%20Outputs/understanding/frontend/architecture/MODULE_FEDERATION_TOPOLOGY.md) | 690 / 44.4 KB | `92eea06` |
| C | [STATE_MANAGEMENT_ARCHITECTURE.md](../../../Brain%20Outputs/understanding/frontend/architecture/STATE_MANAGEMENT_ARCHITECTURE.md) | 250 / 24.0 KB | `3437e5e` |
| D | [FOLDER_STRUCTURE_DEEP_DIVE.md](../../../Brain%20Outputs/understanding/frontend/architecture/FOLDER_STRUCTURE_DEEP_DIVE.md) | 621 / 38.0 KB | `5cbdee3` |
| E | [AUTH_FLOW_ARCHITECTURE.md](../../../Brain%20Outputs/understanding/frontend/architecture/AUTH_FLOW_ARCHITECTURE.md) | 14 sections / 54.9 KB | (this commit) |
| F | [ROUTING_TOPOLOGY.md](../../../Brain%20Outputs/understanding/frontend/architecture/ROUTING_TOPOLOGY.md) | — / 35.8 KB | `5cbdee3` |

**Total Tier 2 documentation:** ~235 KB of curated architecture knowledge.

---

## 🎨 Theme + Token Taxonomy

**Doc:** [TOKEN_TAXONOMY.md](../../../Brain%20Outputs/understanding/frontend/architecture/TOKEN_TAXONOMY.md)

| Question | Answer |
|---|---|
| Where is the canonical theme? | `libs/falcon-theme/src/falcon-tailwind-tokens.css` — **218 tokens** in the `@theme` block |
| Does `text-noor-*` exist? | **NO.** Zero matches across workspace. R-NOOR-003 expectation is aspirational, not declared. |
| Typography scale | `text-{4xs, 3xs, 2xs, xs, sm, md, base, lg, xl, 2xl, 3xl, 4xl, 5xl, display}` + `text-muted` |
| Color palette families | 76 colors — teal (primary), neutrals, status, accents, brand logos, alpha variants |
| Spacing scale | 31 tokens — numeric + layout-specific (custom `--spacing-5..12` diverges from standard Tailwind) |
| Component-scoped tokens | 47 `*.tokens.css` files (one per component, namespaced like `--falcon-button-*`) |
| Z-index ladder | 7 tokens 1000-1070 (SSOT) + a dual ladder 1100-1400 in `overlay.tokens.css` (gap G-05) |
| Mechanism | Tailwind v4 `@theme {}` block — NOT @config, NOT PostCSS plugins |

**9 gaps surfaced (filed to Decisions Queue):**

- **G-01** `text-noor-*` undeclared → fix R-NOOR-003 (D-2026-05-16-06)
- **G-02** `--text-xl` (28px) > `--text-2xl` (24px) — non-monotonic scale → real bug (D-2026-05-16-09)
- **G-03** `--text-md` and `--text-base` both alias `1rem` (duplicate)
- **G-04** Stray semicolon `#F3F8F5;;` at line 75 → trivial fix (D-2026-05-16-10)
- **G-05** Dual z-index ladder (SSOT vs component-scoped overlay tokens)
- **G-06** `--falcon-leading-*` won't auto-promote (Tailwind v4 reads only `--leading-*`)
- **G-07** `--spacing-5..12` diverges from standard Tailwind scale
- **G-08** String-valued `--falcon-stepper-step-shape: circle`
- **G-09** `noor-instructions-skill/Skill.md` referenced but absent on disk

---

## 🧱 Module Federation Topology

**Doc:** [MODULE_FEDERATION_TOPOLOGY.md](../../../Brain%20Outputs/understanding/frontend/architecture/MODULE_FEDERATION_TOPOLOGY.md)

| Question | Answer |
|---|---|
| Host app | `host-shell` (port 4200) — exposes nothing, owns auth + layout + `window.FalconSDK` |
| Remote apps | `admin-console` (port 4204, exposes `./admin-console`, type `routes`)<br>`management-console` (port 4301, exposes `./management-console`, type `routes`) |
| Inactive manifest slots | `demo-app`, `user-app` at `falconhub.space/remotes/*` (`active: false`) |
| Exposed modules | 2 active routes-arrays + 2 inactive |
| Shared singletons | `@angular/*` (21.2.9 eager strict), `rxjs` (^7.8.1 eager strict), `@falcon`, `@falcon/sdk`, `@falcon/*`, `uuid`, `tslib`, `jwt-decode` |
| NOT shared (kept local) | `@angular/animations` (avoid RUNTIME-006 double-init), `zone.js` (zoneless), `primeng/*` + `primeicons` (Wave PR-8 purge) |
| Manifest naming | webpack uses kebab-case (`admin-console`); manifest `name` uses snake_case (`admin_console`) — intentional but unusual |
| Routes per app | admin-console: 1 + sub-tree · host-shell: 11 + dynamic remote children · management-console: 1 + (empty features) |

**Anomalies (8, all INFO/LOW, no blockers):**
- `adminConsoleGuard` import unused at admin-console/src/app/app.routes.ts:2
- `zone.js` still in package.json despite zoneless rollout (harmless — excluded from share-map)
- `mf-diagnostic.service.ts` + `mf-contract.ts` unaudited (flagged for follow-up)
- Possible dead duplicate `remote-route.service.ts` at app root (cross-reference Agent D)

---

## 🧠 State Management Architecture

**Doc:** [STATE_MANAGEMENT_ARCHITECTURE.md](../../../Brain%20Outputs/understanding/frontend/architecture/STATE_MANAGEMENT_ARCHITECTURE.md)

| Question | Answer |
|---|---|
| Default state primitive | **`signal()`** — Angular 21.2.9 zoneless on all 3 apps |
| `computed()` uses | 30 |
| `effect()` uses | 29 |
| `BehaviorSubject` uses | 12 files — only at facade boundaries + auth refresh queue + i18n |
| NgRx | **0** — not used, not in package.json |
| `linkedSignal()` / `toSignal()` | 0 / 0 (just 1 `toObservable()` in `hierarchy-page-state.service.ts:259-263`) |
| Cross-app facades | 5 — `apps/host-shell/falcon-facades/` (auth, theme, language, notifier, context) bridged via `InjectionToken` (`FALCON_AUTH`, etc.) at `libs/sdk/src/tokens/falcon-facades.tokens.ts` |
| In-app feature facades | 1 — `AccessControlFacade` at `libs/falcon/src/core/lib/access-control/access-control.facade.ts` |
| `providedIn: 'root'` services | 61 |
| Canonical page-state pattern | `HierarchyPageStateService` (606 lines, registered via `providers: [...]` on page component, NEVER `providedIn: 'root'`) — confirms R-FE-009 one-file-per-type-folder rule |

**Doctrine TL;DR:** Default is signals. Services for cross-component state. Facades for feature-level orchestration. RxJS only at API boundaries. No NgRx.

---

## 📂 Folder Structure Deep-Dive

**Doc:** [FOLDER_STRUCTURE_DEEP_DIVE.md](../../../Brain%20Outputs/understanding/frontend/architecture/FOLDER_STRUCTURE_DEEP_DIVE.md)

| Question | Answer |
|---|---|
| `apps/` vs `libs/` | apps = 3 Nx Angular apps (admin-console, host-shell, management-console). libs = 9 shared libraries |
| Inside `libs/falcon-ui-core/` | 94 component folders (Shadow + `-tw` pairs), Angular wrapper layer, tokens, types |
| Inside `libs/falcon/` | 11 app-shared bespoke components (form-field, mobile-number, photo-uploader, multiselect-legacy, etc.) + theme + i18n |
| Other libs | falcon-theme (218 tokens), falcon-i18n, sdk (federation tokens), 4 more |
| TS path aliases | **19 entries** quoted verbatim from `tsconfig.base.json:18-75` |
| Where do new features live? | `apps/<app>/src/app/features/<feature>/` with `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` (R-FE-009) |
| Standalone Angular? | YES — `provideRouter()` everywhere, no `RouterModule.forRoot()` |

**Orphans / dead code surfaced:**
- `management-console/src/app/features/` **EMPTY** — app scaffolded but no features landed
- `libs/falcon-ui-showcase-data/` orphaned (still on disk, no consumer)
- `libs/falcon-studio/` Hide-but-Keep (route removed, exports preserved)
- `apps/demo/{angular,react,vue}/` never built
- Stale duplicates in host-shell: `app/remote-config.ts` + `app/remote-route.service.ts` (siblings of canonical `core/services/` versions)

---

## 🔐 Auth Flow Architecture

**Doc:** [AUTH_FLOW_ARCHITECTURE.md](../../../Brain%20Outputs/understanding/frontend/architecture/AUTH_FLOW_ARCHITECTURE.md)

| Question | Answer |
|---|---|
| Auth provider | **Identity Service** (`auth.falconhub.space/api/`) — fronts Zitadel. R-XC-002 COMPLIANT (zero direct Zitadel calls). |
| Login library | None! Hand-rolled `LoginService` + `AuthApiService`. Only `jwt-decode@^3.1.2`. No `oidc-client-ts`, no `angular-auth-oidc-client`, no `.well-known/openid-configuration` |
| Token storage | **`sessionStorage`** (per-tab) — keys `access_token` / `refresh_token`. NOT localStorage, NOT cookies. UserSession + OrgHierarchyNode are in localStorage (cross-tab). |
| 5 auth flows | 1. First-time login (email+password) · 2. OTP verification · 3. Forgot password (3-step wizard) · 4. First-login change-password · 5. Refresh token (with BehaviorSubject queue + `X-Token-Retried` short-circuit) |
| HTTP interceptors | 3 chained: `RequestInterceptor` → `RuntimeBaseUrlInterceptor` → `ResponseInterceptor` |
| Route guards | 6 — `authGuard`, `shellPrimeAccessGuard`, `shellAccessGuard`, `shellAccessMatchGuard`, `otpGuard`, `changePasswordGuard` |
| Identity endpoints | 9 under `auth/*` — login, verify-otp, resend-otp, forgot-password, forgot-password/set-password, set-password, first-login, refresh-token, logout (all `[AllowAnonymous]`, login/OTP/forgot run `IpAllowlistPreProcessor`) |
| MFA | OTP today (no TOTP/WebAuthn yet). `isMfaRequired` flag unused. |
| Federation token delivery | 3 channels — DI `FALCON_AUTH` singleton, `sessionStorage` direct, `window.FalconSDK` |
| Standalone-remote fallback | `MockAuth` (allows admin-console / management-console to run alone in dev) |

**2 REAL RISKS flagged:**

1. 🔴 **`auth/logout` is NEVER called from the frontend** — purely client-side cleanup; backend audit + Zitadel session revocation does not happen
2. 🟠 **Refresh-token race across host + MF remotes** — each app has its own `AuthService` mutex; first remote to refresh rotates the refresh token, parallel refresh from a second app fails with `invalid_grant`

**Dead code spots:**
- `setPassword` (vs `forgot-password/set-password`) wired but unused
- `id_token` is READ by `HostAuthFacade` but never WRITTEN

---

## 🗺 Routing Topology

**Doc:** [ROUTING_TOPOLOGY.md](../../../Brain%20Outputs/understanding/frontend/architecture/ROUTING_TOPOLOGY.md)

| Question | Answer |
|---|---|
| Standalone vs module | 100% standalone (`provideRouter()` everywhere) |
| Per-app routes | host-shell: 11 top-level + dynamic MF remote children injected at bootstrap · admin-console: 1 + sub-tree · management-console: 1 + (empty) |
| Federation routes | `/admin-console/*` → admin_console (port 4204, `requiredAccess: app.admin-console:view`) · `/management-console/*` → management_console (port 4301, `requiredAccess: app.management-console:view`) |
| Dormant manifest entries | demo-app, user-app (`active: false`) |
| Guards | 9 total (6 used by Auth Flow + 3 specific: adminConsoleGuard, managementConsoleGuard, adminOrganizationHierarchyGuard) |
| Resolvers | **0** — all data fetching is component-side via signals + ngOnInit |
| Bootstrap order | `bootstrap.ts:30-34`: `reloadRemotes()` → `applyRemoteRoutes()` → `router.initialNavigation()`. Gated by `withDisabledInitialNavigation()` to prevent `**` wildcard firing first |

**7 anti-patterns flagged with file:line citations:**

1. 🔴 **Dead redirect targets** — admin redirects `''` → `organization-hierarchy` (doesn't exist), mgmt redirects `''` → `dashboard` (doesn't exist) → both wildcard-bounce loops
2. 🔴 **`adminConsoleGuard` commented out** — direct standalone access at `localhost:4204` is ungated (security)
3. 🟠 Dead static-MF preview routes (4 routes referencing `prime-ng/organization-hierarchy` zombies from Wave PR-8 purge)
4. 🟠 Hardcoded URL slugs in `LayoutComponent` (root cause of prior org-hierarchy bug per memory `feedback_orchestrator_failure_modes_org_hierarchy.md`)
5. 🟡 Wildcard redirects to root, not `/not-found` (NotFoundComponent unreachable)
6. 🟡 Eager-loaded status pages (Unauthorized/NotFound/Error) — should be `loadComponent`
7. 🟡 Zombie prime-ng references left over from PrimeNG removal

---

## 🔥 Cross-cutting issues — collected into Decisions Queue

The Tier 2 deep-dives surfaced **10 cross-cutting issues** that span more than one architecture document. Each is now a decision row:

| Severity | ID | Issue | Source agents |
|---|---|---|---|
| 🔴 high | D-2026-05-16-11 | `auth/logout` never called from frontend → no backend audit / Zitadel revocation | E |
| 🔴 high | D-2026-05-16-12 | `adminConsoleGuard` commented out → `localhost:4204` ungated | F |
| 🔴 high | D-2026-05-16-13 | Dead redirect targets cause wildcard-bounce loops (admin + mgmt) | F |
| 🟠 medium | D-2026-05-16-14 | Refresh-token race across host + MF remotes | E |
| 🟠 medium | D-2026-05-16-15 | G-02 typography scale non-monotonic (`text-xl` 28px > `text-2xl` 24px) | A |
| 🟠 medium | D-2026-05-16-16 | Zombie prime-ng routes from Wave PR-8 purge | F |
| 🟠 medium | D-2026-05-16-17 | Stale duplicate services in host-shell root | D + B |
| 🟢 low | D-2026-05-16-18 | G-04 stray semicolon `#F3F8F5;;` at falcon-tailwind-tokens.css:75 | A |
| 🟢 low | D-2026-05-16-19 | management-console scaffolded but `features/` empty — confirm intent | D |
| 🟢 low | D-2026-05-16-20 | `mf-diagnostic.service.ts` + `mf-contract.ts` unaudited | B |

(Plus carry-overs: D-2026-05-16-06 amend R-NOOR-003, D-2026-05-16-07 commit web-platform-ui edits, D-2026-05-16-08 theme-curator pass for the 13 PATTERN-04 blockers.)

---

## 🎁 What Tier 2 unlocked

After Tier 2, the brain can answer (with sources cited):

✅ *"Does `text-noor-*` exist?"* — NO. Per Token Taxonomy.
✅ *"Should I use a signal or a service for this state?"* — signal first; service if 2+ components need it. Per State Management Architecture.
✅ *"How does login work end-to-end?"* — 5 sequence diagrams in Auth Flow Architecture.
✅ *"Where do new features live?"* — `apps/<app>/src/app/features/<feature>/` with the R-FE-009 type-folder pattern. Per Folder Structure Deep-Dive.
✅ *"How do host-shell and admin-console talk?"* — Module Federation manifest + 3-channel federation bridge. Per Module Federation Topology + Auth Flow.
✅ *"What route serves `/admin-console/users`?"* — admin_console remote (port 4204), gated by `shellAccessMatchGuard`, `requiredAccess: app.admin-console:view`. Per Routing Topology.

Newcomers can now onboard with 6 documents in **2 hours** instead of weeks of code-reading.

---

## How this Atlas evolves

When architecture changes:

1. Update the relevant deep-dive doc under `Brain Outputs/understanding/frontend/architecture/`
2. Mirror to `Brain SK/outputs/understanding/frontend/architecture/`
3. Update this Atlas hub's quick-answer table for that section
4. Commit + push to brain repo

Future Tier 3 — Architecture Decision Records (ADRs) — will live in `Brain Outputs/understanding/frontend/decisions/` and link from this Atlas.

## Related

- [[Component Atlas]] — Tier 1 view of all 62 components
- [[Decisions Queue]] — open decisions including the 10 from Tier 2
- [FRONTEND_KNOWLEDGE_PATH](../../../Brain%20Outputs/understanding/frontend/FRONTEND_KNOWLEDGE_PATH.md) — master roadmap
- [[RULES_INDEX]] — rulebook hub
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #frontend #architecture-atlas #tier-2 #knowledge-graph #complete
