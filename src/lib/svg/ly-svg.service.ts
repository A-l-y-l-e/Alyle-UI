import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
@Injectable()
export class LySvgService {
  private static _svg: Map<string, SVGElement> = new Map<string, SVGElement>();
  constructor(private _http: Http) {
    if (!LySvgService._svg) {
      LySvgService._svg = new Map<string, SVGElement>();
    }
  }
  getSVG(url: string): Observable<SVGElement> {
    if (LySvgService._svg.has(url)) {
      // console.warn('LySvgService._svg', LySvgService._svg);
      return Observable.of(this._cloneSVG(LySvgService._svg.get(url)));
    }
    const req = this._http.get(url)
    .map((res: Response) => res.text())
    .catch((err: any) => err)
    .finally(() => {
      // console.warn('finally._svg');
      // SVGCacheService._inProgressReqs.delete(absUrl);
    })
    .share()
    .map((svgText: string) => {
      const svgEl = this._svgElementFromString(svgText);
      LySvgService._svg.set(url, svgEl);
      return this._cloneSVG(svgEl);
    });
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
