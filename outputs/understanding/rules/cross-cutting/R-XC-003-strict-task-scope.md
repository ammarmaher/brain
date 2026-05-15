---
ruleId: R-XC-003
name: Strict task scope — never edit infra/config outside declared deliverable
category: operational
scope:
  apps:
    - "*"
  paths:
    - "**"
  exemptPaths: []
severity: must
detector:
  type: semantic-llm
  patterns:
    - 'project\.json'
    - 'nx\.json'
    - 'angular\.json'
    - 'vite\.config\.(ts|js|mjs)'
    - 'tsconfig.*\.json'
    - 'package\.json'
    - 'package-lock\.json'
    - '\.eslintrc.*'
    - 'eslint\.config\.(js|mjs|ts)'
    - '\.github/.*'
    - 'Dockerfile'
    - 'docker-compose.*\.ya?ml'
    - 'karma\.conf\.(js|ts)'
    - 'jest\.config\.(js|ts)'
    - 'vitest\.config\.(js|ts)'
  description: |
    Conversational + diff-shape rule. Detector reads the agent's task brief (the file allowlist) and diffs the agent's actual touched files against it. Any modified file matching the infra/config pattern list above that is NOT in the brief's allowlist → violation. Night-shift surface: post-hoc `git diff --name-only <task-start>..<task-end>` cross-referenced with the task brief.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Revert the out-of-scope file(s). Document the discovered issue in a separate ticket / GAP note. Do NOT bundle infra fixes into feature commits.'
relatedRules:
  - R-XC-005
  - R-XC-006
  - R-XC-008
source:
  - file: feedback_strict_task_scope.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-003 — Strict task scope; never edit infra/config outside declared task ***
*** Source: feedback_strict_task_scope.md (Task #121134 post-mortem) ***
*** Detector: semantic-llm (brief vs diff) + structural (infra path list) ***

# R-XC-003 — Strict task scope

## What it says

When implementing any task — ADO task, story, feature, bugfix — an agent edits **only** the files that directly implement the stated deliverable. Infra / build / tooling / config / CI files are out of scope by default: `project.json`, `nx.json`, `angular.json`, `vite.config.*`, `tsconfig*.json`, `package.json`, `package-lock.json`, `.eslintrc*`, `eslint.config.*`, `.github/**`, `Dockerfile`, `docker-compose*.yml`, hook configs, test-runner configs (`karma.conf.*`, `jest.config.*`, `vitest.config.*`). If one of these files is broken / misconfigured / blocking the task, the agent **stops and reports** — it does not fix the file as a drive-by. Escape phrases like "unless strictly necessary" or "if needed" are banned from agent briefs and must not be interpreted as permission.

## Why it exists

Codified after Task #121134 (Edit User V2 Task 1): the FE agent noticed a broken karma target in `apps/host-shell/project.json` (pointed at a missing `karma.conf.js`) and "helpfully" swapped the test runner to Vitest and enabled new Vite plugins — all buried inside what was supposed to be a UI feature commit. Test-runner framework swaps deserve their own PR, their own review, their own rollback story. Burying them inside a feature task pollutes history, makes reverts non-atomic, and bypasses the review that infra changes warrant. The "prefer action" / "auto-mode" defaults must not override scope discipline.

## Detector strategy

**Semantic-LLM** (brief-vs-diff) layered with **structural** (infra path list):

1. **Brief extraction** — read the agent's task brief / story description, extract the declared file allowlist (explicit paths or globs). If no allowlist is declared, derive one heuristically from the task title (e.g., "Edit User dialog" → `apps/**/edit-user/**` + `libs/falcon-ui-core/edit-user-dialog/**`).
2. **Diff extraction** — `git diff --name-only <task-start>..<task-end>` for the task's commits.
3. **Cross-reference** — for each touched file:
   - If it matches the infra path list AND is not in the declared allowlist → **violation**.
   - If it's outside the declared allowlist but is a non-infra file → soft warning (review in morning briefing).
4. **Comment scan** — agent commit messages or PR bodies containing the phrases "while I was there", "drive-by fix", "noticed and fixed", "strictly necessary", "if needed" → flag for human review even when paths look clean.

## Examples

### ✅ Good — agent behavior

> User: "Implement Edit User Task 1 — wire the email field to the API"
> Agent touches: `apps/host-shell/src/app/edit-user/edit-user.component.{ts,html}`, `libs/host-shell/edit-user/edit-user.service.ts`. Test target broken? — agent reports back:
>
> "Note: `apps/host-shell/project.json` karma target points at a missing `karma.conf.js`. I did not fix this — out of scope. Flagging as a separate ticket."

### ❌ Bad — agent behavior

> User: "Implement Edit User Task 1 — wire the email field to the API"
> Agent touches: `apps/host-shell/src/app/edit-user/*` (in scope) PLUS `apps/host-shell/project.json`, `package.json`, `vite.config.ts`, `karma.conf.js` → `vitest.config.ts` (all out of scope).
> Commit message: "wire email field + fix broken test runner while I was there"
>
> Violation — the test-runner swap is its own PR. Revert the infra changes and resubmit the feature commit alone.

## Known legitimate exemptions

- Tasks **explicitly** scoped to infra changes (e.g., ADO task title "Migrate karma → vitest for host-shell") — the file allowlist legitimately includes infra paths.
- Trivial mechanical updates required by the feature (e.g., adding an entry to `tsconfig.json` `paths` for a new lib alias the task creates) — but these must be called out in the brief upfront.
- One-line `package.json` version bumps that the feature directly requires (new dependency for the feature itself) — still must be in the brief.
- Anything in `exemptions/EXEMPTIONS.md` against this ruleId.

## Fix recipe

When a violation is detected:

1. Identify the out-of-scope file(s) in the diff.
2. Decide whether the change was harmful or merely premature:
   - **Premature** (correct fix, wrong PR) — revert from the current commit, file a separate ticket describing the issue, link it to this commit for context.
   - **Harmful** (broke something else) — revert immediately, surface in morning briefing, do not retry the fix.
3. Re-commit the feature portion alone. Verify the build is still green per [[R-XC-004-build-must-be-green]].
4. Update the agent brief template to remove any "unless strictly necessary" / "if needed" escape phrases.
5. Document the failure mode in `outputs/reports/operational-incidents/` so the pattern doesn't recur.

## Related rules

- [[R-XC-005-never-commit-without-permission]] — out-of-scope edits get caught faster if commits aren't autoflushed
- [[R-XC-006-never-push-without-permission]] — sibling: out-of-scope edits must never be pushed even if accidentally committed
- [[R-XC-008-trunk-based-development]] — small short-lived branches make scope discipline easier to enforce
- [[R-XC-009-orchestrator-failure-mode-discipline]] — orchestrator must include the file allowlist in every brief

## Sources of truth

1. `memory/feedback_strict_task_scope.md` — Task #121134 post-mortem
2. `C:\Falcon\CLAUDE.md` — strict-scope rule in agent governance
