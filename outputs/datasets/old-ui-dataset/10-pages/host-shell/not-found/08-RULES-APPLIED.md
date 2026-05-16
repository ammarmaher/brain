# Rules / patterns — not-found

## Observed (good)
- Tiny standalone component, no over-engineering.
- Uses a real asset (`under-construction.png`) so it visually identifies as a placeholder.

## Observed (bad — would be flagged by the night-shift digest)
- **PrimeNG `<button pButton>`** + `pi pi-home` icon — would be `<falcon-button>` and `<falcon-icon>` in the new build.
- **Hardcoded English copy** — no i18n.
- **Hardcoded "/shell" destination** — pre-supposes `/shell` exists; `/shell` is currently the Demo `ShellComponent`, not the actual dashboard. Should navigate to `/`.
- **Uses `p-button-rounded`, `p-button-primary`, `mt-3`** classes — mix of PrimeNG button classes and a Bootstrap-style margin utility (`mt-3`). Indicates the project once depended on Bootstrap or used `mt-3` as a Tailwind/PrimeFlex alias.

## Patterns worth porting
- Trivial route components should always be reachable independently of guards (this one is, correctly).

## Anti-patterns to NOT port to new theme
- Three independent error-style pages with different visual treatments. Consolidate.
- `/shell` as the "home" destination — it's confusing. New build should use `/` (dashboard) or `/home`.
