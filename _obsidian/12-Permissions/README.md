*** 12-Permissions — folder context ***
*** Created 2026-05-15 by Brain SK Phase 2B permission-matrix install ***
*** SoT: Brain Outputs/prd/modules/02-user-management/ + 04-contact-group-management/ ***

# 12-Permissions

> This folder is the **graph layer for the permission matrices** that gate every action across the Falcon platform. The matrices themselves live as Google Sheets in PRD-02 and PRD-04 attachments; their captured content lives in `Brain Outputs/prd/modules/<module>/understanding.md` and `latest-prd.md`. These vault notes are the navigation/graph surface only — they cite the source and never duplicate it as the source of truth.

The permission system spans **two axes** that intersect at the **Access (PES) Service**:

| Axis | Authoritative sheet | Captured in | Vault note |
|---|---|---|---|
| Falcon role × per-action across Hierarchy + CommChannels + Apps + Settings | `Permission list - Jawad` (PRD-02) | PRD-02 prose only — Tab 1 captured, Tab 2 export-failed | [[Falcon Roles Permission Matrix]] |
| Contact Group role × CRUD/share/download | `Contact Group Permissions` (PRD-04) | PRD-04 `understanding.md` → full matrix verbatim | [[Contact Group Permission Matrix]] |
| User status × counted-against-user-limit (orthogonal but co-located in PRD-02) | `Users statuses & others` (PRD-02) | PRD-02 `latest-prd.md` → full table verbatim | [[User Statuses]] |

## Folder purpose

- **Graph hub** for everything permission-related: which PRD owns which matrix, which backend service enforces it, which pages it gates.
- **Gap surface** — both matrices have known capture gaps (Permission list Tab 2; Failed-status absence in CG) and this folder is where the gap pointers live for AI agents to discover.
- **PRD-decoupled view** — when an agent is asked "what gates Edit Account Limitations?" the answer lives here, not buried under one PRD note.

## Matrix notes

- [[Falcon Roles Permission Matrix]] — System Administrator × Operation × Products across Org Hierarchy + CommChannels & Services + Apps & Services + Settings
- [[Contact Group Permission Matrix]] — Falcon (view-only) + 3 Client roles (creator/not-creator) × {View, Create, Edit, Share, Delete, Download CG, Download Original}
- [[User Statuses]] — 5 statuses (Pending / Active / Suspended / Locked / Deleted) + counts-against-limit flag

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Access PES Service]]
