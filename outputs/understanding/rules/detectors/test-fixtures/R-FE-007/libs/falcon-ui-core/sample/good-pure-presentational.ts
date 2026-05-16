// libs/falcon-ui-core/.../good-pure-presentational.ts
// *** GOOD — pure presentational skeleton, no service injection ***
// *** ChangeDetectorRef is platform plumbing, not a domain service ***
import { Component, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'falcon-good-skeleton',
  template: '<div>{{ label }}</div>',
})
export class GoodSkeletonComponent {
  @Input() label = '';
  @Output() activate = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}
}
