import { Directive, ElementRef, Input } from '@angular/core';
import { LyClasses } from './theme2.service';

@Directive({
  selector: '[styleName]'
})
export class LyStyleName {
  @Input()
  set styleName(val: string) {
    const className = this.classesMap.classes[val];
    this.el.nativeElement.classList.add(className);
  }
  constructor(
    private el: ElementRef,
    private classesMap: LyClasses
  ) { }
}
