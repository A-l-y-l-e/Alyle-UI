import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcs]'
})
export class DemoViewSrcsDirective {
  @Input() srcs: string[];
  constructor() { }

}
