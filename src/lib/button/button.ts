import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  Platform,
  toBoolean,
  LyTheme2,
  LyCommon
} from '@alyle/ui';
import { Ripple, LyRippleService } from '@alyle/ui/ripple';
import { styles } from './button.style';
const DEFAULT_SIZE = 'medium';

const Size = {
  small: theme => ({
    padding: '0 8px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize - 1),
    minHeight: '32px',
    minWidth: '64px'
  }),
  medium: ({
    padding: '0 14px',
    minHeight: '36px',
    minWidth: '88px'
  }),
  large: (theme) => ({
    padding: '0 21px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize + 1),
    minHeight: '40px',
    minWidth: '112px'
  })
};

@Component({
  selector: '[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span [className]="classes.content">
    <ng-content></ng-content>
  </span>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LyButton implements OnInit, OnDestroy {
  classes: {
    root: string,
    outlined: string,
    content: string
  };
  public _disabled = false;
  private _rippleSensitive = false;
  // private _outlinedClassName: string;
  private _rippleContainer: Ripple;
  private _size: string;
  private _sizeClass: string;

  // @Input()
  // set outlined(val: boolean) {
  //   const classname = toBoolean(val) === true ? this.classes.outlined : '';
  //   this.theme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._outlinedClassName);
  //   this._outlinedClassName = classname;
  // }

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
      this._size = val;
      this._sizeClass = this.theme.addStyle(
        `lyButton-size:${this.size}`,
        Size[this.size],
        this.elementRef.nativeElement,
        this._sizeClass
      );
    }
  }
  get size() {
    return this._size;
  }

  // @Input()
  // set disabled(value: boolean) {
  //   this._disabled = toBoolean(value);
  //   if (this._disabled) {
  //     const key = this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg) ? 'r' : 'f';
  //     this._disabledClassName = this.theme.addStyle(`lyButton-disabled:${key}`, this.disableStyle.bind(this), this.elementRef.nativeElement, this._disabledClassName);
  //   } else {
  //     this.renderer.removeClass(this.elementRef.nativeElement, this._disabledClassName);
  //   }
  // }
  get disabled() {
    return this._disabled;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2,
    public rippleStyles: LyRippleService,
    _ngZone: NgZone,
    @Optional() private bgAndColor: LyCommon
  ) {
    this.classes = this.theme.addStyleSheet(styles, 'lyButton');
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    if (Platform.isBrowser) {
      const el = elementRef.nativeElement;
      this._rippleContainer = new Ripple(_ngZone, rippleStyles.stylesData, el);
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.root);
    if (!this.size) {
      this.size = DEFAULT_SIZE;
    }
  }

  public focus() {
    this.elementRef.nativeElement.focus();
  }

  // private disableStyle() {
  //   let style =
  //   `box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;` +
  //   `cursor: default;` +
  //   `color: ${this.theme.config.text.disabled} !important;` +
  //   `pointer-events: none;`;
  //   if (this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg)) {
  //     style += `background-color: ${this.theme.config.button.disabled} !important;`;
  //   }
  //   return style;
  // }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._rippleContainer.removeEvents();
    }
  }

}
