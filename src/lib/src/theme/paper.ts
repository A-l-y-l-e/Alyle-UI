import { Directive, OnChanges, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { mixinStyleUpdater, mixinBg, mixinFlat, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor, mixinDisableRipple, mixinColor } from '../common/index';

export class LyPaperBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

export const LyPaperMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(
              mixinDisableRipple(LyPaperBase)))))))));

@Directive({
  selector: `ly-paper, [ly-paper]`,
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ]
})
export class LyPaper extends LyPaperMixinBase implements OnChanges, OnDestroy {

  constructor(
    theme: LyTheme2,
    ngZone: NgZone,
    private _el: ElementRef
  ) {
    super(theme, ngZone);
    this.setAutoContrast();
    this._triggerElement = this._el;
    this._rippleContainer = this._el;
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}
