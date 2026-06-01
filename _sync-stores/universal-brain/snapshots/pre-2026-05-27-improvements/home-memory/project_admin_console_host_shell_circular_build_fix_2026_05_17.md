---
name: admin-console ↔ host-shell circular build fix
description: Wave 5.3 added two admin-console-internal specs under apps/host-shell/tests/ that reached across via relative paths; moved them into admin-console/tests/ to break the Nx task-graph cycle
type: project
originSessionId: c2f0ce24-ff70-467b-86b0-38e2d09554cb
---
🟢 LANDED 2026-05-17. Build error reported: `admin-console:build:production --> host-shell:build:development --> admin-console:build:production` (Nx circular dependency).

**Root cause:** Wave 5.3 (today) added two unit specs at `apps/host-shell/tests/`:
- [CODE] `apps/host-shell/tests/add-client-state-signals.spec.ts:25-33` — imports 6 symbols from `../../../apps/admin-console/src/...`
- [CODE] `apps/host-shell/tests/wire-builders.spec.ts:17-23` — imports from `../../../apps/admin-console/src/.../add-client-wizard/models/models`

Nx's project-graph plugin scans every `.ts` under a project's source root (`apps/host-shell/`) regardless of which tsconfig includes it for build, so these imports added a **static** edge `host-shell → admin-console` to the graph. Combined with admin-console's pre-existing `@host-shell/shared/*` imports (TS path alias in [CODE] `tsconfig.base.json:19-21`) which create `admin-console → host-shell`, the result was a cycle. The cycle surfaces on every build of admin-console because [CODE] `nx.json:37-41` sets `@nx/angular:webpack-browser` to `dependsOn: ["^build"]`.

**Why:** Misplaced tests — both files test admin-console-internal code (`AddClientStateSlice`, `buildCreateAccountWireRequest`); they have zero host-shell coupling. They were dropped in the wrong project folder.

**How to apply (fix):**
1. **Move** both specs from `apps/host-shell/tests/` → `apps/admin-console/tests/`.
2. **Rewrite imports** `../../../apps/admin-console/src/...` → `../src/...` (now relative within admin-console).
3. **Add** `"tests/**/*.spec.ts"` + `"tests/**/*.test.ts"` to [CODE] `apps/admin-console/tsconfig.spec.json:include` (matches the pattern host-shell already uses for its own legitimate tests). `apps/admin-console/vite.config.mts:20` already includes `{src,tests}/**` so vitest discovery works.

**Verification:**
- Nx graph: `host-shell → admin-console` edges = 0 (was 1); `admin-console → host-shell` legitimate `@host-shell/shared/*` edge intact.
- `nx build admin-console` GREEN, hash `47346a387baf6945`, 20.4s.
- `nx build host-shell` GREEN (no regression from removing those specs — they were never in host-shell's `tsconfig.app.json`).

**Prevention rule for future waves:** Spec files for project X must live under `apps/X/tests/` or `apps/X/src/.../*.spec.ts`. A spec that imports `../../../apps/<other>/src/...` is a misplaced test — move it to the project it actually tests. Cross-app spec-level coupling is the only thing that can poison the Nx project graph without showing up at build-time review.

Other host-shell tests untouched: `falcon-completion-success-dialog.spec.ts`, `falcon-http-ui-routing.spec.ts`, `falcon-notification-stack-position.spec.ts`, `falcon-sending-credentials-dialog.spec.ts` — all genuinely host-shell, all stay.
