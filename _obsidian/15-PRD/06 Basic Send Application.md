---
type: prd-module
prd-id: PRD-06
module-name: Basic Send Application
coverage-percent: 0
sync-date: 2026-07-06
status: fresh
created: 2026-07-06
---
*** PRD-06 — Basic Send Application (BSA) ***
*** SoT: Brain Outputs/prd/modules/06-basic-send-application/ ***
*** Source doc: `Basic Send Application-V5.docx` (user-supplied 2026-07-06; V2 archived; full V2→V5 diff in module) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake (7 reader agents + adversarial parity critic + live runtime walk of the React reference) ***

# PRD-06 — Basic Send Application

> A **marketplace application** for dispatching **WhatsApp template messages** and **Voice (IVR) broadcasts** to contact groups + manual recipients, from UI or API. Compose = template cascade (WA 3-tier · Voice 2-tier) → per-CG destination + 1:1 variable mapping → cost estimation → confirm (duplicates toggle). History = Outbox/Scheduled per channel with per-recipient delivery tracking, cancel-at-batch-edge, frozen scheduled details, exports. Conversation view built on the **24-hour customer-service window** with template re-initiation + record chaining. Charging: **no reservation at creation**; WA per-batch reserve→commit|release; Voice per-second realtime deduction with call termination; no balance/channel failover.
>
> **Platform reality:** BSA exists ONLY as a purchasable Commerce catalog SKU (`Basic Send App`, id `695a304f901bb7d4a830d0dc`, runtime-verified). The entire execution plane is unbuilt (GAP-BSA-01: no service · GAP-BSA-02: no gateway route). Every read-side dependency already exists (Charging OCS, templates-svc `feat/ivr-templete`, contact-group svc, PES, channel/app status reads).

## Source-of-truth files (Brain Outputs)

| File | Purpose |
|---|---|
| [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) | Purpose · actors · screens · actions · charging model · health |
| [latest-prd](../../../Brain%20Outputs/prd/modules/06-basic-send-application/latest-prd.md) | Canonical extracted PRD V5 text (all line anchors) |
| [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) | BR-BSA-01..96, verbatim-quoted |
| [ENTITIES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/ENTITIES.md) | E1-E15: SendTransaction, RecipientResult, Attempt, ConversationRecord, MappingSpec, SenderId… |
| [WORKFLOWS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/WORKFLOWS.md) | 4 state machines (txn WA/Voice · recipient WA/Voice) + 8 workflows |
| [API](../../../Brain%20Outputs/prd/modules/06-basic-send-application/API.md) | BSA send API + 3 Skeleton APIs (templates/CGs/senderIDs) + deferred items |
| [EDGE_CASES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/EDGE_CASES.md) | PRD's own Pending list + edge cases, verbatim |
| [QUESTIONS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/QUESTIONS.md) | Q-BSA-01..24 open questions (halt-and-flag list) |
| [GAPS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/GAPS.md) | 3-layer gap register: PRD↔React parity matrix · conflicts C1-C14 **with rulings** · backend absence |
| [V2_TO_V5_DIFF](../../../Brain%20Outputs/prd/modules/06-basic-send-application/V2_TO_V5_DIFF.md) | Spec evolution (incl. removed V2 auto-availability/0-SAR default — purchase-model conflict) |
| [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) | Exhaustive read of the cloud-design SoT (`falcon-ux (4)/admin/basic-app.jsx`) + runtime-walk evidence + stub/dead-code do-NOT-port list |
| [REACT_HOST_INTEGRATION](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_HOST_INTEGRATION.md) · [REACT_ADJACENT_MODELS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_ADJACENT_MODELS.md) · [REACT_CONTACT_GROUPS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_CONTACT_GROUPS.md) | Shell mount + marketplace flow · template/IVR/sender/channel models · CG model |
| [PLATFORM_GROUNDING](../../../Brain%20Outputs/prd/modules/06-basic-send-application/PLATFORM_GROUNDING.md) | Existing backend vs new-build scope, trust-laddered |
| [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md) | FE + BE wave plan, decisions D-1..D-10 (D-1 REVISED: NX lib `libs/basic-send`, not MF remote), prereqs P-1..P-4 |
| [ARCHITECTURE_BACKEND](../../../Brain%20Outputs/prd/modules/06-basic-send-application/ARCHITECTURE_BACKEND.md) · [ARCHITECTURE_FRONTEND](../../../Brain%20Outputs/prd/modules/06-basic-send-application/ARCHITECTURE_FRONTEND.md) | Deep designs: full API surface + engines + collections + PES/Kafka/deployment · screen×component map + Recipe A wiring + new-component backlog N1-N10 |
| [FE_LIBRARY_COVERAGE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/FE_LIBRARY_COVERAGE.md) · [FE_WORKSPACE_WIRING](../../../Brain%20Outputs/prd/modules/06-basic-send-application/FE_WORKSPACE_WIRING.md) · [BE_CONTRACTS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BE_CONTRACTS.md) | Evidence: 113-row falcon-ui-core coverage (74/16/23) · repo wiring recipes A/B · exact consumed contracts + live templates probe (45 paths) + 20-item risk register |
| [REPLAN_INTERNAL_SOT_PARITY](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REPLAN_INTERNAL_SOT_PARITY.md) | AUTHORITATIVE Rev-3 plan: FINAL ruling internal in-console feature · audit map · M0/M1 + F2-F8 · compliance gate |
| [WAVES_AND_LIBRARY_MAP](../../../Brain%20Outputs/prd/modules/06-basic-send-application/WAVES_AND_LIBRARY_MAP.md) | All 25 waves · SoT→library rollup · no-regression customization policy |
| [BUILD_PLAN_DETAILED](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUILD_PLAN_DETAILED.md) | Function-level multi-wave plan: library npm/tarball L-waves · communication design · F2-F9 store/service signatures · W-PES/W-DARK · DAG (2026-07-07) |
| [ENHANCED_PROMPT](../../../Brain%20Outputs/prd/modules/06-basic-send-application/ENHANCED_PROMPT.md) | Replayable session prompt for all future BSA work |

## Pages that implement this PRD

- [[Basic Send App]] — landing: WhatsApp/IVR-Voice tabs · Outbox/Scheduled grids · channel-status + role-gated Send
- [[Send Whatsapp Message]] — 3-section compose (3-tier cascade · CG mapping grid + max-3 manual · phone preview · confirm overlay)
- [[Send Voice IVR Message]] — 2-tier compose + retry logic (≤3 attempts) + IVR canvas preview
- [[Basic Send WhatsApp Details]] — stats · cost breakdown · per-recipient Meta statuses · exports · conversation entry
- [[Basic Send Voice Details]] — call stats · cost by destination/attempt · attempts sub-table · IVR canvas + transcripts
- [[WhatsApp Conversation]] — 24h CS-window thread · composer · template-after-expiry re-initiation

## Falcon components used by this PRD

[[Falcon Data Table]] · [[Falcon Tabs]] · [[Falcon Dropdown]] · [[Falcon Select]] · [[Falcon Search Input]] · [[Falcon Date Picker]] · [[Falcon Calendar]] · [[Falcon Paginator]] · [[Falcon Status Badge]] · [[Falcon Badge]] · [[Falcon Button]] · [[Falcon Card]] · [[Falcon Dialog]] · [[Falcon Confirm Dialog]] · [[Falcon Alert Dialog]] · [[Falcon Insufficient Balance Dialog]] · [[Falcon Toggle]] · [[Falcon Checkbox]] · [[Falcon Input]] · [[Falcon Input Number]] · [[Falcon Textarea]] · [[Falcon Menu]] · [[Falcon Empty State]] · [[Falcon Notification]] · [[Falcon Drawer]] · [[Falcon Tooltip]] · [[Falcon Icon]]
_(from the React reference's screen inventory; status-pill palette + bsa-* CSS conventions documented in REACT_REFERENCE §2.3)_

## Backend services implementing this PRD

| Concern | Service | Status |
|---|---|---|
| Transaction engine · batch processor · scheduler · conversation store · retry engine · stats/exports · BSA API + skeleton facades · Meta/SIP adapters · sender-ID registries | **[[Basic Send Service]] (planned — does not exist)** | GAP-BSA-01 / GAP-BSA-02 |
| Charging: reserve→commit\|release · debit · rating · strategies · realtime substrate | [[Charging Service]] | EXISTS (Charging Lab = proven WA batch-loop blueprint) |
| WA templates + Voice IVR trees + voice records | [[Templates Service]] | EXISTS on branch `feat/ivr-templete` (42 paths; merge status unverified) |
| Contact groups own/shared + columns + contacts paging | [[Contact Group Service]] | EXISTS |
| Marketplace purchase/order + channel & app status | [[Commerce Service]] · [[Provisioning Service]] | EXISTS ("Basic Send App" SKU runtime-verified) |
| PES decisions (needs new `acc.bsa*` resources — `acc.services` denies acc-user) | [[Access PES Service]] | EXISTS; BSA seeds pending |
| Gateway routing `/bsa/*` | [[Core Gateway Service]] · [[System Gateway Service]] | MISSING (GAP-BSA-02) |

## Validation surface

Compose gating (template Approved + owned/shared · destination + 1:1 variable mapping per CG · manual ≤3 with ALL variables · sendDate > now) · channel-status send gating · duplicate normalization (Q-BSA-17) · API single-CG rule. V-rules not yet promoted into `30-Validation/` — candidates listed in [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) §1.5. Hub: [[VALIDATION_INDEX]].

## Module dependencies

- **[[05 Templates]]** — WA templates (3-tier, Meta statuses, variables) + Voice IVR trees; BSA owns the send-time sendability re-check (GAP-TM-15 ruling)
- **[[04 Contact Group Management]]** — recipient source; columns → template variables; own/shared; active only
- **[[03 Contract Packaging Charging Billing]]** — rating axes (destination × category × count × contract), wallets, balance strategies, W6 send-charging workflow
- **[[01 Account Management]]** — commchannel statuses gate Send; marketplace purchase; hierarchy levels
- **[[02 User Management]]** — Normal-User default access + Permission-Group overrides + logged-in-user scoping
- **Journey:** [[Basic Send Message]] (productizes [[Send Campaign]])

## Health

- **Status:** Fully understood (96 BRs · 15 entities · 4 FSMs · 24 open Qs · 14 ruled conflicts); **0 % implemented** — marketplace SKU only.
- **Top concerns:** Q-BSA-08 dual WA charging wording · V2-vs-V5 purchase-model conflict · sender-ID registries CONFIRMED-ABSENT (blocks Voice + skeleton API) · per-second voice charging engine absent (substrate exists) · conversation record-chaining + live CS-window designed nowhere · PRD Pending defers reports/other-roles/API-docs/conversation-menu.

## Tags

#type/prd-module #prd/06 #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/charging #service/templates #service/contact-group #service/commerce #service/provisioning #service/access #gap #blocked

## Hubs

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]]
