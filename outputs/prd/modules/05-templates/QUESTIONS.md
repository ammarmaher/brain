*** PRD Understanding - Templates - QUESTIONS ***

# 05-templates - Open Questions

> Carried forward from `understanding.md:121-131` and `latest-prd.md:107-115` plus cross-reference findings.
> NOTE: This module had only ~250 of 982 PRD lines captured. Many gaps below are because the deep content was not extracted.

## Inherited from existing understanding.md

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-TM-01 | Full Voice template flow - is it similar to WhatsApp minus external approval? (BR-TM-30) | Voice CommChannel coverage. | `Copy of Template Module` lines >250; ask Jawad. |
| Q-TM-02 | Who plays the Checker role by default - Account Owner? Falcon Operation? Configurable? (BR-TM-31) | Determines whether Checker is per-account or per-channel. | latest-prd.md:110; CommChannelConfig.checkerLevels in Templates service. |
| Q-TM-03 | When a template is edited, does the old version keep running until the new one is approved? (BR-TM-33) | Versioning + zero-downtime template updates. | understanding.md:60, 118; ask Jawad. |
| Q-TM-04 | How is Meta's Pause / Disable signal surfaced to the UI - webhook, poll, both? | Implementation strategy + freshness. | latest-prd.md:53-54; ask Mahmood. |
| Q-TM-05 | Distinction between `Copy of Template Module`, `Template Module`, `Template Management Module` - which governs which aspect? (BR-TM-36) | Authoritative-source ambiguity. | latest-prd.md:115; ask Jawad to resolve in Drive. |
| Q-TM-06 | Does template deletion require Checker approval, or is it Maker-side action? (BR-TM-38) | Governance + audit. | understanding.md:129. |
| Q-TM-07 | Can Falcon usertype view templates across all clients? PRD says they cannot CREATE; can they view/approve? (BR-TM-39) | Scope of Falcon read access. | understanding.md:130; ask Jawad. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-TM-08 | AI template creation flow - PRD says AI has no priority and destination = Global, but flow / wizard steps for AI templates are not captured. | AI CommChannel coverage. | latest-prd.md:32; ask Jawad. |
| Q-TM-09 | The Templates microservice currently exposes only `/api/communication-channel-configs/*` (3 endpoints). Where do the template-entity CRUD endpoints live? Is the Template entity stored elsewhere (Mongo direct, or a different service)? | Architectural surprise. | Templates ENDPOINT_REGISTRY (3 endpoints only). |
| Q-TM-10 | The Templates service is NOT routed by either gateway (per integration GAP-008). Frontend cannot reach it currently. | Cannot ship template UI until gateway routing fixed. | `Brain Outputs\understanding\integration\GAP_LIST.md`. |
| Q-TM-11 | `CommChannelConfig.bodyType` (Templates service DTO) - what are the valid values (Plain / Template / Interactive / ...?)? Enum is not documented. | Validator clarity. | Templates DTO_DICTIONARY. |
| Q-TM-12 | Maker / Checker - is one user allowed to be both for the same template (self-approval prevention)? | Compliance / SOX. | PRD silent; ask Jawad. |
| Q-TM-13 | What's the Checker assignment - does a template auto-route to a specific Checker by category? By language? Round-robin? | Approval queue design. | PRD silent; `CheckerLevels[]` data shape hints multi-level but doesn't say routing. |
| Q-TM-14 | Are Marketing-category templates blocked outside business hours or by other policies? | Marketing compliance per Meta. | PRD silent; check Meta policy doc. |
| Q-TM-15 | Bulk template upload / template library import - supported? | Convenience for large accounts. | PRD silent. |
| Q-TM-16 | Variable count "20-30 limit" - is the precise cap 20 OR 30 OR somewhere between? PRD wording is ambiguous (BR-TM-10). | Validation rule. | latest-prd.md:78; ask Jawad. |
| Q-TM-17 | Quick Reply buttons "custom labels supported" - what's the character limit on the label? | Validation rule. | PRD silent. |
| Q-TM-18 | Template configuration inheritance from Main node to sub-nodes with override (root-documents backlog item Q-AM-20 / BR-TM-40) - when is this scheduled? | Cross-cuts 01 + 05. | root-documents/latest-prd.md:28. |
| Q-TM-19 | When a Contact Group is deleted but a Template references its columns - what happens? | Cross-cuts 04 + 05. | PRD silent. |
| Q-TM-20 | When a template is `Paused` by Meta, does a queued Send Transaction get re-routed to another template, or fail? | Runtime resilience. | PRD silent; cross-cuts 03 + 05. |

## Cross-cutting backlog items (from root-documents/latest-prd.md) touching Templates

| # | Topic | Action |
|---|---|---|
| Q-TM-21 | "Template configuration is currently per commchannel in template management for the account; later maybe per Main node inherited to sub-nodes." (root-documents/latest-prd.md:28) | Phase 2 feature; defer. |
| Q-TM-22 | "Confirmation / warning messages should not be hardcoded - store in DB, editable without release." (root-documents/latest-prd.md:24) | Affects template variables for system messages; cross-platform i18n. |

## Banned synonyms / glossary discipline

- The PRD uses **Template**; flag any alias "Message Template" / "Form Template" / "Layout".
- The PRD uses **Maker** and **Checker** for governance; do NOT alias "Author"/"Reviewer" or "Editor"/"Approver".
- The PRD uses **CommChannel** consistently.
- The PRD uses **Meta** for the WhatsApp provider; do NOT alias "Facebook" / "WABA-API".
- The PRD uses **Sub-category** with a hyphen for WhatsApp categorization.
- The PRD uses **Variable**; do NOT alias as "placeholder" / "merge field" / "token" in user-facing copy.
- The PRD uses **Quick Reply** for the button kind; flag "Quick Action".
- The PRD uses **Paused** and **Disabled** for Meta states; do NOT alias.

---

## Resolutions (Wave 2 — 2026-05-17)

> Resolutions from cross-reading the PRD + backend dossiers + V-rules. Each resolution cites sources. Resolved questions remain in the table above with `[RESOLVED]` tag.

### Q-TM-11 — `CommChannelConfig.bodyType` valid values [PARTIAL RESOLUTION]

**Inferred enum set (NOT confirmed; requires Domain code read):** `Plain | Template | Interactive | Restricted`.

**Reasoning:**
- [BRAIN-OUT] `backend/templates/DTO_DICTIONARY.md:42` records "BodyType — likely an enum: `Plain`, `Template`, `Interactive`, … (verify)".
- [VAULT] `_obsidian/30-Validation/V-template-levels-count-required-for-restricted.md:33` documents error code `LevelsCountRequiredForRestricted` (HTTP 400) — proves `Restricted` is a member name.
- [BRAIN-OUT] `backend/templates/ERRORS.md:23` confirms the error code in the FalconKeys catalog.
- [BRAIN-OUT] `backend/templates/VALIDATIONS.md:23` calls out "conditional rules on `BodyType` driving `LevelsCount` and `CheckerLevels`" — the conditional gate exists.

**Confidence:** Medium. The four names are inferred from text references, not from reading the enum source. **Action:** read `Falcon.Templates.Domain/Constants/{eBodyType.cs OR BodyType.cs}` to confirm exact spelling + ordinals. Until done, treat `Restricted` as confirmed and the other three as candidates.

**Cross-reference:** V-rule [[V-template-levels-count-required-for-restricted]] uses `BodyType === 'Restricted'` as the trigger for `LevelsCount` requirement + `CheckerLevels` enablement. Frontend implementation can scaffold against `Restricted` literal without confirming the rest of the enum.

### Q-TM-13 — Checker auto-routing semantics [DESIGN-LEVEL RESOLUTION]

**Resolved by data shape inference, not PRD prose.**

**Resolution:**
- [BRAIN-OUT] `backend/templates/DTO_DICTIONARY.md:18` shows `CheckerLevel { int LevelNumber, List<CheckerUser> Users }` — a level is a **pool of eligible users**, not a single named approver.
- [VAULT] `_obsidian/30-Validation/V-template-checker-level-integrity.md:40-44` enumerates the structural rules: levels are sequential (`CheckerLevel1RequiredBeforeLevel2`), no duplicates, no user across multiple levels, each level has ≥1 user.
- **Inferred routing semantics:** Submit dispatches to Level 1 → any Level-1 user can approve → on approval, dispatches to Level 2 (if `LevelsCount ≥ 2`) → any Level-2 user can approve → ... → on the last level's approval, transitions to Meta (if WhatsApp) or final Approved.
- The PRD does not explicitly state "round-robin" vs "first-claim-wins" vs "all-must-approve" at a level. **Treating it as first-claim-wins is the conservative default** per DECISION-PROTOCOL F-022 (cosmetic-tier fork → conservative default).

**Confidence:** Medium-low — this is a data-shape inference, not a confirmed product spec. Schedule a follow-up with Jawad to confirm before building the Checker UI.

### Q-TM-09 — Where do template-entity CRUD endpoints live? [ARCHITECTURE FINDING]

**Resolved: they don't exist yet anywhere.**

**Resolution:**
- [BRAIN-OUT] `backend/templates/ENDPOINT_REGISTRY.md:20` confirms "3 (+ 1 health) — the smallest service in the platform". The Templates service ONLY exposes `CommunicationChannelConfigEndpointGroup`.
- [BRAIN-OUT] `backend/templates/SERVICE_OVERVIEW.md:11` describes the service as "**consumer-heavy**: it materializes state from Commerce + Identity events and exposes a small read+update surface to the frontend". Specifically: "Track per-tenant communication channel configurations" — NOT "Manage templates".
- [BRAIN-OUT] `backend/templates/SERVICE_OVERVIEW.md:70` states: "The service is fundamentally a **read-model / projection** of Commerce + Identity state — adding an update endpoint only for the rare case where the tenant configures checker levels independently of upstream events."

**Conclusion:** The "Templates Service" is misnamed for the current scope — it is a **CommChannelConfig service**. The Template entity (body / header / footer / variables / buttons / status / Meta state) has **no production code anywhere in the platform today**. Phase 2 needs an architectural decision: extend `falcon-core-templates-svc` to own the Template entity, OR build a new `falcon-core-template-content-svc` adjacent to it.

**Action for Phase 2 plan:** add an explicit "Architecture decision: where does the Template entity live?" item to the Phase 2 roadmap before any template-creation UI work begins.

### Q-TM-10 — Gateway routing for Templates service [CONFIRMED MISSING]

**Resolved (no surprise).**

**Resolution:**
- [BRAIN-OUT] `backend/templates/FRONTEND_CONTRACT.md:9` confirms: "**Not currently exposed through either gateway** ... The `Falcon.Core.Gateway` and `Falcon.System.Gateway` route maps in `appsettings.json` do not list a `templates-cluster`. Templates is reachable only directly at `localhost:7264`."
- [BRAIN-OUT] `integration/GAP_LIST.md` (per original GAP-TM-02) corroborates GAP-008.
- **This is the prerequisite blocker for any Templates frontend work.** Even the 3 existing endpoints cannot be called from `admin-console` or `host-shell` today.

**Action:** Add `templates-cluster` to `Falcon.System.Gateway/appsettings.json` route map first; only Falcon admin needs CommChannelConfig editor today (Q-TM-02 — Checker assignment per the Maker/Checker governance). Client portal CommChannelConfig view-only can wait. (This is a `Phase 2.0` quick-win — 1 file edit + redeploy.)

### Q-TM-12 — Maker / Checker self-approval prevention [DESIGN-LEVEL RESOLUTION]

**Resolved (by exclusion).**

**Resolution:**
- [VAULT] `_obsidian/30-Validation/V-template-checker-level-integrity.md:42` enforces `UserAssignedToMultipleCheckerLevels` (400) — one user cannot appear at more than one level.
- The PRD never explicitly says "Maker cannot also be Checker for their own template". But the data shape allows it: a Maker user might be assigned to Level 1 (or 2, or N) as a Checker.
- **Conservative default per F-022:** UI should hide the "Approve" action when `viewerUserId === templateCreatorUserId`. PES policy gate should add a deny: `templates.approve.deny when subject == template.creator`.

**Confidence:** Low — this is an inferred standard, not a documented Falcon rule. Should be confirmed with the compliance owner before production deployment.

**Action:** Add Q-TM-12 to the human-asks queue for next product review. Cross-reference SOX / dual-control requirements if applicable.

### Q-TM-22 — DB-editable warning messages [SCOPE DEFERRED]

**Resolved: out of scope for the Templates module.**

**Resolution:**
- This is a cross-platform i18n concern (Q-RD-06). Today every service uses `.resx`-bound resource files (`ErrorMessages.{en,ar}.resx`); DB-editable system messages would require a brand-new infrastructure component (admin UI + lookup table + cache invalidation across all services).
- The Templates module is not the right owner. Tagged to platform-architecture for prioritization.

**Action:** Track in root-documents/QUESTIONS.md only. Don't carry as a Templates-specific item.

### Items NOT resolved (still pending Drive re-sync or product input)

- Q-TM-01 (Voice flow), Q-TM-02 (default Checker role), Q-TM-03 (versioning semantics), Q-TM-04 (Meta pause/disable surfacing), Q-TM-05 (Drive doc disambiguation), Q-TM-06 (deletion governance), Q-TM-07 (Falcon read scope), Q-TM-08 (AI template flow), Q-TM-14 (Marketing-hours policy), Q-TM-15 (bulk operations), Q-TM-16 (variable cap 20 OR 30), Q-TM-17 (Quick Reply label limit), Q-TM-18..21 (cross-cuts), Q-TM-19 (Contact Group deletion propagation), Q-TM-20 (Paused template runtime fallback) — all require product team confirmation or a Drive re-sync.
