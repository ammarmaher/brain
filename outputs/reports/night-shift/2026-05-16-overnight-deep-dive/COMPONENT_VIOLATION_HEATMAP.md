---
type: component-heatmap
generatedAt: 2026-05-16T03:37:24.5209509+03:00
totalViolations: 2734
componentsExamined: 62
---

# Falcon Component Violation Heatmap

> Cross-references violations with Falcon component dossiers. Helps decide which library components need first-priority hardening + which custom code paths are circumventing them.

## Heatmap (top 20 components by surrounding violations)

| Component | Files mentioning it | Violations nearby | Dossier |
|---|---|---|---|
| `falcon-icon` | 43 | 107 | [OVERVIEW](../../understanding/frontend/components/falcon-icon/OVERVIEW.md) |
| `falcon-tree` | 5 | 80 | [OVERVIEW](../../understanding/frontend/components/falcon-tree/OVERVIEW.md) |
| `falcon-multi-select` | 2 | 65 | [OVERVIEW](../../understanding/frontend/components/falcon-multi-select/OVERVIEW.md) |
| `falcon-uploader` | 2 | 57 | [OVERVIEW](../../understanding/frontend/components/falcon-uploader/OVERVIEW.md) |
| `falcon-dropdown` | 2 | 54 | [OVERVIEW](../../understanding/frontend/components/falcon-dropdown/OVERVIEW.md) |
| `falcon-phone-field` | 2 | 51 | [OVERVIEW](../../understanding/frontend/components/falcon-phone-field/OVERVIEW.md) |
| `falcon-button` | 1 | 50 | [OVERVIEW](../../understanding/frontend/components/falcon-button/OVERVIEW.md) |
| `falcon-table` | 4 | 48 | [OVERVIEW](../../understanding/frontend/components/falcon-table/OVERVIEW.md) |
| `falcon-otp` | 2 | 48 | [OVERVIEW](../../understanding/frontend/components/falcon-otp/OVERVIEW.md) |
| `falcon-single-uploader` | 2 | 44 | [OVERVIEW](../../understanding/frontend/components/falcon-single-uploader/OVERVIEW.md) |
| `falcon-data-table` | 2 | 44 | [OVERVIEW](../../understanding/frontend/components/falcon-data-table/OVERVIEW.md) |
| `falcon-input` | 2 | 43 | [OVERVIEW](../../understanding/frontend/components/falcon-input/OVERVIEW.md) |
| `falcon-textarea` | 3 | 37 | [OVERVIEW](../../understanding/frontend/components/falcon-textarea/OVERVIEW.md) |
| `falcon-checkbox` | 2 | 35 | [OVERVIEW](../../understanding/frontend/components/falcon-checkbox/OVERVIEW.md) |
| `falcon-stepper` | 3 | 34 | [OVERVIEW](../../understanding/frontend/components/falcon-stepper/OVERVIEW.md) |
| `falcon-switch` | 2 | 32 | [OVERVIEW](../../understanding/frontend/components/falcon-switch/OVERVIEW.md) |
| `falcon-tree-table` | 1 | 32 | [OVERVIEW](../../understanding/frontend/components/falcon-tree-table/OVERVIEW.md) |
| `falcon-tabs` | 1 | 31 | [OVERVIEW](../../understanding/frontend/components/falcon-tabs/OVERVIEW.md) |
| `falcon-combobox` | 1 | 31 | [OVERVIEW](../../understanding/frontend/components/falcon-combobox/OVERVIEW.md) |
| `falcon-radio` | 2 | 30 | [OVERVIEW](../../understanding/frontend/components/falcon-radio/OVERVIEW.md) |

## Components with ZERO surrounding violations (the well-adopted ones)

- `falcon-alert-dialog`  ✅
- `falcon-calendar-legacy`  ✅
- `falcon-grid-input`  ✅
- `falcon-insufficient-balance-dialog`  ✅
- `falcon-message-host`  ✅
- `falcon-mobile-number`  ✅
- `falcon-multiselect-legacy`  ✅
- `falcon-notification`  ✅
- `falcon-organization-hierarchy-tree-tw`  ✅
- `falcon-popup`  ✅
- `falcon-select`  ✅
- `falcon-stepper-legacy`  ✅
- `shared-directives`  ✅

## What this tells us

Components that appear in many violations are EITHER:
1. Heavily used and the surrounding code violates rules (raw HTML around them — R-FE-005)
2. Under-adopted — files reference them but don't use them correctly
3. The location for legitimate rule violations the agent can audit deeper

Cross-reference with patterns/PATTERN-XX migration plans to identify which Falcon component upgrades + which call-site refactors will yield the largest violation drops.

