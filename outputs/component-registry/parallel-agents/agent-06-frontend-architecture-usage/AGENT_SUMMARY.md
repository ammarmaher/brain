# Agent 6 — Frontend Architecture / Usage Pattern Auditor — Summary

**Active source verified:** `C:\Falcon\Falcon\falcon-web-platform-ui` (branch `polishing-v0.4`)
**Scope:** Architecture + usage docs only. NO per-component folders (Agent 7 owns those).
**Generated:** 2026-05-13

---

## What was investigated

1. Workspace topology — 3 apps (`host-shell`, `admin-console`, `management-console`) + 9 libraries.
2. All barrel exports — `@falcon`, `@falcon/ui-core`, `@falcon/ui-core/angular`, `@falcon/ui-tokens/*`, `@falcon/theme`, `@falcon/sdk`, `@falcon/ui-showcase-data`.
3. Import paths declared in `tsconfig.base.json` and which paths each component should be imported from.
4. Feature-folder convention (one-file-per-type-folder) inside admin-console + management-console.
5. Route topology in all 3 apps — `loadChildren` vs `loadComponent`, MF dynamic registration, guards.
6. Signal / state patterns sampled from `hierarchy-page-state.service.ts`.
7. Module Federation share rules + remote-manifest abstraction (Wave 8 pluggable provider).
8. Auth + facade pattern (`provideFalconFacades` vs `provideFalconFallbackFacades`).
9. Wrapper decision tree: `@falcon` re-export vs `@falcon/ui-core/angular` direct path.
10. Per-component usage matrix — selector-grep across admin-console / management-console / host-shell playground / showcase.
11. 12 quality gate scripts at `tools/gates/gate-*.mjs`.
12. Forbidden-pattern grep — `*ngIf` / `*ngFor` / PrimeNG imports / `pi pi-*` / inline styles / Zitadel calls.

---

## Headline findings

### Architecture

1. **Three-app Module Federation** is the load-time skeleton. `host-shell` (port 4200) is the host. `admin-console` (4204) + `management-console` (4301) are the active remotes; two additional inactive remotes (`demo-app`, `user-app`) are declared in the manifest for future use.
2. **Pluggable manifest provider (Wave 8)** — `REMOTE_MANIFEST_PROVIDER` token + `JsonFileRemoteManifestProvider` (default) + `ApiRemoteManifestProvider` (stub) allow switching to an API-driven manifest with a one-line change in `app.config.ts`.
3. **Animations stay LOCAL to each app** (`@angular/animations` + `@angular/platform-browser/animations` opt out of MF share-map) to avoid `RUNTIME-006`.
4. **Zoneless across the platform** — all 3 apps register `provideZonelessChangeDetection()`. `zone.js` is no longer shared via MF. `provideAnimationsAsync()` replaces sync animations.
5. **Stencil dual-render path** — every `<falcon-X>` Shadow DOM tag has a `<falcon-X-tw>` Light DOM companion (with 4 exceptions, see `COMPONENT_USAGE_MATRIX.md`). Angular wrapper toggles via `useTailwind` input.

### Usage matrix

- **Of 49 Angular wrappers (`falcon-angular-*`), only 22 are used in real feature code.** The other 27 are showcased in `playground.page.html` and/or `falcon-ui-showcase` but have no consumer outside the lab.
- **Legacy bespoke `falcon-stepper`** (PrimeNG-shaped wrapper) is still used in **every** wizard host — `<falcon-stepper>` appears in 4 wizards (admin + management × add-client + add-user). `<falcon-angular-stepper>` is only used in playground/showcase. *This is the biggest "Stencil exists but consumers haven't migrated" gap.*
- **Legacy `falcon-form-field`** is heavily consumed — 131 matches across 11 files in admin + management wizards. It wraps Falcon inputs to add labelled forms with required indicator + error slot.
- **`falcon-mobile-number`** is still used in forgot-password + add-client/add-user (5 files). Should migrate to `falcon-angular-phone-field`.
- **`falcon-calendar` (legacy façade)** is gone — direct active usage is just 4 files which use the new `<falcon-angular-calendar>` selector that shares the prefix.
- **`falcon-multiselect` (legacy bespoke)** has ZERO consumers — fully purged. Safe to delete.
- **`falcon-photo-uploader`** is the avatar uploader in 6 wizard step files (add-client + add-user).
- **`falcon-tree-panel`** is the chrome around the org-hierarchy tree in 4 menu-component files.
- **`send-credentials-popup`** lives only in playground — 0 real-feature use.
- **24 Falcon components have zero non-playground/showcase consumers** — see `UNUSED_AND_DEPRECATED_COMPONENTS.md`.

### Forbidden patterns

- **0** legacy `*ngIf` / `*ngFor` / `*ngSwitch` matches across `apps/` — full new-control-flow compliance.
- **0** active PrimeNG imports (only doc/plan mentions remain — Wave PR-8 cleanup intact).
- **0** active PrimeIcons class names (`pi pi-*`) in any feature template.
- **1** real `style=` attribute in templates — `applications-table.component.html:43` carries `style="vertical-align: -2px;"` on an inline SVG.
- **Multiple** Tailwind arbitrary-value classes with raw hex / px — e.g. `bg-[#f5f6f7]`, `border-[#eef0f2]`, `rounded-[14px]` in admin-console `organization-hierarchy-page-menu.component.html` and admin/management kanban + chart + node-header components. **This contradicts the tokens-only rule and is the highest-priority cleanup.**
- **0** direct Zitadel calls. All auth flows go through `auth-api.service.ts` → Identity Gateway (`Gateway.IdentityGateway`).

### Wave-status observations

- The standalone-dev mode for admin-console + management-console uses `provideFalconFallbackFacades()` from each app's `mocks/falcon-fallback.providers.ts`. Mocks live in source — verify before prod.
- `adminConsoleGuard` is **still commented out** at `apps/admin-console/src/app/app.routes.ts:7`. Auth gating depends entirely on the host-shell's `authGuard + shellPrimeAccessGuard` + the MF `shellAccessMatchGuard` defined inside `RemoteRouteService` (the working version at `core/services/remote-route.service.ts`).
- Two `remote-route.service.ts` files exist — the active one is `core/services/remote-route.service.ts` (used by `bootstrap.ts`), and an older sibling at `apps/host-shell/src/app/remote-route.service.ts` is dead code that should be deleted.
- `PrimeNGThemeService` still keeps its legacy name even though PrimeNG is fully gone — it now runs theme + RTL document-class sync only. Memory flagged this for rename.

---

## Top 3 architecture-upgrade ideas

1. **Migrate every wizard host from `<falcon-stepper>` (legacy PrimeNG-shaped) to `<falcon-angular-stepper>` (Stencil).** Highest-impact win — eliminates the last bespoke Angular stepper, unlocks Studio-customisable visuals, drops a TemplateRef-driven API for declarative `steps` input + transcluded panels.
2. **Sweep all remaining `bg-[#hex]` / `border-[#hex]` / `rounded-[Npx]` arbitrary Tailwind values to falcon tokens.** Admin-console `organization-hierarchy-page-menu.component.html` alone has ~20 violations. The hardcoded-value gate currently scopes to tokens CSS only — extend gate-08 to `apps/**/*.html`.
3. **Delete the dead-code sibling `remote-route.service.ts` at app root + rename `PrimeNGThemeService` to `ThemeRtlSyncService`.** Tier-1 cleanup, ~30 min effort, removes confusion + a misleading file name.

## Top 5 reusable-upgrade ideas (captured in `UPGRADE_CANDIDATES.md`)

1. Promote `falcon-organization-hierarchy-tree-tw` Light-DOM tag to a paired Shadow+Light component once stable (it's the only outlier).
2. Add `panelHeader` / `panelFooter` slots to `<falcon-angular-tabs>` so action buttons can flank the tab strip without bespoke chrome (memory note: tabs-actions-demo only exists as a showcase pattern).
3. Expose `optionTemplate` `ng-template` on `<falcon-angular-dropdown>` so live-language switch + flag-coloured options can render inline (the `user-role-status-step` already carries a Wave 4 TODO comment for this).
4. Add a slot-friendly variant to `<falcon-angular-popup>` so `send-credentials-popup` can finally retire `<falcon-angular-dialog>`.
5. Make `<falcon-form-field>` legacy Angular component a **template** owned by `falcon-angular-input` (and every other input) via a shared `[label]` + `[required]` + `[error]` input set — would let us delete the wrapper at 131 call sites.

---

## Deliverable table

| section | count |
|---|---|
| docs written | 16 |
| components surveyed for usage matrix | 58 |
| unused components found (no real consumer) | 24 |
| deprecated components flagged | 4 (`<falcon-angular-dialog>`, `<falcon-angular-toast>`, `<falcon-stepper>`, `<falcon-calendar>` façade) |
| forbidden-pattern violations found | 23+ (1 inline `style=` + 22+ Tailwind arbitrary hex/px in apps/admin/management features) |
| top 3 architecture-upgrade ideas | 1) Migrate stepper, 2) Token sweep arbitrary Tailwind values, 3) Delete dead remote-route.service + rename PrimeNGThemeService |
