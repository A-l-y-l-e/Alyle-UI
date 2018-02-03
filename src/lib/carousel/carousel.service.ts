import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
/* tslint:disable */
// import Vibrant from 'node-vibrant';
/* tslint:enable */
import { MinimalLS } from 'alyle-ui/ls';
export class VibrantSwatch {
  bodyTextColor: string;
  hex: string;
  titleTextColor: string;
  yiq: string;

}
export class VibrantColors {
  Vibrant: VibrantSwatch = new VibrantSwatch;
  DarkVibrant: VibrantSwatch = new VibrantSwatch;
  DarkMuted: VibrantSwatch = new VibrantSwatch;
  Muted: VibrantSwatch = new VibrantSwatch;
  LightVibrant: VibrantSwatch = new VibrantSwatch;
}
@Injectable()
export class CarouselService {

  constructor(private ls: MinimalLS) { }

  getColorVibrant(srcImg: string): any {
    const v = new Vibrant(srcImg).getPalette();
    return v.then((pal) => {
      if (pal) {
        this.ls.setItem(srcImg, this._palette(pal));
      }
    });
  }

  /**
   * return Vibrant & DarkVibrant
   */
  _palette(pal: any): VibrantColors {
    const palette = {};
    for (const key in pal) {
      if (pal.hasOwnProperty(key)) {
        palette[`${key}`] = {
          'bodyTextColor': pal[key].getBodyTextColor(),
          'hex': pal[key].getHex(),
          'titleTextColor': pal[key].getTitleTextColor(),
          'yiq': pal[key].getYiq()
        };
    }
    }
    return palette as VibrantColors;
  }
}
