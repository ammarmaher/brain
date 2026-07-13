---
name: project_phone_field_country_code_split_gap_plan_2026_06_07
description: "Falcon phone-field — dependency-free library-grade rewrite (metadata + engine) that auto-detects country code from API string, splits it from input, and never doubles it on save. Backend untouched. All 5 consumers inherit via shared wrapper."
metadata: 
  node_type: memory
  type: project
  originSessionId: 954464e9-7168-4bc5-9948-daf9fbe0d280
---

**Falcon phone-number country-code SPLIT — IMPLEMENTED (dependency-free, library-grade)** (claude, 2026-06-07, FE-only, NO commits, NO backend change). User report: User Profile loaded `+966795604021` from API → shown in input AND dropdown (duplicated). Asked for: (1) auto-detect code from API string, (2) cover all places that use `<falcon-angular-phone-field>`, (3) NO external library, (4) match what real libraries do, (5) NO backend change (value stays a `string`).

**ROOT CAUSE (pre-fix).** [CODE] `libs/falcon-ui-core/src/components/falcon-phone-field(-tw)/*.tsx` had `@Prop({mutable:true}) value=''` with **NO `@Watch('value')` and NO parse** — `digitsOnly()` ran ONLY on user keystrokes, never on a programmatic value. The Angular wrapper's `writeValue` blindly forwarded the E.164. Save round-tripped `composeFullNumber('+966', digitsOnly('+966...'))` = **`+966966...`** (double code = data corruption). API contract: `phoneNumber: string` (single field, full E.164), NO separate `countryCode` field anywhere → MUST parse out of the string.

**ARCHITECTURE (no external lib — replaces ngx-intl-tel-input/google-libphonenumber for the Falcon use-case):**

1. **`falcon-phone-field.metadata.ts`** — hand-authored country dataset. RICH rows (GCC+MENA+top-expat+major Western/Asian, ~30): `{iso, name, dialCode, nationalPrefix?, lengths[], mobilePattern?, format?, example?, priority}`. TAIL (~50): `[iso,name,dialCode]` only → still detected, still has flag. Flag emojis DERIVED from ISO-2 via `isoToFlagEmoji()` (regional-indicator letters) — no per-row maintenance. ~80 countries total. Longest-dial-code-prefix detection map + priority tie-break (+1 → US, not CA).

2. **`falcon-phone-field.engine.ts`** — 6 pure functions, fully unit-tested: `parsePhone(raw, defaultIso)` (the brain: normalize `+`/`00`/spaces, longest-prefix detect, strip trunk, validate lengths, return `{iso, dialCode, national, e164, valid, reason}`); `toE164(iso, national)` (compose, single dial code, trunk-0 stripped never re-added); `validateNational` (per-country length); `formatNational` (As-You-Type mask, opt-in); `placeholderFor` (country-specific from example); `maxDigitsFor` (drives input maxlength); `digitsOnly`.

3. **Wiring (all 5 consumers inherit via the shared chokepoints):**
   - `falcon-phone-field.utils.ts` → `DEFAULT_PHONE_COUNTRIES` now sourced from metadata; `composeFullNumber` delegates to `toE164`; new `splitInternationalNumber` wraps `parsePhone`. Existing exports preserved.
   - BOTH Stencil components (`falcon-phone-field.tsx` shadow + `falcon-phone-field-tw.tsx` light) → added `@Watch('value') normalizeIncomingValue()` (only fires when raw starts with `+`/`00` → idempotent, no loops); `buildDetail` uses `toE164` (trunk-0 safe, single code); `handleInput` re-detects on paste of an international value; input gets `dir="ltr"` (RTL safety), `placeholder = placeholderFor(country)`, `maxLength = maxDigitsFor(country)`.
   - Angular CVA wrapper (`falcon-phone-field.component.ts`) → `country` becomes a getter/setter backed by `countryInput` signal; new `detectedCountry` signal + `resolvedCountry = computed(() => detectedCountry() ?? countryInput())`; `writeValue` calls `parsePhone`, sets `value()=national` + `detectedCountry()=iso`; template binds `[attr.country]="resolvedCountry()"` in BOTH render branches.

**CONTRACT GUARANTEE (the user's hard requirement):** model `[ngModel]` in/out = a plain `string` (full E.164). The `{country, national}` split exists ONLY internally for display — never sent to the backend. `phoneNumber: string` DTO untouched. Round-trip: API `"+966795604021"` → wrapper splits → input `795604021` + dropdown 🇸🇦 → user edits → wrapper composes → ngModel `"+966795604021"` → request body identical-shape string.

**CONSUMERS (5; all inherit; no per-consumer code change):** (1) User Profile / Edit User [CODE] `libs/falcon/.../user-details/components/user-details-page.component.html:453` (the screenshot bug, no `[country]`); (2) Add-Client Account-Owner [CODE] `apps/admin-console/.../add-client-wizard/client-account-owner-step/.html:122` (`[country]="'SA'"`); (3) Add-User Personal admin [CODE] `apps/admin-console/.../add-user-wizard/user-personal-step/.html:120`; (4) Add-User Personal mgmt [CODE] `apps/management-console/.../add-user-wizard/user-personal-step/.html:120`; (5) Forgot-Password [CODE] `apps/host-shell/.../auth/forgot-password-flow/.html:60` (`country="SA"`, uses `saudiPhoneValidator` — emitted `+966\d{9}` E.164 still matches). Dead `falcon-phone-mask.directive.ts` has 0 live consumers (left in place — separate cleanup).

**ULTRA-CODE VERIFY (2 workflows, 13 agents total; 2nd workflow's correctness+dataset agents completed; library-parity agent rate-limited — completed by manual inline review).** Real findings APPLIED:
- **Engine** — `parsePhone('+966')` returned `e164:'+966'` (cosmetic — no consumer read this field path) → now returns `e164:''`. Symmetric with the empty/bare paths.
- **Metadata** — adversarial dataset audit flagged 6 real issues, ALL FIXED: (a) **LB** missing `nationalPrefix '0'` + buggy `mobilePattern` (`'71123456'` failed its own regex) → added trunk + fixed regex to `/^(3\d{6}|[78]\d{7})$/`; (b) **IN** missing `nationalPrefix '0'` → added; (c) **KW** `^[569]\d{7}$` rejected valid `+9654…` Viva/STC blocks → `[4569]`; (d) **BH** `^3\d{7}$` rejected valid `+9736…` mobiles → `[36]`; (e) **SD** `^9\d{8}$` rejected valid `+2491…` Sudatel → `[19]`. Non-issues left as-is (US `^\d{10}$` permissive but safe; AE/YE same; RU/KZ +7 priority tie informational).

**ROUND-2 ULTRA-CODE FIXES (2nd verification workflow completed all 3 agents — code-correctness + library-parity + dataset; 5 real issues caught & fixed):**
- **BUG #1 (CRITICAL — silent data corruption)** Angular wrapper's `detectedCountry` was mutated ONLY in `writeValue` — NOT in `handleInput`/`handleCountryChange`. Pathological repro: user picks EG from dropdown → `formControl.setValue('+966512345678')` → writeValue parses → iso='SA' → `detectedCountry.set('SA')` BUT resolvedCountry hadn't actually changed (was 'SA' from init) → `[attr.country]` no-op → Stencil internal country stays 'EG' → user blurs → buildDetail uses Stencil country 'EG' → emits `+20512345678` (EG dial on SA national) → form saves a CORRUPTED E.164. **Fix:** `handleInput` and `handleCountryChange` now call `this.detectedCountry.set(detail.country)` so the Angular signal tracks Stencil's authoritative state on every event.
- **BUG #3 (HIGH — contract drift)** `buildDetail.nationalNumber` was `digitsOnly(this.value)` (raw, included trunk-0) — typing '0551234567' under SA emitted `nationalNumber='0551234567'` (10 digits) even though the wire value '+966551234567' was correct. **Fix:** re-parse via `parsePhone(this.value, this.country)` to get the trunk-stripped NSN, in BOTH Stencil components.
- **M1 (CRITICAL for SA audience)** `digitsOnly` (`/\D+/g`) stripped Arabic-Indic digits (U+0660–0669) → a Saudi user pasting their own number from WhatsApp in Arabic UI ('+٩٦٦٥٥١٢٣٤٥٦٧') saw the field CLEAR. **Fix:** new `normalizePhoneInput()` in the engine maps Arabic-Indic + Eastern Arabic-Indic + full-width digits → ASCII before `digitsOnly` runs; applied in `parsePhone` and Stencil `handleInput`.
- **M2 (HIGH)** RTL bidi marks (U+200E LRM / U+200F RLM / U+202A-E / U+2066-9) before a '+' made `startsWith('+')` false → fell into bare-national branch → corruption. **Fix:** `normalizePhoneInput` strips these.
- **BUG #2 (UX, doc clarification)** Interactive typing of '+' was wiped because partial '+'/'+9'/'+96' parses to `national=''`. **Decision:** doc-clarified that interactive '+' typing is NOT supported — country comes from dropdown. Paste-detection covers the real use case.

Round-2 also DECLINED-AS-OUT-OF-SCOPE (documented as future): H1 NANP non-US/CA country fan-out (BS/JM/DO/PR — would need leading-digit trie), H2 strict mobile-pattern enforcement (kept advisory so landlines aren't false-rejected; OTP flows use existing validators), M3 As-You-Type display formatting (engine ready, no UI opt-in prop yet), L1-L6 polish (ARIA listbox keyboard nav, US `^\d{10}$` redundancy, autofill-without-`+`).

**TESTS: 112/112 engine tests green** (now includes 5 new round-2 tests: Arabic-Indic normalization, Eastern Arabic-Indic, full-width digits, bidi-mark stripping, WhatsApp-shape paste) (90 acceptance A1-A9 / guardrail B1-B8 + 10 adversarial edge-cases [bare `+`, just dial code, US no-trunk, double-write idempotency, bare-national-starts-with-foreign-code, IDD `00`+known-code, unknown ISO no-`++`] + 7 metadata-fix regressions including cross-check `every rich-country example satisfies BOTH lengths AND mobilePattern`). Consumer-app tests: admin-console 835/835, management-console 635/635 — NO regressions. The 2 pre-existing `falcon-table-tw.shadow.spec.ts` failures are unrelated (sticky-actions table cells, untouched by this work).

**BUILDS GREEN:** `nx build falcon-ui-core` (Stencil runtime regenerated, 35s), `admin-console`, `management-console`, `host-shell` — all 4 EXIT 0. Live in-app UI verification pending FE Docker rebuild + user click-through.

**FILES TOUCHED (8 total, no app-source changes):**
- NEW: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.metadata.ts` (~150 lines, dataset+lookup)
- NEW: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.engine.ts` (~170 lines, 6 pure functions)
- NEW: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.engine.spec.ts` (~290 lines, 107 tests)
- MOD: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.utils.ts` (sources metadata+engine, additive `splitInternationalNumber`)
- MOD: `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx` (+@Watch+dir+placeholder+maxLength+paste-detect)
- MOD: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.tsx` (same as -tw)
- MOD: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.ts` (country getter/setter+detectedCountry+resolvedCountry computed+writeValue split)
- MOD: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.html` ([attr.country]=resolvedCountry())

Related [[project_edituser_nationalid_iqama_not_reflected_readdto_drift_2026_06_07]] · [[reference_falcon_input_number_tw_hidden_on_rerender_rootcause_fix_2026_06_07]].
