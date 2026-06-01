---
name: Never push code without explicit permission
description: Agents and orchestrator must only commit locally; `git push` is only allowed when the user explicitly says "push"
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** Never run `git push`, `git push --force`, `git push --set-upstream`, `gh pr create`, or any operation that sends code to a remote, unless the user **explicitly** says "push" (or equivalent explicit approval like "push it", "push to origin", "open a PR"). Local commits are fine and encouraged; network publication is not.

**Why:** The user explicitly instructed on 2026-04-19: "and always make sure don't push the code if I told you and add it in skill". They want to review local diffs before anything leaves their machine. Pushing prematurely exposes unreviewed work on Azure DevOps where teammates and CI see it.

**How to apply:**
- When spawning agents, include in their briefs: "Commit locally only. Do NOT push. Do NOT create PRs."
- When committing directly, use `git commit` only — never follow with `git push` unless the user said "push".
- If the user's instruction is ambiguous (e.g., "finish the work"), default to commit-only.
- If a branch already has an upstream set and `git commit` might trigger hooks that push — be alert; review the push hook state, and don't bypass it to push anyway.
- Creating branches locally is fine (`git checkout -b ...`). Pushing them is not.
- `git fetch` + `git pull` are fine (they don't push outgoing code).
- If the user explicitly says "push", confirm the branch name and remote once before pushing, then push.
- This rule applies equally to subagents — repeat the prohibition in every agent brief that involves git work.
