---
title: Obsidian Knowledge Scale
type: brain-knowledge-scale
purpose: Measures how strong and complete the Brain knowledge is after each Get Shit Done run.
tags: [brain, knowledge-scale, gsd-review, obsidian]
updated: 2026-05-19
---

# Obsidian Knowledge Scale

This file measures how strong and complete the Brain knowledge is after each
Get Shit Done run. Every GSD run scores the ten areas below, appends a
`## Review:` section under [[#Review History]], and refreshes the Current
Overall Score. All scoring follows [[#Scoring Rules]] — never inflate.

## Score Areas

| Area | Score 0-100 | Meaning |
|---|---:|---|
| Architecture Knowledge | 0-100 | How well architecture decisions, boundaries, wiki rules, and source-of-truth rules are documented |
| Frontend Knowledge | 0-100 | How well components, tokens, Tailwind rules, pages, and UI patterns are understood |
| Backend Knowledge | 0-100 | How well controllers, DTOs, validators, services, events, and database rules are documented |
| Full-Stack Contract Knowledge | 0-100 | How well FE/BE contracts, APIs, gateway routes, and error mappings are linked |
| Business Knowledge | 0-100 | How well PRD/BRD rules, actors, statuses, validations, and flows are documented |
| Security Knowledge | 0-100 | How well PES, roles, tenant isolation, auth, payment risks, and vulnerabilities are tracked |
| Testing Knowledge | 0-100 | How well test cases, test data, QA scenarios, and verification evidence are documented |
| Token / Design System Knowledge | 0-100 | How well Falcon Tailwind Tokens, design tokens, component styling rules, and token gaps are tracked |
| Agent Improvement Knowledge | 0-100 | How well agent failures, improvements, missed checks, and skill updates are recorded |
| Review Evidence Quality | 0-100 | How complete the evidence is: code, commands, build, runtime, screenshots, network, DB, docs |

## Overall Brain Confidence

Overall Score = average of all areas.

**Current Overall Score:** 78/100 — Strong (with cited gaps). Last run:
gsd-2026-05-29-mgmt-console-authority-pes (2026-05-29). See [[#Review History]].

| Score | Meaning |
|---:|---|
| 0-30 | Weak knowledge, risky to automate |
| 31-50 | Partial knowledge, many gaps |
| 51-70 | Usable but needs review |
| 71-85 | Strong enough for guided implementation |
| 86-95 | Very strong, safe for advanced automation with gates |
| 96-100 | Excellent, but still requires evidence and approval gates |

## Mandatory Per-Review Update

Every Get Shit Done run must append a section to [[#Review History]] using the
template below. `<review-name>` and `<date>` are placeholders. `Before` is the
`After` value from the most recent prior entry (or `n/a` on the first run);
`Change` is `After - Before`. Every score must be defensible from the cited
review evidence and must obey [[#Scoring Rules]].

```
## Review: <review-name> — <date>

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge |  |  |  |  |
| Frontend Knowledge |  |  |  |  |
| Backend Knowledge |  |  |  |  |
| Full-Stack Contract Knowledge |  |  |  |  |
| Business Knowledge |  |  |  |  |
| Security Knowledge |  |  |  |  |
| Testing Knowledge |  |  |  |  |
| Token / Design System Knowledge |  |  |  |  |
| Agent Improvement Knowledge |  |  |  |  |
| Review Evidence Quality |  |  |  |  |

## Gaps Found

- 

## New Candidate Memories

- 

## Approved Memories Applied

- 

## Agent Improvements Proposed

- 

## Next Knowledge Priorities

- 
```

## Scoring Rules

**Do not inflate scores.**

- If evidence is missing, the score must stay low.
- If runtime was not verified, Review Evidence Quality cannot be above 80.
- If backend contracts were not inspected, Backend Knowledge and Full-Stack
  Contract Knowledge cannot be above 70.
- If security review did not run, Security Knowledge cannot be above 60.

A score is a measurement, not a goal. Honest low scores are correct and useful;
inflated scores corrupt every downstream automation decision. An inflated or
unjustified score is itself an agent failure — record it in the review's
`agent-improvement-notes.md`.

## Review History

_Per-review entries are appended below, newest first. Each is one
`## Review: <review-name> — <date>` block produced from the template above._

## Review: gsd-2026-05-29-mgmt-console-authority-pes — 2026-05-29

Decision: APPROVED WITH COMMENTS (0 blocker / 0 high / 4 medium / 4 low / 1 info). Mode: REVIEW-ONLY. Overall: **78/100**.

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge | n/a | 80 | +80 | Identity→PES create coupling mapped (GSD-003) |
| Frontend Knowledge | n/a | 84 | +84 | wizard access-resolution + session-provider code-read |
| Backend Knowledge | n/a | 70 | +70 | capped 70 — C# not independently re-read this run |
| Full-Stack Contract Knowledge | n/a | 76 | +76 | FE/BE action-string mismatch found (GSD-001) |
| Business Knowledge | n/a | 78 | +78 | BR-UM-03 single-owner interaction surfaced |
| Security Knowledge | n/a | 82 | +82 | privilege-escalation closure live-proven (403/200) |
| Testing Knowledge | n/a | 72 | +72 | verification tiers mapped; gaps identified |
| Token / Design System Knowledge | n/a | 80 | +80 | N/A this run — logic-only FE changes |
| Agent Improvement Knowledge | n/a | 76 | +76 | FE↔BE action-parity check added |
| Review Evidence Quality | n/a | 80 | +80 | capped 80 — #2 + dropdown not browser-verified |

## Gaps Found

- GSD-001 FE/BE role-matrix action-string mismatch; GSD-004 dropdown render not browser-verified; GSD-005 role-UPDATE path not inspected; backend C# cited from agent + live proof, not independently re-read.

## New Candidate Memories

- MUC-001 (FE/BE action parity), MUC-002 (session.roles always [] → use /user/me), MUC-003 (server-enforced fail-closed authority), MUC-004 (Identity→PES coupling ADR), MUC-005 (board: check FE/BE action parity). All CANDIDATE — see the review's `obsidian/memory-update-candidates.md`.

## Approved Memories Applied

- None (REVIEW-ONLY — no promotion this run).

## Agent Improvements Proposed

- Add FE↔BE PES-action-string parity to the Full-Stack checklist; keep honest verification tiering (build vs API vs browser).

## Next Knowledge Priorities

- Align the FE/BE matrix cell (GSD-001); browser-verify the Add-User dropdown (GSD-004); confirm BR-UM-03 single-owner guard (GSD-002).
