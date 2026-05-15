---
ruleId: R-FE-014
name: Canonical workspace only — never touch WebstormProjects
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
    - 'any tool operation (read, edit, build, sync, dev-serve, agent dispatch) whose target path starts with C:\\Users\\User\\WebstormProjects\\falcon-web-platform-ui'
    - 'any robocopy / cp / rsync command with C:\\Users\\User\\WebstormProjects\\falcon-web-platform-ui as source OR destination'
    - 'any .claude/launch.json, agent config, preview config, or task config referencing WebstormProjects\\falcon-web-platform-ui'
    - 'any running process whose CommandLine contains WebstormProjects\\falcon-web-platform-ui'
  exemptPatterns: []
  description: Detects any operation targeting the duplicate Falcon web-platform copy under C:\Users\User\WebstormProjects\. The only canonical workspace is C:\Falcon\falcon-web-platform-ui. Detector is structural — checks tool invocations, config files, and running processes.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Rewrite every config + invocation to target C:\\Falcon\\falcon-web-platform-ui. If a build or terminal is observed running from WebstormProjects, do NOT sync — stop the process, restart the terminal at the canonical path. Never robocopy between the two.'
relatedRules:
  - R-FE-013
source:
  - file: feedback_webstorm_duplicate_workspace.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-014 — Canonical workspace only ***
*** Source: feedback_webstorm_duplicate_workspace (absolute rule) ***
*** Detector: structural (tool invocations + config + running processes) ***

# R-FE-014 — Canonical workspace only — never touch `WebstormProjects`

## What it says

The Falcon web platform project is `C:\Falcon\falcon-web-platform-ui`. Period.

A duplicate exists at `C:\Users\User\WebstormProjects\falcon-web-platform-ui` (WebStorm's default workspace folder). It is NOT the project. Every read, edit, build, dev-serve, verification, agent dispatch, preview config, and automated tool MUST target `C:\Falcon\falcon-web-platform-ui` and never `WebstormProjects`. Syncing between the two is forbidden — do not `cp`, `robocopy`, `rsync`, or `xcopy` either direction.

## Why it exists

Recurring drift between the two paths has caused recurring "build is broken" / "edits don't work" cycles across multiple sessions. The user has explicitly stated `C:\Falcon\falcon-web-platform-ui` is canonical and instructed never to "go to" `WebstormProjects`. The fix is structural exclusion across every automation, not heuristic vigilance.

## Detector strategy

Structural pass:

1. **Tool invocation feed** — for every tool call (Read / Edit / Bash `npm run` / Bash `nx build` / agent dispatch), verify the target path does NOT start with `C:\Users\User\WebstormProjects\falcon-web-platform-ui`.
2. **Config sweep** — scan `.claude/launch.json`, `.claude/settings.json`, agent configs, preview-tool configs, IDE run configs (`.idea/runConfigurations/*.xml`), VS Code launch configs, scheduled tasks — flag every absolute path referencing `WebstormProjects\falcon-web-platform-ui`.
3. **Running-process sweep** — periodically check:
   ```powershell
   Get-CimInstance Win32_Process |
     Where-Object { $_.CommandLine -match 'WebstormProjects\\falcon-web-platform-ui' }
   ```
   Any hit = stale workspace running. Detector emits a warning to the user (NOT an auto-fix — the user must restart their terminal).
4. **Copy/sync command sweep** — any `robocopy` / `cp` / `xcopy` / `rsync` command with either path as source or destination = violation.

## Examples

### ✅ Good

```powershell
cd C:\Falcon\falcon-web-platform-ui
npx nx build host-shell --configuration=development
```

```jsonc
// .claude/launch.json
{
  "cwd": "C:\\Falcon\\falcon-web-platform-ui",
  "command": "npx nx serve admin-console"
}
```

### ❌ Bad

```powershell
cd C:\Users\User\WebstormProjects\falcon-web-platform-ui   # ❌
npm run start                                              # would run from stale copy
```

```powershell
# Trying to "fix" drift by syncing — forbidden
robocopy C:\Falcon\falcon-web-platform-ui `
         C:\Users\User\WebstormProjects\falcon-web-platform-ui `
         /MIR   # ❌ never sync between them
```

```jsonc
// .claude/launch.json
{
  "cwd": "C:\\Users\\User\\WebstormProjects\\falcon-web-platform-ui",  // ❌
  "command": "npx nx serve admin-console"
}
```

### ⚠️ User-pasted build error containing WebstormProjects

If the user pastes a build error whose path contains `WebstormProjects\falcon-web-platform-ui`, the correct response is:

> "That's the stale workspace. Run from `C:\Falcon\falcon-web-platform-ui` — please restart your terminal there."

NOT:

> "Let me sync the files."

## Known legitimate exemptions

None. This is an absolute rule.

## Fix recipe

For each violation:

1. **Config file** — rewrite the absolute path to `C:\Falcon\falcon-web-platform-ui`. Validate the config still loads.
2. **Running process under `WebstormProjects`** — do NOT touch the WebstormProjects tree. Tell the user a stale workspace is running, name the process (`node.exe` / `nx serve`), and ask them to restart their terminal at `C:\Falcon\falcon-web-platform-ui`.
3. **Sync/copy command staged** — abort. Do not run.
4. **Import or `tsconfig` referencing WebstormProjects** — impossible by design (WebstormProjects is outside the canonical workspace); if found, the path is almost certainly a leak from a copied file — delete the reference, retarget against the canonical workspace.

## Related rules

- [[R-FE-013-discard-old-ui]] — same family: deprecated path discipline

## Sources of truth

1. `memory/feedback_webstorm_duplicate_workspace.md` — absolute rule, full enforcement guidance
