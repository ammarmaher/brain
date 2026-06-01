---
name: admin-console vitest runner broken
description: nx test admin-console fails to collect ANY spec — analogjs router plugin crash
type: project
originSessionId: c2368076-17a3-4358-abeb-483b2fc4f464
---
🔴 BLOCKED 2026-05-19. `npx nx test admin-console` cannot run any spec. The
`@analogjs/vite-plugin-angular` `analogjs-router-optimization` plugin throws
`TypeError: The argument 'path' must be ... without null bytes. Received
'\x00virtual:@analogjs/vite-plugin-angular:raw:...'` during transform → every
suite reports "Failed Suites 1 / Tests: no tests". Verified workspace-wide:
both `add-client-state-signals.spec.ts` and `wire-builders.spec.ts` fail
identically — it is NOT spec-specific.

**Why:** tooling/version incompatibility in the analog vite plugin's
router-plugin.js (`node_modules/@analogjs/vite-plugin-angular/src/lib/router-plugin.js:17`).
**How to apply:** to verify a spec without the runner, type-check instead:
`npx tsc -p apps/admin-console/tsconfig.spec.json --noEmit`. Do not edit the
vite/analog config to "fix" this unless that is the explicit task.
