*** PRD-05 — Templates ***
*** SoT: Brain Outputs/prd/modules/05-templates/ ***
*** Drive source: `Copy of Template Module` (unknown version; sync 2026-04-24, head-only ~250/982 lines) ***

# PRD-05 — Templates

> A Template is a predefined message structure used by Applications or Users to send via CommChannels (WhatsApp · Voice · AI · ...). Templates may include static content + dynamic variables. Each template belongs to ONE CommChannel and may require approval. Introduces Maker/Checker governance, a general status lifecycle (Pending / Approved / Rejected) with CommChannel-specific mappings (notably Meta states for WhatsApp), and step-based creation wizards per CommChannel.
>
> **Architectural surprise:** Template entity has no public API yet (GAP-TM-01 cascade). Service not routed by gateways (GAP-TM-02). **Architectural decision pending** on whether Template lives inside `falcon-templates-svc` or a new dedicated service.

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/05-templates/OVERVIEW.md) | Purpose · actors · scope warning · governance |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md) | Maker/Checker · auto-approval · quality drift |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/05-templates/ENTITIES.md) | Template, TemplateHeader, TemplateBody, TemplateFooter, TemplateButton, TemplateVariable, TemplateVersion, TemplateApprovalTrail, CommChannelConfig, CheckerLevel, CheckerUser |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/05-templates/WORKFLOWS.md) | Create WhatsApp Template (Maker) · Internal Approval (Checker) · Meta External Approval · Auto-Approval · Edit/Versioning (TBD) · Quality Drift · Link to Contact Group · Preview |
| [GAPS](../../../Brain%20Outputs/prd/modules/05-templates/GAPS.md) | 3 COVERED · 2 PARTIAL · 21 MISSING · 1 UNVERIFIABLE |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/05-templates/QUESTIONS.md) | GAP-TM-01 no API; GAP-TM-02 no gateway route; full role matrix deferred |

## Pages that implement this PRD

- Templates list (Maker view + Checker view)
- Create Template wizard (WhatsApp: 2+ steps Basic Info / Message Structure; Voice: TBD)
- Approval / Reject dialog (Checker)
- Preview pane
- _Pages not yet seeded under `10-Pages/`_

## Falcon components used by this PRD

- [[Falcon Data Table]] (Templates list, Approval trail)
- [[Falcon Tabs]] (wizard steps) · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]]
- [[Falcon Status Badge]] (Pending / Approved / Rejected + Meta state mapping)
- [[Falcon Dialog]] (Approval · Reject · Preview)

## Backend services implementing this PRD

| Concern | Service | Folder |
|---|---|---|
| Template · TemplateVersion · TemplateApprovalTrail · CheckerLevel | **templates** _(architectural decision pending — may move)_ | [`understanding/backend/templates/`](../../../Brain%20Outputs/understanding/backend/templates/) |
| CommChannelConfig | commerce | [`understanding/backend/commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) |
| Meta WhatsApp integration | templates (TBD) — currently MISSING | — |
| Gateway route `/api/communication-channel-configs/*` | **MISSING** (GAP-TM-02) — should be added before any UI ships | — |

**Vault service notes:** [[Templates Service]] · [[Commerce Service]] · [[BACKEND_INDEX]] _(GAP-TM-01 + GAP-TM-02 documented in [[Templates Service]])_

## Validation surface

Per-CommChannel field schema · variable-token format · quality-drift detection thresholds · approval-trail integrity. From [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md). Hub: [[VALIDATION_INDEX]].

## Module dependencies

- **[[04 Contact Group Management]]** — Contact Group columns become template variables
- **[[02 User Management]]** — Maker / Checker role assignments + permission gating
- **[[01 Account Management]]** — CommChannel visibility/pricing per account

## Health

- **Status:** Architectural surprise
- **Top concerns:** Template has no public API (GAP-TM-01 cascade); service not gateway-routed (GAP-TM-02); Meta integration MISSING; full role matrix deferred; ~73% of GAPS still MISSING
- **Coverage:** 3 ✅ · 2 ⚠️ · 21 ❌ · 1 ❓ — **lowest coverage of all modules**

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]]
