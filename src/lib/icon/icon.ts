import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2
  } from '@angular/core';
import { FontClassOptions, LyIconService, SvgIcon } from './icon.service';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  Platform,
  ThemeVariables,
  keyframesUniqueId,
  LyHostClass } from '@alyle/ui';
import { take } from 'rxjs/operators';

const STYLE_PRIORITY = -2;
export const STYLES = (theme: ThemeVariables) => {
  const loading = keyframesUniqueId.next();
  const { primary, secondary, tertiary } = theme.background;
  const lum = primary.default.luminance();
  let one = (lum < .5
    ? tertiary
    : secondary);
  let two = (lum < .5
    ? secondary
    : tertiary);
  one = one.darken(.25 * (lum < .5 ? -1 : 1.1));
  two = two.darken(.25 * (lum < .5 ? -1 : 1.1));
  return {
    $priority: STYLE_PRIORITY,
    $global: (className: string) => `@keyframes ${loading}{${className} 0%{background-position:200% 50%;}${className} 100%{background-position:-200% 50%;}}`,
    loading: (className: string) => `${className}{background:${
        `linear-gradient(270deg, ${
          one
        }, ${
          two
        }, ${
          two
        }, ${
          one
        })`};background-size:400% 400%;animation:${loading} 8s ease-in-out infinite;}`,
    defaultIcon: (className: string) => `${className}{border-radius:50px;}`
  };
};

/** @docs-private */
export class LyIconBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyIconMixinBase = mixinStyleUpdater(
mixinBg(
  mixinColor(
    mixinRaised(
      mixinOutlined(
        mixinElevation(
          mixinShadowColor(LyIconBase)))))));


@Directive({
  selector: 'ly-icon',
  inputs: [
    'bg',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
  ],
  exportAs: 'lyIcon',
  providers: [
    LyHostClass
  ]
})
export class LyIcon extends LyIconMixinBase implements OnChanges, OnInit, OnDestroy {
  readonly classes = this._theme.addStyleSheet(STYLES);
  private _icon: string;
  private _fontSet: string;
  private _previousFontSet: FontClassOptions;
  private _currentClass: string;
  private _fontIcon: string;
  private _iconElement?: SVGElement;

  @Input()
  get icon() {
    return this._icon;
  }
  set icon(val: string) {
    this._icon = val;
    this._addDefaultIcon();
    if (Platform.isBrowser) {
      this._prepareSvgIcon(this.iconService.getSvg(val));
    }
  }

  @Input()
  get fontSet(): string {
    return this._fontSet;
  }
  set fontSet(key: string) {
    this._fontSet = key;
  }

  @Input()
  get fontIcon(): string {
    return this._fontIcon;
  }
  set fontIcon(key: string) {
    this._fontIcon = key;
  }

  /** @docs-private */
  get hostElement() {
    return this._el.nativeElement;
  }

  constructor(
    private iconService: LyIconService,
    private _el: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2,
    private _hostClass: LyHostClass
  ) {
    super(theme);
    this.setAutoContrast();
  }

  ngOnChanges() {
    if (this.fontSet || this.fontIcon) {
      this._updateFontClass();
    }
    this.updateStyle(this._el);
  }

  private _isDefault() {
    return !(this.icon || this.fontSet);
  }

  private _prepareSvgIcon(svgIcon: SvgIcon) {
    if (svgIcon.svg) {
      this._appendChild(svgIcon.svg.cloneNode(true) as SVGElement);
    } else {
      svgIcon.obs!
        .pipe(
          take(1)
        )
        .subscribe((svgElement) => {
          this._appendChild(svgElement.cloneNode(true) as SVGElement);
        });
    }
  }

  private _appendChild(svg: SVGElement) {
    this._cleanIcon();
    this._iconElement = svg;
    this._renderer.addClass(svg, this.iconService.classes.svg);
    this._renderer.appendChild(this._el.nativeElement, svg);
  }

  private _addDefaultIcon() {
    this._hostClass.add(this.classes.defaultIcon);
    this._hostClass.add(this.classes.loading);
  }

  // private _appendDefaultSvgIcon() {
  //   const svgIcon = this.iconService._textToSvg(this.iconService.defaultSvgIcon) as SVGAElement;
  //   svgIcon.classList.add(this.classes.loading);
  //   this._appendChild(svgIcon);
  // }

  private _updateClass() {
    if (this._isDefault() && this.iconService.defaultClass) {
      this._renderer.addClass(this._el.nativeElement, this.iconService.defaultClass);
    }
  }

  ngOnInit() {
    this._updateClass();
    this._theme.addStyle('lyIconRoot', (theme: ThemeVariables) => (
      `font-size:${theme.icon.fontSize};` +
      `width:1em;` +
      `position:relative;` +
      `height:1em;` +
      `display:inline-flex;` +
      `-webkit-box-sizing: content-box;` +
      `-moz-box-sizing: content-box;` +
      `box-sizing: content-box;`
    ), this._el.nativeElement, undefined, STYLE_PRIORITY);
  }

  ngOnDestroy() {
    this._cleanIcon();
  }

  /**
   * run only browser
   * remove current icon
   */
  private _cleanIcon() {
    const icon = this._iconElement;
    this._hostClass.remove(this.classes.defaultIcon);
    this._hostClass.remove(this.classes.loading);
    if (icon) {
      this._renderer.removeChild(this._el.nativeElement, icon);
      this._iconElement = undefined;
    }
  }

  private _updateFontClass() {

    const currentClass = this._currentClass;
    const fontSetKey = this.fontSet;
    const icon = this.fontIcon;
    const el = this._el.nativeElement;
    const iconClass = this.iconService.getFontClass(fontSetKey);
    if (currentClass) {
      this._renderer.removeClass(el, currentClass);
    }
    if (this._previousFontSet) {
      if (this._previousFontSet.class) {
        this._renderer.removeClass(el, this._previousFontSet.class);
      }
    }
    if (iconClass) {
      this._previousFontSet = iconClass;
    } else {
      throw new Error(`Icon with key${fontSetKey} not found`);
    }
    this._currentClass = `${iconClass.prefix}${icon}`;
    this._renderer.addClass(el, this._currentClass);
  }
}
