# Angular & Tailwind Rules — Falcon Frontend

This file collects the project-wide rules observed in the active codebase + verified against project memory.

## 1. Tailwind-only stylistic rule

- **Tailwind v4 utilities in templates ONLY.** No SCSS component files, no `*.component.css` with declared rules, no PrimeNG widgets, no PrimeIcons.
- **A single canonical theme CSS file per stack:** `libs/falcon-theme/src/falcon-tailwind-tokens.css` is the SSOT `@theme` block. Each app's `apps/<app>/src/tailwind.css` `@import`s this first.
- **`styles.scss` per app exists as a near-empty legacy carry-over** — keep minimal. The active rule is Tailwind utilities in templates only.
- **Component CSS files in Angular wrappers** (e.g. `falcon-input.component.css`) are typically empty placeholders required by Angular's `styleUrl` reference. Audit if any have rules.
- **Wave PR-8 removed PrimeNG physically.** ESLint flat block live-fires on disallowed `primeng/*` or `primeicons` imports (gate-10-noor-naming-lint + flat-block rule).
- **`pi pi-*` icons replaced** by a vendored Falcon icon font at `libs/falcon-theme/src/styles/falcon-icons.css` + `libs/falcon-theme/src/assets/fonts/`. Memory confirms 122 icons migrated.
- **`tailwind.config.js` is a compat bridge** — v4 reads it only via `@config "../../../tailwind.config.js"` in the theme file to re-enable `important: true` so utilities beat any legacy override.

### Tailwind v4 specifics

- `@source` directives in each app's `tailwind.css` declare which paths the Oxide scanner crawls.
- `@source not` exclusions remove `node_modules`, `dist`, `.angular`, `.nx`, `demos`, `**/*.spec.ts`, `**/*.e2e.ts`, `**/*.md`.
- `@source inline(...)` safelists are required for Angular `[class.X]` bindings and runtime-built class strings in `tailwind-classes.ts` helpers (~2000 inline lines in host-shell `tailwind.css`).
- Layer order: `@layer theme, base, falcon-base, utilities;` — utilities declared last so they beat `falcon-base`.
- Dark mode is `@custom-variant dark (&:where(.app-dark, .app-dark *))` — togglable via `<html class="app-dark">`.
- Grid is the default layout primitive; flexbox only for small inline alignment (memory rule `feedback_tailwind_grid_first.md`).

## 2. Tokens over intent (Noor Instructions, forward-only)

- Token naming follows the `falcon-{family}-{shade}` palette pattern (e.g. `falcon-teal-500`, `falcon-neutral-200`). Memory entry `feedback_noor_instructions.md`.
- Within Admin Console scope, palette names override semantic intent tokens for **new code**. Existing semantic tokens are NOT migrated (forward-only).
- The pre-finish grep gate (memory `feedback_no_inline_styles_tokens_only.md`) blocks zero inline styles + tokens only (colours / borders / radii / shadows / spacing / fonts).
- Stencil Shadow + per-component `<component>.tokens.css` are SSOT. Tailwind variant must mirror — never invent or hardcode (memory `feedback_shadow_is_token_ssot.md`).

## 3. Angular best practices

### Bootstrap + change detection

- **Zoneless** — all 3 apps register `provideZonelessChangeDetection()` in `app.config.ts`. `zone.js` is NOT shared via MF; removed from polyfills.
- **Async animations** — `provideAnimationsAsync()` replaces sync `provideAnimations()` (zoneless requirement).
- **Standalone components** — every new component uses `standalone: true` + explicit `imports: []`. No new NgModules.
- **`bootstrapApplication(App, appConfig)`** is the only bootstrap path. Host-shell wraps it in a dynamic `import('./bootstrap')` to create the async MF boundary.

### State + reactivity

- **Signals (`signal()`)** drive component-internal state.
- **`inject()`** for DI inside `Component` / `Directive` / function-scoped guard / resolver / interceptor bodies. Constructor injection still used for class fields where preferred.
- **`@if`, `@for`, `@switch` new control flow** are mandatory. Zero `*ngIf` / `*ngFor` matches across `apps/`. (Grep verified.)
- **`OnPush` change detection** on every wrapped component sampled.
- **Methods (not `computed()`) where `@Input` props drive the output** — explicit note at `falcon-input.component.ts:106-108`.
- Signal-based state services exist in `apps/<app>/src/app/features/<feature>/services/` — feature components subscribe to signal getters in templates.

### Routing

- **Lazy `loadChildren` per feature** — every feature routes file is dynamically imported.
- **Standalone `loadComponent`** for single-component routes.
- **`loadRemoteModule()`** for MF remote routes; host-shell's `RemoteRouteService.reloadRemotes()` runs BEFORE `router.initialNavigation()` via `withDisabledInitialNavigation()`.
- **Guards** are functional (`CanActivateFn`) — `authGuard`, `shellPrimeAccessGuard`, `managementConsoleGuard`. The `adminConsoleGuard` is currently commented out (admin-console/app.routes.ts:7).

### HTTP

- **`provideHttpClient(withFetch(), withInterceptorsFromDi())`** — `withFetch()` is mandatory for zoneless.
- **Class-based interceptors** registered via `HTTP_INTERCEPTORS` token + `multi: true` (e.g. `RequestInterceptor`, `RuntimeBaseUrlInterceptor`, `ResponseInterceptor`).
- **Translations preloaded** via `translateInitializerProvider` (APP_INITIALIZER).

### Forms

- **Reactive Forms** for any non-trivial form.
- **`ControlValueAccessor`** on every Falcon UI input wrapper (input, dropdown, multi-select, checkbox, radio, OTP, paginator, etc.). Wired with `NG_VALUE_ACCESSOR` + `forwardRef`.

### Schemas

- **`CUSTOM_ELEMENTS_SCHEMA`** on Angular wrappers that render Stencil custom elements (e.g. `FalconAngularInputComponent`).

## 4. Auth + Identity

- **Frontend never calls Zitadel directly.** All auth flows go through Falcon Identity (`auth.falconhub.space/api/`). Memory entry `feedback_frontend_auth_identity_service.md`.
- Host-shell composition root registers facades: `provideFalconFacades({ auth: HostAuthFacade, theme: HostThemeFacade, language: HostLanguageFacade, notifier: HostNotifierFacade, context: HostContextFacade })`.
- Remote apps (admin-console, management-console) register `provideFalconFallbackFacades()` for standalone-dev mode.

## 5. Module Federation

- **YARP-style 90/10** is the wiki rule for gateways. For frontend MF: host-shell loads all remotes via `loadRemoteModule()` reading a runtime manifest (`apps/host-shell/src/assets/module-federation.manifest.json`).
- **Falcon libs share eagerly** (singleton, eager, strictVersion false). Angular libs share eagerly (singleton, eager, strictVersion true).
- **Animations stay local per app** — avoids RUNTIME-006.
- **Wave 8 abstraction** — `REMOTE_MANIFEST_PROVIDER` injection token lets host swap between `JsonFileRemoteManifestProvider` and a future `ApiRemoteManifestProvider`.

## 6. File-naming & folder-naming conventions

Per wiki + project memory `feedback_wiki_naming_conventions.md`:

- **kebab-case** for files and folders.
- **`@falcon/*` scope** for libs: `libs/core`, `libs/theme`, `libs/i18n`, `libs/ui`, `libs/utils`, `libs/layout`, `libs/shared`, `libs/host-bridge`, `libs/federation`, `libs/sdk`. (The active codebase implements a slightly different shape: `libs/falcon` is the Angular barrel, `libs/falcon-ui-core` holds Stencil + Angular wrappers, `libs/falcon-theme` and `libs/falcon-ui-tokens` are split, `libs/sdk` is a standalone facades lib.)
- **Per-feature one-file-per-type-folder** — `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts`. Memory entry `feedback_folder_structure_pattern.md`. Large signal-state services may live in their own files alongside.

## 7. Component & TS rules

- **Comment style** — terse banner format (`*** ... ***` delimited, max 2 lines). Memory entry `feedback_comment_style.md`. Verbose JSDoc is not used.
- **Clean / DRY / minimal** — no duplication, no speculative abstractions. Memory entry `feedback_clean_code_dry_minimal.md`.
- **Strict task scope** — never edit infra / config / tooling outside scope. Memory entry `feedback_strict_task_scope.md`.

## 8. Hard prohibitions

| Prohibition | Source |
|---|---|
| No PrimeNG components | Wave PR-8 + memory `project_falcon_primeng_total_removal_complete.md` |
| No PrimeIcons (`pi pi-*`) | Same — replaced by `libs/falcon-theme/src/styles/falcon-icons.css` |
| No SCSS in component CSS files (and no rules in app-level `styles.scss` beyond minimal carry-overs) | Memory `project_brain_skills_primeng_purge.md` |
| No inline styles, tokens only | Memory `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05) |
| No `*ngIf` / `*ngFor` — use `@if/@for/@switch` | Verified: 0 matches across `apps/` |
| No commits without explicit "commit" instruction | Memory `feedback_never_commit_without_explicit_permission.md` (strict 2026-05-02) |
| No pushes without explicit "push" instruction | Memory `feedback_never_push_without_explicit_permission.md` |
| Frontend cannot call Zitadel directly — go through Identity Service | Memory `feedback_frontend_auth_identity_service.md` |
| `falcon-web-platform-ui-old`, `deprecated-falcon-web-platform-ui`, `WebstormProjects\falcon-web-platform-ui` are off-limits — never read, edit, sync, or run | Memory `feedback_discard_old_ui.md`, `feedback_webstorm_duplicate_workspace.md` |
| Demos folder must NOT factor into bundle size calculations | Memory `project_falcon_cross_framework_demos_inside_workspace.md` (skip-demos rule enforced via Nx tag) |
| No dev-serve / preview tools / browser verification during implementation | Memory `feedback_no_ui_testing_during_implementation.md` |
| No build-skip on errors — `nx build <app>` must run clean before reporting done | Memory `feedback_always_build_zero_errors.md`, `feedback_build_must_be_green.md` |

## 9. Quality gates (npm scripts)

`package.json` exposes 12 gate scripts. The relevant ones for frontend rule enforcement:

- `gate:lint` — ESLint flat config.
- `gate:typecheck` — TypeScript noEmit.
- `gate:token-naming-lint` — Token names follow `falcon-*` convention.
- `gate:hardcoded-value-lint` — Catches inline hex / px values that should be tokens.
- `gate:noor-naming-lint` — Noor Instructions palette-over-intent rule (Admin Console scope, forward-only).
- `gate:component-token-scope` — Each component-scoped token only appears inside its own `<component>.tokens.css` + matching consumer files.
- `gate:a11y-baseline` — A11y rule baseline.
- `gate:bundle-size-budget` — Per-app initial budget.
- `gate:build:falcon-ui-{core,react,vue,tokens}` — Cross-framework lib builds.
- `gate:all` — chains lint, typecheck, token-naming, hardcoded-value, a11y, noor-naming, component-token-scope.

Run via `node tools/gates/gate-NN-*.mjs`.

## 10. Build executor + tooling

- **Build:** `@nx/angular:webpack-browser` per app (webpack with MF custom-webpack config, NOT `@angular/build:application`). Memory note about migrating to esbuild has not landed.
- **Serve:** `@nx/angular:module-federation-dev-server` (host-shell, admin-console, management-console).
- **Test:** Vitest via `@nx/vitest:test` + `@analogjs/vitest-angular`. Host-shell retains a Karma config carryover but admin + mgmt are Vitest only.
- **Lint:** `@nx/eslint:lint` with `angular-eslint` 21.2.0 flat config per app.
- **Stencil:** `@stencil/core` builds `libs/falcon-ui-core` into a `dist-custom-elements` target + auto-emitted React wrappers. Vue wrappers from a custom proxy script.

## 11. Verified deviations from documented standards

These are intentional but worth flagging:

- **`adminConsoleGuard` is commented out** in `apps/admin-console/src/app/app.routes.ts:7`. The intent ("Protect all routes under admin-console") is documented but the guard call is disabled.
- **`HashLocationStrategy` on host-shell** — unusual; likely preserves deep links across MF route swaps.
- **`PrimeNGThemeService`** is still named after PrimeNG even though PrimeNG is gone. Its current job is theme + RTL sync.
- **`libs/falcon-studio` hidden-but-kept** — preserved on disk per Wave 2 v3.1, but Tailwind no longer scans it and host-shell route is removed.
- **`falcon-organization-hierarchy-tree-tw` is Light-DOM only** — no Shadow companion yet, unlike the rest of the library.
- **`<falcon-data-table>` legacy (PrimeNG p-table wrapper)** was deleted in Wave PR-7. Consumers use `<falcon-angular-data-table>`.
- **`<falcon-calendar>`, `<falcon-mobile-number>`, `<falcon-multiselect>`, `<falcon-stepper>` (in `libs/falcon/src/shared-ui/lib/components/`)** are legacy Angular bespoke components — candidates for deprecation as consumers fully migrate to `<falcon-angular-*>` equivalents.
