import { Directive, Input, Renderer2, ElementRef, OnInit, OnChanges } from '@angular/core';
import { LyIconService, SvgIcon } from './icon.service';
import { take } from 'rxjs/operators';
import { Platform, LyTheme2, mixinStyleUpdater, mixinBg, mixinFlat, mixinColor, mixinRaised, mixinOutlined, mixinElevation, mixinShadowColor } from '@alyle/ui';

const STYLE_PRIORITY = -2;

export class LyButtonBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

export const LyButtonMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(LyButtonBase))))))));


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
export class LyIcon extends LyButtonMixinBase implements OnChanges, OnInit {
  private _defaultClass = 'material-icons';
  private _src: string;
  private _icon: string;
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
    this.updateStyle(this._el);
  }

  private _isDefault() {
    return !(this.src || this.icon);
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
      this._renderer.addClass(this._el.nativeElement, this._defaultClass);
    }
  }

  ngOnInit() {
    this._updateClass();
    this._theme.addStyle('lyIconRoot', theme => (
      `font-size:${theme.icon.fontSize};` +
      `width:1em;` +
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
}
