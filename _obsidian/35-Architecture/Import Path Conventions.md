*** Architecture Rule Set — Import Path Conventions ***
*** SoT: Brain Outputs/understanding/frontend/architecture/IMPORT_PATH_CONVENTIONS.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Import Path Conventions

> Verbatim `tsconfig.base.json:16-71` paths block plus per-component canonical Angular import path. Angular wrapper consumers prefer `@falcon/ui-core/angular` (root barrel) for feature code; library-internal code prefers `@falcon/ui-core/angular/<name>` (per-component alias) to keep barrels lean and Nx graph crisp.

## Source-of-truth file
- [IMPORT_PATH_CONVENTIONS](../../outputs/understanding/frontend/architecture/IMPORT_PATH_CONVENTIONS.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-import-01 | `tsconfig.base.json:16-71` declares all `@falcon/*` paths — never bypass with relative imports across libs. | high | `tsconfig.base.json` |
| AR-import-02 | Angular wrapper imports for feature code MUST use `@falcon/ui-core/angular` (root barrel) — idiomatic, single import. | high | path alias |
| AR-import-03 | Library-internal code MUST use `@falcon/ui-core/angular/<component>` per-component alias — smaller barrel impact, crisper Nx graph. | medium | path alias |
| AR-import-04 | Stencil custom-elements loader is `@falcon/ui-core/loader` — Angular wrappers' `ngOnInit` calls `defineFalconComponent('falcon-<name>')` lazily. Host-shell does NOT eager-load `defineCustomElements()` (Wave 5 removed it). | high | `define-custom-elements.ts` |
| AR-import-05 | Tailwind helper functions for cross-framework Light DOM are at `@falcon/ui-core/tailwind` (root) or `@falcon/ui-core/tailwind/<name>` (per-component). These return Tailwind class strings used by Stencil `-tw` Light DOM tags AND Angular `useTailwind=true` mode. | high | path alias |
| AR-import-06 | Component-scoped tokens are at `@falcon/ui-tokens/components/<name>.tokens.css` — apps usually consume the whole tree via `@import "../../../libs/falcon-ui-tokens/src/index.css"`. | medium | path alias |
| AR-import-07 | Theme imports: `@falcon/theme` (CSS index), `@falcon/theme/tokens` (TS mirror), `@falcon/theme/*` (specific files). | medium | path alias |
| AR-import-08 | Legacy bespoke Angular components import from `@falcon` (the `shared-ui/index.ts` re-export path) — calendar façade, mobile-number, multiselect, stepper, form-field, photo-uploader, tree-panel, send-credentials-popup. | high | `shared-ui/index.ts` |
| AR-import-09 | Stencil-direct tags (no Angular wrapper) like `<falcon-organization-hierarchy-tree-tw>` use the tag directly in templates; types come from `@falcon/ui-core/angular`. Consumer MUST add `schemas: [CUSTOM_ELEMENTS_SCHEMA]`. | high | observed |

## Path aliases reference

```jsonc
"@falcon":                       ["./libs/falcon/src/index.ts"]
"@falcon/sdk":                   ["./libs/sdk/src/index.ts"]
"@falcon/studio":                ["./libs/falcon-studio/src/index.ts"]
"@falcon/theme":                 ["./libs/falcon-theme/src/index.css"]
"@falcon/theme/tokens":          ["./libs/falcon-theme/src/tokens.ts"]
"@falcon/theme/*":               ["./libs/falcon-theme/src/*"]
"@falcon/ui-core":               ["./libs/falcon-ui-core/src/index.ts"]
"@falcon/ui-core/loader":        ["./libs/falcon-ui-core/src/define-custom-elements.ts"]
"@falcon/ui-core/tailwind":      ["./libs/falcon-ui-core/src/tailwind/tailwind-classes.ts"]
"@falcon/ui-core/angular":       ["./libs/falcon-ui-core/src/angular-wrapper/index.ts"]
"@falcon/ui-core/angular/*":     ["./libs/falcon-ui-core/src/angular-wrapper/components/*/index.ts"]
"@falcon/ui-core/tailwind/*":    ["./libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts"]
"@falcon/ui-core/types":         ["./libs/falcon-ui-core/src/components.ts"]
"@falcon/ui-tokens/*":           ["./libs/falcon-ui-tokens/src/*"]
"@falcon/ui-react":              ["./libs/falcon-ui-react/src/index.ts"]
"@falcon/ui-vue":                ["./libs/falcon-ui-vue/src/index.ts"]
"@falcon/ui-showcase-data":      ["./libs/falcon-ui-showcase-data/src/index.ts"]
"@falcon/ui-showcase-data/docs/*": ["./libs/falcon-ui-showcase-data/src/docs/*"]
```

## Forbidden patterns
- Relative imports across libs (e.g. `../../../falcon-ui-core/src/...`) — use TS path aliases.
- Importing `@angular/material` — Material is NOT a dependency.
- Importing `from 'primeng/...'` — purged Wave PR-8.
- Importing a Stencil component directly without going through its Angular wrapper (loses CVA, change-detection, type-safety).

## Recommended patterns
- One import line per file: `import { FalconAngularInputComponent, FalconAngularDropdownComponent } from '@falcon/ui-core/angular';`
- Type-only imports: `import type { FalconDropdownOption, FalconInputSize } from '@falcon/ui-core/angular';`
- App tailwind.css: `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` + `@import "../../../libs/falcon-ui-tokens/src/index.css"`.

## Related
- See [[Wrapper Import Decision Tree]] for full decision flow when picking a wrapper.
- See [[Barrel Exports]] for which symbols live where.

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
