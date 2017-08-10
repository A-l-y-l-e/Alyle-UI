import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcTs]'
})
export class DemoViewTsDirective {
  statusText: string;
  @Input('srcTs') src: string;
  constructor() { }

}
