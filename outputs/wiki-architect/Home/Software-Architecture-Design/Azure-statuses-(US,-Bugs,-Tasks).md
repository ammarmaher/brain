# Azure Work Item Statuses (User Stories, Bugs, Tasks)

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Azure-statuses-(US,-Bugs,-Tasks).md`
**Length:** 23 lines · **Headings:** 0 (single table; no body prose)
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

Single canonical table describing every legal lifecycle state for User Stories, Bugs, and Tasks in Azure DevOps. Used by the team to keep RiCH backlog hygiene + release tracking consistent.

## Key rules / decisions

Lifecycle states (table at `Azure-statuses-(US,-Bugs,-Tasks).md:1-23`):

**Pre-development (US-only):**
- `Draft` — added to RiCH backlog, needs analysis.
- `Under Analysis` — currently in business-documentation phase.
- `ToDo` — finished business documentation, awaiting prioritisation.

**Bug-specific entry states:**
- `New` — bug reported.
- `Rejected` — rejected by Dev/Business.
- `Reopened` — bug reopened.

**Task-specific entry state:**
- `New` — added under a US but not yet ready.

**Development pipeline (shared across US / Bug / Task except where noted):**
- `Ready for Development` → `Dev In Progress` → `Ready for Code Review` (US/Bug only) → `Ready for Deployment` (US/Bug only) → `Ready for Testing` (US/Bug only) → `Under Testing` (US/Bug only) → `Ready for Staging` (US/Bug only) → `On Staging` (US/Bug only) → `Ready for Production` (US/Bug only) → `On Production` (US/Bug only) → `Closed`.

**Special states (US/Bug/Task):**
- `Blocked` — there's a blocker or the item is on hold.
- `Removed` — item removed (e.g. requirements changed).

**Task-only:**
- `Closed` — task closed, ready to merge to dev main.

## Diagrams / images referenced

- None.

## Cross-references

- None.

## Implications for code

- The state machine maps to **GitOps + branch hygiene** rules in `Development-&-Deployment-Strategy.md`: a Task moves to `Closed` (ready to merge) immediately before its PR is merged to `main`. A US/Bug moves to `On Production` only after a tagged release deploys.
- For automation: `Ready for Code Review` is the canonical state from which the orchestrator can pull PRs needing reviewer assignment.
- Note: `Ready for Code Review`, `Ready for Deployment`, `Ready for Testing`, etc. are **not** applicable to Task work-items — Tasks have a simpler pipeline.
