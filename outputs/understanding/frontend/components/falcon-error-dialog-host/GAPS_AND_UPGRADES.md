# falcon-error-dialog-host — GAPS AND UPGRADES

> This is where the B27 AUDIT findings for this component live in prose. The component is small, clean, and ACTIVE — most gaps are doc/test/parity nits, not defects. Single-render Angular host ⇒ rubric **B/E N/A**.

## Missing capabilities (active source verified)

### G1 — No `aria-live` / `role="alert"` on the error list (P3, A11y)

`[CODE]` html:18-24 — the bullet `<ul>` is plain semantic markup with no `role="alert"` / `aria-live`. The alert-dialog primitive announces the dialog on open via focus, but a screen reader is not told "N errors" as a live region. Acceptable for a modal (focus moves into it), but an `aria-live="polite"` summary would improve the count announcement.

**Recommended fix (P3):** wrap the subtitle/count in an `aria-live="polite"` region inside the dialog body, OR confirm the alert-dialog primitive already labels the body via `aria-describedby`.

### G2 — No empty-list / zero-message guard (P3)

`[CODE]` If a caller passes `errorMessages: []`, the subtitle renders `hierarchy.error.countOther` with `{count}` = 0 → "0 errors" (en.json:1580), and the `<ul>` renders empty. The dialog still opens with a title + empty body. No code path currently passes `[]` (all callers pass ≥1 message), but the host does not defend against it.

**Recommended fix (P3):** if `errorMessages` is empty, fall back to a generic `hierarchy.error.unknown` bullet (en.json:1582 exists) so the body is never blank.

### G3 — `httpStatus` title coverage is partial (P3)

`[CODE]` ts:54 builds `hierarchy.error.title.{httpStatus}`. en.json:1570-1577 defines only `400/403/404/409/422/500/default`. Any other status (e.g. `429`, `503`, `502`) falls through to `default` ("An error occurred (HTTP {status})"). Functional, but a few common statuses lack a friendly title.

**Recommended fix (P3):** add `429` / `503` title keys; or document that `default` is intentional for the long tail.

### G4 — Severity is binary (warning|danger only) (P3)

`[CODE]` ts:74-78 only ever emits `'warning'` (422) or `'danger'` (else). The alert-dialog primitive also supports `'info'` and `'success'` (`[CODE]` FalconAlertDialogSeverity, falcon-alert-dialog.types.ts:5). An informational "this succeeded with caveats" acknowledgement is not expressible through this host. By design (it is an ERROR host), but worth noting the unused range.

### G5 — `titleKey` override exists but no `subtitleKey` / `messages-are-keys` flag (P3)

`[CODE]` `ErrorDialogState.titleKey` allows a per-call title override (service:18), but there is no equivalent override for the subtitle, and no explicit flag telling the host "these messages ARE i18n keys, always translate" vs "these are raw, never translate" — it guesses (translate-if-matches, ts:84-88). A caller passing a backend message that *coincidentally* matches a key gets it silently translated.

**Recommended fix (P2):** add an optional `messagesAreKeys?: boolean` to `ErrorDialogState` so the caller declares intent instead of relying on the heuristic.

### G6 — No spec / test coverage (P2, test)

`[CODE]` **No `*.spec.ts` exists** for the host OR the `ErrorDialogService`. The 422→warning mapping, the title/subtitle/count computeds, the `401`-suppression, and the last-wins behavior are all untested.

**Recommended fix (P2):** add `error-dialog.service.spec.ts` (openError/dismiss/401-suppress/last-wins Promise resolution) + `falcon-error-dialog-host.component.spec.ts` (severity mapping, title fallback chain, empty-message handling, best-effort i18n). These are pure-signal/pure-function — trivially unit-testable (unlike the Stencil-element specs that can't instantiate under node-vitest).

## Missing accessibility features

- **A1 (P3):** see G1 — no `aria-live` count region.
- **A2 (P3):** the projected `<ul>` has no `aria-label`; relies on the dialog title for context. Acceptable.
- `[CODE]` **Strengths:** `closable` + `closeOnEsc` + `closeOnBackdrop` all true (keyboard + pointer dismiss), `text-start` RTL-correct, semantic list. html:13-18.

## Missing Tailwind / token parity

- **N/A** — single-render host with no token file. The only styled element uses token-backed Falcon utilities. No Shadow/`-tw` parity axis exists. (Rubric B/E N/A.)

## Performance risks

- `[CODE]` **None.** 6 `computed()`s over one signal, `OnPush`, no subscriptions/timers. Re-computes only when `state()` or the language changes. The `@for … track m + $index` (html:19) is keyed; the lists are tiny (handful of bullets). No risk.

## Visual / interaction risks

- `[CODE]` **Last-wins flash** — a rapid second failure replaces the first dialog content in place (same modal instance). Acceptable; not observed as a defect. service:36-40.
- `[INFERRED]` If the alert-dialog primitive's tokens regress, this host's chrome regresses with them — guard via the primitive's own tests, not here.

## Architecture / drift findings (B27)

- `[CODE]` **Relocation is COMPLETE and clean** — the host lives in `libs/falcon/src/shared-ui`, the barrel + library re-export are correct (index.ts:406-410), app.ts imports from `@falcon` (app.ts:15), and the scoped eslint module-boundary allowance was DELETED (eslint.config.mjs:85-97). No dangling reference to the old `falcon-ui-core/angular-wrapper` location remains. ✅ FE-CYCLE-01 Fix B verified on disk.
- `[CODE]` **Header version drift (cosmetic):** the file header says "v1.3.0 (2026-05-16)" (ts:4) but the relocation happened 2026-06-03 (ts:22). The version banner was not bumped for the move. `safe-local` doc nit.
- `[CODE]` **Doctrine comment is now slightly stale** — service header ts:7-8 says "the host component lives in libs/falcon-ui-core/angular-wrapper and is mounted in app.ts" — that location is OUTDATED post-relocation (it now lives in `libs/falcon/src/shared-ui`). `safe-local` doc nit in `error-dialog.service.ts:8`.
- **No deletion/promotion flags.** The host is the correct, single, ACTIVE sink for multi-message backend errors. Stays.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G6 | Add service + component spec coverage | P2 |
| G5 | `messagesAreKeys` flag on `ErrorDialogState` | P2 |
| G2 | Empty-message-list fallback bullet | P3 |
| G3 | Add `429`/`503` title keys | P3 |
| G1 | `aria-live` count region | P3 |

## Recommended upgrade API (concrete)

```ts
// ErrorDialogService — ErrorDialogState additions (additive, non-breaking)
export interface ErrorDialogState {
  readonly httpStatus: number;
  readonly errorMessages: readonly string[];
  readonly titleKey?: string;
  readonly subtitleKey?: string;        // NEW — override the count subtitle
  readonly messagesAreKeys?: boolean;   // NEW — declare translate intent (kills the heuristic)
}
```

## Fix-shared-vs-per-page

All gaps belong in the **shared host + service**, not per-page. The whole point of this component is that every flow funnels errors through one service + one shell-mounted host. Per-page error dialogs would re-fragment what this consolidated.

## Workarounds (if upgrade blocked)

- For G5 today: pass already-translated strings in `errorMessages` (do NOT pass raw keys that might collide).
- For G2 today: callers ensure `errorMessages.length >= 1`.
- For G6 today: rely on runtime verification (the settings/info-panel save flows are user-confirmed working).

## Deep-Dive Sweep Findings (2026-06-03 — B27)

**Consumer count: 1 render mount (app.ts) + ~6 active `ErrorDialogService` caller modules** (`[CODE]` grep `<falcon-angular-error-dialog-host>` = 1 file; `openError(` across admin+mgmt settings-tab + info-panel signals + falcon-studio).

NEW dossier (no prior version). Findings (all `safe-local` except none HIGH-RISK):
- **Clean architecture** — FE-CYCLE-01 Fix B relocation verified complete (barrel/re-export/mount/eslint all consistent).
- **No defects.** 6 doc/test/parity nits (G1–G6), 2 stale comments (header version + service doctrine line). Zero raw style literals in the host.
- **No deletion/promotion flags** — ACTIVE, correct, single sink. See FINDINGS/B27.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW) against falcon-error-dialog-host.component.ts (98 ln), .html (26 ln), error-dialog.service.ts (54 ln), app.ts, eslint.config.mjs:85-97, en.json `hierarchy.error.*`. G6 (no spec) confirmed by glob; severity-binary + best-effort-i18n + title-coverage read from ts:54/74-89. Two stale comments flagged (safe-local). No HIGH-RISK items.
