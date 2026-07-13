# Falcon Shared Features — DECISION

## Brain SK final recommendation

**STATUS: READY / SHARED.** `libs/falcon/src/shared-features/` is the correct home for any **presentational feature (page or panel) shared by two or more apps**. The presentation/transport split is sound and the units are production-grade. Reuse them; do not fork.

## Use this area for

- A whole **page or panel** that must render identically in admin-console + management-console (or host-shell + a remote), differing only by a discriminator (`kind` / `userId` / `selfMode` / `perspective`).
- Features that own complex VIEW state (shadow-row edits, multi-tab edit mode, signal stores) but must stay HTTP-free.
- Cross-app chrome primitives keyed off a single descriptor (`org-node-avatar` ← `NodeIdentity`; `falcon-brand-logo`).

## Avoid this area for

- A new **atomic UI primitive** (button/input/dropdown) → that goes to `libs/falcon-ui-core` via the `falcon-component-creation` skill, NOT here.
- App-specific logic, routes, navigation, or `HttpClient` → those live in the per-app wrapper.
- A small reusable Angular component that isn't a "page/panel" → `libs/falcon/src/shared-ui/lib/components`.

## Exact rule for future tasks

1. **Reuse the existing unit** before building. `service-pricing-table` is THE service-pricing table; `comm-mkt-view` is THE mgmt comm/marketplace page; `user-details` is THE user drilldown — adding a 2nd copy is the anti-pattern this folder eliminated.
2. **New app surface** → add a thin wrapper that (a) provides the transport against the unit's DI token, (b) does GET→adapt→`[rows]`/`[items]`, (c) maps mutation outputs → API → reload, (d) resolves PES → `[accessFlags]`, (e) owns navigation.
3. **Route delete/confirm through `FalconMessageOrchestratorService`** (the orchestrator pattern), not a local popup.
4. **For self-profile**, bind `[selfMode]="true"` and let `UserDetailsStateSlice.fetchMe()` load GET user/me — never pass a possibly-null `identityUserId` as `[userId]`.
5. **Keep `org-node-avatar`/`falcon-brand-logo` purely presentational** — the producer classifies the `NodeIdentity` (incl. the `falcon-brand` branch); don't re-decide at the call site.
6. **New feature → signals-first** (`input()/output()/signal/computed`), matching `service-pricing-table`/`user-details`, NOT the legacy `@Input/@Output` of `comm-mkt-view`.
7. **No SCSS, no inline `styles:`** — if you need to reach into a Stencil light-DOM (the `comm-mkt-view` `::ng-deep` case), prefer extending the underlying `falcon-ui-core` component's API instead (queue it).

## Relationship to other areas

- **Composes:** `libs/falcon-ui-core` (`<falcon-angular-*>` data-table / dropdown / date-picker / status-badge / tabs / switch / input / phone+email field) + `shared-ui` (otp-dialog, node-details-section) + `shared-utils` (`ServiceOperationResult`, `FalconItemStatus`, status-style maps).
- **Depends on:** `@falcon/sdk` ports (`USER_DETAILS_GATEWAY`, `FALCON_NOTIFIER`, `FalconMessageOrchestratorService`, `FalconUnsavedChangesService`).
- **Plugs into:** `understanding/frontend/form-validation` — these features ARE the biggest consumers of the validation system; `user-details/validations` mirrors `falcon-validations.ts personName` (parity-tested).
- **Consumed by:** thin wrappers in `apps/host-shell` + `apps/admin-console` + `apps/management-console`.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- `falcon-brand-logo` is fully static (no inputs) — geometry + `currentColor` only.
- The brand SVG geometry is hardcoded in TWO places (`falcon-brand-logo` + `org-node-avatar` brand branch), kept in lockstep by hand.
- `comm-mkt-service-icon`'s glyph set is a fixed inline-SVG `@switch` (17 keys + default).
- The `comm-mkt-view` read-only-shadow suppression is a static `::ng-deep` rule.
- `user-details` option seeds (STATUS/ROLE/PERM/CHECKER) are module-level const arrays (labels via i18n, but the SET is fixed).

### 2. What is already dynamic through inputs/outputs?
- `comm-mkt-view`: `kind`/`items`/`loading`/`error`/`nodeName`/`busyRowIds` in, `action` out.
- `service-pricing-table`: 5 inputs (`rows`/`kind`/`accessFlags`/`submitting`/`busyRowIds`), 6 outputs (visibility/rowAction/priceType/priceValue/scheduledDelete/doPayment).
- `user-details`: `userId`/`includeDeleted`/`selfMode` in, `back`/`dirtyChange` out.
- `org-node-avatar`: `identity`/`size` in.

### 3. What is dynamic through slots / ng-template?
- None of these features expose `ng-content`/slots — they are fully-rendered pages, not layout shells. (They CONSUME the slots of `falcon-data-table`, etc.)

### 4. What is dynamic through token/theme overrides?
- All visuals flow from Falcon palette tokens (`bg-falcon-*`, `text-falcon-teal-*`, `rounded-[var(--radius-…)]`, `shadow-[var(--shadow-falcon-toggle-active)]`). Dark mode flips via the theme automatically (no per-feature dark CSS).
- Component-token overrides reach the embedded `falcon-ui-core` components (per their own dossiers).

### 5. What is dynamic through Tailwind classes?
- Host `class=` on `org-node-avatar`/`falcon-brand-logo` controls size/color. Inner layout is Tailwind utilities throughout.

### 6. What is missing to make them more reusable?
- A **read-only shadow-rows** input on `falcon-data-table` (would delete the `comm-mkt-view` `::ng-deep`).
- `user-details` consuming `FALCON_VALIDATIONS` directly (would delete the duplicated `personName` rule).
- A single shared brand-SVG fragment (would delete the `falcon-brand-logo`/`org-node-avatar` lockstep duplication).
- Lib-level specs for the intricate `service-pricing-table` shadow-row + effective-date logic.

### 7. What capability should be added to a SHARED component (not a page hack)?
- The read-only-shadow API belongs on `falcon-data-table` (shared), not as a per-page `::ng-deep`.
- The brand glyph belongs in `falcon-brand-logo` as the single source — have `org-node-avatar` render `<app-falcon-brand-logo>` instead of inlining the path.

### 8. What flags / options would make them better?
- `comm-mkt-view`: migrate to `input()/output()` (drops the setter-into-signal workaround).
- `service-pricing-table`: a `[readOnly]` fast-path for non-Falcon viewers (today gated entirely by PES flags + `availableActions`).
- `user-details`: an injectable validators provider so the slice's pure-fn validation can share the registry.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** migrate `comm-mkt-view` + sub-components to `input()/output()`; replace the `comm-mkt-service-icon` inline-style hex with a host Tailwind class; convert `text-[10px]/[9px]` to token-backed sizes; add lib specs.
2. **Phase B (shared-component, queued):** add a `readOnlyShadowRows`/`hideShadowActions` input to `falcon-data-table`; switch `comm-mkt-view` to it and delete the `::ng-deep`.
3. **Phase C (validation consolidation, queued):** have `user-details/validations` delegate to `FALCON_VALIDATIONS` (or import the registry's `personName` body) and retire the parallel constants — coordinate with the parity test.
4. **Phase D (brand SVG):** `org-node-avatar` renders `<app-falcon-brand-logo>`; delete the inline path.

### 10. What is risky to change because other pages depend on it?
- The `SERVICE_PRICING_TRANSPORT` + `USER_DETAILS_GATEWAY` token shapes — the host wrappers implement them; changing a method signature breaks the wrapper.
- The 6 `service-pricing-table` output event shapes — the wrapper's mutation→API mapping keys off them.
- The `CommMktItem` / `ApplicationRow` model shapes — the GET adapters in the wrappers produce them.
- `user-details` `selfMode`/`userId` contract — the self path's GET user/me dependency is load-bearing (the historical "no tabs" bug fix).
- The shadow-row carry-forward + effective-date math in `service-pricing-table` (dense BUG-FIX provenance 2026-05-31 / 2026-06-03) — touch only with a regression spec first.

## Verification
🟢 code-verified 2026-06-03 (L05). Recommendation + capability assessment grounded in the source files read this pass; the upgrade phases reference the exact deviations recorded in AUDIT.md. No source edited.
