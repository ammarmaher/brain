*** task-card.md template ***
*** Filled in by Brain/scripts/get-the-task.ps1; consumed by Phase C orchestrator ***
*** Placeholders use double-curly-brace tokens — the script does plain string replace ***

# Task Card — 115329 — Contact Group — Permission matrix enforcement

| Field | Value |
|---|---|
| Work item ID    | 115329 |
| Title           | Contact Group — Permission matrix enforcement |
| Type            | User Story |
| State           | Active |
| Priority        | 2 |
| Area path       | Falcon\Web\Contact Group |
| Iteration       | Falcon\2026\Sprint 9 |
| Assignee        | a.sukkariyeh@t2.sa |
| Parent feature  | #98765 - Contact Group Management Module |
| Picked up at    | 2026-04-30T20:37:31Z |
| Card source     | `Brain\get-the-task\task-card-template.md` |

## Work Item Summary

**Description**

Enforce the Contact Group permission matrix from the PRD across the Contact Groups list and detail screens. The matrix is defined in the Contact Group Permissions sheet (linked from attachments.md). Falcon usertypes (System Admin, Operation, Product) MUST be view-only. Client Account Owner / Node Admin can create, edit own, share, and share groups created by others within their hierarchy. Client Normal Users can create / edit own / share own / use own + shared-with-me groups. Action visibility on the three-dots menu must reflect the role + relationship to the group (creator vs. shared-with-me) on every render.

**Acceptance criteria**

Given a Falcon System Admin viewing the Contact Groups list on a Main node, when they open the three-dots menu, then no Create / Edit / Delete / Share actions are visible.
Given a Client Account Owner viewing a contact group created by a Normal User in their hierarchy, when they open the three-dots menu, then Share is visible.
Given a Client Normal User viewing the Shared Groups tab, when they open a row, then no Edit / Delete / Share actions are visible.
Given a Client Normal User who created a group, when they open the detail view, then Edit / Delete / Share are visible.
Given any user, when their role changes mid-session, then the action visibility re-evaluates on next list render without a hard reload.

**Tags**

frontend, permissions, contact-group

## PRD Mapping

| Field | Value |
|---|---|
| Detected module slug | 04-contact-group-management |
| Detection method     | area-path-tail |
| Module folder        | C:\falcon\brain-skills\business-skills\prd-knowledge\modules\04-contact-group-management |
| `latest-prd.md`      | C:\falcon\brain-skills\business-skills\prd-knowledge\modules\04-contact-group-management\latest-prd.md |
| `understanding.md`   | C:\falcon\brain-skills\business-skills\prd-knowledge\modules\04-contact-group-management\understanding.md |
| `attachments.md`     | C:\falcon\brain-skills\business-skills\prd-knowledge\modules\04-contact-group-management\attachments.md |

**PRD highlights (auto-extracted from `understanding.md`)**

## Module purpose
Manage reusable lists of recipients (contact groups) that Client-side users upload, configure, share, and reference from templates when sending transactions through Falcon applications. Groups are the data half of the template+group pairing that produces personalized messages.
## Actors / users
| User type | Role | Access |
|---|---|---|
| Falcon | System Administrator | View only, via Main node selection |
| Falcon | Operation | View only |
| Falcon | Product | View only |
| Client | Account Owner | Create / Edit own / Delete own / Share own / Share others-in-hierarchy / Download |
| Client | Node Admin | Same as Account Owner, scoped to hierarchy |
| Client | Normal User (creator) | Create / Edit / Delete / Share / Download |
| Client | Normal User (not creator) | View only on shared groups; cannot edit/delete/share |

## Out-of-scope Findings

> Definition: behavior the work item asserts that the PRD does NOT cover.
> See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

TODO: run out-of-scope check (see `Brain/get-the-task/scope-check-rules.md` Section 1).
- Compare every behavior asserted in the work item description / acceptance criteria
  against the PRD anchors (Main requirements, Validations, permission matrix,
  dependencies).
- Emit one bullet per delta in the format documented in section 1.
- If no deltas, write: _No out-of-scope deltas detected._

## Error-business Findings

> Definition: a direct contradiction between the work item and a stated PRD
> business rule. See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

TODO: run error-business check (see `Brain/get-the-task/scope-check-rules.md` Section 2).
- Quote every PRD rule that the work item could contradict.
- For each, decide whether the work item statement and the PRD rule can both be true.
- If they cannot, emit a [CONTRADICTION] entry per the section 2 format.
- If clean, write: _No business-rule contradictions detected._

## Bug-business Classification

> Decision: existing-behavior-is-wrong (bug) vs. behavior-missing (feature).
> See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

| Field | Value |
|---|---|
| Classification | TODO |
| Confidence     | TODO |
| Evidence       | see Evidence detail below |

**Evidence detail**

TODO: run bug-business classification (see `Brain/get-the-task/scope-check-rules.md` Section 3).
Apply the signal table (verb tense, AC style, references, severity, PRD anchor) to
the work item, then fill in the table below with one of:
  Classification: BUG | FEATURE | ENHANCEMENT | UNCLEAR
  Confidence:     HIGH | MEDIUM | LOW
  Evidence:       <bullet list of supporting signals>

## Recommended Plan

TODO: derived from L1 plan (Phase B). Scaffold writes placeholder.

## Acceptance Criteria (echoed for orchestrator)

Given a Falcon System Admin viewing the Contact Groups list on a Main node, when they open the three-dots menu, then no Create / Edit / Delete / Share actions are visible.
Given a Client Account Owner viewing a contact group created by a Normal User in their hierarchy, when they open the three-dots menu, then Share is visible.
Given a Client Normal User viewing the Shared Groups tab, when they open a row, then no Edit / Delete / Share actions are visible.
Given a Client Normal User who created a group, when they open the detail view, then Edit / Delete / Share are visible.
Given any user, when their role changes mid-session, then the action visibility re-evaluates on next list render without a hard reload.

## Risks

TODO: enumerate after scope checks complete.

## Approvals (gates)

| Gate | Status | Note |
|---|---|---|
| PRD coverage verified           | PENDING   |  |
| No out-of-scope deltas          | PENDING|  |
| No error-business contradictions| PENDING|  |
| Bug/feature classification set  | PENDING     |  |
| Operator approves task pickup   | PENDING | Set by Adnan after review. |

---

*** Hand-off note ***

Phase C orchestrator owns the next steps. It will:

1. Bootstrap `task-state.json` from `Brain\state\templates\task-state.template.json`.
2. Drive L1 → L2 → L3 plan gates.
3. Trigger ChatGPT + Gemini scenario authoring.
4. Schedule Claude code + QA loop.
5. Hold push approval until the user voice-confirms.

