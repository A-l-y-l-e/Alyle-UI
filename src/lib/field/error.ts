import { Directive, Renderer2, ElementRef } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { STYLES } from './styles';

/** LyError */
const STYLE_PRIORITY = -2;

@Directive({
  selector: 'ly-error'
})
export class LyError {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  constructor(
    renderer: Renderer2,
    el: ElementRef,
    private _theme: LyTheme2
    ) {
    const className = _theme.addStyleSheet(STYLES, STYLE_PRIORITY).error;
    renderer.addClass(el.nativeElement, className);
  }
}
