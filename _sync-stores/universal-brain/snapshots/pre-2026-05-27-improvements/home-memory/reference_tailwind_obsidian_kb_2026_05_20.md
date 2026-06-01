---
name: tailwind-v4-obsidian-kb
description: Brain SK Obsidian Tailwind knowledge base — 36-Theming folder with 18 vault notes (1 README + 1 library index + 11 Tailwind upstream + 4 Falcon-specific) and 5 Brain Outputs SoT files. Corrected 2026-05-20 from wrong-vault placement to canonical Brain SK location.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 63417aa5-0017-4098-a288-0b9254613dc6
---

🟢 **CREATED 2026-05-20** (corrected from initial wrong-vault placement).

## Canonical location

**Vault graph (navigation):** `C:\Falcon\Brain SK\_obsidian\36-Theming\`

**Brain Outputs SoT (Falcon-specific governance content):** `C:\Falcon\Brain Outputs\understanding\frontend\theme\`

## Vault notes (18 in 36-Theming/)

- **README.md** — cluster index
- **Tailwind CSS.md** — library entry (start here)

### Upstream (docs-anchored)
- Tailwind Installation and Setup.md
- Tailwind Theme Variables.md
- Tailwind Colors and Palette.md
- Tailwind Dark Mode.md
- Tailwind States and Variants.md
- Tailwind Custom Styles and Layers.md
- Tailwind Directives and Functions.md
- Tailwind Source Detection.md
- Tailwind Preflight.md
- Tailwind Utility-First Philosophy.md
- Tailwind Multi-Framework Strategy.md ★

### Falcon-specific (codebase-anchored)
- Tailwind Falcon Alignment Scorecard.md ★ (read first)
- Falcon Design Tokens.md
- Falcon Color Palette Audit.md
- Falcon Angular Wrapper Pattern.md
- Falcon Stencil-to-Angular Bridge.md

## Brain Outputs SoT (5 new files)

- `theme/falcon-tailwind-alignment-scorecard.md`
- `theme/falcon-design-tokens-graph.md`
- `theme/falcon-color-palette-audit.md`
- `theme/falcon-angular-wrapper-pattern.md`
- `theme/falcon-stencil-to-angular-bridge.md`

Complement the existing 11 theme/ audits (THEME_SSOT_AUDIT, APP_TAILWIND_AUDIT, etc.) without duplicating them.

## Hubs updated (3)

- `_obsidian/FRONTEND_INDEX.md` — added Theming Cluster section
- `_obsidian/FALCON_COMPONENT_INDEX.md` — added theming-context paragraph
- `_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` — added Tailwind to load order

## Component notes cross-linked (4 selective)

- `60-Components/Falcon Button.md` — added Theming & Tailwind section
- `60-Components/Falcon Input.md` — added Theming & Tailwind section (heaviest @source inline consumer)
- `60-Components/Falcon Tree Panel.md` — added Theming & Tailwind section (cited in scorecard Finding 1)
- `60-Components/Falcon Data Table.md` — added Theming & Tailwind section (palette + inline-style consumer)

## Key facts

- **Falcon's Tailwind alignment: 71%** weighted across 7 topics
- Strongest: dark mode (97%), installation (95%)
- Weakest: arbitrary-value over-use (48%), @theme discipline (62%)
- **Two killer gaps:** semantic Tier-2 tokens in `:root` not `@theme`; ~100 `@source inline("…[var(--…)]…")` safelists
- **Wave 1 fix** (4 days) → 84% + 100% boss-rule compliance (zero `bg-[var(--…)]` in templates)
- **Wave 2 fix** (+5 days) → 93%
- **Value preservation: 100%** (mathematical via `var()` chain semantics)

## How to apply

When working on Falcon theming tasks: read [[Tailwind Falcon Alignment Scorecard]] FIRST. For specific topics, navigate via [[Tailwind CSS]] index.

When asked "what does Tailwind v4 say about X": the upstream notes have docs quotes + canonical examples.

When adding new theming knowledge: write to `C:\Falcon\Brain SK\_obsidian\36-Theming\` (vault) AND `C:\Falcon\Brain Outputs\understanding\frontend\theme\` (SoT if Falcon-specific).

## Correction history

Originally written 2026-05-20 to `C:\Falcon\falcon-wiki\35-Libraries\Tailwind*.md` — **wrong vault**. Per Brain SK CLAUDE.md, falcon-wiki is a sister vault for SoT only and requires explicit user approval. Files deleted from falcon-wiki same day; recreated in canonical Brain SK vault. See [[Brain SK Obsidian is the canonical vault]] memory note for the standing rule.

## Why

User asked to build Tailwind knowledge in Obsidian with "Tailwind instructions" as index. Coverage emphasis: colors, hover/states, components, multi-framework. All 4 covered in dedicated notes.
