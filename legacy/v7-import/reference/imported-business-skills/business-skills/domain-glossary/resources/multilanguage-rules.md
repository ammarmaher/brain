*** Multilanguage Rules — domain-glossary ***
*** En/Ar consistency rules for Falcon terms ***

# Multilanguage Rules

## Principle

Every Falcon term has exactly one canonical English form and exactly one canonical Arabic form. Never two acceptable Arabic translations for the same English term.

## Required fields per term

Every glossary term file must have:
- `Definition (En)` — full sentence
- `Definition (Ar)` — full sentence in Modern Standard Arabic (MSA)
- Both reviewed by an Ar speaker before merge

## Code rules

Use `MultiLanguageName(En, Ar)` everywhere user-facing text is stored:
```csharp
new MultiLanguageName("Contact Group", "مجموعة جهات الاتصال")
```

The two strings must come from the glossary, not be invented inline.

## RTL considerations

- Arabic strings render right-to-left
- Numbers and Latin tokens inside Ar strings stay LTR (no manual reversal)
- UI labels in Ar must be tested in RTL layout — see `design-skills/rtl-support` (future)

## Translation drift detection

A glossary validation must:
- Find every `MultiLanguageName` in code
- Confirm `(En, Ar)` pair matches a glossary term exactly
- Flag any mismatch as `⚠ Translation drift: <En> ≠ glossary`

## When the Ar translation does not exist yet

Block the term from being added to the glossary. No partial entries.
A term without Ar is not ready to ship.
