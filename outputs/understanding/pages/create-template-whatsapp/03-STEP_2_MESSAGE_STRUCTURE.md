*** Create Template (WhatsApp) — Step 2: Message Structure ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Step 2: Message Structure

## The 4 sections

### Header (optional) — BR-TM-11

Mutually exclusive choice:
- `TEXT` — string ≤60 chars, 1 variable max
- `MEDIA`:
  - `IMAGE` JPG/JPEG/PNG, max 5 MB
  - `VIDEO` MP4, max 16 MB
  - `DOCUMENT` PDF/DOC/XLS, max ~10 MB
- `LOCATION` — coords

If MEDIA selected, TEXT is DISABLED (and vice versa).

### Body (required) — BR-TM-13

- String (no fixed max documented; Meta limit is 1024 chars [INFERRED])
- Contains variables per BR-TM-06..10:
  - Variable type set ONCE: `Number` (`{{1}}, {{2}}, ...`) OR `Name` (`{{user_name}}`).
  - Numeric variables MUST be sequential from 1.
  - Name-type: lowercase + underscores + digits, double curly braces.
  - Variables CANNOT be at start or end.
  - Max 20-30 variables per body (BR-TM-10).

### Footer (optional) — BR-TM-15

- String ≤60 chars
- **NO variables allowed**

### Buttons (optional) — BR-TM-16

- Up to 10 total
- Types:
  - Quick Reply (custom labels)
  - Phone Number
  - URL
- Shape varies by category (per Meta requirements)

## Variable selection

[PRD] latest-prd.md:75 + BR-TM-12:

If Contact Group is linked (BR-TM-12), each variable can be mapped to a contact-group column.

## Preview pane (live)

Right-side panel renders the template as the user types:
- Shows resolved variable sample values (from contact-group or manual).
- Renders media thumbnails.
- Shows buttons in WhatsApp style.

[PRD] BR-TM-14. Client-side rendering vs server endpoint? OPEN (BR-TM-35).

## UI shape

```
+--------------------------------------+----------+
| Step 2 of 2 — Message Structure     | Preview  |
+--------------------------------------+----------+
|                                      |          |
|  Header (optional) [ Text | Media ]  | ┌──────┐|
|  ○ Text: [______________]            | │ ... │|
|  ○ Media: [Upload]                   | │      │|
|                                      | │ Hello│|
|  Body * [Variable type: Number ▼]   | │ John │|
|  [Textarea with {{1}}, {{2}}, ...]  | │      │|
|                                      | │ ...  │|
|  Footer (optional)                   | │      │|
|  [______________________________]   | └──────┘|
|                                      |          |
|  Buttons (up to 10)                  |          |
|  + Add Quick Reply                   |          |
|  + Add Phone Number                  |          |
|  + Add URL                           |          |
|                                      |          |
|  [← Previous]      [Finish ✓]        |          |
+--------------------------------------+----------+
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-SECTION_PREVIEW](04-SECTION_PREVIEW.md) · [05-SECTION_CONTACT_GROUP_LINK](05-SECTION_CONTACT_GROUP_LINK.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
