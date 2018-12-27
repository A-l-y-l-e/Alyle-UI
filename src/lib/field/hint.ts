import { Directive, Renderer2, ElementRef, Input } from '@angular/core';
import { LyTheme2, invertPlacement } from '@alyle/ui';

export type LyHintAlign = 'before' | 'after';
const STYLE_PRIORITY = -2;
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
  private _align: LyHintAlign;
  private _alignClass: string;
  @Input()
  set align(val: LyHintAlign) {
    const newVal = invertPlacement(val as any);
    if (val) {
      this._alignClass = this._theme.addStyle(
        `lyHint.align:${val}`,
        () => ({
          [`margin-${newVal}`]: 'auto'
        }),
        this._el.nativeElement,
        this._alignClass,
        STYLE_PRIORITY
      );
    } else if (this._alignClass) {
      this._renderer.removeClass(this._el.nativeElement, this._alignClass);
      this._alignClass = null;
    }
    this._align = val;
  }
  get align() {
    return this._align;
  }
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _theme: LyTheme2
    ) {
    const className = _theme.addStyleSheet(STYLES, STYLE_PRIORITY).root;
    _renderer.addClass(_el.nativeElement, className);
  }
}
