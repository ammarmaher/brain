---
ruleId: R-FE-013
name: Exclude deprecated UI directories from all operations
category: operational
scope:
  apps:
    - "*"
  paths:
    - "**/*"
  exemptPaths: []
severity: must
detector:
  type: structural
  patterns:
    - 'any read / edit / build / sync / search / graph operation targeting falcon-web-platform-ui-old/**'
    - 'any read / edit / build / sync / search / graph operation targeting deprecated-falcon-web-platform-ui/**'
    - 'import / require / tsconfig path referencing falcon-web-platform-ui-old or deprecated-falcon-web-platform-ui'
  exemptPatterns:
    - 'git history / archive operations that explicitly target the deprecated path'
  description: Detects any tool operation, import, or config reference that touches the deprecated UI directories. Frontend graphify runs, codebase scans, agent dispatches, and live builds must all skip these paths. Active frontend is falcon-web-platform-ui only.
autoFix:
  available: true
  riskLevel: low
  patchHint: 'Add path exclusions to .nxignore, tsconfig paths, graphify config, ripgrep/glob ignore lists. For any import that targets the deprecated tree, retarget the canonical falcon-web-platform-ui equivalent.'
relatedRules:
  - R-FE-014
source:
  - file: feedback_discard_old_ui.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-013 — Discard old UI directories ***
*** Source: feedback_discard_old_ui ***
*** Detector: structural (path + import scan) ***

# R-FE-013 — Exclude `falcon-web-platform-ui-old` + `deprecated-falcon-web-platform-ui`

## What it says

Two directories are fully deprecated and MUST be excluded from every operation:

- `falcon-web-platform-ui-old`
- `deprecated-falcon-web-platform-ui`

No read, no edit, no build, no dev-serve, no graphify run, no codebase search, no agent dispatch, no Brain pipeline pass may target these paths. No `import` / `require` / `tsconfig` `paths` entry may reference them. The active and only frontend is `falcon-web-platform-ui`.

## Why it exists

These are dead copies. Touching them creates drift — recurring "I edited the file but the change doesn't show" cycles, search results that return stale code, graph nodes for components that no longer exist, agents producing fixes for code paths that were rebuilt months ago. Excluding them across all tooling is the only way to stop the bleed.

## Detector strategy

Structural scan:

1. Enumerate all tool config files: `.nxignore`, `tsconfig*.json`, `.gitignore`, `nx.json`, ripgrep/glob ignore lists, graphify config, agent dispatch configs.
2. Verify each excludes BOTH `falcon-web-platform-ui-old` and `deprecated-falcon-web-platform-ui`.
3. Scan the workspace for `import` / `require` / `from "..."` statements containing either deprecated name → violation.
4. Scan `tsconfig.base.json` `paths` for any mapping into the deprecated trees → violation.
5. Watch the live operation feed (build logs, agent traces) for any tool action whose path contains either name → violation.

## Examples

### ✅ Good

```jsonc
// .nxignore
falcon-web-platform-ui-old/
deprecated-falcon-web-platform-ui/
```

```jsonc
// tsconfig.base.json
{
  "paths": {
    "@falcon/ui-core": ["./libs/falcon-ui-core/src/index.ts"],
    "@host-shell/shared/*": ["./apps/host-shell/src/app/shared-components/*/index.ts"]
    // no references to falcon-web-platform-ui-old or deprecated-*
  }
}
```

### ❌ Bad

```ts
// any file
import { UserCard } from '../../../falcon-web-platform-ui-old/libs/ui/user-card';  // ❌
import { LegacyTheme } from 'deprecated-falcon-web-platform-ui/theme';             // ❌
```

```jsonc
// graphify config that walks every directory under C:\Falcon
{
  "include": ["**/*.ts"]  // ❌ will pick up the deprecated trees
}
```

## Known legitimate exemptions

- Explicit git-history / archive operations targeting the deprecated path (forensics, audit)
- Manual user requests of the form "show me how X was done in the old UI"
- Anything listed against `R-FE-013` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. **Tool config missing exclusion** — add both directory names to the relevant ignore list. Common files:
   - `.gitignore` (if applicable)
   - `.nxignore`
   - `nx.json` `workspaceLayout` / `tasksRunnerOptions`
   - graphify config (`graphify/config.json` or equivalent)
   - global ripgrep config (`~/.ripgreprc`)
2. **Import referencing deprecated path** — retarget to the canonical `falcon-web-platform-ui` equivalent. If the import has no canonical equivalent (the feature was retired), delete the import and the dependent code.
3. **tsconfig paths entry** — remove.
4. **Live tool operation observed targeting deprecated path** — stop the operation, fix the config above, restart.

## Related rules

- [[R-FE-014-canonical-workspace-only]] — same family: canonical path discipline

## Sources of truth

1. `memory/feedback_discard_old_ui.md` — full exclusion mandate
