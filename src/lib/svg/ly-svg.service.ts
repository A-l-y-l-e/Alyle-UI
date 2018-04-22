import { Injectable }     from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of }     from 'rxjs';
import { map } from 'rxjs/operators';
import { LyTheme as Theme, StyleData, Platform } from 'alyle-ui/core';
@Injectable({
  providedIn: 'root'
})
export class LySvgService {
  private static readonly _svg: Map<string, SVGElement> = new Map<string, SVGElement>();
  stylesData: {
    [key: string]: StyleData
  } = {};
  constructor(
    private _http: HttpClient,
    private theme: Theme
  ) {
    this.stylesData.style_host = this.theme.createStyle('svg', () => {
      return `width: inherit;` +
      `height: inherit;` +
      `fill: currentColor;` +
      `display: block;`;
    });
  }
  getSVG(url: string): Promise<SVGElement> {
    if (!Platform.isBrowser) {
      return Promise.resolve(this._svgElementFromString(`<svg height="48" viewBox="0 0 20 20" width="48" class="ly_7"><circle cx="10" cy="10" r="10"></circle></svg>`));
    }
    if (LySvgService._svg.has(url)) {
      return Promise.resolve(this._cloneSVG(LySvgService._svg.get(url)));
    }
    const req = this._http.get(url, { responseType: 'text' })
    .pipe(
      map((res) => {
        const svgEl = this._svgElementFromString(res);
        LySvgService._svg.set(url, svgEl);
        return this._cloneSVG(svgEl);
      })
    )
    .toPromise();
    return req;
  }
  private _svgElementFromString(str: string): SVGElement | never {
    const div: HTMLElement = document.createElement('DIV');
    div.innerHTML = str;

    const svg = div.querySelector('svg') as SVGElement;

    if (!svg) {
      throw new Error('No SVG found in loaded contents');
    }
    svg.classList.add(this.stylesData.style_host.id);
    return svg;
  }
  private _cloneSVG(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}
