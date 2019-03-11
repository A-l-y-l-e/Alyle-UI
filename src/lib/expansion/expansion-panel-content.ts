import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[lyExpansionPanelContent]'
})
export class LyExpansionPanelContent {
  constructor(public _template: TemplateRef<any>) { }
}
