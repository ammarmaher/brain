*** Page note — Organization Hierarchy ***
*** Vault file: 10-Pages/Organization Hierarchy.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\ ***
*** Updated 2026-05-15 by obsidian-knowledge-graph install ***

# Organization Hierarchy

> Navigation note. **Brain Outputs is the source of truth — every link below points into the SoT tree.** This note does not duplicate rule content.

## Entry point in Brain Outputs

- [PAGE_LEARNING.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_LEARNING.md) — entry point + mode + scoring
- [PAGE_OVERVIEW.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md)
- [SOURCE_OF_TRUTH.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/SOURCE_OF_TRUTH.md)

## Implements PRDs

- [[01 Account Management]] — **primary**. Hierarchy, CommChannels & Services, Apps & Services, Settings, Account Limitations, IP Management. Wave 20 shadow-rows feature is the Account-Mgmt scheduled-change edit row.
- [[02 User Management]] — Add User flow + OTP popup section (`otp-popup` is shared)
- [[03 Contract Packaging Charging Billing]] — pricing rows in CommChannels & Services come from Contract Rate-Card; Account-Limitation edits enforce contract caps
- [[PRD_INDEX]] — full PRD navigation hub

## Flow playbooks (implementation specs — load these FIRST for any code work)

These are the **source-of-truth specs** for implementing each user action. Each playbook cross-references PRD + backend DTOs + V-rules + Falcon components + permission gates + error states for that one flow. Hub: [[IMPLEMENTATION_KNOWLEDGE_MAP]].

| Flow | Vault note | Trigger phrase |
|---|---|---|
| Add Client (5-step wizard) | [[Add Client Flow]] | `implement Add Client wizard` |
| Add User (3-tab wizard) | [[Add User Flow]] | `implement Add User` |
| Add Node (sub-node) | [[Add Node Flow]] | `implement Add Node` |
| Edit Node (rename · scheduled rename · move ❌ · archive ❌) | [[Edit Node Flow]] | `implement Edit Node` |

## Rules (linked, not duplicated)

| Domain | File |
|---|---|
| UI/UX | [UI_UX_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) — 32 rules |
| Validation | [VALIDATION_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VALIDATION_RULES.md) — 9 rules |
| API | [API_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/API_RULES.md) — 0 (seed) |
| Business | [BUSINESS_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md) — 14 rules |

## Falcon components used on this page

- [[Falcon Data Table]] — primary table component (PP-001 candidate)
- [[Falcon Tabs]] — top-level tab container
- [[Falcon Input]] — form inputs across tabs
- [[Falcon Dropdown]] — selectors in tables + forms
- [[Falcon Button]] — primary / secondary / icon actions
- [[Falcon Dialog]] — OTP popup + confirmations
- [[Falcon Toggle]] — table-row enable/disable cells
- [[Falcon Checkbox]] — multi-select cells + form checks
- [[Falcon Uploader]] — photo uploader on org-info
- [[Falcon Status Badge]] — rule status + audit mode badges

## Triangulated validation rules touching this page

(PRD line → Backend `[ThrowIf*]` → Frontend hint — from Phase 2C)

- [[V-account-name-format-uniqueness]] · [[V-password-security-level-enum]] · [[V-account-ip-allowlist-enforcement]] · [[V-account-limits-zero-means-no-limit]] · [[V-service-visibility-pricing-required]] — Settings tab + Add Client wizard + CommChannels/Apps tabs
- [[V-user-first-last-name-letters-only]] · [[V-username-format-uniqueness-immutable]] — Step 5 of Add Client (AO user creation) + Add User flow
- [[V-normal-user-limit-enforcement]] — gated by Settings → Account Limitations
- Full list: [[VALIDATION_INDEX]]

## Learning events

- [[LE-20260515-commchannels-shadow-row-notch-alignment]] — **approved** Wave 20. Bug → 5 UI/UX rules promoted (UIUX-SHADOW-001..005) + GAP-COMMCHANNELS-NOTCH-001 closed + 8 follow-ups opened in falcon-data-table dossier
- `LE-20260515-organization-hierarchy-001` — **pending** approval. Falcon Data Table mandate (`ng-template` cells); promotion candidate for global `TABLE_PATTERN.md`

## Gaps + Evidence + Patterns

- [GAP_REGISTRY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md) — 14 gaps baseline · `GAP-COMMCHANNELS-NOTCH-001` closed Wave 20
- [EVIDENCE_INDEX.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/EVIDENCE_INDEX.md) — **1 entry** (`EV-20260515-commchannels-notch-missing`)
- [APPROVED_PAGE_PATTERNS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/APPROVED_PAGE_PATTERNS.md) — 0 promoted rows _(SoT sync gap: 5 shadow-row rules landed directly in `UI_UX_RULES.md`; APPROVED_PAGE_PATTERNS still empty — next Deep Learning run will reconcile)_
- [UI_UX_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) — 32 baseline + **5 new** Wave 20 shadow-row rules (UIUX-SHADOW-001..005)
- [PENDING_PAGE_PATTERNS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PENDING_PAGE_PATTERNS.md) — **PP-001** Falcon Data Table mandate (pending Ammar approval)
- [PROMOTION_CANDIDATES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PROMOTION_CANDIDATES.md) — PP-001 candidate for global [TABLE_PATTERN.md](../../outputs/understanding/frontend/patterns/TABLE_PATTERN.md)
- [`light-learning/`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/light-learning/) — detailed per-event files

## Component usage decisions

- [COMPONENT_USAGE_DECISIONS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_USAGE_DECISIONS.md)
- [COMPONENT_MAPPING.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_MAPPING.md)
- [SOURCE_DESTINATION_COMPARISON.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/SOURCE_DESTINATION_COMPARISON.md)

## Scorecards

- [PAGE_SCORECARD.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_SCORECARD.md) — page-level dimensions
- [IMPLEMENTATION_SCORECARD.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/IMPLEMENTATION_SCORECARD.md)
- [VISUAL_PARITY_SCORECARD.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VISUAL_PARITY_SCORECARD.md)

## Latest reports

- [Round 5 postmortem (2026-05-15)](../../outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ROUND_5_POSTMORTEM.md)
- [Round 4 report](../../outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ROUND_4_REPORT.md)
- [Orchestrator learnings](../../outputs/reports/organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15/ORCHESTRATOR_LEARNINGS.md)
- [Org hierarchy data table report (2026-05-14)](../../outputs/reports/falcon-ui-library-learnings/2026-05-14-org-hierarchy-data-table/index.md)
- [EDIT_ROW_SPEC.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/EDIT_ROW_SPEC.md)
- [NEXT_ACTIONS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/NEXT_ACTIONS.md)
- [CHANGE_HISTORY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/CHANGE_HISTORY.md)
- [LEARNING_CHANGE_HISTORY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/LEARNING_CHANGE_HISTORY.md)

## Tests

_Not yet wired into this page note. When the [test-case-authoring](../../../brain-skills/business-skills/test-case-authoring/Skill.md) skill emits Gherkin for this page, link the output here._

## Sections (Falcon Eyes default scope)

`tabs-header`, `comm-channels-tab`, `apps-services-tab`, `org-info-panel`, `org-info-audit-mode`, `org-info-rule-status`, `org-info-permission-privilege`, `settings-tab-view-mode`, `settings-tab-edit-mode`, `settings-ip-management`, `settings-account-limitation`, `otp-popup` — see [[PAGE_KNOWLEDGE_INDEX]] and [[FALCON_EYES_INDEX]].

## Default Falcon Eyes URLs

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[COMPONENT_INDEX]] · [[UI_UX_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[EVIDENCE_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[FALCON_EYES_INDEX]]
