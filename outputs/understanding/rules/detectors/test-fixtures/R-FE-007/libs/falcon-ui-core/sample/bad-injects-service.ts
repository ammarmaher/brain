// libs/falcon-ui-core/.../bad-injects-service.ts
// *** BAD — library skeleton must NOT constructor-inject a service ***
// *** This violates R-FE-007 — services belong to app-level wrappers ***
import { Component } from '@angular/core';

// *** Fake service stand-in for fixture purposes ***
export class AccountsService {}

@Component({
  selector: 'falcon-bad-skeleton',
  template: '<div>bad</div>',
})
export class BadSkeletonComponent {
  // *** Constructor-inject — violation ***
  constructor(private accountsService: AccountsService) {}
}
