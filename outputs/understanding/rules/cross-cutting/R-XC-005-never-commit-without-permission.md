---
ruleId: R-XC-005
name: Never git commit without explicit "commit" in current message
category: operational
scope:
  apps:
    - "*"
  paths:
    - "**/.git/**"
  exemptPaths: []
severity: must
detector:
  type: semantic-llm
  patterns: []
  description: |
    Conversational rule. Surface A = agent-side guardrail before any `git commit` call: tokenize the user's CURRENT message and require the literal word "commit" (or canonical synonyms — "stage and commit", "finalize") to appear standalone. Surface B = night-shift git-reflog audit: enumerate commits authored during the night-shift window whose author trailer matches an agent identity, and cross-reference each one with the user's transcript for the same window. Any commit lacking an in-message "commit" trigger → violation.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Soft revert via `git reset HEAD~N --soft` to unstage and restore working-tree state. Document the incident. Do not push under any circumstance.'
relatedRules:
  - R-XC-003
  - R-XC-006
source:
  - file: feedback_never_commit_without_explicit_permission.md
    location: memory
  - file: feedback_no_commit_no_push_strict_2026_05_02.md
    location: memory
  - file: CLAUDE.md
    location: project-root
  - file: .claude/CLAUDE.md
    location: project-local
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-005 — Never git commit without explicit "commit" in CURRENT message ***
*** Source: feedback_never_commit_without_explicit_permission.md + STRICT 2026-05-02 ***
*** Detector: semantic-llm + git reflog inspection ***

# R-XC-005 — Never commit without explicit permission

## What it says

No agent (Adnan, Ammar, Brain, night-shift, fix-agent, executor) may run `git commit`, `git commit --amend`, `git merge --no-ff` with auto-commit, or any equivalent history-writing operation **unless the user's CURRENT message contains the literal word "commit"** (or canonical synonyms: "stage and commit", "finalize"). Push is governed separately by [[R-XC-006-never-push-without-permission]]. Phrases like "do it all", "do everything", "go ahead", "proceed", "ship it", or "auto-mode" do NOT satisfy this rule. Standing approvals from earlier turns in the same session do NOT carry forward — the trigger word must be in the current turn. Even if "commit" was said earlier in the session, a fresh "commit" is required for each new commit.

## Why it exists

Codified across three layered memories: the original 2026-04-19 feedback (Task Manager auto-commits were polluting PRs), the 2026-05-02 STRICT hardening (after the orchestrator interpreted "do it all" as commit-permission), and the cross-reference in `feedback_no_commit_no_push_strict_2026_05_02`. The user wants every commit to be a deliberate, in-the-moment authorisation — not inferred from any prior turn or any standing scope. Auto-commits create noise in PRs, blur the line between in-progress and shippable work, and remove the user's audit-the-diff-locally step. If a merge is in progress after conflict resolution, the agent stops at `git status` showing "All conflicts fixed but you are still merging" and reports — it does NOT run `git commit`.

## Detector strategy

**Two surfaces**, both required:

### Surface A — session-time guardrail (semantic-llm)

Before any agent executes `git commit` (or equivalent), it must:

1. Read the user's CURRENT message (this turn only).
2. Tokenize.
3. Confirm one of the literal triggers appears standalone: `commit`, `commit it`, `commit this`, `commit now`, `stage and commit`, `finalize`, `git commit`.
4. If absent → refuse, leave changes staged/unstaged, ask in-band for confirmation, do NOT execute.

This is enforced at agent runtime, not in code. It's a behavior rule.

### Surface B — night-shift audit (git reflog)

The night-shift code-audit job runs an after-the-fact check:

1. `git log --since="<night-shift-start>" --until="<night-shift-end>" --format='%H %an %ae %s'` on each Falcon repo.
2. Filter for commits whose author email matches an agent identity (claude-code / amazon-q / etc.).
3. Cross-reference the commit timestamp with the user's transcript window: did the user's nearest prior message contain a "commit" trigger?
4. Any commit lacking a matching trigger → emit a violation row in the morning briefing.

## Examples

### ✅ Good — agent behavior

> User: "wire the email field and commit it"
> Agent: edits files, runs `git add -A && git commit -m "wire email field"` → ✅ "commit" present in current message.

> User: "wire the email field"
> Agent: edits files, runs `git status` to confirm staged/unstaged state, stops → ✅ no commit trigger, leaves the working tree for the user to audit.

> User: "fix the conflict and continue"
> Agent: resolves merge conflicts, runs `git status` (output: "All conflicts fixed but you are still merging"), reports back — does NOT run `git commit` to finalize the merge. ✅ correct: "continue" is not "commit".

### ❌ Bad — agent behavior

> User: "fix the typo, do it all"
> Agent: `git commit -m "fix typo"` → ❌ "do it all" does not contain "commit".

> Earlier in session — User: "commit the auth refactor when done"
> Two messages later — User: "now do the login form work"
> Agent: edits + `git commit -m "login form"` → ❌ standing approval is invalid; the prior "commit" authorised one commit, not all future commits.

> User: "merge the feature branch into main"
> Agent: `git merge feat/x --no-ff` (which produces an auto-commit) → ❌ merge-with-auto-commit is still a commit; requires "commit" trigger.

## Known legitimate exemptions

None for human-driven sessions. The only exception is the Brain SK auto-sync of brain artifacts to its dedicated brain repo, governed by its own rule in `Brain SK/CLAUDE.md` — that path treats the brain repo as machine-managed and the auto-commit is part of the sync contract. It does not exempt agents working in Falcon app repos.

## Fix recipe

When a violation is detected by Surface B (post-hoc, night-shift):

1. Identify the commit + the agent that authored it.
2. Determine whether the commit was pushed (cross-reference with [[R-XC-006]] audit). If pushed → escalate per R-XC-006 fix recipe.
3. If local only:
   - **If safe content** (working changes the user would have approved anyway) — document in `outputs/reports/night-shift/<date>/operational-violations.md`, surface in morning briefing, leave the commit in place.
   - **If unsafe content** (broke a build, leaked a secret, mixed concerns) — soft-revert via `git reset HEAD~N --soft` to unstage and let the user audit. Do not force-push under any circumstance.
4. Update the agent's brief / system prompt to re-emphasize the trigger-in-current-message requirement.
5. Log the resolution.

## Related rules

- [[R-XC-006-never-push-without-permission]] — sibling for remote writes
- [[R-XC-003-strict-task-scope]] — out-of-scope edits + auto-commits compound: scope discipline catches one, this rule catches the other

## Sources of truth

1. `memory/feedback_never_commit_without_explicit_permission.md` — original 2026-04-19
2. `memory/feedback_no_commit_no_push_strict_2026_05_02.md` — STRICT 2026-05-02 hardening
3. `C:\Falcon\CLAUDE.md` — project-root standing rules
4. `C:\Falcon\.claude\CLAUDE.md` — project-local hard rules
