*** PRD Understanding - Templates - OVERVIEW ***

# 05-templates - Overview

> Source PRD: `Brain SK\skills\imported-business\prd-knowledge\modules\05-templates\latest-prd.md` (`Copy of Template Module`, Drive sync 2026-04-24; **unknown version** - user explicitly selected this file).
> Coverage: Only the head ~250 lines of the 982-line PRD were captured in the sync. Voice template flow + the remainder of WhatsApp rules are deferred.

## Purpose

A **Template** is a predefined message structure used by Applications or Users to send messages via CommChannels (WhatsApp, Voice, AI, ...). Templates may include static content + dynamic variables. Each template belongs to ONE CommChannel and may need approval. The PRD introduces:
- **Maker / Checker** governance (Maker creates+submits, Checker reviews+approves/rejects).
- A general template status lifecycle (`Pending` / `Approved` / `Rejected`) with CommChannel-specific mappings, notably Meta states for WhatsApp.
- A step-based creation wizard per CommChannel (WhatsApp = 2+ steps Basic Info / Message Structure; Voice = TBD).
- Cross-link to Contact Group Management — columns become template variables.

## Actors

| Actor | User Type | Capability | Source |
|---|---|---|---|
| System Administrator | Falcon | **Cannot create templates** (per PRD); may view + approve in some cases (full role matrix deferred). | latest-prd.md (per understanding.md:11-13); BR-TM-01 |
| Operation | Falcon | Same: cannot create; view. | understanding.md:11 |
| Product | Falcon | Same: cannot create; view. | understanding.md:11 |
| Account Owner (AO) | Client | Can create templates (Maker role default) if permissioned. | understanding.md:12 |
| Node Admin | Client | Can create templates if permissioned. | understanding.md:12 |
| Normal User | Client | Can create templates if permissioned. | understanding.md:12 |
| Checker | (any) | Whoever holds Checker permission for the account/commchannel. Role assignment NOT fully spelled out in captured head. | understanding.md:14 |
| External authority | (system) | Meta (WhatsApp), Voice provider (Voice), none for AI. | understanding.md:15 |

## Main Screens

| # | Screen | Source |
|---|---|---|
| 1 | Templates menu - list of templates with status, commchannel, category, language, reference ID | understanding.md:17 |
| 2 | Create Template entry - options per commchannel (WhatsApp, Voice, AI, ...) | understanding.md:18 |
| 3 | Wizard - WhatsApp (Steps 1: Basic Info, 2: Message Structure with preview, submit) | latest-prd.md:65-86 |
| 4 | Wizard - Voice (TBD - not in captured head) | (open Q-TM-04) |
| 5 | Approval / Checker view - reviewing Pending templates | understanding.md:21 |

## Main Actions

| Action | Allowed By | Source |
|---|---|---|
| Create template (Maker) | Client roles with permission | latest-prd.md:67 |
| Edit draft (Maker, pre-submit) | Maker | understanding.md:25; (versioning details TBD) |
| Submit for approval | Maker | understanding.md:26 |
| Approve / Reject internally (Checker) | Checker | understanding.md:27 |
| External approval lifecycle (Meta for WhatsApp - automatic from API) | System | understanding.md:28 |
| Publish / Pause (implied) | (TBD) | understanding.md:29 |
| Link to Contact Group (sets variables source) | Maker | latest-prd.md:78; understanding.md:30 |
| Preview | Maker / viewer | latest-prd.md:80; understanding.md:31 |

## Module Dependencies

- **04-contact-group-management** — Contact group columns become template variables when linked (latest-prd.md:78; BR-TM-12).
- **CommChannel module** — Each template belongs to ONE commchannel; commchannel choice gates wizard branch (latest-prd.md:97-98).
- **Applications** — Applications consume templates when sending transactions (cross-cuts 03 Send Transaction).
- **Meta (WhatsApp Business API)** — External approval endpoint, quality tiers, pause/disable signals (latest-prd.md:44-56).
- **Account Management (01)** — Template configuration is currently **per commchannel per account**; future: inheritance on Main node with override (root-documents/latest-prd.md:29; understanding.md:88).
- **Permission module / PES** — Maker / Checker / view roles (understanding.md:89).
- **02-user-management** — Checker user is a User in the account roster.
