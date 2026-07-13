---
name: project_wallet_drawer_amount_overbalance_disappear_rootcause_2026_06_06
description: "Input/field \"disappears on validation error\" — root cause (Stencil shadow:false icon-SLOT wipe + nested-forwarding polyfill race). Wallet already slot-less; GENERAL fix 2026-06-06 converted ALL icon-slot input-number consumers (contracts + org-hierarchy, both apps) to slot-less sibling-overlay + component test-lock. Builds+tests green."
metadata: 
  node_type: memory
  type: project
  originSessionId: 00be6008-2c58-4599-9789-5cc3a6058aaa
---

# Wallet Balance-Transfer drawer — "amount input disappears when balance exceeded" (root-caused 2026-06-06)

**Symptom (user):** in the Wallet & Balance Management balance-transfer drawer, typing an amount ABOVE the
available balance correctly shows the error message but the **Transfer Amount input itself disappears**.

**Root cause (deterministic, code-verified across 3 layers — NOT reproduced live, no browser was connected):**
the historical bug was the Stencil `shadow:false` **icon-SLOT wipe**. The ﷼ glyph was projected through
`<falcon-angular-input-number>`'s icon slot; the validation `[state]` flip (`default`→`error`) re-renders the
light-DOM Stencil component, and shadow:false slot reconciliation **wiped the projected content + degraded the
field to static text** (same class as `GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001` and the drawer empty-body
waiver). [CODE] `falcon-input-tw.tsx` / `falcon-input-number-tw.tsx` (`shadow:false`).

**Already fixed in source — committed `4dc223eb` (2026-06-03) on `polishing-v0.4`:** both consoles' drawers
(`apps/{admin,management}-console/.../wbm-balance-transfer-drawer/*.html`) render the amount field **SLOT-LESS**:
- ﷼ is a POSITIONED SIBLING `<span absolute z-10>`, NOT in the input's icon slot;
- `<falcon-angular-input-number>` is **unconditionally rendered** (no `@if`), `[state]="overBalance() ? 'error' : 'default'"`;
- over-balance message shown below via `@if (overBalance())` (admin) / `@if (amountError())` (mgmt).
Slot-less = immune to the re-render wipe. The input is NEVER clamped to balance (over-balance stays editable;
flagged by the inline error + disabled Save) — exactly the user's requirement.

**Verified the input cannot disappear on the CURRENT code, 3 layers:**
1. [CODE] `falcon-input-tw.tsx` render — the native `<input>` is rendered unconditionally; `state` only swaps
   `falconInputWrapperClasses` (error → `bg-[var(--falcon-input-bg-error)]` red-50 + red border + ring). No code path removes it.
2. [CODE] both drawer `*.html` — input not inside any `@if`; slot-less (only one `falcon-angular-input-number` per console).
3. [CODE] `wallet-balance-management.component.ts` orchestrator global `<styles>` (ViewEncapsulation.None) — only
   **token remapping** (`--falcon-input-border-color-error→--falcon-wallet-error`, error ring); does NOT remap
   `--falcon-input-bg-error` (bg stays red-50); **no `display:none`/`visibility`/`opacity:0`**. Full-repo CSS sweep = no hiding rule.

**Test-locked (2026-06-06, claude):** added 2 regression tests to
`libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.spec.ts` (Stencil `newSpecPage`):
(a) inner `<input>` renders for `state="default"` and SURVIVES a dynamic flip to `state="error"` with value preserved;
(b) `state="error"` applies `bg-[var(--falcon-input-bg-error)]` + `border-[color:var(--falcon-input-border-color-error)]`.
**`npx stencil test --spec -- falcon-input-number-tw` → 21/21 PASS** (incl. a projected-icon-slot case). NO COMMITS.

**Residual symptom = STALE BUILD.** The fix has been committed 3 days; if the user still sees the disappearance
the running app predates it. Per project memory: `nx serve` does NOT rebuild the Stencil `falcon-ui-core` dist, and
remotes are served as STATIC bundles needing rebuild after app edits ([[reference_static_remote_rebuild_after_app_edit_2026_06_04]]).
**Unblock = rebuild falcon-ui-core + the admin/management remote, then restart serve.**

**GENERAL FIX DONE (2026-06-06, claude orchestrator + 1 ammar-web-platform-ui agent).** User chose the
consumer-slot-less approach over a risky lib refactor (KEY: `scoped:true` is NOT a safe blanket fix for the nested
`input-number-tw → input-tw` chain — `falcon-password-tw`'s header proves it re-introduces a hidden-root via the
slot-polyfill `hostTagName` race; password-tw's own fix was to render INLINE). So every consumer that still projected
an icon through `<falcon-angular-input-number>`'s icon SLOT was converted to the proven wallet slot-less SIBLING-overlay
pattern (`<div class="relative"><span absolute start-2.5|end-2.5 z-10 ...>ICON</span><input-number ... inputClass="!ps-|!pe-[…icon-input-padding-…]"></div>`), removing `[iconLeft]`/`[iconRight]` + the slot child. **15 input sites / 7 files / both apps:**
admin contracts rate-card-step(1), addons-step(3)+hdr, contract-information-step "Value"(1, LABELED — label EXTRACTED to a
sibling `<label>` reproducing `falconInputLabelClasses`+required-marker token-for-token, error-color via `[style.color]`,
both ﷼-left + SAR-right overlays); mgmt contracts rate-card-section(1, iconRight→end-2.5)+hdr, addons-section(3)+hdr;
admin org-hierarchy add-client-wizard client-applications-step(1) + client-comm-channels-step(1) (svg SAR_ICON, neutral-600).
All digit-cap props (`[max]`/`groupWhileTyping`/`blockExcessFractionDigits`/fraction-digits) + testids/aria preserved verbatim.
Also fixed an unrelated pre-existing typo (`class="And "`→`text-falcon-neutral-500`) on the mgmt addons VIEW-mode glyph.
**VERIFIED: admin build EXIT 0 + 713 tests pass; mgmt build EXIT 0 + 547 tests pass; lib spec 21/21.** Templates(.html) ONLY —
NO `libs/falcon-ui-core`/Stencil/token/.ts changes; wallet drawers untouched; NO COMMITS.
⚠️ live pixel-verify still pending (no browser connected): eyeball ﷼/SAR position + padding + the extracted "Value" label +
the field staying visible on inline validation error (esp. admin contracts add-wizard step-1 Value). Known minor a11y: the
extracted "Value" label has NO `for`/`id` link (the wrapper maps `inputId`→host id, not the inner `input-id` prop, so a
`for` would dangle — visuals + disappearance-fix correct, only click-label-to-focus lost). Latent lib notes: `@Prop rootClass`
is DEAD in `falcon-input-number-tw` -tw render; the deeper lib-level icon-slot robustness (inline-render input-number-tw, the
password-tw pattern) remains an OPTIONAL future hardening, NOT needed now that all consumers are slot-less.

Related [[reference_wallet_transfer_source_destination_matrix_2026_06_06]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_contracts_value_digitcap_enforce_2026_06_06]].
