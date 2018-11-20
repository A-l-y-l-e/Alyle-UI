import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { LyIconService, SvgIcon } from './icon.service';
import { take } from 'rxjs/operators';
import { Platform, LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

@Directive({
  selector: 'ly-icon',
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple',
  ],
})
export class Icon implements OnInit {
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

  @Input() set icon(val: string) {
    this._icon = val;
    if (Platform.isBrowser) {
      this._prepareSvgIcon(this.iconService.getSvg(val));
    } else {
      this._appendDefaultSvgIcon();
    }
  }
  get icon() {
    return this._icon;
  }

  constructor(
    private iconService: LyIconService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2
  ) { }

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
    this.renderer.addClass(svg, this.iconService.classes.svg);
    this.renderer.appendChild(this.elementRef.nativeElement, svg);
  }

  private _appendDefaultSvgIcon() {
    this._appendChild(this.iconService.defaultSvgIcon);
  }

  private _updateClass() {
    if (this._isDefault()) {
      this.renderer.addClass(this.elementRef.nativeElement, this._defaultClass);
    }
  }

  ngOnInit() {
    this._updateClass();
    this.theme.addStyle('lyIconRoot', theme => (
      `font-size:${theme.icon.fontSize};` +
      `width:1em;` +
      `height:1em;` +
      `display:inline-flex;`
    ), this.elementRef.nativeElement, undefined, STYLE_PRIORITY);
  }

  /**
   * run only browser
   * remove current icon
   */
  private _cleanIcon() {
    const icon = this.elementRef.nativeElement.querySelector('svg');
    if (icon) {
      this.renderer.removeChild(this.elementRef, icon);
    }
  }
}
