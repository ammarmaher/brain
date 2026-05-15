---
type: flow-folder
flow-name: <Flow Name>
page-slug: <page-slug>
prd: PRD-NN
form: folder
file-count: 17
created: <YYYY-MM-DD>
---

# Folder-form Flow Playbook — instructions

This template is META: it describes the 17-file folder structure to create when a flow warrants full decomposition. **Don't paste this whole file as a note.** Instead, use it as a recipe — create the 17 files inside `Brain Outputs/understanding/pages/<page>/<Flow Name>/` and the matching vault note at `_obsidian/10-Pages/<Flow Name> Flow.md`.

## 17-file folder structure (canonical — matches Add Client)

```
Brain Outputs/understanding/pages/<page>/<Flow Name>/
  README.md                       ← entry point + per-task load order
  00-OVERVIEW.md                  ← purpose · actors · step summary
  01-PERMISSIONS.md               ← role matrix
  02-STEP_1_<NAME>.md             ← per-step files
  03-STEP_2_<NAME>.md
  ...
  07-VALIDATIONS.md               ← consolidated validation rules + V-rule wiki-links
  08-BACKEND_API.md               ← endpoint table · DTO shape · error codes
  09-COMPONENTS.md                ← Falcon components used + customization
  10-KAFKA_SIDE_EFFECTS.md        ← server side effects · downstream chain
  11-STATE_TRANSITIONS.md         ← state machines for affected entities
  12-ERROR_STATES.md              ← error code → UX mapping
  13-GAPS_AND_DRIFTS.md           ← honest PRD↔DTO drift surfaces
  14-IMPLEMENTATION_CHECKLIST.md  ← FE / BE / full-stack checklist
  PLAYBOOK.md                     ← full single-doc reference (concat of 14 sections)
```

## Banner template (use this exact 3-line top in every file)

```
*** <Flow Name> — <Section Name> ***
*** SoT for implementation · Page: <Page Name> · <YYYY-MM-DD> ***
*** Part of: Brain Outputs/understanding/pages/<page>/<Flow Name>/ ***
```

## Vault graph node (matching pattern at `10-Pages/<Flow Name> Flow.md`)

- 3-line banner pointing at the SoT folder (not a single file)
- Body wiki-links every section file via Markdown path-relative syntax
- `## Hubs` at the bottom

## Reference example

`Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` is the canonical reference. Copy that structure for any new folder-form flow.

## When to use folder form vs single-file form

| Use folder form | Use single-file form |
|---|---|
| Flow has 4+ steps OR 30+ fields OR multiple downstream services | Flow has 1-3 steps, few fields, single-service |
| Multiple agents may need to drill into specific sections | One agent reads end-to-end |
| Flow will accrue learning events / gaps over time | Flow is "set it and forget it" |

Add Client uses folder form (5 steps · 40 fields · Kafka chain to Identity + Charging). Add User · Add Node · Edit Node use single-file form today (could be promoted to folder form when they accrue depth).
