import { Directive, Renderer2, ElementRef, Inject } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { LY_FIELD_STYLES_TOKEN } from './field-styles-token';

const STYLE_PRIORITY = -2;

@Directive({
  selector: 'ly-error',
  standalone: false
})
export class LyError {
  constructor(
    renderer: Renderer2,
    el: ElementRef,
    theme: LyTheme2,
    @Inject(LY_FIELD_STYLES_TOKEN) styles: any
    ) {
    const className = theme.addStyleSheet(styles, STYLE_PRIORITY).error;
    renderer.addClass(el.nativeElement, className);
  }
}
