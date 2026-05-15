# Falcon Component Repair Map

| Mismatch ID | Section | Falcon component | Repair path (input / template / slot / token / upgrade) | Likely file to change | Proof needed |
|---|---|---|---|---|---|
| _FE-tabs-header-0001_ | tabs-header |  |  |  |  |
| _FE-comm-channels-tab-0001_ | comm-channels-tab |  |  |  |  |
| _FE-apps-services-tab-0001_ | apps-services-tab |  |  |  |  |
| _FE-org-info-panel-0001_ | org-info-panel |  |  |  |  |
| _FE-org-info-audit-mode-0001_ | org-info-audit-mode |  |  |  |  |
| _FE-org-info-rule-status-0001_ | org-info-rule-status |  |  |  |  |
| _FE-org-info-permission-privilege-0001_ | org-info-permission-privilege |  |  |  |  |
| _FE-settings-tab-view-mode-0001_ | settings-tab-view-mode |  |  |  |  |
| _FE-settings-tab-edit-mode-0001_ | settings-tab-edit-mode |  |  |  |  |
| _FE-settings-ip-management-0001_ | settings-ip-management |  |  |  |  |
| _FE-settings-account-limitation-0001_ | settings-account-limitation |  |  |  |  |
| _FE-otp-popup-0001_ | otp-popup |  |  |  |  |

Use the customization order from the skill:
1. Existing Falcon component inputs / config
2. Existing Falcon ng-template support
3. Existing Falcon slots / content projection
4. Existing Falcon Tailwind / token variants
5. Shared Falcon component upgrade
6. New reusable Falcon component in the library
7. Feature-local wrapper (page-specific only)
8. Raw implementation (last resort, document as GAP)