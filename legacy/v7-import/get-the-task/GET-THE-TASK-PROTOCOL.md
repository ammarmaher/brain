*** Phase F — Task pickup + PRD mapping protocol ***
*** Owner: Adnan orchestrator. Consumes: Azure DevOps WIID + PRD module. Emits: task-card.md ***

# Get-the-Task Protocol

This protocol is the front door of the Falcon Brain pipeline. It turns an Azure
DevOps work item into a triaged `task-card.md` that the Phase C orchestrator
can pick up.

The protocol does NOT implement an Azure DevOps API call yet. The scaffold script
at `C:\falcon\Brain\scripts\get-the-task.ps1` reads a stub JSON instead and
marks the API integration point with a `TODO` banner.

## Trigger phrases

Any of these (case-insensitive, `<id>` is the Azure DevOps work-item integer ID):

- `get the task <id>`
- `pickup task <id>`
- `analyze task <id>`
- `task pickup <id>`
- `night mode: task pickup <id>`

When Adnan sees one of these, he MUST:

1. Resolve `<id>` to a digit-only string.
2. Invoke `C:\falcon\Brain\scripts\get-the-task.ps1 -WorkItemId <id>` (and
   optionally `-PrdModuleSlug <slug>` if the user already named the module).
3. Read the emitted `task-card.md` at
   `C:\falcon\Brain\state\<id>\task-card.md`.
4. Append an entry to `C:\falcon\Brain\analysis\index.json`.
5. Hand off to Phase C orchestrator (the orchestrator is responsible for state
   transitions; this protocol stops at task-card emission).

## Step-by-step

### Step 1 — Read the Azure DevOps work item

Expected payload shape (matches `sample-work-item.json` and the Azure DevOps
REST API `workitems` resource):

```jsonc
{
  "id":               115329,
  "title":            "Contact Group — Permission matrix enforcement",
  "type":             "User Story",            // or "Bug" / "Task" / "Feature"
  "state":            "Active",
  "priority":         2,
  "areaPath":         "Falcon\\Web\\Contact Group",
  "iterationPath":    "Falcon\\2026\\Sprint 9",
  "assignedTo":       "a.sukkariyeh@t2.sa",
  "parentFeature": {
    "id":    98765,
    "title": "Contact Group Management Module"
  },
  "description":         "...HTML or markdown body...",
  "acceptanceCriteria":  "...HTML or markdown bullet list...",
  "tags":                ["frontend", "permissions"]
}
```

The script reads this from a stub today. The replacement integration
SHOULD be one of (in priority order):

1. **`az boards work-item show --id <id> --output json`** — the
   `az boards` extension returns the canonical shape used above.
2. **`gh api`** — only if the team mirrors WIIDs to GitHub Issues (not
   the current setup).
3. Direct REST: `GET https://t2development.visualstudio.com/Falcon/_apis/wit/workitems/<id>?$expand=all&api-version=7.0`
   with PAT.

Auth: a Personal Access Token with `Work Items (Read)` scope, stored in env
var `AZDO_PAT`. Never hardcoded. Never logged.

### Step 2 — Identify the PRD module

The script tries the slug detection in this order; the first hit wins:

1. **Explicit param** `-PrdModuleSlug <slug>` (operator override).
2. **Area-path tail** — last segment of `areaPath`, lowercase, dashed.
   Example: `Falcon\Web\Contact Group` → `contact-group`.
3. **Parent-feature title slug** — strip stop-words, dash-join.
4. **Title slug fallback** — same transform on `title`.

The detected slug is matched against
`C:\falcon\brain-skills\business-skills\prd-knowledge\modules\` directory
listing using a `Contains`-match on the `<NN>-<slug>` folder names.
First match wins; the index is logged into the task card.

If NO match is found, the script writes a task card with the PRD Mapping
section flagged `UNRESOLVED — operator must supply slug` and exits non-zero.

### Step 3 — Read the PRD

For the matched module folder
`prd-knowledge/modules/<NN>-<slug>/`, read (read-only):

- `latest-prd.md` — the canonical PRD text.
- `understanding.md` — Brain's parsed summary.
- `attachments.md` — sheet/file references, especially permission matrices.

These three files compose the PRD context block injected into the task card.

### Step 4 — Run three scope checks

The full rules are documented in
[`scope-check-rules.md`](./scope-check-rules.md). Summary:

| Check | One-liner | Output goes to |
|---|---|---|
| **Out-of-scope** | Work item asks for behavior the PRD does not cover. | `## Out-of-scope Findings` |
| **Error-business** | Work item contradicts business rules in the PRD. | `## Error-business Findings` |
| **Bug-business** | Work item is a bug fix (existing behavior wrong) vs. a feature (behavior missing). | `## Bug-business Classification` |

In the scaffold these sections render as TODO placeholders for an LLM pass.
The decision tree in `scope-check-rules.md` is what the LLM must follow.

### Step 5 — Emit `task-card.md`

The task card uses
[`task-card-template.md`](./task-card-template.md) verbatim, with
placeholders filled in. It is written to:

```
C:\falcon\Brain\state\<work-item-id>\task-card.md
```

The state folder is created if it does not exist.

### Step 6 — Append to `analysis/index.json`

A new run entry is appended (NOT overwriting prior runs) to
`C:\falcon\Brain\analysis\index.json` matching the schema documented in
`Brain/analysis/README.md`:

```jsonc
{
  "id":        "20260430-task-pickup-115329",
  "type":      "task-pickup",
  "level":     "L0",
  "outputs":   ["state\\115329\\task-card.md"],
  "summary":   "Picked up WIID 115329 (Contact Group — Permission matrix enforcement). PRD module: 04-contact-group-management.",
  "timestamp": "2026-04-30T22:35:01Z"
}
```

## Hand-off to Phase C

After this protocol finishes, the orchestrator (`Brain/scripts/orchestrator.ps1`)
picks up `state\<id>\task-card.md`, creates the matching `task-state.json`
from the template at `Brain/state/templates/task-state.template.json`, and
walks the L1 → L2 → L3 → scenarios → code → QA → push gate state machine.

This protocol is intentionally side-effect-light: read work item, read PRD,
emit one markdown file, append one JSON entry. No commits, no pushes, no
service-code edits.

## TODOs before this is wired live

1. Replace the stub work-item read with a real Azure DevOps call (see
   the `*** TODO: replace stub with real Azure DevOps API call ***`
   banner inside `get-the-task.ps1`).
2. Implement the LLM scope-check pass; currently the three sections render
   as `TODO` markers in the emitted task card.
3. Wire `AZDO_PAT` env var validation at startup; the script logs a
   warning if missing but does not yet require it.
