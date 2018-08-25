import { Injectable } from '@angular/core';
import { CoreTheme } from '@alyle/ui';

@Injectable({
  providedIn: 'root'
})
export class LyRippleService {
  stylesData: string[] = [];
  classes = {
    root: this.coreTheme.setUpStyleSecondary(
      'ripple', {
        '': () => (
          `z-index: 0;` +
          `border-radius: inherit;`
        )
      }
    )
  };
  constructor(
    private coreTheme: CoreTheme
  ) {
    const host = this.coreTheme.setUpStyle('ripple', {
      '': () => ( 'position: relative;' )
    });
    const rippleContainer = this.coreTheme.setUpStyle('ripple-cont', {'': () => (
      `position: absolute;` +
      `width: 5px;` +
      `height: 5px;` +
      `background: currentColor;` +
      `opacity: .19;` +
      `border-radius: 100%;` +
      `-webkit-transform: scale(0);` +
      `transform: scale(0);` +
      `-webkit-transition: opacity ease,-webkit-transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,-webkit-transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,transform cubic-bezier(.1, 1, 0.5, 1);` +
      `pointer-events: none;`
    )});
    this.stylesData.push(host, rippleContainer);
  }

}
