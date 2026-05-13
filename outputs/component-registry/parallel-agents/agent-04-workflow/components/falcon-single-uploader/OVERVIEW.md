# falcon-angular-single-uploader — OVERVIEW

## Purpose
Single-file uploader with two display states:
- **Empty:** dropzone with placeholder text + browse-on-click.
- **Filled:** square preview tile (image thumbnail OR generic doc icon) with two action overlays — top-right delete (danger) + bottom-right edit (secondary).

Native `<input type="file">` sits behind the visible UI. Drag/drop replaces the current file in filled state. Validation is explicitly DEFERRED — consumer drives `file.status` / `errorMessage` / `progress`.

## Business / UI use case
- Logo / single-image upload on forms.
- Single attachment slots (ID copy, signature, single signed PDF).
- Quick "browse and preview" experiences.

## When to use it / when NOT to use it
- USE for single-file flows where the user might WANT to replace the file (edit button).
- USE when the consumer wants a compact square preview tile.
- DO NOT use for multi-file flows → `<falcon-angular-uploader>`.
- DO NOT use for avatar/profile photo (circular preview) → `<falcon-photo-uploader>` (legacy bespoke until a Falcon UI core "avatar" lands).
- DO NOT use for bulk imports (CSV / Excel) → simple file picker.

## Status
- **ACTIVE / PREFERRED** for single-file flows.

## Selectors / Tags
- **Angular selector:** `falcon-angular-single-uploader`
- **Stencil Shadow tag:** `<falcon-single-uploader>` (default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-single-uploader-tw>` (default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.tsx` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-single-uploader-tw/falcon-single-uploader-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.utils.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/single-uploader.tokens.css` |

## Known consumers
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase.
- _No production consumer in admin-console or management-console_ — wizards use `<falcon-photo-uploader>` (legacy).

## Related components
- `<falcon-angular-uploader>` — multi-file sibling.
- `<falcon-photo-uploader>` (legacy) — circular avatar uploader.

## Ownership / Responsibility
- Falcon UI core.
- Validation deferred to consumer.
- Token contract: `single-uploader.tokens.css`.
