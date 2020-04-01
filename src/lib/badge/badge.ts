import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  OnDestroy,
  InjectionToken
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
  lyl,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  StyleCollection,
  StyleRenderer
} from '@alyle/ui';


export interface LyBadgeVariables {
  badge?: LyBadgeTheme;
}

export interface LyBadgeTheme {
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  appearance?: {
    default?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    dot?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    [name: string]: ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
}

export const LY_BADGE_DEFAULT_OPTIONS = new InjectionToken<LyBadgeTheme>('BADGE_DEFAULT_OPTIONS');

const STYLE_PRIORITY = -2;
const DEFAULT_H_POSITION = 'after';
const DEFAULT_V_POSITION = 'above';
const DEFAULT_BG = 'primary';
const DEFAULT_APPEARANCE = 'default';
const DEFAULT_OVERLAP = 'rectangle';

export const STYLES = (theme: ThemeVariables & LyBadgeVariables, ref: ThemeRef) => {
  const badge = ref.selectorsOf(STYLES);
  return {
    $name: LyBadge.и,
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      position: absolute
      display: flex
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      font-size: ${theme.pxToRem(12)}
      font-family: ${theme.typography.fontFamily}
      justify-content: center
      align-items: center
      box-sizing: border-box
      z-index: 1
      {
        ...${
          (theme.badge
            && theme.badge.root
            && (theme.badge.root instanceof StyleCollection
              ? theme.badge.root.setTransformer(fn => fn(badge))
              : theme.badge.root(badge))
          )
        }
      }
    }`,
    relative: lyl `{
      position: relative
    }`
  };
};

/** @docs-private */
export class LyBadgeBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyBadgeMixinBase = mixinStyleUpdater(
mixinBg(
  mixinColor(
    mixinRaised(
      mixinDisabled(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(LyBadgeBase))))))));

@Directive({
  selector: 'ly-badge, [lyBadge]',
  inputs: [
    'bg',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor'
  ]
})
export class LyBadge extends LyBadgeMixinBase implements OnChanges, OnInit, OnDestroy {
  static readonly и = 'LyBadge';
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  private _content: string | number;
  // private _position: string;
  private _positionClass: string;
  private _badgeEl: any;
  private _badgeElementRef: any;
  private _sRenderer?: StyleRenderer;

  /** The content for the badge */
  @Input('lyBadge')
  set content(val: string | number) {
    if (val !== this.content) {
      this._content = val;
      this._createBadge();
    }
  }
  get content(): string | number {
    return this._content;
  }

  @Input()
  set container(container: HTMLElement) {
    if (container == null) {
      throw new Error(`${LyBadge.и}: [container] is undefined.`);
    }
    if (this.content != null) {
      throw new Error(`${LyBadge.и}: [container] with [content] don't work together.`);
    }
    if (!container.tagName) {
      throw new Error(`${LyBadge.и}: the value given to container is not an HTMLElement`);
    }
    this._container = container;
    this._renderer.appendChild(container, this._el.nativeElement);

  }
  get container() {
    return this._container;
  }
  private _container: HTMLElement;

  @Input() hPosition: 'before' | 'after';
  @Input() vPosition: 'above' | 'below';

  @Input()
  get overlap() {
    return this._overlap;
  }
  set overlap(val: 'circle' | 'rectangle') {
    if (val !== this.overlap) {
      this._overlap = val;

      Promise.resolve(null!).then(() => {
        const overlap = val;
        const hp = this.hPosition;
        const vp = this.vPosition;

        const newClass = this._theme.renderStyle(`${LyBadge.и}-overlap-${val}&${hp}&${vp}`, (theme: ThemeVariables) => {
          const p = overlap === 'circle'
            ? 14 : 0;
          return lyl `{
            ${theme.getDirection(vp)}: ${p}%
            ${theme.getDirection(hp)}: ${p}%
          }`;
        }, STYLE_PRIORITY);
        this._overlapClass = this._sRenderer!.updateClass(newClass, this._overlapClass);
      });
    }
  }
  private _overlap: 'circle' | 'rectangle';
  private _overlapClass: string;

  /** The color of the badge */
  @Input()
  get bg() {
    return this._lyBadgeBg;
  }
  set bg(val: string) {
    if (this.content == null) {
      this.lyBadgeBg = val;
    }
  }

  /** The color of the badge */
  @Input()
  get lyBadgeBg() {
    return this._lyBadgeBg;
  }
  set lyBadgeBg(val: string) {
    if (val !== this.lyBadgeBg) {
      this._lyBadgeBg = val;

      const newClass = this._theme.renderStyle(`${LyBadge.и}--bg-${val}`,
      (theme: ThemeVariables) => lyl `{
        background-color: ${theme.colorOf(val)}
        color: ${theme.colorOf(`${val}:contrast`)
      }`, STYLE_PRIORITY);

      Promise.resolve(null!).then(() => {
        this[0x1] = this._sRenderer!.updateClass(newClass, this[0x1]);
      });


    }
  }
  private _lyBadgeBg: string;

  @Input()
  get appearance() {
    return this._appearance;
  }
  set appearance(val: string) {
    if (this.content == null) {
      this.lyBadgeAppearance = val;
    }
  }

  @Input()
  get lyBadgeAppearance() {
    return this._appearance;
  }
  set lyBadgeAppearance(val: string) {
    if (val !== this.appearance) {
      this._appearance = val;
      const styleID = `${LyBadge.и}--appearance-${val}`;
      const newClass = this._theme.renderStyle(
        styleID,
        (theme: LyBadgeVariables) => {
          const appearance = theme.badge
            && theme.badge.appearance
            && theme.badge.appearance[val]
            && theme.badge.appearance[val]!(this.classes);
          if (appearance) {
            return appearance;
          }
          throw new Error(`${styleID} is not defined in the theme.`);
        },
        STYLE_PRIORITY
      );
      Promise.resolve(null!).then(() => {
        this._appearanceClass = this._sRenderer!.updateClass(newClass, this._appearanceClass);
      });
    }
  }

  private _appearance: string;
  private _appearanceClass: string;

  constructor(
    private _el: ElementRef<HTMLElement>,
    _theme: LyTheme2,
    private _renderer: Renderer2
  ) {
    super(_theme);
    this.setAutoContrast();
    this._badgeElementRef = this._el.nativeElement;
  }

  ngOnChanges() {
    if (this.content == null) {
      this.updateStyle(this._el);
    }
    this._updatePosition();
    if (!this._sRenderer) {
      this._sRenderer = new StyleRenderer(this._theme, this._el, this._renderer);
    }
  }

  ngOnInit() {

    /** Add root styles */
    this._renderer.addClass(this._badgeElementRef, this.classes.root);

    /** Set default bg */
    if (!this.bg) {
      this.lyBadgeBg = DEFAULT_BG;
    }

    /** Set default position */
    let requireUpdate = false;
    if (!this.hPosition) {
      requireUpdate = true;
      this.hPosition = DEFAULT_H_POSITION;
    }
    if (!this.vPosition) {
      requireUpdate = true;
      this.vPosition = DEFAULT_V_POSITION;
    }
    if (requireUpdate) {
      this._updatePosition();
    }

    /** Set default appearance */
    if (!this.appearance) {
      this.lyBadgeAppearance = DEFAULT_APPEARANCE;
    }

    /** Set default overlap */
    if (!this.overlap) {
      this.overlap = DEFAULT_OVERLAP;
    }
  }

  ngOnDestroy() {
    if (this._badgeEl) {
      this._renderer.removeChild(this._el.nativeElement, this._badgeEl);
    }
  }

  private _updatePosition() {
    const hp = this.hPosition;
    const vp = this.vPosition;

    if (hp && vp) {
      let y: number;
      let x: number;
      if (hp && vp) {
        if (hp === 'after') {
          x = 50;
        } else {
          x = -50;
        }
        if (vp === 'above') {
          y = -50;
        } else {
          y = 50;
        }
      }

      const newClass = this._theme.renderStyle(`${LyBadge.и}--position-${hp}-${vp}`,
      (theme: ThemeVariables) => lyl `{
        transform: translate(${theme.after === 'right'
          ? x : -x}%, ${y}%)
      }`, STYLE_PRIORITY);

      Promise.resolve(null!).then(() => {
        this._positionClass = this._sRenderer!.updateClass(newClass, this._positionClass);
      });

    }
  }

  private _createBadge() {
    if (!this._badgeEl) {
      const badge = this._badgeEl = this._renderer.createElement('div');
      this._renderer.appendChild((this.container) || this._el.nativeElement, badge);
      this._badgeElementRef = badge;
      this._sRenderer = new StyleRenderer(this._theme, new ElementRef(badge), this._renderer);

      /** Add position relative */
      this._renderer.addClass(this._el.nativeElement, this.classes.relative);
    }
    this._badgeEl.textContent = `${this.content}`;
  }

}
