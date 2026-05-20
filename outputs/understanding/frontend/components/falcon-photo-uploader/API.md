# falcon-photo-uploader (LEGACY) — API

## Selector
- `<falcon-photo-uploader>` — Angular bespoke standalone component.

## Import path
```ts
import { FalconPhotoUploaderComponent } from '@falcon';
```
Resolves via `@falcon` barrel → `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/index.ts`.

## Inputs (signal-based via `input()`)

| Name | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `photo` | `model<string>` | data URL string | `''` | Two-way `[(photo)]`. Empty = no photo. |
| `labelKey` | `input<string>` | translation key | `'hierarchy.addClient.clientPicture'` | Translated via `TranslatePipe`. |
| `subLabelKey` | `input<string>` | translation key | `'hierarchy.addClient.photoHint'` | Translated. |
| `dragHintKey` | `input<string>` | translation key | `'hierarchy.addClient.dragHint'` | Translated. |
| `uploadBtnKey` | `input<string>` | translation key | `'hierarchy.addClient.uploadPhoto'` | Translated. |
| `accept` | `input<string>` | comma-separated MIME types | `'image/png,image/jpeg'` | Native `<input accept>`. |
| `maxBytes` | `input<number>` | bytes | `1 * 1024 * 1024` (1 MiB, since Wave 6.2 2026-05-20 — was 2 MiB) | Component-enforced. Oversize files now trigger the inline red-border error state (`oversizeError` signal) instead of being silently dropped. |
| `oversizeMessageKey` | `input<string>` | translation key | `'hierarchy.addClient.photoTooLarge'` | i18n key for the inline oversize-error line. Translated with `{maxMb}` param (derived from `maxBytes`). Add-User wizard consumers override to `'hierarchy.addUser.photoTooLarge'`. |

## Outputs

| Name | Payload | Description |
|---|---|---|
| `fileSelected` | `File` | Emitted with the raw `File` object after the data URL is decoded into `photo`. |

## Internal state
- `dragOver: signal<boolean>` — drives drag-over teal-tint state in `containerClasses`.
- `oversizeError: signal<boolean>` — Wave 6.2 (2026-05-20). Drives the red dashed-border state + replaces the drag-hint line with a red warning. Set by `flagOversize()`, cleared by `clearOversize()` (valid pick / Upload Photo click / × click) or by the 6 s auto-clear timer.
- `oversizeTimeout: ReturnType<typeof setTimeout> | null` — Wave 6.2. Tracks the auto-clear timer so re-flagging restarts the countdown.
- `hasPhoto: computed<boolean>` — `!!photo()`.
- `maxMb: computed<number>` — Wave 6.2. `Math.max(1, Math.round(maxBytes() / (1024 * 1024)))`. Bound into the `photoTooLarge` translation as the `{maxMb}` placeholder so the i18n string stays in sync with the input.
- `containerClasses: computed<string>` — Tailwind chrome resolver. Branch order: view-mode → oversize-error → drag-over → idle.
- `nativeInput: viewChild<ElementRef<HTMLInputElement>>('nativeInput')` — programmatic click target.

## Internal methods
- `onPickClicked()` — opens the picker.
- `onClearClicked()` — sets `photo` to `''`.
- `onFileChange(evt)` — handles native input change.
- `onDragOver(evt)`, `onDragLeave()`, `onDrop(evt)` — drag/drop handlers.
- `consume(file)` — reads the file as a data URL via `FileReader`, sets `photo`, emits `fileSelected`. Silently rejects files larger than `maxBytes`.

## CVA / Forms support
- **None.** `photo` is exposed as `model<string>` but does NOT implement `ControlValueAccessor`.

## Slots / ng-template inputs
- _None._ Fully self-contained.

## Supported sizes / modes / variants
- _None._ Single visual (circular avatar with drag-hint banner).

## Lazy / server mode
- _None._

## Important constraints
- The `photo` value is a DATA URL (base64-encoded). Consumers must NOT pass an http URL via `[photo]` — the component does not handle remote URL preview.
- ~~File size limit is silent~~ — Wave 6.2 (2026-05-20). Exceeding `maxBytes` now shows an inline red-border error inside the uploader card (no toast, no popup outside). File is still dropped — no `fileSelected` / `pictureChange` emitted on rejection so host form-state stays clean.
- No mime-type validation beyond the native input's `accept` attribute hint.
- The component uses `<falcon-photo-uploader>` as the selector — ESLint disabled because Angular default is `app-*` prefix.

## Accessibility
- The hidden native input has no `aria-label`.
- The upload button (likely visible in template) carries the `uploadBtnKey` translated label.
- The avatar circle with the fallback icon has no role; AT may treat it as decorative.
- _Gap_: no explicit role / aria-label on the drop target.
