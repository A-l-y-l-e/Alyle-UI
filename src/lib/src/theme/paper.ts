import { Directive, OnChanges, ElementRef, NgZone, OnDestroy, Input, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { mixinStyleUpdater, mixinBg, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor, mixinDisableRipple, mixinColor } from '../common/index';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';

const DEFAULT_BG = 'paper';

export class LyPaperBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
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
  set hasText(val: BooleanInput) {
    this._hasText = coerceBooleanProperty(val);
  }
  get hasText(): boolean {
    return this._hasText;
  }

  constructor(
    theme: LyTheme2,
    ngZone: NgZone,
    private _el: ElementRef,
    private _renderer: Renderer2,
    platform: Platform
  ) {
    super(theme, ngZone, platform);
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
      this.updateStyle(this._el);
      this._renderer.addClass(this._el.nativeElement, this._theme.addSimpleStyle(
        'lyPaper',
        ({
          display: 'block'
        })
        ));
    }
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}
