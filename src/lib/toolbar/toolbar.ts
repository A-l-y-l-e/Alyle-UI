import {
  Directive,
  Renderer2,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
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
  st2c,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  StyleRenderer,
  LyHostClass } from '@alyle/ui';

export interface LyToolbarTheme {
  /** Styles for Toolbar Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  appearance?: {
    [key: string]: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate)
  };
}

export interface LyToolbarVariables {
  toolbar?: LyToolbarTheme;
}

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'fixed';
const DEFAULT_BG = 'background:tertiary';

export const STYLES = (theme: ThemeVariables & LyToolbarVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    root: () => (className: string) => `${className}{padding:0 16px;display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:64px;z-index:${theme.zIndex.toolbar};}${st2c((
          (theme.toolbar
            && theme.toolbar.root
            && (theme.toolbar.root instanceof StyleCollection
              ? theme.toolbar.root.setTransformer(fn => fn(__)).css
              : theme.toolbar.root(__))
          )), `${className}`)}${className} ${theme.getBreakpoint('XSmall')}{height:56px;}`
  };
};

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
  ],
  providers: [
    LyHostClass,
    StyleRenderer
  ]
})
export class LyToolbar extends LyToolbarMixinBase implements OnChanges, OnInit {
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this.theme.renderStyleSheet(STYLES);
  private _position: position;
  private _positionClass: string;
  private _appearance: string;
  private _appearanceClass: string | null;
  @Input()
  set position(val: position) {
    this._position = val;
    this._positionClass = this.theme.addStyle(`lyToolbar.position:${val}`, `position:${val}`, this._el.nativeElement, this._positionClass, STYLE_PRIORITY);
  }
  get position(): position {
    return this._position;
  }

  @Input()
  set appearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      this._appearanceClass = this._sr.add(
        `LyToolbar.appearance:${val}`,
        (theme: LyToolbarVariables, ref) => {
          const classes = ref.selectorsOf(STYLES);
          if (theme.toolbar && theme.toolbar.appearance) {
            const appearance = theme.toolbar.appearance[val];
            if (appearance) {
              return appearance instanceof StyleCollection
                ? appearance.setTransformer((_) => _(classes)).css
                : appearance(classes);
            }
          }
          throw new Error(`${val} not found in theme.field.appearance`);
        },
        STYLE_PRIORITY,
        this._appearanceClass
      );
    }
  }
  get appearance(): string {
    return this._appearance;
  }
  constructor(
    _renderer: Renderer2,
    private _el: ElementRef,
    private theme: LyTheme2,
    private _sr: StyleRenderer
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
