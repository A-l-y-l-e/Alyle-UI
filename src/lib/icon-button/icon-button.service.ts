import {
  ProvidedInTheme,
  CoreTheme
} from '@alyle/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LyIconButtonService {
  classes = {
    host: this.coreTheme.setUpStyle('icnBtn', {'': () => {
      const style =
      `-webkit-user-select:none;` +
      `-moz-user-select:none;` +
      `-ms-user-select:none;` +
      `user-select:none;` +
      `-webkit-tap-highlight-color:rgba(0, 0, 0, 0);` +
      `justify-content: center;` +
      `align-items: center;` +
      `background:transparent;` +
      `border:0;` +
      `padding:0;` +
      `overflow:hidden;` +
      `cursor:pointer;` +
      `outline:none;` +
      `box-sizing:border-box;` +
      `color:currentColor;` +
      `display:inline-flex;` +
      `position:relative;` +
      `text-decoration: none;` +
      `border-radius:50%;`;
      return style;
    }}),
    content: this.coreTheme.setUpStyle('icnBtnCntnt', {'': () => (
      `display:flex;` +
      `justify-content:inherit;` +
      `align-items:inherit;` +
      `width:inherit;` +
      `height:inherit;` +
      `overflow:inherit;`
    )})
  };
  constructor(
    private coreTheme: CoreTheme
  ) { }
}
