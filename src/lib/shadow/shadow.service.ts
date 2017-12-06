import { Injectable, Inject, PLATFORM_ID }       from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { toPositiveNumber } from './toPositiveNumber';
import { converterToHex }         from 'alyle-ui/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import chroma from 'chroma-js';

@Injectable()
export class LyShadowService {
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId
  ) { }
  shadow(color: string, size: number) {
    if (isPlatformBrowser(this.platformId)) {
      const sizeOrigin = size;
      const _color = chroma(converterToHex(chroma(color).css('hsl'))).get('rgba');
      size = toPositiveNumber(size);
      let style = `
      rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
        ((70 / 100) * Number(size / 2))
      }) 0px ${
        (((3 * size) - 2) / 2) * toPositiveNumber(sizeOrigin, true)
      }px ${
        (3 * size * 2) / 2
      }px 0px${
        ','
      } rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
        ((60 / 100) * Number('0.' + String(size)))
      }) 0px ${
        (((3 * size) - 2) / 3) * toPositiveNumber(sizeOrigin, true)
      }px ${
        (3 * size * 2)
      }px 0px${
        ','
      } rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
        (40 / 100) * Number('0.' + String(size))
      }) 0px ${
        (((3 * size) - 2)) * toPositiveNumber(sizeOrigin, true)
      }px ${(3 * size * 2) / 1.4}px 0px`;

      if (size < 2 && size > 0) {
        style = style + `, rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${
          .23
        }) 0px ${2 * toPositiveNumber(sizeOrigin, true)}px 6px 0px`;
      }
      return this.sanitizer.bypassSecurityTrustStyle(style);
    } else {
      return '';
    }
  }
}
