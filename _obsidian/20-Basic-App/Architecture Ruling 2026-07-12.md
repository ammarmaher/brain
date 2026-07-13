---
type: decision
slug: basic-app-architecture-ruling
prd-implements: [PRD-06]
status: final
created: 2026-07-12
---
*** USER RULING (Ammar, 2026-07-12) — supersedes ALL prior placements ***
*** Vault file: 20-Basic-App/Architecture Ruling 2026-07-12.md ***

# Basic App architecture ruling — FINAL

## The ruling (verbatim intent)
1. **The shared library serves ALL applications** (admin console, management console, surveys,
   basic app, whatever comes next). It is a *static* library of components — nothing inside it
   may be named after, or exist only for, the basic app.
2. **The basic app's code lives in its own folder: `apps/basic-app`** — at the same level as
   `apps/admin-console` and `apps/management-console`. Everything the basic app owns (features,
   models, seed services) goes inside it.
3. **Customization = generic flags.** When the basic app (or any app) needs a component to change
   shape/style, extend the *generic* component with an app-agnostic input — e.g. `static: true|false`
   — never a basic-app-named variant. Only create a NEW library component when genuinely necessary.
4. **Delete what is unused.** Anything not wired into the running code gets removed.

## What was executed (same day)
- Moved `libs/falcon/src/shared-features/basic-app/` → `apps/basic-app/src/`
  (`app/features/home`, `app/features/compose`, `app/models`, `app/services`, `src/index.ts` barrel).
- Library residue deleted; `libs/falcon` no longer contains ANY basic-app artifact.
- Alias rewired: `@falcon/basic-app` → **`@basic-app`** → `apps/basic-app/src/index.ts`
  (tsconfig.base.json), whitelisted in `eslint.config.mjs` module-boundaries `allow`
  exactly like the `@host-shell/shared/*` precedent.
- Both consoles mount the routes from `@basic-app`; runtime behavior unchanged
  (`…/marketplace/basic-app` in both consoles, Send → `send/whatsapp`).
- Gates after the move: both console builds green · 36/36 + 7/7 specs green · `basic-app:lint` 0 errors.

## Placement history (for graph honesty)
D-1: `apps/basic-app` as MF remote :4303 (runtime-verified) → reversal: "internal application"
(misread as *inside the consoles*; code landed in `libs/falcon/shared-features`) → **THIS ruling:
`apps/basic-app` folder, consumed by the consoles — no new Module-Federation remote/port.**

Links: [[00 Basic App MOC]] · [[SoT Parity and Token Re-pointing]]

## Structure contract (same ruling, 2nd part)
Each component in **its own folder**; the app feature-root carries **models/ + validations/ + services/**
tiers — the Brain SK `component-layout.md` contract as practiced by the voice-service precedent
(`pages/voice-service/{models,services,validations,<component-folders>}` with sub-components nested).
Canonical tree: `Brain Outputs/prd/modules/06-basic-send-application/STRUCTURE_CONTRACT.md`.
Applied right after Wave F4 lands; waves F5+ inherit it.

## Basic-only rule (same ruling, 3rd part)
"Just the Falcon component — don't create something from your end; make it basic; zero native HTML;
the calendar must load time." Custom popovers, phone-frame art, SVG charts, IVR canvas, and the native
`<dialog>` confirm shells are all REMOVED in wave B1 — replaced by falcon tooltip/tag, falcon cards,
small falcon data-tables, and FalconConfirmService. Scheduled time = date-picker + one half-hour-slot
dropdown (the shared date-picker has no time mode; a generic `showTime` flag is a flagged follow-up).
Plan: `Brain Outputs/prd/modules/06-basic-send-application/BASIC_ONLY_PLAN.md`.
