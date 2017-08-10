import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcCss]'
})
export class DemoViewCssDirective {
  statusText: string;
  @Input('srcCss') src: string;
  constructor() { }

}
