import { LyTheme2 } from '@alyle/ui';
import { Directive, Input, Renderer2, ElementRef } from '@angular/core';
import { LySlider, гvalueToPercent } from './slider';

@Directive({
  selector: 'ly-mark',
  host: {
    '[style.left.%]': '_left'
  }
})
export class LyMark {

  get _left() {
    const percent = гvalueToPercent(this.value, this._slider.min, this._slider.max);
    const sign = this._theme.variables.direction === 'rtl' ? -1 : 1;
    return sign * percent;
  }

  @Input() value: number;


  constructor(
    private _slider: LySlider,
    private _theme: LyTheme2,
    renderer: Renderer2,
    el: ElementRef
  ) {
    renderer.addClass(el.nativeElement, _slider.classes.mark);
  }
}
