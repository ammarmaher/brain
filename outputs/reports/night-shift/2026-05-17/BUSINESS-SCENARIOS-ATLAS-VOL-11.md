---
type: business-scenarios-atlas
volume: 11
title: "Falcon Business Scenarios Atlas — Volume 11: Multi-Language Templates + Arabic-First UX Reality"
purpose: "Saudi clients overwhelmingly need bilingual (Arabic + English) messaging. The PRD says one-language-per-template, but the business reality is one-message-in-two-languages. This volume traces every scenario where language matters."
volume-11-deep-dives: 4
---

# Falcon Business Scenarios Atlas — Volume 11

> [PRD] BR-TM-03 says: a template = one language. To support both Arabic and English, you need two templates. This volume walks through what that means in practice for Saudi clients.

---

## DEEP-DIVE 49 — The Bilingual Template Problem

### What Saudi clients actually need

A typical Saudi enterprise client needs to send messages in BOTH:
- Arabic (recipient's preferred language, RTL display)
- English (when recipient prefers English, or when Arabic isn't yet approved)

A single business "campaign" often means "send the message in the recipient's language."

### How Falcon currently handles this

Per [PRD] BR-TM-03 and BR-TM-04:
- One template = one language
- Template names are unique per WhatsApp Business Account **per language**
- So you can have `welcome_message` in English AND `welcome_message` in Arabic (same name, two language registrations)

### The implementation pattern

For each campaign-level message, the client needs:

**Pattern A — Two template registrations:**
1. Create `welcome_message` (English) → submit to Maker → Checker → Meta → Approved
2. Create `welcome_message` (Arabic) → submit to Maker → Checker → Meta → Approved
3. Application logic: when sending, check recipient's language preference, pick the right template

**Pattern B — One template per language per campaign:**
1. Some clients use different names: `welcome_en`, `welcome_ar`
2. Avoids the "same name, different language" UX confusion
3. Easier to understand in admin lists

### Why this matters

For a 10-language CPaaS pitch (e.g., expanding beyond Saudi to GCC or wider Middle East):
- Each message = N templates (one per language)
- N approval cycles
- N rejections if any single one fails Meta approval
- Different metaState per language (English might be Active, Arabic might be Paused)

### Open question (Q-TM-34) — what's the workflow for adding a new language?

Per [PRD] BR-TM-34 [OPEN]: "Language addition workflow (e.g. creating Arabic version of an English template)."

The PRD doesn't define:
- Whether a new language template inherits content from the source
- Whether the approval process is parallel or sequential
- Whether the platform shows "template families" (i.e., the same template in multiple languages grouped together)

### Recommendation: build template families

A "Template Family" is a logical group of (template_id, language) pairs sharing:
- Same `name` field
- Same `category` + `subCategory`
- Same `variableType`
- Different `body` content per language

UI implication: a family is shown as ONE row in the template list; expanding the row shows each language version + its metaState.

### Business implications

| Question | Answer |
|---|---|
| "Can a client send the same campaign in Arabic and English?" | Yes — by managing two templates AND coordinating application-side language detection. **Not yet a unified Falcon feature.** |
| "What if the Arabic version is paused by Meta but English is Active?" | The client can still send English. Arabic recipients get the English version OR no message (campaign-side decision). |
| "Why two separate approval cycles?" | Meta requires per-language approval (their policy). Falcon must respect this. |
| "Should we sell 'multi-language template families' as a feature?" | Yes — it's a real client need and a current pain point. **Add to Phase 2 templates roadmap.** |

---

## DEEP-DIVE 50 — RTL UX in Admin/Management Consoles

### What clients see in their UI

The frontend (admin-console + management-console + host-shell) supports:
- English (LTR)
- Arabic (RTL — read this carefully)

[BRAIN-OUT] from memory: i18n keys exist in `en.json` + `ar.json`. RTL switching is handled via `dir` attribute on the document.

### RTL gotchas that affect business

**1. Dates and times:**
- Saudi date format: usually Hijri AND Gregorian in business contexts
- Time: 12-hour AM/PM is standard in Saudi
- Currency: SAR symbol position (left vs right) depends on locale
- [INFERRED] Falcon currently uses ISO 8601 for transport and Saudi-locale format for display

**2. Tables and lists:**
- Pagination controls reverse direction in RTL
- Numerical columns (counts, balances) may need specific formatting
- Negative numbers convention differs

**3. Forms:**
- Required-field markers move from left of label to right
- Validation errors appear on the right of the input
- Multi-step wizards (Add Client, Add Contract, etc.) need step indicators to flow right-to-left

**4. Iconography:**
- Some icons (arrow-forward, back) MUST be mirrored in RTL
- Others (sun, moon, generic objects) must NOT be mirrored

**5. PII fields:**
- First Name + Last Name in Arabic: BR-UM-11 says "letters only" — what about diacritics? Arabic uses many Unicode codepoints beyond core letters. Verify regex.

### The Q-UM-11 letters-only constraint

[PRD] BR-UM-11: First/Last Name "letters only." If the regex is `[a-zA-Z]+`, this REJECTS Arabic names. Many Saudi clients enter names in Arabic.

Verify: does the validator accept Unicode letter categories (e.g., `\p{L}` in regex)?

### The Q-CGM-06 column name constraint

[PRD] BR-CGM-06: ContactGroup column names must be "English letters only." This is INTENTIONAL — column names are technical identifiers used as template variables (`{{user_name}}` style). They must be ASCII for compatibility.

But: the column VALUES (the actual data in rows) can be anything. So a column named `user_name` can contain Arabic values.

### Business implications

| Question | Answer |
|---|---|
| "Can users with Arabic names be created in Falcon?" | **Verify the validator** — if regex is ASCII-only, NO. If Unicode-aware, YES. Wave 5b should have flagged this if it was an issue. |
| "What about Saudi national ID numbers (10 digits)?" | Stored as string, not int. Format-agnostic. ✅ |
| "What about Hijri dates in audit logs?" | Falcon uses ISO 8601 (Gregorian) for transport. Display can render Hijri. Verify FE rendering supports it. |
| "Is RTL polish complete enough to demo to Arabic-first clients?" | Per noor-instructions skill + memory entries, RTL is handled. Recommend: do a full RTL UX review on demo path (Add Client → Login → Contact Groups → Send Transaction) before any Arabic-first demo. |

---

## DEEP-DIVE 51 — Template Meta-State Transitions (the day-to-day reality)

### What Meta does to your template after approval

Once a template is `Approved` (general status) per BR-TM-19, Meta may unilaterally change its quality state:

| Meta State | General Status | Usable? |
|---|---|---|
| In-Review | Pending | NO (waiting) |
| Rejected | Rejected | NO (must rework + resubmit) |
| Active - Quality pending | Approved | YES |
| Active - High Quality | Approved | YES |
| Active - Medium Quality | Approved | YES (at risk) |
| Active - Low Quality | Approved | YES (in danger) |
| Paused | Approved | **NO** (general status says Approved but Meta blocks send) |
| Disabled | Approved | **NO** (effectively dead) |

### Why a template gets "Low Quality" or "Paused"

- Recipients report the message as spam
- Click-through is unusually low
- Meta's automated quality detection flags content
- Manual Meta review (rare but happens)

### What the business team needs to monitor

For each active template:
- **Meta State** (changes frequently)
- **Effective send capability** (Meta might block)
- **Quality trend** (declining → likely Pause soon)

If a campaign-critical template gets Paused:
- All sends using it FAIL
- Client must switch to a different template OR rework the content
- Falcon should notify the AO immediately

### Falcon's current state on Meta state tracking

Per [BRAIN-OUT] prd/modules/05-templates/GAPS.md:
- GAP-TM-14 [MISSING]: "Meta state → general status mapping" backend handler — no Meta webhook endpoint observed in Templates service
- The platform CAN'T currently react to Meta state changes (no webhook integration)

### What needs to be built

1. **Meta webhook endpoint** in Templates service: receive state updates
2. **State machine handler**: map Meta state to internal status + usability flag
3. **Send Transaction guard**: before dispatching a WhatsApp message, check the template's CURRENT Meta state. Reject if Paused/Disabled/Rejected.
4. **AO notification**: when a template's Meta state worsens (especially → Paused), send an email/SMS to AO

### Business implications

| Question | Answer |
|---|---|
| "What's the SLA from Meta state change to Falcon honoring it?" | If Falcon doesn't have webhook integration, NEVER — the system thinks the template is fine until manually refreshed. **HIGH priority gap.** |
| "Can a Paused template cause failed campaigns?" | YES — the Send Transaction succeeds at Falcon's layer (because Falcon doesn't know about the Pause) but fails at Meta dispatch. Client sees no message delivered. **Real revenue + reputation risk.** |
| "How do we monitor template quality across all clients?" | Aggregate Meta state across all client templates. Dashboard: "X templates Paused this week, Y at Low Quality." Operational signal. |

---

## DEEP-DIVE 52 — The "Approved but Not Usable" Trap

### The trap

Per BR-TM-27, Paused or Disabled templates have:
- General Status = `Approved` (in Falcon's data model)
- Meta State = `Paused` or `Disabled`

A naive backend check `if (template.status == 'Approved') send()` will INCORRECTLY allow the send.

### How this manifests

Client UI shows template as "Approved." Client selects template. Click Send. Falcon processes. Falcon attempts dispatch. **Meta rejects.** Send fails silently OR appears as a delivery error.

### Why this happens

The dual-status model (general status + Meta state) was chosen to keep things flexible — Falcon's internal lifecycle is decoupled from Meta's. But it requires every send path to check BOTH.

### Where the check should live

| Layer | Should check status? | Should check Meta state? |
|---|---|---|
| FE (UI list) | YES — show "Approved" | YES — gray out Paused/Disabled rows |
| Application (campaign engine) | YES — only consider Approved | YES — skip Paused/Disabled |
| Falcon Send Transaction handler | YES | YES (defense-in-depth) |
| Meta dispatch layer | n/a | n/a (Meta enforces itself) |

### The current state

Per [BRAIN-OUT] Wave 8 + GAP-TM-15: "Runtime block must live in the Send Transaction pipeline (Charging or Application service), not in Templates microservice." So the runtime check IS supposed to be in the send path — but no concrete code is present yet (since Templates entity API doesn't exist).

### Business implications

| Question | Answer |
|---|---|
| "Can a Paused template be sent today?" | **Today: theoretical question** — the entire Template entity API doesn't exist (GAP-T-001). When it does, the dual-status check is mandatory. |
| "How do we explain this to a client?" | "Your template status is determined by both Falcon's approval and Meta's quality monitoring. If either goes negative, the template won't send. We'll notify you immediately on any Meta state change." |
| "What's the worst-case data quality scenario?" | Inconsistency between Falcon's belief and Meta's reality. If Falcon thinks template is Approved (Active-High) but Meta has Paused it (and webhook was missed), Falcon will keep showing the template as Active. Reconciliation needed (periodic Meta-state sync, not just webhook). |

---

## Continuous mining queue update

Volumes 1-11 = 58 deep analyses (50 from earlier + 4 here).

Remaining queue:
- **Vol 12:** Knowledge graph navigation patterns (how the Falcon Brain stays useful as it grows)
- **Vol 13:** CPaaS competitor positioning (Twilio, Vonage, MessageBird, regional)
- **Vol 14:** Sales playbook addendum
- **Vol 15:** Engineering investment priorities

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 11 (multi-language templates) written 2026-05-18 · 58 deep-dives total.*
