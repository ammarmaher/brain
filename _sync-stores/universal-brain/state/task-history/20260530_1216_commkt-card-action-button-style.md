# Task — Comm-channel & Application grid card: action-button styling to SoT

- **Status:** ✅ COMPLETED — build-green, NOT browser-verified, NO COMMITS
- **Date:** 2026-05-30 (~12:16 UTC build)
- **Repo:** C:/Falcon/Falcon/falcon-web-platform-ui
- **Branch:** night-shift-audit/2026-05-30-0128 (my session's checkout)
- **Files:** 1 — `apps/management-console/src/app/features/comm-mkt-view/components/card/comm-mkt-card.component.ts`

## User ask
In the common-channel + application GRID (card) view, the per-card action buttons (icon + label):
1. Decrease the space between the icon and the action text.
2. The **Disable** action button must use the dark navy/slate background from the supplied screenshot.
3. Inter-button spacing should match the supplied (ticked) screenshot.
4. The **Do Payment** teal button is already correct.
5. Follow the brain skill structure.

## Surface
Management-console ONLY. The shared `app-comm-mkt-card` (in `comm-mkt-view`) serves BOTH the CommChannels grid AND the Marketplace/Applications grid, so one edit covers both. admin-console has no such card (grep-confirmed). Card grid rendered at `comm-mkt-view.component.html:59`.

## Approach (design-system honored; no shared-lib edit, no Stencil regen)
Kept `<falcon-angular-button>` (prior user directive: must use the Falcon component). Tuned it with the **per-instance CSS-custom-property override** pattern already established in this repo (`[style.--falcon-table-row-height]` on the admin Add-Client wizard tables, `client-comm-channels-step.component.html:32`). All button visuals are token-driven (`button.tokens.css`), so per-instance `[style.--…]` cleanly wins (token defaults are declared with the zero-specificity `:where(...)` selector).

Changes on the `@for` action `<falcon-angular-button>`:
- `[style.--falcon-button-gap-md]="'6px'"` — icon↔label gap **12px → 6px** for ALL 3 actions. SoT `.cm-btn { gap:6px }`.
- Disable instance only (`a.id === 'disable'`): re-point `--falcon-button-primary-dark-bg` → `#1F2937`, `…-bg-hover`/`…-bg-active` → `#111827`, `…-border` → `#1F2937`, `…-border-hover` → `#111827`. SoT `.cm-btn-dark { background:#1F2937; hover #111827 }`.
- Updated the `btnVariant()` doc comment + the ACTIONS template comment so they describe the slate override accurately (no stale comments).

## Decisions / rationale
- **Inter-button gap: NO change** — already `--falcon-card-status-actions-gap: 8px`, which equals the SoT `.cm-card-actions { gap:8px }`. The visible tightening the user wanted comes from the icon↔label gap fix; the buttons then read like the ticked screenshot.
- **Why literal slate hex, not a token:** the Falcon neutral palette is warm-grey (`neutral-800 #3d3d3d`) AND inverts under `.app-dark` (`#3d3d3d → #f1f3f5`), so no neutral token can carry a fixed dark fill — a slate button would turn near-white in dark mode and break. The SoT `.cm-btn-dark` uses the fixed literal `#1F2937` deliberately, same philosophy as the design system's `primary-dark` being "brand-fixed." Documented with an SoT citation in code so it is not mistaken for an arbitrary hex.
- **Do Payment:** untouched (`primary`/teal) — user confirmed it is already correct.
- **Sizing (38px height / 10px radius):** left as the accepted Falcon `md` spec — user did NOT ask to change it this round.

## Verification
- `npx nx build management-console --configuration=development --skip-nx-cache` → **EXIT 0**, "Successfully ran target build … and 6 tasks", hash `14db26353cfb49ba`, 20.2s. `falcon-ui-button-tw.js` present in bundle.
- NOT browser-verified: the mgmt comm-mkt page needs the full Docker stack (host-shell + remotes + Core gateway) + acc-owner login + a node with comm-channel/app data in the right statuses to surface Disable/DoPayment/Enable — historically flaky here. Build-green + the proven `[style.--token]` runtime precedent give high confidence. Browser E2E = remaining step.

## Concurrency note (hazard realized)
The shared `universal-brain/state/current-task.json` was clobbered by ≥1 other live Claude session mid-task (it flipped from my task → a different `settings-edit-authority-investigation` `in_progress` task on branch `polishing-v0.4`). I did NOT overwrite that peer session's active state. This file + the memory entry are my durable records.

## NO COMMITS. Working tree only.
