import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import {
  Platform,
  toBoolean,
  LyTheme2,
  ThemeVariables,
  mixinDisabled,
  mixinColor,
  mixinBg,
  mixinShadowColor,
  mixinOutlined,
  mixinFlat,
  mixinElevation,
  mixinRaised,
  mixinDisableRipple,
  mixinStyleUpdater,
  LyRippleService,
  LyFocusState
} from '@alyle/ui';
import { styles } from './button.style';
const DEFAULT_SIZE = 'medium';
const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;

type LyButtonSize = 'small' | 'medium' | 'large';

/** @ignore */
const Size: Record<LyButtonSize, any> = {
  small: (theme: ThemeVariables) => ({
    padding: '0 8px',
    fontSize: theme.pxToRem(theme.typography.lyTyp.button.fontSize - 1),
    minHeight: '32px',
    minWidth: '48px'
  }),
  medium: ({
    padding: '0 14px',
    minHeight: '36px',
    minWidth: '64px'
  }),
  large: (theme: ThemeVariables) => ({
    padding: '0 21px',
    fontSize: theme.pxToRem(theme.typography.lyTyp.button.fontSize + 1),
    minHeight: '40px',
    minWidth: '96px'
  })
};

export class LyButtonBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

export const LyButtonMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyButtonBase))))))))));

@Component({
  selector: '[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'button.html',
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ]
})
export class LyButton extends LyButtonMixinBase implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  /**
   * Style
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _rippleSensitive = false;
  private _size: LyButtonSize;
  private _sizeClass: string;
  private _appearance: string;
  private _appearanceClass: string;
  private _onFocusByKeyboardState: boolean;

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

  /** @ignore */
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    const newVal = this._rippleSensitive = toBoolean(value);
    this._rippleConfig.sensitive = newVal;
  }

  /** Button size */
  @Input()
  get size(): LyButtonSize {
    return this._size;
  }
  set size(val: LyButtonSize) {
    if (val !== this.size) {
      this._size = val;
      this._sizeClass = this._theme.addStyle(
        `lyButton.size:${this.size}`,
        Size[this.size as any],
        this._el.nativeElement,
        this._sizeClass,
        STYLE_PRIORITY
      );
    }
  }

  /** Button appearance */
  @Input()
  get appearance(): string { return this._appearance; }
  set appearance(val: string) {
    if (val !== this.appearance) {
      if (val === 'icon' && !this._rippleConfig.centered) {
        this._rippleConfig.centered = true;
      }
      this._appearance = val;
      this._appearanceClass = this._theme.addStyle(
        `lyButton.appearance:${val}`,
        (theme: ThemeVariables) => (theme.button.appearance[val]),
        this._el.nativeElement,
        this._appearanceClass,
        STYLE_PRIORITY + 1);
    }
  }

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    _theme: LyTheme2,
    _ngZone: NgZone,
    public _rippleService: LyRippleService,
    private _focusState: LyFocusState,
  ) {
    super(_theme, _ngZone);
    this.setAutoContrast();
    this._triggerElement = _el;
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
    if (Platform.FIREFOX) {
      this._theme.addStyle('button-ff', {
        '&::-moz-focus-inner,&::-moz-focus-inner,&::-moz-focus-inner,&::-moz-focus-inner': {
          border: 0
        }
      }, this._el.nativeElement, undefined, STYLE_PRIORITY);
    }
  }
  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnInit() {
    if (!this.size) {
      this.size = DEFAULT_SIZE;
    }
  }

  ngAfterViewInit() {
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }

    const focusState = this._focusState.listen(this._el);
    if (focusState) {
      focusState.subscribe((event) => {
        if (this._onFocusByKeyboardState === true) {
          this._renderer.removeClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
          this._onFocusByKeyboardState = false;
        }
        if (event.by === 'keyboard') {
          if (event.event.type === 'focus') {
            this._onFocusByKeyboardState = true;
            this._renderer.addClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
          }
        }
      });
    }
  }

  public focus() {
    this._el.nativeElement.focus();
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
    this._removeRippleEvents();
  }
}
