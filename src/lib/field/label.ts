import { Directive, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

@Directive({
  selector: 'ly-field > ly-label'
})
export class LyLabel {
  constructor(
    public _vcr: ViewContainerRef
  ) { }
}
