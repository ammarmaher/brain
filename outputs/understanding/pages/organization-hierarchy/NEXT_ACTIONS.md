# Next Actions — Organization Hierarchy

> Priority-ordered work queue. Updated incrementally as items close.

## Priority 1 — Unblock dimension scores (each currently below 60% NEEDS-ATTENTION threshold)

### P1.1 — ✅ DONE — Wave 17.5 Visual Parity Sweep (12 sections)
- **Completed**: 2026-05-14
- **Result**: UIUX 25% → 40%, Visual Parity 35% → 52%, Page % 16% → 23%
- **Report**: `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\wave-17.5-visual-parity-sweep.md`
- **Status**: PENDING Ammar approval

### P1.1b — Fix parity gaps discovered in Wave 17.5 (in priority order)
1. **GAP-PARITY-002** (MEDIUM) — Clean host-shell sidebar to ONE org-hierarchy entry (remove `Org Hierarchy (Admin)` and `Organization Hierarchy (New Page)` duplicates). Requires Ammar confirmation.
2. **GAP-PARITY-001** (LOW) — Fix page title "Org Hierarchy" → "Organization Hierarchy" + breadcrumb.
3. **GAP-PARITY-003** (MEDIUM, demo scope) — Decide: align tree seed with React reference OR keep dev seed.
4. **GAP-PARITY-004** (LOW) — BrandLogo per client (BMW conic, Bupa red, etc.) — only if seed aligned first.
5. **GAP-PARITY-005** (LOW) — Default-selected user row (Hajeer/u3) — optional polish.
6. **UIUX-PARITY-006** (applicable) — Tree indent connector rails — library upgrade.
7. **UIUX-PARITY-007** (applicable) — Hover-path teal stripe — library upgrade.

### P1.2 — Validate every wizard step against React source
- **Why**: unblocks UIUX + Validation + Business dimensions
- **How**: walk through Add Client steps 1-5 + Add User steps 1-3 with side-by-side React view
- **Output**: rule status updates in `UI_UX_RULES.md` + `VALIDATION_RULES.md` + `BUSINESS_RULES.md`

### P1.3 — Restore "More Details" drill-in path (broken today)
- **Why**: BIZ-006 went from `applied` → `not_applied` after today's library edit. Blocks Business dimension.
- **Options**:
  - (a) Add row-click handler to open `<app-user-details-page>` directly (consumer-side, ~30 min)
  - (b) Wait for `<falcon-angular-menu>` syncProps bug fix (library-side, larger scope)
- **Recommended**: option (a) as temporary; option (b) when library work is scheduled

### P1.4 — Validation pass on Add Client step 1 + Add User step 1
- **Why**: Validation dimension stuck at 5%
- **How**: identify required fields per source, wire `Validators.required` + format validators
- **Specific rules to address**: VAL-001 through VAL-006 in `VALIDATION_RULES.md`

## Priority 2 — Close library gaps

| gap | Action | Estimated effort |
|---|---|---|
| GAP-LIB-001 — `<falcon-angular-tree>` per-row template | Library upgrade (add `ng-template` slot) | M |
| GAP-LIB-002 — popup focus-trap | Library upgrade (a11y) | S |
| GAP-LIB-003 — replace PrimeIcon `pi pi-ellipsis-v` | Library token-driven icon | S |
| GAP-LIB-004 — `<falcon-angular-menu>` syncProps reset (HIGH) | Library wrapper fix (use SimpleChanges) | M |
| GAP-LIB-005 — `<falcon-mobile-number>` migration | Lib substitution | M |
| GAP-LIB-006 — `<falcon-photo-uploader>` migration | Lib substitution + circular mask token | M |

After GAP-LIB-004 lands, GAP-LIB-007/008 (today's data-table menu deletion) can be reverted.

## Priority 3 — Business rule capture

These are not blocking but they raise the Business dimension:

- BIZ-002 root selection live behavior verification
- BIZ-008 Verify badge rendering verification
- BIZ-009 User Status disabled behavior (read-only forever or role-gated?)
- BIZ-010 Apps & Services row actions matrix per status
- BIZ-011 Insufficient Balance modal build

## Priority 4 — Backend integration

- User Details save → real backend (currently in-memory) — wire to `falcon-int-system-gateway-svc` / Identity Service
- Add User flow → backend (Identity Service `Invite` endpoint)
- Add Client flow → backend (Commerce Service `CreateAccount`)
- Add Node flow → backend
- Settings save → backend (Commerce + Provisioning)
- Apps row action save → backend (Provisioning Service)

## Priority 5 — Cross-cutting

- PES/permissions wiring (GAP-BEH-004)
- RTL mode full sweep
- AR language sweep
- Automated test setup (GAP-TEST-001)
- Build a separate `<app-comm-channels-tab>` and `<app-apps-services-tab>` content

## Trigger phrases to resume each priority

| Phrase | Resumes |
|---|---|
| `run W17 visual parity sweep` | P1.1 |
| `validate wizards against React` | P1.2 |
| `restore More Details path` | P1.3 |
| `wire validation on wizards` | P1.4 |
| `fix library menu syncProps bug` | P2 (GAP-LIB-004) |
| `library upgrade <code>` | P2 (specific gap) |
| `wire backend for <feature>` | P4 |
| `wire PES gating` | P5 |
| `run RTL sweep` | P5 |
| `run AR sweep` | P5 |

## Approval gates

- Each item moves from "applicable" → "applied" only after live verification AND Ammar approval.
- Page-level approval ("page approved on org-hierarchy") fires on full sweep + no comments → auto-promotes 6 components in `COMPONENT_MAPPING.md` to 100%.
