import { Injectable } from '@angular/core';
import { CoreTheme, LyTheme2 } from '@alyle/ui';

export const styles = ({
  rippleContainer: {
    position: 'absolute',
    width: '5px',
    height: '5px',
    background: 'currentColor',
    opacity: '.19',
    borderRadius: '100%',
    transform: 'scale(0)',
    transition: 'opacity ease,transform cubic-bezier(.1, 1, 0.5, 1)',
    pointerEvents: 'none'
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyRippleService {
  classes = this.theme.addStyleSheet(styles, 'lyRipple');
  constructor(
    private theme: LyTheme2
  ) { }

}
