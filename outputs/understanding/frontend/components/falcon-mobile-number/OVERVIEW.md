# falcon-mobile-number (LEGACY FACADE — REMOVED) — OVERVIEW

> **RECONCILE 2026-06-03 (B22):** This component has been **DELETED from the source tree.** The legacy façade documented below shipped in Wave 2 and was slated for deletion "after consumers migrate to `<falcon-angular-phone-field>`." That migration is now complete and the façade folder is gone. This dossier is retained as a **historical record + migration map**, with status corrected to REMOVED. Everything below the "Historical record" line describes the component as it last existed; the live-code verdict is in this header and in `GAPS_AND_UPGRADES.md` / `DECISION.md`.

## Live-code status (2026-06-03)

- `[CODE]` `Glob libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/**` → **No files found.** The folder no longer exists.
- `[CODE]` `Grep "<falcon-mobile-number"` across the repo (excluding `dist/`) → **0 live consumers.** The only residual hit is a historical planning doc `docs/_plans/W21-W25-wizard-roadmap.md:109` ("Existing `<falcon-mobile-number>` for phone input") + archived `docs/archive/WAVE-A-OLD-STRUCTURE.md` DEP lists — neither is source.
- `[CODE]` The barrel `libs/falcon/src/shared-ui/index.ts` no longer re-exports `FalconMobileNumberComponent` (grep clean; the only phone export is `FalconAngularPhoneFieldComponent` at index.ts:343).
- `[CODE]` **Migration evidence:** the Wave-7 sole consumer `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` now renders `<falcon-angular-phone-field>` (lines 60-71, migration comment "Wave B/C: saudiPhoneValidator country=SA … phone field emits composed E.164"). The last consumer migrated → the façade was deleted.

**Verdict: DEPRECATED → REMOVED. Migration target `<falcon-angular-phone-field>` is live. Safe — deprecation already executed; nothing blocks removal because removal is done. NO HIGH-RISK-QUEUE item.**

---

## Historical record (component as it last existed)

## Component purpose
Wave 2 façade that preserved the legacy `<falcon-mobile-number>` public selector + inputs/outputs. Internally delegated render + bindings to `<falcon-angular-phone-field>` (Falcon UI core Stencil component) — replaced `ngx-intl-tel-input` + `google-libphonenumber` + `intl-tel-input` (all uninstalled in Wave 2).

It acted as a **translation boundary**:
- Inbound: a legacy E.164 string OR a legacy `{ e164Number, dialCode }` object.
- Outbound: emitted a recomposed E.164 string from `<falcon-phone-field>`'s component-detailed event (`{ value, country, dialCode, nationalNumber }`).

> **Single-render legacy Angular** — this was a bespoke Angular standalone component in `libs/falcon/src/shared-ui`, **NOT a Stencil dual-render component**. There was NO Shadow tag, NO `-tw` Light-DOM twin, and NO `libs/falcon-ui-tokens` token file of its own (it inherited tokens from the embedded `<falcon-angular-phone-field>`). The B/C/E rubric dimensions that assume a Stencil twin do not apply; this is called out throughout.

## Business / UI use case
- Any consumer template that still referenced `<falcon-mobile-number>` (legacy contact phone fields in old wizards / the forgot-password flow).

## When to use it / when NOT to use it
- (Historical) ONLY for templates that still called `<falcon-mobile-number>`.
- For ALL code today, use `<falcon-angular-phone-field>` directly. The legacy `preferredCountries`, `defaultCountry`, `showDialCode`, `maxLength`, `useCustomStyle` inputs were kept for API compat but most were silent no-ops on the Falcon component.

## Status
- **REMOVED (2026-06-03).** Was a LEGACY FACADE (Wave 2) compile-only compatibility shim; deleted after the last consumer migrated.

## Replaces
- Legacy `ngx-intl-tel-input` + `google-libphonenumber` + `intl-tel-input` phone field (all uninstalled Wave 2).

## Migration target (replaced BY)
- `<falcon-angular-phone-field>` (`FalconAngularPhoneFieldComponent`, exported from `libs/falcon/src/shared-ui/index.ts:343`) — the modern dual-render-path (`<falcon-phone-field>` Shadow + `<falcon-phone-field-tw>` Light) CVA wrapper with built-in searchable country chooser, single shared border, dial code, and `falcon-verify` event.

## Source file paths (as last present — now DELETED)
| Layer | Path (no longer exists on disk 2026-06-03) |
|---|---|
| Component class | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` |
| Template | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.html` |
| SCSS | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.scss` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/index.ts` |

> `[CODE]` 2026-06-03 — every path above returns "No files found" via Glob. There is no Stencil layer, no `-tw` twin, and no `libs/falcon-ui-tokens/src/components/mobile-number.tokens.css` (none ever existed — façade inherited the phone-field tokens).

## Selectors / tags
| Layer | Tag / selector |
|---|---|
| Angular selector (deleted) | `falcon-mobile-number` (ESLint disabled — non-standard selector prefix) |
| Stencil tag | _None — single-render Angular, no Stencil twin._ |

## Known consumers (grep verified 2026-06-03)
- **0 live consumers.** `[CODE]` `Grep "<falcon-mobile-number"` (non-`dist`) returns only the historical roadmap/archive docs noted above.
- Wave 7 (2026-05-17) had **2**: `forgot-password-flow.component.html` (now migrated to `<falcon-angular-phone-field>`) + the component's own template (deleted with the folder).

## Related components
- `<falcon-angular-phone-field>` — the modern replacement (migration target).
- `<falcon-angular-email-field>` — sibling single-element verify-field (parallel pattern).

## Ownership / responsibility
- Was legacy `libs/falcon/src/shared-ui/`. Mapped legacy E.164 string ⇄ component-detailed events on the Falcon phone-field, and owned a local dial-code → ISO-2 lookup (`ISO2_TO_DIAL`, 25 countries) so it didn't reintroduce `google-libphonenumber`. Ownership now retired.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22 RECONCILE). Component **confirmed DELETED** (Glob of the folder = empty; repo-wide grep of `<falcon-mobile-number>` = 0 live source/consumers; barrel no longer exports `FalconMobileNumberComponent`). Migration target `<falcon-angular-phone-field>` confirmed live + the sole Wave-7 consumer confirmed migrated. Historical-record section 🟡 CODE-DERIVED from the prior Wave-2/Wave-7 dossier (source no longer on disk to re-read).
