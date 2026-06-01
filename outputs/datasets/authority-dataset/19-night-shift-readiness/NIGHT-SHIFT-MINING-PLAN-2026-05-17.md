---
type: night-shift-mining-plan
title: "Falcon Forever-Wave Mining Plan — Operation Night Brain"
created: 2026-05-17
status: pending-approval
owner: Adnan Orchestrator
purpose: "Answers 'how does Adnan + senior agents run infinite linked waves of knowledge mining overnight, write to the vault, halt-and-flag when ambiguous, and produce a morning report'. Open at every night-shift kickoff."
audience: Adnan, all Ammar agents, ChatGPT-strategy, Gemini-visual, gsd-domain-researcher, gsd-codebase-mapper
related:
  - "[[../0-MASTER-INDEX]]"
  - "[[../VERIFICATION-STATUS]]"
  - "[[SPEC-PROTOCOL]]"
  - "[[DECISION-PROTOCOL]]"
  - "[[NIGHT-SHIFT-LOOP]]"
  - "[[../../Brain SK/_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP]]"
---

# Falcon Forever-Wave Mining Plan — Operation Night Brain

> [!tldr]
> Continuous, multi-wave, orchestrator-led mining of the Falcon Brain. Adnan routes specialist Ammar agents + senior business/data/AI advisors against the 7 knowledge stores in 10 wave-types that run forever (each wave restarts itself when delta detected). Source-prefixed, vault-written, halt-and-flag at ambiguity ≥7, morning report on every kickoff.

## 0. Why this exists

User goal: be able to discuss ANY Falcon business situation with the business team and managers — not just the headline rules, but every BR-* / V-rule / entity drift / edge case / open question / version delta. Today the brain is ~80% structurally complete but has version-staleness risk (Drive last synced 2026-04-24 — 23 days old), PRD-05 Templates is only 25% mined (250/982 lines), Q-UM-07 PRD Sheet Tab 2 is uncaptured, 13 pages have only skeletal `PAGE_LEARNING.md`, and 5 of the 6 Q-* questions remain open.

The Forever-Wave fills these without human supervision overnight and surfaces what it cannot resolve.

## 1. Vault reconnaissance — current state (snapshot 2026-05-17)

### 1.1 PRD modules — version-lock table

| # | Module | PRD title in sync | Version | Source path | Drive sync | Status | Gap |
|---|---|---|---|---|---|---|---|
| 01 | account-management | `Account Management Module VB4` + `Acc - Wallet & Balance Mng VB4` | **VB4** | `prd/modules/01-account-management/` | 2026-04-24 | 🟢 mined | Tab 2 of PRD Sheet still uncaptured (Q-UM-07) |
| 02 | user-management | `User Management Module - V2` | **V2** | `prd/modules/02-user-management/` | 2026-04-24 | 🟢 mined | 5 open Q-UM-* questions; Q-UM-12 vocab mismatch |
| 03 | contract-packaging-charging-billing | `Contract & Cost Management V2` | **V2** | `prd/modules/03-contract-packaging-charging-billing-management/` | 2026-04-24 | 🟡 partial | Packaging + Billing absent from PRD body — scope gap |
| 04 | contact-group-management | `Contact Group Management Module_V2` | **V2** | `prd/modules/04-contact-group-management/` | 2026-04-24 | 🟢 mined | — |
| 05 | templates | `Copy of Template Module` | **unknown** | `prd/modules/05-templates/` | 2026-04-24 | 🔴 25% mined | Only first 250/982 lines captured. Voice flow + bulk of WhatsApp rules MISSING |
| — | root-documents | `Points to be covered later` + `Copilot 4DevOps` | n/a | `prd/modules/root-documents/` | 2026-04-24 | 🟢 indexed | — |

**User explicit rule:** if Drive now hosts `Contract & Cost Management V3` (or any higher V), Wave 1 MUST re-sync and overwrite the V2 sync.

### 1.2 Pages — mining depth

| Page | Decomposition | Files | Status |
|---|---|---|---|
| organization-hierarchy | Full (Add Client folder 22-file pattern) | 27 + Add Client subfolder | 🟢 gold standard |
| organization-hierarchy / flows | Add User, Add Node, Edit Node single-file playbooks | 3 | 🟡 single-file (decompose to folders) |
| login | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| forgot-password | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| change-password | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| edit-user | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| my-profile | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| contact-groups-list | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| create-contact-group | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| contracts-list | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| add-contract | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| edit-contract | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| templates-list | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| create-template-whatsapp | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |
| wallets-and-balance-management | `PAGE_LEARNING.md` only | 1 | 🔴 skeletal |

### 1.3 Backend services — controller-level coverage

| Service | Service-level dossier | Controllers deep-mined | Missing |
|---|---|---|---|
| identity | ✅ 6 files | none yet (controllers all in service-level) | per-controller deep-dive |
| commerce | ✅ 6 files | `NodeController` only | `AccountController`, `SettingController`, `ApplicationController`, `CommChannelController`, etc. |
| charging | ✅ 6 files | `WalletController` only | `LedgerController`, etc. |
| provisioning | ✅ 6 files | `ServicesController` only | per-controller fan-out |
| access | ✅ 6 files | none | the PES authorize/resources controllers |
| contact-group | ✅ 6 files | none | per-controller |
| templates | ✅ 6 files | none | per-controller |
| core-gateway | ✅ 6 files | n/a | aggregator routes |
| system-gateway | ✅ 6 files | n/a | aggregator routes |

### 1.4 Frontend components — 62 dossiers exist (6 files each: OVERVIEW/API/USAGE/TOKENS/DECISION/GAPS_AND_UPGRADES) at `understanding/frontend/components/`. Refresh-needed via incremental-scan.

### 1.5 Authority dataset — 118 artifacts at `Brain Outputs/datasets/authority-dataset/`. PES backend gate runtime-verified 21/21 on 2026-05-16. Scanner watches 67 source files. Cluster 19 (night-shift-readiness) already houses SPEC-PROTOCOL + DECISION-PROTOCOL + NIGHT-SHIFT-LOOP + VISUAL-TARGETS + this plan.

### 1.6 Falcon Wiki (Obsidian SoT) — 6 typed PRD notes exist; full folder map per `00-MOCs/AI-Agent-Onboarding.md`.

### 1.7 Open Q-* questions (blocking judgment)

| Q-ID | Question | Module | Blocking what | Halt rule |
|---|---|---|---|---|
| Q-UM-07 | PRD Permission Sheet Tab 2 contents | 02 | Permission catalog drift audit | Wait for Drive re-export |
| Q-UM-12 | `ePasswordSecurityLevel` 2-tier vs 4-tier vocab | 02 | Add User wizard password step | Pick FE-renders-PRD-labels-submits-backend-codes per F-002 |
| Q-UM-13 | Admin-edit email/phone OTP path | 02 | Edit User flow | Halt — needs product decision |
| Q-AM-16 | PES catalog vs PRD sheet drift | 01/07 | Permission gate trust | Blocked on Q-UM-07 |
| Q-UM-10 | User move across hierarchy | 02 | Edit User scope | Halt — needs endpoint design |
| Q-UM-11 | Bulk user operations | 02 | Roadmap | Halt — needs scoping |
| Q-UM-16 | Falcon-only skip-validation for phone/status | root | Edit-user policy | Halt — needs product decision |

## 2. The wave architecture — 10 wave-types, infinite loop

Each wave is **idempotent** + **resumable** + **delta-aware**. The orchestrator runs them in order (Wave 1 → Wave 10), then restarts at Wave 1 if any Drive/git delta is detected. Halts produce a `_pending-questions/*.md` file per DECISION-PROTOCOL and the orchestrator continues with other waves.

### Wave 1 — PRD Version Lock-In  (runs every 6h)
**Owner:** `brain-prd` skill + `gsd-domain-researcher` (senior business analyst)
**Inputs:** Google Drive `Falcon PRDs/` folder + `prd/modules/<n>/latest-prd.md`
**Process:**
1. List every PRD file on Drive
2. For each module, find the highest version (V<n> beats V<n-1>, VB4 beats VB3, etc.)
3. Diff against the local `latest-prd.md`
4. If newer → re-sync (overwrite) and re-author the 6 module files (OVERVIEW / BUSINESS_RULES / ENTITIES / WORKFLOWS / QUESTIONS / GAPS)
5. Write `falcon-wiki/10-PRD/PRD-<n>-<module>.md` atomic note via `new-prd-module` template
**Output:** `Brain Outputs/reports/prd-version-lock-<date>/REPORT.md`
**Halt:** if Drive auth fails OR a module has TWO equal-rank versions (e.g. `V2` and `V2-final`)

### Wave 2 — PRD Deep Read (per module, gap-driven)
**Owner:** `gsd-domain-researcher` (senior business analyst) + `brain-module` skill
**Priority order:** PRD-05 Templates (25% mined) → PRD-03 Packaging+Billing scope gap → all others incremental
**Process:**
1. For each PRD, extract every business rule with PRD-line citation (BR-AM-*, BR-UM-*, BR-CC-*, BR-CGM-*, BR-T-*)
2. For each business rule, build a `BR-<ID>.md` atomic note linking PRD line ↔ backend code ↔ V-rule ↔ test case
3. For every PRD term, register in `falcon-wiki/Glossary.md` (En/Ar)
4. For every open contradiction, flag as `Q-<MODULE>-<NEW-ID>`
**Output:** Per-rule atomic notes + glossary updates + question file
**Halt:** any PRD reading contradiction → `_pending-questions/F-010-prd-contradiction-<id>.md`

### Wave 3 — Domain Glossary Lock
**Owner:** `brain-glossary` skill + ChatGPT (strategy advisor for term choice)
**Process:**
1. Walk every PRD module + every OVERVIEW + every BR/V/E note for domain terms
2. Resolve En/Ar consistency (one canonical pair per term)
3. Flag banned synonyms (e.g. "client" vs "account" vs "tenant")
4. Update `falcon-wiki/Glossary.md`
5. Build glossary delta report
**Output:** `falcon-wiki/Glossary.md` + `Brain Outputs/reports/glossary-delta-<date>/REPORT.md`
**Halt:** any term with two competing canonical forms → ask ChatGPT for strategy verdict, log

### Wave 4 — Page Mining Catch-Up
**Owner:** `ammar-web-platform-ui` + `brain-module` + per-module Ammar (auth/commerce/charging)
**Priority order:** edit-user → add-contract → edit-contract → contracts-list → wallets-and-balance-management → create-template-whatsapp → templates-list → contact-groups-list → create-contact-group → login → forgot-password → change-password → my-profile
**Process:** For each skeletal page, generate the full Add Client-style folder:
```
<page-name>/
  README.md
  00-OVERVIEW.md
  01-PERMISSIONS.md
  02..06-STEP_*.md (per step or section)
  07-VALIDATIONS.md
  08-BACKEND_API.md
  09-COMPONENTS.md
  10-KAFKA_SIDE_EFFECTS.md
  11-STATE_TRANSITIONS.md
  12-ERROR_STATES.md
  13-GAPS_AND_DRIFTS.md
  14-IMPLEMENTATION_CHECKLIST.md
  PLAYBOOK.md
```
+ vault graph node at `Brain SK/_obsidian/10-Pages/<Page> Flow.md`
**Halt:** any page where PRD doesn't describe the page → leave skeletal + flag as PRD gap

### Wave 5 — Backend Controller Deep-Dive
**Owner:** Per-service Ammar specialist (`ammar-auth` for identity, `ammar-core-commerce` for commerce, etc.)
**Process:** For each backend service, fan out per-controller dossiers:
```
backend/<svc>/controllers/<ControllerName>/
  OVERVIEW.md · ENDPOINTS.md · DTOS.md · VALIDATIONS.md · ERRORS.md · FRONTEND_CONTRACT.md
```
**Priority:** Commerce (`AccountController`, `SettingController`, `ApplicationController`, `CommChannelController`) → Identity (`AuthController`, `UserController`, `WebhookController`) → Charging (`LedgerController`) → Provisioning fan-out → Access (PES controllers) → Contact-group → Templates
**Halt:** any controller whose endpoint shape disagrees with the PRD entity → `_pending-questions/F-004-entity-drift-<entity>.md`

### Wave 6 — Cross-Cutting Drift Audit (full re-run every 24h)
**Owner:** `gsd-codebase-mapper` (senior data analyst) + per-service Ammar
**Process:**
1. Re-scan 67 watched source files via `scan-authority.ps1`
2. Refresh 15 E-* entity reconciliation notes
3. Refresh 25 V-rule × feature matrix
4. Refresh BR-* × feature matrix (180 rules)
5. Refresh PES catalog vs `falcon-access.registry.ts` vs PRD sheet drift table
6. Run `brain-audit.ps1` (Gate 0 from NIGHT-SHIFT-LOOP)
**Output:** drift report; if exit 1 → MarkChecked or halt
**Halt:** any drift on watched file without provenance → `_pending-questions/F-006-drift-<file>.md`

### Wave 7 — Frontend Component Gap Sweep
**Owner:** `ammar-web-platform-ui` + `polish` skill
**Process:**
1. Run incremental-scan against 62 dossiers
2. For each component: refresh `GAPS_AND_UPGRADES.md` against current consumer pages
3. Detect orphan components (no consumer) → flag for deletion review
4. Detect missing components (needed by a page but no dossier) → flag for authoring
5. Refresh `falcon-wiki/30-Components/<name>.md` atomic notes
**Halt:** none — write all findings

### Wave 8 — Test Case Authoring (Gherkin)
**Owner:** `brain-tests-all` skill + `test-case-authoring` skill
**Process:**
1. For every BR-* and V-rule, generate Gherkin TC-MODULE-TYPE-### scenarios (happy / negative / edge / validation / permission / workflow / integration)
2. Trace each test to ≥1 PRD line + ≥1 backend endpoint
3. Append to `falcon-wiki/90-Tests/` atomic notes
**Halt:** any rule that cannot be tested without a runtime backend → flag, continue

### Wave 9 — Obsidian Re-Graph
**Owner:** Brain SK auto-tools
**Process:**
1. Generate atomic notes via Templater for every new fact
2. Verify wikilinks resolve (zero broken)
3. Update MOCs (`00-MOCs/`) with new node counts + last-updated stamps
4. Compute Dataview knowledge scores per node
5. Run `brain-audit.ps1` against vault
**Halt:** broken backlink → halt + heal

### Wave 10 — Senior AI Strategy Pass (per kickoff)
**Owner:** ChatGPT (strategy) + Gemini (visual QA) + Claude (synthesis)
**Process:**
1. ChatGPT reviews open Q-* questions → produce recommended business answer per question with rationale
2. Gemini reviews any new chart/diagram/screenshot evidence
3. Claude synthesizes both into a "morning brief" — what changed, what's unresolved, what should the business team prioritize
**Output:** `Brain Outputs/reports/night-shift/<date>/MORNING-BRIEF.md`
**Halt:** if ChatGPT or Gemini API auth fails → log + continue without strategy pass

## 3. Orchestration — who runs which wave

| Wave | Lead | Senior advisors | Supporting Ammar |
|---|---|---|---|
| 1 PRD lock-in | `brain-prd` | gsd-domain-researcher, ChatGPT | — |
| 2 PRD deep read | gsd-domain-researcher | ChatGPT (strategy) | per-module Ammar |
| 3 Glossary lock | `brain-glossary` | ChatGPT | — |
| 4 Page mining | per-module Ammar | gsd-domain-researcher | ammar-web-platform-ui |
| 5 Controller deep-dive | per-service Ammar | gsd-codebase-mapper | — |
| 6 Drift audit | gsd-codebase-mapper | — | per-service Ammar (on hits) |
| 7 Component sweep | ammar-web-platform-ui | polish skill | — |
| 8 Test authoring | `brain-tests-all` | gsd-domain-researcher | per-module Ammar |
| 9 Vault re-graph | Brain SK auto | — | — |
| 10 Strategy pass | Claude synthesis | ChatGPT + Gemini | Adnan |

**Adnan** routes work, ensures parallelism (independent waves run concurrently), enforces halt-criteria, writes the morning brief, and updates `MEMORY.md` after each successful wave.

## 4. Source-prefix contract (every fact in every written file)

| Prefix | Meaning |
|---|---|
| `[CODE]` | source file:line citation |
| `[BRAIN-OUT]` | `Brain Outputs/` dataset path |
| `[VAULT]` | `falcon-wiki/` Obsidian SoT path |
| `[BRAIN-SK]` | `Brain SK/_obsidian/` Brain SK graph path |
| `[PRD]` | `prd/modules/<n>/latest-prd.md:line` PRD citation |
| `[MEMORY]` | memory entry id |
| `[INFERRED]` | agent reasoning — MUST be flagged so user can sanity-check |

Unprefixed claims → night-shift writer aborts the file write (treated as convention violation).

## 5. Halt-and-flag protocol (per DECISION-PROTOCOL)

When a wave hits ambiguity score ≥7 OR a security/data-integrity fork without a rule:

1. STOP that wave
2. Write `Brain Outputs/datasets/authority-dataset/_pending-questions/<wave>-<fork-id>-<topic>.md` with the shape:
   ```
   ---
   type: pending-question
   fork-id: F-XXX
   wave: <N>
   halted-at: <ISO>
   night-shift-batch: <run-id>
   ---
   # Fork: <one-line title>
   ## Why halted
   ## Sources reviewed
   ## Plausible answers (A / B / C)
   ## Recommended question for the human (yes/no or A/B/C)
   ## Blast radius
   ```
3. Continue other waves (don't block the whole night)
4. In the morning brief, surface every halt with recommended user action

## 6. Vault write-back rules (Obsidian + Brain Outputs)

- **Source of truth boundary:** Brain Outputs is authoritative for content; Obsidian is the graph/navigation layer
- Every new fact → atomic note via Templater template
- Never append to mounted registries (Obsidian `_mounts/`)
- Update MOC after every successful wave
- Use additive sync to Brain SK mirror: `robocopy ... /E /XO /XD .git node_modules dist bin obj` (NEVER `/MIR` or `/PURGE`)
- Run `brain-audit.ps1` between waves; fail-fast on broken links

## 7. Morning brief (Wave 10 deliverable)

Written to `Brain Outputs/reports/night-shift/<YYYY-MM-DD>/MORNING-BRIEF.md`:

```markdown
# Falcon Brain Morning Brief — <date>

## What changed (deltas)
- PRD-<n> version bump V<a> → V<b> (resync ✅)
- Page X promoted skeletal → full folder
- Controller Y deep-dived (Z new endpoints documented)
- N new test cases authored
- M new atomic notes created in falcon-wiki/

## What's unresolved (pending questions)
- F-XXX <title> — recommended user action: <Y/N or A/B/C>

## Knowledge score deltas
- PRD coverage: <before>% → <after>%
- Page coverage: <before>/<total> → <after>/<total>
- Controller coverage: <before>/<total> → <after>/<total>
- Component coverage: <before>/<total> → <after>/<total>

## Strategic notes from ChatGPT/Gemini
- ...

## Top 3 priorities for business team today
1. ...
2. ...
3. ...
```

## 8. Resumability + state

State lives at `C:\Falcon\universal-brain\state\` (per project `.claude/CLAUDE.md` Brain lifecycle). On every wave step:
- Append to `progress-log.md`
- Update `current-task.json.currentStep / nextStep`
- Checkpoint before risky writes
- If context resets, read `backups/latest-restore-packet.md` first

## 9. Run cadence

| Trigger | Action |
|---|---|
| Kickoff (user says "start mining") | Run Waves 1 → 10 in order |
| Drive delta detected | Restart from Wave 1 |
| Git commit on any service repo | Restart from Wave 5 + Wave 6 |
| Morning (when user returns) | Wave 10 produces brief |
| 6h idle | Re-run Wave 6 drift audit |
| 24h idle | Full Wave 1 → 10 cycle |

## 10. Critical decisions needed from user BEFORE launch

These are the forks the night-shift agent cannot resolve autonomously. Each must have a rule in place before kickoff, OR be deferred to halt-and-flag.

1. **Approval gate**: write to vault unsupervised between waves, OR checkpoint at each wave boundary for next-session human review?
2. **PRD-05 Templates 75% gap**: re-sync the entire 982-line PRD overnight (high token cost), OR mine only the missing 732 lines incrementally?
3. **Wave 10 strategy pass**: invoke ChatGPT + Gemini APIs overnight (cost) or only on user-presence?
4. **Page mining priority**: PRD-driven (cover Templates + Contracts first), OR consumer-driven (cover edit-user + my-profile first — used daily)?

See accompanying question in the response.

## 11. See also

- [[_INDEX]] — cluster 19 readiness gate
- [[SPEC-PROTOCOL]] — how to write a falsifiable SPEC.md
- [[DECISION-PROTOCOL]] — 25-fork resolution catalog
- [[NIGHT-SHIFT-LOOP]] — 5-gate verification chain
- [[../0-MASTER-INDEX]] — Falcon-wide knowledge router
- [[../VERIFICATION-STATUS]] — what's runtime-verified
- `C:\Falcon\Brain SK\_obsidian\00-Home\IMPLEMENTATION_KNOWLEDGE_MAP.md` — load order per task type

> [!standing-truth]
> PES backend gate: 21/21 runtime-verified · FE-level UI blocked on 40+ Stencil/Angular compile errors · Q-UM-07 blocked on Drive re-export · Scanner watches 67 canonical source files
