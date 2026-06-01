---
type: visual-config-recommendation
status: USER-TO-APPLY
created: 2026-05-27
why: obsidian-icon-folder data.json is user-owned (Brain SK CLAUDE.md rule). Documented here instead of auto-applied.
---

# Recommended folder icons — Brain SK vault

Right-click each folder in Obsidian → "Set icon" → pick the suggested icon below. Takes ~30s per folder.

| Folder | Suggested icon | Color | Reason |
|---|---|---|---|
| `00-Home` | `lucide-home` | teal | Entry point |
| `05-Glossary` | `lucide-book-a` | indigo | Reference |
| `10-Pages` | `lucide-file-text` | blue | Per-page docs |
| `12-Permissions` | `lucide-key-round` | amber | Access control |
| `15-PRD` | `lucide-file-spreadsheet` | green | Business requirements |
| `16-Journeys` | `lucide-route` | purple | User flows |
| `30-Validation` | `lucide-shield-check` | red | V-rules — guard rails |
| `35-Architecture` | `lucide-layout-template` | indigo | System design |
| `36-Theming` | `lucide-palette` | pink | Visual design |
| `37-Loading` | `lucide-loader` | gray | Loading patterns |
| `40-API` | `lucide-plug` | orange | E-* entities + API |
| `40-Authority` | `lucide-shield` | red | Authority projections |
| `45-Backend` | `lucide-server` | cyan | BE specs |
| `47-Events` | `lucide-zap` | yellow | Kafka events |
| `60-Components` | `lucide-puzzle` | violet | Falcon UI Core |
| `61-Input-Index` | `lucide-text-cursor-input` | sky | Inputs |
| `65-Validation-Rules` | `lucide-shield-check` | red | Same as 30 |
| `66-PES-Rules` | `lucide-lock` | amber | Permissions catalog |
| `67-Business-Rules` | `lucide-gavel` | green | BR-* |
| `68-UI-UX-Rules` | `lucide-paintbrush` | pink | UI/UX rules |
| `70-Gaps` | `lucide-alert-triangle` | yellow | Open gaps |
| `80-Evidence` | `lucide-camera` | gray | Screenshots/proofs |
| `90-Approved-Patterns` | `lucide-check-circle-2` | green | Promoted patterns |
| `Components` (legacy mirror) | `lucide-archive` | gray | Archived — don't use as active |
| `_templates` | `lucide-clipboard-list` | slate | Templater scaffolds |

# Recommended folder icons — falcon-wiki vault

`obsidian-icon-folder` is NOT installed in falcon-wiki by default. If you want icons there too:
1. Settings → Community plugins → Browse → "Iconize" or "obsidian-icon-folder" → install + enable.
2. Apply same mapping as above for matching folder names.

Color palette is consistent so cross-vault recognition is immediate.

# Why this is recommended vs. mandatory

Folder icons are pure visual polish — they don't affect any query, link, or content. Default Obsidian works fine without them. They become valuable once your vault crosses ~25 top-level folders (yours has 25+ in Brain SK) because the eye scans icons faster than text labels.
