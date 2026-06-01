---
name: shadow-row-single-active-edit-invariant
description: "Library-level single-active-edit invariant — at most one `<falcon-angular-data-table>` shadow row may be in edit mode at any time. Enforced in the Angular wrapper's setShadowMode SoT; every consumer (existing + future) inherits the behavior for free."
metadata: 
  node_type: memory
  type: project
  originSessionId: 3258490b-c1c5-4802-8866-a139a4416d37
---

🟢 BUILD-GREEN 2026-05-20 (falcon-ui-core 39s / admin-console hash `01f9f5a829262130` 21.5s). User reported that in-row Edit-pencil clicks could leave MULTIPLE shadow rows in edit mode simultaneously — e.g. edit price-value on row A, then click Edit pencil on row B's price-type shadow → both A and B stayed in edit. User wants the canonical "one edit at a time" mental model enforced platform-wide. See [[project_shadow_row_actions_md_buttons_and_vcenter_2026_05_20]] for the visual sizing/alignment work that landed in the same session.

**Why:**

The kebab-action path was already correct — [CODE] `service-pricing-table.component.ts:434` `setSoleEditMode(editKey)` replaces the entire mode map with `Map([[editKey, 'edit']])`. Triggered from `openShadowEdit` (line 441), so every kebab Edit Price Type / Edit Price Value click already drops the prior edit.

The IN-ROW Edit-pencil-button path went through the wrapper's central [CODE] `falcon-data-table.component.ts:1330` `setShadowMode(row, shadow, mode)` — which only set ONE key in the existing map without touching any other 'edit' entries. Two shadows could each be in 'edit' concurrently.

**Layer choice — best-practice = Angular wrapper, not Stencil, not consumer:**

The wrapper is the SoT for the `shadowRowModes: ReadonlyMap<string, FalconShadowRowMode>` controlled prop (`@Input() shadowRowModes` at line 305 + `@Output() shadowRowModesChange` at line 306). Both code paths converge here:
- Stencil's `falcon-shadow-action { action: 'edit' }` event → wrapper's `onShadowAction()` at line 1441 → `setShadowMode(row, shadow, 'edit')` at line 1450.
- Public template-context `startEdit()` at line 1315 → `setShadowMode(row, shadow, 'edit')`.

Enforcing the invariant at this single point gives EVERY existing + future `<falcon-angular-data-table>` shadow-row consumer the behavior automatically — no per-consumer code, no opt-in prop, no copy-paste.

Not at the Stencil — Stencil is presentation-only; `shadowRowModes` is owned by the Angular wrapper (the Stencil receives a derived per-row shadow descriptor with a baked-in mode through the wrapper's `mapShadowsForStencil` adapter).

Not at the consumer — would require every shadow-row consumer to opt-in identically, breaking the "single SoT" rule.

**Fix — ONE file, ONE conceptual change:**

`libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts`:

```ts
private setShadowMode(row: T, shadow: ShadowRow, mode: FalconShadowRowMode): void {
  const rid = this.resolveRowId(row, -1);
  const key = `${String(rid)}::${shadow.id}`;
  const next = new Map(this.shadowRowModes);
  if (mode === 'edit') {
    for (const [k, m] of next) {
      if (k === key || m !== 'edit') continue;
      next.set(k, 'view');
      this.emitAutoCancelForKey(k);
    }
  }
  next.set(key, mode);
  this.shadowRowModes = next;
  this.shadowRowModesChange.emit(next);
  this.syncProps();
}

private emitAutoCancelForKey(key: string): void {
  const sep = key.indexOf('::');
  if (sep < 0) return;
  const rowIdStr = key.slice(0, sep);
  const shadowId = key.slice(sep + 2);
  const row = this.findRowById(rowIdStr);
  if (!row) return;
  const rid = this.resolveRowId(row, -1);
  const shadow = this.findShadowDescriptor(row, rid, shadowId);
  if (!shadow) return;
  this.shadowRowCancel.emit({ row, shadow });
}
```

**Semantics:**

- **Trigger:** only on `mode === 'edit'` (entering edit). View-mode transitions and saves don't touch the invariant.
- **Demotion sweep:** every OTHER key currently in 'edit' (skipping the incoming key itself) is set to 'view' in the SAME `next` Map before commit. A single `shadowRowModesChange.emit(next)` commits the coherent merged state in one tick → consumer's signal updates once, template re-renders once, no flicker.
- **Symmetric cancel emission:** for each demoted shadow, `shadowRowCancel.emit({row, shadow})` fires BEFORE the commit. Consumer's existing `onShadowRowCancel` handler runs (e.g. service-pricing-table at line 626 deletes the form cache + clears shadowError) — exactly as if the user had clicked Cancel themselves. No new public API, full event symmetry.
- **Key parsing:** `indexOf('::')` (not split) so the first `::` is the row/shadow boundary; shadow ids containing `::` (unlikely but defensible) still resolve.
- **Best-effort resolution:** if a demoted key can't be resolved back to (row, shadow) descriptors — e.g. the row was just removed from `data` — the mode demotion STILL lands via the map mutation; only the cancel event is skipped for that key.

**Coverage — every shadow-row consumer, no opt-in:**

| Path | Mechanism | Status |
|---|---|---|
| Kebab → "Edit Price Type/Value" (consumer-driven) | `openShadowEdit` → `setSoleEditMode` (REPLACES entire map) | Already correct (pre-existing) |
| In-row Edit pencil (Stencil-driven) | Stencil's `falcon-shadow-action` → wrapper's `setShadowMode` | **Fixed by this change** |
| Programmatic `startEdit()` (template context) | `ctx.startEdit()` → `setShadowMode` | **Fixed by this change** |

After this change, single-active-edit is guaranteed across ALL three paths regardless of which path enters edit mode. The invariant is provably maintained by induction: each entry into the map is preceded by a sweep that demotes any existing 'edit' entries.

**Consumer impact — zero code changes required:**

`service-pricing-table.component.ts` UNTOUCHED. Its `onShadowRowCancel` (line 626) already handles the cancel event symmetrically — it deletes the form cache for the cancelled shadow and clears `shadowError`. When the invariant auto-cancels a previously-editing shadow, that handler runs and the form cache for the demoted shadow is cleared in step. The next time the user re-edits that shadow, `onShadowRowEdit` (line 538) recreates a fresh form from current data.

The consumer's `setSoleEditMode` (line 434) remains the correct mechanism for the kebab path — it's a stronger guarantee (replace vs sweep) and is conceptually identical, so keeping it avoids any behavior drift between paths.

**No new API surface:**

- No new `@Input()` props.
- No new `@Output()` events.
- No prop renames.
- Existing `shadowRowCancel` is reused for auto-demotion — semantically the demoted shadow IS being cancelled (just by the library, not by the user).
- Two private helpers added to the wrapper (`setShadowMode` already existed; `emitAutoCancelForKey` is new).

**Build evidence:**

- `nx build falcon-ui-core` 🟢 (39s, only pre-existing scrollHeight warning unchanged from prior memory).
- `nx build admin-console` 🟢 (21.5s, hash `01f9f5a829262130`, 6 deps).

**Not yet runtime-verified.** User test flow:
1. Open Apps & Services tab on a hierarchy node with a row that already has a parent priceType.
2. Click kebab → Edit Price Value → shadow opens in edit (form-cache initialized).
3. Click kebab → Edit Price Type on the SAME row → price-value shadow demotes to view (form cache cleared), price-type shadow opens in edit. ✓
4. Click the in-row Edit pencil on the price-value shadow → price-type demotes, price-value re-enters edit. ✓
5. Across DIFFERENT parent rows: Row A price-type in edit, click in-row Edit pencil on Row B's price-value → Row A's price-type demotes to view, Row B's price-value enters edit. ✓

**Edge cases:**

- **User has unsaved changes when auto-cancel fires:** changes are discarded silently, matching user's spec ("If I edit a next row, it should close the first row"). No confirmation popup — the user's intent is explicit.
- **Save success while another shadow is in edit:** not possible — the invariant precludes it. Save flow only fires on the active edit, which is unique.
- **Initial render with multiple 'edit' entries seeded by consumer:** invariant only enforces on transition TO 'edit'. If the consumer's initial seed already violates the invariant, the wrapper doesn't auto-correct — but no current consumer does this, and a future consumer attempting it should be considered a bug.

**Future-proofing:**

If a consumer ever needs multi-edit (currently nobody does), the cleanest opt-out would be a new `@Input() shadowEditPolicy: 'single' | 'multi' = 'single'` on the wrapper. NOT added now — YAGNI; ship the platform-wide default. Tag this memory if such a consumer appears.
