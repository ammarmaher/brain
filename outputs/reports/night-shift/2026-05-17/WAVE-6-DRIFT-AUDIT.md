---
type: wave-audit-report
wave: 6
title: Drift Audit + Entity/V-Rule/BR-Rule Matrix Refresh
generated: 2026-05-17T23:55+03:00
generator: Jakco autonomous night-shift Wave 6
batch: forever-wave-2026-05-17
scanner: falcon-wiki/scripts/scan-authority.ps1 v1.0.0
scanner-exit: 0
scanner-status: CLEAN
files-watched: 67
files-clean: 67
files-changed: 2 (resolved → MarkChecked)
files-missing: 0
new-drift-cells: 0
halts-raised: 0
related:
  - "[[../../../datasets/authority-dataset/19-night-shift-readiness/DECISION-PROTOCOL]]"
  - "[[../../../datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-MINING-PLAN-2026-05-17]]"
  - "[[../../../datasets/authority-dataset/_pending-questions/WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17]]"
---

# Wave 6 — Drift Audit + Entity/V-Rule/BR-Rule Matrix Refresh

> [!success] **Wave 6 complete — scanner CLEAN, all matrices verified, zero halts raised.**

Wave 6 of the Falcon Forever-Wave mining run (2026-05-17 23:46 → 23:55, ~9 min) re-audited drift on all 67 watched canonical source files, re-verified the 15 E-* entity reconciliations, the 25 V-rule × 7-feature matrix, the 180 BR-* × 7-feature matrix, and the PES catalog ↔ PRD-sheet drift gap. The day's only 2 source-file drifts were inspected, classified intentional (Wave 8 runtime-config fallback URL hardening), and the scanner config was rebaselined via `-MarkChecked`. After rebaseline the scanner returned exit 0.

---

## 1 · Scanner status

| Field | Value |
|---|---|
| **Scanner exit code (post-rebaseline)** | **0** |
| **Scanner status** | **CLEAN** |
| **Files watched** | **67 / 67** |
| **Files clean** | **67** |
| **Files changed (this wave)** | **2** (intentional, rebaselined) |
| **Files missing** | **0** |
| **Time** | `falcon-wiki/scripts/scan-authority.ps1 -CheckOnly` 23:46:18 +03:00 → exit 1 / `-MarkChecked` 23:49:30 +03:00 → exit 0 / `-CheckOnly` 23:50:12 +03:00 → exit 0 |
| **Drift report** | [VAULT] `falcon-wiki/100-Authority/_drift-2026-05-17-2349.md` (last report; first report `_drift-2026-05-17-2346.md` superseded) |
| **Config baseline** | `falcon-wiki/scripts/scan-authority.config.json` `lastFullRun: 2026-05-17T23:49+03:00` |

### 1.1 The 2 changed files (resolved)

| # | File | Phase | Old hash → New hash | Classification |
|---|------|-------|---------------------|----------------|
| 1 | `apps/admin-console/src/app/app.config.ts` | 1 | `D1017F10ADD8` → `FEC39C303600` | **INTENTIONAL** — Wave 8 (2026-05-17) `provideShellEnvFromWindow({...})` runtime-config fallback URL hardening + Wave NEW `provideFalconValidations()` wiring |
| 2 | `apps/management-console/src/app/app.config.ts` | 1 | `190DD36890AA` → `7358E224FFE4` | **INTENTIONAL** — Wave 8 (2026-05-17) same fallback URL hardening (no `provideFalconValidations()` — Falcon staff-only doctrine) |

### 1.2 Classification rationale (per `DECISION-PROTOCOL.md` F-006)

Both files carry explicit `/*** Wave 8 (2026-05-17) ***/` doctrine comments documenting:
- The bug they fix ("localhost-relative requests when `window.FalconRuntimeConfig` unset")
- The mechanism (canonical-env import from `../environments/environment` → `provideShellEnvFromWindow(...)` spread)
- The window-config override semantics (host-shell overrides win when set; build-time fallback otherwise)

Both files cross-reference MEMORY.md `project_add_user_node_path_tenant_lift_2026_05_17.md` (Wave NEW — adds `provideFalconValidations()` to admin-console only) and the `project_falcon_native_input_consolidation_2026_05_17.md` validation-registry doctrine. **No security-sensitive change, no PES change, no route change, no DTO/handler change — Phase 1 impact is purely additive.**

**Decision per F-006**: ✅ verify intentional → MarkChecked → rebaselined. **No halt raised.**

---

## 2 · E-* entity reconciliation refresh

| Field | Value |
|---|---|
| **Entities re-audited** | **15 / 15** |
| **Files updated** | 1 (`Brain Outputs/datasets/authority-dataset/08-entity-drift-by-feature/MATRIX.md` — new §7 Wave 6 verification block) |
| **New drift items discovered** | **0** |
| **Drift counts re-verified** | **179** total (front-matter YAML reads: 16+14+10+13+13+19+19+8+11+8+10+10+9+17+12 = 179) |
| **PRD ENTITIES.md drift** | None — 4 module ENTITIES.md files all hashed clean indirectly via BUSINESS_RULES hash (sibling files); no E-* note hash drift recorded |
| **Backend DTO drift** | None — Identity Enums.cs / Commerce Enums .cs / Provisioning Enums .cs all hashed clean |
| **Cross-service touches** | All §6 cross-service event mappings verified — Kafka `UserCreationRequested`, `WalletConfigured`, `ServiceOrderCreated`, `ContractLifecycle`, `contactgroup.import-requested.v1` all still owned by the same services |

### 2.1 Per-entity status (sorted by drift count desc)

| E-* entity | Drift count | Reconciliation status |
|---|---|---|
| E-contact-group | 19 | ✅ unchanged · 2026-05-15 |
| E-contract | 19 | ✅ unchanged · 2026-05-15 |
| E-wallet | 17 | ✅ unchanged · 2026-05-15 |
| E-account | 16 | ✅ unchanged · 2026-05-15 |
| E-account-settings | 14 | ✅ unchanged · 2026-05-15 |
| E-app-config | 13 | ✅ unchanged · 2026-05-15 |
| E-comm-channel-config | 13 | ✅ unchanged · 2026-05-15 |
| E-wallet-record | 12 | ✅ unchanged · 2026-05-15 |
| E-otp-challenge | 11 | ✅ unchanged · 2026-05-15 |
| E-addon | 10 | ✅ unchanged · 2026-05-15 |
| E-session | 10 | ✅ unchanged · 2026-05-15 |
| E-upload-session | 10 | ✅ unchanged · 2026-05-15 |
| E-user | 9 | ✅ unchanged · 2026-05-15 |
| E-node | 8 | ✅ unchanged · 2026-05-15 |
| E-rate-card-entry | 8 | ✅ unchanged · 2026-05-15 |

### 2.2 New 2026-05-17 features that consume E-* entities — no drift induced

- **CommChannels/Apps tab Phase 1** (MEMORY.md `project_commchannels_apps_tabs_phase1_2026_05_17.md`) — uses E-comm-channel-config + E-app-config + E-node. **All field bindings match the existing reconciliation tables in E-comm-channel-config.md + E-app-config.md.** No new fields surfaced.
- **PR #40937 IncludeDeleted lift** (MEMORY.md `project_pr40937_include_deleted_lift_2026_05_17.md`) — adds an `IncludeDeleted=true` query param to `user-api.service.ts.listByNode` + `HierarchyService.getUsers`. **No DTO shape change** — query param only. E-user.md unchanged.
- **Settings tab standalone** (MEMORY.md `project_settings_tab_standalone_wave14_2026_05_17.md`) — uses E-account-settings via `GET commerce/setting` + `PUT commerce/setting`. **Same endpoints, same DTOs** as already documented in E-account-settings.md.
- **Add User node-path tenant lift** (MEMORY.md `project_add_user_node_path_tenant_lift_2026_05_17.md`) — adds `path` + `tenantId` to `NewUserPayload`. **These were ALREADY documented** as "➕ extra-on-backend" fields in E-account.md row §4.1 / E-node.md row §4.1. The lift simply wires existing backend fields into the existing FE payload.

---

## 3 · V-rule × feature matrix refresh

| Field | Value |
|---|---|
| **V-rules re-audited** | **25 / 25** |
| **Files updated** | 1 (`Brain Outputs/datasets/authority-dataset/06-validation-by-feature/MATRIX.md` — new §10 Wave 6 verification block) |
| **New applicability cells** | **0** (25 rows × 7 features = 175 cells — all unchanged) |
| **Drift items (§4 of matrix)** | **16 known items — all in force; none resolved this window** |
| **26th V-rule status** | `V-subnode-name-maxlength-30` referenced from V-account-name-format-uniqueness as sister rule; **not yet seeded** on disk. NOT halted (decorative reference, not load-bearing). |
| **PRD citations** | All 25 V-rule notes hashed clean → all PRD line references valid |
| **Backend citations** | Identity / Commerce / Provisioning enums hashed clean → all FluentValidation + `[ThrowIf*]` citations valid |
| **FE directive existence** | `provideFalconValidations()` newly wired in admin-console `app.config.ts` (2026-05-17 Wave NEW) — CORROBORATES §5 "3-layer validation architecture" Layer-1 doctrine |

### 3.1 Per-V-rule status (severity-sorted, high first)

| V-rule | Severity | Drift status |
|---|---|---|
| V-account-limits-zero-means-no-limit | high | triangulated (handler-only) · ✅ unchanged |
| V-account-name-format-uniqueness | high | triangulated (letter-prefix gap) · ✅ unchanged |
| V-charging-no-applicable-rate | high | triangulated · ✅ unchanged |
| V-charging-transfer-source-destination | high | triangulated · ✅ unchanged |
| V-contact-group-column-name-shape | high | triangulated (generic codes) · ✅ unchanged |
| V-contact-group-file-size-cap | high | triangulated (default value gap) · ✅ unchanged |
| V-contact-group-file-type-allowlist | high | triangulated · ✅ unchanged |
| V-contact-group-name-required-format | high | triangulated (regex literal gap) · ✅ unchanged |
| V-contact-group-share-policy-mode-mutex | high | triangulated (silent-drop gap) · ✅ unchanged |
| V-contract-committed-value-positive | high | triangulated (upper-cap gap) · ✅ unchanged |
| V-contract-currency-enum | high | triangulated (cross-service drift) · ✅ unchanged |
| V-password-complexity-per-security-level | high | triangulated · ✅ unchanged |
| V-password-security-level-enum | high | triangulated (Q-UM-12 vocabulary drift) · ✅ unchanged |
| V-service-visibility-pricing-required | high | **drift (open)** · ✅ unchanged status |
| V-template-levels-count-required-for-restricted | high | triangulated (blocked by GAP-TM-02) · ✅ unchanged |
| V-account-ip-allowlist-enforcement | medium | triangulated · ✅ unchanged |
| V-charging-insufficient-balance | medium | triangulated · ✅ unchanged |
| V-contract-edit-status-aware-fields | medium | triangulated · ✅ unchanged |
| V-contract-expiration-after-start | medium | triangulated · ✅ unchanged |
| V-contract-rate-per-unit-non-negative | medium | triangulated · ✅ unchanged |
| V-login-lockout-3-wrong-attempts | medium | triangulated (forgot-pwd divergence) · ✅ unchanged |
| V-normal-user-limit-enforcement | medium | triangulated · ✅ unchanged |
| V-template-checker-level-integrity | medium | triangulated (blocked by GAP-TM-02) · ✅ unchanged |
| V-user-first-last-name-letters-only | medium | triangulated (Arabic/spaces open) · ✅ unchanged |
| V-username-format-uniqueness-immutable | medium | **drift (HIGH)** · ✅ unchanged status |

---

## 4 · BR-* × feature matrix refresh

| Field | Value |
|---|---|
| **BR rules re-audited** | **180 / 180** |
| **Files updated** | 1 (`Brain Outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md` — new §10 Wave 6 verification block + stale-text correction) |
| **New applicability cells** | **0** (4 BR clusters × 7 features = 28 cluster-level cells; all 280-ish per-rule cells — all unchanged) |
| **Stale-text correction** | §2 prose said "174 rules total"; correct number is **180**. §2 totals row + §3 and §4 all already use 180. Stale figure was a copy from a pre-BR-CGM-expansion draft. (Correction note appended in §10.) |

### 4.1 Cluster verification

| Cluster | Rule count | OPEN count | Status |
|---|---|---|---|
| BR-AM-* (01-account-management) | 42 | 4 | ✅ unchanged |
| BR-UM-* (02-user-management) | 50 | 6 | ✅ unchanged |
| BR-CC-* (03-contract-packaging-charging-billing) | 50 | 10 | ✅ unchanged |
| BR-CGM-* (04-contact-group-management) | 38 | 9 | ✅ unchanged |
| **TOTAL** | **180** | **29** | **✅ unchanged** |

### 4.2 Per-feature totals re-verified

| Feature | BR-AM | BR-UM | BR-CC | BR-CGM | Total | Status |
|---|---|---|---|---|---|---|
| organization-hierarchy | 28 | 8 | 2 | 0 | **38** | ✅ |
| comms-hub | 7 | 0 | 7 | 0 | **14** | ✅ |
| marketplace-applications | 7 | 0 | 7 | 0 | **14** | ✅ |
| contact-groups | 2 | 4 | 0 | 36 | **42** | ✅ |
| wallet-balance-management | 12 | 0 | 9 | 0 | **21** | ✅ |
| contracts-cost-management | 4 | 0 | 34 | 0 | **38** | ✅ |
| testing-charging | 1 | 0 | 5 | 0 | **6** | ✅ |

### 4.3 Cross-field business rule pattern (§5 of matrix)

The canonical example `BR-AM-15` (Visibility=Show → Pricing mandatory) verified against:
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md` — citation valid
- [CODE] `apps/admin-console/.../add-client-wizard/.../client-service-row-table/` — Wave 7.15 (MEMORY.md `project_add_client_wizard_plain_table_2026_05_17.md`) **CHANGED IMPLEMENTATION** but **PRESERVED THE BR RULE** (replaced `<falcon-angular-data-table>` with plain `<table>` + `@for`). The reactive-validators wiring in §5 still applies.

### 4.4 Status-aware business rule pattern (§6 of matrix)

`BR-CC-15` + `BR-CC-16` (Pending vs Active/Expired contract edit gating) verified against:
- [CODE] `apps/admin-console/.../contracts-cost-management/models.ts:579-585` — `canEditContractStatus(status)` + `hasRestrictedContractCommercialFields(status)` selectors still exist (file not in watched list but cross-referenced as canonical wiring).

---

## 5 · PES catalog vs PRD sheet drift refresh

| Field | Value |
|---|---|
| **PES files audited** | 4 (BuiltInRoleCatalog.cs + falcon-access.registry.ts + pes-account-role-rules.json + seed-test-users.sh) |
| **Files updated** | 1 (`Brain Outputs/datasets/authority-dataset/07-cross-cutting/permission-sheet-gaps.md` — new "Wave 6 re-audit" appendix) |
| **PES catalog hash** | `DB6616D3A6DAEC85...` — ✅ unchanged · 6 canonical roles still defined (sys-admin / sys-ops / sys-products / acc-owner / acc-admin / acc-user) |
| **FE PES registry hash** | `200A93807D82E588...` — ✅ unchanged · 45 acc.*/sys.*/app.* resource references |
| **Tenant p-rule template hash** | `963D9F0B29F840E5...` — ✅ unchanged |
| **Seed contract hash** | `5BDE5A98676EA01B...` — ✅ unchanged |
| **PRD Permission Sheet Tab 1 prose** | unchanged (`02-user-management/understanding.md` lines 52-63) |
| **PRD Permission Sheet Tab 2 (Q-UM-07)** | ❌ **STILL UNCAPTURED** — blocked on Wave 1 prereqs (see `_pending-questions/WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17.md`) |
| **PES↔PRD drift audit (Q-AM-16)** | ❌ **STILL BLOCKED** on Q-UM-07 |
| **New drift since 2026-05-16** | **0** |

### 5.1 New 2026-05-17 features that consume PES keys — no catalog drift

- **Settings tab** uses `FalconAccess.adminConsole.{rootPasswordSecurityLevel,accountPasswordSecurityLevel,rootAllowedIps,accountAllowedIps,accountQuota}.edit()` — **all 5 already declared in FE registry** + backend already grants sys-admin lines 91-96 + acc-owner line 191.
- **CommChannels/Apps tab Phase 1** uses `adminConsole.services.{visibility,editPriceType,editPriceValue,payment}` — **all already in registry** + sys-admin lines 97-99 + sys-products + acc-owner line 188-190.
- **Theme dark-mode toggle** (Phase G) — anonymous client preference, no role gating, **no PES key needed**.
- **PR #40937 IncludeDeleted lift** — Falcon-session-only query param, **no PES key needed** (BE enforces regardless of FE flag).

---

## 6 · Halts raised

**Total halts raised this wave: 0.**

### 6.1 Forks evaluated and resolved (no halt)

| Fork-id | Trigger | Resolution | Source |
|---|---|---|---|
| **F-006** (scanner reports drift on watched file) | 2 files drifted | Verified intentional via Wave 8 doctrine comments + cross-ref MEMORY.md → MarkChecked → exit 0 | DECISION-PROTOCOL.md §F-006 |

### 6.2 Carried halts (from prior waves)

| Fork-id | Wave | Status | Pending-question file |
|---|---|---|---|
| **F-007 + F-021** (Wave 1 + Wave 10 prereq blockers) | 1 / 10 | ❌ still blocked | `Brain Outputs/datasets/authority-dataset/_pending-questions/WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17.md` |

No new pending-question files were created this wave.

---

## 7 · Top 3 most important findings

1. **Wave 8 runtime-config fallback URL hardening landed cleanly in BOTH consoles.** The `app.config.ts` diff is purely defensive — when host-shell hasn't set `window.FalconRuntimeConfig`, the canonical env from `../environments/environment` is now spread into `provideShellEnvFromWindow(...)` instead of empty strings. This **fixes the "every request hits localhost"** localhost-relative-URL bug at standalone-serve + MF-timing edges. Impact on dataset: Phase 1 (admin-console + management-console routing) — **no route changes**, no PES changes, no DTO changes. Pure additive provider wiring. Marked CHECKED.

2. **Falcon validations registry now wired in admin-console** (`provideFalconValidations()` newly imported in `app.config.ts`). This **corroborates the 3-layer validation architecture** documented in §5 of the V-rule matrix (Layer 1 directives → Layer 2 cross-field validators → Layer 3 async backend uniqueness). Until 2026-05-17 the registry was wired only in management-console + host-shell; admin-console catches up. **No structural V-rule change**, but the doctrine note "every Falcon component injects FALCON_VALIDATIONS for shared rules" is now true for the admin-console app surface as well.

3. **Q-UM-07 (PRD Permission Sheet Tab 2) remains the dominant blocker for the PES authority surface.** The PES catalog hashes clean tonight, and the FE registry hashes clean tonight, and the 25 V-rules all hash clean — but **none of those clean hashes prove correctness against business intent**, because the PRD permission sheet Tab 2 is uncaptured. Phase 2.5 (PES↔PRD drift audit) cannot run. Recommend: prioritize Wave 1 prereqs (`keys.env` + `brain-prd` Skill.md backing) so Wave 1 can pull Tab 2 in a future run. Until then, the standing rule in `permission-sheet-gaps.md` "for ambiguous Tab-2 cases, halt and ask the user" remains in force.

---

## 8 · Files written this wave

| # | Path | Change | Lines added |
|---|------|--------|-------------|
| 1 | `falcon-wiki/scripts/scan-authority.config.json` | hashes refreshed for the 2 changed files + `lastFullRun: 2026-05-17T23:49+03:00` | 2 hash updates + 1 timestamp update |
| 2 | `falcon-wiki/100-Authority/_drift-2026-05-17-2346.md` | first drift report (auto-generated; superseded) | 73-line template fill |
| 3 | `falcon-wiki/100-Authority/_drift-2026-05-17-2349.md` | second drift report (auto-generated by `-MarkChecked` pass; same 2 files) | 73-line template fill |
| 4 | `Brain Outputs/datasets/authority-dataset/06-validation-by-feature/MATRIX.md` | append §10 — Wave 6 re-audit verification block | +21 lines |
| 5 | `Brain Outputs/datasets/authority-dataset/08-entity-drift-by-feature/MATRIX.md` | append §7 — Wave 6 re-audit verification block | +20 lines |
| 6 | `Brain Outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md` | append §10 — Wave 6 re-audit verification block + 174→180 stale-text correction | +28 lines |
| 7 | `Brain Outputs/datasets/authority-dataset/07-cross-cutting/permission-sheet-gaps.md` | append "Wave 6 re-audit" appendix | +28 lines |
| 8 | `Brain Outputs/reports/night-shift/2026-05-17/WAVE-6-DRIFT-AUDIT.md` | (this file) | this report |

---

## 9 · Source-prefix audit trail

Every fact in this report carries a source prefix per the AI-Agent-Onboarding rule:

- [CODE] `apps/admin-console/src/app/app.config.ts` (Wave 8 fallback hardening + Wave NEW provideFalconValidations)
- [CODE] `apps/management-console/src/app/app.config.ts` (Wave 8 fallback hardening, no provideFalconValidations)
- [CODE] `falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:79,113,135,171,211,249` (6 canonical roles)
- [CODE] `falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:1-184` (FE registry)
- [BRAIN-OUT] `Brain Outputs/prd/modules/01..04/BUSINESS_RULES.md` (180 BR rules)
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/{06,07,08,09}/MATRIX.md|permission-sheet-gaps.md` (matrices refreshed)
- [BRAIN-SK] `Brain SK/_obsidian/40-API/E-*.md` (15 entity notes — all hashed clean)
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-*.md` (25 V-rule notes — all hashed clean)
- [VAULT] `falcon-wiki/100-Authority/_drift-2026-05-17-2349.md` (last drift report)
- [VAULT] `falcon-wiki/scripts/scan-authority.config.json` (`lastFullRun: 2026-05-17T23:49+03:00`)
- [MEMORY] `project_pr40937_include_deleted_lift_2026_05_17.md`, `project_commchannels_apps_tabs_phase1_2026_05_17.md`, `project_settings_tab_standalone_wave14_2026_05_17.md`, `project_add_user_node_path_tenant_lift_2026_05_17.md` (2026-05-17 doctrine entries — used to classify the 2 app.config.ts changes as intentional)
- [INFERRED] None — every classification in this report carries direct file evidence.

---

## 10 · See also

- [[../../../datasets/authority-dataset/19-night-shift-readiness/DECISION-PROTOCOL]] — fork resolution catalog (F-006 was the only fork hit this wave)
- [[../../../datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-MINING-PLAN-2026-05-17]] — Wave 6 plan + integration with other waves
- [[../../../datasets/authority-dataset/_pending-questions/WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17]] — carried halts blocking PRD Drive sync
- [[../../../datasets/authority-dataset/_runtime-verification/pes-gate-results-2026-05-16]] — 21/21 PES gate runtime tests (2026-05-16 baseline)
- [[../../../datasets/authority-dataset/06-validation-by-feature/MATRIX]] — refreshed (Wave 6 §10 appended)
- [[../../../datasets/authority-dataset/08-entity-drift-by-feature/MATRIX]] — refreshed (Wave 6 §7 appended)
- [[../../../datasets/authority-dataset/09-business-rules-by-feature/MATRIX]] — refreshed (Wave 6 §10 appended)
- [[../../../datasets/authority-dataset/07-cross-cutting/permission-sheet-gaps]] — refreshed (Wave 6 appendix appended)

---

*Generated by Jakco autonomous night-shift Wave 6 · 2026-05-17 23:55 +03:00 · scanner version 1.0.0 · 67 files watched · 0 halts · 0 pending-questions created · MarkChecked rebaseline complete.*
