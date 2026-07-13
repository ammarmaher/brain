---
name: session-backup-mgmt-new-wallet-balance-finalize-run-5-verify-run-6-channel-tone-tokenize-standards-spec
description: "Finalized the management-console Client-view new-wallet-balance feature; most items were already in-branch, the only remaining work was run-6 (tokenize channel tones) + rewriting the consolidated standards.spec guard."
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-02
  status: completed
  originSessionId: 7b4acaa0-9ab7-4eb5-9e91-7cb26c10ee95
---

## What Was Done

FINALIZE wave for **`apps/management-console/src/app/features/new-wallet-balance`** (the Client view — NOT the admin twin that the brain `current-task.json` title describes). Repo: `C:\Falcon\Falcon\falcon-web-platform-ui` (TWO `Falcon` path segments). Branch `polishing-v0.4`. NO COMMITS.

### Discovery: almost everything was already done in-branch
- **Transfer amount validator** — `validations/validations.ts` already routes through the SHARED `integerInRangeValidator` from `@falcon` (the registry primitive `priceValue`/`numberInRange`/`integerInRange` all wrap). Lower bound 1 (strictly >0), upper bound = live `sourceMax` (`Infinity`→`undefined` = unbounded). Pure (no `@angular/core`), node-vitest testable. The drawer's `amountError` + `canSave` delegate to it.
- **PES route gate** — `new-wallet-balance.routes.ts` already has `canActivate:[shellAccessGuard]` + `data.access: FalconAccess.managementConsole.wallet.view()` (replaces the prior permissive demo route).
- **a11y / RTL** — drawer HTML already complete: `role="dialog"` + `aria-modal="true"` + `aria-labelledby="wb-drawer-title"` + `tabindex="-1"`; logical props (`ps-9`, `end-0`, `ltr:animate-drawer-in`/`rtl:animate-drawer-in-rtl`); `aria-label` on all 4 dropdowns + textarea; amount field `aria-invalid`+`aria-describedby`+`role="alert"` error region; server-rejection banner `role="alert"`; scrim "click-to-dismiss" suppression documented (ESC + close button cover keyboard).
- **Transfer error i18n** — `newWalletBalance.transferFailed` + `.transferDenied` + `validation.{amountRequired,amountInteger,amountPositive,amountExceedsAvailable,amountInvalid}` exist in BOTH `libs/falcon/src/language/i18n/en.json` + `ar.json`, with **matching key sets** (verified).
- **run-5 (BMW roundel)** — `components/wb-icons/wb-icons.component.ts` BMW branch ALREADY uses `var(--falcon-wallet-logo-bmw-{ring,white,blue,text,radius,ring-pad,text-tracking})` (identical to the admin twin). No raw `#000`/`#1c69d4`/`#ffffff`/`border-radius:50%`/`padding:2px`/`letter-spacing:0.5px`. The glyph SVGs use `currentColor`. So run-5 was a NO-OP verify.

### run-6 (the ONLY real code work): tokenize channel tones
Mirrored the admin `data/seed.ts`. In BOTH files, replaced raw brand hex with `var()` refs to tokens that **already existed** in `libs/falcon-ui-tokens/src/components/wallet.tokens.css` §1b:
- `data/seed.ts` `WB_CHANNELS[].tone`: `#25D366/#3B82F6/#8B5CF6/#F59E0B/#EF4444` → `var(--falcon-wallet-channel-{whatsapp,voice,aichat,sms,email})`.
- `data/wallet.adapter.ts` `GENERIC_TONE`: `#64748B` → `var(--falcon-wallet-channel-generic)` (the generic token was user-approved 2026-06-02). `NAME_TONE[]` 5 tones → the same per-channel tokens.
- **The NAME_TONE REGEXES are UNTOUCHED** — behavior is byte-identical. `tone` is INERT DATA (never read by a rendered template; the channel glyph paints via `icon` + `currentColor`), so zero render change.
- NO theme / ui-tokens edit (all 6 tokens pre-existed).

### standards.spec.ts rewritten (consolidated source-level guard)
`__tests__/standards.spec.ts` — RULE 1 now scans the WHOLE feature `.ts` surface (13 files, incl. `data/seed.ts` + `data/wallet.adapter.ts`) for raw `#hex`/`rgb()` with **NO data-layer/artwork exemption** (post run-5 BMW + run-6 tones the whole tree is grep-clean). Added a `[run-6]` token-driven-tones test + a TS-side `[style.*]` geometry-only guard. Exemptions documented as POSITIONING GEOMETRY (`[style.gridTemplateColumns]` + icon `[style.width/height/font-size.px]` + `left/top-[calc(50%-0.5px)]`+`w-px`/`h-px` rail hairline + BMW wordmark `top:1px`) / token `var(--…)` / comment (HTML `<!-- -->` + TS `/*** ***/` stripped before scan). Also covers RULE 4 (falcon-angular-* only), RULE 5 (Angular-21 idioms), no-scss, FINALIZE wiring (shared validator + PES gate + i18n), a11y.

## What Remains
- Nothing for this finalize. Live/browser visual + real-transfer verification is the USER's job (agent does not run live tests).
- The admin-console `new-wallet-balance` migration (the brain `current-task.json` main task) is a SEPARATE in-progress effort — untouched here.

## Key Decisions
- Mirror the admin `seed.ts` tokenization exactly; do NOT touch the NAME_TONE regexes (behavior parity).
- Assert ACTUAL behavior in tests, not idealized: the existing AI matcher `a\.?i` catches "ai" in "em-AI-l", so English `'Email'` → AI rule; the email rule's only clean trigger is Arabic `'بريد'`.
- Tighten standards.spec to the STRONGER post-run-6 invariant (no data-layer exemption) rather than keep the weaker "INERT DATA allowed to keep hex" carve-out.

## Files Changed (all under apps/management-console/src/app/features/new-wallet-balance/)
- `data/seed.ts` — 5 WB_CHANNELS tones → tokens + comment.
- `data/wallet.adapter.ts` — GENERIC_TONE + 5 NAME_TONE tones → tokens + comment; regexes untouched.
- `__tests__/standards.spec.ts` — rewritten consolidated guard.
- `__tests__/wallet.adapter.spec.ts` — tone assertions → token refs + `[run-6]` test.
(NO edits to wb-icons, validations, routes, drawer, i18n, or any token/theme file — all already correct.)

## Gates (evidence)
- `nx test management-console` GREEN — **19 files / 455 tests** (standards.spec 32, wallet.adapter.spec 52, + 17 others).
- `nx build management-console` GREEN — **EXIT 0, Hash 35b89a81d3b0b996, 24061ms** (+6 dep tasks). `var(--falcon-wallet-channel-*)` strings compile + resolve in real Tailwind v4/PostCSS.
- Feature-wide static grep CLEAN (0 rendered/data raw #hex/rgb excluding `__tests__`, base64 data-URIs, comments).
- Token delivery chain: management-console `src/tailwind.css:25` → `libs/falcon-ui-tokens/src/index.css:76` → `components/wallet.tokens.css` (scoped under `:where(… app-new-wallet-balance …)`).

## Context for Next Agent (TRAPS)
1. **NAME_TONE AI quirk**: `resolveChannelGlyph('Email')` returns the **AI** token (`a\.?i` matches "ai" in "em-AI-l"), NOT email. Pre-existing — do NOT "fix" it (out of scope, behavior parity). Email rule clean trigger = Arabic `'بريد'`.
2. **base64 in wb-brand-logos.ts**: the 5 brand PNGs are inline base64 data-URIs; they do NOT trip `#[0-9a-fA-F]{3,8}` or `rgba?\(` scans (base64 has no `#`/`(`). Don't grep the stub.
3. **standards.spec `[style.*]` TS scan MUST strip comments** — `wb-client-view.component.ts:134` names `[style.gridTemplateColumns]` in a doc comment.
4. **Windows console + Arabic**: `python -c` printing Arabic fails with cp1252 `UnicodeEncodeError`; wrap stdout in a utf-8 `TextIOWrapper` or assert booleans only.
5. The mgmt feature has its OWN `__tests__` (19 files) that grew past the admin task's W2 snapshot (14 files/338) — they are independent.
6. Ports 4200/4204/4301 were FREE this session (no dev server); only WebStorm Tailwind LSP (PID 37660) + nx daemon (PID 29712) running — `nx test`/`nx build` safe.

Related: [[2026-06-02-ammar-web-platform-ui-new-wallet-balance-port]] · [[2026-06-02-ammar-web-platform-ui-mgmt-wb-client-view-falcon-tailwind-A2]] · admin migration current-task.json `new-wallet-balance-falcon-standard-migration-2026-06-02`.
