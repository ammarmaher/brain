# Barrel Exports Audit — Falcon Frontend

Lists every barrel `index.ts` / `index.css` and what it actually re-exports. Recommended import path per symbol family.

---

## 1. `libs/falcon/src/index.ts` — alias `@falcon`

The Angular barrel — 6 `export *` lines, each pointing to a sub-folder.

```ts
// libs/falcon/src/index.ts
export * from './core';
export * from './language';
// theme moved to @falcon/theme (CSS only — no TS exports)
export * from './shared-ui';
export * from './shared-data-access';
export * from './shared-types';
export * from './shared-utils';
```

**Recommended import:** `import { ... } from '@falcon';` for anything that has historically lived in this lib.

### 1.1 `libs/falcon/src/core/index.ts`

```ts
// libs/falcon/src/core/index.ts
export * from './lib/user-session.interface';
export * from './lib/services/session-provider.service';
export * from './lib/services/route-access.service';
export * from './lib/services/node.service';
export * from './lib/access-control';
export * from './lib/guards/admin-organization-hierarchy.guard';
export * from './lib/guards/admin-console.guard';
export * from './lib/guards/management-console.guard';
```

**Exports include:** `SessionProvider`, `RouteAccessService`, `NodeService`, `FalconAccess`, `SHELL_CORE_ACCESS`, `shellPrimeAccessGuard`, `shellAccessMatchGuard`, `adminConsoleGuard`, `managementConsoleGuard`, `adminOrganizationHierarchyGuard`, `AccessQuery`.

### 1.2 `libs/falcon/src/language/index.ts`

```ts
// libs/falcon/src/language/index.ts
export * from './lib/services/translate.service';
export type { TranslationKey, TranslationObject } from './lib/services/translate.service';
export * from './lib/pipes/translate.pipe';
export * from './lib/translate.initializer';
```

**Exports include:** `TranslateService`, `TranslatePipe`, `translateInitializerProvider` (APP_INITIALIZER factory), `TranslationKey`, `TranslationObject`.

### 1.3 `libs/falcon/src/shared-ui/index.ts`

The single largest re-export surface. **361 lines**. Re-exports:

- Legacy bespoke Angular components: `FalconCalendarComponent` (façade), `FalconMobileNumberComponent`, `FalconFormFieldComponent`, `FalconPhotoUploaderComponent`, `FalconStepperComponent` + `FalconStepDirective` + `FalconStepperFooterDirective`, `SendCredentialsPopupComponent`, `FalconMultiSelectComponent` (legacy), `FalconTreePanelComponent`.
- Directives: `* from './lib/directives'` (form-validate, effective-date, etc.).
- UI icons: `* from './lib/ui/falcon-icon'`, `* from './lib/ui/icon'`, `FALCON_ICONS`, `FalconIcon`, `* from './lib/ui/svg-icon'`.
- Stencil-wrapper RE-EXPORTS from `@falcon/ui-core/angular`:
  - `FalconAngularInputComponent`, `FalconAngularPasswordComponent`, `FalconAngularButtonComponent`, `FalconAngularDropdownComponent`, `FalconAngularCheckboxComponent`, `FalconAngularCheckboxGroupComponent`, `FalconAngularRadioComponent`, `FalconAngularRadioGroupComponent`, `FalconAngularMultiSelectComponent`, `FalconAngularSwitchComponent`, `FalconAngularTextareaComponent`, `FalconAngularTabsComponent`, `FalconAngularTreeTableComponent`, `FalconAngularStepperComponent`, `FalconAngularUploaderComponent`, `FalconAngularSingleUploaderComponent`, `FalconAngularTreeComponent`, `FalconAngularTooltipComponent`, `FalconAngularAccordionComponent`, `FalconAngularPaginatorComponent`, `FalconAngularPopupComponent`, `FalconAngularDialogComponent`, `FalconAngularTableComponent`, `FalconAngularCalendarComponent`, `FalconAngularDatePickerComponent`, `FalconAngularOtpComponent`, `FalconAngularPhoneFieldComponent`, `FalconAngularEmailFieldComponent`, `FalconAngularOtpSendDialogComponent`, `FalconAngularNotificationComponent`, `FalconAngularToastComponent`, `FalconAngularToastHostComponent`, `FalconMessageService`, `FalconAngularMessageHostComponent`, `FalconAngularTagComponent`, `FalconAngularConfirmDialogComponent`.

Plus types: `FalconDropdownOption`, `FalconCheckboxGroupOption`, `FalconRadioGroupOption`, `FalconMultiSelectOption`, `FalconTabOption`, `FalconTreeNode`, `FalconStepperStep`, `FalconUploaderFile`, `FalconSingleUploaderFile`, `FalconTreeRowNode`, `FalconTooltipPlacement`, `FalconAccordionItem`, `FalconPaginatorSize`, `FalconPaginatorChangeDetail`, `FalconPaginatorItem`, `FalconPopupVariant`, `FalconDialogSize`, `FalconTableColumn`, `FalconCalendarSize`, `FalconOtpSendChannel`, `FalconNotificationIntent`, `FalconToastSeverity`, `FalconToastHostPosition`, `FalconMessage`, `FalconTagSeverity`, `FalconTagSize`.

**Notable absences from the re-export list:** `FalconAngularAvatarComponent`, `FalconAngularBadgeComponent`, `FalconAngularStatusBadgeComponent`, `FalconAngularEmptyStateComponent`, `FalconAngularCardComponent`, `FalconAngularIconComponent`, `FalconAngularInputNumberComponent`, `FalconAngularDrawerComponent`, `FalconAngularSearchInputComponent`, `FalconAngularGridInputComponent`, `FalconAngularComboboxComponent`, `FalconAngularFilterPanelComponent`, `FalconAngularMenuComponent`, `FalconAngularWizardComponent`, `FalconAngularSelectComponent`. These are reachable only via `@falcon/ui-core/angular`.

### 1.4 `libs/falcon/src/shared-data-access/index.ts`

```ts
// libs/falcon/src/shared-data-access/index.ts
export * from './lib/services';
export * from './lib/runtime-config';
export * from './lib/interceptors';
export * from './lib/validators';
```

**Exports include:** `HttpService`, `provideShellEnvConfig`, `provideShellEnvFromWindow`, `provideAppDefaultGateway`, `exposeRuntimeConfigOnWindow`, `HTTP_BASE_URL`, `useGateway`, `RuntimeBaseUrlInterceptor`, Gateway base-URL types.

### 1.5 `libs/falcon/src/shared-types/index.ts`

```ts
// libs/falcon/src/shared-types/index.ts
export * from './lib/enums/globels';
export * from './lib/enums/otp.enums';
export * from './lib/enums/order-status.enums';
export * from './lib/models/globals';
export * from './lib/models/models';
export * from './lib/models/order-status.models';
export * from './lib/models/communication-channel.models';
export * from './lib/models/access-query.models';
export * from './lib/models/policy-subject.models';
export * from './lib/models/service-operation-result.model';
export * from './lib/constants/falcon-access.registry';
export * from './lib/constants/role-key.constants';
export * from './lib/constants/route-scope.constants';
export * from './lib/constants/user-type.constants';
export * from './lib/models/org-hierarchy.models';
export * from './lib/models/contact-group.models';
```

**Exports include:** `Gateway` enum, `UserType` enum + `USER_TYPE_STRINGS` constants, `PricingType`, `OtpChannel`, `OrderStatus`, `ServiceOperationResult<T>`, `AccessQuery`, `PolicySubject`, `FalconAccess` (access-query registry), `RoleKey`, `RouteScope`, multi-language `MultiLanguageName(En, Ar)`, org-hierarchy + contact-group models.

### 1.6 `libs/falcon/src/shared-utils/index.ts`

```ts
// libs/falcon/src/shared-utils/index.ts
export * from './lib/utils/ip-utils';
export * from './lib/utils/theme-utils';
export * from './lib/validators/falcon-validators';
export * from './lib/utils/contact-group.mapper';
```

**Exports include:** IP utilities, theme utilities, Falcon Validators (form validators), contact-group mappers.

---

## 2. `libs/falcon-ui-core/src/index.ts` — alias `@falcon/ui-core`

```ts
// libs/falcon-ui-core/src/index.ts
export * from './components';
export type {
  FalconInputType, FalconInputSize, FalconInputState, FalconInputVariant,
  FalconInputAppearance, FalconInputEventDetail,
} from './components/falcon-input/falcon-input.types';
export type {
  FalconTextareaSize, FalconTextareaState, FalconTextareaResize,
  FalconTextareaVariant, FalconTextareaAppearance, FalconTextareaEventDetail,
} from './components/falcon-textarea/falcon-textarea.types';
export type {
  FalconDropdownOption, FalconDropdownSize, FalconDropdownState,
  FalconDropdownVariant, FalconDropdownAppearance, FalconDropdownChangeDetail,
  FalconDropdownSearchDetail, FalconDropdownToggleDetail,
} from './components/falcon-dropdown/falcon-dropdown.types';
export type {
  FalconButtonVariant, FalconButtonSize, FalconButtonType, FalconButtonClickDetail,
} from './components/falcon-button/falcon-button.types';
export type { FalconSize, FalconDensity } from './types/common.types';
export type {
  FalconFieldState, FalconValidationOutcome, FalconFieldVariant, FalconFieldAppearance,
} from './types/form.types';
export type { FalconEventDetail } from './types/events.types';
export type { FalconLegacyTreeNode } from './types/tree.types';
export type { FalconDialogSize, FalconDialogPosition, FalconDialogSeverity, ... }
       from './components/falcon-dialog/falcon-dialog.types';
export type { FalconTableColumn, FalconTableColumnExt, FalconTableColumnAlign, ... }
       from './components/falcon-table/falcon-table.types';
export type { FalconCalendarSize, FalconCalendarViewMode, FalconCalendarFirstDayOfWeek, ... }
       from './components/falcon-calendar/falcon-calendar.types';
export type { ComboboxItem, FalconComboboxSize, FalconComboboxFilterDetail, FalconComboboxSelectDetail }
       from './components/falcon-combobox/falcon-combobox.types';
export type { FilterDefinition, FilterValues, SelectOption, FalconFilterPanelDensity, FalconFilterChangeDetail, FalconFilterApplyDetail, FilterFieldType }
       from './components/falcon-filter-panel/falcon-filter-panel.types';
export * from './tailwind/tailwind-classes';
```

**Recommended import:** `import type { FalconInputSize, FalconDropdownOption, ... } from '@falcon/ui-core';` for Stencil tag types. For Tailwind helpers and Stencil components definitions: `from '@falcon/ui-core'` works but Angular consumers should prefer `@falcon/ui-core/angular`.

---

## 3. `libs/falcon-ui-core/src/angular-wrapper/index.ts` — alias `@falcon/ui-core/angular`

The single most-important Angular barrel. **63 lines** — re-exports every component folder:

```ts
// libs/falcon-ui-core/src/angular-wrapper/index.ts
export * from './components/falcon-input';
export * from './components/falcon-input-number';
export * from './components/falcon-password';
export * from './components/falcon-dropdown';
export * from './components/falcon-select';
export * from './components/falcon-checkbox';
export * from './components/falcon-checkbox-group';
export * from './components/falcon-radio';
export * from './components/falcon-radio-group';
export * from './components/falcon-multi-select';
export * from './components/falcon-switch';
export * from './components/falcon-textarea';
export * from './components/falcon-button';
export * from './components/falcon-card';
export * from './components/falcon-tabs';
export * from './components/falcon-tree-table';
export * from './components/falcon-stepper';
export * from './components/falcon-uploader';
export * from './components/falcon-single-uploader';
export * from './components/falcon-tree';
export * from './components/falcon-tooltip';
export * from './components/falcon-menu';
export * from './components/falcon-accordion';
export * from './components/falcon-paginator';
export * from './components/falcon-toast';
export * from './components/falcon-message-service';
export * from './components/falcon-dialog';
export * from './components/falcon-confirm-dialog';
export * from './components/falcon-table';
export * from './components/falcon-data-table';
export * from './components/falcon-tag';
export * from './components/falcon-status-badge';
export * from './components/falcon-icon';
export * from './components/falcon-empty-state';
export * from './components/falcon-badge';
export * from './components/falcon-avatar';
export * from './components/falcon-wizard';
export * from './components/falcon-calendar';
export * from './components/falcon-date-picker';
export * from './components/falcon-otp';
export * from './components/falcon-phone-field';
export * from './components/falcon-email-field';
export * from './components/falcon-otp-send-dialog';
export * from './components/falcon-drawer';
export * from './components/falcon-search-input';
export * from './components/falcon-grid-input';
export * from './components/falcon-combobox';
export * from './components/falcon-filter-panel';
export * from './components/falcon-notification';
export * from './components/falcon-popup';
export * from './utilities';

export type { FalconLegacyTreeNode } from '../types/tree.types';
export type {
  FalconOrgHierarchyAction, FalconOrgHierarchyActionDetail, FalconOrgHierarchyNode,
  FalconOrgHierarchySelectDetail, FalconOrgHierarchyToggleDetail,
} from '../components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree.types';
```

49 component folders re-exported × each component's own `index.ts` (component class + types + utility helpers).

**Recommended import for Angular consumers:** `import { FalconAngularInputComponent, FalconDropdownOption } from '@falcon/ui-core/angular';`.

Per-component direct path: `import { FalconAngularInputComponent } from '@falcon/ui-core/angular/falcon-input';` is the tsconfig alias mapped via `@falcon/ui-core/angular/*` → `libs/falcon-ui-core/src/angular-wrapper/components/*/index.ts`. Faster Nx graph + smaller barrel re-export in IDE.

---

## 4. `libs/falcon-ui-tokens/src/index.css` — alias `@falcon/ui-tokens/*`

NOT a TS barrel — pure CSS. Imports 6 layers + 46 component files:

```css
/* libs/falcon-ui-tokens/src/index.css */
@import './primitives/colors.css';
@import './primitives/spacing.css';
@import './primitives/radius.css';
@import './primitives/shadow.css';
@import './primitives/typography.css';
@import './primitives/motion.css';

@import './semantic/semantic.css';

@import './themes/light.css';
@import './themes/dark.css';

@import './density/comfortable.css';
@import './density/compact.css';

@import './rtl/rtl.css';

@import './components/input.tokens.css';
@import './components/button.tokens.css';
@import './components/dropdown.tokens.css';
@import './components/checkbox.tokens.css';
@import './components/radio.tokens.css';
@import './components/multi-select.tokens.css';
@import './components/switch.tokens.css';
@import './components/textarea.tokens.css';
@import './components/tabs.tokens.css';
@import './components/tree-table.tokens.css';
@import './components/tree.tokens.css';
@import './components/stepper.tokens.css';
@import './components/uploader.tokens.css';
@import './components/single-uploader.tokens.css';
@import './components/tooltip.tokens.css';
@import './components/menu.tokens.css';
@import './components/accordion.tokens.css';
@import './components/paginator.tokens.css';
@import './components/toast.tokens.css';
@import './components/dialog.tokens.css';
@import './components/table.tokens.css';
@import './components/calendar.tokens.css';
@import './components/otp.tokens.css';
@import './components/phone-field.tokens.css';
@import './components/email-field.tokens.css';
@import './components/otp-send-dialog.tokens.css';
@import './components/drawer.tokens.css';
@import './components/data-table.tokens.css';
@import './components/organization-hierarchy.tokens.css';
@import './components/status-badge.tokens.css';
@import './components/icon.tokens.css';
@import './components/empty-state.tokens.css';
@import './components/badge.tokens.css';
@import './components/avatar.tokens.css';
@import './components/wizard.tokens.css';
@import './components/search-input.tokens.css';
@import './components/grid-input.tokens.css';
@import './components/combobox.tokens.css';
@import './components/filter-panel.tokens.css';
@import './components/card.tokens.css';
@import './components/checkbox-group.tokens.css';
@import './components/confirm-dialog.tokens.css';
@import './components/input-number.tokens.css';
@import './components/password.tokens.css';
@import './components/radio-group.tokens.css';
@import './components/tag.tokens.css';
```

**Recommended import:** apps consume this via their `tailwind.css` `@import "../../../libs/falcon-ui-tokens/src/index.css"`. The TS alias `@falcon/ui-tokens/*` lets specific files be imported individually if needed.

Each `<component>.tokens.css` declares under `:where(falcon-<name>, .falcon-<name>, [data-falcon-<name>]) { ... }` (enforced by `gate-12-component-token-scope.mjs`).

---

## 5. `libs/falcon-theme/src/index.css` — alias `@falcon/theme`

```css
/* libs/falcon-theme/src/index.css */
@import "./falcon-tailwind-tokens.css";
@import "./styles/falcon-icons.css";
```

The Tailwind v4 `@theme` SSOT file is at `libs/falcon-theme/src/falcon-tailwind-tokens.css` (~486 lines, ~264 tokens). The icon font is at `libs/falcon-theme/src/styles/falcon-icons.css` + `assets/fonts/`.

Mirror TS file at `libs/falcon-theme/src/tokens.ts` exposes ~216 tokens (auto-generated, do NOT edit by hand). Regenerate with `nx run falcon-theme:generate-tokens-ts`.

**Recommended import:**
- CSS: `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` in each app's `tailwind.css`.
- TS: `import { tokens, colors, spacing, radii, shadows, typography, breakpoints, motion, zIndex, sizing } from '@falcon/theme/tokens';`.
- Whole barrel: `@import "@falcon/theme/index.css"` (tokens + icons in one).

---

## 6. `libs/sdk/src/index.ts` — alias `@falcon/sdk`

```ts
// libs/sdk/src/index.ts
export * from './types/falcon-facades.interfaces';
export * from './tokens/falcon-facades.tokens';
export * from './facades/provide-falcon-facades';
export * from './facades/HierarchyFacade';
export * from './window-sdk/falcon-window-sdk.types';
```

**Exports include:** `FalconAuthFacade`, `FalconThemeFacade`, `FalconLanguageFacade`, `FalconNotifierFacade`, `FalconContextFacade`, `FALCON_AUTH` / `FALCON_THEME` / `FALCON_LANGUAGE` / `FALCON_NOTIFIER` / `FALCON_CONTEXT` `InjectionToken`s, `provideFalconFacades({ auth, theme, language, notifier, context })`, `HierarchyFacade`, `NodeDossier`, `FalconContext`, `FalconTheme`, window-SDK types.

**Recommended import:** `import { FALCON_AUTH, FalconAuthFacade, provideFalconFacades } from '@falcon/sdk';`.

---

## 7. `libs/falcon-ui-showcase-data/src/index.ts` — alias `@falcon/ui-showcase-data`

```ts
// libs/falcon-ui-showcase-data/src/index.ts
import registryJson from './registry.json';

export type ComponentCategoryId =
  | 'actions' | 'forms' | 'layout' | 'disclosure' | 'feedback' | 'data' | 'stats';

export interface ComponentCategory { id: ComponentCategoryId; label: string; }
export interface ComponentEntry {
  slug: string; name: string; tag: string; tagTw: string | null;
  category: ComponentCategoryId; doc: string;
}
export interface ShowcaseRegistry {
  version: string; generatedAt: string;
  categories: ComponentCategory[]; components: ComponentEntry[];
}

export const registry: ShowcaseRegistry = registryJson as ShowcaseRegistry;
export const components: ComponentEntry[] = registry.components;
export const categories: ComponentCategory[] = registry.categories;
export const componentsByCategory: Record<ComponentCategoryId, ComponentEntry[]> = ...
export function getComponent(slug: string): ComponentEntry | undefined;
export function getCategoryLabel(id: ComponentCategoryId): string;
```

The registry currently has **28 component entries** across 7 categories — actions (Button), forms (14), layout (Card, Tabs, Stepper), disclosure (Accordion, Dialog), feedback (Toast, Tooltip, OTP-Send-Dialog), data (Table, Tree, Tree-Table, Paginator), stats (Stat Card).

**Recommended import:** `import { registry, components, getComponent, type ComponentEntry } from '@falcon/ui-showcase-data';`. Individual docs are reachable via `@falcon/ui-showcase-data/docs/*` (md raw imports for the cross-framework demo apps).

---

## Summary of canonical import paths per family

| Symbol family | Recommended import |
|---|---|
| Falcon session / guards / route access | `@falcon` |
| Translate service / pipe / initializer | `@falcon` |
| HTTP base URL / interceptors / gateway selection | `@falcon` |
| Shared types (Gateway, UserType, PricingType, ServiceOperationResult, AccessQuery, ...) | `@falcon` |
| Validators / utilities | `@falcon` |
| Falcon Angular form-control wrappers (Input, Dropdown, Textarea, ...) | `@falcon/ui-core/angular` |
| Falcon Angular layout/feedback wrappers (Tabs, Accordion, Drawer, Card, Badge, Avatar, EmptyState, Icon, Menu, Wizard, Combobox, Filter Panel, Search Input, Grid Input, Input Number, Select) | `@falcon/ui-core/angular` (NOT re-exported from `@falcon`) |
| Stencil tag types (FalconInputSize, FalconDropdownOption, etc.) | `@falcon/ui-core` OR `@falcon/ui-core/angular` (both re-export type set) |
| Tailwind helper functions for cross-framework Light DOM | `@falcon/ui-core/tailwind` |
| Stencil custom-element loader | `@falcon/ui-core/loader` (`defineFalconComponent`) |
| Legacy bespoke Angular components (`falcon-calendar` façade, `falcon-stepper` PrimeNG wrap, `falcon-form-field`, `falcon-photo-uploader`, `falcon-tree-panel`, `falcon-mobile-number`, `falcon-multiselect`, `send-credentials-popup`) | `@falcon` (re-export from `shared-ui/index.ts`) |
| Cross-shell facades + tokens (`FALCON_AUTH`, `provideFalconFacades`) | `@falcon/sdk` |
| Falcon theme CSS + token TS mirror | `@falcon/theme`, `@falcon/theme/tokens` |
| Component-scoped token CSS files | `@falcon/ui-tokens/*` |
| Showcase registry | `@falcon/ui-showcase-data` |
