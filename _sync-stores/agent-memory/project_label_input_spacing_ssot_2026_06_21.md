---
name: project_label_input_spacing_ssot_2026_06_21
description: "Falcon FE label→input vertical-gap was inconsistent (0/4/6px) by control family; FIXED via one SSOT token --falcon-field-label-gap (6px) aliased across all field tokens + helpers + shared falcon-form-field wrapper + 54 page edits. nx build 3 apps GREEN. Not committed."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0d8428c3-e131-49ac-90f2-a607e49f98a5
---

Falcon web-platform-ui (`C:\Falcon\Falcon\falcon-web-platform-ui`, branch `polishing-v0.4`): the vertical gap between a field LABEL and its INPUT is inconsistent across forms (user-reported on contracts-edit "Contract Information"). Root cause is **control family**, not disabled-vs-enabled.

**Mechanism** [CODE]: for `-tw` controls the gap = the label's own `mb-[length:var(--falcon-<family>-label-margin-bottom)]` (base wrapper is a plain `flex flex-col`, no gap); Shadow CSS mirrors via `.falcon-*-label { margin-bottom: ... }`. Angular wrappers (`falcon-angular-*`) are pure tag-switchers forwarding `[label]` — no own gap. Disabled/readonly NEVER change label markup/token (only state bg/border/cursor + error color) → **one fix covers both states**.

**Drift** [CODE]: `--falcon-input/dropdown/email-field/multi-select/phone-field/textarea-label-margin-bottom = 0`; `combobox/otp = 4px`; `single-uploader/file-uploader = 6px`; `date-picker` HARDCODES 4px in two places (`date-picker-tailwind-classes.ts:48 'mb-1'` + `falcon-date-picker.css:28`); combobox `-tw` HARDCODES `mb-1` ignoring its own token. Screenshot mismatch = inputs(0px) vs date-pickers(4px) on the same grid. Spacing scale: `--falcon-spacing-1=4px`, `--falcon-spacing-1.5=6px` ([CODE] spacing.css). Shared `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html:2` uses `gap-1.5`(6px) and backs add-user/add-client/templates wizards + user-details edit → **6px is the de-facto standard**. ~30 page files hand-roll labels with ad-hoc `gap-1/1.5/2`,`mb-1/1.5` (full list in the audit output).

**IMPLEMENTED 2026-06-21 (FE-only, NOT committed, branch polishing-v0.4)**: declared `--falcon-field-label-gap: .375rem` (6px) in `libs/falcon-ui-tokens/src/primitives/spacing.css` :root; alias every single-control `*-label-margin-bottom` to it; fix combobox/-date-picker hardcoded `-tw`+Shadow to read tokens; retarget `falcon-form-field` `gap-1.5`→token; migrate page hand-rolled labels to `[label]` prop or `mb-[length:var(--falcon-field-label-gap)]`. EXCLUDE choice controls (checkbox/radio/switch = horizontal row-gap) + group/section labels + read-only horizontal detail grids. Auth/login insulated by `login-layout.component.scss:206-212` local override (won't shift). Gates: nx build all 3 apps + vitest + computed-style probe(6px) + grep exclusion proof.

Full audit (inventory + drift map + 9-step migration + risks + filesToTouch) saved by workflow `wf_b33dd5ef-121`; consolidated JSON parsed to `_plan.json` in the task output dir. Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[feedback_falcon_ui_core_layout_traps]].
