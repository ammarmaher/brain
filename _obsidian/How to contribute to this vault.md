---
type: onboarding
purpose: contribution-guide
created: 2026-05-15
---

*** How to Contribute — vault conventions and workflows ***
*** Read this before adding new knowledge ***

# How to contribute to this vault

> This vault is a **graph layer** over `Brain Outputs/`. Adding knowledge happens in 3 places (Brain Outputs SoT · vault graph node · hubs) — keep them in sync.

## Where new knowledge goes

| Adding... | SoT location (Brain Outputs) | Vault graph node | Hub to update |
|---|---|---|---|
| A new **validation rule** (PRD → Backend → Frontend) | _(no SoT — V-rules live only in vault — they're triangulations)_ | `30-Validation/V-<slug>.md` (use [[V-rule template]]) | [[VALIDATION_INDEX]] table |
| A new **entity reconciliation** (PRD ↔ Backend DTO) | _(no SoT — E-notes triangulate too)_ | `40-API/E-<slug>.md` (use [[E-entity template]]) | [[API_INDEX]] "Entity reconciliation" section |
| A new **page** | `understanding/pages/<slug>/PAGE_LEARNING.md` + the 14 sister files | `10-Pages/<Page Name>.md` (use [[Page note template]]) | [[PAGE_LEARNING_INDEX]] table |
| A new **flow playbook** (folder form) | `understanding/pages/<page>/<Flow>/` (17 files matching Add Client) | `10-Pages/<Flow Name> Flow.md` | [[IMPLEMENTATION_KNOWLEDGE_MAP]] flow table |
| A new **flow playbook** (single-file form) | `understanding/pages/<page>/flows/<Flow>.md` | `10-Pages/<Flow Name> Flow.md` | [[IMPLEMENTATION_KNOWLEDGE_MAP]] flow table |
| A new **cross-page journey** | `understanding/journeys/<slug>/` (README + PLAYBOOK) | `16-Journeys/<Journey Name>.md` | [[16-Journeys/README|16-Journeys]] index |
| A new **Kafka / Redis / webhook event** | `understanding/integration/events/<topic>.md` | `47-Events/<Event Name>.md` | [[47-Events/README|Kafka Events Index]] |
| A new **error code** note | `understanding/integration/errors/<ErrorName>.md` (also appears in master `CATALOG.md`) | _(optional vault note)_ | [[ERROR_INDEX]] |
| A new **glossary term** | `understanding/glossary/<term-slug>.md` | `05-Glossary/<Term Name>.md` | [[GLOSSARY_INDEX]] |
| A new **Falcon component** note | _(component dossier lives in `understanding/frontend/components/<name>/`)_ | `60-Components/<Falcon X>.md` | [[COMPONENT_INDEX]] full vault table |
| A new **learning event** (`LE-*`) | `understanding/pages/<page>/LIGHT_LEARNING_EVENTS.md` + `light-learning/<id>.md` | `80-Evidence/LE-<id>.md` | [[EVIDENCE_INDEX]] |
| A new **architecture rule set** | `understanding/frontend/architecture/<NAME>.md` (SoT) | `35-Architecture/<Name>.md` | [[35-Architecture/README]] |
| An **approved page-specific pattern** | `understanding/pages/<page>/APPROVED_PAGE_PATTERNS.md` | _(no separate vault note unless promoted)_ | [[APPROVED_PATTERNS_INDEX]] |
| A **globally-promoted pattern** | `understanding/frontend/patterns/<PATTERN>.md` | _(no separate vault note)_ | [[APPROVED_PATTERNS_INDEX]] |

## The 7 vault conventions

1. **Wiki-link syntax:** `[[Name]]` — base file name only. NO folder prefixes (`[[60-Components/Falcon Data Table]]` is wrong). NO relative paths (`[[../60-Components/Falcon Data Table]]` is wrong).
2. **Brain Outputs SoT links:** Markdown filepath syntax with URL-encoded space: `[label](../../../Brain%20Outputs/...)`. Adjust `../` count for the depth of the vault note.
3. **3-line banner at the top** of every note:
   ```
   *** <Type> — <Short Name> ***
   *** Context line · YYYY-MM-DD ***
   *** Status / location / additional context ***
   ```
4. **YAML frontmatter** with at minimum `type`, `created`, and any type-specific fields (Dataview queries depend on this).
5. **`## Hubs` section at the bottom** listing `·`-separated wiki-links to relevant hubs.
6. **`## See also` section** (for folder-form playbooks) listing sibling files in the same folder.
7. **Be honest about gaps**: mark `inferred` when guessing; mark `forward-ref (not yet seeded)` when wiki-linking a future note.

## Templates — use them

The `_templates/` folder has a ready-to-use template for every note type above. With **Templater** plugin bound to `Alt+N`:

1. Place cursor where you want the new note
2. `Alt+N` → pick the matching template → fill prompts
3. Done — note is structured, frontmatter is populated, banner is in place

Without Templater: just copy the template file and rename it.

## When to add a NEW V-rule vs amend an existing one

| Add new V-rule | Amend existing |
|---|---|
| Rule has a distinct PRD line and distinct backend attribute | Rule extends an existing field's validation |
| Rule fires under a different scenario than an existing rule | Same scenario, just better wording |
| Severity is materially different from existing rules | Severity needs reclassification (just update frontmatter) |

When in doubt → grep `30-Validation/` for similar rules before creating a new file.

## When to promote a page-specific rule to global pattern

Page-specific rules live in `understanding/pages/<page>/APPROVED_PAGE_PATTERNS.md`. They become global patterns at `understanding/frontend/patterns/<PATTERN>.md` ONLY when:

1. Ammar explicitly says **"promote this globally"** (or **"promote PP-NNN globally"**)
2. The rule has been triangulated through Deep Page Learning
3. The rule applies to ≥2 unrelated pages OR is intrinsically cross-cutting (token-related, layout-related, security-related)

Per [[APPROVAL_LEARNING_GATE]] — page-specific stays page-specific by default.

## When to add a new page note vs amend an existing one

| New page note | Amend existing |
|---|---|
| Distinct URL / route in the app | Same route, just a new tab or sub-section |
| Distinct PRD reference | Same PRD module · refining a section already covered |
| Distinct page-learning folder under SoT | Adding evidence / V-rule to existing page |

Page slugs use kebab-case (`organization-hierarchy`, `add-contract`, etc.). Vault note name uses Title Case (`Organization Hierarchy.md`, `Add Contract.md`).

## Naming conventions (in one table)

| Note type | File name pattern | Example |
|---|---|---|
| Page note | `<Page Name>.md` | `Organization Hierarchy.md` |
| Flow note | `<Flow Name> Flow.md` | `Add Client Flow.md` |
| Journey | `<Journey Name>.md` | `New Tenant Onboarding.md` |
| V-rule | `V-<short-slug>.md` | `V-account-name-format-uniqueness.md` |
| E-entity | `E-<entity-slug>.md` | `E-account.md` |
| Component | `Falcon <Title>.md` | `Falcon Data Table.md` |
| Event | `<Producer Brief> <Topic>.md` | `Commerce User Creation Requested.md` |
| Error code | `<ErrorName>.md` | `DuplicateTenantName.md` |
| Glossary | `<Term Name>.md` | `Account Owner.md` |
| Learning event | `LE-<YYYYMMDD>-<page>-<NNN>.md` or `LE-<YYYYMMDD>-<descriptive-slug>.md` | `LE-20260515-commchannels-shadow-row-notch-alignment.md` |

## After adding a note — verify the 5 checks

1. **Frontmatter is set** (type · created · type-specific fields)
2. **Banner is at the top** (3 lines)
3. **`## Hubs` at the bottom** with relevant wiki-links
4. **The hub note is updated** to include your new note (find the right hub in the table above)
5. **Brain Outputs SoT exists** (if applicable — for V-rules and E-entities, the SoT IS the vault note, so this is fine)

## What NOT to do

- ❌ Don't paste rule content in vault notes — link to Brain Outputs instead
- ❌ Don't use `[[../path/Name]]` wiki-links — Obsidian doesn't resolve relative paths in wiki-links
- ❌ Don't create new hub notes — extend existing ones
- ❌ Don't commit changes via Obsidian — use the terminal for `git add` + `git commit`
- ❌ Don't edit `.obsidian/plugins/*/data.json` or `workspace.json` (gitignored, plugin-specific, often secret)
- ❌ Don't delete legacy notes (`Frontend Components Index.md` at vault root, etc.) — they're preserved for backwards compatibility

## Git workflow

The vault is part of the `Brain SK` git repository at `C:\Falcon\Brain SK\`. Changes flow:

1. Edit notes in Obsidian
2. Open a terminal at `C:\Falcon\Brain SK\`
3. `git status` to see what changed
4. `git add <file>` for the files you want to commit
5. `git commit -m "vault: <what you changed>"`
6. `git push` (when you're ready to publish)

**Secret check:** before committing, ensure no plugin data leaked:
```
git diff --cached --name-only | grep -E "\.obsidian/|workspace\.json|data\.json|\.env"
```
(Should return nothing.)

## Tags

#type/onboarding #security

## Hubs

- [[🟢 Start Here]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[APPROVAL_LEARNING_GATE]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[COMPONENT_INDEX]]
