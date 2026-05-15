---
type: onboarding
purpose: visual-legend
created: 2026-05-15
---

*** Color Legend — what every color in the vault means ***
*** Graph view · file tree · tag badges all use the same palette ***

# 🎨 Color Legend

> The Falcon Brain SK vault uses a consistent color palette across the **graph view** (`Ctrl+G`), the **file-tree folders**, and the **inline tag badges**. Each `#type/*` tag has one canonical color — same color everywhere.

## Type colors (the main palette)

| Color | `#type/*` tag | Folder | Hex |
|---|---|---|---|
| 🔴 Red | `#type/v-rule` | `30-Validation/` | `#EF4444` |
| 🟠 Amber | `#type/e-entity` | `40-API/` | `#F59E0B` |
| 🟠 Orange | `#type/kafka-event` | `47-Events/` | `#F97316` |
| 🌸 Rose | `#type/error-code` | _(SoT only)_ | `#F43F5E` |
| 🩷 Pink | `#type/learning-event` | `80-Evidence/` | `#EC4899` |
| 🟣 Fuchsia | `#type/prd-module` | `15-PRD/` | `#D946EF` |
| 🟪 Purple | `#type/architecture-rules` | `35-Architecture/` | `#A855F7` |
| 🟪 Violet | `#type/falcon-component` | `60-Components/` | `#8B5CF6` |
| 🔵 Indigo | `#type/journey` | `16-Journeys/` | `#6366F1` |
| 🔵 Blue | `#type/page` | `10-Pages/` | `#3B82F6` |
| 🔵 Sky | `#type/flow` | _(inside 10-Pages)_ | `#0EA5E9` |
| 🟢 Teal | `#type/glossary-term` | `05-Glossary/` | `#14B8A6` |
| 🟢 Emerald | `#type/backend-service` | `45-Backend/` | `#10B981` |
| 🟢 Lime | `#type/onboarding` | _(vault root)_ | `#84CC16` |
| 🟡 Yellow | `#type/permission-matrix` | `12-Permissions/` | `#EAB308` |
| ⬜ Slate | `#type/hub` | `00-Home/` | `#64748B` |
| ⬜ Gray | `#type/template` | `_templates/` | `#94A3B8` |
| ⬜ Light gray | `#type/index` | _(folder READMEs)_ | `#CBD5E1` |

## Reading the graph view at a glance

When you open the graph (`Ctrl+G`), here's what you'll see:

- **Big red cluster** (`30-Validation`) — the 25 V-rules. They radiate edges to PRDs (fuchsia) + backend services (emerald) + components (violet).
- **Big violet cluster** (`60-Components`) — 62 Falcon component notes.
- **Big orange cluster** (`47-Events`) — 20 Kafka/Redis/webhook event nodes.
- **Big teal cluster** (`05-Glossary`) — 44 glossary terms.
- **Tight slate hub center** (`00-Home`) — every hub note connects to everything else.
- **Blue + sky satellites** (`10-Pages`) — page notes + flow notes.
- **Indigo bridge cluster** (`16-Journeys`) — 7 cross-page journeys connecting pages, flows, services, events.
- **Lime starter dot** — `🟢 Start Here` (the entry point).

## Severity overlay (cross-cutting)

Severity tags add a second layer of meaning, visible in the inline tag badges:

| Tag | Color | Meaning |
|---|---|---|
| `#severity/high` | 🔴 Red text on light red background, **bold** | V-rules / E-entities / drifts that need engineering attention |
| `#severity/medium` | 🟠 Amber text on light amber background | Normal weight |
| `#severity/low` | ⬜ Gray text on light gray background | Cosmetic / nice-to-have |

## Status badges

| Tag | Style |
|---|---|
| `#status/approved` | 🟢 Bold emerald — passed Deep Page Learning |
| `#status/promoted` | 🟢 Bold deep-emerald — globally promoted |
| `#status/draft` / `#status/stub` | ⬜ Faded gray |
| `#status/deprecated` / `#status/rejected` | 🔴 Red + ~~strikethrough~~ |

## Cross-cutting flag badges

| Tag | Color | When |
|---|---|---|
| `#drift` | 🟠 Bold amber | PRD ↔ Backend DTO mismatch documented |
| `#gap` | 🔴 Bold red | Known gap in PRD or backend (e.g. GAP-TM-01) |
| `#blocked` | 🔴 Bold red | Cannot ship until prerequisite resolves |
| `#security` | 🟡 Bold gold | Security-flagged item (e.g. `DevOtpCode?` leak) |

## Where the colors come from

| Surface | Configured in | Notes |
|---|---|---|
| Graph view nodes | `_obsidian/.obsidian/graph.json` → `colorGroups` | 18 color groups, one per `#type/*` tag |
| File-tree folder borders | `_obsidian/.obsidian/snippets/falcon-vault.css` → section 8 | Left-border stripe per top-level folder |
| Inline tag badges (reading mode) | Same CSS → section 3 | Colored pill per tag |
| Severity emphasis | Same CSS → section 3 (severity rules) | Bold + color for high; muted for low |
| Cross-cutting flags | Same CSS → section 3 (`#drift`, `#gap`, `#blocked`, `#security` rules) | Strong colors to grab attention |

## 🖤 Venom theme — optional symbiote aesthetic

A second CSS snippet `venom-theme.css` ships with the vault for users who want **a glossy black symbiote look** on top of the functional palette above.

**Enable:** Settings → Appearance → CSS snippets → toggle **`venom-theme`** ON (alongside `falcon-vault`).

What you get:
- 🖤 Deep symbiote-black canvas (radial gradient from `#0a0a14` → `#000000`) — replaces all backgrounds
- 🤍 Silver/white primary text with subtle pearlescent glow
- 🔴 Venom-red glints on `#severity/high`, `#gap`, `#blocked`, `#status/deprecated` tags
- 🟡 Venom-gold treatment for `#security` tags (poisonous warning)
- ✨ **Pulse animation** on the 3 brain entry points (`🟢 Start Here` · `AMMAR_BRAIN_HOME` · `IMPLEMENTATION_KNOWLEDGE_MAP`) — soft 3.5 s breathing pulse normally, 1.2 s urgent pulse on hover
- 🩸 Wiki-links glow white-on-hover with red undertone shadow (tendril effect)
- 💉 Selected text gets venom-bite red highlight
- 🌑 Glossy gradient h1 headings (white → silver → gray)
- ⚡ Animated tendril sliding down the left edge of blockquotes
- 📊 Tables with red-bottom-border thead + hover row glow
- 🎯 Active note in file tree gets a venom-red left border + claim-glow
- 💻 Code blocks with embossed inset shadow
- 🪲 Scrollbar styled as venom tendrils

**Best with Obsidian's Dark theme** (Settings → Appearance → Base color scheme → Dark). The venom snippet does nothing in Light mode.

**To disable just venom (keep functional styling):** toggle `venom-theme` OFF, keep `falcon-vault` ON. The functional palette + file-tree borders survive.

## ⚙ Recent fix — tag-nodes disabled in graph view

If you saw nodes named just `04`, `3`, `high`, `commerce` etc. in the graph view — those were **tag nodes**. Obsidian renders every tag in the vault as a small node when `showTags: true`.

Fixed in `graph.json` by setting `showTags: false`. The file nodes are still colored by their tags (because color groups match notes that have the tag, not the tag-as-a-node itself).

To re-enable tag-nodes: open the graph view → Settings panel (gear icon) → "Display" → toggle "Tags" ON.

## How to enable everything

1. **Graph view colors:** open `Ctrl+G` — colors apply automatically (read from `graph.json`).
2. **File-tree colors + tag badges:** Settings → Appearance → CSS snippets → toggle **`falcon-vault`** ON.
3. **Tag visibility in graph:** in the graph view's settings panel, ensure "Show tags" is ON (already set in `graph.json`).

## How to customize

To rename a color:

1. Open `_obsidian/.obsidian/snippets/falcon-vault.css`
2. Find the line for the type (e.g. `.tag[href^="#type/v-rule"]`)
3. Change `background-color` to your preferred hex
4. **Also update** `_obsidian/.obsidian/graph.json` — find the matching `colorGroups` entry and convert your hex to RGB-as-integer (e.g. `#EF4444` → `(0xEF << 16) | (0x44 << 8) | 0x44 = 15683396`)
5. Reload Obsidian (`Ctrl+P` → "Reload app without saving")

## Hubs

- [[🟢 Start Here]] · [[AMMAR_BRAIN_HOME]] · [[How to contribute to this vault]] · [[Plugin and Visual Setup]]
