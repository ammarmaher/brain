*** Glossary — MultiLanguageName ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# MultiLanguageName (En, Ar)

## English
- **Definition:** Standard wrapper for any user-facing text in Falcon. Shape: `{ En: string, Ar: string }`. Required on every label, name, and description shown in UI. C# usage: `new MultiLanguageName("Contact Group", "مجموعة جهات الاتصال")`. The (En, Ar) pair must come from the canonical glossary, not be invented inline.

## Arabic
- **Term:** Not captured (the *concept* is a wrapper for Ar strings; the wrapper identifier itself has no Ar)
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: `falcon-wiki/Glossary.md:42`
- Secondary: `Brain SK/skills/imported-business/domain-glossary/resources/multilanguage-rules.md`

## Related PRD
- (cross-cutting — every user-facing label, every PRD)

## Related backend service
- All (FE consumes, BE stores)

## Related concepts
- See also: [[Falcon]] · [[ServiceOperationResult]] · [[Contact Group]] (example consumer)

## Common confusions
- MultiLanguageName is **mandatory** on every user-facing field per platform standard. The two strings MUST come from the glossary; inventing translations inline triggers a "Translation drift" validation warning.

## Hubs
- [[GLOSSARY_INDEX]] · [[BACKEND_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
