*** Phase C - Brain pipeline state machine: how Adnan drives a task through the gates ***

# Brain pipeline state — operator manual

This folder is the persistent state for the gated pipeline: every task gets one folder, one JSON file, one history. Any session can resume any task by reading `Brain/state/<task-id>/task-state.json`.

## Layout

```
Brain\
  scripts\orchestrator.ps1            # state machine
  state\
    STATE-SCHEMA.md                   # JSON shape + transition table (source of truth)
    README.md                         # this file
    templates\task-state.template.json
    <task-id>\
      task-state.json                 # one per task
      artifacts\                      # plans, scenarios, qa reports
```

## States and the events they accept

| State                | Accepts events                              | Notes                                            |
|----------------------|---------------------------------------------|--------------------------------------------------|
| `received`           | `task_received`                             | Bootstrap state on first invocation              |
| `l1_drafting`        | `l1_submit`, `block`                        | High-level abstraction plan in progress          |
| `l1_review`          | `l1_approve`, `l1_reject`, `block`          | Awaits supervisor approval                       |
| `l2_drafting`        | `l2_submit`, `block`                        | Business-detail plan                             |
| `l2_review`          | `l2_approve`, `l2_reject`, `block`          |                                                  |
| `l3_drafting`        | `l3_submit`, `block`                        | Technical deep dive                              |
| `l3_review`          | `l3_approve`, `l3_reject`, `block`          |                                                  |
| `scenarios_pending`  | `scenarios_ready`, `block`                  | ChatGPT + Gemini build test scenarios            |
| `scenarios_ready`    | `start_coding`, `block`                     |                                                  |
| `coding`             | `code_submit`, `block`                      | Claude implementing                              |
| `qa_pending`         | `qa_pass`, `qa_fail`, `block`               | Gemini + ChatGPT QA gate                         |
| `qa_failed`          | `resume_coding`, `block`                    | Bugs found, returned to Claude                   |
| `qa_passed`          | `request_push`, `block`                     |                                                  |
| `ready_to_push`      | `push_approve`, `push_deny`, `block`        | Voice prompt + 880Hz beep handled by Phase J     |
| `blocked`            | `unblock`                                   | Returns to whichever state was active before     |
| `completed`          | (terminal)                                  | Push approved                                    |

The full from->event->to mapping with gate side-effects lives in [STATE-SCHEMA.md](STATE-SCHEMA.md).

## How Adnan invokes the orchestrator

```powershell
# *** Bootstrap a new task (creates Brain\state\T1\task-state.json) ***
powershell -ExecutionPolicy Bypass -File C:\falcon\brain-skills\Brain\scripts\orchestrator.ps1 `
  -TaskId T1 -Event task_received `
  -Payload '{"title":"Add contact-group permission gate"}'

# *** Submit L1, then approve it ***
.\orchestrator.ps1 -TaskId T1 -Event l1_submit `
  -Payload '{"planL1Path":"Brain\\state\\T1\\artifacts\\plan-l1.md"}'
.\orchestrator.ps1 -TaskId T1 -Event l1_approve -By "user" -Note "ok"

# *** Reject and rework L2 ***
.\orchestrator.ps1 -TaskId T1 -Event l2_reject -Note "missing edge case"

# *** Mark scenarios ready ***
.\orchestrator.ps1 -TaskId T1 -Event scenarios_ready `
  -Payload '{"scenariosPath":"Brain\\state\\T1\\artifacts\\scenarios.md"}'

# *** Hand QA result ***
.\orchestrator.ps1 -TaskId T1 -Event qa_fail `
  -Payload '{"qaReportPath":"Brain\\state\\T1\\artifacts\\qa.md","note":"bug in handler"}'

# *** Block / unblock ***
.\orchestrator.ps1 -TaskId T1 -Event block   -Payload '{"reason":"waiting on PRD clarification"}'
.\orchestrator.ps1 -TaskId T1 -Event unblock
```

The script writes the new state name to stdout and exits 0 on success. On invalid event/state it throws with a clear message and exits non-zero.

## Where artifacts live

The orchestrator does not write plan / scenario / QA content itself — sibling scripts do. The orchestrator only stores the *path* in `artifacts.*`. By convention:

| Artifact          | Path                                                          |
|-------------------|---------------------------------------------------------------|
| L1 plan           | `Brain\state\<task-id>\artifacts\plan-l1.md`                  |
| L2 plan           | `Brain\state\<task-id>\artifacts\plan-l2.md`                  |
| L3 plan           | `Brain\state\<task-id>\artifacts\plan-l3.md`                  |
| Scenarios         | `Brain\state\<task-id>\artifacts\scenarios.md`                |
| QA report         | `Brain\state\<task-id>\artifacts\qa-report.md`                |
| Code change list  | populated in `artifacts.codeChanges[]` by Claude after coding |

Pass these paths via `-Payload` JSON when firing the corresponding event so the JSON stays the single source of truth.

## Atomic write + resume

Every transition writes to `task-state.json.tmp` first, then `Move-Item -Force`. If a session is killed mid-transition, the previous valid `task-state.json` survives and can be resumed by reading `currentState` and looking up its allowed events in [STATE-SCHEMA.md](STATE-SCHEMA.md).

## Out of scope for Phase C

- Voice prompts (Phase J).
- Progress-bar emission (Phase I).
- Calling actual mindset agents (later phases).
- Commit/push (Phase J's mandatory voice gate; never automatic).
