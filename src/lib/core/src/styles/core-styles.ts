import { Injectable } from '@angular/core';
import { CoreTheme } from '../theme/core-theme.service';

@Injectable({ providedIn: 'root' })
export class LyCoreStyles {
  classes = {
    /** Position absolute */
    Fill: this.coreTheme.setUpStyle(
      'k-absolute', {
        '': () => (
          `position: absolute;` +
          `top: 0;` +
          `bottom: 0;` +
          `left: 0;` +
          `right: 0;`
        )
      }
    ),
    VisuallyHidden: this.coreTheme.setUpStyle(
      'k-visually-hidden', {
        '': () => (
          `border: 0;` +
          `clip: rect(0 0 0 0);` +
          `height: 1px;` +
          `margin: -1px;` +
          `overflow: hidden;` +
          `padding: 0;` +
          `position: absolute;` +
          `width: 1px;` +
          `outline: 0;` +
          `-webkit-appearance: none;` +
          `-moz-appearance: none;`
        )
      }
    )
  };
  constructor(private coreTheme: CoreTheme) { }
}
