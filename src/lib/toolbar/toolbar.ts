import {
  Directive,
  Renderer2,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  isDevMode,
} from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  toBoolean,
  getLyThemeVariableUndefinedError
} from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'fixed';
const DEFAULT_BG = 'background:tertiary';

const styles = (theme: ThemeVariables) => ({
  root: {
    padding: '0 16px',
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    height: '64px',
    zIndex: theme.zIndex.toolbar,
    [theme.getBreakpoint('XSmall')]: {
      height: '56px'
    },
    '&': theme.toolbar ? theme.toolbar.root : null
  },
  dense: {
    height: '56px'
  }
});

type position = 'static' | 'absolute' | 'fixed' | 'sticky' | 'relative';

/** @docs-private */
export class LyToolbarBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyToolbarMixinBase = mixinStyleUpdater(
  mixinBg(
      mixinColor(
        mixinRaised(
          mixinDisabled(
            mixinOutlined(
              mixinElevation(
                mixinShadowColor(LyToolbarBase))))))));

@Directive({
  selector: 'ly-toolbar',
  inputs: [
    'bg',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor'
  ]
})
export class LyToolbar extends LyToolbarMixinBase implements OnChanges, OnInit {
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _position: position;
  private _positionClass: string;
  private _dense: boolean;
  private _appearance: string;
  private _appearanceClass: string;
  @Input()
  set position(val: position) {
    this._position = val;
    this._positionClass = this.theme.addStyle(`lyToolbar.position:${val}`, `position:${val}`, this._el.nativeElement, this._positionClass, STYLE_PRIORITY);
  }
  get position(): position {
    return this._position;
  }

  @Input()
  set dense(val: boolean) {
    const newVal = toBoolean(val);
    if (isDevMode() && newVal !== this.dense) {
      console.warn(this._el.nativeElement, `LyToolbar.appearance: \`dense\` is deprecated, instead use \`appearance="dense"\``);
      if (newVal) {
        this._renderer.addClass(this._el.nativeElement, this.classes.dense);
      } else {
        this._renderer.removeClass(this._el.nativeElement, this.classes.dense);
      }
    }
  }
  get dense(): boolean {
    return this._dense;
  }

  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      this._appearanceClass = this._theme.addStyle(
        `LyToolbar.appearance:${val}`,
        (theme: ThemeVariables) => {
          if (!theme.toolbar) {
            throw getLyThemeVariableUndefinedError('toolbar');
          }
          if (!(theme.toolbar.appearance && theme.toolbar.appearance![val])) {
            throw new Error(`Value toolbar.appearance['${val}'] not found in ThemeVariables`);
          }
          return theme.toolbar.appearance ![val]!;
        },
        this._el.nativeElement,
        this._appearanceClass,
        STYLE_PRIORITY);
    }
  }
  get appearance(): string {
    return this._appearance;
  }
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    private theme: LyTheme2,
  ) {
    super(theme);
    this.setAutoContrast();
    _renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnInit() {
    if (!this.position) {
      this.position = DEFAULT_POSITION;
    }
    if (!this.bg) {
      this.bg = DEFAULT_BG;
      this.updateStyle(this._el);
    }
  }
}
