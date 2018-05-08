import { Injectable, Optional, Inject, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LyTheme, ProvidedInTheme } from '@alyle/ui';
import { LY_CHECKBOX_CONTROL_VALUE_ACCESSOR } from '../checkbox';
@Injectable({
  providedIn: 'root'
})
export class LyIconService {
  private svgMap = new Map<string, Observable<SVGElement>>();

  constructor(
    private http: HttpClient,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) { }

  setSvg(key: string, url: string) {
    if (!this.svgMap.has(key)) {
      this.svgMap.set(key,
        this.http.get(url, { responseType: 'text' })
        .pipe(
          share(),
          map(svgText => this.textToSvg(svgText)),
        )
      );
    }
  }

  private textToSvg(str: string): SVGElement {
    const div = this.document.createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;
    return svg;
  }

  getSvg(key: string): Observable<SVGElement> {
    return this.svgMap.get(key);
  }
}

@Injectable(ProvidedInTheme)
export class LyIconStyle {
  classes = {
    root: this.theme.createStyle(
      'root',
      () => (
        `font-size:${this.theme.palette.icon.fontSize};` +
        `width:1em;` +
        `height:1em;` +
        `display:inline-block;`
      )
    ).id,
    svg: this.theme.createStyle(
      '_svg',
      () => (
        `width:inherit;` +
        `height:inherit;` +
        `fill:currentColor;`
      ),
      /** for Root Theme */
      true
    ).id
  };

  constructor(private theme: LyTheme) { }
}
