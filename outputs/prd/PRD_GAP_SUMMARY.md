*** PRD Understanding - Gap Summary (Rolled Up Across All Modules) ***

# PRD Gap Summary

> All `MISSING` and `PARTIAL` gaps from every module rolled up and sorted by severity.
>
> **Severity rules:**
> - **HIGH** — blocks a core user workflow (Add Client, Add User, Login, Send Transaction, Create Template, Create Contact Group, Wallet operations) OR is a compliance/audit/PII issue.
> - **MED** — blocks a peripheral workflow OR is a discoverability / UX nicety.
> - **LOW** — nice-to-have / future-phase.

## HIGH Severity

| # | Severity | Module | PRD Source | Code Location | Recommendation |
|---|---|---|---|---|---|
| H-01 | HIGH | 05 | latest-prd.md:65-86 (BR-TM-01..16) GAP-TM-01 | **No template-entity CRUD endpoints**; Templates service only exposes 3 config endpoints. | Decide architecture (entity in `falcon-templates-svc` vs new service); build entity CRUD + approval workflow. ~6-8 weeks of work. |
| H-02 | HIGH | 05 | Q-TM-10 GAP-TM-02 | **Templates service NOT routed by either gateway.** Even existing 3 endpoints unreachable from frontend. | Add routing to Core / System Gateway — half-day task; unblocks 100% of template UI work. |
| H-03 | HIGH | 04 | GAP-CGM-34 | Backend ready (14 endpoints); **frontend unbound everywhere** in current `polishing-v0.4` tree. Story 115329 mid-flight per active-session memory. | Complete story 115329; wire Contact Group services to admin-console / management-console. |
| H-04 | HIGH | 01 | latest-prd.md:62 BR-AM-22 GAP-AM-19 | Backend `do-payment` endpoints exist but **frontend has not bound** any of the `/comm-channel/*` or `/application/*` mutations in `polishing-v0.4` (per `API_TO_COMPONENT_TRACE.md:80-93`). | Build admin UI for CommChannel/App lifecycle (visibility, pricing, enable/disable, payment, status). |
| H-05 | HIGH | 03 | latest-prd.md:99-100 BR-CC-41 GAP-CC-34, GAP-CC-35 | **Packaging and Billing scope** is named in folder title but absent from PRD body. No code. | Confirm Phase 2 with Product; create separate PRDs in Drive folder; defer in code. |
| H-06 | HIGH | 02 | Q-UM-12 GAP-UM-04 | Vocabulary mismatch: PRD says **Normal/Advanced** password security levels; Identity code uses **Low/Medium/High/Strict** (4 levels). | Decide canonical vocabulary in 2 weeks; reconcile DTO + PRD. |
| H-07 | HIGH | 03 | Q-CC-14 / BR-CC-49 GAP-CC-36, GAP-RD-04 | **Refund flow (failed campaign)** has no PRD and no code. Open backlog item. | Specify refund flow PRD; design Charging refund endpoint. |
| H-08 | HIGH | 03 | Q-CC-07 GAP-CC-30 | **No audit log endpoint for contract edits**. Compliance / dispute risk. | Add audit-log capture + read endpoint in Commerce. |
| H-09 | HIGH | 04 | GAP-CGM-29 | **No audit log of Falcon admin downloads** of client contact groups (PII compliance). | Add download audit trail at the Contact Group service. |
| H-10 | HIGH | 03 | BR-CC-50 / Q-CC-15 / GAP-RD-05 GAP-CC-23 | **Addons fallback rules** when searched contract has no matching addon — server-side cascade not visible; PRD silent. | Clarify PRD; verify handler implements the cascade correctly. |
| H-11 | HIGH | 01 | Q-AM-01 / BR-AM-41 GAP-AM-27 | **Wallet topology edit mid-life** (changing Balance Type / Wallet Type with non-zero balances) - PRD silent on migration. | Specify migration flow; verify backend behavior. |
| H-12 | HIGH | 01 | Q-AM-03 / BR-AM-39 GAP-AM-28 | **Account Limits edit** when live users already exceed new limit — PRD silent. | Specify reject-vs-grandfather mode. |
| H-13 | HIGH | 02 | Q-UM-13 GAP-UM-21 | **Admin-driven email/phone change** OTP path unclear (`/me/verify-*` endpoints are self-driven; admin path missing). | Design admin-side OTP endpoint or document delegation pattern. |
| H-14 | HIGH | 05 | Q-TM-04 / BR-TM-27 GAP-TM-14, GAP-TM-15 | **Meta webhook integration** (Pause/Disable signal -> runtime block) missing. | Build webhook receiver + state machine + send-time block check. |
| H-15 | HIGH | 02 | BR-UM-32 Q-UM-01 | **Forgot Password wrong OTP** silent (vs login lockout). Bug or intent? | Decide policy; align with Login lockout if intent. |

## MED Severity

| # | Severity | Module | PRD Source | Code Location | Recommendation |
|---|---|---|---|---|---|
| M-01 | MED | 01 | root-documents/latest-prd.md:21 Q-AM-18 GAP-AM-07 | **Move node from level to level** — backlog item; no endpoint. | Add `MoveNode` endpoint in Commerce. |
| M-02 | MED | 01 | GAP-AM-29 | **No Account archive / soft-delete state** observed. | Add lifecycle. |
| M-03 | MED | 03 | GAP-CC-29 / Q-CC-13 / BR-CC-48 | **No DELETE / cancel endpoint** on Pending contracts. | Add `DELETE /api/Contracts/{id}` with Pending-only check. |
| M-04 | MED | 03 | Q-CC-06 / BR-CC-44 GAP-CC-31 | **VAT / tax handling** silent in PRD and code. | Specify; add to ContractRateRequest. |
| M-05 | MED | 04 | Q-CGM-04 / BR-CGM-34 GAP-CGM-26 | **No `Failed` status** for contact group when parsing fails. Today: stuck in `In Progress`. | Add status; surface in UI. |
| M-06 | MED | 04 | Q-CGM-12 GAP-CGM-30 | **No retention policy / hard-delete** for soft-deleted contact groups. | Define policy. |
| M-07 | MED | 02 | Q-UM-11 GAP-UM-35 | **No bulk user operations** (bulk-disable, bulk-permission-change). | Out of scope today; track for Phase 2. |
| M-08 | MED | 02 | Q-UM-10 GAP-UM-36 | **No user move-across-hierarchy** endpoint. | Out of scope today. |
| M-09 | MED | 03 | Q-CC-21 (naming drift) | Commerce DTO uses `ContractTariffPlanResponse` while PRD uses `Contract Details`. | Align naming if it surfaces to UI / docs. |
| M-10 | MED | 03 | BR-CC-21 GAP-CC-32, GAP-CC-33 | **Price Unit and Destination lookup endpoints** not specifically documented. | Verify lookup IDs (`GET /api/Lookup/{id}`) for these lists; document. |
| M-11 | MED | 03 | BR-CC-23 / Q-CC-09 GAP-CC-11..13 | **Priority / Destination weak-typing** (strings). | Tighten to enum / lookup for compile-time safety. |
| M-12 | MED | 01 | BR-AM-03 GAP-AM-03 | **Account Name "starts with letter"** rule not visible in DTO attribute. | Add `[RegularExpression]` on `AccountName`. |
| M-13 | MED | 01 | BR-AM-11 GAP-AM-11 | **Account Limits enforcement** split across services; not fully verified. | Run a test scenario covering each limit (Normal User, System User, Node Levels, Balance Transfer %). |
| M-14 | MED | 01 | root-documents/latest-prd.md:25 / Q-AM-19 GAP-AM- | **Active contract + visible commchannel cap** rule unclear. | Confirm with Product. |
| M-15 | MED | 05 | Q-TM-12 | **Maker = Checker self-approval prevention** silent. | Add validator. |
| M-16 | MED | 05 | Q-TM-13 | **Checker assignment routing** (by category / language / round-robin) silent. | Specify. |
| M-17 | MED | 02 | root-documents/latest-prd.md:26 Q-UM-16 / GAP-RD-08 | **Falcon admin skip-validation** for user phone/status edits. | Specify Product decision. |
| M-18 | MED | 03 | root-documents/latest-prd.md:27 Q-CC-23 / GAP-RD-09 | **Phone Number / Destination per-country Allow/Deny + Price** in Contract Details — partial today. | Extend Contract Detail metadata. |
| M-19 | MED | 04 | Q-CGM-17 / BR-CGM-06 | **Column name uniqueness case-sensitivity** silent. | Specify. |
| M-20 | MED | 01 | BR-AM-40 / Q-AM-04 | **Visibility Show->Hide while Active** behavior silent. | Specify whether it disables consumption. |

## LOW Severity

| # | Severity | Module | PRD Source | Recommendation |
|---|---|---|---|---|
| L-01 | LOW | 05 | Q-TM-15 GAP-TM-25 | Bulk template upload — defer. |
| L-02 | LOW | 04 | GAP-CGM-35, GAP-CGM-36 | Email/SMS notifications on share; bulk operations — defer. |
| L-03 | LOW | 04 | Q-CGM-08 / BR-CGM-33 | "Shared With (+N)" threshold — UX consistency. |
| L-04 | LOW | 02 | BR-UM-48 / Q-UM-05 | Profile picture format/size limits — frontend nicety. |
| L-05 | LOW | 02 | BR-UM-49 / Q-UM-06 | "Contact administrator" alert with manager info — nicety. |
| L-06 | LOW | 05 | Q-TM-17 | Quick Reply button label char limit — verify. |
| L-07 | LOW | 02 | Q-UM-09 / BR-UM-50 | Change Password session invalidation scope (this device vs all) — backend may already cover. |
| L-08 | LOW | 05 | Q-TM-19 / GAP-TM-26 | Template configuration inheritance Main->Sub-nodes — Phase 2. |
| L-09 | LOW | 01 | Q-AM-08 | Account archive state vs Deleted only — backlog. |
| L-10 | LOW | 03 | Q-CC-12 / BR-CC-21 | Admin UI for Price Unit list management — DB-only is intentional but could ship later. |

## Top-5 HIGH Gaps (executive view)

1. **H-01 / H-02**: Templates module — both the architectural surprise (no template-entity API) AND the gateway routing miss combine into the single largest gap in the platform. Frontend cannot ship template features at all today.
2. **H-03**: Contact Group frontend (story 115329) — backend is fully ready; finishing story unlocks an entire client-facing surface.
3. **H-04**: CommChannel/App lifecycle admin UI — backend has 22+ endpoints in Node controller; UI binding is at zero per `API_TO_COMPONENT_TRACE.md`.
4. **H-05**: Packaging + Billing — entire two PRD modules missing despite folder title; biggest scope-creep risk.
5. **H-08 / H-09**: No audit logs anywhere — contract edits, contact group downloads — compliance / PII risk for production.

## Coverage by Module

| Module | MISSING | PARTIAL | UNVERIFIABLE |
|---|---:|---:|---:|
| 01-account-management | 3 | 3 | 9 |
| 02-user-management | 2 | 6 | 9 |
| 03-contract-packaging-charging-billing-management | 6 | 7 | 14 |
| 04-contact-group-management | 5 | 2 | 8 |
| 05-templates | 21 | 2 | 1 |
| root-documents | 8 | 1 | 1 |
| **TOTAL** | **45** | **21** | **42** |
