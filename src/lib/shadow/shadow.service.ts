import { Injectable, Inject, PLATFORM_ID, Renderer2, ElementRef }       from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { converterToHex, Platform, LyTheme, shadowBuilder }         from 'alyle-ui/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as _chroma from 'chroma-js';
const chroma = _chroma;

@Injectable()
export class LyShadowService {
  /** Default elevation */
  elevation: string | number = 1;
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId,
    private theme: LyTheme
  ) { }

  /** demo: setShadow([elevation, color]) */
  setShadow(elementRef: ElementRef, renderer: Renderer2, val: string[], _lastClass?: string) {
    let keys: string;
    let elevation: string | number;
    let color = 'colorShadow';
    if (val) {
      keys = val.join();
      elevation = val[0];
      color = val[1] || color;
    } else {
      keys = `${this.elevation}`;
      elevation = this.elevation;
    }
    const newStyle = this.theme.createStyle(`ly-${keys}`, this._css.bind(this), elevation, color);
    this.theme.updateClass(elementRef, renderer, newStyle.id, _lastClass);
    return newStyle.id;
  }

  _css(elevation: string | number, color: string = '') {
    return `${shadowBuilder(elevation, this.theme.colorOf(color))}`;
  }

  shadow(color: string, size: number) {
    if (isPlatformBrowser(this.platformId)) {
      const sizeOrigin = size;
      // const _color = chroma(converterToHex(chroma(color).css('hsl'))).get('rgba');
      // const _color = chroma(color).rgba();
      const opacity = <any>chroma(color).alpha();
      const hex = chroma.mix('#fff', color, opacity).hex();
      const rgb = chroma(hex).rgb();
      const style = getShadow(size, rgb);
      // let style = `
      // rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
      //   ((70 / 100) * Number(size / 2))
      // }) 0px ${
      //   (((3 * size) - 2) / 2) * toPositiveNumber(sizeOrigin, true)
      // }px ${
      //   (3 * size * 2) / 2
      // }px 0px${
      //   ','
      // } rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
      //   ((60 / 100) * Number('0.' + String(size)))
      // }) 0px ${
      //   (((3 * size) - 2) / 3) * toPositiveNumber(sizeOrigin, true)
      // }px ${
      //   (3 * size * 2)
      // }px 0px${
      //   ','
      // } rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
      //   (40 / 100) * Number('0.' + String(size))
      // }) 0px ${
      //   (((3 * size) - 2)) * toPositiveNumber(sizeOrigin, true)
      // }px ${(3 * size * 2) / 1.4}px 0px`;

      // if (size < 2 && size > 0) {
      //   style = style + `, rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
      //     .23
      //   }) 0px ${2 * toPositiveNumber(sizeOrigin, true)}px 6px 0px`;
      // }
      return this.sanitizer.bypassSecurityTrustStyle(style);
    } else {
      return '';
    }
  }
}
function getShadow(level: number, rgb: number[]) {
  const v = asfdtyd(1, 19, level),
  blur = asfdtyd(3, 38, level),
  opacity = asfdtyd(12, 30, level) / 100,

  v2 = asfdtyd(1, 15, level),
  blur2 = asfdtyd(2, 12, level),
  opacity2 = asfdtyd(24, 22, level) / 100,

  v3 = asfdtyd(1, 10, level),
  blur3 = asfdtyd(10, 38, level),
  size = asfdtyd(0, -7, level),
  opacity3 = asfdtyd(12, 32, level) / 100;
  return `0 ${v}px ${blur}px rgba(${rgb.join()},${opacity}), 0 ${v2}px ${blur2}px rgba(${rgb.join()},${opacity2}), 0 ${v3}px ${blur3}px ${size}px rgba(${rgb.join()},${opacity3})`;
}
function asfdtyd(min, max, level) {
  let val = min;
  val += ((max - min) / 9) * (Math.abs(level) - 1);
  val *= Math.sign(level);
  return val;
}

