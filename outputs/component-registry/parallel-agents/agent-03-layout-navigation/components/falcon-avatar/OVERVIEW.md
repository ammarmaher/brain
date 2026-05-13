# falcon-avatar — OVERVIEW

## Component purpose
User avatar with **3-step fallback chain**: image (`src`) → initials (`initials`) → icon (`iconName`). Token-driven sizing (5 sizes — xs/sm/md/lg/xl), 2 shapes (circle / square), optional status indicator (online / offline / busy / away) dot at bottom-right.

## Business / UI use case
- User profile avatars in headers, comment lists, member rows.
- Account / team logos with letter fallback.
- Activity feeds.
- Org-hierarchy node imagery.

## When to use it
- Whenever a user / account / team identity needs visual representation.
- When the image MAY fail or be missing — graceful fallback chain.
- When a status indicator (online/offline) is part of the user model.

## When NOT to use it
- For purely decorative imagery — use `<img>`.
- For brand logos in nav bars — use a dedicated brand asset.
- For icon-only contexts — use `<falcon-angular-icon>` (avatar adds unnecessary geometry).
- For multi-user avatar groups with overflow — NOT YET SUPPORTED (per registry "No multi-avatar group / fallback chain" gap).

## Active / preferred / deprecated / legacy status
**ACTIVE.** Wave 9.E. Architect §5.12.1 foundation.

## Replaces
- PrimeNG `<p-avatar>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/falcon-avatar.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/falcon-avatar.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-avatar-tw/falcon-avatar-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/avatar.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-avatar>`
- Stencil Shadow: `<falcon-avatar>`
- Stencil Light: `<falcon-avatar-tw>`

## Known consumers
**Zero matches in `apps/`.** Component exported but not yet adopted in production templates. Org-hierarchy node imagery uses raw `<img>` patterns currently.

## Related components
- `falcon-angular-icon` — composed via `iconName` fallback when no src/initials.
- `falcon-angular-status-badge` — alternative for non-avatar status pills.

## Ownership / responsibility
Owned by Falcon UI Core. Production-ready primitive, awaiting consumer adoption.
