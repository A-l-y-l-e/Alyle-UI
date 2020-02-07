import { Injectable } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import {
   } from '../parse';

export const LY_COMMON_STYLES = {
  fill: (className: string) => `${className}{position:absolute;top:0;bottom:0;left:0;right:0;}`,
  visuallyHidden: (className: string) => `${className}{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none;}`,
  button: (className: string) => `${className}{-webkit-tap-highlight-color:transparent;background-color:transparent;border:0;-moz-appearance:none;-webkit-appearance:none;margin:0;outline:none;box-sizing:border-box;position:relative;text-decoration-line:none;-webkit-text-decoration-line:none;}${className}::-moz-focus-inner:{border:0;}`
};

export const LY_COMMON_STYLES_DEPRECATED = {
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    outline: 0,
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none'
  },
  button: {
    '-webkit-tap-highlight-color': 'transparent',
    backgroundColor: `transparent`,
    border: 0,
    '-moz-appearance': 'none',
    '-webkit-appearance': 'none',
    margin: 0,
    outline: 'none',
    boxSizing: 'border-box',
    position: 'relative',
    textDecorationLine: 'none',
    '-webkit-text-decoration-line': 'none',
    '&::-moz-focus-inner': {
      border: 0
    }
  }
};

@Injectable({ providedIn: 'root' })
export class LyCoreStyles {
  classes = this.theme.addStyleSheet(LY_COMMON_STYLES_DEPRECATED);
  constructor(private theme: LyTheme2) { }
}
