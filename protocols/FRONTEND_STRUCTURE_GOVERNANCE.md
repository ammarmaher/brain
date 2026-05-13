# Frontend Architecture & Folder Structure Governance

## Main rule

Local by default. Promote when reused. Shared only when proven. Library only when stable.

## Models/DTOs

Use one consolidated model file per feature/page context, not one file per interface/class.

Examples:

```text
features/user/models/user.models.ts
features/user/pages/user-list/models/user-list.models.ts
features/user/pages/user-details/models/user-details.models.ts
```

Each file can contain related interfaces/classes/enums:

```ts
export interface UserDetails {}
export interface UserDetailsRequest {}
export interface UserDetailsResponse {}
export interface UserEdit {}
export interface UserListItem {}
```

Only split when the file becomes too large, crosses bounded contexts, or is promoted to shared contracts.

## Placement

| Item | Where |
|---|---|
| Page-local model | page `models/<page>.models.ts` |
| Feature-shared model | feature `models/<feature>.models.ts` |
| Cross-feature DTO/contract | shared contracts library |
| Feature API service | feature `services/<feature>.service.ts` |
| Reusable component | Falcon shared UI library |
| Reusable directive | shared directives/lib-directives |
| Feature-only component | feature `components/` |

## Before creating files

1. Check wiki rules.
2. Check existing project convention.
3. Check Nx boundaries.
4. Decide local/feature/module/shared placement.
5. Avoid random folders.
