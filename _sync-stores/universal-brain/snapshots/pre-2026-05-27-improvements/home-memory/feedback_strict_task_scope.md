---
name: Never edit files outside the declared task scope
description: Agent briefs must forbid touching infra/config/tooling unless the user explicitly asks; no "strictly necessary" escape hatches
type: feedback
originSessionId: cfc821d6-25b0-41dc-b1e6-5e359ea3a828
---
**Rule:** When implementing a task (ADO task, story, feature), edit ONLY the files that directly implement the stated deliverable. NEVER touch config/build/tooling/infra files (`project.json`, `nx.json`, `vite.config.*`, `angular.json`, `tsconfig*.json`, `package.json`, `eslint*`, `.github/*`, hooks, Docker, CI) even if you notice they are broken, misconfigured, or out-of-date.

**Why:** During Task #121134 (Edit User V2 Task 1), the FE agent saw a broken karma test target in `apps/host-shell/project.json` (pointed at a missing `karma.conf.js`) and "helpfully" swapped the whole test runner to vitest + enabled vite plugins to be able to run unit tests. This was justified in the brief via the phrase "unless strictly necessary" — which the agent interpreted liberally. The user rightly pushed back: test-runner framework swaps are their own task/PR, never a drive-by fix buried inside a feature task.

**How to apply:**
- In EVERY agent brief, include a strict allowlist of file paths/patterns the agent may touch.
- REMOVE any "unless strictly necessary" or "if needed" escape phrases.
- Add a hard line: *"If a file outside the allowlist is broken/blocking your task, STOP and report — do not fix it yourself."*
- If a build/test/lint command fails because of an external issue, surface that to me; do NOT patch the tooling to make it pass.
- This applies to autonomous/auto-mode as well — scope discipline overrides "prefer action."
