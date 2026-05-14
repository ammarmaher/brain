# Change History — Organization Hierarchy Page

> Every page-level edit, dated. Source: git working tree + session reports + this brain log.

## 2026-05-14 — Wave 18 + Brain SK page-knowledge bootstrap

### Code edits (visual polish + library cleanup)

| Layer | File | Change |
|---|---|---|
| Consumer | `apps/admin-console/.../org-hierarchy-page-menu.component.ts` | Set `--falcon-table-container-border-radius: 0px` |
| Consumer | same | Set `--falcon-table-header-padding-block: 25px` |
| Consumer | same | Set `--falcon-table-cell-padding-block: 20px` |
| Consumer | same | Removed CSS injection workaround for orphan menu (no longer needed) |
| Consumer | `apps/admin-console/.../falcon-custom-table-footer.component.html` | Removed `rounded-b-[12px]` |
| Consumer | same | Dropdown `rounded-md` → `rounded-sm` (12px → 8px) |
| Library | `libs/falcon-ui-core/.../falcon-data-table.component.html` | Deleted `<falcon-angular-menu>` block; hard-coded `[attr.has-row-actions]="null"` |
| Library | `libs/falcon-ui-core/.../falcon-data-table.component.ts` | Removed `FalconAngularMenuComponent` import + `imports[]` + `@ViewChild('rowMenu')` + `showAt()` call |

### Live verification today (post-edits)

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

### Build hashes

- admin-console: `faceeba559362666` GREEN
- management-console: `ab3840dfb76b63a1` GREEN

### Brain registry impact

- 7 components seeded at 60% in `FALCON_COMPONENT_REGISTRY.md`
- 9 bugs/quirks catalogued in `FALCON_UI_BUGS_AND_QUIRKS.md`
- Skill updated with auto-promote rule
- This page registry created

---

## 2026-05-13 → 2026-05-14 — Wave 4-17 (night shift)

Per `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\implementation-summary.md`:

| Wave | Outcome |
|---|---|
| Wave 4-9 | Initial React → Angular port (skeleton, models, wrappers) |
| Wave 8 | Tree panel integration |
| Wave 10-13 | Wizards (Add Client + Add User) initial port |
| Wave 14 | Info panel + Settings tab placeholders |
| Wave 15 | Org chart subtree port |
| Wave 17 | Visual parity sweep BLOCKED on browser |
| Wave 17.1-17.5 | View toggle moved into tabs; smaller buttons; status component; paginator; header bg + radius |
| Wave 17.6 | `<app-falcon-custom-table-footer>` 3-section layout |
| Wave 17.6.1 | radius edits |

---

## Pre-2026-05-13

Page was originally created in the React-to-Angular conversion effort. See `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\01-html-source-discovery.md` for original analysis.

---

## How this file updates

After EVERY change to anything in this page's scope:
1. Append an entry under today's date (or create a new date heading)
2. List the layer (Consumer / Library / Service / Test)
3. List the file changed + one-line summary
4. Link to live verification evidence if applicable
5. Link to build hash if applicable
6. Link to per-session report if one exists

After major work (`commit`-worthy):
1. Run live regression check
2. Add a "Live verification" block
3. Note any rule status changes in the dimension files (UI_UX_RULES, etc.)
4. Recompute PAGE_SCORECARD if dimension scores changed
