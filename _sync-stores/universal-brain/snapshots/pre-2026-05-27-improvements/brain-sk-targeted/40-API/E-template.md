---
type: entity
id: E-template
title: Template (WhatsApp / Voice / AI message template)
status: stub
created: 2026-05-18
source: Business deep-dive mining 2026-05-18 (GAP-BIZ-TM-01)
priority: highest
tags: [entity, template, whatsapp, voice, ai, meta-approval, stub]
---

# E-template — Template

> [!warning] **STUB — Authoring required + Backend missing**
> The Template entity is the central concept of Module 05 but had **NO backend DTO and no E-\* vault note** until this stub. Critical to flag at vault level so future sessions don't waste time looking.

## One-line shape

A Template is a **predefined message structure** sent via a CommChannel (WhatsApp / Voice / AI). It belongs to ONE CommChannel, has a status lifecycle (Pending / Approved / Rejected / Paused / Disabled), supports variables that resolve from Contact Group columns at send-time, and may require external approval (Meta for WhatsApp).

## Provisional fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `name` | string | Display; unique per WhatsApp Business Account + language (V-template-name-unique-per-account) |
| `referenceId` | string? | External reference |
| `commChannelId` | E-comm-channel-config FK | One template = one CommChannel (BR-TM-02) |
| `language` | string | ISO 639-1 |
| `category` | enum (channel-specific) | WhatsApp: Marketing/Utility/Authentication; Voice: TBD; AI: N/A |
| `header` | E-template-header? | Media OR Text mutex (BR-TM-11) |
| `body` | E-template-body | Required; non-empty (V-template-body-required) |
| `footer` | E-template-footer? | ≤60 chars, no variables (BR-TM-15) |
| `buttons[]` | E-template-button[] | Up to 10 (BR-TM-16) |
| `variables[]` | E-template-variable[] | Cap "20-30" per BR-TM-10 (Q-TM-NEW-03 — pick 30) |
| `status` | enum {Pending, Approved, Rejected, Paused, Disabled} | General status |
| `metaState` | E-meta-approval-state? | WhatsApp-specific; tracks Meta-side state + quality tier |
| `currentVersion` | int | For BR-TM-33 versioning (yet to be confirmed) |
| `bindingContactGroupId` | E-contact-group FK? | Optional; sets default variable source |
| `makerUserId` | userId | Creator |
| `checkerLevelTrail[]` | E-template-approval-trail[] | Approval audit |
| `createdAt`, `updatedAt`, `createdBy`, `updatedBy` | audit | Standard |

## State machine

```
            ┌──────────────┐
            │   Pending    │
            └──┬────┬────┬─┘
   Maker submits│    │    │
               ▼    │    │
            ┌──────┴┐   │ Checker rejects
            │Approved│◄──┤
            └──┬─────┘   │
  Meta pauses  │         │
               ▼         ▼
            ┌──────┐  ┌────────┐
            │Paused│  │Rejected│
            └──┬───┘  └────────┘
   Meta resumes│
               ▼
            ┌──────────┐
            │ Disabled │ (manual or Meta-driven)
            └──────────┘
```

Open: BR-TM-33 (edit post-approval → re-Pending vs new version); BR-TM-37 (Meta Paused vs Blocked-by-Meta distinct state); BR-TM-38 (deletion governance).

## Cross-module references

- **04-contact-group-management** — variables resolve from group columns (BR-TM-12 + BR-CGM-06)
- **03-contract-packaging-charging-billing** — Send Transaction uses templates (BR-CC-32)
- **02-user-management** — Maker is a User; Checker is a User (BR-TM-21/22; future PES key per BR-X-CHECKER-ROLE-01)
- **01-account-management** — Template configuration per commchannel per account (BR-TM-40 inheritance OPEN)
- **External Meta** — WhatsApp Business API webhook drives approval lifecycle

## Open questions (yes/no in REPORT.html)

- Q-TM-NEW-01 — Same user Maker+Checker allowed?
- Q-TM-NEW-02 — Edit post-approval = re-Pending or new version?
- Q-TM-NEW-03 — Variable cap exactly 30?
- Q-TM-NEW-04 — Quick Reply ≤25 chars?
- Q-TM-NEW-05 — Deletion requires Checker?
- Q-TM-NEW-06 — Falcon view scope?
- Q-TM-NEW-07 — Paused → Blocked-by-Meta distinct state?
- Q-TM-NEW-08 — Auto-re-submit on Meta rejection?
- Q-TM-NEW-09 — First-claim-wins vs all-approve?
- Q-TM-NEW-10 — Contact group deleted → template fate?
- Q-TM-NEW-11 — Column renamed → auto-update?
- Q-TM-NEW-12 — Approval locks bound group's columns?
- Q-TM-NEW-13 — Paused → fallback template?
- Q-TM-NEW-14 — Multi-language template groups?
- Q-TM-NEW-15 — Maker edits Pending before review?

## Backend reality

**[CODE]** As of mining date, the Template entity has **NO backend DTOs**. `[BRAIN-OUT] backend/templates/SERVICE_OVERVIEW.md` confirms only `CommunicationChannelConfig + CheckerLevel + CheckerUser` are wired in code. The Template surface itself has no API endpoint.

## Bound by BR rules

- BR-TM-01..16 (template structure)
- BR-TM-17..20 (statuses)
- BR-TM-21..23 (Maker/Checker)
- BR-TM-24..29 (WhatsApp + Meta state)
- BR-TM-30..41 (OPEN — voice + AI + versioning + deletion + view scope)
- BR-CC-32 (consumer — Send Transaction)
- BR-CGM-06 + BR-CGM-27 (variable binding consumer)

## See also

- `[[E-template-version]]` (stub) — for BR-TM-33 versioning
- `[[E-meta-approval-state]]` (stub) — for WhatsApp Meta lifecycle
- `[[E-template-variable-binding]]` (stub) — for column↔variable bind row
- `[[E-template-approval-trail]]` (stub) — for audit
- `[[E-contact-group]]` — variable source
- `[[E-comm-channel-config]]` — owner channel
- [BRAIN-OUT] `Brain Outputs/prd/modules/05-templates/BUSINESS_RULES.md` (41 BR-TM rules, 12 OPEN)
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/_pending-questions/` (no template-specific pending question yet)

## Authoring status

- 🔴 Awaiting backend wiring (DTOs, controllers, validators)
- 🔴 Awaiting PRD re-sync (D-TM-1 drift — only ~12% of 982-line Drive doc captured)
- 🟡 Provisional shape based on PRD captured head + WhatsApp Business API public schema
