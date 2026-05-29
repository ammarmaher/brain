---
type: pending-question
question-id: Q-<%* tR += tp.file.title.replace(/^Q-/, '') %>
status: OPEN
created: <% tp.date.now("YYYY-MM-DD") %>
module: TBD-needs-classification
priority: medium
tracked-as-task: true
due: <% tp.date.now("YYYY-MM-DD", 14) %>
blocked-on: []
asked-by: TBD
related-prd: TBD
verification: unverified
tags:
  - "#type/question"
  - "#status/open"
  - "#priority/medium"
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
---

*** Pending Question Q-<%* tR += tp.file.title.replace(/^Q-/, '') %> — <one-line summary> ***
*** Module: TBD · Priority: medium · <% tp.date.now("YYYY-MM-DD") %> ***

# Q-<%* tR += tp.file.title.replace(/^Q-/, '') %> — <one-sentence question>

> One-sentence restatement of the question and why it matters now.

## Original question

> Verbatim phrasing of the question as Ammar / the stakeholder asked it.

- **Asked by:** TBD
- **Asked at:** <% tp.date.now("YYYY-MM-DD") %>
- **Source channel:** chat / PRD review / code review / spec / other

## Context

- **What we know:** what the codebase / PRD / wiki tells us today
- **What we don't know:** the precise gap the question is trying to close
- **Why now:** the work this question is blocking

## Blockers

- **Blocked-on:** stakeholders, decisions, or artifacts needed before this can be answered
- **Workaround in flight:** if the team picked a tentative path, what it is

## Candidate answers

- **Option A:** description · pros · cons
- **Option B:** description · pros · cons
- **Recommended:** TBD until decided

## Resolution

- **Decided answer:** _pending_
- **Decided by:** _pending_
- **Decided at:** _pending_
- **Resolution artifact:** _pending_ (PR link / wiki page / V-rule)
- **Status transition:** OPEN → ANSWERED → CLOSED

## Cross-links

- **Related V-rules:** _none yet_
- **Related E-entities:** _none yet_
- **Related BR-rules:** _none yet_

## Changelog

- <% tp.date.now("YYYY-MM-DD") %>: created · status OPEN

## Hubs

- [[Q-tickets-MOC]] · [[GAPS_INDEX]] · [[BUSINESS_INDEX]] · [[AMMAR_BRAIN_HOME]]
