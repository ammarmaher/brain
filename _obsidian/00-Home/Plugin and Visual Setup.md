---
type: onboarding
purpose: plugin-setup
created: 2026-05-15
---

*** Plugin and Visual Setup — one-time Obsidian configuration ***
*** Read this when first opening the vault, or when sharing the vault with a new contributor ***

# Plugin and Visual Setup

> The vault works without any plugins — but installing the right plugins makes it dramatically better. This is a one-time, ~15-minute setup.

## Required plugin (highest ROI)

### 1. Dataview ⭐

**Why:** turns every hub's hand-maintained table into a live, self-updating query. The vault has ~267 notes with YAML frontmatter and tag taxonomies — Dataview unlocks them.

**Install:**

1. Open Obsidian → Settings → Community plugins → Browse
2. Search "Dataview"
3. Install + Enable
4. Open any hub note in `00-Home/` (e.g. `VALIDATION_INDEX`, `BACKEND_INDEX`, `ERROR_INDEX`) — you'll see live queries replace static tables

**No further config needed.** The hub notes already have Dataview blocks.

## Strongly recommended plugins

### 2. Templater

**Why:** new notes from templates with one keystroke. We have 11 templates in `_templates/` ready to go.

**Install:**

1. Settings → Community plugins → Browse → "Templater" → Install + Enable
2. Open Templater settings:
   - **Template folder location:** `_templates`
   - **Trigger Templater on new file creation:** ON
3. Settings → Hotkeys → search "Templater: Create new note from template" → bind to `Alt+N`

**Usage:** `Alt+N` → pick a template → fill prompts → done.

### 3. Iconize

**Why:** colored, recognizable folder icons in the file tree. Makes navigation faster.

**Install:**

1. Settings → Community plugins → Browse → "Iconize" → Install + Enable
2. Settings → Iconize → **Icon Pack** → install `Lucide` (or any pack you prefer)
3. Right-click each top-level folder → "Iconize → Change icon"

**Recommended folder icons:**

| Folder | Suggested icon | Hex color |
|---|---|---|
| `_templates` | `lucide:layout-template` | `#94a3b8` |
| `00-Home` | `lucide:home` | `#1f2937` |
| `05-Glossary` | `lucide:book-open` | `#14b8a6` |
| `10-Pages` | `lucide:file-text` | `#3b82f6` |
| `12-Permissions` | `lucide:shield-check` | `#f59e0b` |
| `15-PRD` | `lucide:clipboard-list` | `#a855f7` |
| `16-Journeys` | `lucide:map` | `#6366f1` |
| `30-Validation` | `lucide:check-circle-2` | `#22c55e` |
| `35-Architecture` | `lucide:building` | `#8b5cf6` |
| `40-API` | `lucide:database` | `#f97316` |
| `45-Backend` | `lucide:server` | `#10b981` |
| `47-Events` | `lucide:radio` | `#ef4444` |
| `60-Components` | `lucide:component` | `#6366f1` |
| `80-Evidence` | `lucide:camera` | `#eab308` |
| `90-Approved-Patterns` | `lucide:award` | `#84cc16` |

### 4. Folder Note Core

**Why:** click a folder name and it opens that folder's README automatically.

**Install:** Settings → Community plugins → "Folder Note Core" → Install + Enable.

**Config:**
- **Folder note type:** `README.md` (matches our existing convention)
- **Auto-create folder note:** OFF (we manage these manually)

## CSS snippet — already in place

The vault ships with a CSS snippet at `.obsidian/snippets/falcon-vault.css` that provides:

1. **Hides 3-line `*** banner ***`** in reading mode (still visible in edit mode for grep)
2. **Wider reading width (1100 px)** for long playbooks like Add Client PLAYBOOK (64 KB)
3. **Colored tag badges** — `#type/*` · `#severity/*` · `#status/*` · `#drift` · `#gap` · `#blocked` · `#security` all get distinct colors
4. **Compact YAML frontmatter** display
5. **`## Hubs` + `## See also`** sections styled as subtle footers
6. **Highlight `forward-ref` and `inferred`** markers in amber

**Enable:** Settings → Appearance → CSS snippets → toggle **`falcon-vault`** ON.

## Recommended core-plugin settings

Settings → Core plugins:

| Plugin | Setting | Why |
|---|---|---|
| **Workspaces** | Enable | Save your preferred pane layout for the vault |
| **Backlinks** | Enable | Right sidebar shows what links to current note (critical for graph navigation) |
| **Graph view** | Enable | `Ctrl+G` shows the knowledge graph |
| **Outline** | Enable | Right sidebar shows `##` hierarchy of current note |
| **Tag pane** | Enable | Browse the tag taxonomy |
| **Page preview** | Enable | Hover over wiki-links to preview without clicking |
| **Quick switcher** | Enable | `Ctrl+O` jump to any note by name |
| **Templates** (built-in) | Disable | We use Templater instead — more powerful |

## Optional plugins (nice but not essential)

| Plugin | What it adds |
|---|---|
| **Tag Wrangler** | Bulk rename / merge tags |
| **Style Settings** | UI to customize CSS variables without editing CSS |
| **Excalidraw** | Hand-drawn diagrams inside notes |
| **Breadcrumbs** | Auto-generated parent/child nav strip |
| **Highlightr** | Multi-color highlighting in text |
| **Mind Map** | Render outline notes as mind maps |
| **Smart Connections** | AI-powered semantic search across notes (already installed if `.smart-env/` exists) |

## Pinned notes — set these as your starting points

Right-click these notes in the file explorer → "Pin tab" or use the Star plugin:

1. [[🟢 Start Here]]
2. [[AMMAR_BRAIN_HOME]]
3. [[IMPLEMENTATION_KNOWLEDGE_MAP]]
4. [[How to contribute to this vault]]

## After setup — verify

1. Open `VALIDATION_INDEX.md` → see "🔍 Live queries (Dataview)" section → if it renders a live table, Dataview is working.
2. Open the file explorer → top-level folders should have colored icons (if you set Iconize).
3. Hover over any wiki-link → preview should appear (if Page Preview core plugin is enabled).
4. Read mode on any note → the 3-line `*** banner ***` should be muted/hidden (if `falcon-vault` snippet is enabled).
5. `Alt+N` → should open Templater picker with 11 templates available.

If any of the above doesn't work, revisit that plugin's settings.

## Tags

#type/onboarding

## Hubs

- [[🟢 Start Here]] · [[AMMAR_BRAIN_HOME]] · [[How to contribute to this vault]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
