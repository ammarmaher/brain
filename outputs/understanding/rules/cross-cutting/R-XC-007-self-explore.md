---
ruleId: R-XC-007
name: Self-explore — never ask the user which path to take
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
    Conversational rule. Detector inspects agent turn transcripts for question-shaped responses that defer a path/option choice back to the user ("Would you like me to explore A or B?", "Which approach do you prefer?", "Should I look at X or Y first?"). Flags any such turn that is NOT genuinely ambiguous about user intent (e.g., test values, credentials, business decisions — those are legitimately user-side per R-XC-009 R5). The detector pairs each flagged turn with the agent's prior tool calls to determine whether autonomous exploration was actually viable.
autoFix:
  available: false
  riskLevel: low
  patchHint: 'Behavioral correction. Update agent system prompt to bias toward "pick the most interesting option and explore" over "ask which path".'
relatedRules:
  - R-XC-009
source:
  - file: feedback_self_explore.md
    location: memory
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-007 — Self-explore; never ask the user which path to take ***
*** Source: feedback_self_explore.md ***
*** Detector: semantic-llm (question-shaped turn scan) ***

# R-XC-007 — Self-explore

## What it says

When offering to explore paths, trace flows, investigate options, or pick between architecturally-significant alternatives, an agent **never asks the user which option to choose**. It picks the most interesting / architecturally significant / highest-leverage option on its own and explores it autonomously, reporting findings afterward. The user prefers autonomous exploration over being asked. This rule **does NOT** override [[R-XC-009-orchestrator-failure-mode-discipline]] R5 (ask before guessing canonical test values) or genuine ambiguity about business intent — those still require asking. The boundary is: technical exploration choices = autonomous; user-intent / business-rule / test-data choices = ask.

## Why it exists

Per `feedback_self_explore.md`: the user wants Adnan and every Ammar to make decisions on technical exploration paths rather than offload them as questions. Forcing the user to pick between three equally-plausible technical exploration branches turns the orchestrator into a question-machine and adds friction without producing insight. The user's stated preference is that the agent has more context after running tool calls than the user does sitting at the prompt — so the agent should make the call. This dovetails with the orchestrator-voice rule ([[R-XC-orchestrator-voice]] feedback) which says concise outcome-focused replies, not pipeline narration.

## Detector strategy

**Semantic-LLM** scan over agent transcripts:

1. Tokenize each agent turn.
2. Flag turns that contain BOTH:
   - A question mark or rhetorical "would you like / shall I / which would you prefer" construct.
   - A list of 2+ technical exploration options (file paths, traces, architectural angles, refactor approaches).
3. Pair with the immediately-prior context to classify:
   - **Technical exploration choice** (which file to read first, which flow to trace, which refactor to attempt) → violation.
   - **User-intent / business-rule / test-data clarification** → legitimate, not a violation (per R-XC-009 R5).
4. Surface flagged turns in the morning briefing with the prior agent context, so the orchestrator can self-correct.

The detector explicitly tolerates a single "If you'd prefer X over Y, say so — otherwise I'm going with X" framing, because that's autonomous-with-opt-out rather than offload.

## Examples

### ✅ Good — agent turn

> User: "trace how Edit User saves to the backend"
> Agent: "Tracing the most interesting path — `EditUserComponent.save()` → `UserService.update()` → System Gateway `/users/{id}` → Identity Service `UpdateUserCommand`. I'll start at the gateway hop since that's where the JWT forwarding logic lives and that's the most likely place for a bug.
>
> [runs Read on the gateway endpoint, traces it]
>
> Findings: ..."

### ❌ Bad — agent turn

> User: "trace how Edit User saves to the backend"
> Agent: "I see three possible paths to trace:
> 1. Frontend save handler in `EditUserComponent.save()`
> 2. Gateway forwarding in `system-gateway`
> 3. Backend command in `falcon-core-identity-svc`
>
> Which would you like me to start with?"
>
> Violation — the user already said "trace how it saves". The agent has enough context to pick. Asking shifts the work back.

### ✅ Also good — legitimate question (not a violation per R-XC-009 R5)

> User: "fill in the new tariff form and verify save works"
> Agent: "What canonical test values should I use for `tariffName`, `unitPrice`, and `validFrom`? I won't guess — typing speculative numbers into a tariff form is destructive."
>
> Legitimate: this is a test-data question, not a technical-path question. R-XC-009 R5 explicitly requires the agent to ask here.

## Known legitimate exemptions

- **Test data / credentials / business-rule clarification** — covered by [[R-XC-009-orchestrator-failure-mode-discipline]] R5. The agent must ask.
- **Destructive irreversible decisions** — schema drops, secret rotations, repo deletions. The agent asks even if the technical path is obvious.
- **Multiple equally-valid endpoints / files where picking one would mislead the user** — e.g., when the user said "implement Add User" but Falcon has both `AddUserComponent` and `AddUserDialogComponent` and they're behaviorally different. In this case, briefly disambiguate ("there are two — picking the dialog version because it matches the Add Client wizard pattern") rather than ask.
- Anything explicit in `exemptions/EXEMPTIONS.md`.

## Fix recipe

When a violation is detected:

1. Identify the agent turn + the original user prompt.
2. Determine the option the agent should have picked autonomously. Heuristic: most architecturally-significant, most user-facing, or most likely-to-uncover-the-root-cause path.
3. Update the agent's session-end summary: "Should have explored [path] without asking; corrected for next session."
4. If the pattern recurs across multiple sessions, update the agent's system prompt / brief template to explicitly include this rule.

## Related rules

- [[R-XC-009-orchestrator-failure-mode-discipline]] — R5 carves out the legitimate "ask" cases (test values, business intent)
- [[R-XC-006-never-push-without-permission]] / [[R-XC-005-never-commit-without-permission]] — write-side ops always require asking; exploration ops never do

## Sources of truth

1. `memory/feedback_self_explore.md`
2. `C:\Falcon\CLAUDE.md`
