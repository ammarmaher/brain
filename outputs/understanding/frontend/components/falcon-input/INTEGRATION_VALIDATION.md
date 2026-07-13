# falcon-input — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational** — it owns no data. The value it captures is persisted by whichever module owns the *flow*:
- **Commerce** — account name, finance ID, node name, Information-panel address lines (`commerce/information`, client/node create payloads).
- **Identity** — first name, last name, username (Add User flow; Identity owns user lifecycle).
- **None for search boxes** — the org-hierarchy filter input drives a client-side tree filter, no backend.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/information` | `PUT` | Commerce | `UpdateMainNodeInfoRequest` (Account Name + address fields) | System Gateway | `[MEMORY]` Wave 15 — Account Name field is Falcon-only-writable. |
| Add Client / Add Node create | `POST` | Commerce | wizard payload (camelCase wire) | System Gateway | Input value flows in via CVA into the wizard payload signal. |
| Add User create | `POST` | Identity | user-create payload (first/last name) | System Gateway | `[MEMORY]` payload strips `FALCON_ROOT_NODE.id → null`. |

> `[INFERRED]` The input element never calls these endpoints itself — the parent step's state slice does. The input only emits `falcon-input` / `falcon-change` → CVA → form value.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | Account Name, First Name, Last Name | submit / blur with empty value | field-level "required" → `errorMessage` + `[state]="'error'"` |
| Max-length boundary | Account Name | typing past `[maxlength]="100"` | none — keystroke silently blocked at the input (`[CODE]` client-information-step.html:21) |
| Format (email / url) | `type="email"`, `type="url"` fields | submit | only native HTML5 enforcement — `[CODE]` no component-level validator (GAP G9) |
| Cross-field | inherited from parent step | depends on flow | the input surfaces the parent's validation signal via `errorMessage` |

> `[CODE]` falcon-input.component.ts has **no built-in validator** — `hasError()` is purely `state === 'error' || !!errorMessage`. All real validation is Reactive Forms validators or backend, surfaced back into `errorMessage`.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits parent field's PES) | edit the field | parent step resolves PES and binds `[disabled]="true"` |
| `[MEMORY]` `FalconAccess.adminConsole.accountProfile.edit()` + `canEditFalconOnly` | edit Account Name / Finance ID in Information panel | input rendered `[disabled]` for non-Falcon sessions |

The input has no PES key of its own — it inherits the gate of the **field** it renders.

## State / signal pattern
`[CODE]` falcon-input.component.ts:
- Internal `value = signal<string>('')` and `disabled = signal<boolean>(false)`.
- `[disabled]` accepts a **property** binding via the `disabledFromInput` setter (Wave 7.7) — boolean OR string-truthy. CVA's `setDisabledState` writes the same signal.
- `writeValue` does a defensive `componentOnReady().then(push)` to re-push the value into the live Stencil element after hydration — fixes the cell-remount race inside `<falcon-angular-data-table>` ng-template cells during Add Client wizard step navigation (`[CODE]` lines 158-190).
- Error pipeline: validation errors surface as a string into `[errorMessage]`; the host app's HTTP error pipeline (`[MEMORY]` 400 → top-right toast) is orthogonal — it does not touch the input.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-input>` (Shadow, `shadow:true`) / `<falcon-input-tw>` (Light DOM, `shadow:false`). Pure presentational; emits `falcon-input` / `falcon-change` / `falcon-clear` / `falcon-blur` / `falcon-focus`.
- **Angular wrapper** — `<falcon-angular-input>`: implements `ControlValueAccessor`, registers the Stencil tags via `defineFalconTwComponent('falcon-input')` in `ngOnInit`, and toggles render path via `useTailwind`.
- Per `feedback_library_skeleton_app_api`, the wrapper never fetches data — the parent state slice does. The input is a dumb capture surface.

## Integration gotchas
- `[CODE]` **`[disabled]` must be a property binding** — `disabledFromInput` is a setter on `@Input('disabled')`. `[attr.disabled]` would bypass it. (Same trap as dropdown.)
- `[CODE]` **Cell-remount value race** — without the `componentOnReady` push in `writeValue`, an input inside a remounted data-table cell renders empty until the user types. The wrapper already guards this; do not strip the push.
- `[CODE]` **`falcon-focus` is NOT re-emitted by the Angular wrapper** — only `falcon-input`/`falcon-change`/`falcon-clear`/`falcon-blur` are bound (GAP G4). Need a focus signal → attach native `(focus)`.
- `[CODE]` **Tailwind path has no prefix/suffix slots** — `<falcon-input-tw>` does not render them (GAP G1). Switch to `useTailwind=false` if a leading icon is required.
- `[INFERRED]` **camelCase wire** — Account-name/address values ride camelCase JSON to Commerce per the platform-wide .NET 6+ default (`[MEMORY]` Wave 14/15).
- `[CODE]` **Never bind both `[value]` and `[(ngModel)]`** — `[value]` is a raw Stencil-prop passthrough that races CVA.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B01) — `disabledFromInput` setter (ts:124-127), `writeValue` `componentOnReady` push (ts:189-199), and the wrapper binding only input/change/clear/blur (G4) re-confirmed in live source. Backend wiring + PES gate ✅ cross-referenced from `[MEMORY]` Wave 14/15 (user-confirmed working). Endpoint DTO field names 🟡 CODE-DERIVED from memory entries, not re-read from backend source.
