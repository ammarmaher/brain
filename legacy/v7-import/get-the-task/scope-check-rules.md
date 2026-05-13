*** Scope-check rules for get-the-task protocol ***
*** Three checks: out-of-scope, error-business, bug-business. Decision tree at the bottom. ***

# Scope Check Rules

These rules govern the three checks the `get-the-task` protocol runs against
every Azure DevOps work item before promoting it to a `task-card.md`. The
rules apply equally to a human reviewer and to an LLM running the same
analysis.

## 1. Out-of-scope check

**Definition.** The work item asserts behavior, screens, validations, or
data flows that the matched PRD does NOT cover.

A delta is in-scope only when it can be traced back to one of:

- A "Main requirements" bullet in `latest-prd.md`.
- A "Validations & rules" bullet in `latest-prd.md`.
- A row of the permission matrix referenced in `attachments.md`.
- A documented dependency in `understanding.md` → "Dependencies".

If the work item asks for any of the following without a corresponding PRD
anchor, it MUST be flagged out-of-scope:

| Pattern in work item | Why it is suspicious |
|---|---|
| New screen / modal / route | Adds surface area not in the PRD module map. |
| New role or permission row | Permission matrix in PRD is the canonical truth. |
| New input field / column | Field list is fixed by the PRD form spec. |
| New validation rule | PRD lists every validation explicitly. |
| New status / transition | Status set is closed in the PRD lifecycle. |
| Cross-module integration | Integration belongs in a higher-level Feature. |
| Background job / cron | Not a UI/feature concern unless PRD calls it out. |

**Output format.** A bulleted list, each entry shaped:

```
- [DELTA] <one-line description> — PRD anchor: <none|"<quoted phrase">>
  Recommendation: <flag-for-PM | reject | accept-with-PRD-update>
```

Empty list = `_No out-of-scope deltas detected._`

## 2. Error-business check

**Definition.** The work item DIRECTLY contradicts a stated PRD business
rule. This is stricter than out-of-scope: there must be a PRD rule, AND
the work item must say something that cannot both be true.

Examples (from Contact Group module):

| PRD rule | Work item contradiction (illustrative) |
|---|---|
| "Falcon usertypes are view-only — they do NOT create, edit, delete, or share." | "As System Administrator I want to delete a contact group." |
| "Group Name ≤ 50 chars, mandatory." | "Allow empty Group Name on save as draft." |
| "Soft delete only; record stays visible to Falcon usertype." | "Hard delete from MongoDB on creator action." |
| "Edit screen: Contact ID / Creation Date / Status / contacts table are read-only." | "Allow recreator to edit the contacts table after upload." |

**Output format.** A bulleted list, each entry shaped:

```
- [CONTRADICTION] <work-item statement>
  PRD rule: "<exact quoted PRD phrase>" (source: latest-prd.md / understanding.md / attachments.md)
  Resolution path: <update-PRD | reject-task | clarify-with-PM>
```

Empty list = `_No business-rule contradictions detected._`

## 3. Bug-business check

**Definition.** Decide whether the work item is a **bug** (existing
behavior is wrong) or a **feature** (behavior is missing).

This is NOT a binary on the WIID `type` field — Azure work items are
miscategorized often. The check uses linguistic and semantic signals:

| Signal | Bug | Feature |
|---|---|---|
| Verb tense in description | "is broken", "fails to", "returns wrong" | "should support", "we need", "add" |
| Acceptance criteria style | "Reproduce → Expected vs. Actual" | "Given/When/Then new path" |
| References existing screen | Yes — describes wrong output on existing UI | Often references new UI or new branch |
| References ticket reproduction | Yes (steps to reproduce, screenshots) | Rare |
| PRD anchor | The behavior IS in the PRD but the implementation is wrong. | The behavior is described as intended but does not yet exist. |
| Severity / SLA in description | Mentions impacted users / regression | Talks about roadmap value |

**Classification levels:**

- `BUG`         — behavior exists, is wrong, PRD says it should be different.
- `FEATURE`     — behavior is missing, PRD says it should exist (gap).
- `ENHANCEMENT` — behavior exists, works as PRD says, work item asks to extend it.
- `UNCLEAR`     — neither the work item nor the PRD pins this down — escalate.

**Confidence levels:** `HIGH` (≥3 supporting signals), `MEDIUM` (2 signals),
`LOW` (1 signal or ambiguous).

**Output format.**

```
Classification: <BUG | FEATURE | ENHANCEMENT | UNCLEAR>
Confidence:     <HIGH | MEDIUM | LOW>
Evidence:
  - <signal 1>
  - <signal 2>
  - ...
```

## Decision tree

```
START
  |
  v
[Q1] Is the work item's intended behavior anchored in the PRD?
  |
  +-- NO  -> Out-of-scope: TRUE
  |          Error-business: usually FALSE (no PRD rule to contradict)
  |          Bug-business: typically FEATURE (or ENHANCEMENT if extending)
  |          STOP — write findings, recommend PRD update or rejection.
  |
  +-- YES -> [Q2] Does the work item statement contradict a PRD rule?
              |
              +-- YES -> Error-business: TRUE
              |          Out-of-scope: FALSE
              |          Bug-business: usually UNCLEAR until PM resolves
              |          STOP — write findings, recommend resolution path.
              |
              +-- NO  -> Out-of-scope: FALSE
                         Error-business: FALSE
                         [Q3] Does the PRD-anchored behavior exist in the system today?
                           |
                           +-- YES, but wrong       -> BUG
                           +-- YES, behaves as spec -> ENHANCEMENT (if work item adds)
                           +-- NO                   -> FEATURE
                           +-- Unclear              -> UNCLEAR (escalate)
```

## Operator override

The operator can mark a finding as `ACK` (acknowledged but
deliberately accepted) — the gate then records the ACK note for audit.
Acknowledged findings still appear in the task card; they do NOT block
hand-off to the orchestrator.

## Boundary

- These rules govern only the analysis step. The orchestrator (Phase C)
  decides what to DO with the findings.
- The rules do NOT prescribe how to surface the findings to the user
  beyond writing them into the task card. Voice / sound is the
  orchestrator's job.
- A finding is never auto-resolved by code; it always rolls up to a
  human approver via the task card's "Approvals" section.
