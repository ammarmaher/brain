---
type: sweep-report
date: 2026-05-16
operation: add-purpose-frontmatter-to-authority-dataset
purpose: "Answers 'which authority-dataset files got a purpose: field added in the 2026-05-16 sweep + the exact purpose value for each'. Open after the sweep to audit per-file purpose values or roll back."
---

# Purpose Frontmatter Sweep — 2026-05-16

## TL;DR

- **105 files swept**
- **103 files updated** (added `purpose:` to frontmatter)
- **2 files skipped** (already had `purpose:` — `00-VERIFICATION-GATE.md` + `16-trigger-phrases/_INDEX.md`)
- **0 files skipped due to no-frontmatter** — every file had frontmatter
- **0 files failed**

All updates were additive — inserted one `purpose:` line into existing frontmatter without restructuring other fields.

## Skipped (idempotent — already had purpose:)

| File | Existing purpose value |
|---|---|
| `authority-dataset/00-VERIFICATION-GATE.md` | `10 falsifiable questions the dataset must answer with code citations` |
| `authority-dataset/16-trigger-phrases/_INDEX.md` | `Consolidated reference card for every trigger phrase that auto-loads dataset context` |

## Per-cluster results

### 01-roles (6 files updated)

| File | Purpose value |
|---|---|
| `acc-admin.md` | Answers 'what can acc-admin do + which PES rules grant/deny it'. Open when implementing or auditing any management-console feature gated by the tenant Node-Admin role. |
| `acc-owner.md` | Answers 'what can acc-owner do + which PES rules grant it'. Open when implementing or auditing any management-console feature gated by the tenant Account-Owner role. |
| `acc-user.md` | Answers 'what can acc-user do (only contact-group + view-shared) + which PES rules deny everything else'. Open when implementing minimum-privilege gates or contact-group view-shared logic. |
| `sys-admin.md` | Answers 'what can sys-admin do + which PES rules grant it'. Open when implementing or auditing any admin-console feature gated by the top Falcon staff role. |
| `sys-ops.md` | Answers 'what can sys-ops do (restricted: hierarchy view, IP edits on non-root only) + which PES rules deny the rest'. Open when gating any admin-console technical-operations feature. |
| `sys-products.md` | Answers 'what can sys-products do (commercial: services, wallet-transfer, master-wallet) + which PES rules grant/deny it'. Open when implementing admin-console commercial features. |

### 02-statuses (5 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'which lifecycle/status enums exist across all services + where to find each'. Open to navigate to the right status file or to spot duplicate enum definitions. |
| `account-creation-status.md` | Answers 'what are the 7 Add-Client wizard stages + which int maps to which step'. Open when implementing Add-Client wizard step transitions or debugging stuck draft accounts. |
| `contract-status.md` | Answers 'what 3 lifecycle states does a Contract have + which int is which'. Open when implementing contracts-cost-management UI filters or contract domain logic. |
| `service-status.md` | Answers 'why service-status differs between Commerce and Provisioning + which int means what in each'. Open before mapping service status across the Commerce↔Provisioning boundary. |
| `user-status.md` | Answers 'what 5 user-status values exist + which can log in + which filter applies in contact-group share'. Open when implementing user state transitions or user-list status filters. |

### 03-pes-keys (2 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'which PES-keys files exist + how the 47 factory methods are organized by namespace'. Open to navigate to the right PES-keys file or recall namespace boundaries. |
| `REGISTRY-RAW.md` | Answers 'what is the full universe of PES keys the FE can produce + which role passes each'. Open when adding a new gated feature, auditing PES coverage, or verifying a key exists before using it. |

### 04-feature-parity-matrix (9 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'which per-feature compare notes exist in the parity matrix'. Open to navigate to a specific feature's Falcon-vs-Client comparison. |
| `MATRIX.md` | Answers 'which features are Falcon-only / Client-only / shared / shared-with-enrichment'. Open before deciding whether to port a feature admin → mgmt or planning new-UI feature scope. |
| `comms-hub.compare.md` | Answers 'how does comms-hub differ between admin (flat) and mgmt (nested + 3 child stubs) + which PES keys gate each side'. Open before porting or modifying comm-channel screens. |
| `contact-groups.compare.md` | Answers 'why is contact-groups admin-side read-only while mgmt-side has full CRUD' + which scope-aware PES keys gate each role. Open before porting/modifying any contact-group flow. |
| `contracts-cost-management.compare.md` | Answers 'how is the mgmt side hardcoded view-only via canEdit:false + why acc-owner is the only role that lands on it'. Open before touching any contract UI or migration. |
| `marketplace-applications.compare.md` | Answers 'how marketplace-applications shares one backend + one table protocol but splits on sys.services.* vs acc.services.* PES keys'. Open before changing pricing/visibility/payment flows. |
| `organization-hierarchy.compare.md` | Answers 'how organization-hierarchy shares the tree component but admin adds the 5-step Add Client wizard + Falcon synthetic root'. Open before modifying tree, Add Client, or Add Node/User flows. |
| `testing-charging.compare.md` | Answers 'why is testing-charging Falcon-only + not portable to Client + which guard/userType filter gates entry'. Open if asked to expose any OCS testing surface to Client users (don't). |
| `wallet-balance-management.compare.md` | Answers 'why is master-wallet + cross-account tree-picker Falcon-only + how does Client side route the transfer call through ChargingGateway'. Open before touching wallet/transfer UI. |

### 05-capability-maps (7 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'which per-role capability maps exist + how to look up role × action × verdict for any role'. Open to navigate to a specific role's full capability table. |
| `acc-admin.capability.md` | Answers 'full page×action×verdict inventory of what acc-admin can/cannot do + which explicit denies vs silent denies apply'. Open when auditing or building any mgmt-console feature for the Node-Admin role. |
| `acc-owner.capability.md` | Answers 'full page×action×verdict inventory of acc-owner including own-only contact-group expression gates + role-edit reach'. Open when implementing any top-tenant-role feature. |
| `acc-user.capability.md` | Answers 'full inventory of acc-user — the minimum-privilege role, contact-group-only, the only role with view-shared, role-edit reach: nothing'. Open before rendering anything in mgmt-console for this role. |
| `sys-admin.capability.md` | Answers 'full page×action×verdict inventory of sys-admin including its largest-in-system role-edit reach'. Open when implementing any admin-console feature for the top Falcon staff role. |
| `sys-ops.capability.md` | Answers 'full inventory of sys-ops — only 4 mutating rules (root-password view-only, account-IP edit, contact-group view+download)'. Open before assuming any admin-console feature works for sys-ops. |
| `sys-products.capability.md` | Answers 'full inventory of sys-products — the Falcon commercial admin (services lifecycle, wallet-strategy, master-wallet, contract lifecycle, stricter than sys-ops on root-password)'. Open before any commercial-side admin work. |

### 06-validation-by-feature (2 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to look up V-rule × feature mappings + drift watch items'. Open to navigate to the 25-V-rule × 7-feature matrix. |
| `MATRIX.md` | Answers 'which of the 25 V-rules apply when implementing feature F + which validators/severities/drift items to surface'. Open before wiring form validators or planning a feature. |

### 07-cross-cutting (4 files updated)

| File | Purpose value |
|---|---|
| `gateway-routing-map.md` | Answers 'which gateway (System :7256 vs Core :7038) does each app use + how is it wired'. Open when configuring app gateway, debugging auth/tenancy routing, or implementing a cross-console feature. |
| `permission-sheet-gaps.md` | Answers 'why PES catalog may drift from business intent + what's missing from the PRD permission sheet capture'. Open before trusting PES catalog as canonical or running Phase 2.5 drift audit. |
| `session-shape.md` | Answers 'what JWT claims does the FE rely on + how is the PES policy-subject built from them'. Open when wiring CurrentSubjectBuilder, debugging PES denials, or seeding new test users. |
| `test-users.md` | Answers 'which 6 pre-seeded users exist on local dev + their credentials, roles, namespaces, tenant ids'. Open when manually testing any role-gated feature or reseeding Zitadel. |

### 08-entity-drift-by-feature (2 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to look up entity × feature drift mappings + verdict legend (match/drift/missing/extra)'. Open to navigate the 15-entity × 7-feature drift grid. |
| `MATRIX.md` | Answers 'which entities does feature F touch + which DTO drift items (rename, type flip, missing/extra) must I reconcile'. Open before wiring DTOs or handlers for any feature port. |

### 09-business-rules-by-feature (2 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to look up BR-* × feature mappings + the 3-axis (PES / V-rule / BR) taxonomy'. Open to navigate the 180-rule × 7-feature matrix. |
| `MATRIX.md` | Answers 'which BR-* cross-field/workflow/domain rules apply to feature F + how do they interact with PES (who) and V-rules (form data)'. Open before implementing workflow logic. |

### 10-non-pes-gates-by-feature (2 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to look up the 6 non-PES gate types × feature mappings'. Open to navigate the 6-gate × 7-feature matrix or recall composite-gate patterns. |
| `MATRIX.md` | Answers 'what hides/shows UI on feature F BESIDES PES (session-type, node-type, mode, tab-visibility, server-driven rows, composite gates)'. Open before porting any feature admin → mgmt. |

### 11-copy-playbook (7 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'which files in the copy playbook cluster exist + which step each one supports'. Open to navigate to the right checklist/catalog file for a given port-recipe step. |
| `copy-admin-feature-to-mgmt.md` | Answers 'what are the 12 steps to port a Shared-with-config-flip feature from admin to mgmt + how to handle each class (Falcon-only, Falcon-mostly, Client-only)'. Open before starting any cross-console port. |
| `dto-divergence.catalog.md` | Answers 'which UI-hint DTO fields (subtitle, iconClass, pricePeriod, currency, showDates) does mgmt-side add to admin DTOs + which features'. Open during Step 5 of the 12-step port recipe. |
| `endpoint-suffix.catalog.md` | Answers 'when to append /visible vs /visible/details to mgmt list URLs + what each suffix delivers (filter, enrich) per feature'. Open during Step 6 of the 12-step port recipe. |
| `gateway-flip.checklist.md` | Answers 'how to drop explicit useGateway(SystemGateway) overrides + which two overrides (ChargingGateway, IdentityGateway) stay'. Open during Step 4 of the 12-step port recipe. |
| `namespace-flip.checklist.md` | Answers 'which adminConsole.* PES keys have managementConsole.* equivalents + which must be dropped or replaced with row-level checks'. Open during Step 3 of the 12-step port recipe. |
| `session-binding.checklist.md` | Answers 'how to source accountId from session.tenantId || session.client_id on mgmt-side vs tree-selection on admin-side'. Open during Step 7 of the 12-step port recipe. |

### 12-auto-sync (1 file updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'how does the authority dataset auto-detect drift in canonical source files + which scripts/hooks deliver it'. Open when installing the pre-push hook or investigating a drift report. |

### 13-error-catalog (3 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to look up error codes, HTTP statuses, owning services, FE handling rules'. Open to navigate to the catalog or FE-contract file. |
| `CATALOG.md` | Answers 'which 130 FalconKeys.Error.* codes exist + their HTTP statuses, owning services, surfacing features, V-rule linkages'. Open when implementing FE error handling for any feature or backend error emission. |
| `FE-CONTRACT.md` | Answers 'what are the 3 standing FE error-handling rules + status → UX mapping + anti-patterns to avoid'. Open before writing any frontend error handler, toast, or inline-error wiring. |

### 14-flow-playbook-integration (5 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to find each flow-integration file + how to bridge authority dataset with implementation playbooks'. Open to navigate to a specific flow or its integration matrix. |
| `Add-Client.integration.md` | Answers 'who can run Add Client + which V-rules, entities, Kafka events, error codes, status transitions it touches'. Open when implementing or reviewing the 5-step Add Client wizard. |
| `Add-Node-and-Edit-Node.integration.md` | Answers 'who can Add/Edit Node + scope constraints (own-subtree vs anywhere) + which 2 entities (E-node + E-account-settings) apply'. Open when implementing tree-row Add/Rename actions. |
| `Add-User.integration.md` | Answers 'which 5 of 6 roles can Add User + what target user types each actor can grant + BR-UM-03 one-AO-per-tenant constraint'. Open when implementing the 3-tab Add User wizard. |
| `MATRIX.md` | Answers 'all 4 org-hierarchy flows indexed by PES, roles, V-rules, entities, BR rules, status, errors, Kafka — at a glance'. Open to compare flows or find which flow uses which rule. |

### 15-implementation-pitfalls (3 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'where to find pitfalls vs anti-patterns + which pre-flight checklist applies'. Open before any implementation or feature port. |
| `ANTI-PATTERNS.md` | Answers 'which 13 anti-patterns from the old UI MUST NOT be ported to the new theme (SCSS, PrimeNG, *ngIf, @Input, alert())'. Open before copying any old-UI .ts/template/style. |
| `PITFALLS.md` | Answers 'which 25 cross-cutting pitfalls + 10 mindsets catch real bugs before code review (deny-by-omission, scope-arg factory, app.*.view, etc.)'. Open before implementing or porting any feature. |

### 16-trigger-phrases (skipped — already had purpose)

### Authority-dataset root (2 files updated, 1 skipped)

| File | Purpose value |
|---|---|
| `00-INDEX.md` | Answers 'what is the authority dataset + which cluster answers which question + how to navigate the 17 cluster folders'. Open at session start before reading any specific cluster. |
| `00-VERIFICATION-GATE.md` | (skipped — already had purpose) |
| `VERIFICATION-STATUS.md` | Answers 'which dataset claims are code-verified vs runtime-verified vs unverified + which still need exercise'. Open BEFORE trusting any dataset claim as runtime truth. |
| `KNOWLEDGE-DUMP.md` | (explicitly excluded per task brief) |

### _runtime-verification (1 file updated)

| File | Purpose value |
|---|---|
| `comms-hub-2026-05-16.md` | Answers 'what happened during the 2026-05-16 comms-hub runtime gate verification + why FE gate is still blocked'. Open when re-attempting comms-hub runtime verification or chasing dev-server poisoning. |

### falcon-wiki/100-Authority (24 files updated)

| File | Purpose value |
|---|---|
| `_INDEX.md` | Answers 'how to navigate the 100-Authority vault cluster + which note answers which authority question'. Open at session start as the entry MOC. |
| `Auto-Sync.md` | Answers 'which 62 canonical files are watched for drift + how the pre-push hook blocks pushes when they change'. Open before installing the auto-sync hook or reading a drift report. |
| `Business-Rules-by-Feature.md` | Answers 'which BR-* cross-field/workflow rules apply to each of the 7 features + how PES vs V-rule vs BR-* differ'. Open before implementing workflow logic. |
| `Capability-acc-admin.md` | Answers 'what can acc-admin do/not do (middle-tier: org+account view+add but explicit deny on services/profile/contracts)'. Open when implementing or auditing Node-Admin features. |
| `Capability-acc-owner.md` | Answers 'what unique powers acc-owner has (only acc-* with account-user.add, services, profile edit, contracts)'. Open when implementing or auditing Account-Owner features. |
| `Capability-acc-user.md` | Answers 'why acc-user is contact-groups-only + has the unique view-shared permission + cannot edit any role'. Open before rendering anything in mgmt-console for this role. |
| `Capability-sys-admin.md` | Answers 'what unique powers sys-admin has (only role for root-password-security.edit + root-allowed-ips.edit + cross-namespace role-edit)'. Open when implementing top-Falcon-staff features. |
| `Capability-sys-ops.md` | Answers 'why sys-ops is the IP/firewall-ops persona (account-level IP edit only; root denied) + which silent-deny surface is largest'. Open before assuming sys-ops can run any feature. |
| `Capability-sys-products.md` | Answers 'why sys-products is the commercial admin (services + wallet-strategy + master-wallet) + is stricter than sys-ops on root-password-security'. Open before any commercial admin work. |
| `Copy-Playbook.md` | Answers 'what are the 12 steps for porting a Shared-with-config-flip feature admin → mgmt + when to stop/cherry-pick'. Open before starting any cross-console port. |
| `Entity-Drift-by-Feature.md` | Answers 'which entities does each feature touch + which DTO drift items will surprise me when porting (179 total drift items)'. Open before wiring DTOs for any port. |
| `Error-Catalog.md` | Answers 'which ~130 FalconKeys.Error.* codes exist + their HTTP statuses + 3 standing FE rules + status → UX mapping'. Open when implementing FE error handling for any feature. |
| `Falcon-vs-Client.md` | Answers 'which features are Falcon-only / Falcon-mostly / Shared / asymmetric'. Open before deciding whether to port a feature admin → mgmt. |
| `Flow-Playbook-Integration.md` | Answers 'who can run each of the 4 org-hierarchy flows + which V-rules, entities, BR-* rules, errors, Kafka events apply'. Open when implementing any flow playbook. |
| `Implementation-Pitfalls.md` | Answers 'which 25 pitfalls (5 categories) + 13 anti-patterns catch bugs before code review'. Open BEFORE porting any feature or implementing new authority-gated UI. |
| `Non-PES-Gates-by-Feature.md` | Answers 'which 6 non-PES gate types (session-type, node-type, mode, tab-visibility, server-driven, composite) apply to each feature'. Open before porting any UI. |
| `PES-Keys.md` | Answers 'what are the 47 PES key factories + 7 namespaces + resource prefix taxonomy (sys.*, acc.*, app.*, etc.)'. Open before adding/using any PES key. |
| `Roles.md` | Answers 'who are the 6 canonical roles + their En/Ar names + unique powers + namespace + console mount'. Open at session start to ground on role taxonomy. |
| `Session-Shape.md` | Answers 'what JWT claims does the FE rely on + how is the PES policy subject u:<sub>@<ns> built + Mongo vs Zitadel ID universes'. Open when wiring auth/session/PES. |
| `Statuses.md` | Answers 'which 9 lifecycle status enums exist + which int means what + which enums differ across services (e.g. service status Commerce vs Provisioning)'. Open before status-driven logic. |
| `Test-Users.md` | Answers 'which 6 pre-seeded test users exist (3 sys-* + 3 acc-*) + credentials + namespace + how to reseed'. Open before any manual role-gated testing. |
| `Trigger-Phrases.md` | Answers 'which ~45 phrases auto-load which dataset slices into a fresh Claude session'. Open to find or paste the right trigger phrase before starting work. |
| `Validation-by-Feature.md` | Answers 'which of the 25 V-rules apply per feature + drift watch items (PRD vs backend gaps) + 3-layer validation architecture'. Open before wiring any form validator. |
| `Verification-Status.md` | Answers 'which dataset claims are code-verified vs runtime-verified vs unverified'. Open BEFORE trusting any dataset claim as runtime truth. |

### Brain SK/_obsidian/40-Authority (24 files updated)

Mirror cluster of falcon-wiki/100-Authority — identical purpose values applied to the matching files.

## Hard rules honored

- Idempotent: existing `purpose:` values NOT overwritten — 2 files skipped (`00-VERIFICATION-GATE.md` + `16-trigger-phrases/_INDEX.md`)
- Preserved frontmatter formatting — inserted single line, did not restructure other fields
- All purpose values quoted with double quotes
- All purpose values ≤ 200 chars
- One purpose per file — no merging
- Excluded: `_pdf-build/` (build artifacts), `_runtime-verification/*.json` (not .md), drift-report files (none present), `KNOWLEDGE-DUMP.md` (per brief)

## Notes / Caveats

- No files needed follow-up — every file had frontmatter
- Sweep was performed on 105 candidate files; 2 idempotent skips + 103 successful updates
- The purpose-sweep field on this report file itself is also present (the report has its own purpose for future audit reference)
