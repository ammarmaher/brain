---
name: input-to-component-index
description: |
  Resolve any UI input concept (date, phone, OTP, file, multi-select, etc.) to the canonical Falcon
  component(s) that handle it. Powers the "screenshot says a date picker → which Falcon component?"
  question deterministically, with cross-references to every page where that input concept appears.
status: proposed
proposed-at: 2026-05-14
proposed-by: ammar
proposes-skill-for: Brain SK v0.1
---

# input-to-component-index

## Purpose

Build and maintain a canonical mapping from **UI input concepts** (semantic notions like "date", "phone number", "OTP", "image upload", "multi-select", "free text") to **Falcon component(s)** in `Brain Outputs/component-registry/components/`.

This closes the loop on:
- `screenshot-to-angular`: "I see a date picker in the screenshot — which component?"
- `react-to-angular` / `html-to-angular`: "the source uses a `<DatePicker>` — which Falcon component is canonical?"
- AI agents answering "what should I use for a phone input?" without grepping 60 component dossiers.

## Inputs (sources of truth — already canonical)

1. `Brain Outputs/component-registry/components/<comp>/OVERVIEW.md` — high-level identity per component
2. `Brain Outputs/component-registry/components/<comp>/API.md` — props / accepted input shapes
3. `Brain Outputs/component-registry/components/<comp>/USAGE.md` — declared use cases
4. `Brain Outputs/understanding/pages/<page>/COMPONENT_MAPPING.md` — pages where each component appears
5. Glossary at `Brain SK/skills/business/domain-glossary/` for canonical noun resolution

## Outputs

Write to `Brain Outputs/understanding/frontend/INPUT_CONCEPT_INDEX.md` with this shape:

```markdown
# Input Concept Index

## date
- **Canonical:** falcon-date-picker
- **Aliases:** date input, calendar input, day picker
- **Variants:** single date, date range, datetime
- **Alternative:** falcon-calendar (inline display)
- **Used on pages:** organization-hierarchy (user-personal step), contracts, ...
- **Last verified:** 2026-05-14

## phone-number
- **Canonical:** falcon-phone-field
- **Aliases:** mobile, tel input, intl phone
- **Variants:** intl, single-country
- **Used on pages:** organization-hierarchy (user-personal step + comm-channels-tab), ...
...
```

And a parallel JSON file at `Brain Outputs/understanding/frontend/input-concept-index.json` for programmatic lookup:

```json
{
  "concepts": {
    "date": {
      "canonical": "falcon-date-picker",
      "aliases": ["date input", "calendar input", "day picker"],
      "variants": ["single", "range", "datetime"],
      "alternatives": ["falcon-calendar"],
      "used-on-pages": ["organization-hierarchy", "contracts"],
      "verified-at": "2026-05-14"
    }
  }
}
```

## Initial concept seed list (~25 entries)

Text inputs: `text`, `email`, `password`, `search`, `textarea`, `phone-number`, `mobile-number`, `url`, `number`.

Selection: `single-select`, `multi-select`, `combobox`, `radio`, `radio-group`, `checkbox`, `checkbox-group`, `switch`.

Date / time: `date`, `date-range`, `datetime`, `time`.

Specialized: `otp`, `image-upload`, `file-upload`, `avatar-upload`, `color-picker`, `rich-text`.

Forms / layout: `form-field`, `stepper`, `tabs`, `accordion`.

## Rules

- Follow source-of-truth priority (Wiki → Backend → PRD → Code → Falcon registry → HTML/React → Assumptions).
- A concept may resolve to MULTIPLE components — primary marked `canonical`, others `alternatives`.
- Aliases come from the domain glossary and from real terms found in PRDs / screenshots.
- "Used on pages" derived from `understanding/pages/*/COMPONENT_MAPPING.md` — never hand-listed.
- Mark concepts with no canonical component as `status: gap` (a missing Falcon component) and link to `Brain Outputs/discovery/`.

## Required outputs (Brain SK governance)

- Write `Brain Outputs/understanding/frontend/INPUT_CONCEPT_INDEX.md` + `.json`
- Update scan metadata
- Include results in task/API report when relevant
- Auto-sync brain artifacts to `https://github.com/ammarmaher/brain`

## Invocation

| Ammar says | Skill behavior |
|---|---|
| "regenerate input index" | Full rescan of all 60 component dossiers + all page COMPONENT_MAPPING.md files |
| "what component handles X?" | Quick lookup against the latest `input-concept-index.json` |
| "screenshot shows a Y" | (called by screenshot-to-angular) resolve Y to canonical component |
| "add concept Z" | Append concept Z to the seed list, run resolver |

## Integration points

- **screenshot-to-angular** consumes this index when classifying screenshot regions
- **react-to-angular** consumes this index when mapping source props to Falcon inputs
- **frontend-master-router** routes "what component for X?" queries here
- **Obsidian vault** projects this index into `61-Input-Index/` cluster (one note per concept)

## Anti-patterns

- Don't invent new component names — every entry MUST resolve to an existing `component-registry/components/<name>` folder, or be marked `status: gap`.
- Don't duplicate aliases across concepts — alias overlaps must be resolved (e.g. "mobile" is alias for `phone-number`, not its own concept).
- Don't hand-edit the JSON output — regenerate via this skill.

## Open questions for Ammar before first run

1. Should "rich-text" and "code-editor" be in scope, or deferred until Falcon ships those components?
2. For ambiguous concepts (e.g. "list of items" — multi-select? combobox? data-table?), should the index emit all candidates or just the most-used one per recent pages?
3. Should the index include i18n aliases (Arabic terms) since glossary is bilingual?
