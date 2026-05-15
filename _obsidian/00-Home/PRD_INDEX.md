---
type: hub
hub: prd
created: 2026-05-15
---
*** PRD Index — graph hub ***
*** Created 2026-05-15 by Brain SK PRD-into-vault build ***

# PRD Index

> **PRDs are the upstream source** that feeds Business rules, Validation rules, Pages, Components, and Backend services. Brain Outputs holds the analysis; this hub holds the graph.

- **Canonical Drive folder:** `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`
- **Brain analysis (SoT):** [`Brain Outputs/prd/PRD_INDEX.md`](../../../Brain%20Outputs/prd/PRD_INDEX.md)
- **Roll-up gaps:** [`Brain Outputs/prd/PRD_GAP_SUMMARY.md`](../../../Brain%20Outputs/prd/PRD_GAP_SUMMARY.md)
- **Skill:** [`brain-skills/business-skills/prd-knowledge/Skill.md`](../../../brain-skills/business-skills/prd-knowledge/Skill.md)
- **Trigger phrase to refresh:** `take latest from PRD` / `update PRD knowledge`
- **Last sync:** 2026-04-24 (stale check: 14-day threshold defined in `prd/README.md`)

## Modules tracked

| # | Module | Vault note | Implementing services | Implementing pages | Coverage | Health |
|---|---|---|---|---|---|---|
| 1 | Account Management | [[01 Account Management]] | commerce (Account/Wallet), charging | [[Organization Hierarchy]] (Hierarchy + CommChannels + Apps + Settings + Account Limitations tabs), Wallets & Balance Mgmt | 18 ✅ · 3 ⚠️ · 3 ❌ · 9 ❓ | Mostly built |
| 2 | User Management | [[02 User Management]] | identity, commerce (user lifecycle) | Add User wizard, Login flows, Edit User, Change/Forgot Password, OTP | 20 ✅ · 6 ⚠️ · 2 ❌ · 9 ❓ | Well-built |
| 3 | Contract / Packaging / Charging / Billing | [[03 Contract Packaging Charging Billing]] | commerce (Contract), charging, provisioning | Contracts & Cost Mng list, Add Contract 4-step wizard | 13 ✅ · 7 ⚠️ · 6 ❌ · 14 ❓ | Core built; periphery missing |
| 4 | Contact Group Management | [[04 Contact Group Management]] | contact-group | Contact Groups list, Create Contact Group wizard, Share / Edit / Download | 14 ✅ · 2 ⚠️ · 5 ❌ · 8 ❓ | Backend ready; frontend pending (Story 115329) |
| 5 | Templates | [[05 Templates]] | templates (architectural decision pending) | Templates list, Create Template (WhatsApp 2-step, Voice TBD), Approval flow | 3 ✅ · 2 ⚠️ · 21 ❌ · 1 ❓ | Architectural surprise — no public API yet |
| — | Root cross-module backlog | [[Root Documents]] | — | — | 1 ✅ · 1 ⚠️ · 8 ❌ · 1 ❓ | Meta backlog |

## Aggregate coverage

- **185 PRD↔code gap rows** across all modules
- **69 COVERED** · **21 PARTIAL** · **45 MISSING** · **42 UNVERIFIABLE**
- **Effective measurable rows:** 185 − 42 = 143
- **Coverage overall:** 69 / 143 = **48.3 %**
- **Coverage + partial:** 90 / 143 = **63.0 %**

## How PRDs connect to everything else

| PRD module → links to | Why |
|---|---|
| [[BUSINESS_INDEX]] | Every PRD module has `BUSINESS_RULES.md` — those rules promote into per-page `BUSINESS_RULES.md` in `understanding/pages/` |
| [[VALIDATION_INDEX]] | Validation rules sit inside PRD `WORKFLOWS.md` + `BUSINESS_RULES.md` — they promote into per-page `VALIDATION_RULES.md` |
| [[API_INDEX]] | PRD entities + workflows determine API contracts in `understanding/backend/<service>/ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md` |
| [[FRONTEND_INDEX]] | PRD `OVERVIEW.md → Main Screens` lists which pages render the module. Page notes in `10-Pages/` cite their implementing PRDs back. |
| [[COMPONENT_INDEX]] | PRD screens drive Falcon component choice. Component notes carry "PRDs that use this component" back-links. |
| [[GAPS_INDEX]] | Each PRD module has `GAPS.md` enumerating PRD↔code gaps. The roll-up sits at `PRD_GAP_SUMMARY.md`. |
| [[EVIDENCE_INDEX]] | PRD attachments (Sheets, Drive Drawings, supporting docs) are the original evidence behind every rule. |

## Trigger phrases for PRD operations

| Phrase | Action |
|---|---|
| "take latest from PRD" | Run the `prd-knowledge` skill → re-sync all 6 modules from Drive → re-extract rules/entities/workflows/gaps/questions |
| "what PRDs cover Organization Hierarchy?" | List PRDs implementing that page (from [[01 Account Management]] in this case) |
| "show validation gaps in PRD 03" | Open `Brain Outputs/prd/modules/03-.../GAPS.md` filtered by category |
| "what PRDs use Falcon Data Table?" | Filter PRD module screens → those rendering tables → cite the component back-link section in [[Falcon Data Table]] |

## Related hubs

- [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[EVIDENCE_INDEX]] · [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[PAGE_LEARNING_INDEX]] · [[APPROVED_PATTERNS_INDEX]]

## Stale-check rule

- 14-day re-sync threshold from PRD-knowledge skill.
- Last sync: 2026-04-24. **Current age: 21 days** as of 2026-05-15 — **STALE**. Recommend running `take latest from PRD` before promoting any new PRD-derived rule.

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #prd/root #gap
