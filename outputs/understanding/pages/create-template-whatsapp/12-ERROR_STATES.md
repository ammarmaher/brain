*** Create Template (WhatsApp) — Error states ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Error States

## Per-action errors (proposed)

| FalconKey | Origin | UX |
|---|---|---|
| `Error.Template.NameInvalid` | a-z/0-9/_ violation | Inline error on name |
| `Error.Template.NameDuplicate` | uniqueness fail (async) | Inline + "Try another name" |
| `Error.Template.CategoryRequired` | empty | Inline |
| `Error.Template.HeaderMutuallyExclusive` | text + media both set | Inline |
| `Error.Template.HeaderTextTooLong` | >60 chars | Inline |
| `Error.Template.MediaTooLarge` | exceeds size | Inline |
| `Error.Template.BodyVariablesAtEdges` | starts or ends with variable | Inline |
| `Error.Template.BodyVariablesNotSequential` | gaps in {{1}}, {{2}}... | Inline |
| `Error.Template.BodyTooManyVariables` | >30 | Inline |
| `Error.Template.FooterContainsVariable` | variable in footer | Inline |
| `Error.Template.ButtonsExceedLimit` | >10 | Inline |
| `Error.Template.MarketingPolicyViolation` | post-Meta check | Toast with Meta reason |

## See also

- [07-VALIDATIONS](07-VALIDATIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
