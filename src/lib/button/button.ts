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
  mixinElevation,
  mixinRaised,
  mixinDisableRipple,
  mixinStyleUpdater,
  LyRippleService,
  LyFocusState,
  getLyThemeVariableUndefinedError,
  StyleTemplate,
  LyClasses,
  lyl,
  LY_COMMON_STYLES,
  ThemeRef
} from '@alyle/ui';

import { Color } from '@alyle/ui/color';

export interface LyButtonTheme {
  /** Styles for Button Component */
  root?: (classes: LyClasses<typeof STYLES>) => StyleTemplate;
  appearance?: {
    icon?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    fab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    miniFab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
  };
}

export interface LyButtonDefaultOptions {
  size?: number;
  appearance?: string;
}

export interface LyButtonVariables {
  button?: LyButtonTheme;
}

const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;

export type LyButtonSize = 'small' | 'medium' | 'large';

export const STYLES = (theme: ThemeVariables & LyButtonVariables, ref: ThemeRef) => {
  const typography = theme.typography;
  const button = ref.getClasses(STYLES);
  return {
    root: () => lyl `{
      font-family: ${typography.fontFamily}
      color: ${theme.text.default}
      -webkit-tap-highlight-color: transparent
      background-color: ${new Color(0, 0, 0, 0)}
      border: 0
      padding: 0 1em
      -moz-appearance: none
      margin: 0
      border-radius: 3px
      outline: none
      font-weight: 500
      box-sizing: border-box
      position: relative
      justify-content: center
      align-items: center
      align-content: center
      display: inline-flex
      cursor: pointer
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      text-decoration-line: none
      -webkit-text-decoration-line: none
      font-size: ${theme.pxToRem(14)}
      &::-moz-focus-inner {
        border: 0
      }
      &::after {
        content: ''
        {
          ...${LY_COMMON_STYLES.fill}
        }
        width: 100%
        height: 100%
        background: transparent
        opacity: 0
        pointer-events: none
      }
      &${button.onFocusByKeyboard}::after, &:hover::after {
        background: currentColor
        opacity: .13
        border-radius: inherit
      }
      {
        ...${
          (theme.button
            && theme.button.root
            && theme.button.root(button)) || null
        }
      }
    }`,
    content: lyl `{
      padding: 0
      display: flex
      justify-content: inherit
      align-items: inherit
      align-content: inherit
      width: 100%
      height: 100%
      box-sizing: border-box
    }`,
    /** When focus by keyboard */
    onFocusByKeyboard: null,
    animations: `{
      &:hover, &:hover::after, &:focus, &:focus::after {
        transition: background 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, box-shadow 280ms cubic-bezier(.4,0,.2,1) 0ms
      }
    }`
  };
};

/** @docs-private */
export class LyButtonBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyButtonMixinBase = mixinStyleUpdater(
mixinBg(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyButtonBase)))))))));

@Component({
  selector: 'button[ly-button], a[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'button.html',
  inputs: [
    'bg',
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
   * @docs-private
   */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _rippleSensitive = false;
  private _size: LyButtonSize;
  private _sizeClass: string;
  private _appearance: string;
  private _appearanceClass: string;
  private _onFocusByKeyboardState: boolean;

  @ViewChild('rippleContainer', { static: false }) _rippleContainer: ElementRef;

  /** @docs-private */
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
        `lyButton.size:${val}`,
        (theme: ThemeVariables) => {
          if (theme.button && theme.button.size && theme.button.size[val]) {
            return theme.button.size[val]!;
          }
          throw new Error(`Value button.size['${val}'] not found in ThemeVariables`);
        },
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
        (theme: ThemeVariables) => {
          if (!(theme.button!.appearance && theme.button!.appearance![val])) {
            throw new Error(`Value button.appearance['${val}'] not found in ThemeVariables`);
          }
          return theme.button!.appearance![val]!;
        },
        this._el.nativeElement,
        this._appearanceClass,
        STYLE_PRIORITY + 1);
    }
  }

  constructor(
    protected _el: ElementRef,
    protected _renderer: Renderer2,
    _theme: LyTheme2,
    _ngZone: NgZone,
    public _rippleService: LyRippleService,
    private _focusState: LyFocusState,
  ) {
    super(_theme, _ngZone);
    this.setAutoContrast();
    this._triggerElement = _el;
    if (Platform.FIREFOX) {
      this._theme.addStyle('button-ff', {
        '&::-moz-focus-inner,&::-moz-focus-inner,&::-moz-focus-inner,&::-moz-focus-inner': {
          border: 0
        }
      }, this._el.nativeElement, undefined, STYLE_PRIORITY);
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
    if (!_theme.variables.button) {
      throw getLyThemeVariableUndefinedError('button');
    }
  }
  ngOnChanges() {
    this.updateStyle(this._el);
    const isDisabled = this.disabled;
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }

  ngOnInit() {
    const { button } = this._theme.variables;
    if (button) {
      this._renderer.addClass(this._el.nativeElement, this.classes.root);

      // Apply default config
      if (this.size == null && this.appearance == null) {
        this.size = button.defaultConfig.size;
      } else {
        if (button.defaultConfig && button.defaultConfig.appearance) {
          if (this.appearance == null) {
            this.appearance = button.defaultConfig.appearance;
          }
        }

      }
    }
    // set default disable ripple
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngAfterViewInit() {

    // this._renderer.addClass(this._el.nativeElement, this.classes.animations);

    const focusState = this._focusState.listen(this._el);
    if (focusState) {
      focusState.subscribe((event) => {
        if (this._onFocusByKeyboardState === true) {
          this._renderer.removeClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
          this._onFocusByKeyboardState = false;
        }
        if (event === 'keyboard') {
            this._onFocusByKeyboardState = true;
            this._renderer.addClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
        }
      });
    }
  }

  focus() {
    this._el.nativeElement.focus();
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
    this._removeRippleEvents();
  }
}
