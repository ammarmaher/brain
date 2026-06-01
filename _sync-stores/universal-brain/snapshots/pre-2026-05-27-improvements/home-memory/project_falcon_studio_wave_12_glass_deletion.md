---
name: Falcon Studio — Wave 12 (Glass DELETION + Multi-Agent Senior Build)
description: ACTIVE 2026-05-08 — Wave 12 dispatching after user demanded glass code DELETION (not hide). Multi-agent parallel orchestration for examples registry. Brain mindsets engaged. 10-min progress cadence committed. Locked: user-visibility self-verify (no more build-green-but-invisible failures).
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-08:** ACTIVE — 12A (glass deletion) dispatching first; 12B-12H sequential with 12C in 4-way parallel.

## Goal

Delete all Glass / Glossify / Liquid Glass code (not hide). Rebuild Studio with 4-region layout + 30-component examples registry + color panel + animation tab + Tailwind tabs underline parity. Result MUST be user-visible (token-write → consumer → DOM trace required).

## Plan file

`libs/falcon-studio/WAVE-12-PLAN.md` — full sub-wave decomposition + multi-agent parallel architecture diagram.

## Sub-waves

- **12A** — DELETE all glass/glossify/liquid-glass files + scrub imports/exports/tokens. (1 agent, sequential.)
- **12B** — Foundation rebuild: 4-region studio-page layout + new registry types + 9th "Animations" category tab. (1 senior architect, sequential.)
- **12C** — Examples Registry population in 4 PARALLEL slices:
  - 12C-1: forms (input/dropdown/multi-select/checkbox/radio/switch/textarea/OTP/phone/email/date)
  - 12C-2: data + actions (button/table/tree-table/tree/paginator)
  - 12C-3: containers + nav (card/stat-card/accordion/tabs/stepper/calendar)
  - 12C-4: overlay + feedback (dialog/otp-send-dialog/tooltip/toast/single-uploader/uploader)
  - + 1 merge agent
- **12D** — Right rail universal common actions (Size/Spacing/Alignment/Shape/Border/Shadow/Text/States/Reset/Apply-to-all). All tokens paired with confirmed consumers in `*-tailwind-classes.ts`.
- **12E** — Left rail per-component INTERNAL_MATRIX expansion (~20 components, every token paired with consumer; FIX Wave 10D stepper-shape no-op).
- **12F** — Bottom collapsible color panel (primary L / secondary R) + Animation tab (presets + speed).
- **12G** — Tailwind tabs underline parity (remove Wave 10B static border-b, rely on sliding span only — Shadow parity).
- **12H** — Final regression + 50-row audit + 12 self-verify flow traces.

## Locked operator commitments

- **Brain banner shown at session start** ✓
- **10-minute progress checkpoint cadence** — status block after every agent return + interim beacons for long-running agents
- **Multi-agent parallel orchestration** — 12C dispatches 4 ammar-web-platform-ui agents in parallel (non-overlapping files)
- **Styling skills standing context** — every brief references design-eng / polish / ui-ux-pro-max / noor-instructions
- **User-visibility self-verify rule LOCKED** — no more "build green ≠ visible" failures; every token write paired with confirmed DOM consumer

## Key audit-driven adjustments (from Wave 11A)

- `border-button` doesn't exist as a tab variant — colloquial for the active-tab underline. Fix is to remove Wave 10B's static border-b (Shadow parity via sliding span only).
- Wave 10D stepper shape token writes were no-op (`--falcon-stepper-step-shape` / radius / rotate written but `falconStepperDotClasses` doesn't read). Fix in 12E with paired consumer line.
- 10 components still need editor support: radio · single-uploader · uploader · paginator · table · tree-table · tree · otp-send-dialog · tooltip · toast-host. All covered in 12C examples + 12E INTERNAL_MATRIX.
- 2 prop gotchas in gallery-defaults: `maxChipsVisible` (multi-select) + `previewMode` (single-uploader) don't exist on -tw variants. DROP from registry.

## Hard guardrails

- Glass DELETED (not hidden) — `grep "glass\|glossify"` → zero matches
- Tailwind variants only
- No invented props
- Token SSOT, no static values, no new design system, no exposed token names
- Build green-gated, 2-retry max
- No dev-serve
- Self-verify before claiming GREEN

## Cross-session resume

1. `libs/falcon-studio/WAVE-12-PLAN.md`
2. `libs/falcon-studio/WAVE-11A-AUDIT-REPORT.md`
3. `libs/falcon-studio/WAVE-11-PLAN.md`
4. Memory: `project_falcon_studio_wave_11_examples_registry.md`, `project_falcon_studio_wave_10_ux_completeness.md`
