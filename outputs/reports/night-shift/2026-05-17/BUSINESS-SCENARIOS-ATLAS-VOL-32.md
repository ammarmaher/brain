---
type: business-scenarios-atlas
volume: 32
title: "Falcon Business Scenarios Atlas — Volume 32: Campaigns + WhatsApp + Facebook — The Honest Implementation Map"
purpose: "Brutally truthful coverage of what IS implemented, what's diffuse across multiple files (not a single feature but assembled from parts), and what's explicitly NOT implemented. Source-grounded only — no speculation."
volume-32-sections: 6
underline-rule: "Underlined sections = NOT implemented as a single feature but assembled from multiple files diffusely"
---

# Falcon Business Scenarios Atlas — Volume 32: Campaigns + WhatsApp + Facebook (TRUTHFUL Map)

> Every claim in this volume is source-prefixed. Where Falcon has something, I cite the files. Where Falcon doesn't, I say so explicitly. Where the functionality exists but is **diffuse across multiple files** (assembled from parts, not a single feature), I underline it as "DIFFUSE".

---

## SECTION 1 — Campaigns: The Truth

### 1.1 Does Falcon have a "Campaign" entity?

**NO.** [VERIFIED via codebase + PRD search]

- The word "Campaign" does NOT appear as a domain entity in any PRD module
- There is NO `Campaign` table, controller, DTO, or service
- There is NO Campaign creation wizard in Angular UI
- There is NO Campaign concept in `falcon-access.registry.ts` PES keys

[CODE] verified by grep across the entire Falcon repository: every match for "campaign" / "Campaign" is in:
- React source-of-truth theme (visual reference, not implemented)
- Brain Outputs reports (analysis documents)
- Node_modules (irrelevant dependencies)

### 1.2 The functional analog of "Campaign" in Falcon

**Send Transaction** (BR-CC-32) is the Falcon equivalent of "sending a campaign":

- **Trigger:** Normal User initiates via the Application layer (e.g., a banking app sends OTPs)
- **Components used (the diffuse assembly):**
  - **Contact Group** (PRD-04) — provides the recipient list
  - **Template** (PRD-05, not yet built — GAP-T-001) — provides the message structure
  - **CommChannel** (PRD-01) — provides the channel + pricing
  - **Contract Detail** (PRD-03) — provides the per-action cost
  - **Wallet** (PRD-01) — provides the payment mechanism
  - **Charging Send Transaction handler** — orchestrates deduction + dispatch

### 1.3 ➡ DIFFUSE — "Campaign" as a concept

**The word "Campaign" is not used, but the underlying functionality is assembled across these files:**

| Layer | File / Location | What it contributes |
|---|---|---|
| Recipients | `prd/modules/04-contact-group-management/` + Contact Group service | List of who to message |
| Message structure | `prd/modules/05-templates/` + Templates service (3 endpoints only) | Predefined message + variables |
| Channel + pricing | `prd/modules/01-account-management/` + Commerce CommChannelConfig | Which channel + cost per send |
| Contract context | `prd/modules/03-contract-packaging-charging-billing-management/` + Commerce Contract Details | Per-priority-per-destination cost |
| Payment | `understanding/backend/charging/` + Charging service | Wallet deduction logic |
| Trigger | Application layer (NOT in Falcon source — clients build their own Apps) | Initiates the send |

### 1.4 Visual references in React theme (NOT implemented in Angular)

The Source-of-truth React theme has files suggesting campaign-like UI was envisioned:
- `Source_of_truth_theme/React/Falcon-Taha2/uploads/Falcone-Taha/marketing.jsx` [REFERENCE only]
- `Source_of_truth_theme/.../admin/comm-mkt.jsx` (Commerce Marketing menu) [REFERENCE only]
- `Source_of_truth_theme/.../templates.jsx` + `templates-wizard.jsx` [REFERENCE only]

These are **visual targets** for future build, not actual implementations. The Angular codebase does NOT have these features.

### 1.5 What can a client do today that LOOKS like a campaign?

✅ **They can:** Create a Contact Group → wait for the day Falcon builds Template UI → wait for an Application to initiate Send Transaction → recipients receive messages

❌ **They cannot:** Define a campaign as a saved entity, schedule sends, A/B test, track campaign-level metrics, pause a campaign mid-flight, target by recipient segment, set campaign-level budget

### Business implications

| Question | Answer |
|---|---|
| "Does Falcon support campaigns?" | **NO as a first-class feature.** Functionality is assembled from Contact Group + Template + Send Transaction. No campaign entity, dashboard, scheduling, or metrics. |
| "How do clients run a marketing campaign today?" | Pre-built Application → initiates Send Transaction on behalf of users. The campaign logic lives in the client's Application, not in Falcon. |
| "Could Falcon add Campaigns?" | Yes — would need a new Campaign entity + scheduler + metrics. Estimated 4-6 months effort. Currently not in any PRD. |

---

## SECTION 2 — WhatsApp: The Truth

### 2.1 What IS implemented for WhatsApp?

#### 2.1.1 PRD coverage (29 of 41 BR-TM rules)

[BRAIN-OUT] `prd/modules/05-templates/BUSINESS_RULES.md`:
- BR-TM-01..29 **[CONFIRMED]** — Maker/Checker, statuses, Meta states, variable rules, category matrix, button rules
- BR-TM-30..41 **[OPEN]** — Voice flow, Checker role assignment, auto-approval scope, edit semantics, etc.

#### 2.1.2 WhatsApp as a CommChannel concept

✅ **Implemented:**
- WhatsApp is a CommChannel in Falcon's master catalog
- Per-account `CommChannelConfig` with visibility + pricing
- `client-comm-channels-step.component.ts` (Add Client Step 3) lets Falcon configure WhatsApp pricing
- Status FSM: InActive → Paid → Active → Expired → Disabled (owned by Commerce per Wave 5d)
- Contract Detail matrix supports WhatsApp pricing per Priority (Authentication/Utility/Marketing/Service per BR-CC-23)

[CODE] cite:
- `client-applications-step.component.ts:*` (Angular Add Client Step 4)
- `client-comm-channels-step.component.ts:*` (Angular Add Client Step 3)
- `understanding/backend/commerce/controllers/CommunicationChannelController/` (Wave 5a Commerce backend)
- `understanding/backend/provisioning/controllers/ServicesController/` (Wave 5d Provisioning read-mirror)

#### 2.1.3 Templates microservice (CommChannelConfig editor only, 3 endpoints)

✅ **Implemented:**
- `GET /api/communication-channel-configs` (per-tenant list)
- `PUT /api/communication-channel-configs/{id}` (bulk update)
- `GET /api/communication-channel-configs/user-checker-levels` (Checker assignment metadata)

[BRAIN-OUT] `understanding/backend/templates/ENDPOINT_REGISTRY.md`

❌ **NOT routed by either gateway** (per integration GAP-008 / Q-TM-10) — FE cannot reach these endpoints today

#### 2.1.4 Page documentation

[BRAIN-OUT] `understanding/pages/create-template-whatsapp/` has 14 detailed implementation files:
- 00-OVERVIEW · 01-PERMISSIONS · 02-STEP_1_BASIC_INFO · 03-STEP_2_MESSAGE_STRUCTURE
- 04-SECTION_PREVIEW · 05-SECTION_CONTACT_GROUP_LINK
- 07-VALIDATIONS · 08-BACKEND_API · 09-COMPONENTS · 10-KAFKA_SIDE_EFFECTS
- 11-STATE_TRANSITIONS · 12-ERROR_STATES · 13-GAPS_AND_DRIFTS · 14-IMPLEMENTATION_CHECKLIST
- PLAYBOOK.md

**These are design documents.** The actual Angular UI is not built.

### 2.2 What is NOT implemented for WhatsApp?

#### 2.2.1 ❌ Template entity API (GAP-T-001 — CONFIRMED MISSING)

[BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-01:
> "No template-entity CRUD endpoints in Templates service. Only `CommunicationChannelConfig` endpoints exposed (3 endpoints)."

**What this means:**
- Cannot create, edit, submit, approve, or delete templates via Falcon's backend
- Maker/Checker flow is documented in PRD but has no API
- The Angular `create-template-whatsapp` page has no backend to call

#### 2.2.2 ❌ Meta webhook integration (GAP-TM-14 — MISSING)

No webhook endpoint to receive Meta state transitions (Active-Quality-Pending → Paused → Disabled etc.)

[BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-14

**Impact:** Even if templates existed, Falcon couldn't track Meta-driven quality changes in real-time.

#### 2.2.3 ❌ Runtime Send-Transaction guard for Meta state (GAP-TM-15 — MISSING)

No code path checks Template.metaState before dispatching a WhatsApp message.

[BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-15

**Impact:** A Paused template could still be attempted; Meta would reject downstream causing silent send failures.

#### 2.2.4 ❌ Template versioning / edit-while-live semantics (Q-TM-03 OPEN)

PRD silent on whether editing a template creates a new version or mutates in-place.

#### 2.2.5 ❌ Auto-approval configuration scope (BR-TM-32 OPEN)

PRD silent on whether auto-approval applies per-account, per-channel, or per-category.

### 2.3 ➡ DIFFUSE — WhatsApp "support" is assembled across these files

Even though WhatsApp isn't a single feature, it's referenced + handled across:

| Where | What it does |
|---|---|
| Templates service (3 endpoints) | CommChannelConfig + CheckerLevels for WhatsApp + other channels |
| Commerce service `CommunicationChannelController` | Master CommChannel catalog including WhatsApp |
| Commerce service `CommChannelConfig` per account | Visibility + pricing of WhatsApp per client |
| Provisioning `ServicesController` | Read-mirror of WhatsApp subscription state per account |
| Charging Send Transaction handler | Charges per WhatsApp send via Contract Detail lookup |
| Add Client wizard Step 3 + 4 | Configures WhatsApp visibility/pricing at account creation |
| PRD-05 Templates module | Documents the WhatsApp template authoring rules + Meta integration |
| BR-CC-23 (Contract Cost) | Defines WhatsApp priorities: Authentication, Utility, Marketing, Service |
| BR-TM-24..29 (Templates) | Meta state mapping rules |
| Glossary | Banned synonyms (Meta ≠ Facebook ≠ WABA-API in Falcon vocab) |
| Visual reference React theme | `templates.jsx`, `templates-wizard.jsx`, `marketing.jsx` |

**The truth:** WhatsApp is a primary use case for Falcon, but its full implementation requires building Template entity API + Meta webhook + send-time guards — all currently MISSING.

### Business implications

| Question | Answer |
|---|---|
| "Can clients send WhatsApp messages via Falcon today?" | **Indirectly.** Their Application can call Falcon's Charging Send Transaction, which charges per WhatsApp send. But they can't author or manage templates in Falcon — must do that directly in Meta Business Manager. |
| "Can we sell WhatsApp template management to a new client?" | **No, not as a Falcon feature today.** The Templates UI is not built. Honest sales pitch: "We'll handle the messaging infrastructure + billing; you bring your own Meta-approved templates for now." |
| "How long to fully ship WhatsApp templates?" | **3-6 months minimum.** Backend entity + gateway routing + Maker/Checker UI + Meta webhook + send-time guards. |

---

## SECTION 3 — Facebook: The Truth

### 3.1 Is Facebook a Falcon CommChannel?

**NO.** [VERIFIED via codebase + PRD search]

- Falcon does NOT integrate with Facebook Messenger
- Falcon does NOT integrate with Instagram
- "Facebook" does NOT appear in any CommChannel enum, controller, DTO, or PRD module body
- Falcon's master CommChannel catalog includes: WhatsApp, Voice, AI, ... (per BR-TM-02 mentions; complete list inferred from CommChannelConfig usage)

[VERIFIED] grep across the Falcon repository: every "Facebook" match is in:
- Node_modules dependencies (irrelevant)
- React showcase library (visual demos, not Falcon features)
- One PRD-05 reference: `prd/modules/05-templates/QUESTIONS.md` line 50 — which is the **banned synonym rule**: "The PRD uses **Meta** for the WhatsApp provider; do NOT alias 'Facebook' / 'WABA-API'."

### 3.2 The Meta vs Facebook distinction (important for vocabulary)

**Meta** = the parent corporation
**Facebook** = one Meta property (the social network)
**WhatsApp** = another Meta property (messaging) — what Falcon integrates with
**Instagram** = another Meta property
**Messenger** = Facebook's messaging product (separate from WhatsApp)

**Falcon's relationship:** Falcon integrates with Meta's **WhatsApp Business API**. That's the entire Meta relationship. Falcon does NOT touch Facebook, Instagram, or Messenger.

### 3.3 ➡ DIFFUSE — "Meta" references across files (the WhatsApp relationship)

Meta references in Falcon are exclusively about WhatsApp:

| Where | What it does |
|---|---|
| BR-TM-26 | Meta state mapping table (In-Review, Active-Quality-Pending, etc.) |
| BR-TM-28 | Meta approval timeline (≤24h typical) |
| BR-TM-29 | Meta quality tiers (High/Medium/Low) |
| Templates GAP-TM-14 | Meta webhook NOT BUILT |
| Vol 16 deep-dive 72 | Meta vendor management |
| Vol 11 deep-dive 51 | Template Meta-state transitions |
| Vol 21 deep-dive 101 | Meta concentration risk + diversification strategy |
| `create-template-whatsapp/` page docs | Meta approval flow within WhatsApp template authoring |

**The truth:** "Meta" in Falcon = "WhatsApp Business API provider" — full stop. No other Meta properties are in scope.

### 3.4 Could Falcon add Facebook Messenger or Instagram?

Technically yes (Meta provides Messenger Platform API + Instagram Messaging API), but:
- Not in any current PRD
- Not in any roadmap document
- Would require: new CommChannel definition + new Template flow per platform + new pricing per platform + Meta licensing terms
- Strategically: WhatsApp dominates B2B messaging in Saudi; Facebook Messenger has very low B2B usage in MENA; Instagram is consumer-focused
- **Recommendation:** Don't add unless a specific enterprise client demands it with a real use case

### Business implications

| Question | Answer |
|---|---|
| "Can we tell clients we support Facebook?" | **NO. Don't say Facebook.** Say "We support WhatsApp via Meta's Business Platform." The Falcon Glossary explicitly bans aliasing Meta → Facebook. |
| "Does Falcon do Instagram messaging?" | **NO.** Not integrated. |
| "Why do we depend on Meta but not on Facebook?" | Meta is the parent corporation that owns WhatsApp. Falcon depends on Meta for **WhatsApp specifically**. We have zero relationship with Facebook or Instagram. |
| "If Meta restricts WhatsApp BSP access tomorrow, what happens?" | Catastrophic to Falcon's primary channel. See Vol 21 deep-dive 101 on Meta concentration risk. |

---

## SECTION 4 — The "Marketing" Concept in Falcon

### 4.1 Where does "marketing" appear in Falcon?

#### As a WhatsApp template Category (BR-TM-24):

WhatsApp template categories in PRD-05:
- **Authentication** (sub: One-time Passcode)
- **Utility** (sub: Default, Flows, Calling permissions request)
- **Marketing** (sub: Default, Catalog, Flows, Calling permissions request)

✅ Implemented in PRD documentation. Not yet enforceable in code (Template entity API missing — GAP-T-001).

#### As a WhatsApp priority in Contract Details (BR-CC-23):

WhatsApp priorities in Contract Detail matrix:
- Authentication
- Utility
- Advertisement
- Service (tentative)

⚠ **Note:** The PRD-03 list (BR-CC-23) uses "Advertisement" + "Service" while PRD-05 (BR-TM-24) uses "Marketing". This is a **vocabulary drift** between modules. [INFERRED] These likely refer to the same Meta concept but with different naming.

### 4.2 ➡ DIFFUSE — "Marketing" capability

There is NO "marketing module" in Falcon. The functionality is assembled from:

| Layer | What's marketing-related |
|---|---|
| WhatsApp template category | "Marketing" is one of 3 official Meta categories |
| Contract Detail pricing | Marketing-category WhatsApp sends are priced differently |
| Contact Group | Recipient lists for marketing campaigns (per the loose sense of "campaign") |
| Meta opt-in rules | Per BR-TM-25: "Marketing templates must comply with Meta marketing policies; recipients must opt-in." |
| Falcon-side opt-in tracking | ❌ **NOT IMPLEMENTED.** Meta enforces opt-in policy at their layer; Falcon has no opt-in registry. |

### 4.3 What's missing for marketing-specific capability?

| Missing | Impact |
|---|---|
| Opt-in registry (per Vol 4 GDPR + Vol 22 CITC compliance maps) | Cannot prove compliance for non-WA channels |
| Campaign entity | Cannot group sends as a logical "marketing campaign" |
| Send scheduling | Cannot defer sends or run at specific times |
| Recipient segmentation | Cannot split a Contact Group by criteria |
| A/B test infrastructure | Cannot test 2 templates against each other |
| Marketing analytics | No engagement / response tracking dashboards |

### Business implications

| Question | Answer |
|---|---|
| "Does Falcon support marketing campaigns?" | **NO as a feature; YES as a billable workflow.** Marketing-category WhatsApp sends are priced + tracked at the send level, but there's no campaign-management UI. |
| "How does Meta opt-in work in Falcon?" | **Falcon doesn't track opt-in.** Meta enforces at their layer. For non-WhatsApp channels, opt-in tracking is NOT implemented — a CITC compliance gap (Vol 4). |

---

## SECTION 5 — Application Layer (The Hidden Layer)

### 5.1 What is an "Application" in Falcon?

[PRD] BR-AM-20: Applications are subscribed services per account.
[PRD] BR-CC-22: Cost depends on (Application × CommChannel × Priority × Destination).

**Critical insight:** An Application is the **runtime that initiates messaging on behalf of users**. Examples might be:
- A banking app that sends OTPs to customers
- A government portal that sends notifications
- A healthcare app that sends appointment reminders

### 5.2 Where is the Application layer implemented?

❌ **NOT in Falcon itself.** [VERIFIED]

The Application is the **client's own software** that:
1. Authenticates to Falcon via JWT (as a Normal User or service account)
2. Calls Falcon's Charging Send Transaction endpoint
3. Provides the recipient + template + variables
4. Falcon handles billing, dispatch, audit

### 5.3 ➡ DIFFUSE — Application support across Falcon

| Where | What it does |
|---|---|
| Add Client Step 4 wizard | Configures which Applications are subscribed for the account |
| `client-applications-step.component.ts` | Angular UI for Application selection |
| Commerce `ApplicationController` | Backend list of Applications subscribed per account |
| `AppConfig` entity (PRD-01) | Per-account visibility + pricing per Application |
| Contract Detail matrix | Per-Application cost configuration |
| Application status FSM | Same as CommChannel (InActive → Paid → Active → Expired → Disabled) |

### 5.4 What Falcon does NOT do for Applications

❌ Host the Application code (clients build their own)
❌ Provide SDK / templates for Application development
❌ Authenticate End-Users of the Application (only the Application's service account)
❌ Manage Application configuration beyond visibility + pricing
❌ Track Application-level analytics
❌ Provide Application sandbox / testing environment

### Business implications

| Question | Answer |
|---|---|
| "Does Falcon include the Application?" | **NO.** Clients bring their own Application or use a 3rd-party app. Falcon = the messaging infrastructure + billing engine that the Application calls. |
| "Can Falcon host a generic Send Transaction UI?" | **NO today.** Would need to build a "Falcon Messenger" Application — a new product, not in current PRD. |

---

## SECTION 6 — The Honest Summary

### 6.1 What Falcon DOES today (campaigns/WhatsApp/Facebook context)

✅ Charges per message sent through Apps
✅ Manages per-account CommChannel subscriptions (visibility + pricing)
✅ Documents WhatsApp template rules in PRD-05 (29/41 BR-TM rules)
✅ Manages Contact Groups (recipient lists)
✅ Per-tenant CommChannelConfig for Templates service (3 endpoints, NOT gateway-routed)
✅ Contract Details matrix supports per-priority pricing including Marketing
✅ Audit trail per message (contractId tagged)

### 6.2 What Falcon does NOT do today

❌ Template entity authoring (Templates UI + backend MISSING)
❌ Meta webhook for state changes (NOT BUILT)
❌ Runtime Meta-state guards on Send Transaction (NOT BUILT)
❌ Facebook / Instagram / Messenger integration (NO)
❌ Campaign entity / scheduling / management (NO)
❌ Marketing analytics dashboards (NO)
❌ Opt-in registry (Meta handles it for WA; non-WA gap)
❌ Send scheduling (NO)
❌ A/B test infrastructure (NO)
❌ Voice + AI template flows (Q-TM-01/08 OPEN; PRD beyond 250 lines not captured)

### 6.3 The "diffuse implementations" that need understanding

**Underline these as DIFFUSE — they exist but aren't a single feature:**

1. ➡ **"Campaign"** = Contact Group + Template (when built) + Application + Send Transaction
2. ➡ **"WhatsApp support"** = CommChannel + Contract Detail + Templates service CommChannelConfig + PRD-05 docs
3. ➡ **"Marketing"** = WhatsApp category + Contract Detail priority + Meta opt-in (Falcon-side gap)
4. ➡ **"Bilingual messaging"** = 2 separate templates (1 per language, per BR-TM-03)
5. ➡ **"Meta integration"** = WhatsApp Business API specifics — not generic Meta-platform integration

### 6.4 Honest sales-pitch language

✅ **CAN say:**
- "Falcon supports per-account WhatsApp configuration with granular pricing"
- "We handle the messaging infrastructure + billing + audit trail"
- "We integrate with Meta's WhatsApp Business Platform"
- "We support multi-CommChannel architectures (WhatsApp, Voice, AI)"

❌ **CANNOT say without lying:**
- "Falcon provides a complete template authoring experience" (UI not built)
- "We support Facebook Messenger" (NO)
- "We support Instagram" (NO)
- "We have built-in marketing campaign management" (NO campaign entity)
- "Falcon tracks opt-in for all channels" (Meta does it for WA; we don't for others)
- "We have a real-time Meta state monitoring" (webhook NOT built)

### 6.5 The 5-question gut check before any campaign / WhatsApp pitch

1. **Does the client need a campaign entity / scheduling / management?**
   - YES → tell them Falcon's roadmap (not today)
   - NO → proceed

2. **Does the client need template authoring in Falcon's UI?**
   - YES → tell them GAP-T-001 (not today; works directly in Meta Business Manager)
   - NO → proceed

3. **Does the client need Facebook / Instagram / Messenger?**
   - YES → tell them we don't support these (Meta = WhatsApp only for us)
   - NO → proceed

4. **Does the client need real-time Meta state monitoring?**
   - YES → tell them this is Phase 2
   - NO → proceed

5. **Does the client have their own Application + already-approved Meta templates?**
   - YES → Falcon fits well (messaging infrastructure + billing)
   - NO → set expectations + scope appropriately

---

## File citations + cross-links

[BRAIN-OUT] prd/modules/05-templates/{BUSINESS_RULES,QUESTIONS,GAPS,ENTITIES,WORKFLOWS,OVERVIEW}.md
[BRAIN-OUT] understanding/pages/create-template-whatsapp/ (14 files)
[BRAIN-OUT] understanding/backend/templates/ENDPOINT_REGISTRY.md (3 endpoints only)
[BRAIN-OUT] understanding/backend/commerce/controllers/CommunicationChannelController/
[BRAIN-OUT] understanding/backend/commerce/controllers/ApplicationController/
[BRAIN-OUT] understanding/backend/provisioning/controllers/ServicesController/
[CODE] Falcon/falcon-web-platform-ui/apps/admin-console/.../client-applications-step.component.ts
[CODE] Falcon/falcon-web-platform-ui/apps/admin-console/.../client-comm-channels-step.component.ts
[REFERENCE-ONLY] Source_of_truth_theme/React/.../marketing.jsx + templates*.jsx + comm-mkt.jsx
[PRD] BR-TM-01..29 (templates), BR-CC-22..26 (contract pricing), BR-AM-20..25 (CommChannel + App config)

---

## Continuous mining queue update

Volumes 1-32 = 177 entries.

Remaining:
- Vol 33: THE CONCLUSION KNOWLEDGE — master synthesis of everything in 32 volumes

---

*Falcon Brain Forever-Wave · Vol 32 (Campaigns + WhatsApp + Facebook — Truthful Map) written 2026-05-18 · All claims source-prefixed or marked DIFFUSE/MISSING/NOT-IMPLEMENTED.*
