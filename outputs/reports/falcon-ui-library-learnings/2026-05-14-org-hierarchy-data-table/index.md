# Session Report — Org Hierarchy Data Table Polish

**Date:** 2026-05-14
**Page:** `apps/admin-console/.../org-hierarchy-page` → Users table
**Task type:** Visual polish + library cleanup
**Trigger phrases used by user:** "delete this from the table", "make sure deleted permanently", "header same height as footer", "make the rounded md", "make the data row same height too"

---

## Scope

Iterative visual + behavioral polish of the Users data-table on the Org Hierarchy page, culminating in a library-level deletion of the orphan `<falcon-angular-menu>` from `<falcon-angular-data-table>`'s template.

## Components touched (registry entries updated)

| # | Component | Score (Ammar) | Status |
|---|---|---|---|
| 1 | `<falcon-angular-data-table>` | 60% | PENDING |
| 2 | `<falcon-angular-menu>` | 60% | PENDING |
| 3 | `<falcon-angular-paginator>` | 60% | PENDING |
| 4 | `<falcon-angular-tabs>` | 60% | PENDING |
| 5 | `<falcon-tree-panel>` | 60% | PENDING |
| 6 | `<app-falcon-status>` | 60% | PENDING |
| 7 | `<app-falcon-custom-table-footer>` | 60% | PENDING |

## Bugs / quirks catalogued (new this session)

| ID | Affected | Severity |
|---|---|---|
| BUG-2026-05-14-001 | `<falcon-table-tw>` `:host` CSS-var override | Quirk |
| BUG-2026-05-14-002 | Stencil prop-forwarding gap | Quirk |
| BUG-2026-05-14-003 | `headerKey` raw write | Bug |
| BUG-2026-05-14-004 | `<falcon-angular-menu>` syncProps reset | **Bug (HIGH)** |
| BUG-2026-05-14-005 | RPP wrapper fixed width | Quirk |
| BUG-2026-05-14-006 | `defineFalconTwComponent` bundle bloat | Quirk |
| BUG-2026-05-14-007 | Falcon `rounded-md` ≠ Tailwind `rounded-md` | Naming trap |
| BUG-2026-05-14-008 | `--falcon-*` vs `--color-falcon-*` | Naming trap |
| BUG-2026-05-14-009 | `TranslateService.translate()` sync key fallback | Quirk |

## Delta log — code changes today

### A) Visual polish on Users table (admin-console)
**File:** `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts`
- Set `--falcon-table-container-border-radius: 0` (per user request — zero rounded corners on table container)
- Set `--falcon-table-header-padding-block: 25px` (header height to match footer ~65px)
- Set `--falcon-table-cell-padding-block: 20px` (data row height to match footer ~64px)
- Removed obsolete CSS injection workaround that hid orphan menu trigger (no longer needed)

### B) Dropdown radius
**File:** `apps/admin-console/.../falcon-custom-table-footer/falcon-custom-table-footer.component.html`
- Dropdown `<select>` class: `rounded-md` → `rounded-sm` (computed 12px → 8px)

### C) Library-level deletion of orphan menu (HIGH-impact)
**Files:**
- `libs/falcon-ui-core/.../falcon-data-table/falcon-data-table.component.html` — removed `<falcon-angular-menu>` block, hard-coded `[attr.has-row-actions]="null"`
- `libs/falcon-ui-core/.../falcon-data-table/falcon-data-table.component.ts` — removed `FalconAngularMenuComponent` import, `imports[]` entry, `@ViewChild('rowMenu')`, and `showAt(...)` call

**Library-wide impact:**
- Row-action popup feature disabled across the workspace
- Row kebab column suppressed for ALL data-table consumers
- `management-console` org-hierarchy-page also affected (was using the same broken feature)
- Public API surface (inputs, outputs, types) preserved — consumers still compile

## Build verification

| App | Hash | Result |
|---|---|---|
| `admin-console` | `faceeba559362666` | GREEN |
| `management-console` | `ab3840dfb76b63a1` | GREEN |

## Live regression measurements (final state, 2026-05-14)

Captured via Chrome MCP after `location.reload()` and selecting Aramco (AccOwner2 user):

```json
{
  "isUserRow": true,
  "hdrH": 65.28125,
  "rowH": 64.33333587646484,
  "ftH": 64.66667175292969,
  "withinPx": 0.9479141235351562,
  "containerRadius": "0px",
  "orphanGone": true,
  "rowKebabGone": true,
  "selRadius": "8px",
  "selRounded": "rounded-sm"
}
```

All targets met:
- ✅ Header + data row + footer within 1px
- ✅ Container radius 0
- ✅ Orphan `<falcon-angular-menu>` deleted from data-table subtree
- ✅ Row kebab column suppressed
- ✅ Dropdown 8px corner radius

## Source-of-truth references

- Stencil menu: `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.tsx` (line 47-58, 126-138, 397-470)
- Menu Angular wrapper (where the syncProps bug lives): `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` (line 96-124)
- Data-table Angular wrapper (where the orphan was deleted): `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/`
- Falcon radius tokens: `libs/falcon-theme/TOKENS.md` line 189-192
- Falcon Tailwind theme color tokens: `libs/falcon-theme/src/tokens.ts`

## Approval gate status

All registry entries and bugs catalog entries are **PENDING**. They move to **APPROVED** only after Ammar explicitly says so. Per `protocols\APPROVAL_LEARNING_GATE.md`.

## Next actions (proposed)

1. **Wait for Ammar approval** of all 7 component entries + 9 bug entries.
2. **On approval:** mirror to `C:\falcon\Brain SK\outputs\` and git push to `github.com/ammarmaher/brain`.
3. **Future fix:** patch wrapper `syncProps()` to use `SimpleChanges` per BUG-2026-05-14-004 recommendation; then optionally restore the row-action menu to `<falcon-angular-data-table>` (with `[anchorEl]` set to keep trigger hidden).
4. **Working tree status:** all changes uncommitted in Falcon repo; no git commit per standing "no-commit-without-permission" rule.

## Cross-references

- Component registry: [`Brain SK\registries\FALCON_COMPONENT_REGISTRY.md`](../../../../Brain%20SK/registries/FALCON_COMPONENT_REGISTRY.md)
- Bugs catalog: [`Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md`](../../../../Brain%20SK/registries/FALCON_UI_BUGS_AND_QUIRKS.md)
- Skill driving this: [`Brain SK\skills\component-capability-upgrade\SKILL.md`](../../../../Brain%20SK/skills/component-capability-upgrade/SKILL.md)
- Earlier session log (sections 1-18): [`Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\component-knowledge-log.md`](../../org-hierarchy-page-night-shift-2026-05-14/component-knowledge-log.md)
