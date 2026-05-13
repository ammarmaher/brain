*** Drive Folder Rules — prd-knowledge ***
*** Expected structure of the Falcon PRD Drive folder ***

# Drive Folder Rules

## Root

`https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`

## Expected layout

```
Falcon PRDs/
  <Module Name>/
    PRD-v<X.Y>.docx | PRD.gdoc          <- canonical PRD doc
    Attachments/
      images/*.{png,jpg,svg}
      excel/*.xlsx
      word/*.docx
      diagrams/*.{drawio,svg,png}
    Archive/                            <- prior versions (optional)
```

## Module slug rule

Folder name → kebab-case slug.
- `Account Management` → `account-management`
- `Contact Group` → `contact-group`
- `Charging V2` → `charging-v2`

## Canonical PRD detection

Pick the file that matches (in order of preference):
1. Filename matches `PRD-v<X.Y>.docx`
2. Filename starts with `PRD`
3. Single `.docx` or `.gdoc` at module root
4. If ambiguous → STOP and ask user

## Version detection

- Explicit: `PRD-v1.5.docx` → version `1.5`
- Implicit: file modified date if no version in filename
- Tracked in `modules/<slug>/source-map.json`

## Attachments handling

See [attachment-rules.md](./attachment-rules.md).

## Archive handling

`Archive/` folders are NOT processed by sync. Latest only.
