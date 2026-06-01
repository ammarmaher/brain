---
name: WebStorm Angular IDE Recognition Doctrine
description: Falcon Nx workspace — why WebStorm hides library Angular components from Angular LS and the 4-layer fix
type: reference
originSessionId: 41779d69-3536-4bd6-83aa-3281c89f12b5
---
# WebStorm + Nx + Angular — Component Recognition Doctrine

**🟢 LEARNING (2026-05-16)** — Captured during a long debugging session. Read this BEFORE any IDE-recognition / "Unknown HTML tag" / Angular LS problem in `falcon-web-platform-ui`.

## Symptom signature

- WebStorm Problems pane shows **Unknown HTML tag** for `<falcon-angular-*>`, `<falcon-*>` library selectors but LOCAL `<app-*>` selectors work
- "Unresolved pipe translate" / "Property X is not provided by any applicable directives"
- Ctrl-click on library tags doesn't navigate
- Errors are IDENTICAL across all three apps (admin-console / host-shell / management-console)
- The asymmetry between local-vs-library is the fingerprint

## Root cause (one sentence)

WebStorm 2024.3's **Nx-Angular plugin** (`.idea/nx-angular-config.xml`) classifies Angular projects by `project.json` build executor — only `@nx/angular:*` executors count — so Falcon's libraries (which use `nx:run-commands` or have no executor) are invisible to Angular Language Service.

## The 4-layer fix (in execution order)

**Layer 1 — Activate standard Angular LS detection**
- Rename `.idea/nx-angular-config.xml` → `.bak` (disables the plugin override)
- Create `angular.json` at workspace root listing apps AND libs as Angular projects
- Nx 16+ ignores angular.json so builds are unaffected

**Layer 2 — File-scope per tsconfig**
- Every `tsconfig.json` with `"include": []` (Project-References-only style) must get `"include": ["src/**/*.ts"]`
- Lib tsconfigs additionally need `angularCompilerOptions: { strictTemplates: true, ... }` to be recognized as Angular projects

**Layer 3 — Leaf tsconfig for excluded folders**
- If a folder is `exclude`-d by its parent tsconfig (e.g. Stencil excluding `src/angular-wrapper`), place a leaf `tsconfig.json` INSIDE that folder
- Angular LS walks UP from any file, finds the leaf first, treats the folder as a valid TS project. Parent's exclude still applies to other tools (Stencil build, etc.)

**Layer 4 — IDE settings (must verify inside WebStorm UI, can't do from CLI)**
- `Settings → Languages & Frameworks → TypeScript → Angular Service` = ENABLED
- Same page → TypeScript Version = workspace's (`node_modules/typescript`), NOT bundled
- `Settings → Plugins → "Angular and AngularJS"` = ENABLED
- If any is wrong, NONE of layers 1-3 matter

## Diagnostic flow (when this issue is suspected)

1. Do **local** `<app-*>` tags resolve? If NO → Layer 4 (IDE settings)
2. Do library `<falcon-angular-*>` tags resolve? If NO → continue
3. Is `.idea/nx-angular-config.xml` present (no `.bak`)? If YES → disable it (Layer 1)
4. Does `angular.json` exist at root and list libs? If NO → create/extend it (Layer 1)
5. Every tsconfig.json has non-empty `include` and lib tsconfigs have `angularCompilerOptions`? If NO → fix (Layer 2)
6. Excluded folders with components have leaf tsconfig? If NO → add it (Layer 3)
7. `tsc --noEmit -p <suspect>` clean? If NO → real code bugs, not tooling
8. Wipe WebStorm caches (`%LOCALAPPDATA%\JetBrains\WebStorm<ver>\{caches,index,LocalHistory}`) → full reindex on next start

## Why each step matters (deep model)

- **Angular LS asks Nx-Angular plugin: "which projects are Angular?"** → plugin asks Nx project graph → only `@nx/angular:*` executors qualify → libs invisible
- **Without the plugin's override**, WebStorm uses its standard detection: scan for `angular.json`, look for `@angular/core` in package.json, check tsconfigs with `angularCompilerOptions`
- **`include: []`** means a tsconfig is project-references-only (a "solution" file). LS using this config sees no files = no @Component metadata
- **Leaf tsconfig in excluded folder** = give that folder a "home" project the LS can use, without changing the parent's build behavior
- **The disappearing angular.json mystery**: Nx-Angular plugin actively DELETED angular.json because it considered the file a non-Nx artifact. Disabling the plugin = file persists

## Verified files inventory (falcon-web-platform-ui)

- `.idea/nx-angular-config.xml` → renamed `.bak` (disabled)
- `angular.json` (root, new) — 7 projects (3 apps + 4 libs)
- `apps/{admin-console,host-shell,management-console}/tsconfig.json` — added `include`
- `libs/{falcon,sdk,falcon-studio}/tsconfig.json` — added `include` + `angularCompilerOptions`
- `libs/falcon-ui-core/src/angular-wrapper/tsconfig.json` (new leaf)
- `libs/falcon-ui-core/web-types.json` (new) — separate concern, for Stencil custom elements
- `libs/falcon-ui-core/{generate-web-types,ensure-node-modules-junction}.cjs` — generators
- `libs/falcon-ui-core/build.cjs` — hooks added
- `libs/falcon-ui-core/package.json` — `web-types` field added
- `node_modules/@falcon/ui-core` (junction → `libs/falcon-ui-core`)
- `.idea/inspectionProfiles/Project_Default.xml` — 99 falcon-* tag allowlist

## Future-proofing — when adding a new Angular library

1. `project.json` ideally has `@nx/angular:*` executor; if not, add lib to `angular.json` manually
2. `tsconfig.json` MUST have `"include": ["src/**/*.ts"]` and `angularCompilerOptions`
3. If a sub-folder is excluded by parent tsconfig (e.g. Stencil + Angular wrapper pattern), add a leaf tsconfig inside

## Restoration (undo only if libs get proper Angular executors first)

```powershell
Rename-Item "C:\Falcon\Falcon\falcon-web-platform-ui\.idea\nx-angular-config.xml.bak" "nx-angular-config.xml"
```

## Cross-links

- **Vault doctrine (canonical)**: `C:\Falcon\falcon-wiki\00-MOCs\IDE-Setup-Doctrine-WebStorm-Angular-Nx.md` — the full version with diagrams
- **Workspace breadcrumb**: `C:\Falcon\Falcon\falcon-web-platform-ui\IDE-SETUP.md`

## Trigger phrases to recall this learning

- "WebStorm unknown html tag falcon-*"
- "Angular LS not seeing library components"
- "TypeScript compile clean but IDE shows errors"
- "Unresolved pipe translate"
- "angular.json keeps getting deleted"
- "Nx Angular library not recognized"
