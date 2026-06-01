---
type: graph-schema
title: Falcon Knowledge Graph — Schema (Node + Edge Types)
created: 2026-05-27
wave-introduced: 1
up: "[[00_START_HERE]]"
tags: [graph, schema, contract]
---

# Graph Schema — Node + Edge Type Contract

> [!warning]
> This file is the contract. Every node + edge in `graph/nodes.json` + `graph/edges.json` MUST use a type listed here. New types require a new wave to introduce them with explicit rationale.

## Node types (30)

Each node carries this minimal frontmatter (markdown nodes) or JSON shape (machine-readable):

```yaml
---
graph-id: <slug>                # canonical id, e.g. comp:falcon-button
graph-type: <NodeType>          # one of the types below
name: <human-readable>
evidence: [<path>, <path>, ...] # files that prove this node exists
sot: <canonical-source-path>    # the single source-of-truth (xlsx for ValidationRule)
discovered-in-wave: <N>
last-confirmed-in-wave: <N>
parent-moc: "[[<MOC>]]"         # at least one parent for non-orphan
tags: [...]
---
```

### Node-type catalog

| # | Type | Definition | Primary evidence source |
|---|---|---|---|
| 1 | `App` | Top-level Angular/MF app (host-shell, admin-console, management-console, comm-channels, marketplace) | `apps/<name>/project.json` + memory entries |
| 2 | `Feature` | Cross-cutting feature area (Add Client, Add User, Service Pricing, etc.) | Page dossiers + memory topic names |
| 3 | `Page` | A user-visible page/screen | [BRAIN-OUT] `understanding/pages/<page>/` + [VAULT] `20-Pages/` |
| 4 | `Component` | A Falcon UI Core component (canonical kebab-case, e.g. `falcon-button`) | [BRAIN-OUT] `understanding/frontend/components/<comp>/` |
| 5 | `WrapperComponent` | Angular wrapper of a Stencil component (`<falcon-angular-*>`) | wrapper API.md sections + memory |
| 6 | `StencilComponent` | The underlying Stencil web component (`<falcon-*-tw>`) | Stencil source + dossier |
| 7 | `Directive` | Falcon Angular directive (e.g. `FalconStartWithLetterMax30Directive`) | [CODE] + page validation files |
| 8 | `Service` | Angular service or Falcon backend microservice | [BRAIN-OUT] `understanding/backend/<svc>/` + [VAULT] `50-Services/` |
| 9 | `API` | Logical API surface (e.g. Commerce API, Charging API) | `BACKEND_SERVICE_MAP.md` + `GATEWAY_ROUTE_MAP.md` |
| 10 | `Controller` | An ASP.NET controller class | [BRAIN-OUT] `understanding/backend/<svc>/ENDPOINT_REGISTRY.md` |
| 11 | `Endpoint` | A specific HTTP endpoint (verb + path) | `ENDPOINT_REGISTRY.md` rows |
| 12 | `DTO` | Data transfer object on the wire | [BRAIN-OUT] `understanding/backend/<svc>/DTO_DICTIONARY.md` + [BRAIN-SK] `40-API/E-*.md` |
| 13 | `ValidationRule` | A single validation rule (V-* in Brain SK) | [BRAIN-SK] `30-Validation/V-*.md` · **SoT = xlsx where covered** |
| 14 | `BusinessRule` | A business rule (BR-* per PRD) | [BRAIN-OUT] `prd/modules/<m>/BUSINESS_RULES.md` |
| 15 | `ArchitectureRule` | An architectural decision/rule (ADR or pattern) | [BRAIN-SK] `35-Architecture/*.md` |
| 16 | `PESRule` | A PES (permission) rule from BuiltInRoleCatalog + falcon-access.registry.ts | [BRAIN-OUT] `datasets/authority-dataset/03-pes-keys/` |
| 17 | `CSSFile` | A CSS file in the FE codebase | [CODE] paths (no edit, just reference) |
| 18 | `SCSSFile` | An SCSS file (legacy or active) | [CODE] paths |
| 19 | `TailwindClass` | A Tailwind utility class used in the codebase | [BRAIN-SK] `36-Theming/Tailwind*.md` |
| 20 | `CSSVariable` | A CSS custom property (`--falcon-*` token) | Component `TOKENS.md` files |
| 21 | `DesignToken` | A logical design token | Component `TOKENS.md` + [BRAIN-SK] `36-Theming/*Token*.md` |
| 22 | `ThemeMode` | A theme (light, dark) | [BRAIN-SK] `36-Theming/*` |
| 23 | `VisualState` | A visual state (hover, focus, active, disabled, loading) | Component dossiers + theming audits |
| 24 | `Variant` | A component variant (primary, secondary, ghost, etc.) | Component `API.md` |
| 25 | `Size` | A component size token (xs, sm, md, lg, xl) | Component `API.md` |
| 26 | `Pattern` | A reusable UI pattern (drawer, dialog, wizard) | [BRAIN-SK] `90-Approved-Patterns/*` |
| 27 | `Report` | An audit/scan report under `Brain Outputs/reports/` | [BRAIN-OUT] `reports/<scan>/` |
| 28 | `ScanMetadata` | Output of a scanner run (bootstrap-health, drift, etc.) | [BRAIN-OUT] `scan-metadata/*.json` |
| 29 | `Gap` | A documented knowledge or implementation gap | [VAULT] `70-Gaps/` + [BRAIN-SK] `70-Gaps/` |
| 30 | `Assumption` | An inferred-but-not-verified claim | Created when [INFERRED] prefix is used |
| 31 | `Conflict` | A documented contradiction between sources | Inserted whenever the graph detects PRD ↔ xlsx ↔ code disagreement |
| 32 | `Wave` | A graph-wave run (this node-type makes provenance walkable) | `waves/WAVE-NNN-GRAPH-PLAYBACK.md` |
| 33 | `MOC` | A Map of Content (index file) | [VAULT] `00-MOCs/*` + [BRAIN-SK] `*INDEX.md` |
| 34 | `KafkaEvent` | A produced/consumed Kafka event | [BRAIN-SK] `47-Events/*` |
| 35 | `Module` | A PRD-level module (account-mgmt, user-mgmt, etc.) | [BRAIN-OUT] `prd/modules/<n>/` |

> Count = 35 explicit types. User spec called out ~30; this expands with KafkaEvent + Module which are evidenced and distinct from API/Service.

## Edge types (40)

```yaml
{
  "from": "<source-graph-id>",
  "to": "<target-graph-id>",
  "type": "<EdgeType>",
  "evidence-strength": "confirmed | needs-review | inferred",
  "evidence": ["<path-or-pattern>", ...],
  "discovered-in-wave": <N>,
  "notes": "<optional>"
}
```

### Edge-type catalog

| # | Type | From → To | When to emit |
|---|---|---|---|
| 1 | `PARENT_MOC` | Node → MOC | Node has a parent MOC frontmatter link |
| 2 | `CHILD_NODE` | MOC → Node | Inverse of PARENT_MOC; emitted for graph walk |
| 3 | `RELATED_TO` | Node → Node | Same domain, loosely coupled |
| 4 | `USES_COMPONENT` | Page → Component (or Component → Component) | Page dossier `09-COMPONENTS.md` or wrapper imports |
| 5 | `USED_BY` | Component → Page | Inverse |
| 6 | `IMPORTS` | File → File | TypeScript import |
| 7 | `EXPORTS` | File → Symbol | TypeScript export |
| 8 | `WRAPS` | WrapperComponent → StencilComponent | Angular wrapper of Stencil host |
| 9 | `DEFINES_TOKEN` | Component → DesignToken | Component owns this token (CSS-vars declared) |
| 10 | `USES_TOKEN` | Component → DesignToken | Component consumes another component's token |
| 11 | `OVERRIDES_TOKEN` | Component → DesignToken | Component overrides default via SoT |
| 12 | `MAPS_TO_TOKEN` | CSSVariable → DesignToken | Variable is the materialization of a token |
| 13 | `DEFINES_CSS_VARIABLE` | Component → CSSVariable | Component declares the variable |
| 14 | `USES_CSS_VARIABLE` | Component → CSSVariable | Component reads the variable |
| 15 | `USES_TAILWIND_CLASS` | Component → TailwindClass | Class appears in component template |
| 16 | `USES_SCSS_CLASS` | Component → SCSSFile | SCSS class consumed (legacy) |
| 17 | `HAS_INPUT` | Component → Property | Angular `@Input()` |
| 18 | `HAS_OUTPUT` | Component → Property | Angular `@Output()` |
| 19 | `HAS_SLOT` | Component → Slot | Named/default slot |
| 20 | `HAS_VARIANT` | Component → Variant | Variant token defined |
| 21 | `HAS_SIZE` | Component → Size | Size token defined |
| 22 | `HAS_STATE` | Component → VisualState | hover/focus/active/disabled |
| 23 | `HAS_STYLE_SOURCE` | Component → CSSFile or SCSSFile | Stylesheet authoritatively styles this component |
| 24 | `AFFECTS_VISUAL_AREA` | Token → Component-area | "Border-radius affects buttons + inputs + cards" |
| 25 | `CONNECTS_TO_API` | Page or Component → API | Page calls the API |
| 26 | `USES_DTO` | Endpoint → DTO | Endpoint accepts/returns DTO |
| 27 | `HAS_VALIDATION` | Page/Component/DTO → ValidationRule | Where the rule applies — **evidence-strength=confirmed only if xlsx covers it** |
| 28 | `IMPLEMENTS_BUSINESS_RULE` | Page/Service/Endpoint → BusinessRule | BR-* satisfaction |
| 29 | `GOVERNED_BY_ARCHITECTURE_RULE` | Node → ArchitectureRule | Pattern/ADR applies |
| 30 | `GOVERNED_BY_PES_RULE` | Page/Endpoint → PESRule | PES gate applies |
| 31 | `DEPENDS_ON` | Node → Node | Build/runtime dependency |
| 32 | `REPLACES` | New → Old | xlsx-V-rule replaces PRD-V-rule (see SoT-flip invariant) |
| 33 | `LEGACY_DEPENDS_ON` | Node → Node | Soft dep marked for retirement |
| 34 | `MIGRATION_TARGET_IS` | Old → New | Pairing for active migration |
| 35 | `CONFLICTS_WITH` | Node → Node | Two sources disagree; emits a Conflict node |
| 36 | `NEEDS_REVIEW` | Node → Node | Evidence weak; human-review required |
| 37 | `DOCUMENTED_IN` | Node → File | Where the node is described |
| 38 | `EVIDENCED_BY` | Node → File | Stronger than DOCUMENTED_IN — file proves existence |
| 39 | `DISCOVERED_IN_WAVE` | Node → Wave | Provenance |
| 40 | `NEXT_WAVE_TARGET` | Wave → Node | Wave N declares "Wave N+1 should look at this" |
| 41 | `PRODUCES_EVENT` | Service → KafkaEvent | Service emits this event |
| 42 | `CONSUMES_EVENT` | Service → KafkaEvent | Service subscribes to this event |
| 43 | `IN_MODULE` | Node → Module | Page/Service/Entity belongs to PRD module |
| 44 | `HAS_GAP` | Node → Gap | Open gap on this node |
| 45 | `ASSUMES` | Node → Assumption | Provenance of inferred fact |

> Count = 45. User spec listed ~35; this adds `PRODUCES_EVENT` / `CONSUMES_EVENT` (Kafka), `IN_MODULE`, `HAS_GAP`, `ASSUMES` — all evidenced from existing knowledge stores.

## Source-prefix invariant (every node)

Every node's `evidence` array MUST cite at least one of:
- `[CODE]` — file:line in the FE/BE code (the graph itself does not write to code, but it cites it)
- `[BRAIN-OUT]` — `Brain Outputs/...`
- `[VAULT]` — `falcon-wiki/...`
- `[BRAIN-SK]` — `Brain SK/_obsidian/...`
- `[MEMORY]` — a topic file under `home-memory/`
- `[INFERRED]` — inferred (auto-creates an `Assumption` companion node)

## SoT priority for ValidationRule

1. `Validations.xlsx` (snapshot path: `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx`) — wins over PRD when both cover the field
2. Backend FluentValidation attributes — for backend-only constraints not in xlsx
3. PRD-01/02 — historical reference only where xlsx contradicts (xlsx wins)
4. V-rule notes derived from xlsx (`V-*-xlsx-*.md`) — authoritative

xlsx column schema (from `dump-SOT/Add_Client_Step_1.tsv`):
```
Field Name | Filed type | Mandetory | Lenght/Size | Unique Validation |
Allowed extentions | Allowed content | Allowed Special Char | Lang |
Valid Sample | InValid Sample | Error Message | Business Rules
```

When converting an xlsx row to a `ValidationRule` node, map:
- xlsx `Field Name` → node `name`
- xlsx `Mandetory` → node `required: yes|no`
- xlsx `Lenght/Size` → node `length`
- xlsx `Valid Sample` / `InValid Sample` → node `samples: { valid, invalid }`
- xlsx `Error Message` → edge `HAS_VALIDATION.errorMessage`
- xlsx `Business Rules` → edge `IMPLEMENTS_BUSINESS_RULE` (separate edges per rule)

## Conflict resolution (per [BRAIN-OUT] DECISION-PROTOCOL.md)

When the graph builder finds two sources disagreeing, emit:
- A `Conflict` node (`graph-id: conflict:<topic>-<date>`)
- `CONFLICTS_WITH` edges to both contradicting nodes
- One `REPLACES` edge if the winner can be determined per SoT priority (xlsx wins over PRD; backend code wins on transport shape; PRD wins on labels)
- `NEEDS_REVIEW` edge to the loser if not auto-resolvable

## See also

- [[00_START_HERE]] — graph entry
- [[MOC_CONNECTIONS_INDEX]] — which MOCs root which clusters
- [BRAIN-OUT] `19-night-shift-readiness/DECISION-PROTOCOL.md` — fork-resolution catalog
- [BRAIN-OUT] `BRAIN-ARCHITECTURE-CHART.md` — store-level view of the same ecosystem
