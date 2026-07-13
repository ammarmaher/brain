*** PRD Understanding - Basic Send Application - BUILD_PLAN_DETAILED (multi-wave, function-level) ***

# Basic App — detailed multi-wave build plan (2026-07-07, REVISION 2 same day)

> **REVISION 3 NOTICE (2026-07-07):** the authoritative wave plan is now `REPLAN_INTERNAL_SOT_PARITY.md` (internal in-console placement — FINAL user ruling; audit map; M0/M1 supersede this file's M0). THIS file remains the function-level spec: Part A library L-waves, Part B communication design, Part C F2-F8 function signatures.

> ## REVISION 2 — D-1 FINAL RULING (user, 2026-07-07): INTERNAL application, no new MF remote
> Ammar's correction: the basic app must NOT be an external/standalone application. It is an **internal feature folder inside the existing consoles** (like the admin-console/management-console feature folders); **Module Federation gets NO additional application**. This equals the originally-evidenced Recipe A / D-1a design and restores exact PRD navigation (submenu under `Marketplace & Applications .Mng` — BR-BSA-04/05).
>
> **What changes vs Revision 1:**
> - **Placement:** ONE shared implementation at `libs/falcon/src/shared-features/basic-send/` (alias `@falcon/basic-send`; the `comm-mkt-view` shared-feature precedent — presentational + injected ports, NO HttpClient inside) + **thin page folders in BOTH consoles** (`features/marketplace-applications/pages/basic-send/`: routes, `BsaApi` adapter service, permissions, providers). Chosen over the voice-service duplicate-folders precedent because BSA is too large to maintain twice; the standing rules hold (API services live in the console apps; library code stays presentational).
> - **New Wave M0 (below):** migrate the already-built, runtime-verified F0/F1 screen OUT of `apps/basic-app` INTO the shared feature + console wiring, then REMOVE the standalone remote (manifest entries ×4, sidebar menu[] item, `apps/basic-app/` scaffold, launch entry). The screen code, mock seeds, models, tests and the `basicApp` i18n namespace carry over nearly unchanged.
> - **§B.1 communication:** unchanged conclusions (console remotes already run inside host-shell's injector — host provides auth/HTTP/i18n/theme/toasts); the per-console difference is only the gateway default (admin → SystemGateway, mgmt → CoreGateway), expressed in each console's `BsaApi` adapter.
> - **Routes:** `…/#/admin-console/marketplace-applications/basic-send/…` and `…/#/management-console/marketplace-applications/basic-send/…` replace `/#/basic-app/…` everywhere in Part C.
> - **Everything else stands:** the library L-waves (Part A), the API port + mock-first strategy, all F2-F9 function signatures, W-PES (resources `sys.basic-send`/`acc.basic-send` via the registry factory), W-DARK, and the gates.

## Wave M0 — migrate to internal placement (execute first; small-medium)

1. **Create the shared feature:** `libs/falcon/src/shared-features/basic-send/` with `index.ts` (exports routes-factory + components + ports) + tsconfig.base.json alias `@falcon/basic-send` (mimic `@falcon/comm-mkt-view` :46-48). Move from `apps/basic-app/src/app/features/bsa-home/`: `bsa-home.component.{ts,html}`, `models/bsa.models.ts`, `data/bsa-mock-data.ts`, `__tests__/` — imports unchanged (`@falcon`, `@falcon/ui-core/angular` resolve identically). Keep the `whenDefined` ready-gate until task_e08e9a6d lands (then delete it in the wave that next touches the file).
2. **Define the port here:** `BSA_API` injection token + `BsaApi` interface (Part B.3 list) + `BsaMockApiService` (moves with the feature — it is presentational-safe, no HttpClient).
3. **Admin console wiring** (FE_WORKSPACE_WIRING Recipe A steps 2-3): `apps/admin-console/src/app/features/marketplace-applications/pages/basic-send/` → `basic-send.routes.ts` (children: `'' → BsaHomeComponent` from `@falcon/basic-send`, later `send/whatsapp` etc.), `basic-send.permissions.ts` (denied-baseline, scope `'sys'`), `providers.ts` (`{ provide: BSA_API, useClass: BsaMockApiService }` → later `BsaAdminApiService` over `HttpService` + `useGateway(SystemGateway)`); restructure `marketplace-applications.routes.ts` (currently flat, :12-25) to componentless parent + children exactly like `comm-channels-services.routes.ts:14-53`, child `{ path: 'basic-send', loadChildren: … , data: { breadcrumb: 'Basic App' } }`.
4. **Management console wiring** (Recipe A steps 4-5): mirror folder, scope `'acc'`, CoreGateway adapter; parent keeps `shellAccessGuard` + `data.access` (comms-hub precedent :24-33).
5. **host-shell sidebar** (Recipe A step 6): give BOTH Marketplace & Applications NavItems `children: [{ label: 'Basic App', path: PATH_MARKETPLACE_APPLICATIONS + '/basic-send' }]` (admin precedent :344-350, mgmt :377-383 + `access:` hook); **slug parity route⇄nav is load-bearing** (dead-click trap comment :72).
6. **Remove the standalone remote:** delete the `basic-app` entries from all 4 `module-federation.manifest*.json`; delete `apps/basic-app/`; remove the `falcon-basic-app` launch.json entry; keep the shared `basicApp` i18n namespace (labels unchanged). Nothing else referenced the app (registry check: `npm run list:remotes` must show only the two consoles).
7. **Gates:** `nx build admin-console && nx build management-console` (dev) + both test targets + lint; runtime click-through in BOTH consoles under host-shell (`Marketplace & Applications .Mng → Basic App` → grids render, tab/column swaps, zero console errors); `list:remotes` clean; git diff reviewed (moves, not rewrites).

---

# ⬇ Revision 1 body (placement wording superseded by Revision 2 above; L-waves, communication, F-wave functions, gates all remain in force)

> Requested by Ammar 2026-07-07: one plan, multiple waves, covering (1) **library conversion** — falcon libraries consumed via npm or as compiled files by the new project — and (2) **function-level frontend detail**: how every function is implemented, how all communication works, everything frontend.
> Grounding: `ARCHITECTURE_FRONTEND.md` (screens×components), `ARCHITECTURE_BACKEND.md` §5 (the API surface the FE calls), `FE_LIBRARY_COVERAGE.md` (N1-N10/E1-E8 component backlog), `BE_CONTRACTS.md` (real DTO shapes), `reports/fe-library-npm-audit-2026-07-06/` (library npm-readiness: Plan-1 "Ship it" 65%→95%, checklist-scored), and the SHIPPED state: `apps/basic-app` MF remote on :4303, Waves F0+F1 runtime-verified 2026-07-07.
> Status legend: ✅ done · 🔨 in flight · ⏳ planned. Nothing here commits code; every wave ends at a gate.

---

## Part 0 — Where we stand (inputs to this plan)

- ✅ F0 scaffold + federation (apps/basic-app, :4303, 4 manifests, manifest-menu sidebar, falcon libs as shared eager singletons) — runtime-verified inside host-shell.
- ✅ F1 home grids on mock data (BR-BSA-53/54 columns, 7-status pills, gating, page size 10) — build/test/lint green, zero console errors.
- 🔨 `task_e08e9a6d` (separate session): library fix for the data-table first-paint syncProps hole — L0 gate below depends on it.
- ⏳ Backend `falcon-core-basic-send-svc` unbuilt (B-waves in `IMPLEMENTATION_PLAN.md` / `ARCHITECTURE_BACKEND.md`); FE waves therefore run **mock-first behind a swappable API port** (§B.4) so no F-wave blocks on B-waves.

---

## Part A — Library track (L-waves): the falcon library as an npm package / compiled file

**Goal.** Today `apps/basic-app` consumes the falcon libraries as **workspace TS-path aliases compiled from source** (`@falcon` → `libs/falcon/src/index.ts`, `@falcon/ui-core/*` → lib source; MF shares them as eager singletons with `requiredVersion: false`). The target: the same libraries exist as **versioned, installable packages** (`npm install @falcon/ui-core`) or as **compiled tarballs** (`npm pack` output consumed via `file:`), so the basic app — and any future app or external repo — can take the library as a dependency instead of source.

**Load-bearing constraint (read before executing anything):** while basic-app lives in the SAME monorepo as host-shell, it MUST keep consuming the libraries source-aliased. Under Module Federation the host and every remote share ONE `@falcon`/`@falcon/ui-core` singleton; if basic-app switched to an npm-installed copy while host builds from source, webpack would ship **two different library instances** (double service trees, broken facades — exactly the class-dup failure family we hit with NG0201). Therefore the L-track produces the package **and proves it in an external smoke consumer**, and defines the switch-day recipe for when basic-app (or any app) moves out of the monorepo. This keeps both of Ammar's options real: npm registry (Option A) and compiled file (Option B) — validated without destabilizing the running federation.

### L0 — Library fitness gate (prereq, small)
1. Land the **data-table first-paint fix** (task_e08e9a6d, in flight): wrapper awaits `customElements.whenDefined('falcon-table-tw')` (or the `defineFalconComponentPair` promise) before first `syncProps`, then forces one full (not changed-only) sync; regression spec binds data synchronously at first CD. Exit: the `ready`-gate workaround in `apps/basic-app/.../bsa-home.component.ts` becomes removable (leave removal to the wave that next touches the file).
2. Sweep the **other 68 wrappers** for the same pre-upgrade own-property pattern (same `syncProps` base class → one fix point if centralized; verify menu/tabs/dropdown which also carry object props).
3. Fix the **stored-XSS extension-render path** in the shared table (`falcon-table-tw.tsx:840` `innerHTML={ext.render(row)}` — escape or sanitize): the library is about to become embeddable; this is the "safe to embed" blocker (npm-audit Plan 2 · W2, Small).
4. Gate: `nx run-many -t build,test,lint` green across `falcon-ui-core`, `falcon`, `sdk`; basic-app + both consoles rebuild green.

### L1 — Packaging surface (npm-audit Plan-1 W1-W4, the "convert the library" wave)
1. **Legal gate (W1, Small):** remove `private: true`; add `license` + LICENSE files to `falcon-ui-core`, `falcon-ui-tokens`, `falcon-theme` (+ `-react`, `-vue` if shipped). npm hard-refuses publish otherwise.
2. **Real tarball surface (W2, Large):** the Stencil core already compiles to `dist/components`; the **69 Angular wrappers do not** — compile them via ng-packagr (or Stencil `angularOutputTarget`) into `dist/angular`, then re-point the package `exports` map (`.`, `./angular`, `./tailwind`, `./types`, `./loader`) at `dist/**` instead of `src/**`; add `"sideEffects": false` (except token CSS entries). Acceptance: `npm pack` → install the tarball in a scratch dir → `import { FalconAngularDataTableComponent } from '@falcon/ui-core/angular'` compiles in a clean Angular 21 app.
3. **Dependency hygiene (W3, Medium):** declare `@angular/*` + `rxjs` as `peerDependencies` (semver `^21.2.0`); resolve the unpublished `@falcon/studio/runtime` dependency inside 10 wrapper files — invert it: wrappers consume an injection token (e.g. `FALCON_TABLE_SKELETON_DEFAULTS`) with library-local defaults, and `@falcon/studio/runtime` becomes an OPTIONAL provider package (publish it or keep it internal); reclassify Vue deps as peers.
4. **Split `libs/falcon` (W4, Large):** it has **no package.json at all** and mixes presentational shared-UI with 15 HttpClient services. Extract the publishable presentational part (shared-ui, directives, validation utilities, i18n plumbing) into `@falcon/shared-ui`; the HttpClient services STAY app-side (standing rule: API code lives in apps). `@falcon/sdk` (facade tokens) is already clean — package as `@falcon/sdk`.
5. **Tokens/theme:** `@falcon/ui-tokens` (`index.css` + dark theme) and `falcon-theme` (Tailwind token SSOT + fonts + falcon-icons.css) get exports maps so a consumer does `@import "@falcon/ui-tokens";` — document the 3-line consumption (tokens css → theme css → component import).
6. Gate: `npm pack` succeeds for each package; tarball-content check (`npm publish --dry-run`) lists dist only (no src/spec); scratch-consumer compile passes.

### L2 — Versioning + publish pipeline (npm-audit Plan-1 W5) — Option A and Option B
- **Option A (recommended) — private registry:** Azure Artifacts npm feed (the platform already lives in Azure DevOps). Steps: create feed `falcon-npm`; `.npmrc` scoped `@falcon:registry=https://pkgs.dev.azure.com/<org>/_packaging/falcon-npm/npm/registry/`; auth via pipeline service connection; extend the existing `changeset:publish-dry` into a real `changeset publish` stage in `.azuredevops` on tag; changesets own semver bumps + CHANGELOG. First release: `@falcon/ui-core@1.0.0`, `@falcon/ui-tokens@1.0.0`, `@falcon/shared-ui@0.1.0`, `@falcon/sdk@0.1.0`.
- **Option B — compiled file (no registry):** same L1 outputs, distributed as tarballs: `npm pack` per package in CI → publish `.tgz` as pipeline artifacts → consumer installs `npm i file:./vendor/falcon-ui-core-1.0.0.tgz` (or a git-lfs `vendor/` folder). Zero infrastructure; no semver ranges (exact file pins); good as the interim step or for air-gapped consumers. The plan builds A on top of B: B is literally A minus the registry push.
- Gate: CI produces versioned artifacts on demand; provenance (git SHA) stamped into each package.json `falcon.buildInfo`.

### L3 — Consumption proof + basic-app switch recipe
1. **External smoke consumer:** new tiny repo (`falcon-lib-smoke`, outside the monorepo): `ng new` (Angular 21, zoneless) → install the L2 packages (registry or tarball) → render data-table + tabs + dropdown + status-badge + audio player behind the documented 3-line theming setup → CI job runs its build on every library release. This is the objective "library is injected into npm / taken as a compiled file and works" proof.
2. **basic-app switch recipe (executed ONLY on repo-split day, documented now):** remove `@falcon*` tsconfig path aliases from the extracted repo; `npm i @falcon/ui-core@^1 @falcon/ui-tokens@^1 @falcon/sdk@^0.1`; change `module-federation.config.ts` shared entries from `requiredVersion: false` → `requiredVersion: '^1.0.0', strictVersion: false, singleton: true` (host must consume the SAME published versions — coordinated release); tailwind.css `@source`/`@import` paths flip from `../../../libs/...` to `node_modules/@falcon/...`; i18n assets glob flips to the package's exported i18n folder (or the app owns its i18n copy). Until that day: **no change in basic-app** — same-repo source aliases remain correct by design.
3. Gate: smoke app green in CI + the switch recipe reviewed/stored (this file + `FE_WORKSPACE_WIRING.md` appendix).

### L4 — Docs & coverage floor (npm-audit Plan-1 W6, parallelizable)
Per-component docs for the ~79 undocumented components (the 62-dossier KB is the seed — export dossiers into the package `docs/`), finish the 18 pending token docs, add the spec-per-component floor gate (coverage today ~2.6%). Not a blocker for A/B consumption; it is the "external team never reads Falcon source" bar.

---

## Part B — Communication design (how everything talks — applies to every F-wave)

### B.1 Host ↔ remote (Module Federation runtime)
- **Injector reality (the most important fact):** under the host, basic-app's routes are `loadRemote()`-ed into **host-shell's running application** — components resolve services from the HOST root injector through the shared `@falcon`/`@falcon/sdk` singletons. Consequence: authentication, HTTP interceptors, translate service, theme service, message orchestrator, PES facade — all are the HOST's instances. `apps/basic-app/src/app/app.config.ts` + `mocks/falcon-fallback.providers.ts` matter ONLY for standalone serve on :4303 (dev convenience). Never provide app-level duplicates of shared singletons in route `providers` — that re-creates the double-tree bug family.
- **Contracts consumed via `@falcon/sdk` tokens:** `FALCON_AUTH` (accessToken$ — never read storage directly), `FALCON_CONTEXT` (tenantId, user id/name — the "logged-in user" scope for BR-BSA-52), `FALCON_LANGUAGE` (current lang, en/ar), `FALCON_THEME` (light/dark), `FALCON_NOTIFIER`. Standalone falls back to the mock providers.
- **Toasts/dialogs:** `FalconMessageService.add({severity, summary, life})` → host's `<falcon-toast-adapter>`/message orchestrator renders (basic-app's own adapters mount only standalone). Confirms via `FalconConfirmService` → popup (the confirm-dialog WRAPPER is dormant — do not use it).
- **Navigation:** remote exposes `./basic-app` = `entry.routes.ts` re-exporting `app.routes`; host splices at `/basic-app` with `canMatch: [shellAccessMatchGuard]` reading manifest `requiredAccess` (empty today → open; W-PES closes it). Internal navigation uses RELATIVE router links so paths compose under `/#/basic-app/...`; deep links (`/#/basic-app/send/wa`, `/#/basic-app/TXN-100483`) work because routes, not components, are federated.
- **Runtime config:** `window.FalconRuntimeConfig` (host env) → `provideShellEnvFromWindow` fallback chain → gateway base URLs; never hardcode hosts.
- **i18n:** ONE shared dictionary (`libs/falcon/src/language/i18n/en|ar.json`, `basicApp.*` namespace); host's TranslateService singleton serves the remote; RTL flips via `dir` on documentElement (host authority). Pre-translated strings (grid headers, menu actions) recompute via the `langTick` pattern (subscribe `i18n.get(key)`).
- **Theming:** tokens only (`--color-falcon-*`, `--falcon-*`); dark mode arrives as `.app-dark` on `<html>` (host ThemeService); BSA screens must define dark values for any custom surfaces (SoT has none — flagged design task).

### B.2 Remote ↔ backend (HTTP)
- **Path:** component → store → `BsaApiService` (implements `BsaApi` interface) → `HttpService` relative URL + `useGateway(Gateway.CoreGateway)` → `RuntimeBaseUrlInterceptor` prepends the gateway base → host request-interceptor attaches `Authorization: Bearer` → Core Gateway `/bsa/{**remainder}` (ClientOnly + PerTenant rate limit) → strips prefix, prepends `/api` → `falcon-core-basic-send-svc`. Falcon/admin oversight views ride System Gateway's FalconOnly twin (same relative paths, `useGateway(SystemGateway)`).
- **Envelope + errors:** every response is `ServiceOperationResult<T>`; failures carry `FalconKeys.Error.Bsa*` codes → map to `basicApp.errors.<code>` i18n; field-detailed `BsaMappingIncomplete` renders inline on the mapping grid rows, not as toast.
- **Resilience rules (adopted from the 2026-07-09 voice fix):** landing/list GETs use `NO_TOASTER` context + `retry({count: 2, delay: 700})` → graceful empty-state on outage, no top-bar error; mutations never auto-retry (idempotency instead).
- **Idempotency:** `POST /transactions` + conversation sends carry an `Idempotency-Key` header (uuid per user intent; regenerate on edit).
- **Freshness:** DetailsStore polls `GET /transactions/{id}` every 5s while status = in_progress (stop on terminal status or `document.hidden`); TransactionsStore re-fetches on 15s interval only when a visible row is in_progress; SignalR upgrade path isolated inside the stores (transport swap = one method).
- **Files:** exports download via short-lived pre-signed URL from `GET /exports/{jobId}` → `window.open`; never proxy binaries through the app.

### B.3 Intra-app: stores + ports (testability + mock-first)
- **`BsaApi` interface** (the port; DTOs mirror ARCHITECTURE_BACKEND §5.1): `listTransactions(q)`, `getTransaction(id)`, `listRecipients(id, q)`, `getStats(id)`, `compose(spec)`, `quote(spec)`, `cancel(id)`, `editScheduled(id, spec)`, `deleteScheduled(id)`, `requestExport(id, kind)` / `getExport(jobId)`, `listSenders(channel)`, `listTemplates(channel, cat?, lang?)` / `getTemplate(idOrRef)` / `syncTemplate(id)`, `listContactGroups(scope)`, `channelState()`, `getConversation(recipientResultId)` / `listMessages(convId, page)` / `sendMessage(convId, msg)` / `sendTemplateAfterExpiry(convId, tplSpec)`.
- **Providers:** `{ provide: BSA_API, useClass: environmentMockFlag ? BsaMockApiService : BsaApiService }` — `BsaMockApiService` serves the SoT-mirroring seeds with realistic latency (150-400ms) and scripted status progressions (in_progress ticks) so every F-wave demos end-to-end before B-waves exist; the flag lives in `environment.ts` (`bsaMockApi: true` until B1/B2 land).
- **Stores are signal classes, one per screen** (provided at the route level): state = private `signal`s, view = `computed`, mutations = plain methods; async = method → api → `patchState`-style sets; no NgRx (platform convention).

### B.4 PES & session communication
`basic-app.permissions.ts` per view: denied-baseline flags object + `AccessControlFacade.resolveFlags([basicAppQuery('view'), …])` (fail-closed; resolves via host's PES facade → `POST pes/authorize/resources`, subject `u:<zitadelId>@<tenant>`); flags gate Send/cancel/edit/delete/export/converse buttons AND the guards. Wave W-PES (below) seeds `app.basic-app` + `acc.basic-app` resources and flips the manifest `requiredAccess` on.

---

## Part C — Frontend feature waves (function-level)

Every wave ends with the same **gate**: `nx build basic-app` (dev+prod) + `nx test basic-app` + `nx lint basic-app` green · zero console errors on click-through under host-shell · visual parity vs the React SoT on :4173 (Falcon Eyes when parity matters ≥90%) · en+ar keys in lockstep · standing rules (library-only UI, page size 10, dd-MMM-yyyy).

### ✅ F0 — scaffold + federation (shipped 2026-07-07)
### ✅ F1 — home grids on mock data (shipped 2026-07-07)

### F2 — Send Whatsapp Message (compose) — the dense wave
**Routes:** `send/whatsapp` (guarded by `flags.canSend`); `?from=conversation&recipient=` variant arrives in F7.
**New lib components first (from FE_LIBRARY_COVERAGE):** `falcon-popover` (N1: anchored, flip-aware, outside/scroll close — powers group picker + recipients +N), `falcon-datetime-picker` (N2: calendar + time steppers + CVA; the platform has NO time picker), `falcon-inline-banner` (N7), dropdown pinned-option (E7: "Not mapped" pinned last), checkbox-group chip variant (E4 — used by F5 too).
**Component tree:** `ComposeWhatsappComponent` (3 `falcon-angular-card` columns) → `MessageDetailsPanel` (cascading dropdowns + variables chips + delivery toggle + datetime), `RecipientsPanel` (CG picker popover + `MappingGridComponent` per group + `ManualRecipientsGrid`), `PhonePreviewComponent` (N5 device-frame wrapping the promoted `app-whatsapp-preview` — E6), `SummaryStrip`, `ConfirmSendDialog` (`falcon-angular-dialog` + `falcon-angular-switch` duplicates + quote figures).
**ComposeStore (route-provided) — functions:**
- `setSender(id: string)` — writes `sender`; no cascade effect.
- `setCategory(c)` → clears `language`, `templateId`, `variables`, mapping state (BR-BSA-25 cascade); `setLanguage(l)` → clears `templateId`+downstream.
- `loadTemplates()` — `api.listTemplates('whatsapp', cat, lang)`; options feed the 3rd dropdown; templates arrive pre-filtered Approved+own/shared (C7: list filtered AND send-time guard stays).
- `selectTemplate(id)` — `api.getTemplate(id)` → sets `variables: string[]`, body for preview; resets `groupCfg` var-maps keeping picked columns that still exist; if `template.status !== 'Approved'` → `templateWarning` signal (banner + block).
- `addGroup(g)` — pushes `{groupId, name, count, columns}` + empty `cfg {destinationColumn: null, varMap: {}}`; auto-opens its mapping card; **guard:** `groupsReady()` must be true before the picker enables (BR-BSA-31: finish mapping before adding another).
- `setDestinationColumn(gid, col)` / `mapVariable(gid, v, col)` — move-on-reassign semantics: assigning a column already used by another field clears that field first; `unmap(gid, col)` via the pinned "Not mapped".
- `groupReady(gid) = cfg.destinationColumn && variables.every(v => cfg.varMap[v])`; `groupsReady = all groups ready`.
- `addManual()` — appends `{destination:'', vars:{}}`; blocked when `manual.length >= 3` (BR-BSA-32) or last row incomplete; `updateManual(i, patch)`, `removeManual(i)`.
- `manualValid(i) = isE164(normalize(destination)) && variables.every(v => vars[v]?.trim())` — **enforced in `canSend`** (C3 ruling; validators in `lib/validation/`: `normalizeE164(raw): string|null` strips spaces/dashes, maps 05→+9665 per tenant default CC, rejects <8 digits).
- `recipientCount = Σ groups.count + manual.filter(manualValid).length`; `previewValues()` = first sample row of first group through varMap, else first valid manual row, else `{{var}}` placeholders (BR-BSA-34).
- `canSend = sender && templateId && !templateWarning && (groups.length || validManualCount) && groupsReady && allManualValid && (timing.mode==='immediate' || scheduledAtUtc > now)`.
- `openConfirm()` — `api.quote(spec())` → `{recipients, estimatedCost, currency}` into the dialog (server is the calculator — flat-rate SoT stub is DEAD); `confirm(allowDuplicates)` — `api.compose(spec(allowDuplicates))` with Idempotency-Key → success: toast + `router.navigate(['/basic-app'], {queryParams:{channel:'whatsapp', mode}})` + store reset; `BsaMappingIncomplete` error → inline per-row messages.
- `spec()` serializer → `ComposeTransactionRequest` exactly per backend #2 (groups in ADDED ORDER — BR-BSA-39 depends on array order).
**Tests:** cascade-reset truth table; move-on-reassign; canSend matrix (12 cases incl. C3); E.164 normalizer; spec serializer order.

### F3 — WhatsApp transaction details + cancel
**New lib components:** `falcon-progress-bar` (N3), `falcon-bar-chart` + `falcon-donut-chart` (N4 — SVG, token-colored, no external chart lib; API: `series[{key,label,value,color?}]`, direct labels, an `empty` stub state).
**Routes:** `:txnId` (WA branch).
**DetailsStore:** `load(id)` → parallel `getTransaction` + `getStats` + first `listRecipients(page1)`; `poll()` interval 5s while `status==='in_progress'` (clear on destroy/hidden/terminal); `selectRecipient(i)` drives the side phone preview with that row's resolved variables; `pageRecipients(p, size)`; `cancel()` → confirm popup (race-aware copy per BR-BSA-56) → `api.cancel(id)` → outcome dialog "canceled mid-flight (X sent & charged, Y untouched)" vs "already completed"; `export(kind)` → `requestExport` → poll `getExport(jobId)` (2s, max 60s) → open URL.
**Render:** status banners (N7) incl. live progress (N3 + processed/planned); stats bars incl. **Average Delivery Time** (C13); cost donut by destination + bars by template type (C10); recipients table (7 statuses incl. Failed — C1) with real server paging; per-recipient menu → Conversation (disabled until F7 with tooltip).

### F4 — Scheduled lifecycle (edit + delete + frozen details)
**Routes:** reuse `:txnId` (scheduled variant = frozen stats/zeros per BR-BSA-75/76) + `send/whatsapp?edit={id}` / `send/voice?edit={id}`.
**Functions:** `ComposeStore.hydrateFromTransaction(txn)` — FULL prefill (sender, cascade values, groups+varMaps, manual rows, timing incl. picked datetime, retry config) — the React reference's partial-prefill stub is explicitly NOT ported (C5); `saveEdit()` → `api.editScheduled(id, spec())` (PUT, same TXN id, re-runs quote+confirm dialog per Q-BSA-16 defaults); grid/list `delete(row)` → confirm (exact PRD copy) → `api.deleteScheduled(id)` → row stays with status Deleted (dimmed class on `status==='deleted'`).
**Edge:** edit/delete calls guard on due date server-side; FE surfaces `BsaEditNotAllowed`/`BsaDeleteNotAllowed` as inline banner ("due date passed — recreate instead").

### F5 — Send Voice IVR Message
**New/promoted:** `IvrFlowViewComponent` promoted from `templates-wizard/ivr` into the lib (E5 — read-only canvas + node-tap prompt playback via the existing `falcon-angular-audio-waveform-player`); checkbox chips (E4).
**Delta vs F2 (same ComposeStore, `channel='voice'`):** 2-tier cascade (`setCategory('Dynamic'|'Static')` → templates; no language tier); `retry` slice: `toggleRetry()`, `setRetryStatuses(s⊆{no_answer,busy,cancel,failed})` (default `[no_answer,busy]`), `addAttempt()` (≤3, default wait 10), `setAttemptWait(i, 1..1440)`, `removeAttempt(i)` — **persisted into spec** (SoT dropped it — stub #6); preview pane = IVR canvas fed by `api.getTemplate(id).ivrFlow`; quote passes channel so the server includes expected-call-time (Q-BSA-03 is the server's problem, not the FE's).

### F6 — Voice transaction details
Reuses F3 store with voice shape: stats tiles (IVR completion %, avg duration) + bars (answered/busy/no-answer/failed) + cost by destination/attempt/IVR-type (C10); recipients table adds **Send Date + Message Cost columns (C2)** and **row expansion** (data-table `expandedRowId` — exists) rendering the attempts sub-table (n, status, time, wait, cost); selected row drives IVR canvas + `bsaRecipDesc`-style call description + transcript blocks; recorded-call playback via the audio player fed by `recordingRef` pre-signed URL (fresh design — the SoT modal was orphaned).

### F7 — WhatsApp conversation + 24h window
**New lib components:** `falcon-chat-thread` kit (N6 — the largest: `ChatThread` (virtualized message list, day dividers, in-thread search with highlight + prev/next), `ChatBubble` (kinds: text/image/document/audio/video/location/contacts/interactive/template/reaction — ADDS the 4 kinds the SoT lacked), `ChatTicks`, `ReactionPicker` (N9 emoji), `ReplyQuoteBar`, `Composer` slot), `falcon-countdown` (N10 — takes `expiresAtUtc`, renders HH:MM:SS from a server-clock delta, emits `(expired)`).
**ConversationStore:** `open(recipientResultId)` → `getConversation` (+ chained history refs per BR-BSA-84 → "older conversations" links); `loadMore(page)`; `windowState = computed(now vs windowExpiresAtUtc)` — countdown drives composer enable/disable (server re-validates: `409 WindowExpired` flips state instantly); `send(kind, body)` → optimistic bubble `pending` → api → reconcile status; `react(msgId, emoji)`, `replyTo(msgId)`, `searchThread(q)` (client-side over loaded pages); `sendTemplateAfterExpiry()` → navigates to `send/whatsapp?from=conversation&recipient=X` (recipient LOCKED, groups hidden) → on confirm the API **creates a NEW chained conversation record** (C8) and the store re-opens it; voice-note recording via the existing `falcon-angular-audio-recorder` (WhatsApp-style 1:1) → uploads via uploader defaults → sends `audio` kind.
**Realtime:** inbound messages/status flips arrive via polling `listMessages(sinceId)` every 5s while the thread is open (SignalR swap point isolated in `ConversationStore.transport`).

### F8 — Voice conversation (IVR playback view)
Reuses N6 thread reskinned: OUT bubbles = IVR node voice-note (audio player + transcript + option keycaps), IN bubbles = DTMF presses; ended notes per terminal; footer cross-channel buttons → `send/whatsapp|voice?recipient=X`. AI-handoff demo stays CUT (code-only #14) unless product overrules.

### F9 — Marketplace purchase surface + dual navigation
Purchase path stays in the consoles' marketplace (existing Commerce `do-payment` + order-status polling); this wave adds: BSA card in the marketplace grid gains "Open" → routes to `/#/basic-app` (C12 dual-path); post-purchase submenu visibility = `channelState().appActive` + PES flag refresh; in-app read-only banner + per-channel Send disabling driven by `channelState()` (BR-BSA-08..14) — `ChannelStateStore.load()` on shell entry + channel-tab switch, cache 60s, invalidated by a manual refresh icon.

### W-PES — permissions hardening (backend-coupled, schedulable any time after B0)
Seed `app.basic-app` (host mount) + `acc.basic-app` actions (view/send/schedule/cancel/edit/delete/export/converse; creator-scoped via `r.obj.createdby==r.sub.userid`) in `BuiltInRoleCatalog.cs` + account bootstrap; add `basicApp` block + `basicAppQuery` factory to `falcon-access.registry.ts`; flip manifest `requiredAccess: [{action:'view', resource:'app.basic-app'}]` + menu-item requiredAccess; wire `flags` into every store/button. Exit: sidebar item invisible to unauthorized users; direct URL → `/unauthorized`.

### W-DARK — dark-mode tokens (design-coupled, after F3)
The platform ships `.app-dark`; the React SoT has NO dark design. Deliver: dark values for the BSA custom surfaces (status-pill tints via E1 vocab maps, chart palettes, phone-preview frame, chat bubbles) as token overrides in the lib theme; Falcon Eyes parity run in both modes.

---

## Part D — Sequencing, dependency DAG, and gates

```
L0 (lib fitness, task_e08e9a6d) ──► L1 packaging ──► L2 publish (A|B) ──► L3 smoke consumer ──► L4 docs
      │                                                        (external repo only — basic-app unchanged)
      ▼
F2 compose (N1,N2,N7,E4,E7) ──► F3 WA details (N3,N4) ──► F4 scheduled ──► F5 voice compose (E5)
                                                                            └──► F6 voice details
F7 conversation (N6,N9,N10) — after F2 (reuses compose fromConversation) ──► F8 voice conversation
F9 marketplace — anytime after F1 (existing backend only)
W-PES — after backend B0 seeds; before ANY release        W-DARK — after F3 (charts exist)
Backend coupling: F2/F4 quote+compose ⇐ B2 · F3 live data ⇐ B3 · F5/F6 ⇐ B5 + P-2 senders · F7/F8 ⇐ B6.
Mock-first rule: every F-wave demos on BsaMockApiService; the provider flag flips per-endpoint as B-waves land.
```

**Estimate shape (relative):** L0 S · L1 L · L2 M · L3 M · L4 L ‖ F2 L (the densest UI) · F3 M · F4 S-M · F5 M · F6 M · F7 L · F8 S · F9 S · W-PES S-M · W-DARK S-M.
**Standing risks carried:** MF singleton contract during any library-consumption change (Part A constraint); the 20-item BE contract risk register (BE_CONTRACTS §5); Q-BSA open questions gate their features (halt-and-flag); screenshots-degraded verification sessions fall back to DOM/console probes + Falcon Eyes.
