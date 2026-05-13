*** task-card.md template ***
*** Filled in by Brain/scripts/get-the-task.ps1; consumed by Phase C orchestrator ***
*** Placeholders use double-curly-brace tokens — the script does plain string replace ***

# Task Card — {{WORK_ITEM_ID}} — {{WORK_ITEM_TITLE}}

| Field | Value |
|---|---|
| Work item ID    | {{WORK_ITEM_ID}} |
| Title           | {{WORK_ITEM_TITLE}} |
| Type            | {{WORK_ITEM_TYPE}} |
| State           | {{WORK_ITEM_STATE}} |
| Priority        | {{WORK_ITEM_PRIORITY}} |
| Area path       | {{WORK_ITEM_AREA_PATH}} |
| Iteration       | {{WORK_ITEM_ITERATION}} |
| Assignee        | {{WORK_ITEM_ASSIGNEE}} |
| Parent feature  | {{WORK_ITEM_PARENT}} |
| Picked up at    | {{PICKUP_TIMESTAMP}} |
| Card source     | `Brain\get-the-task\task-card-template.md` |

## Work Item Summary

**Description**

{{WORK_ITEM_DESCRIPTION}}

**Acceptance criteria**

{{WORK_ITEM_ACCEPTANCE}}

**Tags**

{{WORK_ITEM_TAGS}}

## PRD Mapping

| Field | Value |
|---|---|
| Detected module slug | {{PRD_MODULE_SLUG}} |
| Detection method     | {{PRD_DETECTION_METHOD}} |
| Module folder        | {{PRD_MODULE_FOLDER}} |
| `latest-prd.md`      | {{PRD_LATEST_PATH}} |
| `understanding.md`   | {{PRD_UNDERSTANDING_PATH}} |
| `attachments.md`     | {{PRD_ATTACHMENTS_PATH}} |

**PRD highlights (auto-extracted from `understanding.md`)**

{{PRD_HIGHLIGHTS}}

## Out-of-scope Findings

> Definition: behavior the work item asserts that the PRD does NOT cover.
> See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

{{OUT_OF_SCOPE_FINDINGS}}

## Error-business Findings

> Definition: a direct contradiction between the work item and a stated PRD
> business rule. See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

{{ERROR_BUSINESS_FINDINGS}}

## Bug-business Classification

> Decision: existing-behavior-is-wrong (bug) vs. behavior-missing (feature).
> See [`scope-check-rules.md`](../get-the-task/scope-check-rules.md).

| Field | Value |
|---|---|
| Classification | {{BUG_OR_FEATURE}} |
| Confidence     | {{BUG_FEATURE_CONFIDENCE}} |
| Evidence       | {{BUG_FEATURE_EVIDENCE_INLINE}} |

**Evidence detail**

{{BUG_FEATURE_EVIDENCE}}

## Recommended Plan

{{RECOMMENDED_PLAN}}

## Acceptance Criteria (echoed for orchestrator)

{{ACCEPTANCE_FOR_ORCHESTRATOR}}

## Risks

{{RISKS}}

## Approvals (gates)

| Gate | Status | Note |
|---|---|---|
| PRD coverage verified           | {{GATE_PRD_COVERAGE}}   | {{GATE_PRD_COVERAGE_NOTE}} |
| No out-of-scope deltas          | {{GATE_NO_OUT_OF_SCOPE}}| {{GATE_NO_OUT_OF_SCOPE_NOTE}} |
| No error-business contradictions| {{GATE_NO_ERROR_BUSINESS}}| {{GATE_NO_ERROR_BUSINESS_NOTE}} |
| Bug/feature classification set  | {{GATE_CLASSIFIED}}     | {{GATE_CLASSIFIED_NOTE}} |
| Operator approves task pickup   | {{GATE_OPERATOR_APPROVED}} | Set by Adnan after review. |

---

*** Hand-off note ***

Phase C orchestrator owns the next steps. It will:

1. Bootstrap `task-state.json` from `Brain\state\templates\task-state.template.json`.
2. Drive L1 → L2 → L3 plan gates.
3. Trigger ChatGPT + Gemini scenario authoring.
4. Schedule Claude code + QA loop.
5. Hold push approval until the user voice-confirms.
