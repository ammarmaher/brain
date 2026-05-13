*** PRD Understanding - Templates - GAPS ***

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
