*** Brain :: get-the-task index ***
*** Phase F — task pickup + PRD mapping (front door of the Brain pipeline) ***

# Get-the-Task — Index

This folder is the spec for the Brain's task pickup skill. It does NOT host
production code: the script lives at
`C:\falcon\Brain\scripts\get-the-task.ps1` per project convention.

## Files

| File | What it covers |
|---|---|
| [GET-THE-TASK-PROTOCOL.md](./GET-THE-TASK-PROTOCOL.md) | Top-level doc: trigger phrases, ordered steps, hand-off to Phase C. |
| [scope-check-rules.md](./scope-check-rules.md) | Definitions + decision tree for the three checks. |
| [task-card-template.md](./task-card-template.md) | Markdown template the script renders into `state\<id>\task-card.md`. |
| [sample-work-item.json](./sample-work-item.json) | Realistic stub WIID payload (Story 115329, Contact Group permissions). |
| [README.md](./README.md) | This file. |

## Related artifacts (outside this folder)

| Path | Role |
|---|---|
| `C:\falcon\Brain\scripts\get-the-task.ps1` | PowerShell 5.1 scaffold script. Reads stub today; TODO marker shows where the real Azure DevOps API call goes. |
| `C:\falcon\Brain\state\<id>\task-card.md` | Output: the picked-up task card consumed by the orchestrator. |
| `C:\falcon\Brain\analysis\index.json` | Output: append-only run log (one entry per pickup). |
| `C:\falcon\brain-skills\business-skills\prd-knowledge\modules\<slug>\latest-prd.md` | Read-only input: PRD source. |
| `C:\falcon\Brain\state\templates\task-state.template.json` | Used by Phase C orchestrator (NOT this protocol). |

## Trigger phrases (any one)

`get the task <id>` — `pickup task <id>` — `analyze task <id>` —
`task pickup <id>` — `night mode: task pickup <id>`

## How Adnan invokes it

Adnan resolves the trigger phrase and runs the PowerShell scaffold:

```powershell
# *** scaffold mode (uses sample-work-item.json) ***
powershell -NoProfile -ExecutionPolicy Bypass `
  -File C:\falcon\Brain\scripts\get-the-task.ps1 `
  -WorkItemId 115329

# *** with explicit PRD slug override ***
powershell -NoProfile -ExecutionPolicy Bypass `
  -File C:\falcon\Brain\scripts\get-the-task.ps1 `
  -WorkItemId 115329 `
  -PrdModuleSlug 04-contact-group-management
```

Once the Azure DevOps integration is wired (see TODO marker in the script),
the same invocation will hit the live API. The env var `AZDO_PAT` MUST hold
a Personal Access Token with `Work Items (Read)` scope before live mode is
enabled. The scaffold logs a warning when `AZDO_PAT` is missing but does
not yet require it.

## Example flow

```
trigger: "get the task 115329"
   |
   v
[Adnan] runs scripts/get-the-task.ps1 -WorkItemId 115329
   |
   v
[script] reads stub  -> Brain/get-the-task/sample-work-item.json
[script] resolves PRD slug from areaPath "Falcon\Web\Contact Group"
[script] reads        prd-knowledge/modules/04-contact-group-management/{latest-prd.md, understanding.md, attachments.md}
[script] renders      Brain/get-the-task/task-card-template.md with placeholders
[script] writes       Brain/state/115329/task-card.md
[script] appends      Brain/analysis/index.json
   |
   v
[Phase C orchestrator] picks up Brain/state/115329/task-card.md
[Phase C orchestrator] bootstraps Brain/state/115329/task-state.json
[Phase C orchestrator] starts L1 -> L2 -> L3 -> scenarios -> code -> QA -> push gate
```

## The three scope checks (one-liners)

| Check | Definition |
|---|---|
| Out-of-scope   | Work item asks for behavior the matched PRD does NOT cover. |
| Error-business | Work item directly contradicts a PRD business rule. |
| Bug-business   | Decide whether the work item is a bug fix (existing behavior wrong) or a new feature (behavior missing). |

Full rules + decision tree: [`scope-check-rules.md`](./scope-check-rules.md).

## Boundary

- Strictly inside `Brain/get-the-task/`, `Brain/scripts/get-the-task.ps1`,
  and the per-task output paths under `Brain/state/<id>/` and
  `Brain/analysis/index.json`.
- `prd-knowledge/modules/` is read-only.
- No commits. No pushes. No service-code edits. No live API calls in this
  scaffold.
