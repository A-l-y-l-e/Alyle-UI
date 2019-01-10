import { Directive, Renderer2, ElementRef, Input } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { STYLES } from './styles';

export type LyHintAlign = 'before' | 'after';

/** LyHint */
const STYLE_PRIORITY = -2;

/** Hint text to be shown underneath the field. */
@Directive({
  selector: 'ly-field > ly-hint'
})
export class LyHint {
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _align: LyHintAlign;
  private _alignClass?: string;
  @Input()
  set align(val: LyHintAlign) {
    if (val) {
      if (val === 'after') {
        this._renderer.addClass(this._el.nativeElement, this.classes.hintAfter);
        this._alignClass = this.classes.hintAfter;
      } else {
        this._renderer.addClass(this._el.nativeElement, this.classes.hintBefore);
        this._alignClass = this.classes.hintBefore;
      }
    } else if (this._alignClass) {
      this._renderer.removeClass(this._el.nativeElement, this._alignClass);
      this._alignClass = undefined;
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
    _renderer.addClass(_el.nativeElement, this.classes.hint);
  }
}
