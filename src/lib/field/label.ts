import { Directive, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

@Directive({
  selector: 'ly-field > ly-label'
})
export class LyLabel {
  constructor(
    // public _templateRef: TemplateRef<any>,
    public _vcr: ViewContainerRef
  ) { }
}
