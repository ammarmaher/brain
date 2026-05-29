---
type: hub
hub: component
created: 2026-05-15
---
*** Falcon Component Index — graph hub ***
*** Updated 2026-05-15 ***

# Component Index

> Each component note lives under `60-Components/`. Notes hold back-links (pages using it, gaps, approved patterns, Brain Outputs dossier, Falcon Eyes reports). Notes do NOT duplicate dossier content — link only.
>
> **Theming context — Angular-first (2026-05-20):** Every component consumes the [[Falcon Tailwind Theme]] (SSOT) and must satisfy the [[Falcon Component Theme Contract]] (9 sections). **🟢 Current scope:** [[Falcon Angular Wrapper Pattern]] · [[Falcon Stencil-to-Angular Bridge]]. **🟡 Future placeholders (not current):** [[Falcon React Wrapper Future Pattern]] · [[Falcon Vue Wrapper Future Pattern]]. Gap analysis: [[Tailwind Falcon Alignment Scorecard]]. Cluster: [[36-Theming/README|36-Theming]].
>
> **Light Mode Visual Baseline (new 2026-05-20):** [[Falcon Light Mode Visual Baseline]] ★ · [[Falcon Current Color Usage Map]] · [[Falcon Current Spacing Radius Shadow Map]] · [[Falcon Current Hover Focus State Map]] · [[Falcon Organization Hierarchy Visual Standard]] ★ · [[Falcon Page Visual Consistency Rules]] · [[Falcon Do Not Change Visual Rules]] — locked baseline + guardrails for any visual change.
>
> **Component Recognition & Page Assembly (new 2026-05-20):** [[Falcon Component Recognition Playbook]] ★ · [[Falcon Page Assembly Playbook]] ★ · [[Falcon Component Selection Decision Tree]] · [[Falcon Component Capability Matrix]] · [[Falcon Screenshot To Component Mapping Guide]] · [[Falcon Component Gap Registry]] · [[Falcon New Page Implementation Checklist]] — recognize patterns → pick the right component → assemble pages → log capability gaps → ship via checklist.
>
> **Component Combination Intelligence (new 2026-05-20):** [[Falcon Component Composition Playbook]] ★ · [[Falcon Page Region Patterns]] · [[Falcon Component Combination Matrix]] · [[Falcon Data Table Composition Rules]] · [[Falcon Form Composition Rules]] · [[Falcon Popup and Drawer Composition Rules]] · [[Falcon Tree and Details Composition Rules]] — how components wire together · 9 composition families · 12 page regions · deep rules per area.
>
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). Component dossiers live at [`understanding/frontend/components/`](../../../Brain%20Outputs/understanding/frontend/components/) (62 components, 6 files each).
>
> Full dossier registry: [`outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md`](../../outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md) · per-component folders at [`outputs/understanding/frontend/components/`](../../outputs/understanding/frontend/components/).
>
> Legacy full catalog: [[FALCON_COMPONENT_INDEX]] (60-component dossier links).

## Tracked component notes — Tier-1 (heavy use on seeded pages)

| Component | Note | Pages using |
|---|---|---|
| Falcon Data Table | [[Falcon Data Table]] | [[Organization Hierarchy]] (multi-section, PP-001 pending) |
| Falcon Tabs | [[Falcon Tabs]] | [[Organization Hierarchy]] |
| Falcon Input | [[Falcon Input]] | [[Organization Hierarchy]] |
| Falcon Dropdown | [[Falcon Dropdown]] | [[Organization Hierarchy]] |
| Falcon Button | [[Falcon Button]] | [[Organization Hierarchy]] |
| Falcon Dialog / Popup | [[Falcon Dialog]] | [[Organization Hierarchy]] (otp-popup) |
| Falcon Toggle / Switch | [[Falcon Toggle]] | [[Organization Hierarchy]] (data-table cells) |
| Falcon Checkbox | [[Falcon Checkbox]] | [[Organization Hierarchy]] |
| Falcon Uploader | [[Falcon Uploader]] (photo-uploader) | [[Organization Hierarchy]] |
| Falcon Status Badge | [[Falcon Status Badge]] | [[Organization Hierarchy]] |

## Full component vault (Phase 2F — 62 notes, grouped by purpose)

### Form inputs (15)

[[Falcon Input]] · [[Falcon Input Number]] · [[Falcon Textarea]] · [[Falcon Password]] · [[Falcon Email Field]] · [[Falcon Phone Field]] · [[Falcon Mobile Number]] _(legacy)_ · [[Falcon Search Input]] · [[Falcon Date Picker]] · [[Falcon Calendar]] · [[Falcon Calendar Legacy]] _(deprecated)_ · [[Falcon OTP]] · [[Falcon Form Field]] _(legacy)_ · [[Falcon Grid Input]] · [[Falcon Multi Select]]

### Selection / pickers (8)

[[Falcon Dropdown]] · [[Falcon Select]] _(alias of Dropdown)_ · [[Falcon Combobox]] · [[Falcon Checkbox]] · [[Falcon Checkbox Group]] · [[Falcon Radio]] · [[Falcon Radio Group]] · [[Falcon Multiselect Legacy]] _(deprecated)_

### Action / control (5)

[[Falcon Button]] · [[Falcon Toggle]] _(switch)_ · [[Falcon Menu]] · [[Falcon Tag]] · [[Falcon Icon]]

### Status / feedback (8)

[[Falcon Status Badge]] · [[Falcon Badge]] _(count)_ · [[Falcon Avatar]] · [[Falcon Notification]] · [[Falcon Toast]] _(deprecated, prefer Notification)_ · [[Falcon Tooltip]] · [[Falcon Empty State]] · [[Falcon Message Host]]

### Dialogs / popups (6)

[[Falcon Dialog]] · [[Falcon Alert Dialog]] · [[Falcon Confirm Dialog]] · [[Falcon Popup]] · [[Falcon OTP Send Dialog]] · [[Falcon Insufficient Balance Dialog]] · [[Send Credentials Popup]]

### Containers / layout (4)

[[Falcon Tabs]] · [[Falcon Card]] · [[Falcon Drawer]] · [[Falcon Accordion]]

### Tables / lists (5)

[[Falcon Data Table]] · [[Falcon Table]] _(legacy / generic, prefer Data Table)_ · [[Falcon Tree Table]] · [[Falcon Filter Panel]] · [[Falcon Paginator]]

### Trees / hierarchy (4)

[[Falcon Tree]] · [[Falcon Tree Panel]] _(legacy bespoke)_ · [[Falcon Organization Hierarchy Tree TW]] _(bespoke)_ · [[Falcon Tree Table]]

### Wizards / steppers (3)

[[Falcon Wizard]] _(target)_ · [[Falcon Stepper]] · [[Falcon Stepper Legacy]] _(current consumer)_

### Uploaders (3)

[[Falcon Uploader]] _(photo-uploader)_ · [[Falcon Uploader (generic)]] · [[Falcon Single Uploader]]

### Directives / utilities (1)

[[Shared Directives]] _(12 form / mask / validator / async directives)_

## Deprecated / legacy — flagged for removal or migration

[[Falcon Calendar Legacy]] · [[Falcon Mobile Number]] _(legacy facade → Phone Field)_ · [[Falcon Multiselect Legacy]] · [[Falcon Toast]] _(prefer Notification)_ · [[Falcon Form Field]] _(LEGACY bespoke wrapper)_ · [[Falcon Table]] _(prefer Data Table)_ · [[Falcon Tree Panel]] _(legacy bespoke)_ · [[Falcon Stepper Legacy]] _(migration to Falcon Stepper pending)_ · [[Send Credentials Popup]] _(legacy bespoke)_

## Related hubs

- [[FRONTEND_INDEX]] · [[PAGE_LEARNING_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[FALCON_EYES_INDEX]] · [[GAPS_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]]

## Tags

#type/index #status/deprecated #security
