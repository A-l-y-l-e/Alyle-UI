import { LyTheme2 } from '@alyle/ui';
import { Component, Input, Renderer2, ElementRef, ChangeDetectionStrategy, DoCheck, ViewChild, OnInit } from '@angular/core';
import { LySlider, гvalueToPercent, гbetween } from './slider';
import { LyTick } from './tick';

@Component({
  selector: 'ly-mark',
  templateUrl: 'mark.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyMark implements OnInit, DoCheck {
  /** @docs-private */
  readonly classes = this._slider.classes;

  /** Min percentage of a track. */
  private _minPercent: number;
  /** Max percentage of a track. */
  private _maxPercent: number;

  private _min: number;
  private _max: number;

  private _markActiveClass?: string | null;

  @ViewChild(LyTick, { static: true}) _tick: LyTick;


  @Input() value: number;


  constructor(
    private _slider: LySlider,
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) {
    _renderer.addClass(_el.nativeElement, _slider.classes.mark);
  }

  ngOnInit() {
    this._renderer.appendChild(this._slider._getHostElement(), this._tick._getHostElement());
  }

  ngDoCheck() {
    const min = this._slider._minPercent;
    const max = this._slider._maxPercent;

    if (this._slider.max !== this._max || this._slider.min !== this._min) {
      this._min = this._slider.min;
      this._max = this._slider.max;
      const percent = гvalueToPercent(this.value, this._slider.min, this._slider.max);
      const sign = this._theme.variables.direction === 'rtl' ? -1 : 1;
      const left = sign * percent;
      this._renderer.setStyle(this._el.nativeElement, 'left', `${left}%`);
      this._renderer.setStyle(this._tick._getHostElement(), 'left', `${left}%`);
      this._tick.ngDoCheck();
    }

    if (max !== this._maxPercent || min !== this._minPercent) {
      const className = this._slider.classes.markActive;
      const value = this.value;
      this._minPercent = min;
      this._maxPercent = max;

      if (гbetween(value, min, max)) {
        this._markActiveClass = className;
        this._renderer.addClass(this._el.nativeElement, className);
      } else if (this._markActiveClass) {
        this._markActiveClass = null;
        this._renderer.removeClass(this._el.nativeElement, className);
      }
    }

  }
}

