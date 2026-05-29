# falcon-status-badge — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None for the component itself — purely presentational.** The component owns no data; it renders a status the *host row* already carries. The status value, however, is domain data owned by a backend service:
- **Identity** — user lifecycle status (`active` / `pending` / `suspended` / `locked` / `deleted`). Identity owns the user lifecycle (per `C:\Falcon\CLAUDE.md` architecture rule: "Identity Service owns user lifecycle").
- **Commerce** — account / node status and service/application row status (`inactive` / `paid` / `expired` / `disabled` / `active`). Per `[MEMORY]` `commchannels_apps_tabs` plan, service status is the `eFalconServiceStatus` enum (`None=0,InActive=1,Active=2,Expired=3,Disabled=4`).

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (status arrives inside a list / detail response) | GET | Identity / Commerce | the row DTO's `status` field | System Gateway (Falcon) / Core Gateway (Client) | The badge issues **no request of its own**. The `severity` it renders is a field on the row payload the host already fetched. |
| Service rows — `GET commerce/Node/{nodeId}/applications` etc. | GET | Commerce | `AccountApplicationResponse.status` (`eFalconServiceStatus`) | System Gateway | `[MEMORY]` `commchannels_apps_tabs` — the wire enum is mapped to a `FalconStatusBadgeSeverity` string by the host adapter (`serviceRowsToApplicationRows` per `[MEMORY]` Wave 17). |

> The host adapter is responsible for translating a backend status **enum** (numeric / PascalCase) into the badge's lowercase string `severity`. The badge never sees the raw enum.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | A status badge is **not a form control** (`API.md:67` — no CVA) and **emits no events** (`API.md:29` — presentational). It runs and surfaces **no validation**. It only *displays* a value the backend already validated and committed. |
| `[CODE]` Type-level constraint | `severity` | a value outside the 9-member union | TS compile error; at runtime an off-vocabulary string falls back to the neutral bucket (`USAGE.md:52`). |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — (inherited) | — | The badge has no PES key. It is read-only display; it is rendered wherever the host row is rendered. PES gates the *actions* a status enables (e.g. enabling a `disabled` service), not the badge itself. |

## State / signal pattern
`[BRAIN-OUT]` The badge is a leaf render driven by the host row signal. Canonical pattern (`USAGE.md:3-13`): a `<falcon-angular-data-table>` is fed a `data()` signal of rows; a `<ng-template falconDataTableCell="status" let-value="value">` projects `<falcon-angular-status-badge [severity]="value" [label]="('status.' + value) | translate">`. The badge holds no state — when the row signal updates, the badge re-renders with the new severity.

`[CODE]` `falcon-status-badge.component.ts:45-67` Internally the wrapper holds `_severity` / `_label` signals fed by `@Input` setters with null-coercion (`severity` → `active`, `label` → `''`); `size` / `dot` / `useTailwind` are plain inputs; `ChangeDetectionStrategy.OnPush`.

## Skeleton ↔ app-wrapper layering
`[CODE]` `OVERVIEW.md:27-33` / `falcon-status-badge.component.ts`
- **Stencil skeleton** — `<falcon-status-badge>` (Shadow DOM) / `<falcon-status-badge-tw>` (Light DOM). Pure presentational; sets `aria-label` from the `ariaLabel` prop for dot-only mode (`API.md:21,73`); exposes a default slot that overrides `[label]`.
- **Angular wrapper** — `<falcon-angular-status-badge>`: dual render path (`useTailwind` default `true`, → `<falcon-status-badge-tw>`); `ngOnInit` calls `defineFalconTwComponent('falcon-status-badge')` (idempotent registration); `@HostBinding('class')` = `'falcon-angular-status-badge inline-flex align-middle'` — no `.component.css` file.
- `[CODE]` `falcon-status-badge.component.ts:23-34` / `GAPS_AND_UPGRADES.md:17` The wrapper **re-declares** `FalconStatusBadgeSeverity` instead of importing from `falcon-status-badge.types.ts` — FSB-04 flags this as a single-source-of-truth gap. Both declarations currently list the same 9 values (verified identical in `[CODE]`).

## Integration gotchas
- `[CODE]` `GAPS_AND_UPGRADES.md:7` / `OVERVIEW.md:37` **Adoption gap** — admin / management consoles historically hand-rolled status chips (`organization-hierarchy-menu.component.html:162-195`). Hand-rolled chips drift from the SSOT bucket map. FSB-01 (P1) is the refactor to compose the shared component everywhere.
- `[CODE]` `GAPS_AND_UPGRADES.md:29` **`ariaLabel` is Stencil-only** — the Angular wrapper does **not** expose it (FSB-03). A dot-only badge (`label=""`, `dot=true`) rendered via the wrapper is meaningless to a screen reader. Workaround: drop to `<falcon-status-badge-tw aria-label="…">`.
- `[CODE]` `API.md:60` / `GAPS_AND_UPGRADES.md:19-21` The wrapper **does** project `<ng-content>` (verified in `falcon-status-badge.component.html`) — a default slot overrides `[label]`. A consumer can put icon+text inside the badge when not using `[label]`.
- `[INFERRED]` The host adapter must map the backend status **enum** to the lowercase string `severity`; passing a raw `eFalconServiceStatus` numeric or PascalCase value silently falls back to the neutral bucket.
- `[CODE]` `TOKENS.md:43` **No dark-mode bucket override** in `status-badge.tokens.css` — palette tokens flip via the master `app-dark` block; status contrast should be re-verified on a dark canvas (P3).

## Verification
✅ VERIFIED — wrapper structure, render-path switch, and severity re-declaration confirmed against `[CODE]` `falcon-status-badge.component.ts`. Consumer pattern ✅ VERIFIED against `USAGE.md` (6 source files). Backend enum mapping is `[INFERRED]` from `[MEMORY]` `commchannels_apps_tabs` (the adapter plan is 🟡 PLANNED / Wave 17 partial). `ariaLabel` wrapper gap ✅ VERIFIED against `GAPS_AND_UPGRADES.md` FSB-03.
