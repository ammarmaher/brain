# Front-End Architecture

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Front%2DEnd-Architecture.md` (the `%2D` in the filename URL-encodes `-`)
**Length:** 1298 lines · **Headings:** 56
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **canonical Falcon frontend rule book**. Defines the modular **micro-frontend ecosystem**: host-shell architecture, internal apps (Management Console, Admin Console), external micro-apps loaded dynamically, the **`@falcon/sdk`** public API surface for micro-apps, Module Federation conventions, layout/theme inheritance, dynamic ES module loader, and folder structure for both Nx monorepo and micro-app repos.

## Key rules / decisions

### Architecture goals (§5.2, `…md:21-44`)

1. **Isolation** — micro-app devs cannot access platform code or internal libraries.
2. **Extensibility** — micro-apps added independently.
3. **Consistency** — unified UI (theme, layout, language, navigation).
4. **Dynamic Integration** — micro-apps discovered + loaded at runtime without redeploying shell.
5. **Security** — Shell controls authn/authz, tenant context; SDK is the only public interface.
6. **Scalability** — multiple teams deliver async.
7. **Version Compatibility** — Falcon SDK versions enforce backward compatibility.

### Apps (§5.4, `…md:69-148`)

- **Host Shell** — global layout (header, footer, sidebar), navigation, multi-tenant context, authn/authz via Access Control Service, theme/language state, micro-app runtime loading.
- **Management Console** (internal) — Account users: org/users, roles, wallets, billing, dashboards, channels.
- **Admin Console** (internal) — System administrators: system config, tenant provisioning, contracts, cross-tenant ops.
- **Micro-Apps** (external) — standalone Angular projects outside the monorepo, deployed independently, dynamically loaded from S3/Azure Blob/CDN, consume Falcon SDK, **cannot override shell layout or internal code**.

### Internal shared libraries (§5.5, `…md:152-167`)

**Strictly internal — NOT accessible to micro-app developers:**

```
@falcon/core         — Auth, HTTP, Config, Error Handling
@falcon/theme        — Tailwind + Angular Material theme engine
@falcon/i18n         — Multi-language runtime
@falcon/ui           — Shared components (buttons, toasts, tables)
@falcon/layout       — Layout engine + header/footer/menu templates
@falcon/shared       — Models, interfaces, constants
@falcon/host-bridge  — Dynamic loader + micro-app registry
```

### Falcon SDK (§5.6, `…md:172-196`)

Standalone, **versioned npm package** published to private registry. Provides:
- **AuthFacade** — access token + change events.
- **ThemeFacade** — light/dark state.
- **LanguageFacade** — ar/en + RTL/LTR.
- **NotifierFacade** — unified toast notifications.
- **Context** — user info, tenant info, environment.
- **Layout Tokens** — padding, container type, breakpoints.
- **Versioning** — `SDK_VERSION` constant.

Guarantees: micro-apps consume platform resources in a controlled way; no direct access to internal NX libraries; decoupled release cycles.

### Micro-app shape (§5.7, `…md:200-227`)

- Standalone Angular modules/components.
- Tailwind + Material theming (inherits shell vars).
- Local dev environment (mock shell).
- Entry points: `init()`, `mount()`, `unmount()`.
- Hosted JS bundle `remote.js` uploaded to CDN.
- `microapp.json` descriptor with metadata, version, SDK compatibility.

**Micro-apps MUST NOT render** shell layout, sidebar, header, footer, navigation. **Content area only**, inside Shell layout.

### Dynamic loading (§5.8, `…md:231-249`)

The shell uses a proprietary **dynamic ES module loader**:
1. Read `microapp.json` descriptor.
2. Validate SDK compatibility (semver range).
3. Load remote JS bundle.
4. Call `init({ sdk: window.FalconSDK })`.
5. Call `mount()` to bootstrap Angular.
6. Render inside `<falcon-microapp-outlet>` container.

Sample loader code (`…md:945-1015`) — `loadAndInitMicroAppScript`, `isSdkCompatible`, `loadAndInitMicroApp` with semver-range checking. `window.FalconMicroApps['<scope>'] = { init, getRoutes, mount }`.

### NX folder layout (§5.14, `…md:384-466`)

```
falcon-frontend/
├── apps/
│   ├── shell/                  Main runtime host (Integration Layer)
│   ├── management-console/     Internal app for account users
│   ├── admin-console/          Internal system admin app
├── libs/
│   ├── core/                   AuthService, interceptors, tokens; http wrapper, config, state
│   ├── theme/                  ThemeProvider, Tailwind/Material
│   ├── i18n/                   LanguageService, translation resources
│   ├── ui/                     reusable UI (buttons, tables, dialogs)
│   ├── rx/                     advanced reactive utilities
│   ├── utils/                  Non-Angular helpers
│   ├── layout/                 default-layout, casual-layout, layout.service.ts
│   ├── shared/                 models, constants, index
│   ├── host-bridge/            messaging, context, runtime/dynamic-loader
│   ├── federation/             shell.config.ts, admin-console.config.ts, management-console.config.ts, microapp.registry.ts
│   ├── sdk/                    SOURCE for @falcon/sdk (NOT the package)
│   └── shared-assets/          Logos, SVGs, icons, JSON configs
├── tools/, dist/, package.json, nx.json, tsconfig.base.json
```

Naming convention (§5.14, `…md:600-619`): library scopes `@falcon/core`, `@falcon/i18n`, `@falcon/ui`, `@falcon/theme`, `@falcon/layout`, `@falcon/shared`, `@falcon/host-bridge`, `@falcon/federation`, `@falcon/sdk`. Apps: `@falcon/shell`, `@falcon/management-console`, `@falcon/admin-console`.

### Micro-app repository folder structure (§5.14, `…md:620-695`)

Standalone repos look like:

```
falcon-microapp-surveys/
├── src/
│   ├── app/
│   │   ├── features/       business features
│   │   ├── pages/          route-level components
│   │   ├── components/     shared UI inside this micro-app
│   │   ├── services/       survey-api.service.ts, state.service.ts, utils.service.ts
│   │   ├── hooks/          small reusable reactive logic (useCurrentUser.ts)
│   │   ├── routes.ts
│   │   ├── app.config.ts
│   │   └── app.component.ts
│   ├── init.ts                  init/mount/unmount for host
│   ├── register.ts              window.FalconMicroApps registration
│   ├── main.ts                  bundler entry
│   ├── assets/{i18n,icons,styles}/
│   ├── environments/{environment,environment.prod}.ts
│   ├── bootstrap.ts             Module Federation entry
│   └── public-api.ts            Exposed module (MF)
├── config/{federation.config.js,microapp.json,host-mapping.json}
├── scripts/{build.js,deploy.js}
├── dist/, tools/
├── tailwind.config.js, angular.json, tsconfig.json, README.md
```

Allowed external dependencies (§5.14, `…md:822-838`): `@falcon/sdk` (1.x), `@angular/core`, `@angular/common`, `rxjs`, `tailwindcss`.

### Theming and layout inheritance (§5.9, §5.14 #4-#5, `…md:251-277`, `…md:1500-1554`)

- Shell controls Header/Footer/Menu, **Theme (CSS vars)**, language/RTL, container width, breakpoints, page title/breadcrumbs.
- Micro-apps consume theme variables: `var(--primary-color)`, `var(--secondary-color)`.
- Micro-apps **do not declare layout or global styles**.
- Micro-apps **MUST NOT use their own Tailwind config for colors/layout** — must extend from CSS vars, and **`corePlugins: { preflight: false }`** to prevent layout override.

### SDK token model (§5.14 sub-section, `…md:1267-1376`)

`InjectionToken`s in `libs/sdk/src/tokens/sdk-tokens.ts`:
- `FALCON_AUTH`, `FALCON_THEME`, `FALCON_LANGUAGE`, `FALCON_NOTIFIER`, `FALCON_CONTEXT`.

`provideFalconSDK(context)` returns `makeEnvironmentProviders([...])` injecting these tokens.

## Diagrams / images referenced

- None (the doc is code/text-heavy with ASCII diagrams).

## Cross-references

- Layout/auth boundary with `Security-Architecture.md` §4.6 (single OIDC client + user-type claims).
- Connects to `High-Level-Architecture.md` §2.1 (Frontend Layer overview).
- Naming conventions overridden by user memory `feedback_wiki_naming_conventions.md` (which mostly matches but uses `libs/core`, `libs/theme`, etc. without the `@falcon/` scope; we adopt the wiki here as authoritative).

## Implications for code

**Verified against code:**
- Nx monorepo exists ✓.
- Host-shell + Module Federation present ✓.
- Frontend never calls Zitadel directly ✓ (per fallback §6.5).
- No PrimeNG imports ✓ (per fallback §6.4).

**Conflicts with code:**

1. **Wiki says Angular 19/20** (§5.1: "based on **Angular 19**"; Deployment Document §Project Overview says **Angular 20**). Code is on **Angular 21.2.9** per project memory `project_falcon_revamp_v3_1_night_shift_results`. Frontend is **ahead of wiki**. Not a violation — the wiki simply hasn't caught up. Update wiki when comfortable.
2. **Library names diverge** — wiki: `libs/core`, `libs/theme`, `libs/i18n`, `libs/ui`, `libs/layout`, `libs/shared`, `libs/host-bridge`, `libs/federation`, `libs/sdk`. Code: `libs/falcon`, `libs/falcon-theme`, `libs/falcon-ui-core`, `libs/falcon-ui-tokens`, `libs/falcon-ui-react`, `libs/falcon-ui-vue`, `libs/falcon-studio`, `libs/sdk`. **Code never produced the wiki-prescribed shape.** Memory `feedback_wiki_naming_conventions.md` agrees this is the standing target.
3. **Workspace name** — wiki: `falcon-frontend` (§5.14) / `falcon-console-ui` (per `Design-Patterns-&-Guidelines.md`). Code: `falcon-web-platform-ui`. Drift in naming.
4. **Apps naming** — wiki uses `shell` / `management-console` / `admin-console`. Code uses `host-shell` / `management-console` / `admin-console`. **Soft drift** (shell vs host-shell).
5. **Falcon SDK as published npm package** — wiki §5.6 requires `@falcon/sdk` published to **Azure Artifacts / GitHub Packages private feed**. Code has `libs/sdk` source but **no evidence of publishing pipeline** (`npm publish` script, `.npmrc` for Azure feed). Implementation gap.
6. **External micro-app pattern** — wiki §5.4.4 + §5.7 + §5.11 describe micro-apps as separate Angular repos uploaded to CDN with `microapp.json` descriptor. Code uses **Module Federation** internally for `admin-console` and `management-console` (these are internal MF remotes, not external micro-apps). **No external-developer micro-app delivery flow exists yet.**
7. **No `<falcon-microapp-outlet>` component** observed in code. The dynamic loader / `window.FalconMicroApps` registration is **not present**. Implementation gap (wiki prescribes this architecture but it has not landed).
8. **SCSS in apps/libs** (fallback §6.1) — wiki doesn't explicitly forbid SCSS, but the SDK / theme uses **CSS variables only** (`var(--primary-color)`). Code still has 36 SCSS files in `apps/admin-console/.../organization-hierarchy/` and 8 SCSS files in `libs/`. **Wiki-silent on SCSS prohibition**, but user memory `project_brain_skills_primeng_purge.md` and `noor-instructions` skill enforce Tailwind utilities only.

**Summary:** the frontend has built **internally** what the wiki describes, but the **external micro-app delivery path and SDK publishing flow are still missing**, and **library names have drifted**.
