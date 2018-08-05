import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[ly-tab-content]'})
export class LyTabContent {
  constructor(public template: TemplateRef<any>) { }
}
