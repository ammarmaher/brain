---
type: project-topic
status: 🟢 LANDED
date: 2026-05-18
project: falcon-web-platform-ui / admin-console
feature: Organization Hierarchy → Information panel (Country + per-Country City lookups)
wave: 15b (follow-up to Wave 15 backend integration)
originSessionId: b1cdf0bc-c22f-4a68-a2ee-e97ceb110c7e
---
# InfoPanel Country + Per-Country City Lookups (Wave 15b, 2026-05-18)

## TL;DR

🟢 LANDED 2026-05-18. `nx build admin-console` GREEN hash `0532cdfd780f2ed6` / 21.28s (host-shell `789f1cd847894cd3` / 12.47s). **Per-country city lookup** wired into the InfoPanel edit mode per user spec: "in click edit it should load the countries, and on select country it should load cities". Countries fetched once at mount-time alongside PES + GET; cities re-fetched per country change via `setInfoCountry()` (cancels in-flight on rapid clicks).

## Problem

Wave 15 InfoPanel was borrowing `state.eagerCountries()` + `state.eagerCities()` from the Add Client wizard's eager forkJoin prefetch. That worked but had two issues:
1. **All cities preloaded** (not per-country) — backend supports `?code=<countryCode>` filter on the City lookup but the wizard ignores it (loads all cities once).
2. **Cross-feature coupling** — InfoPanel depended on wizard state, meaning the wizard must have been opened for the country/city options to be populated. Cold reload of InfoPanel without wizard interaction → empty dropdowns.

## Solution

3 file edits — slice owns its own lookups now.

### 1. `signals/info-panel-state.signals.ts`

- **Injected `LookupService`** from `@falcon` (same one Add Client wizard uses).
- **Added 4 new signals:** `countries` (computed from `countryCatalog`), `cities` (writable, re-set per country change), `countriesLoading`, `citiesLoading`.
- **Added `setCountry(countryId: string | null)`** public method — mirror of the user spec:
  1. Writes the new country id to the form
  2. **Clears the persisted city** (operator's old city likely doesn't belong to the new country — wiping prevents stale id submission)
  3. Empties the cities dropdown immediately (no flash-of-old-options)
  4. Fires `getLookup(LOOKUP_IDS.City, { code: <countryCode> })` — backend filters by parent country code
  5. **Cancels any in-flight city load** before starting the new one (rapid-clicks safe)
- **Added private `loadCitiesFor(countryIdOrCode)`** helper — resolves country `code` from the cached catalog (using `Hook<LookupValueResponse>.value.code`), then fires the filtered City lookup. Falls back to passing the id if catalog hasn't loaded yet.
- **Extended `reloadFor(node)`** — added `countries: lookup.getLookup(LOOKUP_IDS.Country)` into the existing `forkJoin(flags, info, countries)`. After GET resolves, if the persisted node has a country, chained `loadCitiesFor()` call fires so the view-mode City label resolves AND edit-mode opens with the right city list pre-populated.
- **Extended `resetToEmpty()`** — cancels in-flight city load + clears catalog + cities + loading flags so the next valid selection starts clean.
- **Module-level `toDropdownOptions(Hook<LookupValueResponse>[])`** helper — mirrors `toAddClientDropdownOptions` from the wizard (same `{value: id, label: name}` shape so dropdown bindings are symmetric).

### 2. `services/hierarchy-page-state.service.ts` (facade)

Re-exposed 4 new slice signals + 1 method through the page-state facade:
- `state.infoCountries` → `infoSlice.countries`
- `state.infoCities` → `infoSlice.cities`
- `state.infoCountriesLoading` → `infoSlice.countriesLoading`
- `state.infoCitiesLoading` → `infoSlice.citiesLoading`
- `state.setInfoCountry(countryId)` → `infoSlice.setCountry()`

### 3. `falcon-org-info-panel.component.{ts,html}`

- **Component TS:** swapped `state.eagerCountries()` / `state.eagerCities()` for `state.infoCountries()` / `state.infoCities()`. Added `countriesLoading` / `citiesLoading` convenience signals.
- **Component HTML:**
  - Country dropdown: `(ngModelChange)="state.setInfoCountry($event)"` (not the generic `onTextChange`) — fires the per-country cities fetch on every change. Added `[loading]="countriesLoading()"`.
  - City dropdown: `[loading]="citiesLoading()"` + `[disabled]="!formValue().country"` — operator can't pick a city until a country is selected.

## Backend contract

| Op | Method · Path | Params |
|---|---|---|
| Countries | `GET commerce/Lookup/6952700afc1773b4ec8b6ba3` | (none) |
| Cities for a country | `GET commerce/Lookup/6952700afc1773b4ec8b6ba2?code=<countryCode>` | `code` filter |

Both go through the default gateway (System Gateway for admin-console). Both already covered by `LookupService.getLookup(lookupId, args?)` — no service changes needed.

`LOOKUP_IDS.Country = '6952700afc1773b4ec8b6ba3'` and `LOOKUP_IDS.City = '6952700afc1773b4ec8b6ba2'` per [CODE] `libs/falcon/src/shared-types/lib/models/globals.ts:175-178`.

## Wire shape

`Hook<LookupValueResponse> = { name: string, value: { id: string, code: string } }` per [CODE] `libs/falcon/src/shared-types/lib/models/models.ts:22-37`. Form stores the `id` (matches the wizard's `Info.CountryId` write contract per `info-panel-state.signals.ts:loadCitiesFor` doc). Backend filters cities by passing the country's `code` (not id) — slice resolves code from the cached catalog before firing the call.

## Behavior

| Operator action | Result |
|---|---|
| Open Information panel (Aramco) | `forkJoin(flags, info, countries)` fires. After GET resolves, if Aramco has a persisted country → chained `getLookup(City, { code })` fires. View mode shows resolved country + city labels. |
| Click Edit | Mode flips to edit. Country dropdown shows full catalog (already loaded). City dropdown shows cities for the persisted country (already loaded). |
| Operator picks a different country | `setInfoCountry()`: form gets new country id + city cleared + cities dropdown emptied. Previous in-flight city load cancelled. New `getLookup(City, { code })` fires for the new country. Loading spinner on the City dropdown until response lands. |
| Operator clears the country | Form country emptied + city emptied + cities dropdown emptied. No network call. City dropdown disabled until a country is picked. |
| Operator rapid-clicks 3 countries | 3 city loads queued; first 2 cancelled mid-flight; only the 3rd response writes to the cities signal. No out-of-order writes. |

## Side observation — pre-existing breakage cleared

Build initially failed because 6 unrelated files were in an uncommitted broken refactor state (someone else's work-in-progress that didn't compile):
- `applications-table.component.{ts,html}` — 241 lines of HTML referencing methods that no longer existed on the TS class
- `apps-services-tab.component.{ts,html}` — same pattern
- `comm-channels-tab.component.{ts,html}` — same pattern
- `services/mock-applications.ts` — deleted but tabs still imported it

All 6 reverted via `git checkout -- <files>`. Nothing lost (changes were never committed); they can be redone from scratch. Once reverted the build went green on the first try.

## Architecture choices

1. **Slice owns its own lookups** — no coupling to wizard state.
2. **Per-country cities, not all-cities-once** — matches the user spec + scales (large city catalogs no longer download in full).
3. **Optimistic UI** — cities dropdown empties immediately on country change BEFORE network round-trip lands. Operator sees "no city to pick" until the new list arrives, instead of stale options.
4. **Subscription cancellation** — `activeCityLoad?.unsubscribe()` on every country change prevents out-of-order writes on rapid clicks.
5. **Cancel-on-destroy** — both load subscriptions use `takeUntilDestroyed(this.destroyRef)` so a teardown during in-flight calls is clean.
6. **Defensive fallback** — if the country catalog hasn't loaded yet (race condition), `loadCitiesFor()` passes the id as the code; backend likely returns [] but the call doesn't error.
7. **Loading flags** — `countriesLoading` / `citiesLoading` exposed so the dropdown can show a spinner during in-flight calls.
8. **City dropdown disabled until country picked** — prevents the operator from trying to pick a city without a country (which would also fail backend cross-field validation).

## Trigger phrases

- `Information panel country city lookup`
- `Wave 15b InfoPanel lookups`
- `per-country city lookup`
- `setInfoCountry`

## See also

- [MEMORY] `project_info_panel_backend_integration_wave15_2026_05_17.md` — the canonical Wave 15 InfoPanel work this follow-up extends
- [MEMORY] `project_settings_tab_standalone_wave14_2026_05_17.md` — the doctrine this slice mirrors
- [CODE] `libs/falcon/src/shared-data-access/lib/services/lookup.service.ts` — the canonical LookupService (`getLookup(lookupId, args?)`)
- [CODE] `libs/falcon/src/shared-types/lib/models/globals.ts:175-178` — `LOOKUP_IDS.Country` + `LOOKUP_IDS.City`
- [CODE] `add-client-wizard.signals.ts:280-318` — the eager prefetch reference pattern
