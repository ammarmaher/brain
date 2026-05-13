# Initial Bootstrap / Parallel Discovery Protocol

## Purpose

Before normal task execution, Brain SK must build the first knowledge base instead of guessing.

## Required setup checks

| Item | Required action |
|---|---|
| Brain repo | Clone/verify `https://github.com/ammarmaher/brain` |
| Frontend repo | Verify path, branch, status, build commands |
| Backend repos | Verify paths, branches, controllers, DTOs, validators |
| Gateway repo | Verify route config and branch |
| PRD folder | Verify files and latest changes |
| Architecture wiki | Verify docs/images/diagrams and branch/location |
| Obsidian | Optional, verify vault path if available |
| Git | Must be installed |
| Node/npm | Verify for Angular frontend |
| .NET SDK | Verify if backend build/metadata extraction is needed |

## Parallel agents

| Agent | Reads | Produces |
|---|---|---|
| PRD / Business Agent | PRDs, epics, business docs | actors, flows, rules, statuses, gaps, assumptions, tests |
| Backend / API Agent | services, controllers, DTOs, validators, gateway | endpoint map, DTO dictionary, validation map, frontend contracts |
| Falcon Component Agent | Angular apps/libs/shared UI | component registry, selectors, inputs, outputs, templates, slots, variants |
| Architecture Wiki Agent | wiki, diagrams, images, standards | architecture rules, boundaries, conflicts, wiki memory |
| Integration / Impact Agent | all generated outputs | dependency map, conflict map, readiness score, next actions |

## Bootstrap outputs

```text
bootstrap/
  INITIAL_DISCOVERY_REPORT.md
  INITIAL_DISCOVERY_REPORT.pdf
  repo-map.json
  scan-metadata.json
```

## Rule

First run is deep. Later runs are incremental using Git diff, timestamps, checksums, and scan metadata.
