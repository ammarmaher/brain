---
type: evolution-timeline
purpose: when-each-component-was-added-or-changed
generatedAt: 2026-05-16
generator: Tier 1 of FRONTEND_KNOWLEDGE_PATH
source: git log on each component source folder
---

*** Falcon Component evolution timeline ***
*** Per-component: first commit, last commit, total commits, recent activity ***

# ⏳ Component Evolution Timeline

> For each Falcon component, this timeline shows **when it was first created** (first commit in git history), **when it was last touched**, **total commits**, and the **most recent commit subject** so you can scan for active vs orphaned components.

## How to read

- **First commit** = when this component entered the repo
- **Last commit** = most recent change
- **Commits** = total number of commits touching this component's source folder
- **Last subject** = the most recent commit message subject (truncated)
- **Status** = 🟢 active (touched in last 30 days), 🟡 stable (30-90 days), 🔴 orphan (>90 days)

## Methodology

```
cd falcon-web-platform-ui
for each component:
  git log --all --format="%H|%ad|%s" --date=short -- libs/falcon-ui-core/src/components/<name>
```

## Per-component timeline

| Component | First | Last | Commits | Status | Last subject |
|---|---|---|---|---|---|
| falcon-accordion | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-alert-dialog | 2026-05-15 | 2026-05-15 | 1 | 🟢 active | Wave 16: Insufficient Balance Priority Popup (3-artefact + h |
| falcon-avatar | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-badge | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-button | 2026-05-08 | 2026-05-15 | 7 | 🟢 active | enhance organization hierarchy tabs - Wave 13 gap closure |
| falcon-calendar-legacy | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-calendar | 2026-05-08 | 2026-05-15 | 6 | 🟢 active | feat(falcon-ui-core): dynamic popup z-index + calendar disab |
| falcon-card | 2026-05-10 | 2026-05-11 | 3 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-checkbox-group | 2026-05-08 | 2026-05-12 | 4 | 🟢 active | Fixing coloring for pop up and business message screen. |
| falcon-checkbox | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-combobox | 2026-05-11 | 2026-05-12 | 2 | 🟢 active | Adding Landing Component Pages |
| falcon-confirm-dialog | 2026-05-10 | 2026-05-16 | 4 | 🟢 active | 55% |
| falcon-data-table | 2026-05-10 | 2026-05-16 | 8 | 🟢 active | 50% |
| falcon-date-picker | 2026-05-08 | 2026-05-15 | 7 | 🟢 active | 54% |
| falcon-dialog | 2026-05-08 | 2026-05-15 | 7 | 🟢 active | 60% |
| falcon-drawer | 2026-05-10 | 2026-05-12 | 4 | 🟢 active | Adding Landing Component Pages |
| falcon-dropdown | 2026-05-08 | 2026-05-15 | 7 | 🟢 active | 54% |
| falcon-email-field | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-empty-state | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-filter-panel | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-form-field | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-grid-input | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-icon | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-input-number | 2026-05-10 | 2026-05-11 | 3 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-input | 2026-05-08 | 2026-05-11 | 5 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-insufficient-balance-dialog | 2026-05-15 | 2026-05-15 | 1 | 🟢 active | Wave 16: Insufficient Balance Priority Popup (3-artefact + h |
| falcon-menu | 2026-05-10 | 2026-05-16 | 6 | 🟢 active | 55% |
| falcon-message-host | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-mobile-number | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-multi-select | 2026-05-08 | 2026-05-15 | 9 | 🟢 active | 54% |
| falcon-multiselect-legacy | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-notification | 2026-05-12 | 2026-05-14 | 2 | 🟢 active | 30 % |
| falcon-organization-hierarchy-tree-tw | 2026-05-09 | 2026-05-11 | 2 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-otp-send-dialog | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-otp | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-paginator | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-password | 2026-05-10 | 2026-05-16 | 4 | 🟢 active | 50% |
| falcon-phone-field | 2026-05-08 | 2026-05-15 | 7 | 🟢 active | 54% |
| falcon-photo-uploader | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-popup | 2026-05-12 | 2026-05-16 | 5 | 🟢 active | 55% |
| falcon-radio-group | 2026-05-08 | 2026-05-12 | 4 | 🟢 active | Fixing coloring for pop up and business message screen. |
| falcon-radio | 2026-05-08 | 2026-05-11 | 5 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-search-input | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-select | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-single-uploader | 2026-05-08 | 2026-05-13 | 5 | 🟢 active | chore(workspace): total PrimeNG removal — final sweep + St |
| falcon-status-badge | 2026-05-11 | 2026-05-11 | 2 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-stepper-legacy | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-stepper | 2026-05-08 | 2026-05-11 | 7 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-switch | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-table | 2026-05-08 | 2026-05-16 | 14 | 🟢 active | 55% |
| falcon-tabs | 2026-05-08 | 2026-05-12 | 5 | 🟢 active | Adding a new empty page organization hierarchy and fix the t |
| falcon-tag | 2026-05-10 | 2026-05-11 | 3 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-textarea | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-toast | 2026-05-08 | 2026-05-11 | 5 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-tooltip | 2026-05-08 | 2026-05-11 | 4 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-tree-panel | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| falcon-tree-table | 2026-05-08 | 2026-05-11 | 5 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-tree | 2026-05-08 | 2026-05-11 | 5 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| falcon-uploader | 2026-05-08 | 2026-05-13 | 6 | 🟢 active | chore(workspace): total PrimeNG removal — final sweep + St |
| falcon-wizard | 2026-05-11 | 2026-05-11 | 1 | 🟢 active | feat(falcon-ui): v1.0 plan convergence — 14 waves across 3 |
| send-credentials-popup | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |
| shared-directives | _no source_ | — | 0 | ⚪ unmapped | (not found in libs) |

## Status legend

- 🟢 active — last touched within 30 days
- 🟡 stable — touched 30-90 days ago
- 🔴 orphan — not touched in >90 days (candidate for review)
- ⚪ untracked / no source — not found in git history (may live in different lib)

Generated: Sat May 16 11:32:12 JST 2026
