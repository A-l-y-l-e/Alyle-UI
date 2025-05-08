import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[lyExpansionPanelContent]',
  standalone: false
})
export class LyExpansionPanelContent {
  constructor(readonly _template: TemplateRef<any>) { }
}
