---
name: No inline styles, tokens only — hardened in styling skills
description: All Falcon frontend styling MUST use design tokens; zero inline styles, zero raw hex/rgb/border/radius/shadow values
type: feedback
originSessionId: 151c0931-dc6c-4d88-b65d-741f26b483e9
---
**Rule:** Two non-negotiables now codified in every Falcon styling skill:

1. **ZERO inline styles** — no `style="..."`, no `[style]`, no `[style.prop]`, no `[style.--var]` (without justification), no `[ngStyle]`. Only carve-out: a runtime-computed value bound as a CSS custom property AND consumed from a tokenized stylesheet, with a `// reason:` comment.
2. **Tokens only — never raw values** — every color, border, radius, shadow, spacing, font-size, font-weight, line-height, z-index, and breakpoint MUST come from a Falcon design token declared in the canonical Tailwind v4 `@theme` SSOT (`libs/falcon/src/theme/falcon.theme.css`). Banned: raw hex, raw rgb/rgba/hsl, hardcoded `1px solid #ccc`, hardcoded `border-radius: 4px`, hardcoded `box-shadow`, Tailwind arbitrary values with literals (`bg-[#fff]`, `w-[732px]`, `rounded-[6px]`, `text-[14px]`), Tailwind default palette (`bg-blue-500`, `text-red-600`).

**Why:** User instruction (2026-05-05) — codified into skills so every agent enforces the same gate without re-asking.

**How to apply:**
- Source-of-truth files updated:
  - `brain-skills/Front-End-skills/angular-tailwind-skill/Skill.md` — added §2/§3 non-negotiables, token-source map, mandatory pre-finish grep table
  - `brain-skills/Front-End-skills/angular-tailwind-skill/resources/tailwind-rules.md` — added "Borders / radii / shadows", "Inline styles — banned", expanded "Do not"
  - `brain-skills/Front-End-skills/angular-tailwind-skill/resources/styling-do-and-dont.md` — expanded Do/Don't lists, replaced review trigger with full grep-pattern table
  - `brain-skills/code-skills/falcon-project-standards-skill/resources/falcon-ui-rules.md` — added "Styling — non-negotiable" section pointing at the angular-tailwind-skill rules
- Pre-finish gate is a mandatory grep against the diff covering: `style=`, `[style]`, `[style.`, `[ngStyle]`, `#[0-9a-f]{3,8}`, `rgb(`, `rgba(`, `hsl(`, Tailwind arbitrary values with `px`/`rem`/`#`, default palette names, `!important`, `::ng-deep`, `@apply`, `@media`, `prefers-color-scheme`, hardcoded border/radius/shadow.
- Token sources (single source of truth): colors/spacing/radii/shadows/typography/breakpoints → canonical Tailwind v4 `@theme` SSOT at `libs/falcon/src/theme/falcon.theme.css`. Never declare a token outside this file. PrimeNG was fully uninstalled (2026-05-10) — no PrimeNG preset exists.
