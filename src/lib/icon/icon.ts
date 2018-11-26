import { Directive, Input, Renderer2, ElementRef, OnInit, OnChanges } from '@angular/core';
import { LyIconService, SvgIcon, FontClassOptions } from './icon.service';
import { take } from 'rxjs/operators';
import { Platform, LyTheme2, mixinStyleUpdater, mixinBg, mixinFlat, mixinColor, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor } from '@alyle/ui';

const STYLE_PRIORITY = -2;

/** @docs-private */
export class LyIconBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyIconMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(LyIconBase))))))));


@Directive({
  selector: 'ly-icon',
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
  ],
})
export class LyIcon extends LyIconMixinBase implements OnChanges, OnInit {
  private _src: string;
  private _icon: string;
  private _fontSet: string;
  private _previousFontSet: FontClassOptions;
  private _currentClass: string;
  private _fontIcon: string;

  /** deprecated */
  @Input()
  set src(val: string) {
    this._src = val;
    if (Platform.isBrowser) {
      if (val) {
        const key = `_url:${val}`;
        this.iconService.setSvg(key, val);
        this._prepareSvgIcon(this.iconService.getSvg(key));
      }
    } else {
      this._appendDefaultSvgIcon();
    }
  }
  get src() {
    return this._src;
  }

  @Input()
  get icon() {
    return this._icon;
  }
  set icon(val: string) {
    this._icon = val;
    if (Platform.isBrowser) {
      this._prepareSvgIcon(this.iconService.getSvg(val));
    } else {
      this._appendDefaultSvgIcon();
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

  constructor(
    private iconService: LyIconService,
    private _el: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2
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
    return !(this.src || this.icon || this.fontSet);
  }

  private _prepareSvgIcon(svgIcon: SvgIcon) {
    if (svgIcon.svg) {
      this._cleanIcon();
      this._appendChild(svgIcon.svg.cloneNode(true) as SVGElement);
    } else {
      svgIcon.obs
        .pipe(
          take(1)
        )
        .subscribe((svgElement) => {
          this._cleanIcon();
          this._appendChild(svgElement.cloneNode(true) as SVGElement);
        });
    }
  }

  private _appendChild(svg: SVGElement) {
    this._renderer.addClass(svg, this.iconService.classes.svg);
    this._renderer.appendChild(this._el.nativeElement, svg);
  }

  private _appendDefaultSvgIcon() {
    this._appendChild(this.iconService.defaultSvgIcon);
  }

  private _updateClass() {
    if (this._isDefault()) {
      this._renderer.addClass(this._el.nativeElement, this.iconService.defaultClass);
    }
  }

  ngOnInit() {
    this._updateClass();
    this._theme.addStyle('lyIconRoot', theme => (
      `font-size:${theme.icon.fontSize};` +
      `width:1em;` +
      `position:relative;` +
      `height:1em;` +
      `display:inline-flex;`
    ), this._el.nativeElement, undefined, STYLE_PRIORITY);
  }

  /**
   * run only browser
   * remove current icon
   */
  private _cleanIcon() {
    const icon = this._el.nativeElement.querySelector('svg');
    if (icon) {
      this._renderer.removeChild(this._el, icon);
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
      Error(`Icon with key${fontSetKey} not found`);
    }
    this._currentClass = `${iconClass.prefix}${icon}`;
    this._renderer.addClass(el, this._currentClass);
  }
}
