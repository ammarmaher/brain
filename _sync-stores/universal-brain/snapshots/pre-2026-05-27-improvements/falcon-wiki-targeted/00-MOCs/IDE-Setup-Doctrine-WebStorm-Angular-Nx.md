---
type: reference
role: ide-setup-doctrine
audience: developers + ai-agents
scope: falcon-web-platform-ui
ide: webstorm | intellij-idea-ultimate
nx-version: "22.x"
angular-version: "21.x"
updated: 2026-05-16
---

> [!tldr]
> WebStorm + Nx + Angular component recognition is broken **by default** in this workspace because WebStorm's Nx-Angular plugin classifies Angular projects by their build executor — and Falcon's library projects (`libs/falcon`, `libs/sdk`, `libs/falcon-studio`, `libs/falcon-ui-core/src/angular-wrapper`) use `nx:run-commands` or have no executor, so the plugin marks them as non-Angular and hides their `@Component` metadata from Angular LS. This MOC documents the symptoms, root cause, four-layer fix, diagnostic checklist, and future-proofing rules.

# IDE Setup Doctrine — WebStorm + Angular + Nx (Falcon)

## Symptoms (what you'll see in the wild)

When this issue is active, every consuming template across **every Angular app** in the workspace shows the same family of errors in WebStorm's Problems pane:

| Error | Where | What it really means |
|---|---|---|
| `Unknown html tag falcon-angular-button` (and any other `<falcon-angular-*>`) | Templates | Angular LS doesn't know the component's selector |
| `Unknown html tag falcon-send-credentials-popup`, `falcon-view-toggle`, etc. | Templates | Same — any selector defined in a library is invisible |
| `Property label is not provided by any applicable directives nor by <X> element` | Templates | Angular LS can't bind `[label]` because it can't find the matching directive |
| `Event falconClick is not emitted by any applicable directives nor by <X> element` | Templates | Same — `(falconClick)` binding rejected |
| `Unresolved pipe translate` | Templates | The `TranslatePipe` from `@falcon` is invisible |
| Ctrl-click on `<falcon-angular-stepper>` does nothing | Editor | Selector → class navigation broken |
| `ng-template` flagged as unknown | Worst case | Angular LS isn't running at all |

The dead giveaway pattern: **local `<app-*>` selectors work, library `<falcon-angular-*>` / `<falcon-*>` selectors don't.** That asymmetry is the fingerprint.

## Root cause (the one-paragraph explanation)

WebStorm 2024.3+ ships an **Nx-Angular plugin** that registers itself via `.idea/nx-angular-config.xml`. When active, it overrides WebStorm's standard Angular project detection and delegates to **Nx's project graph**. Nx classifies a project as Angular only if its `project.json` declares a build target with an executor matching `@nx/angular:*` (e.g. `@nx/angular:webpack-browser`, `@nx/angular:ng-packagr`). Falcon's libraries use generic executors (`nx:run-commands`) or have no build target — so Nx tells the plugin they are NOT Angular, and the plugin tells Angular LS to skip them. **Their `@Component` / `@Pipe` / `@Directive` decorators are never indexed**, so consuming templates have no way to resolve their selectors. Bonus side-effect: the plugin actively deletes any `angular.json` at workspace root because it considers the file a non-Nx artifact.

Source: `[CODE]` `.idea/nx-angular-config.xml` + `[CODE]` `apps/*/project.json` `targets.build.executor` + `[CODE]` `libs/*/project.json` `targets`.

## The 4-layer fix (architecture)

```
┌───────────────────────────────────────────────────────────────────┐
│ LAYER 1 — Activate standard Angular LS detection                  │
│   • Disable Nx-Angular plugin override                            │
│   • Create workspace-root angular.json listing apps + libs        │
├───────────────────────────────────────────────────────────────────┤
│ LAYER 2 — File-scope per tsconfig                                 │
│   • Add include: ["src/**/*.ts"] to every tsconfig.json that had  │
│     empty include (project-references-only style)                 │
│   • Add angularCompilerOptions to lib tsconfigs (signals "Angular │
│     project" to WebStorm)                                         │
├───────────────────────────────────────────────────────────────────┤
│ LAYER 3 — Leaf tsconfig for folders excluded by parent            │
│   • If a folder is exclude-d in parent tsconfig (e.g. Stencil's   │
│     tsconfig.json excludes src/angular-wrapper), create a leaf    │
│     tsconfig.json inside it — Angular LS finds the leaf first     │
│     when walking up, Stencil's build still uses the parent        │
├───────────────────────────────────────────────────────────────────┤
│ LAYER 4 — Verify IDE-side settings (not config — IDE preferences) │
│   • Settings → TypeScript → Angular Service: ENABLED              │
│   • Settings → TypeScript → TypeScript Version: workspace TS      │
│     (node_modules/typescript) — NOT bundled                       │
│   • Settings → Plugins → "Angular and AngularJS": ENABLED         │
└───────────────────────────────────────────────────────────────────┘
```

### Layer 1 — activate standard detection

```powershell
# Disable Nx-Angular plugin override (preserved as .bak)
Rename-Item "$workspace\.idea\nx-angular-config.xml" "nx-angular-config.xml.bak"
```

Then create `angular.json` at workspace root listing **all** Angular projects (apps AND libs):

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "apps",
  "projects": {
    "admin-console":          { "projectType": "application", "root": "apps/admin-console",                              "sourceRoot": "apps/admin-console/src",                              "prefix": "app",             "architect": { "build": { "builder": "@angular-devkit/build-angular:application", "options": { "tsConfig": "apps/admin-console/tsconfig.app.json", "outputPath": "dist/apps/admin-console", "index": "apps/admin-console/src/index.html", "browser": "apps/admin-console/src/main.ts" } } } },
    "host-shell":             { "projectType": "application", "root": "apps/host-shell",                                  "sourceRoot": "apps/host-shell/src",                                  "prefix": "app",             "architect": { "build": { "builder": "@angular-devkit/build-angular:application", "options": { "tsConfig": "apps/host-shell/tsconfig.app.json",         "outputPath": "dist/apps/host-shell",     "index": "apps/host-shell/src/index.html",     "browser": "apps/host-shell/src/main.ts" } } } },
    "management-console":     { "projectType": "application", "root": "apps/management-console",                         "sourceRoot": "apps/management-console/src",                         "prefix": "app",             "architect": { "build": { "builder": "@angular-devkit/build-angular:application", "options": { "tsConfig": "apps/management-console/tsconfig.app.json", "outputPath": "dist/apps/management-console", "index": "apps/management-console/src/index.html", "browser": "apps/management-console/src/main.ts" } } } },
    "falcon":                 { "projectType": "library",     "root": "libs/falcon",                                      "sourceRoot": "libs/falcon/src",                                      "prefix": "falcon",          "architect": { "build": { "builder": "@angular-devkit/build-angular:ng-packagr", "options": { "project": "libs/falcon/tsconfig.lib.json",                "tsConfig": "libs/falcon/tsconfig.lib.json" } } } },
    "falcon-ui-core-angular": { "projectType": "library",     "root": "libs/falcon-ui-core/src/angular-wrapper",         "sourceRoot": "libs/falcon-ui-core/src/angular-wrapper",         "prefix": "falcon-angular",  "architect": { "build": { "builder": "@angular-devkit/build-angular:ng-packagr", "options": { "project": "libs/falcon-ui-core/src/angular-wrapper/tsconfig.json", "tsConfig": "libs/falcon-ui-core/src/angular-wrapper/tsconfig.json" } } } },
    "sdk":                    { "projectType": "library",     "root": "libs/sdk",                                         "sourceRoot": "libs/sdk/src",                                         "prefix": "falcon-sdk",      "architect": { "build": { "builder": "@angular-devkit/build-angular:ng-packagr", "options": { "project": "libs/sdk/tsconfig.lib.json",                  "tsConfig": "libs/sdk/tsconfig.lib.json" } } } },
    "falcon-studio":          { "projectType": "library",     "root": "libs/falcon-studio",                              "sourceRoot": "libs/falcon-studio/src",                              "prefix": "falcon-studio",   "architect": { "build": { "builder": "@angular-devkit/build-angular:ng-packagr", "options": { "project": "libs/falcon-studio/tsconfig.lib.json",         "tsConfig": "libs/falcon-studio/tsconfig.lib.json" } } } }
  }
}
```

**This is IDE-only.** Modern Nx (16+) ignores `angular.json` and uses `project.json` files exclusively — your Nx builds, `nx run`, `nx serve` are unaffected.

### Layer 2 — file-scope per tsconfig

Every Nx-style `tsconfig.json` that was project-references-only (i.e. had `"files": [], "include": []`) needs to be made visible to Angular LS:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { ... },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  },
  "files": [],
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"],
  "references": [
    { "path": "./tsconfig.lib.json" }
  ]
}
```

The `references` block is preserved — Nx's build chain still uses TypeScript Project References. The `include` is purely for the language service.

### Layer 3 — leaf tsconfig for excluded folders

`libs/falcon-ui-core/tsconfig.json` is Stencil's build config; it correctly excludes `src/angular-wrapper` so Stencil doesn't try to compile Angular components as JSX. But this exclude also hides the wrapper from Angular LS. Fix: place a leaf `tsconfig.json` INSIDE the excluded folder:

```
libs/falcon-ui-core/
├── tsconfig.json                       # Stencil's — excludes angular-wrapper
└── src/
    └── angular-wrapper/
        └── tsconfig.json               # NEW LEAF — Angular LS uses this for files in this folder
```

Leaf content:

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "module": "preserve",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["DOM", "ES2022"],
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "strict": true
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  },
  "include": ["**/*.ts"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}
```

### Layer 4 — IDE settings (must be verified inside WebStorm)

The four-layer fix only works if WebStorm is configured to USE the layers we built. These three settings must all be correct — **and we can't verify them from CLI, only the user can click through them**:

1. `File → Settings → Languages & Frameworks → TypeScript` → "Angular Service" checkbox → **enabled**
2. Same page → "TypeScript Version" dropdown → **workspace's TS** (`node_modules/typescript`), not bundled
3. `File → Settings → Plugins → Installed` → "Angular and AngularJS" → **enabled**

If any of these is wrong, NOTHING else matters. This is layer 4 because it's the hidden multiplier on top of all the config.

## Diagnostic checklist (when this issue is suspected)

Run these in order. The first one that fails points at the cause.

| # | Check | Pass | Fail → action |
|---|---|---|---|
| 1 | Open any `*.component.html` — do the **local `<app-*>` tags** resolve? | Layer 4 IDE settings are correct | Layer 4 — IDE settings or plugin disabled |
| 2 | Do `<falcon-angular-*>` library tags resolve? | All four layers OK | Continue diagnostics |
| 3 | Is `.idea/nx-angular-config.xml` present (no `.bak`)? | — | Disable it (Layer 1) |
| 4 | Does `angular.json` exist at workspace root and list ALL apps + libs? | — | Create/extend it (Layer 1) |
| 5 | Does every `apps/*/tsconfig.json` + `libs/*/tsconfig.json` have non-empty `include`? | — | Add `include: ["src/**/*.ts"]` (Layer 2) |
| 6 | Does every lib `tsconfig.json` have `angularCompilerOptions`? | — | Add it (Layer 2) |
| 7 | For any folder excluded in parent tsconfig — is there a leaf tsconfig.json inside? | — | Create one (Layer 3) |
| 8 | Run `tsc --noEmit -p <suspect-tsconfig>` — does it report ANY errors? | Clean | Real TS errors are present — fix code, NOT config |
| 9 | After all of the above — wiped WebStorm caches and full reindex? | — | Close WebStorm; delete `%LOCALAPPDATA%\JetBrains\WebStorm<ver>\{caches,index,LocalHistory}`; reopen |

## File inventory — what we created / modified in falcon-web-platform-ui (2026-05-16)

| File | Status | Purpose |
|---|---|---|
| `.idea/nx-angular-config.xml` | RENAMED → `.bak` | Disabled the plugin that excluded libs + deleted angular.json |
| `angular.json` | NEW (workspace root) | Standard Angular workspace marker — 7 projects (3 apps + 4 libs) |
| `apps/admin-console/tsconfig.json` | MODIFIED — added `include`, `angularCompilerOptions` (already had angularOptions in original) | Angular LS file scope for admin-console |
| `apps/host-shell/tsconfig.json` | MODIFIED — added `include` | Same |
| `apps/management-console/tsconfig.json` | MODIFIED — added `include` | Same |
| `libs/falcon/tsconfig.json` | MODIFIED — added `include` + `angularCompilerOptions` | Mark libs/falcon as Angular project |
| `libs/sdk/tsconfig.json` | MODIFIED — same | Same |
| `libs/falcon-studio/tsconfig.json` | MODIFIED — same | Same |
| `libs/falcon-ui-core/src/angular-wrapper/tsconfig.json` | NEW (leaf) | Angular LS sees the wrapper folder despite Stencil's parent-level exclude |
| `libs/falcon-ui-core/web-types.json` | NEW | Stencil custom-elements manifest (99 `<falcon-*>` tags) — different from Angular components |
| `libs/falcon-ui-core/generate-web-types.cjs` | NEW | Generator script — scans `.tsx` files, regenerates manifest each build |
| `libs/falcon-ui-core/ensure-node-modules-junction.cjs` | NEW | Self-healing junction creator |
| `libs/falcon-ui-core/build.cjs` | MODIFIED | Hooks junction + manifest generators into post-build flow |
| `libs/falcon-ui-core/package.json` | MODIFIED | Added `"web-types": "./web-types.json"` field |
| `node_modules/@falcon/ui-core` | JUNCTION | NTFS junction → `libs/falcon-ui-core` — makes path-mapped lib appear as installed npm package |
| `.idea/inspectionProfiles/Project_Default.xml` | MODIFIED | Added 99 `<falcon-*>` Stencil tags to HtmlUnknownTag allowlist (fallback for raw Stencil tags) |

## Future-proofing — when adding a new Angular library

To avoid having to redo this work for new libs, follow this checklist when creating a new Angular library:

1. **`project.json`** — ideally give the lib a `@nx/angular:*` build executor. Even a minimal one. If you must use `nx:run-commands` or no executor, add the lib to `angular.json` (manual workaround).
2. **`tsconfig.json`** (at lib root) — MUST have:
   ```json
   "include": ["src/**/*.ts"],
   "angularCompilerOptions": { "strictTemplates": true, ... }
   ```
   NOT empty `include: []`. If empty, Angular LS sees no files.
3. **`tsconfig.lib.json`** — extends tsconfig.json. Adds the build-specific options.
4. **`angular.json` (workspace root)** — add the lib as a project entry. Even a stub entry is enough.
5. **If the lib has a `src/` subfolder excluded by a parent tsconfig** — add a leaf tsconfig.json inside that subfolder mirroring the wrapper pattern.

## Restoration (if you ever need to undo)

To restore the Nx-Angular plugin (e.g. for Nx Console integration):

```powershell
Rename-Item "C:\Falcon\Falcon\falcon-web-platform-ui\.idea\nx-angular-config.xml.bak" "nx-angular-config.xml"
```

**But only after giving libs proper `@nx/angular:*` build executors** — otherwise libraries become invisible to Angular LS again. The cleanest long-term path is to add real `@nx/angular:ng-packagr` (or `@nx/angular:package`) targets to each Angular library and then re-enable the plugin.

## Related notes

- [[AI-Agent-Onboarding]] — the canonical entry point for AI agents; this doctrine is linked from there
- [[../Conventions]] — vault conventions used in this MOC
- `_mounts/services/falcon-web-platform-ui/` — the actual codebase this doctrine applies to
- `_mounts/brain-outputs/wiki-architect/` — architecture canonical source

## Source-prefix tags used in this note

- `[CODE]` — facts pulled from the actual project files (project.json, tsconfig.json, etc.)
- `[INFERRED]` — best-practice extrapolation (e.g. the "Future-proofing" section is partly inferred from how the fix worked; verify on each new lib)
