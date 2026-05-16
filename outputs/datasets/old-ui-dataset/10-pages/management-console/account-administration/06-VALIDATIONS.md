# Validations — account-administration

## Form validators (sync)

### Add/Edit node drawer (organization-hierarchy.component.html)
| Form field | Validator | Source file:line |
|---|---|---|
| `nodeName` (input) | `maxlength="32"` (HTML attribute) | `organization-hierarchy.component.html:121` |
| Save button | `[disableSave]="!nodeName.trim()"` (cannot submit empty) | `organization-hierarchy.component.html:101` |

Save handler (`handleDrawerAction`):
- Guards: `!selectedNode || !selectedNode.label || !selectedNodeId` → return
- Guards: empty `.trim()` name → return

### InformationComponent (template form via `NgForm`, no FormBuilder)
| Form field | Validator | Source |
|---|---|---|
| `accountName`, `entityName` etc. | `FalconStartWithLetterMax30Directive` (must start with letter, ≤30 chars) | `information.component.ts:25,51` |
| Country / City | `AutoComplete` with min-length-2 server query (`loadCities`) — `q.length > 0 && q.length < 2` early-exits | `information.component.ts:275-280` |

### HierarchyTab inline form (NgForm `#infoForm`)
```typescript
// hierarchy-tab.component.ts:308-319
onSave(form: NgForm): void {
  if (!form?.valid) {
    Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
    return;
  }
  if (!this.selectedNodeId) return;
  ...
}
```
- Uses standard Angular Reactive/Template-driven validation
- `FalconFormValidateDirective` registered in imports → applies Falcon-styled error display

### NodeSettingsTabComponent — IP input
| Field | Validator | Message key | Source file:line |
|---|---|---|---|
| `currentIPInput` (FormControl, `nonNullable: true`) | `isValidIpv4(ip) || isValidIpv6(ip)` | `settingsStep.invalidIpError` (errors: `{ invalidIp: true }`) | `node-settings-tab.component.ts:303-309` |
| `currentIPInput` (FormControl) | Duplicate check vs `settingsModel.securitySettings.allowedIps` (case-insensitive) | `settingsStep.duplicateIpError` (errors: `{ duplicateIp: true }`) | `node-settings-tab.component.ts:314-320` |

```typescript
// node-settings-tab.component.ts:297-328 (addCurrentIP)
addCurrentIP(): void {
  const ip = this.currentIPInput.value.trim();
  this.ipInputError = null;
  if (!ip) return;
  if (!isValidIpv4(ip) && !isValidIpv6(ip)) {
    this.setIpError(this.translateService.translate('settingsStep.invalidIpError'), { invalidIp: true });
    return;
  }
  const list = (this.settingsModel.securitySettings.allowedIps ??= []);
  const normalized = ip.toLowerCase();
  if (list.some(x => x.toLowerCase() === normalized)) {
    this.setIpError(this.translateService.translate('settingsStep.duplicateIpError'), { duplicateIp: true });
    return;
  }
  this.settingsModel.securitySettings.allowedIps = [...list, ip];
  ...
}
```

### NodeSettingsTabComponent — Quotas
- `InputNumberModule` is used (HTML — `<p-inputNumber>`), but no min/max validators declared in `.ts`. Quotas accept any non-negative number; backend may impose limits.

### CommChannel/Apps tabs — inline price edit
| Field | Rule | Source file:line |
|---|---|---|
| `editingPriceType` + `editingEffectiveDate` | Both required for save | `comm-channels-services-tab.component.ts:482-494` & `apps-services-tab.component.ts:478-488` |
| `editingPriceValue` | Not null/undefined | `comm-channels-services-tab.component.ts:530-545` & `apps-services-tab.component.ts:528-541` |
- Errors shown via `MessageService.add({ severity: 'warn', detail: 'Please fill all required fields' })`

## Async validators
**None** detected in this feature.

## Business rules captured in code (cross-field / conditional)

### Tab enablement matrix
| Tab | Root selection enabled-by | Child node enabled-by | Source |
|---|---|---|---|
| Hierarchy | always | always | `organization-hierarchy.component.ts:572-578` |
| CommChannels & Services | `canViewServices` | hidden | `organization-hierarchy.component.ts:580-586` |
| Apps & Services | `canViewServices` | hidden | `organization-hierarchy.component.ts:587-593` |
| Settings | `canViewAccountSettings` | `canViewOrgSettings` | `organization-hierarchy.component.ts:594-602` |

### User-list role filter (different roles per node type)
```typescript
// org-hierarchy.api.service.ts:94-96 (getListForNode)
const roles = nodeId === FALCON_ROOT_NODE.id
  ? [...SYSTEM_USER_ROLES]   // Falcon root → system roles
  : [...ACCOUNT_USER_ROLES]; // Otherwise → account roles
```

### Falcon user vs Client user — root loading divergence
```typescript
// organization-hierarchy.component.ts:213-227
const roots$ = this.isFalcon
  ? of<OrgHierarchyNode[]>([])
  : this.apiService.getRootNodes();
// ...
const rootNodeData = this.isFalcon ? FALCON_ROOT_NODE : nodes[0];
```
Falcon users skip the API roots fetch (they use a synthetic `FALCON_ROOT_NODE`).

### Falcon-user-only visibility toggle
```typescript
// apps-services-tab.component.ts:644-661 / comm-channels-services-tab.component.ts:647-664
private initializeColumns(): void {
  const isFalconUser = sessionProvider.session?.userType === USER_TYPE_STRINGS.FALCON_USER;
  this.columns = [];
  if (isFalconUser) {
    this.columns.push({ header: 'visibility', template: this.visibilityTemplate });
  }
  this.columns.push(/* name, priceType, priceValue, dates, status */);
}
```

### Save-permission gating + InformationComponent edit gating
```typescript
// information.component.ts:357-377 (canEdit by AccessSection × user type)
canEdit(section: AccessSection): boolean {
  const userType = this.sessionProvider.session?.userType;
  if (!userType) return false;
  switch (section) {
    case AccessSection.AccountInformation:
      return userType === USER_TYPE_STRINGS.FALCON_USER;
    case AccessSection.AccountOfficial:
      return userType === USER_TYPE_STRINGS.FALCON_USER
          || userType === USER_TYPE_STRINGS.CLIENT_USER;
  }
  return false;
}
```

### Profile picture conversion (Base64)
```typescript
// information.component.ts:396-420
onProfilePictureSelected(files: File[]): void {
  const file = files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result as string;
    const base64Data = base64String.split(',')[1];
    const extension = file.type.split('/')[1] || 'png';
    this.model.profilePicture = { extension, fileBase64String: base64Data };
    this.profilePictureUrl = base64String;
  };
  reader.readAsDataURL(file);
}
```

### Country/City cascade
- City field requires `countryId` to be set (`information.component.ts:262-265`)
- City dropdown is cleared when country changes (`onCountrySelected`)
- City search uses country `code` from the originally fetched country (`getCountryCodeById`)

### Payment confirmation flow
- Confirmation dialog before payment (`showPaymentConfirmation` — both tabs)
- After POST, status polled at 2-sec intervals up to 30 min via `SimplePollService.watch`
- On `Failed.WalletNotConfigForTheNode` → show warning dialog with `warning.walletNotConfigured`
- On `Failed.CommChannelPriorityOrderRequired` → open priority drag-drop dialog
- On `Failed.InsufficientFunds` → show warning dialog with message
- On other failures → toast error

### IP delete confirmation
```typescript
// node-settings-tab.component.ts:344-362
removeIP(ip: string): void {
  if (!this.canEditAllowedIps) return;
  this.confirmationService.confirm({
    message: this.translateService.translate('confirm.deleteIp'),
    ...
    accept: () => {
      this.settingsModel.securitySettings.allowedIps = list.filter(x => x !== ip);
    },
  });
}
```

### Settings save permission gate
```typescript
// node-settings-tab.component.ts:251-289 (onSaveSettings)
if (!this.canEditSelectedSettings) return;
if (!this.selectedNodeId) return;
```

### Pending price-change delete confirmation
```typescript
// apps-services-tab.component.ts:437-464 & comm-channels-services-tab.component.ts:440-464
onDeleteDetail(detailItem, row): void {
  this.confirmationService.confirm({
    header: this.translateService.translate('confirm.deleteTitle'),
    message: detailType === 'priceType' ? 'confirm.deletePriceType' : 'confirm.deletePriceValue',
    ...
  });
}
```

## Validation count
- 1 max-length (node name = 32)
- 1 required-non-empty (node name trimmed)
- 1 IPv4/IPv6 syntactic validator (`isValidIpv4 || isValidIpv6`)
- 1 IP duplicate (case-insensitive)
- 2 inline price-edit required-fields (priceType + effectiveDate; priceValue)
- 1 country-must-precede-city cascade rule
- 1 user-type vs node-type matrix for tab enablement
- 1 PBAC × user-type matrix for InformationComponent section editing
- 1 base64 profile-picture conversion guard
- 5 confirmation dialogs (IP delete, payment confirm, delete priceType, delete priceValue, drawer cancel close)
