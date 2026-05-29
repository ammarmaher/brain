# falcon-photo-uploader — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-photo-uploader>` as the component to use (or, for new code, its migration target), and how to compose it to parity.

## Visual fingerprint
`[CODE]` A **circular avatar bubble** on the leading edge — shows the picture when present, a fallback icon when empty (`hasPhoto` computed, `:126`). Beside / under it a **label + sub-label** (translated, or raw text via `labelText` / `subLabelText`). In edit mode the whole block is a **dashed-border card** (`CONTAINER_EDIT_IDLE`, `:63-65`) with a faint-teal hover/drag-over tint (`CONTAINER_EDIT_DRAG`, `:67-68`), a **drag-hint banner**, an **Upload button**, and a small **× clear overlay** on the avatar. In `viewMode` (`:60-61` `CONTAINER_VIEW_MODE`) all card chrome is dropped — just the bare circular image at the same size. Mobile: the block stacks (`flex-col` → `sm:flex-row`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Avatar>` + a hidden `<input type=file>` + drag handlers | MUI has no first-class avatar-uploader; this is a composed pattern |
| PrimeNG | `<p-fileUpload mode="basic">` styled round + `<p-avatar>` | PrimeNG FileUpload is square/list-oriented; the circular crop is custom |
| Ant Design | `<Upload listType="picture-circle">` | closest direct match — Ant's circular picture-card upload |
| Bootstrap | `.rounded-circle` `<img>` + custom file input | fully hand-rolled |
| shadcn / Radix | `<Avatar>` + a dropzone (react-dropzone) | shadcn ships Avatar only; dropzone is a separate dep |
| plain HTML | `<input type="file" accept="image/*">` + `<img>` | always replace with the Falcon component |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a **circular** avatar with drag + replace + clear | `<falcon-photo-uploader>` (legacy — for existing wizards) | — |
| a **square** image tile with preview | `<falcon-angular-single-uploader previewMode="thumbnail">` | photo-uploader |
| a NEW circular avatar slot (new page) | `<falcon-angular-single-uploader>` + `--falcon-single-uploader-tile-radius: 50%` | photo-uploader (do not grow the legacy footprint) |
| multiple file thumbnails / a gallery | `<falcon-angular-multi-uploader>` (if it exists) or single-uploader list mode | photo-uploader |
| a document / non-image upload | a generic file uploader | photo-uploader (image-only by intent) |
| a read-only saved avatar with no upload UI | `<falcon-photo-uploader [viewMode]="true">` or `<falcon-angular-avatar>` | edit-mode uploader |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[(photo)]` (data URL two-way), `labelKey` / `subLabelKey` / `dragHintKey` / `uploadBtnKey` (i18n keys) OR `labelText` / `subLabelText` (raw overrides), `accept`, `maxBytes`, `viewMode`.
2. **Outputs** — bind `(pictureChange)` for the `{extension, fileBase64String}` payload (the wire-builder path); `(fileSelected)` for the raw `File` (legacy).
3. **Templates / slots** — NONE. The component is fully self-contained — there is no projection surface.
4. **Variants** — only `viewMode` (read-only) vs default (edit). No size / density variants.
5. **Token override** — NONE possible — the component has no token file (`TOKENS.md`). Visuals are inline Tailwind utilities only.
6. **Shared upgrade** — for any NEW design that needs a circular uploader, do NOT extend this component — use `<falcon-angular-single-uploader>` with `--falcon-single-uploader-tile-radius: 50%` (the documented stopgap in `USAGE.md`).
7. **GAP** — a true Falcon-UI-core `<falcon-angular-avatar-uploader>` (circular + drag-hint banner + label composition + remote-URL preview + visible size error) does not yet exist — raise it, do not hand-roll.

## Anti-patterns
- Passing an **http URL** to `[photo]` — it expects a data URL; the preview will be blank.
- Adding **new consumers** of `<falcon-photo-uploader>` — `DECISION.md` rule: the legacy footprint must not grow.
- Expecting a **"file too large" message** — oversized files are silently dropped (`:190`); if the design needs the error, that is the single-uploader migration target.
- Using it for **document / non-image** upload — it is image-only by design.
- Binding `[viewMode]` as a *styling* hack to remove the dashed border — `viewMode` is the read-only authority state, not a cosmetic flag.
- Re-stripping the `data:` prefix off `pictureChange.fileBase64String` — it is already stripped (`:6-9`).
