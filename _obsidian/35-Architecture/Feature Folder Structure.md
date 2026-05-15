---
type: architecture-rules
audit-source: Feature Folder Structure
rule-count: 9
created: 2026-05-15
---
*** Architecture Rule Set — Feature Folder Structure ***
*** SoT: Brain Outputs/understanding/frontend/architecture/FEATURE_FOLDER_STRUCTURE.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Feature Folder Structure

> Every feature folder follows the one-file-per-type-folder convention: `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts`, `guards/guards.ts`. Documented exceptions: signal-state services, mock data files, validation files. Memory rule `feedback_folder_structure_pattern.md`.

## Source-of-truth file
- [FEATURE_FOLDER_STRUCTURE](../../outputs/understanding/frontend/architecture/FEATURE_FOLDER_STRUCTURE.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-folder-01 | Every feature uses ONE file per type-folder: `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts`, `guards/guards.ts` — multiple classes/interfaces in one file. | high | Memory `feedback_folder_structure_pattern.md` · verified org-hierarchy folders |
| AR-folder-02 | `<feature>.routes.ts` MUST sit at the feature folder root and export both default and named (`<feature>Routes`). | high | `organization-hierarchy.routes.ts` |
| AR-folder-03 | Sub-feature components MUST nest under `components/<sub-feature>/<component>/` with kebab-case folder names. | medium | observed in admin-console org-hierarchy |
| AR-folder-04 | Component triplet stays per Angular convention: `*.component.html` + `*.component.scss` (often near-empty) + `*.component.ts`. | medium | Angular standard |
| AR-folder-05 | Signal-state services LIVE OUTSIDE the `services.ts` one-file rule (documented exception) — file name `<feature>-page-state.service.ts` alongside `services.ts`. | high | `hierarchy-page-state.service.ts` |
| AR-folder-06 | Mock data files (`mock-tree.ts`, `mock-applications.ts`) live alongside services as separate files (exception for fixture data). | low | observed in admin-console |
| AR-folder-07 | Validation files (`validators.ts`, `validation-messages.ts`) live alongside services because they share state-service deps (exception). | medium | observed |
| AR-folder-08 | File-naming uses kebab-case for files AND folders; Angular type separators are dots (`*.component.ts`, `*.service.ts`, `*.routes.ts`). Nx `nx.json` locks `typeSeparator: "."`. | high | `nx.json` |
| AR-folder-09 | `guards/guards.ts` added ONLY if route-level access control is needed (functional `CanActivateFn`). | medium | conditional |
| AR-folder-10 | `resolvers/resolvers.ts` added ONLY if data preloading is required. | medium | conditional |

## Forbidden patterns
- Multiple files in `models/` (e.g. `node.model.ts` + `user.model.ts`) — consolidate into `models/models.ts`.
- Multiple files in `services/` for HTTP services — consolidate into `services/services.ts`.
- PascalCase or snake_case folder names — kebab-case only.
- Sub-feature components flattened — must nest under `components/<sub-feature>/`.

## Recommended folder template for NEW features

```
apps/<app>/src/app/features/<feature-name>/
├── <feature-name>.routes.ts
├── components/
│   ├── <feature-name>-menu.component.{ts,html}
│   └── <sub-feature>/
│       └── <component>.component.{ts,html}
├── models/
│   └── models.ts
├── services/
│   ├── services.ts                       (HTTP services)
│   └── <feature-name>-page-state.service.ts   (signal state — exception)
├── guards/guards.ts        (optional)
└── resolvers/resolvers.ts  (optional)
```

## Wire-up rule
- Add to `app.routes.ts` via `loadChildren: () => import('./features/<feature-name>/<feature-name>.routes')`.

## Library-side mirroring
- Libraries use `libs/<lib>/src/lib/<subdomain>/` intermediate folder (Nx Angular library convention).
- Apps stay flatter — no `lib/` layer.

## Related component notes
- [[Falcon Data Table]] · [[Falcon Drawer]] — components consumed inside organization-hierarchy feature folders.

## Tags

#type/architecture-rules

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
