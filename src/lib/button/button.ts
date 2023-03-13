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
  OnChanges,
  InjectionToken,
  Inject,
  Optional
} from '@angular/core';
import {
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
  getLyThemeVariableUndefinedError,
  StyleTemplate,
  LyClasses,
  lyl,
  LY_COMMON_STYLES,
  ThemeRef,
  StyleCollection,
  StyleRenderer,
  SelectorsFn
} from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

export interface LyButtonTheme {
  /** Styles for Button Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  appearance?: {
    icon?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    fab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    miniFab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    [name: string]: ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
  size?: {
    small?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    medium?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    large?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    [name: string]: ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
}

export interface LyButtonDefaultOptions {
  size?: string;
  appearance?: string;
}

export interface LyButtonVariables {
  button?: LyButtonTheme;
}

const DEFAULT_DISABLE_RIPPLE = false;
const DEFAULT_SIZE = 'medium';
const STYLE_PRIORITY = -2;
export const LY_BUTTON_DEFAULT_OPTIONS =
    new InjectionToken<LyButtonDefaultOptions>('LY_BUTTON_DEFAULT_OPTIONS');

export const STYLES = (theme: ThemeVariables & LyButtonVariables, selectors: SelectorsFn) => {
  const typography = theme.typography;
  const button = selectors(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    $name: LyButton.name,
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
      &::before {
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
      &.cdk-keyboard-focused::before, &.cdk-program-focused::before, &:hover::before {
        background: currentColor
        opacity: .13
        border-radius: inherit
      }
      {
        ...${
          (theme.button?.root
            && (theme.button.root instanceof StyleCollection
              ? theme.button.root.setTransformer(fn => fn(button)).css
              : theme.button.root(button))
          )
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
    animations: lyl `{
      &:hover, &:hover::before, &:focus, &:focus::before {
        transition: background 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, box-shadow 280ms cubic-bezier(.4,0,.2,1) 0ms
      }
    }`
  };
};

/** @docs-private */
export class LyButtonBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
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
  ],
  providers: [
    StyleRenderer
  ],
  exportAs: 'lyButton'
})
export class LyButton extends LyButtonMixinBase implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  static readonly и = 'LyButton';
  /**
   * Style
   * @docs-private
   */
  readonly classes = this.sRenderer.renderSheet(STYLES);
  private _rippleSensitive = false;
  private _size: string;
  private _sizeClass: string | null;
  private _appearance: string;
  private _appearanceClass: string;

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

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
  get size(): string {
    return this._size;
  }
  set size(val: string) {
    if (val !== this.size) {
      this._size = val;
      const newClass = this._theme.renderStyle(
        `${LyButton.и}--${val}-size`,
        (theme: LyButtonVariables, ref: ThemeRef) => {
          if (theme.button && theme.button.size && theme.button.size[val]) {
            return theme.button.size[val]!(ref.selectorsOf(STYLES));
          }
          throw new Error(`Value button.size['${val}'] not found in ThemeVariables`);
        },
        STYLE_PRIORITY
      );
      this._sizeClass = this.sRenderer.updateClass(newClass, this._sizeClass);
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
      const newClass = this._theme.renderStyle(
        `${LyButton.и}--${val}-appearance`,
        (theme: LyButtonVariables, ref: ThemeRef) => {
          if (!(theme.button!.appearance && theme.button!.appearance![val])) {
            throw new Error(`Value button.appearance['${val}'] not found in ThemeVariables`);
          }
          return theme.button!.appearance![val]!(ref.selectorsOf(STYLES));
        },
      STYLE_PRIORITY + 1);
      this._appearanceClass = this.sRenderer.updateClass(newClass, this._appearanceClass);
    }
  }

  /** @docs-private */
  get hostElement() {
    return this._el.nativeElement;
  }

  constructor(
    protected _el: ElementRef<HTMLButtonElement | HTMLAnchorElement>,
    protected _renderer: Renderer2,
    _theme: LyTheme2,
    _ngZone: NgZone,
    public _rippleService: LyRippleService,
    private _focusMonitor: FocusMonitor,
    readonly sRenderer: StyleRenderer,
    platform: Platform,
    @Optional() @Inject(LY_BUTTON_DEFAULT_OPTIONS) private _defaultConfig: LyButtonDefaultOptions
  ) {
    super(_theme, _ngZone, platform);
    this.setAutoContrast();
    this._triggerElement = _el;
    this._renderer.addClass(this._el.nativeElement, this.classes.animations);
    if (!(_theme.variables as LyButtonVariables).button) {
      throw getLyThemeVariableUndefinedError('button');
    }
  }
  ngOnChanges() {
    this.updateStyle(this._el);
    const isDisabled = this.disabled;
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }

  ngOnInit() {
    const { button } = (this._theme.variables as LyButtonVariables);
    if (button) {
      this._renderer.addClass(this._el.nativeElement, this.classes.root);

      if (this.size == null && this.appearance == null) {
        // Apply default config
        this.size = (this._defaultConfig && this._defaultConfig.size!)
          || DEFAULT_SIZE;
      } else {
        if (this._defaultConfig && this._defaultConfig.appearance) {
          if (this.appearance == null) {
            this.appearance = this._defaultConfig.appearance;
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
    this._focusMonitor.monitor(this._el, true);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._el);
    this._removeRippleEvents();
  }

  /** Focuses the button. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }
  }
  _getHostElement() {
    return this._el.nativeElement;
  }

}
