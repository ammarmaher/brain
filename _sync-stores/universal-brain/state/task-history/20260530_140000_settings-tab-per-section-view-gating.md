# Task — Per-section view+edit authority in Settings tab (both consoles)

- **Date:** 2026-05-30
- **Status:** ✅ COMPLETED + build-green + LIVE-PES-VERIFIED end-to-end · NO COMMITS
- **Repo / branch:** `C:/Falcon/Falcon/falcon-web-platform-ui` · `polishing-v0.4`
- **Plan:** `C:/Users/User/.claude/plans/gentle-booping-sonnet.md` (approved via ExitPlanMode)

## User ask
Apply per-section authority rules in the Settings tab of BOTH consoles — HIDE a section the user cannot view, RO when viewable-not-editable, EDITABLE when permitted. Leave the **Add Client** wizard untouched. Best-practice, PRD-grounded, verify after implementing.

## Rule (fail-closed)
Per section X ∈ {Security, AllowedIps, Quota}:
- `canEditX = (resolved pesEditX === true)` (unchanged).
- `canViewX = (resolved pesViewX === true) || canEditX` (edit ⇒ view).
- Section rendered only `@if (canViewX)`; quota also `hasQuota()` (BIZ-014).
- Controls editable inside only `!readonly() && canEditX` (template idiom unchanged).
- **View query emitted ONLY where registry has `.view()`** (mgmt: all 3 acc.*; admin: rootPasswordSecurityLevel when isFalconRoot). For resources with no seeded view rule, view query OMITTED → canView falls back to canEdit (editable section never wrongly hidden).

## Changeset (8 files)
- `apps/{mgmt,admin}/.../settings-tab/models/models.ts` — `SettingsPesFlags` + `canViewSecurity/canViewAllowedIps/canViewQuota`; `DEFAULT_PES_FLAGS` 6×`false`.
- `apps/{mgmt,admin}/.../settings-tab/signals/settings-tab.signals.ts` — mgmt adds 3 `acc.*.view()` queries; admin adds **conditional** `viewSecurity = rootPasswordSecurityLevel.view()` only on `isFalconRoot`; both: handler maps `canViewX = !!f['viewX'] || canEditX`.
- `apps/{mgmt,admin}/.../settings-tab/settings-tab.component.ts` — `canViewAny` computed.
- `apps/{mgmt,admin}/.../settings-tab/settings-tab.component.html` — wrap Password-Security `@if (canViewSecurity)`; wrap Allowed-IPs `@if (canViewAllowedIps)`; quota aside `@if (hasQuota() && canViewQuota)`; new `@else if (!canViewAny())` empty-state branch (lock icon + neutral card).
- `libs/falcon/src/language/i18n/{en,ar}.json` — `hierarchy.settings.noViewableSections.{title,detail}`.

**NOT touched (scope honored):** `org-hierarchy-page-menu.component.html` (Edit button already fail-closed), `add-client-wizard/**` (verified no per-section PES gating; stays as-is), `settings.service.ts`/`toUpdateSettingsRequest` (save-payload narrowing flagged as backend ticket — see flags), `users-state.signals.ts visibleTabs` (tab-level hide is a flagged follow-up).

## Verification

### Build (gate)
`nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**. Only pre-existing unused-file warnings.

### Live PES (proven matrix)
`POST :5296/pes/authorize/resources` after login `:7777/api/auth/login` Admin@1234, batch `view`+`edit` per resource:

| Console / node | Role | Pwd Security | Allowed IPs | Quota | UI outcome |
|---|---|---|---|---|---|
| Mgmt | accadmin | view+edit deny | view+edit deny | view+edit deny | empty-state |
| Mgmt | accowner | view+edit allow | view+edit allow | view+edit allow | all editable |
| Admin root | sysadmin | view+edit allow | edit allow | edit allow (H BIZ-014) | Pwd+IPs editable |
| Admin root | sysops | view✓ edit✗ | edit deny | edit deny | **Pwd RO only** |
| Admin root | sysprod | view+edit deny | edit deny | edit deny | empty-state |
| Admin client | sysadmin | edit allow | edit allow | edit allow | all editable |
| Admin client | sysops | edit deny | edit allow | edit deny | IPs only |
| Admin client | sysprod | edit deny | edit deny | edit allow | Quota only |

The single RO cell (admin root · sysops · password-security) is exactly what `canView = view OR edit` is for.

### Runtime
Not browser-clicked — Docker `:4301`/`:4204` still serve pre-change bundles. Click-through needs a rebuild/`nx serve` or redeploy.

## Flags
- **Backend per-section authorization gap (separate ticket):** `commerce SettingController.Update` has no `[Authorize]`; handler gates only quota by `eUserType.Falcon`. Raw PUT bypasses any FE narrowing. Per-resource PES belongs on backend. FE narrowing = security theater. **Recommend a backend task.**
- **Tab-level hide:** in-tab empty-state shipped. Hiding the whole Settings TAB when no section viewable belongs in `users-state.signals.ts visibleTabs` (separate per-node async resolve, mirrors existing `_canViewServices` pattern) — cleaner follow-up, NOT bundled.

## Brain grounding
- `[CODE]` PES seed `pes-account-role-rules.json` (mgmt acc.*); `pes-verification-2026-05-16.csv` (admin sys.* — full role × resource × action × effect matrix).
- `[BRAIN-OUT]` PRD `01-account-management/WORKFLOWS.md:84-87` + `latest-prd.md:33-45` + `05-capability-maps/*.capability.md`.
- `[BRAIN-OUT]` `13-error-catalog/FE-CONTRACT.md` Rule 1 (HTTP status routing) + Rule 2 (verbatim `errorMessages[0]`).
- `[CODE]` `add-user-wizard.component.ts:329` precedent — established fail-closed pattern ("never fails open").

## Memory
- `project_settings_tab_per_section_view_gating_2026_05_30.md` + MEMORY.md index.
- Supersedes the previous fail-closed-edit-only memory `reference_settings_tab_edit_authority_and_failopen_bug_2026_05_30.md`.
