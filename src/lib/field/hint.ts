import { Directive, Renderer2, ElementRef } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  root: {
    display: 'block',
    fontSize: '.75em',
    marginTop: '8px'
  }
});

/** Hint text to be shown underneath the field. */
@Directive({
  selector: 'ly-field > ly-hint'
})
export class LyHint {
  constructor(
    _renderer: Renderer2,
    _el: ElementRef,
    _theme: LyTheme2
    ) {
    const className = _theme.addStyleSheet(STYLES).root;
    _renderer.addClass(_el.nativeElement, className);
  }
}
