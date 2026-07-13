# falcon-select — USAGE

> Sweep-refreshed 2026-06-03 (B04). Consumer Sweep re-run: 0 real consumers of the alias; the barrel is a flagged DEAD CANDIDATE.

## Real usage examples

The HTML tag is `<falcon-angular-dropdown>` regardless of which TS class name is imported. Examples are identical to `<falcon-angular-dropdown>` usage — see `../falcon-dropdown/USAGE.md`.

### Example — TS import using the "Select" alias (theoretical — no production usage)

```ts
import { FalconAngularSelectComponent, FalconSelectOption } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularSelectComponent], // alias of FalconAngularDropdownComponent
})
export class MyFormComponent {
  countries: FalconSelectOption[] = [/* ... */];
}
```

```html
<!-- HTML tag is still falcon-angular-dropdown -->
<falcon-angular-dropdown
  [label]="'Country'"
  [options]="countries"
  [searchable]="true"
  [(ngModel)]="selectedCountry">
</falcon-angular-dropdown>
```

## Recommended usage for NEW Angular pages

- **Prefer `FalconAngularDropdownComponent`** (matches the HTML tag) — the alias is a DEAD CANDIDATE and adds nothing at runtime.
- Only reach for the `Select` import name if a spec-name reference is mandated; even then the template tag is `<falcon-angular-dropdown>`.

## Reactive Forms / ngModel / Tailwind-only / Token usage

Identical to dropdown — see `../falcon-dropdown/USAGE.md`.

## Bad usage to avoid

- Do NOT expect a `<falcon-angular-select>` HTML tag — it doesn't exist.
- Do NOT use native `<select>` — this alias is for the custom-popover dropdown.
- Do NOT introduce NEW imports of `FalconAngularSelectComponent` — it is flagged for removal; use `FalconAngularDropdownComponent`.

## Do / Don't

| Do | Don't |
|---|---|
| Use the HTML tag `<falcon-angular-dropdown>`. | Try `<falcon-angular-select>`. |
| Import `FalconAngularDropdownComponent`. | Add new `FalconAngularSelectComponent` imports (dead candidate). |

## Consumer Sweep (2026-06-03)

`[CODE]` `Grep "falcon-angular-select|FalconAngularSelectComponent"` across the repo returned **3 files**:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts` — the dead-candidate re-export itself.
- `libs/falcon-ui-core/WAVE-5-GAP-CLOSE.md` — the doc that introduced the alias.
- `apps/management-console/.../contracts-cost-management/.../contracts-rate-card-section/contracts-rate-card-section.component.ts` — appears **only in a banner comment** describing the wave brief (line ~32: "…the donor's native `<select>` + bespoke … `falcon-angular-select`…"). The component's actual template uses `<falcon-angular-dropdown>` (same file matches the dropdown grep).

→ **Direct `<falcon-angular-select>` consumers: 0. Real `FalconAngularSelectComponent` imports: 0.** The aliased `<falcon-angular-dropdown>` is used in 57 files.

Action: leave the alias for now (removal is queued/`verify before removal` per the source flag); migrate any future naming to `<falcon-angular-dropdown>`.

## Verification
🟢 grep-verified 0 real consumers (2026-06-03). Examples 🟡 inherited from dropdown. 🟢 RE-VERIFIED 2026-06-03 (W1-b): `<falcon-angular-select>` HTML tag = 0 occurrences across `apps/` + `libs/falcon/` (the tag does not exist); DEAD-CANDIDATE status holds.
