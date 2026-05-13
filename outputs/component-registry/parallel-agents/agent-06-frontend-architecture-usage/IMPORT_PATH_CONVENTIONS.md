# Import Path Conventions — `tsconfig.base.json` Aliases

## tsconfig.base.json — verbatim paths block

```jsonc
// tsconfig.base.json:16-71
"paths": {
  "@falcon":                            ["./libs/falcon/src/index.ts"],
  "@falcon/sdk":                        ["./libs/sdk/src/index.ts"],
  "@falcon/studio":                     ["./libs/falcon-studio/src/index.ts"],
  "@falcon/theme":                      ["./libs/falcon-theme/src/index.css"],
  "@falcon/theme/tokens":               ["./libs/falcon-theme/src/tokens.ts"],
  "@falcon/theme/*":                    ["./libs/falcon-theme/src/*"],
  "@falcon/ui-core":                    ["./libs/falcon-ui-core/src/index.ts"],
  "@falcon/ui-core/loader":             ["./libs/falcon-ui-core/src/define-custom-elements.ts"],
  "@falcon/ui-core/tailwind":           ["./libs/falcon-ui-core/src/tailwind/tailwind-classes.ts"],
  "@falcon/ui-core/angular":            ["./libs/falcon-ui-core/src/angular-wrapper/index.ts"],
  "@falcon/ui-core/angular/*":          ["./libs/falcon-ui-core/src/angular-wrapper/components/*/index.ts"],
  "@falcon/ui-core/tailwind/*":         ["./libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts"],
  "@falcon/ui-core/types":              ["./libs/falcon-ui-core/src/components.ts"],
  "@falcon/ui-tokens/*":                ["./libs/falcon-ui-tokens/src/*"],
  "@falcon/ui-react":                   ["./libs/falcon-ui-react/src/index.ts"],
  "@falcon/ui-vue":                     ["./libs/falcon-ui-vue/src/index.ts"],
  "@falcon/ui-showcase-data":           ["./libs/falcon-ui-showcase-data/src/index.ts"],
  "@falcon/ui-showcase-data/docs/*":    ["./libs/falcon-ui-showcase-data/src/docs/*"]
}
```

---

## Per-component recommended import path

For Angular Wrapper consumers, **prefer `@falcon/ui-core/angular` (root barrel)** for normal feature code — single import, fewest entries in IDE. **Prefer the `@falcon/ui-core/angular/<name>` per-component alias** in lib-internal code to keep barrels lean and Nx graph crisp.

| Component | Canonical Angular import | Stencil tag types |
|---|---|---|
| `<falcon-angular-accordion>` | `from '@falcon/ui-core/angular'` (or `/angular/falcon-accordion`) | `FalconAccordionItem`, `FalconAccordionMode` |
| `<falcon-angular-avatar>` | `from '@falcon/ui-core/angular'` (or `/angular/falcon-avatar`) | — |
| `<falcon-angular-badge>` | `from '@falcon/ui-core/angular'` (or `/angular/falcon-badge`) | — |
| `<falcon-angular-button>` | `from '@falcon/ui-core/angular'` (or `/angular/falcon-button`) — also re-exported via `@falcon` (legacy path) | `FalconButtonVariant`, `FalconButtonSize` |
| `<falcon-angular-calendar>` | `from '@falcon/ui-core/angular'` — also re-exported via `@falcon` | `FalconCalendarSize`, `FalconCalendarViewMode` |
| `<falcon-angular-card>` | `from '@falcon/ui-core/angular'` (only — not re-exported via `@falcon`) | — |
| `<falcon-angular-checkbox>` + `<falcon-angular-checkbox-group>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconCheckboxGroupOption` |
| `<falcon-angular-combobox>` | `from '@falcon/ui-core/angular'` (only) | `ComboboxItem`, `FalconComboboxSize` |
| `<falcon-angular-confirm-dialog>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-data-table>` | `from '@falcon/ui-core/angular'` — types: `ColumnDef`, `FalconDataTableCellDirective`, `FalconDataTableRowAction`, `FalconDataTableMenuItem` | (Strategy E projection) |
| `<falcon-angular-date-picker>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | reuses calendar types |
| `<falcon-angular-dialog>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon`. **@deprecated** — prefer `<falcon-angular-popup>` | `FalconDialogSize`, `FalconDialogPosition` |
| `<falcon-angular-drawer>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-dropdown>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconDropdownOption` |
| `<falcon-angular-email-field>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-empty-state>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-filter-panel>` | `from '@falcon/ui-core/angular'` (only) | `FilterDefinition`, `FilterValues`, `SelectOption` |
| `<falcon-angular-grid-input>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-icon>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-input>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconInputType`, `FalconInputSize`, `FalconInputState`, `FalconInputVariant`, `FalconInputAppearance` |
| `<falcon-angular-input-number>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-menu>` | `from '@falcon/ui-core/angular'` (only) | `FalconMenuItem` |
| `<falcon-angular-message-host>` + `FalconMessageService` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconMessage` |
| `<falcon-angular-multi-select>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconMultiSelectOption` |
| `<falcon-angular-notification>` (+ stack) | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconNotificationIntent` |
| `<falcon-angular-otp>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-otp-send-dialog>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconOtpSendChannel`, `FalconOtpSendDialogMode`, `FalconOtpSendDialogStep` |
| `<falcon-angular-paginator>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconPaginatorSize`, `FalconPaginatorChangeDetail`, `FalconPaginatorItem` |
| `<falcon-angular-password>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-phone-field>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-popup>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconPopupVariant` |
| `<falcon-angular-radio>` + `<falcon-angular-radio-group>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconRadioGroupOption` |
| `<falcon-angular-search-input>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-select>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-single-uploader>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconSingleUploaderFile`, `FalconSingleUploaderPreviewMode` |
| `<falcon-angular-status-badge>` | `from '@falcon/ui-core/angular'` (only) | — |
| `<falcon-angular-stepper>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconStepperStep`, `FalconStepperMode`, `FalconStepperOrientation` |
| `<falcon-angular-switch>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-table>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` (some types aliased) | `FalconTableColumn`, `FalconTableColumnAlign`, `FalconTableSelectionMode` |
| `<falcon-angular-tabs>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconTabOption`, `FalconTabsMode`, `FalconTabsOrientation` |
| `<falcon-angular-tag>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconTagSeverity`, `FalconTagSize` |
| `<falcon-angular-textarea>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | — |
| `<falcon-angular-toast>` + `<falcon-angular-toast-host>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon`. **@deprecated** | `FalconToastSeverity`, `FalconToastHostPosition` |
| `<falcon-angular-tooltip>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconTooltipPlacement` |
| `<falcon-angular-tree>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconTreeRowNode`, `FalconTreeRowDensity`, `FalconTreeRowSelectionMode`, `FalconTreeBadge` |
| `<falcon-angular-tree-table>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconTreeColumn`, `FalconTreeNode`, `FalconTreeTableDensity`, `FalconTreeTableSelectionMode` |
| `<falcon-angular-uploader>` | `from '@falcon/ui-core/angular'` — re-exported via `@falcon` | `FalconUploaderFile`, `FalconUploaderMode`, `FalconUploaderFileStatus` |
| `<falcon-angular-wizard>` | `from '@falcon/ui-core/angular'` (only) | — |

### Legacy bespoke Angular components (not Stencil-backed)

| Component | Canonical import |
|---|---|
| `<falcon-calendar>` façade (delegates to angular-date-picker) | `from '@falcon'` (legacy) |
| `<falcon-mobile-number>` | `from '@falcon'` — should migrate to `<falcon-angular-phone-field>` |
| `<falcon-multiselect>` (legacy) | `from '@falcon'` — should migrate to `<falcon-angular-multi-select>` |
| `<falcon-stepper>` + `FalconStepDirective` + `FalconStepperFooterDirective` (PrimeNG-shaped) | `from '@falcon'` — should migrate to `<falcon-angular-stepper>` |
| `<falcon-form-field>` | `from '@falcon'` — see upgrade candidate (slot into Input wrapper) |
| `<falcon-photo-uploader>` | `from '@falcon'` |
| `<falcon-tree-panel>` | `from '@falcon'` — likely promotes to Stencil paired tag |
| `<send-credentials-popup>` | `from '@falcon'` |

### Stencil-direct components

| Component | Canonical import (template tag only) |
|---|---|
| `<falcon-organization-hierarchy-tree-tw>` | Light DOM Stencil tag — used directly. Types via `FalconOrgHierarchyNode` from `@falcon/ui-core/angular`. |

---

## Cross-framework Tailwind helpers

```ts
// @falcon/ui-core/tailwind → libs/falcon-ui-core/src/tailwind/tailwind-classes.ts
export * from './tailwind-classes';

// Per-component aliases via @falcon/ui-core/tailwind/* → libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts
import { falconInputClasses } from '@falcon/ui-core/tailwind/input';
import { falconDropdownClasses } from '@falcon/ui-core/tailwind/dropdown';
import { falconTreeClasses } from '@falcon/ui-core/tailwind/tree';
// ...
```

These helpers return Tailwind class strings deterministically and are the SAME source the Stencil `-tw` Light DOM tags use internally — guarantees parity across Angular `useTailwind=true` mode, React wrappers, Vue wrappers, and Stencil Light DOM.

---

## Loader (Stencil custom-elements bootstrap)

```ts
// @falcon/ui-core/loader → libs/falcon-ui-core/src/define-custom-elements.ts
import { defineFalconComponent } from '@falcon/ui-core/loader';

// Each Angular wrapper's ngOnInit calls defineFalconComponent('falcon-input') etc.
// Lazy registration — host-shell does NOT eager-load defineCustomElements() (Wave 5 removed it).
```

---

## Reaching component-scoped tokens directly

```css
/* In a feature's tailwind override CSS (rare): */
@import "@falcon/ui-tokens/components/input.tokens.css";
```

Most apps consume the whole token tree via `@import "../../../libs/falcon-ui-tokens/src/index.css"` in their `tailwind.css`. Direct sub-path imports are reserved for ad-hoc consumers (e.g. component-docs preview pages).
