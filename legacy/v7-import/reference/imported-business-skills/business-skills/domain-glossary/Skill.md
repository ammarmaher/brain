*** Skill: domain-glossary ***
*** Falcon vocabulary lock — En/Ar consistency, canonical owners, banned synonyms ***

# domain-glossary

## Purpose

Lock down Falcon vocabulary so the same concept always uses the same word in code, UI, PRDs, tests, and conversation. Keeps En and Ar translations consistent. Prevents agents from inventing synonyms.

## Triggers

- Any task using domain terms (tenant, account, contact group, wallet, etc.)
- Any new feature name decision
- Any user-facing copy (En or Ar)
- Code review touching identifiers

## Owns

- Term → definition (En + Ar)
- Term → canonical service owner
- Disambiguation pairs ("user vs account", "tenant vs customer")
- Banned synonyms

## Folder layout

```
domain-glossary/
  Skill.md
  INDEX.md                      <- alphabetical term list
  banned-terms.md               <- forbidden synonyms + replacement
  resources/
    naming-rules.md             <- when to use which term
    multilanguage-rules.md      <- En/Ar consistency rules
  glossary/
    <term>.md                   <- one file per canonical term
  disambiguation/
    <pair>.md                   <- e.g. user-vs-account.md
```

## Term file shape (every glossary file follows this)

```markdown
# <Term>
**Definition (En):** ...
**Definition (Ar):** <العربية> — ...
**Canonical owner:** <service>
**Used in:** <list of services / surfaces>
**Code refs:** `EntityName` in `Project.Layer`
**Do NOT confuse with:** <related terms>
**Aliases (banned):** <list>
```

## Hard rules

1. One canonical term per concept — aliases go in `banned-terms.md`
2. Every term has Ar translation before merge
3. New term = new file (no multi-term files)
4. Every term file has all 7 fields (no partials)
5. Disambiguation pairs live in `disambiguation/`, not in term files

## Restrictions

- Do not edit Angular application files
- Do not edit backend application files
- Do not install packages
- Do not run migrations
- Do not refactor source code
- Do not change Nx workspace structure / Module Federation / PrimeNG / Tailwind
- Only knowledge files in `domain-glossary/**` and consuming skills' validation output may be touched

## Validation output

When called to validate an artifact:
```
Glossary validation: <artifact-path>
✓ Recognized:  <count> terms
⚠ Unknown:     <list>           <- not in glossary; add or replace
✗ Banned:      <list> → <use>   <- use canonical replacement
```

## Status Announcer (voice + sound)

Source of truth: [`settings/sound/settings.json`](../../settings/sound/settings.json) → `skills.domain-glossary`.

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_lewis` | "Domain glossary running." | — |
| Working (long ops) | `bm_lewis` | "Domain glossary working." | — |
| Completion | `bm_lewis` | "Domain glossary complete." | 3 equal taps `[1000,150]×3` (gap 80ms) |
| **Global handshake** | `bm_george` | **"I am finishing, boss."** | double-tap `[1320,100; 1320,100]` |

**Reading the response aloud:** When agent-tts is running, every assistant turn under this skill is spoken via Kokoro at `bm_lewis` and 8× volume.

**Final sequence per cycle:**
1. "Domain glossary running." → work → "Domain glossary complete."
2. Per-skill beep (3 equal taps)
3. "I am finishing, boss." (always `bm_george`)
4. Global double-tap beep

Play ONLY after a successful validation or full glossary regeneration.

## See also

- [resources/naming-rules.md](./resources/naming-rules.md)
- [resources/multilanguage-rules.md](./resources/multilanguage-rules.md)
- [INDEX.md](./INDEX.md)
- [banned-terms.md](./banned-terms.md)
