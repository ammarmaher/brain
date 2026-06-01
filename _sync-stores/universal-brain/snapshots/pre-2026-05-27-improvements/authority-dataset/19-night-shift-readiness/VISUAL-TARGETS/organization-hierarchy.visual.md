---
type: visual-target
feature: organization-hierarchy
purpose: "Answers 'what does the Organization Hierarchy page look like — tree panel + node detail + Add Client wizard + Add Node + Add User flows + tabs layout'. Open BEFORE writing UI code for any org-hierarchy work."
visual-source: old-UI-dataset + Add Client folder (17 files) + 18-a-to-z-traces/Add-Client.trace.md
verified-at: 2026-05-16
---

# Visual Target — organization-hierarchy

> [!tldr]
> Two-panel layout: tree on the left, node-detail tabs on the right. Falcon staff side adds a synthetic root + Add Client wizard. Client side starts at the tenant's root. 5-tab layout per node, with Add Node + Add User + Edit Node + (Falcon-only) Add Client triggered from tree row-actions and floating action button.

## Page layout structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Header: Organization Hierarchy                                   │
│  Breadcrumb: Home > Organization Hierarchy                        │
├───────────────────┬───────────────────────────────────────────────┤
│                   │                                                │
│   TREE PANEL      │   DETAIL PANEL (tabs)                          │
│   ┌─────────────┐ │   ┌──────────────────────────────────────────┐│
│   │ 🦅 Falcon   │ │   │ Info │ Settings │ Users │ Apps │ Comm    ││ ← <falcon-tabs>
│   │  ├─ AcmeCo  │ │   ├──────────────────────────────────────────┤│
│   │  │  ├─ Sub1 │ │   │                                            ││
│   │  │  └─ Sub2 │ │   │  [tab content per active tab]              ││
│   │  └─ Globex  │ │   │                                            ││
│   │             │ │   │  Info tab: account info form               ││
│   │ [+ Add]     │ │   │  Settings tab: password sec/IPs/quota      ││
│   └─────────────┘ │   │  Users tab: user list with Add User        ││
│                   │   │  Apps tab: marketplace apps services        ││
│                   │   │  Comm tab: comm channels                    ││
│                   │   │                                            ││
│                   │   └──────────────────────────────────────────┘│
└───────────────────┴───────────────────────────────────────────────┘
```

## Falcon-side vs Client-side differences

| Aspect | admin-console (Falcon) | management-console (Client) |
|---|---|---|
| Root node | Synthetic 🦅 Falcon root above all clients | Direct tenant root |
| Add Client wizard | ✅ Available (sys-admin · sys-products only) | ❌ Hidden |
| Add Node | ✅ Per-node row action | ✅ Per-node row action (acc-owner/acc-admin only) |
| Add User | ✅ Per-node row action | ✅ Per-node row action (path-dependent) |
| Edit Node | ✅ Rename + scheduled rename | ✅ Same |
| Tree filtering | Multi-tenant search | Single-tenant scope |
| Tab visibility | Falcon menu options visible | Client menu options visible |

## Primary component composition

| Slot | Component | Notes |
|---|---|---|
| Page shell | `<falcon-page-header>` + two-panel grid | 30/70 split typical |
| Tree | `<falcon-angular-tree-table>` or `<falcon-angular-tree>` | Lazy-load children per `loadNodeChildren` pattern |
| Tab strip | `<falcon-angular-tabs>` | 5 tabs per node-type-aware visibility |
| Forms | Reactive forms inside tabs | Falcon validation directives applied |
| Add Client wizard | `<falcon-angular-stepper>` + 5 step components | Falcon-only |
| Add Node dialog | `<falcon-angular-dialog>` | Inline name + parent context |
| Add User wizard | `<falcon-angular-stepper>` + 3 tab components | 3-actor-path role-grant matrix per Add-User.integration.md |
| Edit Node | `<falcon-angular-dialog>` + scheduled-rename date picker | Move/archive ❌ MISSING per playbook |
| Row action menu | `[⋮]` driven by `row.allowedActions` | Per node type + role |

## Tree visual specifics

- Indentation: 24px per level
- Expand/collapse icon: `<falcon-icon>` chevron
- Selected row: `--falcon-color-bg-selected` background
- Hover: `--falcon-color-bg-hover` background
- Node type indicator: small icon prefix (root/main/sub from `eNodeType`)
- Status indicator (if applicable): status-badge to the right of name

## Tab visibility matrix (per role × node-type)

| Tab | sys-admin · sys-products | sys-ops | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|
| Info | ✅ | ✅ | ✅ (read) | ✅ (read) | ❌ |
| Settings | ✅ | ✅ (view IPs only) | ✅ | ❌ | ❌ |
| Users | ✅ | ✅ | ✅ | ✅ | ❌ |
| Apps & Services | ✅ | ❌ | ✅ | ❌ | ❌ |
| Comm Channels | ✅ | ❌ | ✅ | ❌ | ❌ |

Per `05-capability-maps/<role>.capability.md` for the exact PES verdicts.

## Per-state visual spec

### Loaded with tree expanded
- Selected node highlighted
- Detail panel shows tab content
- Active tab badge

### Empty tree (acc-user)
- acc-user can't see the tree → route guard denies before reaching this page

### Loading tree
- Skeleton: 5-8 placeholder rows with indentation pattern

### Add Client wizard active
- Stepper with 5 steps visible
- Step indicators colored per `eAccountCreationStatus`
- Cancel button always visible
- Next/Back navigation per step validity

### Partial failure (Add Client Step 5)
- Account already created (visible in tree)
- Dialog: "Account created but Account Owner creation failed — contact support"
- Wizard state preserved for retry (DECISION F-015)

### RTL Arabic
- Tree indentation: indent from the right
- Chevron: rotated 180°
- Tab strip: order mirrored
- Detail panel: on the left

## Falcon design tokens (consumed)

- `--falcon-spacing-lg` — page padding
- `--falcon-spacing-md` — tree row vertical padding
- `--falcon-spacing-sm` — tree indentation unit (multiplied by depth)
- `--falcon-color-bg-selected` — selected row
- `--falcon-color-bg-hover` — hover row
- `--falcon-color-border-subtle` — between panels
- `--falcon-radius-md` — panel corners
- `--falcon-shadow-sm` — panels

## Row action menu

Per row, items populated from `row.allowedActions`:

- **Falcon root**: Add Client (sys-admin · sys-products only)
- **Main node**: Add Node · Edit Node · Add User · (Falcon only) Edit Settings
- **Sub node**: Add Node · Edit Node · Add User
- **Last-level node** (per `maxNodeLevel`): Edit Node · Add User (no Add Node)

## i18n key inventory (sample)

| Key | en | ar |
|---|---|---|
| `orgHierarchy.pageTitle` | "Organization Hierarchy" | "هيكل المنظمة" |
| `orgHierarchy.addClient` | "Add Client" | "إضافة عميل" |
| `orgHierarchy.addNode` | "Add Sub-Node" | "إضافة عقدة فرعية" |
| `orgHierarchy.addUser` | "Add User" | "إضافة مستخدم" |
| `orgHierarchy.editNode` | "Edit Node" | "تعديل العقدة" |
| `orgHierarchy.tab.info` | "Information" | "المعلومات" |
| `orgHierarchy.tab.settings` | "Settings" | "الإعدادات" |
| `orgHierarchy.tab.users` | "Users" | "المستخدمون" |
| `orgHierarchy.tab.apps` | "Apps & Services" | "التطبيقات والخدمات" |
| `orgHierarchy.tab.comm` | "Communication" | "الاتصالات" |
| `orgHierarchy.confirm.delete.cantUndo` | "This action cannot be undone." | "لا يمكن التراجع عن هذا الإجراء." |

Plus the 17-file Add Client folder has its own key inventory.

## Things that look right vs wrong

✅ **Right:**
- Tree row hover ≠ selected (different background)
- Indentation lines visible (parent → child connection)
- Falcon root icon distinct from Client root icons
- Tabs only show what the role can see (don't show grayed-out denied tabs)
- Add Client modal uses full-screen on mobile, side-panel on desktop

❌ **Wrong:**
- Grayed-out denied tabs (just hide them — DECISION F-008)
- Tight tree rows (use comfortable density)
- PrimeNG p-tree / p-tabView (ANTI-PATTERN #2)
- `*ngIf` in template (ANTI-PATTERN #5)
- Hardcoded role checks in HTML (use PES facade)

## Reference materials

- **Add Client folder** (gold standard): `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` — 17 files
- **A→Z trace**: `Brain Outputs/datasets/authority-dataset/18-a-to-z-traces/Add-Client.trace.md` — 1029 lines
- **Old-UI dataset**: `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/`
- **Authority compare**: `Brain Outputs/datasets/authority-dataset/04-feature-parity-matrix/organization-hierarchy.compare.md`
- **Screenshots to capture** (humans): `<this-folder>/organization-hierarchy.screenshot.{old-ui-admin,old-ui-mgmt,new-admin-org-hierarchy-page}.png`

## Cross-references

- [[../SPEC-PROTOCOL]] — every spec building a feature inside org-hierarchy
- [[../DECISION-PROTOCOL]] — F-008 (hide denied), F-015 (Add Client partial-fail), F-019/20 (states)
- [[../../14-flow-playbook-integration/MATRIX]] — the 4 flow playbooks all live inside this page
- [[../../05-capability-maps/_INDEX]] — who sees what
