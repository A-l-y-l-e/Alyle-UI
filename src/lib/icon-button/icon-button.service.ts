import {
  LyTheme,
  ProvidedInTheme
} from '@alyle/ui';
import { Injectable } from '@angular/core';

@Injectable(ProvidedInTheme)
export class LyIconButtonService {
  classes = {
    host: this.theme.setStyle('icnBtn', () => {
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
      `width:${this.theme.palette.iconButton.size};` +
      `height:${this.theme.palette.iconButton.size};` +
      `cursor:pointer;` +
      `outline:none;` +
      `box-sizing:border-box;` +
      `color:currentColor;` +
      `display:inline-flex;` +
      `position:relative;` +
      `border-radius:50%;`;
      return style;
    }),
    content: this.theme.setRootStyle('icnBtnCntnt', () => (
      `display:flex;` +
      `justify-content:inherit;` +
      `align-items:inherit;` +
      `width:inherit;` +
      `height:inherit;` +
      `overflow:inherit;` +
      `z-index:0;`
    ))
  };
  constructor(
    private theme: LyTheme
  ) { }
}
