import {
  LyStyleUtils,
  Dir
} from '@alyle/ui';
import { typography, iconButton, icon, zIndex, animations, RippleVariables } from './variables';
import { Breakpoints } from '@alyle/ui/responsive';

export class MinimaBase extends LyStyleUtils {
  typography = typography;
  iconButton = iconButton;
  icon = icon;
  breakpoints = Breakpoints;
  zIndex = zIndex;
  ripple = RippleVariables;
  animations = animations;
  direction = Dir.ltr;
  button = {
    size: {
      small: {
        fontSize: this.pxToRem(16)
      },
      medium: {
        fontSize: this.pxToRem(16)
      },
      large: {
        fontSize: this.pxToRem(16)
      }
    },
    appearance: {
      icon: {
        minWidth: '0',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      },
      fab: {
        minWidth: '0',
        width: '56px',
        height: '56px',
        padding: 0,
        borderRadius: '50%'
      },
      miniFab: {
        minWidth: '0',
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%'
      }
    }
  };
}
