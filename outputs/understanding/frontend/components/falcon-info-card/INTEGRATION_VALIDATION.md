# falcon-info-card — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

`[CODE]` **None.** The component is purely presentational — it renders the `[fields]` array + projected cells the consumer hands it. It calls no endpoint and owns no data. The data it *displays* is owned by whichever module owns the entity being summarized:
- **Templates** — at both live sites, the data is a message Template (`[INFERRED]` the Templates feature's backend; templates list/details endpoints). The card receives an already-fetched `Template` mapped into `FalconInfoCardField[]` by the consumer (`infoFields(tpl)`, templates-details.component.ts:189).

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| _(none)_ | — | — | — | — | `[CODE]` The card never fetches. The parent (`templates-details` / wizard step) fetches the Template and builds `[fields]`. |
| Template details (upstream, consumer-side) | `GET` | Templates | template DTO → mapped to `FalconInfoCardField[]` | `[INFERRED]` System / Core Gateway | `[CODE]` `infoFields(tpl)` maps `tpl.name/id/language/channel/status/...` into label/value pairs (templates-details.component.ts:189-213). The card sees only the mapped strings. |

> `[CODE]` Per `feedback_library_skeleton_app_api`, the presentational component never fetches — the parent does. Confirmed: no `HttpService`/`inject()` of any data service in the component (ts only injects nothing — pure inputs).

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| _(none)_ | — | — | `[CODE]` No validation surface. The card is read-only display; it has no `errorMessage`/`state` axis and no editable inputs. |

> `[CODE]` falcon-info-card.component.ts has no validators. Any validation that produced the displayed values happened upstream (e.g. in the create-template wizard Steps 1-2, which Step 3 then reviews via this card).

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| _(none on the component)_ | view the card | The card itself has no PES gate and no `disabled` axis. |

`[CODE]` The component exposes **no PES-related input**. Whether a user sees the Templates details/wizard at all is gated upstream by the Templates route guards + the consoles' `adminConsoleGuard`/`managementConsoleGuard`. Which *fields* appear is a consumer decision (the `infoFields()` builder), so any field-level PES gating happens by the consumer including/excluding entries — not by the card. `[INFERRED]` Acceptable: viewing a read-only details card is not itself a permissioned action; field-level redaction is the consumer's responsibility.

## State / signal pattern

`[CODE]` falcon-info-card.component.ts:
- Inputs: `title` (`input.required`), `fields` (`input()`, default `[]`), `columns` (`input()`, default `4`) — ts:43-49.
- Derived: `gridClass = computed<string>()` (ts:54-62) — the only reactive computation; rebuilds the grid utility string when `columns()` changes.
- `OnPush` (ts:38). No outputs, no subscriptions, no lifecycle hooks, no `DestroyRef` → nothing to tear down (zoneless-safe).
- **Stateless** — the parent owns the data + builds `[fields]`; the card is a pure render of inputs + projected content. No internal mutable state.

## Skeleton ↔ app-wrapper layering

`[CODE]` **N/A — no skeleton/wrapper split.** Single Angular component; no Stencil-skeleton + Angular-wrapper pair, no `componentOnReady`, no `useTailwind`. Renders plain `<div>`/`<span>` + a single `<ng-content>` directly. Contrast falcon-input's Shadow/`-tw`/wrapper triad.

## Integration gotchas

- `[CODE]` **The component does NOT translate** — pass already-resolved strings for `title`/`label`/`value` (ts:19/42). The live consumers translate in TS (`this.i18n.translate(k)`) or pipe `[title] | translate`. Passing a raw i18n key renders the key.
- `[CODE]` **Projected cells must be wrapped to match the grid** (ts:11-17) — a bare projected element (e.g. a lone `<falcon-status-chip>`) won't get the `flex flex-col gap-1` cell + label styling; wrap each in the documented cell `<div>` with a `text-2xs text-falcon-neutral-500` label (templates-details.component.html:89-96 is the reference).
- `[CODE]` **`gridClass()` literal-string requirement** (ts:51-62) — the responsive grid classes are literals so the Tailwind JIT scanner sees them; do NOT build them via dynamic fragment concatenation in a refactor, or the grid columns silently break at runtime.
- `[CODE]` **Field labels must be unique** within one card (`@for ... track f.label`, html:17).
- `[CODE]` **Order is fields-then-projected** (html:16-28) — plain `[fields]` render first (declaration order), then `<ng-content>` cells. To interleave, you must move a cell into `[fields]` (plain) or rely on `fullWidth`/grid flow; you cannot place a projected cell *between* two plain fields.
- `[INFERRED]` **No row/cell events** — the card emits nothing; interactivity comes only from projected interactive cells (which carry their own events).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — confirmed no backend wiring, no validation, no PES gate, no skeleton/wrapper layering, no data-service injection. The signal pattern (`input.required`/`input()` + `gridClass` computed + OnPush + zero internal state) re-confirmed in source. Upstream Templates data is fetched by the consumer (`infoFields(tpl)`, templates-details.component.ts:189-213), NOT by the card. Projected-cell-wrapping + literal-grid-class integration constraints confirmed.
