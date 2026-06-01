---
name: project_fe_build_fix_commkt_card_backtick_2026_05_30
description: FE build EXIT 1 fixed — stray backticks inside comm-mkt-card inline template literal (mgmt); replaced with single quotes; mgmt+admin build green
metadata: 
  node_type: memory
  type: project
  originSessionId: a48fe49c-7a3f-45ec-9530-b261fcfa0011
---

# FE build fix — comm-mkt-card backtick-in-template — 2026-05-30

🟢 FIXED + build-verified green (mgmt + admin, EXIT 0) · NOT browser-verified · NO COMMITS · branch `night-shift-audit/2026-05-30-0128`.

**Symptom:** `nx build management-console --configuration=development --skip-nx-cache` → EXIT 1.
[CODE] `apps/management-console/src/app/features/comm-mkt-view/components/card/comm-mkt-card.component.ts`: NG1002 "Incorrect number of arguments to @Component decorator" + TS2362/TS1005/TS2304 "Cannot find name **start/items/center/md**" → cascade `comm-mkt-view.component.ts:77` NG2012 (CommMktCardComponent not a valid standalone component, since it imports the broken card).

**Root cause:** the card uses an **inline template literal** (`template:` backtick @ L59). Three HTML comments inside it wrapped CSS tokens in **literal backticks** — L62 `self-start`, L64 `items-center`, L78 `md`. Each backtick-pair prematurely closed+reopened the JS template string, so the Tailwind fragments were parsed as TypeScript. **"Cannot find name <tailwind-fragment>" is the signature of a broken `template:` backtick literal.** File looks fine on a skim — the compiler is right. Introduced by the concurrent comm-mkt-view DoPayment/SoT refactor — see [[project_commchannels_marketplace_dopayment_signalr_2026_05_30]].

**Fix:** backticks → single quotes in those 3 in-template comments (`'self-start'`/`'items-center'`/`'md'`). Minimal, intent-preserving, can't break the literal. 1 file, 3 comment-only char swaps.

**Sweep:** detector toggling through every inline `template:` literal across all 3 apps → CLEAN (only occurrence). **Lesson/How to apply:** never put a literal backtick inside an inline Angular `template:` backtick literal (even in a comment) — use single quotes for code tokens, or move to an external `.html`. When you see compile errors "Cannot find name '<a-tailwind-or-html-token>'" in a `*.component.ts` with an inline template, suspect a stray backtick before chasing imports.

**Verify:** `nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` EXIT 0; both bundles complete; only benign NG8113 unused-RouterLink warning. host-shell app source unchanged → not rebuilt.
