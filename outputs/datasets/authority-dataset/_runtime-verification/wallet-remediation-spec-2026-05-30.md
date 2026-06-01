---
type: remediation-spec
status: READY FOR APPROVAL — read-only investigation, NO changes made
scope: apps/admin-console/src/app/features/wallet-balance-management/ (payment-adjacent)
branch: night-shift-audit/2026-05-30-0128
date: 2026-05-30
author: night-shift-audit (orchestrator)
---

# Wallet & Balance Management — Remediation Spec (ready-to-apply)

All facts verified against live code + the Falcon icon registry. **Nothing was changed.**
Hard constraint for ALL items below: **do NOT touch transfer logic, API calls
(`WalletBalanceService.transfer/getWalletData/saveChanges`), validation, PES gates,
or entity-building** — these are presentation-only fixes on payment-adjacent UI.

## Item 1 — PrimeIcons → Falcon icons (LOW risk · verified 1:1 · recommend APPROVE)

Falcon icon contract `[CODE] libs/falcon-theme/src/styles/falcon-icons.css:1-4`: `class="falcon-icon falcon-icon-{name}"`. All four targets exist:

| Current (`pi pi-*`) | Replace with | Verified |
|---|---|---|
| `pi pi-wallet` | `falcon-icon falcon-icon-wallet` | `[CODE] falcon-icons.css:191` |
| `pi pi-building` | `falcon-icon falcon-icon-building` | `[CODE] falcon-icons.css:179` |
| `pi pi-circle` | `falcon-icon falcon-icon-circle` | `[CODE] falcon-icons.css:165` |
| `pi pi-send` | `falcon-icon falcon-icon-send` | `[CODE] falcon-icons.css:184` |

**Locations (6 string literals):**
- `[CODE] balance-transfer.component.ts:399-407` — `getEntityIcon()` switch (wallet/building/circle/send + default circle).
- `[CODE] wallet-balance-management.component.ts:~803` — `masterWallet.icon: 'pi pi-wallet'`.
- `[CODE] wallet-balance-management.component.ts:~868` — channel-wallet `icon: 'pi pi-wallet'`.

**Notes:** `[INFERRED]` these icons currently render **blank** — PrimeIcons font was removed (Wave PR-8), so `pi pi-*` classes have no backing glyph. This fix also *un-breaks* them. **Verify-before-apply:** the render site is not a plain `<i class>` in `balance-transfer.html` (icons feed the `<falcon-angular-dropdown>` option rows) — confirm the consumer applies the string as a CSS class (Falcon's contract is class-compatible with the old `pi pi-*` pair). Risk: LOW.

## Item 2 — `balance-transfer.component.scss` (~370 lines · MEDIUM-HIGH · APPROVAL → own focused task)

`[CODE] balance-transfer.component.ts:69` `styleUrls: ['./balance-transfer.component.scss']` (Rule 3-4 violation). Contents:
- **DEAD CSS (safe delete):** `::ng-deep .p-autocomplete / .p-select / .p-inputnumber` override blocks — **no PrimeNG components are used** (template = only `<falcon-angular-*>`; no primeng imports), so these selectors match nothing.
- **Live `.bt-*` rules on LEGACY tokens:** `$bt-border: var(--surface-border…)`, `--primary-color`, `--palette-danger-*`, `--surface-card`, `--surface-100` — **not** the canonical `--falcon-*` vocabulary. Need re-mapping (e.g. `--color-falcon-neutral-200`, `--color-falcon-teal-700`, `--color-falcon-red-*`).
- **Hardcoded values:** `font-size: 13px` (no exact token), `gap: 10px`, `box-shadow: 0 0 0 2px rgba(45,106,79,0.1)` (hardcoded primary green ×4), `rgba(220,38,38,0.1)`, `rgba(0,0,0,0.1)`, `padding: 2px`.
- **Dark-mode block** (`:host-context(.dark-mode)`) with hardcoded rgba — **out of scope** per Rule 8/dark-mode-redesign = danger zone.
- **Keyframes** (`btScrimIn/btDrawerIn/btDrawerInRtl`) — legit SCSS-allowed (complex animation per Tailwind-first gate); keep or move to theme.

**Recommendation:** this is a real conversion (token re-map + dead-code delete + ~8 hardcoded tokenizations + dark-mode + keyframes) on **money-transfer UI** → schedule as its **own focused task with visual verification**, not a night-shift auto-fix. Effort ~2-4h.

## Item 3 — `wallet-balance-management.component.scss` (LOW · near-clean)

`[CODE] wallet-balance-management.component.ts:142` `styleUrls`. The file is **already token-converted (2026-05-28)**; only ONE rule remains — a scoped `:host ::ng-deep falcon-angular-radio-group .falcon-radio-group-options.is-vertical { display:flex; flex-direction:column; gap:10px }` — a **justified** workaround (the Falcon radio-group wrapper ships no layout CSS; Shadow-DOM `orientation` doesn't reach light DOM).
**Fix:** tokenize `gap: 10px` → `gap: var(--spacing-2.5)` (`[BRAIN-OUT] TOKEN_TAXONOMY` spacing-2.5 = 10px exact) + add the required SCSS-reason comment, and keep the documented exception (it's a real Stencil-layout limitation). Effort: 5 min.

## Item 4 — Inline gradients (`wallet-balance-management.component.html`)

- **4a — divider gradient `[CODE] :135`** `style="background: linear-gradient(to right, transparent, rgba(13,63,68,0.18), transparent)"`. The `rgba(13,63,68,0.18)` is an **exact token**: `--color-falcon-teal-alpha-18` `[BRAIN-OUT] TOKEN_TAXONOMY §3.1`. **Fix (SAFE, exact):** `style="background: linear-gradient(to right, transparent, var(--color-falcon-teal-alpha-18), transparent)"` — token-backed, zero visual change. (Inline style justified for multi-stop gradient per pitfall #6.)
- **4b — master-wallet card gradient `[CODE] :129`** `linear-gradient(135deg, #DEEBE2, #E8F2EC, #DCEBE0)` + `border-[#C5DBC9]` + `rounded-[14px]` + `text-[15px]/[11px]`. The 3 mint-green stops have **no exact tokens** (nearest `--color-falcon-mint-100 #d9e6dd`, `--color-falcon-green-100 #dfece6`). The SoT comment says it's a deliberate **pixel-for-pixel** match. **Decision needed:** (i) add 3 mint tokens + a `--falcon-wallet-card-gradient` token, then bind via `[style.background]`; OR (ii) formally accept as a documented Rule-7 exception ("approved technical reason" — SoT-exact gradient). → APPROVAL.

## Recommended apply order
1. **Batch A (low-risk, approve & go):** Item 1 (icons) + Item 4a (divider token) + Item 3 (radio gap token). Verified/exact, minimal visual risk. Build-gate + visual check.
2. **Batch B (design decision):** Item 4b master-wallet gradient tokens.
3. **Batch C (own task):** Item 2 `balance-transfer.scss` full conversion — separate, with visual verification.

## Verification after Batch A
`nx build admin-console` (no-regression) + visual check of the master-wallet card + the entity-row icons rendering. No runtime/PES claims without a live check (out of scope).
