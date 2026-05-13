# falcon-otp-send-dialog — GAPS AND UPGRADES

## Missing capabilities

### G1 — No method proxies (P2)

No `goToStep1()` / `goToStep2()` / `reset()` on wrapper.

### G2 — Validation deferred — no built-in code validation (P2)

Documented. Acceptable but worth emphasising — parent must validate.

### G3 — Hardcoded copy strings (P2)

All labels (titles, button labels, subtitle) are input strings but defaults are English. i18n hooks would be cleaner — accept `TranslateKey` rather than already-translated string.

**Recommended fix:** allow inputs to be either string OR translate key (with internal translation if available).

### G4 — No resend cooldown timer (P1)

After resend, no built-in 30s countdown to disable resend button. Consumers must implement externally.

**Recommended fix:** add `@Input() resendCooldownSeconds = 0` + internal countdown + disabled state during.

### G5 — No "code expired" state (P2)

If code expires, no built-in UI hint. Add `@Input() codeExpired = false` + visual.

### G6 — kebab-case Outputs (P3)

`falcon-send`, `falcon-verify`, etc. — same as email/phone field. Add camelCase aliases.

### G7 — Step 2 doesn't show channel reminder (P3)

Step 2 shows OTP boxes but doesn't recap which channel sent the code. Add subtitle interpolation.

### G8 — No "Help / wrong number" link in step 2 (P3)

Common UX. Add optional `helpLink` input.

## Missing accessibility

- Verify focus moves to first OTP box on step 2 entry.
- Verify resend / cancel buttons have correct labels.

## Missing tests

- No spec located.

## Missing Tailwind / token parity

- Inherits dialog parity.

## Performance risks

- None.

## Visual / interaction risks

- Step transition animation — verify Stencil-side.
- Cancel mid-step — verify state reset.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G4 | Resend cooldown timer | P1 |
| G2 | Document validation deferral | P2 |
| G3 | Translate key support | P2 |
| G1 | Method proxies | P2 |
| G5 | Code-expired state | P2 |
| G7 | Channel recap in step 2 | P3 |
| G6 | camelCase outputs | P3 |

## Concrete upgrade API

```ts
@Input() resendCooldownSeconds = 0;
@Input() codeExpired = false;
@Input() helpLink?: string;
@Input() showChannelRecap = true;
@Output() send = new EventEmitter<...>();         // alias
@Output() verify = new EventEmitter<...>();
@Output() resend = new EventEmitter<...>();
@Output() cancel = new EventEmitter<void>();
async goToStep1(): Promise<void>;
async goToStep2(): Promise<void>;
async reset(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G4: external timer + disable resend via parent state.
- For G3: pre-translate labels via TranslateService before passing.
- For G5: when expired, show toast/notification externally + reset state.
