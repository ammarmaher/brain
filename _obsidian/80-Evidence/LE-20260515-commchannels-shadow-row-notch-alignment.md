---
type: learning-event
le-id: LE-20260515-commchannels-shadow-row-notch-alignment
page-slug: organization-hierarchy
source-type: bug
category: api
status: approved
created: 2026-05-15
---
*** Learning Event — commchannels shadow-row notch alignment ***
*** Vault file: 80-Evidence/LE-20260515-commchannels-shadow-row-notch-alignment.md ***
*** Brain Outputs SoT: understanding/pages/organization-hierarchy/LIGHT_LEARNING_EVENTS.md + light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md ***
*** Status: approved (resolved Wave 20, 2026-05-15) ***

# LE-20260515-commchannels-shadow-row-notch-alignment

> Graph node for this single learning event. Brain Outputs holds the data; this note holds the connections.

## Identity

| Field | Value |
|---|---|
| learningId | `LE-20260515-commchannels-shadow-row-notch-alignment` |
| createdAt | 2026-05-15T00:00:00+03:00 |
| sourceType | `bug` |
| page | [[Organization Hierarchy]] |
| sections | `comm-channels-tab`, `apps-services-tab` (shared `applications-table` component) |
| component | [[Falcon Data Table]] (shadow rows feature, Wave 19/20) |
| category | `uiux` |
| status | **approved** (resolved Wave 20) |
| confidence | high |

## What happened

**User instruction (verbatim):** "Notch not found" — annotation on a screenshot of `http://localhost:4200/#/admin-console/org-hierarchy-page` CommChannels & Services tab.

**Extracted meaning:** The shadow row's green band, edit form, and Cancel/Save buttons render correctly, but the arrow notch (▲) at the top edge — which should point UP at the target column header — is invisible. Root cause traced to Tailwind class `top-0 -translate-y-full` being a no-op on `w-0 h-0` (percentage translate is relative to element's own CSS height = 0). Triangle stayed at `top:0` with the visible bottom-border extending DOWN INTO the green band — same colour = invisible. Fix: explicit `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]`.

## Sources of truth

- Event row in [LIGHT_LEARNING_EVENTS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/LIGHT_LEARNING_EVENTS.md)
- Full event file: [`light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md)

## Evidence

- [EV-20260515-commchannels-notch-missing](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/EVIDENCE_INDEX.md) — annotated screenshot + transcribed notes
- Screenshot notes: `evidence/org-hierarchy/2026-05-15-commchannels-notch-missing/SCREENSHOT_NOTES.md` (image binary not persisted to disk)

## Promoted rules (UI/UX — page-specific)

Approved into [UI_UX_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) as a 5-rule cluster:

| id | rule (one-line) |
|---|---|
| UIUX-SHADOW-001 | Shadow edit rows MUST use the `falcon-angular-data-table` shadow-row API (`[shadowRows]`, `[(expandedShadowRowIds)]`, `[(shadowRowModes)]`, `<ng-template falconDataTableShadow>`). Hand-rolled `<tr>` edit-expanded rows are forbidden. |
| UIUX-SHADOW-002 | Notch (▲) alignment is library-owned via `ShadowRow.targetColumn = '<columnField>'`. Consumers MUST NEVER hardcode notch position. |
| UIUX-SHADOW-003 | Notch colour / size / z-index MUST come from `--falcon-data-table-shadow-*` tokens. No inline styles, no hardcoded hex. |
| UIUX-SHADOW-004 | Default trailing actions (Edit/Delete view · Save/Cancel edit) are library-owned. Override only via `<ng-template falconDataTableShadowActions>`. |
| UIUX-SHADOW-005 | Multiple shadow rows per parent row supported — distinct `ShadowRow.id` + distinct `targetColumn` per shadow. |

## Component decisions

Recorded in [COMPONENT_USAGE_DECISIONS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_USAGE_DECISIONS.md):

| section | chosenComponent | customizationStep | decisionStatus |
|---|---|---|---|
| `comm-channels-tab — scheduled-change edit row` | `<falcon-angular-data-table>` shadow rows API | 3 (`ng-template` projection) + lib upgrade Wave 20 | applied |
| `apps-services-tab — scheduled-change edit row` | `<falcon-angular-data-table>` shadow rows API (shared `applications-table`) | 3 (`ng-template` projection) | applied |

## Gap closed

- `GAP-COMMCHANNELS-NOTCH-001` — closed Wave 20

## Open follow-ups (component dossier)

Tracked in [falcon-data-table / GAPS_AND_UPGRADES.md](../../outputs/understanding/frontend/components/falcon-data-table/GAPS_AND_UPGRADES.md):

- `FDT-SHADOW-FU-01` through `FDT-SHADOW-FU-08`

## Touched files (repo)

- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` — position-update logic + JSX cleanup
- `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — `falconTableShadowArrowClasses()` rewrite
- `libs/falcon-ui-tokens/src/components/data-table.tokens.css` — new `--falcon-data-table-shadow-arrow-z` token

## SoT sync note

`APPROVED_PAGE_PATTERNS.md` is still empty in Brain Outputs — the 5 UIUX-SHADOW rules landed directly in `UI_UX_RULES.md`, but a corresponding row in `APPROVED_PAGE_PATTERNS.md` was not added in the same pass. Recording here so the next Deep Learning run can reconcile.

## Tags

#type/learning-event #status/promoted #severity/medium #gap

## Hubs

- [[PAGE_LEARNING_INDEX]] · [[EVIDENCE_INDEX]] · [[UI_UX_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[COMPONENT_INDEX]] · [[GAPS_INDEX]]
