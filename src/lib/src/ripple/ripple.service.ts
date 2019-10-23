import { Injectable } from '@angular/core';
import { ThemeVariables } from '../theme/theme-config';
import { LY_COMMON_STYLES_DEPRECATED } from '../styles/core-styles';
import { LyTheme2 } from '../theme/theme2.service';

export const styles = (theme: ThemeVariables) => ({
  rippleContainer: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    background: 'currentColor',
    opacity: '.2',
    borderRadius: '50%',
    transform: 'scale(0)',
    transition: `opacity ${theme.ripple.transition.opacity},transform ${theme.ripple.transition.transform
    }`,
    pointerEvents: 'none'
  },
  container: {
    ...LY_COMMON_STYLES_DEPRECATED.fill,
    overflow: 'hidden',
    pointerEvents: 'none',
    borderRadius: 'inherit'
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyRippleService {
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }

}
