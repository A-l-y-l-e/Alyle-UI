import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -1;

const styles = {
  svg: {
    width: 'inherit',
    height: 'inherit',
    fill: 'currentColor',
    }
};

export interface SvgIcon {
  obs: Observable<SVGElement>;
  loaded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LyIconService {
  private svgMap = new Map<string, SvgIcon>();
  classes = this.theme.addStyleSheet(styles, 'lyIcon', STYLE_PRIORITY);
  constructor(
    private http: HttpClient,
    @Optional() @Inject(DOCUMENT) private document: any,
    private theme: LyTheme2
  ) { }

  setSvg(key: string, url: string) {
    if (!this.svgMap.has(key)) {
      url = `${url}.svg`;
      this.svgMap.set(key,
        {
          obs: this.http.get(url, { responseType: 'text' })
          .pipe(
            share(),
            map(svgText => this.textToSvg(svgText)),
          )
        }
      );
    }
  }

  textToSvg(str: string): SVGElement {
    const div = this.document.createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;
    return svg;
  }

  getSvg(key: string): SvgIcon {
    return this.svgMap.get(key);
  }
}

