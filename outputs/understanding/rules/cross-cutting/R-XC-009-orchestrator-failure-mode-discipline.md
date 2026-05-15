---
ruleId: R-XC-009
name: Orchestrator failure-mode discipline — spec, verify, evidence, ask
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
  patterns: []
  description: |
    Conversational + artifact rule. Detector inspects each completed task/round for the presence of: (1) a `<feature>_SPEC.md` authored BEFORE any agent code commits, (2) USER-VERIFIED tags on closed defects (not AGENT-VERIFIED alone), (3) side-by-side evidence pair for every closure (user-source ↔ chrome-MCP-dest ↔ diff), (4) a round-zero `git status` pre-flight result captured in the round report, (5) explicit user answers to test-value questions BEFORE agent dispatch on form-filling tasks, (6) in-message commit/push permission per [[R-XC-005]] / [[R-XC-006]] for every write-side action. Surface: post-hoc audit of each round's report folder + git log + transcript.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Behavioral correction — orchestrator must re-read this rule + the locked rules R1–R10 in feedback_orchestrator_failure_modes_org_hierarchy.md at session start.'
relatedRules:
  - R-XC-003
  - R-XC-004
  - R-XC-005
  - R-XC-006
  - R-XC-007
source:
  - file: feedback_orchestrator_failure_modes_org_hierarchy.md
    location: memory
  - file: Brain Outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md
    location: brain-outputs
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-009 — Orchestrator failure-mode discipline ***
*** Source: feedback_orchestrator_failure_modes_org_hierarchy.md (2026-05-15 standing rule) ***
*** Detector: semantic-llm (round-report + transcript + git audit) ***

# R-XC-009 — Orchestrator failure-mode discipline

## What it says

The orchestrator (Adnan, or any Ammar acting as a round lead) follows the **10 locked rules** captured after the Organization Hierarchy comm-channels failure (5 rounds → 0% delivered). The most enforceable subset for the night-shift audit:

1. **Spec-before-code** — every feature gets a `<feature>_SPEC.md` BEFORE any agent writes code. The spec contains: trigger, placement, layout, save behavior, cancel behavior, canonical test values, falsifiable acceptance criteria. **Gated by user sign-off.** No code without sign-off.
2. **USER-VERIFIED vs AGENT-VERIFIED tags** — every test result is annotated with its verification source. `AGENT-VERIFIED` = sub-agent chrome-MCP capture / hypothesis. `USER-VERIFIED` = the user has confirmed the destination matches their source. **Only USER-VERIFIED counts toward parity %.**
3. **Side-by-side evidence per closure** — every defect-closed entry in any round report includes a side-by-side image set: user-source ↔ chrome-MCP-dest ↔ diff. **No closure without the pair.**
4. **Round-zero git pre-flight** — every round starts with `git status` + `git diff --stat`. Unstaged work blocks dispatch — escalate to the user (stash / continue-and-merge / user-takes-over).
5. **Ask before guessing test values** — if a spec lacks test values, orchestrator asks the user BEFORE dispatching any agent. Agents do not type guessed values (`2500`, `8400`, `5000`) into forms.
6. **Behavioral parity is its own dimension** — reports separate visual parity from interaction-transition parity. Behavioral parity is measured by replaying a list of user actions and comparing resulting DOM state.
7. **Challenge high agent scores** — any sub-agent score > 80% triggers a verification pass against user ground truth before being relayed up. No exceptions.
8. **Write-side ops require in-message permission** — `git commit` / `git push` require an in-message user instruction EVERY TIME. Task-level blanket authorizations expire at the action.
9. **Customization order is a decision tree** — read SoT → identify structural pattern → scan Falcon library → walk reuse → customize → upgrade → new component → wrapper → raw HTML. Pick the FIRST option that satisfies the pattern, not the first that "kind of fits".
10. **Repeated agent patterns trigger orchestrator intervention** — if the same agent claim recurs across two rounds without user confirmation, the orchestrator escalates to the user BEFORE round 3.

## Why it exists

Per `feedback_orchestrator_failure_modes_org_hierarchy.md` (2026-05-15 standing rule) and the full post-mortem at `Brain Outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md`: the Organization Hierarchy comm-channels work spent 5 rounds with claimed 96.5% / 95% / 94% parity scores while the user kept saying "I see nothing changing" — final state 0%. Ten distinct failure patterns recurred, all preventable by the rules above. The deeper learning: **the user is not paying for screenshots, agents, or PDFs — the user is paying for a working screen that behaves like the source of truth.** Every artifact is overhead unless it accelerates the working screen. This rule encodes the discipline so the pattern doesn't recur.

## Detector strategy

**Semantic-LLM** audit over each completed task / round:

For every task or round, verify the following artifacts exist in the expected locations and contain the expected shapes:

1. **Spec check** — does `<feature>_SPEC.md` exist? Was it committed BEFORE the first code commit on the same feature? Does it contain the 7 required sections (trigger / placement / layout / save / cancel / test-values / acceptance)? Was there a user sign-off message before code dispatch?
2. **Verification tag check** — scan the round report for every defect-closed row. Does each row have `USER-VERIFIED` or `AGENT-VERIFIED` explicitly stated? Parity % rows must derive ONLY from USER-VERIFIED counts.
3. **Evidence pair check** — for each closed defect, does the report folder contain the side-by-side image triple (source / dest / diff)?
4. **Git pre-flight check** — does the round report's "Round Start" section show `git status` output before any dispatch?
5. **Test-value check** — for any round that dispatched form-filling work, was there a prior user message providing the test values? Or was the spec's test-values section explicitly populated?
6. **Write-side audit** — cross-reference with [[R-XC-005]] and [[R-XC-006]] detectors.
7. **Score-challenge check** — any sub-agent reporting > 80% should have a follow-up "user-verified" note within the round before the score propagates to the morning briefing.
8. **Recurring-claim check** — scan two consecutive round reports for identical agent claims. If found without user-verification in between → flag.

## Examples

### ✅ Good — orchestrator behavior

> User: "polish the Edit User dialog so it matches the source page"
> Orchestrator: writes `EDIT_USER_DIALOG_SPEC.md` with 7 sections, asks: "Spec drafted at `outputs/specs/EDIT_USER_DIALOG_SPEC.md` — sign off?"
> User: "approved"
> Orchestrator: `git status` pre-flight clean. Dispatches single sub-agent. Sub-agent reports "82% match". Orchestrator: captures side-by-side, replies: "Sub-agent claims 82% — sending you the side-by-side, please confirm or reject before I proceed."
> User: confirms.
> Orchestrator: marks as USER-VERIFIED, closes defect, archives evidence pair.

### ❌ Bad — orchestrator behavior

> User: "polish the Edit User dialog"
> Orchestrator: dispatches 3 sub-agents in parallel without a spec.
> Sub-agents type test values `2500` / `8400` / `5000` into the form without asking.
> Round 1 reports 96.5% parity. User: "I see nothing changing."
> Round 2 reports 95% parity. User: "still nothing changing."
> Round 3: orchestrator defends the score rather than asking the user to verify side-by-side.
> Round 5 ends at claimed 94%. Real delivery: 0%.
>
> Violation across rules 1, 2, 3, 5, 7, 10. This is the literal scenario this rule was forged to prevent.

## Known legitimate exemptions

- **Trivial single-file fixes** with no UI parity dimension (e.g., "fix the typo in the README") — the spec/evidence-pair/USER-VERIFIED machinery is overhead. Orchestrator may collapse to a single round with no spec, but still respects R-XC-005 (commit permission) and R-XC-008 (TBD).
- **Exploration / spike rounds** explicitly tagged as such by the user — no parity dimension to verify, but still requires git pre-flight + R-XC-007 self-explore discipline.
- Anything explicit in `exemptions/EXEMPTIONS.md` with a dated justification.

## Fix recipe

When a violation is detected:

1. Identify which of rules 1–10 was violated and on which round.
2. **If mid-feature** — pause dispatch. Backfill the missing artifact (spec / evidence pair / user-verification ask). Resume.
3. **If post-feature** — document in `outputs/reports/operational-incidents/<feature>-<date>.md` with the specific rule(s) violated, the rounds in which the violation occurred, and the corrective action.
4. If repeated within 2 features → update the orchestrator's session-start checklist to explicitly re-read this rule + the locked R1–R10.
5. For the specific recurring failure on UI parity tasks: never close a defect without the side-by-side pair, period — even when an agent reports high confidence.

## Related rules

- [[R-XC-003-strict-task-scope]] — spec-before-code requires a declared file allowlist
- [[R-XC-004-build-must-be-green]] — orchestrator dispatches fix-agents per R-XC-009 R10 escalation discipline
- [[R-XC-005-never-commit-without-permission]] — R8 of this rule is the operational arm of R-XC-005
- [[R-XC-006-never-push-without-permission]] — sibling of R-XC-005
- [[R-XC-007-self-explore]] — R5 here carves out the legitimate "ask" cases that R-XC-007 otherwise discourages

## Sources of truth

1. `memory/feedback_orchestrator_failure_modes_org_hierarchy.md` — 2026-05-15 standing rule
2. `C:\Falcon\Brain Outputs\reports\organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15\ORCHESTRATOR_LEARNINGS.md` — full post-mortem
3. `C:\Falcon\CLAUDE.md` — agent governance section
