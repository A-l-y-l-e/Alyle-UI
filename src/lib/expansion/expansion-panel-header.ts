import { Component, ElementRef, Renderer2, Inject } from '@angular/core';
import { LyAccordion } from './accordion';
import { LyExpansionPanel } from './expansion-panel';

@Component({
  selector: 'ly-expansion-panel-header',
  templateUrl: 'expansion-panel-header.html',
  host: {
    '(click)': '_expansionPanel.toggle()'
  },
  standalone: false
})
export class LyExpansionPanelHeader {
  /** @docs-private */
  readonly classes = this._accordion.classes;
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    @Inject(LyAccordion) readonly _accordion: LyAccordion,
    @Inject(LyExpansionPanel) readonly _expansionPanel: LyExpansionPanel
  ) {
    renderer.addClass(el.nativeElement, this._accordion.classes.panelHeader);
  }

}
