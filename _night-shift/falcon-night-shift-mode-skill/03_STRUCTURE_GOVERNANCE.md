# 03 — Structure Governance

Every component/page/feature component/reusable Falcon component must follow predictable structure.

## Canonical Component Structure

Create these folders only when they contain real data:

```txt
component-name/
  component-name.component.ts
  component-name.component.html
  component-name.component.scss or .css only if already required
  models/
    component-name.models.ts
  validations/
    component-name.validations.ts
  signals/
    component-name.signals.ts
  services/
    component-name.service.ts
```

Never create empty folders.

## Models Rule

If the component uses any:

- interface
- DTO
- class
- type
- union type
- request model
- response model
- view model
- local enum
- frontend metadata dictionary
- dropdown option model
- table column model
- status metadata
- config model

Move it to:

```txt
models/component-name.models.ts
```

Use one consolidated model file per component/feature context.
Do not create one file per small interface.

## Enum / Union / Dictionary Rule

For frontend UI state, prefer string union + typed dictionary.

Example:

```ts
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

export const UserStatusMeta: Record<UserStatus, { label: string; badgeClass: string }> = {
  Active: {
    label: 'Active',
    badgeClass: 'bg-green-100 text-green-700',
  },
  Pending: {
    label: 'Pending',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  Suspended: {
    label: 'Suspended',
    badgeClass: 'bg-red-100 text-red-700',
  },
};
```

Use enum only when:

- backend sends numeric enum values,
- generated backend contract uses enum,
- shared DTO contract requires enum,
- numeric identity is required.

Never use enum only for labels, colors, icons, dropdown text, or UI metadata.

## Signals Rule

Move reusable/growing signal logic to:

```txt
signals/component-name.signals.ts
```

Move:

- signal state
- computed state
- cached state
- derived UI state
- selected item state
- loading state
- error state
- signal strategy
- dropdown cached state
- table state
- UI mode state

Small simple local signals may remain in the component only when they do not create noise.

## Validations Rule

Move validation logic to:

```txt
validations/component-name.validations.ts
```

Move:

- form validators
- validation messages
- validation rules
- duplicate-check logic
- frontend mirror of backend validation
- input constraints
- field error mapping
- validation metadata

Backend remains the source of truth.
Frontend validation is for UX only.

## Services Rule

Move component-scoped API/facade/data logic to:

```txt
services/component-name.service.ts
```

If reused by multiple features/apps, promote to shared service/contracts area.

## Helpers Rule

Do not create helper folders inside component folders by default.

Reusable helpers belong in shared libraries, such as:

```txt
libs/falcon/src/shared-utils/helpers/
libs/falcon/src/shared-ui/helpers/
```

Only keep tiny private helper functions inside a component when truly private and template-related.
