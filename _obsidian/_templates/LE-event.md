---
type: learning-event
le-id: LE-<YYYYMMDD>-<page-slug>-<NNN>
page-slug: <page-slug>
source-type: <prompt|screenshot|bug|correction|approval|rejection>
category: <uiux|validation|api|business|component|gap|evidence>
status: <pending|approved|rejected|promoted|deprecated>
confidence: <low|medium|high>
created: <YYYY-MM-DD>
---

*** Learning Event — <one-line summary> ***
*** Vault file: 80-Evidence/LE-<id>.md ***
*** Brain Outputs SoT: understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md + light-learning/<id>.md ***
*** Status: <status> ***

# LE-<id>

> Graph node for this single learning event. Brain Outputs holds the data; this note holds the connections.

## Identity

| Field | Value |
|---|---|
| learningId | `LE-<id>` |
| createdAt | <ISO 8601> |
| sourceType | `<prompt|screenshot|bug|correction|approval|rejection>` |
| page | [[<Page Name>]] |
| sections | section slugs |
| component | [[<Falcon Component>]] |
| category | `<category>` |
| status | **<status>** |
| confidence | <low|medium|high> |

## What happened

**User instruction (verbatim):** "..."

**Extracted meaning:** ...

## Sources of truth

- Event row in [LIGHT_LEARNING_EVENTS.md](../../../Brain%20Outputs/understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md)
- Full event file: [`light-learning/<id>.md`](../../../Brain%20Outputs/understanding/pages/<page>/light-learning/<id>.md)

## Evidence

- Screenshot / notes / file pointers

## Promoted rules (UI/UX / Validation / Business — page-specific)

(Only fill if `status` is `approved` or `promoted`)

| Rule id | Rule (one-line) |
|---|---|

## Component decisions

(If `category` is `component`)

## Gap closed / opened

- `GAP-...` (closed or opened by this event)

## Touched files (repo)

- File paths

## Hubs

- [[PAGE_LEARNING_INDEX]] · [[EVIDENCE_INDEX]] · [[UI_UX_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[COMPONENT_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
