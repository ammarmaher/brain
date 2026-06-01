---
name: project_settings_radio_disabledinput_fix_2026_05_31
description: "Settings-tab Password-Security Normal/Advanced radios were clickable in view/disabled mode — fixed by adding a disabledInput @Input to falcon-angular-radio and binding it. Build-green, NO COMMITS."
metadata: 
  node_type: memory
  type: project
  originSessionId: 09cb90fe-d836-4228-9254-893a04f234aa
---

🟢 DONE 2026-05-31 (code-read + 2 app builds GREEN, NO COMMITS, branch polishing-v0.4). Repo `C:/Falcon/Falcon/falcon-web-platform-ui`.

**Symptom (user-reported):** On the Settings tab, in view/disabled mode the "Normal / Advanced" Password-Security toggle cards were still clickable — the selection visibly moved and **two cards could show selected at once** ("should be a group of toggles, only one selected").

**ROOT CAUSE (code-proven):** the radio was never actually disabled.
- `[CODE]` `settings-tab.component.html` (admin+mgmt) guarded the cards with only (a) cosmetic `cursor-not-allowed`/`opacity-55` classes (no `pointer-events:none`) and (b) a `(valueChange)` short-circuit that blocks only the **model write**, not the click. The `data-readonly` host attr (settings-tab.component.ts) has NO matching CSS — dead hook.
- `[CODE]` `falcon-radio.component.ts` (the `falcon-angular-radio` Angular wrapper) **exposed no `disabled` @Input**. Its internal `disabled` signal was reachable ONLY via CVA `setDisabledState()`, which never fires on the `[checkedInput]` bypass path the settings-tab uses → `disabled` stuck `false` → Stencil `<falcon-radio-tw>` `[attr.disabled]=null` → native `<input type=radio>` fully enabled.
- `[CODE]` wrapper `handleChange()` then **unconditionally** ran `this.checked$.set(next)` on every click → flipped the card's visual (the painted mark is driven by `checked$`, not the `opacity-0` native input — `radio-tailwind-classes.ts`/`radio.tokens.css`). Model never changed → `[checkedInput]` expr didn't change → visual never corrected. Each card is an INDEPENDENT wrapper (not a `falcon-radio-group`), so clicking one never cleared the sibling's `checked$` → both stayed lit.
- The Stencil `falcon-radio-tw` ALREADY supports disabling correctly (`disabled` prop:56, `handleInputChange` guard:109-112 `if(this.disabled){preventDefault;return}`, native `disabled`:177). Defect was purely **plumbing** — disabled never reached the web component.

**FIX (4 edits, additive/backward-compatible):**
1. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/falcon-radio.component.ts` — add `@Input() set disabledInput(next){ this.disabled.set(!!next); }` mirroring the existing `checkedInput` CVA-bypass pattern.
2. same file — harden `handleChange()`: `if (this.disabled()) return;` (defense-in-depth: no self-flip / no emit for keyboard/programmatic paths).
3. `apps/management-console/.../settings-tab/settings-tab.component.html` — add `[disabledInput]="readonly() || !pesFlags().canEditSecurity"` on `<falcon-angular-radio>`.
4. `apps/admin-console/.../settings-tab/settings-tab.component.html` — same.

**Result:** in view mode (`readonly`) or for roles without `canEditSecurity`, the native radio is genuinely `disabled` (native disabled + `aria-disabled`) → no mouse click, no keyboard activation; no change event fires → model-driven `[checkedInput]` keeps EXACTLY ONE selected. Edit mode unchanged (model change still propagates to both cards → single-selection already worked there).

**KEY traps / reusable facts:**
- `@falcon/ui-core/angular` is SOURCE-aliased (`tsconfig.base.json:76-78` → `libs/falcon-ui-core/src/angular-wrapper/index.ts`) → editing the wrapper `.ts` is compiled by the app build; **no separate Stencil/lib build needed** (didn't touch any `.tsx`).
- **HARD RULE for any `falcon-angular-radio` consumer using the `[checkedInput]` (non-CVA) path in a view/disabled context: you MUST bind `[disabledInput]`** — CSS `cursor-not-allowed`/`opacity` and `(valueChange)` guards do NOT make it inert.
- Disabled-checked still renders the 5px selected ring (`radio.tokens.css:110`) but border-color flips grey `#d1d5db` (`:120`) → selected card stays identifiable (thick grey ring + non-dimmed label vs thin ring + `opacity-55` unselected). Muted = correct disabled convention.
- `disabledInput` is optional default-false → other consumers (Add-Client wizard `client-settings-step`, templates wizard `step1-basic-info`/`flow-type-modal`, `user-permissions-step`, `wallet-balance-management`, falcon-studio) are unaffected.
- Builds: `nx build {admin,management}-console --configuration=development --skip-nx-cache` + `UV_THREADPOOL_SIZE=256` → both exit 0 (only pre-existing unrelated "unused file" warnings).

**Residual / follow-up:** runtime browser verification on host-shell (view-mode inert + exactly one selected; edit-mode still toggles) NOT yet done in-session — recommended before sign-off (do NOT claim runtime-tested without it). NO COMMITS made. Related [[project_mgmt_account_limitations_view_only_2026_05_31]] · [[project_settings_tab_per_section_view_gating_2026_05_30]].
