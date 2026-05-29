# falcon-tag — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — purely presentational, no CVA.** The component owns no data and captures no input. What a tag *displays* is owned elsewhere:
- A permission chip → **Identity** (the user's permission / role set).
- A filter chip → no backend at all; it visualises a client-side query predicate.
- A multi-select selected chip → whatever module owns the multi-select's option list (Provisioning lookups, Commerce categories, Identity roles).
- A settings attribute chip → **Commerce** (settings DTO — see `[MEMORY]` `project_settings_tab_standalone_wave14`).

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | A tag issues no request. It renders a string `[value]` the host already holds. `(falconDismiss)` is a *UI event* — the host mutation it triggers (e.g. a multi-select deselection, a filter drop) belongs to the host flow's dossier. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | A tag is not a form control (`API.md:57` — **no CVA**). It runs and surfaces **no validation**. Any rule about "how many tags / which tags are allowed" lives on the *host* collection control (the multi-select, the chip-input, the filter model). |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — (inherited) | — | A tag has no PES key. When the *thing it represents* is PES-gated, the parent controls whether the tag is rendered at all and whether `[dismissible]` is allowed. `[INFERRED]` e.g. a permission chip the operator may not edit is rendered without the ✕ (`[dismissible]="false"`). |

## State / signal pattern
`[BRAIN-OUT]` A tag is a leaf render of a parent collection signal. The canonical pattern (`USAGE.md:5-25`): the parent holds the set as a signal/`Map`; `@for` renders one `<falcon-angular-tag>` per member with `track`; `(falconDismiss)` calls a parent method that does an immutable `.update()` removing the keyed member. The tag itself holds no state — re-render is driven entirely by the parent signal.

`[CODE]` `API.md:33` / `OVERVIEW.md:50` The Stencil event is `falcon-tag-dismiss` (`{ value: string }`); the Angular wrapper re-emits it as `(falconDismiss)` carrying the tag's `value`.

## Skeleton ↔ app-wrapper layering
`[CODE]` `OVERVIEW.md:28-34`
- **Stencil skeleton** — `<falcon-tag>` (Shadow DOM) / `<falcon-tag-tw>` (Light DOM). Pure presentational; `data-severity` + `data-size` attributes drive token cascading; the `✕` button is a native `<button aria-label="Remove">` (`API.md:63`).
- **Angular wrapper** — `<falcon-angular-tag>`: dual render path (`useTailwind` default `true`), `<ng-content>` projected in both paths, re-emits `falconDismiss`.
- `[CODE]` `API.md:69` / `GAPS_AND_UPGRADES.md:5-7` **Known dead code** — the wrapper carries a legacy `classes` computed signal (lines 62-71) with hardcoded `_severityClasses()` / `_sizeClasses()` helpers that are *unused in the actual template* (the template delegates to `<falcon-tag-tw>`). Wave 9.E carry-over; FT-01 recommends removal. A builder must not rely on or extend that `classes` signal.

## Integration gotchas
- `[CODE]` `GAPS_AND_UPGRADES.md:5-7` **Dead `classes` computed in the wrapper** — internal-only; do not extend it. The Stencil tag is the live render path.
- `[CODE]` `USAGE.md:80,97` **`warn` is a legacy severity alias** — do not pass it in new code; it must token-map to the `warning` bucket (verify in `tag.tokens.css` — `GAPS_AND_UPGRADES.md:11`).
- `[CODE]` `GAPS_AND_UPGRADES.md:26-27` **Dismiss `aria-label="Remove"` is hardcoded English** — for the Arabic UI this is an i18n gap (FT-02 proposes `[dismissAriaLabel]`); the workaround is dropping to the Stencil tag and binding `aria-label`.
- `[CODE]` `GAPS_AND_UPGRADES.md:21-23` **No `<falcon-tag-list>` orchestrator** — wrapping / gap / overflow of a multi-tag set is the consumer's job (`<div class="flex flex-wrap gap-1">`).
- `[CODE]` `GAPS_AND_UPGRADES.md:51` **Visual collision with `<falcon-badge>`** — both share the info=blue / success=green palette; do not place a `<falcon-badge variant="info">` and `<falcon-tag severity="info">` on the same row — they look identical but mean different things.

## Verification
🟡 CODE-DERIVED from the 6 UI dossier files + `[CODE]` `falcon-tag.types.ts` / `falcon-tag.component.ts` API surface. Dead-code and i18n gaps are ✅ VERIFIED against `[CODE]` line references in `GAPS_AND_UPGRADES.md`. Backend ownership of represented data is `[INFERRED]` per host flow.
