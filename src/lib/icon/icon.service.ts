import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

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
  private svgMap = new Map<string, SvgIcon>();
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  readonly defaultSvgIcon: SVGElement;
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
}

