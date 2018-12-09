import { Directive, OnChanges, ElementRef, NgZone, OnDestroy, Input, OnInit } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { mixinStyleUpdater, mixinBg, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor, mixinDisableRipple, mixinColor } from '../common/index';
import { toBoolean } from '../minimal/is-boolean';

const DEFAULT_BG = 'paper';

export class LyPaperBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

export const LyPaperMixinBase = mixinStyleUpdater(
mixinBg(
  mixinColor(
    mixinRaised(
      mixinOutlined(
        mixinElevation(
          mixinShadowColor(
            mixinDisableRipple(LyPaperBase))))))));

@Directive({
  selector: `ly-paper, [ly-paper], [ly-text]`,
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
export class LyPaper extends LyPaperMixinBase implements OnChanges, OnInit, OnDestroy {
  _hasText: boolean;

  @Input('ly-text')
  set hasText(val: any) {
    this._hasText = toBoolean(val);
  }
  get hasText() {
    return this._hasText;
  }

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

  ngOnInit() {
    if (!this.bg && !this.hasText) {
      this.bg = DEFAULT_BG;
    }
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}
