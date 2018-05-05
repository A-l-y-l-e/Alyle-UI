import {
  LyTheme,
  ProvidedInTheme,
  StyleData
} from '@alyle/ui';
import { Injectable } from '@angular/core';

@Injectable(ProvidedInTheme)
export class LyIconButtonService {
  classes: { [k: string]: string } = {};
  constructor(
    private theme: LyTheme
  ) {
    this.classes.host = theme.createStyle('icnBtn', () => {
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
      `width: ${theme.palette.iconButton.size};` +
      `height: ${theme.palette.iconButton.size};` +
      `cursor:pointer;` +
      `outline:none;` +
      `box-sizing:border-box;` +
      `color:currentColor;` +
      `border-radius:100%;`;
      return style;
    }, undefined, true).id;
    this.classes.content = theme.createStyle('icnBtnCntnt', () => {
      return `display: flex;` +
      `justify-content: inherit;` +
      `align-items: inherit;`;
    }, undefined, true).id;
  }
}
