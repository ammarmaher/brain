---
name: project_contracts_input_disappears_datatable_reprojection_rootcause_2026_06_06
description: "CORRECTED root cause of the contracts add/edit 'input disappears as you type' bug — it is NOT the Stencil shadow:false icon-SLOT wipe (that was repeatedly mis-fixed). It is the Falcon data-table Strategy-E cell re-projection firing on EVERY keystroke (rate-card + matrix only), which detaches/re-pushes the editable input. Non-table inputs (Step-1 Value, Addons) are fine. Build was fresh + slot-less, proving slot-wipe was wrong."
metadata: 
  node_type: memory
  type: project
  originSessionId: b855f8cc-edd5-42ec-9b46-644184f24a81
---

# Contracts "input disappears as you type" — TRUE root cause (2026-06-06, claude + ammar-qa-web)

**⚠️ CORRECTS [[project_wallet_drawer_amount_overbalance_disappear_rootcause_2026_06_06]] and [[project_contracts_value_digitcap_enforce_2026_06_06]] as applied to contracts.** The repeatedly-applied **slot-less conversion was fixing the WRONG mechanism** — that is why the bug kept recurring despite "fixes."

**Symptom (user):** in admin **Add/Edit Contract**, typing a value into an input makes the field "disappear / always disappearing."

**Proof the slot-wipe theory is WRONG (this session):**
- ALL contract templates are already SLOT-LESS in source (grep: only `iconLeft` mentions are in comments; 0 `[iconLeft]`/`slot="icon-left"` bindings).
- `falcon-input-tw.tsx` renders its `<input>` UNCONDITIONALLY (line 253); state flips only swap CSS classes → no vanish path from slots.
- The running admin-console bundle (`dist/apps/admin-console/...contracts-cost-management_routes_ts.js`) was built **9:01 PM, AFTER** the slot-less source edits (≤7:44 PM) and contains the slot-less markers (`data-falcon-input`, `valueSar`, `icon-input-padding-start`, `saudi-riyal-icon` → 56 hits). So NOT a stale build. Fresh + slot-less, and STILL disappears → slot-wipe disproved.
- ⚠️ Remotes are served STATIC from `dist/apps` by `http-server` (PID pattern: `http-server dist/apps -c-1 --cors`); only host-shell is `nx serve` live. Build-vs-source mtime + bundle grep is how to check staleness.

**TRUE ROOT CAUSE — data-table Strategy-E cell re-projection on every keystroke (rate-card + matrix ONLY):**
1. Cell `(valueChange)` → `onCellChange`/`onPriceValueChange` → `model.set(freshArray)`. Matrix `onCellChange` ([CODE] `contract-details-step.component.ts:320`) has **NO** `if(value===current)return` guard (rate-card `onPriceValueChange:221` DOES) → matrix is the worst offender.
2. An `effect(()=>{ void this.matrix(); afterNextRender(()=>mountKick.update(+1)) })` ([CODE] `contract-details-step.component.ts:263`; rate-card `:190`) bumps `mountKick` on EVERY model change (intended only for the late `@switch` mount).
3. `matrixRows()`/`viewRows()` read `mountKick` + map to **new row objects** → a **new `[data]` array every keystroke** ([CODE] `:226`; rate-card `:158` `rows().map(r=>({...r}))`).
4. Wrapper `syncProps()` sets `el.rows = new ref` ([CODE] `falcon-data-table.component.ts:676`) → Stencil re-renders.
5. `falcon-table-tw` `componentDidRender()` UNCONDITIONALLY re-emits `falcon-cells-mounted` ([CODE] `falcon-table-tw.tsx:557,612`).
6. Wrapper `onCellsMounted`→`mountOrReuseView` runs `view.detectChanges()` (re-pushes controlled `[ngModel]="value"` mid-type) and **`m.element.replaceChildren(...view.rootNodes)`** ([CODE] `falcon-data-table.component.ts:935,988,1009,1020`). Re-parenting a focused `<input>` blurs it → flicker / focus-loss / "disappears" on every keystroke.

**SMOKING GUN (dev's own comment):** `rate-card-step.component.html:73-75`: "the shadow:false light-DOM input-number can WIPE … on re-render (**here every keystroke produces a new viewRows() row → the cell re-projects**)." The team patched the *icon* symptom (slot-less) but not the *input re-projection*.

**Discriminator (source-verified, NOT yet live):** the two **data-table** inputs BREAK; the two **non-table** inputs are FINE:
- BREAK: Contract Details **matrix cell** (`<falcon-angular-data-table [data]="matrixRows()">`), Rate Card **Price Value** (`[data]="viewRows()">`).
- FINE: Step-1 **Value** (`contract-information-step.html` plain `<div>` grid) + **Addons** quota/overage (`addons-step.html` plain `<div>` cards). Same `<falcon-angular-input-number>` → input itself is innocent; the data-table projection cycle is the culprit.

**Why regular cells break but shadow rows don't:** shadow cells inject into a STABLE Stencil-keyed `<div data-shadow-mount key={contentKey}>` ([CODE] `falcon-table-tw.tsx:1169,1231`; rationale comment :953-962 "Stencil's next render saw 'extra' unkeyed light-DOM nodes and would remove/reorder them"). **Regular `data-cell-mount` cells inject DIRECTLY into the `<td>`** (`:1554-1559`, no stable inner wrapper) → vulnerable to the same strip the shadow fix solved.

**Scope:** BOTH consoles. Admin add wizard `rate-card-step`/`contract-details-step`; mgmt byte-equivalent `contracts-rate-card-section`/`contracts-contract-details-section` (`...details-section.html:101-103`). Edit Contract reuses the same section components with `editable=true` → affected identically.

**FIX OPTIONS (not yet applied):**
- **A (contained/consumer, lower-risk):** make rate-card+matrix `[data]`/`[columns]` referentially STABLE during value edits (structural-only recompute via a structureVersion signal + untracked value reads) + gate `mountKick` to structural changes only. No re-render while typing → no strip. Contracts-only, unit-testable. 4 files ×2 consoles.
- **B (library/root-cause):** give regular `data-cell-mount` cells the stable Stencil-keyed mount wrapper shadow rows already have (`falcon-table-tw.tsx`). Fixes ALL current/future editable-cell tables, but changes EVERY data-table cell's DOM → broad regression + visual risk.

**⚠️ LIVE VERIFICATION BLOCKED:** Claude-in-Chrome extension disconnected (native host up, needs re-sign-in); computer-use browsers are read-tier (no typing). Cannot reproduce/verify in a real browser until the extension is re-paired. All above is source-level (strong, convergent) but NOT runtime-confirmed pixels.

Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_contracts_matrix_falcon_datatable_migration_2026_06_06]] · [[project_library_deep_dive_sweep_2026_06_03]].
