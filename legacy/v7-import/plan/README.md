<!-- *** Brain\plan\README.md *** -->
<!-- *** 3-layer plan engine. L1 abstraction -> L2 business -> L3 technical, gated. *** -->

# 3-Layer Plan Engine

Pre-code planning pipeline used by Adnan + Ammar agents. Every change goes through three nested artifacts with explicit user-approval gates. No agent jumps a layer. No code is written until L3 is approved.

## Layers

| Layer | File | Length | Purpose |
|-------|------|--------|---------|
| **L1** | `plan-l1.md` | <=30 lines | Abstraction — goal, why now, scope in/out, modules, open questions, acceptance check. |
| **L2** | `plan-l2.md` | <=80 lines | Business — rules, permission matrix, status transitions, edges, validation, UI states, regression risks, AC checklist. |
| **L3** | `plan-l3.md` | <=200 lines | Technical — file-by-file changes, patterns, libraries, test plan, rollback, validation commands. |

Templates live at `Brain\plan\templates\`. The orchestrator fills the `{{placeholders}}`.

## State layout

Each task gets its own folder under `Brain\state\<task-id>\`:

```
Brain\state\TASK-001\
  plan-l1.md          # L1 artifact (filled by orchestrator)
  plan-l2.md          # appears after L1 approved
  plan-l3.md          # appears after L2 approved
  .l1-approved        # marker, ISO timestamp
  .l2-approved
  .l3-approved
  .ready-to-code      # written when L3 approved; gates the code phase
  rejections.log      # any reject actions, append-only
```

Markers are tiny text files holding the approval timestamp. Their presence is the gate; their absence blocks the next layer.

## Gate flow

1. Adnan receives a task. He drafts L1 in his head and runs `plan-gate.ps1 -Layer L1 -Action create`.
2. Adnan fills the L1 placeholders, presents L1 to the user.
3. User approves L1 -> `plan-gate.ps1 -Layer L1 -Action approve`. Script writes `.l1-approved` AND seeds `plan-l2.md` from template.
4. Adnan fills L2, presents to user.
5. User approves L2 -> writes `.l2-approved` AND seeds `plan-l3.md`.
6. Adnan fills L3, presents to user.
7. User approves L3 -> writes `.l3-approved` AND `.ready-to-code`. Adnan may now hand to Ammar for implementation.

If the user rejects at any layer, run `-Action reject -Reason "<why>"` — the script appends to `rejections.log`. The orchestrator decides whether to re-edit the current layer or roll back.

## Dispatcher script

`Brain\scripts\plan-gate.ps1`

```
plan-gate.ps1 -TaskId <id> -Layer <L1|L2|L3> -Action <create|approve|reject> [-Reason "..."]
```

- `-Action create` copies the template into the task state folder. Refuses if a prior layer is not yet approved.
- `-Action approve` writes the approval marker and seeds the next layer's template (or `.ready-to-code` after L3).
- `-Action reject` requires `-Reason` and appends a line to `rejections.log`.

PowerShell 5.1 compatible (no `??`, no ternary, no `&&`).

## Example invocation chain

```
plan-gate.ps1 -TaskId TASK-001 -Layer L1 -Action create
# orchestrator fills plan-l1.md, presents to user
plan-gate.ps1 -TaskId TASK-001 -Layer L1 -Action approve
plan-gate.ps1 -TaskId TASK-001 -Layer L2 -Action create
# orchestrator fills plan-l2.md, presents to user
plan-gate.ps1 -TaskId TASK-001 -Layer L2 -Action approve
plan-gate.ps1 -TaskId TASK-001 -Layer L3 -Action create
# orchestrator fills plan-l3.md, presents to user
plan-gate.ps1 -TaskId TASK-001 -Layer L3 -Action approve
# .ready-to-code now exists -> Ammar can begin coding
```

Rejection example:

```
plan-gate.ps1 -TaskId TASK-001 -Layer L2 -Action reject -Reason "Permission matrix missing partner role"
```

## How Adnan reads the artifacts

- **Before delegating to Ammar:** require `.l3-approved` to exist for the task. Otherwise refuse to start coding.
- **During QA loop (Phase C):** ChatGPT + Gemini base their scenarios on `plan-l2.md`; Claude bases code on `plan-l3.md`.
- **At push time:** the curated commit message references the task ID; the test-comment block references AC checkboxes from L2.

## Boundaries

- This engine only writes to `Brain\plan\` (templates) and `Brain\state\<task-id>\` (artifacts + markers).
- It never touches voice/alert files, settings, or other agents' territory.
- It never commits or pushes — that is Phase J's job.
