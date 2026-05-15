*** Glossary — ServiceOperationResult<T> ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# ServiceOperationResult

## English
- **Definition:** Platform-wide response wrapper used by every Falcon API. Every endpoint returns `ServiceOperationResult<T>` carrying a status flag, a typed `Data` payload, and (on failure) a `FalconError` code + message. Standard across Commerce / Charging / Provisioning / Identity / Gateways.

## Arabic
- **Term:** Not captured in available sources — surface gap (technical term — Arabic translation not applicable to identifier itself; user-facing error messages are Multi-language)
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: `C:\Falcon\CLAUDE.md` ("Response wrapper: ServiceOperationResult<T> everywhere")
- Secondary: `falcon-wiki/Glossary.md:43`

## Related PRD
- (cross-cutting — every endpoint of every PRD)

## Related backend service
- All. See [[BACKEND_INDEX]].

## Related concepts
- See also: [[Falcon Exception]] · [[MultiLanguageName]] · [[Falcon]]

## Common confusions
- ServiceOperationResult is the **response wrapper**; `FalconException` / `FalconError` is the **error-content** carried inside it on failure. Not the same thing.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
