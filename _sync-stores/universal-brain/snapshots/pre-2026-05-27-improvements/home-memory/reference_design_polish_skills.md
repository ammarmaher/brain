---
name: design-eng + polish skills (external) installed in Brain
description: Two GitHub-cloned design skills — Emil Kowalski's design-engineering rules and Peter Bakaus's impeccable design vocabulary (renamed "polish" in Falcon) — wired into the Brain integrity check and slash commands
type: reference
originSessionId: a26d80da-eafa-4a52-af73-9f7abc7d3f70
---
Two external GitHub design skills installed under `C:\falcon\brain-skills\Front-End-skills\` on 2026-05-03.

**1. design-eng (from emilkowalski/skill)**
- Source: `https://github.com/emilkowalski/skill`
- Local path: `C:\falcon\brain-skills\Front-End-skills\emil-design-eng-skill\Skill.md` (28 KB)
- Purpose: Emil Kowalski's design-engineering philosophy — UI polish, component craft, animation decisions, the invisible details that make software feel right.
- Key contract: when reviewing UI code, MUST output a `| Before | After | Why |` markdown table (not a Before:/After: list).
- Core principles: taste is trained · unseen details compound · beauty is leverage.
- Slash command: `/design-eng <request>` at `C:\Users\Pc5\.claude\commands\design-eng.md`.

**2. polish (from pbakaus/impeccable, renamed for Falcon context)**
- Source: `https://github.com/pbakaus/impeccable`
- Local path: `C:\falcon\brain-skills\Front-End-skills\polish-skill\` (Skill.md + reference\* + scripts\*)
- Purpose: Comprehensive design vocabulary skill — audit, critique, polish, animate, colorize, harden, optimize, adapt, layout, typography, motion, UX writing, anti-pattern detection.
- Reference files (35 topics in `reference/`): adapt, animate, audit, bolder, brand, clarify, cognitive-load, color-and-contrast, colorize, craft, critique, delight, distill, document, extract, harden, heuristics-scoring, interaction-design, layout, live, motion-design, onboard, optimize, overdrive, personas, polish, product, quieter, responsive-design, shape, spatial-design, teach, typeset, typography, ux-writing.
- License: Apache 2.0 (based on Anthropic's frontend-design skill).
- Upstream name "impeccable" preserved in Skill.md frontmatter; Falcon-context alias is `/polish`.
- Slash command: `/polish <subcommand>` at `C:\Users\Pc5\.claude\commands\polish.md` — passes the subcommand and loads matching reference file.
- Note: the upstream skill includes Node scripts (`load-context.mjs`, `live.mjs`, etc.) that require `npx impeccable` package globally. We are NOT running them by default — Claude reads the markdown rules. Scripts can be invoked via Bash if/when needed.

**Wiring:**
- `show-banner.ps1` skill registry has both new entries (`design-eng`, `polish`) and FRONT-END group now shows 7 items in the integrity check (was 5).
- `preview-commands-banner.ps1` has a new "DESIGN POLISH" card between "REVIEW & AUTOMATION" and "STATUS" with `/design-eng` and `/polish` commands. Footer count updated from 18 to 20.
- Both scripts re-saved with UTF-8 BOM for PowerShell compatibility.

**Total slash commands now: 22** (20 in panel + `/list` + `/ls`).
**Total skills tracked in integrity check: 27** (was 25).
