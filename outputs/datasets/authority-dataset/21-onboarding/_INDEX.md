---
type: index
cluster: 21-onboarding
verified-at: 2026-05-16
purpose: "Answers 'how does a new contributor (human or AI) get productive on Falcon in <1 day + how do we keep PRs aligned with the brain'. Open on first session ever; consulted before every PR."
---

# 21-onboarding - First-day path + PR template

> [!tldr]
> Two artefacts that close the gap between "brain exists" and "brain is used". ONBOARDING-PROTOCOL takes a new contributor (human or fresh AI session) from zero -> productive in a structured 5-step path. PR-TEMPLATE forces every change to declare its brain-grounding before merging.

## Contents

| File | Purpose | Audience |
|---|---|---|
| [ONBOARDING-PROTOCOL.md](ONBOARDING-PROTOCOL.md) | 5-step path from "I have repo access" to "I can ship a brain-grounded change" | New humans, fresh AI sessions, return-after-hiatus |
| [PR-TEMPLATE.md](PR-TEMPLATE.md) | Required PR description format - forces source-prefix + V-rules/PES/E-* declaration | Every PR author + reviewer |
| [READINESS-CHECKLIST.md](READINESS-CHECKLIST.md) | 12 yes/no gates a session must pass before touching code | Every session |

## How these three relate

```
First session ever -> ONBOARDING-PROTOCOL (one-time, day 1)
                         |
                         v
Every session    -> READINESS-CHECKLIST (12 gates, ~3min)
                         |
                         v
Every PR         -> PR-TEMPLATE (forced brain-grounding declaration)
```

## See also

- `0-MASTER-INDEX.md` - knowledge router (step 1 of onboarding)
- `20-brain-maintenance/MEMORY-GROW-PROTOCOL.md` - the contract these enforce
- `19-night-shift-readiness/DECISION-PROTOCOL.md` - what readiness covers at fork-time
- `16-trigger-phrase-index/` - shortcut commands every contributor should know
