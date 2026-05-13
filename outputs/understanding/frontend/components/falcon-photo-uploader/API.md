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
| `maxBytes` | `input<number>` | bytes | `2 * 1024 * 1024` (2 MB) | Component-enforced: rejects oversized files silently. |

## Outputs

| Name | Payload | Description |
|---|---|---|
| `fileSelected` | `File` | Emitted with the raw `File` object after the data URL is decoded into `photo`. |

## Internal state
- `dragOver: signal<boolean>` — drives `@HostBinding('class.drag-over')`.
- `hasPhoto: computed<boolean>` — `!!photo()`.
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
- File size limit is silent — exceeding `maxBytes` causes the file to be silently dropped (no error message).
- No mime-type validation beyond the native input's `accept` attribute hint.
- The component uses `<falcon-photo-uploader>` as the selector — ESLint disabled because Angular default is `app-*` prefix.

## Accessibility
- The hidden native input has no `aria-label`.
- The upload button (likely visible in template) carries the `uploadBtnKey` translated label.
- The avatar circle with the fallback icon has no role; AT may treat it as decorative.
- _Gap_: no explicit role / aria-label on the drop target.
