# falcon-photo-uploader (LEGACY) — OVERVIEW

## Purpose
Bespoke Angular standalone component for circular avatar / profile photo upload. Renders an avatar circle (image when present, fallback icon when empty) + drag-hint banner + upload button. Used by Add Client / Add User wizards on the FIRST step to capture the entity / user picture.

## Business / UI use case
- "Client Picture" on Add Client → Step 1 (Information).
- User profile photo on Add User → Step 1 (Personal).
- Anywhere a circular avatar with replace UX is needed.

## When to use it / when NOT to use it
- Currently the ONLY Falcon option for circular avatar upload — `<falcon-angular-single-uploader>` provides a square tile, not a circle.
- DO use this for the legacy wizard avatar slots until a Falcon UI core "avatar uploader" lands.
- DO NOT use this for new pages where a square preview is acceptable — use `<falcon-angular-single-uploader>` with `previewMode="thumbnail"` instead.

## Status
- **LEGACY-IN-USE (Wave 23).** Bespoke Angular component. No Stencil core.
- Marked as a candidate for promotion to a Falcon UI core "avatar uploader" (circular tile) variant. Until then, REFERENCE-ONLY for new code.

## Selectors / Tags
- **Selector:** `falcon-photo-uploader` (ESLint disabled due to selector violating `@angular-eslint/component-selector` — kept for the legacy public API).
- **No Stencil tag.**

## Source paths
| Layer | Path |
|---|---|
| Component class | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` |
| Template | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` |
| SCSS (legacy carry-over) | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.scss` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/index.ts` |

## Known consumers
Templates referencing `falcon-photo-uploader`:
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:3-9` (logo upload).
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` (owner photo).
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` (user avatar).
- Mirror folders inside `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/`.
- `apps/host-shell/src/app/playground/playground.page.html` — showcase.

## Related components
- `<falcon-angular-single-uploader>` — modern square-tile sibling (different visual — circular vs square).
- Future: a Falcon UI core "avatar uploader" variant that renders the same square component with a circular mask.

## Ownership / Responsibility
- Owned by `libs/falcon/src/shared-ui/` legacy.
- The component owns its bespoke `*.component.scss` — violates the "no SCSS" rule.
- Consumer drives the `photo` model (data URL) — the component generates a data URL via `FileReader.readAsDataURL` and emits the raw `File` via `fileSelected` Output.
