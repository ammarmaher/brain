*** PRD Understanding - Basic Send Application - OVERVIEW ***

# 06-basic-send-application - Overview

> Source PRD: `latest-prd.md` in this folder — extracted 2026-07-06 from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx` (**V5, current & authoritative**; V2 archived at `archive/prd-v2.md`, diff in `V2_TO_V5_DIFF.md`).
> React reference (cloud-design SoT): `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` (2,993 ln) + `basic-app-data.jsx` + `basic-app.css` — deep-read in `REACT_REFERENCE.md`, runtime-walked 2026-07-06 (served on :4173, every major screen exercised).
> Coverage: FULL PRD captured (all 508 lines analyzed; 96 business rules; 24 open questions). This module was created by the 2026-07-06 bsa-deep-understanding intake (7 reader agents + adversarial parity critic).

## Purpose

The **Basic Send Application (BSA)** is a Falcon **marketplace application** — a lightweight utility that lets client users dispatch **WhatsApp template messages** and **Voice (IVR) broadcasts** to targeted recipient lists, from the UI or via API. It provides a streamlined compose workflow (template selection → dynamic variable mapping from contact groups → cost estimation → dispatch), granular duplicate handling, transaction history (Outbox/Scheduled) with per-recipient delivery tracking, a per-recipient WhatsApp **conversation view built around the 24-hour customer-service window**, and voice **retry logic with per-attempt audit**. It strictly follows the tenant's balance strategy with **no reservation at creation, charging at execution time, and no balance or channel failover**. [latest-prd.md L3-4, L11-13]

**Platform reality (2026-07-06):** BSA exists as a purchasable Commerce catalog SKU ("Basic Send App", id `695a304f901bb7d4a830d0dc`, runtime-verified) — but there is **no software behind it**. The entire execution plane is new work; every read-side dependency (templates, contact groups, wallets/charging, channel status, PES) already exists. See `PLATFORM_GROUNDING.md`.

## Actors

| Actor | User Type | Capability | Source |
|---|---|---|---|
| Account Owner (AO) | Client | Purchase + activate BSA from Marketplace; oversight of transactions (extent = Q-BSA-02) | L7, L18 |
| Falcon UserType (sys roles) | Falcon | Purchase/activate on behalf of account (with required permissions); review | L7, L18 |
| Normal User | Client | THE sending actor: compose/send/schedule/cancel/delete/edit transactions, conversations, exports — default-allowed for all Normal Users at all levels once app is active | L8 |
| Permission Group | (policy) | Overrides the default: can restrict app usage and Sender-ID selection per user | L8, L46, L291 |
| Node Admin | Client | Not named by the PRD (only "all Normal Users"); the React reference gives Node Admin read-only oversight — flagged Q-BSA-01 | REACT_REFERENCE §S1 |
| System user (API) | Machine | Future: system-to-system callers of the BSA API | L448 |

## Main Screens (PRD ∩ React reference)

| # | Screen | PRD section | React status |
|---|---|---|---|
| 1 | App landing — WhatsApp tab / IVR Voice tab, each with Outbox + Scheduled sub-tab grids + Send button | "BSA Features…Pages" L37-41, L285-286 | PRESENT (role-gated: Send renders only for Normal User) |
| 2 | Send Whatsapp Message — 3 sections (Message Details w/ 3-tier cascade · Recipients w/ CG mapping grid + max-3 manual · phone Preview) + confirm overlay (duplicates + cost) | L43-77 | PRESENT (cost flat-rate stub; allowDup discarded; schedule datetime not persisted) |
| 3 | Send Voice IVR Message — 2-tier cascade (Static/Dynamic), retry logic (≤3 attempts), IVR canvas preview | L288-322 | PRESENT (retry not persisted) |
| 4 | WA Outbox details — stats (Delivered/Read/Played/Seen/Failed/Reply, avg delivery time), cost breakdown, per-recipient grid w/ Meta statuses + conversation entry + phone preview, exports | L126-160 | PRESENT (exports toast-only; avg-delivery-time computed but hidden) |
| 5 | Voice Outbox details — call stats (Answered/Busy/No-Answer/Failed, IVR completion, avg duration), cost by destination + retry attempt, per-recipient attempts sub-table, IVR canvas + transcripts, recorded-call preview | L370-408 | PRESENT (recorded-call modal orphaned; Send-Date/Message-Cost columns missing — conflict C2) |
| 6 | Scheduled tabs + frozen Scheduled details (zeroed stats, Pending, 0 SAR) + Edit/Delete | L162-198, L410-445 | PRESENT (Edit is a compose-again stub — conflict C5) |
| 7 | WhatsApp Conversation — msg-info panel, 11 message types, actions, search, **24h CS-window countdown**, composer, template-after-expiry flow | L200-283 | PRESENT (window static/demo-toggled; record-chaining missing — conflicts/gaps) |
| 8 | Voice Conversation — IVR walk playback (voice notes, transcripts, DTMF), cross-channel follow-up buttons | L406 | PRESENT (+ code-only AI-handoff demo) |

## Main Actions

| Action | Allowed by | Rule anchors |
|---|---|---|
| Purchase + activate app | AO / Falcon UserType | BR-BSA-01..05 |
| Compose + send now / schedule | Normal User (unless PG-restricted) | BR-BSA-25..42 |
| Cancel In-Progress transaction (next batch edge; race-aware confirmation) | transaction owner (Q-BSA-24) | BR-BSA-55..57 |
| Edit / Delete scheduled (pre-due only; Deleted stays visible) | transaction owner (Q-BSA-24) | BR-BSA-71..76 |
| Converse within 24h CS window; template re-initiation after expiry (new chained record) | authorized users (Q-BSA-01) | BR-BSA-77..85 |
| Export details / statistics | any viewer incl. read-only mode | BR-BSA-63, 69, 14 |
| API send + skeleton reads (templates, CGs, sender IDs) | Normal user; future system user | BR-BSA-86..94 |

## Charging model (the heart of the app)

- **No reservation at creation** — immediate AND scheduled: balance is touched only at execution. [BR-BSA-18]
- **WhatsApp**: per record/batch — verify balance → deduct/reserve as first step → dispatch → commit on success / refund-release on internal failure; insufficient balance aborts that record/batch → transaction Failed (nothing processed) or Partially Processed. PRD words this both as deduct-then-refund AND reserve-commit-return (Q-BSA-08); the platform's Charging OCS `reserve → commit | release` API with idempotency (`AlreadyApplied`) is the obvious primitive — see `PLATFORM_GROUNDING.md` §1.3.
- **Voice**: NO per-call reservation — per-second near-realtime deduction during the live call; balance exhausted → terminate call; pre-call gate = balance > 1 second of cost. [BR-BSA-21..22]
- Third-party rejection after successful send: BSA does NOT refund — core Wallet Engine handles per contract rules. [Edge case EC-3]

## Module dependencies

- **05-templates** — WA templates (3-tier: category/language/name, Meta statuses, variables) + Voice IVR trees (Static/Dynamic, voice records); approved + own/shared only; send-time sendability re-check is **BSA's** job (GAP-TM-15 ruling).
- **04-contact-group-management** — recipient source; columns → template variables (destination column + 1:1 mapping); own/shared; active only.
- **03-contract-packaging-charging-billing** — rating (destination × category × count × active contract), wallets, balance strategies (UserBased/NodeBased × Single/Multi wallet), W6 send-charging workflow.
- **01-account-management** — commchannel status per account (Active/Expired/Disabled/grace) gates Send; marketplace purchase; account hierarchy ("all levels").
- **02-user-management** — Normal User default access; Permission Groups override; user identity for own/shared + "logged-in user" scoping.
- **External**: Meta WhatsApp Cloud API (send, delivery/read webhooks, template sync) + SIP/Voice provider (dialing, call statuses, per-second charging feed).

## Files in this module

| File | Content |
|---|---|
| `latest-prd.md` | Canonical extracted PRD V5 text (line anchors used everywhere) |
| `BUSINESS_RULES.md` | BR-BSA-01..96 with verbatim quotes |
| `ENTITIES.md` | E1-E15 attribute-level entity model |
| `WORKFLOWS.md` | 4 state machines + 8 step-by-step workflows |
| `API.md` | BSA send API + 3 skeleton APIs + deferred items |
| `EDGE_CASES.md` | PRD's own Pending list + edge cases, verbatim |
| `QUESTIONS.md` | Q-BSA-01..24 open questions |
| `GAPS.md` | 3-layer gap register (PRD↔React parity matrix, C1-C14 conflicts w/ rulings, backend absence) |
| `V2_TO_V5_DIFF.md` | Spec evolution V2→V5 |
| `REACT_REFERENCE.md` | Exhaustive reference-implementation read (screens, components, data, flows, integration surface, stubs/dead code) + runtime-walk evidence |
| `REACT_HOST_INTEGRATION.md` / `REACT_ADJACENT_MODELS.md` / `REACT_CONTACT_GROUPS.md` | Shell mounting + marketplace flow · template/IVR/sender/channel models · contact-group model |
| `PLATFORM_GROUNDING.md` | What the real Falcon backend has vs what the new BSA service must build (verified/unverified per trust ladder) |
| `IMPLEMENTATION_PLAN.md` | FE-project + BE-project split delivery plan (waves, decision gates) |
| `REPLAN_INTERNAL_SOT_PARITY.md` | **AUTHORITATIVE plan (Rev 3, 2026-07-07)**: FINAL ruling = internal in-console feature (no MF app); implementation audit map (compliance: 1 token violation, folder deviation; SoT parity per screen); waves M0 internalization → M1 exact-SoT parity → F2-F8; always-on compliance gate |
| `WAVES_AND_LIBRARY_MAP.md` | ALL 25 waves in one table · SoT-page→falcon-component rollup (113 elements: 74/16/23) · customization-without-regression policy (ladder ①-⑧, additive-only upgrades, consumer census, Falcon Eyes neutrality gates) |
| `BUILD_PLAN_DETAILED.md` | **Function-level multi-wave build plan (2026-07-07)**: library L-waves (npm packaging / compiled-tarball consumption + MF singleton constraint), communication design (host↔remote injector reality, HTTP path, ports/mock-first), F2-F9 waves with store/service function signatures, W-PES + W-DARK, dependency DAG |
| `ARCHITECTURE_BACKEND.md` | **Deep backend design**: integration matrix, Mongo collections, engine internals, FULL API surface (19 UI + public + webhooks), PES matrix, Kafka, errors, config, deployment, NFRs, 5 normative sequences, risk register |
| `ARCHITECTURE_FRONTEND.md` | **Deep FE design**: D-1a placement (NX lib `libs/basic-send` + Recipe A wiring), screen×component map, library coverage verdicts, new-component backlog N1-N10 + extensions E1-E8, state/PES/i18n/testing |
| `FE_LIBRARY_COVERAGE.md` | 113-element falcon-ui-core coverage matrix (74 covered / 16 partial / 23 missing) + existence answers + traps |
| `FE_WORKSPACE_WIRING.md` | Repo-reality wiring evidence + Recipe A (in-console feature) / Recipe B (true remote) file:line checklists |
| `BE_CONTRACTS.md` (+ `evidence-templates-openapi.json`) | Exact existing contracts BSA consumes (verbatim DTOs, enums, gateway JSON, PES shapes) + live templates-svc probe (45 paths) + 20-item contract risk register |
| `ENHANCED_PROMPT.md` | Re-input prompt for future BSA sessions |

## Health

- **Status:** Fully understood; NOT implemented (marketplace SKU only).
- **Top concerns:** Q-BSA-08 (two charging mechanics for WA); purchase-model conflict V2-auto-available vs V5-marketplace-purchase (V2_TO_V5_DIFF §8.2.1); conversation scope (record chaining + CS window live mechanics designed nowhere); sender-ID registries (WABA + SIP) CONFIRMED-ABSENT; per-second voice charging loop has substrate but no engine; PRD "Pending" defers reports, other-roles behavior, API docs, conversation menu item.
- **Verification level:** PRD = user-supplied SoT document; React = code-read + runtime-walked ✋; backend claims = trust-laddered in `PLATFORM_GROUNDING.md` §2.
