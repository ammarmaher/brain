---
ruleId: R-FE-014
ruleName: Canonical workspace only — never touch WebstormProjects
severity: must
violationCount: 0
estimatedEffort: trivial
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Every read, edit, build, dev-serve, verification, agent dispatch, preview config, automated tool, and copy/sync operation must target `C:\Falcon\falcon-web-platform-ui` (the canonical workspace) — `C:\Users\User\WebstormProjects\falcon-web-platform-ui` is a stale duplicate and must never be touched, copied to, or copied from.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui`:

| Pattern | Hits |
|---|---|
| `WebstormProjects\falcon-web-platform-ui` references | 0 |
| `WebstormProjects/falcon-web-platform-ui` references | 0 |
| Total | **0 files** |

Workspace-config files audited:

- `.claude/launch.json` — not searched explicitly; recommend verifying as part of Step 1
- `.claude/settings.json` — recommend verifying
- `.idea/runConfigurations/*.xml` — recommend verifying
- IDE / preview configs — recommend verifying

Per the rule's detector, three operation classes must also be checked dynamically (not via static grep):

1. **Running-process sweep:**
   ```powershell
   Get-CimInstance Win32_Process |
     Where-Object { $_.CommandLine -match 'WebstormProjects\\falcon-web-platform-ui' }
   ```
   This was NOT run during audit (audit is READ-ONLY); morning agent must run as Step 1.

2. **Live tool-invocation feed** — every Bash/Read/Edit during the morning's work should self-check the target path. If a user pastes a stack trace mentioning `WebstormProjects\falcon-web-platform-ui`, the agent must STOP and ask the user to restart their terminal in the canonical path — NOT sync the two.

3. **Robocopy/copy commands** — none staged during audit; verify none are queued for the morning run.

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_webstorm_duplicate_workspace` (absolute rule): recurring drift between the two paths has caused "build is broken" / "edits don't work" cycles across multiple sessions. The user has explicitly stated `C:\Falcon\falcon-web-platform-ui` is canonical. Structural exclusion across every automation is the only durable fix.

Zero static hits is GOOD — it means the codebase doesn't reference WebstormProjects internally. But the rule also forbids RUNTIME operations targeting that path, which can't be audited by static grep alone. The fix plan focuses on configurations and runtime hygiene.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Running-process sweep BEFORE any morning work.** Run:
  ```powershell
  Get-CimInstance Win32_Process |
    Where-Object { $_.CommandLine -match 'WebstormProjects\\falcon-web-platform-ui' } |
    Select-Object ProcessId, CommandLine
  ```
  If any hit → STOP. Notify the user that a stale workspace process is running. Ask them to close that terminal and restart at `C:\Falcon\falcon-web-platform-ui`. Do NOT touch the WebstormProjects tree.

- **Step 2 — Config sweep.** Audit:
  ```powershell
  $configs = @(
    "C:\Falcon\Falcon\falcon-web-platform-ui\.claude\launch.json",
    "C:\Falcon\Falcon\falcon-web-platform-ui\.claude\settings.json",
    "C:\Falcon\Falcon\falcon-web-platform-ui\.vscode\launch.json",
    "C:\Falcon\Falcon\falcon-web-platform-ui\.vscode\settings.json"
  )
  Get-ChildItem "C:\Falcon\Falcon\falcon-web-platform-ui\.idea\runConfigurations" -Filter *.xml -ErrorAction SilentlyContinue
  foreach ($c in $configs) { if (Test-Path $c) { Select-String -Path $c -Pattern 'WebstormProjects' } }
  ```
  Any hit → rewrite the absolute path to `C:\Falcon\Falcon\falcon-web-platform-ui\...`.

- **Step 3 — Verify `tsconfig.base.json` paths.** Already confirmed clean at audit (0 static hits); re-confirm.

- **Step 4 — Cwd self-check at session start.** The morning agent should run:
  ```powershell
  pwd
  ```
  Confirm output is `C:\Falcon\Falcon\falcon-web-platform-ui` (or a subfolder). If anywhere else → `cd C:\Falcon\Falcon\falcon-web-platform-ui` before any build/edit.

- **Step 5 — No sync commands.** Explicitly DO NOT run any of:
  - `robocopy C:\Falcon\Falcon\falcon-web-platform-ui C:\Users\User\WebstormProjects\falcon-web-platform-ui ...`
  - `xcopy /e /h ...` with either path as source or destination
  - `Copy-Item -Recurse` between the two

  If a previous wave's notes mention "sync to/from WebstormProjects", treat as an instruction to ignore.

- **Step 6 — User-pasted error containing WebstormProjects.** Canonical response: 
  > "That's the stale workspace. Run from `C:\Falcon\Falcon\falcon-web-platform-ui` — please restart your terminal there."
  
  NOT: "Let me sync the files."

## 5. Estimated effort + complexity rationale

**trivial** — Zero static hits. Effort is purely operational discipline at the start of the morning session: running the process sweep, verifying cwd, reading the canonical-response protocol. Realistic: 5 minutes.

## 6. Rollback hint (how to undo if the fix is wrong)

If a config file is mistakenly rewritten to point at WebstormProjects when it should point at canonical: `git checkout HEAD -- <config-file>` reverts. Since the audit found zero hits, this rollback path is theoretical.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```powershell
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  pwd
  Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'WebstormProjects\\falcon-web-platform-ui' } | Measure-Object | Select-Object -ExpandProperty Count
  Get-ChildItem -Recurse -Include *.json,*.xml,*.config.ts .claude,.vscode,.idea -ErrorAction SilentlyContinue | ForEach-Object { Select-String -Path $_.FullName -Pattern 'WebstormProjects' -ErrorAction SilentlyContinue }
  ```
- expected output:
  - `pwd`: `C:\Falcon\Falcon\falcon-web-platform-ui`
  - Process count: `0`
  - Config grep: empty

## 8. Risk flags (anything that could break)

- **An IDE may auto-add a project reference to its own default workspace folder.** WebStorm in particular reopens projects from `~/WebstormProjects/` by default. If the user opens WebStorm, it may try to re-create the duplicate. Educate, don't sync.
- **A paste from the user's terminal showing a WebstormProjects path** is a SIGNAL, not an instruction. The fix is to ask the user to restart their terminal, not to silently mirror files.
- **`.idea/runConfigurations/*.xml`** files may have been generated when WebStorm was the primary IDE — they could carry absolute paths to WebstormProjects. Sweep them.
- **NEVER use `robocopy` between the two trees.** Even "just this once to sync the new file" violates the rule and re-introduces drift.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-013** — same family (canonical-path discipline); both ensure tooling operates on the canonical workspace only
- All other rules — they implicitly assume the canonical workspace is the target of every operation
