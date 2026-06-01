---
name: brain-sk-obsidian-is-the-canonical-vault
description: 🔴 RULE 2026-05-20. The Brain SK Obsidian vault at C:\Falcon\Brain SK\_obsidian\ is the canonical knowledge graph. C:\Falcon\falcon-wiki\ is a SISTER vault (SoT) — do not write there without explicit user approval. I violated this rule on 2026-05-20 by adding Tailwind knowledge to falcon-wiki; corrected by moving to Brain SK\_obsidian\36-Theming\.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 63417aa5-0017-4098-a288-0b9254613dc6
---

🔴 **STANDING RULE 2026-05-20.**

## The rule

**Canonical Obsidian vault:** `C:\Falcon\Brain SK\_obsidian\`

This is the primary Obsidian vault for Brain SK knowledge. ALL new vault knowledge (notes, indexes, library docs) goes here.

**Sister vault (SoT-only):** `C:\Falcon\falcon-wiki\`

This is the Falcon SoT architecture-wiki vault. **Do NOT write here without explicit user approval.** It exists for separate Falcon-architecture concerns (Software Architecture Design, Security Architecture, etc.) — not for design-system / library / theming knowledge.

## Why

Per `C:\Falcon\Brain SK\CLAUDE.md`:

> "A sister vault exists at `C:\Falcon\falcon-wiki` (Falcon SoT vault). Do not switch to it without explicit Ammar approval."

Per the same CLAUDE.md "Permanent Rule: Obsidian Knowledge Graph Vault Structure":

> "The Obsidian vault at `C:\Falcon\Brain SK\_obsidian` is the graph/navigation/view layer over Brain Outputs."

## How to apply

When asked to "add to Obsidian", "add to the vault", "save to Obsidian knowledge base":

1. **Default target:** `C:\Falcon\Brain SK\_obsidian\<appropriate-folder>\`
2. **Falcon-specific governance content also gets a Brain Outputs SoT counterpart** at `C:\Falcon\Brain Outputs\understanding\<area>\`
3. **Never write to `C:\Falcon\falcon-wiki\`** unless the user explicitly says so

## The 2026-05-20 incident

I added 12 Tailwind v4 knowledge files to `C:\Falcon\falcon-wiki\35-Libraries\Tailwind*.md` — the wrong vault. User caught it. Corrected:

- ❌ Deleted: 12 files from `C:\Falcon\falcon-wiki\35-Libraries\Tailwind*`
- ✅ Created: 18 vault notes at `C:\Falcon\Brain SK\_obsidian\36-Theming\`
- ✅ Created: 5 Brain Outputs SoT at `C:\Falcon\Brain Outputs\understanding\frontend\theme\`

## Related

- [[Tailwind v4 Obsidian KB]] — the (initially mis-located, now corrected) Tailwind knowledge base entry
- Falcon-vault conventions: 3-line banner at top · YAML frontmatter with type + created · wiki-links use base names only · `## Hubs` at bottom

## Trigger phrases

- `add to Obsidian` → Brain SK
- `add to vault` → Brain SK
- `save to vault` → Brain SK
- `falcon-wiki` is SoT only — never write without approval
