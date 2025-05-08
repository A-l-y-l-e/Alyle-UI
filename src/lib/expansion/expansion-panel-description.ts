import { Directive, Inject, ElementRef, Renderer2 } from '@angular/core';
import { LyAccordion } from './accordion';

@Directive({
  selector: 'ly-panel-description',
  standalone: false
})
export class LyExpansionPanelDescription {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    @Inject(LyAccordion) accordion: LyAccordion
  ) {
    renderer.addClass(el.nativeElement, accordion.classes.panelDescription);
  }
}
