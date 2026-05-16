---
type: moc
cluster: 100-Authority
title: Onboarding — first-day path + PR template + readiness checklist
projection-source: _mounts/brain-outputs/datasets/authority-dataset/21-onboarding/
verified-at: 2026-05-16
purpose: "Answers 'I'm new to Falcon (or returning) — what do I read in what order + how do I declare brain-grounding on every PR'. Open on first session ever; consulted before every PR."
---

> [!tldr]
> Three artefacts close the gap between "brain exists" and "brain is used". An onboarding protocol takes new contributors from zero → productive in ~3 hours. A PR template forces every change to declare its brain-grounding. A readiness checklist (12 yes/no gates) walks through pre-flight per session.

# Onboarding

## How the three relate

```
First session ever  →  ONBOARDING-PROTOCOL (one-time, day 1)
                            ↓
Every session       →  READINESS-CHECKLIST (12 gates, ~3min)
                            ↓
Every PR            →  PR-TEMPLATE (forced brain-grounding)
```

## ONBOARDING-PROTOCOL — 5 steps

| Step | Duration | Output |
|---|---|---|
| 1. Topology | 30min | Know what exists + agent roster |
| 2. Authority | 45min | Understand Falcon-vs-Client + 1 feature deeply |
| 3. Protocols | 30min | Know what to do at any fork |
| 4. Tools | 30min | Run the daily-driver scripts |
| 5. First change | 60-90min | Ship a brain-grounded change end-to-end |

Drill into [ONBOARDING-PROTOCOL](../_mounts/brain-outputs/datasets/authority-dataset/21-onboarding/ONBOARDING-PROTOCOL.md) for the file-list per step.

## READINESS-CHECKLIST — 12 gates per session

Before writing code, all 12 must be Y:

| # | Gate | Y means |
|---|---|---|
| 1 | Read MASTER-INDEX this session | Can route a question to the right cluster |
| 2 | Read VERIFICATION-STATUS this session | Know runtime-verified vs structurally-checked |
| 3 | Not claiming runtime status for a structural-only fact | No "shipped"/"validated" without runtime evidence |
| 4 | Know which kingdom (admin/mgmt) is affected | sys-* vs acc-* role |
| 5 | Know which PES keys are touched | Listed by name, not "permissions" |
| 6 | Know which V-rules cross | Listed by id (V-AC-01 etc.) or N/A justified |
| 7 | Know which BR-* bind | Listed by id or N/A justified |
| 8 | Know entity drift items | PRD label vs backend prop vs FE label |
| 9 | Consulted right flow playbook | Brain SK folder/file listed |
| 10 | Identified relevant pitfalls | At least 1 pitfall named, or none-apply justified |
| 11 | Have a visual target (if UI) | Old-UI / wireframe / component / flagged-INFERRED |
| 12 | Will source-prefix every Falcon fact | The convention |

Drill into [READINESS-CHECKLIST](../_mounts/brain-outputs/datasets/authority-dataset/21-onboarding/READINESS-CHECKLIST.md) for what to do when a gate fails.

## PR-TEMPLATE — required brain-grounding declaration

Every PR description must contain 5 sections:

1. **What this PR changes** — 1-sentence outcome
2. **Brain artefacts consulted** — checkboxes for every cluster the change touches
3. **Source-prefix audit** — 3 random facts with their `[CODE]`/`[BRAIN-OUT]`/etc. tag
4. **Decisions at forks** — table: fork × class × resolution × source
5. **Did NOT verify** — explicit list of unknowns the reviewer can scrutinise
6. **Memory-grow** — what was added (or why not)
7. **Verification** — audit clean + scanner clean + build green

PRs without this template are rejected by reviewers — even one-line typos need Sections 1, 2, and the source-prefix audit.

Drill into [PR-TEMPLATE](../_mounts/brain-outputs/datasets/authority-dataset/21-onboarding/PR-TEMPLATE.md) for the full copy-paste template.

## Audience map

| You are | Use which artefact |
|---|---|
| New human contributor | All 3 (ONBOARDING → READINESS → PR) |
| Fresh AI session on Falcon | ONBOARDING (read once after SessionStart) then READINESS each session |
| Returning after >30 days | ONBOARDING as a refresher |
| Cross-team rotation | Skip ONBOARDING Step 1; Step 2 + 3 for new domain |
| Reviewer | PR-TEMPLATE — enforce it |

## See also

- [[Master-Index]] — knowledge router (Step 1 of onboarding)
- [[Verification-Status]] — runtime status (Gate 2 of readiness)
- [[Brain-Maintenance]] — the contract these enforce
- [[Night-Shift-Readiness]] — readiness gate for autonomous work (different scope)
- [[Trigger-Phrases]] — shortcut commands every contributor should know
