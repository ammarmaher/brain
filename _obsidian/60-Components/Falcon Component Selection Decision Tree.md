---
type: decision-tree
cluster: component-selection
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Component Selection Decision Tree ***
*** Reuse → Extend → Create — in that order, never reversed ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Component Selection Decision Tree

> **The reuse-first contract.** Before any agent (human or AI) introduces a new component, custom HTML, or page-specific UI hack, walk this decision tree. The tree forces you to exhaust existing Falcon capabilities first.

## 1. Purpose

Make the build/reuse decision **deterministic and source-cited**:
- Reuse existing Falcon component → default path (95% of cases)
- Extend a Falcon component via its existing slot/input/prop API → second path (4% of cases)
- Document a capability gap → before any bespoke work (1% trigger condition)
- Create a new component → ONLY after Ammar approval and gap is registered

## 2. The decision tree (walk top-to-bottom)

```
                ┌──────────────────────────────────────┐
                │  START: I need this UI element       │
                │  (button / table / dialog / etc.)    │
                └──────────────┬───────────────────────┘
                               │
                               ▼
       ┌─────────────────────────────────────────────────────┐
       │  Q1. Does a Falcon component already exist?         │
       │  (Open [[Falcon Component Recognition Playbook]])   │
       └────────────┬────────────────────────────┬───────────┘
                    │ YES                        │ NO
                    ▼                            ▼
       ┌────────────────────────┐    ┌──────────────────────────────┐
       │  Q2. Does it support   │    │  Check [[Falcon Component    │
       │  the capability I need │    │  Capability Matrix]] for any │
       │  out of the box?       │    │  adjacent component.         │
       │  (states / slots /     │    │  Found one? Back to Q2 with  │
       │   modes / outputs)     │    │  it. Still nothing? → Q6.    │
       └─────┬─────────────┬────┘    └──────────────────────────────┘
             │ YES         │ NO
             ▼             ▼
       ┌──────────┐  ┌────────────────────────────────────────┐
       │ REUSE.   │  │  Q3. Can I extend it via an existing   │
       │ Use the  │  │  prop/input/slot/template?             │
       │ wrapper. │  │  (e.g., `[loading]`, `ng-template`,    │
       │ Stop.    │  │   `<slot name=...>`, variant, size)    │
       └──────────┘  └────────┬──────────────────┬────────────┘
                              │ YES              │ NO
                              ▼                  ▼
                       ┌────────────────┐  ┌──────────────────────────────┐
                       │ EXTEND. Use    │  │  Q4. Is the missing          │
                       │ the prop/slot. │  │  capability REUSABLE across  │
                       │ Stop.          │  │  pages / scenarios?          │
                       └────────────────┘  └────┬──────────────────┬──────┘
                                                │ YES              │ NO
                                                ▼                  ▼
                                ┌──────────────────────┐  ┌──────────────────┐
                                │  Q5. Document the    │  │  Q5a. Document   │
                                │  capability gap in   │  │  the gap as      │
                                │  [[Falcon Component  │  │  page-specific.  │
                                │  Gap Registry]] with │  │  Use existing    │
                                │  P0/P1/P2/P3 score.  │  │  components + a  │
                                │  Then either         │  │  minimal local   │
                                │  block (P0/P1) or    │  │  composition.    │
                                │  proceed with a      │  │  Do NOT create   │
                                │  short-term local    │  │  a new shared    │
                                │  composition.        │  │  component.      │
                                └──────────────────────┘  └──────────────────┘

                       Q6 (only when no Falcon component covers the role at all):
                       ┌────────────────────────────────────────────────┐
                       │  Document the gap as a NEW-COMPONENT gap in    │
                       │  [[Falcon Component Gap Registry]] and STOP.   │
                       │  Wait for Ammar to approve creation. Only      │
                       │  then can a new component be authored, and it  │
                       │  must follow [[Falcon Component Theme         │
                       │  Contract]].                                    │
                       └────────────────────────────────────────────────┘
```

## 3. Decision rules — short form

### REUSE rules (default path)

| Rule | Detail |
|---|---|
| **R-01** | If a Falcon component covers the UI role (per [[Falcon Component Recognition Playbook]] §2), reuse it. No exceptions. |
| **R-02** | Reuse via the `<falcon-angular-*>` Angular wrapper — never via the underlying Stencil element directly inside an Angular app. |
| **R-03** | Bind via `[formGroup]` + `formControlName` for form controls (CVA-driven). 15 wrappers support CVA today. |
| **R-04** | Use the component's `variant` / `size` / `severity` / `mode` props for visual differences — never override component classes from the outside. |
| **R-05** | For per-cell / per-row / per-step custom content, use `<ng-template falcon...>` directive (Strategy E for data tables, `falconTabActions` for tabs, etc.). |

### EXTEND rules (second path)

| Rule | Detail |
|---|---|
| **E-01** | "Extend" means **using an existing API surface** — props, inputs, slots, templates, outputs. It does NOT mean editing the component's source. |
| **E-02** | Common extension points: data table's `<ng-template falconColumn>`, tabs' `<ng-template falconTabActions>`, empty-state's icon/title/description/actions slots, drawer's header/content/footer templates. |
| **E-03** | If you need a new slot or input that doesn't exist yet — that's a Q3-NO branch. Go to Q4. |
| **E-04** | Token-driven extension (e.g., `style="--falcon-data-table-header-bg: ..."`) is allowed when the token is documented in the component's `*.tokens.css`. Inline arbitrary values are NOT. |

### GAP rules (before any bespoke work)

| Rule | Detail |
|---|---|
| **G-01** | Before writing any custom HTML/CSS/Angular code that duplicates an existing component's role, log a gap entry in [[Falcon Component Gap Registry]]. |
| **G-02** | Gap entries must include: Gap ID, Component, Missing Capability, Needed-By page, Reusable Y/N, Recommended Fix, Priority (P0/P1/P2/P3). |
| **G-03** | P0/P1 gaps BLOCK page work — escalate to Ammar before proceeding. P2/P3 can be addressed in parallel with a minimal local workaround. |
| **G-04** | If a similar gap already exists in [[Falcon Component Gap Registry]], reference its ID rather than create a duplicate. |
| **G-05** | DO NOT use a gap as a license to redesign the component from the outside. The gap means the component needs updating in its own library. |

### CREATE rules (last resort)

| Rule | Detail |
|---|---|
| **C-01** | Creating a new Falcon component requires **explicit Ammar approval**. No exceptions. |
| **C-02** | A new component is justified ONLY when: (a) no existing Falcon component covers the role, AND (b) the capability is reusable across multiple pages / scenarios. |
| **C-03** | One-page-only widgets are NOT new Falcon components — they're page-local Angular components composed from existing Falcon atoms. |
| **C-04** | Approved new components MUST follow [[Falcon Component Theme Contract]] (9-section contract). |
| **C-05** | New components MUST register tokens via `:where(falcon-X, falcon-X-tw, falcon-angular-X)` scoping per the per-component token-file convention. |

## 4. Hard prohibitions (regardless of decision tree)

These are **always wrong**, no matter how convenient:

- ❌ Use raw `<button>`/`<input>`/`<select>`/`<table>`/`<dialog>` when a Falcon component covers the role
- ❌ Use a page-specific duplicate UI when a shared component exists
- ❌ Redesign the visuals of a Falcon component from outside (e.g., `!important` overrides on Falcon wrappers)
- ❌ Use arbitrary colors / spacing / radius when a Falcon token exists
- ❌ Use inline `style="..."` for visual properties that have tokens
- ❌ Add per-page SCSS files (Falcon enforces no-SCSS rule — P0-10)
- ❌ Skip the gap-logging step before writing bespoke work

## 5. Decision tree — short examples

### Example 1 — User clicks "Add User"

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — button | [[Falcon Component Recognition Playbook]] row "button" → `<falcon-angular-button>` |
| Q2 — supports? | YES — `variant="primary"`, `size="md"`, `[loading]`, click event | All on-the-shelf |
| **Path:** | REUSE | One-liner: `<falcon-angular-button variant="primary" size="md" (falconClick)="onAddUser()">Add User</falcon-angular-button>` |

### Example 2 — Data table with per-row custom status cell

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — data table | `<falcon-angular-data-table>` |
| Q2 — supports? | NO out-of-box (default cell is raw text) | But there's Strategy E via `<ng-template falconColumn>` |
| Q3 — extend? | YES via `<ng-template falconColumn="status" let-row><falcon-angular-status-badge [severity]="row.status">...</falcon-angular-status-badge></ng-template>` | Existing API surface |
| **Path:** | EXTEND | Use the column template directive |

### Example 3 — Need a popup with a focus trap

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — popup | `<falcon-angular-popup>` |
| Q2 — supports? | NO — popup is missing focus trap (P0-01) | Verified WCAG violation |
| Q3 — extend? | YES via compose: wrap content in `<falcon-angular-dialog>` (which has focus trap) | P1-02 is exactly this composition |
| **Path:** | EXTEND (via composition) | Inherit the trap from dialog |

### Example 4 — Need a data table that supports lazy server-paged rows AND custom cells AND a status column AND inline editing

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — data table | `<falcon-angular-data-table>` |
| Q2 — supports? | YES — `[lazy]`, Strategy E cells, status-badge in cell, inline edit via cell template | All on-the-shelf |
| **Path:** | REUSE | Same shipped component |

### Example 5 — Org-hierarchy left rail with custom hover, kebab per node, multi-level expand

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — tree panel | `<falcon-tree-panel>` (legacy bespoke) |
| Q2 — supports? | YES — root kebab + per-node kebab + custom hover already shipped | Used in production Organization Hierarchy page |
| **Path:** | REUSE | `<falcon-tree-panel>` is the canonical rail |

### Example 6 — "Need a tree where each row can show a status chip + 2 action buttons + custom hover color"

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | YES — generic tree | `<falcon-angular-tree>` |
| Q2 — supports? | NO — generic tree lacks per-row template + action slot (P0-06 gap) | Verified gap |
| Q3 — extend? | NO — no existing API supports this | P0-06 itself documents this |
| Q4 — reusable? | YES — multi-page need | Tree-panel convergence demands it |
| **Path:** | LOG GAP (P0-06 already registered) | Use legacy `<falcon-tree-panel>` for now; wait for P0-06 fix |

### Example 7 — "Need a brand-new 'kanban board' for tasks"

| Step | Decision | Reasoning |
|---|---|---|
| Q1 — exists? | NO — no kanban component in Falcon | Confirmed absent from registry |
| Q6 — register new-component gap | Document in [[Falcon Component Gap Registry]] as NEW-COMPONENT type | Block until Ammar approves |
| **Path:** | GAP + STOP | No kanban code until approval |

## 6. Anti-patterns (don't do these)

| Anti-pattern | Why wrong | Right answer |
|---|---|---|
| Reach for a new bespoke component "because it's faster" | Creates visual + token drift; bypasses theme contract | Walk the tree |
| Override Falcon component classes with `!important` | Breaks the variant system; hurts upgradability | Use a real variant or log gap |
| Add a per-page SCSS file with custom rules | Violates no-SCSS gate (P0-10) | Use Tailwind utilities + tokens |
| Inline `style="..."` for visual properties | Bypasses token contract | Use the matching `bg-falcon-*` / `text-falcon-*` |
| Copy-paste an existing component into the page and modify | Duplicates code, multiplies bugs | Use the wrapper directly + extension API |
| Use a non-Falcon library because it has the feature | Creates parallel design system | Log gap, escalate, wait for Falcon to add the feature |
| Skip gap-logging because "it's just a quick fix" | Gap stays invisible, future agents make the same mistake | Log it. Always. |

## 7. Angular-first notes

- This decision tree applies to Angular consumers (admin-console, management-console, host-shell).
- Stencil layer is the underlying primitive — agents writing Angular pages should never reach below the `<falcon-angular-*>` wrapper.
- React/Vue future placeholders inherit the same decision tree; no Angular-specific exceptions.

## 8. Future-agent instructions

- **Run this tree BEFORE writing any new template HTML or new component file.**
- **If you skipped the tree and shipped bespoke work:** revisit, log the corresponding gap, refactor in next wave.
- **If you're unsure whether the tree applies:** it applies. Walk it anyway.
- **If you find a gap not in [[Falcon Component Gap Registry]]:** add it in the same PR.

## See also

- [[Falcon Component Recognition Playbook]] — Q1 lookup table
- [[Falcon Component Capability Matrix]] — Q2 quick reference
- [[Falcon Component Gap Registry]] — Q4 / Q5 / Q6 log destination
- [[Falcon Component Theme Contract]] — applies if creating a new component
- [[Falcon Page Assembly Playbook]] — once decisions are made, here's how to compose
- [[Falcon New Page Implementation Checklist]] — pre-merge gate

## Tags

#type/decision-tree #layer/frontend #cluster/component-selection #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
