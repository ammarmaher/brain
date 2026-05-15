---
ruleId: R-XC-006
name: Never git push without explicit "push" in current message
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
    Conversational rule, not a code rule. The detector is an agent-side guardrail enforced
    via session-time inspection of the user's CURRENT message. The night-shift code audit
    surface for this rule is the git reflog — if a push happened during night shift, flag it
    as a violation of the operational boundary.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Cannot auto-fix; reverting a push is destructive. Investigate, document, and have Ammar decide.'
relatedRules:
  - R-XC-003
  - R-XC-005
source:
  - file: feedback_never_push_without_explicit_permission.md
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

*** Rule R-XC-006 — Never git push without explicit "push" in CURRENT message ***
*** Source: feedback_never_push_without_explicit_permission.md (STRICT 2026-05-02) ***
*** Detector: semantic-llm + git reflog inspection ***

# R-XC-006 — Never push without explicit permission

## What it says

No agent (Adnan, Ammar, Brain, night shift, fix-agent, executor) may run `git push`, open a Pull Request, or trigger any remote write action **unless the user's CURRENT message contains the literal word "push"**. Local commits without push are governed separately by R-XC-005 ("never commit without explicit permission"). "Do it all" / "ship it" / "go ahead" / "you have permission" / "auto-mode" / standing approvals from earlier in the session do NOT satisfy this rule — the trigger word must be in the current turn.

## Why it exists

Falcon agents have full repo write access for productivity. Without a strict trigger phrase, a hallucinated "yes" anywhere in conversation could push a broken build or leak secret-bearing changes to GitHub / Azure DevOps. Hardened on 2026-05-02 after the "strict no-commit/no-push 2026-05-02" feedback was filed — explicitly says "Do it all" never implies commit or push.

## Detector strategy

**Two surfaces**, both required:

### Surface A — session-time guardrail (semantic-llm)

Before any agent executes `git push` (or equivalent), it must:

1. Read the user's CURRENT message (this turn only).
2. Tokenize.
3. Confirm one of: `push`, `push it`, `push to <remote>`, `please push`, `do push`, `git push` appears as a standalone word.
4. If absent → refuse, ask in-band for confirmation, do NOT execute.

This is enforced at agent runtime, not in code. It's a behavior rule, not a regex.

### Surface B — night-shift audit (git reflog)

The night-shift code-audit job runs an after-the-fact check:

1. `git reflog --date=iso --since="<night-shift-start>"` on each Falcon repo.
2. Filter for entries with `push` action (or `update by push`).
3. Any such entry during the night-shift window → emit a high-severity violation row in the morning briefing.

## Examples

### ✅ Good — agent behavior

> User: "fix the typo in user.component.ts and push it"
> Agent: `git commit -m "fix typo" && git push origin main` → ✅ "push" is in the current message

> User: "fix the typo in user.component.ts and commit it"
> Agent: `git commit -m "fix typo"` → ✅ "commit" present, "push" absent — local commit only

### ❌ Bad — agent behavior

> User: "fix the typo, do it all"
> Agent: `git commit && git push` → ❌ "do it all" does not contain "push"

> Earlier in session — User: "you have permission to push for the next 2 hours"
> Two messages later — User: "fix the typo"
> Agent: `git commit && git push` → ❌ standing approval is invalid; trigger word must be in CURRENT message

## Known legitimate exemptions

None. This rule has no scope-based exemptions. The Brain SK auto-sync rule for brain artifacts (which DOES auto-push to `github.com/ammarmaher/brain`) is the ONE exception and is governed by its own rule in `Brain SK/CLAUDE.md`. That rule is treated as a constant standing exception inside the brain repo only.

## Fix recipe

When a violation is detected by Surface B (post-hoc, night-shift):

1. Identify the commit pushed and its destination repo + branch.
2. Determine whether the push was harmful (does it break the build? leak a secret? push to main vs feature branch?).
3. **If safe** — document the violation in `outputs/reports/night-shift/<date>/operational-violations.md` and surface in morning briefing as informational.
4. **If unsafe** — escalate immediately: revert via `git revert` (NOT `git reset` on a public branch), notify Ammar in voice + briefing, freeze night-shift further pushes.
5. After Ammar review, log the resolution in `outputs/reports/operational-incidents/`.

## Related rules

- [[R-XC-005-never-commit-without-permission]] — sibling for local commits
- [[R-XC-003-strict-task-scope]] — never edit outside task scope, even if push is permitted
- [[R-XC-004-build-must-be-green]] — pushes that break a build trigger compound severity

## Sources of truth

1. `memory/feedback_never_push_without_explicit_permission.md`
2. `memory/feedback_no_commit_no_push_strict_2026_05_02.md` — STRICT, 2026-05-02
3. `memory/feedback_never_commit_without_explicit_permission.md` — sibling rule
4. `C:\Falcon\CLAUDE.md` (project root)
5. `C:\Falcon\.claude\CLAUDE.md` (project-local hard rules)
