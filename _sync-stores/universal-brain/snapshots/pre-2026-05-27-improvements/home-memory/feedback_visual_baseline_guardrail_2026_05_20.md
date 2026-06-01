---
name: feedback-visual-baseline-guardrail-2026-05-20
description: Ammar declared the Falcon Light Mode Visual Baseline (7 Obsidian notes in 36-Theming) the official guardrail on 2026-05-20 — any Tailwind/theme/component change must compare against it first and must not change visual characteristics without explicit Ammar approval.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 63417aa5-0017-4098-a288-0b9254613dc6
---

**Rule (declared 2026-05-20):** The 7-note Falcon Light Mode Visual Baseline cluster inside `C:\Falcon\Brain SK\_obsidian\36-Theming\` is now the **official guardrail** for every future Tailwind / theme / component change.

**The 7 baseline notes:**
1. [[Falcon Light Mode Visual Baseline]] — overall identity (surfaces, colors, borders, shadows, radius, spacing)
2. [[Falcon Current Color Usage Map]]
3. [[Falcon Current Spacing Radius Shadow Map]]
4. [[Falcon Current Hover Focus State Map]]
5. [[Falcon Organization Hierarchy Visual Standard]] — canonical reference page
6. [[Falcon Page Visual Consistency Rules]] — 12 rules for new pages
7. [[Falcon Do Not Change Visual Rules]] — 20 strict guardrails (refusal list)

**Why:**
- Prevents silent visual drift during token refactors (Wave 1+ work)
- Gives the visual-diff CI gate (Wave 13 Playwright + pixelmatch tool at `tools/visual-regression/`) a documented "before" reference
- Makes "Ammar approved this change" the only acceptable justification for any visual delta — no agent can silently introduce a new color/spacing/radius/hover/focus
- Locks customer-brand colors (aramco/bmw/rajhi/snb/bupa) and the deep-teal Falcon identity (#0d3f44 family) as invariant
- Locks the page-shell recipe (`bg-falcon-neutral-75` outer + `bg-falcon-neutral-0 border-falcon-neutral-200 rounded-[14px]` main pane) so new pages auto-inherit visual consistency

**How to apply (mandatory pre-change checklist):**

Before ANY change that touches:
- A `@theme` block or token primitive (`falcon-tailwind-tokens.css`)
- A component token contract (`libs/falcon-ui-tokens/src/components/*.tokens.css`)
- A Tailwind utility class on a page/component
- A `*-tailwind-classes.ts` class map
- The dark-mode cascade (`themes/dark.css`)
- A page-shell pattern (outer wrapper, card, tab bar, header)
- Any hover/focus/active/disabled/selected color
- Any spacing/radius/shadow value
- Any font family or font size
- A customer-brand color

**Steps:**
1. Load the 7 baseline notes — read the relevant section
2. Compare the proposed change to the documented value
3. If the change preserves the baseline → safe to proceed; cite the matching baseline section in the PR/commit message
4. If the change alters the baseline → STOP, explicitly ask Ammar for approval, cite which baseline value is being changed and why, wait for an explicit yes
5. If approved → update the relevant baseline note in the same PR so the "after" state is documented
6. Never silently introduce arbitrary values (`bg-[#hex]`, `rounded-[13px]`, `p-[7px]`, inline `style="…"`) — these bypass the guardrail

**Trigger phrases that auto-load the baseline cluster:**
- "Refactor the theme tokens"
- "Change brand color"
- "Move the page background"
- "Adjust button color/size/radius"
- "Update hover behavior"
- "Wave 1 token refactor"
- "Dark-mode work" (different scope, but baseline still pinned for light)
- "New page visual" / "New page recipe"
- "Customize component style"

**Hard constraint:** The default answer to "can I change this visual?" is **NO** unless Ammar has explicitly said yes for that specific change. Permission is cheaper than a regression.

Related: [[feedback-brain-sk-obsidian-canonical-vault-2026-05-20]] (Obsidian as the canonical write location for this knowledge). The baseline notes live at the Obsidian vault path; no parallel copy lives anywhere else.

Standing rules in effect since 2026-05-20: no code changes, no builds/tests/installs, no commits/pushes/PR comments, write only inside `C:\Falcon\Brain SK\_obsidian\` unless explicit per-file approval. Baseline notes themselves can only be updated as part of an Ammar-approved change.
