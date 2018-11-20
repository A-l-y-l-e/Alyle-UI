import { Directive, OnChanges, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { mixinStyleUpdater, mixinBg, mixinFlat, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor, mixinDisableRipple, mixinColor } from '../common/index';

const DEFAULT_DISABLE_RIPPLE = false;

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
  selector: `ly-paper`
})
export class LyPaper extends LyPaperMixinBase implements OnInit, OnChanges, OnDestroy {

  constructor(
    theme: LyTheme2,
    ngZone: NgZone,
    private _elementRef: ElementRef
  ) {
    super(theme, ngZone);
    this.setAutoContrast();
    this._triggerElement = this._elementRef;
    this._rippleContainer = this._elementRef;
  }

  ngOnChanges() {
    this.updateStyle(this._elementRef);
  }

  ngOnInit() {
    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}
