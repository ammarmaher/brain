---
type: state-architecture
purpose: signal-vs-service-vs-facade-doctrine
generatedAt: 2026-05-16
source: scan across apps + libs + memory
generator: Tier 2 of FRONTEND_KNOWLEDGE_PATH (Agent C)
---

# State Management Architecture

The permanent answer to **"should I use a signal, a service, or a facade?"** for any Falcon frontend task.

---

## 1. TL;DR doctrine

**Default is signals.** Local view state, derived state, and feature page state all live in `signal()` + `computed()` + `effect()`. Cross-component / cross-feature state lives in `@Injectable({ providedIn: 'root' })` services that expose signals (read) and methods (write). Cross-app / federated state — anything a remote MFE must consume — lives behind a **facade** in `apps/host-shell/falcon-facades/`, accessed via `InjectionToken` from `@falcon/sdk`. RxJS is allowed at API boundaries (HTTP, `takeUntilDestroyed`, `toObservable`/`combineLatest` for trigger composition) and inside facades that bridge to remotes via `BehaviorSubject` — never as the primary container for app state. **NgRx is NOT used and will not be added.** The whole platform has roughly 30 `computed()` + 29 `effect()` call sites against 12 `BehaviorSubject` occurrences (mostly facades + auth refresh queue) and zero `@ngrx/*` imports.

---

## 2. The 4 primitives

| Primitive | When to use | Example file in Falcon |
| --- | --- | --- |
| `signal<T>(initial)` | Local component state, page-scoped state, simple shared state inside a service | `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts:83` (`langTick`), `:85` (`addClientOpen`), `:101` (`tree`); `apps/host-shell/src/app/core/auth/auth.service.ts:52` (`_isAuthenticated`); `libs/falcon/src/core/lib/access-control/access-control.store.ts:9` (`decisions`) |
| `computed<T>(() => …)` | Pure derived state, no side effects, recomputes only when read deps change | `hierarchy-page-state.service.ts:102` (`treeRoot`), `:109` (`treeNodes`), `:124` (`selectedNode`), `:128` (`selectedNodeId`), `:132` (`isRootSelected`), `:136` (`visibleTabs`), `:143` (`canAddClient`), `:167` (`infoDossier`), `:192` (`effectiveNodeId`), `:207` (`userColumns`) |
| `linkedSignal<T>(…)` | Bidirectional sync (would replace ad-hoc `effect` + `set`) | **Not used in the Falcon codebase as of 2026-05-16.** Repo-wide search for `linkedSignal` returns zero hits in app/lib code. Reserved for future migration of `effect`-driven sync blocks like `hierarchy-page-state.service.ts:286-291` (tree ↔ chart selection) |
| `effect(() => …)` | Side effects that depend on signals — reset state on selection change, propagate to non-signal sinks, drive logging, etc. Must NOT mutate the signals it reads | `hierarchy-page-state.service.ts:286` (sync tree → chart selection), `:293` (close info panel on node change), `:297` (clear edit-mode + draft when info closes), `:299` (reset active tab when not visible), `:304` (reset page-number on node change); `libs/falcon/src/core/lib/access-control/access-control.facade.ts:42-53` (reset PES cache on session fingerprint change — RxJS form because session is a `BehaviorSubject`) |

**Falcon-specific note** — interop is asymmetric:
- `toObservable(signal)` is in use exactly once: `hierarchy-page-state.service.ts:259-263` to feed a `combineLatest` trigger that fans into `switchMap` for HTTP — a legitimate bridge.
- `toSignal(observable)` is **not used anywhere** in app/lib code. Patterns that pull observable values into views go through services that expose signals, or use `async` pipe directly in templates.

---

## 3. Services pattern (`providedIn: 'root'`)

The platform has **61** files with `providedIn: 'root'` services — the dominant pattern for cross-component state. The doctrine:

### When to make a service vs. a signal-only state
- **Component-local state** → `signal()` on the component itself.
- **State two or more sibling components must share, scoped to one page** → page-scoped `@Injectable()` (no `providedIn`) registered in the page component's `providers: [...]`. Reference: `HierarchyPageStateService` — `hierarchy-page-state.service.ts:71-72` decorator is `@Injectable()` with no `providedIn`, line 2 comment makes the rule explicit: *"Page-scoped via providers: [HierarchyPageStateService]; never providedIn root."*
- **State shared across pages or across remotes that live in the same app** → `@Injectable({ providedIn: 'root' })`. Reference: `libs/falcon/src/core/lib/services/session-provider.service.ts:36-39` (`SessionProvider`), `libs/falcon/src/core/lib/access-control/access-control.store.ts:5-8` (`AccessControlStore`), `apps/host-shell/src/app/core/auth/auth.service.ts:14-17` (`AuthService`).
- **State that must cross the host ↔ remote boundary** → facade (see §4).

### Service file layout
Per `feedback_folder_structure_pattern.md` (R-FE-009): every feature folder holds a single `services/services.ts` file containing every `@Injectable` for that feature.

Reference: `apps/admin-console/src/app/features/org-hierarchy-page/services/services.ts:52-53` — `HierarchyService` is a `providedIn: 'root'` service that owns mock tree state via `private readonly treeSignal = signal<ClientNode>(MOCK_TREE)` (line 57), exposes a thunk reader `currentTree = (): ClientNode => this.treeSignal()` (line 59), and mutates via observable side-effects inside `getTree()` / `loadNodeChildren()` (`services.ts:77, :98`). HTTP is RxJS; state is a signal — this is the canonical hybrid.

The same folder additionally holds `hierarchy-page-state.service.ts` because Wave-level practice splits *pure HTTP/data access* (in `services.ts`) from *view-state orchestration* (in `<feature>-state.service.ts`).

### Reading vs writing
- **Expose state as readonly signals** — see `AuthService` line 53: `public isAuthenticated = this._isAuthenticated.asReadonly()` after a private `signal()` on line 52. Writes go through methods.
- **`AccessControlStore`** (`access-control.store.ts`) is the cleanest minimal example — a `providedIn: 'root'` service whose entire state is one signal (`decisions`, line 9) and whose API is three readers (`decision`, `can`, `hasKnownDecision`) plus two writers (`setMany`, `reset`).

---

## 4. Facade pattern

**Facades exist in two distinct tiers in Falcon — do not confuse them.**

### Tier A — Cross-app facades (host ↔ remote contract)
**Location:** `apps/host-shell/falcon-facades/` (5 facade files).

**Definition:** A facade implements an interface declared in `libs/sdk/` (e.g. `FalconAuthFacade`, `FalconThemeFacade`, `FalconLanguageFacade`, `FalconNotifierFacade`, `FalconContextFacade`) and is bound to an `InjectionToken` so remote MFEs can `inject(FALCON_*)` without depending on the host's class.

**Naming convention:** `Host<Concern>Facade` for host implementations, `Falcon<Concern>Facade` for the interface in the SDK.

**Wiring:**
1. Tokens declared at `libs/sdk/src/tokens/falcon-facades.tokens.ts:20-38` (`FALCON_AUTH`, `FALCON_THEME`, `FALCON_LANGUAGE`, `FALCON_NOTIFIER`, `FALCON_CONTEXT` — one `InjectionToken<T>` per concern).
2. `provideFalconFacades({...})` at `libs/sdk/src/facades/provide-falcon-facades.ts:26-34` wraps `bindToken()` calls into a single `makeEnvironmentProviders`.
3. Host wires implementations at `apps/host-shell/src/app/app.config.ts:57-62`:
   ```ts
   provideFalconFacades({
     auth: HostAuthFacade,
     theme: HostThemeFacade,
     language: HostLanguageFacade,
     notifier: HostNotifierFacade,
     context: HostContextFacade,
   })
   ```
4. Consumers `inject<FalconAuthFacade>(FALCON_AUTH)` — see `auth.service.ts:20`, `translate.service.ts:16`.

**Cross-app facades carry state via `BehaviorSubject` on purpose.** The boundary is RxJS because:
- Remote MFEs are framework-isolated at build time. A signal is an Angular runtime primitive; a `BehaviorSubject` exposes a plain `Observable` shape that remotes can subscribe to regardless of how their own Angular tree is bootstrapped.
- The host owns the writer (`setLanguage`, `setTheme`, `emmitSubjects`); remotes are read-only.

Real examples:
- `host-auth.facade.ts:7-10` — `accessTokenSubject` + `idTokenSubject`, exposed as `accessToken$` / `idToken$`. Host writes via `emmitSubjects()` (line 32), called from `auth.service.ts:120, :241` after login success and token refresh.
- `host-theme.facade.ts:5-29` — `BehaviorSubject<FalconTheme>` seeded from `localStorage`, `setTheme()` writes to `localStorage`, emits, and applies the DOM `data-theme` attribute.
- `host-language.facade.ts:6-26` — same shape for language; persists to `localStorage`, emits, `TranslateService` consumes via `languageFacade.language$.subscribe(...)` at `translate.service.ts:39-44`.
- `host-context.facade.ts:6-23` — tenant/user/env context for remotes.
- `host-notifier.facade.ts:5-23` — no state; pure imperative API (toast dispatch from any remote).

### Tier B — Feature facades (in-app orchestration)
**Location:** library code. Single existing example: `libs/falcon/src/core/lib/access-control/access-control.facade.ts:25-216`.

**Definition:** Orchestrates **two or more lower-level services** behind a single `@Injectable({ providedIn: 'root' })`. The `AccessControlFacade` coordinates `AccessControlStore` (signal-backed decision cache), `AccessControlClient` (HTTP), `CurrentSubjectBuilder` (subject-claim assembly), and `SessionProvider` (session fingerprint), and exposes a small surface: `can(query)`, `decision(query)`, `resolveFlags(...)`, `ensure(...)`, `reset()`.

Use this pattern when:
- A feature needs to compose multiple existing services into one ergonomic API for consumers (`access-control.facade.ts:56-83`).
- Caching / de-duplication / in-flight request coalescing must live above the data-access layer (the `inFlight` Map at `access-control.facade.ts:30`).
- Multiple consumers (guards: `shell-access.guard.ts:40, :109`, `admin-console.guard.ts:15`; layout: `layout.component.ts:57`; shared component: `organization-hierarchy-tree.component.ts:128`) need an identical entry point.

**Do not write a facade just to wrap one service** — the rule of thumb is two-or-more services orchestrated, OR a host/remote contract boundary.

---

## 5. RxJS rules

RxJS is **allowed** in the following narrow situations:

1. **HTTP boundaries** — every `HttpClient` call returns `Observable<T>`; consume with `.pipe(...).subscribe()` or `firstValueFrom()`. Example: `node.service.ts:23-28`, `services.ts:61-82` (`HierarchyService.getTree`).
2. **Cross-app facades** — `BehaviorSubject` is the only viable container that crosses the host/remote runtime boundary (see §4 Tier A).
3. **Trigger composition** — when multiple signals must drive an HTTP request, bridging via `toObservable(signal)` + `combineLatest` + `switchMap` is the cleanest expression. Example: `hierarchy-page-state.service.ts:259-277` — page-number / page-size / node-id all `toObservable`'d, combined, then `switchMap` to `hierarchy.getUsers(...)`, write results back into signals.
4. **Refresh-token queueing** — `auth.service.ts:49` uses a `BehaviorSubject<string | null>` as a one-shot queue so concurrent HTTP callers can replay against a single in-flight refresh (`auth.service.ts:268-275`).
5. **`takeUntilDestroyed`** — the canonical teardown pattern; replaces `ngOnDestroy` subscriptions. Used in `auth.service.ts` (refresh), `hierarchy-page-state.service.ts:271, :283, :387` etc., `translate.service.ts:40`.
6. **Translate streams** — i18n is naturally observable (HTTP load + language switches); `TranslateService` keeps an internal `BehaviorSubject<TranslationObject>` (`translate.service.ts:23`).

RxJS is **forbidden** for:

- **Local view state** — use `signal()`.
- **Derived state** — use `computed()`.
- **Side effects driven by state** — use `effect()`.
- **Shared in-app state across components** — use a service exposing signals.
- **Long-lived feature state** — never `BehaviorSubject` in a `providedIn: 'root'` service when a signal would do (the auth refresh queue is the rare exception because it's a *replay buffer*, not a state container).

---

## 6. No-NgRx rationale

The codebase has **zero `@ngrx/*` imports** in app or lib code, and `@ngrx/store`, `@ngrx/effects`, `@ngrx/signals` are absent from `package.json`. The platform deliberately stays NgRx-free for three reasons:

1. **Signals already provide the reactive substrate.** A signal is a smaller, faster, zoneless-compatible primitive than a Store action/reducer pipeline. `computed()` covers selectors; `effect()` covers side-effects; a `providedIn: 'root'` service covers the "single source of truth" pattern.
2. **The platform isn't deeply nested.** Falcon has roughly 5 apps + ~40 libs, but state hot-spots are local (auth, session, PES decisions, page-scoped feature state). None of these need time-travel debugging, action replay, or the action/reducer indirection NgRx pays for.
3. **Federation locks the contract at the facade layer, not the store layer.** Adding NgRx would either (a) force every remote to import the same `Store` instance — which breaks MFE isolation — or (b) duplicate stores per remote, defeating the centralization. The host/remote contract is **already** stable via `InjectionToken` + facade; NgRx would add a parallel system without replacing facades.

If complex orchestration emerges in future, `linkedSignal` (Angular 19+) and a hand-rolled signal-store class are the next steps before reaching for any third-party state library.

---

## 7. Auth state (special case)

Auth is the most-coupled state in the platform and uses **all four primitives at once**:

### Where it lives
- **`AuthService`** (`apps/host-shell/src/app/core/auth/auth.service.ts:14-298`) — `providedIn: 'root'`. Owns:
  - `_isAuthenticated = signal<boolean>(false)` (line 52) — exposed read-only on line 53.
  - `refreshTokenSubject: BehaviorSubject<string | null>` (line 49) — the refresh-queue replay buffer.
  - The session-expiry `setTimeout` running outside Angular zone (`auth.service.ts:174-178`).
- **`TokenStorageService`** (`apps/host-shell/src/app/core/auth/token-storage.service.ts`) — `localStorage` / `sessionStorage` adapter.
- **`SessionProvider`** (`libs/falcon/src/core/lib/services/session-provider.service.ts:36-337`) — `providedIn: 'root'`. Two `BehaviorSubject`s (session, node) seeded from `localStorage`, JWT-decoded `setFromToken()` updates the session, `setNode()` updates the org node. Note: BehaviorSubject (not signal) because `AccessControlFacade` subscribes via `session$` (line 42) to invalidate its cache on session change — a fingerprint-diff pipeline that's RxJS-shaped today.
- **`HostAuthFacade`** (`apps/host-shell/falcon-facades/host-auth.facade.ts:6-36`) — the cross-app contract. Remotes consume tokens here via `accessToken$` / `idToken$`.
- **`AuthFlowStateService`** (`apps/host-shell/src/app/features/auth/services/auth-flow-state.service.ts:41-120`) — `providedIn: 'root'`. Transient login-flow state (credentials, sessionId, OTP config) persisted in `sessionStorage`. No signals, no RxJS — pure synchronous storage adapter because the flow is screen-by-screen, not reactive.

### Who reads / who writes
- **Writer:** `AuthService` exclusively. Login (`handleLoginSuccess`, line 107), logout (line 93), refresh (line 207) all funnel through this one service.
- **Readers:** guards (read `tokenStorage.hasValidAccessToken()` synchronously), HTTP interceptors (read tokens for `Authorization` headers), components (subscribe to `isAuthenticated` signal), remotes (subscribe to `HostAuthFacade.accessToken$`).

### How it propagates to remotes
`AuthService.handleLoginSuccess()` → `this.authFacad.emmitSubjects()` (line 120) → `HostAuthFacade.emmitSubjects()` re-reads `sessionStorage` and pushes the new tokens onto `accessTokenSubject` + `idTokenSubject` → every remote that has subscribed to `accessToken$` receives the new token on its next interceptor call.

This is why auth tokens live in `sessionStorage` (not just in an in-memory signal): the storage is the SoT, the facade `BehaviorSubject` is just a notification channel.

---

## 8. Cross-app state (federation)

The host/remote split uses Module Federation. **No state is shared by import.** Instead:

1. **Host declares the facade interface** in `libs/sdk` (`FalconAuthFacade`, `FalconThemeFacade`, …).
2. **Host binds the implementation** at `app.config.ts` via `provideFalconFacades({...})` (`app.config.ts:57-62`).
3. **The `InjectionToken` is the wire** — `FALCON_AUTH` etc. are stable strings (`falcon-facades.tokens.ts:11-17`), so remote modules built independently can `inject(FALCON_AUTH)` against the host's runtime DI container.
4. **State synchronization is one-way via `BehaviorSubject`** — host writes, remotes subscribe. Bidirectional state would re-introduce coupling; instead, remotes call host-exposed methods on the facade (e.g. `HostLanguageFacade.setLanguage(lang)`) and let the resulting emit propagate back.

The single in-app facade (`AccessControlFacade`, `libs/falcon/src/core/lib/access-control/access-control.facade.ts`) is in a `libs/` library so it's import-shared between host and remotes that consume `@falcon` — but the underlying state (`AccessControlStore.decisions`, a signal) is still per-injector. The `SessionProvider` subscription at `access-control.facade.ts:42-53` rebuilds the store when the user changes, including when a remote MFE triggers a re-auth.

---

## 9. Anti-patterns (what NOT to do)

- **Do NOT use `BehaviorSubject` when the state never crosses the host/remote boundary.** Use a signal. Past noise patterns (memory: `feedback_no_inline_styles_tokens_only.md`) and current grep show 12 `BehaviorSubject` files total — almost all are facades or genuine HTTP/refresh buffers. New code that adds a 13th without crossing a facade boundary is wrong.
- **Do NOT put shared state on a component when two or more consumers need it.** Promote to a page-scoped state service (`@Injectable()` + page `providers: [...]`).
- **Do NOT use `providedIn: 'root'` for page state.** It survives navigation and leaks across pages. `HierarchyPageStateService` line 2 comment is the explicit rule: *"never providedIn root"* for page state.
- **Do NOT add NgRx.** See §6.
- **Do NOT mix `setTimeout` with state changes carelessly under zoneless.** All three apps are zoneless (memory: `project_falcon_revamp_v3_1_night_shift_results.md`). `setTimeout` callbacks run outside the zone and must mark state changes explicitly. Reference for the right pattern: `auth.service.ts:174-178` wraps the expiry timer in `ngZone.runOutsideAngular(...)` then re-enters via `ngZone.run(() => this.logout())`. The wrong pattern — mutating signals from a bare `setTimeout` without `queueMicrotask` or zone hop — can desynchronize CD ticks.
- **Do NOT mutate a signal inside the `effect()` that reads it.** Use a separate signal, or restructure as a `computed`. Effects that violate this throw at runtime.
- **Do NOT `toSignal(observable)` casually.** Falcon avoids it across the entire codebase — pulling observable state into views should go through a service that owns a signal, not an ad-hoc bridge per component.
- **Do NOT use `linkedSignal` yet** — it's not in any production file. Reach for it only after proposing a pattern in an ADR; current ad-hoc bidirectional sync is `effect(...) + .set(...)` (e.g. `hierarchy-page-state.service.ts:286-291`).
- **Do NOT write a facade just to wrap one service.** See §4 rule of thumb.

---

## 10. Sources of truth

All paths are absolute. Line ranges cited above are reproduced here for quick navigation.

### Signals / computed / effect (in-app)
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\services\hierarchy-page-state.service.ts:71-606` — canonical page-scoped state service
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\services\services.ts:52-103` — feature data-access service with signal-backed tree
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\auth\auth.service.ts:14-298` — auth: signals + BehaviorSubject + zone-aware setTimeout
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\access-control.store.ts:5-44` — minimal signal-only store

### Services (`providedIn: 'root'`)
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\services\session-provider.service.ts:36-337` — session SoT
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\services\node.service.ts:14-29` — minimal HTTP service
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\language\lib\services\translate.service.ts:11-49` — i18n consumer of FALCON_LANGUAGE facade
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\services\auth-flow-state.service.ts:41-120` — pure sessionStorage adapter (no reactivity)

### Cross-app facades
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\falcon-facades\host-auth.facade.ts` (36 lines)
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\falcon-facades\host-theme.facade.ts` (60 lines)
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\falcon-facades\host-language.facade.ts` (26 lines)
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\falcon-facades\host-context.facade.ts` (23 lines)
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\falcon-facades\host-notifier.facade.ts` (23 lines)
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\sdk\src\tokens\falcon-facades.tokens.ts:11-38` — InjectionTokens
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\sdk\src\facades\provide-falcon-facades.ts:13-34` — wiring helper
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\app.config.ts:57-62` — host binding

### In-app feature facade
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\access-control.facade.ts:25-216` — orchestrator over store + client + subjectBuilder + sessionProvider
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\access-control.store.ts:5-44` — paired signal store
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\shell-access.guard.ts:40,109` — guard consumers
- `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\guards\admin-console.guard.ts:15` — guard consumer
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\layout.component.ts:57` — layout consumer
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\shared-components\organization-hierarchy-tree\organization-hierarchy-tree.component.ts:128` — shared component consumer

### Memory cross-references
- `feedback_folder_structure_pattern.md` — `services/services.ts` one-file-per-type-folder rule
- `project_falcon_revamp_v3_1_night_shift_results.md` — zoneless mode landed on all three apps
- `feedback_frontend_auth_identity_service.md` — auth never calls Zitadel directly; goes through Identity Service
- `STATE_AND_SIGNAL_PATTERNS.md` (sibling doc in this folder) — deeper drill into page-scoped state service mechanics

### Repo-wide counts (verified `2026-05-16`)
| Probe | Files (apps + libs, excl. node_modules) |
| --- | --- |
| `signal(` | 11 with the bare form, ~30+ with parameterized `signal<T>(` |
| `computed(` | 30 |
| `effect(` | 29 |
| `providedIn: 'root'` | 61 |
| `BehaviorSubject` | 12 |
| `class *Facade` | 11 (5 host facades + 1 in-app + 5 mock/test fallback providers + Stencil .d.ts noise excluded) |
| `linkedSignal` | 0 |
| `toSignal(` | 0 |
| `toObservable(` | 1 (`hierarchy-page-state.service.ts:259-263`) |
| `@ngrx/*` | 0 |

### Angular runtime
- `C:\Falcon\Falcon\falcon-web-platform-ui\package.json` — `"@angular/core": "21.2.9"` (zoneless via `provideZonelessChangeDetection()` in each `app.config.ts`)
