# falcon-checkbox — GAPS AND UPGRADES

> AUDIT findings in prose. Severity per SWEEP-SPEC §5. Verified against live code 2026-06-03.

## Missing capabilities (active source verified)

### G1 — `errorText` vs `errorMessage` naming inconsistency (P2)
`[CODE]` falcon-checkbox.component.ts:51 — the wrapper input is `errorText` (forwarded to Stencil as `error-message`), whereas falcon-input/falcon-dropdown wrappers use `errorMessage`. Cross-control inconsistency.
**Fix:** alias `errorMessage` → `errorText`, soft-deprecate. `safe-local`.

### G2 — No rich-label slot / `description` sub-label (P2)
`[CODE]` Neither Stencil tag declares a default `<slot/>` for label content; the Angular wrapper has no `<ng-content>`. So `label` is plain text only — a link inside an "I agree" label, or a muted description line, cannot be expressed. (Prior dossier text claiming a default-slot projection was wrong — corrected this sweep.)
**Fix:** add `<slot>` to both Stencil tags + `<ng-content>` in the wrapper for rich labels, and/or `@Input() description?: string` rendered as muted text below the label. `safe-local` (additive).

### G3 — `checkedInput` is a parent-bypass; not idiomatic (P3)
`[CODE]` ts:69-71 — the CVA-bypass `checkedInput` is the checkbox-group/wallet escape hatch but reads like a normal input. A consumer could accidentally use it instead of CVA.
**Fix:** document loudly, or move to a directive used only by parent-owned-selection scenarios. `safe-local`.

### G4 — Stencil methods not proxied on the Angular wrapper (P2)
`[CODE]` Both tags expose `@Method() setFocus()` + `@Method() toggle()` (falcon-checkbox.tsx:86-96) but the wrapper has no `@ViewChild` on the inner element and proxies neither. Imperative focus/toggle requires a host-element query.
**Fix:** add a `#cbEl` ViewChild + `async setFocus()` / `async toggle()` proxies. `safe-local` (additive).

### G5 — No icon customization (P3)
`[CODE]` The check glyph + indeterminate bar are hardcoded inline SVGs. A `@Input() checkIcon?` (icon name) for branding — most products don't need this.
**Fix:** optional `checkIcon` input. `safe-local`.

### G6 — `indeterminate` resets on toggle (P3)
`[CODE]` ts:119 / tsx:106 — matches native, but some flows want to retain it. Consider `@Input() preserveIndeterminate = false` opt-in.
**Fix:** opt-in flag. `safe-local`.

### G7 — `falcon-focus` event not bound by the Angular wrapper (P2) — NEW, verified 2026-06-03
`[CODE]` falcon-checkbox.tsx:59-60,120-123 + falcon-checkbox-tw.tsx:80-81,137-140 — both tags emit `falcon-focus`, but the wrapper template binds only `(falcon-change)` + `(falcon-blur)` (html:26-27,45-46). Consumers needing a focus signal must attach a native `(focus)` listener — inconsistent with the framework-event pattern (same gap as falcon-input G4).
**Fix:** add `@Output() falconFocus` + bind it. `safe-local`.

### G8 — No `disabled` `@Input` (P2) — NEW, verified 2026-06-03
`[CODE]` The wrapper exposes `readonly` and a CVA `setDisabledState`, but no `disabled` `@Input`. A `[disabled]="true"` template binding silently no-ops; only a disabled `FormControl` (or `readonly`) works. Inconsistent with falcon-input/dropdown, which accept `[disabled]`.
**Fix:** add an `@Input() set disabled(v)` that writes the same signal (so both CVA and binding work). `safe-local` (additive).

## Missing accessibility features
- **A1 (P3):** the native input handles core A11y; `aria-describedby` correctly joins helper+error ids (tsx:142-147). No live region announcing checked-state changes (rarely needed for a labeled checkbox).
- **A2 (P3):** focus-ring contrast in the error state is token-driven (`--falcon-checkbox-ring-color-focus`) — verify against WCAG in a theme pass.

## Missing tests
- `[CODE]` grep 2026-06-03 → **0** `*checkbox*.spec.ts` / `.e2e.ts` for either Stencil tag OR the Angular wrapper, despite CVA + `checkedInput` bypass + indeterminate-reset + Shadow↔`-tw` parity. **GAP G9 — add a wrapper spec (CVA write/read, `checkedInput` bypass, indeterminate reset on toggle, disabled-via-FormControl) + a Stencil parity spec.** A spec would also lock the Shadow↔`-tw` parity. `safe-local`.

## Missing Tailwind / token parity
- Both render paths read `--falcon-checkbox-*` via the `:where()` chain — parity OK. The indeterminate visual is a token-driven bar in both paths (verify identical proportions in a visual pass). Shadow↔`-tw` prop/event/method parity is **near-perfect** (only class names differ).

## Performance risks
- None. Lightweight; no listeners beyond the native input handlers.

## Visual / interaction risks
- The indeterminate bar must read distinctly from both unchecked and checked at all three sizes — token-verify (`--falcon-checkbox-indeterminate-*`).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G2 | Rich-label slot / `description` | P2 | safe-local |
| G4 | Method proxies (`setFocus`/`toggle`) | P2 | safe-local |
| G8 | `disabled` `@Input` | P2 | safe-local |
| G7 | Bind `falcon-focus` | P2 | safe-local |
| G1 | `errorMessage` alias | P2 | safe-local |
| G9 | Spec coverage | P2 | safe-local |
| G3 | Rename/guard `checkedInput` | P3 | safe-local |
| G6 | `preserveIndeterminate` opt-in | P3 | safe-local |

## Concrete upgrade API

```ts
@Input() set disabled(v: boolean) { this.disabled.set(!!v); }   // also keeps CVA path
@Input() errorMessage?: string;          // alias of errorText
@Input() description?: string;
@Input() preserveIndeterminate = false;
@Output() falconFocus = new EventEmitter<boolean>();
async setFocus(): Promise<void>;
async toggle(): Promise<void>;
```

```tsx
// both Stencil tags
<slot>{this.label}</slot>   // allow rich label content
```

## Shared vs per-page
All gaps belong in the shared component.

## Workarounds today
- G2: none for rich labels (cannot project content). Use a sibling element + `label=""` for now.
- G4: query the host element for the inner Stencil tag and call `setFocus()`/`toggle()`.
- G7: attach a native `(focus)` listener.
- G8: use a disabled `FormControl` or `readonly`.

## Wave findings (2026-06-03 deep-dive sweep, batch B05)

**Consumer count: 5** (`[CODE]` grep `<falcon-angular-checkbox` across `apps/` + `libs/falcon/`) — wallet allocation table (admin) + client view (mgmt), Templates wizard step 2 (admin + mgmt), contact-groups preview/configure (mgmt). Corrected from the stale Wave-7 "1 (playground)".

New verified gaps: **G7** (`falcon-focus` unbound), **G8** (no `disabled` input), **G9** (zero specs). **Doc correction applied:** removed the false "label also accepts `<ng-content>` projection" claim from API/RECOGNITION/DECISION/GAPS — neither render path projects content. No deletion/promotion flag — component is ACTIVE/PREFERRED with near-perfect dual-render parity.
