# Agent 6 — COMPONENT_COVERAGE

Agent 6 does NOT produce per-component folders. Coverage here = audit areas + status.

| Audit area | Status | Source files read | Gaps found | Notes |
|---|---|---|---|---|
| Workspace topology (apps + libs) | COVERED | 13 | 0 | `WORKSPACE_TOPOLOGY.md` |
| Module Federation share rules | COVERED | 6 (3 mf configs + 2 manifests + readme) | 0 | `MODULE_FEDERATION_PATTERNS.md` |
| Remote-route service + bootstrap | COVERED | 3 (`bootstrap.ts`, both `remote-route.service.ts` files) | 1 (dead-code sibling) | `ROUTES_AND_MF_AUDIT.md` |
| Manifest provider abstraction | COVERED | 3 (`remote-manifest.types.ts`, `json-file-remote-manifest.provider.ts`, `api-remote-manifest.provider.ts`) | 0 | `MODULE_FEDERATION_PATTERNS.md` |
| App routes — host-shell | COVERED | 1 (`app.routes.ts`) | 0 (HashLocation + visualTest bypass noted) | `ROUTES_AND_MF_AUDIT.md` |
| App routes — admin-console | COVERED | 1 (`app.routes.ts`) | 1 (`adminConsoleGuard` commented out) | `ROUTES_AND_MF_AUDIT.md` |
| App routes — management-console | COVERED | 1 (`app.routes.ts`) | 0 | `ROUTES_AND_MF_AUDIT.md` |
| App config providers | COVERED | 3 (`app.config.ts` × 3) | 0 (PrimeNGThemeService legacy name noted) | `AUTH_AND_FACADE_PATTERNS.md` |
| Auth + interceptors | COVERED | 3 (`auth.guard.ts`, `request-interceptor.ts`, `response-interceptor.ts`, `auth-api.service.ts`) | 0 | `AUTH_AND_FACADE_PATTERNS.md` |
| Falcon barrel — `libs/falcon/src/index.ts` + 6 sub-folders | COVERED | 7 | 0 | `BARREL_EXPORTS_AUDIT.md` |
| Falcon UI Core barrel — `libs/falcon-ui-core/src/index.ts` + `angular-wrapper/index.ts` | COVERED | 2 | 0 | `BARREL_EXPORTS_AUDIT.md` |
| Falcon Tokens barrel — `libs/falcon-ui-tokens/src/index.css` | COVERED | 1 | 0 | `BARREL_EXPORTS_AUDIT.md` |
| Falcon Theme barrel — `libs/falcon-theme/src/index.css` + `tokens.ts` | COVERED | 2 | 0 | `BARREL_EXPORTS_AUDIT.md` |
| SDK barrel — `libs/sdk/src/index.ts` | COVERED | 1 | 0 | `BARREL_EXPORTS_AUDIT.md` |
| Showcase data barrel — `libs/falcon-ui-showcase-data/src/index.ts` | COVERED | 2 (`index.ts` + `registry.json`) | 0 | `BARREL_EXPORTS_AUDIT.md` |
| `tsconfig.base.json` aliases | COVERED | 1 | 0 | `IMPORT_PATH_CONVENTIONS.md` |
| Feature folder structure — admin-console | COVERED | 2 (`organization-hierarchy/` + `organization-hierarchy-page/`) | 0 | `FEATURE_FOLDER_STRUCTURE.md` |
| Feature folder structure — management-console | COVERED | 1 (`organization-hierarchy-page/`) | 0 | `FEATURE_FOLDER_STRUCTURE.md` |
| Signal state — `hierarchy-page-state.service.ts` | COVERED | 1 (head) | 0 | `STATE_AND_SIGNAL_PATTERNS.md` |
| Component usage matrix | COVERED | 58 components × 3 apps (grepped) | 24 unused | `COMPONENT_USAGE_MATRIX.md` |
| Unused / deprecated components | COVERED | derived from matrix | — | `UNUSED_AND_DEPRECATED_COMPONENTS.md` |
| Quality gates — 12 gate scripts | COVERED | 12 (gate-01 → gate-12) | 0 | `QUALITY_GATES_AUDIT.md` |
| Forbidden-pattern grep | COVERED | full `apps/` tree | 23+ violations cited | `FORBIDDEN_PATTERNS_OBSERVED.md` |
| Wrapper import decision tree | COVERED | derived | 0 | `WRAPPER_IMPORT_DECISION_TREE.md` |
| Architecture upgrade candidates | COVERED | derived | 18 backlog items | `UPGRADE_CANDIDATES.md` |
