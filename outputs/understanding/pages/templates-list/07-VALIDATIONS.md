*** Templates List — Validations ***
*** 2026-05-18 ***

# Templates List — Validations

## V-rules

| V-rule | Where | Effect |
|---|---|---|
| `V-template-name-format` | enforced at Create wizard (not list) | a-z, 0-9, _ only · ≤Nchars · BR-TM-XX |
| `V-template-name-unique-per-channel-per-language` | async at Create wizard | uniqueness per (CommChannel × language) |
| `V-template-list-filter-syntax` | FE | filter inputs match enum values |

## See also

- `../create-template-whatsapp/07-VALIDATIONS.md` — full Create validations
