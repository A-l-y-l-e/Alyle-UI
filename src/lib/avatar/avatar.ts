import { Directive, Input, ElementRef, OnInit, OnChanges, Renderer2, InjectionToken, Inject, Optional } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  lyl,
  StyleTemplate,
  LyHostClass
} from '@alyle/ui';

export interface LyAvatarTheme {
  /** Styles for Avatar Component */
  root?: () => StyleTemplate;
}

export interface LyAvatarDefaultOptions {
  size?: number;
  bg?: string;
}

export interface LyAvatarVariables {
  avatar?: LyAvatarTheme;
}


const STYLE_PRIORITY = -2;
const DEFAULT_SIZE = 40;
const DEFAULT_BG = 'action';

export const LY_AVATAR_DEFAULT_OPTIONS =
    new InjectionToken<LyAvatarDefaultOptions>('LY_AVATAR_DEFAULT_OPTIONS');

const STYLES = (theme: ThemeVariables & LyAvatarVariables) => {
  return {
    $name: LyAvatar.и,
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      display: inline-flex
      position: relative
      font-size: 1.25em
      flex-shrink: 0
      align-items: center
      user-select: none
      border-radius: 50%
      text-align: center
      justify-content: center
      &>img {
        width: 100%
        height: 100%
        border-radius: 50%
        display: block
        object-fit: cover
        -webkit-background-clip: padding-box
      }
      {
        ...${
          (theme.avatar
            && theme.avatar.root
            && theme.avatar.root()) || null
        }
      }
    }`
  };
};

/** @docs-private */
export class LyAvatarBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyAvatarMixinBase = mixinStyleUpdater(
  mixinBg(
    mixinColor(
      mixinRaised(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(LyAvatarBase)))))));

@Directive({
  selector: 'ly-avatar',
  inputs: [
    'bg',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
  ],
  providers: [
    LyHostClass
  ]
})
export class LyAvatar extends LyAvatarMixinBase implements OnChanges, OnInit {
  /** @docs-private */
  static readonly и = 'LyAvatar';

  /** @docs-private */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  private _size: number;
  private _sizeClass: string;

  /** Avatar size */
  @Input()
  set size(val: number) {
    if (val !== this.size) {
      this._size = val;
      const newClass = this._theme.renderStyle(`${LyAvatar.и}.size:${val}`, () => (
        lyl `{
          width: ${val}px
          height: ${val}px
        }`
      ), STYLE_PRIORITY);
      this._sizeClass = this._hostClass.update(newClass, this._sizeClass);
    }
  }
  get size() {
    return this._size;
  }

  constructor(
    theme: LyTheme2,
    renderer: Renderer2,
    private _elementRef: ElementRef,
    private _hostClass: LyHostClass,
    @Optional() @Inject(LY_AVATAR_DEFAULT_OPTIONS) private _defaults: LyAvatarDefaultOptions
  ) {
    super(theme);
    this.setAutoContrast();
    renderer.addClass(_elementRef.nativeElement, this.classes.root);
  }

  ngOnChanges() {
    this.updateStyle(this._elementRef.nativeElement);
  }

  ngOnInit() {
    if (!this.bg) {
      this.bg = (this._defaults && this._defaults.bg) || DEFAULT_BG;
      this.ngOnChanges();
    }
    if (!this.size) {
      this.size = (this._defaults && this._defaults.size) || DEFAULT_SIZE;
    }
  }
}
