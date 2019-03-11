import { Directive, ElementRef, Renderer2, Inject } from '@angular/core';
import { LyAccordion } from './accordion';
import { LyExpansionPanel } from './expansion-panel';

@Directive({
  selector: 'ly-expansion-panel-header',
  host: {
    '(click)': 'expansionPanel.toggle()'
  }
})
export class LyExpansionPanelHeader {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    @Inject(LyAccordion) readonly accordion: LyAccordion,
    @Inject(LyExpansionPanel) readonly expansionPanel: LyExpansionPanel
  ) {
    renderer.addClass(el.nativeElement, this.accordion.classes.panelHeader);
  }

}
