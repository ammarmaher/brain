---
name: project_contract_addons_default_zero_empty_null_undefined_2026_06_07
description: "Contract Add-ons editable numeric inputs now default to 0 and coerce empty/null/undefined to 0 (both apps); the shared falcon-input-number one-way [ngModel] re-write gap + the fix pattern."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8a91c998-71ad-4998-8584-2f4cb6413c09
---

**Contract Add-ons "default value zero / empty→0" — DONE + GREEN (FE-only, both apps, NO commits)** (2026-06-07, claude, repo `C:/Falcon/Falcon/falcon-web-platform-ui`, branch polishing-v0.4 assumed).

User ask: "In contract, for add-ons, make sure we have a default value that is zero. If I delete anything / value is empty / null / undefined, it should always be zero for those values."

**Scope.** The Add-ons tab is the shared component `app-contracts-addons-section` — admin `[CODE] contracts-add-wizard/addons-step/addons-step.component.{ts,html}` (selector reused by admin **Edit-Contract** TAB 4 = the screenshot, AND **Add-wizard** step 4) + a byte-identical management copy `[CODE] contracts-addons-section/contracts-addons-section.component.{ts,html}` (mgmt uses it VIEW-only). Two editable value sets: **offered-quota** (Addons card) + **overage** (Addons Rate Card card). The consumed input was already `consumedValue(item) ?? 0`.

**Root cause.** Editable inputs bound `[ngModel]="quotaValue(item)" / "overageValue(item)"` which return `null` when no row exists → `falcon-angular-input-number` painted a blank placeholder, and clearing left it blank.

**Fix (display + coercion ONLY — never store a 0 quota row):**
1. Template both apps: `[ngModel]="quotaValue(item) ?? 0"` and `overageValue(item) ?? 0` → blank fields paint `0.0000` on load; clearing a POPULATED field snaps to 0 (one-way `[ngModel]` re-writes because the bound value changes X→0).
2. `(focusout)="onQuotaCleared(item, #ref)"` / `onOverageCleared(...)` → `ref.writeValue(0)` when the model holds no value. Covers the ONE case the CVA can't: clearing an **already-zero** field — bound value stays `0`, so Angular's NgModel skips `writeValue` (same-value guard) and the field would otherwise be left visually blank. Order-independent: even if focusout precedes the Stencil blur, the Stencil's own `handleBlur` formats its internal value, and `writeValue` sets that to 0 (`[CODE] falcon-input-number-tw.tsx:112 handleBlur` clamps `value ?? null`; `:97 @Watch(value)` formats when not focused). Guard reads the model getter so populated fields are never overwritten.
3. Setters use `== null` (covers null AND undefined). **KEPT remove-on-`<=0` for quotas**: a 0-value quota row FAILS `areAddonsValid` (`> 0`) in BOTH edit `canSave` (`[CODE] contracts-edit-contract.component.ts:367-395`) and wizard forward-nav (`[CODE] addons-step/validations/validations.ts:41-42`) → would BLOCK Save. `0` stays a VALID overage price (kept as a 0 row). So **display 0 everywhere, but NEVER store a 0 quota row.**

Aligns with xlsx SoT: addon value is OPTIONAL float `0..999,999,999.9999`, **DEFAULT 0** (`[CODE] addons-step/validations/validations.ts:9-14`).

**Verify.** `nx run-many build admin-console,management-console --skip-nx-cache` → SUCCESS. `nx test admin-console` → **42 files / 813 PASS** (addons spec now 17 = 5 existing consumedValue + **12 new**: default-zero getters, setQuotaValue null/undefined/0/neg/positive, setOverageValue null/undefined/0/positive, onQuotaCleared/onOverageCleared reassert-only-when-empty). `nx test management-console` → **31 files / 635 PASS**. Live UI click-through pending login (credential policy).

**LESSONS.**
- `falcon-angular-input-number` is a CVA with **one-way `[ngModel]` + `(valueChange)`** (no `(ngModelChange)`); NgModel only calls `writeValue` when the bound value CHANGES, so `?? 0` alone cannot snap an *already-zero* cleared field back — needs an imperative `writeValue(0)` (its public CVA method also pushes `el.value` to the Stencil). General pattern for "this numeric field's empty == 0" at the consumer level without touching fragile ui-core.
- "default 0 / empty→0" for addon-style fields must respect that a stored **0 quota** is invalid (`> 0` gate) — coerce the DISPLAY, not the stored row.
- The `@nx/vitest:test` executor does NOT honor `-- <name>` as a file filter (runs the whole project suite) — see also [[project_wallet_admin_tree_autoselect_first_child_else_root_2026_06_06]].

Open option (not done): the read-only VIEW still shows `-` for a genuinely-absent offered value (`formatContractNumber(null)`→`'-'`); left as SoT. Could make view show 0 too if user wants consistency.

Related [[reference_falcon_input_number_tw_hidden_on_rerender_rootcause_fix_2026_06_07]] · [[project_datepicker_expand_panel_to_input_width_2026_06_06]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
