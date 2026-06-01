---
type: cluster-index
cluster: 13-error-catalog
extracted: 2026-05-16
files: 3
total-codes: 130
v-rules-linked: 25
services-covered: 7
http-statuses: 10
purpose: "Answers 'where to look up error codes, HTTP statuses, owning services, FE handling rules'. Open to navigate to the catalog or FE-contract file."
---

# Cluster 13 — Error Catalog (Falcon Platform)

> [!tldr]
> Code-grounded catalog of every `FalconKeys.Error.*` constant surfaced anywhere in the Falcon platform (130 codes across 7 services), together with the canonical frontend error-handling contract. Use [`CATALOG.md`](./CATALOG.md) to look up "what does this code mean / who emits it / which V-rule names it / what HTTP status does it return". Use [`FE-CONTRACT.md`](./FE-CONTRACT.md) to learn how to handle any error on the FE (the 3 standing rules, anti-patterns, per-feature UX overrides).

## What this cluster answers

| Question | File · section |
|---|---|
| What HTTP status does code X return? | [`CATALOG.md`](./CATALOG.md) §1 (grouped by status) |
| Which service owns code X? | [`CATALOG.md`](./CATALOG.md) §2 (by service ownership) |
| Which error codes can surface in feature F? | [`CATALOG.md`](./CATALOG.md) §3 (by feature surfacing) |
| Which error codes does V-rule R name? | [`CATALOG.md`](./CATALOG.md) §4 (by V-rule linkage) |
| How do I write a defensive FE error handler? | [`CATALOG.md`](./CATALOG.md) §5 (defensive patterns) + [`FE-CONTRACT.md`](./FE-CONTRACT.md) |
| What's the canonical FE error-handling contract? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §1 (3 standing rules) |
| What's the `ServiceOperationResult<T>` shape? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §2 |
| Which UI surface (toast / dialog / inline / redirect / lockout) for status N? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §3 (status → UX mapping) |
| What FE anti-patterns must we avoid from the old UI? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §5 (6 anti-patterns) |
| Why does login lockout use a full-screen page? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §4.1 |
| Why does Forgot-Password OTP stay silent on wrong code? | [`FE-CONTRACT.md`](./FE-CONTRACT.md) §4.2 |

## File list

| File | Purpose | Size |
|---|---|---|
| [`_INDEX.md`](./_INDEX.md) | This file — cluster entry MOC | small |
| [`CATALOG.md`](./CATALOG.md) | Full error-code catalog (130 codes by status / service / feature / V-rule) + 3 defensive coding patterns | large |
| [`FE-CONTRACT.md`](./FE-CONTRACT.md) | Frontend error-handling contract — 3 standing rules, status→UX mapping, 6 anti-patterns from old UI, 7 per-feature UX overrides, pre-merge checklist | large |

## Quick answers

### "Which error codes does the Add Client wizard surface?"

[`CATALOG.md`](./CATALOG.md) §3.1 — broken down by step (1 = Basic Info · 2 = Settings · 3+4 = CommChannels/Apps · 5 = Account Owner · cross-cutting). Includes the partial-failure path (`CreateIdentityUserFailed`) where the Account is created server-side before Identity hop fails.

### "What HTTP status does `InsufficientBalance` return?"

[`CATALOG.md`](./CATALOG.md) §1.7 — `422 Unprocessable Entity`. Charging service, no `[ErrorHttpStatus]` decoration (HTTP `[INFERRED]` from suffix pattern + handler-throw convention).

### "Which V-rule governs `DuplicateUsername`?"

[`CATALOG.md`](./CATALOG.md) §4 — `V-username-format-uniqueness-immutable` (HTTP 409). The code is shared by Identity (`CreateUserRequest`) and Commerce (Add Client Step 5).

### "How do I handle `UserLocked` (423) on the FE?"

[`FE-CONTRACT.md`](./FE-CONTRACT.md) §4.1 — full-screen static page, no retry button, no "try again" CTA. Status reset requires admin flip (BR-UM-08). Same UI for `OtpResendLimitExceeded` (422).

### "Can I display the localized error message directly?"

[`FE-CONTRACT.md`](./FE-CONTRACT.md) §1 Rule 2 — yes. `err.error?.errorMessages?.[0]` is already localized by the backend's `ErrorLocalizer` (en/ar resource files); display verbatim. Re-translating client-side risks drift.

### "Can I branch UI copy on `FalconKeys.Error.*` codes?"

[`FE-CONTRACT.md`](./FE-CONTRACT.md) §1 Rule 3 — **no**. Branch on HTTP status, not codes. Codes are for logging / telemetry / debug overlays only. Anti-pattern §5.1 in FE-CONTRACT lists this as the #1 sin in the old UI.

### "Which feature does `NoApplicableRate` surface in?"

[`CATALOG.md`](./CATALOG.md) §3.2 + §3.3 + §3.7 — `comms-hub` (Do-Payment popup), `marketplace-applications` (activation), `testing-charging` (simulator). FE shows non-actionable "Service not configured" copy per V-charging-no-applicable-rate, no retry CTA.

### "What's the partial-failure UX when Add Client Step 5 fails after Account is created?"

[`FE-CONTRACT.md`](./FE-CONTRACT.md) §4.7 — preserve wizard state, toast "Account created but Account Owner creation failed — contact support". Retry endpoint may differ from original (documented gap).

## Cross-references to other clusters

- [`../00-INDEX.md`](../00-INDEX.md) — top dataset entry
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — V-rule × feature cross-cut matrix (§7 has the FE contract recap)
- [`../06-validation-by-feature/_INDEX.md`](../06-validation-by-feature/_INDEX.md) — validation cluster entry
- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — 7-feature parity grid
- [`../04-feature-parity-matrix/`](../04-feature-parity-matrix/) — 7 `<feature>.compare.md` notes (per-feature error surfacing)
- [`../02-statuses/`](../02-statuses/) — status enums (e.g. `UserStatus.Locked` is what `UserLocked` 423 corresponds to)
- [`../01-roles/`](../01-roles/) — role notes (permission errors like `Forbidden`, `UnauthorizedAction` route through these)
- [BRAIN-OUT] `understanding/backend/<service>/ERRORS.md` — source per-service catalogs (commerce / identity / charging / contact-group / provisioning / templates / access)
- [BRAIN-OUT] `Brain SK/_obsidian/30-Validation/V-*.md` — 25 V-rule notes
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md` — Add Client UX mapping (golden worked example)
- [BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` — original FE contract referenced by every V-rule note
- [BRAIN-OUT] memory: `project_old_ui_dataset_2026_05_16.md` — source for anti-pattern citations

## Source-prefix legend (used throughout the cluster)

- `[CODE]` — file:line citation from actual source
- `[BRAIN-OUT]` — dataset / understanding reference
- `[INFERRED]` — bridging reasoning the user must verify

## Statistics

- **Total codes catalogued:** 130
- **Services covered:** 7 (Commerce · Identity · Charging · Provisioning · Contact-Group · Templates · Access/PES)
- **HTTP statuses spanned:** 10 (400 · 401 · 403 · 404 · 409 · 410 · 422 · 423 · 429 · 5xx)
- **V-rules linked:** 25 (each maps to 2-8 codes — see [`CATALOG.md`](./CATALOG.md) §4)
- **Defensive patterns documented:** 3 ([`CATALOG.md`](./CATALOG.md) §5)
- **Anti-patterns documented:** 6 ([`FE-CONTRACT.md`](./FE-CONTRACT.md) §5)
- **Per-feature UX overrides:** 7 ([`FE-CONTRACT.md`](./FE-CONTRACT.md) §4)

## Vault graph projection (deferred)

When this cluster is mirrored to the Brain SK vault (`Brain SK/_obsidian/40-Authority/13-error-catalog/`) and the Falcon SoT vault (`falcon-wiki/100-Authority/13-error-catalog/`), the projection follows the Phase 4 pattern set in `00-INDEX.md`:

- `40-Authority/13-error-catalog/README.md` — short MOC linking to the 3 files in `_mounts/brain-outputs/...`
- Each V-rule note in `30-Validation/` will gain a `[[Error Catalog]]` back-link in its "Backend enforcement" section.
- The HTTP-status-to-UX table from `FE-CONTRACT.md` §3 becomes a Dataview view on the cluster page.
