---
type: atlas-volume-graph-node
volume: 57
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-57-LOOKUP-REFERENCE-DATA-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol57
  - specialist/lookup
  - specialist/reference-data
  - specialist/destinations
---

# Vol 57 — Lookup & Reference-Data Specialist Guide

> Reference-data tables (countries, NDCs, operators, providers, currencies, languages) and the lookup-service pattern that consumes them on the frontend.

## What's in it

14 sections:
- §1 The lookup catalog (Mongo `Lookups` + `LookupValues` collections + schema)
- §2 Country table (KSA primary, Zone 9, NANP, Zone 7, Egypt)
- §3 Mobile NDC × Operator tables (KSA 9 operators, KZ 4, Russia 5+, Egypt 4)
- §4 Provider mapping
- §5 Service phone numbers (explicitly excluded)
- §6 Phone number identification flow (7-step algorithm + 2 worked examples)
- §7 Lookup Service (FE pattern) — `getLookup()` + cache strategy
- §8 Cache invalidation (Kafka-driven? TTL? Q-LU-01 open)
- §9 Editing lookup data (Falcon-only PES gate)
- §10 Lookups consumed by validations
- §11 Other lookup categories (currency/timezone/locale/tier/etc.)
- §12 5-class edge cases
- §13 Cross-references
- §14 5 new Q-LU-* questions

## Headline truths

> Two Mongo collections in Provisioning: **`Lookups`** (registry) + **`LookupValues`** (data). Hierarchical via `parentValueId` (City → Country). Multi-language via `MultiLanguageName(En, Ar)`. Frontend uses `LookupService.getLookup(lookupId, options)` returning `Hook<LookupValueResponse[]>`. **Per-country city lookup** (NOT all-cities-once) — scales for large catalogs. **KSA mobile is 2-digit NDC** (50-59). **NANP (CC=1) NOT subdivisible** fixed-vs-mobile. **Universal length 7-15 digits** (E.164). **Service phone numbers EXCLUDED** from current scope.

## See also

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Destination Identification (DI-TT-01..06)
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — channel routing depends on lookup
- [[Vol 48 — Contact Group Specialist Guide]] — upload pipeline normalizes phones
- [[Vol 51 — Cross-BC Saga Map]] §V51-PROVISIONING-ADDENDUM — Lookups collection confirmed
- [[Vol 56 — Frontend Architecture Specialist]] §7.3 — LookupService pattern
- [[ATLAS_MASTER_INDEX]]
