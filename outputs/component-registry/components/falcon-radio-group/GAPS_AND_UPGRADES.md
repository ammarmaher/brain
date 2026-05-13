# falcon-radio-group — GAPS AND UPGRADES

## Missing capabilities

### G1 — No per-option template / description (P1)

Same as checkbox-group — label-only options. No per-option icon, description, helper.

### G2 — `errorText` vs `errorMessage` (P2)

### G3 — No "card" / boxed radio variant (P2)

For card-style radios (icon + title + description, often used in pricing tier UIs), Falcon offers `<falcon-angular-tabs mode='radio-cards'>` instead. There's no radio-group card variant. Worth documenting and considering whether to add `appearance: 'plain' | 'card'`.

### G4 — No required marker on group label (P2)

Same as checkbox-group.

### G5 — No orientation='grid' (P3)

Same as checkbox-group.

### G6 — No arrow-key roving focus contract documented (P3)

Stencil-side may implement this; verify.

### G7 — No `iconUrl` per option (P3)

For brand / language pickers, add `iconUrl?` parity with dropdown.

## Missing accessibility

- Verify `role="radiogroup"` + `aria-labelledby` from groupLabel.
- Verify arrow-key roving focus.

## Missing tests

- No spec located.

## Missing Tailwind / token parity

- Verify Stencil-pair parity since Angular composition is the active path.

## Performance risks

- None typical at < 50 options.

## Visual / interaction risks

- Horizontal orientation with long labels can wrap awkwardly.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Per-option description / template | P1 |
| G3 | Card variant | P2 |
| G2 | `errorMessage` alias | P2 |
| G4 | Required marker | P2 |
| G7 | `iconUrl` per option | P3 |
| G5 | Grid orientation | P3 |

## Concrete upgrade API

```ts
export interface FalconRadioGroupOption {
  value: string | number | boolean;
  label: string;
  description?: string;
  iconUrl?: string;
  disabled?: boolean;
}

@Input() appearance: 'plain' | 'card' = 'plain';
@Input() errorMessage?: string;
@ContentChild(FalconRadioGroupItemTemplateDirective) itemTpl?;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G3: use `<falcon-angular-tabs mode='radio-cards'>` instead.
- For G1: pre-format label.
