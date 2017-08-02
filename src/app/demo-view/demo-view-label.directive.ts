import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcLabel]'
})
export class DemoViewLabelDirective {
  statusText: string;
  @Input('srcLabel') text: string;
  constructor() { }

}
