# falcon-angular-single-uploader — API

## Selectors
- **Angular wrapper:** `<falcon-angular-single-uploader>`
- **Shadow tag:** `<falcon-single-uploader>`
- **Light tag:** `<falcon-single-uploader-tw>`

## Import path
```ts
import { FalconAngularSingleUploaderComponent } from '@falcon/ui-core/angular';
import type {
  FalconSingleUploaderFile,
  FalconSingleUploaderPreviewMode,
  FalconSingleUploaderSize,
  FalconSingleUploaderFileStatus,
  FalconSingleUploaderChangeDetail,
  FalconSingleUploaderUploadDetail,
  FalconSingleUploaderDeleteDetail,
  FalconSingleUploaderEditDetail,
  FalconSingleUploaderErrorDetail,
  FalconSingleUploaderBlurDetail,
} from '@falcon/ui-core/angular';
```

## TypeScript types
```ts
// libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.types.ts
export type FalconSingleUploaderFileStatus = 'queued' | 'uploading' | 'success' | 'error';
export type FalconSingleUploaderPreviewMode = 'thumbnail' | 'icon-only' | 'compact';
export type FalconSingleUploaderSize = 'sm' | 'md' | 'lg';

export interface FalconSingleUploaderFile {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly url?: string;
  readonly status?: FalconSingleUploaderFileStatus;
  readonly progress?: number;
  readonly errorMessage?: string;
}
```

## @Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` / CVA | `FalconSingleUploaderFile \| null` | `null` | Two-way via `[(ngModel)]` / `formControlName`. |
| `accept` | `string?` | — | Native `<input accept>`. |
| `maxSize` | `number?` | — | Browser hint; full validation is consumer's. |
| `required` | `boolean` | `false` | — |
| `helperText` | `string?` | — | Below the tile when no error. |
| `errorMessage` | `string?` | — | Renders as `<p role="alert">`. |
| `label` | `string?` | — | Above the tile (with `*` if required). |
| `placeholder` | `string` | `'Click to browse or drop here'` | Empty-state text. |
| `placeholderHint` | `string?` | — | Smaller hint. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tile size. |
| `previewMode` | `'thumbnail' \| 'icon-only' \| 'compact'` | `'thumbnail'` | `thumbnail` shows the image; `icon-only` shows a doc icon even for images; `compact` adds a body row (name + size) next to the icon. |
| `ariaLabel` | `string?` | — | Fallback. |
| `disabled` | `boolean` | `false` | — |
| `useTailwind` | `boolean` | `true` | Light vs Shadow. |
| `rootClass` | `string` | `''` | Outer extension. |

## @Outputs

| Name | Payload | Description |
|---|---|---|
| `valueChange` | `FalconSingleUploaderFile \| null` | Emitted when the file changes (upload / delete). |
| `fileUpload` | `FalconSingleUploaderUploadDetail` | Emitted once when a fresh file is picked/dropped. |
| `fileDelete` | `FalconSingleUploaderDeleteDetail` | Emitted when × is clicked. |
| `fileEdit` | `FalconSingleUploaderEditDetail` | Emitted when the edit button is clicked (the native picker also re-opens). |
| `fileError` | `FalconSingleUploaderErrorDetail` | Not emitted from core today; consumer can emit manually. |

## Reflected props
- Shadow Stencil reflects: `disabled`, `required`, `size`, `preview-mode` (attribute name kebab-cased).

## Stencil `@Method`s
- `openFileDialog(): Promise<void>` — opens the picker.
- `setFocus(): Promise<void>` — focuses the native input.
- `setFile(next): Promise<void>` — replaces the file.

## CVA / Forms support
- `NG_VALUE_ACCESSOR` provided. `writeValue` writes to the internal `file` signal.

## Slots
- _None observed in active source._ The Stencil component does NOT expose named slots.

## Supported modes / variants
- **size:** 3 options.
- **previewMode:** 3 options.
- **render path:** Shadow / Light via `useTailwind`.

## Lazy / server mode
- _None observed._

## Important constraints
- Drag-and-drop in filled state REPLACES the current file (no merge).
- Edit button reopens the native picker AND emits `falcon-edit` — consumer can choose to open a custom replace flow before the picker by listening + calling `event.preventDefault()` (not currently supported — see GAPS).
- **PrimeIcons residual:** `falcon-single-uploader.tsx:235` (cloud-upload) and `:313` (pi pi-pencil) — same gap as the multi-uploader.
- Inline width on progress fill — documented escape hatch.

## Accessibility
- Empty state dropzone: `role="button"`, `tabindex={disabled ? -1 : 0}`, `aria-label`, `aria-disabled`, `aria-invalid`.
- Filled tile: no explicit role; the action buttons (`delete`, `edit`) carry their own `aria-label`.
- Progress bar: `role="progressbar"`, `aria-valuemin/max/now`.
- The native `<input type="file">` is visually hidden but focusable.
