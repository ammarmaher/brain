---
type: hub
hub: wiki
created: 2026-05-15
---
# Wiki Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 (evening) · Wiki-grounded architecture rule book — LIVE

Canonical source: [Azure DevOps wiki](https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home) · git: `https://t2development.visualstudio.com/Falcon/_git/Falcon.wiki` (branch `wikiMaster`) · local clone: `C:\Falcon\falcon-wiki` (HEAD `0d0cb311…`, 110 files).

Brain analysis at [`outputs/wiki-architect/`](../outputs/wiki-architect/README.md):

- [WIKI_OVERVIEW](../outputs/wiki-architect/WIKI_OVERVIEW.md) — TOC of the 16 canonical docs + HEAD SHA
- [CONSOLIDATED_ARCHITECTURE_RULES](../outputs/wiki-architect/CONSOLIDATED_ARCHITECTURE_RULES.md) — **wiki-grounded** rule book (supersedes the earlier code-extracted fallback below)
- [CONSOLIDATED_ARCHITECTURE_CONFLICTS](../outputs/wiki-architect/CONSOLIDATED_ARCHITECTURE_CONFLICTS.md) — drift log against the wiki (5 carried HIGH + 2 new HIGH + 11 MED + 9 LOW)
- [WIKI_TO_CODE_TRACE](../outputs/wiki-architect/WIKI_TO_CODE_TRACE.md) — ~120 wiki-rule → code-path rows (the bridge artifact)
- [`Home/Software-Architecture-Design/`](../outputs/wiki-architect/Home/Software-Architecture-Design/) — 16 per-doc brain-side summaries with citations

### Top wiki-vs-code conflicts surfaced (HIGH, NEW vs the fallback)

- `ValidateAudience=true` is canonical (`Security-Architecture.md` §4.2.6) — Commerce + Core Gateway + System Gateway have `false`.
- `X-MicroApp-Key` dual-credential auth required (`Security-Architecture.md` §4.1.1) — not implemented in any service.
- Identity Service should publish the IP-allowlist Kafka topic (not Commerce, where it lives today).
- A third Platform Services Gateway is canonical in the wiki — its repo does not exist yet.

### Code-extracted fallback (superseded — kept for audit)

> The fallback below was produced earlier the same day when the wiki was missing locally. It remains in place for audit. The wiki-grounded files above resolve **9 of its 12** UNVERIFIED items.

- [ARCHITECTURE_RULES (fallback)](../outputs/understanding/wiki/ARCHITECTURE_RULES.md)
- [ARCHITECTURE_CONFLICTS (fallback)](../outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md)
- [WIKI_FALLBACK_NOTE](../outputs/understanding/wiki/WIKI_FALLBACK_NOTE.md)
- [WIKI_IMAGE_INDEX (fallback)](../outputs/understanding/wiki/WIKI_IMAGE_INDEX.md)

### Refresh

The wiki repo is the authority. To refresh: `git -C C:\Falcon\falcon-wiki pull` (weekly cadence or before architectural decisions), then re-dispatch the wiki-grounded architecture agent against the same path.

### Top conflicts (after acknowledgments)

> The SQL `sa` finding in PES `appsettings.qc*.json` was `ACKNOWLEDGED — not pursuing (2026-05-13)`. It remains in [ARCHITECTURE_CONFLICTS](../outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md) for audit but is excluded from this surfaced list.

- HIGH — `ServiceOperationResult<T>` has 5 distinct shapes across services
- HIGH — PES uses GET-with-body on `policyrulesBySub` / `policyrulesByFilter`
- MED — Mongo default creds in non-Development `appsettings.json` (Templates + Access)
- MED — Domain layer leaks MongoDB (`[BsonElement]` on entities)
- MED — Endpoint-style split (Controllers vs FastEndpoints vs Minimal API) without documented policy

## Tags

#type/index #drift #security
