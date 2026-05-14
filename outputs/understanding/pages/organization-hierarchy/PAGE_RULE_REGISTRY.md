# Page Rule Registry — Organization Hierarchy

> Index of all rules extracted for this page. Detailed entries live in the dimension-specific files. Statuses are evidence-based per `protocols\SOURCE_OF_TRUTH_PRIORITY.md`.

## Rule status taxonomy (canonical, do not change)

| Status | Meaning | Counts toward score? |
|---|---|---|
| `applied` | Source has this rule AND Angular implementation has it AND verified live | YES (numerator) |
| `not_applied` | Source has this rule, Angular implementation does NOT have it (or has it wrong) | YES (denominator only) |
| `applicable` | Source has this rule, Angular should add it (not yet present, decided to implement) | YES (denominator only) |
| `not_applicable` | Source has this rule but we deliberately don't apply it (e.g. Kanban view deferred) | NO (excluded entirely) |
| `partially_applied` | Source has this rule, Angular has part of it (visual yes, behavior no, or vice versa) | HALF (counted as 0.5 applied + 0.5 not_applied) |
| `unknown` | Rule extracted but not yet verified live against source AND destination | NO (excluded from score) |
| `blocked` | Verification blocked (e.g. live server down, browser session issue, missing PRD/Wiki) | NO (excluded from score) |

## Mandatory fields per rule

Every rule entry MUST carry:
- `ruleId` — unique within its dimension file
- `title` — short human label
- `category` — `uiux \| validation \| business \| gap \| component \| backend`
- `source` — file/line/screenshot reference
- `destination` — file/line in Angular implementation (or "none")
- `status` — one of the 7 above
- `scoreImpact` — `1.0`, `0.5`, or `0` depending on status
- `reason` — why this status was assigned
- `nextAction` — concrete next step (code snippet preferred)
- `lastChecked` — ISO date when status was last verified
- `relatedComponent` — Falcon component(s) implicated (or "none")

## Index

| Dimension | Rules count | Applied | Not Applied | Applicable | Not Applicable | Partial | Unknown | Blocked |
|---|---|---|---|---|---|---|---|---|
| UI / UX | 32 | 11 | 8 | 5 | 2 | 3 | 3 | 0 |
| Business | 14 | 2 | 4 | 5 | 1 | 0 | 2 | 0 |
| Validation | 9 | 0 | 4 | 4 | 0 | 0 | 1 | 0 |
| Gaps | 14 | 3 (resolved) | 0 | 9 (open) | 2 (deferred) | 0 | 0 | 0 |
| **TOTAL** | **69** | **16** | **16** | **23** | **5** | **3** | **6** | **0** |

> Counts are seeded estimates derived from ingestion of the 5 prior reports + live regression. Each rule is detailed in its dimension file with full evidence.

## Dimension files

| File | Scope | Granularity |
|---|---|---|
| [`UI_UX_RULES.md`](UI_UX_RULES.md) | Visual + interaction rules | Element/section level |
| [`VALIDATION_RULES.md`](VALIDATION_RULES.md) | Field + flow validation | Field/flow level |
| [`BUSINESS_RULES.md`](BUSINESS_RULES.md) | Feature behavior + flow rules | Feature/flow level |
| [`GAP_REGISTRY.md`](GAP_REGISTRY.md) | Source/destination mismatches, missing PRD/Wiki, library gaps | Decision level |

## Rule lifecycle

```
[unknown] ──verify live──► [applied | not_applied | partially_applied | applicable | not_applicable | blocked]
   │                              │
   │                              └── on user approval of fix → [applied]
   │                              └── on decision to defer → [not_applicable]
   │
   └── if verification impossible right now → [blocked] (must include reason)
```

## How rule scoring rolls up to dimension

For each dimension D:
```
applied_count       = count(status == 'applied') + 0.5 × count(status == 'partially_applied')
not_applied_count   = count(status == 'not_applied') + 0.5 × count(status == 'partially_applied')
applicable_count    = count(status == 'applicable')
denominator         = applied_count + not_applied_count + applicable_count
                      (excludes not_applicable, unknown, blocked)

D_score = (applied_count / denominator) × 100   if denominator > 0
        = 0                                      otherwise
```

For the Gaps dimension specifically:
- "Applied" means "resolved or marked-NotApplicable"
- "NotApplied" means "open and blocking"
- "Applicable" means "open but pending decision"

## Where to look for evidence

- For visual rules → live source HTML at `http://localhost:8765/T2%20Falcon%20Admin%20-%20Offline.html` + Angular live at `http://localhost:4200/#/admin-console/org-hierarchy-page`
- For behavior rules → React source at `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\*.jsx`
- For business/validation rules → backend/API understanding + (when present) PRD + (when present) Wiki
- For library-related rules → `C:\falcon\Brain SK\registries\FALCON_COMPONENT_REGISTRY.md`
- For known library bugs → `C:\falcon\Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md`
