import { Injectable, Optional, Inject, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LyTheme, ProvidedInTheme } from '@alyle/ui';

export interface SvgIcon {
  obs: Observable<SVGElement>;
  loaded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LyIconService {
  private svgMap = new Map<string, SvgIcon>();

  constructor(
    private http: HttpClient,
    @Optional() @Inject(DOCUMENT) private document: any
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

@Injectable(ProvidedInTheme)
export class LyIconStyle {
  classes = {
    root: this.theme.setStyle(
      'root',
      () => (
        `font-size:${this.theme.palette.icon.fontSize};` +
        `width:1em;` +
        `height:1em;` +
        `display:inline-flex;`
      )
    ),
    svg: this.theme.setRootStyle(
      '_svg',
      () => (
        `width:inherit;` +
        `height:inherit;` +
        `fill:currentColor;`
      )
    )
  };

  constructor(private theme: LyTheme) { }
}
