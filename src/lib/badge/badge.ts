import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  OnDestroy,
  SimpleChanges,
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
  ThemeRef
} from '@alyle/ui';

import { BadgeVariables } from './badge';

export interface BadgeVariables {
  badge?: BadgeThemeConfig;
}

export interface BadgeThemeConfig {
  root?: (classes: LyClasses<typeof STYLES>) => StyleTemplate;
}

export const BADGE_THEME_CONFIG = new InjectionToken<BadgeThemeConfig>('badge-theme-config');

const STYLE_PRIORITY = -2;
// const DEFAULT_POSITION = 'startTop';
// const DEFAULT_BG = 'primary';
// const DEFAULT_POSITION_VALUE = {
//   after: '-11px',
//   above: '-11px'
// };

export const STYLES = (theme: ThemeVariables & BadgeVariables, ref: ThemeRef) => {
  const classes = ref.getClasses(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      position: absolute
      display: flex
      width: 22px
      height: 22px
      border-radius: 100%
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      pointer-events: none
      z-index: 1
      font-size: ${theme.pxToRem(12)}
      font-family: ${theme.typography.fontFamily}
      justify-content: center
      align-items: center
      box-sizing: border-box
      {
        ...${
          (theme.badge && theme.badge.root)
            ? theme.badge.root(classes)
            : null
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
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this._theme.addStyleSheet(STYLES);
  private _content: string | number;
  // private _position: string;
  // private _positionClass: string;
  private _elContainer: any;
  private _badgeElementRef: any;
  private _lyBadgeBgClass: string;

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

  // /** The position for the badge */
  // @Input('lyBadgePosition')
  // set position(val: string) {
  //   if (val !== this.position) {
  //     this._position = val;
  //     this._positionClass = this._theme.addStyle(`ly-badge.position:${val}`, (theme: ThemeVariables & BadgeVariables) => {
  //       const sty = theme.badge!.position && theme.badge!.position![val] || val === DEFAULT_POSITION ? DEFAULT_POSITION_VALUE : null;
  //       if (sty) {
  //         return sty;
  //       } else {
  //         throw new Error(`LyBadge.position \`${val}\` not found in \`ThemeVariables\``);
  //       }
  //     },
  //     this._badgeElementRef, this._positionClass, STYLE_PRIORITY);
  //   }

  // }
  // get position() {
  //   return this._position;
  // }

  @Input() hPosition: 'before' | 'after' = 'after';
  @Input() vPosition: 'above' | 'below' = 'above';

  @Input()
  get overlap() {
    return this._overlap;
  }
  set overlap(val: 'circle' | 'rectangle') {
    if (val !== this.overlap) {
      this._overlap = val;
    }
  }
  private _overlap: 'circle' | 'rectangle' = 'rectangle';

  /** The color of the badge */
  @Input()
  get lyBadgeBg() {
    return this._lyBadgeBg;
  }
  set lyBadgeBg(val: string) {
    if (val !== this.lyBadgeBg) {
      this._lyBadgeBg = val;
      this._lyBadgeBgClass = this._theme.addStyle(`ly-badge.bg:${val}`, (theme: ThemeVariables) => ({
        backgroundColor: theme.colorOf(val),
        color: theme.colorOf(`${val}:contrast`)
      }),
      this._badgeElementRef, this._lyBadgeBgClass, STYLE_PRIORITY);
    }
  }
  private _lyBadgeBg: string;

  constructor(
    private _el: ElementRef,
    _theme: LyTheme2,
    private _renderer: Renderer2
  ) {
    super(_theme);
    this.setAutoContrast();
    this._badgeElementRef = this._el.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.content) {
      this.updateStyle(this._el);
    }
    if (changes.hPosition || changes.vPosition) {
      // code
    }
  }

  ngOnInit() {

    /** Add root styles */
    this._renderer.addClass(this._badgeElementRef, this.classes.root);

    // /** Set default position */
    // if (!this.position) {
    //   this.position = DEFAULT_POSITION;
    // }

    // /** Set default bg */
    // if (this.content && !this.lyBadgeBg) {
    //   this.lyBadgeBg = DEFAULT_BG;
    // }
  }

  ngOnDestroy() {
    if (this._elContainer) {
      this._renderer.removeChild(this._el.nativeElement, this._elContainer);
    }
  }

  private _createBadge() {
    if (!this._elContainer) {
      const container = this._elContainer = this._renderer.createElement('div');
      this._renderer.appendChild(this._el.nativeElement, container);
      this._badgeElementRef = container;

      /** Add position relative */
      this._renderer.addClass(this._el.nativeElement, this.classes.relative);
    }
    this._elContainer.textContent = `${this.content}`;
  }

}
