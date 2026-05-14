# Source vs Destination Comparison — Organization Hierarchy

> Side-by-side diff of source-of-truth (HTML + React) vs Angular destination implementation.
> Updated each time a rule's status changes.

## Diff summary

| Section | Source coverage | Destination coverage | Visual parity | Behavior parity |
|---|---|---|---|---|
| Page chrome (sidebar, topbar) | host-shell concern | host-shell renders | unknown | unknown |
| Tree panel | HTML §4 fully documented | `<falcon-tree-panel>` reused | ~70% (visible match) | ~50% (auto-scroll + scroll-reveal missing) |
| Tab strip + view toggle | HTML §5 | implemented | ~85% (action slot wired today) | applied |
| Node header (action buttons) | HTML §3 button matrix | applied via `[canShow*]` | applied | applied |
| Users table | HTML §6 | implemented + custom footer | ~90% (heights now match) | partial — row kebab removed today |
| Status badges | HTML §7 | `<app-falcon-status>` | partial — 6 of 8 verified | applied |
| Add Client wizard | HTML §12 (5 steps, ~836 lines source) | placeholder + 1 step partially | ~30% | low — most validation not wired |
| Add User wizard | HTML §13 (3 steps, ~459 lines source) | placeholder + step skeleton | ~30% | low — OTP-required-before-save not wired |
| User Details drill-in | HTML §22 | `<app-user-details-page>` exists | ~50% | partial — verify badge + copy button not verified |
| Settings tab | HTML §9 | `<app-settings-tab>` placeholder | ~20% | low — edit mode not wired end-to-end |
| Apps & Services tab | HTML §7 | placeholder | ~10% | very low — most behavior missing |
| CommChannels tab | HTML §8 | placeholder | ~10% | very low |
| Org chart view | HTML §18 | `<app-org-chart>` exists | unknown | unknown — pan/zoom + focus mode not formally verified |
| OTP modal | HTML §14 | uses `<falcon-angular-otp>` | partial | partial — 60s timer + expired state not verified |
| Insufficient Balance modal | HTML §7 ib-modal | not implemented | 0% | 0% |
| Send Credentials modal | HTML §12 + §13 | not verified | unknown | unknown |
| Toast system | HTML §17 | uses Falcon notifier | applied | applied |
| RTL mode | HTML §1, §19 | unknown | unknown | unknown |
| i18n (EN + AR) | HTML i18n.jsx (936 lines) | TranslateService + JSON files | partial — most strings translated; some keys raw on slow loads (langTick pattern in place) | applied |

## Sections by visual parity bucket

### High parity (≥ 80%)
- Users table (after today's work: heights, radius, status badge — within 1px)
- Tab strip
- Status badges (active/pending observed today)
- Node header button matrix

### Medium parity (40-79%)
- Tree panel (visible structure matches; missing dynamic behaviors)
- User Details drill-in (component exists, fields not fully audited)
- OTP modal (lib component used, exact rendering not formally verified)

### Low parity (< 40%)
- Add Client wizard (placeholder + partial step 1)
- Add User wizard (placeholder)
- Settings tab (placeholder)
- Apps & Services tab (placeholder)
- CommChannels tab (placeholder)
- Org chart view (component exists, pan/zoom not verified)
- Insufficient Balance modal (not implemented)

## Implementation patterns adopted

| Pattern | Source | Destination | Status |
|---|---|---|---|
| Signal-based state (no NgRx) | — | `HierarchyPageStateService` | applied (Angular best practice) |
| OnPush change detection everywhere | — | every component | applied |
| Standalone components | — | all org-hierarchy components | applied |
| `langTick()` signal for translation reactivity | — | menu component | applied (workaround for sync TranslateService) |
| `viewChild` imperative prop push to Stencil | — | tabs handling | applied |
| CSS variable overrides on element (not ancestor) | — | data-table styling | applied (per BUG-2026-05-14-001) |

## Diff method (how this file is updated)

1. Live-load both servers (HTML at :8765, Angular at :4200/#/admin-console/org-hierarchy-page)
2. Take screenshots of equivalent sections
3. Compare visually
4. Update each section's parity %
5. Update timestamps in `_scan-state/page-scan-metadata.json`

Currently BLOCKED on browser selection from Chrome MCP — same as `visual-parity-report.md` reports.
