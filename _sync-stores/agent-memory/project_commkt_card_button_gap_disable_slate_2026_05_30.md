---
name: project_commkt_card_button_gap_disable_slate_2026_05_30
description: Mgmt comm-mkt grid-card action buttons — tightened icon↔label gap to SoT 6px and re-pointed the Disable button to SoT slate
metadata: 
  node_type: memory
  type: project
  originSessionId: 943a06f3-f96e-4d58-9553-6d5318f95b69
---

# Mgmt comm-mkt grid-card action buttons → SoT icon-gap + slate Disable — 2026-05-30

🟢 BUILD-GREEN (`nx build management-console --configuration=development --skip-nx-cache` EXIT 0, hash `14db26353cfb49ba`, 20.2s) · NOT browser-verified · NO COMMITS · branch `night-shift-audit/2026-05-30-0128`. Builds on [[project_comm_mkt_card_button_sot_size_2026_05_30]] + [[project_commchannels_marketplace_dopayment_signalr_2026_05_30]].

**User ask:** in the common-channel + application **grid (card)** view, per-card action buttons (icon + label): (1) **decrease icon↔label gap**; (2) the **Disable** button must take the **dark navy/slate** background from the supplied screenshot; (3) inter-button spacing should match the ticked screenshot; (4) Do Payment teal is already correct; (5) follow brain skill structure.

**Surface = mgmt ONLY, 1 file.** Shared `app-comm-mkt-card` (`apps/management-console/.../comm-mkt-view/components/card/comm-mkt-card.component.ts`, inline template) serves BOTH the CommChannels grid AND the Marketplace/Applications grid → one edit covers both. admin-console has no such card (grep-confirmed). Buttons are the Falcon `<falcon-angular-button>` (kept per the prior "must use the Falcon component" directive; the UPDATE-3 migration in [[project_comm_mkt_card_button_sot_size_2026_05_30]] is the current state).

**Lever = per-instance CSS-custom-property override (NO shared-lib edit, NO Stencil regen).** Every falcon-button visual is token-driven (`[CODE] button.tokens.css`) and the token defaults use the **zero-specificity `:where(falcon-button, falcon-button-tw, falcon-angular-button, …)`** selector, so an inline `[style.--token]` on the instance always wins. Established repo precedent: `[CODE] client-comm-channels-step.component.html:32 [style.--falcon-table-row-height]='60px'` (admin Add-Client wizard table). Applied on the `@for` action button:
- `[style.--falcon-button-gap-md]="'6px'"` → icon↔label gap **12px → 6px** on ALL 3 actions. SoT `[CODE] admin/comm-mkt.css:343 .cm-btn { gap:6px }` (Falcon md token was `[CODE] button.tokens.css:62 --falcon-button-gap-md:12px`).
- Disable instance ONLY (`a.id==='disable'`): `--falcon-button-primary-dark-bg`→`#1F2937`, `…-bg-hover`/`…-bg-active`→`#111827`, `…-border`→`#1F2937`, `…-border-hover`→`#111827`. SoT `[CODE] comm-mkt.css:357 .cm-btn-dark { background:#1F2937; hover #111827 }`. (Disable keeps `variant="primary-dark"` for white text + disabled handling; only its dark fill is re-pointed.)
- Updated `btnVariant()` doc comment + ACTIONS template comment to describe the slate override (no stale comments — night-shift-audit comment governance).

**Why a literal slate hex, not a token (KEY REUSABLE FACT):** the Falcon neutral palette is warm-grey AND **inverts under `.app-dark`** — `[CODE] falcon-tailwind-tokens.css:78 --color-falcon-neutral-800:#3d3d3d` → `:546 #f1f3f5` in dark; `neutral-900 #1a1a1a`, `neutral-925 #111827` likewise flip. So NO neutral token can carry a FIXED dark fill (a slate button would turn near-white + white text in dark mode = broken). The design system has no neutral-slate variant; its `primary-dark` is deliberately brand-fixed teal. The SoT `.cm-btn-dark` is a fixed literal `#1F2937` for exactly this reason. ⇒ for a button that must stay dark in both themes, the SoT literal is the correct, dark-safe choice; cited in code so it's not mistaken for arbitrary hex.

**Inter-button gap: NO change needed** — already `[CODE] card-status.tokens.css:47 --falcon-card-status-actions-gap:8px` = SoT `[CODE] comm-mkt.css:330 .cm-card-actions { gap:8px }`. The visible tightening the user wanted is delivered by the icon↔label fix; the pair then reads like the ticked screenshot. **Sizing (38px h / 10px radius / 16px pad-x)** left as the accepted Falcon `md` spec — user didn't ask to change it this round (and the prior session already reverted the 36px experiment to Falcon md).

**Verification:** build EXIT 0 (above); `[style.--token]` AOT-compiles fine in the inline template; `falcon-ui-button-tw.js` in bundle. NOT browser — mgmt comm-mkt page needs the full Docker stack + acc-owner login + a node with comm-channel/app data in Disable/DoPayment/Enable-surfacing statuses (historically flaky). Browser E2E = remaining step. NO COMMITS.

**Concurrency (hazard realized):** the shared `universal-brain/state/current-task.json` was clobbered mid-task by ≥1 other live Claude session (flipped to a `settings-edit-authority-investigation` task on branch `polishing-v0.4`). Did NOT stomp the peer's active state; durable records = `universal-brain/state/task-history/20260530_1216_commkt-card-action-button-style.md` + this memory. Lesson reaffirmed (see [[project_commchannels_marketplace_dopayment_signalr_2026_05_30]]): on this machine the shared brain JSON is contended — keep durable records in task-history + memory, never overwrite an in_progress peer task.
