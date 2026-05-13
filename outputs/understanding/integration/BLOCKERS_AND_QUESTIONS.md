*** BLOCKERS_AND_QUESTIONS — items Ammar must answer before deepening the Brain pass ***

> Each question carries a default assumption used until the answer comes back, so Phase 3 can keep moving.

## Q1 — Where is the PRD folder for this iteration?

**Why it matters:** absent at `C:\Falcon\PRD`; bootstrap recorded as `WARN`. Without the PRD, the Business pipeline (`brain-prd` / `brain-gaps` / `brain-tests`) cannot produce module-level test coverage.

**Default assumption:** PRDs live in the Google Drive linked from memory entry `project_brain_always_grow_pipeline.md` and are not synced to disk in this checkout. Phase 3 proceeds without PRD until Ammar specifies the location or syncs them.

---

## Q2 — Where is the architecture wiki vault?

**Why it matters:** absent at `C:\Falcon\falcon-wiki`. Phase 1 wrote a code-extracted fallback in `wiki/ARCHITECTURE_RULES.md` with 12 `UNVERIFIED — wiki needed` items. Sunday auto-sync from `t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki` has not run this week.

**Default assumption:** Sunday sync is stale; the canonical Wiki is in Azure DevOps. Phase 3 proceeds with the code-extracted fallback. Any Wiki rule that conflicts with the fallback wins once the Wiki is restored — open `ARCHITECTURE_CONFLICTS.md` entries for the deltas.

---

## Q3 — Is `polishing-v0.4` a long-lived release branch or a short-lived feature branch?

**Why it matters:** every backend repo is on `main`; `falcon-web-platform-ui` is on `polishing-v0.4`. Project memory shows extensive v3.1/v3.2 night-shift work has landed here that is **not** in `main`. Trunk-based-development rule from CLAUDE.md says "short-lived branches".

**Default assumption:** long-lived — wave program is still active and the branch holds work-in-progress. Phase 3 treats `polishing-v0.4` as the active working branch; once Ammar confirms, the Wiki entry under "Development & Deployment Strategy" records the exception.

---

## Q4 — Should the `_changeApplicationPriceTypeHandler` "NRE" finding from Phase 1 be retracted?

**Why it matters:** Phase 1 (`backend/commerce/controllers/NodeController/OVERVIEW.md:77`) claims the constructor never assigns `_changeApplicationPriceTypeHandler`. Verified against the actual file at `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/NodeController.cs:87` — the assignment **is present**. The real defect is a method-name overload at lines 194/212 (both methods named `ChangeCommunicationChannelPriceType`), which is a Swagger / OpenAPI risk, not an NRE.

**Default assumption:** Phase 1 evidence is wrong here. Phase 2 downgraded the HIGH finding to MED (GAP-007). Ammar confirms once.

---

## Q5 — Is Templates intentionally not exposed through the gateways, or is the route map stale?

**Why it matters:** Templates (port 7264) is the only active service with no entry in either gateway's YARP route table. Its 3 endpoints can only be reached directly. Either Templates is east-west-only (consumer-only via Kafka) or the gateway config is stale.

**Default assumption:** east-west-only — Templates consumes 4 Kafka topics and produces none of its own front-end-facing data right now. Phase 3 treats Templates as internal until otherwise stated.

---

## Q6 — Is the gRPC rule in CLAUDE.md aspirational or actual?

**Why it matters:** CLAUDE.md says "use gRPC/Kafka directly" for east-west. Zero `.proto` files exist; every east-west sync call is HTTP via `HttpClientFactory`. Phase 1 flagged this as `UNVERIFIED — wiki needed`.

**Default assumption:** the rule is stale — HTTP for sync is the current intent. Phase 3 documents east-west HTTP as the active pattern; a roadmap to gRPC is captured as ACT-013 but not started.

---

## Q7 — Should `MultiLanguageName(En, Ar)` be applied to Identity / Templates / Contact Group, or do those services genuinely have no user-facing bilingual fields?

**Why it matters:** present in Commerce/Charging/Provisioning Domain. Absent from Identity/Templates/ContactGroup. CLAUDE.md says "for all user-facing text". A blanket sweep is overkill if those services truly have nothing bilingual.

**Default assumption:** Identity has nothing bilingual (username/email are inherently single-language); Templates has no public-facing names; ContactGroup needs investigation. Phase 3 does not migrate any service until Ammar confirms.

---

## Q8 — Should `MediatR + AutoMapper` services migrate to `Mediator + Mapperly` (source-gen), or is dual-track acceptable?

**Why it matters:** Commerce + Charging use reflection-based; Identity + Templates + ContactGroup use source-gen. Same code shape lives in two compiler worlds.

**Default assumption:** new services use source-gen; existing services migrate when next refactored. Phase 3 does not force migration but flags any new service that chooses reflection as a violation.

---

## Q9 — Should both gateways have rate limiters and IP allowlists, or is the asymmetry intentional?

**Why it matters:** Core Gateway has both; System Gateway has neither. The asymmetry is undocumented.

**Default assumption:** rate limiter belongs on both; IP allowlist belongs only on Core (Falcon admins are platform-wide and should not be IP-restricted). Phase 3 captures ACT-012 for the System Gateway rate-limiter addition.

---

## Q10 — Is the `adminConsoleGuard` deliberately commented out for the `polishing-v0.4` work?

**Why it matters:** `apps/admin-console/src/app/app.routes.ts:7` has the guard commented with a clear "Protect all routes under admin-console" comment. The guard exists at `libs/falcon` and is imported on line 2 — just not applied.

**Default assumption:** deliberately disabled during polishing work to avoid auth gate noise in the local dev loop. Must be restored before merging `polishing-v0.4` to `main`.

---

## Q11 — Are the deprecated repos (`deprecated-falcon-core-identity-svc`, `deprecated-falcon-web-platform-ui`) safe to remove from disk?

**Why it matters:** they still cause false-positive Grep hits across `C:\Falcon\Falcon`. Memory rule `feedback_discard_old_ui` already says to exclude them, but the rule is enforced by Claude's `exclude_paths`, not by `git rm`.

**Default assumption:** safe to remove. Phase 3 doesn't do it (out of scope) but recommends a single archive PR.

---

## Q12 — Is the `T2.PES.*` to `Falcon.Access.*` rename on roadmap? What about the `net6.0 → net10.0` upgrade?

**Why it matters:** the Access service is the only `.NET 6` outlier (four major versions behind every other service) and the only project tree using a pre-Falcon naming convention.

**Default assumption:** rename + upgrade is on the roadmap but not scheduled. Phase 3 captures it as ACT-017 (M-sized).
