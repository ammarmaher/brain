# Wave 17 — Visual Parity Report

**Run:** 2026-05-14 (Brain SK Night-Shift Phase-2)
**Branch:** `polishing-v0.4` (dirty — no commits)
**Status:** 🟠 **BLOCKED on browser selection** — Chrome MCP requires user to disambiguate between two connected browser instances. Cannot proceed automatically without user input.

---

## Environment status

All 4 servers GREEN at 23:08 UTC on 2026-05-13:

| Server | URL | Status |
|---|---|---|
| host-shell | http://localhost:4200 | 200 OK |
| admin-console | http://localhost:4204 | 200 OK |
| management-console | http://localhost:4301 | 200 OK |
| React reference | http://localhost:5500/T2%20Falcon%20Admin.html | 200 OK |

User reportedly logged in at `http://localhost:4200/#/admin-console/org-hierarchy-page` per the wake-up brief.

---

## Blocker — Chrome MCP multi-browser ambiguity

Chrome MCP `tabs_context_mcp` returned:

```
Multiple Chrome browsers are connected to this account and none has been selected for this session.
1. Browser 1 (Windows) — deviceId: 76d7d7ed-a9a8-4d2c-b024-bf490a99a6d6
2. Browser 2 (Windows) — deviceId: 7ff57e87-cd21-4bae-8189-cb5a7829e571
```

Per the security spec, the tool requires the user to pick one of the two connected browsers via the in-extension confirmation flow OR explicitly grant a `deviceId`. I cannot pick on the user's behalf — this is a per-session selection that must originate from the user's chat input (the user is asleep).

**Decision:** Stop and report. Do not loop. Do not invent a parity score. (Per the brief: "If Chrome MCP extension is NOT connected, OR the dev server is down, OR the user's session cookie expired: write visual-parity-report.md documenting the BLOCKER + manual procedure".)

---

## Manual procedure for the user when waking up

### Option A — Run the W17 sweep as a follow-up

1. Open Chrome to the browser instance that holds the active org-hierarchy-page session.
2. Tell the orchestrator: `select Chrome browser 76d7d7ed-a9a8-4d2c-b024-bf490a99a6d6` (or `…7ff57e87…` — whichever is your live one).
3. Then say: `run W17 visual parity sweep`. The orchestrator will resume from this report and execute the 5-round bounded sweep.

### Option B — Quick self-test (no Chrome MCP needed)

While reloading `http://localhost:4200/#/admin-console/org-hierarchy-page`, run the 14-step smoke from `wake-up-status.md` and:

1. **Tree panel** vs React `tree-panel` block — confirm Falcon root + 4 clients render in same order.
2. **Tab strip** — confirm tabs match (Hierarchy / Comm channels / Apps / Settings). Root node hides Comm + Apps (only Hierarchy + Settings visible) — matches Phase-2 hierarchy-state visible-tabs computed.
3. **View toggle** — pill renders with List + Tree options.
4. **Node header** — avatar + action buttons (Information / Add Client / Add Node / Edit Node / Add User) — buttons gated per node type by `[canShow…]` inputs.
5. **Users table** — status badges render: active=green, pending=amber, suspended=neutral, locked=neutral, deleted=red. Row 3-dot opens "More Details" menu.
6. **Add Client wizard chrome** — open via root-node 3-dot → Add Client. Should match React Step 1 (Information) layout.
7. **Add User wizard chrome** — same flow on non-root.
8. **Node drawer** — Add Node opens right-side panel with single name input.
9. **Info panel** — click Information button on a client node header — 17-field grid renders (NEW in this phase).
10. **Settings tab** — click Settings tab — view-mode + Edit pill renders (NEW in this phase).
11. **Chart view** — click view-toggle → Tree icon — chart renders (NEW in this phase). Wheel zoom anchored on cursor. Click non-root card → focus mode with user circles below.

If any section visibly diverges from the React reference, capture screenshots and feed back into round 1 of the sweep.

---

## Sections targeted by the bounded sweep (when it runs)

The 5-round sweep would compare these section-by-section:

| # | Section | Risk |
|---|---|---|
| 1 | Tree panel header + first 4 rows | LOW |
| 2 | Node 3-dot kebab menu | LOW |
| 3 | Tab strip | LOW |
| 4 | View toggle pill | LOW |
| 5 | Users table layout + headers | LOW |
| 6 | Status badges (5 statuses) | LOW |
| 7 | Add Client wizard step-1 (Information) | MED |
| 8 | Add User wizard step-1 (Personal) | MED |
| 9 | Node drawer | LOW |
| 10 | Info panel (NEW Phase-2) | **MED** — first live render |
| 11 | Settings tab (NEW Phase-2) | **MED** — first live render |
| 12 | Chart view (NEW Phase-2) | **HIGH** — pan/zoom needs runtime smoke |

Sections marked NEW are the highest-risk parity targets because they landed in this phase and have only been validated via build-green + lint-clean, not live-render.

---

## Final parity score

**Not measured.** Cannot be measured without browser access.

Per brief rules: no speculation. Score will land when the sweep actually runs.

---

## Remaining gaps for the user to triage

These were noted in Phase-1 reports and are still open after Phase-2:

| Code | Gap | Fix lane |
|---|---|---|
| UC-W01 | `<falcon-angular-tree>` lacks per-row template | Library upgrade |
| FT-01 | `pi pi-ellipsis-v` PrimeIcon in row 3-dot | Library upgrade |
| P0-01 | Unsaved-changes popup lacks focus-trap | Library upgrade |
| G1 | `<falcon-angular-otp>` no `(falconComplete)` output | Library upgrade |
| 23 lint errors | Verbatim port a11y warnings | Cross-console a11y wave |

---

## What was completed in this Phase-2 (relevant to W17)

- ✅ W14 — full info-panel + settings-tab UI landed (replaces 2 placeholders)
- ✅ W15 — full chart subtree landed (11 new files, replaces chart placeholder)
- ✅ Build green: admin-console `b81dbbdcc232c7cb`
- ✅ Lint clean: 23 errors (matches inherited baseline; zero new from Phase-2)

When W17 next runs, the chart + info-panel + settings-tab will already be wired and visually testable — no placeholders remain.

---

End of Wave 17 report. Status: BLOCKED on browser selection.
