# falcon-date-picker — GAPS AND UPGRADES

## Missing capabilities

### G1 — No CVA support (P1)

**This is the biggest gap.** Wrapper does not implement `ControlValueAccessor`. Reactive Forms + ngModel binding does NOT work. Consumers must wire `(valueChange)` + `[value]` two-way manually OR write a custom CVA directive.

**Recommended fix:** add `ControlValueAccessor` on the wrapper directly. Required for parity with siblings.

### G2 — No range mode (P1)

Single date only. Range needs external composition.

### G3 — No time picker (P1)

Date-only. No time selection. Common need for "scheduled at" fields.

**Recommended fix:** add `@Input() showTime = false` + time-input section in popover.

### G4 — No display-format input (P2)

Input shows ISO `YYYY-MM-DD`. No way to display `DD MMM YYYY` or similar — wrapper does no Intl formatting on display.

**Recommended fix:** add `@Input() displayFormat?: string` (Intl options or template string).

### G5 — No calendar system (Hijri) (P2)

Same as calendar.

### G6 — No method proxies (P2)

No `openPicker()` / `closePicker()` / `clearDate()` / `setFocus()`.

### G7 — No "Today" / "Clear" quick actions inside popover (P3)

### G8 — No range-validation interaction with siblings (P3)

If two date-pickers represent start+end, no automatic "start <= end" hint. Consumer must coordinate.

## Missing accessibility (verified 2026-06-03 — prior "verify" hedges resolved)

- **A1 (P1 — keyboard-open gap):** `[CODE]` falcon-date-picker-tw.tsx:149-167 + `[BRAIN-OUT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md` :77,:262 — the RC#4 fix removed `openInternal` from the focus handler but **added no keyboard-open handler**. `handleInputKeydown` only handles Escape (tsx:169-174). So a keyboard-only user who Tabs to the field **cannot open the calendar** (no Enter / Space / ArrowDown). This is a real WCAG gap explicitly flagged in the learnings as "future accessibility pass."
- **A2 (P1 — no focus trap):** `[CODE]` neither render path traps focus inside the `role="dialog"` popover, and the popover is portaled to body in the `-tw` path — so Tab from the last focusable element escapes to the page behind the open dialog. The embedded calendar manages its own roving-tabindex grid, but there is no dialog-level trap or focus-return-on-close.
- **A3 (P2):** no `aria-live` announcement of the selected date after a pick.
- **CONFIRMED OK:** popover `role="dialog"` (falcon-date-picker.tsx:248 / -tw:388), input `aria-haspopup="dialog"` + `aria-expanded` + `aria-controls` (tsx:216-218), `aria-invalid` on error, `role="alert"` on the error line, Escape-to-close (tsx:130-135). The input is NOT `role="combobox"` (prior claim corrected). The embedded calendar provides `role="grid"` + full keyboard grid nav once open.

## Missing tests

- `[CODE]` grep 2026-06-03 → **0 spec/e2e files** for `<falcon-date-picker>`, `<falcon-date-picker-tw>`, OR the Angular wrapper — despite the component carrying the most intricate logic in the batch (portal lifecycle, RC#1-5 fixes, Top-Layer acquire, lenient input parse, outside-click). GAPs: (a) a `-tw` Stencil spec for open/select/outside-click/Escape + `ensurePortaled` orphan recovery; (b) a wrapper spec for `syncProps()` + the Top-Layer acquire/release + the 5 outputs. A regression spec here would lock the RC#4 fix.

## Missing Tailwind / token parity

- `[CODE]` `date-picker-tailwind-classes.ts` mirrors the Shadow CSS selector-for-selector (documented in its header) and reads the same `--falcon-date-picker-*` tokens — **parity OK at the token level**. The behavioral divergence is NOT a token issue: it is the RC#4 focus-open (Shadow only) + the portal mechanism (`-tw` only). Not visually diffed in this static pass.
- `[CODE]` There is no per-component `--falcon-date-picker-label-color` token — both paths reach `--color-falcon-neutral-800` directly (see TOKENS.md Static style risks). Minor.

## Performance risks

- None.

## Visual / interaction risks

- Popover positioning at viewport edges — verify flip/anchor strategy.
- RTL popover anchoring.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | CVA support | P1 |
| G2 | Range mode | P1 |
| G3 | Time picker | P1 |
| G4 | Display format | P2 |
| G5 | Hijri calendar | P2 |
| G6 | Method proxies | P2 |
| G7 | Quick actions in popover | P3 |

## Concrete upgrade API

```ts
// implements ControlValueAccessor
@Input() mode: 'single' | 'range' = 'single';
@Input() showTime = false;
@Input() displayFormat?: string;
@Input() calendar: 'gregorian' | 'islamic-umalqura' = 'gregorian';
@Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
async openPicker(): Promise<void>;
async closePicker(): Promise<void>;
async clearDate(): Promise<void>;
async setFocus(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: wrap in a CVA directive externally.
- For G2: compose two pickers and validate min/max cross-field.
- For G3: pair with `<falcon-angular-input type='text'>` for HH:MM.
- For G4: format manually after `(valueChange)` and display in a sibling element.

## Diagnostics — popover positioning debug flag

When the calendar popover lands in the wrong place (top-left, top-right, bottom-right, far below, or off-screen), enable the runtime debug flag to dump the anchor measurement chain on every popover open:

```javascript
// In DevTools console, BEFORE clicking the date picker:
window.__FALCON_DEBUG_POPOVER__ = true;

// Then click the date picker. The console emits one [falcon-popover-portal]
// log per popover open + per stability re-check. Each log contains:
//   anchorTag        — the trigger element tag (usually DIV for inputWrapEl)
//   rect             — { x, y, w, h, l, r, t, b } in viewport coords
//   anchorPos        — computed `position` on the anchor
//   anchorDir        — computed `direction` (ltr | rtl) — drives RTL physical-write branch
//   anchorConnected  — false means the anchor is mid-DOM-detach (replaceChildren race)
//   chain            — ancestor walk (up to 12 levels) showing pos + transform-presence + left

// Turn off:
delete window.__FALCON_DEBUG_POPOVER__;
```

### Reading the chain

A healthy chain (under-anchor placement working) looks like:
```
div pos=relative tr=- l=935.0
div[shadow-col=priceValue] pos=absolute tr=Y l=935.0
form pos=relative tr=- l=787.0
div pos=block tr=- l=787.0
td pos=relative tr=- l=787.0
tr pos=- tr=- l=787.0
...
```

A broken chain (anchor reading zero rect) usually shows:
```
div pos=relative tr=- l=0.0       <-- inputWrapEl rect.left = 0
div[shadow-col=priceValue] pos=absolute tr=Y l=0.0  <-- shadow-col var not yet published
...
```
→ root cause likely RC#3 (replaceChildren detach) or RC#1 (shadow-col var race not yet closed for this consumer).

A broken chain with non-zero rect but popover lands wrong usually shows:
```
div pos=relative tr=- l=935.0  rect: { l: 935, t: 263 ... }   <-- anchor measured correctly
```
but the popover ends up at `(viewportW - X, viewportH - Y)` → root cause likely RC#2 (ghost utility class cascade — popover's `absolute top-full start-0` leaked through the portal).

### See also

- `libs/falcon-ui-core/src/utils/popover-portal.ts:106-132` — debug-flag implementation
- `libs/falcon-ui-core/src/utils/popover-portal.ts:81-99` — STABILITY_MAX_RETRIES = 8 (Phase 1, 2026-05-17) + rationale
- [MEMORY] `project_zindex_calendar_portal_root_cause_fix.md` — three landed passes (pass 1: z-index ladder + zero-rect park; pass 2: RTL physical/logical separation; pass 3: publishShadowColumnVars before emit)
- [MEMORY] `project_falcon_shadow_row_popover_5_root_causes_2026_05_17.md` — Phase 0/1/2/3/4/5 plan after 5 RCs identified

## Wave 7 Findings (2026-05-17)

**Consumer count: 7** ([CODE] grep `<falcon-angular-date-picker>`). No new structural gaps.

## Deep-Dive Sweep Findings (2026-06-03 — B07)

**Consumer count: ~3 live render sites** ([CODE] grep `<falcon-angular-date-picker` → 2 app files + 2 in `libs/falcon`, one a no-op comment). The contracts wizard (Start/Expiration) + service-pricing-table replaced the prior applications-table/edit-row/playground/legacy-façade set.

Drift corrected vs prior dossier (component stays ACTIVE/PREFERRED; no deletion flag):
- **Inputs 19 → 24** (added `disabledIcon*` + `iconLeft`); outputs confirmed 5; `open()`/`close()` `@Method`s confirmed on BOTH tags (G6 = wrapper-proxy gap).
- **Trigger is `aria-haspopup="dialog"`, NOT `role="combobox"`** (API.md corrected); `role="dialog"` on the popover confirmed.
- **A11y placeholders resolved + escalated:** no keyboard-open after the RC#4 fix (A1) + no focus-trap in the portaled dialog (A2) — both real WCAG gaps, HIGH-RISK-QUEUE (a11y semantics).
- **Shadow variant still carries the RC#4 first-click bug** (`handleInputFocus` opens, tsx:125-128) while `-tw` is fixed — a render-path behavioral divergence (HIGH-RISK-QUEUE).
- **Wrong token names corrected** (`-container-shadow` / `--z-falcon-popover 1070` → `-popover-shadow` / `-popover-z-index 200`).
- **Legacy façade DELETED** — OVERVIEW/BUSINESS/RECOGNITION cross-links corrected.
- Token-level parity OK; the divergence is behavioral, not visual. See FINDINGS/B07.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07) against all source layers (wrapper / Shadow / `-tw` / tokens / `[BRAIN-OUT]` popover-portal learnings). G1 (no CVA), G2/G3/G4/G5 confirmed; G6 (Stencil `open`/`close` exist, no wrapper proxy) confirmed; a11y A1 (no keyboard-open) + A2 (no focus-trap) confirmed missing; RC#4 Shadow-only divergence confirmed; 0 spec/e2e confirmed. No deletion flag — stays ACTIVE/PREFERRED, keep `useTailwind=true`.
