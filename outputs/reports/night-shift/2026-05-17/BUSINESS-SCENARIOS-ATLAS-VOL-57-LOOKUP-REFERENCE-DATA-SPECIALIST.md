# Volume 57 — Lookup & Reference-Data Specialist Guide

> **Specialist depth:** The operating model for all reference-data tables in Falcon — countries, mobile/fixed NDCs, operators, providers, currency codes, languages — and the lookup-service pattern that consumes them on the frontend.
>
> **Authority:** Vol 44 §8 (Destination Identification truth tautologies) + Vol 51 §V51-PROVISIONING-ADDENDUM Finding §4 (Mongo collections `Lookups` + `LookupValues` confirmed) + BRD-extracted destination tables.

---

## §1 — The Lookup Catalog

### §1.1 Core lookup types (confirmed code-side per Wave 18b)

Provisioning service has two Mongo collections:
- **`Lookups`** — the lookup-type registry (e.g., one entry for "Country", another for "City").
- **`LookupValues`** — the actual values per lookup type.

[INFERRED] schema:
```
Lookups {
  id: ObjectId,
  code: 'Country' | 'City' | 'MobileOperator' | 'FixedOperator' | 'Provider' | 'Currency' | 'Language' | ...,
  name: MultiLanguageName,
  isHierarchical: boolean   // e.g., City depends on Country
}

LookupValues {
  id: ObjectId,
  lookupId: ObjectId,        // FK to Lookups
  parentValueId?: ObjectId,  // for hierarchical (City's parent = Country)
  code: string,              // e.g., 'KSA', '966', '+966'
  name: MultiLanguageName,
  metadata: { ... },          // type-specific extras
  isActive: boolean,
  displayOrder: number
}
```

### §1.2 Why two collections (not embedded)

- **Decoupling** — lookup types are static schema; values are mutable data.
- **Hierarchy** — `LookupValues.parentValueId` supports parent-child (City → Country).
- **Multi-language** — both name fields use `MultiLanguageName(En, Ar)`.
- **Activation** — `isActive` allows soft-deactivation of values (deprecated countries).

### §1.3 Frontend consumption (Wave 15b Info-Panel memory)

Per prior memory entry on Info-Panel, the FE has a `LookupService`:
- `getLookup(lookupType: LookupId, options?: { code?: string })` — fetches values.
- `LookupValueResponse` includes `code`, `id`, `name.{en,ar}`.
- Returns `Hook<LookupValueResponse>[]` — a cached reactive subscription.
- Per-country lookups (e.g., cities for a country) are filtered via `{ code: countryCode }`.

---

## §2 — Country Table (CC = Country Code)

### §2.1 Saudi Arabia (KSA) as primary

| Field | Value |
|---|---|
| Country code | **966** |
| Name (En) | Saudi Arabia |
| Name (Ar) | المملكة العربية السعودية |
| Total phone length | **12 digits** (3 CC + 9 N(S)N) |
| Fixed NDC length | 2 |
| Mobile NDC length | 2 |

### §2.2 Zone 9 (Middle East)

| Country | CC | Total length | Fixed NDC len | Mobile NDC len |
|---|---|---|---|---|
| Saudi Arabia | 966 | 12 | 2 | 2 |
| Iran | 98 | 12 | 2 | 2 |
| Jordan | 962 | 12 | 1 | 2 |
| UAE | 971 | 12 | 1 | 2 |

### §2.3 NANP (CC = 1)

25+ jurisdictions share CC=1. Per Vol 44 §8.5: USA, Canada, Bermuda, Bahamas, Cayman, Jamaica, Trinidad, Puerto Rico, US Virgin Islands, Anguilla, Antigua/Barbuda, Barbados, BVI, Dominica, Dominican Republic, Grenada, Guam, Montserrat, Northern Mariana Islands, St Kitts/Nevis, St Lucia, St Vincent/Grenadines, Sint Maarten, Turks/Caicos, American Samoa.

NDCs (NPAs) are NOT separable into Fixed vs Mobile. All routed via "International" provider.

### §2.4 Zone 7 (Russia + Kazakhstan)

CC = 7. Two distinct countries share the code — distinguished by the second-digit NDC.

### §2.5 Africa (Egypt as example)

| Country | CC | Total length | Mobile NDC len |
|---|---|---|---|
| Egypt | 20 | 13 (2 CC + 11 N(S)N) | 2 (10/11/12/15) |

---

## §3 — Mobile NDC × Operator Tables

### §3.1 KSA mobile NDCs (2-digit)

| NDC | Operator |
|---|---|
| 50, 53, 55 | **STC** (Saudi Telecom Company) |
| 54, 56 | **Mobily** |
| 58, 59 | **Zain** |
| 51 | **Salam Mobile** (510, 511, ...) |
| 570, 571, 572 | **Virgin Mobile** (MVNO via 57) |
| 575 | **Red Bull Mobile** |
| 576, 577, 578 | **Lebara Mobile** |

### §3.2 KSA fixed NDCs (2-digit)

| NDC | Old NDC | Region | Cities |
|---|---|---|---|
| 11 | 01 | Riyadh | Riyadh, Al Kharj |
| 12 | 02 | Western | Makkah, Jeddah, Taif, Rabigh |
| 13 | 03 | Eastern | Dammam, Khobar, Dhahran, Jubail |
| 14 | 04 | Al-Madinah & Tabuk | Al-Madinah, Tabuk, Yanbu |
| 16 | 06 | Qassim & Hail | Buraidah, Hail, Majma |
| 17 | 07 | Southern | Abha, Najran, Jizan, Khamis Mushait |

### §3.3 Kazakhstan mobile NDCs (Zone 7)

| NDC | Operator |
|---|---|
| 700, 708 | Altel |
| 701, 702, 777 | Kcell |
| 705, 771, 775, 778 | Beeline |
| 707, 776 | Tele2 |

### §3.4 Russia mobile NDCs (Zone 7, range 9xx)

| NDC Range | Primary Operators |
|---|---|
| 900-909 | Beeline / Rostelecom / Tele2 / MTT / SberMobile / AKOS |
| 910-919 | **MTS** |
| 920-939 | **MegaFon** (with VTB/Sber sharing 930, 933) |
| 935, 940, 942-946 | Reserve |
| 941 | GLONASS |

### §3.5 Why operators matter

Falcon's per-destination pricing depends on (Country, NDC, Operator) — different operators charge differently for SMS/Voice termination. The lookup must resolve to the right operator for accurate billing.

---

## §4 — Provider Mapping

### §4.1 Concept

A **Provider** is Falcon's third-party termination partner per (Country, channel-type):
- For SMS in KSA: maybe Twilio + a regional aggregator.
- For Voice in KSA: a SIP partner.
- For NANP: a single "International" provider.
- For Egypt: a per-operator routing decision.

### §4.2 Storage [INFERRED]

```
LookupValues with code='Provider' linking via metadata:
{
  code: 'TwilioKSA',
  name: 'Twilio Saudi Arabia',
  metadata: {
    targetCountries: ['966'],
    targetOperators: ['50', '53', '55', '54', '56', '58', '59', '51', '57'],
    targetChannels: ['SMS', 'Voice']
  }
}
```

### §4.3 Provider availability

Per-account configuration determines which providers are enabled (cost optimization, contract terms with providers). Vol 44 §8 destination-ID flow looks up the account's enabled providers for the destination.

---

## §5 — Service Phone Numbers (Excluded)

Per Vol 44 §8 truth DI-TT-06: **service phone numbers** (premium-rate, toll-free, short codes) are **explicitly excluded** from the current Falcon scope. Only Fixed + Mobile.

If/when scoped, would need additional lookup categories:
- Premium-rate (e.g., USA 900, UK 09xx)
- Toll-free (e.g., USA 800, UK 0800)
- Short codes (5-6 digit, country-specific)

---

## §6 — Phone Number Identification Flow (Vol 44 §8 expanded)

### §6.1 The 7-step algorithm

```
1. Strip non-digits and leading '+'.
2. Match leading 1-3 digits against Country.CC → resolve Country.
3. Compute remaining = phone - CC.
4. Try matching remaining[0..MobileNDCLen] against MobileNDC for that country.
   - If match → mobile; identify Operator; route via mobile Provider.
5. Else try matching against FixedNDC.
   - If match → fixed; identify Region; route via fixed Provider (typically null for international destinations).
6. Validate remaining total length matches country's expected N(S)N length.
7. Apply account-level eligibility:
   - Is the country enabled for this account?
   - Is the operator enabled?
   - Is the channel (SMS/Voice) enabled?
8. If all checks pass → return { country, operator, provider, normalized E.164 }.
9. Otherwise → throw `InvalidPhone` or `OperatorNotEnabled`.
```

### §6.2 Mental model

The phone number is a **lookup key** into a multi-dimensional table. Each digit position narrows the match. CC then NDC then SN.

### §6.3 Worked example — KSA mobile

Input: `+966501234567`
- Strip: `966501234567`
- CC: `966` → KSA
- Remaining: `501234567`
- NDC: `50` → STC mobile
- SN: `1234567` → 7 digits ✓ (KSA SN is 7)
- Total length: 12 digits ✓
- Result: `{ country: 'KSA', operator: 'STC', provider: 'TwilioKSA', E164: '+966501234567' }`

### §6.4 Worked example — NANP

Input: `+12025550100`
- CC: `1` → NANP
- Remaining: `2025550100`
- NDC: `202` (Washington DC)
- SN: `5550100`
- Type: NOT separable into Fixed/Mobile (per DI-TT-02)
- Result: `{ country: 'USA' (or DC-specific), operator: 'unknown', provider: 'International', E164: '+12025550100' }`

---

## §7 — Lookup Service (FE Pattern)

### §7.1 The service signature

```typescript
@Injectable({ providedIn: 'root' })
export class LookupService {
  getLookup(
    lookupId: LookupId,
    options?: { code?: string; parentId?: string }
  ): Observable<Hook<LookupValueResponse[]>>;

  getLookupValue(
    lookupId: LookupId,
    valueId: string
  ): Observable<Hook<LookupValueResponse>>;
}
```

### §7.2 Cache strategy

Per prior memory (Wave 15b Info-Panel), the LookupService caches results client-side:
- First call hits the backend.
- Subsequent calls return cached `Hook<>` wrapper.
- Cache invalidation on user logout OR explicit `lookupService.invalidate()` call.

### §7.3 Country lookup usage example (Info Panel)

```typescript
// info-panel-state.signals.ts
private lookupService = inject(LookupService);

readonly countries = computed(() => toDropdownOptions(this.countryCatalog()));
readonly cities = signal<DropdownOption[]>([]);

setCountry(countryId: string) {
  const countryCode = this.countryCatalog().find(c => c.id === countryId)?.code;
  if (!countryCode) return;
  this.cities.set([]);
  this.lookupService.getLookup(LOOKUP_IDS.City, { code: countryCode })
    .subscribe(cities => this.cities.set(toDropdownOptions(cities)));
}
```

The country selection triggers a per-country city lookup — scales for large catalogs.

### §7.4 Why per-country (not all-cities-once)

Cities across all countries could be tens of thousands of entries. Loading them all upfront wastes bandwidth + memory. Per-country lookup is on-demand.

---

## §8 — Cache Invalidation

### §8.1 Frontend cache

When Falcon admin updates a lookup value (e.g., adds a new mobile operator):
- The change persists to Mongo.
- A Kafka event SHOULD fire (`commerce.lookup-changed.v1` — INFERRED, not confirmed).
- Client-side cache is stale until next page reload OR explicit invalidation.

**Q-LU-01 (NEW MED):** Confirm if lookup changes propagate to FE via Kafka → server-side notification → FE cache invalidation. Otherwise FE relies on TTL (long stale-window).

### §8.2 Backend cache

The backend may cache LookupValues in HybridCache (similar to Wave 23's AuthSessionCache pattern). TTL would need to be short OR Kafka-driven invalidation.

---

## §9 — Editing Lookup Data (Falcon-Only)

### §9.1 PES-side enforcement

Per Vol 50, lookup-mutation actions should require Falcon-tier roles. PES keys [INFERRED]:
- `sys.lookup/add`
- `sys.lookup/edit`
- `sys.lookup/deactivate` (soft-delete)
- `sys.lookup-value/add`
- `sys.lookup-value/edit`

### §9.2 UI surface

Falcon admin console likely has a "Reference Data" or "Lookups" page where admins can:
- Add a new country.
- Add new mobile NDCs.
- Map NDCs to operators.
- Assign providers.

**Q-LU-02 (NEW LOW):** Confirm the admin UI exists for lookup management. Otherwise additions are SQL-only.

### §9.3 Audit trail

Any lookup change should produce an audit entry (per Vol 50 SAMA requirements).

---

## §10 — Lookups Consumed by Validations

### §10.1 Phone field validation

A phone-number field validator can consume the destination-ID lookup:
```typescript
phone: rules.phone()
  .required()
  .destinationId()  // validates against Vol 44 §8 lookup
  .accountEnabled() // validates country + operator enabled for account
```

### §10.2 Country dropdown

Forms with a country field populate from `getLookup(LOOKUP_IDS.Country)`.

### §10.3 City dropdown (per-country)

After country selected, populate city dropdown from `getLookup(LOOKUP_IDS.City, { code: country.code })`.

### §10.4 Language dropdown

For user-profile / message-locale fields, populate from `getLookup(LOOKUP_IDS.Language)`.

---

## §11 — Other Lookup Categories (Speculative)

Based on PRD context + standard CPaaS needs:

| Category | Likely values | Purpose |
|---|---|---|
| Currency | SAR, USD, EUR, AED, EGP | Multi-currency contracts |
| Timezone | Asia/Riyadh, Asia/Dubai, ... | Quiet-hours enforcement |
| Locale | ar-SA, en-US, ar-EG, ... | i18n preference |
| ServiceTier | Trial, Basic, Pro, Enterprise | Per-tier rate limits + feature gates |
| MessageCategory | Auth, Util, Mark | WA template category mapping |
| OptInSource | Onboarding, WebForm, InPerson, Imported, WADoubleOptIn | CG opt-in audit (Vol 48 §8.3) |

**Q-LU-03 (NEW):** Inventory all lookup types currently in Provisioning's `Lookups` collection.

---

## §12 — Edge Cases

### §12.1 New country added mid-active-session
**Setup:** Admin adds Cyprus (CC=357). User has the country dropdown open.
**Behavior:** Stale dropdown — doesn't include Cyprus. Requires re-fetch or page reload.

### §12.2 Operator deactivated for KSA
**Setup:** Falcon deactivates NDC 51 (Salam Mobile) entirely.
**Behavior:** Existing Contact Group recipients with `+96651xxx` numbers should be flagged. Future sends to them throw `OperatorNotEnabled`.

### §12.3 Lookup value with no metadata
**Setup:** Country has a row but no NDC mappings exist.
**Behavior:** Identification fails for that country — `OperatorNotResolved`. Account that wants to send there must wait until Falcon populates the table.

### §12.4 Conflict in NDC overlap (rare)
**Setup:** Two operators claim the same NDC.
**Behavior:** Identification picks the first match by `displayOrder`. NDC overlap is a data-integrity issue — admin should resolve.

### §12.5 Phone parsed at boundary
**Setup:** Input `+96650` (exactly 5 digits — too short).
**Behavior:** Identification matches CC=966 but cannot find full NDC + SN. Reject with `PhoneTooShort`.

---

## §13 — Cross-References

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Destination Identification (DI-TT-01..06)
- Vol 44 §8 — original BRD-extracted tables (KSA, Zone 9, NANP, Zone 7)
- Vol 46 — Campaigns Specialist (channel routing depends on lookup)
- Vol 48 — Contact Group Specialist (upload pipeline normalizes phones via destination-ID)
- Vol 51 §V51-PROVISIONING-ADDENDUM (Lookups/LookupValues Mongo collections confirmed)
- Vol 56 §7.3 — Frontend LookupService pattern
- `BRD-EXTRACTED:` `International-Phone-Destinations.txt` + `Dina-International-Destinations.txt`

---

## §14 — Open Questions

| ID | Question | Severity |
|---|---|---|
| Q-LU-01 | FE lookup cache invalidation — Kafka-driven OR TTL only? | MED |
| Q-LU-02 | Admin UI for lookup management — exists? | LOW |
| Q-LU-03 | Full inventory of Lookups collection types | MED |
| Q-LU-04 | Provider mapping per (Country × Channel × Operator) — schema details? | MED |
| Q-LU-05 | What's the canonical lookup-id namespace (typed enum vs string code)? | LOW |

---

**End of Volume 57 — Lookup & Reference-Data Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 44 §8 + Vol 51 §V51-PROVISIONING-ADDENDUM
**Pending:** Future code-mining wave will fill in lookup-data details (Q-LU-03)
