import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[srcTsModule]'
})
export class DemoViewModuleDirective {
  statusText: string;
  @Input('srcTsModule') src: string;
  constructor() { }

}
