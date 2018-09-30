import { Injectable } from '@angular/core';
import { LyTheme2, LY_COMMON_STYLES } from '@alyle/ui';

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
  },
  container: {
    ...LY_COMMON_STYLES.fill,
    overflow: 'hidden',
    pointerEvents: 'none',
    borderRadius: 'inherit'
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
