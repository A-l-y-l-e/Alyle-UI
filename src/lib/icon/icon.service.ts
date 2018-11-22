import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

export interface FontClassOptions {
  key: string;
  /** Class name */
  class?: string;
  /** Frefix class */
  prefix?: string;
}
const styles = {
  svg: {
    width: 'inherit',
    height: 'inherit',
    fill: 'currentColor',
  }
};

export interface SvgIcon {
  obs: Observable<SVGElement>;
  svg?: SVGElement;
}

@Injectable({
  providedIn: 'root'
})
export class LyIconService {
  private _defaultClass = 'material-icons';
  private _defaultClassPrefix: string;
  private svgMap = new Map<string, SvgIcon>();
  private _fontClasses = new Map<string, FontClassOptions>();
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  readonly defaultSvgIcon: SVGElement;
  get defaultClass() {
    return this._defaultClass;
  }
  get defaultClassPrefix() {
    return this._defaultClassPrefix;
  }

  constructor(
    private http: HttpClient,
    @Optional() @Inject(DOCUMENT) private document: any,
    private theme: LyTheme2
  ) {
    this.defaultSvgIcon = this._textToSvg('<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"></circle></svg>');
  }

  setSvg(key: string, url: string) {
    if (!this.svgMap.has(key)) {
      url = `${url}.svg`;
      const svgIcon: SvgIcon = {
        obs: this.http.get(url, { responseType: 'text' })
        .pipe(
          share(),
          map(svgText => {
            if (svgIcon.svg) {
              return svgIcon.svg;
            }
            const svg = this._textToSvg(svgText);
            this._cacheSvgIcon(svg, key);
            return svg;
          }),
        )
      };
      this.svgMap.set(key, svgIcon);
    }
  }

  private _textToSvg(str: string): SVGElement {
    const div = this.document.createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;
    return svg;
  }

  private _cacheSvgIcon(svg: SVGElement, key: string) {
    const svgIconInfo = this.svgMap.get(key);
    if (!svgIconInfo.svg) {
      this.svgMap.get(key).svg = svg;
    }
  }

  getSvg(key: string): SvgIcon {
    return this.svgMap.get(key);
  }
  /**
   * Set default className for `ly-icon`
   * @param className class name
   * @param prefix Class prefix,
   * For example if you use FontAwesome your prefix would be `fa-`,
   * then in the template it is no longer necessary to use the prefix
   * Example: `<ly-icon fontIcon="alarm">`
   */
  setDefaultClass(className: string | null, prefix?: string) {
    this._defaultClass = className;
    this._defaultClassPrefix = prefix;
  }

  /**
   * Register new font class alias
   * demo:
   * For FontAwesome
   * registerFontClass('fa', 'fa', 'fa-')
   * @param key
   * @param className
   * @param prefix Class prefix
   */
  registerFontClass(opt: FontClassOptions) {
    this._fontClasses.set(opt.key, opt);
  }

  getFontClass(key: string) {
    return this._fontClasses.get(key);
  }
}

