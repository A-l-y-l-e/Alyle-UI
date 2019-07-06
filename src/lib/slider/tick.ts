import { Directive, Renderer2, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { LySlider, гbetween, гvalueToPercent } from './slider';
import { untilComponentDestroyed } from '@alyle/ui';

@Directive({
  selector: 'ly-tick'
})
export class LyTick implements OnChanges, OnInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._slider.classes;

  private _tickActiveClass?: string | null;

  @Input() value: number;

  constructor(
    private _slider: LySlider,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) { }

  ngOnChanges() {
    this._updateTick();
  }

  ngOnInit() {
    this._renderer.addClass(this._getHostElement(), this.classes.tick);
    this._slider._changes.pipe(
      untilComponentDestroyed(this)
    ).subscribe(() => {
      this._updateTick();
    });
  }

  private _updateTick() {
    const min = this._slider._minPercent;
    const max = this._slider._maxPercent;

    const className = this._slider.classes.tickActive;
    const percent = гvalueToPercent(this.value, this._slider.min, this._slider.max);
    const pos = this._slider._calculatePosition(percent);

    if (гbetween(percent, min, max)) {
      this._tickActiveClass = className;
      this._renderer.addClass(this._el.nativeElement, className);
    } else if (this._tickActiveClass) {
      this._tickActiveClass = null;
      this._renderer.removeClass(this._el.nativeElement, className);
    }

    this._renderer.setStyle(this._getHostElement(), 'bottom', null);
    this._renderer.setStyle(this._getHostElement(), 'left', null);
    this._renderer.setStyle(this._getHostElement(), 'right', null);
    this._renderer.setStyle(this._getHostElement(), pos.style, pos.value);
  }

  ngOnDestroy() { }

  _getHostElement() {
    return this._el.nativeElement;
  }

}
