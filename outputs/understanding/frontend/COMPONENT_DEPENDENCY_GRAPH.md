---
type: dependency-graph
purpose: which-component-imports-which
generatedAt: 2026-05-16
generator: Tier 1 of FRONTEND_KNOWLEDGE_PATH
source: grep across libs/falcon-ui-core/src/components/**
---

*** Falcon Component dependency graph ***
*** For each component, which other Falcon components it imports ***
*** Compose-of relations only (Stencil + Angular wrapper sources) ***

# 🕸 Component Dependency Graph

> For each of the 62 Falcon components, this graph shows **which other Falcon components it imports or composes**. Built from grep across `libs/falcon-ui-core/src/**`. A component that appears as a target = "Foo composes Bar" or "Foo's Angular wrapper imports Bar".

## How to read

- **Imports** = other Falcon components that THIS component depends on
- **Used-by** = other Falcon components that depend on THIS one
- **Compose depth** = how deep this component sits in the composition tree (0 = leaf, higher = more composed)

## Per-component graph

### `falcon-accordion`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-alert-dialog`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-dialog]]

### `falcon-avatar`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-icon]]

### `falcon-badge`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-icon]]
    - [[falcon-status-badge]]

### `falcon-button`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-otp-send-dialog]]

### `falcon-calendar-legacy`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-calendar`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-date-picker]]

### `falcon-card`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-checkbox-group`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-checkbox]]

### `falcon-checkbox`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-combobox`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-confirm-dialog`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-dialog]]
    - [[falcon-icon]]

### `falcon-data-table`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-menu]]

### `falcon-date-picker`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-calendar]]

### `falcon-dialog`  (imports 3 Falcon components)

**Composes:**
    - [[falcon-alert-dialog]]
    - [[falcon-confirm-dialog]]
    - [[falcon-otp-send-dialog]]

### `falcon-drawer`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-dialog]]

### `falcon-dropdown`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-email-field`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-empty-state`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-icon]]

### `falcon-filter-panel`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-form-field`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-grid-input`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-icon`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-input-number`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-button]]
    - [[falcon-input]]

### `falcon-input`  (imports 4 Falcon components)

**Composes:**
    - [[falcon-grid-input]]
    - [[falcon-input-number]]
    - [[falcon-password]]
    - [[falcon-search-input]]

### `falcon-insufficient-balance-dialog`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-menu`  (imports 3 Falcon components)

**Composes:**
    - [[falcon-icon]]
    - [[falcon-tooltip]]
    - [[falcon-tree-panel]]

### `falcon-message-host`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-mobile-number`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-multi-select`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-dropdown]]

### `falcon-multiselect-legacy`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-notification`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-organization-hierarchy-tree-tw`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-select]]

### `falcon-otp-send-dialog`  (imports 4 Falcon components)

**Composes:**
    - [[falcon-button]]
    - [[falcon-dialog]]
    - [[falcon-otp]]
    - [[falcon-radio]]

### `falcon-otp`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-otp-send-dialog]]

### `falcon-paginator`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-table]]

### `falcon-password`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-icon]]
    - [[falcon-input]]

### `falcon-phone-field`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-photo-uploader`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-popup`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-radio-group`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-radio]]

### `falcon-radio`  (imports 3 Falcon components)

**Composes:**
    - [[falcon-checkbox]]
    - [[falcon-otp-send-dialog]]
    - [[falcon-tree-table]]

### `falcon-search-input`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-select`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-dropdown]]

### `falcon-single-uploader`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-icon]]

### `falcon-status-badge`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-tag]]

### `falcon-stepper-legacy`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-stepper`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-icon]]
    - [[falcon-wizard]]

### `falcon-switch`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-table`  (imports 3 Falcon components)

**Composes:**
    - [[falcon-data-table]]
    - [[falcon-icon]]
    - [[falcon-paginator]]

### `falcon-tabs`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-tag`  (imports 3 Falcon components)

**Composes:**
    - [[falcon-badge]]
    - [[falcon-icon]]
    - [[falcon-status-badge]]

### `falcon-textarea`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-input]]

### `falcon-toast`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-tooltip`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-tree-panel`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-tree-table`  (imports 2 Falcon components)

**Composes:**
    - [[falcon-radio]]
    - [[falcon-tree]]

### `falcon-tree`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `falcon-uploader`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-icon]]

### `falcon-wizard`  (imports 1 Falcon components)

**Composes:**
    - [[falcon-stepper]]

### `send-credentials-popup`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.

### `shared-directives`  (imports 0 Falcon components — leaf)

Leaf component. No internal Falcon dependencies.


## Top consumers (highest in-degree)

| Component | Used-by count | Description |
|---|---|---|
| falcon-wizard | 1 | (top consumer) |
| falcon-tree | 1 | (top consumer) |
| falcon-tree-table | 1 | (top consumer) |
| falcon-tree-panel | 1 | (top consumer) |
| falcon-tooltip | 1 | (top consumer) |
| falcon-tag | 1 | (top consumer) |
| falcon-table | 1 | (top consumer) |
| falcon-stepper | 1 | (top consumer) |
| falcon-status-badge | 1 | (top consumer) |
| falcon-status-badge | 1 | (top consumer) |
| falcon-select | 1 | (top consumer) |
| falcon-search-input | 1 | (top consumer) |
| falcon-radio | 1 | (top consumer) |
| falcon-radio | 1 | (top consumer) |
| falcon-radio | 1 | (top consumer) |

## Statistics

- Total edges (compose relations): 61
- Components scanned: 62
