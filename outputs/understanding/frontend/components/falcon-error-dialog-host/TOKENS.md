# falcon-error-dialog-host — TOKENS

> **Single-render Angular host — there is NO component token file.** `[CODE]` No `libs/falcon-ui-tokens/src/components/falcon-error-dialog-host.tokens.css` exists, and no `.component.css`. All visual styling is inherited from the rendered `<falcon-angular-alert-dialog>` primitive's `--falcon-alert-dialog-*` token contract plus a handful of Falcon-theme Tailwind utility classes on the projected bullet list. Rubric **B/E N/A**; gate-12 (`:where()` scope) is N/A because there is no token file to scope.

## Component token file

**NONE.** This host owns no tokens. The chrome (overlay, card, header band, severity accent, button row, backdrop) is the `falcon-alert-dialog` primitive's token surface — see the `falcon-alert-dialog` dossier `TOKENS.md` for `--falcon-alert-dialog-*`.

## Token categories (declared by this component)

**Zero.** The only styled element the host authors directly is the projected `<ul>`, and it uses **Falcon Tailwind utility classes** (which themselves resolve theme tokens), not raw values.

## Tailwind utilities used by this component

`[CODE]` falcon-error-dialog-host.component.html:18 — the projected error list:

| Utility | Resolves to / purpose |
|---|---|
| `list-disc` | Bulleted list marker. |
| `ps-5` | Logical inline-start padding (RTL-safe) — `--spacing-5` (Falcon theme scale). |
| `m-0` | Reset margin. |
| `space-y-1` | Vertical gap between bullets — `--spacing-1`. |
| `text-falcon-neutral-800` | Body text color → `--color-falcon-neutral-800`. |
| `text-sm` | Body font size → Falcon `--text-sm`. |
| `leading-relaxed` | Line-height. |
| `text-start` | Logical text alignment (RTL-safe). |

> All eight are token-backed Falcon utilities — **no raw hex / px / rgb** appears anywhere in the host (template OR TS). The only color literal in the whole feature is inside the alert-dialog primitive, not here.

## Related Falcon theme tokens

| Falcon theme token | Used by this host via |
|---|---|
| `--color-falcon-neutral-800` | `text-falcon-neutral-800` on the bullet list. |
| `--spacing-1`, `--spacing-5` | `space-y-1`, `ps-5`. |
| `--text-sm` | `text-sm`. |
| `--falcon-alert-dialog-*` (entire family) | Inherited through the embedded `<falcon-angular-alert-dialog>` (overlay, card, severity accent, OK button). |

## Tailwind utility guidance for this component

There is nothing for a consumer to override on the host. If the dialog chrome needs visual change, override the `--falcon-alert-dialog-*` tokens at the primitive (host-class or `:root`-scoped per gate-12). The bullet list is intentionally minimal; do not add per-instance Tailwind overrides to it (there is no API to do so — it is fixed markup).

## Dark mode support

`[CODE]` Purely inherited. The bullet text `text-falcon-neutral-800` flips with the theme's `.app-dark` neutral inversion (`falcon-tailwind-tokens.css` dark block); the dialog chrome dark-mode is the alert-dialog primitive's responsibility. **No per-host dark override needed or present.**

## Density support

**N/A** — the host has no density axis. The alert-dialog primitive carries its own sizing (`size="md"` is pinned by the host, html:11).

## RTL support

- `[CODE]` The host is RTL-correct by construction: `ps-5` (logical padding, not `pl-5`) + `text-start` (logical alignment, not `text-left`) on the bullet list. html:18.
- The dialog `position="center"` (html:12) is direction-agnostic.
- Overlay/card RTL behavior is inherited from the alert-dialog primitive.

## Static style risks

- `[CODE]` **NONE in the host.** No `.component.css`, no inline `style=`, no raw hex/px/rgb in the template or TS. The eight utility classes on the `<ul>` are all token-backed. (Contrast with `otp-dialog`, the other B27 unit, which carries an inline `<style>` block + many literal px — this host is clean.)
- `[INFERRED]` The ONLY indirect risk is upstream: if the alert-dialog primitive's tokens drift, this host's chrome drifts with it — but that is the primitive's concern, audited in its own dossier.

## No CSS / no SCSS guidance

- ✅ Already compliant: no SCSS, no `.component.css`, Tailwind-utility-only on the one styled element.
- Consumers must NOT add CSS to restyle the host — there is no host-class hook for it. Override the alert-dialog tokens instead.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Severity = warning (422) | `severity='warning'` → alert-dialog primitive's `--falcon-alert-dialog-*` warning accent. `[CODE]` ts:74-78 + html:8. |
| Severity = danger (all other 4xx/5xx) | `severity='danger'` → primitive's danger accent. |
| Body text | `--color-falcon-neutral-800` (via `text-falcon-neutral-800`). `[CODE]` html:18. |
| Spacing | `--spacing-1` / `--spacing-5` (via `space-y-1` / `ps-5`). |
| Overlay / backdrop / card / OK button | **Inherited** from `--falcon-alert-dialog-*` (primitive). |

## Verification
🟡 CODE-DERIVED 2026-06-03 (B27, NEW). Confirmed NO token file + NO `.component.css` exist for this slug (glob returned only ts/html/index). The 8 Tailwind utilities read verbatim from html:18; all are token-backed Falcon utilities (no raw literals). Dialog-chrome token inheritance is structural (`severity`/`size` pinned via html:8/11) — the `--falcon-alert-dialog-*` family detail lives in the alert-dialog dossier, not re-audited here.
