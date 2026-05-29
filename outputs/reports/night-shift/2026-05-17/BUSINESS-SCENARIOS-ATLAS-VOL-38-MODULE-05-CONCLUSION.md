---
type: per-module-conclusion-knowledge
volume: 38
module: 05-templates
title: "Module 05 — Templates CONCLUSION KNOWLEDGE"
purpose: "Master answer key for everything related to templates. Specifically the truthful state: PRD only partially captured (115 lines local of 982 original); Template entity API NOT BUILT (GAP-T-001); Templates microservice is a CommChannelConfig editor only."
authority: "CANONICAL for Module 05 — supersedes earlier volumes on conflict"
prd-source: "Copy of Template Module (unknown version, Drive sync 2026-04-24) — 115 lines local of 982 original"
known-gap: "Templates microservice = CommChannelConfig editor only (3 endpoints, NOT gateway-routed). Template entity API does NOT EXIST today (GAP-T-001)."
---

# Module 05 — Templates CONCLUSION

> Master answer key for: templates, Maker/Checker, WhatsApp template categories, Meta states, Voice flow (deferred), AI flow (deferred). **Truthful: most of this module is PRD-design, NOT yet implemented.**

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **Templates is the most PRD-design-vs-actual-code-gap-rich module in Falcon. The PRD-05 captures Maker/Checker governance, WhatsApp template authoring (with category + sub-category + language + variable rules + button rules + Meta state mapping), and references Voice + AI template flows (which were NOT captured in the local 115-line sync). The "Templates microservice" exists in code but ONLY exposes 3 endpoints around CommunicationChannelConfig + CheckerLevels — there is NO Template entity API (GAP-T-001 + GAP-TM-09). The 3 endpoints are NOT routed by either gateway (GAP-008 / Q-TM-10) so the frontend cannot reach them today. The PRD's "75% missing" claim was a provenance bug (Wave 2 finding): the local file has 115 lines complete; the 982 number was the original Google Doc length before sync condensation. The REAL gap is Voice + AI flows + remaining WhatsApp content beyond what was synced. Maker/Checker config metadata IS supported (CommChannelConfig.bodyType + LevelsCount + CheckerLevels[]) — what's missing is the actual template entity (body, header, footer, variables, buttons) + submit/approve flow + Meta webhook (GAP-TM-14). General status enum: {Pending, Approved, Rejected} (BR-TM-17). WhatsApp Meta states layer on top: In-Review / Active-Quality-Pending / Active-{High,Medium,Low}-Quality / Paused / Disabled / Rejected (BR-TM-26). Approved general ≠ Usable: Meta state Paused/Disabled blocks send even when general=Approved (BR-TM-27). Falcon usertype CANNOT create templates (BR-TM-01) — client business content. Templates UI build = Phase 2 work; backend architecture decision needed before any UI work begins.**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities (per [BRAIN-OUT] `prd/modules/05-templates/ENTITIES.md`)

| Entity | Key fields | Lifecycle | Code state |
|---|---|---|---|
| **Template** | id, accountId, name (a-z/0-9/_; unique per WhatsApp Business Account + language), commChannelId, language, category, subCategory, variableType, referenceId, status, metaState, externalRefId, createdBy, createdAt, approvedBy, approvedAt | Draft → Pending → Approved/Rejected; WA Meta sub-states | ❌ **NOT BUILT** (GAP-T-001) |
| **TemplateHeader** | templateId, type (Text/Media/Location), textContent (≤60, 1 var), media, location | n/a | ❌ NOT BUILT |
| **TemplateBody** | templateId, content, variableCount (20-30) | n/a | ❌ NOT BUILT |
| **TemplateFooter** | templateId, content (≤60) | n/a | ❌ NOT BUILT |
| **TemplateButton** | templateId, index, kind, label, payload | n/a (max 10) | ❌ NOT BUILT |
| **TemplateVariable** | templateId, placeholder ({{1}} or {{name}}), contactGroupColumnName | n/a | ❌ NOT BUILT |
| **TemplateVersion** | templateId, revisionNumber, body, submittedAt, approvalTrail | n/a | ❌ NOT BUILT |
| **TemplateApprovalTrail** | templateId, revisionNumber, actorUserId, actorRole (Maker/Checker/MetaSystem), action, at, externalState | append-only | ❌ NOT BUILT |
| **CommChannelConfig** (Templates service) | id (tenantId + commChannelId), tenantId, commChannelId, bodyType, levelsCount, checkerLevels[] | n/a | ✅ Built (3 endpoints, NOT gateway-routed) |
| **CheckerLevel** | levelNumber, users[] | n/a | ✅ Built |
| **CheckerUser** | userId, ... | n/a | ✅ Built |

### Status enums

- **Template.status (general):** Pending, Approved, Rejected (BR-TM-17)
- **Template.metaState (WhatsApp):** In-Review, Rejected, Active-Quality-Pending, Active-High-Quality, Active-Medium-Quality, Active-Low-Quality, Paused, Disabled (BR-TM-26)
- **Template.variableType:** Number, Name (BR-TM-06)
- **TemplateHeader.type:** Text, Media, Location
- **TemplateButton.kind:** QuickReply, Url, PhoneNumber, Copy, ... (full enumeration deferred)
- **CommChannelConfig.bodyType:** Plain, Template, Interactive, Restricted (inferred from Wave 2 partial resolution of Q-TM-11)

---

## §3 — WORKFLOWS

10 workflows documented in PRD-05 (W1-W10):

| # | Workflow | PRD covered? | Code state |
|---|---|---|---|
| W1 | Create WhatsApp Template (Maker) | ✅ partial | ❌ NOT BUILT |
| W2 | Internal Approval (Checker) | ✅ partial | ❌ NOT BUILT |
| W3 | Meta External Approval | ✅ partial | ❌ NOT BUILT |
| W4 | Auto-Approval | 🟡 mentioned (Q-TM-12 OPEN) | ❌ NOT BUILT |
| W5 | Edit Template (versioning) | 🟡 silent (Q-TM-03 OPEN) | ❌ NOT BUILT |
| W6 | Quality Drift (Meta) | 🟡 mentioned (Q-TM-04 OPEN) | ❌ NOT BUILT |
| W7 | Link Contact Group (variable mapping) | ✅ | ❌ NOT BUILT |
| W8 | Preview / Sample | 🟡 client-side vs server-side OPEN | ❌ NOT BUILT |
| W9 | Voice Template | ❌ deferred PRD content | ❌ NOT BUILT |
| W10 | AI Template | ❌ deferred PRD content | ❌ NOT BUILT |

**All 10 workflows lack folder-form playbooks today.** Lowest playbook coverage of any module.

---

## §4 — BUSINESS RULES (41 total: 29 CONFIRMED + 12 OPEN)

### Identity & Ownership (BR-TM-01..05)
- **Falcon usertype CANNOT create templates** (BR-TM-01)
- One template = one CommChannel (BR-TM-02)
- One template = one language; bilingual = 2 templates (BR-TM-03)
- Name unique per WhatsApp Business Account per language (BR-TM-04)
- Name chars: a-z, 0-9, _; no spaces, no uppercase (BR-TM-05)

### Variable Rules (BR-TM-06..10)
- Variable type: Number (`{{1}}`) OR Name (`{{user_name}}`) — set ONCE (BR-TM-06)
- Variables CANNOT be at start or end of body (BR-TM-07)
- Numeric variables sequential from 1 (BR-TM-08)
- Name-type variables lowercase + underscores + digits, double curly braces (BR-TM-09)
- Body variable count limit: 20-30 (BR-TM-10) — exact cap UNCLEAR (Q-TM-16 OPEN)

### Header / Body / Footer / Buttons (BR-TM-11..16)
- Header optional: Text (≤60, 1 var) OR Media (size limits) OR Location; Media disables Text (BR-TM-11)
- Linking with Contact Group optional (BR-TM-12)
- Body required (BR-TM-13)
- Preview & Sample live (BR-TM-14)
- Footer optional ≤60 no variables (BR-TM-15)
- Buttons optional up to 10 (BR-TM-16)

### Statuses & Approval (BR-TM-17..20)
- Statuses: Pending / Approved / Rejected (BR-TM-17)
- Pending = submitted, awaiting Checker OR Meta (BR-TM-18)
- Approved = Checker-approved + Meta-approved if external; auto-approved if no approval configured (BR-TM-19)
- Rejected = internal OR external rejection (BR-TM-20)

### Maker / Checker Governance (BR-TM-21..23)
- Maker creates/edits/submits (BR-TM-21)
- Checker reviews + approves/rejects (BR-TM-22)
- WhatsApp approval = TWO-STEP gate: internal Checker → Meta (BR-TM-23)

### WhatsApp Categories & Meta States (BR-TM-24..29)
- Categories: Authentication (sub: One-time Passcode); Utility (sub: Default, Flows, Calling permissions request); Marketing (sub: Default, Catalog, Flows, Calling permissions request) (BR-TM-24)
- Marketing must comply with Meta policies; recipients must opt-in (BR-TM-25)
- Meta state → general status mapping (BR-TM-26)
- Paused / Disabled: general status stays Approved but sending BLOCKED at runtime (BR-TM-27)
- Meta approval typically ≤24h (BR-TM-28)
- Quality tiers reflect Meta feedback; Low Quality = "in danger" (BR-TM-29)

### OPEN (12)
- **BR-TM-30** [OPEN] — Voice template flow (not captured)
- **BR-TM-31** [OPEN] — Approval role assignment (who is Checker default?)
- **BR-TM-32** [OPEN] — Auto-approval config scope (per account/channel/category?)
- **BR-TM-33** [OPEN] — Edit semantics (new version vs in-place?)
- **BR-TM-34** [OPEN] — Language addition workflow
- **BR-TM-35** [OPEN] — Preview client-side vs server-side
- **BR-TM-36** [OPEN] — Disambiguation between Drive doc names
- **BR-TM-37** [OPEN] — Paused/Disabled → distinct general status?
- **BR-TM-38** [OPEN] — Template deletion governance
- **BR-TM-39** [OPEN] — Falcon view-scope across all clients?
- **BR-TM-40** [OPEN] — Per-Main-node template config inheritance (Phase 2)
- **BR-TM-41** [OPEN] — Service category for WhatsApp (BR-CC-23 tentative)

---

## §5 — PERMISSIONS MATRIX (Module 05 specific)

| Action | Falcon (SA/OP/PR) | AO Maker | AO Checker | NA Maker | NA Checker | NU |
|---|---|---|---|---|---|---|
| Create | ❌ (BR-TM-01) | ✅ | n/a | ✅ | n/a | ❌ |
| Edit (Draft) | ❌ | ✅ (own) | n/a | ✅ (own) | n/a | ❌ |
| Submit | ❌ | ✅ | n/a | ✅ | n/a | ❌ |
| Approve (Checker) | 🟡 (BR-TM-31 OPEN — Falcon may approve in some configs) | n/a | ✅ | n/a | ✅ | ❌ |
| Reject (Checker) | 🟡 | n/a | ✅ | n/a | ✅ | ❌ |
| Use in Send | n/a | n/a | n/a | n/a | n/a | ✅ (if Approved + Usable) |
| Delete | ❌ (or maybe?) | ✅ (own, BR-TM-38 OPEN) | ❌ | ✅ | ❌ | ❌ |
| Submit to Meta | system | n/a | n/a | n/a | n/a | n/a |

---

## §6 — WHAT'S IMPLEMENTED (verified)

✅ **Templates microservice** — exists with 3 endpoints:
  - `GET /api/communication-channel-configs`
  - `PUT /api/communication-channel-configs/{id}`
  - `GET /api/communication-channel-configs/user-checker-levels`
✅ **CommChannelConfig + CheckerLevel data model** — `bodyType + levelsCount + checkerLevels[]`
✅ **V-rule + ERROR codes** for CommChannelConfig validations:
  - `CheckerLevelMustHaveAtLeastOneUser`
  - `CheckerLevel1RequiredBeforeLevel2`
  - `CheckerLevelLimitExceeded`
  - `DuplicateCheckerLevelNumber`
  - `UserAssignedToMultipleCheckerLevels`
  - `InvalidCheckerLevelNumber`
  - `LevelsCountMismatch`
  - `LevelsCountRequiredForRestricted`
✅ **`bodyType` enum (inferred)**: Plain / Template / Interactive / Restricted
✅ **understanding/pages/create-template-whatsapp/** (Wave 4 — 14 files of design documentation)
✅ **understanding/pages/templates-list/** (Wave 4 — 14 files)
✅ **Maker/Checker config metadata supported** in CommChannelConfig

---

## §7 — WHAT'S NOT IMPLEMENTED / OPEN GAPS

🔴 **Template entity API DOES NOT EXIST** (GAP-T-001 / GAP-TM-01) — the entire template-entity surface is unbuilt
🔴 **Templates service NOT routed by either gateway** (GAP-008 / Q-TM-10) — even existing 3 endpoints unreachable from FE
🔴 **Meta webhook endpoint NOT BUILT** (GAP-TM-14) — cannot react to Meta state changes
🔴 **Runtime Send Transaction guard for Meta state NOT BUILT** (GAP-TM-15) — Paused/Disabled templates wouldn't be blocked
🔴 **No template-list endpoint** (GAP-TM-24) — Falcon view-scope unverifiable
🟡 **Voice template flow** (GAP-TM-21 / BR-TM-30) — no PRD body, no code
🟡 **AI template flow** (GAP-TM-22 / BR-TM-08 / Q-TM-08) — no PRD body, no code
🟡 **Template deletion semantics UNCLEAR** (GAP-TM-23 / BR-TM-38)
🟡 **Bulk template upload NOT supported** (Q-TM-15)
🟡 **Template versioning UNDEFINED** (BR-TM-33 / Q-TM-03)
🟡 **Auto-approval scope UNDEFINED** (BR-TM-32 / Q-TM-12)
🟡 **Preview client vs server-side UNDEFINED** (BR-TM-35 / Q-TM-07)
🟡 **Per-node template inheritance** (BR-TM-40 / Q-TM-21) — Phase 2 feature
🟡 **Cross-cut: ContactGroup column deletion vs Template variable reference** (Q-TM-19) — orphan handling
🟡 **Cross-cut: Paused template + queued Send Transaction** (Q-TM-20) — runtime resilience
🟡 **Marketing template business hours block** (Q-TM-14) — Meta policy compliance
🟡 **Audit trail of approval decisions** (GAP-TM-28) — endpoint missing
🟡 **Meta state monitoring across all clients** — dashboard MISSING (Vol 11 recommendation)

---

## §8 — CROSS-MODULE DEPENDENCIES

| Direction | Flow |
|---|---|
| **05 → 01** | Template configuration per account per commchannel (CommChannelConfig.tenantId) |
| **05 → 02** | Maker/Checker are User roles + permission groups |
| **05 → 03** | Templates referenced for Send Transaction; Contract Detail prices the WhatsApp categories |
| **05 → 04** | Template variables can link to ContactGroup column names |
| **05 → Meta** | WhatsApp Business API for external approval; webhook MISSING |
| **05 → Application** | Apps invoke templates to send transactions |

---

## §9 — TOP 10 BUSINESS QUESTIONS

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | Can Falcon admin create templates? | NO — Falcon usertype CANNOT create (BR-TM-01) | BR-TM-01 |
| 2 | Is the Template UI built? | NO — GAP-T-001; Template entity API doesn't exist | GAP-T-001 |
| 3 | What's the Maker/Checker flow? | Maker creates+submits → Checker reviews → (WhatsApp) → Meta approves | BR-TM-21..23 |
| 4 | What are the WhatsApp categories? | Authentication / Utility / Marketing (per BR-TM-24) | BR-TM-24 |
| 5 | Why "Approved" but not usable? | Meta's Paused/Disabled states override general Approved (BR-TM-27) | BR-TM-27 |
| 6 | Is Voice template supported? | NO — PRD body missing for Voice (Q-TM-01 / BR-TM-30) | BR-TM-30 |
| 7 | Is AI template supported? | NO — PRD body missing for AI (Q-TM-08) | Q-TM-08 |
| 8 | What's the variable rule? | Number `{{1}}` OR Name `{{user_name}}` set once; sequential; not at start/end; 20-30 limit | BR-TM-06..10 |
| 9 | Can we have bilingual templates? | NO single template = bilingual; need 2 separate templates per language | BR-TM-03 |
| 10 | Why isn't Templates UI built? | Backend Template entity API missing (GAP-T-001) + gateway routing gap (Q-TM-10) | GAP-TM-01 + Q-TM-10 |

---

## §10 — MODULE 05 NEW INSTRUCTIONS

1. **NEVER claim Falcon supports template authoring today** — GAP-T-001 is the truth
2. **Templates microservice = CommChannelConfig editor** — it's misnamed; not actually a "templates" service
3. **Gateway routing must be added FIRST** — even the existing 3 endpoints are unreachable from FE
4. **Meta webhook is Phase 2** — until built, Meta state changes are invisible to Falcon
5. **Runtime guard for Paused/Disabled** — every Send Transaction must check Meta state (NOT built today)
6. **Voice + AI flows = beyond local PRD sync** — need verbatim Drive resync
7. **Bilingual = 2 templates per language** — Meta requires this; Falcon must support it as a "Template Family" concept (Vol 11)
8. **Falcon-only approval edge case** — BR-TM-31 OPEN; resolve before building Checker UI
9. **Quality drift monitoring** — must be a dashboard once Meta webhook lands
10. **Templates UI = Phase 2 build** — 3-6 sprints minimum; architecture decision required before scoping

---

## §11 — CROSS-LINKS

- [BRAIN-OUT] `prd/modules/05-templates/`
- [BRAIN-OUT] `understanding/pages/{create-template-whatsapp,templates-list}/`
- [BRAIN-OUT] `understanding/backend/templates/`
- [VAULT] `_obsidian/30-Validation/V-template-{checker-level-integrity,levels-count-required-for-restricted}.md`
- [VAULT] `_obsidian/40-API/E-template.md`
- [Atlas] Vol 11 (Multi-language Templates) · Vol 28 Matrix 7 · Vol 30 Cascade 15 · Vol 32 (Truthful WhatsApp map)

---

*Vol 38 · Module 05 Templates CONCLUSION · 2026-05-18 · Truth-grounded · Source-prefixed · GAP-T-001 acknowledged as the central truth.*
