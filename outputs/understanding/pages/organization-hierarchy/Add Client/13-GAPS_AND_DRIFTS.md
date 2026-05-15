*** Add Client — Gaps & drifts (honest SoT surprises) ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Gaps & PRD↔DTO drift

> Every documented surprise across PRD, DTO, validation, and entity layers. Read this before producing code so you can plan around the drift, not be surprised by it. Severity is called out where it matters.

## Entity reconciliation notes (E-* drift)

- [[E-account]] — `accountName` letter-prefix backend regex **missing** (handler-level only); `id` vs `accountId` collapsed (PRD distinguishes technical `id` from business `accountId`; backend single field); `financeId` **not enumerated** in `DTO_DICTIONARY` (documentation gap; presence inferred from PRD + `Info` summary); `profilePicture` write path unclear (PRD account-level picture vs backend exposes `AccountIcon` only on read response — write-side path needs handler verification); per-field `AccountOfficialData` fields **not individually documented** (DTO_DICTIONARY enumerates only ~20 `Info` fields in summary).
- [[E-node]] — `type` (root/main/sub) not exposed as response field (inferred from position); per-node `settings` not modeled (lives on Account).
- [[E-account-settings]] — **`PasswordSecurityLevel` enum vocabulary drift** (Q-UM-12 HIGH severity, PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict`); **`Enabled` toggle on `AllowedIPs` extra on backend** (PRD silent — `GetAllIpAllowlistsResponse.Tenants[].Enabled`); `MaxNodeLevels` plural vs `MaxNodeLevel` singular (cosmetic); `BalanceTransferLimitPct` vs `BalanceTransferLimit` (unit hint dropped — PRD has `Pct` suffix, backend doesn't).
- [[E-comm-channel-config]] — `accountId` vs `NodeId` operating axis (PRD accountId, backend nodeId); `visibility` enum→bool drift (PRD enum, backend `Show`/`Hide` essentially boolean); `priceValueSar` currency-suffix dropped on backend; 6-value status not exposed as single field on response DTOs; future-scheduled price change extra on backend (PRD silent).
- [[E-app-config]] — same drift items as `E-comm-channel-config`; CommChannels + Apps are **mirror endpoints** with shared `Service` nested type and shared `AppId` field name (confusing — `AppId` is the binding id for BOTH CommChannel rows AND Application rows).
- [[E-user]] — Step 5 AO uses Identity DTOs; **`Username` cap drift** (PRD 30 vs backend 100 — HIGH; FE enforces 30); `PhoneNumber` / `EmailAddress` **lack `[ThrowIfNotPassed]`** despite PRD-required (handler validates).

## The 14 honest SoT surprises

1. **PasswordSecurityLevel enum vocabulary drift (Q-UM-12, HIGH)** — PRD `Normal/Advanced` vs Identity `Low/Medium/High/Strict`. Implementation must pick a side. Recommendation: submit backend codes (`Low/Medium/High/Strict`), display PRD labels (`Normal/Advanced`).
2. **Username cap drift (HIGH)** — PRD-02 BR-UM-12 caps at 30 chars; Commerce/Identity FluentValidation caps at 100. FE must enforce 30 (tighter than backend).
3. **Finance ID PRD↔DTO gap** — PRD declares the field mandatory (BR-AM-05); backend `Info.FinanceId` presence is inferred from PRD + `Info` summary; **field not enumerated** in `DTO_DICTIONARY.md`. Documentation gap (E-account row `financeId`). Q-AM-06 open: source (manual entry vs Finance system pull).
4. **Budget Number with no PRD origin** — `BudgetNoRequired` (400) surfaces in Commerce ERRORS catalog but **no PRD line** documents this rule. Backend `Info.BudgetNo` inferred. Conditional logic (likely tied to Authority Letter Type = Government or Charity) is undocumented.
5. **AccountSettings per-field validators missing** — the four limit fields (`MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevel`, `BalanceTransferLimit`) **lack documented `[ThrowIf*]` attributes** in `VALIDATIONS.md`. Empty/negative validation is handler-level only via `InvalidAccountLimits` (422).
6. **AccountIcon write-side path unclear** — `Info.ProfilePictureInfo?` declared on the write side; read response exposes `AccountIcon` only. Handler-level mapping needs verification.
7. **Sector lookup id not surfaced** — Step 1 Sector dropdown depends on Authority Letter Type; options sourced via `GET /api/Lookup/{id}` but the lookup id is not documented.
8. **Backend extras not in PRD (read-side `Enabled` toggle on AllowedIPs)** — `GetAllIpAllowlistsResponse.Tenants[].Enabled` is exposed on the read side; PRD silent on the toggle. Treat empty allowlist as "off" until clarified.
9. **Commerce PascalCase deviation** — Commerce uses PascalCase on the wire; Identity / Contact Group / Templates use camelCase. FE serializer must switch per service. `.NET 6+ JsonOptions` may default to camelCase without explicit config — verify at runtime.
10. **Status 6-value enum not exposed as single response field** — CommChannelConfig / AppConfig status has 6 values per BR-AM-20 lifecycle, but the read DTOs do not surface it as a single field. Documentation gap.
11. **`AppId` field naming overloaded** — `Service.AppId` is the binding id for BOTH CommChannel rows AND Application rows. Intentional code reuse, not a bug — but confusing.
12. **`MaxNodeLevels` plural vs `MaxNodeLevel` singular** — cosmetic but worth a comment in TypeScript types (PRD plural, backend singular).
13. **`BalanceTransferLimitPct` vs `BalanceTransferLimit`** — unit hint (`Pct`) dropped on backend. UI displays `%` suffix; serializer maps to bare `BalanceTransferLimit`.
14. **`PhoneNumber` / `EmailAddress` lack `[ThrowIfNotPassed]`** — both are PRD-mandatory on Step 5 but DTO is missing the attribute. Handler validates. FE must enforce required to match PRD.

## Open questions / unresolved before implementation

| ID | Question | Impact if left open |
|---|---|---|
| Q-UM-12 | Password Security Level vocabulary (`Normal/Advanced` PRD vs `Low/Medium/High/Strict` backend) | Frontend mapping must be locked; risk of silent miscategorization |
| Q-AM-06 | Finance ID source — manual entry vs Finance system pull | Determines whether Step 1 has a free-text input or a system-driven readonly value |
| Q-AM-07 | Balance Transfer Limit % baseline (per-action / per-day / source-balance) | UI hint copy + handler logic |
| Q-AM-11 | Classification Category source-of-truth (hardcoded enum vs DB lookup) | Whether new categories require a release |
| Q-AM-12 | Definition of "System User" (counts what?) | Whether the `MaxSystemUserLimit` field has a meaningful runtime gate |
| Q-AM-13 | IP allowlist HTTP header name + scope | Gateway config; not a FE concern but documents the Gateway team's contract |
| Q-AM-16 | PES rule sync with Permission sheet | Runtime allow/deny correctness |
| BR-AM-39 (open) | Limit-edit enforcement when current usage exceeds new cap | Not a Step 2 create-time concern; flag for Settings tab edit flow |
| Documentation gap | `CreateAccountRequest.Info` per-field list (only ~20 fields summarized) | Per-field validation surface needs a backend drill-down before final FE form schema is locked |
| Documentation gap | `Service` nested type field list (only `AppId, PriceType` enumerated; `PriceValue` and any others not surfaced) | Steps 3+4 binding shape needs verification |

## Recommended handling (per drift)

- **Q-UM-12 (PasswordSecurityLevel):** submit backend codes, display PRD labels. Confirm mapping (`Normal ↔ Low|Medium`, `Advanced ↔ High|Strict`) when Q-UM-12 resolves.
- **Username cap (30↔100):** enforce 30 on FE; backend won't reject (looser cap).
- **PascalCase casing:** verify response shape at runtime; flip serializer per service if `.NET 6+ JsonOptions` defaults bite.
- **`Service.AppId` overload:** TS type alias `type CommChannelOrAppId = string` with JSDoc clarifying the dual-use.
- **Missing `[ThrowIfNotPassed]` on Step 5 phone/email:** FE enforces required to match PRD. Don't trust the DTO alone.
- **Per-field length cap gaps (Entity Name, Additional Address):** apply `maxLength(100)` / `maxLength(250)` as safe FE defaults; surface as open gap if backend rejects.
- **Empty allowlist semantics:** treat empty list as "off" until clarified. Surface as a gap.
- **`AccountIcon` write path:** verify handler-level mapping before relying on `Info.ProfilePictureInfo` round-tripping.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[E-account]] · [[E-node]] · [[E-account-settings]] · [[E-comm-channel-config]] · [[E-app-config]] · [[E-user]] · [[Commerce Service]] · [[Identity Service]] · [[GAPS_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
