import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[ly-tab-content]',
  standalone: false
})
export class LyTabContent {
  constructor(public template: TemplateRef<any>) { }
}
