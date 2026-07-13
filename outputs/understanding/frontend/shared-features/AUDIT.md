# Falcon Shared Features — AUDIT (best-practice rubric §5)

> Read-only audit. Score per dimension PASS / 🟡 minor / 🟠 medium / 🔴 high-risk. Every finding source-prefixed. **Fixed NOTHING** (SPEC §0). Findings rows also in `plans/library-deep-dive/FINDINGS/L05.md`.
> Rubric: A=Angular21 · B=Stencil dual-render (N/A — these are single-render Angular features) · C=Falcon house rules · D=Accessibility · E=Cross-framework parity (N/A) · F=Completeness/consistency/drift.

## A — Angular 21

**Mostly EXEMPLARY, one legacy-API pocket.**

- ✅ All 5 units standalone + explicit `imports` + OnPush + `inject()`. ([CODE] every `@Component`.)
- ✅ Signals-first where modern: `service-pricing-table`, `user-details`, `org-node-avatar`, `UserDetailsStateSlice` all use `input()/input.required()/output()/signal/computed/effect/untracked`. `UserDetailsStateSlice` is a textbook per-instance signal store ([CODE] `signals/signals.ts:128-468`).
- ✅ `@if/@for/@switch` control flow (e.g. `org-node-avatar.component.html:8` `@switch`; `comm-mkt-service-icon.component.ts:24` `@switch`). No `*ngIf/*ngFor` seen in the files read.
- ✅ Teardown via `takeUntilDestroyed(this.destroyRef)` ([CODE] `comm-mkt-view.component.ts:231`, `signals/signals.ts:521` and throughout) — zoneless-safe.
- ✅ Correct `untracked()` usage inside an `effect` to break a read/write self-trigger ([CODE] `service-pricing-table.component.ts:369`) — a non-trivial zoneless-signal correctness pattern.
- 🟡 **A1 — `comm-mkt-view` + its 2 SVG/toggle sub-components use legacy `@Input/@Output/EventEmitter`** instead of `input()/output()`. ([CODE] `comm-mkt-view.component.ts:100-121`; `comm-mkt-view-toggle.component.ts:55-56`; `comm-mkt-service-icon.component.ts:107-108`.) The setter-backed `@Input items`/`busyRowIds` exist precisely to re-route a plain `@Input` into a signal (a workaround the signal `input()` API solves natively). Inconsistent with the signals-first sibling features. Additive migration; no behavior change. `risk-class: safe-local`.

## C — Falcon house rules

**Mostly clean (ZERO SCSS folder-wide), several token/native-HTML deviations — all DELIBERATE & commented.**

- ✅ **No SCSS anywhere in `shared-features/`** ([CODE] recursive find 2026-06-03 — 0 `.scss`/`.css`). Layout is Tailwind utilities + Falcon tokens.
- ✅ Falcon UI-core components used over native/PrimeNG for all rich controls (data-table, dropdown, date-picker, status-badge, tabs, switch, input, phone/email field). No `primeng/*` import; no `pi pi-*` icon class.
- ✅ Terse `*** ***` banner comments throughout (house convention) — and the provenance comments are unusually thorough (Wave/BUG/SoT cites).
- 🟠 **C1 — `comm-mkt-view` ships an inline `styles:` block with `::ng-deep` + `!important`** ([CODE] `comm-mkt-view.component.ts:94` — `:host ::ng-deep [data-shadow-actions-mount]{display:none!important}`). This is a CSS rule in a TS component (vs the Tailwind-only mandate) AND uses the deprecated `::ng-deep` to reach into the Stencil `<falcon-table-tw>` light DOM. The inline comment (`:88-93`) justifies it: the Stencil table re-asserts its shadow-row action buttons on every re-render, so neither a Tailwind utility nor the `falconDataTableShadowActions` template can suppress them. It is `:host`-scoped (bounded to this table). Genuine library gap (the data-table lacks a "read-only shadow rows" input). `risk-class: HIGH-RISK-QUEUE` (the real fix is a `falcon-data-table` API addition + render-path change, not a local edit).
- 🟡 **C2 — `comm-mkt-service-icon` host binds `[style.color]` with a hardcoded hex fallback** ([CODE] `comm-mkt-service-icon.component.ts:11` — `'[style.color]': "'var(--color-falcon-teal-700, #0d3f44)'"`). Inline style + a literal hex `#0d3f44` (vs tokens-over-literals). The token is referenced first; the hex is only a fallback. Could be a Tailwind `text-falcon-teal-700` utility on the host instead. `risk-class: safe-local`.
- 🟡 **C3 — arbitrary Tailwind values + a `[var(--radius-…)]` arbitrary utility in sub-components.** `org-node-avatar.component.html:40,43` uses `text-[10px]` / `text-[9px]` (raw px arbitrary values); `comm-mkt-view-toggle.component.ts:66` uses `rounded-[var(--radius-control-xs)]` + `shadow-[var(--shadow-falcon-toggle-active)]`. The arbitrary-token-utility form is the accepted Falcon escape hatch (token-backed), but `text-[10px]/[9px]` are raw px (a no-hex-px deviation, though tiny). `risk-class: safe-local`.
- 🟡 **C4 — raw inline SVG markup in 4 places** (`falcon-brand-logo`, `org-node-avatar` brand branch, `comm-mkt-service-icon`, `comm-mkt-view-toggle`). These are brand/glyph marks the Falcon icon font does not carry ([CODE] `comm-mkt-service-icon.component.ts:1-2` says so explicitly), so inline SVG is the correct choice — but the brand-logo geometry is now duplicated in BOTH `falcon-brand-logo.component.ts:35` AND `org-node-avatar.component.html:23` (the latter's comment :1-7 acknowledges the lockstep-by-hand duplication). Consolidating to one source would be ideal. `risk-class: safe-local`.
- 🟡 **C5 — selector prefix inconsistency.** 4 of 5 units use `app-*` (host-shell convention); `service-pricing-table` uses `falcon-*`. Cosmetic; align if touched. `risk-class: safe-local`.

## D — Accessibility

**Good, with small gaps.**

- ✅ `falcon-brand-logo` host `role="img"` + `aria-label="Falcon"` ([CODE] :39-43); `org-node-avatar` branches all carry `role="img"`/`aria-label` ([CODE] `.html:15-16,44`).
- ✅ `comm-mkt-view-toggle` is a proper `role="group"` with `aria-pressed`/`aria-label`/`title` per button ([CODE] :15-43); decorative SVGs `aria-hidden`.
- ✅ Rich controls inherit a11y from the Falcon UI-core components (data-table, dropdown, tabs all carry their own labels/roles — documented in their dossiers).
- 🟡 **D1 — `comm-mkt-service-icon`'s SVG is `aria-hidden` with no labeled wrapper.** ([CODE] :22.) Acceptable IF the adjacent text names the service (it does in the card), but the icon-only context should be verified. `risk-class: safe-local`.
- 🟡 **D2 — `user-details` avatar edit-pin / oversize-error path.** The 96px hero + hidden native file input ([CODE] `user-details-page.component.ts:255,518-530`) replaced the shared uploader component; verify the native input has an accessible label + the oversize error is announced (`role="alert"`). Not confirmed line-by-line in the template this pass. `risk-class: safe-local`.

## F — Completeness / consistency / drift

- ✅ Every unit has a barrel; `service-pricing-table` + `comm-mkt-view` + `user-details` follow the folder-doctrine slices (models/signals/validations/services/config). Re-exports reach `@falcon` where intended.
- ✅ The presentation/transport split is real and well-enforced via DI tokens (`SERVICE_PRICING_TRANSPORT`, `USER_DETAILS_GATEWAY`).
- 🟠 **F1 — `user-details/validations` duplicates the `personName` charset/length contract from `falcon-validations.ts`.** ([CODE] `user-details/validations/validations.ts:72-129` re-declares `PERSON_NAME_CHARSET`/`PERSON_NAME_MIN/MAX`/`STARTS_WITH_LETTER`/`EMAIL_PATTERN` and re-implements `checkPersonName` to mirror the registry `personName()` body.) The file's own header (:28-30) flags this as INTENTIONAL ("kept pure-function; keep in sync") and a parity test (`tools/validation-tests/user-profile-name-validations.test.ts`) fails CI on divergence. So it's a managed duplication, not silent drift — but it IS a second source of the same business rule. Long-term: have `user-details` consume `FALCON_VALIDATIONS` directly (it can't trivially, because the slice runs validators as pure fns outside DI). `risk-class: HIGH-RISK-QUEUE` (validation-behavior consolidation across two layers + the parity-test contract).
- 🟡 **F2 — ZERO in-folder spec files.** ([CODE] recursive find — no `*.spec.ts` under `shared-features/`.) `user-details` is partially covered by the external parity test; `comm-mkt-view`'s action-gating + `service-pricing-table`'s shadow-row carry-forward / effective-date math are intricate (dense BUG-FIX comments) and untested at the lib level. Additive. `risk-class: safe-local`.
- 🟡 **F3 — commented-out save-validation in `user-details/signals`** ([CODE] `signals/signals.ts:779-792` — `isEmailPhoneExclusiveViolation` block commented out with a "needs double-check with Jawad" note). The fn is still exported + still has the PRD rule; the enforcement is disabled in the live save path. Dead-but-documented; decide keep-or-restore. `risk-class: safe-local` (but the underlying PRD rule "cannot edit email + phone in one request" is currently UNENFORCED in the FE — flag to product).
- 🟡 **F4 — `comm-mkt-view` mixes `ngOnInit` with the signals model.** ([CODE] `comm-mkt-view.component.ts:236` uses `ngOnInit` to read persisted view-mode after `kind` is bound.) Works, but inconsistent with the effect-driven siblings; an `effect` keyed on `kind()` would be more idiomatic. `risk-class: safe-local`.

## Audit summary

| Dim | Verdict | Notes |
|---|---|---|
| A — Angular 21 | **🟡 GOOD** | Exemplary signals/teardown/`untracked`; A1 legacy-API in comm-mkt-view only |
| B — Stencil dual-render | **N/A** | single-render Angular features (they CONSUME Stencil components) |
| C — Falcon house rules | **🟠 MEDIUM** | C1 `::ng-deep`+`!important`+inline-styles (deliberate, library-gap), C2 inline-style hex, C3 raw-px arbitrary values, C4 duplicated brand SVG, C5 prefix |
| D — Accessibility | **🟡 GOOD** | strong roles/labels; D1/D2 to verify |
| E — Cross-framework parity | **N/A** | feature-level Angular, no React/Vue twin |
| F — Completeness/drift | **🟠 MEDIUM** | F1 validation duplication (managed, parity-tested), F2 no lib specs, F3 disabled PRD rule, F4 ngOnInit-vs-effect |

**Overall: 🟡 GOOD with two 🟠 mediums (C + F).** These are large, production-grade, recently-hardened features — the deviations are documented, bounded, and mostly trace to genuine library gaps (the data-table read-only-shadow API) or deliberate parity choices (the validation duplication). None is a 🔴.

**HIGH-RISK-QUEUE items (3):** C1 (`comm-mkt-view` `::ng-deep` → real `falcon-data-table` read-only-shadow API), F1 (`user-details` validation-duplication consolidation vs the parity-test contract), F3-product (the email/phone exclusive-edit PRD rule is currently unenforced in the FE save path).

## Verification
🟢 code-verified 2026-06-03 (L05) — every audited claim cites a line in a file read this pass. Findings mirrored to `plans/library-deep-dive/FINDINGS/L05.md`. No source edited.
