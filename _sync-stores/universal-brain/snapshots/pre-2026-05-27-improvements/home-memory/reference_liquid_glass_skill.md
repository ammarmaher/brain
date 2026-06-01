---
name: Liquid Glass skills (on-demand) — Falcon UI glassmorphism reference
description: Two Liquid Glass design-system skills installed under brain-skills/Front-End-skills/liquid-glass-skill/. ON-DEMAND only, NOT auto-loaded, NOT in the brain banner. Used for the Falcon Theme Studio's glassmorphism preset and any future glass component variants.
type: reference
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Installed 2026-05-08** at `C:\falcon\brain-skills\Front-End-skills\liquid-glass-skill\` per user request. **NOT auto-loaded** — explicitly on-demand only.

## What's there

Two sub-skills inside the parent folder:

1. **`tontoon-liquidglass-tailwind/`** (https://github.com/Tontoon7/liquidglass-tailwind)
   - Apple iOS 26 Liquid Glass as a Tailwind CSS plugin + Claude Code skill
   - Actionable for Falcon's web stack — direct Tailwind utility classes (`glass-card`, `glass-shine`, etc.) + `@theme` token contract
   - Design rule book: `tontoon-liquidglass-tailwind/skill/liquidglass-design.md`
   - Source plugin: `tontoon-liquidglass-tailwind/src/` (theme.ts + filters.css + index.ts)

2. **`haider-liquid-glass/`** (https://github.com/haider-nawaz/liquid-glass-skill)
   - Apple SwiftUI Liquid Glass — native iOS/macOS reference, NOT for our web stack
   - Useful only for understanding Apple's canonical vocabulary / intent

## Loading rule (locked)

- **NOT in the brain banner** (`Brain/scripts/show-banner.ps1` does not list these — verified)
- **NOT in `CLAUDE.md` Front-End skills auto-load section**
- Activates ONLY when an agent explicitly reads one of the files, OR when task description matches trigger keywords

## Trigger keywords (when to surface this skill)

`glassmorphism`, `liquid glass`, `glass design`, `iOS 26 style`, `frosted glass`, `Mac glass`, `Apple Macintosh theme`, `glass card`, `glass button`, `glass dialog`, `backdrop-filter`, `frosted backdrop`, `Studio glass preset`

## How to use in autopilot

When dispatching an agent for a task involving glass styling:
1. Add to the agent's REQUIRED FILES TO READ:
   - `C:\falcon\brain-skills\Front-End-skills\liquid-glass-skill\README.md` (overview)
   - `C:\falcon\brain-skills\Front-End-skills\liquid-glass-skill\tontoon-liquidglass-tailwind\skill\liquidglass-design.md` (design rules)
   - Optionally `…\tontoon-liquidglass-tailwind\src\theme.ts` + `src\filters.css` (concrete utility implementations)
2. Skip `haider-liquid-glass/` unless the task involves SwiftUI / native iOS reference

## Connection to current work

- Wave 2 Phase E (Theme Studio) shipped 2026-05-08 with a hand-rolled glassmorphism preset at `libs/falcon-studio/`. Current preset uses `backdrop-filter: blur(20px) saturate(180%)` with translucent surfaces.
- **Next iteration candidate:** integrate the Tontoon plugin's tokens (`--color-glass-light/medium/strong`, `--shadow-glass`, `--shadow-glass-lg`, `--shadow-glass-inset`, `--radius-glass-sm/md/lg/xl`) into `libs/falcon/src/theme/falcon-tailwind-tokens.css` for richer fidelity. The Studio's glassmorphism preset would then chain through those tokens automatically.
- The user's stated aesthetic goal: "glassmorphism … like a new theme for Apple Macintosh." The Tontoon skill is the canonical reference for hitting that bar.
