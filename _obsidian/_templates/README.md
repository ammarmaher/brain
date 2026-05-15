*** Templates folder — one starter file per note type ***

# Templates

> Use these templates when creating a new note. With the **Templater** plugin bound to a shortcut (recommended: `Alt+N`), pick the matching template, fill the prompts, and you get a fully-structured note in seconds. Without Templater, just copy the file and edit.

## Available templates

| Template | Use when creating | Output folder |
|---|---|---|
| [V-rule template](V-rule.md) | A new validation triangulation rule (PRD → Backend → Frontend) | `30-Validation/` |
| [E-entity template](E-entity.md) | A new PRD ↔ Backend DTO entity reconciliation | `40-API/` |
| [Page note template](Page-note.md) | A new Falcon frontend page | `10-Pages/` |
| [Flow playbook template (folder form)](Flow-folder.md) | A new implementation flow that warrants the 17-file folder structure | `Brain Outputs/understanding/pages/<page>/<Flow>/` |
| [Flow playbook template (single file)](Flow-single.md) | A new implementation flow that fits in one file | `Brain Outputs/understanding/pages/<page>/flows/` |
| [Journey template](Journey.md) | A new cross-page user journey | `16-Journeys/` |
| [Event template](Event.md) | A new Kafka / Redis / webhook event | `47-Events/` |
| [Error code template](Error-code.md) | A new high-frequency error code worth its own note | `Brain Outputs/understanding/integration/errors/` |
| [Glossary term template](Glossary-term.md) | A new canonical Falcon term | `05-Glossary/` |
| [Learning event template](LE-event.md) | A new Light Learning Intake event (auto-created by page-learning skill, manual here only for edge cases) | `80-Evidence/` |

## Convention reminders

- **Wiki-link syntax:** `[[Name]]` only (base name; no folder prefix; no relative path).
- **Brain Outputs links:** Markdown `[label](../../../Brain%20Outputs/...)` syntax.
- **Banner:** 3 `***` lines at the top of every note.
- **Hubs:** every note ends with a `## Hubs` section of `·`-separated wiki-links.
- **YAML frontmatter:** every note has a YAML block listing `type`, `prd` (if relevant), `service` (if relevant), `severity` / `status` / `created` as applicable. Dataview queries depend on this.

## How to use with Templater

1. Install Templater plugin in Obsidian.
2. Set Templater's "Template folder location" to `_templates`.
3. Bind a hotkey (recommended `Alt+N`) to "Templater: Create new note from template".
4. From any folder, hit the hotkey, pick the template, fill the prompts → done.
