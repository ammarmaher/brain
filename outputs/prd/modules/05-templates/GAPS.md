*** PRD Understanding - Templates - PRD vs Code Gaps ***

# 05-templates - PRD vs Code Gaps

> Cross-references `Brain Outputs\understanding\backend\templates\ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md` + integration `GAP_LIST.md`. `latest-prd.md` is relative to this module.

## Coverage Matrix

| # | PRD Requirement | PRD Citation | Backend Code Location | Status |
|---|---|---|---|---|
| GAP-TM-01 | Create Template entry (per CommChannel branch) | latest-prd.md:65-86 (BR-TM-01..16) | **No template-entity CRUD endpoints in Templates service**. Only `CommunicationChannelConfig` endpoints exposed (3 endpoints). | MISSING |
| GAP-TM-02 | Templates service routed by Gateway | Q-TM-10 | Per integration GAP-008: Templates is NOT routed by either Core or System Gateway. Frontend cannot reach `/api/communication-channel-configs/*`. | MISSING (gateway routing) |
| GAP-TM-03 | Template Name format (a-z, 0-9, _) + unique-per-WhatsApp-Business-Account-per-language | latest-prd.md:69 (BR-TM-04, BR-TM-05) | No public template-create endpoint; validation cannot be checked. | MISSING |
| GAP-TM-04 | One template = one CommChannel; one language | latest-prd.md:70 (BR-TM-02, BR-TM-03) | Same as GAP-TM-01. Template entity not exposed. | MISSING |
| GAP-TM-05 | Variable type set once (Number / Name) | latest-prd.md:75 (BR-TM-06) | Same. | MISSING |
| GAP-TM-06 | Variable position / sequence / count rules | latest-prd.md:78 (BR-TM-07..10) | Same. | MISSING |
| GAP-TM-07 | Header Text (<=60, 1 var) vs Media (size limits) vs Location; Media disables Text | latest-prd.md:76 (BR-TM-11) | Same. | MISSING |
| GAP-TM-08 | Body required; Footer optional <=60 no variables | latest-prd.md:78, 82 (BR-TM-13, BR-TM-15) | Same. | MISSING |
| GAP-TM-09 | Buttons up to 10; QuickReply / Url / PhoneNumber / Copy | latest-prd.md:84 (BR-TM-16) | Same. | MISSING |
| GAP-TM-10 | Link to Contact Group (variable mapping) | latest-prd.md:78 (BR-TM-12) | Cross-cuts 04. No template-create endpoint to link from. | MISSING |
| GAP-TM-11 | Submit -> internal Checker -> (optional Meta) -> Approved/Rejected | latest-prd.md:41-43 (BR-TM-17..23) | Templates service has `GET /api/communication-channel-configs/user-checker-levels` returning `UserCheckerLevelDto[]` — supports the Checker assignment / level concept. But **submit/approve endpoints are missing**. | PARTIAL (checker metadata yes; flow no) |
| GAP-TM-12 | Auto-approval when no approval configured | latest-prd.md:42 (BR-TM-19) | Implementable via the `bodyType` / `levelsCount` config. Submit-side missing. | PARTIAL |
| GAP-TM-13 | WhatsApp categories + sub-categories | latest-prd.md:61-63 (BR-TM-24) | Same: no template-create endpoint. | MISSING |
| GAP-TM-14 | Meta state -> general status mapping | latest-prd.md:46-56 (BR-TM-26) | No Meta-webhook endpoint observed in Templates service. | MISSING |
| GAP-TM-15 | Quality tiers + Pause/Disable blocking at runtime | latest-prd.md:50-54 (BR-TM-27..29) | Same. Runtime block must live in the Send Transaction pipeline (Charging or Application service), not in Templates microservice. | MISSING |
| GAP-TM-16 | Preview (server-side or client-side?) | latest-prd.md:80 (BR-TM-14) | No `/preview` endpoint. Implementation TBD. | MISSING |
| GAP-TM-17 | Edit / versioning (in-place vs new revision) | latest-prd.md:112 (BR-TM-33) | Same. | MISSING |
| GAP-TM-18 | CommunicationChannelConfig read (per-tenant) | (config layer for templates) | Templates `GET /api/communication-channel-configs?TenantId=` (`List<CommunicationChannelConfigDto>`). | COVERED |
| GAP-TM-19 | User-Checker-Levels read | (config layer) | Templates `GET /api/communication-channel-configs/user-checker-levels?UserId=&TenantId=` (`List<UserCheckerLevelDto>`). | COVERED |
| GAP-TM-20 | CommunicationChannelConfig bulk update | (config layer) | Templates `PUT /api/communication-channel-configs/{id}` (`UpdateCommunicationChannelConfigsRequest { Configs[] }`). Tenant ID resolution: Falcon -> from route `{id}`; Client -> from JWT. **Fail-fast** semantics with committed items staying applied (no transactional rollback). | COVERED (with documented edge case) |
| GAP-TM-21 | Voice template creation | Q-TM-01 / BR-TM-30 | No PRD body; no code. | MISSING |
| GAP-TM-22 | AI template creation | Q-TM-08 | No PRD body; no code. | MISSING |
| GAP-TM-23 | Template deletion | Q-TM-06 / BR-TM-38 | No DELETE endpoint. | MISSING |
| GAP-TM-24 | Falcon usertype view scope for templates | BR-TM-39 / Q-TM-07 | No template-list endpoint visible. | UNVERIFIABLE |
| GAP-TM-25 | Bulk template operations | Q-TM-15 | Not in PRD; not in code. | (out of scope) |
| GAP-TM-26 | Template configuration inheritance from Main node to sub-nodes | BR-TM-40 / Q-TM-21 | Phase 2 feature; not yet visible. | MISSING (Phase 2) |
| GAP-TM-27 | "Confirmation / warning messages should not be hardcoded" platform-wide | Q-TM-22 | Cross-platform i18n consideration; cross-cuts everything. | (out of scope) |
| GAP-TM-28 | Audit trail of approval decisions | (implied by Maker/Checker governance) | No audit endpoint observed. | MISSING |

## Summary

- **Total rows:** 28.
- **COVERED:** 3 (the three Templates service config endpoints).
- **PARTIAL:** 2 (GAP-TM-11 Checker metadata, GAP-TM-12 auto-approval config support).
- **MISSING:** 21 (the entire template-entity surface).
- **UNVERIFIABLE:** 1.

## Critical findings

- **Architectural surprise:** The Templates microservice as built today is **only the CommunicationChannelConfig service**, not a template-entity service. The Template entity (with its body/header/footer/variables/buttons/approval flow) has **no public API**.
- **Gateway routing gap:** Even the existing 3 endpoints are NOT routed by Core or System Gateway (per integration GAP-008). Frontend cannot reach them.
- **Phase 2 implication:** Building Templates UI requires building Templates service endpoints **and** gateway routes. This is the largest gap in the platform PRD vs code mapping.

## Quick-win flags

- **GAP-TM-02** is the single most important action — add Templates routes to one of the gateways so the existing 3 endpoints can be called.
- **GAP-TM-01 and the cascade** depend on whether the Template entity is built inside this service or a separate one. Architecture decision needed before building UI.
- **GAP-TM-11, 14** Meta integration is significant work — likely 3-4 weeks for webhook + state machine.
- **GAP-TM-26** is officially Phase 2 (per root-documents backlog).

---

## Wave 2 refresh — 2026-05-17

> Refreshed by Wave 2 PRD Deep Read. Source PRD `Brain SK\skills\imported-business\prd-knowledge\modules\05-templates\latest-prd.md` (`Copy of Template Module`, 115 lines synced 2026-04-24). Backend cross-check: `Brain Outputs\understanding\backend\templates\{ENDPOINT_REGISTRY,DTO_DICTIONARY,VALIDATIONS,ERRORS,SERVICE_OVERVIEW,FRONTEND_CONTRACT}.md`. V-rule cross-check: `Brain SK\_obsidian\30-Validation\V-template-{checker-level-integrity,levels-count-required-for-restricted}.md`.

### Counts

- **Rules verified against PRD line + backend code:** 29 / 41 BR-TM-* rows (`BR-TM-01..29` confirmed; `BR-TM-30..41` are OPEN — not verifiable today).
- **Drift discovered:** 1 new drift (see below).
- **New resolutions added to QUESTIONS.md:** 1 (Q-TM-11 BodyType enum — now triangulated via V-rule + DTO dict honest-call note).
- **New pending-questions raised:** 0 (all OPEN items are PRD-level gaps, not autonomous-build forks; nothing to halt-flag tonight).

### Drift catalogue

**D-TM-1: Source PRD line count mismatch — "982 lines" claim vs 115 lines captured.**
- The OVERVIEW.md preamble + GAPS.md "Critical findings" call out that "Only the head ~250 lines of the 982-line PRD were captured in the sync." Wave 2 re-read the actual file: it is **115 lines total**, not 982. The 982 number refers to the **original Google Doc text-export length** (per the latest-prd.md header: `448 KB (982 lines text export) | Sync date 2026-04-24`).
- Implication: the 115 lines captured are not "head 250 of 982" — they are the **complete current sync** of a heavily-summarized Drive sync run. The 982-line Google Doc was condensed during sync (likely because the sync skill produced summary-style output rather than verbatim).
- Action item: the next Drive sync should be configured for verbatim extraction (not summary) so Voice template flow + AI template flow + advanced approval semantics enter the local copy. Until then, BR-TM-30..41 remain OPEN.
- Tag: provenance-discipline (this isn't a runtime drift — it's a knowledge-base accuracy fix).

### Verified BR-TM rules with cross-links

| BR | PRD line (latest-prd.md) | Backend evidence | V-rule | Status |
|---|---|---|---|---|
| BR-TM-01 | (per understanding.md:11 — original capture) | n/a (UI-only role gate) | — | CONFIRMED (no public API; Falcon gate is UI-side per PRD prose) |
| BR-TM-02..16 | :65-86 (wizard) | None yet (template entity surface MISSING — see GAP-TM-01) | — | PRD-confirmed; backend deferred |
| BR-TM-17..20 | :39-43 (statuses) | n/a | — | PRD-confirmed; runtime status field would live on a Template entity |
| BR-TM-21..23 | :35-36 (Maker/Checker) | Templates `GET /api/communication-channel-configs/user-checker-levels` exists (`UserCheckerLevelDto[]`) — **Checker assignment metadata is wired**; submit/approve flow is NOT. | [[V-template-checker-level-integrity]] triangulated 2026-05-15 | PARTIAL (config layer present; flow absent) |
| BR-TM-24..29 | :44-63 (WhatsApp categories + Meta states) | No Meta webhook endpoint; no template entity. | — | PRD-confirmed; backend Meta integration deferred |

### Backend-side rules NOT in PRD prose (handler-level validators)

These are server-enforced and surfaced by the V-rule + VALIDATIONS.md cross-check but never appeared in the PRD because the PRD never described CommChannelConfig validation:

- `CheckerLevelMustHaveAtLeastOneUser` (BR-TM-21..22 implied)
- `CheckerLevel1RequiredBeforeLevel2` (sequential level requirement — not in PRD)
- `CheckerLevelLimitExceeded` (bounded `LevelsCount` — bound value not in Brain Outputs; needs validator source read)
- `DuplicateCheckerLevelNumber`
- `UserAssignedToMultipleCheckerLevels`
- `InvalidCheckerLevelNumber`
- `LevelsCountMismatch` (declared count vs actual)
- `LevelsCountRequiredForRestricted` (BodyType=Restricted → LevelsCount mandatory — gate for V-template-levels-count-required-for-restricted)

These are **backend-only invariants** for the CommChannelConfig editor. They should be folded into a BR-TM-42..49 "Approval Configuration Integrity" cluster once the PRD body covers the editor UX (today the PRD only describes the template wizard, not the per-channel configuration that sets up which approval levels exist).

### Workflow ↔ Playbook mapping (re-verified)

| Workflow | Playbook location | Status |
|---|---|---|
| W1 Create WhatsApp Template (Maker) | `understanding/pages/create-template-whatsapp/PAGE_LEARNING.md` (STUB seeded 2026-05-15) | Stub only — full 14-file folder not yet created |
| W2 Internal Approval (Checker) | No playbook | MISSING (deferred; depends on Checker UI surface) |
| W3 Meta External Approval | No playbook | MISSING (deferred; depends on backend Meta integration) |
| W4 Auto-Approval | No playbook | MISSING |
| W5 Edit Template | No playbook | MISSING (depends on Q-TM-03 versioning semantics) |
| W6 Quality Drift | No playbook | MISSING |
| W7 Link Contact Group | No playbook (covered transitively by create-template-whatsapp page) | PARTIAL |
| W8 Preview / Sample | No playbook | MISSING (depends on Q-TM-07 client-vs-server-side) |
| W9 Voice Template | No PRD body, no playbook | MISSING |
| W10 AI Template | No PRD body, no playbook | MISSING |

**New gap surfaced:** All 10 workflows lack folder-form playbooks; the Templates module has the lowest playbook coverage of any module (0 / 10 vs Organization Hierarchy's 4 / 4).

### Resolutions added to QUESTIONS.md

- **Q-TM-11 (CommChannelConfig.bodyType enum values) — partial resolution from V-rule + DTO honest-call note.** The DTO dictionary records "likely an enum: Plain, Template, Interactive, … (verify)". The error code `LevelsCountRequiredForRestricted` strongly implies a `Restricted` member. Inferred candidate set: `Plain | Template | Interactive | Restricted`. CONFIRM by reading `Falcon.Templates.Domain/Constants` (`BodyType` enum source). See QUESTIONS.md Resolutions.

### Halt-and-flag tonight

None. All open items are PRD-content gaps (need product team to extend the PRD body); they are not autonomous-build forks. The DECISION-PROTOCOL `F-009` rule applies: proceed against captured content + mark conditional on later PRD revisions.

### Entity reconciliation

| Entity | PRD ENTITIES.md | Backend DTO | Drift? |
|---|---|---|---|
| Template | Defined in ENTITIES.md (with header/body/footer/buttons/variables) | **No Template DTO in templates service** — entity surface is not yet built. | Drift = GAP, not contradiction. Aligned for Phase 2. |
| CommChannelConfig | Inferred in ENTITIES.md (id, tenantId, commChannelId, bodyType, levelsCount, checkerLevels[]) | `CommunicationChannelConfigDto` (DTO_DICTIONARY:26) — shape matches exactly | No drift |
| CheckerLevel | `levelNumber, users[]` | `CheckerLevel { int LevelNumber, List<CheckerUser> Users }` — shape matches | No drift |
| CheckerUser | `userId, ...` | `CheckerUser { string UserId, ... }` — shape matches | No drift |

### Action items raised

1. **Re-sync Drive PRD verbatim** to capture lines 250..982 (Voice flow + advanced approval). Tag: `dependency-on-Wave-1-PRD-sync`.
2. **Promote handler-level CommChannelConfig validators** to BR-TM-42..49 in BUSINESS_RULES.md once PRD body covers the editor (or document them as "backend-only invariants" if they remain UX-only).
3. **Build folder-form playbook for W1 Create WhatsApp Template** when the gateway route lands (GAP-TM-02 is the prerequisite). Today's stub at `understanding/pages/create-template-whatsapp/` is the kickoff.
4. **Confirm BodyType enum literal values** (Q-TM-11) by reading `Falcon.Templates.Domain/Constants`. One small step but high-value: unblocks future BodyType dropdown UX.
