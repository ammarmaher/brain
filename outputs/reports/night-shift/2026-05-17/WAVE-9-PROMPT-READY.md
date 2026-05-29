---
type: wave-9-launch-prompt
title: "Wave 9 — Obsidian Vault Re-Graph (ready to fire when Wave 4 returns)"
status: READY — fire immediately when Wave 4 completion notification arrives
---

# Wave 9 — Obsidian Vault Re-Graph

## Context for the agent

This is the final wave of the Falcon Brain Forever-Wave night-shift run (2026-05-17→18). You are launching AFTER all other waves have completed. Your job is to stitch everything together into a coherent Obsidian knowledge graph.

## What was created tonight (must be indexed)

**New vault notes already written:**
- `Brain SK/_obsidian/70-Gaps/SECURITY-FINDINGS-2026-05-18.md` — 7 security findings cluster
- `Brain Outputs/understanding/integration/ARCH-FINDING-CommChannel-FSM-ownership.md` — FSM ownership finding

**New component vault notes (from Wave 7):**
- `falcon-wiki/30-Components/` — 63 notes refreshed/created by Wave 7. Check for broken transclusions.
- 4 orphans flagged: `falcon-calendar-legacy`, `falcon-multiselect-legacy`, `falcon-stepper-legacy`, `send-credentials-popup`
- 10 missing components: `falcon-loader-overlay`, `falcon-loader-inline`, `falcon-empty-data`, `falcon-toast-host`, `falcon-completion-success-dialog`, `falcon-confirm-dialog-host`, `falcon-error-dialog-host`, `falcon-http-error-dialog-host`, `falcon-custom-table-footer`, `falcon-sending-credentials-dialog`

**New page vault nodes (from Wave 4 — verify these exist):**
Wave 4 (Adnan) was instructed to create vault nodes at `Brain SK/_obsidian/10-Pages/<Page Name> Flow.md` for all 13 pages:
edit-user · contracts-list · add-contract · edit-contract · wallets-and-balance-management · templates-list · create-template-whatsapp · contact-groups-list · create-contact-group · login · forgot-password · change-password · my-profile

**New controller dossiers (from Waves 5a/5b/5c/5d):**
- Commerce: 9 controllers × 6 files = 48 files at `understanding/backend/commerce/controllers/`
- Identity: 4 controllers × 6 files = 24 files at `understanding/backend/identity/controllers/`
- Charging: 3 controllers × 6 files = 18 files at `understanding/backend/charging/controllers/`
- Provisioning: 1 controller × 6 files = 6 files at `understanding/backend/provisioning/controllers/`

**PRD module updates (from Wave 2):**
All 5 modules' `GAPS.md` and `QUESTIONS.md` were updated.

## Your mission

### 1. Verify IMPLEMENTATION_KNOWLEDGE_MAP.md rows
File: `C:\Falcon\Brain SK\_obsidian\00-Home\IMPLEMENTATION_KNOWLEDGE_MAP.md`

Check that Wave 4 (Adnan) added rows for all 13 new pages in the "Flow playbooks" table.
If any are missing, add them with the pattern:
```
| <flow name> | [[<Flow Name> Flow]] | `Brain Outputs/understanding/pages/<page-name>/` | [[<Page>]] | [[<PRD>]] |
```

### 2. Verify and complete vault page nodes
For each of the 13 pages in `Brain SK/_obsidian/10-Pages/`:
- If the vault node was created by Wave 4, verify it follows the standard shape (backlinks to page, PRD, backend service, components used, gaps, evidence)
- If missing, create it from the page folder's `README.md`

### 3. Update MOCs
Update these 3 MOC files if new entries are needed:
- `Brain SK/_obsidian/00-Home/AMMAR_BRAIN_HOME.md` — add security findings + FSM finding
- `Brain SK/_obsidian/70-Gaps/README.md` (or index) — link `SECURITY-FINDINGS-2026-05-18.md`
- `falcon-wiki/00-MOCs/AI-Agent-Onboarding.md` — add night-shift report to onboarding resources

### 4. Backend controller service notes
For each new controller, ensure its parent service note in `falcon-wiki/50-Services/` backlinks to the new controller dossiers:
- `falcon-wiki/50-Services/falcon-core-commerce-svc.md` → add controller list
- `falcon-wiki/50-Services/falcon-core-identity-svc.md` → add controller list
- `falcon-wiki/50-Services/falcon-core-charging-svc.md` → add controller list
- `falcon-wiki/50-Services/falcon-core-provisioning-svc.md` → add controller list

### 5. Run brain-audit.ps1
```powershell
& "C:\Falcon\falcon-wiki\scripts\brain-audit.ps1"
```
If this script doesn't exist, skip and note.
Fix any broken wikilinks found. Report exit code.

### 6. Security findings backlinks
The `Brain SK/_obsidian/70-Gaps/SECURITY-FINDINGS-2026-05-18.md` needs backlinks from:
- `Brain SK/_obsidian/10-Pages/` page nodes that are affected (auth flow pages)
- `Brain SK/_obsidian/60-Components/` if any components enforce the broken security rules

### Deliverable

Write `C:\Falcon\Brain Outputs\reports\night-shift\2026-05-17\WAVE-9-VAULT-RERAPH.md` with:
```
Wave 9 Vault Re-Graph — Complete
==================================
IMPLEMENTATION_KNOWLEDGE_MAP.md rows added: <N>
Page vault nodes verified/created: <N>/13
MOCs updated: <list>
Service notes updated: <N>
brain-audit.ps1 exit code: <0|1|2|error>
Broken wikilinks found+fixed: <N>
New backlinks created: <N>

Files written:
- <path1>
...
```

Report back in ~300 words.
