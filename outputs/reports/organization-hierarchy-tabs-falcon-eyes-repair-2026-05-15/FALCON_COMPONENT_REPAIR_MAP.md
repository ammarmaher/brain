*** Falcon Component Repair Map — Org Hierarchy (2026-05-15) ***

## Status
BLOCKED. With the destination rendering only an "Access Check Failed" card, no Falcon component on the Organization Hierarchy page is reachable for analysis or repair.

## Repair table
| Mismatch ID | Section | Falcon component | Repair path | Likely file to change | Proof needed |
|---|---|---|---|---|---|
| FE-2026-05-15-page-0001 | all | n/a — page never mounts | unblock auth / re-run Falcon Eyes | none (environmental) | new diff where destination shows real Org Hierarchy UI |

## Customization order reminder (to apply once unblocked)
1. Existing Falcon component inputs / config
2. Existing Falcon `ng-template` support
3. Existing Falcon slots / content projection
4. Existing Falcon Tailwind / token variants
5. Shared Falcon component upgrade (new input, slot, template)
6. New reusable Falcon component in the lib
7. Feature-local wrapper (page-specific only)
8. Raw implementation (last resort, document as GAP)

## Components likely to be involved once unblocked (from page knowledge)
Based on `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\COMPONENT_MAPPING.md` and the source screenshot, the eventual repair will touch (in expected order of likelihood):
- `falcon-tabs` — tabs header / active state / hover / right-side List/Tree toggle slot
- `falcon-data-table` (or `falcon-table`) — users table with status badges, action column, custom-cell `ng-template`
- `falcon-status-badge` / `falcon-badge` / `falcon-tag` — Active / Suspended / Deleted / Locked / Pending
- `falcon-button` — Information, + Add Node, + Add User (incl. dashed-Add IP later in Settings)
- `falcon-dropdown` / `falcon-multi-select` / `falcon-combobox` — role / permission group / status filters
- `falcon-toggle` / `falcon-switch` — comm channels / apps & services toggles
- `falcon-uploader` — org info photo uploader
- `falcon-input` / `falcon-mobile-number` / `falcon-email-field` — org info six required fields
- `falcon-dialog` / `falcon-confirm-dialog` / `falcon-popup` — OTP popup, delete confirmation
- `falcon-checkbox` / `falcon-checkbox-group` — permissions / privilege table cells

None of the above were observable in this run, so no concrete repair entry is opened.
