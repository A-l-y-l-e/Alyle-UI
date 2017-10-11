import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
/* tslint:disable */
import Vibrant from 'node-vibrant';
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
    const v = new Vibrant(srcImg);
    return v.getPalette((error: any, pal: any) => {
      this.ls.setItem(srcImg, this._palette(pal));
    });
  }

  /**
   * return Vibrant & DarkVibrant
   */
  _palette(pal: any): VibrantColors {
    const palette = {};
    for (const color in pal) {
      palette[`${color}`] = {
        'bodyTextColor': pal[color].getBodyTextColor(),
        'hex': pal[color].getHex(),
        'titleTextColor': pal[color].getTitleTextColor(),
        'yiq': pal[color].getYiq()
      };
    }
    return palette as VibrantColors;
  }
}
