# falcon-mobile-number (LEGACY FACADE) — OVERVIEW

## Purpose
Wave 2 façade that preserves the legacy `<falcon-mobile-number>` public selector + inputs/outputs. Internally delegates render + bindings to `<falcon-angular-phone-field>` (Falcon UI core Stencil component) — replaces `ngx-intl-tel-input` + `google-libphonenumber` + `intl-tel-input` (both uninstalled in Wave 2).

Acts as a translation boundary:
- Inbound: a legacy E.164 string OR a legacy `{ e164Number, dialCode }` object.
- Outbound: emits a recomposed E.164 string from `<falcon-phone-field>`'s component-detailed event (`{ value, country, dialCode, nationalNumber }`).

## Business / UI use case
- Any consumer template that still references `<falcon-mobile-number>` (legacy contact phone fields in old wizards).

## When to use it / when NOT to use it
- ONLY use this for templates that still call `<falcon-mobile-number>`.
- For NEW code, use `<falcon-angular-phone-field>` directly. The legacy `preferredCountries`, `defaultCountry`, `showDialCode`, `maxLength`, `useCustomStyle` inputs are kept for API compat but most are silent no-ops on the Falcon component.

## Status
- **LEGACY FACADE (Wave 2).** Compile-only compatibility shim.
- Slated for deletion after consumers migrate to `<falcon-angular-phone-field>`.

## Selector / Tags
- `<falcon-mobile-number>` (ESLint disabled — non-standard selector prefix).
- No Stencil tag.

## Source paths
| Layer | Path |
|---|---|
| Component class | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` |
| Template | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.html` |
| SCSS | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.scss` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/index.ts` |

## Known consumers
- _Verify with grep._ Listed in `FALCON_COMPONENT_REGISTRY.md` as a legacy bespoke; FRONTEND_COMPONENT_REGISTRY says "likely superseded by falcon-angular-phone-field". No production consumers spotted in this audit; needs full project grep.

## Related components
- `<falcon-angular-phone-field>` — the modern dual-render-path replacement.

## Ownership / Responsibility
- Legacy `libs/falcon/src/shared-ui/`.
- Maps legacy E.164 string → component-detailed events on the Falcon component, and back again.
- Owns its own local dial-code → ISO-2 lookup (`ISO2_TO_DIAL`) so it doesn't reintroduce `google-libphonenumber`.
