import {
  ElementRef,
  Input,
  Directive,
  NgZone,
  OnInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { toBoolean, Platform, LyTheme2 } from '@alyle/ui';
import { Ripple, RippleConfig } from './ripple';
import { LyRippleService } from './ripple.service';

@Directive({
  selector: '[lyRipple], [ly-ripple]',
  exportAs: 'lyRipple'
})
export class LyRipple implements OnInit, OnChanges, OnDestroy {
  rippleContainer: Ripple;
  @Input() lyRippleCentered: boolean;
  @Input() lyRippleDisabled: boolean;
  @Input() lyRippleSensitive: boolean;
  @Input() lyRippleRadius: 'containerSize' | number;
  @Input() lyRipplePercentageToIncrease: number;
  get lyRippleConfig(): RippleConfig {
    return {
      centered: toBoolean(this.lyRippleCentered),
      disabled: toBoolean(this.lyRippleDisabled),
      sensitive: toBoolean(this.lyRippleSensitive),
      radius: this.lyRippleRadius,
      percentageToIncrease: this.lyRipplePercentageToIncrease,
    };
  }
  constructor(
    private rippleService: LyRippleService,
    public _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _theme: LyTheme2
  ) {
    if (Platform.isBrowser) {
      this.rippleContainer = new Ripple(this._theme.config, this._ngZone, this.rippleService.classes, this._elementRef.nativeElement);
    }
  }

  ngOnInit() {
    this._updateRipple();
  }

  ngOnChanges() {
    this._updateRipple();
  }

  private _updateRipple() {
    if (Platform.isBrowser) {
      this.rippleContainer.setConfig(this.lyRippleConfig);
    }
  }

  ngOnDestroy() {
    if (this.rippleContainer) {
      this.rippleContainer.removeEvents();
    }
  }

}
