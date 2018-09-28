import { Injectable } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';

export const LY_COMMON_STYLES = {
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
  }
};

@Injectable({ providedIn: 'root' })
export class LyCoreStyles {
  classes = this.theme.addStyleSheet(LY_COMMON_STYLES, 'lyCommonStyles');
  constructor(private theme: LyTheme2) { }
}
