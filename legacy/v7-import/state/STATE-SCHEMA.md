*** Phase C — State Spec for the Falcon Brain Pipeline Orchestrator ***
*** Source of truth for shape, allowed states, and transition table ***

# Task State Schema

Each task in the pipeline owns one folder:

```
C:\falcon\brain-skills\Brain\state\<task-id>\
  task-state.json        # this schema
  artifacts\             # plans, scenarios, qa reports, code diffs (paths referenced from JSON)
```

## JSON shape

```jsonc
{
  "taskId": "T1",                    // string, unique, supplied by Adnan
  "title": "Short human-readable name",
  "currentState": "received",        // one of the allowed states below
  "history": [
    {
      "from": "received",
      "to": "l1_drafting",
      "event": "task_received",
      "at": "2026-04-30T22:35:01Z",
      "by": "adnan",
      "note": ""
    }
  ],
  "gates": {
    "l1Approved":      false,
    "l2Approved":      false,
    "l3Approved":      false,
    "scenariosBuilt":  false,
    "codeWritten":     false,
    "qaPassed":        false,
    "pushRequested":   false,
    "pushApproved":    false
  },
  "artifacts": {
    "planL1Path":     "",            // e.g. "Brain\\state\\T1\\artifacts\\plan-l1.md"
    "planL2Path":     "",
    "planL3Path":     "",
    "scenariosPath":  "",            // ChatGPT + Gemini test scenarios
    "codeChanges":    [],            // array of repo-relative file paths Claude touched
    "qaReportPath":   ""
  },
  "timestamps": {
    "created":           "2026-04-30T22:35:01Z",
    "updated":           "2026-04-30T22:35:01Z",
    "eachStateEntered":  {           // map of state -> ISO8601 first-entered timestamp
      "received": "2026-04-30T22:35:01Z"
    }
  },
  "blockers": [],                    // free-form strings, set when state == "blocked"
  "notes":    []                     // free-form annotations from Adnan / mindsets
}
```

## Allowed states (string enum)

| State                | Meaning                                                  |
|----------------------|----------------------------------------------------------|
| `received`           | Task accepted, nothing drafted yet                       |
| `l1_drafting`        | Claude (or planner) writing L1 high-level plan           |
| `l1_review`          | L1 awaiting user / supervisor approval                   |
| `l2_drafting`        | L2 business-detail plan being authored                   |
| `l2_review`          | L2 awaiting approval                                     |
| `l3_drafting`        | L3 technical deep-dive being authored                    |
| `l3_review`          | L3 awaiting approval                                     |
| `scenarios_pending`  | ChatGPT + Gemini still generating test scenarios         |
| `scenarios_ready`    | Scenarios accepted, ready for code                       |
| `coding`             | Claude implementing                                      |
| `qa_pending`         | Implementation handed to QA (Gemini + ChatGPT)           |
| `qa_failed`          | QA found bugs, returned to Claude                        |
| `qa_passed`          | QA clean, ready for push approval                        |
| `ready_to_push`      | Push voice prompt fired, waiting on user "yes"           |
| `blocked`            | Pipeline halted; see `blockers[]`                        |
| `completed`          | Push approved + commit done (commit only when user says) |

## Transition table

`*` means "any state". `blocked` is reachable from any non-terminal state via `block`, and exits via `unblock` to whichever state was active before being blocked (the previous state is read off `history[]`).

| From state         | Event             | To state           | Gate side-effect           |
|--------------------|-------------------|--------------------|----------------------------|
| `received`         | `task_received`   | `l1_drafting`      | —                          |
| `l1_drafting`      | `l1_submit`       | `l1_review`        | —                          |
| `l1_review`        | `l1_approve`      | `l2_drafting`      | `l1Approved = true`        |
| `l1_review`        | `l1_reject`       | `l1_drafting`      | `l1Approved = false`       |
| `l2_drafting`      | `l2_submit`       | `l2_review`        | —                          |
| `l2_review`        | `l2_approve`      | `l3_drafting`      | `l2Approved = true`        |
| `l2_review`        | `l2_reject`       | `l2_drafting`      | `l2Approved = false`       |
| `l3_drafting`      | `l3_submit`       | `l3_review`        | —                          |
| `l3_review`        | `l3_approve`      | `scenarios_pending`| `l3Approved = true`        |
| `l3_review`        | `l3_reject`       | `l3_drafting`      | `l3Approved = false`       |
| `scenarios_pending`| `scenarios_ready` | `scenarios_ready`  | `scenariosBuilt = true`    |
| `scenarios_ready`  | `start_coding`    | `coding`           | —                          |
| `coding`           | `code_submit`     | `qa_pending`       | `codeWritten = true`       |
| `qa_pending`       | `qa_pass`         | `qa_passed`        | `qaPassed = true`          |
| `qa_pending`       | `qa_fail`         | `qa_failed`        | `qaPassed = false`         |
| `qa_failed`        | `resume_coding`   | `coding`           | `codeWritten = false`      |
| `qa_passed`        | `request_push`    | `ready_to_push`    | `pushRequested = true`     |
| `ready_to_push`    | `push_approve`    | `completed`        | `pushApproved = true`      |
| `ready_to_push`    | `push_deny`       | `qa_passed`        | `pushRequested = false`    |
| `*` (non-terminal) | `block`           | `blocked`          | append to `blockers[]`     |
| `blocked`          | `unblock`         | (previous state)   | clear `blockers[]`         |

`completed` is terminal — no outgoing edges.

## Atomic-write rule

The orchestrator writes to `task-state.json.tmp`, then `Move-Item -Force` to `task-state.json`. This guarantees no half-written file even if the process is killed mid-update.
