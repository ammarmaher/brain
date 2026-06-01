---
name: project_nx_enforce_module_boundaries_lint_crash_fix_2026_05_29
description: nx 22.7.1 @nx/enforce-module-boundaries autofix ENOENT crash on wildcard tsconfig path mappings — fixed by lib-scoped rule-disable for falcon-ui-core; plus admin-console sequential-batch build race finding
metadata: 
  node_type: memory
  type: project
  originSessionId: 52fd135f-5d7e-40c9-a0ce-ad2b622afd7e
---

🟢 LINT-CRASH FIXED + BUILDS PROVEN UNAFFECTED · falcon-web-platform-ui (`C:\Falcon\Falcon\falcon-web-platform-ui`) · NO COMMITS.

## The crash
`npx nx lint falcon-ui-core` ABORTED with ENOENT (a thrown error, not a lint violation) for EVERY file under `angular-wrapper/components/**` (first hit alphabetically = `falcon-accordion.component.ts:16`). Pre-existing; reproduces on untouched files.

**Root cause** [CODE] `@nx/eslint-plugin@22.7.1`: the `@nx/enforce-module-boundaries` AUTOFIX (not a rule violation) crashes. `enforce-module-boundaries.js:192-211` substitutes the wildcard `*` ONLY when the deep relative import resolves UNDER the wildcard's base dir. A component doing `from '../../../tailwind/tailwind-classes'` resolves to `src/tailwind/` — NOT under `components/` — so `startsWith(basePath)` is false, the literal `*` survives into `getRelativeImportPath` → `ast-utils.js:104 readFileSync('...components/*/index.ts')` → ENOENT → aborts the whole run. Triggered by tsconfig.base.json WILDCARD mappings: `@falcon/ui-core/angular/*`→`components/*/index.ts` and `@falcon/ui-core/tailwind/*`→`tailwind/*-tailwind-classes.ts`. **ESLint computes fixes EAGERLY during reporting (via `normalizeFixes`/`FileReport.addRuleMessage`), so the fixer throws even WITHOUT `--fix`.** The autofix is also semantically wrong here — these are INTRA-library sibling-entry-point imports, not real cross-library violations.

## The fix (lowest blast radius — option b)
Added a flat-config override in [CODE] `eslint.config.mjs` (immediately after the global enforce-module-boundaries block) disabling the rule for `libs/falcon-ui-core/**/*.{ts,tsx,js,jsx}` ONLY. One tracked file, +38 lines, no new deps, no node_modules patch/postinstall, no tsconfig change. Result: `nx lint falcon-ui-core` now RUNS TO COMPLETION reporting `445 problems (125 errors, 320 warnings)` — ordinary pre-existing violations previously MASKED by the crash; no ENOENT. Rule stays fully active for every other project.

**Rejected:** (a) upgrade @nx/eslint-plugin = all `@nx/*` pinned to 22.7.1, must bump whole suite (high blast radius); patch-package = no infra exists (npm not pnpm, no postinstall) → would add a per-install/CI hook. (c) reshape `@falcon/ui-core/angular/*` mapping = global tsconfig.base.json, threatens builds. Remove the override once @nx/eslint-plugin is upgraded to a release where `getRelativeImportPath` guards against unresolved `*` paths.

## Build verification (the surprising part)
**My eslint change provably does NOT affect builds** — admin-console produced byte-identical hash `148e40a13600ef88` with the fix reverted (control) AND restored (confirm). host-shell + management-console = GREEN with fix present.

**GOTCHA — admin-console sequential-batch build race:** building all 3 consoles back-to-back (`for p in ...; nx build $p --skip-nx-cache`) made admin-console FAIL with `NG8002 Can't bind to 'ngModel'/'value' on falcon-angular-input/-dropdown` in the UNTRACKED in-flight `apps/admin-console/.../contracts-cost-management/.../contracts-add-wizard/` component. But admin-console builds GREEN when built ALONE. Likely cause: falcon-ui-core's Stencil build REGENERATES source-tree type files (`components.d.ts`, `web-types.json` — both tracked-dirty), so consecutive `--skip-nx-cache` app builds race/stale on those shared types → later app's AOT template check intermittently breaks. **Rule: build the consoles INDIVIDUALLY, not in a tight sequential batch, or the later app may hit a phantom NG type-check failure on regenerated falcon-ui-core types.** Independent of the lint fix (identical hash proves it); not fixable via lint config. Refines the prior `--skip-nx-cache` build note.

Working tree was already ~38 files dirty from prior sessions (branch `polishing-v0.4`); the only file I authored is `eslint.config.mjs`.
