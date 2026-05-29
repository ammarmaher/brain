# 06 — Zero Warning Policy

Host Shell and Admin Console must not have TypeScript, Angular, ESLint, unused code, unused import, unused variable, wrong import path, or TS Lens warnings after Night Shift Mode finishes.

Scope:

- `apps/host-shell`
- `apps/admin-console`
- shared libraries used by them

Do not touch Management Console.

## Warning Types to Detect and Fix

1. Unused imports
2. Unused variables
3. Unused private methods
4. Unused public methods if clearly not referenced by template or external API
5. Unused signals
6. Unused services
7. Unused injected dependencies
8. Unused models/interfaces/types/DTOs/classes
9. Unused constants
10. Unused helper functions
11. Duplicate imports
12. Wrong import ordering
13. Long relative imports that should use existing path aliases
14. Broken path alias usage
15. Import path points deeper than needed
16. File exports something never used
17. Dead code
18. Commented-out code
19. Deprecated API warnings
20. TypeScript strict warnings
21. Angular template warnings
22. ESLint warnings
23. Prettier/format warnings
24. TS Lens / TypeScript language service warnings

## Safe to Remove

- unused import
- unused local variable
- unused private method
- unused private property
- unused injected service
- unused local type/interface
- unused local constant
- unused commented-out code

## Do Not Remove Automatically If

- public API exported from shared library
- used dynamically
- referenced by Angular template
- referenced by route config
- referenced by dependency injection token
- referenced by string selector
- referenced by config JSON
- referenced by tests
- part of public contract
- part of library barrel export
- intentionally reserved for future extension

If unsure, report it.

## Import Path Cleanup

Fix safe cases:

1. duplicate imports
2. imports from wrong deep paths
3. imports with too many relative levels like `../../../../../`
4. imports that should use existing tsconfig path aliases
5. broken alias usage
6. imports that violate Nx boundaries

Before changing imports:

1. Read tsconfig paths.
2. Read existing project import conventions.
3. Follow Falcon/Nx boundaries.
4. Avoid circular dependencies.
5. Do not import admin-console internals into host-shell.
6. Do not import app code into shared libraries.
7. Apps may import shared libraries.
8. Shared libraries must not depend on apps.

## Angular Template Warning Rule

Before deleting a method/property, check:

- `.html` template
- host binding
- template binding
- event handler
- route config
- component metadata
- provider config
- dynamic component outlet
- JSON config

Do not delete until template usage is checked.

## Validation

Run available checks:

- TypeScript check
- ESLint
- Angular build for host-shell
- Angular build for admin-console
- Nx affected lint/build if available
- Formatter check if available

Final report must include Zero Warning Cleanup section.
