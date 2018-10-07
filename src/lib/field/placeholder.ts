import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'ly-field > ly-placeholder'
})
export class LyPlaceholder {
  constructor(
    public _vcr: ViewContainerRef
  ) { }
}
