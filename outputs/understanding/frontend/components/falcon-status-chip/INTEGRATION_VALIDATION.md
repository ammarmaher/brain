# falcon-status-chip — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[MEMORY]` `[INFERRED]`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-status-chip.component.ts` is a pure presentational Angular component — 5 signal inputs, 0 outputs, no service injection (`inject()` only of `TranslatePipe`, which is a pipe in `imports`, not a service it calls), no HTTP. It owns no data. The status value it renders belongs to whatever module owns the *Templates* domain:
- **Templates / Commerce** `[INFERRED]` — the message-template lifecycle status (`approved`/`pending`/`review`/`rejected`/`deleted`) is computed by the Templates page from the template DTO returned by the templates backend (admin → System Gateway; mgmt → Core Gateway). The chip only renders the resulting bucket.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The chip makes **no calls**. The Templates list/details page fetches templates + checker states; it maps each row's status into a `FalconStatusChipStatus` bucket and feeds `[status]` + (optionally) `[labelKey]`. |

> `[INFERRED]` The chip never touches an endpoint. `row.status` / `c.status` / `falconChipColor(row)` (`USAGE.md` Examples 1-3) are computed by the consuming Templates page from its own data slice.

## Validation rules (V-*)
The chip runs **no validators** — it is a display surface, not a form control. There is no `validations/validations.ts` for it.

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The chip performs no validation. The *templates* lifecycle/maker-checker rules (who may approve/reject, status transitions) belong to the Templates feature + its backend, not to the chip. |

> `[CODE]` The only "validation-like" constraint is the **TypeScript union** on `status` — an unmapped status value won't type-check, forcing the consumer to map into one of the six buckets (or `'none'`) at the boundary.

## PES keys gating this component
The chip has **no PES key of its own**.
- `[INFERRED]` Whether a template status is *editable* (e.g. a checker may approve/reject) is gated in the Templates feature by its own `FalconAccess.*` resolution + the maker/checker rules — the chip only renders the *current* state, it never gates an action.
- `[BRAIN-OUT]` Per the presentational-component convention (the `falcon-dropdown`/`falcon-input` exemplars: "a presentational component inherits the gate of the field it renders"), the chip inherits nothing actionable — it shows a read-only verdict.

## State / signal pattern
`[CODE]` `falcon-status-chip.component.ts`:
- All 5 inputs are Angular signal inputs (`input()`): `status` (required), `variant`, `showDot`, `size`, `labelKey`.
- 4 `computed()` derivations: `tokens` (`STATUS_TOKENS[status()]`), `filledClasses`, `textClasses`, `dotClasses` — pure functions of `status()` + `size()`.
- 0 outputs — the chip emits nothing.
- `[CODE]` ts:84-101 inline template uses Angular `@if`/`@else` control flow to branch on `variant()` and to gate the dot on `showDot()`.
- `OnPush` + signals → zoneless-safe; re-renders only when an input changes.
- Error pipeline: **none** — the chip has no async surface, so the host app's HTTP error pipeline (`[MEMORY]` 400 → top-right toast) never touches it.

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton.** `[CODE]` This is a pure-Angular single-render shared-ui component (`falcon-status-chip.component.ts` with an inline template; no `.tsx`, no `-tw`, no token file). There is no Light/Shadow render path and no `useTailwind` switch — the gold `falcon-input` dual-render layering does NOT apply here.
- **App / state layer** — the consuming Templates list/details page owns the template fetch, the status mapping, the maker/checker data, and computes the `status` / `labelKey` inputs the chip renders.
- **Host element** — the chip is projected directly into a `<falcon-angular-data-table>` cell via `<ng-template falconDataTableCell="status">` (`[CODE]` templates-list.component.html:216). The data-table cell template is the integration point; the chip is a leaf inside it.
- Per `feedback_library_skeleton_app_api`, a wrapper never fetches data — here the chip is itself the leaf, and the Templates page is the state owner.

## Integration gotchas
- `[CODE]` **`status` is a strict union, not a free string** — the consumer MUST map its backend status into `'approved' | 'pending' | 'rejected' | 'deleted' | 'review' | 'none'` at the boundary (`falconChipColor(row)` does exactly this for the `falconStatus` column). An unmapped value is a compile error or (if cast) renders nothing meaningful.
- `[CODE]` **`labelKey` decouples color from word** — when the backend's status word differs from the chip's default label, override `labelKey` while keeping the right color bucket (`templates-list.component.html:339`). Do NOT pick a wrong color bucket just to get the right default word.
- `[CODE]` **No dark-surface flip** — the chip has no dark-mode rules; it inherits the palette tokens (`TOKENS.md` G-DARK-1). Verify tint-vs-dark-canvas contrast in `.app-dark`.
- `[CODE]` **`text`-variant dot ignores `size`** — fixed `w-1.5 h-1.5` (ts:97) vs the filled dot's size-aware `dotClasses()`. A consumer expecting a `sm` text dot to shrink will not get it (G4) — though the checker sub-lines pass `[showDot]="false"`, so it is currently moot in production.
- `[CODE]` **i18n keys must exist in both `en.json` and `ar.json`** — the six `templates.status.*` keys (+ any custom `labelKey`) must be present; a missing key surfaces the raw key string to the operator.
- `[INFERRED]` **No cross-framework surface** — Angular-only. There is no React/Vue equivalent of this chip (unlike the `falcon-ui-core` status-badge/tag, which have generated wrappers). If a non-Angular surface needs the templates-status look, that is a port gap.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) — the zero-backend / zero-output / no-CVA / signals+`computed` / `@if`-branch facts re-confirmed against `falcon-status-chip.component.ts` (read in full). The data-table-cell integration point is 🟢 confirmed from `templates-list.component.html` (lines 216/336). Backend-wiring table is intentionally empty — the chip has no backend surface by design. PES rows are 🔴 INFERRED (the chip sees only the resolved status bucket). The cross-framework gap is 🟡 derived from the `@falcon` barrel (status-chip is shared-ui Angular-only; status-badge/tag are `falcon-ui-core` with React/Vue wrappers).
