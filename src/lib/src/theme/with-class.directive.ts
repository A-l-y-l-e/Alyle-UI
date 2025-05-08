import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[withClass]',
  standalone: false
})
export class LyWithClass {

  @Input()
  set withClass(val: string) {
    if (!val) {
      throw new Error(`'${val}' is not valid className`);
    }
    this.el.nativeElement.classList.add(val);
  }
  constructor(
    private el: ElementRef
  ) { }
}
