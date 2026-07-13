# @falcon/core — SURFACE (public API / exports)

> Complete inventory of every exported guard, service, token, type, and the cross-referenced interceptors. Signatures verified against source.

## Import

```ts
import {
  // services
  SessionProvider, RouteAccessService, NodeService,
  AccessControlStore, AccessControlClient, AccessControlFacade, CurrentSubjectBuilder,
  // guards + token
  SHELL_CORE_ACCESS, shellPrimeAccessGuard, shellAccessGuard, shellAccessMatchGuard,
  adminConsoleGuard, managementConsoleGuard, adminOrganizationHierarchyGuard,
  // types
  UserSession, NavItemAuth,
  PesSubject, PesAuthorizeResource, PesAuthorizeResourcesRequest, PesAuthorizeResourcesResponse, AccessDecisionEntry,
} from '@falcon'; // (barrel; not '@falcon/core' — the public entry is '@falcon')
```

[CODE] `libs/falcon/src/index.ts:21` `export * from './core'`. The internal package path is `@falcon/core` (`libs/falcon/src/core/index.ts`), but app code imports from `@falcon`.

---

## 1. Functional route guards (6 functions, 1 token)

All guards are **functional** (`CanActivateFn`/`CanMatchFn`), use `inject()`, return `boolean | UrlTree | Promise<…> | Observable<…>`. Zoneless-safe.

| Export | Kind | Signature | Gates | PES query / check |
|---|---|---|---|---|
| `SHELL_CORE_ACCESS` | `InjectionToken<readonly AccessQuery[]>` | token | — | Configured list of queries `shellPrimeAccessGuard` preloads. Provided by host-shell. [CODE] `shell-access.guard.ts:15` |
| `shellPrimeAccessGuard` | `CanActivateFn` | `async () => true \| UrlTree` | The protected shell (host-shell `LayoutComponent`). Runs once on shell entry. | Reads `SHELL_CORE_ACCESS` (optional, default `[]`), `await facade.ensure(dedupeAccessQueries([...coreAccess]))`. Returns `true` on success; on **thrown** error → `UrlTree([APP_ROUTES.ERROR])`. Does NOT itself check `can()` — it only *preloads*. [CODE] `shell-access.guard.ts:36-50` |
| `shellAccessGuard` | `CanActivateFn` | `async (route) => boolean \| UrlTree` | Any route with `data.access`. | `resolveActivateQueries(route)` from `route.data['access']` → `evaluateQueries`. [CODE] `shell-access.guard.ts:52-56` |
| `shellAccessMatchGuard` | `CanMatchFn` | `async (route, segments) => boolean \| UrlTree` | Lazy `canMatch` routes with `data.access`. | `resolveMatchQueries(route, segments)` → `evaluateQueries`. [CODE] `shell-access.guard.ts:58-62` |
| `adminConsoleGuard` | `CanActivateFn` | `async () => true \| UrlTree` | The whole admin-console remote. | `FalconAccess.adminConsole.enter()` = `{action:'view', resource:'app.admin-console'}`; `ensure` then `can` → `true` else `UrlTree([UNAUTHORIZED])`; throw → `UrlTree([ERROR])`. [CODE] `guards/admin-console.guard.ts:14-27` |
| `managementConsoleGuard` | `CanActivateFn` | `async () => true \| UrlTree` | The whole management-console remote. | `FalconAccess.managementConsole.enter()` = `{action:'view', resource:'app.management-console'}`; same pattern as admin. [CODE] `guards/management-console.guard.ts:14-27` |
| `adminOrganizationHierarchyGuard` | `CanActivateFn` ⚠️ **@deprecated** | `(route, state) => boolean \| UrlTree \| Observable<boolean\|UrlTree>` | Legacy admin org-hierarchy routes. | **No PES** — checks `session.userType === USER_TYPE_STRINGS.FALCON_USER ('1')`; sync if session loaded, else `session$.pipe(take(1), map(...))`. Unauthorized → `routeAccessService.getUnauthorizedRedirect()` (`/401`). `@deprecated Use adminConsoleGuard`. [CODE] `guards/admin-organization-hierarchy.guard.ts:18-55` |

### Guard helper internals (private, in `shell-access.guard.ts`)

| Function | Signature | Behavior |
|---|---|---|
| `isVisualTestMode()` | `(): boolean` | `?visual-test=1` URL flag persisted to `sessionStorage('falcon-visual-test')`. **Every** shell-access guard short-circuits to `true` when set. Pixel-diff harness only; forward-only, no production path. [CODE] `shell-access.guard.ts:70-77` |
| `resolveActivateQueries(route)` | `(ActivatedRouteSnapshot): AccessQuery[]` | Reads `route.data['access']`; supports `AccessQuery` \| `readonly AccessQuery[]` \| `(route)=>…`. `dedupeAccessQueries`. [CODE] `:79-87` |
| `resolveMatchQueries(route, segments)` | `(Route, UrlSegment[]): AccessQuery[]` | Same for `CanMatch`; access fn signature `(route, segments)=>…`. [CODE] `:89-97` |
| `evaluateQueries(queries)` | `async (AccessQuery[]): Promise<boolean\|UrlTree>` | Empty → `true`. Else `ensure(queries)` then **`queries.every(q => facade.can(q))`** → `true`, else `UrlTree([UNAUTHORIZED])`; throw → `UrlTree([ERROR])`. [CODE] `:104-120` |

**Decision matrix (shell-access guards):** all queries allow → `true`; any deny/unknown → `/401`; PES call throws → `/error`; visual-test → `true`.

---

## 2. Services / injectables (7 — all `providedIn:'root'`)

### 2.1 `SessionProvider` — JWT → session + node, persisted, streamed

[CODE] `lib/services/session-provider.service.ts`. `@Injectable({providedIn:'root'})`, **constructor-DI free of deps** (constructor only calls `loadSessionFromStorage()`/`loadNodeFromStorage()`). Storage keys: `falcon_user_session`, `falcon_org_node` (**localStorage**, not sessionStorage).

| Member | Signature | Notes |
|---|---|---|
| `session$` | `Observable<UserSession \| null>` | `BehaviorSubject` stream. |
| `node$` | `Observable<OrgHierarchyNode \| null>` | `BehaviorSubject` stream. |
| `get session` | `: UserSession \| null` | Synchronous current value. |
| `get node` | `: OrgHierarchyNode \| null` | Synchronous current value. |
| `setFromToken(accessToken)` | `(string): void` | `jwt_decode<JwtPayload>`; extracts `tenantId`/`userType` from top-level claims, falls back to Zitadel `urn:zitadel:iam:user:metadata` (base64). `subjectId`=`sub`; `nodeId`/`identityUserId` from metadata. **`login` forced `null`** (sub-first authz). `roles`/`departments` init `[]`. Empty/invalid → clears. [CODE] `:89-150` |
| `setNode(node)` | `(OrgHierarchyNode): void` | Stores AS-IS; warns + no-ops on falsy. [CODE] `:64-71` |
| `clearNode()` | `(): void` | Clears node stream + storage. |
| `clear()` | `(): void` | Clears both session + node streams + storage. |
| `get/set storage helpers` | private | `isLocalStorageAvailable()` probe; `normalizeStoredSession()` back-fills new fields on old payloads; `decodeBase64()` (regex-guarded `atob`, returns raw on non-b64); `coerceString`/`coerceNullableString`/`readMetadataValue`. [CODE] `:163-336` |

### 2.2 `RouteAccessService` — coarse user-type→scope authorization (legacy)

[CODE] `lib/services/route-access.service.ts`. Injects `SessionProvider`, `Router`. **Pre-PES** — uses a static `SCOPE_AUTHORIZATION_RULES` map, NOT PES.

| Member | Signature | Notes |
|---|---|---|
| `SCOPE_AUTHORIZATION_RULES` | `Readonly<Record<AppRouteScope, UserTypeString[]>>` private | AdminConsole→`['1']`; ManagementConsole/AccountAdministration/TestDev→`['1','2']`. [CODE] `:34-39` |
| `canAccessPath(path, userType)` | `(string, UserTypeString\|string\|null): boolean` | Path matched to scope via `isPathInScope`; allow if userType in scope's list; **unmatched path → allow (default-open)**. ⚠️ `console.log` on every call (`:48`). [CODE] `:47-64` |
| `canAccessNavItem(item, userType)` | `(NavItemAuth, …): boolean` | `disabled`→false; explicit `requiredUserTypes`→membership; else scope rule; else path rule; else allow. [CODE] `:72-102` |
| `getSafeLink(item, userType)` | `(NavItemAuth, …): string\|null` | Path if authorized + not disabled, else null. [CODE] `:111-124` |
| `canAccessPathForCurrentUser(path)` | `(string): Observable<boolean>` | Sync `of(...)` if session present, else `session$.pipe(take(1), map)`. [CODE] `:132-147` |
| `getUnauthorizedRedirect()` | `(): UrlTree` | `router.createUrlTree([APP_ROUTES.UNAUTHORIZED])` (`/401`). [CODE] `:153-155` |
| `isAdminConsolePath(path)` | `(string): boolean` | `isPathInScope(path, AdminConsole)`. |
| **`NavItemAuth`** (exported interface) | `{ path?; scope?: AppRouteScope; requiredUserTypes?: UserTypeString[]; disabled?: boolean }` | "Avoids circular dependency" with nav model. [CODE] `:11-16` |

### 2.3 `NodeService` — org node fetch

[CODE] `lib/services/node.service.ts`. Injects `HttpClient`. 

| Member | Signature | Notes |
|---|---|---|
| `getNode()` | `(): Observable<ServiceOperationResult<OrgHierarchyNode[]>>` | `http.get('commerce/Node', { ...useGateway() })`. Relative URL → `RuntimeBaseUrlInterceptor` resolves System (Falcon) vs Core (Client) gateway from session. [CODE] `:23-28` |

### 2.4 `AccessControlStore` — signal-backed decision cache

[CODE] `lib/access-control/access-control.store.ts`. `signal<Record<string, AccessDecision>>({})` keyed by `accessKey(query)`.

| Member | Signature | Notes |
|---|---|---|
| `decision(query)` | `(AccessQuery): AccessDecision` | `decisions()[accessKey(q)] ?? 'unknown'`. |
| `can(query)` | `(AccessQuery): boolean` | `decision === 'allow'`. |
| `hasKnownDecision(query)` | `(AccessQuery): boolean` | `decision !== 'unknown'`. |
| `setMany(entries)` | `(AccessDecisionEntry[]): void` | Batched `signal.update` immutably. No-op on empty. |
| `reset()` | `(): void` | `set({})`. |
| `snapshot()` | `(): Record<string, AccessDecision>` | Shallow copy. |

### 2.5 `AccessControlClient` — PES HTTP transport (MF-safe absolute URL)

[CODE] `lib/access-control/access-control.client.ts`. Injects `HttpService`; `SHELL_ENV_CONFIG` (`{optional:true}`).

| Member | Signature | Notes |
|---|---|---|
| `authorizeResources(request)` | `(PesAuthorizeResourcesRequest): Observable<PesAuthorizeResourcesResponse>` | Resolves `baseURLPes` from `envConfig` **OR `getRuntimeConfigFromWindow()`** (MF double-bundling fallback — long source comment `:15-25`). **Throws** with a 3-point diagnostic if `baseURLPes` is unset (refuses to let the relative URL hit the API gateway → guaranteed 404). POSTs to `${baseURLPes}/pes/authorize/resources`. [CODE] `:14-39` |

### 2.6 `CurrentSubjectBuilder` — session → canonical PES subject

[CODE] `lib/access-control/current-subject.builder.ts`. Injects `SessionProvider`.

| Member | Signature | Notes |
|---|---|---|
| `build()` | `(): PesSubject` | **Throws** if no session / unsupported userType / missing login / (account) missing tenantId. `kind` = `buildSystemUserPolicySubject(login)` (system) or `buildAccountUserPolicySubject(login, tenantId)` (account). `login = session.login ?? session.subjectId` (sub-first). `attr: {}`. Departments normalized (trim+dedupe). [CODE] `:16-41` |

### 2.7 `AccessControlFacade` — the orchestrator

[CODE] `lib/access-control/access-control.facade.ts`. Injects `AccessControlStore`, `AccessControlClient`, `CurrentSubjectBuilder`, `SessionProvider`. **Subscribes `session$` in the constructor** to invalidate the cache on session-fingerprint change (no explicit teardown — see AUDIT G3).

| Member | Signature | Notes |
|---|---|---|
| `can(query)` | `(AccessQuery): boolean` | Delegates to store. Synchronous — only valid AFTER `ensure`. |
| `decision(query)` | `(AccessQuery): AccessDecision` | Delegates to store. |
| `ensure(input)` | `async (AccessQuery \| AccessQuery[]): Promise<void>` | Dedupe; skip known; coalesce **in-flight** by `accessKey` (`Map<key,{id,promise}>`); fetch unresolved in ONE batch. [CODE] `:91-127` |
| `resolveFlags(queries)` | `async <TKey>(AccessQueryMap<TKey>): Promise<AccessFlagMap<TKey>>` | `ensure` then build named boolean map; **on any throw → all-false map** (fail-closed). [CODE] `:68-83` |
| `reset()` | `(): void` | `epoch += 1`; clears in-flight + store. [CODE] `:85-89` |
| `private fetchAndStore` | — | Captures `batchEpoch`; **discards stale results** if `epoch` advanced mid-flight; maps response→decisions; cleans in-flight in `finally`. [CODE] `:129-154` |
| `private buildRequest` | — | `sub = subjectBuilder.build()`; each query → `{seqNo, obj:{kind:resource, attr:resolveAccessQueryAttributes(q), ignoreExpression}, actions:[action]}`. [CODE] `:156-169` |
| `private readDecision` | — | Tries `${kind}_${seqNo}` then `${kind}` in `response.results`; boolean→allow/deny; **default `deny`** (fail-closed). [CODE] `:171-185` |
| `private createSessionFingerprint` | — | `stableAccessValue({subjectId, login, tenantId, userType, nodeId, roles.sort(), departments.sort()})`. First emission seeds; later change → `reset()`. [CODE] `:201-215` |

---

## 3. Types (exported)

| Type | Shape | File |
|---|---|---|
| `UserSession` | `{ name, tenantId, userType, locale, email, client_id, subjectId, identityUserId, login, nodeId, roles[], departments[] }` (nullable strings except `tenantId`/`userType`/arrays). `identityUserId` = Falcon Mongo `_id`, distinct from `subjectId` (Zitadel sub). | [CODE] `lib/user-session.interface.ts:4-24` |
| `PesSubject` | `{ kind: string; roles?: string[]; departments?: string[]; attr: Record<string,unknown> }` | [CODE] `access-control.types.ts:3-8` |
| `PesAuthorizeResource` | `{ seqNo: number; obj:{ kind; attr; ignoreExpression:boolean }; actions: string[] }` | `:10-18` |
| `PesAuthorizeResourcesRequest` | `{ sub: PesSubject; resources: PesAuthorizeResource[] }` | `:20-23` |
| `PesAuthorizeResourcesResponse` | `{ results?: Record<string, Record<string, boolean>> }` | `:25-27` |
| `AccessDecisionEntry` | `{ query: AccessQuery; decision: AccessDecision }` | `:29-32` |
| `NavItemAuth` | (see 2.2) | `route-access.service.ts:11-16` |

---

## 4. Cross-referenced contracts (NOT in core — dependencies)

These define the PES vocabulary core consumes; documented here for completeness, owned by shared-types (L04) / shared-data-access (L04).

| Symbol | Owner file | Relevance to core |
|---|---|---|
| `AccessQuery` / `AccessDecision` / `AccessQueryMap` / `AccessFlagMap` | [CODE] `shared-types/lib/models/access-query.models.ts:1-11` | The query/decision primitive every guard + facade method takes. |
| `accessKey(q)` / `dedupeAccessQueries` / `resolveAccessQueryAttributes` / `stableAccessValue` | [CODE] `access-query.models.ts:13-49` | Cache key + dedupe + attr-merge + stable-hash used by Store/Facade. `accessKey` = `action\|resource\|scope\|attrs\|ignoreExpression`. |
| `FalconAccess` | [CODE] `shared-types/lib/constants/falcon-access.registry.ts:3-206` | The central registry of every PES query factory (admin/mgmt/contact-group/user/wallet/microApps). `enter()` factories power the console guards. |
| `buildSystemUserPolicySubject` / `buildAccountUserPolicySubject` / `getAuthorizationUserTypeName` | [CODE] `shared-types/lib/models/policy-subject.models.ts:43-127` | `CurrentSubjectBuilder` uses these. Subject grammar `u:<login>@<system\|tenantId>`. |
| `USER_TYPE_STRINGS` / `UserTypeString` | [CODE] `shared-types/lib/constants/user-type.constants.ts:12-22` | `'1'`=System/Falcon, `'2'`=Account/Client. Used by RouteAccessService + deprecated guard + host-shell `SHELL_CORE_ACCESS` factory. |
| `AppRouteScope` / `APP_ROUTES` / `isPathInScope` | [CODE] `shared-types/lib/constants/route-scope.constants.ts:4-29` | Scope enum + `/401`/`/error` route constants + path matcher. |
| `OrgHierarchyNode` / `ServiceOperationResult` / `Gateway` | shared-types | `SessionProvider`/`NodeService` payload + gateway enum. |
| `HttpService` / `SHELL_ENV_CONFIG` / `getRuntimeConfigFromWindow` / `useGateway` | shared-data-access (L04) | Transport + runtime config used by `AccessControlClient` + `NodeService`. |

## 5. Interceptors (cross-reference — see OVERVIEW §scope clarification)

`RuntimeBaseUrlInterceptor` (L04), `RequestInterceptor` + `ResponseInterceptor` (host-shell app). Signatures all `intercept(req, next): Observable<HttpEvent<unknown>>`. Registration/order: [CODE] `apps/host-shell/src/app/app.config.ts:133-151` (Request → RuntimeBaseUrl → Response). The 400→toast pipeline is `ResponseInterceptor.handleErrorResponse` → `FalconHttpUiDispatcherService.dispatchError` [CODE] `response-interceptor.ts:80-116`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L02). All signatures transcribed from source line-by-line. Cross-referenced shared-types/shared-data-access symbols read at their definition sites. Interceptor section is explicitly cross-reference-only (those files are L04 / app-level, not in `libs/falcon/src/core`).
