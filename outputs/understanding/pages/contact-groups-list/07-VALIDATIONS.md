*** Contact Groups List — Validations ***
*** 2026-05-18 ***

# Contact Groups List — Validations

## V-rules (list/detail/edit mode only)

| V-rule | Where | Effect |
|---|---|---|
| `V-contact-group-name-required` | FE edit panel | required, non-empty |
| `V-contact-group-name-unique-per-node` (async) | NEW UI suggestion | check `name` unique per account on save |

> The CREATE wizard validations (column-name rules per BR-CGM-06, file-size, etc.) live in `pages/create-contact-group/07-VALIDATIONS.md`.

## No async validators in old-UI list

[CODE] 06-VALIDATIONS.md: "1 sync validator (name required), no async validators (note: the wizard async validator lives in management-console, not here)".

## See also

- `../create-contact-group/07-VALIDATIONS.md` · [05-SECTION_EDIT_PANEL](05-SECTION_EDIT_PANEL.md)
