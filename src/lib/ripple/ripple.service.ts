import { Injectable } from '@angular/core';
import { LyTheme2, LY_COMMON_STYLES, ThemeVariables } from '@alyle/ui';

export const styles = (theme: ThemeVariables) => ({
  rippleContainer: {
    position: 'absolute',
    width: '5px',
    height: '5px',
    background: 'currentColor',
    opacity: '.19',
    borderRadius: '100%',
    transform: 'scale(0)',
    transition: `opacity ${theme.ripple.transition.opacity},transform ${theme.ripple.transition.transform
    }`,
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
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }

}
