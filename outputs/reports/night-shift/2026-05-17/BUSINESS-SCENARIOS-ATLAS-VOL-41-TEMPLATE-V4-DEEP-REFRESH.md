---
type: per-module-conclusion-refresh
volume: 41
module: 05-templates
title: "Vol 41 — Template Module V4 DEEP REFRESH (Major Updates to Vol 38)"
purpose: "Fresh BRD Template Module V4 (52K chars / 796 lines) is 4x larger than the previously-synced V2 (115 lines via Wave 2 provenance bug). This volume documents EVERY NEW THING that V4 revealed, corrects Vol 38 (Module 05 Conclusion) where wrong, and serves as the truthful new Template Module reference."
authority: "CANONICAL for Module 05 — supersedes Vol 38 where they conflict"
prd-source: "Template Module V4.docx + Template Management Module V2.docx (Drive 2026-05-19)"
correction-flag: "Vol 38 had several inaccuracies caused by the 'Copy of Template Module' partial sync. V4 is the truthful source."
---

# Vol 41 — Template Module V4 DEEP REFRESH

> Vol 38 was written from a 115-line partial PRD sync (provenance bug per Wave 2 finding). V4 has 796 lines with full Voice IVR + 5 statuses + multi-level checker workflow + button types deep-dive + Meta sync rules. This volume corrects every error and adds the new knowledge.

---

## §1 — THE V4 ONE-PARAGRAPH TRUTH (replaces Vol 38 §1)

> **Templates is a dual-CommChannel module (WhatsApp + Voice IVR) where every template is associated with one CommChannel + one language (WhatsApp only; Voice no language). Configuration (per-CommChannel-per-account, owned by the separate Template Management Module V2): two body types control the workflow — `Free Body` (no internal approval; auto-approved internally) and `Restricted Body` (requires 1- or 2-level Maker/Checker workflow). For Free Body WhatsApp templates, the template is submitted directly to Meta after auto-approval. For Restricted Body, 1-level: Maker → Checker Level 1 → (if approved AND WhatsApp) Meta. 2-level: Maker → Checker Level 1 → Checker Level 2 → (if all approved AND WhatsApp) Meta. Voice templates are FULLY MANAGED INSIDE FALCON (no Meta dependency). Templates have 5 FINAL STATUSES: Pending, Approved, Rejected, Restricted (Not Sendable), Deleted — NOT 3 as Vol 38 claimed. The "Restricted" status was previously documented as "Approved-but-not-usable" (BR-TM-27) — V4 makes it a DISTINCT status. WhatsApp template rejection (by Meta) means the template CANNOT be edited — Maker must create a brand-new template (NEW RULE). Editing approved templates is also NOT allowed inside Falcon (NEW RULE). Edit IS allowed for internally-rejected templates (rejected by Checker before reaching Meta). WhatsApp template buttons have 6 types with deep-dive specs: Quick Reply (max 25 chars, unique labels) · Visit Website (max 2, static or dynamic URLs) · Call on WhatsApp (max 1, 1-30 days active) · Call on Phone (max 1, country code + number) · Complete Flow (max 1, with Utility/Marketing sub-options) · Copy Offer Code (Marketing only, max 1, copies to clipboard). Authentication templates have fixed body "{{1}} is your verification code" with OTP-specific configuration (Copy Code now; One-tap + Zero-tap autofill future). Voice templates have 2 categories: Static IVR (fixed audio for all) + Dynamic IVR (with Digits/Number/Date variables). Voice IVR Flow Builder has a central tree canvas + right configuration panel; nodes have Voice Selection (from Voice Record Library), Timeout, Options-to-move (keypad navigation). Voice Record Library is a separate sub-menu under Voice CommChannel with Uploaded + Shared records (.mp3/.wav). Templates created directly in Meta portal AUTO-SYNC to Falcon via webhook — no internal approval needed. Three view tabs per role: Templates (own + sub-tree per role), Pending Review (Checkers only), Shared Templates (NU only). Template Name allows 1-215 characters (NOT a smaller cap as Vol 38 inferred). Body 1-1024 characters. Reference ID 2-50 characters optional. 24-hour conversation window: after recipient replies, business can send freely (templates OR free-form); window expires → new approved template required.**

---

## §2 — CRITICAL CORRECTIONS TO VOL 38

### Correction 1 — Statuses are 5 not 3

| Vol 38 said | V4 truth |
|---|---|
| 3 final statuses: Pending, Approved, Rejected | **5 final statuses: Pending, Approved, Rejected, Restricted (Not Sendable), Deleted** |
| BR-TM-17: "general template statuses: Pending / Approved / Rejected" | **Restricted is a DISTINCT status** (was previously called "Paused/Disabled mapping to Approved" — V4 promotes it to its own status) |
| "Paused / Disabled: general status stays Approved, but sending is BLOCKED" (BR-TM-27) | **Paused/Disabled in Meta = Restricted in Falcon** (a real status, not a flag on Approved) |

### Correction 2 — WhatsApp edit rule

| Vol 38 said | V4 truth |
|---|---|
| "When a template is `Paused` by Meta, does a queued Send Transaction get re-routed to another template, or fail?" (Q-TM-20 OPEN) | **V4 doesn't directly resolve queued-send behavior** but says Restricted status = NOT Sendable; runtime guard blocks |
| Edit semantics unclear (BR-TM-33 OPEN / Q-TM-03 OPEN) | **NEW RULE: Editing approved templates is NOT allowed inside Falcon — must create new template. Edit IS allowed ONLY for internally-rejected (before Meta) templates. WhatsApp Meta-rejected templates CANNOT be edited — must create brand-new** |

### Correction 3 — Maker eligibility

| Vol 38 said | V4 truth |
|---|---|
| Maker = Account Owner OR Node Admin OR Normal User (BR-TM-21) | **Confirmed — but ONLY users with Active status can create/edit; Suspended/Locked/Deleted/Pending users CANNOT create/edit but already-submitted templates continue in workflow** |

### Correction 4 — Voice template architecture

| Vol 38 said | V4 truth |
|---|---|
| Voice templates "covered later" (Q-TM-01 / BR-TM-30 OPEN) | **Voice is fully detailed in V4. Two categories: Static IVR (fixed audio, no variables) + Dynamic IVR (with Digits/Number/Date variables). IVR Flow Builder is a tree-based canvas. Voice Record Library is a separate sub-menu under Voice CommChannel.** |
| Voice status mapping unclear | **Voice has 4 statuses: Pending, Approved, Rejected, Deleted (no Meta dependency = no Restricted status for Voice)** |

### Correction 5 — Authentication template

| Vol 38 said | V4 truth |
|---|---|
| Authentication mentioned as a category (BR-TM-24) | **V4 details FIXED format: body = "{{1}} is your verification code". {{1}} = backend-generated OTP. OTP Delivery: Copy Code (now), One-tap autofill (future), Zero-tap autofill (future). Security: optional recommendation note + optional OTP expiry (30s-15min). Message validity: configurable 30s-15min** |

### Correction 6 — Template button types

| Vol 38 said | V4 truth |
|---|---|
| "Buttons (optional): up to 10 total; shape varies by category. Quick Reply custom labels supported" (BR-TM-16) | **V4 details 6 button types: Quick Reply (max 25 chars per label, unique), Visit Website (max 2, static or dynamic URLs), Call on WhatsApp (max 1, 1-30 days active), Call on Phone (max 1, country code + number), Complete Flow (max 1, with Utility/Marketing sub-options), Copy Offer Code (Marketing only, max 1)** |

### Correction 7 — Template name length

| Vol 38 said | V4 truth |
|---|---|
| Name "≤Nchars" (BR-TM-04 — N unclear) | **NEW: 1-215 characters allowed (much more permissive than previously assumed)** |

### Correction 8 — Body length

| Vol 38 said | V4 truth |
|---|---|
| Body variable count 20-30 (BR-TM-10) | **Confirmed for variables. NEW: Body itself is Min 1, Max 1024 characters** |

### Correction 9 — Reference ID rules

| Vol 38 said | V4 truth |
|---|---|
| Reference ID inferred (not in BR) | **NEW: Reference ID is OPTIONAL, Min 2, Max 50 chars, accepts letters/digits/GUID formats** |

### Correction 10 — Meta Sync auto-import

| Vol 38 didn't cover | V4 says: **Templates created directly in Meta portal AUTO-SYNC to Falcon via webhook + integration. No internal approval needed for Meta-created templates. Unsupported templates in Meta will NOT sync via webhook.** |

### Correction 11 — Tabs view structure (3 tabs)

| Vol 38 said | V4 truth |
|---|---|
| Templates tab + (no clear pending review structure) | **3 main tabs: Templates (per role view) · Pending Review (Checkers only) · Shared Templates (Normal Users only). Each with detailed column specs.** |

### Correction 12 — Action History

| Vol 38 didn't have this | V4 introduces: **"Action History (Internal)" — tracks Maker-Checker workflow steps BEFORE Meta. + "Action History by Meta (External)" — tracks external Meta status updates via webhooks. Both shown in Template Details page.** |

### Correction 13 — Checker concurrency

| Vol 38 didn't cover | V4 says: **"Two checkers review the same template at the same time: The first submitted decision (Approve/Reject) is accepted. The second action is ignored (no system impact)."** |

### Correction 14 — Checker assignment changes

| Vol 38 didn't cover | V4 says: **Replaced checker → template disappears from old queue, appears in new. Added checker → can see pending. Removed checker (others remain) → no impact. Only checker in level becomes inactive → workflow BLOCKED, AO must assign new checker.** |

---

## §3 — NEW BUSINESS RULES (BR-TM-42 to BR-TM-65)

V4 introduces business rules that were either implied or new compared to V2. Documenting them as additions:

### Configuration types
- **BR-TM-42** [NEW] — Configuration is per CommChannel per Account via Template Management Module. Two body types: Free Body (no approval) + Restricted Body (Maker/Checker workflow).
- **BR-TM-43** [NEW] — Restricted Body MUST have at least one Checker Level assigned. Each Level must have at least one assigned Checker.
- **BR-TM-44** [NEW] — Checker Levels can be 1-Level OR 2-Level per CommChannel config.

### Maker/Checker eligibility (revised)
- **BR-TM-45** [NEW] — Only Maker with Active status can create/edit own templates.
- **BR-TM-46** [NEW] — If Maker becomes Suspended/Locked/Deleted/Pending: cannot create/edit; submitted templates continue in workflow.
- **BR-TM-47** [NEW] — Maker can edit own internally-rejected templates and resubmit.
- **BR-TM-48** [NEW] — Only Checker with Active status can review.
- **BR-TM-49** [NEW] — Concurrent Checker review: first submitted decision wins; second ignored.
- **BR-TM-50** [NEW] — Multi-Level approval: approval at one level moves to next; rejection at any level returns to Maker; approval cycle resets after resubmission.

### WhatsApp approval workflow
- **BR-TM-51** [NEW] — Free Body WA: auto-approved internally, then submitted to Meta. Internal status = Auto-Approved; final status = Pending until Meta decides.
- **BR-TM-52** [NEW] — Restricted Body WA 1-Level: Maker → Checker L1 → (if approved) Meta. Final status follows Meta decision.
- **BR-TM-53** [NEW] — Restricted Body WA 2-Level: Maker → L1 → L2 → (if all approved) Meta. Final status follows Meta.
- **BR-TM-54** [NEW] — Meta rejection on WA = Falcon does NOT allow edit. Maker must create new template.
- **BR-TM-55** [NEW] — Internally-rejected WA templates can be edited ONLY before reaching Meta.

### Voice approval workflow
- **BR-TM-56** [NEW] — Voice is fully internal — no third-party approval.
- **BR-TM-57** [NEW] — Free Body Voice: auto-approved internally; final status = Approved.
- **BR-TM-58** [NEW] — Restricted Body Voice 1-Level: Maker → Checker L1 → Approved/Rejected.
- **BR-TM-59** [NEW] — Restricted Body Voice 2-Level: Maker → L1 → L2 → Approved/Rejected.

### Edit rules
- **BR-TM-60** [NEW] — Editing Approved templates is NOT allowed (Falcon-side rule).
- **BR-TM-61** [NEW] — Edit allowed only for internally-rejected templates (before reaching third-party).
- **BR-TM-62** [NEW] — Edit can modify any field except templateId.

### Restricted (Not Sendable) status
- **BR-TM-63** [NEW] — Restricted status = template exists but cannot be sent due to Meta Pause/Disable.
- **BR-TM-64** [NEW] — Restricted → Approved transition occurs ONLY when Meta changes state back to Active.

### Deletion rules
- **BR-TM-65** [NEW] — Delete action only available for the Maker who created the template AND only for Approved templates.
- **BR-TM-66** [NEW] — Deleted template removed from client side but still visible to Falcon usertypes.
- **BR-TM-67** [NEW] — Templates deleted from Meta portal sync to Falcon via webhook (status → Deleted, retained for Falcon view).

### Meta Sync
- **BR-TM-68** [NEW] — Templates created in Meta portal auto-sync to Falcon via integration + webhook.
- **BR-TM-69** [NEW] — No internal approval needed for Meta-created templates.
- **BR-TM-70** [NEW] — Unsupported templates in Meta will NOT sync to Falcon.

### View tabs
- **BR-TM-71** [NEW] — 3 tabs: Templates, Pending Review (Checkers only), Shared Templates (NU only).
- **BR-TM-72** [NEW] — "Created By" column empty when viewer is the creator (privacy/UX).

### 24-hour conversation window
- **BR-TM-73** [NEW] — WhatsApp business cannot initiate conversation without pre-approved template.
- **BR-TM-74** [NEW] — After recipient reply, 24-hour window opens during which business can send freely (templates OR free-form).
- **BR-TM-75** [NEW] — Window expires → new approved template required.

### Sharing
- **BR-TM-76** [NEW] — Template share = multi-select Normal Users in account (vertical + horizontal hierarchy).
- **BR-TM-77** [NEW] — Share available for: Maker, AO, NA. NU can share own approved.
- **BR-TM-78** [NEW] — Voice template share with NU only after approval (per Voice step 3).

### Action History
- **BR-TM-79** [NEW] — Internal Action History: tracks Maker submission + Checker L1/L2 decisions with rejection reasons.
- **BR-TM-80** [NEW] — Meta Action History: tracks external status updates from Meta via webhooks.

---

## §4 — V4 STATUS FSM (CORRECTED)

### WhatsApp Template Status FSM

```
                  Maker creates
                       │
              ┌────────┼────────┐
        Free Body          Restricted Body
              │                  │
        Auto-approved      Maker submits
        internally              │
              │              Checker L1
              │            ┌────┴────┐
              │         Reject    Approve
              │            │        │
              │       (Maker edit  Checker L2 (if 2-level)
              │       + resubmit)  ┌────┴────┐
              │                Reject    Approve
              │                   │         │
              ▼                   │         │
        Submit to Meta ◄──────────┘   Submit to Meta
              │                             │
        ┌─────┴─────┐                ┌─────┴─────┐
     Reject     Approve          Reject     Approve
        │           │                │           │
   ┌─────────────────────────────────────────────────────────────┐
   │ Falcon Final Status:                                         │
   │   Reject → Rejected (NO edit allowed; must create new)      │
   │   Approve (Meta Active *) → Approved                         │
   │   Meta Pause/Disable on Approved → Restricted (Not Sendable)│
   │   Meta state back to Active → Approved                      │
   │   Maker deletes Approved → Deleted (Falcon visibility only) │
   │   Meta deletes → Deleted (Falcon visibility only)           │
   └─────────────────────────────────────────────────────────────┘
```

### Voice Template Status FSM (simpler — no Meta)

```
              Maker creates
                  │
         ┌────────┼────────┐
    Free Body          Restricted Body
         │                 │
    Auto-approved     Maker submits
    internally             │
         │             Checker L1
         │           ┌────┴────┐
         │        Reject    Approve
         │           │         │
         │           │     Checker L2 (if 2-level)
         │           │       ┌────┴────┐
         │           │    Reject    Approve
         │           │       │         │
         ▼           ▼       ▼         ▼
      Approved   Rejected  Rejected  Approved

(Maker can delete Approved → Deleted; Falcon retention)
```

---

## §5 — VOICE TEMPLATE DEEP-DIVE (V4 NEW)

### Voice Categories
- **Static IVR** — fixed audio; same for all recipients; no variables
- **Dynamic IVR** — supports variables (Digits, Number, Date); personalized per recipient

### IVR Flow Builder (Step 2)

**Layout:**
- Central Canvas (tree-structured visual flow)
- Right Configuration Panel (node editor)

**Node attributes:**
- Node Name
- Content Summary (e.g., name of linked voice record)
- Audio Preview (play button)
- Timeout Indicator (silence duration before next action)
- Options-to-move (keypad numbers to navigate to this node — NOT available for Root Node)

**Static Node configuration:**
- Node Name (mandatory, letters+digits)
- Voice Selection (dropdown from Voice Record Library)
- Refresh icon · Upload button (new .mp3/.wav from local)
- Timeout Setting (numeric, seconds)
- Options-to-move (keypad numbers)

**Dynamic Node configuration:**
- Node Name (mandatory)
- Element Types:
  - **Voice Record Element** — fixed audio segment + timeout
  - **Variable Element** — placeholder for recipient data
- Variable Types: Digits · Number · Date
- Sample value preview (preview complete audio sequence with variables)
- Save Button (commits config)

### Voice Record Library (new sub-menu under Voice CommChannel)

**Accessed via:** CommChannels & Services menu → Voice channel → "Voice record library" sub-menu

**2 tabs:**

#### Uploaded Records Tab
- Record Name · Record Preview · Record Duration · Creation Date · Shared With · Actions (Delete · Share)
- Upload Record: enter Name + upload .mp3/.wav (max size configured by system)
- Share with users via multi-select dropdown

#### Shared Records Tab
- Records shared by other users within the same account
- Columns: Record Name · Preview · Duration · Creation Date · Created By · Shared With · Actions (Share — only AO + NA)

### Voice Template Statuses (4 only — no Restricted)
- Pending
- Approved
- Rejected
- Deleted

---

## §6 — WHATSAPP TEMPLATE BUTTON TYPES (V4 NEW — 6 types)

### Type 1: Quick Reply Buttons
- Custom labels
- Max 25 characters per button label
- Labels must be unique
- User response = label text
- Use case: simple Yes/No responses

### Type 2: Call-to-Action — Visit Website
- Max 2 buttons
- Supports static OR dynamic URLs
- Example: `https://example.com/order/{{2}}` (with variable)

### Type 3: Call-to-Action — Call on WhatsApp
- Max 1 button
- Active for 1-30 days
- Opens WhatsApp chat with business number

### Type 4: Call-to-Action — Call on Phone
- Max 1 button
- Country code + phone number

### Type 5: Complete Flow
- Max 1 button
- Includes: Button text (max 25 chars) + Button icon

**Utility Category sub-options:**
- **Get feedback** (supported now) — feedback form creation
- **Customer support** (Future)
- **Custom form** (Future)

**Marketing Category sub-options:**
- **Send survey** (supported now) — survey configuration
- **Register for event** (Future)
- **Complete sign-up** (Future)
- **Custom form** (Future)

Both can use "Use Existing" to pick from Meta-published flows.

### Type 6: Copy Offer Code (Marketing only)
- Max 1 button
- Fixed label: "Copy Offer Code"
- Requires a value
- Behavior: copies code to user's clipboard

---

## §7 — AUTHENTICATION TEMPLATE STRUCTURE (V4 NEW)

### Fixed format
- Body: `{{1}} is your verification code.`
- {{1}} = backend-generated OTP

### OTP Delivery Methods
- **Copy Code** (supported now)
- **One-tap autofill** (Future)
- **Zero-tap autofill** (Future)

### Content / Security Configuration
**Option 1: Add security recommendation**
- Add security note (e.g., "For your security, do not share this code")

**Option 2: Add expiration time for the code**
- Set OTP expiry from 30 seconds to 15 minutes

### Message Validity
- Set custom validity period: 30 seconds to 15 minutes

### Preview
- Live preview shows: body + security note (if added) + Copy code button

---

## §8 — TEMPLATE NAMING + SIZE LIMITS (CORRECTED V4)

| Field | Min | Max | Allowed chars | Notes |
|---|---|---|---|---|
| **Template Name (WhatsApp)** | 1 | **215** | a-z, 0-9, _ | Spaces auto-replaced with underscore; unique per language within WA Business Account |
| **Template Name (Voice)** | 2 | 50 | letters + digits + underscores | Mandatory + unique |
| **Reference ID** | 2 | 50 | letters, digits, GUID formats | Optional |
| **Header Text** | 1 | 60 | letters + digits + special chars | Supports up to 1 variable |
| **Body (WhatsApp)** | 1 | **1024** | digits + letters + special chars | 20-30 variables max |
| **Footer** | 1 | 60 | letters + digits + special chars | No variables |
| **Button label (Quick Reply)** | 1 | 25 | (any) | Must be unique within template |
| **Complete Flow button text** | 1 | 25 | (any) | + icon |

---

## §9 — META SYNC RULES (V4 NEW)

### Templates created in Meta portal auto-sync to Falcon

Per V4: "If the template is created on a meta portal it should be synced and added to our system. No need for internal approval (Falcon Maker/checker workflow) if the template is created on meta."

### Webhook integration

Falcon configures webhooks with Meta. Whenever a Meta-side change occurs (template approved · paused · disabled · deleted), it syncs to Falcon.

### Unsupported templates

If a template exists in Meta but is not yet supported by Falcon (e.g., new Meta features), it will NOT sync successfully via the webhook.

### Implication for Falcon's catalog

Falcon's template catalog = (Falcon-created) ∪ (Meta-portal-synced). Some templates may have no internal Maker/Checker history (Meta-only origin).

---

## §10 — 3-TAB VIEW STRUCTURE (V4 NEW)

Each user role sees different tabs:

### Tab 1: Templates
- **NU view:** Own templates only
- **NA/AO view:** Own + others on same node + sub-nodes
- **Falcon usertype view:** All templates per selected hierarchy node

**Columns:** Template ID · Name · Language · CommChannel · Service Type (Category) · Reference ID · Status · Checker L1 · Checker L2 · Creation Date · Shared With · Meta Status · Actions

**Actions (varies by user + template state):**
- "View more" — open details (Maker · AO · NA)
- "Edit" — only for internally-rejected; only Maker
- "Delete" — only for Maker + only Approved templates
- "Share" — share with NU in account (Maker · AO · NA)

### Tab 2: Pending Review
- **Visible to:** Client usertypes configured as Checkers (Level 1 or Level 2) for any CommChannel
- **Contents:** Templates that need their action
- **Empty when:** No templates need review by this user
- Once Checker acts, template disappears from their view
- **Action:** "View More" → opens detail with Approve/Reject options + rejection reason text box

### Tab 3: Shared Templates
- **Visible to:** Normal Users only
- **Contents:** Templates created by others and shared with this NU
- **Action:** "View More" only (no edit/delete)

---

## §11 — TEMPLATE MANAGEMENT MODULE (V2 — companion to Template Module V4)

Per `Template Management Module V2.docx` (90 lines):

Template Management is a separate Falcon-side configuration module that defines:
- Per-CommChannel-per-account configuration
- Body type (Free / Restricted)
- Levels count (0, 1, or 2)
- Checker assignments per level

This is the ADMIN-FACING configuration that drives the workflow rules in Template Module.

**Implementation status:** ✅ The Templates microservice (CommunicationChannelConfig endpoints) IS this Template Management module. The previously-deep-mined `understanding/backend/templates/` covers this. The Template Module itself (Template entity API) is still GAP-T-001.

---

## §12 — UPDATED IMPLEMENTATION STATUS

### What's IMPLEMENTED (verified — corrected)

✅ **Template Management Module backend** = the existing CommChannelConfig endpoints (3 endpoints) — for body type + levels + checker assignment
✅ **Maker/Checker config metadata** — supported
✅ **Per-CommChannel-per-account configuration** — backed by tenantId + commChannelId composite key
✅ **All V-rules + 8 backend errors** for CommChannelConfig validators (Wave 5b finding documented)

### What's NOT IMPLEMENTED (corrected + revised)

🔴 **Template entity API** still does NOT EXIST (GAP-T-001) — Maker/Checker workflow has no entity to operate on
🔴 **Templates service NOT gateway-routed** (GAP-008 / Q-TM-10)
🔴 **Meta webhook for state changes** NOT BUILT (GAP-TM-14)
🔴 **5-status FSM (Pending/Approved/Rejected/Restricted/Deleted)** not yet enforceable in code
🔴 **Voice IVR Flow Builder UI** — not built
🔴 **Voice Record Library** — not built (sub-menu under Voice CommChannel doesn't exist)
🔴 **Meta Sync webhook** — not built; auto-import of Meta-created templates is documented but not implemented
🔴 **Action History (Internal + Meta external)** — not built
🔴 **3-tab view (Templates · Pending Review · Shared)** — not built in Angular
🔴 **Runtime guard for Restricted status** on Send Transaction — not built (now critical given Restricted is a distinct status, not just a flag)

### What V4 RESOLVES (formerly OPEN questions)

- **Q-TM-01 / BR-TM-30** — Voice template flow → **RESOLVED** (V4 details Voice)
- **Q-TM-02 / BR-TM-31** — Checker role assignment → **RESOLVED** (any client usertype configured as Checker via Template Management Module)
- **Q-TM-03 / BR-TM-33** — Edit semantics → **RESOLVED** (edit not allowed on Approved; allowed on internally-rejected only)
- **Q-TM-04** — Meta state surface → **RESOLVED** (webhook; documented in V4)
- **Q-TM-06 / BR-TM-38** — Template deletion → **RESOLVED** (Maker-only on Approved templates; soft-delete with Falcon visibility retention)
- **Q-TM-07 / BR-TM-39** — Falcon view scope → **RESOLVED** (Falcon sees all templates under selected node)
- **Q-TM-08** — AI template flow → **STILL OPEN** (V4 doesn't add AI specifics)
- **Q-TM-11** — bodyType enum → **PARTIALLY RESOLVED** by V4: confirmed Free Body + Restricted Body (2 values, not 4). Wave 2's inferred 4-value enum was wrong.
- **Q-TM-12** — Auto-approval config → **RESOLVED** (per-CommChannel configuration via Template Management Module)
- **Q-TM-15** — Bulk template upload → still NOT supported (still OPEN)
- **Q-TM-16** — Variable count exact → **PARTIALLY RESOLVED** (V4 says 20-30 limit; cap is per-variable-type)
- **Q-TM-17** — Quick Reply max chars → **RESOLVED** (25 chars)
- **Q-TM-19** — CG column deletion vs Template ref → **STILL OPEN**
- **Q-TM-20** — Paused template + queued Send → **STILL OPEN** (runtime behavior)
- **Q-TM-37** — Restricted as distinct status → **RESOLVED** (V4 makes it distinct, was previously a flag on Approved)

---

## §13 — CORRECTIONS TO VOL 33 (CONCLUSION KNOWLEDGE)

Vol 33 §4 "Hard Nots" had:
> ❌ Falcon does NOT have Template authoring UI (GAP-T-001)

**Still true** — but the design spec for the UI is now richer (5 statuses · IVR builder · 6 button types · etc.). The gap is the same; the spec to build against is V4.

Vol 33 §2 "20 canonical facts" item 16 said:
> "Falcon channels: WhatsApp (primary), Voice, AI."

**Still true** — but V4 confirms Voice is FULLY managed internally (no Meta dependency). AI flow still OPEN.

Vol 33 §2 item 17 said:
> "WhatsApp template lifecycle: Maker → Checker → Meta. Two-step approval gate."

**Revise to:** Maker → Checker L1 → (optional Checker L2) → Meta. Three-step possibility (Free Body bypasses Checker, goes straight to Meta).

Vol 33 §2 item 18 said:
> "Approved ≠ Usable. Meta state (Paused/Disabled) overrides general status."

**Revise to:** Meta Pause/Disable maps to a DISTINCT Falcon status called "Restricted (Not Sendable)" — it's not an "Approved-but-not-usable" flag. The status FSM has 5 distinct states.

---

## §14 — NEW INSTRUCTIONS

1. **Vol 38 is OBSOLETE in conflict** — use Vol 41 (this) as the truth for Module 05
2. **Statuses are 5, not 3** — Pending, Approved, Rejected, **Restricted**, Deleted
3. **WhatsApp Meta rejection = no edit** — must create new template
4. **Approved templates not editable** — must create new
5. **Voice has its own flow builder** — Static + Dynamic IVR; not yet implemented but spec is V4
6. **Voice Record Library is a separate sub-menu** under Voice CommChannel — not yet built
7. **Meta Sync is webhook-driven** — Falcon catalog = (Falcon-created) ∪ (Meta-synced)
8. **3 tab structure** for views: Templates · Pending Review · Shared
9. **Authentication template fixed format** — `{{1}} is your verification code` with OTP-specific options
10. **6 button types** with deep specs — don't simplify to "10 buttons"

---

## §15 — CROSS-LINKS

- [BRAIN-OUT] Source BRD: `C:\Falcon\PRD\BRDs\5- Templates\Template Module V4.docx`
- [BRAIN-OUT] Companion: `C:\Falcon\PRD\BRDs\5- Templates\Template Management Module V2.docx`
- [BRAIN-OUT] Extracted: `C:\Falcon\PRD\BRDs\_extracted\Template-Module-V4.txt`
- [BRAIN-OUT] Extracted: `C:\Falcon\PRD\BRDs\_extracted\Template-Management-Module-V2.txt`
- [Atlas] Vol 38 (Module 05 Templates Conclusion — superseded by this volume for V4 details)
- [Atlas] Vol 40 (Module 06 BSA — uses these templates for Send Transaction)
- [Atlas] Vol 11 (Multi-language Templates — partially superseded)
- [Atlas] Vol 32 (Campaigns/WhatsApp/Facebook — corrections needed for new status FSM)

---

*Vol 41 · Template Module V4 DEEP REFRESH · 2026-05-19 · Truth-grounded from fresh BRD · 14 corrections to Vol 38 + 29 new BR-TM-* rules + Voice IVR architecture documented.*
