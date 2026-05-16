---
patternId: PATTERN-18
name: falcon-table-edit-row column spacers + inline style → grid + slot/projection
violatesRules: [R-FE-003, R-FE-004, R-FE-008, R-NOOR-005]
estimatedReach: 1 file but ~20 violations in one place (table-edit-row.component.html)
estimatedEffortPerOccurrence: 60 minutes (one-shot redesign)
totalEffortHours: ~1
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
`falcon-table-edit-row.component.html` is a microcosm of every layout anti-pattern:
- Inline `style="width: 96px;"` repeated 5+ times to fake table column alignment.
- Hex literal `background: #F3F8F5` inline.
- `style="padding-inline: 16px;"` (uses logical property but in inline style).
- Flexbox + width spacers instead of CSS Grid.

Because the parent `<falcon-table-tw>` renders this row in a single `<tr><td colspan="N">`, the component fakes column alignment. The fix is structural: either expose a row-expansion API on the Falcon table that PROJECTS into the column cells, or make this row a CSS Grid that mirrors the parent table's column track sizes via a single source of truth.

## Where it appears
Single file:
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\falcon-table-edit-row\falcon-table-edit-row.component.html (all 9 inline styles + 5 width-spacer divs)

## What replaces it (the canonical pattern)
**Short-term (no library change):** Replace the 5+ spacer divs with a single CSS Grid whose template columns are read from a shared constant.
```html
<!-- After -->
<div class="grid items-end gap-x-4 px-4 py-3.5 bg-falcon-teal-50"
     [style.grid-template-columns]="EDIT_ROW_COLS">
  <div></div>                 <!-- visibility (96px) -->
  <div></div>                 <!-- name (140px) -->
  @if (mode() === 'type') {
    <div class="flex flex-col gap-1">
      <span class="text-[11px] font-medium text-falcon-neutral-500">{{ ... }}</span>
      <falcon-angular-dropdown ... />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-[11px] font-medium text-falcon-neutral-500">{{ ... }}</span>
      <falcon-angular-date-picker ... />
    </div>
  }
  ...
  <div class="flex items-end gap-2 justify-self-end">
    <falcon-angular-button variant="secondary" size="sm">Cancel</falcon-angular-button>
    <falcon-angular-button variant="primary" size="sm">Save</falcon-angular-button>
  </div>
</div>
```

```ts
*** Shared column-track definition — single source of truth for table + edit row ***
export const APPLICATIONS_TABLE_COLS = '96px 140px 180px 220px 1fr auto';
```

**Long-term (library change — open a gap):** Add a `row-expansion` slot to `<falcon-data-table>` that automatically aligns to column tracks. Mark as `GAP-EXPAND-ALIGN` in the dossier.

## Migration steps
1. Extract column widths to a shared TS constant consumed by both the parent table config and this edit row.
2. Rewrite the edit-row template with a single Grid.
3. Replace `bg-falcon-teal-50` (or whatever the closest token is) for `#F3F8F5`.
4. Replace raw `<button>` with `<falcon-angular-button>` (PATTERN-02).
5. Visual diff against the React SoT screenshot referenced in the file's existing `Round 3` comment.
6. (Future) Open a Falcon-data-table library gap for proper row-expansion projection.

## Detection regex
Identifies the pattern but the violation is structural — not regex-detectable beyond the inline-style + raw-button patterns already covered. The cross-file value is that this single file is the worst-offender concentrate.

## Falcon components / libs involved
- `<falcon-data-table>` / `<falcon-table-tw>`
- `<falcon-angular-button>`, `<falcon-angular-dropdown>`, `<falcon-angular-date-picker>`, `<falcon-angular-input>`

## Risk + verification
- Visual must be pixel-identical (file is referenced in Wave 22D shadow-rows demo memory).
- Build + interaction tests for edit/save/cancel.
