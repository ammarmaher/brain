# falcon-accordion — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — the component is presentational.** It owns no data and calls no endpoint. It is a layout container; whatever module owns the data shown *inside* a panel owns that data. The accordion only manages which panels are expanded.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | `[CODE]` `falcon-accordion.tsx` — no HTTP. The `items` array (section descriptors) and the projected panel content are host-supplied. |

`[INFERRED]` A flow with **async panel content** fetches that data in the host state slice and renders it (or a skeleton) into `slot="content-<value>"`. The accordion itself has no per-item `loading` state — that is `GAPS_AND_UPGRADES.md` P2.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` Error-text display | the accordion | host sets `[errorMessage]` | the accordion renders the text below the items with `role="alert"` (`falcon-accordion.tsx:228-230`). It does NOT compute the error — `hasError` is just `errorMessage` being non-empty (`falcon-accordion.tsx:134-136`). |
| `[INFERRED]` Section-content validation | the form controls inside a panel | submit / blur of a projected control | not the accordion's job — the controls projected into `slot="content-<value>"` carry their own `validations.ts` rules. The accordion is a passive container. |
| `[INFERRED]` No validation of expansion state | `expandedValues` | — | any subset of item values is a valid expansion state; there is nothing to validate. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` None on the accordion | — | The accordion has no PES key. A flow that must lock a *section* passes `disabled: true` on that `FalconAccordionItem` — typically driven by the host flow's PES resolution for that section's feature. The gate is per-item, host-decided. |

## State / signal pattern
`[CODE]` `falcon-accordion.component.ts`
- **No `ControlValueAccessor`** — `FalconAngularAccordionComponent` does not implement CVA (`GAPS_AND_UPGRADES.md` P1/A1). Expansion state binds via `[expandedValues]` + `(valueChange)`. Note: there is NO `expandedValuesChange` Output, so the `[(expandedValues)]` banana-box does NOT auto-wire — bind the two explicitly. `[(ngModel)]` / `formControlName` do not work.
- The wrapper holds expansion in a `signal<ReadonlyArray<string|number>>` (`falcon-accordion.component.ts:58`); `expandedValues` is a getter/setter over that signal; `handleChange` keeps signal + output in sync.
- Stencil internal state: only `resolvedId` is `@State()` (`falcon-accordion.tsx:55`). `expandedValues` is `@Prop({ mutable:true })` — the component mutates it on toggle then emits `falcon-change`.
- Outputs (wrapper): `valueChange` (the full expanded array), `expand` (`{value}`), `collapse` (`{value}`). Stencil events: `falcon-change`, `falcon-expand`, `falcon-collapse` — `expand`/`collapse` carry the single value, `change` carries the whole array.
- Stencil `@Method()`: `expand(value)` and `collapse(value)` (`falcon-accordion.tsx:78-90`) — idempotent (return early if already in/out of state). **Not surfaced by the Angular wrapper** — to drive always-1-open semantics imperatively, an app must call them on the native element ref.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-accordion>` (Shadow DOM, `falcon-accordion.tsx:37-41`) and `<falcon-accordion-tw>` (Light DOM Tailwind variant). Pure presentational. **No popover-portal** — the accordion expands inline, no floating panel; immune to the `_LEARNINGS_POPOVER_PORTAL_PATTERN.md` positioning bugs.
- **Angular wrapper** — `<falcon-angular-accordion>` renders BOTH skeletons behind a `useTailwind` switch (default `true`); `ngOnInit` lazily registers via `defineFalconTwComponent('falcon-accordion')`.
- **Content projection** — the wrapper's HTML template projects via `<ng-content>`; the host's `<div slot="content-<value>">` content reaches the Stencil `<slot name="content-<value>">` (`falcon-accordion.tsx:217`). Per `feedback_library_skeleton_app_api`: the wrapper does no data fetching.

## Integration gotchas
- `[CODE]` **Panel content is matched by slot name, not order** — `slot="content-<value>"` must match an `item.value` exactly (`falcon-accordion.tsx:217`). A typo or a `value` type mismatch (`'1'` string vs `1` number) silently renders an empty panel.
- `[CODE]` **Collapsed panels use the `hidden` attribute** (`falcon-accordion.tsx:214`) — projected content in a collapsed panel is removed from layout, focus order, and the a11y tree. Form controls inside a collapsed panel still exist in the Angular component tree (so `formControlName` bindings stay live and validation still runs) but are not reachable by the operator. A submit can fail on an invalid field the operator cannot see — the host flow should auto-expand the offending section.
- `[CODE]` **Item icons are CSS class strings** — `icon: 'falcon-icon falcon-icon-cog'` renders `<i class={item.icon}>` (`falcon-accordion.tsx:183-187`), bypassing `<falcon-angular-icon>` (`GAPS_AND_UPGRADES.md` P2).
- `[CODE]` **No per-item header slot** — the header is built only from `label` / `description` / `icon` props (`falcon-accordion.tsx:181-193`). Rich headers (status badge, action button) need the P1 `header-<value>` slot upgrade — do not hand-roll.
- 🟢 **Consumer count reconciled (2026-06-03):** the B13 Consumer Sweep finds **0** consumers in `apps/` and `libs/falcon/` — OVERVIEW + USAGE now agree on "0 / unadopted". The stale Wave-7 `playground.page.html` consumer is retired (the playground route is gone).

## Verification
🟢 VERIFIED 2026-06-03 (B13) against `[CODE]` `falcon-accordion.tsx` + `falcon-accordion.component.ts` — no CVA, `content-<value>` slot pattern, methods, single-mode collapse-to-zero all re-confirmed. Backend ownership = none (presentational). Consumer count reconciled to 0; `[(expandedValues)]` corrected to `[expandedValues]` + `(valueChange)`.
