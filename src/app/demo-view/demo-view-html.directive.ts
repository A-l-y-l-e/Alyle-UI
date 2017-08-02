import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcHtml]'
})
export class DemoViewHtmlDirective {
  statusText: string;
  @Input('srcHtml') src: string;
  constructor() { }

}
