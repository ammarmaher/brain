---
type: decision-resolution
purpose: resolve-9-open-questions-from-implementation-plan-v2
created: 2026-05-16
related-plan: 15-IMPLEMENTATION_PLAN.md (v2)
status: resolved (locked unless user overrides)
---

*** Add Client — 9 Open Questions, Resolved ***
*** Evidence-grounded decisions. Each lockable or open per the user's call. ***

# 🔐 Open Questions — Resolved

> The 9 implementation blockers from Plan v2 §10, each researched against the actual codebase + backend understanding + memory. Recommended answer per question, with the evidence that produced it. **Where the evidence is unambiguous, the answer is LOCKED. Where judgment is needed, the recommendation is flagged for explicit user sign-off.**

---

## 🔥 Top-line surprise from this research

**The playbook's "drift #1 HIGH" claim is wrong.** I researched Q3 first and found a clean answer that simplifies everything.

The 13-GAPS_AND_DRIFTS file in this folder says PRD uses `Normal/Advanced` and backend uses `Low/Medium/High/Strict` — and labels this drift as HIGH severity (Q-UM-12). The actual TypeScript enum in the workspace is:

```
export const enum ePasswordSecurityLevel { Normal = 1, Advanced = 2 }
```

— matching PRD exactly. The 4-value `Low/Medium/High/Strict` claim in the playbook is from older notes that no longer reflect the codebase. **Drift #1 is dead. No mapping needed. Use Normal/Advanced as both UI label AND wire value.**

This Light Learning event should propagate back to update the playbook's drift list when convenient.

---

## Q1 — Step 2 Password Policy endpoint: exists or not?

### Evidence

- **Identity ENDPOINT_REGISTRY** documents: `POST /api/user/generate-password` — `GeneratePasswordRequest(PasswordSecurityLevel)` → `GeneratePasswordResponse(Password)`. Marked **Anonymous** (overrides group policy).
- Existing **add-user-wizard `services.ts`** already implements `generatePassword(level: ePasswordSecurityLevel): Observable<string>` — confirming the endpoint is real and FE-callable.
- The endpoint is a password **GENERATOR**, not a "policy rules" loader. It produces the actual password the AO will receive, given the chosen security level.

### Resolution

**LOCKED — there is no separate "password policy" endpoint. Instead:**

- Step 2 picks the `ePasswordSecurityLevel` (Normal / Advanced) — this is metadata captured in `AccountSettings`
- Server-side at account creation, the AO password is generated based on this level
- Step 5 (Account Owner) does NOT take a password from the user — per playbook 06-STEP_5: "server-generated; not rendered" — the AO sees the password ON the credential-delivery message

**What this means for the validation/init layer:**

- Step 2 needs NO async init call for "password policy" — the level dropdown is a 2-value static enum
- Step 5 needs NO password validator — there is no password input
- If a future flow wants to PREVIEW the generated password (e.g., for admin to see before sending), call `POST /api/user/generate-password` with the chosen level

**This collapses the v2 plan's Step 2 "Password Policy bootstrap" from a real concern to a non-issue.** Updates §3 of Plan v2: Step 2 init data table no longer has a "Password Policy" row.

### Decision row

**D-2026-05-16-CLOSED-Q1** → resolved: no policy endpoint needed; security level is captured as enum, password is server-generated at submit time.

---

## Q2 — PES integration: AccessControlFacade or roll-your-own?

### Evidence

- `libs/falcon/src/core/lib/access-control/access-control.facade.ts` exists with a full production-grade pipeline:
  - `AccessControlStore` (cache + epoch versioning)
  - `AccessControlClient` (HTTP layer)
  - `CurrentSubjectBuilder` (resolves the current user's PES subject)
  - `SessionProvider` (session lifecycle)
  - `inFlight` request deduplication (two callers wanting same permission → one HTTP call)
- Uses `PesAuthorizeResourcesRequest` / `PesAuthorizeResourcesResponse` DTOs — proves the backend contract is already wired
- Pattern: ask the facade for permission decisions, NOT raw HTTP

### Resolution

**LOCKED — Step 5 uses `AccessControlFacade.authorize(...)` to load grantable roles. Do NOT call PES directly.**

**What Step 5's `services/services.ts` will do:**

1. Inject `AccessControlFacade` from `@falcon`
2. On step init: call `facade.authorize(...)` with the action key for each potential role assignment (e.g., `Add User as sys-admin`, `Add User as operation`, etc.)
3. Build the grantable roles list from the `Allow` decisions
4. Cache for the wizard session (the facade's in-flight dedup handles repeat calls)
5. If facade returns error → fallback: only `Normal User` is grantable; Light Learning event

### Decision row

**D-2026-05-16-CLOSED-Q2** → resolved: use AccessControlFacade. No new PES client.

---

## Q3 — Q-UM-12 Password level mapping (Normal/Advanced vs Low/Medium/High/Strict)?

### Evidence

- **Workspace TypeScript enum** at `apps/admin-console/.../org-hierarchy-page/models/models.ts:79`:
  ```
  export const enum ePasswordSecurityLevel { Normal = 1, Advanced = 2 }
  ```
- The wizard mapper at `add-client-wizard/models/models.ts:113-114`:
  ```
  export const toSecurityLevel = (level: ClientSecurityLevel): ePasswordSecurityLevel =>
    level === 'advanced' ? ePasswordSecurityLevel.Advanced : ePasswordSecurityLevel.Normal;
  ```
- `add-user-wizard/services/services.ts:48`:
  ```
  securityLevel: ePasswordSecurityLevel = ePasswordSecurityLevel.Normal
  ```
- Backend Identity DTO uses `PasswordSecurityLevel` parameter on `GeneratePasswordRequest` — 2-value enum
- Backend Commerce DTO uses `passwordSecurityLevel` field on `AccountSettings` — 2-value enum

### Resolution

**LOCKED — drift #1 is invalid; the 4-value `Low/Medium/High/Strict` claim in 13-GAPS_AND_DRIFTS is stale.**

The actual model is:
- FE label: **Normal** / **Advanced**
- FE enum: `ePasswordSecurityLevel.Normal = 1` / `ePasswordSecurityLevel.Advanced = 2`
- Wire value: **`1`** / **`2`** (int enum, no mapping needed)
- Backend reads the same enum

**No mapping logic needed in Step 2's validations.ts. The dropdown options ARE the wire values.**

### Decision row

**D-2026-05-16-CLOSED-Q3** → resolved: 2-value enum, no mapping. Updates 13-GAPS_AND_DRIFTS (drift #1 retired).

---

## Q4 — Q-AM-06 Finance ID source (free-text vs system-driven)?

### Evidence

- `client-information-step.component.html` lines 30-36 already wires Finance ID as a **free-text `<falcon-angular-input>`** with `[ngModel]` two-way binding and required validation
- `falcon-org-info-panel/falcon-org-info-panel.component.ts:66` (the post-create info panel) lists `{ key: 'financeId', kind: 'text', required: true }` — consistent free-text required pattern
- No evidence anywhere of a Finance-system integration endpoint
- The validators.ts library doesn't expose a "finance-id-pattern" validator (no special format imposed)

### Resolution

**LOCKED — Finance ID is a required free-text field. No system-driven mode for now.**

**Implementation for Step 1's `validations/validations.ts`:**

```
financeIdValidator = anyStringValidator(min: 2, max: 50, required: true)
```

(The current component already uses this shape — keep it.)

**Future enhancement (not in scope of this plan):** if a Finance system integration is built, the dropdown/auto-fill mechanism gets added then.

### Decision row

**D-2026-05-16-CLOSED-Q4** → resolved: free-text required. Document in code comment.

---

## Q5 — Budget Number conditional logic (Authority ∈ {Government, Charity})?

### Evidence

- The Step 1 component already has:
  - `budgetLabelKey = computed<string>(() => budgetLabelKeyForAuthority(this.value().authority))` — label text changes per authority
  - `budgetNoError` computed signal — error state tracked
  - Template renders the field with `[label]="budgetLabelKey()"` + error binding
- `budgetLabelKeyForAuthority` function exists in `add-client-wizard/models/models.ts`
- The Commerce ERRORS catalog includes `BudgetNoRequired` (400) — proving server-side enforcement exists
- 13-GAPS_AND_DRIFTS #4 says PRD origin is undocumented; conditional logic inferred

### Resolution

**LOCKED — conditional required logic stays. Concrete rule:**

```
Budget Number is REQUIRED when Authority ∈ {Government, Charity}
Budget Number is OPTIONAL otherwise
```

**Implementation for Step 1's `validations/validations.ts`:**

```
budgetNoValidator(value, authority):
  isConditionallyRequired = authority === 'Government' || authority === 'Charity'
  if (isConditionallyRequired && !value) return { required: true }
  if (!value) return null  // optional + empty = ok
  return numericValidator(value, min: 0)
```

Comment in code: `// per drift #4 — PRD origin undocumented, BE enforces via BudgetNoRequired (400); FE pre-checks to avoid round-trip`

### Decision row

**D-2026-05-16-CLOSED-Q5** → resolved: conditional required on Government/Charity authorities.

---

## Q6 — Steps 3 + 4 catalog endpoints: real or mock?

### Evidence

- **Commerce ENDPOINT_REGISTRY** documents:
  - `GET /api/Application` → `List<ApplicationResponse>` ✅ — this IS the Apps catalog
  - `GET /api/Node/{id}/applications` → per-account list (post-create, NOT pre-create catalog)
  - `GET /api/Setting?ownerId=` → settings retrieval (not a catalog)
  - **No `GET /api/Setting/comm-channel-configs`** found in the registry
- The playbook's claim of `GET /api/Setting/comm-channel-configs` is a placeholder name; the real endpoint name is different
- Current FE uses `mock-applications.ts` for both Step 3 (CommChannels) and Step 4 (Apps) preview data
- Workspace grep for "CommChannel" controller-side: requires deeper Commerce inspection

### Resolution

**SPLIT decision:**

**Step 4 (Applications): LOCKED.** Use `GET /api/Application` to load the Apps catalog. This endpoint exists in the registry.

**Step 3 (CommChannels): NEEDS BACKEND CONFIRMATION** — the playbook's endpoint name (`/api/Setting/comm-channel-configs`) is NOT in the Commerce registry. Likely real endpoint is on `CommunicationChannelController` or similar; needs a separate backend look.

**Interim plan:**

- Both Steps 3 + 4 use `mock-applications.ts` as init source for now (the existing fallback)
- Step 4 swap to `GET /api/Application` in a follow-up session once Step 4 is otherwise complete
- Step 3 swap waits on backend confirmation of the CommChannels catalog endpoint
- Light Learning event tracks each swap

**Action item for Ammar:** confirm the CommChannels catalog endpoint with backend before Step 3's real swap. Two questions:

1. What's the exact GET endpoint?
2. What's the response DTO shape?

### Decision row

**D-2026-05-16-CLOSED-Q6** → resolved: Step 4 = `GET /api/Application`; Step 3 = mock fallback + open Q for backend.

---

## Q7 — Step 5 Username max: 30 (FE tighter than BE 100)?

### Evidence

- `services/validators.ts:27-28`:
  ```
  const USERNAME_MIN = 2;
  const USERNAME_MAX = 30;
  ```
- Same file lines 124-125 enforce min/max in the username validator
- 13-GAPS_AND_DRIFTS #2 documents the drift: PRD = 30, backend allows up to 100
- FE-side is ALREADY enforcing the tighter rule

### Resolution

**LOCKED — Step 5 username FE-enforces 30 chars max.**

**Implementation for Step 5's `validations/validations.ts`:**

```
usernameValidator = (control) => {
  // sync part — already lives in services/validators.ts USERNAME_MAX = 30
  if (length > 30) return { maxLength: { max: 30, actual: length } }
  // ... + letters-digits-or-email pattern (already exists)
}
```

Then wrap with `usernameUniqueValidator(svc: AccountValidationService)` async layer.

Comment: `// per drift #2 — FE enforces 30; BE allows 100 (looser); FE tighter wins (PRD-aligned)`

### Decision row

**D-2026-05-16-CLOSED-Q7** → resolved: FE enforces 30. Already in code; just propagate to Step 5 validations/validations.ts.

---

## Q8 — Step 5 Phone format: Saudi-only or E.164?

### Evidence

- `services/validators.ts:38-39`:
  ```
  const E164 = /^\+?[1-9]\d{7,14}$/;
  const SAUDI_E164 = /^\+966\d{9}$/;
  ```
- Lines 152-165 export both validators (`phoneValidator` for E.164, `saudiPhoneValidator` for Saudi-only)
- Falcon is a Saudi-market platform per memory + glossary, but customers can have international numbers
- The `<falcon-angular-phone-field>` component supports country-code selection per Component Atlas

### Resolution

**LOCKED — Step 5 phone field accepts E.164 (broader). Saudi format is a hint, not a constraint.**

**Implementation for Step 5's `validations/validations.ts`:**

```
phoneNumberValidator = phoneValidator (the E.164 variant from page-level validators.ts)
```

**Why E.164 over Saudi-only:**
- More permissive — won't reject valid international numbers if a customer's AO is non-Saudi
- The `<falcon-angular-phone-field>` UI already shows the country flag/code as user-selectable
- Backend validates against E.164 as well (per drift #14 inference)

**If Saudi-only is required for a specific tenant:** add a tenant-level setting later (not in this plan's scope).

### Decision row

**D-2026-05-16-CLOSED-Q8** → resolved: E.164 (`phoneValidator` from validators.ts).

---

## Q9 — Cross-step wizard state: provide `AddClientStateService`?

### Evidence

- Today the wizard component holds 5 per-step `signal<FormValue>()` + 5 per-step `signal<boolean>` for valid + 5 per-step `signal<boolean>` for dirty
- The existing pattern works fine for STEP-LOCAL state
- **What needs cross-step sharing?**
  - Password Security Level (Step 2) → Step 5 uses it as input to `generatePassword(level)` when previewing (if previewed)
  - Tenant/Node context (set on wizard open) → all steps need it for validation context (e.g., uniqueness checks are scoped)
  - Loaded catalogs (if cached at wizard level, shared across CTRL+R / step revisits)

### Resolution

**LOCKED — Provide a wizard-level `AddClientStateService` for cross-step shared state.**

**Where it lives:** `add-client-wizard/services/services.ts` already exists with `AddClientApiService` for HTTP. Add a sibling class `AddClientWizardStateService` in the same file (per R-FE-009 one-file-per-type-folder rule).

**What it owns:**

- The 5 step form-value signals (moved from the wizard component)
- The 5 step valid + dirty signals (moved from the wizard component)
- `currentStep: signal<number>`
- `selectedPasswordSecurityLevel: signal<ePasswordSecurityLevel>` (from Step 2, read by Step 5 if needed)
- `tenantContext: signal<TenantContext>` (set on wizard open from the selected hierarchy node)

**Scope:** `providers: [AddClientWizardStateService]` on the `add-client-wizard.component.ts` decorator. NEVER `providedIn: 'root'` (this state is wizard-instance-scoped per R-FE-009 + Tier 2 state architecture).

**Why now and not later:** even if you only need it for Q1's resolution that NO password sharing is needed, the wizard component is already 4+ signals deep into the responsibility. Centralizing now keeps the per-step components THIN (just bound to the service's signals).

### Decision row

**D-2026-05-16-CLOSED-Q9** → resolved: new `AddClientWizardStateService` at the wizard level, NOT providedIn root.

---

## 📋 Summary table — all 9 resolved

| ID | Question | Status | Key answer |
|---|---|---|---|
| Q1 | Password policy endpoint | ✅ LOCKED | No policy endpoint needed — security level is enum, password is server-generated at submit. Step 2 init drops "policy" row. |
| Q2 | PES integration approach | ✅ LOCKED | Use `AccessControlFacade` from `@falcon`. No new PES client. |
| Q3 | Q-UM-12 password level mapping | ✅ LOCKED | **Drift #1 is dead.** `ePasswordSecurityLevel` is 2-value (Normal=1/Advanced=2). No mapping. |
| Q4 | Q-AM-06 Finance ID source | ✅ LOCKED | Free-text required (current behavior). |
| Q5 | Drift #4 Budget Number conditional | ✅ LOCKED | Required when Authority ∈ {Government, Charity}. |
| Q6 | Steps 3+4 catalog endpoints | 🟠 PARTIAL | Step 4 → `GET /api/Application` (locked). Step 3 → mock fallback (open Q for backend). |
| Q7 | Username 30 vs 100 (drift #2) | ✅ LOCKED | FE enforces 30. Already in `validators.ts`. |
| Q8 | Phone format Saudi vs E.164 | ✅ LOCKED | E.164 broader; Saudi only as UI hint. |
| Q9 | Wizard-level state service | ✅ LOCKED | New `AddClientWizardStateService` at wizard level, `providers: [...]`. |

**Result: 8 fully locked, 1 partial (Step 3 catalog backend endpoint).** Implementation can begin on Session 0 today.

---

## 📍 Updates to Plan v2 (§3, §5, §6)

Based on these resolutions, the v2 plan needs three small updates:

1. **§3 Step-init data table — Step 2 row** — DELETE "Password Policy" — no endpoint exists; FE just captures the enum
2. **§3 Step-init data table — Step 5 row** — change "PES grantable roles" handler from generic to "use `AccessControlFacade.authorize(...)`"
3. **§5 Step 5 validations matrix** — remove password rules (no password input on Step 5; password is server-generated)
4. **§7 defensive contract** — Step 3 catalog fallback to `mock-applications.ts` documented + Light Learning event

These will be applied to v2 in a follow-up commit if needed; the resolutions stand as authoritative.

---

## 🎯 What to do next

Three options:

1. **"start Session 0"** — implement the validations/ folder + async wiring for Step 1 (with all questions now resolved)
2. **"update v2 plan with resolutions"** — apply the 4 updates listed above as a `15-IMPLEMENTATION_PLAN.md` v2.1
3. **"open backend question for Q6"** — file a focused decision request asking the backend team for the CommChannels catalog endpoint shape

Recommendation: **"start Session 0"** — Q6 is a Step-3 concern; Session 0 is Step-1; you can defer Q6 finalization until Session 3.

---

## Related

- [15-IMPLEMENTATION_PLAN.md](15-IMPLEMENTATION_PLAN.md) — Plan v2 (the source of the 9 questions)
- [13-GAPS_AND_DRIFTS.md](13-GAPS_AND_DRIFTS.md) — needs update: drift #1 retired per Q3
- Identity ENDPOINT_REGISTRY — for Q1
- `libs/falcon/src/core/lib/access-control/access-control.facade.ts` — for Q2
- `apps/admin-console/.../org-hierarchy-page/services/validators.ts` — for Q7, Q8
- [[Decisions Queue]] — 9 closed rows to log

## Tags

#type/decision-resolution #flow/add-client #page/organization-hierarchy #closed-decisions
