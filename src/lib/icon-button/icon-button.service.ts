import { LyTheme2 } from '@alyle/ui';
import { Injectable } from '@angular/core';

const STYLE_PRIORITY = -2;

const styles = ({
  root: {
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    userSelect: 'none',
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    padding: 0,
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
    color: 'currentColor',
    display: 'inline-flex',
    position: 'relative',
    textDecoration: 'none',
    borderRadius: '50%',
  },
  content: {
    display: 'flex',
    justifyContent: 'inherit',
    alignItems: 'inherit',
    width: 'inherit',
    height: 'inherit',
    overflow: 'inherit',
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyIconButtonService {
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  constructor(
    private theme: LyTheme2
  ) { }
}
