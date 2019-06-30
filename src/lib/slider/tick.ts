import { Directive, DoCheck, Renderer2, ElementRef, Input } from '@angular/core';
import { LySlider, гbetween } from './slider';

@Directive({
  selector: 'ly-tick'
})
export class LyTick implements DoCheck {
  /** @docs-private */
  readonly classes = this._slider.classes;

  /** Min percentage */
  private _minPercent: number;
  /** Max percentage */
  private _maxPercent: number;

  private _tickActiveClass?: string | null;

  @Input() value: number;

  constructor(
    private _slider: LySlider,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) { }

  ngDoCheck() {
    const min = this._slider._minPercent;
    const max = this._slider._maxPercent;

    console.log('updating tick...', this._getHostElement());
    if (max !== this._maxPercent || min !== this._minPercent) {
      const className = this._slider.classes.tickActive;
      const value = this.value;
      this._minPercent = min;
      this._maxPercent = max;

      if (гbetween(value, min, max)) {
        this._tickActiveClass = className;
        this._renderer.addClass(this._el.nativeElement, className);
      } else if (this._tickActiveClass) {
        this._tickActiveClass = null;
        this._renderer.removeClass(this._el.nativeElement, className);
      }
    }
  }

  _getHostElement() {
    return this._el.nativeElement;
  }
}
