*** Glossary — Falcon Exception ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Falcon Exception

## English
- **Definition:** Standard exception type thrown by every Falcon service on error. Carries a `FalconError` code + i18n message key (drawn from `FalconKeys.Error`) and is serialized into the `ServiceOperationResult<T>` failure payload returned to clients. Replaces ad-hoc `Exception` throws in handlers.

## Arabic
- **Term:** Not captured (technical identifier — error MESSAGES are MultiLanguage; the wrapper itself has no Ar)
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: `C:\Falcon\CLAUDE.md` ("Error handling: FalconException with FalconError codes")
- Secondary: `falcon-wiki/Glossary.md:44`

## Related PRD
- (cross-cutting)

## Related backend service
- All

## Related concepts
- See also: [[ServiceOperationResult]] · [[MultiLanguageName]] · [[Falcon]]

## Common confusions
- **FalconException ↔ FalconError ↔ FalconKeys.Error** — Exception is the C# exception class. FalconError is the error-code value. FalconKeys.Error is the i18n key registry. All three are part of the same error pipeline.

## Hubs
- [[GLOSSARY_INDEX]] · [[BACKEND_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
