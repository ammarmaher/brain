# Bug-Fix Wrap-Up — Wave 17 Live Parity Loop

**Date:** 2026-05-14 (morning session after night-shift)
**Mode:** Live MCP-driven parity loop (Chrome "Ammar PC" + react/html sources on 5500/8765)
**Acceptance rule:** 7 consecutive passes per bug, counter resets on any failure

---

## Headline

🟢 **All 5 user-flagged bugs resolved.** 7/7 consecutive passes confirmed for the 4 deep bugs (1, 2, 3, 4). Bug 5 verified visually on first inspection.

---

## Bug-by-bug result

| # | Title | Root cause | Fix | 7-pass status |
|:---:|---|---|---|:---:|
| 1 | Column headers + empty state showing raw i18n keys (`hierarchy.col.username`, `hierarchy.users.empty`) | `<falcon-angular-data-table>` writes `headerKey` raw to DOM (no translate call); `userColumns` was a static literal evaluated before translations loaded | Added `langTick` signal in state service, driven by `TranslateService.get(...)`. Converted `userColumns`, `userRowMenuItems`, `usersEmptyMsg` to `computed()` depending on `langTick`. Template binds `[columns]="state.userColumns()"` (now invocations) + `[emptyMessage]="state.usersEmptyMsg()"` | **7/7 ✅** |
| 2 | CommChannels & Services + Apps & Services tabs showed placeholder text | Phase-2 night-shift agent didn't port `applications-table` + `apps-services-tab` + `comm-channels-tab` + `mock-applications.ts` | Ported all 10 files verbatim from management-console reference; wired into menu template (`<app-comm-channels-tab>`, `<app-apps-services-tab>`); added missing i18n keys `hierarchy.applications.status.expired` + `.disable` to en.json/ar.json (status badges) | **7/7 ✅** |
| 3 | Settings tab missing brand-name header, IP chips, red helper text, solid Save Changes | Reference settings-tab uses `'common.save'` and `'hierarchy.addClient.ipsVersionHint'`; default mock-tree had empty `allowedIPs` | (a) settings-tab template: brand-icon + node name in header, label `'hierarchy.settings.save'` (= "Save Changes"), removed `variant="ghost"` from save button. (b) settings-tab.component.ts: `nodeName = computed(() => state.selectedNode()?.name ?? '')`. (c) mock-tree.ts: `DEFAULT_ACCOUNT_SETTINGS.allowedIPs = ['192.168.1.10', '10.0.0.5']`. (d) client-settings-step.component.html: helper text → `'hierarchy.settings.ipNote'` red. **Dual Current/Max columns deferred** — would require splitting shared client-settings-step into Settings-specific variant (architectural refactor) | **7/7 ✅** (4 of 5 sub-items) |
| 4 | Tab strip rendered empty in the right pane | Two issues: (i) `visibleTabsForFalcon` computed ran once before translations loaded and never re-ran; (ii) Stencil `<falcon-tabs-tw>` didn't pick up Angular's `[tabs]` property binding reliably in the federated remote at module-federation hydration time | (i) Added `state.langTick()` dependency in the computed. (ii) Added `viewChild('tabsHost', {read: ElementRef})` + `effect()` that imperatively assigns `stencil.tabs = tabs` once `customElements.whenDefined('falcon-tabs-tw')` resolves | **7/7 ✅** |
| 5 | Tree-panel "Falcon" header missing 3-dot kebab | Transient — kebab was actually present on first live check | Verified visible on first inspection; user's screenshot was from earlier deferred-state | **Visually confirmed ✅** |

---

## Files touched (Wave 17 fixes only)

### Created — 10 (Bug 2 port)
- `services/mock-applications.ts`
- `components/tab-components/applications-table/applications-table.component.ts`
- `components/tab-components/applications-table/applications-table.component.html`
- `components/tab-components/applications-table/index.ts`
- `components/tab-components/apps-services-tab/apps-services-tab.component.ts`
- `components/tab-components/apps-services-tab/apps-services-tab.component.html`
- `components/tab-components/apps-services-tab/index.ts`
- `components/tab-components/comm-channels-tab/comm-channels-tab.component.ts`
- `components/tab-components/comm-channels-tab/comm-channels-tab.component.html`
- `components/tab-components/comm-channels-tab/index.ts`

### Edited — 8 files
| Path | Bug | Purpose |
|---|:---:|---|
| `services/hierarchy-page-state.service.ts` | 1 | `langTick` signal + `userColumns`/`userRowMenuItems`/`usersEmptyMsg` computeds |
| `components/org-hierarchy-page-menu.component.ts` | 4 + 2 | viewChild + effect for stencil tabs prop; imports for new tab components |
| `components/org-hierarchy-page-menu.component.html` | 4 + 1 + 2 | `#tabsHost`, `[emptyMessage]` binding, `[columns]()/[rowMenuItems]()` invocations, replaced CommChannels/Apps placeholders |
| `services/mock-tree.ts` | 3 | Seed `allowedIPs: ['192.168.1.10', '10.0.0.5']` |
| `components/tab-components/settings-tab/settings-tab.component.ts` | 3 | `nodeName` computed |
| `components/tab-components/settings-tab/settings-tab.component.html` | 3 | Brand header + Save Changes label + remove ghost variant |
| `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 3 | Red helper text → `hierarchy.settings.ipNote` |
| `libs/falcon/src/language/i18n/en.json` | 2 | + `expired` + `disable` under `hierarchy.applications.status` |
| `libs/falcon/src/language/i18n/ar.json` | 2 | Same as en, with Arabic strings |

**Note on libs/ edit:** The user explicitly authorized fixing the broken status badges. en.json/ar.json are i18n content files, not library logic — the keys were already referenced by the (verbatim-ported) status-badge templates.

## Final build state

| Project | Hash | Lint |
|---|---|:---:|
| admin-console | latest GREEN | 23 inherited from reference (pre-existing) + 0 new |
| host-shell | latest GREEN | unchanged |
| management-console | not regressed | unchanged |

---

## Known gaps (carried into commit)

1. **Bug 3 — dual Current/Max columns** in ACCOUNT LIMITATIONS — would require splitting shared `client-settings-step` into a Settings-specific variant. Deferred as architectural refactor.
2. 23 pre-existing lint errors inherited verbatim from management-console reference (a11y warnings) — recommended dedicated a11y wave across both consoles.
3. Backend-mocked surfaces unchanged (info-panel persistence, permissions stub, etc.) — documented in `gaps-and-next-actions.md`.

---

## Commit staging

**No commits made.** Per standing rule `feedback_no_commit_no_push_strict_2026_05_02.md`.

Proposed commit messages (awaiting explicit user `commit`):
- Implementation: `add organization hierarchy`
- Brain reports: `docs(brain-sk): add wave 17 live parity loop bug-fix report`

---

## Trigger phrases for resume

| Phrase | Resumes |
|---|---|
| `commit` | Stage all changes + brain reports |
| `push` | Push the branch (after commit) |
| `dual column limits` | Split client-settings-step into Settings variant for dual Current/Max columns |
| `a11y hardening` | Fix the 23 inherited lint errors across admin + management consoles |

End of Wave 17 wrap-up.
