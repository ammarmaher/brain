# PR Review Findings — PR #41631 (`final_template_management_feature`)

> Reviewer: Brain SK · 2026-05-19 · **Re-review v2** (intelligence engine + canonical repo confirmed)
> Severity: P0 BLOCKER · P1 MAJOR · P2 MEDIUM · P3 MINOR.

## Second-pass adjustments (vs. v1 review)

| Change | Reason |
|---|---|
| Repo conflict **RESOLVED** | `C:\Falcon\Falcon\falcon-web-platform-ui` confirmed canonical by user. PrimeNG is sanctioned here — F6 closed, not a violation. |
| v1 said "no Core Templates backend understanding" — **WRONG** | `understanding/backend/templates/` exists (ENDPOINT_REGISTRY, DTO_DICTIONARY, FRONTEND_CONTRACT, ERRORS). Old R5 retracted. |
| Almost filed "bodyType numeric is a P1 bug" — **retracted by two-pass** | PR code (`template-management.models.ts:84`) cites BE source `eBodyType.cs`: numeric 1/2 is verified. Re-classified as B1 (doc-vs-code conflict, P2). |
| New: **B1, B2** from backend cross-check | Contract doc conflict + Templates reachability/CORS risk. |
| Risk for `runtime-api-config` (40 importers) downgraded MED → LOW | Regression graph: the change is purely additive. |

## Findings summary

| # | Severity | File / location | Issue | Source rule | Fix | Status |
|---|---|---|---|---|---|---|
| F1 | P1 | `apps/{admin,management}-console/.../template-management/**` | Shared layer duplicated verbatim across 2 apps | Architecture / Nx boundaries | Promote to `libs/falcon` | open — required |
| F2 | P2 | whole PR | 0 `*.spec.ts` for 5860 LOC | Quality gates | Add specs | open — recommended |
| F3 | P2 | host-shell checker-level + `falcon-access.registry.ts` | PES not deep-verified | Security / PES | PES pass | open — recommended |
| F4 | P2 | Template Management business layer | No PRD located — business lifecycle unverified | Business logic | Link PRD | open — recommended |
| B1 | P2 | `understanding/backend/templates/` vs PR DTOs | Backend understanding doc (inferred) conflicts with PR code | Backend contract cross-check | Refresh backend doc | open — Brain gap |
| B2 | P2 | `environment*.ts` `baseURLCoreTemplatesGateway` | Templates may not be gateway-exposed / lacks CORS | API / integration | Verify route + CORS | open — recommended |
| C1 | P3 | `template-management.mappers.ts:52` | Order-sensitive dirty-tracking | Code-level error pass | Sort before serialize | open — minor |
| F5 | P3 | checker-assignment load catch | `console.error` left in | Quality gates | Optional logger | open — minor |
| F6 | RESOLVED | 8 PrimeNG-importing files | PrimeNG in new code | — | Canonical repo confirmed → sanctioned dependency, **not a violation** | closed |

## Findings detail — code evidence

### F1 — P1 — Template Management shared layer duplicated across two apps

- **File:** `apps/admin-console/.../template-management/**` + `apps/management-console/.../template-management/**`
- **Source rule:** Architecture / structure governance — no duplicated logic, Nx lib boundaries

**Code shot (proof of duplication):**

```text
$ diff apps/admin-console/.../template-management/models/template-management.models.ts \
       apps/management-console/.../template-management/models/template-management.models.ts
        ← no output: byte-identical

A  apps/admin-console/.../utils/template-management.mappers.ts
A  apps/management-console/.../utils/template-management.mappers.ts
A  apps/admin-console/.../services/template-management-api.service.ts
A  apps/management-console/.../services/template-management-api.service.ts
```

**What is wrong:** Models, mappers, API service and 5 sub-components exist as two
identical copies. Every future fix must be applied twice; the copies will drift.

**Suggested fix:** Move the shared layer into `libs/falcon` (`shared-data-access`
for models/mappers/API, `shared-ui` for the sub-components). Each app keeps only its
shell (`template-management.component`, `template-config-editor`, `routes.ts`).

### F2 — P2 — No automated tests

- **File:** whole PR (51 added files, +5860 LOC) · 0 `*.spec.ts`
- **What is wrong:** A test plan exists in `docs/checker-assignment-integration-proposal.md` but no specs were committed. `mergeForEdit` / `buildRowsForCreate` are even documented "Exported for unit tests" — yet untested.
- **Suggested fix:** Add specs for `template-form.service`, `template-management.mappers`, `mergeForEdit`/`buildRowsForCreate`, and the permissions/checker step.

### F3 — P2 — Checker-level / PES changes not deep-verified

- **File:** `host-shell/.../permissions-privilege-step`, `checker-level-rows`, `checker-assignment-api.service.ts`, `libs/falcon/.../shared-types/lib/constants/falcon-access.registry.ts`
- **What is wrong:** Security-sensitive changes reviewed at governance level only; not validated against the PES Subject Contract (`u:<ZitadelUserId>@<ns>`).
- **Suggested fix:** Dedicated PES pass — verify subject IDs, `authorizeResources` keys, and the FE-before-BE deny fallback.

### B1 — P2 — Backend understanding doc conflicts with the PR's contract (Brain knowledge gap)

- **File:** `Brain Outputs/understanding/backend/templates/{DTO_DICTIONARY,FRONTEND_CONTRACT}.md` vs PR DTOs
- **Source rule:** Backend contract cross-check (intelligence engine)

**Code shot — PR claims numeric encoding, citing BE source:**

```text
// apps/.../template-management/models/template-management.models.ts:84
* Numeric encoding for `bodyType` over the wire. Verified against the BE
* source (falcon-core-templates-svc/.../Domain/Enums/eBodyType.cs):
*   1 → unrestricted, 2 → restricted.
export const BE_BODY_RESTRICTED: BeBodyType = 2;
```

```text
// Brain Outputs/understanding/backend/templates/DTO_DICTIONARY.md
| `CommunicationChannelConfigDto` | ... (inferred — verify by reading the DTO file) |
- **BodyType** — likely an enum: `Plain`, `Template`, `Interactive`, … (verify)
// FRONTEND_CONTRACT.md PUT example uses:  bodyType: 'Restricted'   (string)
// FRONTEND_CONTRACT.md:  "No multi-language fields on Templates DTOs"
//   — but PR's BeChannelConfigPartial / UserCheckerLevelResponse read
//     communicationChannelNameEn / NameAr off the Templates response.
```

**What is wrong:** Two truth sources disagree on (a) `bodyType` encoding
(numeric vs string) and (b) whether Templates DTOs carry channel-name fields. The
backend understanding doc **explicitly self-flags as inferred**; the PR cites the
actual BE enum source. Per source-of-truth order, code citing BE source outranks an
inferred doc — so the **likely conclusion is the backend doc is stale**, not that
the PR is wrong. But the conflict means the FE↔BE contract is formally UNVERIFIED.

**Suggested fix:** Refresh `understanding/backend/templates/` against the live
`falcon-core-templates-svc` source (`eBodyType.cs` + the actual response DTO
files). If the doc was stale, B1 closes with no PR change. If the PR is wrong,
`bodyType === 2` would silently return zero restricted channels — re-classify to P1.

### B2 — P2 — Templates service browser-reachability / CORS

- **File:** `apps/host-shell/src/environments/environment.ts` + `environment.prod.ts`

**Code shot:**

```text
+ baseURLCoreTemplatesGateway: 'http://localhost:7264/'        // environment.ts
+ baseURLCoreTemplatesGateway: 'https://templates-api.falconhub.space/'  // prod
```

**What is wrong:** `understanding/backend/templates/FRONTEND_CONTRACT.md` states
Templates is **not exposed through Core or System Gateway** and its `appsettings.json`
**lacks a CORS section**. In dev the FE calls `localhost:7264` directly from
`localhost:4200` — a cross-origin request that CORS will block unless CORS was added
after the scan. The prod host `templates-api.falconhub.space` implies new infra the
scan didn't see.

**Suggested fix:** Confirm Templates is reachable from the browser — either a
gateway route (`templates-cluster` in the gateway route map) or the direct host
with a CORS policy allowing the web-platform origin. Verify before relying on the
checker feature in a deployed environment.

### C1 — P3 — Order-sensitive dirty-tracking

- **File:** `template-management.mappers.ts:52`, used by `template-form.service.ts:90`

**Code shot:**

```text
/** Stable string snapshot for dirty-tracking. */
export function serializeChannels(channels: ChannelLocalState[]): string {
  return JSON.stringify(channels);          // order-sensitive
}
// template-form.service.ts:90
return serializeChannels(this.channels) !== this.pristineSnapshot;
```

**What is wrong:** `JSON.stringify` preserves array order. `level1UserIds` /
`level2UserIds` are `string[]` from a multiselect. Re-selecting the same users in a
different order changes the string → `isDirty` true with no real change → spurious
unsaved-changes prompt. (False positives only — never a missed change.)

**Suggested fix:**

```text
export function serializeChannels(channels: ChannelLocalState[]): string {
  const norm = channels
    .map((c) => ({ ...c,
      level1UserIds: [...c.level1UserIds].sort(),
      level2UserIds: [...c.level2UserIds].sort() }))
    .sort((a, b) => a.channelId.localeCompare(b.channelId));
  return JSON.stringify(norm);
}
```

### F5 — P3 — console.error in load catch

- **File:** checker-assignment load catch
- **Code shot:** `error: (err) => { console.error('Failed to load checker assignments:', err); }`
- **What is wrong:** Functionally fine (error caught, empty list degrades cleanly). Flagged only because raw `console.error` bypasses central logging.
- **Suggested fix:** Optionally route through a shared logger, or surface a user-visible error/empty state.

## Verified-clean (code pass found no defect)

- All 18 new `.subscribe(...)` calls guarded with `takeUntilDestroyed(this.destroyRef)` — no subscription leaks.
- API services defensively coerce a non-array `result` to `[]` (`getRestrictedChannels`, `getUserCheckerLevels`).
- No `any` holes / unsafe casts in the changed services and mappers.
- `runtime-api-config.ts` + `falcon-multiselect` changes are **purely additive** — no behavior change for the 40 / 1 existing consumers.
- Endpoints in `checker-assignment-api.service.ts` match the Templates `ENDPOINT_REGISTRY.md` exactly (`/communication-channel-configs`, `/user-checker-levels`).

## Severity counts

| Severity | Count |
|---|---|
| P0 BLOCKER | 0 |
| P1 MAJOR | 1 |
| P2 MEDIUM | 5 |
| P3 MINOR | 2 |
| Resolved/closed | 1 (F6) |

## Conflicts / ambiguities

| Conflict | Sources | Safest action |
|---|---|---|
| `bodyType` encoding + channel-name fields | PR code (cites BE source `eBodyType.cs`) vs `understanding/backend/templates/` (self-flagged inferred) | Refresh the backend understanding doc against live BE source. Treat FE↔BE contract as UNVERIFIED until then (B1). |
| Templates gateway exposure | PR env config (assumes reachable) vs FRONTEND_CONTRACT scan ("not exposed, no CORS") | Verify gateway route + CORS before relying on the feature (B2). |
