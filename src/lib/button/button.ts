import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  ViewChild,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  Platform,
  toBoolean,
  LyTheme2,
  LyBgColorAndRaised
} from '@alyle/ui';
import { Ripple, LyRippleService } from '@alyle/ui/ripple';
import { LyButtonService } from './button.service';
const DEFAULT_SIZE = 'medium';
const Size = {
  small: theme => (
    `padding:0 8px;` +
    `font-size:${theme.pxToRem(theme.typography.button.fontSize - 1)};` +
    `min-height: 32px;` +
    `min-width: 64px;`
  ),
  medium: theme => (
    `padding:0 14px;` +
    `font-size:${theme.pxToRem(theme.typography.button.fontSize)};` +
    `min-height: 36px;` +
    `min-width: 88px;`
  ),
  large: theme => (
    `padding:0 21px;` +
    `font-size:${theme.pxToRem(theme.typography.button.fontSize + 1)};` +
    `min-height: 40px;` +
    `min-width: 112px;`
  ),
};

@Component({
  selector: '[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span #content>
    <ng-content></ng-content>
  </span>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LyButton implements OnInit, AfterViewInit, OnDestroy {
  public _disabled = false;
  private _rippleSensitive = false;
  private _disabledClassName: string;
  private _outlinedClassName: string;
  private _rippleContainer: Ripple;
  private _size: string;
  private _sizeClass: string;
  @Input()
  set outlined(val: boolean) {
    const classname = toBoolean(val) === true ? this.buttonService.classes.outlined : '';
    this.theme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._outlinedClassName);
    this._outlinedClassName = classname;
  }
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    this._rippleSensitive = toBoolean(value);
  }

  @Input()
  set size(val: string) {
    if (val !== this.size) {
      // const newClass = this._createSizeClass(val);
      // this._sizeClass = this.theme.updateClass(this.elementRef.nativeElement, this.renderer, newClass, this._sizeClass);
      this._size = val;
      this._sizeClass = this.theme.addStyle(
        `k-button-size:${this.size}`,
        Size[this.size],
        this.elementRef.nativeElement,
        this._sizeClass
      );
    }
  }
  get size() {
    return this._size;
  }

  @ViewChild('content') buttonContent: ElementRef;

  @Input()
  set disabled(value: boolean) {
    const key = this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg) ? 'r' : 'f';
    this._disabledClassName = this.theme.setUpStyle(`btn${key}`, {'': this.disableStyle.bind(this)});
    this._disabled = toBoolean(value);
    if (this._disabled) {
      this.renderer.addClass(this.elementRef.nativeElement, this._disabledClassName);
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, this._disabledClassName);
    }
  }
  get disabled() {
    return this._disabled;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2,
    public rippleStyles: LyRippleService,
    private buttonService: LyButtonService,
    _ngZone: NgZone,
    @Optional() private bgAndColor: LyBgColorAndRaised
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    if (Platform.isBrowser) {
      const el = elementRef.nativeElement;
      this._rippleContainer = new Ripple(_ngZone, rippleStyles.stylesData, el);
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.buttonService.classes.currentConfig);
    this.renderer.addClass(this.elementRef.nativeElement, this.buttonService.classes.root);
    if (!this.size) {
      this.size = DEFAULT_SIZE;
    }
  }

  public focused() {
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewInit() {
    const classes = this.buttonService.classes;
      (this.buttonContent.nativeElement as HTMLElement).classList.add(
        classes.buttonContent
      );
  }

  private disableStyle() {
    let style =
    `box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;` +
    `cursor: default;` +
    `color: ${this.theme.config.text.disabled} !important;` +
    `pointer-events: none;`;
    if (this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg)) {
      style += `background-color: ${this.theme.config.button.disabled} !important;`;
    }
    return style;
  }

  private _createSizeClass(val: string): string {
    this._size = val;
    return this.theme.setUpStyleSecondary(`k-button-size:${this.size}`, Size[this.size]);
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._rippleContainer.removeEvents();
    }
  }

}
