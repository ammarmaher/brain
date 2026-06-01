---
name: reference_falcon_ui_grep_scope_and_radius_token_convention
description: "Always grep the falcon-web-platform-ui repo at its real root (not C:\\Falcon broadly — that catches old-ui worktree mirrors); plus the radius-token convention (arbitrary rounded-[14px] is used 42×, semantic rounded-pane/card/modal are defined-but-unused)."
metadata: 
  node_type: memory
  type: reference
  originSessionId: c5c97fa3-0382-429f-affc-51960b6a23db
---

Two facts for any Falcon FE "find all usages of class/token X" task:

**1. Grep scope trap.** The canonical repo is `C:\Falcon\Falcon\falcon-web-platform-ui` (apps/ + libs/). Do NOT grep `C:\Falcon` broadly — it also contains brain-managed worktree MIRRORS at `C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\` and `C:\Falcon\Brain SK\outputs\worktrees\falcon-old-ui-main\`. Those are `falcon-old-ui-main` (a DIFFERENT/old branch), produce false "usage" hits, and must NEVER be edited (project CLAUDE.md hard rule: never modify app source from the brain skill). A broad grep that returns ~13 files where only ~1 is real is the classic symptom.

**2. Radius tokens — DEFINE the token, don't use magic numbers (team direction).** [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css` @theme = SSOT; every `--radius-*` token auto-generates a `rounded-*` Tailwind v4 utility: `--radius-pane:0.875rem/*14px*/`, `--radius-card`(10px), `--radius-modal`(18px), `--radius-xl:1.5rem/*24px*/`, plus `--radius-full`+`--radius-pill` BOTH 9999px (proof the theme deliberately allows two semantic names for one value). De-facto, magic `rounded-[14px]` is used 42×/27 files while semantic `rounded-pane` is unused — but a live `night-shift-token-migration` worktree shows the team is MIGRATING magic→tokens. So the correct fix for an undefined radius utility is to DEFINE it in the @theme SSOT (not swap to `rounded-[N px]`). `rounded-surface-xl`/any `*-surface-xl` had no token in the new UI → silent no-op → square corners.

**Resolution (2026-05-29):** Added `--radius-surface-xl: 0.875rem; /*14px*/` after `--radius-pane`, reverted the 2 usages in admin-console contracts-view-contract.component.html from `rounded-[14px]` back to `rounded-surface-xl`. GOTCHA: old-UI defined `--radius-surface-xl: 1.5rem` = **24px** [CODE] `…falcon-old-ui-main/apps/admin-console/src/tailwind.css:14` — the new value (14px) is a deliberate re-skin choice (matches new-UI surface language), NOT a faithful restore. User explicitly chose tokens-over-constants + 14px.

**Why:** Initial instinct (use `rounded-[14px]`, reject the token as "redundant 3rd 14px name") was WRONG — the `--radius-full`/`--radius-pill` precedent shows same-value semantic tokens are an accepted theme pattern, and the active migration favors tokens. User corrected this.

**How to apply:** Scope greps to `C:\Falcon\Falcon\falcon-web-platform-ui`. For an undefined radius utility, DEFINE the matching `--radius-*` token in the SSOT @theme (Tailwind v4 generates `rounded-<name>` incl. multi-hyphen names like `rounded-surface-xl` / `rounded-control-xs`). Confirm the intended VALUE against old-UI's original token before assuming. A Tailwind class/token change can't break `nx build` (undefined utilities no-op; defined ones compile) — verify at RUNTIME (computed border-radius). Cheap runtime check w/o nx build: isolated HTML + `@tailwindcss/browser@4` CDN + a `<style type="text/tailwindcss">@theme{…}</style>` block, served via a `verify-radius` http-server launch.json config + preview_inspect (preview_screenshot times out in this env — use preview_eval/inspect).
