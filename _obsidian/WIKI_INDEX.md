# Wiki Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 · Architecture rule book (code-extracted fallback — wiki missing)

> The canonical wiki at `C:\Falcon\falcon-wiki` is not present on this machine. The rules below were extracted from the actual code. They are **superseded** by the wiki when it is restored.

- [ARCHITECTURE_RULES](../outputs/understanding/wiki/ARCHITECTURE_RULES.md) — 10-section rule book with file-cited evidence (Clean Architecture, gateways, auth, persistence, frontend, branching, identity boundaries)
- [ARCHITECTURE_CONFLICTS](../outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md) — drift log with severity tags
- [WIKI_FALLBACK_NOTE](../outputs/understanding/wiki/WIKI_FALLBACK_NOTE.md) — explains fallback status + lists canonical wiki paths to restore
- [WIKI_IMAGE_INDEX](../outputs/understanding/wiki/WIKI_IMAGE_INDEX.md) — single-line "wiki missing" stub

### Top conflicts
- HIGH — hardcoded SQL `sa` credentials in PES `appsettings.qc.json` + `appsettings.qcfromlocal.json` (rotation needed)
- HIGH — `ServiceOperationResult<T>` has 5 distinct shapes across services
- HIGH — Mongo default creds in non-Development `appsettings.json` (Templates + Access)
- MED — Domain layer leaks MongoDB (`[BsonElement]` on entities)
- MED — Endpoint-style split (Controllers vs FastEndpoints vs Minimal API) without documented policy
