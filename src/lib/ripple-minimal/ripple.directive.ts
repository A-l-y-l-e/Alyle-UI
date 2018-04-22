import {
  ElementRef,
  forwardRef,
  Input,
  Directive,
  ChangeDetectionStrategy,
  NgZone,
  OnInit,
  OnDestroy,
  Optional,
  HostBinding,
  HostListener,
  AfterViewInit,
  Renderer2,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IsBoolean, LyFocusState, Platform } from 'alyle-ui/core';
import { Ripple, RippleConfig } from './ripple';
import { LyRippleService } from './ripple.service';

@Directive({
  selector: '[lyRipple]',
  exportAs: 'lyRipple'
})
export class LyRipple implements OnInit, OnChanges, OnDestroy {
  rippleContainer: Ripple;
  private _containerElement: HTMLElement | null;
  @Input() @IsBoolean() lyRippleCentered: boolean;
  @Input() @IsBoolean() lyRippleDisabled: boolean;
  @Input() @IsBoolean() lyRippleSensitive: boolean;
  @Input() lyRippleRadius: 'containerSize' | number;
  @Input() lyRipplePercentageToIncrease: number;
  get lyRippleConfig(): RippleConfig {
    return {
      centered: this.lyRippleCentered,
      disabled: this.lyRippleDisabled,
      sensitive: this.lyRippleSensitive,
      radius: this.lyRippleRadius,
      percentageToIncrease: this.lyRipplePercentageToIncrease,
    };
  }
  constructor(
    private rippleService: LyRippleService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _renderer: Renderer2
  ) {
    if (Platform.isBrowser) {
      this._containerElement = this._elementRef.nativeElement;
    }
  }

  ngOnInit() {
    this._updateRipple();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._updateRipple();
  }

  private _updateRipple() {
    if (Platform.isBrowser) {
      if (this.lyRippleConfig.disabled) {
        return;
      }
      if (!this.rippleContainer) {
        this.rippleContainer = new Ripple(this._containerElement, this._renderer, this._ngZone, this.rippleService.stylesData);
      }
      this.rippleContainer.rippleConfig = this.lyRippleConfig;
    }
  }
  /**
   * Use only in ngAfterViewInit
   */
  setTriggerElement(triggerElement: HTMLElement) {
    this.lyRippleDisabled = true;
    this.rippleContainer.setTriggerElement(triggerElement);
    this.lyRippleDisabled = false;
  }

  ngOnDestroy() {
    if (this.rippleContainer) {
      this.rippleContainer.setTriggerElement(null);
    }
  }

}
