---
name: reference_falcon_input_number_tw_hidden_on_rerender_rootcause_fix_2026_06_07
description: "Root cause + shared fix for \"form input disappears/hidden on validation error\" — falcon-input-number-tw shadow:false nested-composition hides its own root wrapper on re-render"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9d995552-e873-48c2-94e9-380637fa68e2
---

# `falcon-input-number-tw` field DISAPPEARS on validation/keystroke — ROOT CAUSE + SHARED FIX (2026-06-07, claude, Ultra Code workflow wf_e629bf48-b0d + live-browser DOM repro)

**SYMPTOM** (reported "everywhere": wallet Balance-Transfer drawer, contracts value/rate-card/matrix/addons table cells, normal forms): typing an amount over balance (or any invalid) made the **input visually disappear** while the error message still showed. User insisted it was the shared input chain, not the page.

**ROOT CAUSE (CONFIRMED — real-app DOM + isolated repro of the *compiled* components):**
`[CODE] libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx` is a Stencil **`shadow:false`** component that **composes the (also `shadow:false`) `<falcon-input-tw>`**. On EVERY re-render (any `@Prop` change — `value` per keystroke, `state`, `inputExtraClass`), Stencil's nested **slot-relocation finisher** (`_e` in the shared runtime chunk `dist/components/p-*.js`) erroneously sets the **`hidden` attribute** on `falcon-input-number-tw`'s OWN rendered root wrapper `<div class="inline-flex items-stretch gap-1 w-full">` → whole field goes `display:none` while the native `<input>` STAYS in the DOM. The wrapper's `s-hn` === host, so it is the slot **fallback-visibility** path, NOT the `s-hn`-mismatch catch-all. Classification: **input still exists but an ancestor is display:none via the `hidden` attribute** (NOT removed-from-DOM, NOT a CSS rule, NOT Angular control-flow, NOT the icon `<slot>`).

**WHAT IT IS *NOT* (ruled out by 5-agent workflow + repro):** NOT the Angular wrappers (attribute-only forwarding, stable `@if(useTailwind)` host); NOT CSS (compiled `dist/apps/*/styles.css` has ZERO `:has(`, `[state=error]`, `[aria-invalid]`, `.invalid` hide rules; the `:has(slot:not([assigned]))` in `falcon-input.css` is legacy `<falcon-input>` only, never matches `-tw`); NOT the `[state]` toggle specifically (value-change re-render alone hides it); NOT plain `falcon-input-tw` text inputs (verified clean — only the NESTED input-number hides). "Everywhere" = everywhere `input-number` is used (drawers + forms + table cells).

**FIX (shared, root-cause, NOT a page hack):** added to `falcon-input-number-tw.tsx` `componentDidRender()` — strip the stray `hidden` Stencil mis-sets on its own root wrapper:
```ts
const renderedRoot = Array.from(this.host.children).find(
  (el) => el.classList?.contains('inline-flex'),
) as HTMLElement | undefined;
if (renderedRoot?.hasAttribute('hidden')) renderedRoot.removeAttribute('hidden');
```
⚠️ MUST use `Array.from(this.host.children).find(...)`, NOT `this.host.querySelector(':scope > .inline-flex')` — the `:scope` pseudo-selector throws `SyntaxError: unsupported pseudo: scope` in Stencil's jQUery mock-doc test env (first attempt used `:scope` and broke the spec). componentDidRender runs AFTER Stencil's relocation hide-pass and before paint → no flash, no extra render (removeAttribute on a non-@Prop doesn't re-render). Then rebuilt `nx build falcon-ui-core` (exit 0; fix present in `dist/components/p-DGB_Yp2H.js`).

**VERIFICATION (real browser, the app's compiled components, file:// harness on a node static server, Chrome MCP):** BEFORE fix → re-render sets `inline-flex hidden`, `input.offsetParent=null` (field invisible). AFTER fix → re-render (incl. `state=error`, repeated cycles + value changes) → `hidden` never sticks, `input.offsetParent` truthy, `clientHeight 17` (visible + editable). Plain `falcon-input-tw` unaffected either way.

**ALSO:** reverted the earlier per-page wallet mitigation (had removed `[state]` + added a `[&_.relative]:!bg-[var(--falcon-input-bg-error)]` arbitrary-variant) — both admin+mgmt `wbm-balance-transfer-drawer.component.{html,ts}` restored to standard `[state]="overBalance() ? 'error' : 'default'"` + red `inputClass` (now safe via the shared fix). `nx run-many build admin-console management-console` → "Successfully ran target build for 2 projects" (exit 0). NO commits. Diagnostics removed.

**FILES CHANGED:** `libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx` (the fix) + reverted 4 wallet-drawer files to origin. **DEPLOY:** the FE runs in Docker/WSL — must rebuild the FE image / restart serve to pick up the new `dist/components`.

**FOLLOW-UPS:** (1) durable lib fix = Stencil upgrade or making the component not rely on shadow:false default-slot fallback-visibility; the componentDidRender guard is the in-repo fix. (2) Run `nx run falcon-ui-core:test` (input-number spec) — mock-doc can't repro the relocation so it stays green; guard is a no-op there. (3) If a TEXT `falcon-input-tw` is ever seen hiding, extend the same guard to its root `.flex.flex-col` (not needed per current evidence). Related [[project_wallet_transfer_restore_24client_testbed_2026_06_07]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
