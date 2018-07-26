import { Directive, Renderer2, ElementRef, Input } from '@angular/core';
import { LyTheme2, shadowBuilder } from '@alyle/ui';

@Directive({
  selector: 'ly-card'
})
export class LyCard {
  @Input() elevation: any;

  constructor(
    styler: LyTheme2,
    elementRef: ElementRef,
    renderer: Renderer2
  ) {
    const newClass = styler.setUpStyleSecondary<any>(
      'k-card',
      theme => (
        `background-color:${theme.background.primary};` +
        `display:block;` +
        `position:relative;` +
        `padding:24px;` +
        `border-radius:2px;` +
        `${shadowBuilder(this.elevation)}`
      )
    );
    renderer.addClass(elementRef.nativeElement, newClass);
  }

}
