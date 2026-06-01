---
name: Falcon UI Wave 2 — post-night-shift fixes + new components + Studio
description: ACTIVE plan after the night-shift wave (21 components shipped). Phases A (parity audit + dialog colors), B (tree-table + button + multi-select + stepper fixes), C (5 new components incl. phone/email/OTP), D (deep regression), E (Theme Studio with glassmorphism). Two SSOTs locked.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ACTIVE. Night-shift Wave 1 (21 components) is complete. Wave 2 is the user's next directive — fixes + new components + Theme Studio.

**Two sources of truth:**
- **SSOT-1 (V0.2):** `C:\Taha\Falcone-V0.2` — governs every component already shipped
- **SSOT-2 (V0.3):** `C:\Taha\Falcone V0.3` — used **only** for the new phone field + OTP-send popup

**Theme SSOT (unchanged):** `libs/falcon/src/theme/falcon-tailwind-tokens.css`. NO SCSS anywhere.

## Live plan in-repo

`C:\falcon\falcon-web-platform-ui\libs\falcon-ui-core\WAVE-2-PLAN.md` — read this for the live status board, acceptance criteria per phase, and resume protocol.

## Phase summary

| Phase | What | Why |
|---|---|---|
| **A1** | Tailwind ↔ Shadow parity audit + token unification (all 21 components) | Prerequisite for Studio. Mutating one token must update both render paths. |
| **A2** | Dialog severity colors (info/success/warning/danger) | Currently mismatched with V0.2 semantic palette |
| **B1** | Tree-table true-tree-inside-table | Currently flat-looking; needs visible tree (chevron + indent rail + connectors) in first column |
| **B2** | Button icon centering | Icon-only + icon+label alignment broken at runtime |
| **B3** | Multi-select "Select All" toggle | Optional tri-state checkbox at top, no state-stale bugs |
| **B4** | Stepper bottom-center label variant | New `labelPosition` Prop value |
| **C1** | `<falcon-otp>` | N boxes, auto-advance, paste-fill, mask |
| **C2** | `<falcon-single-uploader>` | Preview tile with delete (top) + edit (bottom) overlays |
| **C3** | `<falcon-phone-field>` (V0.3) | Country dropdown + flag + verify button inside, single-element look |
| **C4** | `<falcon-email-field>` | Same as phone but no country dropdown |
| **C5** | `<falcon-otp-send-dialog>` (V0.3) | Composed: dialog + channel radio + OTP boxes |
| **D** | Full regression on `/playground` | Every probe re-run, visual diff Shadow vs Tailwind, token-mutation test |
| **E** | Theme Studio at `/studio` (no auth) | Live token editor + glassmorphism preset + export. Library at `libs/falcon-studio/`. |

## How to apply

When starting a new session in this project:
1. Read `WAVE-2-PLAN.md` first — find the first ⏸ row
2. Read `NIGHT-SHIFT-LOG.md` for Wave 1 context (taskQueue:'immediate' is set, dual-render pattern proven)
3. Read `REFERENCE-V02-INVENTORY.md` for SSOT-1 (already exists)
4. For Phase C3 / C5: explore `C:\Taha\Falcone V0.3` to inventory SSOT-2 patterns
5. Build phase-by-phase in order. A and D are cross-cutting (run sequentially). B and C have parallel-safe items but DO NOT run more than 2 agents that both touch the playground page at once (they conflict on file edits).

## Hard guardrails (carry over from Wave 1)

- No commits, no pushes without explicit user permission
- No validation work — visual states only
- Tokens-only, zero inline styles (5 existing escape hatches documented inline)
- Use `export type` for type-only re-exports
- After file writes that add new Stencil components, whitespace-touch `define-custom-elements.ts` for HMR refresh
- Stencil 4 + `taskQueue: 'immediate'` is library-wide (DO NOT REVERT)
- Tailwind only. NO SCSS. (especially in Studio — Phase E)

## Cross-session continuity

This memory file + `WAVE-2-PLAN.md` (in-repo) + `last-safe-checkpoint.md` (universal-brain) form the resume packet. The next session reads these three and picks up at the first ⏸ row.
