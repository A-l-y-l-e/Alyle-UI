import { Directive, Input, Renderer2, ElementRef, OnChanges, OnInit } from '@angular/core';
import { LyIconService, SvgIcon } from './icon.service';
import { take } from 'rxjs/operators';
import { Platform, LyTheme2 } from '@alyle/ui';

@Directive({
  selector: 'ly-icon'
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
    svgIcon.obs
      .pipe(
        take(1)
      )
      .subscribe((svgElement) => {
        this._cleanIcon();
        this._appendChild(svgElement);
      });
  }

  private _appendChild(svg: SVGElement) {
    this.renderer.addClass(svg, this.iconService.classes.svg);
    this.renderer.appendChild(this.elementRef.nativeElement, svg);
  }

  private _appendDefaultSvgIcon() {
    this._appendChild(this.iconService.textToSvg('<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"></circle></svg>'));
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
    ), this.elementRef.nativeElement);
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
