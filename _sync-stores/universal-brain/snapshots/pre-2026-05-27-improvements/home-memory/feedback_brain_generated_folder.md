---
name: All Brain-generated output lives under Brain/Brain Generated/
description: Brain pipeline must write every generated artifact inside C:\falcon\Brain\Brain Generated\ — never scattered at the Brain root
type: feedback
originSessionId: f1afca13-882b-4599-8532-38124ed50b1c
---
Every file the Brain pipeline produces (analysis output, journals, dev handbooks, user guides, gap-scan run records, manuals, reports) must live inside `C:\falcon\Brain\Brain Generated\`. Nothing Brain-generated may sit at the `Brain\` root level.

**Why:** The user consolidated the layout on 2026-05-01 to keep Brain root clean — only the script set, config, UI backend, settings, and source-of-truth skill files belong there. Generated artifacts must be quarantined into a single predictable subtree so they can be backed up, cleaned, or shared as one unit.

**How to apply:** When writing or modifying any Brain script, hook, or cron task, output paths MUST be under `Brain Generated\`:

| Subfolder | Holds |
|---|---|
| `Brain Generated\analysis\` | L0-L3 outputs, index.json, knowledge-journal.md, schemas, tables, raw |
| `Brain Generated\suggestions\` | Daily nightly-gap-scan run records (`<YYYY-MM-DD>.md`) |
| `Brain Generated\Manual Construction\` | Hand-curated manual + auto-built docx/xlsx/pptx + diagrams |

When a new artifact type is introduced, create a new subfolder under `Brain Generated\` — never at Brain root. The same rule applies to any script that creates files: organise them inside the existing folder structure, do not litter ad-hoc files.

Scripts already path-corrected for this layout: `growth-tick.ps1`, `nightly-gap-scan.ps1`, `gemini-artifacts.ps1`, `sync-orchestrator.ps1`, `get-the-task.ps1`. If a regression appears, search for `Join-Path $brainRoot 'analysis` or `Join-Path $brainRoot 'suggestions` — both must include `'Brain Generated\analysis'` / `'Brain Generated\suggestions'`.
