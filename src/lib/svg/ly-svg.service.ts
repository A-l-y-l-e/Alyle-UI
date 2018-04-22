import { Injectable }     from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of }     from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LySvgService {
  private static readonly _svg: Map<string, SVGElement> = new Map<string, SVGElement>();
  constructor(private _http: HttpClient) {
  }
  getSVG(url: string): Promise<SVGElement> {
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
    return svg;
  }
  private _cloneSVG(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}
