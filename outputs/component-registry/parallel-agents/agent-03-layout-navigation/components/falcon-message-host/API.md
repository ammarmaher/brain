# falcon-message-host — API

## Angular selector
`falcon-angular-message-host`

## Stencil tags
None.

## Import path
```ts
import {
  FalconAngularMessageHostComponent,
  FalconMessageService,
  type FalconMessage,
} from '@falcon/ui-core/angular';
```

## Inputs — `<falcon-angular-message-host>`

| Name | Type | Default | Notes |
|---|---|---|---|
| `position` | `FalconToastHostPosition` | `'top-right'` | One of 6 positions for the underlying toast-host. |
| `useTailwind` | `boolean` | `true` | Render-path switch (forwarded to inner toast + toast-host). |

## Outputs
**None** on the host. Each rendered `<falcon-angular-toast>` emits its own `falconDismiss` which the host handles internally via `service.remove(id)`.

## FalconMessageService API

```ts
@Injectable({ providedIn: 'root' })
export class FalconMessageService {
  readonly messages$: Observable<FalconMessage[]>;
  
  /*** PrimeNG-compatible add (single or array) ***/
  add(message: FalconMessage | FalconMessage[]): void;
  
  /*** PrimeNG-compatible alias ***/
  addAll(messages: FalconMessage[]): void;
  
  /*** Remove a single message by id ***/
  remove(id: string): void;
  
  /*** PrimeNG-compatible clear-all ***/
  clear(): void;
}

export interface FalconMessage {
  id?: string;                                   // auto-generated if omitted
  severity?: FalconToastSeverity | 'warn';       // 'warn' alias mapped to 'warning'
  summary?: string;                              // toast title
  detail?: string;                               // toast message body
  life?: number;                                 // ms — toast duration (default 5000)
  closable?: boolean;                            // show × button (default true)
  icon?: string;                                 // optional icon class
}
```

## TypeScript types
See `FalconMessage` above. Imports also re-export `FalconToastSeverity` from `falcon-toast.types.ts`.

## Internal behavior

The host:
1. Injects `FalconMessageService`.
2. Subscribes to `service.messages$` in `ngOnInit` (uses `takeUntilDestroyed(destroyRef)` to clean up).
3. Updates internal `signal<FalconMessage[]>([])`.
4. Renders one `<falcon-angular-toast>` per active message inside `<falcon-angular-toast-host>`.
5. Wires each toast's `(falconDismiss)` to `service.remove(msg.id)`.
6. Maps `severity: 'warn'` to `'warning'` for toast compatibility (line 10 of template).

## CVA support
N/A.

## Signal compatibility
- Uses `signal<FalconMessage[]>([])` internally.
- `takeUntilDestroyed(destroyRef)` cleanup pattern.
- Wrapped consumers can call `service.add()` from anywhere.

## Severity mapping (compatibility shim)
PrimeNG MessageService used `severity: 'warn'`. Falcon uses `'warning'`. The service shim maps `'warn'` → `'warning'` automatically (line 57 of `falcon-message-service.ts`).

Default severity when not specified: `'info'`.

## Important constraints
- **Service is `providedIn: 'root'`** — singleton across the app.
- **Subscription cleanup uses `takeUntilDestroyed(destroyRef)`** — required because `messages$.subscribe()` happens in `ngOnInit` (outside DI context, so explicit `DestroyRef` is mandatory; without it Angular throws NG0203).
- **Message IDs are auto-stamped** if not provided. Pattern: `falcon-msg-<N>` (incrementing).
- **Adding a message array** appends all to the stream simultaneously.

## Accessibility attributes
Inherited from `<falcon-angular-toast>` (per-toast `role="alert"` / `role="status"` + `aria-live`).

## Parts
None — Angular template only.
