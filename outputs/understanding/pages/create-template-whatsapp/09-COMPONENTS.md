*** Create Template (WhatsApp) — Components ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Components

## Component tree

```
CreateTemplateWhatsAppWizard
├── <falcon-stepper>
│   ├── Step 1: Basic Info
│   │   ├── <falcon-input> name (async validator)
│   │   ├── <falcon-select> category
│   │   ├── <falcon-select> subCategory (cascaded)
│   │   ├── <falcon-select> language
│   │   └── <falcon-input> referenceId
│   └── Step 2: Message Structure (with preview split)
│       ├── Left side:
│       │   ├── <falcon-radio> header type (text/media/location/none)
│       │   ├── <falcon-input> header text (if type=text)
│       │   ├── <falcon-uploader> header media (if type=media)
│       │   ├── <falcon-textarea> body
│       │   ├── <falcon-radio> variable type (Number / Name)
│       │   ├── <falcon-input> footer
│       │   └── Buttons section (add/remove rows)
│       └── Right side:
│           └── <falcon-whatsapp-preview> (NEW — needs to be built)
└── <falcon-button> Cancel · Previous · Next · Finish
```

## NEW Falcon components needed

- `<falcon-whatsapp-preview>` — renders a WhatsApp-style message bubble with header, body, footer, buttons.

## Existing Falcon components used

- `<falcon-stepper>`, `<falcon-input>`, `<falcon-select>`, `<falcon-radio>`, `<falcon-textarea>`, `<falcon-uploader>`, `<falcon-button>`.

## See also

- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md) · [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) · [04-SECTION_PREVIEW](04-SECTION_PREVIEW.md)
